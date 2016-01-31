/*
 * The note class
 */

var config = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');
var async = require('async');

// Structure of the Note class
var noteSchema = mongoose.Schema({
	user: { type: String, default: "" },
	format: { type: String, required: true },
	data: [],
	name: { type: String, required: true },
	description: { type: String, default: "" },
	course_id: { type: Number, required: true },
	term_id: { type: Number, required: true },
	teacher_id: { type: Number },
	time: { type: Date, required: true },
	createdAt: { type: Date, default: Date.now },
	modifiedAt: { type: Date, default: Date.now }
});

// Aliases object.id to object._id 
noteSchema.virtual('id').get(function() {
	return this._id;
});

// Allows one to use the Note object from another file
module.exports = mongoose.model('Note', noteSchema);

