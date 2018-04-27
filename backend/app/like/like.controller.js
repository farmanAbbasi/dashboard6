var mongoose = require('mongoose');
var parse = require('parse-bearer-token');
var atob = require('atob');
var like = require('./like.model.js');
var post = require('../posts/post.model.js');
var common = require('../common/functions.js');

exports.delete = function(req, res) {
    // Delete a user with the specified userId in the request
    like.deleteOne({ postid: req.params.postId }, function(err) {
        if (err)
            res.status(404).send({ message: "object not found" });
        else
            res.status(200).send({ message: "Successfully deleted" });
    })
};

exports.like = function(req, res) {
    var user = common.getUserFromToken(req);
    var postCheck = {
        postid: req.params.postId,
    };
    var postLikeCheck = {
        postid: req.params.postId,
        likes: user
    };
    like.findOne(postCheck, function(err, obj) {
        if (err) {
            res.status(403).send({ msg: "error" });
        } else {
            if (!obj)
                res.status(404).send({ msg: "post not found" });
            else
                like.findOne(postLikeCheck, function(err, obj) {
                    if (err) {
                        res.status(403).send({ msg: "error" });
                    } else {
                        if (!obj) {
                            like.update({
                                    postid: req.params.postId
                                }, {
                                    $push: {
                                        likes: user
                                    }
                                },
                                function(err, tank) {
                                    if (err)
                                        res.status(403).send({ msg: "error" });
                                    else {
                                        post.update({ _id: req.params.postId }, {
                                                $inc: {
                                                    likes: 1
                                                }
                                            },
                                            function(err, msg) {
                                                if (err)
                                                    res.status(403).send({ msg: "sorry" });
                                                else
                                                    res.status(200).send(true)
                                            }
                                        );
                                    }
                                });

                        } else {
                            res.send("Post already liked")
                        }
                    }
                });

        }
    });
};


// Unlike function
exports.unlike = function(req, res) {
    var user = common.getUserFromToken(req);
    var postCheck = {
        postid: req.params.postId,
    };
    var postLikeCheck = {
        postid: req.params.postId,
        likes: user
    };
    like.findOne(postCheck, function(err, obj) {
        if (err) {
            res.status(403).send({ msg: "error" });
        } else {
            if (!obj)
                res.status(404).send({ msg: "post not found" });
            else
                like.findOne(postLikeCheck, function(err, obj) {
                    if (err) {
                        res.status(403).send({ msg: "error" });
                    } else {
                        if (obj) {
                            // unlike
                            like.update({
                                    postid: req.params.postId
                                }, {
                                    $pull: {
                                        likes: user
                                    }
                                },
                                function(err, tank) {
                                    if (err)
                                        res.status(403).send({ msg: "error" });
                                    else {
                                        post.update({ _id: req.params.postId }, {
                                                $inc: {
                                                    likes: -1
                                                }
                                            },
                                            function(err, msg) {
                                                if (err)
                                                    res.status(403).send({ msg: "sorry" });
                                                else
                                                    res.status(200).send(false)
                                            }
                                        );
                                    }

                                });
                        } else {
                            res.send("Post already unliked")
                        }
                    }
                });
        }
    });
}

// Creates a new like object in mongo db
exports.creatLike = function(req, res) {
    like.insertMany({ postid: req.params.postId }, function(err, obj) {
        if (err)
            res.status(204).send("Cannot create like for post")
        res.status(200).send({ msg: "Success" });
    });
}