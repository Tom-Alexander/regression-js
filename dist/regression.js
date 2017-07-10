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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var DEFAULT_OPTIONS = { order: 2, precision: 2, period: null };

  /**
  * Determine the coefficient of determination (r^2) of a fit from the observations
  * and predictions.
  *
  * @param {Array<Array<number>>} data - Pairs of observed x-y values
  * @param {Array<Array<number>>} results - Pairs of observed predicted x-y values
  *
  * @return {number} - The r^2 value, or NaN if one cannot be calculated.
  */
  function determinationCoefficient(data, results) {
    var predictions = [];
    var observations = [];

    data.forEach(function (d, i) {
      if (d[1] !== null) {
        observations.push(d);
        predictions.push(results[i]);
      }
    });

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
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  /**
  * The set of all fitting methods
  *
  * @namespace
  */
  var methods = {
    linear: function linear(data, options) {
      var sum = [0, 0, 0, 0, 0];
      var len = 0;

      for (var n = 0; n < data.length; n++) {
        if (data[n][1] !== null) {
          len++;
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

      var predict = function predict(x) {
        return [round(x, options.precision), round(gradient * x + intercept, options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [gradient, intercept],
        r2: round(determinationCoefficient(data, points), options.precision),
        string: intercept === 0 ? 'y = ' + gradient + 'x' : 'y = ' + gradient + 'x + ' + intercept
      };
    },
    exponential: function exponential(data, options) {
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
      var predict = function predict(x) {
        return [round(x, options.precision), round(coeffA * Math.exp(coeffB * x), options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [coeffA, coeffB],
        string: 'y = ' + coeffA + 'e^(' + coeffB + 'x)',
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    },
    logarithmic: function logarithmic(data, options) {
      var sum = [0, 0, 0, 0];
      var len = data.length;

      for (var n = 0; n < len; n++) {
        if (data[n][1] !== null) {
          sum[0] += Math.log(data[n][0]);
          sum[1] += data[n][1] * Math.log(data[n][0]);
          sum[2] += data[n][1];
          sum[3] += Math.pow(Math.log(data[n][0]), 2);
        }
      }

      var a = (len * sum[1] - sum[2] * sum[0]) / (len * sum[3] - sum[0] * sum[0]);
      var coeffB = round(a, options.precision);
      var coeffA = round((sum[2] - coeffB * sum[0]) / len, options.precision);

      var predict = function predict(x) {
        return [round(x, options.precision), round(round(coeffA + coeffB * Math.log(x), options.precision), options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [coeffA, coeffB],
        string: 'y = ' + coeffA + ' + ' + coeffB + ' ln(x)',
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    },
    power: function power(data, options) {
      var sum = [0, 0, 0, 0, 0];
      var len = data.length;

      for (var n = 0; n < len; n++) {
        if (data[n][1] !== null) {
          sum[0] += Math.log(data[n][0]);
          sum[1] += Math.log(data[n][1]) * Math.log(data[n][0]);
          sum[2] += Math.log(data[n][1]);
          sum[3] += Math.pow(Math.log(data[n][0]), 2);
        }
      }

      var b = (len * sum[1] - sum[0] * sum[2]) / (len * sum[3] - Math.pow(sum[0], 2));
      var a = (sum[2] - b * sum[0]) / len;
      var coeffA = round(Math.exp(a), options.precision);
      var coeffB = round(b, options.precision);

      var predict = function predict(x) {
        return [round(x, options.precision), round(round(coeffA * Math.pow(x, coeffB), options.precision), options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [coeffA, coeffB],
        string: 'y = ' + coeffA + 'x^' + coeffB,
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    },
    polynomial: function polynomial(data, options) {
      var lhs = [];
      var rhs = [];
      var a = 0;
      var b = 0;
      var len = data.length;
      var k = options.order + 1;

      for (var i = 0; i < k; i++) {
        for (var l = 0; l < len; l++) {
          if (data[l][1] !== null) {
            a += Math.pow(data[l][0], i) * data[l][1];
          }
        }

        lhs.push(a);
        a = 0;

        var c = [];
        for (var j = 0; j < k; j++) {
          for (var _l = 0; _l < len; _l++) {
            if (data[_l][1] !== null) {
              b += Math.pow(data[_l][0], i + j);
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

      var predict = function predict(x) {
        return [round(x, options.precision), round(coefficients.reduce(function (sum, coeff, power) {
          return sum + coeff * Math.pow(x, power);
        }, 0), options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      var string = 'y = ';
      for (var _i = coefficients.length - 1; _i >= 0; _i--) {
        if (_i > 1) {
          string += coefficients[_i] + 'x^' + _i + ' + ';
        } else if (_i === 1) {
          string += coefficients[_i] + 'x + ';
        } else {
          string += coefficients[_i];
        }
      }

      return {
        string: string,
        points: points,
        predict: predict,
        equation: [].concat(_toConsumableArray(coefficients)).reverse(),
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    },
    gaussian: function gaussian(data, options) {
      var sumData = [];
      sumData[0] = [data[0][0], data[0][1]];

      for (var i = 1; i < data.length; i++) {
        sumData.push([data[i][0], data[i][1] + sumData[i - 1][1]]);
      }

      var max = sumData[data.length - 1][1];
      var width = sumData[data.length - 1][0] - sumData[0][0];
      var relative = [];

      for (var _i2 = 0; _i2 < data.length; _i2++) {
        relative.push([sumData[_i2][0], sumData[_i2][1] / max]);
      }

      var sum = [0, 0, 0, 0, 0, 0];
      var p = 22.64172356;

      for (var _i3 = 0; _i3 < relative.length; _i3++) {
        var psi = relative[_i3][1];
        var q = -14.1723356 * Math.log(psi / (1 - psi));
        var root2 = Math.sqrt(q * q / 4 + p * p * p / 27);
        var root3 = Math.pow(root2 - q / 2, 1 / 3);
        var z = root3 - p / (3 * root3);
        if (z < 1.4 && z > -1.4) {
          var sx = relative[_i3][0];
          sum[0] += sx;
          sum[1] += z;
          sum[2] += sx * sx;
          sum[3] += sx * z;
          sum[4] += z * z;
          sum[5] += 1;
        }
      }

      var denominator = sum[5] * sum[2] - sum[0] * sum[0];
      var A = (sum[1] * sum[2] - sum[0] * sum[3]) / denominator;
      var B = (sum[5] * sum[3] - sum[0] * sum[1]) / denominator;
      var mu = round(-(A / B), options.precision);
      var sigma = round(1 / B, options.precision);
      var norm = max * width / (relative.length * 0.3989423 * B);

      var predict = function predict(x) {
        return [round(x, options.precision), round(norm * Math.exp(-0.5 * (A + B * x) * (A + B * x)), options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [mu, sigma],
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    },
    sinusoidal: function sinusoidal(data, options) {
      var period = options.period || data[data.length - 1][0] - data[0][0];
      var sum = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      var b = 2 * Math.PI / period;
      var sx = void 0;
      var bx = void 0;
      var cos = void 0;
      var sin = void 0;

      for (var i = 0; i < data.length; i++) {
        if (data[i][1] !== null) {
          sx = data[i][0];
          var y = data[i][1];
          bx = b * sx;
          cos = Math.cos(bx);
          sin = Math.sin(bx);
          sum[0] += cos * cos;
          sum[1] += cos * sin;
          sum[2] += sin * sin;
          sum[3] += y * cos;
          sum[4] += y * sin;
          sum[5] += 1;
          sum[6] += cos;
          sum[7] += sin;
          sum[8] += y;
        }
      }

      var n = sum[5];
      var termss = sum[2] - sum[7] * sum[7] / n;
      var termsc = sum[1] - sum[6] * sum[7] / n;
      var termcc = sum[0] - sum[6] * sum[6] / n;
      var termys = sum[4] - sum[8] * sum[7] / n;
      var termyc = sum[3] - sum[8] * sum[6] / n;

      var termA = termcc * termys - termsc * termyc;
      var termB = termss * termyc - termsc * termys;
      var termC = termss * termcc - termsc * termsc;

      var sqAB = termA * termA + termB * termB;
      var sqB = termB * termB;
      var ratio = sqB / sqAB;
      var a = Math.sqrt(sqAB * sqB) / termC / termB;
      var c = Math.atan2(ratio, ratio * termA / termB);
      a = a < 0 ? -a : a;
      c += a < 0 ? Math.PI : 0;
      c += c < 0 ? 2 * Math.PI : 0;
      var d = (sum[8] - a * Math.cos(c) * sum[7] - a * Math.sin(c) * sum[6]) / n;
      a = round(a, options.precision);
      c = round(c, options.precision);

      var predict = function predict(x) {
        return [round(x, options.precision), round(a * Math.sin(2 * Math.PI * x / period + c) + d, options.precision)];
      };

      var points = data.map(function (point) {
        return predict(point[0]);
      });

      return {
        points: points,
        predict: predict,
        equation: [a, c],
        string: 'y = ' + a + ' sin(2\u03C0x/' + period + ' + ' + c + ')',
        r2: round(determinationCoefficient(data, points), options.precision)
      };
    }
  };

  function createWrapper() {
    var reduce = function reduce(accumulator, name) {
      return _extends({}, accumulator, _defineProperty({}, name, function (data, supplied) {
        return methods[name](data, _extends({}, DEFAULT_OPTIONS, supplied));
      }));
    };

    return Object.keys(methods).reduce(reduce, {});
  }

  var regression = createWrapper();
  exports.default = regression;
});
