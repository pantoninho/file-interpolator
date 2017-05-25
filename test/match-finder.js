var chai = require('chai');
chai.should();

var matchFinder = require('../src/match-finder');

describe('[Match finder]', function() {

	describe('No matches at all', function() {
		it('should return an empty array', function() {

			var markers, text, matches;

			markers = [
				'gibberish'
			];

			text = 'Once upon a time, there was this placeholder. And it was cool.';
			matches = matchFinder(text, markers);

			matches.should.be.an('array');
			matches.should.have.lengthOf(0);
		});
	});

	describe('One full match without partial matches', function() {
		it('should return an array with a full match', function() {

			var markers, markerPosition, text, matches;

			markers = [
				'placeholder'
			];
			markerPosition = 33;

			text = 'Once upon a time, there was this placeholder. And it was cool.';
			matches = matchFinder(text, markers);

			matches.should.be.an('array');
			matches.should.have.lengthOf(1);

			matches[0].should.be.an('object');
			matches[0].should.have.property('marker').that.equals(markers[0]);
			matches[0].should.have.property('at').that.equals(markerPosition);
			matches[0].should.have.property('partial').that.is.not.ok;

		});
	});

	describe('Two different full matches without partial matches', function() {
		it('should return an array with two full matches', function() {

			var markers, markerPositions, text, matches;

			markers = [
				'placeholder',
				'mark'
			];

			markerPositions = [
				33,
				61
			];

			text = 'Once upon a time, there was this placeholder, and this other mark. Great.';
			matches = matchFinder(text, markers);

			matches.should.be.an('array');
			matches.should.have.lengthOf(2);

			for (var i = 0; i < matches.length; i++) {
				matches[i].should.be.an('object');
				matches[i].should.have.property('marker').that.equals(markers[i]);
				matches[i].should.have.property('at').that.equals(markerPositions[i]);
				matches[i].should.have.property('partial').that.is.not.ok;
			}
		});
	});

	describe('Two equal full matches without partial matches', function() {
		it('should return an array with two full matches', function() {

			var markers, markerPositions, text, matches;

			markers = [
				'placeholder',
			];

			markerPositions = [
				33,
				61
			];

			text = 'Once upon a time, there was this placeholder, and this other placeholder. Great.';
			matches = matchFinder(text, markers);

			matches.should.be.an('array');
			matches.should.have.lengthOf(2);

			for (var i = 0; i < matches.length; i++) {
				matches[i].should.be.an('object');
				matches[i].should.have.property('marker').that.equals(markers[0]);
				matches[i].should.have.property('at').that.equals(markerPositions[i]);
				matches[i].should.have.property('partial').that.is.not.ok;
			}
		});
	});

	describe('No full matches with a partial match', function() {
		it('should return an array with one partial match', function() {

			var markers, markerPositions, text, matches;

			markers = [
				'placeholder',
			];

			markerPositions = [
				33
			];

			text = 'Once upon a time, there was this plac';
			matches = matchFinder(text, markers);

			matches.should.be.an('array');
			matches.should.have.lengthOf(1);

			matches[0].should.be.an('object');
			matches[0].should.have.property('marker').that.equals(markers[0]);
			matches[0].should.have.property('at').that.equals(markerPositions[0]);
			matches[0].should.have.property('partial').that.is.ok;
		});
	});

	describe('Two full matches with a partial match', function() {
		it('should return an array with two full matches and one partial match', function() {

			var markers, markerPositions, text, matches;

			markers = [
				'placeholder',
				'mark',
				'pointer'
			];

			markerPositions = [
				33,
				61,
				80
			];

			text = 'Once upon a time, there was this placeholder, and this other mark. Great. Also, po';
			matches = matchFinder(text, markers);

			matches.should.be.an('array');
			matches.should.have.lengthOf(3);

			for (var i = 0; i < matches.length; i++) {
				matches[i].should.be.an('object');
				matches[i].should.have.property('marker').that.equals(markers[i]);
				matches[i].should.have.property('at').that.equals(markerPositions[i]);
			}

			matches[0].should.have.property('partial').that.is.not.ok;
			matches[1].should.have.property('partial').that.is.not.ok;
			matches[2].should.have.property('partial').that.is.ok;
		});
	});
});
