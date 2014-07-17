'use strict';

var assert     = require('assert'),
    Result     = require('../src/Result.js'),
    regression = require('../src/regression.js');

describe('Model', function () {

    describe('Polynomial', function () {

        it('should find the trend in a perfect data set', function () {
            var data    = [[0, 1], [1, 6],[2, 17], [3, 34], [4, 57],
                          [5, 86], [6, 121], [7, 162], [8, 209], [9, 262]],
                trend   = regression('polynomial', data);

            assert.deepEqual(trend, new Result([3, 2, 1], data, 'y = 3x^2 + 2x + 1', data));
        });

        it('should find the trend when the data set contains a leading zero', function () {
            var data    = [[0, 0], [1, 5], [2, 16], [3, 33], [4, 56], [5, 85],
                            [6, 120], [7, 161], [8, 208], [9, 261]],
                trend   = regression('polynomial', data, 2);

            assert.deepEqual(trend, new Result([3, 2, 0], data, 'y = 3x^2 + 2x + 0', data));
        });

        it('should find the trend when the set contains null values', function () {
            var data    = [[0, 4], [1, null], [2, 12], [3, 16], [4, 20]],
                fitted  = [[0, 2.1875], [1, 6.75], [2, 11.3125], [3, 15.875], [ 4, 20.4375]],
                trend   = regression('polynomial', data);

            assert.deepEqual(trend, new Result([4.5625, 2.1875, 1.12], fitted, 'y = 3x^2 + 2 + 1', data));
        });

        it('should find the trend when y = 0', function () {
            var data    = [[-18, -13], [1, 0], [6, -31], [28, 14]],
                fitted  = [[0, 2.1875], [1, 6.75], [2, 11.3125], [3, 15.875], [ 4, 20.4375]],
                trend   = regression('polynomial', data, 3);

            assert.deepEqual(trend, new Result([0.01, -0.16, -6.08, 8.23], fitted, 'y = 3x^2 + 2 + 1', data));
        });

        it('should find the trend when the set contains negative values', function () {
            var data = [[0, 2], [1, 0], [2, -2], [3, -4], [4, -6], [5, -8], [6, -10],
                    [7, -12], [8, -14], [9, -16], [10, -18]],
                trend = regression('polynomial', data);

            assert.deepEqual(trend, new Result([-3, 2, -1], data, 'y = -3x^2 + 2x - 1', data));
        });

    });

});