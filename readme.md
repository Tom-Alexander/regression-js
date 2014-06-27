
#Regression-js

regression.js is a javascript library containing a collection of least squares fitting methods for finding a trend in a set of data. It currently contains methods for linear, exponential, logarithmic, power and polynomial trends.
##Installation
---
###Node
Install via ```npm install regression-js```.

```
	var myRegression,
		regression = require('regression-js');	
				
	myRegression = regression('linear', data);
	console.log(myRegression);		
```

###Browser

Install via ```bower install regression-js``` or download the zip.

```
	<script src="regression.min.js"></script>
	<script>
		myRegression = regression('linear', data);
		console.log(myRegression);
	</script>
```

###Example

```
	var myRegression,
		data = [-10, -738], [-9, -520], [-8, -350], [-7, -222], [-6, -130]];
		
	myRegression = regression('polynomial', data, {
		degree: 3
	});
```

##Type
---

###linear 

equation ```[gradient, y-intercept]``` in the form y = mx + c 
            
###exponential

coefficients ```[a, b]``` in the form y = ae^bx 
            
###logarithmic

coefficients ```[a, b]``` in the form y = a + b ln x 
            
###power

coefficients ```[a, b]``` in the form y = ax^b 
            
###polynomial

coefficients ```[a0, .... , an]``` in the form a0x^0 ... + anx^n

##Options
---

###degree
The highest term in the polynomial when expressed in its canonical form. This can be any integer.

###fill
Use this option to replace null values.

* ```'prev'``` fills null values with the preceding value
* ```'next'``` fills null values with the succeeding value

Alternatively, supplying this option with an integer will replace all null values with that integer.

##Result
---




