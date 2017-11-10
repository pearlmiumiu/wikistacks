'use strict';
var express = require('express');
var app = express();
var morgan = require('morgan');
 var nunjucks = require('nunjucks');
 var makesRouter = require('./routes');
// var fs = require('fs');
 var path = require('path');
// var mime = require('mime');
 var bodyParser = require('body-parser');
var socketio = require('socket.io');

// templating boilerplate setup
// instance, which we'll want to use to add Markdown support later.
var env = nunjucks.configure('views', {noCache: true});
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files, have it use nunjucks to do so
app.engine('html', nunjucks.render);



// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests


// start the server
var server = app.listen(1337, function(){
  console.log('listening on port 1337');
});
var io = socketio.listen(server);

 app.use(express.static(path.join(__dirname, '/public')));

// // modular routing that uses io inside it
 app.use('/', makesRouter(io));


// // manually-written static file middleware
// app.use(function(req, res, next){
//   var mimeType = mime.lookup(req.path);
//   fs.readFile('./public' + req.path, function(err, fileBuffer){
//     if (err) return next();
//     res.header('Content-Type', mimeType);
//     res.send(fileBuffer);
//   });
// });