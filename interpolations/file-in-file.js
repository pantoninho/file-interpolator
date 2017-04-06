var fs = require('fs');
var interpolator = require('../interpolator');
var Promise = require('bluebird');

var ENCODING = 'utf8';

/**
 * Replaces a placeholder inside a source file with a given content from another file
 * @return {Promise}            Returns an A++ promise that will be resolved with the outputFile when the writing is done
 */
module.exports = function(options) {

	// TODO: this looks messy.. find some other way
	return interpolator(options.sourceFile, options.placeholder, options.outputFile, insert);

	function insert(outputStream) {
		return pipe(fs.createReadStream(options.contentFile, ENCODING), outputStream);
	}
};

function pipe(inputStream, outputStream) {
	return new Promise(function(resolve, reject) {
		inputStream.on('data', function(data) {

			// strip newline at the end of the file, if exists
			// TODO: this may cause a bug if this buffer ends in a newline and is supposed to
			// this should be done elsewhere.. but its too late.
			if (data.charAt(data.length - 1) === '\n') {
				data = data.substring(0, data.length - 1);
			}

			outputStream.write(data);
		});

		inputStream.on('error', function(error) {
			reject(error);
		});

		inputStream.on('end', function() {
			resolve();
		});
	});
}
