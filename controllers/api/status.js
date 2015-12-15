var async = require('async');
var Status = require('../../db').Status;
var Friendship = require('../../db').Friendship;
var Action = require('../../db').Action;

var onErr = function(err, res) {
  err && console.log(err);
  res.status(500).send(err);
};

exports.post = function(req, res) {
  var status = req.body;
  if (!status.content) {
    return onErr('Status cannot be empty', res);
  }
  var posterId = req.session.user._id;
  status.posterId = posterId;
  status.recipientId = status.recipientId || status.posterId;
  status.datePosted = new Date();
  status.likes = [];

  Status.create(status, {}, function(err, status) {
    if (err) return onErr(err, res);
    // Send success response back to user
    res.send(status);

    var buildAction = function(recipientId) {
      return {
        actorId: posterId,
        recipientId: recipientId,
        datetime: new Date(),
        actionType: 'Status',
        actionId: status._id
      };
    };

    // Now, for all friends, post an Action to their news feed
    Friendship.getFriendshipsOfUser(posterId, function(err, friendships) {
      if (err) return onErr(err, res);
      // Adding this will ensure that an Action is posted to the
      // news feed for the user who posted the status, too.
      friendships.push({
        ownerId: posterId,
        friendId: posterId
      });

      async.each(friendships, function(friendship, next) {
        // Get the id of the poster's friend
        var friendId = friendship.ownerId === posterId
          ? friendship.friendId
          : friendship.ownerId;

        Action.create(buildAction(friendId), next);
      },
      function(err) {
        if (err) return onErr(err, res);
      });
    });
  });
};
