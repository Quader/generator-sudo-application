'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var execSync = require("exec-sync");
var fs = require('fs');
var ustring = require("underscore.string");

module.exports = yeoman.generators.Base.extend({
  props: {},

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('application_name', {
      desc: 'the projectname',
      type: String,
      required: false
    });
    this.argument('application_desc', {
      desc: 'short description of the project',
      type: String,
      required: false
    });
    this.argument('author', {
      desc: 'the projects initial author',
      type: String,
      required: false
    });
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

    // prompts.push(
    //   {
    //     type    : 'confirm',
    //     name    : 'use_emil',
    //     message : 'Do you want to use EMIL (set of UI Elements)?',
    //     store   : true
    //   }
    // );

    // prompts.push(
    //   {
    //     type    : 'confirm',
    //     name    : 'use_udo',
    //     message : 'Do you want to use UDO (Javascript Framework)?',
    //     store   : true
    //   }
    // );

    var self = this;
    this.prompt(prompts, function (props) {
      self.props = props;

      //@TODO
      self.props.use_udo  = true;
      self.props.use_emil = true;

      self.props.application_name  = self.application_name || props.application_name;
      self.props.application_desc  = self.application_desc || props.application_desc;
      self.props.author            = self.author || props.author;
      self.props._application_name = ustring.slugify(self.props.application_name)

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

      var components = [];

      if (this.props.use_udo) {
        components.push('"udo": "src/udo"');
      }

      if (this.props.use_emil) {
        components.push('"emil": "src/emil"');
      }

      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          "application_name": this.props._application_name,
          "author": this.props.author,
          "application_desc": this.props.application_desc,
          "components": components.join(",\n")
        }
      );

      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        {
          "application_name": this.props._application_name,
          "author": this.props.author,
          "application_desc": this.props.application_desc
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

      this.mkdir(this.destinationPath('src/') + this.props._application_name);

      if (this.props.use_emil) {
        this._emil.writing.call(this);
      }

      // template tasks (after created the structure)
      var data = {
        _application_name: this.props._application_name,
        application_name: this.props.application_name,
        application_desc: this.props.application_desc,
        author: this.props.author,
      };

      var sources = [
        'src/client/client.js',
        'src/client/client.jade',
        'src/client/client.less',
      ];

      var i = 0, l = sources.length;
      for (; i < l; ++i) {
        this.template(this.destinationPath(sources[i]), sources[i], data);
      }
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

  _udo: {
    prompt: function () {
    },

    writing: function () {
    },

    repository: function () {
      this._shell('git', ['submodule', 'add',
        '-b experimental', // branch
        '-f',
        '--name udo',
        'git@github.com:wirsich/udo.git', // url
        'src/udo' // path
      ]);
    }
  },

  _emil: {
    prompt: function () {
    },

    writing: function () {
      // create emil theme
      this.directory(
        this.templatePath('_emil-theme'),
        this.destinationPath('src/' + this.props._application_name)
      );
    },

    repository: function () {
      this._shell('git', ['submodule', 'add',
        '-b stable', // branch
        '-f',
        '--name emil',
        'git@github.com:webvariants/emil.git', // url
        'src/emil' // path
      ]);
    }
  },

  _repository: {
    setup: function (next) {
      // init repo if not exists
      if(!fs.existsSync(this.destinationPath('.git/'))) {
        this.log(chalk.blue('> setup repository'));
        this._shell('git', ['init']);
      }
      // run git submodule commands
      if (this.props.use_udo) {
        this.log(chalk.blue('> adding udo as submodule'));
        this._udo.repository.call(this);
      }
      if (this.props.use_emil) {
        this.log(chalk.blue('> adding emil as submodule'));
        this._emil.repository.call(this);
      }

      next();
    },
  },

  install: function () {
    var self = this;
    var done = this.async();

    if (self.options['skip-install']) {
      done();
      return false;
    }

    this._repository.setup.call(this, function () {
      self.installDependencies({
        skipInstall: self.options['skip-install']
      });

      self.log(chalk.blue('processing setup of all components, please wait (this may take a while)'));
      if (!self.options['skip-install']) {
        self._shell('sh', ['setup.sh']);
      }
      done();
    });
  },

  _shell: function (command, args) {
    try {
      var ret = execSync(command + ' ' +  args.join(' '));
      this.log(chalk.green(ret));
      return ret;
    }
    catch (e) {
      this.log(chalk.red(e));
      return e;
    }
  }
});
