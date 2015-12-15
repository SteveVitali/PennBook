// This script initializes all the databases in DynamoDB
var _ = require('lodash');
var async = require('async');
var models = require('../db');

models.User.getAllKeys(function(err, data) {
  //console.log(data);
  async.each(data, function(id, next) {
    var _id = id._id;
    var f1 = data[_.random(data.length - 1)]._id;
    var f2 = data[_.random(data.length - 1)]._id;
    var f3 = data[_.random(data.length - 1)]._id;
    models.Friend.create({
      ownerId: _id,
      friendId: f1,
      dateFriended: new Date()
    }, function() {
      models.Friend.create({
        ownerId: _id,
        friendId: f2,
        dateFriended: new Date()
      }, function() {
        models.Friend.create({
          ownerId: _id,
          friendId: f3,
          dateFriended: new Date()
        }, next);
      });
    });
  },
  function(err) {
    err && console.log(err);
    console.log('Made random friendships.');
  });
});
