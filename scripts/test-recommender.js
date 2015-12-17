var models = require('../db');
var async = require('async');

var userID = '61e07177-9a89-4332-a6b4-5bb64a401900';
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
					console.log(topUsers);
				});
			});
		});
	});
});