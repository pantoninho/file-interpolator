var fileInterpolator = require('./src/file-interpolator');

module.exports = function(layoutFile, transforms, outputFile) {

	return fileInterpolator(layoutFile, transforms, outputFile);
};
