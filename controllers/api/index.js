// All the modules exported here supply JSON API's
// for each of the models in the database.
module.exports = {
  Action: require('./action'),
  Comment: require('./comment'),
  FriendRequest: require('./friend-request'),
  Friend: require('./friend'),
  Status: require('./status'),
  User: require('./user')
};
