# grunt-run-last

> Run multiple servers with support for automatically restarting on file changes.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-run-last --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-run-last');
```

## The "run_last" task

### Overview
In your project's Gruntfile, add a section named `run_last` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  run_last: {
    server: {
      file: 'app.js',
      env: { NODE_ENV: 'production'}
    },
    nightmare: {
      file: 'nightmare.js',
    },
  },
});
```

### Usage Examples
####  Combine with grunt-watch
In this example, servers reload automatically on file changes.

```js
grunt.initConfig({
    run_last: {
      server: {
        file: 'app.js',
      },
      nightmare: {
        file: 'nightmare.js'
      }
    },

    watch: {
      options: {spawn: false},
      server: {
        files: ['*.js'],
        tasks: ['run_last:server']
      },
      nightmare: {
        files: ['nightmare.js'],
        tasks: ['run_last:nightmare']
      }
    }
});
```

### Test

Run `grunt w` to start the servers. Then modify server source file(s) and save.