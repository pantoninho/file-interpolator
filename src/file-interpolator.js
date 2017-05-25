var stream = require('./stream');
var matchFinder = require('./match-finder');

module.exports = function(layoutFile, transforms, outputFile) {

	var inputStream, outputStream, interpolations, markers, partialMatch;

	inputStream = stream.fromFile(layoutFile);
	outputStream = stream.toFile(outputFile);

	markers = transforms.map(function(t) {
		return t.replace;
	});

	interpolations = [];

	return inputStream.read(function(data) {

		var matches, lastMatch;

		if (partialMatch) {
			data = partialMatch + data;
			partialMatch = '';
		}

		matches = prepareMatches(matchFinder(data, markers), transforms);
		lastMatch = matches[matches.length - 1];

		if (lastMatch.partial) {
			partialMatch = data.substring(lastMatch.at);
			data = data.substring(0, lastMatch.at);
			matches = matches.slice(0, matches.length - 1);
		}

		interpolations = interpolations.concat(stream.interpolator(data, matches));

	}).then(function() {

		var next = outputFile ? stream.utils.pipe : stream.utils.dump;
		return next(interpolations, outputStream);

	}).then(function(output) {

		return output;
	});
};

function prepareMatches(matches, transforms) {

	return matches.map(function(match) {

		var transform, content;

		transform = transforms.find(function(transform) {
			return match.marker === transform.replace;
		});

		if (transform.with || transform.with === '') {
			content = stream.fromString(transform.with);
		}

		if (transform.withFile) {
			content = stream.fromFile(transform.withFile);
		}

		return {
			marker: match.marker,
			at: match.at,
			stream: content,
			partial: match.partial
		};
	});
}
