var path = require('path');
var chai = require('chai');
var fs = require('fs');

var chaiAsPromised = require('chai-as-promised');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

var fileInterpolator = require('../src/file-interpolator');

describe('[File-Interpolator]', function() {


	it('should replace placeholders with strings', function() {

		var input, output, transforms, expectedOutput;

		input = path.join(__dirname, './files/layout');
		output = path.join(__dirname, './files/output');

		transforms = [
			{ replace: '[[ content ]]', with: 'about the word' },
			{ replace: 'insert partial here', with: 'Don\'t you know' },
			{ replace: '{{ who knows }}', with: 'the bird is indeed the word' },
		];

		expectedOutput = 'a b c\nDon\'t you know\na b c\nabout the word\nthe bird is indeed the word\na\nb\nc\n';

		return fileInterpolator(input, transforms, output).then(function(output) {
			var outputContent = fs.readFileSync(output, 'utf8');
			outputContent.should.equal(expectedOutput);
		});

	});

	it('should be able to dump the interpolation to a string', function() {

		var input, transforms, expectedOutput;

		input = path.join(__dirname, './files/layout');

		transforms = [
			{ replace: '[[ content ]]', with: 'about the word' },
			{ replace: 'insert partial here', with: '' },
			{ replace: '{{ who knows }}', with: 'the bird is indeed the word' },
		];

		expectedOutput = 'a b c\n\na b c\nabout the word\nthe bird is indeed the word\na\nb\nc\n';

		return fileInterpolator(input, transforms).then(function(output) {
			output.should.equal(expectedOutput);
		});

	});

	it('should replace placeholders on files with gigantic propotions', function() {
		this.timeout(0);

		var input, output, transforms, partial1, partial2;

		input = path.join(__dirname, './files/gigantic_layout');
		output = path.join(__dirname, './files/large_output');
		partial1 = path.join(__dirname, './files/partial');
		partial2 = path.join(__dirname, './files/large_partial');

		transforms = [
			{ replace: 'PARTIAL1', withFile: partial1 },
			{ replace: 'PARTIAL2', withFile: partial2 },
		];

		return fileInterpolator(input, transforms, output);
	});
});
