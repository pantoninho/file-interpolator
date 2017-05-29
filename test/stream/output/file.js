var path = require('path');
var chai = require('chai');
var fs = require('fs');
var chaiAsPromised = require('chai-as-promised');

chai.should();
chai.use(chaiAsPromised);

var stream = require('../../../src/stream');

describe('[File Output Stream]', function() {

	var data, outputFile, fileStream;

	beforeEach(function() {
		data = 'I want to be a file.';
		outputFile = path.join(__dirname, '../../files/output');
	});

	it('should be able to write data into a file', function() {

		fileStream = stream.toFile(outputFile);

		return fileStream.write(data).then(function() {
			var outputFileContent = fs.readFileSync(outputFile, 'utf-8');
			outputFileContent.should.equal(data);

			fileStream.end();
		});

	});

	it('should be able to write multiple chunks of data into the same file', function() {

		var moreData = '\nI have been inserted into a file against my will';

		fileStream = stream.toFile(outputFile);


		return fileStream.write(data)
			.then(function() {
				fileStream.write(moreData);
			}).then(function() {
				var outputFileContent = fs.readFileSync(outputFile, 'utf-8');
				outputFileContent.should.equal(data + moreData);
				fileStream.end();
			});
	});

	it('should throw exception if no file specified', function() {

		fileStream = stream.toFile();

		var handler = function() {
			fileStream.write(data);
		};

		handler.should.throw(Error, 'File not specified');

	});

	it('should do nothing if trying to end an unexistent stream', function() {

		fileStream = stream.toFile(outputFile);

		var handler = function() {
			fileStream.end();
		};

		handler.should.not.throw(Error);

	});
});
