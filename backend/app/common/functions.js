var parse = require('parse-bearer-token');
var atob = require('atob');
exports.getUserFromToken = function(req) {
    try {
        var jwtToken = parse(req);
        var jwtTokenObject = JSON.parse(atob(jwtToken.split('.')[1]));
        return jwtTokenObject.unique_name.substring(0, jwtTokenObject.unique_name.lastIndexOf("@"));
    } catch (error) {
        return null;
    }
};
exports.getUserNameFromToken = function(req) {
    try {
        var jwtToken = parse(req);
        var jwtTokenObject = JSON.parse(atob(jwtToken.split('.')[1]));
        return jwtTokenObject.given_name + ' ' + jwtTokenObject.family_name;
    } catch (error) {
        return null;
    }
};