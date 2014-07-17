/*!
 * Copyright (c) 2014 Tom Alexander
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.regression=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

var Models,
    Result = _dereq_('./Result'),
    linearSolver = _dereq_('./linearSolver');

Models = {

    /**
     * linear function
     * f(x) = ax + b
     *
     * @param data
     * @param options
     * @returns {Result}
     */
    linear: function (data, options) {

        var sum = [], points = [], coefficients = [], i, coordinate, string, len;

        for (i = 0; i < data.length; i += 1) {

            if (data[i][1]) {
                sum[0] += data[i][0];
                sum[1] += data[i][1];
                sum[2] += data[i][0] * data[i][0];
                sum[3] += data[i][0] * data[i][1];
                sum[4] += data[i][1] * data[i][1];
            }

        }

        coefficients[0] = (i * sum[3] - sum[0] * sum[1]) / (i * sum[2] - sum[0] * sum[0]);
        coefficients[1] = (sum[1] / i) - (coefficients[0] * sum[0]) / i;

        for (i = 0, len = data.length; i < len; i += 1) {
            coordinate = [data[i][0], data[i][0] * coefficients[0] + coefficients[1]];
            points.push(coordinate);
        }

        string = 'y = ' + Math.round(coefficients[1] * 100) / 100 + 'x + ' + Math.round(coefficients[1] * 100) / 100;
        return new Result(coefficients, points, string, data, options);
    },

    /**
     * Exponential function
     * y = e^x + c
     *
     * @param data
     * @param options
     * @returns {Result}
     */
    exponential: function (data, options) {
        var sum = [], points = [], i, len, denominator, coefficients = [], coordinate, string;

        for (i = 0; i < data.length; i += 1) {
            if (data[i][1]) {
                sum[0] += data[i][0];
                sum[1] += data[i][1];
                sum[2] += data[i][0] * data[i][0] * data[i][1];
                sum[3] += data[i][1] * Math.log(data[i][1]);
                sum[4] += data[i][0] * data[i][1] * Math.log(data[i][1]);
                sum[5] += data[i][0] * data[i][1];
            }
        }

        denominator = (sum[1] * sum[2] - sum[5] * sum[5]);
        coefficients[0] = Math.pow(Math.E, (sum[2] * sum[3] - sum[5] * sum[4]) / denominator);
        coefficients[1] = (sum[1] * sum[4] - sum[5] * sum[3]) / denominator;

        for (i = 0, len = data.length; i < len; i += 1) {
            coordinate = [data[i][0], coefficients[0] * Math.pow(Math.E, coefficients[1] * data[i][0])];
            points.push(coordinate);
        }

        string = 'y = ' + Math.round(coefficients[0] * 100) / 100 + 'e^(' + Math.round(coefficients[1] * 100) / 100 + 'x)';
        return new Result(coefficients, points, string, data, options);
    },

    /**
     * Logarithmic function
     * y = A + B * ln(x)
     *
     * @param data
     * @param options
     * @returns {Result}
     */
    logarithmic: function (data, options) {
        var sum = [], i,  points = [], coefficients = [], coordinate, string;

        for (i = 0; i < data.length; i += 1) {
            if (data[i][1]) {
                sum[0] += Math.log(data[i][0]);
                sum[1] += data[i][i] * Math.log(data[i][0]);
                sum[2] += data[i][i];
                sum[3] += Math.pow(Math.log(data[i][0]), 2);
            }
        }

        coefficients[1] = (i * sum[1] - sum[2] * sum[0]) / (i * sum[3] - sum[0] * sum[0]);
        coefficients[0] = (coefficients[1] * sum[0]) / i;

        for (i = 0; i < data.length; i += 1) {
            coordinate = [data[i][0], coefficients[1] + coefficients[0] * Math.log(data[i][0])];
            points.push(coordinate);
        }

        string = 'y = ' + Math.round(coefficients[1] * 100) / 100 + ' + ' + Math.round(coefficients[1] * 100) / 100 + ' ln(x)';
        return new Result(coefficients, points, string, data, options);
    },

    /**
     * Power function
     * y = A * x^B
     *
     * @param data
     * @param options
     * @returns {Result}
     */
    power: function (data, options) {
        var sum = [], i, points = [], coefficients = [], coordinate, string;

        for (i = 0; i < data.length; i += 1) {
            if (data[i][1]) {
                sum[0] += Math.log(data[i][0]);
                sum[1] += Math.log(data[i][1]) * Math.log(data[i][0]);
                sum[2] += Math.log(data[i][1]);
                sum[3] += Math.pow(Math.log(data[i][0]), 2);
            }
        }

        coefficients[1] = (i * sum[1] - sum[2] * sum[0]) / (i * sum[3] - sum[0] * sum[0]);
        coefficients[0] = Math.pow(Math.E, (sum[2] - coefficients[1] * sum[0]) / i);

        for (i = 0; i < data.length; i += 1) {
            coordinate = [data[i][0], coefficients[1] * Math.pow(data[i][0], coefficients[0])];
            points.push(coordinate);
        }

        string = 'y = ' + Math.round(coefficients[0] * 100) / 100 + 'x^' + Math.round(coefficients[0] * 100) / 100;
        return new Result(coefficients, points, string, data, options);
    },

    /**
     * polynomial
     * y = anx^n + an-1x^n-1 + ... + a1x + a0
     *
     * @param data
     * @param options
     * @returns {Result}
     */
    polynomial: function (data, options) {

        var lhs = [], rhs = [], points = [], a = 0, b = 0, i, k = options.degree + 1,
            coefficients, answer, l, c, j, w, string;

        for (i = 0; i < k; i += 1) {

            for (l = 0; l < data.length; l += 1) {
                if (data[l][1]) {
                    a += Math.pow(data[l][0], i) * data[l][1];
                }
            }

            lhs.push(a);
            a = 0;
            c = [];

            for (j = 0; j < k; j += 1) {
                for (l = 0; l < data.length; l += 1) {
                    if (data[l][1]) {
                        b += Math.pow(data[l][0], i + j);
                    }
                }
                c.push(b);
                b = 0;
            }
            rhs.push(c);
        }

        rhs.push(lhs);

        coefficients = linearSolver(rhs, k);

        for (i = 0; i < data.length; i += 1) {
            answer = 0;
            for (w = 0; w < coefficients.length; w += 1) {

                answer += coefficients[w] * Math.pow(data[i][0], w);
            }

            points.push([data[i][0], answer]);
        }

        string = 'y = ';

        for (i = coefficients.length - 1; i >= 0; i -= 1) {
            string += i > 1 ? Math.round(coefficients[i] * 100) / 100 + 'x^' + i + ' + ' : '';
            string += i === 1 ? Math.round(coefficients[i] * 100) / 100 + 'x' + ' + ' : '';
            string += i < 1 ? Math.round(coefficients[i] * 100) / 100 : '';
        }

        return new Result(coefficients, points, string, data, options);
    }

};

