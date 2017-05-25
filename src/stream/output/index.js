var file = require('./file');
var string = require('./string');
var utils = require('../utils');

exports.file = function(fileName) {
	return utils.create(file, {file: fileName});
};

exports.string = function() {
	return utils.create(string);
};
