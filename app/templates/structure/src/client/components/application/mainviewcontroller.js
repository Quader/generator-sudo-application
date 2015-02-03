'use strict';

client.ViewController('application/mainviewcontroller', '#application', 'application/mainview', {
  didload: function (app) {
    this.update();
    this._parent(app);
  },

  update: function () {
    // this.view.renderAt($('#application'));
    this._parent();
  }
});
