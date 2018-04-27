const express = require('express');
const router = module.exports = express.Router();
var users = require('./user.controller.js');
var login = require('../verify/verify.controller.js');

// Create a new user
router.post('/', login.isUserAuthenticated, users.create);

// Retrieve all users
router.get('/', login.isUserAuthenticated, users.findAll);

// Retrieve a single Note with noteId
router.get('/:userId', login.isUserAuthenticated, users.findOne);

// Update a user with userId
router.put('/:userId', login.isUserAuthenticated, users.update);

// Delete a user with userId
router.delete('/:userId', login.isUserAuthenticated, users.delete);
