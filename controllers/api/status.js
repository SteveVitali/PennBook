var async = require('async');
var Status = require('../../db').Status;
var Friendship = require('../../db').Friendship;
var Action = require('../../db').Action;

var onErr = function(err, res) {
  err && console.log(err);
  res.status(500).send(err);
};

exports.findById = function(req, res) {
  Status.findById(req.params.id, function(err, status) {
    if (err) return onErr(err, res);
    res.send(status);
  });
};

exports.post = function(req, res) {
  var status = req.body;
  if (!status.content) {
    return onErr('Status cannot be empty', res);
  }
  var posterId = req.session.user._id;
  var recipientId = status.recipientId || status.posterId;

  status.posterId = posterId;
  status.recipientId = recipientId;
  status.datePosted = new Date();
  status.likes = [];

  Status.create(status, {}, function(err, status) {
    if (err) return onErr(err, res);
    // Send success response back to user
    res.send(status);

    async.waterfall([
      function fetchRelevantFriendships(done) {
        // First, fetch the poster's friendships
        Friendship.getFriendshipsOfUser(posterId, function(err, friendships) {
          if (posterId === recipientId) {
            return done(err, friendships);
          }
          // If the poster is posting on someone else's wall, then
          // get the friendships of the recipient, too
          Friendship.getFriendshipsOfUser(
            recipientId,
            function(err, moreFriendships) {
              // Send back poster and recipient friendships
              done(err, friendships.concat(moreFriendships));
            }
          );
        });
      },
      function postActionsToFriends(friendships, done) {
        // Adding this will ensure that an Action is posted to the
        // news feed for the user who posted the status, too.
        friendships.push({
          ownerId: posterId,
          friendId: posterId
        });

        var friendIdsMap = {};

        async.each(friendships, function(friendship, next) {
          // Get the id of the poster's friend
          var friendId = friendship.ownerId === posterId
            ? friendship.friendId
            : friendship.ownerId;

          // Don't post another action if the friend has been processed already
          if (friendIdsMap[friendId]) {
            return async.nextTick(next);
          }
          // Note that id has been processed and post the next action
          friendIdsMap[friendId] = true;
          Action.create({
            actorId: posterId,
            recipientId: friendId,
            datetime: status.datePosted,
            actionType: 'Status',
            actionId: status._id
          }, next);

        }, done);
      }
    ],
    function(err) {
      if (err) return onErr(err, res);
    });
  });
};
