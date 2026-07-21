# 🚀 JavaScript Quick Reference Cheatsheet

## 📚 Variables & Data Types

### Variable Declarations

```javascript
var name = 'John'; // Function-scoped, hoisted
let age = 25; // Block-scoped
const PI = 3.14159; // Block-scoped, immutable

// Template literals
const message = `Hello ${name}, you are ${age} years old`;
```

### Data Types

```javascript
// Primitives
let str = 'Hello World'; // String
let num = 42; // Number
let bool = true; // Boolean
let nothing = null; // Null
let undefined_var; // Undefined
let symbol = Symbol('id'); // Symbol
let bigInt = 123n; // BigInt

// Non-primitives
let arr = [1, 2, 3]; // Array
let obj = { name: 'John' }; // Object
let func = function () {}; // Function
```

---

## 🔧 Functions

### Function Declarations

```javascript
// Regular function
function greet(name) {
  return `Hello, ${name}!`;
}

// Arrow function
const greet = (name) => `Hello, ${name}!`;

// Function expression
const greet = function (name) {
  return `Hello, ${name}!`;
};

// IIFE
(function () {
  console.log('Immediately executed');
})();
```

### Function Features

```javascript
// Default parameters
function greet(name = 'World') {
  return `Hello, ${name}!`;
}

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

// Destructuring parameters
function processUser({ name, age, email }) {
  console.log(name, age, email);
}
```

---

## 📊 Arrays

### Array Methods

```javascript
const arr = [1, 2, 3, 4, 5];

// Transform
arr.map((x) => x * 2); // [2, 4, 6, 8, 10]
arr.filter((x) => x > 2); // [3, 4, 5]
arr.reduce((sum, x) => sum + x); // 15

// Mutating methods
arr.push(6); // Add to end
arr.pop(); // Remove from end
arr.unshift(0); // Add to start
arr.shift(); // Remove from start
arr.splice(1, 2, 'a', 'b'); // Replace elements

// Finding
arr.find((x) => x > 3); // First element > 3
arr.findIndex((x) => x > 3); // Index of first element > 3
arr.includes(3); // true/false
arr.indexOf(3); // Index or -1
```

---

## 🏗️ Objects

### Object Creation & Manipulation

```javascript
// Object literal
const person = {
  name: 'John',
  age: 30,
  greet() {
    return `Hello, I'm ${this.name}`;
  },
};

// Object methods
Object.keys(person); // ["name", "age", "greet"]
Object.values(person); // ["John", 30, function]
Object.entries(person); // [["name", "John"], ...]

// Destructuring
const { name, age } = person;

// Spread operator
const newPerson = { ...person, city: 'NYC' };
```

### Classes

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }

  static species() {
    return 'Homo sapiens';
  }
}

class Student extends Person {
  constructor(name, age, grade) {
    super(name, age);
    this.grade = grade;
  }
}
```

---

## 🔄 Control Flow

### Conditionals

```javascript
// if-else
if (condition) {
  // code
} else if (condition2) {
  // code
} else {
  // code
}

// Ternary
const result = condition ? 'true value' : 'false value';

// Switch
switch (value) {
  case 'a':
    break;
  case 'b':
    break;
  default:
    break;
}
```

### Loops

```javascript
// for loop
for (let i = 0; i < 10; i++) {
  console.log(i);
}

// for...of (values)
for (const value of array) {
  console.log(value);
}

// for...in (keys)
for (const key in object) {
  console.log(key, object[key]);
}

// while
while (condition) {
  // code
}

// do-while
do {
  // code
} while (condition);
```

---

## ⚡ Async Programming

### Promises

```javascript
// Creating promises
const promise = new Promise((resolve, reject) => {
  if (success) {
    resolve(data);
  } else {
    reject(error);
  }
});

// Using promises
promise
  .then((data) => console.log(data))
  .catch((error) => console.error(error))
  .finally(() => console.log('Done'));

// Promise utilities
Promise.all([promise1, promise2]); // All must resolve
Promise.race([promise1, promise2]); // First to resolve/reject
Promise.allSettled([p1, p2]); // Wait for all, regardless of outcome
```

### Async/Await

```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Using async function
fetchData().then((data) => console.log(data));
```

---

## 🛠️ ES6+ Features

### Destructuring

```javascript
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];

// Object destructuring
const { name, age, city = 'Unknown' } = person;

// Nested destructuring
const {
  address: { street, city },
} = user;
```

