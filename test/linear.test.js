'use strict';

var assert     = require('assert'),
    Result     = require('../src/Result.js'),
    regression = require('../src/regression.js');

describe('Model', function () {

    describe('Linear', function () {

        it('should find the trend in a perfect data set', function () {
            var data    = [[0, 4], [1, 8], [2, 12], [3, 16], [4, 20]],
                trend   = regression('linear', data);

            assert.deepEqual(trend, new Result([4, 4], data, 'y = 4x + 4', data));
        });

        it('should find the trend when the data set contains a leading zero', function () {
            var data    = [[0, 0], [1, 4], [2, 8], [3, 12], [4, 16], [5, 20]],
                trend   = regression('linear', data);

            assert.deepEqual(trend, new Result([4, 0], data, 'y = 4x + 0', data));
        });

        it('should find the trend when the set contains null values', function () {
            var data    = [[0, 4], [1, null], [2, 12], [3, 16], [4, 20]],
                fitted  = [[0, 2.1875], [1, 6.75], [2, 11.3125], [3, 15.875], [ 4, 20.4375]],
                trend   = regression('linear', data);

            assert.deepEqual(trend, new Result([4.5625, 2.1875], fitted, 'y = 4.56x + 2.19', data));
        });

        it('should find the trend when the set contains negative values', function () {
            var data = [[0, 2], [1, 0], [2, -2], [3, -4], [4, -6], [5, -8], [6, -10],
                        [7, -12], [8, -14], [9, -16], [10, -18]],
                trend = regression('linear', data);

            assert.deepEqual(trend, new Result([-2, 2], data, 'y = -2x + 2', data));
        });

    });

});