import LoginView from 'login.jsx';
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Backbone from 'backbone';
// import ReactBootstrap from 'react-bootstrap';

var App = Backbone.View.extend({
  el: '#app',

  initialize(user) {
    this.user = user;
    this.$el.append('<div id="react-app"></div>');
    this.render();
  },

  render() {
    var rootParentNode = document.getElementById('react-app');
    var rootNode = React.createElement(
      LoginView,
      {},
      rootParentNode
    );
    ReactDOM.render(rootNode, rootParentNode);
  }
});

$(function() {
  var currentUser = JSON.parse($('#user').val());
  new App(currentUser);
  Backbone.history.start({ root: '/' });
});
