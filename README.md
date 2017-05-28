[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9fa1f23dce98478cb9607af44ed869ca)](https://www.codacy.com/app/pdn.antoninho/file-interpolator?utm_source=github.com&utm_medium=referral&utm_content=pantoninho/file-interpolator&utm_campaign=badger)
[![Build Status](https://travis-ci.org/pantoninho/file-interpolator.svg?branch=master)](https://travis-ci.org/pantoninho/file-interpolator)
[![Test Coverage](https://codeclimate.com/github/pantoninho/file-interpolator/badges/coverage.svg)](https://codeclimate.com/github/pantoninho/file-interpolator/coverage)
[![Code Climate](https://codeclimate.com/github/pantoninho/file-interpolator/badges/gpa.svg)](https://codeclimate.com/github/pantoninho/file-interpolator)
[![Issue Count](https://codeclimate.com/github/pantoninho/file-interpolator/badges/issue_count.svg)](https://codeclimate.com/github/pantoninho/file-interpolator)
[![dependencies Status](https://david-dm.org/pantoninho/file-interpolator/status.svg)](https://david-dm.org/pantoninho/file-interpolator)
[![devDependencies Status](https://david-dm.org/pantoninho/file-interpolator/dev-status.svg)](https://david-dm.org/pantoninho/file-interpolator?type=dev)
# file-interpolator

Interpolates a file using placeholders. The file may be interpolated with strings or the content of another file.

It might be useful for generating files using a template/layout. The memory footprint has been highly taken into account (I hope?), so it should handle really big files.

Example:

```
var interpolator = require('../');
var path = require('path');

var layout = path.join(__dirname, 'files/layout.hbs');
var partial = path.join(__dirname, 'files/partial.hbs');
var outputFile = path.join(__dirname, 'files/output.hbs');

interpolator(layout, [{
	replace: '{{{ content }}}',
	withFile: partial
}, {
	replace: '{{ bundle.js }}',
	with: 'script tag with the js bundle right here'
}, {
	replace: '{{ bundle.css }}',
	with: 'link tag with the css bundle right here'
}], outputFile).then(function(outputFile) {
	console.log('finished the inteprolation process.. outputfile:', outputFile);
});

```
