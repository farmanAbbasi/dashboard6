var mongoose = require('mongoose');
var User = require('./user.model.js');
exports.create = function (req, res) {
    // Create and Save a new User
    if (!req.body.username) {
        return res.status(400).send({ message: "User can not be empty" });
    }

    var user = new User({ firstname: req.body.firstname, username: req.body.username });

    user.save(function (err, data) {
        if (err) {
            console.log(err);
            res.status(500).send({ message: "Some error occurred while creating the Note." });
        } else {
            res.send(data);
        }
    });

};
// , { sort: '_id' }
exports.findAll = function (req, res) {
    User.find({}, '-_id', function (err, obj) {
        if (!err) {
            res.send(obj);
        }
        else res.status(404).send({ message: "no users found" })
    });
    // Retrieve and return all users from the database.
};

exports.findOne = function (req, res) {
    User.findOne({ username:req.params.userId}, '-_id', function (err, obj) {
        if (obj != null)
            res.send(obj);
        else res.status(404).send({ message: "not found" });
    });
    // Find a single user with a userId
};

exports.update = function (req, res) {
    var query = { username: req.params.userId };
    User.update(query, { firstname: 'abhishek' },{ new: true }, function (err, tank) {
        if (err) return handleError(err);
        res.send(tank);
    });
    // Update a user identified by the userId in the request
};

exports.delete = function (req, res) {
    // Delete a user with the specified userId in the request

};