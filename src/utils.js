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
* Round a number to a precision, specificed in number of decimal places
*
* @param {number} number - The number to round
* @param {number} precision - The number of decimal places to round to:
*                             > 0 means decimals, < 0 means powers of 10
*
*
* @return {number} - The number, rounded
*/
function round(number, precision) {
  const factor = 10 ** precision;
  return Math.round(number * factor) / factor;
}


/**
* derive points, residuals, r squared from data
*
* @param {number} data - Source data
* @param {function} predict - function that predicts point
* @param {object} options - Contains precision and other options
*
*
* @return {object} - points, residuals, r2
*/
function deriveDataProperties(data, predict, options) {
  const points = data.map((point) => predict(point[0]));
  const residuals = points.map((point, index) => [point[0], point[1] - data[index][1]]);
  const r2 = round(determinationCoefficient(data, points), options.precision);

  return { r2, points, residuals };
}

module.exports = {
  determinationCoefficient,
  round,
  deriveDataProperties,
};
