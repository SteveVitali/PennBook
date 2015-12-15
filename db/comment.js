module.exports = function(vogels, Joi, CRUD) {

  var Comment = vogels.define('Comment', {
    hashKey: '_id',
    rangeKey: 'datePosted',
    schema: {
      _id: vogels.types.uuid(),
      statusId: Joi.string(), // = "Status.posterEmail + Status.statusId"
      content: Joi.string(),
      likes: vogels.types.stringSet(), // liker emails
      datePosted: Joi.date(),
      commenterId: Joi.string()
    },
    indexes: [
      { hashKey: 'statusId',
        rangeKey: 'datePosted',
        name: 'StatusIdIndex',
        type: 'global'
      },
      { hashKey: 'commenterId',
        rangeKey: 'datePosted',
        name: 'CommenterIdIndex',
        type: 'global'
      }
    ]
  });

  Comment.config({ tableName: 'comments' });

  CRUD = CRUD(Comment);

  return {
    model: Comment,
    tableName: 'comments'
    // Additional Comment functions here
  };
};
