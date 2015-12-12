var _ = require('lodash');
var uuid = require('uuid');

module.exports = function(vogels, Joi) {

  var User = vogels.define('User', {
    hashKey: '_id',
    schema: {
      _id: vogels.types.uuid(),
      email: Joi.string().email(),
      passwordHash: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      birthdate: Joi.date(),
      school: Joi.string(),
      work: Joi.string(),
      interests: vogels.types.stringSet(),
      createdAt: Joi.date(),
      isLoggedIn: Joi.boolean(),
      gender: Joi.string(),
      coverPhotoUrl: Joi.string(),
      profilePhotoUrl: Joi.string(),
      phoneNumber: Joi.string()
    },
    indexes: [
      // Example of a global index (different hashKey)
      { hashKey: 'email',
        rangeKey: 'lastName',
        name: 'EmailIndex',
        type: 'global'
      },
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

  User.config({ tableName: 'users' });

  return {
    model: User,
    tableName: 'users',

    // Additional User functions here
    findById: function(id, callback) {
      User.get(id, function(err, user) {
        // The user object is stored in the 'attrs' field
        callback(err, user && user.attrs);
      });
    },

    findByEmail: function(email, callback) {
      console.log('finding by email', email);
      User
      .query(email)
      .usingIndex('EmailIndex')
      .exec(function(err, data) {
        var usersData = _.pluck(data.Items, 'attrs');
        callback(err, usersData[0]);
      });
    },

    create: function(user, params, callback) {
      // Make params argument optional
      if (_.isFunction(params)) {
        callback = params;
        params = null;
      }
      user._id = uuid.v4();
      User.create(user, params || {}, function(err, userData) {
        callback(err, userData && userData.attrs);
      });
    },

    // updatedUser must contain _id
    update: function(updatedUser, params, callback) {
      // params are optional
      if (_.isFunction(params)) {
        callback = params;
        params = null;
      }
      User.update(updatedUser, params || {}, function(err, user) {
        callback(err, user && user.attrs);
      });
    }
  };
};
