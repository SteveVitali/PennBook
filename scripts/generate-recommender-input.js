// This script initializes all the databases in DynamoDB
var _ = require('lodash');
var async = require('async');
var fs = require('fs');
var models = require('../db');

models.User.getAllUsers(function(err, data) {
  // Iterate through all users to prepare output.
	var output = "";
	async.each(data, function(user, next) {
    var userID = user._id;
		
		// Associate the user with their affiliation.
		if (user.school) {
			output += userID + "\t" + user.school.toLowerCase() + "\t0\n";
		}
		
		// Associate the user with their interests.
		var interests = user.interests;
		if (interests) {
			for (var i = 0; i < interests.length; i++) {
				output += userID + "\t" + interests[i] + "\t0\n";
			}
		}
		
		// Associate the user with each of their friends.
		models.Friendship.getFriendshipsOfUser(userID, function(err, friendships) {
			async.each(friendships, function(friendship, nextC) {
				if (friendship.ownerId == userID) {
					output += userID + "\t" + friendship.friendId + "\t1\n";
				}				
				nextC();
			},
			function(err) {
				next();
			});
		});
	},
  function(err) {
		var timestamp = new Date().toString().replace(/[:\s]/g, '_').replace(/\_GMT.+/, '');
		fs.writeFile("input-" + timestamp + ".txt", 
		output, function(err) {
			err && console.log(err);
			console.log('Compiled recommender input.');
		}); 	
  });
});