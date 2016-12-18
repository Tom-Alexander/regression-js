regression.js
=============

[![Build Status](https://travis-ci.org/Tom-Alexander/regression-js.svg?branch=master)](https://travis-ci.org/Tom-Alexander/regression-js)

_regression.js_ is a JavaScript library containing a collection of least-squares fitting methods for
finding a trend in a set of data. It currently contains methods for linear, exponential,
logarithmic, power and polynomial trends.

Installation
============

The library can be installed from both `bower` and `npm`.

Usage
=====

Most regressions require only two parameters - the regression method (linear, exponential,
logarithmic, power or polynomial) and a data source. A third parameter can be used to define the
degree of a polynomial when a polynomial regression is required. The regression method name is
case-insensitive.

All models return an object with the following properties:
- `equation`: an array containing the coefficients of the equation
- `string`: A string representation of the equation
- `points`: an array containing the predicted data
- `r2`: the coefficient of determination (<i>R</i><sup>2</sup>)


Regression Types
================

Linear regression
-----------------

equation: `[gradient, y-intercept]` in the form y = mx + c

```javascript
var data = [[0,1],[32, 67] .... [12, 79]];
var result = regression('linear', data);
var slope = result.equation[0];
var yIntercept = result.equation[1];
```

Linear regression through the origin
-----------------

equation: `[gradient]` in the form ![y = mx](http://mathurl.com/h5m4qgd.png)

```javascript
var data = [[0,1],[32, 67] .... [12, 79]];
var result = regression('linearThroughOrigin', data);
```

Exponential regression
----------------------

equation: `[a, b]` in the form ![y = ae^bx](http://mathurl.com/zuys53z.png)

Logarithmic regression
----------------------

equation: `[a, b]` in the form ![y = a + b ln x](http://mathurl.com/zye394m.png)

Power law regression
--------------------

equation: `[a, b]` in the form ![y = ax^b](http://mathurl.com/gojkazs.png)

Polynomial regression
---------------------

equation: `[a0, ... , an]` in the form ![anx^n ... + a1x + a0](http://mathurl.com/hxz543o.png)

```javascript
var data = [[0,1],[32, 67] .... [12, 79]];
var result = regression('polynomial', data, 4);
```

Lastvalue
---------

Not exactly a regression. Uses the last value to fill the blanks when forecasting.

Filling the blanks and forecasting
----------------------------------

```javascript
var data = [[0,1], [32, null] .... [12, 79]];
```

In any regression, if you use a `null` value for data, regression-js will fill it using the trend.

Development
===========

Install packages: `npm install`

The project is built and controlled with [grunt](http://gruntjs.com).

To prepare for release, run the default task, which:
- Lints the source and tests with ESLint
- Minifies the javascript in to the `build/` directory

To run tests, `grunt test`.
