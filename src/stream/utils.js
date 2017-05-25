var Promise = require('bluebird');

exports.dump = function(streams) {

	return Promise.reduce(streams, function(data, stream) {
		return stream.read(function(partial) {
			return new Promise(function(resolve) {
				data += partial;
				resolve();
			});
		}).then(function() {
			return data;
		});
	}, '');
};

exports.pipe = function(streams, outputStream) {

	return Promise.each(streams, function(stream) {
		return stream.pipe(outputStream);
	}).then(function() {
		outputStream.end();
		return outputStream.file;
	});

};

exports.create = function(proto, additionalProps) {

	var stream = Object.create(proto);
	Object.assign(stream, additionalProps);

	return stream;
};
