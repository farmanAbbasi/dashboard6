/**
 * Module dependencies.
 */
const express = require('express');
const router = module.exports = express.Router();
var login = require('../verify/verify.controller.js');
var notification = require('./notifications.controller');


    // notification routes
    router.get('/all', notification.getAll);
    router.get('/unseen', notification.getUnseen);
    router.put('/update/unseen', notification.update);
    router.get('/unread', notification.getRead);
    router.put('/update/unread', notification.update);

