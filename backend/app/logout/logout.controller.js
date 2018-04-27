// Logout function
exports.logout = function (req, res) {
    req.logOut();
    req.session.destroy(function (err) {
        res.clearCookie('connect.sid');
        res.status(200).json({
            msg: 'Logged Out Successfully'
        });
    });
};
