var chai = require('chai');

var chaiAsPromised = require('chai-as-promised');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

var stream = require('../../src/stream');
var interpolator = stream.interpolator;

describe('[Stream Interpolator]', function() {

	var input, output, streams, matches;

	input = 'Why, hello. I should insert something here soon. This is the *first* test.';

	it('should replace no placeholders if none are given', function() {

		matches = [];

		streams = interpolator(input, matches);

		return stream.utils.dump(streams).should.eventually.equal(input);
	});

	it('should replace a single placeholder', function() {

		var marker, replacer;

		marker = 'insert something here';
		replacer = 'be finishing this';
		output = 'Why, hello. I should be finishing this soon. This is the *first* test.';
		matches = [
			{ marker: marker, at: 21, stream: stream.fromString(replacer) }
		];

		streams = interpolator(input, matches);
		return stream.utils.dump(streams).should.eventually.equal(output);

	});

	it('should replace multiple placeholders', function() {

		var markers, replacers;

		markers = ['insert something here', '*first*'];
		replacers = ['be finishing this', '*second*'];
		output = 'Why, hello. I should be finishing this soon. This is the *second* test.';

		matches = [
			{ marker: markers[0], at: 21, stream: stream.fromString(replacers[0]) },
			{ marker: markers[1], at: 61, stream: stream.fromString(replacers[1]) }
		];

		streams = interpolator(input, matches);
		return stream.utils.dump(streams).should.eventually.equal(output);
	});
});
