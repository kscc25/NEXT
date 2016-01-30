module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        files: {
          'build/app.compiled.js': ['app.js']
        },
        options: {
          browserifyOptions: {
            debug: true
          }
        }
      }
    },
    watch: {
      scripts: {
        files: ['app.js'],
        tasks: ['clean', 'browserify'],
        options: {
          spawn: false,
        }
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });
          },
          env: {
            PORT: '8080'
          },
          cwd: __dirname,
          ignore: ['node_modules/**', 'build', 'public', 'Gruntfile.js', 'app.js'],
          ext: 'js,coffee',
          watch: ['.'],
          delay: 1000,
          legacyWatch: true
        }
      }
    },
    concurrent: {
      dev: {
        tasks: ['nodemon:dev', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    clean: {
    build: ['build']
  },

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  grunt.registerTask('default', ['browserify']);
  grunt.registerTask('dev', ['clean', 'browserify', 'concurrent:dev']);

};
