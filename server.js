var express = require('express');
var mongoose = require('mongodb').MongoClient;
var http = require('http');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var config = require('./config');
var fs = require('fs');
var bcrypt = require('bcrypt');

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
app.post('/post/user/createUser', routes.createUser);
app.post('/post/user/getUserInfo', routes.getUserInfo);


var server = http.createServer(app);
server.listen(config.server.port, function () {
	console.log("server listening");
});