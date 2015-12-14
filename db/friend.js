module.exports = function(vogels, Joi, CRUD) {
  // We store for each friendship, two rows in the KVS.
  // This makes it easy to query for all friends of a user
  // without having to store every friend in one huge StringSet.
  // (I'm open to a better design but this is the best I could come up with)
  var Friend = vogels.define('Friend', {
    hashKey: 'ownerId',
    rangeKey: 'dateFriended',
    schema: {
      ownerId: Joi.string(),
      friendId: Joi.string(),
      dateFriended: Joi.date()
    },
    indexes: [
      { hashKey: 'friendId',
        rangeKey: 'dateFriended',
        name: 'FriendIdIndex',
        type: 'global'
      }
    ]
  });

  Friend.config({ tableName: 'friends' });

	// Initialize CRUD helpers
  CRUD = CRUD(Friend);
	
  return {
    model: Friend,
    tableName: 'friends',
		
    // Additional functions here
		create: function(friend, params, callback) {
      CRUD.create(friend, params, callback);
    }
  };
};
