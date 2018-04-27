var mongoose = require('mongoose');
var NotificationSchema = new mongoose.Schema({
   recipientid : String,
   postid : String,
   commentid : String,
   notificationtype : String,
   isread : Boolean,
   isseen : Boolean,
   isdeleted : Boolean,
   image : String,
   comment : String
});
module.exports= mongoose.model('Notification', NotificationSchema);


