const { round, deriveDataProperties } = require('./utils');

const DEFAULT_OPTIONS = { order: 2, precision: 2, period: null };

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
  const matrix = input;
  const n = input.length - 1;
  const coefficients = [order];

  for (let i = 0; i < n; i++) {
    let maxrow = i;
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(matrix[i][j]) > Math.abs(matrix[i][maxrow])) {
        maxrow = j;
      }
    }

    for (let k = i; k < n + 1; k++) {
      const tmp = matrix[k][i];
      matrix[k][i] = matrix[k][maxrow];
      matrix[k][maxrow] = tmp;
    }

    for (let j = i + 1; j < n; j++) {
      for (let k = n; k >= i; k--) {
        matrix[k][j] -= (matrix[k][i] * matrix[i][j]) / matrix[i][i];
      }
    }
  }

  for (let j = n - 1; j >= 0; j--) {
    let total = 0;
    for (let k = j + 1; k < n; k++) {
      total += matrix[k][j] * coefficients[k];
    }

    coefficients[j] = (matrix[n][j] - total) / matrix[j][j];
  }

  return coefficients;
}

/**
* The set of all fitting methods
*
* @namespace
*/
const methods = {
  linear(data, options) {
    const sum = [0, 0, 0, 0, 0];
    let len = 0;

    for (let n = 0; n < data.length; n++) {
      if (data[n][1] !== null) {
        len++;
        sum[0] += data[n][0];
        sum[1] += data[n][1];
        sum[2] += data[n][0] * data[n][0];
        sum[3] += data[n][0] * data[n][1];
        sum[4] += data[n][1] * data[n][1];
      }
    }

    const run = ((len * sum[2]) - (sum[0] * sum[0]));
    const rise = ((len * sum[3]) - (sum[0] * sum[1]));
    const gradient = run === 0 ? 0 : round(rise / run, options.precision);
    const intercept = round((sum[1] / len) - ((gradient * sum[0]) / len), options.precision);

    const predict = (x) => ([
      round(x, options.precision),
      round((gradient * x) + intercept, options.precision)]
    );

    return {
      predict,
      equation: [gradient, intercept],
      string: intercept === 0 ? `y = ${gradient}x` : `y = ${gradient}x + ${intercept}`,
      ...deriveDataProperties(data, predict, options),
    };
  },

  exponential(data, options) {
    const sum = [0, 0, 0, 0, 0, 0];

    for (let n = 0; n < data.length; n++) {
      if (data[n][1] !== null) {
        sum[0] += data[n][0];
        sum[1] += data[n][1];
        sum[2] += data[n][0] * data[n][0] * data[n][1];
        sum[3] += data[n][1] * Math.log(data[n][1]);
        sum[4] += data[n][0] * data[n][1] * Math.log(data[n][1]);
        sum[5] += data[n][0] * data[n][1];
      }
    }

    const denominator = ((sum[1] * sum[2]) - (sum[5] * sum[5]));
    const a = Math.exp(((sum[2] * sum[3]) - (sum[5] * sum[4])) / denominator);
    const b = ((sum[1] * sum[4]) - (sum[5] * sum[3])) / denominator;
    const coeffA = round(a, options.precision);
    const coeffB = round(b, options.precision);
    const predict = (x) => ([
      round(x, options.precision),
      round(coeffA * Math.exp(coeffB * x), options.precision),
    ]);

    return {
      predict,
      equation: [coeffA, coeffB],
      string: `y = ${coeffA}e^(${coeffB}x)`,
      ...deriveDataProperties(data, predict, options),
    };
  },

  logarithmic(data, options) {
    const sum = [0, 0, 0, 0];
    const len = data.length;

    for (let n = 0; n < len; n++) {
      if (data[n][1] !== null) {
        sum[0] += Math.log(data[n][0]);
        sum[1] += data[n][1] * Math.log(data[n][0]);
        sum[2] += data[n][1];
        sum[3] += (Math.log(data[n][0]) ** 2);
      }
    }

    const a = ((len * sum[1]) - (sum[2] * sum[0])) / ((len * sum[3]) - (sum[0] * sum[0]));
    const coeffB = round(a, options.precision);
    const coeffA = round((sum[2] - (coeffB * sum[0])) / len, options.precision);

    const predict = (x) => ([
      round(x, options.precision),
      round(round(coeffA + (coeffB * Math.log(x)), options.precision), options.precision),
    ]);

    return {
      predict,
      equation: [coeffA, coeffB],
      string: `y = ${coeffA} + ${coeffB} ln(x)`,
      ...deriveDataProperties(data, predict, options),
    };
  },

  power(data, options) {
    const sum = [0, 0, 0, 0, 0];
    const len = data.length;

    for (let n = 0; n < len; n++) {
      if (data[n][1] !== null) {
        sum[0] += Math.log(data[n][0]);
        sum[1] += Math.log(data[n][1]) * Math.log(data[n][0]);
        sum[2] += Math.log(data[n][1]);
        sum[3] += (Math.log(data[n][0]) ** 2);
      }
    }

    const b = ((len * sum[1]) - (sum[0] * sum[2])) / ((len * sum[3]) - (sum[0] ** 2));
    const a = ((sum[2] - (b * sum[0])) / len);
    const coeffA = round(Math.exp(a), options.precision);
    const coeffB = round(b, options.precision);

    const predict = (x) => ([
      round(x, options.precision),
      round(round(coeffA * (x ** coeffB), options.precision), options.precision),
    ]);

    return {
      predict,
      equation: [coeffA, coeffB],
      string: `y = ${coeffA}x^${coeffB}`,
      ...deriveDataProperties(data, predict, options),
    };
  },

  polynomial(data, options) {
    const lhs = [];
    const rhs = [];
    let a = 0;
    let b = 0;
    const len = data.length;
    const k = options.order + 1;

    for (let i = 0; i < k; i++) {
      for (let l = 0; l < len; l++) {
        if (data[l][1] !== null) {
          a += (data[l][0] ** i) * data[l][1];
        }
      }

      lhs.push(a);
      a = 0;

      const c = [];
      for (let j = 0; j < k; j++) {
        for (let l = 0; l < len; l++) {
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

    const coefficients = gaussianElimination(rhs, k).map((v) => round(v, options.precision));

    const predict = (x) => ([
      round(x, options.precision),
      round(
        coefficients.reduce((sum, coeff, power) => sum + (coeff * (x ** power)), 0),
        options.precision,
      ),
    ]);

    let string = 'y = ';
    for (let i = coefficients.length - 1; i >= 0; i--) {
      if (i > 1) {
        string += `${coefficients[i]}x^${i} + `;
      } else if (i === 1) {
        string += `${coefficients[i]}x + `;
      } else {
        string += coefficients[i];
      }
    }

    return {
      string,
      predict,
      equation: [...coefficients].reverse(),
      ...deriveDataProperties(data, predict, options),
    };
  },
};

function createWrapper() {
  const reduce = (accumulator, name) => ({
    _round: round,
    ...accumulator,
    [name](data, supplied) {
      return methods[name](data, {
        ...DEFAULT_OPTIONS,
        ...supplied,
      });
    },
  });

  return Object.keys(methods).reduce(reduce, {});
}

module.exports = createWrapper();
