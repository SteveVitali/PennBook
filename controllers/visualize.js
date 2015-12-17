var models = require('../db');
var async = require('async');

var onErr = function(err, res) {
  err && console.log(err);
  res.status(500).send(err);
};

exports.initPage = function(req, res) {
	res.render('friendvisualizer.ejs');
}

exports.initUser = function(req, res) {
	console.log("Visualizing " + req.session.user._id + " " + req.session.user.fullName);
	var userID = req.session.user._id;
	models.User.findById(userID, function(err, data) {
		var ownerName = data.fullName;
		var children = [];
		
		console.log(data);
		
		models.Friendship.getFriendshipsOfUser(userID, function(err, friendships) {
			if (err) {
				console.log("Error: " + err);
			}
			console.log("Friendships: " + friendships);
			
			var friends = [];
			// Get all friends of this user
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
				console.log("Got friends: " + friends);
				
				// Once you've gotten all friends, then for each friend...
				async.each(friends, function(friendID, next) {
						// Get the user for that friend.
						models.User.findById(friendID, function(err, friend) {
							var friendName = friend.fullName;
							var friendChildren = [];
							
							// Find all friends of this friend.
							models.Friendship.getFriendshipsOfUser(friendID, function(err, fships) {
								if (err) {
									console.log("Error: " + err);
								}
								
								// For each of them, if they are also friends of the original user,
								// then we know about this relationship. Therefore add to node.
								async.each(fships, function(fship, nextC) {
									if (friends.indexOf(fship.friendId) > -1) {
										if (fship.friendId !== friendID) {
											// Find the name of the friend's child and construct its node.
											models.User.findById(fship.friendId, function(err, friendChildUser) {
												var friendChildName = friendChildUser.fullName;
												var friendChild = {
													"id": fship.friendId,
													"name": friendChildName,
													"data": {},
													"children": []
												}
												friendChildren.push(friendChild);
												nextC();
											});
										} else {
											nextC();
										}
									} else {
										nextC();
									}
								}, function(err) {
									// Construct the node for this friend.
									var friendNode = {
										"id": friendID,
										"name": "" + friendName,
										"data": {},
										"children": friendChildren								
									}
									
									// And add it as a friend of the primary node.
									children.push(friendNode);
									console.log("Pushed: " + friendNode);
									next();
								});
							});
						});
				},
				function(err) {
					err && console.log(err);
					
					// Construct this primary node.
					var node = {
						"id": userID,
						"name": "" + ownerName,
						"data": [],
						"children": children					
					};
					
					console.log('Completed visualizer: \n' + JSON.stringify(node, null, 2));
					res.send(node);
				});
			});
		});
	});
};

exports.fromUser = function(req, res) {
	console.log(req.params.user);
	var selectedID = req.params.user;
	var loggedID = req.session.user._id;
	
	// Find the logged-in user.
	models.User.findById(loggedID, function(err, data) {
		var ownerAffil = data.school;
		
		// Get all friends of the logged-in user.
		models.Friendship.getFriendshipsOfUser(loggedID, function(err, friendships) {
			if (err) {
				console.log("Error: " + err);
			}
			
			var friends = [];
			async.each(friendships, function(friendship, next) {
				var owner = friendship.ownerId;
				if (owner == loggedID) {
					friends.push(friendship.friendId);
					next();
				} else {
					next();
				}
			},
			function(err) {
				err && console.log(err);
				
				console.log("Here!");
				
				// Go through all friendships of the selected user.
				models.Friendship.getFriendshipsOfUser(selectedID, function(err, selFriends) {
					var children = [];
					async.each(selFriends, function(selFriend, next) {
						var owner = selFriend.ownerId;
						if (owner == selectedID) {
							var selFriendID = selFriend.friendId;
							
							// Get the user associated with the friendship.
							models.User.findById(selFriendID, function(err, selFriendUser) {
								var affiliation = selFriendUser.school;
								var affiliateName = selFriendUser.fullName;
								// If any have the same affiliation as the logged-in user...
								if (affiliation == ownerAffil) {
									// Construct the node.
									// Check all friends of this node to see if it relates to
									// any of the logged-in user's friends.
									models.Friendship.getFriendshipsOfUser(selFriendID, function(err, selFships) {
										var selChildren = [];
										async.each(selFships, function(selChild, nextC) {
											var selChildID = selChild.friendId;
											// If this is a friend of ours
											if (friends.indexOf(selChildID) > -1) {
												// Construct our friend's node.
												models.User.findById(selChildID, function(err, selChildUser) {
													var selChildName = selChildUser.fullName;
													var selChildNode = {
														"id": selChildID,
														"name": selChildName,
														"data": {},
														"children": []
													}
													selChildren.push(selChildNode);
													nextC();
												});	
											} else {
												nextC();
											}
										}, function(err) {
											// Construct the node for this affiliate.
											var affiliateNode = {
												"id": selFriendID,
												"name": "" + affiliateName,
												"data": {},
												"children": selChildren								
											}
											
											// And add it to the list of affiliates.
											children.push(affiliateNode);
											next();
										});
									});
								} else {
									next();
								}
							});
						} else {
							next();
						}
					}, function(err) {
						// When done, add new friends to network.
						models.User.findById(selectedID, function(err, selectedUserData) {
							var newFriends = {
								"id": selectedID,
								"name": selectedUserData.fullName,
								"data": [],
								"children": children
							};
							res.send(newFriends);
						});
					});
				});
			});	
	  });
	});
};
