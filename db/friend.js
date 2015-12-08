module.exports = function(vogels, Joi) {
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

  Friend.config({ tableName: 'friends' });

  return {
    model: Friend,
    tableName: 'friends'
    // Additional functions here
  };
};
