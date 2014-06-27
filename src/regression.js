/**
* Regression.JS - Regression functions for javascript
* http://tom-alexander.github.com/regression-js/
*
**/

'use strict';

var fill,
    extend,
    defaults,
    regression,
    Models = require('./Models'),
    Result = require('./Result');

regression = function (modelName, data, options) {
    var isModel = Models.hasOwnProperty(modelName);

    options = Object.prototype.toString.call(options) !== '[object Object]' ? {degree: options} : options;

    options = extend(options, {
        fill: null,
        degree: 2
    });

    data = options.fill ? fill(data, options.fill) : data;
    return isModel ? Models[modelName](data, options) : new Result(null, null, null, data, options);
};

/**
 * extend (shallow merge)
 *
 * Adds missing values from the first
 * parameter with the value from the second parameter.
 *
 * @param options
 * @param defaults
 * @returns {{}}
 */
extend = function (options, defaults) {
    var property, mergedCopy = {};

    for (property in defaults) {
        if (defaults.hasOwnProperty(property)) {
            mergedCopy[property] = options.hasOwnProperty(property) ? options[property] : defaults[property];
        }
    }

    return mergedCopy;
};

/**
 * fill
 *
 * replaces null values of the data array with the value of the
 * value parameter. if 'next' is supplied the next non-null value in
 * the array will be filled. Likewise for when 'prev' is supplied.
 *
 * @param data
 * @param value
 */
fill = function (data, value) {
    var i, j, adjacentValue = null,
        isAdjacentValue = value === 'prev' || value === 'next';

    for (i = 0; i < data.length; i += 1) {
        j = value === 'next' ? data.length - (i + 1) : i;
        adjacentValue = data[j][1] || adjacentValue;
        data[j][1] = isAdjacentValue && !data[j][1] ? adjacentValue : data[j][1];
        data[j][1] = !isAdjacentValue && !data[j][1] ? value : data[j][1];
    }

    return data;
};

module.exports = regression;