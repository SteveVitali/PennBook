module.exports = function(vogels) {
  // When a request is accepted or denied, the entry
  // is just removed from this table.
  var FriendRequest = vogels.define('FriendRequest', {
    // Sort by the email of the person getting requested for simple fetches
    hashKey: 'requesteeEmail',
    rangeKey: 'requesterEmail',
    schema: {
      requesteeEmail: Joi.string(),
      requesterEmail: Joi.string()
    },
    indexes: [
      { hashKey: 'requesterEmail',
        rangeKey: 'requesteeEmail',
        name: 'RequesterEmailIndex',
        type: 'global'
      }
    ]
  });

  return {
    model: FriendRequest
    // Additional FriendRequest functions here
  };
};
