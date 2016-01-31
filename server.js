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

process.env.NODE_ENV = 'development'; // change to production

// Create the database connection
mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log("Server: " config.db.host + "/" + config.server.port + " with db " + config.db.name);
});

// Initialize express app
var app = express();

// uses JSON
app.use(bodyParser.json({ strict: true }));
// for logging
app.use(routes.checkRequest);
// error handling
app.use(function(ex, req, res, next) {
	if (ex) {
		res.status(503).send("Internal Server Error")
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
app.post('/post/note/createNote', routes.createNote);
app.post('/post/note/getNoteInfo', routes.getNoteInfo);
app.post('/post/note/getNote', routes.getNote);
app.post('/post/university/createUniversity', routes.createUniversity);
app.post('/post/university/getUniversityInfo', routes.getUniversityInfo);
app.post('/post/user/getTokenTTL', routes.getTokenTTL);