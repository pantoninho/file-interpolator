var Promise = require('bluebird');
var matchFinder = require('./match-finder');

module.exports = function(inputStream, transforms, outputStream) {

	var transformData = replacer(transforms, inputStream, outputStream);

	return inputStream.read(transformData).then(function() {
		// TODO: add trailing new line if non existent
		outputStream.end();
	});
};

function replacer(transforms, inputStream, outputStream) {

	return function(data) {
		var matches = matchFinder(data, transforms);

		// no matches were found, pipe input directly to the output
		if (matches.length === 0) {
			return outputStream.write(data);
		}

		// matches were found, replace them sequentially while writing into the outputstream
		return Promise.reduce(matches, function(currentCharIndex, transform) {

			// write data that exists before the current match
			return outputStream.write(data.substring(currentCharIndex, transform.at))
				.then(function() {
					// pipe the match's content into the output stream
					return transform.content.pipe(outputStream);
				}).then(function() {
					// return the current char index after writing all the content
					return transform.at + transform.marker.length;
				});

		}, 0).then(function(currentCharIndex) {
				// write the content after the last marker
			return outputStream.write(data.substring(currentCharIndex));
		});
	};
}
