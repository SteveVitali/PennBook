//var _ = require('lodash');
//var passwordHash = require('password-hash');
//var User = require('../db').User;

var onErr = function(err, res) {
  err && console.log(err);
  res.status(500).send(err);
};

exports.initPage = function(req, res) {
	res.render('friendvisualizer.ejs');
}

exports.initUser = function(req, res) {
	var json = {"id": "alice","name": "Alice","children": [{
			"id": "bob",
					"name": "Bob",
					"data": {},
					"children": [{
						"id": "dylan",
						"name": "Dylan",
						"data": {},
						"children": []
					}, {
						"id": "marley",
						"name": "Marley",
						"data": {},
						"children": []
					}]
			}, {
					"id": "charlie",
					"name": "Charlie",
					"data": {},
					"children": [{
							"id":"bob"
					}]
			}, {
					"id": "david",
					"name": "David",
					"data": {},
					"children": []
			}, {
					"id": "peter",
					"name": "Peter",
					"data": {},
					"children": []
			}, {
					"id": "michael",
					"name": "Michael",
					"data": {},
					"children": []
			}, {
					"id": "sarah",
					"name": "Sarah",
					"data": {},
					"children": []
			}],
			"data": []
	};
	res.send(json);
};

exports.fromUser = function(req, res) {
	console.log(req.params.user);
	var newFriends = {"id": "alice","name": "Alice","children": [{
			"id": "james",
					"name": "James",
					"data": {},
					"children": [{
							"id": "arnold",
							"name": "Arnold",
							"data": {},
							"children": []
					}, {
							"id": "elvis",
							"name": "Elvis",
							"data": {},
							"children": []
					}]
			}, {
					"id": "craig",
					"name": "Craig",
					"data": {},
					"children": [{
							"id":"arnold"
					}]
			}, {
					"id": "amanda",
					"name": "Amanda",
					"data": {},
					"children": []
			}, {
					"id": "phoebe",
					"name": "Phoebe",
					"data": {},
					"children": []
			}, {
					"id": "spock",
					"name": "Spock",
					"data": {},
					"children": []
			}, {
					"id": "matt",
					"name": "Matthe",
					"data": {},
					"children": []
			}],
			"data": []
	};
	res.send(newFriends);
};
