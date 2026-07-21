---
id: javascript-import-and-export
title: "📦 Import & Export in JavaScript (ES6)"
slug: /javascript/import-and-export
sidebar_label: "📦 Import & Export in JavaSc..."
---

# 📦 Import & Export in JavaScript (ES6)

> _Master module systems and code organization with ES6 import/export statements_

## Introduction

To understand the import and export features of modern JavaScript, let's do a small exercise and understand why we need these features.PTER 40 | import & export [ ES 6 ]

To understand the import and export features of modern javascript let’s do a small exercise and understand why we need these features?.
We have implemented the functionality of a basic calculator in filename calculator.js as below

```js
function add(a, b) {
  return a + b;
}
function mul(a, b) {
  return a * b;
}
function divide(a, b) {
  return a / b;
}
function sub(a, b) {
  return a - b;
}
```

```js
The main file script.js which utilizes only add function as we have only added functionality to be utilized from script.js.How can I achieve the same?

<script src="operation.js"></script>

<script src="script.js"></script>

<title>Document</title>
```

From the above code we bring all global functionality in calculator.js and script.js together at the same level.Which is similar to writing all code in one file.
Is it memory efficient?
No, cause you have a lot of functions in the global scope.
It's very difficult to track the flow.
JavaScript supports function scope, global scope and block scope. But one more scope we have seen is which is using IIFE.

```js
const calculator = (function () {
  function add(a, b) {
    return a + b;
  }
  function mul(a, b) {
    return a * b;
  }
  function divide(a, b) {
    return a / b;
  }
  function sub(a, b) {
    return a - b;
  }
  return {
    add: add,
  };
})();
```

Calculator.js is written the above way then we are able to maintain modularity as the functions of Calculator.js is referred to below fashion.
calculator.add(4,5)

We can further optimise the above code and write like below.

```js
const calculator = (() => {
  return {
    add: function (a, b) {
      return a + b;
    },
    mul: function (a, b) {
      return a * b;
    },
    divide: function (a, b) {
      return a / b;
    },
    sub: function (a, b) {
      return a - b;
    },
  };
})();
console.log(calculator.add(1, 2));
```

Above pattern is also known as a revealing pattern, as we are exposing all the functionality that we require to use. A similar approach is being followed by Jquery.

#### **Advantage of this pattern/modules**

1. More maintainable code

2. Each module is independent for other modules,rare namespace clash won’t

3. Easy to track flow as subdivided the code into multiple chunk

4. Reusable code Encapsulation

5. Code Readability/Organized Code convenient

#### **Issues of this pattern/modules**

1. global variables (larger global variables)

2. Order of script still matters.

3. Difficult to track Namespace collisions

Commonjs, AMD and umd bring their own solutions for the above pattern which became very popular and the JS community provided support for modules.

ESM

Reusable code Encapsulation.Code Readability/Organized Code convenient The Issue of ESM Very slow on browsers

To export the functionality you can keyword called the export

```js
export function add(a, b) {
  return a + b;
}
export function mul(a, b) {
  return a * b;
}
export function divide(a, b) {
  return a / b;
}
export function sub(a, b) {
  return a - b;
}
```

To use the above functionality in any files in our code we use import keyword like below:-

```js
import { add } from './calculator';
console.log(add(1, 2));
```

We can use default import and there can be only one default export.

```js
export default moduleName;
import functionality from './fileName';
import { add, mul, sub, divide } from '/.fileName';
import * as obj from './calculator';
console.log(obj.add(1, 2));
console.log(obj.mul(1, 2));
console.log(obj.sub(1, 2));
console.log(obj.divide(1, 2));
```
