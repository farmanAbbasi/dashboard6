var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
        firstname: String,
        lastname: String,
        userrole: String,
        activestatus: Boolean,
        username: String  
});

module.exports = mongoose.model('users', UserSchema);
