var mongoose = require('mongoose');
var PollsSchema = new mongoose.Schema({
    _id: String,
    postid: String,
    choices: [Number],
    users: [String]
});
module.exports = mongoose.model('polls',PollsSchema);