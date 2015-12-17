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
  Friendship.create(friendship, function(err, friendship) {
    if (err) return onErr(err);
    res.send(friendship);
  });
};

exports.destroy = function(req, res) {
  var friendshipId = req.params.id;
  var userId = req.session.user._id;
  console.log('destroy', friendshipId, userId);
  async.waterfall([
    function findById(done) {
      Friendship.findById(friendshipId, done);
    },
    function getFriendshipObjects(friendship, done) {
      console.log('got friendship', friendship);
      var ownerId = friendship.ownerId;
      var friendId = friendship.friendId;
      Friendship.findByUserIds(ownerId, friendId, done);
    },
    function destroyFriendships(friendships, done) {
      console.log('got both friendships', friendships);
      Friendship.destroy(friendships, {}, done);
    }
  ],
  function(err, data) {
    if (err) return onErr;
    console.log(data);
    res.send(data);
  });
};
