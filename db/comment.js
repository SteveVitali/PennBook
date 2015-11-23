module.exports = function(vogels) {

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

  return {
    model: Comment
    // Additional Comment functions here
  };
};
