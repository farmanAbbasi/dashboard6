const express = require('express');
const router = module.exports = express.Router();
var poll = require('./poll.controller.js');
var login = require('../verify/verify.controller.js');

// Create new poll object in DB
router.post('/createPoll/:postId', poll.createPoll);

router.post('/:postId',poll.poll);

//Route to get poll results
router.get('/:postId', poll.getPollResults);

router.delete('/:postId',poll.delete);

