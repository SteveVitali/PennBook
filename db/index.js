var vogels = require('vogels');
var Joi = require('joi');
var _ = require('lodash');

vogels.AWS.config.loadFromPath('../credentials.json');

var User = vogels.define('User', {
  hashKey: 'email',
  schema: {
    _id: vogels.types.uuid(),
    email: Joi.string().email,
    passwordHash: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    birthdate: Joi.date(),
    school: Joi.string(),
    work: Joi.string(),
    interests: vogels.types.stringSet(),
    createdAt: Joi.date()
  },
  indexes: [
    // Example of a global index (different hashKey)
    { hashKey: 'school',
      rangeKey: 'lastName',
      name: 'SchoolIndex',
      type: 'global' 
    }
  ]
});

var Status = vogels.define('Status', {
  hashKey: 'posterEmail',
  rangeKey: 'statusId',
  schema: {
    posterEmail: Joi.string(),
    statusId: Joi.number(),
    datePosted: Joi.date(),
    content: Joi.string(),
    likes: vogels.types.stringSet() // of liker emails
  },
  indexes: [
    // Example of a local index (different hashKey)
    { hashKey: 'posterEmail',
      rangeKey: 'datePosted',
      name: 'DatePostedIndex',
      type: 'local' 
    }
  ]
});

var Comment = vogels.define('Comment', {
  hashKey: 'statusId', // = "Status.posterEmail + Status.statusId"
  rangeKey: 'datePosted',
  schema: {
    statusId: Joi.string(),
    content: String,
    likes: vogels.types.stringSet(), // liker emails
    datePosted: Joi.date(),
    commenter: Joi.string() // email
  }
});

module.exports = {
  User: User,
  Status: Status,
  Comment: Comment
};
