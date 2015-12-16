var _ = require('lodash');
var User = require('../../db').User;
var Friendship = require('../../db').Friendship;
var Action = require('../../db').Action;

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
  if (req.session.user._id !== id) {
    return onErr('Unauthorized', res);
  }
  // Emptystring's will throw a validation error for string sets
  req.body.interests = _.compact(req.body.interests);
  // And vogels makes you literally delete it from the object
  // if it's empty because it can't handle empty arrays...
  if (req.body.interests.length === 0) {
    delete req.body.interests;
  }

  User.update(req.body, function(err, updatedUser) {
    if (err) return onErr(err, res);
    res.send(_.omit(updatedUser, 'passwordHash'));
  });
};

exports.getFriendships = function(req, res) {
  var id = req.params.id;
  if (req.session.user._id !== id) {
    return onErr('Unauthorized', res);
  }
  Friendship.getFriendshipsOfUser(id, function(err, friendships) {
    if (err) return onErr(err, res);
    res.send(friendships);
  });
};

exports.getNewsFeed = function(req, res) {
  var id = req.params.id;
  if (req.session.user._id !== id) {
    return onErr('Unauthorized', res);
  }
  Action.getUserNewsFeed(id, function(err, actions) {
    if (err) return onErr(err, res);
    res.send(actions);
  });
};

exports.getProfileFeed = function(req, res) {
  var id = req.params.id;
  Action.getUserProfileFeed(id, function(err, actions) {
    if (err) return onErr(err, res);
    res.send(actions);
  });
};
