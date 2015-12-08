var React = require('react');
var AppStore = require('react-backbone-app-store');
var $ = require('jquery');
var Backbone = require('backbone');
var LoginView = require('./login.jsx');
var models = require('../models');

var App = Backbone.View.extend({
  el: '#app',

  initialize(user) {
    this.user = user;
    this.render();
  },

  render() {
    var appStore = new AppStore();

    appStore.registerModel('Users', models.User.collection, '/api/users');

    var rootProps = {
      parent: this
    };
    var rootParentNode = document.getElementById('app');

    var rootNode = (() => {
      if (!this.user) return LoginView;
      return null;
    })();

    // Render the application
    appStore.resetData(rootProps, rootNode, rootParentNode);
  }
});

$(function() {
  var currentUser = JSON.parse($('#user').val());
  new App(currentUser);
  Backbone.history.start({ root: '/' });
});
