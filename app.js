'use strict';
var express = require('express');
var app = express();
var morgan = require('morgan');
var nunjucks = require('nunjucks');
var router = require('./routes');
var bodyParser = require('body-parser');
//var models = require('./models');

// templating boilerplate setup
// instance, which we'll want to use to add Markdown support later.
var env = nunjucks.configure('views', {noCache: true});
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files, have it use nunjucks to do so
app.engine('html', nunjucks.render);


///?????????????????????????????????????????????????????????????
var AutoEscapeExtension=require('nunjucks-audoescape')(nunjucks);
env.addExtension('AutoEscapeExtension', new AutoEscapeExtension(env));

// logging middleware
app.use(morgan('dev'));

// body parsing middleware
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests


app.use('/wiki', wikiRouter);
app.use('/users', usersRouter);


app.use(express.static(__dirname+'/node_modules'));
app.use(express.static(__dirname+'/public'));

app.get('/', function(req, res){
	res.redirect('/wiki')
})


// sync the database and start the server
/*models.db.sync({}) // models.db.sync({force: true})
.then(function () {
    app.listen(1337, function() {
  	console.log('listening on port 1337');
	});
})
.catch(console.error);*/

//err middleware
app.use(function(err, req, res, next){
	console.error(err);
	res.status(err.status || 500).send(err.message|| 'Internal server Error');
})




module.exports=app;
