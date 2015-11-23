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
    createdAt: Joi.date(),
    isLoggedIn: Joi.boolean()
  },
  indexes: [
    // Example of a global index (different hashKey)
    { hashKey: 'school',
      rangeKey: 'lastName',
      name: 'SchoolIndex',
      type: 'global'
    },
    { hashKey: 'work',
      rangeKey: 'lastName',
      name: 'SchoolIndex',
      type: 'global'
    }
  ]
});

var Status = vogels.define('Status', {
  hashKey: 'recipientEmail',
  rangeKey: 'statusId',
  schema: {
    posterEmail: Joi.string(),
    // recipient === poster in case of self-post.
    // in case of wall-post, recipient is the email of the wall posted on
    recipientEmail: Joi.string(),
    statusId: Joi.number(),
    datePosted: Joi.date(),
    content: Joi.string(),
    likes: vogels.types.stringSet() // of liker emails
  },
  indexes: [
    // Example of a local index (different hashKey)
    { hashKey: 'recipientEmail',
      rangeKey: 'datePosted',
      name: 'DatePostedIndex',
      type: 'local'
    },
    { hashKey: 'posterEmail',
      rangeKey: 'datePosted',
      name: 'RecipientEmailIndex',
      type: 'global'
    }
  ]
});

var Comment = vogels.define('Comment', {
  hashKey: 'statusId', // = "Status.posterEmail + Status.statusId"
  rangeKey: 'datePosted',
  schema: {
    statusId: Joi.string(),
    content: Joi.string(),
    likes: vogels.types.stringSet(), // liker emails
    datePosted: Joi.date(),
    commenterEmail: Joi.string() // email
  },
  indexes: [
    { hashKey: 'commenterEmail',
      rangeKey: 'datePosted',
      name: 'CommenterEmailIndex',
      type: 'global'
    }
  ]
});

// We store for each friendship, two rows in the KVS.
// This makes it easy to query for all friends of a user
// without having to store every friend in one huge StringSet.
// (I'm open to a better design but this is the best I could come up with)
var Friend = vogels.define('Friend', {
  hashKey: 'ownerEmail',
  rangeKey: 'dateFriended',
  schema: {
    ownerEmail: Joi.string(),
    friendEmail: Joi.string(),
    dateFriended: Joi.date()
  },
  indexes: [
    { hashKey: 'friendEmail',
      rangeKey: 'dateFriended',
      name: 'FriendEmailIndex',
      type: 'global'
    }
  ]
});

// This is a generic bucket for all of a user's
// status updates, new friendships, profile updates, etc.
// I'm thinking that maybe we'll have to have a MapReduce job that
// crunches this data into a NewsFeed. Otherwise we'll have to query
// on it for all friends of a user every time we load news feed.
var Action = vogels.define('Action', {
  hashKey: 'actorEmail',
  rangeKey: 'datetime',
  schema: {
    actorEmail: Joi.string(),
    datetime: Joi.date(),
    actionData: Joi.string() // arbitrary stringified JSON data
  }
});

module.exports = {
  User: User,
  Status: Status,
  Comment: Comment,
  Friend: Friend,
  Action: Action
};
