var mongoose = require('mongoose');
var User = require('../users/user.model.js');
var Posts = require('../posts/post.model.js');

exports.search = function (req, res) {
    // Create and Save a new User
    var query = req.body.query;
    var searchResults = {};
    if (!query) {
        return res.status(400).send({ message: "Empty Query" });
    }
    else {
        searchQuery = query.substring(1, query.length);
        searchQuery = RegExp("^.*" + searchQuery + ".*$");
        if (query.charAt(0) == '@') {
            Promise.all([searchUser(searchQuery), searchPostsByUser(searchQuery)]).then(function (searchData) {
                if (searchData[0].length != 0)
                    searchResults['users'] = searchData[0];
                if (searchData[1].length != 0)
                    searchResults['posts'] = searchData[1];
                res.status(200).send(searchResults);
            }).catch(function (searchData) {
                res.status(400).send({ msg: "error" });
            });
        }
        else if (query.charAt(0) == '#') {
            searchPostsByTags(searchQuery).then(function (searchData) {
                if (searchData != null) {
                    searchResults['posts'] = searchData;
                    res.status(200).send(searchResults);
                }
            });
        }
        else {
            Promise.all([searchPostsByTags(searchQuery), searchPostsByContent(searchQuery)]).then(function (searchData) {
                if (searchData[0].length != 0)
                    searchResults['posts'] = searchData[0];
                if (searchData[1].length != 0) {
                    var mergePosts = Object.assign({}, searchResults['posts'], searchData[1]);
                    searchResults['posts'] = mergePosts;
                }
                res.status(200).send(searchResults);
            }).catch(function (searchData) {
                res.status(400).send({ msg: "error" });
            });
        }
    }
};

function searchUser(query) {
    return Promise.resolve(User.find({ username: { $regex: query, $options: 'i' } }));
};

function searchPostsByUser(query) {
    return Promise.resolve(Posts.find({ userid: { $regex: query, $options: 'i' } }));
};

function searchPostsByContent(query) {
    return Promise.resolve(Posts.find({ content: { $regex: query, $options: 'i' } }));
};
function searchPostsByTags(query) {
    return Promise.resolve(Posts.find({ tags: { $regex: query, $options: 'i' } }));
};