var mongoose = require('mongoose');

module.exports.TagSchema = new mongoose.Schema({
    startsWith: String,
    tags:[String]
});

