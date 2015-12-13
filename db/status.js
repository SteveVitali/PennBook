module.exports = function(vogels, Joi, CRUD) {

  var Status = vogels.define('Status', {
    hashKey: 'recipientId',
    rangeKey: 'statusId',
    schema: {
      _id: Joi.number(),
      posterId: Joi.string(),
      // recipient === poster in case of self-post.
      // in case of wall-post, recipient is the id of the wall posted on
      recipientId: Joi.string(),
      datePosted: Joi.date(),
      content: Joi.string(),
      likes: vogels.types.stringSet() // of liker id's
    },
    indexes: [
      // Example of a local index (different hashKey)
      { hashKey: 'recipientId',
        rangeKey: 'datePosted',
        name: 'DatePostedIndex',
        type: 'local'
      },
      { hashKey: 'posterId',
        rangeKey: 'datePosted',
        name: 'RecipientIdIndex',
        type: 'global'
      }
    ]
  });

  Status.config({ tableName: 'statuses' });

  CRUD = CRUD(Status);

  return {
    model: Status,
    tableName: 'statuses',
    // Additional Status functions here
    create: function(status, params, callback) {
      CRUD.create(status, params, callback);
    }
  };
};
