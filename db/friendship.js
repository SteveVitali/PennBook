var _ = require('lodash');
var async = require('async');

module.exports = function(vogels, Joi, CRUD) {
  // We store for each friendship, two rows in the KVS.
  // This makes it easy to query for all friends of a user
  // without having to store every friend in one huge StringSet.
  // (I'm open to a better design but this is the best I could come up with)
  var Friendship = vogels.define('Friendship', {
    hashKey: '_id',
    rangeKey: 'dateFriended',
    schema: {
      _id: vogels.types.uuid(),
      ownerId: Joi.string(),
      friendId: Joi.string(),
      dateFriended: Joi.date()
    },
    indexes: [
      { hashKey: 'ownerId',
        rangeKey: 'dateFriended',
        name: 'OwnerIdIndex',
        type: 'global'
      },
      { hashKey: 'friendId',
        rangeKey: 'dateFriended',
        name: 'FriendIdIndex',
        type: 'global'
      }
    ]
  });

  Friendship.config({ tableName: 'friendships' });

  // Initialize CRUD helpers
  CRUD = CRUD(Friendship);

  return {
    model: Friendship,
    tableName: 'friendships',

    create: function(friendship, params, callback) {
			// Make sure to add the other edge of this friendship to the table.
			var inverse = {
				ownerId: friendship.friendId,
				friendId: friendship.ownerId,
				dateFriended: friendship.dateFriended
			};

      CRUD.create(inverse, params, function(err, friendship) {
        if (err) return callback(err);
        CRUD.create(friendship, params, function(err, friendship) {
          callback(err, friendship);
        });
      });
    },

    getFriendshipsOfUser: function(userId, callback) {
      Friendship
      .query(userId)
      .usingIndex('OwnerIdIndex')
      .exec(function(err, friendships) {
        if (err) return callback(err);
        Friendship
        .query(userId)
        .usingIndex('FriendIdIndex')
        .exec(function(err, moreFriendships) {
          console.log(err);
          var friendData = _.pluck(friendships.Items, 'attrs');
          var moreFriendData = _.pluck(moreFriendships.Items, 'attrs');
          callback(err, friendData.concat(moreFriendData));
        });
      });
    }
  };
};
