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

        var order = options.order, lhs = [], rhs = [], points = [], a = 0, b = 0, i, k = order + 1,
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

var Result = function (coefficients, fitted, string, data) {
    this.coefficients = coefficients;
    this.fitted = fitted;
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

    options = Object.prototype.toString.call(options) !== '[object Object]' ? {order: options} : options;

    options = extend(options, {
        fill: null,
        order: 2
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvVG9tL3Byb2plY3RzL3JlZ3Jlc3Npb24tanMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9Ub20vcHJvamVjdHMvcmVncmVzc2lvbi1qcy9zcmMvTW9kZWxzLmpzIiwiL1VzZXJzL1RvbS9wcm9qZWN0cy9yZWdyZXNzaW9uLWpzL3NyYy9SZXN1bHQuanMiLCIvVXNlcnMvVG9tL3Byb2plY3RzL3JlZ3Jlc3Npb24tanMvc3JjL2xpbmVhclNvbHZlci5qcyIsIi9Vc2Vycy9Ub20vcHJvamVjdHMvcmVncmVzc2lvbi1qcy9zcmMvcmVncmVzc2lvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9NQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIE1vZGVscyxcbiAgICBSZXN1bHQgPSByZXF1aXJlKCcuL1Jlc3VsdCcpLFxuICAgIGxpbmVhclNvbHZlciA9IHJlcXVpcmUoJy4vbGluZWFyU29sdmVyJyk7XG5cbk1vZGVscyA9IHtcblxuICAgIC8qKlxuICAgICAqIGxpbmVhciBmdW5jdGlvblxuICAgICAqIGYoeCkgPSBheCArIGJcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKiBAcmV0dXJucyB7UmVzdWx0fVxuICAgICAqL1xuICAgIGxpbmVhcjogZnVuY3Rpb24gKGRhdGEsIG9wdGlvbnMpIHtcblxuICAgICAgICB2YXIgc3VtID0gW10sIHBvaW50cyA9IFtdLCBjb2VmZmljaWVudHMgPSBbXSwgaSwgY29vcmRpbmF0ZSwgc3RyaW5nLCBsZW47XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpICs9IDEpIHtcblxuICAgICAgICAgICAgaWYgKGRhdGFbaV1bMV0pIHtcbiAgICAgICAgICAgICAgICBzdW1bMF0gKz0gZGF0YVtpXVswXTtcbiAgICAgICAgICAgICAgICBzdW1bMV0gKz0gZGF0YVtpXVsxXTtcbiAgICAgICAgICAgICAgICBzdW1bMl0gKz0gZGF0YVtpXVswXSAqIGRhdGFbaV1bMF07XG4gICAgICAgICAgICAgICAgc3VtWzNdICs9IGRhdGFbaV1bMF0gKiBkYXRhW2ldWzFdO1xuICAgICAgICAgICAgICAgIHN1bVs0XSArPSBkYXRhW2ldWzFdICogZGF0YVtpXVsxXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgY29lZmZpY2llbnRzWzBdID0gKGkgKiBzdW1bM10gLSBzdW1bMF0gKiBzdW1bMV0pIC8gKGkgKiBzdW1bMl0gLSBzdW1bMF0gKiBzdW1bMF0pO1xuICAgICAgICBjb2VmZmljaWVudHNbMV0gPSAoc3VtWzFdIC8gaSkgLSAoY29lZmZpY2llbnRzWzBdICogc3VtWzBdKSAvIGk7XG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAgY29vcmRpbmF0ZSA9IFtkYXRhW2ldWzBdLCBkYXRhW2ldWzBdICogY29lZmZpY2llbnRzWzBdICsgY29lZmZpY2llbnRzWzFdXTtcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKGNvb3JkaW5hdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RyaW5nID0gJ3kgPSAnICsgTWF0aC5yb3VuZChjb2VmZmljaWVudHNbMV0gKiAxMDApIC8gMTAwICsgJ3ggKyAnICsgTWF0aC5yb3VuZChjb2VmZmljaWVudHNbMV0gKiAxMDApIC8gMTAwO1xuICAgICAgICByZXR1cm4gbmV3IFJlc3VsdChjb2VmZmljaWVudHMsIHBvaW50cywgc3RyaW5nLCBkYXRhLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRXhwb25lbnRpYWwgZnVuY3Rpb25cbiAgICAgKiB5ID0gZV54ICsgY1xuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqIEByZXR1cm5zIHtSZXN1bHR9XG4gICAgICovXG4gICAgZXhwb25lbnRpYWw6IGZ1bmN0aW9uIChkYXRhLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBzdW0gPSBbXSwgcG9pbnRzID0gW10sIGksIGxlbiwgZGVub21pbmF0b3IsIGNvZWZmaWNpZW50cyA9IFtdLCBjb29yZGluYXRlLCBzdHJpbmc7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChkYXRhW2ldWzFdKSB7XG4gICAgICAgICAgICAgICAgc3VtWzBdICs9IGRhdGFbaV1bMF07XG4gICAgICAgICAgICAgICAgc3VtWzFdICs9IGRhdGFbaV1bMV07XG4gICAgICAgICAgICAgICAgc3VtWzJdICs9IGRhdGFbaV1bMF0gKiBkYXRhW2ldWzBdICogZGF0YVtpXVsxXTtcbiAgICAgICAgICAgICAgICBzdW1bM10gKz0gZGF0YVtpXVsxXSAqIE1hdGgubG9nKGRhdGFbaV1bMV0pO1xuICAgICAgICAgICAgICAgIHN1bVs0XSArPSBkYXRhW2ldWzBdICogZGF0YVtpXVsxXSAqIE1hdGgubG9nKGRhdGFbaV1bMV0pO1xuICAgICAgICAgICAgICAgIHN1bVs1XSArPSBkYXRhW2ldWzBdICogZGF0YVtpXVsxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGRlbm9taW5hdG9yID0gKHN1bVsxXSAqIHN1bVsyXSAtIHN1bVs1XSAqIHN1bVs1XSk7XG4gICAgICAgIGNvZWZmaWNpZW50c1swXSA9IE1hdGgucG93KE1hdGguRSwgKHN1bVsyXSAqIHN1bVszXSAtIHN1bVs1XSAqIHN1bVs0XSkgLyBkZW5vbWluYXRvcik7XG4gICAgICAgIGNvZWZmaWNpZW50c1sxXSA9IChzdW1bMV0gKiBzdW1bNF0gLSBzdW1bNV0gKiBzdW1bM10pIC8gZGVub21pbmF0b3I7XG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gZGF0YS5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAgY29vcmRpbmF0ZSA9IFtkYXRhW2ldWzBdLCBjb2VmZmljaWVudHNbMF0gKiBNYXRoLnBvdyhNYXRoLkUsIGNvZWZmaWNpZW50c1sxXSAqIGRhdGFbaV1bMF0pXTtcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKGNvb3JkaW5hdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RyaW5nID0gJ3kgPSAnICsgTWF0aC5yb3VuZChjb2VmZmljaWVudHNbMF0gKiAxMDApIC8gMTAwICsgJ2VeKCcgKyBNYXRoLnJvdW5kKGNvZWZmaWNpZW50c1sxXSAqIDEwMCkgLyAxMDAgKyAneCknO1xuICAgICAgICByZXR1cm4gbmV3IFJlc3VsdChjb2VmZmljaWVudHMsIHBvaW50cywgc3RyaW5nLCBkYXRhLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTG9nYXJpdGhtaWMgZnVuY3Rpb25cbiAgICAgKiB5ID0gQSArIEIgKiBsbih4KVxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqIEByZXR1cm5zIHtSZXN1bHR9XG4gICAgICovXG4gICAgbG9nYXJpdGhtaWM6IGZ1bmN0aW9uIChkYXRhLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBzdW0gPSBbXSwgaSwgIHBvaW50cyA9IFtdLCBjb2VmZmljaWVudHMgPSBbXSwgY29vcmRpbmF0ZSwgc3RyaW5nO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpZiAoZGF0YVtpXVsxXSkge1xuICAgICAgICAgICAgICAgIHN1bVswXSArPSBNYXRoLmxvZyhkYXRhW2ldWzBdKTtcbiAgICAgICAgICAgICAgICBzdW1bMV0gKz0gZGF0YVtpXVtpXSAqIE1hdGgubG9nKGRhdGFbaV1bMF0pO1xuICAgICAgICAgICAgICAgIHN1bVsyXSArPSBkYXRhW2ldW2ldO1xuICAgICAgICAgICAgICAgIHN1bVszXSArPSBNYXRoLnBvdyhNYXRoLmxvZyhkYXRhW2ldWzBdKSwgMik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb2VmZmljaWVudHNbMV0gPSAoaSAqIHN1bVsxXSAtIHN1bVsyXSAqIHN1bVswXSkgLyAoaSAqIHN1bVszXSAtIHN1bVswXSAqIHN1bVswXSk7XG4gICAgICAgIGNvZWZmaWNpZW50c1swXSA9IChjb2VmZmljaWVudHNbMV0gKiBzdW1bMF0pIC8gaTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY29vcmRpbmF0ZSA9IFtkYXRhW2ldWzBdLCBjb2VmZmljaWVudHNbMV0gKyBjb2VmZmljaWVudHNbMF0gKiBNYXRoLmxvZyhkYXRhW2ldWzBdKV07XG4gICAgICAgICAgICBwb2ludHMucHVzaChjb29yZGluYXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0cmluZyA9ICd5ID0gJyArIE1hdGgucm91bmQoY29lZmZpY2llbnRzWzFdICogMTAwKSAvIDEwMCArICcgKyAnICsgTWF0aC5yb3VuZChjb2VmZmljaWVudHNbMV0gKiAxMDApIC8gMTAwICsgJyBsbih4KSc7XG4gICAgICAgIHJldHVybiBuZXcgUmVzdWx0KGNvZWZmaWNpZW50cywgcG9pbnRzLCBzdHJpbmcsIGRhdGEsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQb3dlciBmdW5jdGlvblxuICAgICAqIHkgPSBBICogeF5CXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICogQHJldHVybnMge1Jlc3VsdH1cbiAgICAgKi9cbiAgICBwb3dlcjogZnVuY3Rpb24gKGRhdGEsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHN1bSA9IFtdLCBpLCBwb2ludHMgPSBbXSwgY29lZmZpY2llbnRzID0gW10sIGNvb3JkaW5hdGUsIHN0cmluZztcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgaWYgKGRhdGFbaV1bMV0pIHtcbiAgICAgICAgICAgICAgICBzdW1bMF0gKz0gTWF0aC5sb2coZGF0YVtpXVswXSk7XG4gICAgICAgICAgICAgICAgc3VtWzFdICs9IE1hdGgubG9nKGRhdGFbaV1bMV0pICogTWF0aC5sb2coZGF0YVtpXVswXSk7XG4gICAgICAgICAgICAgICAgc3VtWzJdICs9IE1hdGgubG9nKGRhdGFbaV1bMV0pO1xuICAgICAgICAgICAgICAgIHN1bVszXSArPSBNYXRoLnBvdyhNYXRoLmxvZyhkYXRhW2ldWzBdKSwgMik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb2VmZmljaWVudHNbMV0gPSAoaSAqIHN1bVsxXSAtIHN1bVsyXSAqIHN1bVswXSkgLyAoaSAqIHN1bVszXSAtIHN1bVswXSAqIHN1bVswXSk7XG4gICAgICAgIGNvZWZmaWNpZW50c1swXSA9IE1hdGgucG93KE1hdGguRSwgKHN1bVsyXSAtIGNvZWZmaWNpZW50c1sxXSAqIHN1bVswXSkgLyBpKTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY29vcmRpbmF0ZSA9IFtkYXRhW2ldWzBdLCBjb2VmZmljaWVudHNbMV0gKiBNYXRoLnBvdyhkYXRhW2ldWzBdLCBjb2VmZmljaWVudHNbMF0pXTtcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKGNvb3JkaW5hdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RyaW5nID0gJ3kgPSAnICsgTWF0aC5yb3VuZChjb2VmZmljaWVudHNbMF0gKiAxMDApIC8gMTAwICsgJ3heJyArIE1hdGgucm91bmQoY29lZmZpY2llbnRzWzBdICogMTAwKSAvIDEwMDtcbiAgICAgICAgcmV0dXJuIG5ldyBSZXN1bHQoY29lZmZpY2llbnRzLCBwb2ludHMsIHN0cmluZywgZGF0YSwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHBvbHlub21pYWxcbiAgICAgKiB5ID0gYW54Xm4gKyBhbi0xeF5uLTEgKyAuLi4gKyBhMXggKyBhMFxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqIEByZXR1cm5zIHtSZXN1bHR9XG4gICAgICovXG4gICAgcG9seW5vbWlhbDogZnVuY3Rpb24gKGRhdGEsIG9wdGlvbnMpIHtcblxuICAgICAgICB2YXIgb3JkZXIgPSBvcHRpb25zLm9yZGVyLCBsaHMgPSBbXSwgcmhzID0gW10sIHBvaW50cyA9IFtdLCBhID0gMCwgYiA9IDAsIGksIGsgPSBvcmRlciArIDEsXG4gICAgICAgICAgICBjb2VmZmljaWVudHMsIGFuc3dlciwgbCwgYywgaiwgdywgc3RyaW5nO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBrOyBpICs9IDEpIHtcblxuICAgICAgICAgICAgZm9yIChsID0gMDsgbCA8IGRhdGEubGVuZ3RoOyBsICs9IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YVtsXVsxXSkge1xuICAgICAgICAgICAgICAgICAgICBhICs9IE1hdGgucG93KGRhdGFbbF1bMF0sIGkpICogZGF0YVtsXVsxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxocy5wdXNoKGEpO1xuICAgICAgICAgICAgYSA9IDA7XG4gICAgICAgICAgICBjID0gW107XG5cbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBrOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGwgPSAwOyBsIDwgZGF0YS5sZW5ndGg7IGwgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVtsXVsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYiArPSBNYXRoLnBvdyhkYXRhW2xdWzBdLCBpICsgaik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYy5wdXNoKGIpO1xuICAgICAgICAgICAgICAgIGIgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmhzLnB1c2goYyk7XG4gICAgICAgIH1cblxuICAgICAgICByaHMucHVzaChsaHMpO1xuXG4gICAgICAgIGNvZWZmaWNpZW50cyA9IGxpbmVhclNvbHZlcihyaHMsIGspO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBhbnN3ZXIgPSAwO1xuICAgICAgICAgICAgZm9yICh3ID0gMDsgdyA8IGNvZWZmaWNpZW50cy5sZW5ndGg7IHcgKz0gMSkge1xuXG4gICAgICAgICAgICAgICAgYW5zd2VyICs9IGNvZWZmaWNpZW50c1t3XSAqIE1hdGgucG93KGRhdGFbaV1bMF0sIHcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwb2ludHMucHVzaChbZGF0YVtpXVswXSwgYW5zd2VyXSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHJpbmcgPSAneSA9ICc7XG5cbiAgICAgICAgZm9yIChpID0gY29lZmZpY2llbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaSAtPSAxKSB7XG4gICAgICAgICAgICBzdHJpbmcgKz0gaSA+IDEgPyBNYXRoLnJvdW5kKGNvZWZmaWNpZW50c1tpXSAqIDEwMCkgLyAxMDAgKyAneF4nICsgaSArICcgKyAnIDogJyc7XG4gICAgICAgICAgICBzdHJpbmcgKz0gaSA9PT0gMSA/IE1hdGgucm91bmQoY29lZmZpY2llbnRzW2ldICogMTAwKSAvIDEwMCArICd4JyArICcgKyAnIDogJyc7XG4gICAgICAgICAgICBzdHJpbmcgKz0gaSA8IDEgPyBNYXRoLnJvdW5kKGNvZWZmaWNpZW50c1tpXSAqIDEwMCkgLyAxMDAgOiAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUmVzdWx0KGNvZWZmaWNpZW50cywgcG9pbnRzLCBzdHJpbmcsIGRhdGEsIG9wdGlvbnMpO1xuICAgIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbHM7IiwiLyoqXG4gKiBAbGljZW5zZVxuICpcbiAqIFJlZ3Jlc3Npb24uSlMgLSBSZWdyZXNzaW9uIGZ1bmN0aW9ucyBmb3IgamF2YXNjcmlwdFxuICogaHR0cDovL3RvbS1hbGV4YW5kZXIuZ2l0aHViLmNvbS9yZWdyZXNzaW9uLWpzL1xuICpcbiAqIGNvcHlyaWdodChjKSAyMDE0IFRvbSBBbGV4YW5kZXJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqXG4gKiovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlc3VsdCA9IGZ1bmN0aW9uIChjb2VmZmljaWVudHMsIGZpdHRlZCwgc3RyaW5nLCBkYXRhKSB7XG4gICAgdGhpcy5jb2VmZmljaWVudHMgPSBjb2VmZmljaWVudHM7XG4gICAgdGhpcy5maXR0ZWQgPSBmaXR0ZWQ7XG4gICAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbn07XG5cblJlc3VsdC5wcm90b3R5cGUgPSBbXTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZXN1bHQ7IiwiLyoqXG4gKiBSZWdyZXNzaW9uLkpTIC0gUmVncmVzc2lvbiBmdW5jdGlvbnMgZm9yIGphdmFzY3JpcHRcblxuICogR2F1c3NpYW4gZWxpbWluYXRpb24gdG8gc29sdmVcbiAqIHN5c3RlbSBvZiBsaW5lYXIgZXF1YXRpb25zXG4gKlxuICogaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9HYXVzc2lhbl9lbGltaW5hdGlvblxuICpcbiAqKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgbGluZWFyU29sdmVyID0gZnVuY3Rpb24gKGEpIHtcblxuICAgIHZhciBpLCBqID0gMCwgayA9IDAsIG1heFJvdyA9IDAsIHRtcCA9IDAsIG4gPSBhLmxlbmd0aCAtIDEsIHggPSBbXTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBuOyBpICs9IDEpIHtcblxuICAgICAgICBtYXhSb3cgPSBpO1xuICAgICAgICBmb3IgKGogPSBpICsgMTsgaiA8IG47IGogKz0gMSkge1xuXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoYVtpXVtqXSkgPiBNYXRoLmFicyhhW2ldW21heFJvd10pKSB7XG4gICAgICAgICAgICAgICAgbWF4Um93ID0gajtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoayA9IGk7IGsgPCBuICsgMTsgayArPSAxKSB7XG4gICAgICAgICAgICB0bXAgPSBhW2tdW2ldO1xuICAgICAgICAgICAgYVtrXVtpXSA9IGFba11bbWF4Um93XTtcbiAgICAgICAgICAgIGFba11bbWF4Um93XSA9IHRtcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaiA9IGkgKyAxOyBqIDwgbjsgaiArPSAxKSB7XG5cbiAgICAgICAgICAgIGZvciAoayA9IG47IGsgPj0gaTsgayAtPSAxKSB7XG4gICAgICAgICAgICAgICAgYVtrXVtqXSAtPSBhW2tdW2ldICogYVtpXVtqXSAvIGFbaV1baV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGogPSBuIC0gMTsgaiA+PSAwOyBqIC09IDEpIHtcblxuICAgICAgICB0bXAgPSAwO1xuXG4gICAgICAgIGZvciAoayA9IGogKyAxOyBrIDwgbjsgayArPSAxKSB7XG4gICAgICAgICAgICB0bXAgKz0gYVtrXVtqXSAqIHhba107XG4gICAgICAgIH1cblxuICAgICAgICB4W2pdID0gKGFbbl1bal0gLSB0bXApIC8gYVtqXVtqXTtcbiAgICB9XG5cbiAgICByZXR1cm4geDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbGluZWFyU29sdmVyOyIsIi8qKlxuKiBSZWdyZXNzaW9uLkpTIC0gUmVncmVzc2lvbiBmdW5jdGlvbnMgZm9yIGphdmFzY3JpcHRcbiogaHR0cDovL3RvbS1hbGV4YW5kZXIuZ2l0aHViLmNvbS9yZWdyZXNzaW9uLWpzL1xuKlxuKiovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGZpbGwsXG4gICAgZXh0ZW5kLFxuICAgIGRlZmF1bHRzLFxuICAgIHJlZ3Jlc3Npb24sXG4gICAgTW9kZWxzID0gcmVxdWlyZSgnLi9Nb2RlbHMnKSxcbiAgICBSZXN1bHQgPSByZXF1aXJlKCcuL1Jlc3VsdCcpO1xuXG5yZWdyZXNzaW9uID0gZnVuY3Rpb24gKG1vZGVsTmFtZSwgZGF0YSwgb3B0aW9ucykge1xuICAgIHZhciBpc01vZGVsID0gTW9kZWxzLmhhc093blByb3BlcnR5KG1vZGVsTmFtZSk7XG5cbiAgICBvcHRpb25zID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9wdGlvbnMpICE9PSAnW29iamVjdCBPYmplY3RdJyA/IHtvcmRlcjogb3B0aW9uc30gOiBvcHRpb25zO1xuXG4gICAgb3B0aW9ucyA9IGV4dGVuZChvcHRpb25zLCB7XG4gICAgICAgIGZpbGw6IG51bGwsXG4gICAgICAgIG9yZGVyOiAyXG4gICAgfSk7XG5cbiAgICBkYXRhID0gb3B0aW9ucy5maWxsID8gZmlsbChkYXRhLCBvcHRpb25zLmZpbGwpIDogZGF0YTtcbiAgICByZXR1cm4gaXNNb2RlbCA/IE1vZGVsc1ttb2RlbE5hbWVdKGRhdGEsIG9wdGlvbnMpIDogbmV3IFJlc3VsdChudWxsLCBudWxsLCBudWxsLCBkYXRhLCBvcHRpb25zKTtcbn07XG5cbi8qKlxuICogZXh0ZW5kIChzaGFsbG93IG1lcmdlKVxuICpcbiAqIEFkZHMgbWlzc2luZyB2YWx1ZXMgZnJvbSB0aGUgZmlyc3RcbiAqIHBhcmFtZXRlciB3aXRoIHRoZSB2YWx1ZSBmcm9tIHRoZSBzZWNvbmQgcGFyYW1ldGVyLlxuICpcbiAqIEBwYXJhbSBvcHRpb25zXG4gKiBAcGFyYW0gZGVmYXVsdHNcbiAqIEByZXR1cm5zIHt7fX1cbiAqL1xuZXh0ZW5kID0gZnVuY3Rpb24gKG9wdGlvbnMsIGRlZmF1bHRzKSB7XG4gICAgdmFyIHByb3BlcnR5LCBtZXJnZWRDb3B5ID0ge307XG5cbiAgICBmb3IgKHByb3BlcnR5IGluIGRlZmF1bHRzKSB7XG4gICAgICAgIGlmIChkZWZhdWx0cy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgIG1lcmdlZENvcHlbcHJvcGVydHldID0gb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkgPyBvcHRpb25zW3Byb3BlcnR5XSA6IGRlZmF1bHRzW3Byb3BlcnR5XTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtZXJnZWRDb3B5O1xufTtcblxuLyoqXG4gKiBmaWxsXG4gKlxuICogcmVwbGFjZXMgbnVsbCB2YWx1ZXMgb2YgdGhlIGRhdGEgYXJyYXkgd2l0aCB0aGUgdmFsdWUgb2YgdGhlXG4gKiB2YWx1ZSBwYXJhbWV0ZXIuIGlmICduZXh0JyBpcyBzdXBwbGllZCB0aGUgbmV4dCBub24tbnVsbCB2YWx1ZSBpblxuICogdGhlIGFycmF5IHdpbGwgYmUgZmlsbGVkLiBMaWtld2lzZSBmb3Igd2hlbiAncHJldicgaXMgc3VwcGxpZWQuXG4gKlxuICogQHBhcmFtIGRhdGFcbiAqIEBwYXJhbSB2YWx1ZVxuICovXG5maWxsID0gZnVuY3Rpb24gKGRhdGEsIHZhbHVlKSB7XG4gICAgdmFyIGksIGosIGFkamFjZW50VmFsdWUgPSBudWxsLFxuICAgICAgICBpc0FkamFjZW50VmFsdWUgPSB2YWx1ZSA9PT0gJ3ByZXYnIHx8IHZhbHVlID09PSAnbmV4dCc7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBqID0gdmFsdWUgPT09ICduZXh0JyA/IGRhdGEubGVuZ3RoIC0gKGkgKyAxKSA6IGk7XG4gICAgICAgIGFkamFjZW50VmFsdWUgPSBkYXRhW2pdWzFdIHx8IGFkamFjZW50VmFsdWU7XG4gICAgICAgIGRhdGFbal1bMV0gPSBpc0FkamFjZW50VmFsdWUgJiYgIWRhdGFbal1bMV0gPyBhZGphY2VudFZhbHVlIDogZGF0YVtqXVsxXTtcbiAgICAgICAgZGF0YVtqXVsxXSA9ICFpc0FkamFjZW50VmFsdWUgJiYgIWRhdGFbal1bMV0gPyB2YWx1ZSA6IGRhdGFbal1bMV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlZ3Jlc3Npb247Il19
(4)
});
