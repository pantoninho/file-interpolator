var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

var ENCODING = 'utf8';

exports.write = function(data) {

	var file = this.file;

	if (!file) {
		throw new Error('File not specified');
	}

	if (!this.stream) {
		var that = this;
		return initStream(file).then(function(stream) {
			that.stream = stream;
			return writer(stream, data);
		});
	}

	return writer(this.stream, data);
};

exports.end = function() {

	var stream = this.stream;

	if (!stream) {
		throw new Error('Stream not initiated');
	}

	stream.end();
};


function writer(stream, data) {
	return new Promise(function(resolve) {
		stream.write(data, function() {
			resolve();
		});
	});
}

function initStream(file) {

	var pathToFile = path.dirname(file);

	return createDirectories(pathToFile)
		.then(function() {
			var stream;

			stream = fs.createWriteStream(file, ENCODING);

			stream.on('error', function(error) {
				return new Error(error);
			});

			return stream;
		});
}

function createDirectories(path) {

	return new Promise(function(resolve, reject) {

		mkdirp(path, function(err) {
			if (err) {
				return reject(err);
			}

			resolve();
		});
	});
}


