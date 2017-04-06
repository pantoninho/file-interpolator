var fs = require('fs');
var Promise = require('bluebird');

var ENCODING = 'utf8';

exports.toFile = toFile;

function toFile(file) {

	var stream = fs.createWriteStream(file, ENCODING);

	return {
		write: function(data) {
			return new Promise(function(resolve, reject) {

				stream.write(data, function() {
					resolve();
				});

				stream.on('error', function(error) {
					reject(error);
				});
			});
		},
		end: function() {
			stream.end();
		}
	};
}
