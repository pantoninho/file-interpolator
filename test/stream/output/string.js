var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.should();
chai.use(chaiAsPromised);

var stream = require('../../../src/stream');

describe('[String Output Stream]', function() {

	var string, stringStream;

	beforeEach(function() {
		string = 'I am a string, I promise.';
	});

	describe('Write to string', function() {

		it('should be able to transform a string into a promise', function() {

			stringStream = stream.toString(string);

			return stringStream.write(string).should.eventually.equal(string);
		});

	});
});
