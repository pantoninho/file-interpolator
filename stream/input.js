var fs = require('fs');
var Promise = require('bluebird');

var ENCODING = 'utf8';

exports.fromFile = fromFile;
exports.fromString = fromString;

function fromFile(file) {

	return {
		read: function(handler) {
			return new Promise(function(resolve, reject) {

				var stream = fs.createReadStream(file, ENCODING);

				stream.on('data', function(data) {
					stream.pause();

					handler(data).then(function() {
						stream.resume();
					});
				});

				stream.on('error', function(error) {
					reject(error);
				});

				stream.on('end', function() {
					resolve();
				});
			});
		},
		pipe: function(outputStream) {
			return new Promise(function(resolve, reject) {

				var stream = fs.createReadStream(file, ENCODING);
				var writePromise;

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
		}
	};
}

function fromString(string) {

	return {
		read: function(handler) {

			return new Promise(function(resolve) {
				handler(string);
				resolve();
			});
		},
		pipe: function(outputStream) {
			return outputStream.write(string);
		}
	};
}

function stripTraillingLines(data) {

	if (data[data.length - 1] !== '\n') {
		return data;
	}

	return stripTraillingLines(data.substring(0, data.length - 1));
}
