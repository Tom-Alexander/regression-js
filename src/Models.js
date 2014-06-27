'use strict';

var Models,
    Result = require('./Result'),
    linearSolver = require('./linearSolver');

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