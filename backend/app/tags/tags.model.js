var mongoose = require('mongoose');
var tag = require('./tag.model');

var TagsSchema = new mongoose.Schema({
    tagsArray:[tag.TagSchema]
});

module.exports = mongoose.model('tags', TagsSchema);