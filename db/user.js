var _ = require('lodash');

module.exports = function(vogels, Joi, CRUD) {

  var User = vogels.define('User', {
    hashKey: '_id',
    rangeKey: 'createdAt',
    schema: {
      _id: vogels.types.uuid(),
      email: Joi.string().email(),
      fullName: Joi.string(),
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
      { hashKey: 'email',
        rangeKey: 'lastName',
        name: 'EmailIndex',
        type: 'global'
      },
      { hashKey: 'firstName',
        rangeKey: 'lastName',
        name: 'NameIndex',
        type: 'global'
      },
      { hashKey: 'school',
        rangeKey: 'lastName',
        name: 'SchoolIndex',
        type: 'global'
      },
      { hashKey: 'work',
        rangeKey: 'lastName',
        name: 'WorkIndex',
        type: 'global'
      }
    ]
  });

  User.config({ tableName: 'users' });

  // Initialize CRUD helpers
  CRUD = CRUD(User);

  return {
    model: User,
    tableName: 'users',

    findById: function(id, callback) {
      CRUD.findById(id, callback);
    },

    findByEmail: function(email, callback) {
      User
      .query(email)
      .usingIndex('EmailIndex')
      .exec(function(err, data) {
        var usersData = _.pluck(data.Items, 'attrs');
        callback(err, usersData[0]);
      });
    },

    create: function(user, params, callback) {
      CRUD.create(user, params, callback);
    },

    // updatedUser must contain _id
    update: function(updatedUser, params, callback) {
      // Pre-process by making sure fullName is updated
      updatedUser.fullName = _.compact([
        updatedUser.firstName,
        updatedUser.lastName
      ]).join(' ');

      CRUD.update(updatedUser, params, callback);
    },

    regexSearchByName: function(name, callback) {
      User.scan()
      .limit(100)
      .where('fullName').contains(name)
      .exec(function(err, result) {
        callback(err, _.pluck(result.Items, 'attrs'));
      });
    },

    getAllKeys: function(callback) {
      User.scan()
      .attributes(['_id'])
      .loadAll()
      .exec(function(err, data) {
        callback(err, _.pluck(data.Items, 'attrs'));
      });
    },
		
		getAllUsers: function(callback) {
      User.scan()
      .loadAll()
      .exec(function(err, data) {
        callback(err, _.pluck(data.Items, 'attrs'));
      });
    }
  };
};
