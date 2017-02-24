/*
 * grunt-run-last
 * https://github.com/nqkdev/grunt-run-last
 *
 * Copyright (c) 2016 qknguyendev
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  var children = [];
  var fs = require('fs');
  var util = require('util');

  var getCP = function (filename) {
    return children.find(function (c) {
      return c.name == filename;
    });
  }

  // Kills child process with SIGKILL
  grunt.event.on('run_last.kill', function (child) {
    grunt.log.warn(util.format('kill process %s', child.name));
    child.cp.kill('SIGKILL');
  })

  // Start task
  grunt.event.on('run_last.start', function (filename, env, cmd) {
    var child = getCP(filename);
    if (child == null) {
      child = { name: filename, running: false, pid: null };
      children.push(child);
    } else if (child.running) { // Restart task by killing with SIGKILL
      return grunt.event.emit('run_last.kill', child);
    }

    // Spawns child process
    var cp = grunt.util.spawn({
      cmd: cmd,
      args: [filename],
      opts: {
        env: env
      }
    }, function () {});

    // Debug pid info
    grunt.log.warn(util.format('Spawned from: %s\nPID: %s', process.pid, cp.pid));

    child.cp = cp; // Saves spawned process

    cp.on('exit', function (code, signal) {
      getCP(filename).running = false;
      if (signal != null) {
        grunt.log.warn(util.format('application exited with signal %s', signal));
      } else {
        grunt.log.warn(util.format('application exited with code %s', code));
      }
      if (signal === 'SIGKILL') { // Restart cp
        grunt.event.emit('run_last.start', filename, env, cmd);
      }
    });
    cp.stderr.on('data', function (buffer) {
      if (buffer.toString().trim().length) {
        grunt.log.write(('\r[' + child.name + '] > ').red + buffer.toString());
      }
    });
    cp.stdout.on('data', function (buffer) {
      grunt.log.write(('\r[' + child.name + '] > ').cyan + buffer.toString());
    });
    child.running = true;
    grunt.log.write('\n');

    // Continue to next task
    setTimeout(global.gruntTaskDone, 250);
  });


  grunt.registerMultiTask('run_last', 'Always run your latest commands', function () {
    var filename = this.data.file;
    var env = process.env || {};
    var cmd = this.data.cmd || process.argv[0]; // Ex: coffee, mocha
    if (!grunt.file.exists(filename)) {
      grunt.fail.warn(util.format('application file "%s" not found!', filename));
      return false;
    }
    global.gruntTaskDone = this.async();
    grunt.event.emit('run_last.start', filename, env, cmd);
  });

  process.on('exit', function () {
    // Exit all children processes here!
    children.every(function (c) {
      if (c.running) c.cp.kill('SIGINT');
    })
  });
};
