
var interpolator = require('./interpolator');
var stream = require('./stream');

module.exports = function(sourceFile, outputFile, transforms) {

	var inputStream = stream.fromFile(sourceFile);
	var outputStream = stream.toFile(outputFile);
	transforms = createConfigurationObject(transforms);

	return interpolator(inputStream, transforms, outputStream).then(function() {
		return outputFile;
	});
};

function createConfigurationObject(rules) {

	var transforms = {};

	transforms.replace = rules.map(function(rule) {

		var content;

		if (!rule.replace || !(rule.with || rule.withFile)) {
			throw 'invalid rule: ' +  rule;
		}

		content = rule.with ? stream.fromString(rule.with) : stream.fromFile(rule.withFile);

		return {
			query: rule.replace,
			content: content
		};
	});

	return transforms;
}
