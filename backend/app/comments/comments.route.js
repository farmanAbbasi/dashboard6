const express = require('express');
const router = (module.exports = express.Router());
//var login = require('../login/login.controller');
var comments = require('./comments.controller.js');

// Create a new user
router.post('/', comments.comments);

// Retrieve all posts
router.get('/', comments.findAll);

//get one
router.get('/:postId', comments.findOne);

//delete whole comment object
router.delete('/:objId',comments.deleteAll);

//delete one comment
router.delete('/:objId/:commentId',comments.delete);