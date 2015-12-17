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
      },
      { hashKey: 'ownerId',
        rangeKey: 'friendId',
        name: 'UserIdsIndex',
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

    findById: function(id, callback) {
      CRUD.findById(id, callback);
    },

    findByUserIds: function(id1, id2, callback) {
      console.log('finding by', id1, id2);
      Friendship
      .query(id1)
      .where('friendId').equals(id2)
      .usingIndex('UserIdsIndex')
      .exec(function(err, friendship1) {
        if (err) return callback(err);
        Friendship
        .query(id2)
        .where('friendId').equals(id1)
        .usingIndex('UserIdsIndex')
        .exec(function(err, friendship2) {
          if (err) return callback(err);
          callback(err,
            _.pluck(
              friendship1.Items.concat(friendship2.Items),
              'attrs'
            )
          );
        });
      });
    },

    // Takes in array of friendship objects to delete
    destroy: function(friendships, params, callback) {
      async.each(friendships, function(friendship, next) {
        CRUD.destroy(friendship, params, next);
      }, callback);
    },

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
          //console.log(err);
          var friendData = _.pluck(friendships.Items, 'attrs');
          var moreFriendData = _.pluck(moreFriendships.Items, 'attrs');
          callback(err, friendData.concat(moreFriendData));
        });
      });
    }
  };
};
