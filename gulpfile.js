'use strict';

var gulp        = require('gulp');
var cssMin      = require('gulp-cssnano');
var htmlMin     = require('gulp-htmlmin');
var rename      = require('gulp-rename');
var jspm        = require('gulp-jspm');
var jshint      = require('gulp-jshint');
var runSeq      = require('run-sequence');
var stylish     = require('jshint-stylish');
var jscs        = require('gulp-jscs');
var sourcemaps  = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var mocha       = require('gulp-mocha');

gulp.task('css', function () {
  return gulp.src(['client/css/layout.css'])
    .pipe(cssMin())
    .pipe(rename({ suffix: '.bundle' }))
    .pipe(gulp.dest('build/css/'));
});

gulp.task('html', function () {
  return gulp.src(['client/index.html'])
    .pipe(htmlMin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build/'));
});

gulp.task('js', function () {
  return gulp.src(['client/js/main.js'])
    .pipe(sourcemaps.init())
    .pipe(jspm({ selfExecutingBundle: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/js/'));
});

gulp.task('server', function () {
  browserSync.init({
    port: 8080,
    notify: false,
    open: false,
    server: {
      baseDir: './build',
      middleware: function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      },
    },
  });
});

gulp.task('build', function (callback) {
  return runSeq(['css', 'html', 'js'], callback);
});

gulp.task('watch', function () {
  gulp.watch('client/css/**', ['css']);
  gulp.watch('client/js/**', ['js']);
  gulp.watch('client/index.html', ['html']);
});

gulp.task('dev', function () {
  runSeq('build', 'server', 'watch');
});

gulp.task('jshint', function () {
  return gulp.src(['./client/js/*.js', './test/*.js', './gulpfile.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function () {
  return gulp.src(['./client/js/*.js', './test/*.js', './gulpfile.js'])
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

gulp.task('lint', function (callback) {
  return runSeq('jshint', 'jscs', callback);
});

gulp.task('test', function () {
  return gulp.src(['./test/*.js'])
    .pipe(mocha());
});

gulp.task('default', function () {
  runSeq('lint', 'test', 'build');
});
