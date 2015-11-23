module.exports = function(vogels) {

  var Status = vogels.define('Status', {
    hashKey: 'recipientEmail',
    rangeKey: 'statusId',
    schema: {
      posterEmail: Joi.string(),
      // recipient === poster in case of self-post.
      // in case of wall-post, recipient is the email of the wall posted on
      recipientEmail: Joi.string(),
      statusId: Joi.number(),
      datePosted: Joi.date(),
      content: Joi.string(),
      likes: vogels.types.stringSet() // of liker emails
    },
    indexes: [
      // Example of a local index (different hashKey)
      { hashKey: 'recipientEmail',
        rangeKey: 'datePosted',
        name: 'DatePostedIndex',
        type: 'local'
      },
      { hashKey: 'posterEmail',
        rangeKey: 'datePosted',
        name: 'RecipientEmailIndex',
        type: 'global'
      }
    ]
  });

  return {
    model: Status
    // Additional Status functions here
  };
};
