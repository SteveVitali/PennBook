var _ = require('lodash');
var passwordHash = require('password-hash');
var User = require('../db').User;

var onErr = function(err, res) {
  err && console.log(err);
  // res.redirect(redirect || '/');
};

exports.login = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password) {
    return onErr('Missing email or password', res);
  }

  User.findByEmail(email, function(err, user) {
    if (err) return onErr(err, res);
    console.log('Found user', user, 'with email', email);
    // Now validate password hash
  });
};

exports.signup = function(req, res) {
  var newUser = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthdate: req.body.birthdate,
    gender: req.body.gender,
    createdAt: new Date(),
    isLoggedIn: true,
    passwordHash: passwordHash.generate(req.body.password)
  };

  var valid = _.reduce(_.keys(newUser), function(memo, key) {
    return memo && !!newUser[key];
  }, !!req.body.password);

  if (!valid) {
    return onErr('Missing user fields', res);
  }

  User.findByEmail(newUser.email, function(err, user) {
    if (err) return onErr(err, res);
    if (user) return onErr('User already exists', res);

    User.create(newUser, function(err, user) {
      if (err) return onErr(err, res);
      console.log('Created new user', user);
    });
  });
};
