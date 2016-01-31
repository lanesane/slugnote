/*
 * The user class
 */

var config = require('../config');
var bcrypt = require('bcrypt');
var mongoose = require('mongoose');

// The structure of the user class
var userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { 
		hash: { type: String, required: true },
		dateSet: { type: Date, default: Date.now }, 
		needsReset: { type: Boolean, default: false }
	},
	createdAt: { type: Date, default: Date.now },
	modifiedAt: { type: Date, default: Date.now },
	logins: [] //Array of { address: String, time: Date }
});

// Creates a virtual id field on the object that can be used in place of _id
userSchema.virtual('id').get(function() {
	return this._id;
});


// On save, changed modifiedAt 
userSchema.pre('save', function(next) {
	this.modifiedAt = new Date;
});

// Sets the password hash, then calls callback
userSchema.methods.setPassword = function(password, callback) {
	var user = this;

	bcrypt.genSalt(config.password.saltWorkFactor, 
		config.password.saltLength, 
		function(ex, salt) {
			if (ex) throw ex;

			bcrypt.hash(password, salt, function(ex, hash) {
				if (ex) throw ex;
				
				user.password = {
					hash: hash,
					dateSet: new Date,
					needsReset: false
				};
				
				callback(null, user.password);
			});
		}
	);
}

// Checks the password against the database, then calls callback
userSchema.methods.checkPassword = function(password, callback) {
	var user = this;

	bcrypt.compare(password, user.password.hash, function(ex, matches) {
		if (ex) throw ex;
		
		callback(null, matches);
	});
}

// Allows one to use the User object from another file
module.exports = mongoose.model('User', userSchema);

