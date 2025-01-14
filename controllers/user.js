var _ = require('lodash');
var passwordHash = require('password-hash');
var User = require('../db').User;

var onErr = function(err, res) {
  err && console.log(err);
  res.status(500).send(err);
};

exports.login = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password) {
    return onErr('Missing email or password', res);
  }

  User.findByEmail(email, function(err, user) {
    if (err) return onErr(err, res);
    if (!user) return onErr('Invalid email', res);
    if (!passwordHash.verify(password, user.passwordHash)) {
      return onErr('Invalid password', res);
    }
    user.isLoggedIn = true;
    User.update(user, {}, function(err, user) {
      if (err) return onErr(err, res);
      req.session.user = user;
      res.send(_.omit(user, 'passwordHash'));
    });
  });
};

exports.logout = function(req, res) {
  req.session.user.isLoggedIn = false;
  User.update(req.session.user, {}, function(err, user) {
    if (err) return onErr(err, res);
    req.session.destroy();
    res.redirect('/');
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
    passwordHash: passwordHash.generate(req.body.password),
    fullName: [req.body.firstName, req.body.lastName].join(' ')
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
      req.session.user = user;
      res.send(_.omit(user, 'passwordHash'));
    });
  });
};

exports.regexSearch = function(req, res) {
  var search = req.params.search;
  User.regexSearchByName(search, function(err, users) {
    if (err) return onErr(err, res);
    var processedResults = _.map(users, function(user) {
      return {
        value: user.fullName,
        label: user.fullName,
        data: _.omit(user, 'passwordHash')
      };
    });
    res.send(processedResults);
  });
};
