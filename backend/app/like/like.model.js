
var mongoose = require('mongoose');
var LikesSchema = new mongoose.Schema({
    _id: String,
    postid: String,
    likes: [String]

});
module.exports = mongoose.model('likes', LikesSchema);