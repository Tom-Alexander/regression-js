(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.regression = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.round = round;
  exports.default = regression;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var DEFAULT_PRECISION = 2;

  /**
  * Determine the coefficient of determination (r^2) of a fit from the observations
  * and predictions.
  *
  * @param {Array<Array<number>>} observations - Pairs of observed x-y values
  * @param {Array<Array<number>>} predictions - Pairs of observed predicted x-y values
  *
  * @return {number} - The r^2 value, or NaN if one cannot be calculated.
  */
  function determinationCoefficient(observations, predictions) {
    var sum = observations.reduce(function (a, observation) {
      return a + observation[1];
    }, 0);
    var mean = sum / observations.length;

    var ssyy = observations.reduce(function (a, observation) {
      var difference = observation[1] - mean;
      return a + difference * difference;
    }, 0);

    var sse = observations.reduce(function (accum, observation, index) {
      var prediction = predictions[index];
      var residual = observation[1] - prediction[1];
      return accum + residual * residual;
    }, 0);

    return 1 - sse / ssyy;
  }

  /**
  * Determine the solution of a system of linear equations A * x = b using
  * Gaussian elimination.
  *
  * @param {Array<Array<number>>} input - A 2-d matrix of data in row-major form [ A | b ]
  * @param {number} order - How many degrees to solve for
  *
  * @return {Array<number>} - Vector of normalized solution coefficients matrix (x)
  */
  function gaussianElimination(input, order) {
    var i = 0;
    var j = 0;
    var k = 0;
    var maxrow = 0;
    var tmp = 0;
    var matrix = input;
    var n = input.length - 1;
    var coefficients = [order];

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
  *
  * @return {numbr} - The number, rounded
  */
  function round(number, precision) {
    var factor = 10 ** precision;
    return Math.round(number * factor) / factor;
  }

  /**
  * The set of all fitting methods
  *
  * @namespace
  */
  var methods = {
    linear: function linear(data, _order, options) {
      var sum = [0, 0, 0, 0, 0];
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

      var run = len * sum[2] - sum[0] * sum[0];
      var rise = len * sum[3] - sum[0] * sum[1];
      var gradient = run === 0 ? 0 : round(rise / run, options.precision);
      var intercept = round(sum[1] / len - gradient * sum[0] / len, options.precision);

      var results = data.map(function (xyPair) {
        var x = xyPair[0];
        return [round(x, options.precision), round(gradient * x + intercept, options.precision)];
      });

      return {
        points: results,
        equation: [gradient, intercept],
        string: 'y = ' + gradient + 'x + ' + intercept,
        r2: round(determinationCoefficient(data, results), options.precision)
      };
    },
    linearthroughorigin: function linearthroughorigin(data, _order, options) {
      var sum = [0, 0];

      for (var n = 0; n < data.length; n++) {
        if (data[n][1] !== null) {
          sum[0] += data[n][0] * data[n][0];
          sum[1] += data[n][0] * data[n][1];
        }
      }

      var gradient = round(sum[1] / sum[0], options.precision);

      var results = data.map(function (xyPair) {
        var x = xyPair[0];
        return [round(x, options.precision), round(gradient * x, options.precision)];
      });

      return {
        points: results,
        equation: [gradient],
        string: 'y = ' + gradient + 'x',
        r2: round(determinationCoefficient(data, results), options.precision)
      };
    },
    exponential: function exponential(data, _order, options) {
      var sum = [0, 0, 0, 0, 0, 0];

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

      var denominator = sum[1] * sum[2] - sum[5] * sum[5];
      var a = Math.exp((sum[2] * sum[3] - sum[5] * sum[4]) / denominator);
      var b = (sum[1] * sum[4] - sum[5] * sum[3]) / denominator;
      var coeffA = round(a, options.precision);
      var coeffB = round(b, options.precision);

      var results = data.map(function (xyPair) {
        var x = xyPair[0];
        return [round(x, options.precision), round(coeffA * Math.exp(coeffB * x), options.precision)];
      });

      return {
        points: results,
        equation: [coeffA, coeffB],
        string: 'y = ' + coeffA + 'e^(' + coeffB + 'x)',
        r2: round(determinationCoefficient(data, results), options.precision)
      };
    },
    logarithmic: function logarithmic(data, _order, options) {
      var sum = [0, 0, 0, 0];
      var len = data.length;

      for (var n = 0; n < len; n++) {
        if (data[n][1] !== null) {
          sum[0] += Math.log(data[n][0]);
          sum[1] += data[n][1] * Math.log(data[n][0]);
          sum[2] += data[n][1];
          sum[3] += Math.log(data[n][0]) ** 2;
        }
      }

      var a = (len * sum[1] - sum[2] * sum[0]) / (len * sum[3] - sum[0] * sum[0]);
      var coeffB = round(a, options.precision);
      var coeffA = round((sum[2] - coeffB * sum[0]) / len, options.precision);

      var results = data.map(function (xyPair) {
        var x = xyPair[0];
        var y = coeffA + coeffB * Math.log(x);
        return [round(x, options.precision), round(y, options.precision)];
      });

      return {
        points: results,
        equation: [coeffA, coeffB],
        string: 'y = ' + coeffA + ' + ' + coeffB + ' ln(x)',
        r2: round(determinationCoefficient(data, results), options.precision)
      };
    },
    power: function power(data, _order, options) {
      var sum = [0, 0, 0, 0, 0];
      var len = data.length;

      for (var n = 0; n < len; n++) {
        if (data[n][1] !== null) {
          sum[0] += Math.log(data[n][0]);
          sum[1] += Math.log(data[n][1]) * Math.log(data[n][0]);
          sum[2] += Math.log(data[n][1]);
          sum[3] += Math.log(data[n][0]) ** 2;
        }
      }

      var b = (len * sum[1] - sum[0] * sum[2]) / (len * sum[3] - sum[0] ** 2);
      var a = (sum[2] - b * sum[0]) / len;
      var coeffA = round(Math.exp(a), options.precision);
      var coeffB = round(b, options.precision);

      var results = data.map(function (xyPair) {
        var x = xyPair[0];
        return [round(x, options.precision), round(coeffA * x ** coeffB, options.precision)];
      });

      return {
        points: results,
        equation: [coeffA, coeffB],
        string: 'y = ' + coeffA + 'x^' + coeffB,
        r2: round(determinationCoefficient(data, results), options.precision)
      };
    },
    polynomial: function polynomial(data, order, options) {
      var lhs = [];
      var rhs = [];
      var a = 0;
      var b = 0;
      var c = void 0;
      var k = void 0;

      var i = void 0;
      var j = void 0;
      var l = void 0;
      var len = data.length;

      if (typeof order === 'undefined') {
        k = 3;
      } else {
        k = order + 1;
      }

      for (i = 0; i < k; i++) {
        for (l = 0; l < len; l++) {
          if (data[l][1] !== null) {
            a += data[l][0] ** i * data[l][1];
          }
        }

        lhs.push(a);
        a = 0;

        c = [];
        for (j = 0; j < k; j++) {
          for (l = 0; l < len; l++) {
            if (data[l][1] !== null) {
              b += data[l][0] ** (i + j);
            }
          }
          c.push(b);
          b = 0;
        }
        rhs.push(c);
      }
      rhs.push(lhs);

      var coefficients = gaussianElimination(rhs, k).map(function (v) {
        return round(v, options.precision);
      });

      var results = data.map(function (xyPair) {
        var x = xyPair[0];
        var answer = coefficients.reduce(function (sum, coeff, power) {
          return sum + coeff * x ** power;
        }, 0);
        return [round(x, options.precision), round(answer, options.precision)];
      });

      var string = 'y = ';
      for (i = coefficients.length - 1; i >= 0; i--) {
        if (i > 1) {
          string += coefficients[i] + 'x^' + i + ' + ';
        } else if (i === 1) {
          string += coefficients[i] + 'x + ';
        } else {
          string += coefficients[i];
        }
      }

      return {
        string: string,
        points: results,
        equation: coefficients.reverse(),
        r2: round(determinationCoefficient(data, results), options.precision)
      };
    },
    lastvalue: function lastvalue(data, _order, options) {
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
        points: results,
        equation: [lastvalue],
        r2: determinationCoefficient(data, results),
        string: '' + round(lastvalue, options.precision)
      };
    }
  };

  function regression(method, data, order, options) {
    var methodOptions = (typeof order === 'undefined' ? 'undefined' : _typeof(order)) === 'object' && typeof options === 'undefined' ? order : options || {};

    if (!methodOptions.precision) {
      methodOptions.precision = DEFAULT_PRECISION;
    }

    if (typeof method === 'string') {
      return methods[method.toLowerCase()](data, order, methodOptions);
    }

    return null;
  }
});
