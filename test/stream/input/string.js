var chai = require('chai');
var sinon = require('sinon');

var chaiAsPromised = require('chai-as-promised');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

var stream = require('../../../src/stream');

describe('[String Input Stream]', function() {

	var string, stringStream, handler;

	beforeEach(function() {
		string = 'I am a string on a callback.';
	});

	describe('Read from string', function() {

		beforeEach(function() {
			handler = sinon.spy();
		});

		it('should be able to call a callback with the string', function() {

			stringStream = stream.fromString(string);
			stringStream.read(handler);

			handler.should.have.been.calledOnce;
			handler.should.have.been.calledWith(string);

		});

		it('should throw an error if no string specified', function() {

			stringStream = stream.fromString();

			var readStream = function() {
				stringStream.read(handler);
			};

			readStream.should.throw(Error, 'No string specified');
			handler.should.not.have.been.called;

		});
	});

	describe('Pipe from string', function() {

		var handler, spy;

		beforeEach(function() {
			handler = { write: function() { } };
			spy = sinon.spy(handler, 'write');
		});

		it('should call the write method of an outputstream with the string', function() {

			stringStream = stream.fromString(string);

			stringStream.pipe(handler);

			spy.should.have.been.calledOnce;
			spy.should.have.been.calledWith(string);

		});

		it('should throw an error if no string specified', function() {

			stringStream = stream.fromString();

			var readStream = function() {
				stringStream.pipe(handler);
			};

			readStream.should.throw(Error, 'No string specified');
			spy.should.not.have.been.called;

		});
	});
});
