const DEFAULT_OPTIONS = { order: 2, precision: 2, period: null };

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
  const predictions = [];
  const observations = [];

  data.forEach((d, i) => {
    if (d[1] !== null) {
      observations.push(d);
      predictions.push(results[i]);
    }
  });

  const sum = observations.reduce((a, observation) => a + observation[1], 0);
  const mean = sum / observations.length;

  const ssyy = observations.reduce((a, observation) => {
    const difference = observation[1] - mean;
    return a + (difference * difference);
  }, 0);

  const sse = observations.reduce((accum, observation, index) => {
    const prediction = predictions[index];
    const residual = observation[1] - prediction[1];
    return accum + (residual * residual);
  }, 0);

  return 1 - (sse / ssyy);
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
  let i = 0;
  let j = 0;
  let k = 0;
  let maxrow = 0;
  let tmp = 0;
  const matrix = input;
  const n = input.length - 1;
  const coefficients = [order];

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
        matrix[k][j] -= (matrix[k][i] * matrix[i][j]) / matrix[i][i];
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
export function round(number, precision) {
  const factor = 10 ** precision;
  return Math.round(number * factor) / factor;
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

    const predict = x => ([
      round(x, options.precision),
      round((gradient * x) + intercept, options.precision)]
    );

    const points = data.map(point => predict(point[0]));

    return {
      points,
      predict,
      equation: [gradient, intercept],
      r2: round(determinationCoefficient(data, points), options.precision),
      string: intercept === 0 ? `y = ${gradient}x` : `y = ${gradient}x + ${intercept}`,
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
    const predict = x => ([
      round(x, options.precision),
      round(coeffA * Math.exp(coeffB * x), options.precision),
    ]);

    const points = data.map(point => predict(point[0]));

    return {
      points,
      predict,
      equation: [coeffA, coeffB],
      string: `y = ${coeffA}e^(${coeffB}x)`,
      r2: round(determinationCoefficient(data, points), options.precision),
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

    const predict = x => ([
      round(x, options.precision),
      round(round(coeffA + (coeffB * Math.log(x)), options.precision), options.precision),
    ]);

    const points = data.map(point => predict(point[0]));

    return {
      points,
      predict,
      equation: [coeffA, coeffB],
      string: `y = ${coeffA} + ${coeffB} ln(x)`,
      r2: round(determinationCoefficient(data, points), options.precision),
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

    const predict = x => ([
      round(x, options.precision),
      round(round(coeffA * (x ** coeffB), options.precision), options.precision),
    ]);

    const points = data.map(point => predict(point[0]));

    return {
      points,
      predict,
      equation: [coeffA, coeffB],
      string: `y = ${coeffA}x^${coeffB}`,
      r2: round(determinationCoefficient(data, points), options.precision),
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

    const coefficients = gaussianElimination(rhs, k).map(v => round(v, options.precision));

    const predict = x => ([
      round(x, options.precision),
      round(
        coefficients.reduce((sum, coeff, power) => sum + (coeff * (x ** power)), 0),
        options.precision,
      ),
    ]);

    const points = data.map(point => predict(point[0]));

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
      points,
      predict,
      equation: [...coefficients].reverse(),
      r2: round(determinationCoefficient(data, points), options.precision),
    };
  },

  gaussian(data, options) {
    const sumData = [];
    sumData[0] = [data[0][0], data[0][1]];

    for (let i = 1; i < data.length; i++) {
      sumData.push([data[i][0], data[i][1] + sumData[i - 1][1]]);
    }

    const max = sumData[data.length - 1][1];
    const width = sumData[data.length - 1][0] - sumData[0][0];
    const relative = [];

    for (let i = 0; i < data.length; i++) {
      relative.push([sumData[i][0], sumData[i][1] / max]);
    }

    const sum = [0, 0, 0, 0, 0, 0];
    const p = 22.64172356;

    for (let i = 0; i < relative.length; i++) {
      const psi = relative[i][1];
      const q = -14.1723356 * Math.log(psi / (1 - psi));
      const root2 = Math.sqrt(((q * q) / 4) + ((p * p * p) / 27));
      const root3 = (root2 - (q / 2)) ** (1 / 3);
      const z = root3 - (p / (3 * root3));
      if (z < 1.4 && z > -1.4) {
        const sx = relative[i][0];
        sum[0] += sx;
        sum[1] += z;
        sum[2] += sx * sx;
        sum[3] += sx * z;
        sum[4] += z * z;
        sum[5] += 1;
      }
    }

    const denominator = ((sum[5] * sum[2]) - (sum[0] * sum[0]));
    const A = ((sum[1] * sum[2]) - (sum[0] * sum[3])) / denominator;
    const B = ((sum[5] * sum[3]) - (sum[0] * sum[1])) / denominator;
    const mu = round(-(A / B), options.precision);
    const sigma = round(1 / B, options.precision);
    const norm = (max * width) / (relative.length * 0.3989423 * B);

    const predict = x => ([
      round(x, options.precision),
      round(norm * Math.exp(-0.5 * (A + (B * x)) * (A + (B * x))), options.precision),
    ]);

    const points = data.map(point => predict(point[0]));

    return {
      points,
      predict,
      equation: [mu, sigma],
      r2: round(determinationCoefficient(data, points), options.precision),
    };
  },

  sinusoidal(data, options) {
    const period = options.period || data[data.length - 1][0] - data[0][0];
    const sum = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const b = (2 * Math.PI) / period;
    let sx;
    let bx;
    let cos;
    let sin;

    for (let i = 0; i < data.length; i++) {
      if (data[i][1] !== null) {
        sx = data[i][0];
        const y = data[i][1];
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

    const n = sum[5];
    const termss = sum[2] - ((sum[7] * sum[7]) / n);
    const termsc = sum[1] - ((sum[6] * sum[7]) / n);
    const termcc = sum[0] - ((sum[6] * sum[6]) / n);
    const termys = sum[4] - ((sum[8] * sum[7]) / n);
    const termyc = sum[3] - ((sum[8] * sum[6]) / n);

    const termA = (termcc * termys) - (termsc * termyc);
    const termB = (termss * termyc) - (termsc * termys);
    const termC = (termss * termcc) - (termsc * termsc);

    const sqAB = (termA * termA) + (termB * termB);
    const sqB = termB * termB;
    const ratio = sqB / sqAB;
    let a = (Math.sqrt(sqAB * sqB) / termC) / termB;
    let c = Math.atan2(ratio, (ratio * termA) / termB);
    a = a < 0 ? -a : a;
    c += a < 0 ? Math.PI : 0;
    c += c < 0 ? 2 * Math.PI : 0;
    const d = (sum[8] - (a * Math.cos(c) * sum[7]) - (a * Math.sin(c) * sum[6])) / n;
    a = round(a, options.precision);
    c = round(c, options.precision);

    const predict = x => ([
      round(x, options.precision),
      round((a * Math.sin(((2 * Math.PI * x) / period) + c)) + d, options.precision),
    ]);

    const points = data.map(point => predict(point[0]));

    return {
      points,
      predict,
      equation: [a, c],
      string: `y = ${a} sin(2πx/${period} + ${c})`,
      r2: round(determinationCoefficient(data, points), options.precision),
    };
  },
};

function createWrapper() {
  const reduce = (accumulator, name) => ({
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

const regression = createWrapper();
export default regression;
