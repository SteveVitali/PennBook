module.exports = function(vogels, Joi) {

  var Comment = vogels.define('Comment', {
    hashKey: 'statusId', // = "Status.posterEmail + Status.statusId"
    rangeKey: 'datePosted',
    schema: {
      statusId: Joi.string(),
      content: Joi.string(),
      likes: vogels.types.stringSet(), // liker emails
      datePosted: Joi.date(),
      commenterEmail: Joi.string() // email
    },
    indexes: [
      { hashKey: 'commenterEmail',
        rangeKey: 'datePosted',
        name: 'CommenterEmailIndex',
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
