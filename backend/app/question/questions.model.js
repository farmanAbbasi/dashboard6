var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var answer = require('./question.model');
var AnswersSchema = new mongoose.Schema({
    postId: String,
    answers: [answer.answerObject]
});
module.exports = mongoose.model('answers', AnswersSchema);