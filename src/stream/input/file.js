var fs = require('fs');
var Promise = require('bluebird');

var ENCODING = 'utf8';

exports.read = function(handler) {

	var file = this.file;

	if (!file) {
		throw new Error('File not specified');
	}

	return new Promise(function(resolve, reject) {

		var stream = fs.createReadStream(file, ENCODING);

		stream.on('data', function(data) {

			var handle = handler(data);

			if (handle && handle.then) {
				stream.pause();
				handle.then(function() {
					stream.resume();
				});
			}
		});

		stream.on('error', function(error) {
			reject(error);
		});

		stream.on('end', function() {
			resolve();
		});
	});
};

exports.pipe = function(outputStream) {

	var file = this.file;

	if (!file) {
		throw new Error('File not specified');
	}

	return new Promise(function(resolve, reject) {

		var writePromise;
		var stream = fs.createReadStream(file, ENCODING);

		stream.on('data', function(data) {
			// strip trailing new lines
			data = stripTraillingLines(data);
			writePromise = outputStream.write(data);
		});

		stream.on('error', function(error) {
			reject(error);
		});

		stream.on('end', function() {
			resolve(writePromise);
		});
	});
};



function stripTraillingLines(data) {

	if (data[data.length - 1] !== '\n') {
		return data;
	}

	return stripTraillingLines(data.substring(0, data.length - 1));
}
