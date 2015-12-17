var _ = require('lodash');
var async = require('async');
var User = require('../../db').User;
var Friendship = require('../../db').Friendship;
var Action = require('../../db').Action;
var Recommendation = require('../../db').Recommendation;
var models = require('../../db');
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
  var profileId = req.params.id;
  var userId = req.session.user._id;

  // Make sure user is friends with profile whose feed he's fetching
  var authorize = function(done) {
    if (profileId === userId) {
      return async.nextTick(function() {
        done(null, true);
      });
    }
    Friendship.findByUserIds(profileId, userId, function(err, friendships) {
      done(err, friendships && friendships.length > 0);
    });
  };
  authorize(function(err, authorized) {
    if (err) return onErr(err, res);
    if (!authorized) return onErr('Unauthorized profile feed', res);

    Action.getUserProfileFeed(profileId, function(err, actions) {
      if (err) return onErr(err, res);
      res.send(actions);
    });
  });
};

exports.getRecommended = function(req, res) {
  var userID = req.params.id;
  // Record all friends of this user.
  Friendship.getFriendshipsOfUser(userID, function(err, friendships) {
    if (err) return onErr(err, res);

    // Get unique set of friend id's
    var friends = _.uniq(_.pluck(friendships, 'friendId'));

    // Once you have all of the friends, find all recommendations.
    Recommendation.findForOwner(userID, function(err, recommendations) {
      if (err) return onErr(err, res);
      console.log('got recommendations', recommendations);

      // Get list of recommendations of users not yet friended
      var viableRecommendations = _.filter(recommendations, function(rec) {
        return friends.indexOf(rec.friendId) === -1;
      });
      console.log('viable recommendations', viableRecommendations);

      // Extract the ids of the viable recommended users
      var recUserIDs = _.pluck(viableRecommendations, 'friendId');
      console.log('got recUserIds', recUserIDs);

      var topUsers = [];
      // Get the user objects for each of the detected IDs.
      async.each(recUserIDs, function(recID, next) {
        User.findById(recID, function(err, data) {
          if (err) return onErr(err, res);
          topUsers.push(data);
          next(err);
        });
      },
      function(err) {
        if (err) return onErr(err, res);
        console.log('got recommendation users', topUsers);
        res.send(topUsers);
      });
    });
  });
};
