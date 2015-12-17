module.exports = function(vogels, Joi, CRUD) {
  // When a request is accepted or denied, the entry
  // is just removed from this table.
  var FriendRequest = vogels.define('FriendRequest', {
    // Sort by the email of the person getting requested for simple fetches
    hashKey: '_id',
    rangeKey: 'dateRequested',
    schema: {
      _id: vogels.types.uuid(),
      requesteeId: Joi.string(),
      requesterId: Joi.string(),
      dateRequested: Joi.date()
    },
    indexes: [
      { hashKey: 'requesteeId',
        rangeKey: 'dateRequested',
        name: 'RequesteeIdIndex',
        type: 'global'
      },
      { hashKey: 'requesterId',
        rangeKey: 'dateRequested',
        name: 'RequesterIdIndex',
        type: 'global'
      }
    ]
  });

  FriendRequest.config({ tableName: 'friend-requests' });

  CRUD = CRUD(FriendRequest);

  return {
    model: FriendRequest,
    tableName: 'friend-requests'
    // Additional FriendRequest functions here
  };
};
