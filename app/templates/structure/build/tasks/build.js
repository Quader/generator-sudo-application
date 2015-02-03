'use strict';

module.exports = function(grunt) {

  grunt.config.merge({

    // cleanup bin directory
    clean: {
      build: [
        '<%= pkg.project.directories.bin %>'
      ]
    },

    // build subcomponents
    sudo_subcomponents: {
      build: {
        options: {
          cmd: 'grunt',
          args: ['build']
          // default option for components is pkg.project.components
        }
      }
    },

    sudo_components: {
      build: {
        options: {
          namespace: 'client',
          less: {
            // reference import!, you have to include this file to the client anyway
            imports: ['<%= config.files.client_css %>']
          },
          js: {
            beautify: false,
            warnings: true,
            mangle: false
          }
        },
        files: [{
          expand: true,
          cwd: '<%= pkg.project.directories.src %>client/components/',
          src: ['**/*'],
          dest: '<%= pkg.project.directories.bin %>components/'
        }],
      }
    },

    // compile root template
    jade: {
      client: {
        files: {
          '<%= pkg.project.directories.bin %>index.html':
            '<%= pkg.project.directories.src %>client/client.jade'
        }
      }
    },

    // copy/uglify js files + uglify templates output
    uglify: {
      // @TODO create a static map of files to include in its logical order for loading
      vendor: {
        options: {
          beautify: true,
          warnings: true,
          mangle: false,
          compress: false
        },
        src: '<%= config.files.vendor %>',
        dest: '<%= pkg.project.directories.bin %>vendor.js'
      },
      client: {
        options: {
          beautify: true,
          warnings: true,
          mangle: false,
          compress: false
        },
        src: '<%= config.files.client %>',
        dest: '<%= pkg.project.directories.bin %>client.js'
      }
    },

    // compile less
    less: {
      client: {
        files: {
          '<%= pkg.project.directories.bin %>client.css' : [
            '<%= config.files.client_css %>'
          ]
        }
      }
    },
  });

  grunt.registerTask('build', 'Builds files from source.', [
    'clean:build',
    'sudo_subcomponents:build',
    'sudo_components:build',
    'uglify:vendor',
    'uglify:client',
    'less:client',
    'jade:client'
  ]);
};
