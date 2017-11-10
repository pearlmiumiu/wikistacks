
'use strict'
var express = require('express');
var router=express.Router();
var app = express();

module.exports = function makeRouterWithSockets (io) {
	router.get('/', function(req, res){
 	res.send('index.html');
 	});

	return router
}
 