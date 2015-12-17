var Friendship = require('../../db').Friendship;

var onErr = function(err, res) {
  err && console.log(err);
  res.status(500).send(err);
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
