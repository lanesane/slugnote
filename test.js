var express = require('express');
var mongoose = require('mongoose')
var http = require('http');
var config = require('./config');

// Creates a database connection
mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Initialize Express app
var app = express();

app.use(express.logger('dev'));
app.use(express.json(/*{ strict: true }*/));

if (app.get('env') == 'development') {
	app.use(express.errorHandler());
}

// if behind reverse proxy (So in production)
// app.enable('trust proxy');

app.post('/post', function(req, res){
	res.send({
		errorcode: "200",
		user: "Billy"
	});
})
app.get('/', function(req, res) {
	res.send("Hey");
})

http.createServer(app).listen(config.server.port, function() {
	console.log(config.server.name + ' starting on port ' + config.server.port);
});
