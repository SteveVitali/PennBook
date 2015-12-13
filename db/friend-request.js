module.exports = function(vogels, Joi) {
  // When a request is accepted or denied, the entry
  // is just removed from this table.
  var FriendRequest = vogels.define('FriendRequest', {
    // Sort by the email of the person getting requested for simple fetches
    hashKey: 'requesteeId',
    rangeKey: 'requesterId',
    schema: {
      requesteeId: vogels.types.uuid(),
      requesterId: vogels.types.uuid()
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
