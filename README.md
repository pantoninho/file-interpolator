# file-interpolator

Interpolates a file using placeholders. The file may be interpolated with strings or the content of another file.

It might be useful for generating files using a template/layout. The memory footprint has been highly taken into account (I hope?), so it should handle really big files.

Example:

```
var interpolator = require('../');
var path = require('path');

var layout = path.join(__dirname, 'files/layout.hbs');
var partial = path.join(__dirname, 'files/partial.hbs');

interpolator(layout, 'output.hbs', [{
	replace: '{{{ content }}}',
	withFile: partial
}, {
	replace: '{{ bundle.js }}',
	with: 'script tag with the js bundle right here'
}, {
	replace: '{{ bundle.css }}',
	with: 'link tag with the css bundle right here'
}]).then(function(outputFile) {
	console.log('finished the inteprolation process.. outputfile:', outputFile);
});

```
