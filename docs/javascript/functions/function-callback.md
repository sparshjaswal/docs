---
id: javascript-functions-function-callback
title: "🔄 Callback Functions in JavaScript"
slug: /javascript/functions/function-callback
sidebar_label: "🔄 Callback Functions in Jav..."
---

# 🔄 Callback Functions in JavaScript

> _Understanding callback functions - the foundation of asynchronous programming in JavaScript_

## Callback

When a function is passed as an argument to another function and then invoked inside the calling function.

```javascript
function add(num) {
  console.log('multiply ' + num + ' by 2 = ', 2 * num);
}

function value() {
  setTimeout(function () {
    return 10;
  }, 3000);
}

var num = value();
add(num);

// output → multiply undefined by 2 =  NaN
```

### `Why so Weird output?`

`value function` will give the result when it's available after 3 sec and by that time the `add function` executed, returning value `undefined`.

### `How can we solve the above problem?`

We can solve the above problem via callback by enforcing the order of executing function.

```javascript
function add(num) {
  console.log('multiply ' + num + ' by 2 = ', 2 * num);
}

function value(callback) {
  setTimeout(function () {
    callback(10);
  }, 3000);
}
value(add);
//multiply 20 by 2 =  40
```
