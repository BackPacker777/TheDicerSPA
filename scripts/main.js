/**
 *   AUTHOR: HB
 *   VERSION: 1.0
 *   CREATED: 02.12.2015
 *   PROGRAM: Dicer Single Page Application
 */

"use strict";

/*
 * EXPLODING_DICE = 0
 * TOTAL_DICE = 1
 * INDIVIDUALS = 2
 */

angular.module('TheDicer', [])
	.controller('processRoll', function($scope) {
		$scope.$watch('setDieQty', function() {
			//Issue workaround for: https://github.com/angular/angular.js/issues/5892
			$scope.setDieQty = parseInt($scope.setDieQty);
		});
		$scope.updateDieQty = function(value) {
			$scope.dieQtySlide = value;
		};
		$scope.$watch('setDieType', function() {
			//Issue workaround for: https://github.com/angular/angular.js/issues/5892
			$scope.setDieType = parseInt($scope.setDieType);
		});
		$scope.updateDieType = function(value) {
			$scope.dieTypeRadio = value;
		}
		$scope.performRoll = function(rollType) {
			$scope.roll = new Dice(document.getElementById('dieQty').value, document.getElementById('dieType').value, 0).getFinalResult(rollType);
		};
	});


/**
 * @type {Object}
 * @param dieType
 * @param dieQty
 * @param bonus
 * @constructor
 */
function Dice(dieQty, dieType, bonus) {
	/**
	 * @type {Array}
	 * @private
	 */
	var _results = [],
		_finalResult;

	/** @type {constant} */
	var EXPLODING_DICE = 0;

	/**
	 * @param rollType
	 */
	function setFinalResult(rollType) {
		/** @type {number} */
		_finalResult = 0;
		for (var i = 0; i < dieQty; i++) {
			_results[i] = Math.floor((Math.random() * dieType) + 1);
			console.log("Roll " + i + ": " + _results[i]);
			if (rollType === EXPLODING_DICE) {
				while (_results[i] === dieType) {
					_results[i] = _results[i] + Math.floor((Math.random() * dieType) + 1);
					console.log("Roll " + i + ": " + _results[i]);
				}
			}
		}
		if (rollType === EXPLODING_DICE) {
			_determineBust();
			if (_results[0] > 0) {
				descend();
				_results.sort(descend);
			}
			_finalResult = _results[0];
		} else {
			//TOTAL_DICE Result
			_results.forEach(function(roll) {
				_finalResult = _finalResult + roll;
			});
			_finalResult = _finalResult + bonus;
		}
	}

	/**
	 * @param a
	 * @param b
	 * @returns {number}
	 */
	function descend(a,b) {
		return b-a;
	}

	/**
	 * @private
	 */
	function _determineBust() {
		/** @type {number} */
		var rollCount = _results.length,
			bustCount = rollCount / 2;
		_results.forEach(function(roll) {
			if (roll === 1) {
				bustCount++;
			}
		});
		if (bustCount > rollCount) {
			_results = []; //empty the array
			_results.push(0); //set the first roll to zero
		}
	}

	/**
	 * @param rollType
	 */
	this.getFinalResult = function(rollType) {
		setFinalResult(rollType);
		return _finalResult;
	};

	function updateDieQty(value) {

	}
}
