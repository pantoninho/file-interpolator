var Promise = require('bluebird');

module.exports = function(inputStream, transforms, outputStream) {

	if (!transforms.replace) {
		throw 'Transforms argument needs a replace property, and that property needs to be an array';
	}

	return inputStream.read(processData).then(function() {
		// TODO: write a trailing new line if non existing
		outputStream.end();
	});

	function processData(data) {

		var matches = find(data, transforms.replace);

		// no matches were found, pipe input directly to the output
		if (matches.length === 0) {
			return inputStream.pipe(outputStream);
		}
		// matches were found, replace them sequentially while writing into the outputstream
		return Promise.reduce(matches, function(currentCharIndex, match) {

			// write data that exists before the match
			return outputStream.write(data.substring(currentCharIndex, match.at))
				.then(function() {
					// pipe the content into the output stream
					return match.content.pipe(outputStream);
				}).then(function() {
					return match.at + match.placeholder.length;
				});
		}, 0).then(function(currentCharIndex) {
			return outputStream.write(data.substring(currentCharIndex));
		});
	}
};

function find(data, replaceConfig) {

	var matches = [];

	replaceConfig.forEach(function(replace) {

		var placeholderIndex;

		// check if placeholder exists in this data dump
		placeholderIndex = data.indexOf(replace.query);

		// placeholder isnt included in this data dump
		if (placeholderIndex === -1) {
			return;
		}

		// rule's placeholder was found
		matches.push({
			placeholder: replace.query,
			at: placeholderIndex,
			content: replace.content
		});
	});

	// sort finds using their index (ascending)
	matches.sort(function(a, b) {
		return a.at - b.at;
	});

	return matches;
}
