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

  return {
    model: User
    // Additional User functions here
  };
};
