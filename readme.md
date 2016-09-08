regression.js is a javascript library containing a collection of least squares fitting methods for finding a trend in a set of data. It currently contains methods for linear, exponential, logarithmic, power and polynomial trends.

Usage
=====
Most regressions require only two parameters - the regression method (linear, exponential, logarithmic, power or polynomial) and a data source. A third parameter can be used to define the degree of a polynomial when a polynomial regression is required.

All models will return an object with the following properties:
- `equation` an array containing the coefficients of the equation
- `string` A string representation of the equation
- `points` an array containing the predicted data
- `r2` the coefficient of determination

Linear regression
-----------------

equation: ```[gradient, y-intercept]``` in the form y = mx + c
```
var data = [[0,1],[32, 67] .... [12, 79]];
var result = regression('linear', data);
var slope = result.equation[0];
var yIntercept = result.equation[1];
```

Linear regression through the origin
-----------------

equation: ```[gradient]``` in the form y = mx
```
var data = [[0,1],[32, 67] .... [12, 79]];
var result = regression('linearThroughOrigin', data);
```

Exponential regression
----------------------

equation: ```[a, b]``` in the form y = ae^bx

Logarithmic regression
----------------------

equation: ```[a, b]``` in the form y = a + b ln x

Power law regression
--------------------

equation: ```[a, b]``` in the form y = ax^b

Polynomial regression
---------------------

equation: ```[a0, .... , an]``` in the form a0x^0 ... + anx^n
```
var data = [[0,1],[32, 67] .... [12, 79]];
var result = regression('polynomial', data, 4);
```

Lastvalue
---------

Not exactly a regression. Uses the last value to fill the blanks when forecasting.



Filling the blanks and forecasting
---------

```
var data = [[0,1], [32, null] .... [12, 79]];
```

If you use a ```null``` value for data, regression-js will fill it using the trend.
