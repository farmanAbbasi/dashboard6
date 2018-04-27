var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var comment = require('./comment.model.js');
var CommentsSchema = new mongoose.Schema({
    postId: String,
    comments: [comment.commentObject]
});
module.exports = mongoose.model('comments', CommentsSchema);