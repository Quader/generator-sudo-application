'use strict';

module.exports = function(grunt) {

  grunt.config.merge({
    config: {
      files: {
        vendor: [
          '<%= pkg.project.directories.vendor %>jquery/dist/jquery.js',
          // '<%= pkg.project.directories.vendor %>lodash/dist/lodash.js',

          // @TODO EMIL and UDO specific
          '<%= pkg.project.directories.vendor %>jade/runtime.js',

          // @TODO udo specific
          '<%= pkg.project.directories.src %>udo/bin/udo.js',
        ],
        client: [
          '<%= pkg.project.directories.src %>client/client.js',
        ],
        client_css: [
          '<%= pkg.project.directories.src %>client/client.less',
        ]
      }
    }
  });
};
