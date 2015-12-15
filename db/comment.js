module.exports = function(vogels, Joi) {

  var Comment = vogels.define('Comment', {
    hashKey: 'statusId', // = "Status.posterEmail + Status.statusId"
    rangeKey: 'datePosted',
    schema: {
      _id: vogels.types.uuid(),
      statusId: Joi.string(),
      content: Joi.string(),
      likes: vogels.types.stringSet(), // liker emails
      datePosted: Joi.date(),
      commenterId: Joi.string()
    },
    indexes: [
      { hashKey: 'commenterId',
        rangeKey: 'datePosted',
        name: 'CommenterIdIndex',
        type: 'global'
      }
    ]
  });

  Comment.config({ tableName: 'comments' });

  return {
    model: Comment,
    tableName: 'comments'
    // Additional Comment functions here
  };
};
