var mongoose = require('mongoose');
var PostSchema = new mongoose.Schema({
    comments: Number,
    content: String,
    inspiredby: [String],
    likes: Number,
    media: String,
    multiplechoice: Boolean,
    posttype: String,
    tags: String,
    userid: String,
    choices: Object,
    statsvisible: Boolean,
    bestAnswer: String,
    isuserliked: Boolean,
    isuserpolled: Boolean,
    pollstats: [Number]
});
module.exports = mongoose.model('posts', PostSchema);