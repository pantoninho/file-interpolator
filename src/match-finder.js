module.exports = function(data, markers) {

	var matches = findFullMatches(data, markers);
	var partialMatch = findPartialMatch(data, markers);

	if (partialMatch) {
		matches.push(partialMatch);
	}

	return matches;
};

function findFullMatches(data, markers) {

	var matches = [];

	markers.forEach(function(marker) {

		var match, markerPosition;
		markerPosition = data.indexOf(marker);

		// find all positive matches for this marker inside this data
		while (markerPosition !== -1) {

			match = createMatch(marker, markerPosition);
			matches.push(match);

			// try to find the next marker
			markerPosition = data.indexOf(match.marker, match.at + match.marker.length);
		}
	});

	// sort finds using their index (ascending)
	matches.sort(function(a, b) {
		return a.at - b.at;
	});

	return matches;
}

function findPartialMatch(data, markers) {

	var partialMatch, exists;

	exists = markers.some(function(marker) {

		var reverseMark, possiblePartial, partialStart;

		reverseMark = marker.split('').reverse();
		possiblePartial = data.substring(data.length - reverseMark.length).split('').reverse();
		partialStart = reverseMark.indexOf(possiblePartial[0]);

		if (partialStart === -1) {
			return false;
		}

		reverseMark = reverseMark.slice(partialStart);

		return reverseMark.every(function(char, i) {
			partialStart = data.length - (i + 1);
			partialMatch = createMatch(marker, partialStart, true);
			return char === possiblePartial[i];
		});
	});

	if (exists) {
		return partialMatch;
	}

}

function createMatch(marker, position, partial) {
	return {
		marker: marker,
		at: position,
		partial: partial || false
	};
}
