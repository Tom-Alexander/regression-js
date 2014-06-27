/**
 * Regression.JS - Regression functions for javascript

 * Gaussian elimination to solve
 * system of linear equations
 *
 * http://en.wikipedia.org/wiki/Gaussian_elimination
 *
 **/

'use strict';

var linearSolver = function (a) {

    var i, j = 0, k = 0, maxRow = 0, tmp = 0, n = a.length - 1, x = [];

    for (i = 0; i < n; i += 1) {

        maxRow = i;
        for (j = i + 1; j < n; j += 1) {

            if (Math.abs(a[i][j]) > Math.abs(a[i][maxRow])) {
                maxRow = j;
            }
        }

        for (k = i; k < n + 1; k += 1) {
            tmp = a[k][i];
            a[k][i] = a[k][maxRow];
            a[k][maxRow] = tmp;
        }

        for (j = i + 1; j < n; j += 1) {

            for (k = n; k >= i; k -= 1) {
                a[k][j] -= a[k][i] * a[i][j] / a[i][i];
            }
        }
    }

    for (j = n - 1; j >= 0; j -= 1) {

        tmp = 0;

        for (k = j + 1; k < n; k += 1) {
            tmp += a[k][j] * x[k];
        }

        x[j] = (a[n][j] - tmp) / a[j][j];
    }

    return x;
};

module.exports = linearSolver;