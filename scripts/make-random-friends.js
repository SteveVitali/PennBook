// This script initializes all the databases in DynamoDB
var _ = require('lodash');
var async = require('async');
var models = require('../db');
var uuid = require('uuid');

models.User.getAllKeys(function(err, data) {
	//console.log(data);
	async.each(data, function(id, next) {
		var _id = id._id;
		console.log(_id);
		var f1 = data[_.random(data.length - 1)]._id;
		console.log(f1);
		var f2 = data[_.random(data.length - 1)]._id;
		console.log(f2);
		var f3 = data[_.random(data.length - 1)]._id;
		console.log(f3);
		models.Friend.create({
			ownerId: _id,
			friendId: f1
		}, next);
		models.Friend.create({
			ownerID: _id,
			friendID: f2
		}, next);
		models.Friend.create({
			ownerID: _id,
			friendID: f3
		}, next);
	},
	function(err) {
		err && console.log(err);
		console.log('Made random friendships.');		
	});
});