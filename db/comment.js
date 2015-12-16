var _ = require('lodash');

module.exports = function(vogels, Joi, CRUD) {

  var Comment = vogels.define('Comment', {
    hashKey: '_id',
    rangeKey: 'datePosted',
    schema: {
      _id: vogels.types.uuid(),
      parentId: Joi.string(), // generic Id of parent object
      content: Joi.string(),
      likes: vogels.types.stringSet(), // liker _id's
      datePosted: Joi.date(),
      commenterId: Joi.string()
    },
    indexes: [
      { hashKey: 'parentId',
        rangeKey: 'datePosted',
        name: 'ParentIdIndex',
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
    tableName: 'comments',
    // Additional Comment functions here
    getCommentsOnItem: function(itemId, callback) {
      Comment
      .query(itemId)
      .usingIndex('ParentIdIndex')
      .exec(function(err, result) {
        if (err) return callback(err);
        callback(err, _.pluck(result.Items, 'attrs'));
      });
    }
  };
};
