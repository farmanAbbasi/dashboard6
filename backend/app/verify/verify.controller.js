var parse = require('parse-bearer-token');
var atob = require('atob');
const config = {
    JWK_URI: "https://login.microsoftonline.com/common/discovery/keys",
    ISS: "https://sts.windows.net/371cb917-b098-4303-b878-c182ec8403ac/",
    AUD: "00000003-0000-0000-c000-000000000000"
};
exports.isUserAuthenticated = function (req, res, next) {
    try {
        var jwtToken = parse(req);
        var jwtTokenObject = JSON.parse(atob(jwtToken.split('.')[1]));
        if (jwtTokenObject.iss === config.ISS && jwtTokenObject.aud === config.AUD) {
            return next();
        }
    } catch (error) {
        res.status(401).json({
            msg: 'Unauthorized'
        });
    }
}
