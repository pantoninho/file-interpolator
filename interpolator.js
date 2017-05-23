var Promise = require('bluebird');

module.exports = function(inputStream, transforms, outputStream) {

	var transformData = replacer(transforms, inputStream, outputStream);

	return inputStream.read(transformData).then(function() {
		// TODO: add trailing new line if non existent
		outputStream.end();
	});
};

function replacer(transforms, inputStream, outputStream) {

	return function(data) {
		var matches = findMatches(data, transforms);

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

function findMatches(data, transforms) {

	var matches = [];

	transforms.forEach(function(transform) {

		// check if marker exists in this data dump
		var marker, markerIndex;
		marker = transform.marker;
		markerIndex = data.indexOf(marker);

		while (markerIndex !== -1) {
			// rule's marker was found
			matches.push({
				marker: marker,
				at: markerIndex,
				content: transform.content
			});

			markerIndex = data.indexOf(marker, markerIndex + marker.length);
		}
	});

	// sort finds using their index (ascending)
	matches.sort(function(a, b) {
		return a.at - b.at;
	});

	return matches;
}
