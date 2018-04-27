const express = require('express');
const router = module.exports = express.Router();
var verify = require('../verify/verify.controller');
var tags = require('../tags/tags.controller');


// Retrieve all tags
router.get('/searchtags/:firstletter', tags.search);

// //Create an entry in tags table 
router.post('/createtag/', tags.tagsCreate);
