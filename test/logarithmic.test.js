'use strict';

var assert     = require('assert'),
    Result     = require('../src/Result.js'),
    regression = require('../src/regression.js');

describe('Model', function () {

    describe('Logarithmic', function () {

        it('should find the trend in a perfect data set', function () {
            var data    = [[1, 4], [2, 6.773], [3, 8.394], [4, 9.545], [5, 10.438], [6, 11.167]],
                trend   = regression('logarithmic', data);

            assert.deepEqual(trend, new Result([4, 4], data, 'y = 4 + 4 * ln(x)', data));
        });

        it('should find the trend when the data set contains a leading zero', function () {
            var data    = [[1, 0], [2, 2.773], [3, 4.394], [4, 5.545], [5, 6.438], [6, 7.167]],
                trend   = regression('linear', data);

            assert.deepEqual(trend, new Result([4, 0], data, 'y = 4 * ln(x)', data));
        });

        it('should find the trend when the set contains null values', function () {
            var data    = [[1, 4], [2, 6.773], [3, 8.394], [4, 9.545], [5, 10.438], [6, 11.167]],
                fitted  = [[0, 2.1875], [1, 6.75], [2, 11.3125], [3, 15.875], [ 4, 20.4375]],
                trend   = regression('linear', data);

            assert.deepEqual(trend, new Result([4.5625, 2.1875], fitted, 'y = 4 + 4 * ln(x)', data));
        });

        it('should find the trend when the set contains negative values', function () {
            var data = [[1, -4], [2, -1.227], [3, 0.394], [4, 1.545], [5, 2.438], [6, 3.167]],
                trend = regression('linear', data);

            assert.deepEqual(trend, new Result([-2, 2], data, 'y = -4 + 4 * ln(x)', data));
        });

    });

});