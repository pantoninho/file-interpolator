var chai = require('chai');
var sinon = require('sinon');
var path = require('path');
chai.should();

var interpolator = require('../src/interpolator');
var matchFinder = require('../src/match-finder');
var layout = path.join(__dirname, 'files/layout.hbs');
var partial = path.join(__dirname, 'files/partial.hbs');
var output = path.join(__dirname, 'files/output.hbs');

var stream = require('../src/stream');

describe('[Interpolator]', function() {

	describe('Interpolating files with strings', function() {
		it('should replace a single placeholder', function() {

			var spy = sinon.spy(matchFinder);

			var options = {
				markers: ['insert something here'],
				streams: {
					'insert something here': stream.fromString('hello')
				}
			};

			interpolator(stream.fromFile(layout), options, stream.toFile(output)).then(function(outputFile) {
				spy.called.should.be.ok;
			});
		});
	});
});
