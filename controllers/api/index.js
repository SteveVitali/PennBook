// All the modules exported here supply JSON API's
// for each of the models in the database.
// So, the routes module delegates JSON endpoint callbacks
// to these modules, and these modules delegate database calls
// to the db/<model> modules.
module.exports = {
  Action: require('./action'),
  Comment: require('./comment'),
  FriendRequest: require('./friend-request'),
  Friend: require('./friend'),
  Status: require('./status'),
  User: require('./user')
};
