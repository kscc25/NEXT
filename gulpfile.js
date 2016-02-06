'use strict';

var gulp        = require('gulp');
var cssMin      = require('gulp-cssnano');
var htmlMin     = require('gulp-htmlmin');
var rename      = require('gulp-rename');
var jspm        = require('gulp-jspm');
var jshint      = require('gulp-jshint');
var runSeq      = require('run-sequence');
var stylish     = require('jshint-stylish');
var browserSync = require('browser-sync').create();

gulp.task('css', function() {
  gulp.src(['client/css/layout.css'])
    .pipe(cssMin())
    .pipe(rename({suffix: '.bundle'}))
    .pipe(gulp.dest('build/css/'));
});

gulp.task('html', function() {
  gulp.src(['client/index.html'])
    .pipe(htmlMin({collapseWhitespace: true}))
    .pipe(gulp.dest('build/'));
});

gulp.task('js', function() {
  gulp.src(['client/js/main.js'])
    .pipe(jspm({selfExecutingBundle: true}))
    .pipe(gulp.dest('build/js/'));
});

gulp.task('server', function() {
  browserSync.init({
    port: 8080,
    notify: false,
    open: false,
    server: {
      baseDir: "./build",
      middleware: function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }
    }
  });
});

gulp.task('build', function() {
  runSeq(['css', 'html', 'js']);
});

gulp.task('watch', function () {
  gulp.watch('client/css/**', ['css']);
  gulp.watch('client/js/**', ['js']);
  gulp.watch('client/index.html', ['html']);
});

gulp.task('dev', function() {
  runSeq('build', 'server', 'watch');
});

gulp.task('lint', function() {
  return gulp.src('./client/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});
