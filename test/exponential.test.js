'use strict';

var assert     = require('assert'),
    Result     = require('../src/Result.js'),
    regression = require('../src/regression.js');

describe('Model', function () {

    describe('Exponential', function () {

        it('should find the trend in a perfect data set', function () {
            var data    = [[0, 8], [1, 14.873], [2, 33.556], [3, 84.342], [4, 222.393], [5, 597.653]],
                trend   = regression('exponential', data);

            assert.deepEqual(trend, new Result([4, 4], data, 'y = 4e^x + 4', data));
        });

        it('should find the trend when the data set contains a leading zero', function () {
            var data    = [[0, 0], [1, 6.873], [2, 25.556], [3, 76.342], [4, 214.393], [5, 589.653]],
                trend   = regression('exponential', data);

            assert.deepEqual(trend, new Result([4, -4], data, 'y = 4e^x - 4', data));
        });

        it('should find the trend when the set contains null values', function () {
            var data    = [[0, 4], [1, null], [2, 12], [3, 16], [4, 20]],
                fitted  = [[0, 2.1875], [1, 6.75], [2, 11.3125], [3, 15.875], [ 4, 20.4375]],
                trend   = regression('exponential', data);

            assert.deepEqual(trend, new Result([4.5625, 2.1875], fitted, 'y = 4.56x + 2.19', data));
        });

        it('should find the trend when the set contains negative values', function () {
            var data = [[0, 2], [1, 0], [2, -2], [3, -4], [4, -6], [5, -8], [6, -10]],
                trend = regression('exponential', data);

            assert.deepEqual(trend, new Result([-2, 2], data, 'y = -2x + 2', data));
        });

    });

});