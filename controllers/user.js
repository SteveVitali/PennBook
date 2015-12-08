var User = require('../db').User;

var onErr = function(err, res, redirect) {
  err && console.log(err);
  res.redirect(redirect || '/');
};

exports.login = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password) {
    return onErr('Missing email or password', res);
  }

  User.get(email, function(err, user) {
    if (err) return onErr(err, res);
    console.log('Found user', user, 'with email', email);
    // Now validate password hash
  });
};

exports.signup = function(req, res) {

};
