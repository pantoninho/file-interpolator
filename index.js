var interpolator = require('./src/interpolator');
var stream = require('./src/stream');

module.exports = function(layoutFile, outputFile, transforms) {

	var inputStream, outputStream;

	inputStream = stream.fromFile(layoutFile);
	outputStream = stream.toFile(outputFile);
	transforms = prepareTransforms(transforms);

	return interpolator(inputStream, transforms, outputStream).then(function() {
		return outputFile;
	});
};

function prepareTransforms(transforms) {

	var markers, streams;
	markers = [];
	streams = {};

	transforms.forEach(function(transform) {

		var content, marker;
		marker = transform.replace;

		// no marker specified
		if (!marker ||
			// no marker replacer specified
			((transform.with === undefined || transform.with === null) && !transform.withFile) ||
			// both placeholder replacers specified (there can only be one)
			(transform.with && transform.withFile)) {

			throw 'Wrong transform rule: ' + JSON.stringify(transform);
		}

		if (transform.with !== undefined || transform.with !== null) {
			content = stream.fromString(transform.with);
		}

		if (transform.withFile) {
			content = stream.fromFile(transform.withFile);
		}

		markers.push(marker);
		streams[marker] = content;
	});

	return {
		markers: markers,
		streamer: streams
	};
}
