var Status = require('../../db').Status;

var onErr = function(err, res) {
  err && console.log(err);
  res.status(500).send(err);
};

exports.post = function(req, res) {
  var status = req.body;
  if (!status.content) {
    return onErr('Status cannot be empty', res);
  }
  status.posterId = req.session.user._id;
  status.recipientId = status.recipientId || status.posterId;
  status.datePosted = new Date();
  status.likes = [];
  // Creating Status will initialize fields like _id
  Status.create(status, {}, function(err, status) {
    if (err) return onErr(err, res);
    res.send(status);

    // Add status to all of user's friends' Actions lists
    //
    //
    //
  });
};
