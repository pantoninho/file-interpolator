var Promise = require('bluebird');
var matchFinder = require('./match-finder');

module.exports = function(inputStream, options, outputStream) {

	var interpolate = replacer(options, outputStream);

	return inputStream.read(interpolate).then(function() {
		// TODO: add trailing new line if non existent
		outputStream.end();
	});
};

function replacer(transforms, outputStream) {

	return function(data) {
		var matches = matchFinder(data, transforms.markers);

		// no matches were found, pipe input directly to the output
		if (matches.length === 0) {
			return outputStream.write(data);
		}

		// matches were found, replace them sequentially while writing into the outputstream
		return Promise.reduce(matches, function(currentCharIndex, match) {

			// write data that exists before the current match
			return outputStream.write(data.substring(currentCharIndex, match.at))
				.then(function() {
					// pipe the match's content into the output stream
					return transforms.streams[match.marker].pipe(outputStream);
				}).then(function() {
					// return the current char index after writing all the content
					return match.at + match.marker.length;
				});

		}, 0).then(function(currentCharIndex) {
				// write the content after the last marker
			return outputStream.write(data.substring(currentCharIndex));
		});
	};
}
