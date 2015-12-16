var Comment = require('../../db').Comment;

var onErr = function(err, res) {
  err && console.log(err);
  res.status(500).send(err);
};

exports.getCommentsOnItem = function(req, res) {
  Comment.getCommentsOnItem(req.params.id, function(err, comments) {
    if (err) return onErr(err, res);
    res.send(comments);
  });
};
