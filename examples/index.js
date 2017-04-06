var interpolator = require('../');
var path = require('path');

var layout = path.join(__dirname, 'files/layout');
var partial = path.join(__dirname, 'files/partial');
var mergeWithFile = path.join(__dirname, 'file-merge');
var mergeWithString = path.join(__dirname, 'string-merge');
var placeholder = '[CONTENT]';


interpolator.fileInFile({
	sourceFile: layout,
	contentFile: partial,
	placeholder: placeholder,
	outputFile: mergeWithFile
});
interpolator.stringInFile({
	sourceFile: layout,
	content: 'STRING',
	placeholder: placeholder,
	outputFile: mergeWithString
});