module.exports = Models;
},{"./Result":2,"./linearSolver":3}],2:[function(_dereq_,module,exports){
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
},{}],3:[function(_dereq_,module,exports){
/**
 * Regression.JS - Regression functions for javascript

 * Gaussian elimination to solve
 * system of linear equations
 *
 * http://en.wikipedia.org/wiki/Gaussian_elimination
 *
 **/

'use strict';

var linearSolver = function (a) {

    var i, j = 0, k = 0, maxRow = 0, tmp = 0, n = a.length - 1, x = [];

    for (i = 0; i < n; i += 1) {

        maxRow = i;
        for (j = i + 1; j < n; j += 1) {

            if (Math.abs(a[i][j]) > Math.abs(a[i][maxRow])) {
                maxRow = j;
            }
        }

        for (k = i; k < n + 1; k += 1) {
            tmp = a[k][i];
            a[k][i] = a[k][maxRow];
            a[k][maxRow] = tmp;
        }

        for (j = i + 1; j < n; j += 1) {

            for (k = n; k >= i; k -= 1) {
                a[k][j] -= a[k][i] * a[i][j] / a[i][i];
            }
        }
    }

    for (j = n - 1; j >= 0; j -= 1) {

        tmp = 0;

        for (k = j + 1; k < n; k += 1) {
            tmp += a[k][j] * x[k];
        }

        x[j] = (a[n][j] - tmp) / a[j][j];
    }

    return x;
};

module.exports = linearSolver;
},{}],4:[function(_dereq_,module,exports){
/**
* Regression.JS - Regression functions for javascript
* http://tom-alexander.github.com/regression-js/
*
**/

'use strict';

var fill,
    extend,
    defaults,
    regression,
    Models = _dereq_('./Models'),
    Result = _dereq_('./Result');

regression = function (modelName, data, options) {
    var isModel = Models.hasOwnProperty(modelName);

    options = Object.prototype.toString.call(options) !== '[object Object]' ? {degree: options} : options;

    options = extend(options, {
        fill: null,
        degree: 2
    });

    data = options.fill ? fill(data, options.fill) : data;
    return isModel ? Models[modelName](data, options) : new Result(null, null, null, data, options);
};

/**
 * extend (shallow merge)
 *
 * Adds missing values from the first
 * parameter with the value from the second parameter.
 *
 * @param options
 * @param defaults
 * @returns {{}}
 */
extend = function (options, defaults) {
    var property, mergedCopy = {};

    for (property in defaults) {
        if (defaults.hasOwnProperty(property)) {
            mergedCopy[property] = options.hasOwnProperty(property) ? options[property] : defaults[property];
        }
    }

    return mergedCopy;
};

/**
 * fill
 *
 * replaces null values of the data array with the value of the
 * value parameter. if 'next' is supplied the next non-null value in
 * the array will be filled. Likewise for when 'prev' is supplied.
 *
 * @param data
 * @param value
 */
fill = function (data, value) {
    var i, j, adjacentValue = null,
        isAdjacentValue = value === 'prev' || value === 'next';

    for (i = 0; i < data.length; i += 1) {
        j = value === 'next' ? data.length - (i + 1) : i;
        adjacentValue = data[j][1] || adjacentValue;
        data[j][1] = isAdjacentValue && !data[j][1] ? adjacentValue : data[j][1];
        data[j][1] = !isAdjacentValue && !data[j][1] ? value : data[j][1];
    }

    return data;
};

module.exports = regression;
},{"./Models":1,"./Result":2}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvVG9tL3Byb2plY3RzL3JlZ3Jlc3Npb24tanMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9Ub20vcHJvamVjdHMvcmVncmVzc2lvbi1qcy9zcmMvTW9kZWxzLmpzIiwiL1VzZXJzL1RvbS9wcm9qZWN0cy9yZWdyZXNzaW9uLWpzL3NyYy9SZXN1bHQuanMiLCIvVXNlcnMvVG9tL3Byb2plY3RzL3JlZ3Jlc3Npb24tanMvc3JjL2xpbmVhclNvbHZlci5qcyIsIi9Vc2Vycy9Ub20vcHJvamVjdHMvcmVncmVzc2lvbi1qcy9zcmMvcmVncmVzc2lvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9NQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBNb2RlbHMsXG4gICAgUmVzdWx0ID0gcmVxdWlyZSgnLi9SZXN1bHQnKSxcbiAgICBsaW5lYXJTb2x2ZXIgPSByZXF1aXJlKCcuL2xpbmVhclNvbHZlcicpO1xuXG5Nb2RlbHMgPSB7XG5cbiAgICAvKipcbiAgICAgKiBsaW5lYXIgZnVuY3Rpb25cbiAgICAgKiBmKHgpID0gYXggKyBiXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICogQHJldHVybnMge1Jlc3VsdH1cbiAgICAgKi9cbiAgICBsaW5lYXI6IGZ1bmN0aW9uIChkYXRhLCBvcHRpb25zKSB7XG5cbiAgICAgICAgdmFyIHN1bSA9IFtdLCBwb2ludHMgPSBbXSwgY29lZmZpY2llbnRzID0gW10sIGksIGNvb3JkaW5hdGUsIHN0cmluZywgbGVuO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSArPSAxKSB7XG5cbiAgICAgICAgICAgIGlmIChkYXRhW2ldWzFdKSB7XG4gICAgICAgICAgICAgICAgc3VtWzBdICs9IGRhdGFbaV1bMF07XG4gICAgICAgICAgICAgICAgc3VtWzFdICs9IGRhdGFbaV1bMV07XG4gICAgICAgICAgICAgICAgc3VtWzJdICs9IGRhdGFbaV1bMF0gKiBkYXRhW2ldWzBdO1xuICAgICAgICAgICAgICAgIHN1bVszXSArPSBkYXRhW2ldWzBdICogZGF0YVtpXVsxXTtcbiAgICAgICAgICAgICAgICBzdW1bNF0gKz0gZGF0YVtpXVsxXSAqIGRhdGFbaV1bMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvZWZmaWNpZW50c1swXSA9IChpICogc3VtWzNdIC0gc3VtWzBdICogc3VtWzFdKSAvIChpICogc3VtWzJdIC0gc3VtWzBdICogc3VtWzBdKTtcbiAgICAgICAgY29lZmZpY2llbnRzWzFdID0gKHN1bVsxXSAvIGkpIC0gKGNvZWZmaWNpZW50c1swXSAqIHN1bVswXSkgLyBpO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvb3JkaW5hdGUgPSBbZGF0YVtpXVswXSwgZGF0YVtpXVswXSAqIGNvZWZmaWNpZW50c1swXSArIGNvZWZmaWNpZW50c1sxXV07XG4gICAgICAgICAgICBwb2ludHMucHVzaChjb29yZGluYXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0cmluZyA9ICd5ID0gJyArIE1hdGgucm91bmQoY29lZmZpY2llbnRzWzFdICogMTAwKSAvIDEwMCArICd4ICsgJyArIE1hdGgucm91bmQoY29lZmZpY2llbnRzWzFdICogMTAwKSAvIDEwMDtcbiAgICAgICAgcmV0dXJuIG5ldyBSZXN1bHQoY29lZmZpY2llbnRzLCBwb2ludHMsIHN0cmluZywgZGF0YSwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEV4cG9uZW50aWFsIGZ1bmN0aW9uXG4gICAgICogeSA9IGVeeCArIGNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKiBAcmV0dXJucyB7UmVzdWx0fVxuICAgICAqL1xuICAgIGV4cG9uZW50aWFsOiBmdW5jdGlvbiAoZGF0YSwgb3B0aW9ucykge1xuICAgICAgICB2YXIgc3VtID0gW10sIHBvaW50cyA9IFtdLCBpLCBsZW4sIGRlbm9taW5hdG9yLCBjb2VmZmljaWVudHMgPSBbXSwgY29vcmRpbmF0ZSwgc3RyaW5nO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpZiAoZGF0YVtpXVsxXSkge1xuICAgICAgICAgICAgICAgIHN1bVswXSArPSBkYXRhW2ldWzBdO1xuICAgICAgICAgICAgICAgIHN1bVsxXSArPSBkYXRhW2ldWzFdO1xuICAgICAgICAgICAgICAgIHN1bVsyXSArPSBkYXRhW2ldWzBdICogZGF0YVtpXVswXSAqIGRhdGFbaV1bMV07XG4gICAgICAgICAgICAgICAgc3VtWzNdICs9IGRhdGFbaV1bMV0gKiBNYXRoLmxvZyhkYXRhW2ldWzFdKTtcbiAgICAgICAgICAgICAgICBzdW1bNF0gKz0gZGF0YVtpXVswXSAqIGRhdGFbaV1bMV0gKiBNYXRoLmxvZyhkYXRhW2ldWzFdKTtcbiAgICAgICAgICAgICAgICBzdW1bNV0gKz0gZGF0YVtpXVswXSAqIGRhdGFbaV1bMV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkZW5vbWluYXRvciA9IChzdW1bMV0gKiBzdW1bMl0gLSBzdW1bNV0gKiBzdW1bNV0pO1xuICAgICAgICBjb2VmZmljaWVudHNbMF0gPSBNYXRoLnBvdyhNYXRoLkUsIChzdW1bMl0gKiBzdW1bM10gLSBzdW1bNV0gKiBzdW1bNF0pIC8gZGVub21pbmF0b3IpO1xuICAgICAgICBjb2VmZmljaWVudHNbMV0gPSAoc3VtWzFdICogc3VtWzRdIC0gc3VtWzVdICogc3VtWzNdKSAvIGRlbm9taW5hdG9yO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGRhdGEubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvb3JkaW5hdGUgPSBbZGF0YVtpXVswXSwgY29lZmZpY2llbnRzWzBdICogTWF0aC5wb3coTWF0aC5FLCBjb2VmZmljaWVudHNbMV0gKiBkYXRhW2ldWzBdKV07XG4gICAgICAgICAgICBwb2ludHMucHVzaChjb29yZGluYXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0cmluZyA9ICd5ID0gJyArIE1hdGgucm91bmQoY29lZmZpY2llbnRzWzBdICogMTAwKSAvIDEwMCArICdlXignICsgTWF0aC5yb3VuZChjb2VmZmljaWVudHNbMV0gKiAxMDApIC8gMTAwICsgJ3gpJztcbiAgICAgICAgcmV0dXJuIG5ldyBSZXN1bHQoY29lZmZpY2llbnRzLCBwb2ludHMsIHN0cmluZywgZGF0YSwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIExvZ2FyaXRobWljIGZ1bmN0aW9uXG4gICAgICogeSA9IEEgKyBCICogbG4oeClcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKiBAcmV0dXJucyB7UmVzdWx0fVxuICAgICAqL1xuICAgIGxvZ2FyaXRobWljOiBmdW5jdGlvbiAoZGF0YSwgb3B0aW9ucykge1xuICAgICAgICB2YXIgc3VtID0gW10sIGksICBwb2ludHMgPSBbXSwgY29lZmZpY2llbnRzID0gW10sIGNvb3JkaW5hdGUsIHN0cmluZztcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgaWYgKGRhdGFbaV1bMV0pIHtcbiAgICAgICAgICAgICAgICBzdW1bMF0gKz0gTWF0aC5sb2coZGF0YVtpXVswXSk7XG4gICAgICAgICAgICAgICAgc3VtWzFdICs9IGRhdGFbaV1baV0gKiBNYXRoLmxvZyhkYXRhW2ldWzBdKTtcbiAgICAgICAgICAgICAgICBzdW1bMl0gKz0gZGF0YVtpXVtpXTtcbiAgICAgICAgICAgICAgICBzdW1bM10gKz0gTWF0aC5wb3coTWF0aC5sb2coZGF0YVtpXVswXSksIDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29lZmZpY2llbnRzWzFdID0gKGkgKiBzdW1bMV0gLSBzdW1bMl0gKiBzdW1bMF0pIC8gKGkgKiBzdW1bM10gLSBzdW1bMF0gKiBzdW1bMF0pO1xuICAgICAgICBjb2VmZmljaWVudHNbMF0gPSAoY29lZmZpY2llbnRzWzFdICogc3VtWzBdKSAvIGk7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvb3JkaW5hdGUgPSBbZGF0YVtpXVswXSwgY29lZmZpY2llbnRzWzFdICsgY29lZmZpY2llbnRzWzBdICogTWF0aC5sb2coZGF0YVtpXVswXSldO1xuICAgICAgICAgICAgcG9pbnRzLnB1c2goY29vcmRpbmF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHJpbmcgPSAneSA9ICcgKyBNYXRoLnJvdW5kKGNvZWZmaWNpZW50c1sxXSAqIDEwMCkgLyAxMDAgKyAnICsgJyArIE1hdGgucm91bmQoY29lZmZpY2llbnRzWzFdICogMTAwKSAvIDEwMCArICcgbG4oeCknO1xuICAgICAgICByZXR1cm4gbmV3IFJlc3VsdChjb2VmZmljaWVudHMsIHBvaW50cywgc3RyaW5nLCBkYXRhLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUG93ZXIgZnVuY3Rpb25cbiAgICAgKiB5ID0gQSAqIHheQlxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqIEByZXR1cm5zIHtSZXN1bHR9XG4gICAgICovXG4gICAgcG93ZXI6IGZ1bmN0aW9uIChkYXRhLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBzdW0gPSBbXSwgaSwgcG9pbnRzID0gW10sIGNvZWZmaWNpZW50cyA9IFtdLCBjb29yZGluYXRlLCBzdHJpbmc7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChkYXRhW2ldWzFdKSB7XG4gICAgICAgICAgICAgICAgc3VtWzBdICs9IE1hdGgubG9nKGRhdGFbaV1bMF0pO1xuICAgICAgICAgICAgICAgIHN1bVsxXSArPSBNYXRoLmxvZyhkYXRhW2ldWzFdKSAqIE1hdGgubG9nKGRhdGFbaV1bMF0pO1xuICAgICAgICAgICAgICAgIHN1bVsyXSArPSBNYXRoLmxvZyhkYXRhW2ldWzFdKTtcbiAgICAgICAgICAgICAgICBzdW1bM10gKz0gTWF0aC5wb3coTWF0aC5sb2coZGF0YVtpXVswXSksIDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29lZmZpY2llbnRzWzFdID0gKGkgKiBzdW1bMV0gLSBzdW1bMl0gKiBzdW1bMF0pIC8gKGkgKiBzdW1bM10gLSBzdW1bMF0gKiBzdW1bMF0pO1xuICAgICAgICBjb2VmZmljaWVudHNbMF0gPSBNYXRoLnBvdyhNYXRoLkUsIChzdW1bMl0gLSBjb2VmZmljaWVudHNbMV0gKiBzdW1bMF0pIC8gaSk7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvb3JkaW5hdGUgPSBbZGF0YVtpXVswXSwgY29lZmZpY2llbnRzWzFdICogTWF0aC5wb3coZGF0YVtpXVswXSwgY29lZmZpY2llbnRzWzBdKV07XG4gICAgICAgICAgICBwb2ludHMucHVzaChjb29yZGluYXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0cmluZyA9ICd5ID0gJyArIE1hdGgucm91bmQoY29lZmZpY2llbnRzWzBdICogMTAwKSAvIDEwMCArICd4XicgKyBNYXRoLnJvdW5kKGNvZWZmaWNpZW50c1swXSAqIDEwMCkgLyAxMDA7XG4gICAgICAgIHJldHVybiBuZXcgUmVzdWx0KGNvZWZmaWNpZW50cywgcG9pbnRzLCBzdHJpbmcsIGRhdGEsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBwb2x5bm9taWFsXG4gICAgICogeSA9IGFueF5uICsgYW4tMXhebi0xICsgLi4uICsgYTF4ICsgYTBcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKiBAcmV0dXJucyB7UmVzdWx0fVxuICAgICAqL1xuICAgIHBvbHlub21pYWw6IGZ1bmN0aW9uIChkYXRhLCBvcHRpb25zKSB7XG5cbiAgICAgICAgdmFyIGxocyA9IFtdLCByaHMgPSBbXSwgcG9pbnRzID0gW10sIGEgPSAwLCBiID0gMCwgaSwgayA9IG9wdGlvbnMuZGVncmVlICsgMSxcbiAgICAgICAgICAgIGNvZWZmaWNpZW50cywgYW5zd2VyLCBsLCBjLCBqLCB3LCBzdHJpbmc7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGs7IGkgKz0gMSkge1xuXG4gICAgICAgICAgICBmb3IgKGwgPSAwOyBsIDwgZGF0YS5sZW5ndGg7IGwgKz0gMSkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhW2xdWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgIGEgKz0gTWF0aC5wb3coZGF0YVtsXVswXSwgaSkgKiBkYXRhW2xdWzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGhzLnB1c2goYSk7XG4gICAgICAgICAgICBhID0gMDtcbiAgICAgICAgICAgIGMgPSBbXTtcblxuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGs7IGogKz0gMSkge1xuICAgICAgICAgICAgICAgIGZvciAobCA9IDA7IGwgPCBkYXRhLmxlbmd0aDsgbCArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhW2xdWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiICs9IE1hdGgucG93KGRhdGFbbF1bMF0sIGkgKyBqKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjLnB1c2goYik7XG4gICAgICAgICAgICAgICAgYiA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByaHMucHVzaChjKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJocy5wdXNoKGxocyk7XG5cbiAgICAgICAgY29lZmZpY2llbnRzID0gbGluZWFyU29sdmVyKHJocywgayk7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGFuc3dlciA9IDA7XG4gICAgICAgICAgICBmb3IgKHcgPSAwOyB3IDwgY29lZmZpY2llbnRzLmxlbmd0aDsgdyArPSAxKSB7XG5cbiAgICAgICAgICAgICAgICBhbnN3ZXIgKz0gY29lZmZpY2llbnRzW3ddICogTWF0aC5wb3coZGF0YVtpXVswXSwgdyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBvaW50cy5wdXNoKFtkYXRhW2ldWzBdLCBhbnN3ZXJdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0cmluZyA9ICd5ID0gJztcblxuICAgICAgICBmb3IgKGkgPSBjb2VmZmljaWVudHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpIC09IDEpIHtcbiAgICAgICAgICAgIHN0cmluZyArPSBpID4gMSA/IE1hdGgucm91bmQoY29lZmZpY2llbnRzW2ldICogMTAwKSAvIDEwMCArICd4XicgKyBpICsgJyArICcgOiAnJztcbiAgICAgICAgICAgIHN0cmluZyArPSBpID09PSAxID8gTWF0aC5yb3VuZChjb2VmZmljaWVudHNbaV0gKiAxMDApIC8gMTAwICsgJ3gnICsgJyArICcgOiAnJztcbiAgICAgICAgICAgIHN0cmluZyArPSBpIDwgMSA/IE1hdGgucm91bmQoY29lZmZpY2llbnRzW2ldICogMTAwKSAvIDEwMCA6ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBSZXN1bHQoY29lZmZpY2llbnRzLCBwb2ludHMsIHN0cmluZywgZGF0YSwgb3B0aW9ucyk7XG4gICAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsczsiLCIvKipcbiAqIEBsaWNlbnNlXG4gKlxuICogUmVncmVzc2lvbi5KUyAtIFJlZ3Jlc3Npb24gZnVuY3Rpb25zIGZvciBqYXZhc2NyaXB0XG4gKiBodHRwOi8vdG9tLWFsZXhhbmRlci5naXRodWIuY29tL3JlZ3Jlc3Npb24tanMvXG4gKlxuICogY29weXJpZ2h0KGMpIDIwMTQgVG9tIEFsZXhhbmRlclxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICpcbiAqKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVzdWx0O1xuXG5SZXN1bHQgPSBmdW5jdGlvbiAoY29lZmZpY2llbnRzLCBmaXR0ZWQsIHN0cmluZywgZGF0YSkge1xuXG4gICAgdGhpcy5jb2VmZmljaWVudHMgPSBjb2VmZmljaWVudHM7XG4gICAgdGhpcy5maXR0ZWQgPSBmaXR0ZWQ7XG4gICAgdGhpcy5wb2ludHMgPSBmaXR0ZWQ7IC8vZGVwcmVjYXRlZFxuICAgIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG5cbn07XG5cblJlc3VsdC5wcm90b3R5cGUgPSBbXTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZXN1bHQ7IiwiLyoqXG4gKiBSZWdyZXNzaW9uLkpTIC0gUmVncmVzc2lvbiBmdW5jdGlvbnMgZm9yIGphdmFzY3JpcHRcblxuICogR2F1c3NpYW4gZWxpbWluYXRpb24gdG8gc29sdmVcbiAqIHN5c3RlbSBvZiBsaW5lYXIgZXF1YXRpb25zXG4gKlxuICogaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9HYXVzc2lhbl9lbGltaW5hdGlvblxuICpcbiAqKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgbGluZWFyU29sdmVyID0gZnVuY3Rpb24gKGEpIHtcblxuICAgIHZhciBpLCBqID0gMCwgayA9IDAsIG1heFJvdyA9IDAsIHRtcCA9IDAsIG4gPSBhLmxlbmd0aCAtIDEsIHggPSBbXTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBuOyBpICs9IDEpIHtcblxuICAgICAgICBtYXhSb3cgPSBpO1xuICAgICAgICBmb3IgKGogPSBpICsgMTsgaiA8IG47IGogKz0gMSkge1xuXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoYVtpXVtqXSkgPiBNYXRoLmFicyhhW2ldW21heFJvd10pKSB7XG4gICAgICAgICAgICAgICAgbWF4Um93ID0gajtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoayA9IGk7IGsgPCBuICsgMTsgayArPSAxKSB7XG4gICAgICAgICAgICB0bXAgPSBhW2tdW2ldO1xuICAgICAgICAgICAgYVtrXVtpXSA9IGFba11bbWF4Um93XTtcbiAgICAgICAgICAgIGFba11bbWF4Um93XSA9IHRtcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaiA9IGkgKyAxOyBqIDwgbjsgaiArPSAxKSB7XG5cbiAgICAgICAgICAgIGZvciAoayA9IG47IGsgPj0gaTsgayAtPSAxKSB7XG4gICAgICAgICAgICAgICAgYVtrXVtqXSAtPSBhW2tdW2ldICogYVtpXVtqXSAvIGFbaV1baV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGogPSBuIC0gMTsgaiA+PSAwOyBqIC09IDEpIHtcblxuICAgICAgICB0bXAgPSAwO1xuXG4gICAgICAgIGZvciAoayA9IGogKyAxOyBrIDwgbjsgayArPSAxKSB7XG4gICAgICAgICAgICB0bXAgKz0gYVtrXVtqXSAqIHhba107XG4gICAgICAgIH1cblxuICAgICAgICB4W2pdID0gKGFbbl1bal0gLSB0bXApIC8gYVtqXVtqXTtcbiAgICB9XG5cbiAgICByZXR1cm4geDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbGluZWFyU29sdmVyOyIsIi8qKlxuKiBSZWdyZXNzaW9uLkpTIC0gUmVncmVzc2lvbiBmdW5jdGlvbnMgZm9yIGphdmFzY3JpcHRcbiogaHR0cDovL3RvbS1hbGV4YW5kZXIuZ2l0aHViLmNvbS9yZWdyZXNzaW9uLWpzL1xuKlxuKiovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGZpbGwsXG4gICAgZXh0ZW5kLFxuICAgIGRlZmF1bHRzLFxuICAgIHJlZ3Jlc3Npb24sXG4gICAgTW9kZWxzID0gcmVxdWlyZSgnLi9Nb2RlbHMnKSxcbiAgICBSZXN1bHQgPSByZXF1aXJlKCcuL1Jlc3VsdCcpO1xuXG5yZWdyZXNzaW9uID0gZnVuY3Rpb24gKG1vZGVsTmFtZSwgZGF0YSwgb3B0aW9ucykge1xuICAgIHZhciBpc01vZGVsID0gTW9kZWxzLmhhc093blByb3BlcnR5KG1vZGVsTmFtZSk7XG5cbiAgICBvcHRpb25zID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9wdGlvbnMpICE9PSAnW29iamVjdCBPYmplY3RdJyA/IHtkZWdyZWU6IG9wdGlvbnN9IDogb3B0aW9ucztcblxuICAgIG9wdGlvbnMgPSBleHRlbmQob3B0aW9ucywge1xuICAgICAgICBmaWxsOiBudWxsLFxuICAgICAgICBkZWdyZWU6IDJcbiAgICB9KTtcblxuICAgIGRhdGEgPSBvcHRpb25zLmZpbGwgPyBmaWxsKGRhdGEsIG9wdGlvbnMuZmlsbCkgOiBkYXRhO1xuICAgIHJldHVybiBpc01vZGVsID8gTW9kZWxzW21vZGVsTmFtZV0oZGF0YSwgb3B0aW9ucykgOiBuZXcgUmVzdWx0KG51bGwsIG51bGwsIG51bGwsIGRhdGEsIG9wdGlvbnMpO1xufTtcblxuLyoqXG4gKiBleHRlbmQgKHNoYWxsb3cgbWVyZ2UpXG4gKlxuICogQWRkcyBtaXNzaW5nIHZhbHVlcyBmcm9tIHRoZSBmaXJzdFxuICogcGFyYW1ldGVyIHdpdGggdGhlIHZhbHVlIGZyb20gdGhlIHNlY29uZCBwYXJhbWV0ZXIuXG4gKlxuICogQHBhcmFtIG9wdGlvbnNcbiAqIEBwYXJhbSBkZWZhdWx0c1xuICogQHJldHVybnMge3t9fVxuICovXG5leHRlbmQgPSBmdW5jdGlvbiAob3B0aW9ucywgZGVmYXVsdHMpIHtcbiAgICB2YXIgcHJvcGVydHksIG1lcmdlZENvcHkgPSB7fTtcblxuICAgIGZvciAocHJvcGVydHkgaW4gZGVmYXVsdHMpIHtcbiAgICAgICAgaWYgKGRlZmF1bHRzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgbWVyZ2VkQ29weVtwcm9wZXJ0eV0gPSBvcHRpb25zLmhhc093blByb3BlcnR5KHByb3BlcnR5KSA/IG9wdGlvbnNbcHJvcGVydHldIDogZGVmYXVsdHNbcHJvcGVydHldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lcmdlZENvcHk7XG59O1xuXG4vKipcbiAqIGZpbGxcbiAqXG4gKiByZXBsYWNlcyBudWxsIHZhbHVlcyBvZiB0aGUgZGF0YSBhcnJheSB3aXRoIHRoZSB2YWx1ZSBvZiB0aGVcbiAqIHZhbHVlIHBhcmFtZXRlci4gaWYgJ25leHQnIGlzIHN1cHBsaWVkIHRoZSBuZXh0IG5vbi1udWxsIHZhbHVlIGluXG4gKiB0aGUgYXJyYXkgd2lsbCBiZSBmaWxsZWQuIExpa2V3aXNlIGZvciB3aGVuICdwcmV2JyBpcyBzdXBwbGllZC5cbiAqXG4gKiBAcGFyYW0gZGF0YVxuICogQHBhcmFtIHZhbHVlXG4gKi9cbmZpbGwgPSBmdW5jdGlvbiAoZGF0YSwgdmFsdWUpIHtcbiAgICB2YXIgaSwgaiwgYWRqYWNlbnRWYWx1ZSA9IG51bGwsXG4gICAgICAgIGlzQWRqYWNlbnRWYWx1ZSA9IHZhbHVlID09PSAncHJldicgfHwgdmFsdWUgPT09ICduZXh0JztcblxuICAgIGZvciAoaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGogPSB2YWx1ZSA9PT0gJ25leHQnID8gZGF0YS5sZW5ndGggLSAoaSArIDEpIDogaTtcbiAgICAgICAgYWRqYWNlbnRWYWx1ZSA9IGRhdGFbal1bMV0gfHwgYWRqYWNlbnRWYWx1ZTtcbiAgICAgICAgZGF0YVtqXVsxXSA9IGlzQWRqYWNlbnRWYWx1ZSAmJiAhZGF0YVtqXVsxXSA/IGFkamFjZW50VmFsdWUgOiBkYXRhW2pdWzFdO1xuICAgICAgICBkYXRhW2pdWzFdID0gIWlzQWRqYWNlbnRWYWx1ZSAmJiAhZGF0YVtqXVsxXSA/IHZhbHVlIDogZGF0YVtqXVsxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcmVncmVzc2lvbjsiXX0=
(4)
});
