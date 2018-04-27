var mongoose = require('mongoose');
var ads = require('./ads.model.js');

exports.findAll = function (req, res) {
 
    ads.find({ $where: function() {
        return (this.eff_timestamp < new Date()) // filteration of ads for eff_timestamp
     } }, '-_id', function (err, obj) {
        if (!err) {
            res.send(obj);
        }
        else res.status(404).send({ message: "no ads found" })
    });
   
};