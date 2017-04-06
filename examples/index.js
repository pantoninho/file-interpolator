var interpolator = require('../');
var path = require('path');

var layout = path.join(__dirname, 'files/layout.hbs');
var partial = path.join(__dirname, 'files/partial.hbs');
var output = path.join(__dirname, 'output.hbs');

interpolator(layout, output, [{
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
