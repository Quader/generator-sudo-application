'use strict';

client.View('application/main', 'application/maintemplate', {

  configure: function () {
    this._parent();
  },

  didload: function (app) {
    this.update();
    this._parent(app);
  },

  willAppear: function () {
    console.log(this.namespace()+' willAppear');
    this._parent();
  },

  didAppear: function () {
    console.log(this.namespace()+' didappear');
    this._parent();
  }
});
