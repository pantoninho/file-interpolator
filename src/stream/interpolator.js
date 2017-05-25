var stream = require('./index');

module.exports = function(data, matches) {

	var lastCharIndex, dataStream, streams;

	streams = [];

	lastCharIndex = matches.reduce(function(currentCharIndex, match) {

		dataStream = stream.fromString(data.substring(currentCharIndex, match.at));
		streams.push(dataStream);

		streams.push(match.stream);

		return match.at + match.marker.length;
	}, 0);

	dataStream = stream.fromString(data.substring(lastCharIndex));
	streams.push(dataStream);

	return streams;
};
