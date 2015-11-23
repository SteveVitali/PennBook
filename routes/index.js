var express = require('express');
var router = express.Router();

var api = require('../controllers/api');
var user = require('../controllers/user');
var friend = require('./controllers/friend');

// Middleware that redirects a route to '/'
// if the user is not logged in.
var loggedIn = function(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/');
};

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('index', req.session.user || {});
  });

  app.post('/login', user.login);
  app.post('/signup', user.signup);

  app.get('/request-friend/:email', loggedIn, friend.request);
  app.get('/confirm-friend/:email', loggedIn, friend.confirmRequest);
  app.get('/deny-friend/:email', loggedIn, friend.denyRequest);

  // JSON endpoints
  app.get('/api/user/:email', api.User.get);
  // ...
};
