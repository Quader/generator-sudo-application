'use strict';

client.View('application/mainview', 'application/maintemplate', {

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
    console.log(this.namespace()+' didAppear');
    this._parent();
  }
});
