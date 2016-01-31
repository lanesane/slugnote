var config = require('../config');

// Usage:
// var respond = require('/path/to/response');
// respond(response, status, request, data');
// ex:
// 	respond(res, 200, 'login', {
// 		token: 'blah',
// 		user: 'blah' //not actual output
// 	}

function respond(res, status, apiCall, data) {
	status = status || 200;

	res.send({
		status: status,
		call: apiCall,
		data: data
	});
}

function errorRespond(res, status, apiCall, ex){
	respond(res, status, apiCall)
	if (ex) throw ex;
}

module.exports = {
	respond: respond
}
