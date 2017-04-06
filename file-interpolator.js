var fs = require('fs');
var Promise = require('bluebird');

var ENCODING = 'utf8';

/**
 * Replaces a placeholder inside a source file with a given content from another file
 * @param  {String} sourceFile  The path to the source file (aka template)
 * @param  {String} contentFile The path to the content file
 * @param  {String} placeholder The string that this module will look for to replace with the content
 * @param  {String} outputFile  The path to the outputFile (it will be truncated, so be careful)
 * @return {Promise}            Returns an A++ promise that will be resolved with the outputFile when the writing is done
 */
module.exports = function(sourceFile, contentFile, placeholder, outputFile) {
	return interpolate(sourceFile, contentFile, placeholder, outputFile);
};

function interpolate(sourceFile, contentFile, placeholder, outputFile) {

	var templateStream, contentStream, outputStream;

	return new Promise(function(resolve, reject) {

		templateStream = fs.createReadStream(sourceFile, ENCODING);
		outputStream = fs.createWriteStream(outputFile, ENCODING);
		contentStream = fs.createReadStream(contentFile, ENCODING);

		templateStream.on('data', function(data) {

			var placeholderPos;

			// check if placeholder exists in this data dump
			placeholderPos = data.indexOf(placeholder);

			// placeholder isnt included in this data dump, write it directly to the outputFile
			if (placeholderPos === -1) {
				outputStream.write(data);
				return;
			}

			// placeholder is included in this datadump, replace it with the content

			// write data that exists before the placeholder
			outputStream.write(data.substring(0, placeholderPos));

			// pause the template stream, the next operation might take a while..
			templateStream.pause();

			// pipe the content into the outputFile
			pipe(contentStream, outputStream).then(function() {

				// write the data that exists after the placeholder
				outputStream.write(data.substring(placeholderPos + placeholder.length));
				// resume the reading stream
				templateStream.resume();
			});
		});

		templateStream.on('error', function(error) {
			reject(error);
		});

		templateStream.on('end', function() {
			outputStream.end('\n');
			outputStream.on('finish', function() {
				resolve(outputFile);
			});
		});
	});
}

function pipe(inputStream, outputStream) {
	return new Promise(function(resolve, reject) {
		inputStream.on('data', function(data) {
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
