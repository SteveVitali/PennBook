var _ = require('lodash');
var $ = require('jquery');
var React = require('react');
var async = require('async');
var AppStore = require('react-backbone-app-store');
var Backbone = require('backbone');
var LoginView = require('./login.jsx');
var NewsFeedView = require('./news-feed.jsx');
var UserProfileView = require('./user-profile.jsx');
var models = require('../models');

var App = Backbone.View.extend({
  el: '#app',

  initialize(router) {
    this.router = router;
    this.rootProps = {
      app: this,
      Users: []
    };
    this.appStore = new AppStore();

    // Helper for turning actionType values into collection names
    this.pluralizeModel = (name) => {
      return {
        User: 'Users',
        Friendship: 'Friendships',
        Action: 'Actions',
        Status: 'Statuses'
      }[name];
    };

    var registerModel = (name, endpoint) => {
      this.appStore.registerModel(
        this.pluralizeModel(name),
        models[name].collection,
        endpoint
      );
    };
    registerModel('User', '/api/users');
    registerModel('Friendship', '/api/friendships');
    registerModel('Action', '/api/actions');
    registerModel('Status', '/api/statuses');
  },

  setUser(user, done) {
    if (!user) return done && done();
    var userId = user._id;
    var cachedUser = this.appStore.getModel(userId, 'Users');
    if (!cachedUser) {
      this.initializeLoggedInUserData(userId, done);
    } else {
      this.user = cachedUser;
      done && done();
    }
  },

  initializeLoggedInUserData(userId, done) {
    // Make sure the user is cached in appStore.Users
    this.appStore.fetch([userId], 'Users', () => {
      // Store the user data from the app store
      this.user = this.appStore.getModel(userId, 'Users');

      // Remove the user from the rootProps and add him back
      this.rootProps.Users = _.reject(
        this.rootProps.Users,
        function(u) { return u._id === userId; }
      );
      this.rootProps.Users.push(this.user);

      done && done();
    });
    // The above async stuff will finish, and when the callback
    // is called, presumably the app should be getting rendered.
    //
    // In the mean time, we want to start fetching the multitude
    // of data that the application will need access to later on
    // in the lifecycle of the application.
    async.parallel([
      (done) => { this.initializeFriendsList(userId, done); },
      (done) => { this.initializeNewsFeed(userId, done); }
    ], (err) => {
      err && console.log(err);
      this.rootProps = _.extend(this.rootProps, {
        Actions: this.appStore.getAll('Actions')
      });
      this.render();
    });
  },

  initializeFriendsList(userId, done) {
    $.get('/api/users/' + userId + '/friendships', (friendships) => {
      // Reset the list of friends stored in AppStore model hash
      this.appStore.resetModelHash({
        Friendships: friendships
      });
      // Use a map to quickly extract a list of unique user Id's
      var idsMap = {};
      _.each(friendships, (friendship) => {
        idsMap[friendship.friendId] = true;
        idsMap[friendship.ownerId] = true;
      });
      // Asynchronously fetch and cache all users
      async.each(_.keys(idsMap), (id, next) => {
        // If user already cached, don't re-fetch
        if (this.appStore.getModel(id, 'Users')) {
          return async.nextTick(next);
        }
        // Else, fetch the user data from the JSON API
        this.appStore.fetch([id], 'Users', next);
      },
      (err) => {
        err && console.log(err);
        done();
      });
    });
  },

  initializeNewsFeed(userId, done) {
    $.get('/api/users/' + userId + '/news-feed', (actions) => {
      // Reset Actions in AppStore
      this.appStore.resetModelHash({
        Actions: actions
      });
      done();
    });
  },

  login() {
    this.rootProps.Users = [];
    this.rootComponent = LoginView;
    this.render();
  },

  newsFeed() {
    this.rootComponent = NewsFeedView;
    this.rootProps.Actions = this.appStore.getAll('Actions');
    this.render();
  },

  viewProfile(user, props) {
    this.rootComponent = UserProfileView;
    this.rootProps = _.extend(this.rootProps, props || {});
    this.rootProps = _.extend(this.rootProps, {
      profileOwner: user
    });
    this.render();
  },

  viewProfileById(id) {
    this.viewProfile(null, { profileOwnerId: id });
  },

  render() {
    if (!this.user) {
      this.router.navigate('/');
      this.rootComponent = LoginView;
    }
    this.rootProps = _.extend(this.rootProps, {
      app: this,
      user: this.user,
      Actions: this.appStore.getAll('Actions')
    });
    console.log(this.appStore);
    console.log('actions', this.rootProps.Actions);
    // Render the React application
    this.appStore.resetData(
      this.rootProps,
      this.rootComponent,
      this.el
    );
  }
});

var Router = Backbone.Router.extend({
  routes: {
    '': 'home',
    'profile': 'viewOwnProfile',
    'profile/id/:id': 'viewProfileById',
    'profile/edit': 'editProfile'
  },

  initialize(app) {
    this.app = app;
  },

  home() {
    this.app.newsFeed();
  },

  viewProfileById(id) {
    this.app.viewProfileById(id);
  },

  viewOwnProfile() {
    this.app.viewProfile(this.app.user, { tabKey: 1 });
  },

  editProfile() {
    this.app.viewProfile(this.app.user, { tabKey: 2 });
  }
});

$(function() {
  var currentUser = JSON.parse($('#user').val());
  var app = new App();
  // Wait for user to be loaded into app store
  app.setUser(currentUser, function() {
    var router = new Router(app);
    app.router = router;

    Backbone.history.start({ root: '/' });
  });
});
