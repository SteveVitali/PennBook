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
    this.rootComponent = LoginView;
    this.render();
  },

  newsFeed() {
    this.rootComponent = NewsFeedView;
    this.render();
  },

  viewProfile(user) {
    this.rootComponent = UserProfileView;
    this.rootProps = {
      profileOwner: user,
      lazyLoadWithUserId: false
    };
    this.render();
  },

  viewProfileById(id) {
    // Same as viewProfile, but asynchronously
    // load the user and show a loading spinner
    // in the UserProfileView while waiting
  },

  render() {
    // Render the React application
    this.appStore.resetData(
      _.extend(this.rootProps, {
        app: this,
        user: this.user
      }),
      (this.user ? this.rootComponent : LoginView),
      this.el
    );
  }
});

var Router = Backbone.Router.extend({
  routes: {
    '': 'home',
    'profile': 'viewOwnProfile',
    'profile/:id': 'viewProfileById',
    'profile/edit': 'editProfile'
  },

  initialize(app) {
    this.app = app;
  },

  home() {
    this.app.user ? this.app.newsFeed() : this.app.login();
  },

  viewProfileById(id) {
    // Need to figure out how to optionally lazy load.
  },

  viewOwnProfile() {
    this.app.viewProfile(this.app.user);
  }
});

$(function() {
  var currentUser = JSON.parse($('#user').val());
  var app = new App(currentUser);
  var router = new Router(app);
  app.router = app;

  Backbone.history.start({ root: '/' });
});
