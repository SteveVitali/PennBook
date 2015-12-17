var _ = require('lodash');
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

exports.getRecommended = function(req, res) {
	var userID = req.params.id;
	// Record all friends of this user.
	models.Friendship.getFriendshipsOfUser(userID, function(err, friendships) {
		if (err) {
			console.log("Error: " + err);
		}
		
		var friends = [];
		async.each(friendships, function(friendship, next) {
			var owner = friendship.ownerId;
			if (owner == userID) {
				friends.push(friendship.friendId);
				next();
			} else {
				next();
			}
		},
		function(err) {
			err && console.log(err);

			// Once you have all of the friends, find all recommendations.
			models.Recommendation.findForOwner(userID, function(err, recommendations) {
				//console.log(recommendations);
				var recUserIDs = [];
				async.each(recommendations, function(recommendation, next) {
					// If this recommendation is already a friend, skip it.
					if (friends.indexOf(recommendation.friendId) > -1) {
						next();
					} else {
						// Otherwise, add it to the recommendation (unless we already have 5).
						if (recUserIDs.length < 5) {
							recUserIDs.push(recommendation.friendId);
						}
						next();
					}
				},
				function(err) {
					err && console.log(err);
							
					var topUsers = [];
					
					// Get the user objects for each of the detected IDs.
					async.each(recUserIDs, function(recID, next) {
						models.User.findById(recID, function(err, data) {
							topUsers.push(data);
							next();
						});
					},
					function(err) {
						err && console.log(err);
						
						// Return the highly-recommended users.
						// console.log(topUsers);
						res.send(topUsers);
					});
				});
			});
		});
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
  var id = req.params.id;
  Action.getUserProfileFeed(id, function(err, actions) {
    if (err) return onErr(err, res);
    res.send(actions);
  });
};
