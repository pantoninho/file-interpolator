var interpolator = require('./interpolator');
var input = require('./input');
var output = require('./output');
var utils = require('./utils');

exports.interpolator = interpolator;
exports.utils = utils;

exports.fromFile = input.file;
exports.toFile = output.file;

exports.fromString = input.string;
exports.toString = output.string;
