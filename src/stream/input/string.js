var Promise = require('bluebird');

exports.read = function(handler) {

	var string = this.string;

	if (!string && string !== '') {
		throw new Error('No string specified');
	}

	return new Promise(function(resolve) {
		handler(string);
		resolve();
	});
};

exports.pipe = function(outputStream) {

	var string = this.string;

	if (!string && string !== '') {
		throw new Error('No string specified');
	}

	return outputStream.write(string);
};
