/*
 * The university class
 */

var config = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');
var async = require('async');

// Structure of the University class
var universitySchema = new mongoose.Schema({
	name: { type: String, default: "" },
	courses: { type: Array },
	createdAt: { type: Date, default: Date.now },
	modifiedAt: { type: Date, default: Date.now }
});

// Aliases object.id to object._id 
universitySchema.virtual('id').get(function() {
	return this._id;
});

// Allows one to use the University object from another file
module.exports = mongoose.model('University', universitySchema);

