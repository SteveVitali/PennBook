var _ = require('lodash');
var User = require('../../db').User;

var onErr = function(err, res) {
  err && console.log(err);
  res.status(500).send(err);
};

exports.findById = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) return onErr(err, res);
    res.send(_.omit(user, 'passwordHash'));
  });
};

exports.update = function(req, res) {
  var id = req.params.id;
  if (!req.session.user || req.session.user._id !== id) {
    return onErr('Unauthorized', res);
  }
  User.update(req.body, function(err, updatedUser) {
    if (err) return onErr(err, res);
    res.send(_.omit(updatedUser, 'passwordHash'));
  });
};
