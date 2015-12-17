var _ = require('lodash');

module.exports = function(vogels, Joi, CRUD) {
  // This is a generic bucket for all of a user's
  // status updates, new friendships, profile updates, etc.
  // I'm thinking that maybe we'll have to have a MapReduce job that
  // crunches this data into a NewsFeed. Otherwise we'll have to query
  // on it for all friends of a user every time we load news feed.
  var Action = vogels.define('Action', {
    hashKey: '_id',
    rangeKey: 'datetime',
    schema: {
      _id: vogels.types.uuid(),
      actorId: Joi.string(), // Id of user who created the action
      recipientId: Joi.string(), // Id of the 'recipient' of the action, if any
      subscriberId: Joi.string(), // Id of the user who 'owns' this action
      datetime: Joi.date(),
      actionType: Joi.string(), // e.g. 'Status' or 'Friendship'
      actionId: Joi.string() // e.g. a Status._id if actionType is 'Status'
    },
    indexes: [
      // Fetch all subscribed actions in order
      { hashKey: 'subscriberId',
        rangeKey: 'datetime',
        name: 'SubscriberIdIndex',
        type: 'global'
      },
      // Fetch all of a user's performed actions
      { hashKey: 'actorId',
        rangeKey: 'subscriberId',
        name: 'ActorIdIndex',
        type: 'global'
      },
      // Fetch all of a user's received actions
      { hashKey: 'recipientId',
        rangeKey: 'subscriberId',
        name: 'RecipientIdIndex',
        type: 'global'
      }
    ]
  });

  Action.config({ tableName: 'actions' });

  CRUD = CRUD(Action);

  return {
    model: Action,
    tableName: 'actions',

    create: function(friendship, params, callback) {
      CRUD.create(friendship, params, callback);
    },

    getUserNewsFeed: function(userId, callback) {
      Action
      .query(userId)
      .usingIndex('SubscriberIdIndex')
      .exec(function(err, result) {
        if (err) return callback(err);
        callback(err, _.pluck(result.Items, 'attrs'));
      });
    },

    getUserProfileFeed: function(userId, callback) {
      Action
      .query(userId)
      .where('subscriberId').equals(userId)
      .usingIndex('ActorIdIndex')
      .exec(function(err, actionsDone) {
        console.log('first err', !!err);
        if (err) return callback(err);
        Action
        .query(userId)
        .where('subscriberId').equals(userId)
        .usingIndex('RecipientIdIndex')
        .exec(function(err, actionsReceived) {
          if (err) return callback(err);
          var actions = _.pluck(
            actionsDone.Items.concat(actionsReceived.Items), 'attrs'
          );
          // Now, we want to filter out any duplicates that we get
          // (e.g. self-posts, which has actorId === subscriberId)
          var itemIdsMap = {};
          var uniqueActions = _.compact(_.map(actions, function(action) {
            var actionId = action.actionId;
            if (!itemIdsMap[actionId]) {
              itemIdsMap[actionId] = true;
              return action;
            }
          }));
          callback(err, uniqueActions);
        });
      });
    }
  };
};
