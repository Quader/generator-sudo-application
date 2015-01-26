
client = udo.app.Application.extend({
  construct: function (name) {
    this._parent(name);

    // import from sudo components?
    // export
    window.Controller = this.Controller.bind(this);
    window.ViewController = this.ViewController.bind(this);
    window.View = this.View.bind(this);
    window.Template = this.Template.bind(this);
    window.Style = this.Style.bind(this);
    // window.onerror = this._error.bind(this);

    // bind Events
    document.onreadystatechange = this.__readyStateChanged.bind(this);
    document.onpagehide = this.emit.bind(this, 'pagehide');
    document.onpageshow = this.emit.bind(this, 'pageshow');
    document.ononline = this.emit.bind(this, 'online');
    document.onoffline = this.emit.bind(this, 'offline');
    document.onblur = this.emit.bind(this, 'blur');
  },

  __readyStateChanged: function () {
    if (document.readyState == "complete") {
      this.configure();
    }
  },

  // set directory for components
  loadComponent: function (name) {
    return this._parent('components/'+name);
  },

  // load components and set specific options
  configure: function () {
    this._parent();
    this.loadComponents([
      'application',
      // 'load another initial component here'
    ])
    .then(this.didload.bind(this), this._error.bind(this));
  },

  // components loaded, set main controller and update it
  didload: function (payload) {
    try {
      // @FIXME anchor as payload for construct viewcontroller?
      this.mainviewcontroller = this.useViewController('application/mainviewcontroller');
      this.mainview.attach(this);

      this.update();
    } catch (e) {
      console.warn(e);
    }
  },

  //@TODO this.controllers.update for parent class
  update: function () {
    // @FIXME anchor as payload for construct viewcontroller?
    // this.useViewController('master-detail/viewcontroller').state({foo: 'bar'}).anchor('#main2').render();
    // this.viewcontroller('application/main', '#app', 'application/content-detail');
    this.controller.update();
  },

  // shortcuts for register component, used by the grunt-sudo-components
  Controller: function(name, extend, mixin) {
    this.registerController(name, extend, mixin);
  },

  ViewController: function(name, anchor, viewname, extend, mixin) {
    var self = this;
    this.loadView(viewname).then(function (view) {
      self.registerViewController(name, anchor, view, extend, mixin);
    }).catch(this._error.bind(this, {msg: 'Error while resolving View "'+ name +'"'}));
  },

  //@TODO promise for parent requests
  View: function (name, templateName, extend, mixin) {
    var self = this;
    this.loadTemplate(templateName).then(function (template) {
      self.registerView(name, template, extend, mixin);
    }).catch(this._error.bind(this, {msg: 'Error while resolving "'+ templateName +'"'}));
  },

  // no register for Template, only function
  Template: function (name, renderFn) {
    this.registerTemplate(name, renderFn);
  },

  Style: function (name, cssString) {
    this.registerStyle(name, cssString);
  }
});

client = new client('<%= _application_name %>');
