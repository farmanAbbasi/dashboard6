const express = require('express');
const router = module.exports = express.Router();
var like = require('./like.controller.js');
var login = require('../verify/verify.controller.js');

// Like a new post
router.get('/:postId',  like.like);

router.get('/unlike/:postId',like.unlike);

// Create new like object in DB
router.get('/createlike/:postId', like.creatLike);

router.delete('/:postId', like.delete);
