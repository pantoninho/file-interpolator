var path = require('path');
var Promise = require('bluebird');
var chai = require('chai');
var sinon = require('sinon');

var chaiAsPromised = require('chai-as-promised');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

var stream = require('../../src/stream');
var utils = stream.utils;


describe('[Stream Utils]', function() {

	var streams;

	describe('Dump', function() {

		var output;

		beforeEach(function() {
		});

		it('should be able to dump an array of string streams', function() {

			var strings = ['First string. ', 'Second string.\n', 'Three is enough.'];
			streams = strings.map(function(string) {
				return stream.fromString(string);
			});

			output = 'First string. Second string.\nThree is enough.';

			return utils.dump(streams).should.eventually.equal(output);
		});

		it('should be able to dump an array of file streams', function() {

			var files = [
				path.join(__dirname, '../files/partial'),
				path.join(__dirname, '../files/another_partial'),
				path.join(__dirname, '../files/another_partial'),
				path.join(__dirname, '../files/partial')
			];

			streams = files.map(function(file) {
				return stream.fromFile(file);
			});

			output = 'THIS IS A PARTIAL!\nTHIS IS ANOTHER PARTIAL!\nTHIS IS ANOTHER PARTIAL!\nTHIS IS A PARTIAL!\n';

			return utils.dump(streams).should.eventually.equal(output);
		});

		it('should be able to dump an array of mixed streams', function() {

			var files, strings, streams;

			files = [
				path.join(__dirname, '../files/partial'),
				path.join(__dirname, '../files/another_partial')
			];

			strings = [
				'I am a file in disguise.\n',
				'I admit I am a string.\n'
			];

			streams = [];

			files.forEach(function(file, i) {
				streams.push(stream.fromFile(file));
				streams.push(stream.fromString(strings[i]));
			});

			output = 'THIS IS A PARTIAL!\nI am a file in disguise.\nTHIS IS ANOTHER PARTIAL!\nI admit I am a string.\n';

			return utils.dump(streams).should.eventually.equal(output);
		});
	});

	describe('Pipe', function() {

		var outputStream;

		beforeEach(function() {
			outputStream = {
				write: sinon.spy(function() {
					return new Promise(function(resolve) {
						resolve();
					});
				}),
				end: sinon.spy()
			};

		});

		it('should be able to pipe an array of string streams', function() {

			var strings, spies;

			strings = ['First string. ', 'Second string.\n', 'Three is enough.'];
			spies = [];

			streams = strings.map(function(string) {
				var stringStream = stream.fromString(string);
				spies.push(sinon.spy(stringStream, 'pipe'));
				return stringStream;
			});

			return utils.pipe(streams, outputStream)
				.then(function() {

					outputStream.write.should.have.been.calledThrice;

					spies.forEach(function(spy) {
						spy.should.have.been.calledOnce;
					});

				}).then(function() {
					outputStream.end.should.have.been.calledOnce;
				});
		});
	});
});
