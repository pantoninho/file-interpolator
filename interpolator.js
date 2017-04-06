var Promise = require('bluebird');

module.exports = function(inputStream, transforms, outputStream) {

	return inputStream.read(processData).then(function() {
		// TODO: add trailing new line if non existent
		outputStream.end();
	});

	function processData(data) {

		transforms = findMatches(data, transforms);

		// no matches were found, pipe input directly to the output
		if (transforms.length === 0) {
			return inputStream.pipe(outputStream);
		}

		// matches were found, replace them sequentially while writing into the outputstream
		return Promise.reduce(transforms, function(currentCharIndex, transform) {

			// write data that exists before the match
			return outputStream.write(data.substring(currentCharIndex, transform.at))
				.then(function() {
					// pipe the content into the output stream
					return transform.content.pipe(outputStream);
				}).then(function() {
					return transform.at + transform.placeholder.length;
				});
		}, 0).then(function(currentCharIndex) {
			return outputStream.write(data.substring(currentCharIndex));
		});
	}
};

function findMatches(data, transforms) {

	var matches = [];

	transforms.forEach(function(transform) {

		// check if placeholder exists in this data dump
		var placeholderIndex = data.indexOf(transform.placeholder);

		// placeholder isnt included in this data dump
		if (placeholderIndex === -1) {
			return;
		}

		// rule's placeholder was found
		matches.push({
			placeholder: transform.placeholder,
			at: placeholderIndex,
			content: transform.content
		});
	});

	// sort finds using their index (ascending)
	matches.sort(function(a, b) {
		return a.at - b.at;
	});

	return matches;
}
