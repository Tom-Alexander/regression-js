export const linear = {

  zeroGradient: {
    r2: NaN,
    equation: [0, 10],
    string: 'y = 0x + 10',
    data: [[10, 10], [10, 10], [10, 10]],
    points: [[10, 10], [10, 10], [10, 10]],
  },

  zeroIntercept: {
    r2: 1,
    equation: [2, 0],
    string: 'y = 2x',
    data: [[0, 0], [1, 2], [2, 4], [3, 6]],
    points: [[0, 0], [1, 2], [2, 4], [3, 6]],
  },

  positiveGradient: {
    r2: 1,
    equation: [2, 1],
    string: 'y = 2x + 1',
    data: [[10, 21], [100, 201], [1000, 2001], [10000, 20001]],
    points: [[10, 21], [100, 201], [1000, 2001], [10000, 20001]],
  },

  negativeGradient: {
    r2: 1,
    equation: [-2, -1],
    string: 'y = -2x + -1',
    data: [[10, -21], [100, -201], [1000, -2001], [10000, -20001]],
    points: [[10, -21], [100, -201], [1000, -2001], [10000, -20001]],
  },

};

export const exponential = {

  growthGreaterThanZero: {
    r2: 1,
    equation: [2, 2],
    string: 'y = 2e^(2x)',
    points: [[0, 2], [0.69, 8], [1.1, 18], [1.39, 32]],
    data: [[0, 2], [0.6931471806, 8], [1.098612289, 18], [1.386294361, 32]],
  },

  decayGreaterThanZero: {
    r2: 1,
    equation: [2, -2],
    string: 'y = 2e^(-2x)',
    points: [[0, 2], [0.69, 0.5], [1.1, 0.22], [1.39, 0.13]],
    data: [[0, 2], [0.6931471806, 0.5], [1.098612289, 0.2222222222], [1.386294361, 0.125]],
  },

};

export const logarithmic = {
  greaterThanOne: {
    r2: 1,
    equation: [0, 10],
    string: 'y = 0 + 10 ln(x)',
    points: [[1, 0], [2, 6.93], [3, 10.99], [4, 13.86]],
    data: [[1, 0], [2, 6.931471806], [3, 10.98612289], [4, 13.86294361]],
  },
};

export const power = {
  coefficientsEqualToOne: {
    r2: 1,
    equation: [1, 1],
    string: 'y = 1x^1',
    points: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6]],
    data: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6]],
  },
};

export const polynomial = {

  positiveLinearGradient: {
    order: 1,
    r2: 1,
    equation: [2, 0],
    string: 'y = 2x + 0',
    data: [[10, 20], [100, 200], [1000, 2000], [10000, 20000]],
    points: [[10, 20], [100, 200], [1000, 2000], [10000, 20000]],
  },

  negativeLinearGradient: {
    order: 1,
    r2: 1,
    equation: [-2, 0],
    string: 'y = -2x + 0',
    data: [[10, -20], [100, -200], [1000, -2000], [10000, -20000]],
    points: [[10, -20], [100, -200], [1000, -2000], [10000, -20000]],
  },

  parabolaPositiveCoefficients: {
    order: 2,
    r2: 1,
    equation: [2, 2, 2],
    string: 'y = 2x^2 + 2x + 2',
    data: [[0, 2], [1, 6], [2, 14], [3, 26]],
    points: [[0, 2], [1, 6], [2, 14], [3, 26]],
  },

  parabolaNegativeCoefficients: {
    order: 2,
    r2: 1,
    equation: [-2, -2, -2],
    string: 'y = -2x^2 + -2x + -2',
    data: [[0, -2], [1, -6], [2, -14], [3, -26]],
    points: [[0, -2], [1, -6], [2, -14], [3, -26]],
  },

  cubicPositiveCoefficients: {
    order: 3,
    r2: 1,
    equation: [2, 2, 2, 2],
    string: 'y = 2x^3 + 2x^2 + 2x + 2',
    data: [[0, 2], [1, 8], [2, 30], [3, 80]],
    points: [[0, 2], [1, 8], [2, 30], [3, 80]],
  },


  cubicNegativeCoefficients: {
    order: 3,
    r2: 1,
    equation: [-2, -2, -2, -2],
    string: 'y = -2x^3 + -2x^2 + -2x + -2',
    data: [[0, -2], [1, -8], [2, -30], [3, -80]],
    points: [[0, -2], [1, -8], [2, -30], [3, -80]],
  },

};
