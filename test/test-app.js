'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('sudo-application:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({ 'skip-install': true })
      .withPrompt({
        application_name: 'npm_test',
        application_desc: 'npm test',
        author: 'npm Tester <npm@test>',
        use_emil: false,
        use_udo: false,
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'bower.json',
      'package.json',
      'LICENSE',
      'README',
      'Gruntfile.js',
      'setup.sh',
      'setup.bat',
      '.editorconfig',
      '.jshintrc',

      'bin/empty',
      'src/empty',
      'test/empty',

      'build/config/empty',

      'build/tasks/build.js',
      'build/tasks/deploy.js',
      'build/tasks/development.js',
      'build/tasks/documentation.js',
      'build/tasks/lint.js',
      'build/tasks/package.js',
      'build/tasks/setup.js',
      'build/tasks/test.js',

      'src/client/client.jade',
      'src/client/components/empty',
    ]);
  });
});
