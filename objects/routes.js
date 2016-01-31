var config = require('../config');
var respond = require('./response').respond;
var Note = require('./note');
var University = require('./university');
var Course = require('./course');
var Teacher = require('./teacher');
var Term = require('./term');
var User = require('./user');
var ObjectId = require('mongoose').Types.ObjectId;
var crypto = require('crypto');

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
function createToken(req, res, callback) {
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
				respond(res, 200, 'createToken', {
					authToken: token
				});
			}
			else {
				console.log("What the fuck? There was a collision in a token");
				createToken(req, res, user, callback);
			}
		});
	});
}

// Creates a user
function createUser(req, res) {
	console.log("yo");
	var user = new User({
		email: req.body.userEmail,
		name: req.body.userName
	});
	console.log(user);
	user.setPassword(req.body.userPassword, function(ex) {
		if (ex) throw ex;

		console.log("1: " + user);
		db.users.save(user, function(ex, _user) {
			console.log("2: " + user);
			if (ex) throw ex;

			createToken(req, res, user, function(ex, user, token) {
				if (ex) throw ex;

				respond(res, 200, 'createUser', {
					userId: user.id,
					authToken: token
				});
			});
		});
	});
	console.log("what");
}

// Gets a user's information
function getUserInfo(req, res) {
	authenticate(req, res, 'getUserInfo', function(ex, authUserId) {

		getObjectId(res, 'getUserInfo', req.body.userId, function(ex, userId) {
			User.findById(userId, function(ex, user) {
				if (ex) throw ex;

				if (user) {
					respond(res, 200, 'getUserInfo', {
						userId : user.id,
						userEmail: user.email
					});
				}
				else {
					respond(res, 1005, 'getUserInfo');
				}
			});
		});
	});
}

// Creates a note
function createNote(req, res) {
	authenticate(req, res, 'createNote', function(ex, authUserId) {
		if (ex) throw ex;

		var note = new Note({
			userId: req.body.noteUserId,
			format: req.body.noteFormat,
			data: req.body.noteData,
			name: req.body.noteInfo.name,
			description: req.body.noteInfo.description,
			course_id: req.body.noteInfo.course.id,
			term_id: req.body.noteInfo.term.id,
			teacher_id: req.body.noteInfo.teacher.id,
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

					Course.findById(note.course_id, function(ex, currentCourse) {
						if (ex) throw ex;
						
						if (currentCourse) {

							Term.findById(note.term_id, function(ex, currentTerm) {
								if (ex) throw ex;
								
								if (currentTerm) {

									Teacher.findById(note.teacher_id, function(ex, currentTeacher) {
										if (ex) throw ex;
										
										if (currentTeacher) {

											respond(res, 200, 'getNoteInfo', {
												noteUserId : note.userId,
												noteTime : note.time,
												noteFormat : note.format,
												noteInfo : { 
													name : note.name,
													description : note.description,
													course : {
														id : currentCourse.id,
														name : currentCourse.name
													}, 
													term : {
														id : currentTerm.id,
														name : currentTerm.name
													},
													teacher : {
														id : currentTeacher.id,
														name : currentTeacher.name
													}
												}
											});
										}
									});
								}
							});
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

// Gets a note
function getNote(req, res) {
	authenticate(req, res, 'getNote', function(ex, authUserId) {

		getObjectId(res, 'getNote', req.body.noteId, function(ex, noteId) {
			Note.findById(noteId, function(ex, note) {
				if (ex) throw ex;

				if (note) {

					Course.findById(note.course_id, function(ex, currentCourse) {
						if (ex) throw ex;
						
						if (currentCourse) {

							Term.findById(note.term_id, function(ex, currentTerm) {
								if (ex) throw ex;
								
								if (currentTerm) {

									Teacher.findById(note.teacher_id, function(ex, currentTeacher) {
										if (ex) throw ex;
										
										if (currentTeacher) {

											respond(res, 200, 'getNoteInfo', {
												noteUserId : note.userId,
												noteTime : note.time,
												noteFormat : note.format,
												noteData : note.data,
												noteInfo : { 
													name : note.name,
													description : note.description,
													course : {
														id : currentCourse.id,
														name : currentCourse.name
													}, 
													term : {
														id : currentTerm.id,
														name : currentTerm.name
													},
													teacher : {
														id : currentTeacher.id,
														name : currentTeacher.name
													}
												}
											});
										}
									});
								}
							});
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

// Creates a university
function createUniversity(req, res) {
	authenticate(req, res, 'createUniversity', function(ex, authUserId) {
		if (ex) throw ex;

		var university = new University({
			name: req.body.universityName
		});

		university.save(function(ex) {
			if (ex) throw ex;

			respond(res, 200, 'createUniversity', {
				universityId: university.id
			});
		});
	});
}

// Gets a university's information, mainly used for a list of courses from a university
function getUniversityInfo(req, res) {
	authenticate(req, res, 'getUniversityInfo', function(ex, authUserId) {

		getObjectId(res, 'getUniversityInfo', req.body.universityId, function(ex, universityId) {
			University.findById(universityId, function(ex, university) {
				if (ex) throw ex;

				if (university) {

					var course_list = university.courses;
					var json_array = "";

					for (var j = 0; j < course_list.length; j++) {
						Course.findById(course_list[j], function(ex, currentCourse) {
							if (ex) throw ex;

							if (currentCourse) {
								json_array += {
									courseId : currentCourse.id,
									courseName : currentCourse.name
								};
							}
						});
					}

					respond(res, 200, 'getUniversityInfo', { 
						universityId : university.id,
						array: {
							json_array
						}
					});
				}
				else {
					respond(res, 1005, 'getUniversityInfo');
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
            });
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
	createToken: createToken,
	createUser: createUser,
	getUserInfo: getUserInfo,
	createNote: createNote,
	getNoteInfo: getNoteInfo,
	getNote: getNote,
	createUniversity: createUniversity,
	getUniversityInfo, getUniversityInfo,
	getTokenTTL: getTokenTTL
}
