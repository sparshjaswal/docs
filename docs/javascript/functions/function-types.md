---
id: javascript-functions-function-types
title: JavaScript Function Types
slug: /javascript/functions/function-types
sidebar_label: JavaScript Function Types
---

# JavaScript Function Types

## Function Arity

Arity refers to the number of arguments a function accepts.

### Unary Function (1 argument)

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

greet('Alice'); // "Hello, Alice!"
```

### Binary Function (2 arguments)

```javascript
function add(a, b) {
  return a + b;
}

add(5, 3); // 8
```

### Variadic Function (variable arguments)

```javascript
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

sum(1, 2, 3, 4); // 10

// Using arguments object (older approach)
function oldSum() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}
```

## Function Categories

### Factory Function

Creates and returns objects:

```javascript
function createStudent(name, age, grade) {
  return {
    name,
    age,
    grade,
    study() {
      console.log(`${this.name} is studying`);
    },
    getInfo() {
      return `${this.name}, Age: ${this.age}, Grade: ${this.grade}`;
    },
  };
}

const student1 = createStudent('Alice', 20, 'A');
student1.study(); // "Alice is studying"
```

### Higher-Order Function

Accepts functions as arguments or returns functions:

```javascript
// Accepts function as argument
function processArray(arr, callback) {
  return arr.map(callback);
}

const numbers = [1, 2, 3, 4];
const doubled = processArray(numbers, (x) => x * 2); // [2, 4, 6, 8]

// Returns a function
function createMultiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
console.log(double(5)); // 10
console.log(triple(5)); // 15
```

### Curried Function

Transforms multi-argument function into sequence of single-argument functions:

```javascript
// Regular function
function add(a, b, c) {
  return a + b + c;
}

// Curried version
function curriedAdd(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}

// Arrow function version
const curriedAddArrow = (a) => (b) => (c) => a + b + c;

// Usage
const result1 = curriedAdd(1)(2)(3); // 6
const result2 = curriedAddArrow(1)(2)(3); // 6

// Partial application
const addFive = curriedAdd(5);
const addFiveAndThree = addFive(3);
console.log(addFiveAndThree(2)); // 10
```

### Partial Function

Pre-fills some arguments:

```javascript
function multiply(a, b, c) {
  return a * b * c;
}

// Using bind for partial application
const multiplyByTwo = multiply.bind(null, 2);
console.log(multiplyByTwo(3, 4)); // 24

// Manual partial function
function partial(fn, ...presetArgs) {
  return function (...remainingArgs) {
    return fn(...presetArgs, ...remainingArgs);
  };
}

const multiplyByFive = partial(multiply, 5);
console.log(multiplyByFive(2, 3)); // 30
```

## Advanced Function Patterns

### Memoized Function

Caches results for performance:

```javascript
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Example: Expensive fibonacci function
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFib = memoize(fibonacci);
console.log(memoizedFib(40)); // Much faster on repeated calls
```

### Pure Function

No side effects, same input always produces same output:

```javascript
// Pure function
function addPure(a, b) {
  return a + b;
}

// Impure function (has side effects)
let count = 0;
function addImpure(a, b) {
  count++; // Side effect
  console.log('Adding...'); // Side effect
  return a + b;
}
```

### Predicate Function

Returns boolean value:

```javascript
const isEven = (x) => x % 2 === 0;
const isPositive = (x) => x > 0;
const isString = (x) => typeof x === 'string';

// Use with array methods
const numbers = [1, 2, 3, 4, 5, 6];
const evens = numbers.filter(isEven); // [2, 4, 6]
const hasEven = numbers.some(isEven); // true
const allPositive = numbers.every(isPositive); // true
```

### Composer Function

Combines multiple functions:

```javascript
function compose(...functions) {
  return function (initialValue) {
    return functions.reduceRight((acc, fn) => fn(acc), initialValue);
  };
}

const addOne = (x) => x + 1;
const double = (x) => x * 2;
const square = (x) => x * x;

const composedFunction = compose(square, double, addOne);
console.log(composedFunction(3)); // square(double(addOne(3))) = square(double(4)) = square(8) = 64
```

## Best Practices

1. **Keep functions small and focused**
2. **Use pure functions when possible**
3. **Prefer fewer parameters (high arity can be confusing)**
4. **Use descriptive names**
5. **Return early to avoid deep nesting**

```javascript
// Good: Clear, single responsibility
function validateEmail(email) {
  if (!email) return false;
  if (typeof email !== 'string') return false;
  return email.includes('@') && email.includes('.');
}

// Better: Early returns
function processUser(user) {
  if (!user) return null;
  if (!user.email) return null;
  if (!validateEmail(user.email)) return null;

  return {
    id: user.id,
    email: user.email.toLowerCase(),
    name: user.name || 'Anonymous',
  };
}
```

If the function and its arguments are same,compiler cache the result and give the values.
