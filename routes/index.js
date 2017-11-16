// 'use strict'

// var express = require('express');
// var router = express.Router();
// var app = express();
// var wikiRouter = require('./wiki')
// var userRouter = require('./user')

// // middleware
// router.use('/wiki', wikiRouter);
// router.use('/user', userRouter);

// // routes
// router.get('/', function(req, res, next) {
//  	 res.render('index');
//  });

// module.exports = router;


var models=require('../models');
var Page=models.Page;
var User=models.User;
var app=require('./app');

User.sync()
.then(function(){
	return Page.sync();
})
.then(function(){
	app.listen(3001, function(){
		console.log('Server is listening on port 3001');
	});
});