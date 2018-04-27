var mongoose = require('mongoose');
var Notification = require('./notifications.model');



// get all notification data read and unread both
exports.getAll = function (req, res, next) {
    Notification.find({}).exec(function (err, data) {
        if (!err) {
            res.send(data);
        } else {
            res.send(err);
        }
    });
}

// get only isseen notification data
exports.getUnseen = function (req, res, next) {
    Notification.find({ isseen : true }).exec(function (err, data) {
        if (!err) {
            Notification.count().exec(function (err, count) {
                res.jsonp({
                    data: data,
                    total: count
                });
            });
        } else {
            res.send(err);
        }
    });
}

/**
 * update isseen notification
 */
exports.update = function (req, res, next) {
    var ids = [];
    for (var i = 0; i < req.body.length; ++i) {
        ids.push(req.body[i]._id);
    }

    Notification.update({ _id: { "$in": ids } }, { isseen : false }, { multi: true }, function (err, docs) {
        if (!err) {
            res.send(docs);
        } else {
            res.send(err);
        }
    });
};

// get only isread notification data
exports.getRead= function (req, res, next) {
    Notification.find({ isread : true }).exec(function (err, data) {
        if (!err) {
            Notification.count().exec(function (err, count) {
                res.jsonp({
                    data: data,
                    total: count
                });
            });
        } else {
            res.send(err);
        }
    });
}

/**
 * update isread notification
 */
exports.update = function (req, res, next) {
    var ids = [];
    for (var i = 0; i < req.body.length; ++i) {
        ids.push(req.body[i]._id);
    }

    Notification.update({ _id: { "$in": ids } }, { isread : false }, { multi: true }, function (err, docs) {
        if (!err) {
            res.send(docs);
        } else {
            res.send(err);
        }
    });
};


