var _ = require('lodash');
var $ = require('jquery');
var React = require('react');
var AppStore = require('react-backbone-app-store');
var Backbone = require('backbone');
var LoginView = require('./login.jsx');
var NewsFeedView = require('./news-feed.jsx');
var UserProfileView = require('./user-profile.jsx');
var models = require('../models');

var App = Backbone.View.extend({
  el: '#app',

  initialize(user, router) {
    this.user = user;
    this.router = router;
    this.rootProps = { app: this };
    this.appStore = new AppStore();

    this.appStore.registerModel(
      'Users',
      models.User.collection,
      '/api/users'
    );
  },

  login() {
    console.log('Render login');
    this.rootComponent = LoginView;
    this.render();
  },

  newsFeed() {
    console.log('Render news feed');
    this.rootComponent = NewsFeedView;
    this.render();
  },

  viewOwnProfile() {
    console.log('Render own profile');
    this.rootComponent = UserProfileView;
    this.rootProps = {
      profileOwner: this.user
    };
    this.render();
  },

  viewProfile(id) {
    console.log('Render other profile');
    this.rootComponent = UserProfileView;
  },

  render() {
    // Render the React application
    this.appStore.resetData(
      _.extend(this.rootProps, {
        app: this,
        user: this.user
      }),
      this.rootComponent,
      this.el
    );
  }
});

var Router = Backbone.Router.extend({
  routes: {
    '': 'home',
    'profile': 'viewOwnProfile',
    'profile/:id': 'viewProfile',
    'profile/edit': 'editProfile'
  },

  initialize(app) {
    this.app = app;
  },

  home() {
    this.app.user ? this.app.newsFeed() : this.app.login();
  },

  viewProfile(id) {
    // Need to figure out how to optionally lazy load.
  },

  viewOwnProfile() {
    this.app.viewOwnProfile();
  }
});

$(function() {
  var currentUser = JSON.parse($('#user').val());
  var app = new App(currentUser);
  var router = new Router(app);
  app.router = app;

  Backbone.history.start({ root: '/' });
});
