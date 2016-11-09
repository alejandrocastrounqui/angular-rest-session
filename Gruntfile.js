'use strict';

var LIVERELOAD_PORT = 35730;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});

var mountFolder = function(connect, dir){
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  
  var project = {
    src:  'client',
    dist: 'dist',
    tmp:  'tmp'
  };
  
  require('load-grunt-tasks')(grunt);
  
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    project: project,
    
    clean: {
      dist: {
        files: [{
          dot: true,
          src: ['<%= project.dist %>/**/*', '!<%= project.dist %>/bower_components/**']
        }]
      },
      tmp: {
        files: [{
          dot: true,
          src: ['<%= project.tmp %>/**/*']
        }]
      }
    },

    copy: {
      favicon: {
        files: [{
          expand: true,
          cwd: '<%= project.src %>',
          src: 'favicon.png',
          dest: '<%= project.dist %>'
        }]
      },
      assets: {
        files: [{
            expand: true,
            cwd: '<%= project.src %>/asset',
            src: '**/*.{jpg,png}',
            dest: '<%= project.dist %>/asset'
        }]
      },
      styles: {
        files: [{
            expand: true,
            cwd: '<%= project.src %>/css',
            src: '**/*.css',
            dest: '<%= project.dist %>/css'
        }]
      }
    },

    connect: {
      options: {
        port: 9001,
        hostname: "0.0.0.0"
        //bases: '.',
        //keepalive: true
      },
      livereload:{
        options:{
          middleware: function(connect){
             return [lrSnippet, mountFolder(connect, project.dist)];
          }
        }
      }
    },
    
    open:{
      server:{
        url: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>/'
      }
    },

    watch: {
      templates: {
        files: ['<%= project.src %>/**/*.{htm,html}'],
        tasks: ['preprocess:markup']
      },
      script: {
        files: ['<%= project.src %>/**/*.js'],
        tasks: ['preprocess:script']
      },
      styles: {
        files: ['<%= project.src %>/**/*.css'],
        tasks: ['copy:styles']
      },
      livereload:{
        options:{
          livereload: LIVERELOAD_PORT
        },
        files:['<%= project.dist %>/**/*']
      }
    },
    preprocess: {
      options: {
        inline: true,
        context: {
          PRODUCTION: 'PRODUCTION',
          STAGGING:   'STAGGING',
          DEVELOP:    'DEVELOP',
          ENV:        'DEVELOP'
        }
      },
      markup: {
        files: [{
          expand: true,
          cwd: '<%= project.src %>',
          src: '**/*.{htm,html}',
          dest: '<%= project.dist %>',
          ext: '.html'
        }]
      },
      script: {
        files: [{
          expand: true,
          cwd: '<%= project.src %>',
          src: '**/*.js',
          dest: '<%= project.dist %>',
          ext: '.js'
        }]
      }
    },
    concurrent: {
      server: {
        tasks: ['connect:livereload', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  grunt.registerTask('context', function(){
    var contextId = 'preprocess.options.context';
    var context = grunt.config(contextId);
    var ENV = '';
    switch(grunt.option('env')){
      case 'uat':
        ENV = context.STAGGING;
        break;
      case 'prod':
        ENV = context.PRODUCTION;
        break;
      default:
        ENV = context.DEVELOP;
    }
    grunt.log.write('Configuring ENV=' + ENV);
    grunt.config(contextId+'.ENV', ENV);
  });

  grunt.registerTask('default', [
    'clean:dist',
    'clean:tmp',
    'copy:favicon',
    'copy:styles',
    'context', 
    'preprocess:script', 
    'preprocess:markup', 
    'connect:livereload',
    'open',
    'watch'
  ]);
};
