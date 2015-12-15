module.exports = function(vogels, Joi) {
  // When a request is accepted or denied, the entry
  // is just removed from this table.
  var FriendRequest = vogels.define('FriendRequest', {
    // Sort by the email of the person getting requested for simple fetches
    hashKey: 'requesteeId',
    rangeKey: 'requesterId',
    schema: {
      _id: vogels.types.uuid(),
      requesteeId: Joi.string(),
      requesterId: Joi.string()
    },
    indexes: [
      { hashKey: 'requesterId',
        rangeKey: 'requesteeId',
        name: 'RequesterIdIndex',
        type: 'global'
      }
    ]
  });

  FriendRequest.config({ tableName: 'friend-requests' });

  return {
    model: FriendRequest,
    tableName: 'friend-requests'
    // Additional FriendRequest functions here
  };
};
