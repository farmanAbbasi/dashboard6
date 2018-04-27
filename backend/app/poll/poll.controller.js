var mongoose = require('mongoose');
var parse = require('parse-bearer-token');
var atob = require('atob');
var poll = require('./poll.model.js');
var post = require('../posts/post.model.js');
var common = require('../common/functions.js');


// Creates a new poll object in db
exports.createPoll = function (req, res) {
    var len = req.body.length;
    var choicearray = [];
    for (let i = 0; i < len; i++) {
        choicearray[i] = 0;
    }
    poll.insertMany({ postid: req.params.postId, choices: choicearray }, function (err, obj) {
        if (err) {
            res.status(403).send({ msg: "Cannot create a pollobject in db" });
            console.log(err);
        }
        else {
            res.status(200).send({ msg: "Success" });
        }
    });
}


exports.poll = function (req, res) {
    // to get the username

    var user = common.getUserFromToken(req);
    var pollCheck = {
        postid: req.params.postId,
    };
    var polledCheck = {
        postid: req.params.postId,
        users: user
    };


    var options = Number(req.body.choiceNumber);
    console.log(options);
    var opt = {};
    opt['choices.' + options] = 1;
    poll.findOne(pollCheck, function (err, obj) {
        if (err) {
            res.status(403).send({ msg: "error" });
        } else {
            if (!obj)
                res.status(404).send({ msg: "Userid not found" });
            else
                poll.findOne(polledCheck, function (err, obj) {
                    if (err) {
                        res.status(403).send({ msg: "error" });
                    } else {
                        if (!obj) {

                            poll.update({
                                postid: req.params.postId
                            }, {
                                    $push: {
                                        users: user
                                    }
                                },
                                function (err, tank) {
                                    if (err) {

                                        res.status(403).send({ msg: "error" });
                                    }
                                    else {

                                        poll.updateOne(
                                            { postid: req.params.postId }, {
                                                $inc: opt
                                            },
                                            function (err, msg) {
                                                if (err) {

                                                    res.status(403).send({ msg: "sorry" });
                                                }
                                                else {

                                                    res.status(200).send();

                                                }
                                            }
                                        );
                                    }
                                });

                        } else {
                            res.send("User already made a poll choice");
                        }
                    }
                });

        }
    });
};


// Delete a poll with the specific postId
exports.delete = function (req, res) {
    poll.deleteOne({ postid: req.params.postId }, function (err) {
        if (err)
            res.status(404).send({ message: "object not found" });
        else
            res.status(200).send({ message: "Successfully deleted" });
    })
};

exports.getPollResults = function (req, res) {
    poll.findOne({ postid: req.params.postId }, function (err, obj) {
        if (err)
            res.status(403).send({ message: "error" });
        else {
            if (!obj) {
                res.status(404).send({ message: "object not found" });
            }
            else {
                res.status(200).send(obj);
            }
        }
    })

}

