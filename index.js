var interpolator = require('./interpolator');
var stream = require('./stream');

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

	return transforms.map(function(transform) {

		var content;

		// no placeholder string specified
		if (!transform.replace ||
			// no placeholder replacer specified
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

		return {
			marker: transform.replace,
			content: content
		};
	});
}
