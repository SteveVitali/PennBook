var vogels = require('vogels');
var Joi = require('joi');
var _ = require('lodash');

vogels.AWS.config.loadFromPath('../credentials.json');

var User = vogels.define('User', {
  hashKey: 'email',
  timestamps: true,
  schema: {
    _id: vogels.types.uuid(),
    email: Joi.string().email,
    firstName: Joi.string(),
    lastName: Joi.string(),
    birthdate: Joi.date(),
    school: Joi.string(),
    work: Joi.string(),
    interests: vogels.types.stringSet(),
    // A set of emails, presumably
    friends: vogels.types.stringSet()
  }
});

return {
  User: new Model(User)
};
