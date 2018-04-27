const express = require('express');
const router = (module.exports = express.Router());
//var login = require('../login/login.controller');
var question_responses = require('./question.controller.js');

// Create a new user
router.post('/', question_responses.create);
// Retrieve all posts
router.get('/', question_responses.findAll);

router.get('/:postId', question_responses.findOne);

router.post('/vote', question_responses.vote);

//delete answer
router.delete('/:objId/:answerId',question_responses.delete);

//delete all
router.delete('/:objId',question_responses.deleteAll);