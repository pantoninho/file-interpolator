var fs = require('fs');
var Path = require('path');
var mkdirp = require('mkdirp');
var Promise = require('bluebird');

var ENCODING = 'utf8';

exports.toFile = toFile;

function toFile(file) {

	var stream, path;

	path = Path.dirname(file);

	return {
		write: function(data) {

			if (!stream) {
				return createDirectories(path)
					.then(function() {
						stream = fs.createWriteStream(file, ENCODING);
					})
					.then(function() {
						return writer(stream, data);
					});
			}

			return writer(stream, data);

		},
		end: function() {
			stream.end();
		}
	};
}

function writer(stream, data) {
	return new Promise(function(resolve, reject) {

		stream.write(data, function() {
			resolve();
		});

		stream.on('error', function(error) {
			reject(error);
		});
	});
}

function createDirectories(path) {
	return new Promise(function(resolve, reject) {

		mkdirp(path, function(err) {
			if (err) {
				reject(err);
				return;
			}

			resolve();
		});
	});
}
