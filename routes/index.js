'use strict'

var express = require('express');
var router = express.Router();
var app = express();
var wikiRouter = require('./wiki')
var userRouter = require('./user')

// middleware
router.use('/wiki', wikiRouter);
router.use('/user', userRouter);

// routes
router.get('/', function(req, res, next) {
 	 res.send('index.html');
 });

module.exports = router;
