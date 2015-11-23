var vogels = require('vogels');
var Joi = require('joi');
var _ = require('lodash');

vogels.AWS.config.loadFromPath('../credentials.json');

var User = require('./user')(vogels);
var Comment = require('./comment')(vogels);
var Friend = require('./friend')(vogels);
var FriendRequest = require('./friend-request')(vogels);
var Action = require('./action')(vogels);

module.exports = {
  User: User,
  Status: Status,
  Comment: Comment,
  Friend: Friend,
  Action: Action
};
