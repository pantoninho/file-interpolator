var path = require('path');
var chai = require('chai');
var sinon = require('sinon');
var Promise = require('bluebird');

var chaiAsPromised = require('chai-as-promised');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

var stream = require('../../../src/stream');

describe('[File Input Stream]', function() {

	var fileStream, fileContent, file;

	beforeEach(function() {
		file = path.join(__dirname, '../../files/partial');
	});

	describe('Read from a file', function() {

		var handler;

		beforeEach(function() {
			fileContent = 'THIS IS A PARTIAL!\n';
			handler = sinon.spy();
		});

		it('should be able to stream file contents and call a promise when done', function() {

			var contents, readPromise;
			contents = '';
			fileStream = stream.fromFile(file);

			readPromise = fileStream.read(function(data) {
				contents += data;

				return new Promise(function(resolve) {
					resolve();
				});
			});

			return readPromise.then(function() {
				contents.should.equal(fileContent);
			});
		});

		it('should throw an error if no file specified', function() {

			fileStream = stream.fromFile();

			var readStream = function() {
				fileStream.read(handler);
			};

			readStream.should.throw(Error, 'File not specified');

		});
	});

	describe('Pipe from file', function() {

		var handler, writeSpy;

		beforeEach(function() {
			handler = {
				write: function() {
					return new Promise(function(resolve) {
						resolve();
					});
				},
				end: function() {
				}
			};

			writeSpy = sinon.spy(handler, 'write');
			fileContent = 'THIS IS A PARTIAL!';
		});


		it('should call the write method of an outputstream with the file content and skip trailling lines', function() {

			fileStream = stream.fromFile(file);

			return fileStream.pipe(handler).then(function() {
				writeSpy.should.have.been.calledOnce;
				writeSpy.should.have.been.calledWith(fileContent);
			});

		});

		it('should throw an error if no file specified', function() {

			fileStream = stream.fromFile();

			var readStream = function() {
				fileStream.pipe(handler);
			};

			readStream.should.throw(Error, 'File not specified');
		});
	});
});
