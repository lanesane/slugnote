var config = require('../config');
var respond = require('./response').respond;
var Note = require('./note');
var ObjectId = require('mongoose').Types.ObjectId;

var async = require('async');
var redis = require('redis');
var client = redis.createClient();

// Checks the api key; puts the stats in the database
// Handles banned ips, 
// rate limits
// anything else it will need to do
function checkRequest(req, res, next) {
	// https://stackoverflow.com/questions/12570923/express-3-0-how-to-use-app-locals-use-and-res-locals-use
	next();
}

// Pass before authenticating
function authenticate(req, res, method, callback) {
	// Check for the token and pass exeption and user to callback
	client.get('auth:token:' + req.body.authToken, function(ex, userId) {
		if (ex) throw ex;

		if (userId) {
			callback(null, userId);    
		}
		else {
			respond(res, 1001, method);
		}
	});
}

// Tries to convert a string to an object id. If it works, returns ObjectId. Otherwise, error
function getObjectId(res, method, string, callback){
	if (string.match(/^[0-9a-fA-F]{24}$/)) {
		callback(null, new ObjectId(string))
	}
	else {
		respond(res, 1004, method);
	}
}

// Creates an authentication token and puts it in the database
function createToken(req, res, user, callback) {
	crypto.randomBytes(64, function(ex, bytes) {
		if (ex) throw ex;
		
		token = bytes.toString('base64');
		client.exists('auth:token:' + token, function(ex, notUnique) {
			if (ex) throw ex;
			
			if (!notUnique) {
				client.set('auth:token:' + token, user.id, function(ex) {
					if (ex) throw ex;
					client.expire('auth:token:' + token, config.auth.tokenTTL);
				}); //Might not work
				callback(null, user, token)
			}
			else {
				console.log("What the fuck? There was a collision in a token");
				createToken(req, res, user, callback);
			}
		});
	});
}

// Creates a note
function createNote(req, res) {
	authenticate(req, res, 'createNote', function(ex, authUserId) {
		if (ex) throw ex;

		var _format = 0;
		switch(req.body.noteFormat) {
			case "PDF":
				format = 0;
				break;
			case "JPEG":
				format = 1;
				break;
			case "String":
				format = 2;
				break;
			default:
				// error - create throws
				break;
		};

		var note = new Note({
			user: req.body.noteUser,
			format: _format,
			instances: req.body.noteInstances,
			// data: [], - need to parse data
			name: req.body.noteInfo.name,
			description: req.body.noteInfo.description,
			course_id: req.body.noteInfo.course.id,
			course_name: req.body.noteInfo.course.name,
			term_id: req.body.noteInfo.term.id,
			term_name: req.body.noteInfo.term.name,
			teacher_id: req.body.noteInfo.teacher.id,
			teacher_name: req.body.noteInfo.teacher.name,
			time: req.body.noteTime
		});

		note.save(function(ex) {
			if (ex) throw ex;

			respond(res, 200, 'createNote', {
				noteId: note.id
			});
		});
	});
}

// Gets a note information
function getNoteInfo(req, res) {
	authenticate(req, res, 'getNoteInfo', function(ex, authUserId) {

		getObjectId(res, 'getNoteInfo', req.body.noteId, function(ex, noteId) {
			Note.findById(noteId, function(ex, note) {
				if (ex) throw ex;

				if (note) {
					respond(res, 200, 'getNoteInfo', {
						noteUser : note.user,
						noteTime : note.time,
						noteFormat : note.format,
						noteInstances : note.instances,
						noteInfo : {
							name : ,
							description : ,
							course : {
								id : ,
								name : 
							}, 
							term : {
								id : ,
								name : 
							},
							teacher : {
								id : ,
								name : 
							}
						}
					});
				}
				else {
					respond(res, 1005, 'getNoteInfo');
				}
			});
		});
	});
}

// Gets the TTL for a given authToken
function getTokenTTL(req, res) {
	client.ttl('auth:token:' + req.body.authToken, function(ex, ttl) {
		if (ex) throw ex;

		if (ttl > 0) {
            respond(res, 200, 'getTokenTTL', {
            	ttl: ttl
            })    
        }
        else {
            respond(res, 200, 'getTokenTTL', {
            	ttl: 0
            });
        }
	});
}

module.exports = {
	checkRequest: checkRequest,
	createNote: createNote,
	getNoteInfo: getNoteInfo,
	getNote: getNote,
	getTokenTTL: getTokenTTL
}
