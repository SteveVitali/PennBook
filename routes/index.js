var express = require('express');
var router = express.Router();

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
    var user = req.session.user || {};
    res.render('index', user);
  });

  app.post('/login', function(req, res) {
    // Authenticate
    // set req.session = user if success
    // redirect to '/' in either case
  });

  app.post('/signup', function(req, res) {
    // Create user
    // set req.session = user if success
    // redirect to '/'
  });

  app.get('/request-friend/:email', loggedIn, function(req, res) {
    //
    // ...
    //
  });

  app.get('/confirm-friend/:email', loggedIn, function(req, res) {
    //
    // ...
    //
  });

  // JSON endpoints for fetching data
  app.get('/api/user/:id', function(req, res) {
    // Fetch the user data and return it as JSON,
    // excluding all fields the user is not authorized to see
  });
};
