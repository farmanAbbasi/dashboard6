var mongoose = require('mongoose');
var answers = require('./questions.model.js');
var answer = require('./question.model.js');
var common = require('../common/functions.js');
var post = require('../posts/post.model.js');

// , { sort: '_id' }
exports.findAll = function(req, res) {
  answers
    .find({}, '', function(err, obj) {
      if (!err) {
        res.send(obj);
      } else res.status(404).send({ message: 'no answers found' });
    })
    .sort([['_id', -1]]);
  // Retrieve and return all users from the database.
};

exports.findOne = function(req, res) {
  var userId = common.getUserFromToken(req);
  answers.findOne({ postId: req.params.postId }, function(err, obj) {
    if (obj) {
      obj.answers.forEach((answer, i) => {
        if (existsInArray(answer.upArray, userId)) {
          obj.answers[i].upvoted = true;
          obj.answers[i].downvoted = false;
        } else if (existsInArray(answer.downArray, userId)) {
          obj.answers[i].upvoted = false;
          obj.answers[i].downvoted = true;
        } else {
          obj.answers[i].upvoted = false;
          obj.answers[i].downvoted = false;
        }
      });
      res.status(200).send(obj);
    } else res.status(404).send({ message: 'not found' });
  });
};

exports.vote = function(req, res) {
  var userId = common.getUserFromToken(req);
  var voteObject = req.body;
  var upFlag;
  var downFlag;
  var proceed = true;
  var postCheck = {
    'answers._id': mongoose.Types.ObjectId(voteObject.voteId)
  };
  answers.findOne(postCheck, { 'answers.$': 1 }, function(err, obj) {
    if (err) {
      res.status(403).send({ msg: 'error' });
    } else {
      if (obj) {
        var updateObject;
        if (
          !existsInArray(obj.answers[0].upArray, userId) &&
          !existsInArray(obj.answers[0].downArray, userId)
        ) {
          if (voteObject.voteType === 'up') {
            upFlag = 1;
            downFlag = 0;
            updateObject = {
              $inc: {
                'answers.$.upvotes': 1
              },
              $push: {
                'answers.$.upArray': userId
              }
            };
          } else {
            upFlag = 0;
            downFlag = 1;
            updateObject = {
              $inc: {
                'answers.$.downvotes': 1
              },
              $push: {
                'answers.$.downArray': userId
              }
            };
          }
          proceed = true;
        } else if (
          existsInArray(obj.answers[0].upArray, userId) &&
          !existsInArray(obj.answers[0].downArray, userId)
        ) {
          if (voteObject.voteType === 'up') {
            proceed = false;
            res
              .status(403)
              .send({ msg: 'Already Upvoted', upFlag: 0, downFlag: 0 });
          } else {
            proceed = true;
            upFlag = -1;
            downFlag = +1;
            updateObject = {
              $inc: {
                'answers.$.downvotes': 1,
                'answers.$.upvotes': -1
              },
              $push: {
                'answers.$.downArray': userId
              },
              $pull: {
                'answers.$.upArray': userId
              }
            };
          }
        } else if (
          !existsInArray(obj.answers[0].upArray, userId) &&
          existsInArray(obj.answers[0].downArray, userId)
        ) {
          if (voteObject.voteType === 'down') {
            res
              .status(403)
              .send({ msg: 'Already DownVoted', upFlag: 0, downFlag: 0 });
            proceed = false;
          } else {
            proceed = true;
            upFlag = +1;
            downFlag = -1;
            updateObject = {
              $inc: {
                'answers.$.downvotes': -1,
                'answers.$.upvotes': 1
              },
              $pull: {
                'answers.$.downArray': userId
              },
              $push: {
                'answers.$.upArray': userId
              }
            };
          }
        }
        if (proceed) {
          answers.update(postCheck, updateObject, function(err, tank) {
            if (err) res.status(403).send({ msg: 'error' });
            else {
              res
                .status(200)
                .send({ msg: true, upFlag: upFlag, downFlag: downFlag });
            }
          });
        }
      }
    }
  });
};
exports.deleteAll = function(req, res) {
  console.log(req.params.objId);
  // delete all the comments on the basis of objId when post is deleted
  answers.deleteOne({ postId: req.params.objId }, function(err) {
    if (err) res.status(404).send({ message: 'object not found' });
    else res.status(200).send({ message: 'Successfully deleted' });
  });
};

exports.delete = function(req, res) {
  answers.update(
    { postId: req.params.objId },
    { $pull: { answers: { _id: req.params.answerId } } },
    function(err, obj) {
      if (err) res.status(403).send({ msg: 'Error' });
      else {
        if (!obj) res.status(404).send({ msg: 'Not found' });
        else {
          post.update(
            { _id: req.params.objId},
            {
              $inc: {
                comments: -1
              }
            },
            function(err, msg) {
              if (err) res.status(403).send({ msg: 'sorry' });
              else
              {
                post.update(
                    { bestAnswer: req.params.answerId},
                    {
                      $set: {
                        bestAnswer : null
                      }
                    },
                    function(err,msg){ 
                        if (err) res.status(403).send({ msg: 'sorry' });
                           else
                        res.status(200).send(true);
                    }
                );
              }
            }
          );
        }
      }
    }
  );
};

exports.create = function(req, res) {
  var answer = req.body;
  var user = common.getUserFromToken(req);
  var postCheck = {
    postId: answer.questionID
  };
  answers.findOne(postCheck, function(err, obj) {
    if (err) {
      res.status(403).send({ msg: 'error' });
    } else {
      if (obj) {
        var newAnswer = {};
        newAnswer.answer = answer.answer;
        newAnswer.userId = user;
        newAnswer.upvotes = 0;
        newAnswer.downvotes = 0;
        answers.update(
          {
            postId: answer.questionID
          },
          {
            $push: {
              answers: newAnswer
            }
          },
          function(err, tank) {
            if (err) res.status(403).send({ msg: 'error' });
            else {
              post.update(
                { _id: answer.questionID },
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
        var newAnswer = new answers();
        newAnswer.postId = answer.questionID;
        newAnswer.save(function(err) {
          if (err) {
            res.send(err);
          } else {
            var newAnswer = {};
            newAnswer.answer = answer.answer;
            newAnswer.userId = user;
            newAnswer.upvotes = 0;
            newAnswer.downvotes = 0;
            answers.update(
              {
                postId: answer.questionID
              },
              {
                $push: {
                  answers: newAnswer
                }
              },
              function(err, tank) {
                if (err) res.status(403).send({ msg: 'error' });
                else {
                  post.update(
                    { _id: answer.questionID },
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
exports.dateFromObjectId = function(objectId) {
  return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
};

function existsInArray(array, userId) {
  if (array.indexOf(userId) > -1) {
    return true;
  } else {
    return false;
  }
}
