var Comment = require('../../db').Comment;

var onErr = function(err, res) {
  err && console.log(err);
  res.status(500).send(err);
};

exports.post = function(req, res) {
  var comment = req.body;
  if (!comment.parentId || !comment.content) {
    return onErr('Insufficient data', res);
  }
  comment.likes = [];
  comment.datePosted = new Date();
  comment.commenterId = req.session.user._id;

  Comment.create(comment, {}, function(err, comment) {
    if (err) return onErr(err, res);
    res.send(comment);
  });
};

exports.getCommentsOnItem = function(req, res) {
  Comment.getCommentsOnItem(req.params.id, function(err, comments) {
    if (err) return onErr(err, res);
    res.send(comments);
  });
};
