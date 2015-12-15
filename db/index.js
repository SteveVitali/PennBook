var vogels = require('vogels');
var Joi = require('joi');
var _ = require('lodash');

vogels.AWS.config.loadFromPath('credentials.json');

// Helpers for doing simple CRUD functions on generic models
var CRUD = function(model) {
  return {
    findById: function(id, callback) {
      model.get(id, function(err, model) {
        // The model object is stored in the 'attrs' field
        callback(err, model && model.attrs);
      });
    },

    create: function(modelObj, params, callback) {
      // Make params argument optional
      if (_.isFunction(params)) {
        callback = params;
        params = null;
      }
      model.create(modelObj, params || {}, function(err, modelData) {
        callback(err, modelData && modelData.attrs);
      });
    },

    update: function(updatedObj, params, callback) {
      // params are optional
      if (_.isFunction(params)) {
        callback = params;
        params = null;
      }
      model.update(updatedObj, params || {}, function(err, modelObj) {
        callback(err, modelObj && modelObj.attrs);
      });
    }
  };
};

var User = require('./user')(vogels, Joi, CRUD);
var Comment = require('./comment')(vogels, Joi, CRUD);
var Friend = require('./friend')(vogels, Joi, CRUD);
var FriendRequest = require('./friend-request')(vogels, Joi, CRUD);
var Action = require('./action')(vogels, Joi, CRUD);
var Status = require('./status')(vogels, Joi, CRUD);

module.exports = {
  User: User,
  Status: Status,
  Comment: Comment,
  Friend: Friend,
  Action: Action,
  FriendRequest: FriendRequest
};
