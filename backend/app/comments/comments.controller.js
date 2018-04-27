var mongoose = require('mongoose');
var comments = require('./comments.model.js');
var comment = require('./comment.model.js');
var common = require('../common/functions.js');
var post = require('../posts/post.model.js');

// , { sort: '_id' }
exports.findAll = function(req, res) {
  comments
    .find({}, '', function(err, obj) {
      if (!err) {
        res.send(obj);
      } else
        res.status(404).send({
          message: 'no comments found'
        });
    })
    .sort([['_id', -1]]);
  // Retrieve and return all users from the database.
};

exports.findOne = function(req, res) {
  comments.findOne({ postId: req.params.postId }, function(err, obj) {
    if (obj) res.send(obj);
    else res.status(404).send({ message: 'not found' });
  });
  // Find a single user with a userId
};

exports.update = function(req, res) {
  // Update a user identified by the userId in the request
};

exports.deleteAll = function(req, res) {
  // delete all the comments on the basis of objId when post is deleted
  comments.deleteOne({ postId: req.params.objId }, function(err) {
    if (err) res.status(404).send({ message: 'object not found' });
    else res.status(200).send({ message: 'Successfully deleted' });
  });
};
exports.delete = function(req, res) {
  // Delete a user with the specified userId in the request
  comments.update(
    { postId: req.params.objId },
    { $pull: { comments: { _id: req.params.commentId } } },
    function(err, obj) {
      if (err) res.status(403).send({ msg: 'Error' });
      else {
        if (!obj) res.status(404).send({ msg: 'Not found' });
        else {
          post.update(
            { _id: req.params.objId },
            {
              $inc: {
                comments: -1
              }
            },
            function(err, msg) {
              if (err) res.status(403).send({ msg: 'sorry' });
              else res.status(200).send(true);
            }
          );
        }
      }
    }
  );
};

exports.comments = function(req, res) {
  var answer = req.body;
  var user = common.getUserFromToken(req);
  var postCheck = {
    postId: answer.postId
  };
  comments.findOne(postCheck, function(err, obj) {
    if (err) {
      res.status(403).send({ msg: 'error' });
    } else {
      if (obj) {
        var newComment = {};
        newComment.comment = answer.comment;
        newComment.userId = user;
        comments.update(
          {
            postId: answer.postId
          },
          {
            $push: {
              comments: newComment
            }
          },
          function(err, tank) {
            if (err) res.status(403).send({ msg: 'error' });
            else {
              post.update(
                { _id: answer.postId },
                {
                  $inc: {
                    comments: 1
                  }
                },
                function(err, msg) {
                  if (err) res.status(403).send({ msg: 'sorry' });
                  else res.status(200).send(true);
                }
              );
            }
          }
        );
      } else {
        var newComment = new comments(req.body);
        newComment.save(function(err) {
          if (err) {
            res.send(err);
          } else {
            console.log('Comment Created');
            var newComment = {};
            newComment.comment = answer.comment;
            newComment.userId = user;
            comments.update(
              {
                postId: answer.postId
              },
              {
                $push: {
                  comments: newComment
                }
              },
              function(err, tank) {
                if (err) res.status(403).send({ msg: 'error' });
                else {
                  post.update(
                    { _id: answer.postId },
                    {
                      $inc: {
                        comments: 1
                      }
                    },
                    function(err, msg) {
                      if (err) res.status(403).send({ msg: 'sorry' });
                      else res.status(200).send(true);
                    }
                  );
                }
              }
            );
          }
        });
      }
    }
  });
};
