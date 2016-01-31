/*
 * The course class
 */

var config = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');
var async = require('async');

// Structure of the Course class
var courseSchema = new mongoose.Schema({
	name: { type: String, default: "" },
	teachers: { type: Array },
	notes: { type: Array },
	terms: { type: Array },
	createdAt: { type: Date, default: Date.now },
	modifiedAt: { type: Date, default: Date.now }
});

// Aliases object.id to object._id 
courseSchema.virtual('id').get(function() {
	return this._id;
});

// Allows one to use the Course object from another file
module.exports = mongoose.model('Course', courseSchema);

