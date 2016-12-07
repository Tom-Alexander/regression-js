/**
* @license
*
* Regression.JS - Regression functions for javascript
* http://tom-alexander.github.com/regression-js/
*
* copyright(c) 2013 Tom Alexander
* Licensed under the MIT license.
*
* @module regression - Least-squares regression functions for JavaScript
**/

/* global define */
(function _umd(global, factory) {
  // UMD Format for exports. Works with all module systems: AMD/RequireJS, CommonJS, and global
  var mod;

  // AMD
  if (typeof define === 'function' && define.amd) {
    define('regression', ['exports'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports);
  } else {
    mod = {
      exports: {},
    };

    factory(mod.exports);
    global.regression = mod.exports;
  }
})(this, function _regressionUmdFactory(exports) {
  'use strict';

  // For node.js and CommonJS
  Object.defineProperty(exports, '__esModule', { value: true });

  /**
   * Determine the coefficient of determination (r^2) of a fit from the observations and predictions.
   *
   * @param {Array<Array<number>>} observations - Pairs of observed x-y values
   * @param {Array<Array<number>>} predictions - Pairs of observed predicted x-y values
   *
   * @return {number} - The r^2 value, or NaN if one cannot be calculated.
   */
  function determinationCoefficient(observations, predictions) {
    var sum = observations.reduce(function (accum, observation) { return accum + observation[1]; });
    var mean = sum / observations.length;

    // Sum of squares of differences from the mean in the dependent variable
    var ssyy = observations.reduce(function (accum, observation) {
      var diff = observation[1] - mean;
      return accum + diff * diff;
    });

    // Sum of squares of resudulals
    var sse = observations.reduce(function (accum, observation, ix) {
      var resid = observation[1] - predictions[ix];
      return accum + resid * resid;
    });

    // If ssyy is zero, r^2 is meaningless, so NaN is an appropriate answer.
    return 1 - (sse / ssyy);
  }

  /**
   * Determine the solution of a system of linear equations A * x = b using Gaussian elimination.
   *
   * @param {Array<Array<number>>} matrix - A 2-d matrix of data in row-major form [ A | b ]
   * @param {number} order - How many degrees to solve for
   *
   * @return {Array<number>} - Vector of normalized solution coefficients matrix (x)
   */
  function gaussianElimination(matrix, order) {
    var i = 0;
    var j = 0;
    var k = 0;
    var maxrow = 0;
    var tmp = 0;
    var n = matrix.length - 1;
    var coefficients = new Array(order);

    for (i = 0; i < n; i++) {
      maxrow = i;
      for (j = i + 1; j < n; j++) {
        if (Math.abs(matrix[i][j]) > Math.abs(matrix[i][maxrow])) {
          maxrow = j;
        }
      }

      for (k = i; k < n + 1; k++) {
        tmp = matrix[k][i];
        matrix[k][i] = matrix[k][maxrow];
        matrix[k][maxrow] = tmp;
      }

      for (j = i + 1; j < n; j++) {
        for (k = n; k >= i; k--) {
          matrix[k][j] -= matrix[k][i] * matrix[i][j] / matrix[i][i];
        }
      }
    }

    for (j = n - 1; j >= 0; j--) {
      tmp = 0;
      for (k = j + 1; k < n; k++) {
        tmp += matrix[k][j] * coefficients[k];
      }

      coefficients[j] = (matrix[n][j] - tmp) / matrix[j][j];
    }

    return coefficients;
  }

  /**
   * Round a number to a precision, specificed in number of decimal places
   *
   * @param {number} number - The number to round
   * @param {number} precision - The number of decimal places to round to:
   *                             > 0 means decimals, < 0 means powers of 10
   *
   * @return {numbr} - The number, rounded
   */
  function _round(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  /** Precision to use when displaying string form of equation */
  var PREC = 2;

  /**
   * The set of all fitting methods
   *
   * @namespace
   */
  var methods = {
    linear: function (data) {
      var sum = [0, 0, 0, 0, 0];
      var results;
      var gradient;
      var intercept;
      var len = data.length;

      for (var n = 0; n < len; n++) {
        if (data[n][1] !== null) {
          sum[0] += data[n][0];
          sum[1] += data[n][1];
          sum[2] += data[n][0] * data[n][0];
          sum[3] += data[n][0] * data[n][1];
          sum[4] += data[n][1] * data[n][1];
        }
      }

      gradient = (len * sum[3] - sum[0] * sum[1]) / (len  * sum[2] - sum[0] * sum[0]);
      intercept = (sum[1] / len) - (gradient * sum[0]) / len;

      results = data.map(function (xyPair) {
        var x = xyPair[0];
        return [x, gradient * x + intercept];
      });

      return {
        r2: determinationCoefficient(data, results),
        equation: [gradient, intercept],
        points: results,
        string: 'y = ' + _round(gradient, PREC) + 'x + ' + _round(intercept, PREC),
      };
    },

    linearthroughorigin: function (data) {
      var sum = [0, 0];
      var gradient;
      var results;

      for (var n = 0; n < data.length; n++) {
        if (data[n][1] !== null) {
          sum[0] += data[n][0] * data[n][0]; // sumSqX
          sum[1] += data[n][0] * data[n][1]; // sumXY
        }
      }

      gradient = sum[1] / sum[0];

      results = data.map(function (xyPair) {
        var x = xyPair[0];
        return [x, gradient * x];
      });

      return {
        r2: determinationCoefficient(data, results),
        equation: [gradient],
        points: results,
        string: 'y = ' + _round(gradient, PREC) + 'x',
      };
    },

    exponential: function (data) {
      var sum = [0, 0, 0, 0, 0, 0];
      var denominator;
      var coeffA;
      var coeffB;
      var results;

      for (var n = 0; n < data.length; n++) {
        if (data[n][1] !== null) {
          sum[0] += data[n][0];
          sum[1] += data[n][1];
          sum[2] += data[n][0] * data[n][0] * data[n][1];
          sum[3] += data[n][1] * Math.log(data[n][1]);
          sum[4] += data[n][0] * data[n][1] * Math.log(data[n][1]);
          sum[5] += data[n][0] * data[n][1];
        }
      }

      denominator = (sum[1] * sum[2] - sum[5] * sum[5]);
      coeffA = Math.exp((sum[2] * sum[3] - sum[5] * sum[4]) / denominator);
      coeffB = (sum[1] * sum[4] - sum[5] * sum[3]) / denominator;

      results = data.map(function (xyPair) {
        var x = xyPair[0];
        return [x, coeffA * Math.exp(coeffB * x)];
      });

      return {
        r2: determinationCoefficient(data, results),
        equation: [coeffA, coeffB],
        points: results,
        string: 'y = ' + _round(coeffA, PREC) + 'e^(' + _round(coeffB, PREC) + 'x)',
      };
    },

    logarithmic: function (data) {
      var sum = [0, 0, 0, 0];
      var coeffA;
      var coeffB;
      var results;
      var len = data.length;

      for (var n = 0; n < len; n++) {
        if (data[n][1] !== null) {
          sum[0] += Math.log(data[n][0]);
          sum[1] += data[n][1] * Math.log(data[n][0]);
          sum[2] += data[n][1];
          sum[3] += Math.pow(Math.log(data[n][0]), 2);
        }
      }

      coeffB = (len * sum[1] - sum[2] * sum[0]) / (len * sum[3] - sum[0] * sum[0]);
      coeffA = (sum[2] - coeffB * sum[0]) / len;

      results = data.map(function (xyPair) {
        var x = xyPair[0];
        return [x, coeffA + coeffB * Math.log(x)];
      });

      return {
        r2: determinationCoefficient(data, results),
        equation: [coeffA, coeffB],
        points: results,
        string: 'y = ' + _round(coeffA, PREC) + ' + ' + _round(coeffB, PREC) + ' ln(x)',
      };
    },

    power: function (data) {
      var sum = [0, 0, 0, 0];
      var coeffA;
      var coeffB;
      var results;
      var len = data.length;

      for (var n = 0; n < len; n++) {
        if (data[n][1] !== null) {
          sum[0] += Math.log(data[n][0]);
          sum[1] += Math.log(data[n][1]) * Math.log(data[n][0]);
          sum[2] += Math.log(data[n][1]);
          sum[3] += Math.pow(Math.log(data[n][0]), 2);
        }
      }

      coeffB = (len * sum[1] - sum[2] * sum[0]) / (len * sum[3] - sum[0] * sum[0]);
      coeffA = Math.exp((sum[2] - coeffB * sum[0]) / len);

      results = data.map(function (xyPair) {
        var x = xyPair[0];
        return [x, coeffA * Math.pow(x, coeffB)];
      });

      return {
        r2: determinationCoefficient(data, results),
        equation: [coeffA, coeffB],
        points: results,
        string: 'y = ' + _round(coeffA, PREC) + 'x^' + _round(coeffB, PREC),
      };
    },

    polynomial: function (data, order) {
      var lhs = [];
      var rhs = [];
      var a = 0;
      var b = 0;
      var c;
      var k;

      var i;
      var j;
      var l;
      var len = data.length;

      var results;
      var equation;
      var string;

      if (typeof order === 'undefined') {
        k = 3;
      } else {
        k = order + 1;
      }

      for (i = 0; i < k; i++) {
        for (l = 0; l < len; l++) {
          if (data[l][1] !== null) {
            a += Math.pow(data[l][0], i) * data[l][1];
          }
        }

        lhs.push(a);
        a = 0;

        c = [];
        for (j = 0; j < k; j++) {
          for (l = 0; l < len; l++) {
            if (data[l][1] !== null) {
              b += Math.pow(data[l][0], i + j);
            }
          }
          c.push(b);
          b = 0;
        }
        rhs.push(c);
      }
      rhs.push(lhs);

      equation = gaussianElimination(rhs, k);

      results = data.map(function (xyPair) {
        var x = xyPair[0];

        var answer = equation.reduce(function (sum, coeff, power) {
          return sum + coeff * Math.pow(x, power);
        });

        return [x, answer];
      });

      string = 'y = ';
      for (i = equation.length - 1; i >= 0; i--) {
        if (i > 1) {
          string += _round(equation[i], PREC)  + 'x^' + i + ' + ';
        } else if (i === 1) {
          string += _round(equation[i], PREC) + 'x' + ' + ';
        } else {
          string += _round(equation[i], PREC);
        }
      }

      return {
        r2: determinationCoefficient(data, results),
        equation: equation,
        points: results,
        string: string,
      };
    },

    lastvalue: function (data) {
      var results = [];
      var lastvalue = null;

      for (var i = 0; i < data.length; i++) {
        if (data[i][1] !== null && isFinite(data[i][1])) {
          lastvalue = data[i][1];
          results.push([data[i][0], data[i][1]]);
        } else {
          results.push([data[i][0], lastvalue]);
        }
      }

      return {
        r2: determinationCoefficient(data, results),
        equation: [lastvalue],
        points: results,
        string: '' + lastvalue,
      };
    },
  };

  exports.default = exports.regression = function regression(method, data, order) {
    if (typeof method === 'string') {
      return methods[method.toLowerCase()](data, order);
    }
    return null;
  };
});
