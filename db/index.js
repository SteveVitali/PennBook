var vogels = require('vogels');
var Joi = require('joi');
var _ = require('lodash');

vogels.AWS.config.loadFromPath('credentials.json');

var User = require('./user')(vogels, Joi);
var Comment = require('./comment')(vogels, Joi);
var Friend = require('./friend')(vogels, Joi);
var FriendRequest = require('./friend-request')(vogels, Joi);
var Action = require('./action')(vogels, Joi);
var Status = require('./status')(vogels, Joi);

module.exports = {
  User: User,
  Status: Status,
  Comment: Comment,
  Friend: Friend,
  Action: Action,
  FriendRequest: FriendRequest
};
