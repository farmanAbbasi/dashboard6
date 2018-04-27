const express = require('express');
const router = module.exports = express.Router();
var verify = require('../verify/verify.controller');
var posts = require('./post.controller.js');

// Create a new user
router.post('/', posts.create);

// Retrieve all posts
router.get('/', posts.findAll);

// Retrieve all posts of particular post type
router.get('/:postType', verify.isUserAuthenticated, posts.findOne);

// Update a post
router.put('/:postType', verify.isUserAuthenticated, posts.update);

// Delete a post
router.delete('/:postId', verify.isUserAuthenticated, posts.delete);
//update best answer
router.post('/:questionId/:bestanswer', verify.isUserAuthenticated, posts.updateOne);


