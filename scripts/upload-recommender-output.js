// This script initializes all the databases in DynamoDB
var _ = require('lodash');
var async = require('async');
var fs = require('fs');
var models = require('../db');
var read = require('readline');

// Make sure the user has entered their command arguments properly.
// For reading docs, see https://nodejs.org/api/readline.html#readline_event_line
if (process.argv[2]) {
	var inputFile = process.argv[2];
	var num = 0;
	var lines = 0;
	read.createInterface({
		input: fs.createReadStream(inputFile)
	}).on('line', function (line) {
		// Parse the line.
		var split = line.split("\t");
		var ownerId = split[0];
		var friendId = split[1];
		var score = parseFloat(split[2]);
		lines++;
		
		// Search for the id for this line.
		models.Recommendation.findID(ownerId, friendId, function(err, data) {
			num++;
			if (data.length > 0) {
				console.log("%d true %j", num, data);
				var id = data[0]._id
				
				// Found an existing recommendation, update it.
				models.Recommendation.update({
					_id: id,
					ownerId: ownerId,
					friendId: friendId,
					score: score
				}, function(err, data) {
					err && console.log(err);
				});
			} else {
				// Create a new recommendation.
				models.Recommendation.create({
					ownerId: ownerId,
					friendId: friendId,
					score: score
				}, function(err, data) {
					err && console.log(err);
				});
			}
			if (num >= lines) {
				console.log("Data updated successfully.");
			}
		});
	}).on('close', function() {
		console.log('File parsed.');
	});
} else {
	console.log("Usage: node upload-recommender-output.js <recommender data file>.");
}