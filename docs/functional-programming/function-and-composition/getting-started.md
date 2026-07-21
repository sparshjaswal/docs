---
id: functional-programming-function-and-composition-getting-started
title: "🔄 Function Composition & Higher-Order Functions"
slug: /functional-programming/function-and-composition/getting-started
sidebar_label: "🔄 Function Composition & Hi..."
---

# 🔄 Function Composition & Higher-Order Functions

> _Master the art of combining simple functions to create powerful, reusable abstractions_

## Table of Contents

- [First-Class Functions](#first-class-functions)
- [Higher-Order Functions](#higher-order-functions)
- [Function Composition](#function-composition)
- [Pipe vs Compose](#pipe-vs-compose)
- [Currying and Partial Application](#currying-and-partial-application)
- [Point-Free Programming](#point-free-programming)
- [Advanced Composition Patterns](#advanced-composition-patterns)
- [Real-World Examples](#real-world-examples)
- [Performance Considerations](#performance-considerations)

## First-Class Functions

In JavaScript, functions are **first-class citizens**, meaning they can be:

- Assigned to variables
- Passed as arguments to other functions
- Returned from functions
- Stored in data structures
- Created at runtime

### Functions as Values

```javascript
// ✅ Function as a variable
const greet = function (name) {
  return `Hello, ${name}!`;
};

// ✅ Function as an arrow function
const add = (a, b) => a + b;

// ✅ Function stored in an object
const mathOperations = {
  add: (a, b) => a + b,
  multiply: (a, b) => a * b,
  divide: (a, b) => (b !== 0 ? a / b : null),
};

// ✅ Function in an array
const operations = [(x) => x + 1, (x) => x * 2, (x) => x ** 2];
```

### Function Declarations vs Expressions

```javascript
// Function declaration - hoisted
function declaredFunction(x) {
  return x * 2;
}

// Function expression - not hoisted
const expressedFunction = function (x) {
  return x * 2;
};

// Arrow function expression - concise syntax
const arrowFunction = (x) => x * 2;

// Immediately Invoked Function Expression (IIFE)
const result = ((x) => x * 2)(5); // result = 10
```

### Functions as Object Methods

```javascript
// ✅ Functions as object properties
const calculator = {
  value: 0,

  // Method using function expression
  add: function (n) {
    return this.value + n;
  },

  // Method using arrow function (no 'this' binding)
  multiply: (n) => n * 2,

  // ES6 method syntax
  subtract(n) {
    return this.value - n;
  },
};

console.log(calculator.add(5)); // 5
console.log(calculator.multiply(3)); // 6
console.log(calculator.subtract(2)); // -2
```

## Higher-Order Functions

A **higher-order function** is a function that either:

1. Takes one or more functions as arguments
2. Returns a function as its result
3. Or both

### Functions that Take Functions

```javascript
// ✅ Array methods are higher-order functions
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map((x) => x * 2);
// [2, 4, 6, 8, 10]

const evens = numbers.filter((x) => x % 2 === 0);
// [2, 4]

const sum = numbers.reduce((acc, x) => acc + x, 0);
// 15

// ✅ Custom higher-order function
const withLogging =
  (fn) =>
  (...args) => {
    console.log(`Calling function with args: ${args}`);
    const result = fn(...args);
    console.log(`Result: ${result}`);
    return result;
  };

const addWithLogging = withLogging((a, b) => a + b);
addWithLogging(3, 4); // Logs the call and result
```

### Functions that Return Functions

```javascript
// ✅ Function factory
const createMultiplier = (factor) => (value) => value * factor;

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(4)); // 12

// ✅ Configuration function
const createValidator = (rules) => (data) => {
  return rules.every((rule) => {
    const isValid = rule.test(data);
    if (!isValid) {
      console.log(`Validation failed: ${rule.message}`);
    }
    return isValid;
  });
};

const emailRules = [
  { test: (email) => email.includes('@'), message: 'Must contain @' },
  { test: (email) => email.length > 3, message: 'Must be longer than 3 chars' },
];

const validateEmail = createValidator(emailRules);
console.log(validateEmail('user@example.com')); // true
```

### Closures and Lexical Scope

```javascript
// ✅ Closures preserve outer function's variables
const createCounter = (initialValue = 0) => {
  let count = initialValue;

  return {
    increment: () => ++count,
    decrement: () => --count,
    getValue: () => count,
    reset: () => {
      count = initialValue;
      return count;
    },
  };
};

const counter = createCounter(5);
console.log(counter.increment()); // 6
console.log(counter.increment()); // 7
console.log(counter.getValue()); // 7
console.log(counter.reset()); // 5

// ✅ Module pattern using closures
const mathModule = (() => {
  const PI = 3.14159;

  const circleArea = (radius) => PI * radius * radius;
  const circleCircumference = (radius) => 2 * PI * radius;

  return {
    area: circleArea,
    circumference: circleCircumference,
  };
})();

console.log(mathModule.area(5)); // 78.54
// console.log(PI); // Error: PI is not accessible
```

## Function Composition

Function composition is the process of combining two or more functions to produce a new function. It's based on the mathematical concept where `(f ∘ g)(x) = f(g(x))`.

### Basic Composition

```javascript
// ✅ Manual composition
const add1 = (x) => x + 1;
const multiply2 = (x) => x * 2;
const square = (x) => x * x;

// Composing manually
const addThenMultiplyThenSquare = (x) => square(multiply2(add1(x)));
console.log(addThenMultiplyThenSquare(3)); // ((3+1)*2)^2 = 64

// ✅ Generic composition function
const compose = (f, g) => (x) => f(g(x));

const add1ThenMultiply2 = compose(multiply2, add1);
console.log(add1ThenMultiply2(3)); // (3+1)*2 = 8
```

### Multi-Function Composition

```javascript
// ✅ Compose multiple functions (right to left)
const compose =
  (...fns) =>
  (value) =>
    fns.reduceRight((acc, fn) => fn(acc), value);

// ✅ Pipe multiple functions (left to right)
const pipe =
  (...fns) =>
  (value) =>
    fns.reduce((acc, fn) => fn(acc), value);

// Example functions
const add = (x) => x + 1;
const multiply = (x) => x * 2;
const square = (x) => x * x;
const toString = (x) => `Result: ${x}`;

// Using compose (reads right to left)
const complexOperation1 = compose(toString, square, multiply, add);
console.log(complexOperation1(3)); // "Result: 64"

// Using pipe (reads left to right - more intuitive)
const complexOperation2 = pipe(add, multiply, square, toString);
console.log(complexOperation2(3)); // "Result: 64"
```

### Composition with Real Examples

```javascript
// ✅ Data transformation pipeline
const users = [
  { name: 'John Doe', age: 25, active: true },
  { name: 'Jane Smith', age: 30, active: false },
  { name: 'Bob Johnson', age: 35, active: true },
];

// Individual transformation functions
const filterActive = (users) => users.filter((user) => user.active);
const extractNames = (users) => users.map((user) => user.name);
const sortNames = (names) => [...names].sort();
const formatList = (names) => names.join(', ');

// Compose the pipeline
const getActiveUserNames = pipe(filterActive, extractNames, sortNames, formatList);

console.log(getActiveUserNames(users)); // "Bob Johnson, John Doe"

// ✅ String processing pipeline
const processText = pipe(
  (text) => text.toLowerCase(),
  (text) => text.trim(),
  (text) => text.replace(/\s+/g, ' '),
  (text) => text.split(' '),
  (words) => words.filter((word) => word.length > 2),
  (words) => words.join('-'),
);

console.log(processText('  Hello   World  FOO  ')); // "hello-world"
```

## Pipe vs Compose

### Compose (Right to Left)

```javascript
// Mathematical composition: f(g(x))
const compose =
  (...fns) =>
  (value) =>
    fns.reduceRight((acc, fn) => fn(acc), value);

// Reads from right to left
const operation = compose(
  (x) => `Final: ${x}`, // 4. Last operation
  (x) => x * 2, // 3. Then multiply by 2
  (x) => x + 10, // 2. Then add 10
  (x) => x ** 2, // 1. First, square the input
);

console.log(operation(3)); // "Final: 38" (3^2 + 10) * 2 = 38
```

### Pipe (Left to Right)

```javascript
// Unix pipe-like: left to right flow
const pipe =
  (...fns) =>
  (value) =>
    fns.reduce((acc, fn) => fn(acc), value);

// Reads from left to right (more intuitive)
const operation = pipe(
  (x) => x ** 2, // 1. First, square the input
  (x) => x + 10, // 2. Then add 10
  (x) => x * 2, // 3. Then multiply by 2
  (x) => `Final: ${x}`, // 4. Finally, format result
);

console.log(operation(3)); // "Final: 38"
```

### When to Use Which

- **Pipe**: More intuitive, reads like a step-by-step process
- **Compose**: Mathematical notation, common in functional programming literature

```javascript
// ✅ Pipe for data transformation (recommended)
const processData = pipe(validateInput, sanitizeData, transformData, formatOutput);

// ✅ Compose for mathematical operations
const mathOperation = compose(
  Math.sqrt,
  (x) => x * 2,
  (x) => x + 1,
);
```

## Currying and Partial Application

### Currying

Currying transforms a function that takes multiple arguments into a series of functions that each take a single argument.

```javascript
// ✅ Manual currying
const add = (a) => (b) => (c) => a + b + c;
console.log(add(1)(2)(3)); // 6

// ✅ Generic curry function
const curry = (fn) => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...nextArgs) {
        return curried.apply(this, args.concat(nextArgs));
      };
    }
  };
};

// Original function
const multiply = (a, b, c) => a * b * c;

// Curried version
const curriedMultiply = curry(multiply);

console.log(curriedMultiply(2)(3)(4)); // 24
console.log(curriedMultiply(2, 3)(4)); // 24
console.log(curriedMultiply(2)(3, 4)); // 24
console.log(curriedMultiply(2, 3, 4)); // 24
```

### Practical Currying Examples

```javascript
// ✅ Configuration with currying
const createLogger = (level) => (module) => (message) => {
  console.log(`[${level}] ${module}: ${message}`);
};

const errorLogger = createLogger('ERROR');
const dbErrorLogger = errorLogger('DATABASE');
const apiErrorLogger = errorLogger('API');

dbErrorLogger('Connection failed'); // [ERROR] DATABASE: Connection failed
apiErrorLogger('Invalid request'); // [ERROR] API: Invalid request

// ✅ Validation with currying
const validate = (rule) => (message) => (value) => {
  if (!rule(value)) {
    throw new Error(message);
  }
  return value;
};

const isString = validate((x) => typeof x === 'string');
const isNumber = validate((x) => typeof x === 'number');
const isPositive = validate((x) => x > 0);

const validateName = isString('Name must be a string');
const validateAge = pipe(isNumber('Age must be a number'), isPositive('Age must be positive'));

try {
  const name = validateName('John');
  const age = validateAge(25);
  console.log({ name, age }); // { name: 'John', age: 25 }
} catch (error) {
  console.error(error.message);
}
```

### Partial Application

Partial application is creating a new function by fixing some arguments of an existing function.

```javascript
// ✅ Manual partial application
const multiply = (a, b, c) => a * b * c;
const multiplyBy2 = (b, c) => multiply(2, b, c);
console.log(multiplyBy2(3, 4)); // 24

// ✅ Generic partial function
const partial =
  (fn, ...args1) =>
  (...args2) =>
    fn(...args1, ...args2);

const multiplyBy2Partial = partial(multiply, 2);
console.log(multiplyBy2Partial(3, 4)); // 24

// ✅ Partial application with object methods
const fetchData = (method, url, options) => {
  return fetch(url, { method, ...options });
};

const get = partial(fetchData, 'GET');
const post = partial(fetchData, 'POST');

// Usage
get('/api/users').then((response) => response.json());
post('/api/users', { body: JSON.stringify(userData) });
```

## Point-Free Programming

Point-free style (also called tacit programming) is writing functions without explicitly mentioning their arguments.

### Basic Point-Free Style

```javascript
// ❌ Pointful (explicit arguments)
const double = (x) => x * 2;
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((x) => double(x));

// ✅ Point-free (no explicit arguments)
const doubled2 = numbers.map(double);

// ✅ More point-free examples
const add = (a, b) => a + b;
const isEven = (x) => x % 2 === 0;
const toString = (x) => x.toString();

// Pointful
const processNumbers = (arr) =>
  arr
    .filter((x) => isEven(x))
    .map((x) => add(x, 1))
    .map((x) => toString(x));

// Point-free
const addOne = add.bind(null, 1); // or curry(add)(1)
const processNumbersPointFree = pipe(
  (arr) => arr.filter(isEven),
  (arr) => arr.map(addOne),
  (arr) => arr.map(toString),
);
```

### Advanced Point-Free Patterns

```javascript
// ✅ Point-free utility functions
const prop = (key) => (obj) => obj[key];
const not =
  (fn) =>
  (...args) =>
    !fn(...args);
const gt = (threshold) => (value) => value > threshold;
const lt = (threshold) => (value) => value < threshold;

// Usage
const users = [
  { name: 'John', age: 25, active: true },
  { name: 'Jane', age: 17, active: false },
  { name: 'Bob', age: 35, active: true },
];

const getName = prop('name');
const getAge = prop('age');
const isActive = prop('active');
const isAdult = gt(18);
const isNotActive = not(isActive);

// Point-free data processing
const getActiveAdultNames = pipe(
  (arr) => arr.filter(isActive),
  (arr) => arr.filter((user) => isAdult(getAge(user))),
  (arr) => arr.map(getName),
);

console.log(getActiveAdultNames(users)); // ['John', 'Bob']
```

## Advanced Composition Patterns

### Async Composition

```javascript
// ✅ Async pipe
const pipeAsync =
  (...fns) =>
  (value) =>
    fns.reduce((acc, fn) => acc.then(fn), Promise.resolve(value));

// Async functions
const fetchUser = async (id) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};

const enrichUser = async (user) => {
  const posts = await fetch(`/api/users/${user.id}/posts`);
  return { ...user, posts: await posts.json() };
};

const formatUser = async (user) => ({
  displayName: `${user.name} (${user.posts.length} posts)`,
  ...user,
});

// Compose async operations
const getUserWithPosts = pipeAsync(fetchUser, enrichUser, formatUser);

// Usage
getUserWithPosts(123)
  .then((user) => console.log(user))
  .catch((error) => console.error(error));
```

### Conditional Composition

```javascript
// ✅ Conditional composition utilities
const when = (predicate, fn) => (value) => (predicate(value) ? fn(value) : value);

const unless = (predicate, fn) => (value) => (!predicate(value) ? fn(value) : value);

const branch = (predicate, trueFn, falseFn) => (value) =>
  predicate(value) ? trueFn(value) : falseFn(value);

// Example usage
const processNumber = pipe(
  (x) => x * 2,
  when(
    (x) => x > 10,
    (x) => x + 5,
  ),
  unless(
    (x) => x % 2 === 0,
    (x) => x + 1,
  ),
  branch(
    (x) => x > 20,
    (x) => `High: ${x}`,
    (x) => `Low: ${x}`,
  ),
);

console.log(processNumber(3)); // "High: 12" -> 3*2=6, 6+5=11, 11+1=12, "High: 12"
console.log(processNumber(8)); // "High: 21" -> 8*2=16, 16+5=21, "High: 21"
```

### Error Handling in Composition

```javascript
// ✅ Safe composition with error handling
const tryCatch = (fn, defaultValue) => (value) => {
  try {
    return fn(value);
  } catch (error) {
    console.error('Error in composition:', error);
    return defaultValue;
  }
};

const safeParseJSON = tryCatch(JSON.parse, {});
const safeToUpperCase = tryCatch((str) => str.toUpperCase(), '');

// Error-safe pipeline
const processData = pipe(
  safeParseJSON,
  (data) => data.message || 'No message',
  safeToUpperCase,
  (str) => `Processed: ${str}`,
);

console.log(processData('{"message": "hello"}')); // "Processed: HELLO"
console.log(processData('invalid json')); // "Processed: NO MESSAGE"
```

## Real-World Examples

### Data Processing Pipeline

```javascript
// ✅ E-commerce order processing
const orders = [
  { id: 1, items: [{ price: 10, qty: 2 }], customer: { type: 'premium' } },
  { id: 2, items: [{ price: 5, qty: 1 }], customer: { type: 'regular' } },
  { id: 3, items: [{ price: 15, qty: 3 }], customer: { type: 'premium' } },
];

// Individual processing functions
const calculateTotal = (order) => ({
  ...order,
  total: order.items.reduce((sum, item) => sum + item.price * item.qty, 0),
});

const applyDiscount = (order) => ({
  ...order,
  total: order.customer.type === 'premium' ? order.total * 0.9 : order.total,
});

const addTax = (order) => ({
  ...order,
  total: order.total * 1.08,
});

const formatCurrency = (order) => ({
  ...order,
  total: `$${order.total.toFixed(2)}`,
});

// Compose the processing pipeline
const processOrder = pipe(calculateTotal, applyDiscount, addTax, formatCurrency);

const processedOrders = orders.map(processOrder);
console.log(processedOrders);
```

### API Request Builder

```javascript
// ✅ Functional API request builder
const createRequest = (baseURL) => ({
  url: baseURL,
  method: 'GET',
  headers: {},
  params: {},
});

const setMethod = (method) => (request) => ({
  ...request,
  method,
});

const setHeader = (key, value) => (request) => ({
  ...request,
  headers: { ...request.headers, [key]: value },
});

const setParam = (key, value) => (request) => ({
  ...request,
  params: { ...request.params, [key]: value },
});

const setAuth = (token) => setHeader('Authorization', `Bearer ${token}`);
const setContentType = (type) => setHeader('Content-Type', type);
const setJSON = setContentType('application/json');

// Build requests using composition
const getUsers = pipe(
  createRequest,
  setMethod('GET'),
  setJSON,
  setAuth('your-token-here'),
  setParam('page', 1),
  setParam('limit', 10),
);

const userRequest = getUsers('/api/users');
console.log(userRequest);
```

### Form Validation Pipeline

```javascript
// ✅ Functional form validation
const createValidator = (rules) => (data) => {
  const errors = [];

  rules.forEach((rule) => {
    const result = rule(data);
    if (result.error) {
      errors.push(result.error);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data,
  };
};

// Validation rules
const required = (field, message) => (data) => ({
  error: !data[field] ? message : null,
});

const minLength = (field, min, message) => (data) => ({
  error: data[field] && data[field].length < min ? message : null,
});

const email = (field, message) => (data) => ({
  error: data[field] && !/\S+@\S+\.\S+/.test(data[field]) ? message : null,
});

// Create specific validators
const validateUser = createValidator([
  required('name', 'Name is required'),
  minLength('name', 2, 'Name must be at least 2 characters'),
  required('email', 'Email is required'),
  email('email', 'Email format is invalid'),
  minLength('password', 8, 'Password must be at least 8 characters'),
]);

// Test the validator
const userData = {
  name: 'Jo',
  email: 'john@example.com',
  password: 'short',
};

const result = validateUser(userData);
console.log(result);
// { isValid: false, errors: ['Name must be at least 2 characters', 'Password must be at least 8 characters'], data: {...} }
```

## Performance Considerations

### Memoization with Composition

```javascript
// ✅ Memoize expensive composed functions
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Expensive operations
const expensiveCalc1 = (x) => {
  console.log('Calculating step 1');
  return x * x;
};

const expensiveCalc2 = (x) => {
  console.log('Calculating step 2');
  return x + 10;
};

// Memoized composition
const expensiveOperation = memoize(pipe(expensiveCalc1, expensiveCalc2));

console.log(expensiveOperation(5)); // Logs "Calculating..." and returns 35
console.log(expensiveOperation(5)); // Returns 35 from cache, no logs
```

### Lazy Evaluation

```javascript
// ✅ Lazy function composition
const lazy = (fn) => {
  let computed = false;
  let result;

  return (...args) => {
    if (!computed) {
      result = fn(...args);
      computed = true;
    }
    return result;
  };
};

// Create lazy pipeline
const lazyPipeline =
  (...fns) =>
  (value) => {
    const lazyFns = fns.map((fn) => lazy(() => fn));
    return (inputValue = value) => {
      return lazyFns.reduce((acc, fn) => fn()(acc), inputValue);
    };
  };
```

---

## 🎯 Key Takeaways

1. **Functions are first-class citizens** in JavaScript - treat them as values
2. **Higher-order functions** enable powerful abstractions and reusability
3. **Composition over inheritance** - build complexity from simple functions
4. **Pipe vs Compose** - choose based on readability preferences
5. **Currying enables partial application** - create specialized functions
6. **Point-free style reduces noise** but balance with readability
7. **Error handling** should be built into your composition patterns
8. **Performance matters** - use memoization and lazy evaluation when appropriate

Function composition is the heart of functional programming. It enables you to build complex behavior from simple, pure functions while maintaining readability and reusability.
