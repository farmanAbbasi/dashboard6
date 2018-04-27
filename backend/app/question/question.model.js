var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
module.exports.answerObject = new mongoose.Schema({
  userId: String,
  answer: String,
  upArray: [String],
  downArray: [String],
  upvotes: Number,
  downvotes: Number,
  upvoted: Boolean,
  downvoted: Boolean
});