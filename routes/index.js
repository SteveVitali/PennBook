var express = require('express');
var router = express.Router();

var api = require('../controllers/api');
var user = require('../controllers/user');
var friend = require('../controllers/friend');

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

  app.get('/request-friend/:email', loggedIn, friend.request);
  app.get('/confirm-friend/:email', loggedIn, friend.confirmRequest);
  app.get('/deny-friend/:email', loggedIn, friend.denyRequest);

  // JSON endpoints
  app.get('/api/users/:id', loggedIn, api.User.findById);
  app.put('/api/users/:id', loggedIn, api.User.update);

  app.post('/api/statuses', loggedIn, api.Status.post);
  // ...
};
