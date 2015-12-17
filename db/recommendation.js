var _ = require('lodash');

module.exports = function(vogels, Joi, CRUD) {

  var Recommendation = vogels.define('Recommendation', {
    hashKey: '_id',
    rangeKey: 'score',
    schema: {
      _id: vogels.types.uuid(),
      ownerId: Joi.string(),
      friendId: Joi.string(),
      score: Joi.number()
    },
    indexes: [
      { hashKey: 'ownerId',
        rangeKey: 'score',
        name: 'ownerIdIndex',
        type: 'global'
      }
    ]
  });

  Recommendation.config({ tableName: 'recommendations' });

  // Initialize CRUD helpers
  CRUD = CRUD(Recommendation);

  return {
    model: Recommendation,
    tableName: 'recommendations',

    findForOwner: function(ownerId, callback) {
      Recommendation
      .query(ownerId)
      .usingIndex('ownerIdIndex')
			.descending()
      .exec(function(err, data) {
        callback(err, _.pluck(data.Items, 'attrs'));
      });
    },

		findID: function(ownerId, friendId, callback) {
			Recommendation
			.scan()
      .attributes(['_id'])
			.where('ownerId').equals(ownerId)
			.where('friendId').equals(friendId)
			.exec(function(err, data) {
				callback(err, _.pluck(data.Items, 'attrs'));
			});
		},

    create: function(user, params, callback) {
      CRUD.create(user, params, callback);
    },

    // updatedRec must contain _id
    update: function(updatedRec, params, callback) {
      CRUD.update(updatedRec, params, callback);
    }
  };
};
