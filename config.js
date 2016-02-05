var fs = require('fs');

// Everything that will be accessible from another script that uses config.js
module.exports = {
	auth: {
		//cert: fs.readFileSync("./ssl/server.crt"),
		//key: fs.readFileSync("./ssl/server.key"),
		tokenTTL: 604800, //One week
		authDelay: 400 // Change based on the computer it's running on... or just make it something relatively high
	},
	db: {
		host: "127.0.0.1",
		name: "test"
	},
	log: {
		logFile: "log.txt"
	},
	password: {
		saltLength: 32,
		saltWorkFactor: 12,
	},
	server: {
		version: '0.0.1',
		port: 8081,
		name: 'SlugNote API'
	},
	mongo: {
		port: 27017
	}
};
