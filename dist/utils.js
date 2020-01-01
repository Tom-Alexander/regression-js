"use strict";

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
  var factor = Math.pow(10, precision);
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
  var points = data.map(function (point) {
    return predict(point[0]);
  });
  var residuals = points.map(function (point, index) {
    return [point[0], point[1] - data[index][1]];
  });
  var r2 = round(determinationCoefficient(data, points), options.precision);
  return {
    r2: r2,
    points: points,
    residuals: residuals
  };
}

module.exports = {
  determinationCoefficient: determinationCoefficient,
  round: round,
  deriveDataProperties: deriveDataProperties
};