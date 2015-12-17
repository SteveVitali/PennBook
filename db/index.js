var vogels = require('vogels');
var Joi = require('joi');
var _ = require('lodash');

vogels.AWS.config.loadFromPath('credentials.json');

// Helpers for doing simple CRUD functions on generic models
var CRUD = function(model) {
  return {
    create: function(modelObj, params, callback) {
      // Make params argument optional
      if (_.isFunction(params)) {
        callback = params;
        params = {};
      }
      model.create(modelObj, params, function(err, modelData) {
        callback(err, modelData && modelData.attrs);
      });
    },

    findById: function(id, callback) {
      model.query(id).exec(function(err, modelData) {
        var results = _.pluck(modelData.Items, 'attrs');
        callback(err, results[0]);
      });
    },

    update: function(updatedObj, params, callback) {
      // params are optional
      if (_.isFunction(params)) {
        callback = params;
        params = {};
      }
      model.update(updatedObj, params, function(err, modelObj) {
        callback(err, modelObj && modelObj.attrs);
      });
    },

    destroy: function(modelObject, params, callback) {
      // params are optional
      if (_.isFunction(params)) {
        callback = params;
        params = {};
      }
      model.destroy(modelObject, params, callback);
    }
  };
};

var User = require('./user')(vogels, Joi, CRUD);
var Comment = require('./comment')(vogels, Joi, CRUD);
var Friendship = require('./friendship')(vogels, Joi, CRUD);
var FriendRequest = require('./friend-request')(vogels, Joi, CRUD);
var Action = require('./action')(vogels, Joi, CRUD);
var Status = require('./status')(vogels, Joi, CRUD);

module.exports = {
  User: User,
  Status: Status,
  Comment: Comment,
  Friendship: Friendship,
  Action: Action,
  FriendRequest: FriendRequest
};
