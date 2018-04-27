var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
module.exports.commentObject = new mongoose.Schema({
    userId: String,
    comment: String

});