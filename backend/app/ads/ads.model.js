var mongoose = require('mongoose');
var AdsSchema = new mongoose.Schema({
    adsredirecturl: String,
    description: String,
    imageurl: String,
    title: String,
    priority: [],
    userId: String,
    eff_timestamp: Number,
    end_timestamp: Number


});

module.exports = mongoose.model('ads', AdsSchema);
