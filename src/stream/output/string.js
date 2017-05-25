
var Promise = require('bluebird');


exports.write = function(data) {

	return new Promise(function(resolve) {
		resolve(data);
	});

};
