const express = require('express');
const router = module.exports = express.Router();
var ads = require('./ads.controller.js');


router.get('/', ads.findAll);