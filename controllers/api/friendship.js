var async = require('async');
var Friendship = require('../../db').Friendship;

var onErr = function(err, res) {
  err && console.log(err);
  res.status(500).send(err);
};

exports.findById = function(req, res) {
  Friendship.findById(req.params.id, function(err, friendship) {
    if (err) return onErr(err);
    res.send(friendship);
  });
};

exports.create = function(req, res) {
  var userId = req.session.user._id;
  var ownerId = req.body.ownerId;
  var friendId = req.body.friendId;

  if (!ownerId || !friendId) {
    return onErr('Insufficient data', res);
  }
  if (ownerId !== userId && friendId !== userId) {
    return onErr('Unauthorized', res);
  }
  var friendship = {
    ownerId: ownerId,
    friendId: friendId,
    dateFriended: new Date()
  };
  Friendship.create(friendship, function(err, fship) {
    if (err) return onErr(err);
    res.send(fship);
  });
};

exports.destroy = function(req, res) {
  var friendshipId = req.params.id;
  var userId = req.session.user._id;
  async.waterfall([
    function findById(done) {
      Friendship.findById(friendshipId, done);
    },
    function getFriendshipObjects(friendship, done) {
      var ownerId = friendship.ownerId;
      var friendId = friendship.friendId;
      if (ownerId !== userId && friendId !== userId) {
        return onErr('Unauthorized deletion', res);
      }
      Friendship.findByUserIds(ownerId, friendId, done);
    },
    function destroyFriendships(friendships, done) {
      Friendship.destroy(friendships, {}, done);
    }
  ],
  function(err, data) {
    if (err) return onErr;
    console.log(data);
    res.send(data);
  });
};
