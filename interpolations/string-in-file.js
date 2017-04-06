var interpolator = require('../interpolator');

module.exports = function(options) {

	// TODO: this looks messy.. find some other way
	return interpolator(options.sourceFile, options.placeholder, options.outputFile, insert);

	function insert(outputStream) {
		outputStream.write(options.content);
	}
};
