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
	};
}

function findMatches(data, transforms) {

	var matches = [];

	transforms.forEach(function(transform) {

		// check if placeholder exists in this data dump
		var placeholder, placeholderIndex;
		placeholder = transform.placeholder;
		placeholderIndex = data.indexOf(placeholder);

		while (placeholderIndex !== -1) {
			// rule's placeholder was found
			matches.push({
				placeholder: placeholder,
				at: placeholderIndex,
				content: transform.content
			});

			placeholderIndex = data.indexOf(placeholder, placeholderIndex + placeholder.length);
		}

	});

	// sort finds using their index (ascending)
	matches.sort(function(a, b) {
		return a.at - b.at;
	});

	return matches;
}
