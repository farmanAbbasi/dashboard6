const express = require('express');
const router = module.exports = express.Router();
var access = require('./logout.controller.js');

    // Logout session
    router.get('/', access.logout);