### Spread & Rest

```javascript
// Spread arrays
const newArray = [...array1, ...array2];

// Spread objects
const newObject = { ...obj1, ...obj2 };

// Rest in functions
function myFunction(first, ...rest) {
  console.log(first, rest);
}
```

### Modules

```javascript
// Named exports/imports
export const myVariable = 42;
export function myFunction() {}
import { myVariable, myFunction } from './module';

// Default exports/imports
export default class MyClass {}
import MyClass from './module';

// Import all
import * as Utils from './utils';
```

---

## 🔍 Type Checking & Conversion

### Type Checking

```javascript
typeof variable; // "string", "number", etc.
Array.isArray(variable); // true/false for arrays
variable instanceof Constructor; // true/false
variable === null; // Check for null
variable === undefined; // Check for undefined
```

### Type Conversion

```javascript
// To string
String(value);
value.toString();
value + '';

// To number
Number(value);
parseInt(value);
parseFloat(value);
+value;

// To boolean
Boolean(value);
!!value;
```

---

## ⚠️ Error Handling

```javascript
try {
  // Risky code
  riskyFunction();
} catch (error) {
  console.error('Error:', error.message);
} finally {
  // Always runs
  cleanup();
}

// Throwing errors
throw new Error('Something went wrong');
throw new TypeError('Expected a number');
```

---

## 🧪 Common Patterns

### Debounce

```javascript
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
```

### Throttle

```javascript
function throttle(func, interval) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}
```

### Memoization

```javascript
function memoize(fn) {
  const cache = {};
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache[key]) return cache[key];
    cache[key] = fn.apply(this, args);
    return cache[key];
  };
}
```

---

## 🌐 DOM Manipulation

### Selecting Elements

```javascript
document.getElementById('id');
document.querySelector('.class');
document.querySelectorAll('div');
document.getElementsByClassName('class');
document.getElementsByTagName('div');
```

### Modifying Elements

```javascript
element.textContent = 'New text';
element.innerHTML = '<span>HTML</span>';
element.setAttribute('class', 'new-class');
element.classList.add('active');
element.classList.remove('inactive');
element.classList.toggle('highlight');
element.style.color = 'blue';
```

### Event Handling

```javascript
// Add event listener
element.addEventListener('click', function (event) {
  event.preventDefault();
  console.log('Clicked!');
});

// Remove event listener
element.removeEventListener('click', handler);

// Event delegation
document.addEventListener('click', function (event) {
  if (event.target.matches('.button')) {
    console.log('Button clicked!');
  }
});
```

---

## 🔥 Useful One-Liners

```javascript
// Random number between min and max
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Check if array is empty
const isEmpty = (arr) => !arr || arr.length === 0;

// Remove duplicates from array
const unique = (arr) => [...new Set(arr)];

// Flatten array
const flatten = (arr) => arr.flat(Infinity);

// Check if object is empty
const isEmptyObject = (obj) => Object.keys(obj).length === 0;

// Capitalize first letter
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Deep clone object
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// Generate UUID
const uuid = () => Math.random().toString(36).substr(2, 9);
```

---

## 🎯 Performance Tips

1. **Use `const` and `let`** instead of `var`
2. **Prefer arrow functions** for short functions
3. **Use array methods** like `map`, `filter`, `reduce`
4. **Avoid global variables**
5. **Use strict mode** (`"use strict"`)
6. **Minimize DOM manipulations**
7. **Use event delegation** for many elements
8. **Debounce/throttle** expensive operations
9. **Use `requestAnimationFrame`** for animations
10. **Avoid memory leaks** with proper cleanup

---

## 📱 Common Gotchas

```javascript
// Equality comparisons
0 == false; // true
0 === false; // false
'' == false; // true
'' === false; // false

// Type coercion
'5' + 3; // "53"
'5' - 3; // 2
'5' * 3; // 15

// this binding
const obj = {
  name: 'John',
  greet: function () {
    console.log(this.name);
  },
  arrowGreet: () => {
    console.log(this.name);
  }, // Won't work as expected
};

// Hoisting
console.log(x); // undefined (not error)
var x = 5;

console.log(y); // ReferenceError
let y = 5;

// Closures in loops (classic problem)
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // Prints 3, 3, 3
}

for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // Prints 0, 1, 2
}
```

---

**🎓 Keep this cheatsheet handy while coding!** Bookmark it for quick reference during development.
