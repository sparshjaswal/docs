---
id: functional-programming-pure-function-and-side-effect-getting-started
title: 🎯 Pure Functions and Side Effects
slug: /functional-programming/pure-function-and-side-effect/getting-started
sidebar_label: 🎯 Pure Functions and Side E...
---

# 🎯 Pure Functions and Side Effects

> _The foundation of functional programming: understanding and implementing pure functions while eliminating side effects_

## Table of Contents

- [What are Pure Functions?](#what-are-pure-functions)
- [Characteristics of Pure Functions](#characteristics-of-pure-functions)
- [Side Effects Explained](#side-effects-explained)
- [Common Side Effects](#common-side-effects)
- [Pure vs Impure Examples](#pure-vs-impure-examples)
- [Immutability Techniques](#immutability-techniques)
- [Testing Pure Functions](#testing-pure-functions)
- [Best Practices](#best-practices)
- [Advanced Concepts](#advanced-concepts)

## What are Pure Functions?

A **pure function** is a function that, given the same input, will always return the same output and does not have any observable side effects. Pure functions are the building blocks of functional programming and make code more predictable, testable, and maintainable.

### Mathematical Foundation

Pure functions mirror mathematical functions:

- `f(x) = x²` always returns the same result for the same input
- The function doesn't modify anything outside its scope
- The result depends only on the input parameters

```javascript
// Mathematical function representation
const square = (x) => x * x;
console.log(square(4)); // Always 16
console.log(square(4)); // Always 16
```

## Characteristics of Pure Functions

### 1. **Deterministic Output**

Given the same input, a pure function always produces the same output.

```javascript
// ✅ Pure - always returns same output for same input
const add = (a, b) => a + b;
console.log(add(2, 3)); // Always 5

// ❌ Impure - output varies each time
const addRandom = (a, b) => a + b + Math.random();
console.log(addRandom(2, 3)); // Different each time
```

### 2. **No Side Effects**

Pure functions don't modify anything outside their scope.

```javascript
// ✅ Pure - doesn't modify external state
const multiply = (a, b) => a * b;

// ❌ Impure - modifies global variable
let total = 0;
const addToTotal = (value) => {
  total += value; // Side effect!
  return total;
};
```

### 3. **No External Dependencies**

Pure functions don't depend on external mutable state.

```javascript
// ❌ Impure - depends on external variable
let multiplier = 2;
const multiplyByExternal = (x) => x * multiplier;

// ✅ Pure - all dependencies are parameters
const multiplyBy = (x, multiplier) => x * multiplier;
```

### 4. **Referential Transparency**

Function calls can be replaced with their return values without changing program behavior.

```javascript
// ✅ Pure function
const double = (x) => x * 2;

// These are equivalent:
const result1 = double(5) + double(3);
const result2 = 10 + 6; // Can substitute function calls with values
```

## Side Effects Explained

A **side effect** is any application state change that is observable outside the called function. Side effects make code unpredictable and hard to test.

### Types of Side Effects

#### 1. **State Mutation**

```javascript
// ❌ Mutating input parameters
const addItemImpure = (array, item) => {
  array.push(item); // Modifies original array
  return array;
};

// ✅ Pure version - returns new array
const addItem = (array, item) => [...array, item];
```

#### 2. **Global State Modification**

```javascript
// ❌ Modifying global state
let counter = 0;
const incrementCounter = () => ++counter;

// ✅ Pure version
const increment = (current) => current + 1;
```

#### 3. **I/O Operations**

```javascript
// ❌ Side effects with I/O
const logAndDouble = (x) => {
  console.log(`Doubling ${x}`); // I/O side effect
  return x * 2;
};

// ✅ Separate concerns
const double = (x) => x * 2;
const logResult = (value, result) => console.log(`${value} doubled is ${result}`);

// Usage
const value = 5;
const result = double(value);
logResult(value, result);
```

## Common Side Effects

### 🚫 **What to Avoid**

1. **Modifying global variables or object properties**
2. **Mutating function parameters**
3. **Making HTTP requests or database calls**
4. **Reading/writing files**
5. **Printing to console or logging**
6. **Using non-deterministic functions** (`Math.random()`, `Date.now()`)
7. **Throwing exceptions** (unless handled within the function)
8. **Modifying DOM elements**

```javascript
// ❌ Multiple side effects
let globalCount = 0;
const processData = (data) => {
  console.log('Processing data...'); // I/O side effect
  globalCount++; // Global state mutation
  data.processed = true; // Parameter mutation
  document.getElementById('status').textContent = 'Done'; // DOM manipulation
  return data.value * Math.random(); // Non-deterministic
};

// ✅ Pure version
const processValue = (value) => value * 2;

// Side effects handled separately
const handleSideEffects = (data, result) => {
  console.log('Processing data...');
  updateGlobalCount();
  updateDOM('status', 'Done');
  return { ...data, processed: true, result };
};
```

## Pure vs Impure Examples

### Example 1: String Manipulation

```javascript
// ❌ Impure - depends on external state
let prefix = 'Hello, ';
const greetImpure = (name) => prefix + name;

// ✅ Pure - all dependencies as parameters
const greet = (prefix, name) => prefix + name;

// ✅ Pure with default parameters
const greetDefault = (name, prefix = 'Hello, ') => prefix + name;
```

### Example 2: Array Operations

```javascript
// ❌ Impure - mutates original array
const removeFirstImpure = (array) => {
  array.shift(); // Modifies original array
  return array;
};

// ✅ Pure - returns new array
const removeFirst = (array) => array.slice(1);

// ✅ Alternative pure implementation
const removeFirstAlt = ([first, ...rest]) => rest;
```

### Example 3: Object Updates

```javascript
// ❌ Impure - mutates object
const updateAgeImpure = (person, newAge) => {
  person.age = newAge; // Mutates original object
  return person;
};

// ✅ Pure - returns new object
const updateAge = (person, newAge) => ({ ...person, age: newAge });

// ✅ Pure nested update
const updateNestedPure = (obj, path, value) => {
  if (path.length === 1) {
    return { ...obj, [path[0]]: value };
  }
  const [head, ...tail] = path;
  return {
    ...obj,
    [head]: updateNestedPure(obj[head], tail, value),
  };
};
```

## Immutability Techniques

### 1. **Primitive Values**

Primitives are immutable by nature in JavaScript.

```javascript
const name = 'John';
const newName = name.toUpperCase(); // Returns new string
console.log(name); // Still 'John'
```

### 2. **Arrays**

```javascript
// ✅ Immutable array operations
const numbers = [1, 2, 3, 4, 5];

// Add elements
const withNewElement = [...numbers, 6];
const withElementAtStart = [0, ...numbers];

// Remove elements
const withoutFirst = numbers.slice(1);
const withoutLast = numbers.slice(0, -1);
const withoutIndex = [...numbers.slice(0, 2), ...numbers.slice(3)];

// Update elements
const withUpdatedElement = numbers.map((n, i) => (i === 2 ? n * 10 : n));

// Complex transformations
const processedNumbers = numbers
  .filter((n) => n > 2)
  .map((n) => n * 2)
  .reduce((acc, n) => [...acc, n], []);
```

### 3. **Objects**

```javascript
// ✅ Immutable object operations
const person = { name: 'John', age: 30, city: 'Boston' };

// Add property
const withEmail = { ...person, email: 'john@example.com' };

// Update property
const olderPerson = { ...person, age: person.age + 1 };

// Remove property
const { city, ...withoutCity } = person;

// Nested updates
const userProfile = {
  user: {
    personal: { name: 'John', age: 30 },
    preferences: { theme: 'dark', language: 'en' },
  },
};

const updatedProfile = {
  ...userProfile,
  user: {
    ...userProfile.user,
    personal: {
      ...userProfile.user.personal,
      age: 31,
    },
  },
};
```

### 4. **Using Immutability Libraries**

```javascript
// Using Immutable.js
import { Map, List } from 'immutable';

const immutableMap = Map({ a: 1, b: 2, c: 3 });
const updatedMap = immutableMap.set('b', 10); // Returns new Map

const immutableList = List([1, 2, 3, 4]);
const updatedList = immutableList.push(5); // Returns new List

// Using Immer
import produce from 'immer';

const state = {
  users: [{ id: 1, name: 'John', posts: [] }],
};

const newState = produce(state, (draft) => {
  draft.users[0].posts.push({ title: 'New Post', content: '...' });
});
```

## Testing Pure Functions

Pure functions are incredibly easy to test because they're predictable and isolated.

### 1. **Simple Unit Tests**

```javascript
// Pure function to test
const calculateTotal = (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

// Tests
describe('calculateTotal', () => {
  test('should calculate total for multiple items', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 3 },
    ];
    expect(calculateTotal(items)).toBe(35);
  });

  test('should return 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });

  test('should handle single item', () => {
    const items = [{ price: 15, quantity: 1 }];
    expect(calculateTotal(items)).toBe(15);
  });
});
```

### 2. **Property-Based Testing**

```javascript
// Using a property-based testing library like fast-check
const fc = require('fast-check');

// Property: adding zero should not change the result
fc.assert(
  fc.property(fc.integer(), (n) => {
    return add(n, 0) === n;
  }),
);

// Property: addition should be commutative
fc.assert(
  fc.property(fc.integer(), fc.integer(), (a, b) => {
    return add(a, b) === add(b, a);
  }),
);
```

### 3. **Snapshot Testing**

```javascript
// Complex pure function
const formatUserData = (users) =>
  users
    .filter((user) => user.active)
    .map((user) => ({
      id: user.id,
      name: user.name.toUpperCase(),
      initials: user.name
        .split(' ')
        .map((n) => n[0])
        .join(''),
      memberSince: new Date(user.createdAt).getFullYear(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

// Snapshot test
test('should format user data correctly', () => {
  const users = [/* test data */];
  expect(formatUserData(users)).toMatchSnapshot();
});
```

## Best Practices

### 1. **Function Design Principles**

```javascript
// ✅ Single Responsibility
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const formatEmail = (email) => email.toLowerCase().trim();
const hashEmail = (email) => btoa(email); // Base64 encoding for example

// ✅ Composition over single complex function
const processEmail = (email) => pipe(formatEmail, validateEmail, hashEmail)(email);
```

### 2. **Error Handling in Pure Functions**

```javascript
// ✅ Return error information instead of throwing
const divide = (a, b) => {
  if (b === 0) {
    return { success: false, error: 'Division by zero' };
  }
  return { success: true, result: a / b };
};

// ✅ Using Maybe monad for error handling
const safeDivide = (a, b) => (b === 0 ? Maybe.none() : Maybe.some(a / b));
```

### 3. **Pure Function Patterns**

```javascript
// ✅ Factory functions for configuration
const createValidator = (rules) => (data) => rules.every((rule) => rule(data));

const userValidator = createValidator([
  (user) => user.name && user.name.length > 0,
  (user) => user.email && validateEmail(user.email),
  (user) => user.age && user.age >= 18,
]);

// ✅ Curried functions for partial application
const curry =
  (fn) =>
  (...args) =>
    args.length >= fn.length ? fn(...args) : (...nextArgs) => curry(fn)(...args, ...nextArgs);

const multiply = curry((a, b, c) => a * b * c);
const double = multiply(2);
const quadruple = multiply(2, 2);
```

### 4. **Performance Optimization**

```javascript
// ✅ Memoization for expensive pure functions
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

const expensiveCalculation = memoize((n) => {
  console.log(`Computing for ${n}`);
  return n * n * n;
});

// ✅ Lazy evaluation
const lazy = (fn) => {
  let computed = false;
  let result;
  return () => {
    if (!computed) {
      result = fn();
      computed = true;
    }
    return result;
  };
};

const lazyValue = lazy(() => expensiveCalculation(100));
```

## Advanced Concepts

### 1. **Recursion and Pure Functions**

```javascript
// ✅ Pure recursive functions
const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));

// ✅ Tail-recursive version (more memory efficient)
const factorialTail = (n, acc = 1) => (n <= 1 ? acc : factorialTail(n - 1, n * acc));

// ✅ Pure tree traversal
const mapTree = (fn, tree) => {
  if (!tree || typeof tree !== 'object') {
    return fn(tree);
  }

  if (Array.isArray(tree)) {
    return tree.map((child) => mapTree(fn, child));
  }

  return Object.keys(tree).reduce(
    (acc, key) => ({
      ...acc,
      [key]: mapTree(fn, tree[key]),
    }),
    {},
  );
};
```

### 2. **Function Composition Utilities**

```javascript
// ✅ Advanced composition utilities
const pipe =
  (...fns) =>
  (value) =>
    fns.reduce((acc, fn) => fn(acc), value);
const compose =
  (...fns) =>
  (value) =>
    fns.reduceRight((acc, fn) => fn(acc), value);

// ✅ Async composition
const pipeAsync =
  (...fns) =>
  (value) =>
    fns.reduce((acc, fn) => acc.then(fn), Promise.resolve(value));

// ✅ Conditional composition
const when = (predicate, fn) => (value) => (predicate(value) ? fn(value) : value);

const unless = (predicate, fn) => (value) => (!predicate(value) ? fn(value) : value);

// Usage
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
);
```

### 3. **Pure Function Testing Strategies**

```javascript
// ✅ Contract testing
const testFunction = (fn, contracts) => {
  contracts.forEach(({ input, expectedOutput, description }) => {
    const result = fn(...input);
    console.assert(
      JSON.stringify(result) === JSON.stringify(expectedOutput),
      `${description}: Expected ${expectedOutput}, got ${result}`,
    );
  });
};

// Define contracts
const addContracts = [
  { input: [2, 3], expectedOutput: 5, description: 'Add positive numbers' },
  { input: [-1, 1], expectedOutput: 0, description: 'Add negative and positive' },
  { input: [0, 0], expectedOutput: 0, description: 'Add zeros' },
];

testFunction(add, addContracts);
```

---

## 🎯 Key Takeaways

1. **Pure functions are predictable** - same input always produces same output
2. **Side effects make code unpredictable** - avoid them in functional code
3. **Immutability is crucial** - never modify existing data structures
4. **Pure functions are easy to test** - no setup or mocking required
5. **Compose pure functions** - build complex behavior from simple functions
6. **Separate side effects** - handle them at the boundaries of your system
7. **Use proper error handling** - return errors instead of throwing them
8. **Leverage memoization** - cache results of expensive pure functions

Pure functions form the foundation of functional programming. Master them, and you'll write more reliable, maintainable, and testable code.
