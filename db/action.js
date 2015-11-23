module.exports = function(vogels) {
  // This is a generic bucket for all of a user's
  // status updates, new friendships, profile updates, etc.
  // I'm thinking that maybe we'll have to have a MapReduce job that
  // crunches this data into a NewsFeed. Otherwise we'll have to query
  // on it for all friends of a user every time we load news feed.
  var Action = vogels.define('Action', {
    hashKey: 'actorEmail',
    rangeKey: 'datetime',
    schema: {
      actorEmail: Joi.string(),
      datetime: Joi.date(),
      actionData: Joi.string() // arbitrary stringified JSON data
    }
  });

  return {
    model: Action
    // Additional Action functions here
  };
};
