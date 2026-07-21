---
id: functional-programming-functor-functions-getting-started
title: "🎭 Functor Functions & Mappable Structures"
slug: /functional-programming/functor-functions/getting-started
sidebar_label: "🎭 Functor Functions & Mappa..."
---

# 🎭 Functor Functions & Mappable Structures

> _Understanding functors: containers that can be mapped over while preserving structure_

## Table of Contents

- [What is a Functor?](#what-is-a-functor)
- [Functor Laws](#functor-laws)
- [Built-in JavaScript Functors](#built-in-javascript-functors)
- [Creating Custom Functors](#creating-custom-functors)
- [Maybe Functor](#maybe-functor)
- [Either Functor](#either-functor)
- [IO Functor](#io-functor)
- [Pointed Functors](#pointed-functors)
- [Real-World Applications](#real-world-applications)
- [Advanced Functor Patterns](#advanced-functor-patterns)

## What is a Functor?

A **functor** is a type that implements a `map` method which applies a function to the wrapped value(s) while preserving the container's structure. Think of it as a "mappable" container.

### Mathematical Definition

In category theory, a functor `F` must satisfy:

- `F.map(id) = id` (Identity law)
- `F.map(compose(f, g)) = compose(F.map(f), F.map(g))` (Composition law)

### Basic Functor Interface

```javascript
// Generic functor interface
class Functor {
  constructor(value) {
    this.value = value;
  }

  // The map method is what makes it a functor
  map(fn) {
    return new Functor(fn(this.value));
  }

  // Static constructor (pointed functor)
  static of(value) {
    return new Functor(value);
  }
}

// Usage
const result = Functor.of(5)
  .map((x) => x * 2)
  .map((x) => x + 1)
  .map((x) => `Result: ${x}`);

console.log(result.value); // "Result: 11"
```

### Why Functors Matter

Functors provide a consistent way to:

- **Apply transformations** without unwrapping values
- **Chain operations** safely
- **Handle context** (null values, errors, async operations)
- **Maintain structure** while transforming content

## Functor Laws

All functors must obey two fundamental laws:

### 1. Identity Law

Mapping the identity function should return the original functor.

```javascript
const identity = (x) => x;

// Law: functor.map(identity) === functor
const original = Functor.of(42);
const mapped = original.map(identity);

console.log(original.value === mapped.value); // true
```

### 2. Composition Law

Mapping a composition should equal composing the maps.

```javascript
const compose = (f, g) => (x) => f(g(x));
const addOne = (x) => x + 1;
const double = (x) => x * 2;

const functor = Functor.of(5);

// These should be equivalent:
const composed = functor.map(compose(double, addOne));
const chained = functor.map(addOne).map(double);

console.log(composed.value === chained.value); // true
```

### Verifying Functor Laws

```javascript
// ✅ Law verification utility
const verifyFunctorLaws = (FunctorType, value, f, g) => {
  const functor = FunctorType.of(value);
  const identity = (x) => x;
  const compose = (fn1, fn2) => (x) => fn1(fn2(x));

  // Identity law
  const identityTest = functor.map(identity).value === functor.value;

  // Composition law
  const composed = functor.map(compose(f, g));
  const chained = functor.map(g).map(f);
  const compositionTest = composed.value === chained.value;

  return {
    identity: identityTest,
    composition: compositionTest,
    valid: identityTest && compositionTest,
  };
};

// Test our Functor
const result = verifyFunctorLaws(
  Functor,
  10,
  (x) => x * 2,
  (x) => x + 5,
);
console.log(result); // { identity: true, composition: true, valid: true }
```

## Built-in JavaScript Functors

JavaScript has several built-in functors that you use every day:

### Array as a Functor

```javascript
// ✅ Arrays are functors
const numbers = [1, 2, 3, 4, 5];

const result = numbers
  .map((x) => x * 2) // [2, 4, 6, 8, 10]
  .map((x) => x + 1) // [3, 5, 7, 9, 11]
  .map((x) => `${x}!`); // ["3!", "5!", "7!", "9!", "11!"]

console.log(result);

// Arrays preserve structure and apply function to each element
const nested = [
  [1, 2],
  [3, 4],
  [5, 6],
];
const flattened = nested.map((arr) => arr.map((x) => x * 2));
console.log(flattened); // [[2, 4], [6, 8], [10, 12]]
```

### Promise as a Functor

```javascript
// ✅ Promises are functors
const asyncValue = Promise.resolve(42);

const result = asyncValue
  .then((x) => x * 2) // Still a Promise
  .then((x) => x + 8) // Still a Promise
  .then((x) => `${x}!`); // Still a Promise

result.then(console.log); // "92!"

// Promises preserve the async context while transforming the value
```

### Function as a Functor

```javascript
// ✅ Functions can be functors (function composition)
const addTen = (x) => x + 10;
const multiplyByTwo = (x) => x * 2;

// Function composition is like mapping over functions
const composedFunction = (value) => multiplyByTwo(addTen(value));

console.log(composedFunction(5)); // 30

// More explicit functor-like interface for functions
class FunctionFunctor {
  constructor(fn) {
    this.fn = fn;
  }

  map(g) {
    return new FunctionFunctor((x) => g(this.fn(x)));
  }

  run(input) {
    return this.fn(input);
  }

  static of(fn) {
    return new FunctionFunctor(fn);
  }
}

const pipeline = FunctionFunctor.of((x) => x + 5)
  .map((x) => x * 2)
  .map((x) => x - 3);

console.log(pipeline.run(10)); // ((10 + 5) * 2) - 3 = 27
```

## Creating Custom Functors

### Container Functor

```javascript
// ✅ Basic container functor
class Container {
  constructor(value) {
    this.value = value;
  }

  map(fn) {
    return Container.of(fn(this.value));
  }

  static of(value) {
    return new Container(value);
  }

  // Utility method for debugging
  inspect() {
    return `Container(${this.value})`;
  }
}

// Usage
const container = Container.of('Hello World')
  .map((s) => s.toUpperCase())
  .map((s) => s.split(' '))
  .map((arr) => arr.reverse())
  .map((arr) => arr.join(' '));

console.log(container.inspect()); // Container(WORLD HELLO)
```

### Box Functor with Debugging

```javascript
// ✅ Box functor with enhanced debugging
class Box {
  constructor(value) {
    this.value = value;
    this.history = [];
  }

  map(fn, description = 'transform') {
    const newValue = fn(this.value);
    const newBox = Box.of(newValue);
    newBox.history = [
      ...this.history,
      {
        operation: description,
        from: this.value,
        to: newValue,
        function: fn.toString(),
      },
    ];
    return newBox;
  }

  static of(value) {
    return new Box(value);
  }

  fold(fn) {
    return fn(this.value);
  }

  inspect() {
    return `Box(${JSON.stringify(this.value)})`;
  }

  trace() {
    console.log('Transformation history:');
    this.history.forEach((step, i) => {
      console.log(`${i + 1}. ${step.operation}: ${step.from} -> ${step.to}`);
    });
    return this;
  }
}

// Usage with tracing
const result = Box.of(10)
  .map((x) => x + 5, 'add 5')
  .map((x) => x * 2, 'multiply by 2')
  .map((x) => x - 3, 'subtract 3')
  .trace()
  .fold((x) => `Final: ${x}`);

console.log(result); // "Final: 27"
```

## Maybe Functor

The Maybe functor handles null/undefined values gracefully, preventing null pointer exceptions.

### Basic Maybe Implementation

```javascript
// ✅ Maybe functor for null safety
class Maybe {
  constructor(value) {
    this.value = value;
  }

  isNothing() {
    return this.value === null || this.value === undefined;
  }

  isSomething() {
    return !this.isNothing();
  }

  map(fn) {
    return this.isNothing() ? Maybe.nothing() : Maybe.of(fn(this.value));
  }

  flatMap(fn) {
    return this.isNothing() ? Maybe.nothing() : fn(this.value);
  }

  getOrElse(defaultValue) {
    return this.isNothing() ? defaultValue : this.value;
  }

  filter(predicate) {
    return this.isNothing() || predicate(this.value) ? this : Maybe.nothing();
  }

  static of(value) {
    return new Maybe(value);
  }

  static nothing() {
    return new Maybe(null);
  }

  static some(value) {
    return value === null || value === undefined ? Maybe.nothing() : Maybe.of(value);
  }

  inspect() {
    return this.isNothing() ? 'Maybe.Nothing' : `Maybe.Some(${this.value})`;
  }
}

// Usage examples
const safeDiv = (a, b) => (b === 0 ? Maybe.nothing() : Maybe.of(a / b));

const result1 = Maybe.of(20)
  .flatMap((x) => safeDiv(x, 2))
  .map((x) => x + 5)
  .map((x) => `Result: ${x}`)
  .getOrElse('Error: Division by zero');

console.log(result1); // "Result: 15"

const result2 = Maybe.of(20)
  .flatMap((x) => safeDiv(x, 0)) // Returns Maybe.nothing()
  .map((x) => x + 5) // Skipped
  .map((x) => `Result: ${x}`) // Skipped
  .getOrElse('Error: Division by zero');

console.log(result2); // "Error: Division by zero"
```

### Maybe with Real-World Examples

```javascript
// ✅ Real-world Maybe usage
const users = [
  { id: 1, name: 'John', address: { street: '123 Main St', city: 'Boston' } },
  { id: 2, name: 'Jane', address: null },
  { id: 3, name: 'Bob' },
];

// Safe property access
const getUserCity = (user) =>
  Maybe.of(user)
    .map((u) => u.address)
    .map((addr) => addr.city)
    .getOrElse('Unknown City');

users.forEach((user) => {
  console.log(`${user.name} lives in: ${getUserCity(user)}`);
});
// John lives in: Boston
// Jane lives in: Unknown City
// Bob lives in: Unknown City

// Safe API response handling
const processApiResponse = (response) =>
  Maybe.of(response)
    .filter((r) => r.success)
    .map((r) => r.data)
    .map((data) => data.users)
    .map((users) => users.filter((u) => u.active))
    .getOrElse([]);

const apiResponse1 = { success: true, data: { users: [{ active: true, name: 'Alice' }] } };
const apiResponse2 = { success: false, error: 'Server error' };

console.log(processApiResponse(apiResponse1)); // [{ active: true, name: 'Alice' }]
console.log(processApiResponse(apiResponse2)); // []
```

## Either Functor

The Either functor handles computations that might fail, representing either a success (Right) or failure (Left).

### Either Implementation

```javascript
// ✅ Either functor for error handling
class Either {
  constructor(value, isRight = true) {
    this.value = value;
    this.isRight = isRight;
  }

  isLeft() {
    return !this.isRight;
  }

  map(fn) {
    return this.isLeft() ? this : Either.right(fn(this.value));
  }

  mapLeft(fn) {
    return this.isLeft() ? Either.left(fn(this.value)) : this;
  }

  flatMap(fn) {
    return this.isLeft() ? this : fn(this.value);
  }

  fold(leftFn, rightFn) {
    return this.isLeft() ? leftFn(this.value) : rightFn(this.value);
  }

  getOrElse(defaultValue) {
    return this.isLeft() ? defaultValue : this.value;
  }

  static left(value) {
    return new Either(value, false);
  }

  static right(value) {
    return new Either(value, true);
  }

  static of(value) {
    return Either.right(value);
  }

  static try(fn) {
    try {
      return Either.right(fn());
    } catch (error) {
      return Either.left(error.message);
    }
  }

  inspect() {
    return this.isLeft() ? `Either.Left(${this.value})` : `Either.Right(${this.value})`;
  }
}

// Usage examples
const parseJSON = (str) => Either.try(() => JSON.parse(str));

const processData = (jsonString) =>
  parseJSON(jsonString)
    .map((obj) => obj.user)
    .map((user) => user.name)
    .map((name) => name.toUpperCase())
    .map((name) => `Hello, ${name}!`)
    .fold(
      (error) => `Error: ${error}`,
      (result) => result,
    );

console.log(processData('{"user":{"name":"alice"}}')); // "Hello, ALICE!"
console.log(processData('invalid json')); // "Error: Unexpected token..."
```

### Either for Validation

```javascript
// ✅ Either for validation chains
const validateEmail = (email) => {
  if (!email) return Either.left('Email is required');
  if (!email.includes('@')) return Either.left('Email must contain @');
  if (email.length < 5) return Either.left('Email too short');
  return Either.right(email);
};

const validateAge = (age) => {
  if (age === undefined) return Either.left('Age is required');
  if (age < 0) return Either.left('Age must be positive');
  if (age > 150) return Either.left('Age must be realistic');
  return Either.right(age);
};

const createUser = (email, age) =>
  validateEmail(email).flatMap((validEmail) =>
    validateAge(age).map((validAge) => ({
      email: validEmail,
      age: validAge,
      id: Math.random(),
    })),
  );

// Test validation
console.log(createUser('john@example.com', 25)); // Either.Right({...})
console.log(createUser('invalid', 25)); // Either.Left('Email must contain @')
console.log(createUser('john@example.com', -5)); // Either.Left('Age must be positive')
```

## IO Functor

The IO functor wraps side-effectful operations, allowing you to compose them while deferring execution.

### IO Implementation

```javascript
// ✅ IO functor for side effects
class IO {
  constructor(effect) {
    this.effect = effect;
  }

  map(fn) {
    return new IO(() => fn(this.effect()));
  }

  flatMap(fn) {
    return new IO(() => fn(this.effect()).effect());
  }

  run() {
    return this.effect();
  }

  static of(value) {
    return new IO(() => value);
  }

  static from(effect) {
    return new IO(effect);
  }
}

// Side-effect functions wrapped in IO
const readFile = (filename) =>
  IO.from(() => {
    console.log(`Reading file: ${filename}`);
    return `Contents of ${filename}`;
  });

const writeFile = (filename, content) =>
  IO.from(() => {
    console.log(`Writing to file: ${filename}`);
    console.log(`Content: ${content}`);
    return `Written to ${filename}`;
  });

const log = (message) =>
  IO.from(() => {
    console.log(`LOG: ${message}`);
    return message;
  });

// Compose IO operations without executing them
const fileOperation = readFile('input.txt')
  .map((content) => content.toUpperCase())
  .flatMap((content) => log(`Processing: ${content.slice(0, 20)}...`))
  .map((content) => content + '\n\nProcessed by IO Functor')
  .flatMap((content) => writeFile('output.txt', content));

// Execute the composed operation
console.log('About to run IO operations...');
const result = fileOperation.run();
console.log('Final result:', result);
```

## Pointed Functors

A pointed functor is a functor with an `of` method (also called `pure` or `return`) that can lift a value into the functor context.

### Pointed Functor Interface

```javascript
// ✅ Generic pointed functor
class Pointed {
  constructor(value) {
    this.value = value;
  }

  map(fn) {
    return Pointed.of(fn(this.value));
  }

  // The 'of' method makes it a pointed functor
  static of(value) {
    return new Pointed(value);
  }

  // Additional utility methods
  flatMap(fn) {
    return fn(this.value);
  }

  apply(functor) {
    return functor.map(this.value);
  }
}

// All the functors we've seen are pointed functors
console.log(Container.of); // Function
console.log(Maybe.of); // Function
console.log(Either.of); // Function
console.log(IO.of); // Function
```

### Applicative Functor Pattern

```javascript
// ✅ Applicative functor for multi-argument functions
class Applicative {
  constructor(value) {
    this.value = value;
  }

  map(fn) {
    return Applicative.of(fn(this.value));
  }

  apply(functor) {
    return functor.map(this.value);
  }

  static of(value) {
    return new Applicative(value);
  }
}

// Lift multi-argument functions
const add = (a) => (b) => (c) => a + b + c;

const result = Applicative.of(add)
  .apply(Applicative.of(1))
  .apply(Applicative.of(2))
  .apply(Applicative.of(3));

console.log(result.value); // 6

// More practical example with validation
const validateAndCreate = (name) => (email) => (age) => ({
  name,
  email,
  age,
  valid: true,
});

const user = Maybe.of(validateAndCreate)
  .apply(Maybe.of('John'))
  .apply(Maybe.of('john@example.com'))
  .apply(Maybe.of(25));

console.log(user.inspect()); // Maybe.Some({name: 'John', ...})
```

## Real-World Applications

### Safe DOM Manipulation

```javascript
// ✅ Safe DOM operations with Maybe
const $ = (selector) => Maybe.of(document.querySelector(selector));

const updateUserProfile = (userId) =>
  $(`#user-${userId}`)
    .map((element) => element.querySelector('.name'))
    .map((nameEl) => nameEl.textContent)
    .map((name) => name.trim())
    .filter((name) => name.length > 0)
    .map((name) => `Welcome, ${name}!`)
    .map((welcome) => {
      $(`#welcome-${userId}`).map((el) => (el.textContent = welcome));
      return welcome;
    })
    .getOrElse('User not found');

// Safe event handling
const handleClick = (selector, handler) =>
  $(selector)
    .map((element) => element.addEventListener('click', handler))
    .getOrElse(console.warn(`Element ${selector} not found`));
```

### Async Operations with Promise Functors

```javascript
// ✅ Promise as functor for async operations
const fetchUser = (id) => fetch(`/api/users/${id}`).then((response) => response.json());

const fetchUserPosts = (userId) =>
  fetch(`/api/users/${userId}/posts`).then((response) => response.json());

// Compose async operations
const getUserWithPosts = (id) =>
  fetchUser(id)
    .then((user) => fetchUserPosts(id).then((posts) => ({ ...user, posts })))
    .then((userData) => ({
      ...userData,
      summary: `${userData.name} has ${userData.posts.length} posts`,
    }))
    .catch((error) => ({ error: error.message }));

// Usage
getUserWithPosts(123)
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
```

### Configuration Pipeline

```javascript
// ✅ Configuration with Either functor
const loadConfig = () =>
  Either.try(() => {
    // Simulate config loading
    return {
      apiUrl: 'https://api.example.com',
      timeout: 5000,
      retries: 3,
    };
  });

const validateConfig = (config) => {
  if (!config.apiUrl) return Either.left('API URL is required');
  if (config.timeout < 1000) return Either.left('Timeout too low');
  if (config.retries < 0) return Either.left('Retries cannot be negative');
  return Either.right(config);
};

const enrichConfig = (config) =>
  Either.right({
    ...config,
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });

const initializeApp = () =>
  loadConfig()
    .flatMap(validateConfig)
    .flatMap(enrichConfig)
    .fold(
      (error) => console.error(`Config error: ${error}`),
      (config) => {
        console.log('App initialized with config:', config);
        return config;
      },
    );

initializeApp();
```

## Advanced Functor Patterns

### Functor Composition

```javascript
// ✅ Compose functors
const compose = (F, G) => ({
  of: (value) => F.of(G.of(value)),
  map: (fn) => (functor) => F.map(G.map(fn))(functor),
});

// Compose Maybe and Array
const MaybeArray = compose(Maybe, Array);

const result = Maybe.of([1, 2, 3, 4])
  .map((arr) => arr.map((x) => x * 2))
  .map((arr) => arr.filter((x) => x > 4));

console.log(result.inspect()); // Maybe.Some([6, 8])
```

### Functor Transformers

```javascript
// ✅ Functor transformer for nested contexts
class MaybeT {
  constructor(innerFunctor) {
    this.innerFunctor = innerFunctor;
  }

  map(fn) {
    return new MaybeT(this.innerFunctor.map((maybe) => maybe.map(fn)));
  }

  static lift(innerFunctor) {
    return new MaybeT(innerFunctor.map(Maybe.of));
  }

  run() {
    return this.innerFunctor;
  }
}

// Usage with Promise<Maybe<T>>
const asyncMaybe = MaybeT.lift(Promise.resolve(42));
const result = asyncMaybe.map((x) => x * 2).map((x) => x + 10);

result.run().then((maybe) => console.log(maybe.inspect())); // Maybe.Some(94)
```

### Covariant and Contravariant Functors

```javascript
// ✅ Covariant functor (normal functor)
class Covariant {
  constructor(value) {
    this.value = value;
  }

  map(fn) {
    return new Covariant(fn(this.value));
  }

  static of(value) {
    return new Covariant(value);
  }
}

// ✅ Contravariant functor (transforms input, not output)
class Contravariant {
  constructor(predicate) {
    this.predicate = predicate;
  }

  contramap(fn) {
    return new Contravariant((value) => this.predicate(fn(value)));
  }

  test(value) {
    return this.predicate(value);
  }

  static of(predicate) {
    return new Contravariant(predicate);
  }
}

// Example: string length validator
const minLength = (min) => Contravariant.of((str) => str.length >= min);
const emailValidator = minLength(5).contramap((email) => email.trim());

console.log(emailValidator.test('  test@example.com  ')); // true
console.log(emailValidator.test('  a@b  ')); // false
```

---

## 🎯 Key Takeaways

1. **Functors provide safe transformation** - apply functions without unwrapping values
2. **Obey functor laws** - identity and composition laws ensure predictable behavior
3. **JavaScript has built-in functors** - Arrays, Promises, and Functions
4. **Maybe handles null values** - prevents null pointer exceptions elegantly
5. **Either handles errors** - functional error handling without exceptions
6. **IO manages side effects** - compose effectful operations while deferring execution
7. **Pointed functors lift values** - the `of` method brings values into functor context
8. **Composition is powerful** - combine functors for complex data transformations

Functors are essential for functional programming, providing a consistent interface for transforming values while preserving structure and handling context.
