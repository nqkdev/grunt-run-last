/*
 * grunt-run-last
 * https://github.com/khanh/grunt-run-last
 *
 * Copyright (c) 2016 qknguyendev
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    run_last: {
      server: {
        file: 'test/app.js'
      },
      server2: {
        file: 'test/app1.js'
      },
    },
    watch: {
      options: {
        spawn: false,
      },
      server: {
        files: ['test/app.js'],
        tasks: ['run_last:server']
      },
      test: {
        files: ['test/app1.js'],
        tasks: ['run_last:server2']
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'run_last', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('w', ['run_last', 'watch']);

};
