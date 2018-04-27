var mongoose = require('mongoose');
var Post = require('./post.model.js');
var common = require('../common/functions.js');
var Likes = require('../like/like.model');
var common = require('../common/functions.js');
var Polls = require('../poll/poll.model');
var _ = require('lodash');

exports.findAll = function (req, res) {
    if (
        req.query.skip == null ||
        req.query.skip == '' ||
        req.query.limit == null ||
        req.query.limit == ''
    ) {
        res.status(404).send({ msg: 'Skip & Limit values are important' });
    } else {
        var processing = 0,
            done = false;
        var finished = function (posts) {
            if (processing === 0 && done) {
                res.send(posts);
            }
        };
        Post.find({})
            .sort([
                ['_id', -1]
            ])
            .skip(parseInt(req.query.skip))
            .limit(parseInt(req.query.limit))
            .exec((error, posts) => {
                if (error) {
                    res.status(403).send({ msg: 'Error' });
                } else if (posts.length === 0) {
                    res.status(204).send({ msg: 'Posts not found' });
                } else {
                    var currentUser = common.getUserFromToken(req);
                    posts.forEach(function (post, i) {
                        processing++;
                        Likes.findOne({
                            postid: post._id,
                            likes: currentUser
                        },
                            function (err, obj) {
                                if (err) {
                                    posts[i]['isuserliked'] = false;
                                } else {
                                    if (!obj) posts[i]['isuserliked'] = false;
                                    else posts[i]['isuserliked'] = true;
                                    if (posts[i]['posttype'] === 'poll') {
                                        Polls.findOne({
                                            postid: post._id,
                                            users: currentUser
                                        },
                                            function (err, obj) {
                                                if (err) {
                                                    posts[i]['isuserpolled'] = false;
                                                } else {
                                                    if (!obj) posts[i]['isuserpolled'] = false;
                                                    else {
                                                        posts[i]['isuserpolled'] = true;
                                                        posts[i]['pollstats'] = obj.choices;
                                                    }
                                                    processing--;
                                                    finished(posts);
                                                }
                                            }
                                        );
                                    } else {
                                        processing--;
                                        finished(posts);
                                    }
                                }
                            }
                        );
                        done = true;
                        finished(posts);
                    });
                }
            });
    }
};

exports.findOne = function (req, res) {
    Post.findOne({ posttype: req.params.postType }, '-_id', function (err, obj) {
        if (obj) res.send(obj);
        else res.status(404).send({ message: 'not found' });
    });
    // Find a single user with a userId
};

exports.update = function (req, res) {
    // Update a user identified by the userId in the request
};

exports.delete = function (req, res) {
    // Delete a user with the specified userId in the request
    Post.findByIdAndRemove(req.params.postId, function (err) {
        if (err) res.status(404).send({ message: 'object not found' });
        else res.status(200).send({ message: 'Successfully deleted' });
    });
};

exports.updateOne = function (req, res) {
    var query = { _id: req.params.questionId };
    Post.update(query, { bestAnswer: req.params.bestanswer }, function (err, obj) {
        if (obj) res.status(200).send(obj);
        else res.status(404).send({ message: 'not found' });
    });
    // Find a single user with a userId
};

exports.create = function (req, res) {
    var question = new Post(req.body);
    var user = common.getUserFromToken(req);
    question.userid = user;
    question.save(function (err) {
        if (err) { res.send(err); }
        else {
            res.status(200).send({ id: question._id, tags: question.tags });
        }
    });
};
