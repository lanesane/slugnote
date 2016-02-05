var express = require('express');
var mongoose = require('mongoose');
var http = require('http');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var config = require('./config');
var fs = require('fs');

var routes = require('./objects/routes');
var note = require('./objects/note');
var university = require('./objects/university');
var course = require('./objects/course');
var teacher = require('./objects/teacher');
var term = require('./objects/term');
var user = require('./objects/user');

process.env.NODE_ENV = 'development'; // change to production

// Create the database connection
mongoose.connect('mongodb://' + config.db.host + ":" + config.mongo.port + '/' + config.db.name, function(err, db) {
	if(err) { return console.dir(err); }

	console.log("connected.");
});


// Initialize express app
var app = express();

// uses JSON
app.use(bodyParser.json({ strict: true }));
// for logging
app.use(routes.checkRequest);
// error handling
app.use(function (ex, req, res, next) {
	if (ex) {
		res.status(503).send("Internal Server Error - Somethin happened. Ooops.")
		throw ex;
	} else {
		next();
	}
});

app.use(errorHandler());

if(app.get('env') == 'development') {
	app.use(logger('dev'));
} else { }

app.enable('trust proxy');

// API Command time :D
app.post('/note/create', routes.createNote);
app.post('/note/info', routes.getNoteInfo);
app.post('/note/get', routes.getNote);
app.post('/university/create', routes.createUniversity);
app.post('/token/getTTL', routes.getTokenTTL);
app.post('/user/create', routes.createUser);
app.post('/user/get', routes.getUserInfo);
app.post('/university/list', routes.getUniversityList);
app.post('/course/list', routes.getCourseList);


var server = http.createServer(app);
server.listen(config.server.port, function () {
	console.log("server listening");
});