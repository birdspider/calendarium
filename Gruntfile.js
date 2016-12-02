'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      banner: '/*!\n * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("dd.mm.yyyy") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>, <%= _.map(pkg.contributors, "name").join(", ") %>\n' +
        ' * Licensed under the <%= pkg.license %> license\n */\n\n'
    },

    browserify: {
      options: {
        browserifyOptions: {
          fullPaths: false
        }
        , banner: '<%= meta.banner %>'
      }
      , dist: {
        options: {
          transform: [
            ['uglifyify', {
              global: true
            }]
            , ['browserify-shim', {
              global: true
            }]
          ]
        }
        , src: 'src/js/calendarium.js'
        , dest: 'build/calendarium.min.js'
      }
      , demo: {
        options: {
          transform: [
            ['uglifyify', {
              global: true
            , }]
            , ['browserify-shim', {
              global: true
            }]
          ]
          , watch: true
        }
        , src: 'src/js/calendarium.js'
        , dest: 'demo/app.min.js'
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      }
      , files: [
        'src/js/*.js'
        , 'src/js/services/*.js'
      ]
    },

    copy: {
      demo: {
        files: [{
          expand: true
          , cwd: 'node_modules/jquery/dist'
          , src: 'jquery.min.js'
          , dest: 'demo/'
        }]
      }
    },

    sass: {
      options: {
        precision: 10
        , sourcemap: "inline"
        , trace: true
        , unixNewlines: true
      }
      , demo: {
        files: [{
          src: 'src/style/demo.scss'
          , dest: 'demo/app.min.css'
        }]
      }
      , dist: {
        files: [{
          src: 'src/style/calendarium.scss'
          , dest: 'build/calendarium.min.css'
        }]
      }
    }
    , connect: {
      demo: {
        options: {
          hostname: '0.0.0.0', // hostname: 'localhost',
          port: 8080
          , base: 'demo'
          , keepalive: true, // livereload: true,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks("grunt-sass");

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('build', ['test', 'sass:dist', 'browserify:dist']);
  grunt.registerTask('demo', ['sass:demo', 'copy:demo', 'browserify:demo', 'connect']);
  grunt.registerTask('default', ['test', 'demo']);
};