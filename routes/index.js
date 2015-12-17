var express = require('express');
var router = express.Router();

var api = require('../controllers/api');
var user = require('../controllers/user');
var vis = require('../controllers/visualize');

var isLoggedIn = function(req) {
  return !!(req.session && req.session.user);
};

// Middleware that redirects a route to '/'
// if the user is not logged in.
var loggedIn = function(req, res, next) {
  if (isLoggedIn(req)) {
    return next();
  }
  res.redirect('/');
};

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('index', {
      user: req.session.user || null
    });
  });

  app.post('/login', user.login);
  app.post('/logout', user.logout);
  app.post('/signup', user.signup);
  app.get('/users/regex-search/:search', user.regexSearch);

  // JSON endpoints
  app.get('/api/users/:id', loggedIn, api.User.findById);
  app.put('/api/users/:id', loggedIn, api.User.update);
  app.get('/api/users/:id/friendships', loggedIn, api.User.getFriendships);
  app.get('/api/users/:id/news-feed', loggedIn, api.User.getNewsFeed);
  app.get('/api/users/:id/profile-feed', loggedIn, api.User.getProfileFeed);

  app.post('/api/friendships', loggedIn, api.Friendship.create);

  app.get('/api/statuses/:id', loggedIn, api.Status.findById);
  app.post('/api/statuses', loggedIn, api.Status.post);

  app.post('/api/comments', loggedIn, api.Comment.post);

  // Here '/item' refers to any type of data referred to by an Action
  app.get('/api/item/:id/comments', loggedIn, api.Comment.getCommentsOnItem);

	// Visualizer
	app.get('/vis', loggedIn, vis.initPage);
	app.get('/friendvisualization', loggedIn, vis.initUser);
	app.get('/getFriends/:user', loggedIn, vis.fromUser);
};
