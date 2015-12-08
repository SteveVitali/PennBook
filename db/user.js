var _ = require('lodash');

module.exports = function(vogels, Joi) {

  var User = vogels.define('User', {
    hashKey: 'email',
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
      gender: Joi.string()
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

  User.config({ tableName: 'users' });

  return {
    model: User,

    // Additional User functions here
    findByEmail: function(email, callback) {
      User.get(email, function(err, user) {
        // The user object is stored in the 'attrs' field
        callback(err, user && user.attrs);
      });
    },

    create: function(user, params, callback) {
      // Make params argument optional
      if (_.isFunction(params)) {
        callback = params;
        params = null;
      }
      User.create(user, params || {}, function(err, userData) {
        callback(err, userData && userData.attrs);
      });
    }
  };
};
