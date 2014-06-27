/**
 * @license
 *
 * Regression.JS - Regression functions for javascript
 * http://tom-alexander.github.com/regression-js/
 *
 * copyright(c) 2014 Tom Alexander
 * Licensed under the MIT license.
 *
 **/

'use strict';

var Result;

Result = function (coefficients, fitted, string, data) {

    this.coefficients = coefficients;
    this.fitted = fitted;
    this.points = fitted; //deprecated
    this.string = string;
    this.data = data;

};

Result.prototype = [];

module.exports = Result;