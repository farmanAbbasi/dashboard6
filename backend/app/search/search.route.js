const express = require('express');
const router = module.exports = express.Router();
var users = require('./search.controller.js');
var login = require('../verify/verify.controller.js');

// Retrieve all users
router.post('/', users.search);
