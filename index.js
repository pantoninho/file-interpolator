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

		if (!transform.replace || !(transform.with || transform.withFile) || (transform.with && transform.withFile)) {
			throw 'Wrong transform rule: ' + transform;
		}

		return {
			placeholder: transform.replace,
			content: transform.with ? stream.fromString(transform.with) : stream.fromFile(transform.withFile)
		};
	});
}
