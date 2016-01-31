/*
 * The term class
 */

var config = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');
var async = require('async');

// Structure of the Term class
var termSchema = new mongoose.Schema({
	name: { type: String, default: "" },
	courses: { type: Array },
	universities: { type: Array },
	createdAt: { type: Date, default: Date.now },
	modifiedAt: { type: Date, default: Date.now }
});

// Aliases object.id to object._id 
termSchema.virtual('id').get(function() {
	return this._id;
});

// Allows one to use the Term object from another file
module.exports = mongoose.model('Term', termSchema);

