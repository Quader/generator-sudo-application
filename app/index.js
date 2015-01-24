'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var execSync = require("exec-sync");
var fs = require('fs');

module.exports = yeoman.generators.Base.extend({
  props: {},

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    this.argument('name', {
      desc: 'the projectname',
      type: String,
      required: false
    });
    this.argument('desc', {
      desc: 'short description of the project',
      type: String,
      required: false
    });
    this.argument('author', {
      desc: 'the projects initial author',
      type: String,
      required: false
    });

    this.application_name = this.name;
    this.application_desc = this.desc;
  },

  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Team sudo\'s ' + chalk.red('application maker')
    ));

    var prompts = [];

    if(this.application_name === undefined){
        prompts.push({
        type    : 'input',
        name    : 'application_name',
        message : 'What\'s your application name?',
        store   : true
      });
    }

    if(this.application_desc === undefined){
        prompts.push({
          type    : 'input',
          name    : 'application_desc',
          message : 'What\'s the description for your application?',
          store   : true
        });
    }

    if(this.author === undefined){
        prompts.push({
          type    : 'input',
          name    : 'author',
          message : 'What\'s your Name?',
          store   : true
        });
    }
    var self = this;

    // {
    //   type    : 'list',
    //   name    : 'repository_type',
    //   message : 'What version management do you use?',
    //   choices : [
    //     'git',
    //     'mercurial'
    //   ],
    //   store   : true
    // },
    prompts.push(
      {
        type    : 'confirm',
        name    : 'use_emil',
        message : 'Do you want to use EMIL (set of UI Elements)?',
        store   : true
      }
    );

    prompts.push(
      {
        type    : 'confirm',
        name    : 'use_udo',
        message : 'Do you want to use UDO (Javascript Framework)?',
        store   : true
      }
    );

    this.prompt(prompts, function (props) {
      self.application_name = self.application_name || props['application_name'];
      self.application_desc = self.application_desc || props['application_desc'];
      self.author = self.author || props['author'];
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copy(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc')
      );
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copy(
        this.templatePath('flow'),
        this.destinationPath('.flow')
      );
      this.fs.copy(
        this.templatePath('_setup.sh'),
        this.destinationPath('setup.sh')
      );
      this.fs.copy(
        this.templatePath('_setup.bat'),
        this.destinationPath('setup.bat')
      );
      this.fs.copy(
        this.templatePath('_Gruntfile.js'),
        this.destinationPath('Gruntfile.js')
      );

      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          "application_name": this.application_name,
          "author": this.author,
          "application_desc": this.application_desc
        }
      );

      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        {
          "application_name": this.application_name,
          "author": this.author,
          "application_desc": this.application_desc
        }
      );

      this.fs.copyTpl(
        this.templatePath('LICENSE-MIT'),
        this.destinationPath('LICENSE'),
        {
          "author": this.props.author,
          "year":   new Date().getUTCFullYear()
        }
      );

      this.fs.copy(
        this.templatePath('README.md'),
        this.destinationPath('README')
      );

      this.directory(
        this.templatePath('structure'),
        this.destinationPath('./')
      );

      var ustring = require("underscore.string");

      this.mkdir(this.destinationPath('src/') + ustring.slugify(this.props.application_name));
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },

  _shell: function (command, args) {
    try {
      var ret = execSync(command + ' ' +  args.join(' '));
      console.log(ret);
      return ret;
    }
    catch (e) {
      console.warn(e);
      return e;
    }
  },

  _setupRepository: function (next) {
    var submodules = {
      'emil': 'git@github.com:webvariants/emil.git',
      'udo' : 'git@github.com:wirsich/udo.git'
    };

    // init repo if not exists
    if(!fs.existsSync(this.destinationPath('.git/'))) {
      this.log(chalk.green('setup repository'));
      this._shell('git', ['init']);
    }
    // run git submodule commands
    if (this.props.use_udo) {
      this.log(chalk.green('adding udo as submodule'));
      this._shell('git', ['submodule', 'add', submodules['udo'], 'src/udo', '-f']);
    }
    if (this.props.use_emil) {
      this.log(chalk.green('adding emil as submodule'));
      this._shell('git', ['submodule', 'add', submodules['emil'], 'src/emil', '-f']);
    }

    next();
  },

  install: function () {
    var self = this;
    this._setupRepository(function () {
      self.installDependencies({
        skipInstall: self.options['skip-install']
      });

      self.log(chalk.green('processing setup of all components, please wait (this may take a while)'));
      self._shell('sh', ['setup.sh']);
    });
  }
});
