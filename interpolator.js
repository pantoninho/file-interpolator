var fs = require('fs');
var Promise = require('bluebird');

var ENCODING = 'utf8';

module.exports = function(sourceFile, placeholder, outputFile, insertFn) {

	var templateStream, outputStream;

	return new Promise(function(resolve, reject) {

		templateStream = fs.createReadStream(sourceFile, ENCODING);
		outputStream = fs.createWriteStream(outputFile, ENCODING);

		templateStream.on('data', function(data) {

			var placeholderPos;

			// check if placeholder exists in this data dump
			placeholderPos = data.indexOf(placeholder);

			// placeholder isnt included in this data dump, write it directly to the outputFile
			if (placeholderPos === -1) {
				outputStream.write(data);
				return;
			}

			// placeholder is included in this datadump
			// write data that exists before the placeholder
			outputStream.write(data.substring(0, placeholderPos));

			// pause the template stream, the next operation might take a while..
			templateStream.pause();

			// the insertFn allows the interpolator caller to decide what to insert into the placeholder
			// the insertFn expects a promise or nothing
			var promise = insertFn(outputStream);

			if (promise) {
				promise.then(endInterpolation);
				return;
			}

			endInterpolation();

			function endInterpolation() {
				// when the insertFn is done..
				// write the data that exists after the placeholder
				outputStream.write(data.substring(placeholderPos + placeholder.length));
				// resume the reading stream
				templateStream.resume();
			}
		});

		templateStream.on('error', function(error) {
			reject(error);
		});

		templateStream.on('end', function() {
			outputStream.on('finish', function() {
				resolve(outputFile);
			});
		});
	});
};
