---
id: functional-programming-monads-getting-started
title: 🏗️ Monads: Advanced Functional Patterns
slug: /functional-programming/monads/getting-started
sidebar_label: 🏗️ Monads: Advanced Functio...
---

# 🏗️ Monads: Advanced Functional Patterns

> _Master monads: the most powerful abstraction in functional programming for handling context and chaining operations_

## Table of Contents

- [What is a Monad?](#what-is-a-monad)
- [Monad Laws](#monad-laws)
- [Why Monads Matter](#why-monads-matter)
- [Identity Monad](#identity-monad)
- [Maybe Monad](#maybe-monad)
- [Either Monad](#either-monad)
- [IO Monad](#io-monad)
- [State Monad](#state-monad)
- [List Monad](#list-monad)
- [Reader Monad](#reader-monad)
- [Writer Monad](#writer-monad)
- [Async Monad](#async-monad)
- [Monad Transformers](#monad-transformers)
- [Real-World Applications](#real-world-applications)

## What is a Monad?

A **monad** is a design pattern that provides a way to wrap values and chain operations on those wrapped values. Monads are functors that also implement `flatMap` (also called `bind` or `>>=`) and follow specific laws.

### Monad Interface

```javascript
// Generic monad interface
class Monad {
  constructor(value) {
    this.value = value;
  }

  // Functor interface
  map(fn) {
    return this.flatMap((x) => Monad.of(fn(x)));
  }

  // Monad interface (the key method)
  flatMap(fn) {
    // Implementation varies by monad type
    throw new Error('flatMap must be implemented by subclass');
  }

  // Pointed functor interface
  static of(value) {
    return new Monad(value);
  }
}
```

### Mathematical Foundation

Monads come from category theory and must satisfy three laws:

1. **Left Identity**: `M.of(a).flatMap(f) === f(a)`
2. **Right Identity**: `m.flatMap(M.of) === m`
3. **Associativity**: `m.flatMap(f).flatMap(g) === m.flatMap(x => f(x).flatMap(g))`

### The Problem Monads Solve

```javascript
// ❌ Without monads - nested, hard to read
const processUser = (userId) => {
  const user = getUser(userId);
  if (user) {
    const profile = getProfile(user.profileId);
    if (profile) {
      const preferences = getPreferences(profile.prefId);
      if (preferences) {
        return updatePreferences(preferences, { theme: 'dark' });
      }
    }
  }
  return null;
};

// ✅ With monads - flat, composable
const processUserMonadic = (userId) =>
  getUser(userId)
    .flatMap((user) => getProfile(user.profileId))
    .flatMap((profile) => getPreferences(profile.prefId))
    .flatMap((prefs) => updatePreferences(prefs, { theme: 'dark' }));
```

## Monad Laws

All monads must obey three fundamental laws:

### Law Verification Utility

```javascript
// ✅ Utility to verify monad laws
const verifyMonadLaws = (MonadType, value, f, g) => {
  const M = MonadType;
  const m = M.of(value);

  // Left Identity: M.of(a).flatMap(f) === f(a)
  const leftIdentity =
    JSON.stringify(M.of(value).flatMap(f).value) === JSON.stringify(f(value).value);

  // Right Identity: m.flatMap(M.of) === m
  const rightIdentity = JSON.stringify(m.flatMap(M.of).value) === JSON.stringify(m.value);

  // Associativity: m.flatMap(f).flatMap(g) === m.flatMap(x => f(x).flatMap(g))
  const associativity =
    JSON.stringify(m.flatMap(f).flatMap(g).value) ===
    JSON.stringify(m.flatMap((x) => f(x).flatMap(g)).value);

  return {
    leftIdentity,
    rightIdentity,
    associativity,
    valid: leftIdentity && rightIdentity && associativity,
  };
};
```

## Why Monads Matter

Monads provide:

### 1. **Composability**

Chain operations without nested callbacks or complex error handling.

### 2. **Context Preservation**

Handle null values, errors, async operations, or state while maintaining a consistent interface.

### 3. **Separation of Concerns**

Separate the "what" (business logic) from the "how" (context handling).

### 4. **Abstraction Power**

Write generic code that works with any monad type.

```javascript
// ✅ Generic monadic pipeline
const pipeline = (monad, ...operations) => operations.reduce((acc, op) => acc.flatMap(op), monad);

// Works with any monad
const maybeResult = pipeline(
  Maybe.of(5),
  (x) => Maybe.of(x * 2),
  (x) => Maybe.of(x + 3),
  (x) => Maybe.of(`Result: ${x}`),
);

const eitherResult = pipeline(
  Either.of(5),
  (x) => Either.of(x * 2),
  (x) => Either.of(x + 3),
  (x) => Either.of(`Result: ${x}`),
);
```

## Identity Monad

The simplest monad - it just wraps a value without adding any special behavior.

### Implementation

```javascript
// ✅ Identity monad
class Identity {
  constructor(value) {
    this.value = value;
  }

  map(fn) {
    return Identity.of(fn(this.value));
  }

  flatMap(fn) {
    return fn(this.value);
  }

  static of(value) {
    return new Identity(value);
  }

  inspect() {
    return `Identity(${this.value})`;
  }
}

// Usage - mainly for learning and testing
const result = Identity.of(5)
  .flatMap((x) => Identity.of(x * 2))
  .flatMap((x) => Identity.of(x + 3))
  .map((x) => `Final: ${x}`);

console.log(result.inspect()); // Identity(Final: 13)

// Verify laws
const addOne = (x) => Identity.of(x + 1);
const double = (x) => Identity.of(x * 2);
console.log(verifyMonadLaws(Identity, 5, addOne, double)); // All true
```

## Maybe Monad

Handles null/undefined values elegantly, preventing null pointer exceptions.

### Enhanced Maybe Implementation

```javascript
// ✅ Maybe monad with full interface
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
    return this.isNothing() ? this : Maybe.of(fn(this.value));
  }

  flatMap(fn) {
    return this.isNothing() ? this : fn(this.value);
  }

  filter(predicate) {
    return this.isNothing() || predicate(this.value) ? this : Maybe.nothing();
  }

  getOrElse(defaultValue) {
    return this.isNothing() ? defaultValue : this.value;
  }

  orElse(alternativeMaybe) {
    return this.isNothing() ? alternativeMaybe : this;
  }

  static of(value) {
    return value === null || value === undefined ? Maybe.nothing() : new Maybe(value);
  }

  static nothing() {
    return new Maybe(null);
  }

  static some(value) {
    return new Maybe(value);
  }

  inspect() {
    return this.isNothing() ? 'Maybe.Nothing' : `Maybe.Some(${JSON.stringify(this.value)})`;
  }
}

// Advanced Maybe usage
const users = [{ id: 1, name: 'John', email: 'john@example.com' }, { id: 2, name: 'Jane' }, null];

const getUserEmail = (user) =>
  Maybe.of(user)
    .filter((u) => u.id > 0)
    .map((u) => u.email)
    .filter((email) => email && email.includes('@'))
    .map((email) => email.toLowerCase());

users.forEach((user, i) => {
  const email = getUserEmail(user);
  console.log(`User ${i}: ${email.getOrElse('No valid email')}`);
});
// User 0: john@example.com
// User 1: No valid email
// User 2: No valid email
```

### Maybe for Safe Operations

```javascript
// ✅ Safe mathematical operations
const safeDivide = (a, b) => (b === 0 ? Maybe.nothing() : Maybe.of(a / b));

const safeSqrt = (x) => (x < 0 ? Maybe.nothing() : Maybe.of(Math.sqrt(x)));

const safeLog = (x) => (x <= 0 ? Maybe.nothing() : Maybe.of(Math.log(x)));

// Chain safe operations
const calculate = (a, b) =>
  safeDivide(a, b)
    .flatMap(safeSqrt)
    .flatMap(safeLog)
    .map((result) => Math.round(result * 1000) / 1000);

console.log(calculate(100, 4).inspect()); // Maybe.Some(0.693)
console.log(calculate(100, 0).inspect()); // Maybe.Nothing
console.log(calculate(-100, 4).inspect()); // Maybe.Nothing
```

## Either Monad

Represents computations that might fail, holding either a success value (Right) or an error (Left).

### Enhanced Either Implementation

```javascript
// ✅ Either monad for error handling
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

  swap() {
    return new Either(this.value, !this.isRight);
  }

  bimap(leftFn, rightFn) {
    return this.isLeft() ? Either.left(leftFn(this.value)) : Either.right(rightFn(this.value));
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

  static fromNullable(value, errorMessage = 'Value is null') {
    return value === null || value === undefined ? Either.left(errorMessage) : Either.right(value);
  }

  inspect() {
    return this.isLeft()
      ? `Either.Left(${JSON.stringify(this.value)})`
      : `Either.Right(${JSON.stringify(this.value)})`;
  }
}

// Validation with Either
const validateUser = (userData) => {
  const validateName = (user) =>
    !user.name
      ? Either.left('Name is required')
      : user.name.length < 2
        ? Either.left('Name too short')
        : Either.right(user);

  const validateEmail = (user) =>
    !user.email
      ? Either.left('Email is required')
      : !user.email.includes('@')
        ? Either.left('Invalid email')
        : Either.right(user);

  const validateAge = (user) =>
    user.age === undefined
      ? Either.left('Age is required')
      : user.age < 0
        ? Either.left('Age cannot be negative')
        : user.age > 150
          ? Either.left('Age too high')
          : Either.right(user);

  return Either.right(userData).flatMap(validateName).flatMap(validateEmail).flatMap(validateAge);
};

// Test validation
const user1 = { name: 'John', email: 'john@example.com', age: 25 };
const user2 = { name: 'J', email: 'invalid', age: -5 };

console.log(validateUser(user1).inspect()); // Either.Right({...})
console.log(validateUser(user2).inspect()); // Either.Left("Name too short")
```

## IO Monad

Wraps side-effectful operations, allowing composition while deferring execution.

### Enhanced IO Implementation

```javascript
// ✅ IO monad for side effects
class IO {
  constructor(effect) {
    if (typeof effect !== 'function') {
      throw new Error('IO requires a function');
    }
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

  static lift(value) {
    return IO.of(value);
  }

  inspect() {
    return 'IO(?)';
  }
}

// IO utilities
const log = (message) =>
  IO.from(() => {
    console.log(message);
    return message;
  });

const readFile = (filename) =>
  IO.from(() => {
    console.log(`Reading ${filename}...`);
    return `Contents of ${filename}`;
  });

const writeFile = (filename, content) =>
  IO.from(() => {
    console.log(`Writing to ${filename}...`);
    return `Written: ${content}`;
  });

const currentTime = () => IO.from(() => new Date().toISOString());

// Compose IO operations
const fileProcessing = readFile('input.txt')
  .map((content) => content.toUpperCase())
  .flatMap((content) => log(`Processing: ${content}`))
  .flatMap((content) => currentTime().map((time) => `${content} at ${time}`))
  .flatMap((result) => writeFile('output.txt', result));

console.log('Composed IO operation (not executed yet)');
const result = fileProcessing.run();
console.log('Final result:', result);
```

## State Monad

Manages stateful computations in a functional way.

### State Monad Implementation

```javascript
// ✅ State monad for stateful computations
class State {
  constructor(runState) {
    this.runState = runState; // (state) => [value, newState]
  }

  map(fn) {
    return new State((state) => {
      const [value, newState] = this.runState(state);
      return [fn(value), newState];
    });
  }

  flatMap(fn) {
    return new State((state) => {
      const [value, newState] = this.runState(state);
      return fn(value).runState(newState);
    });
  }

  run(initialState) {
    return this.runState(initialState);
  }

  static of(value) {
    return new State((state) => [value, state]);
  }

  static get() {
    return new State((state) => [state, state]);
  }

  static put(newState) {
    return new State((state) => [undefined, newState]);
  }

  static modify(fn) {
    return new State((state) => [undefined, fn(state)]);
  }

  inspect() {
    return 'State(?)';
  }
}

// Example: Counter with State monad
const increment = State.modify((count) => count + 1);
const decrement = State.modify((count) => count - 1);
const getValue = State.get();

// Compose stateful operations
const counterProgram = increment
  .flatMap(() => increment)
  .flatMap(() => decrement)
  .flatMap(() => getValue)
  .map((value) => `Final count: ${value}`);

const [result, finalState] = counterProgram.run(0);
console.log(result); // "Final count: 1"
console.log(finalState); // 1

// Example: Stack operations
const push = (item) => State.modify((stack) => [...stack, item]);
const pop = () =>
  State.get().flatMap((stack) =>
    stack.length === 0
      ? State.of(null)
      : State.put(stack.slice(0, -1)).flatMap(() => State.of(stack[stack.length - 1])),
  );

const stackProgram = push(1)
  .flatMap(() => push(2))
  .flatMap(() => push(3))
  .flatMap(() => pop())
  .flatMap((popped) => State.get().map((stack) => ({ popped, remaining: stack })));

const [stackResult, finalStack] = stackProgram.run([]);
console.log(stackResult); // { popped: 3, remaining: [1, 2] }
```

## List Monad

Represents non-deterministic computations (computations with multiple possible results).

### List Monad Implementation

```javascript
// ✅ List monad for non-deterministic computations
class List {
  constructor(items) {
    this.items = Array.isArray(items) ? items : [items];
  }

  map(fn) {
    return new List(this.items.map(fn));
  }

  flatMap(fn) {
    return new List(
      this.items.reduce((acc, item) => {
        const result = fn(item);
        return acc.concat(result.items);
      }, []),
    );
  }

  filter(predicate) {
    return new List(this.items.filter(predicate));
  }

  concat(otherList) {
    return new List([...this.items, ...otherList.items]);
  }

  static of(value) {
    return new List([value]);
  }

  static empty() {
    return new List([]);
  }

  static from(items) {
    return new List(items);
  }

  inspect() {
    return `List([${this.items.join(', ')}])`;
  }
}

// Non-deterministic computations
const choices = (options) => List.from(options);
const diceRoll = choices([1, 2, 3, 4, 5, 6]);
const coinFlip = choices(['heads', 'tails']);

// All possible combinations
const gameOutcome = diceRoll
  .flatMap((die) => coinFlip.map((coin) => ({ die, coin })))
  .filter((outcome) => outcome.die > 3);

console.log(gameOutcome.inspect());
// List([{die: 4, coin: 'heads'}, {die: 4, coin: 'tails'}, ...])

// Pythagorean triples
const range = (start, end) =>
  List.from(Array.from({ length: end - start + 1 }, (_, i) => start + i));

const pythagoreanTriples = range(1, 20).flatMap((a) =>
  range(a, 20).flatMap((b) =>
    range(b, 20).flatMap((c) => (a * a + b * b === c * c ? List.of([a, b, c]) : List.empty())),
  ),
);

console.log(pythagoreanTriples.inspect());
// List([[3, 4, 5], [5, 12, 13], [6, 8, 10], ...])
```

## Reader Monad

Represents computations that depend on a shared environment/context.

### Reader Monad Implementation

```javascript
// ✅ Reader monad for dependency injection
class Reader {
  constructor(computation) {
    this.computation = computation; // (environment) => value
  }

  map(fn) {
    return new Reader((env) => fn(this.computation(env)));
  }

  flatMap(fn) {
    return new Reader((env) => fn(this.computation(env)).computation(env));
  }

  run(environment) {
    return this.computation(environment);
  }

  static of(value) {
    return new Reader((env) => value);
  }

  static ask() {
    return new Reader((env) => env);
  }

  static asks(selector) {
    return new Reader((env) => selector(env));
  }

  inspect() {
    return 'Reader(?)';
  }
}

// Example: Configuration-dependent computations
const getConfig = (key) => Reader.asks((env) => env.config[key]);
const getUser = (id) => Reader.asks((env) => env.database.users[id]);
const log = (message) => Reader.asks((env) => env.logger.log(message));

const processUser = (userId) =>
  getUser(userId)
    .flatMap((user) => getConfig('greeting').map((greeting) => `${greeting}, ${user.name}!`))
    .flatMap((message) => log(message).map(() => message));

// Environment setup
const environment = {
  config: { greeting: 'Hello' },
  database: {
    users: {
      1: { name: 'Alice' },
      2: { name: 'Bob' },
    },
  },
  logger: { log: (msg) => console.log(`LOG: ${msg}`) },
};

const result = processUser(1).run(environment);
// LOG: Hello, Alice!
console.log(result); // "Hello, Alice!"
```

## Writer Monad

Accumulates values alongside computations (useful for logging, debugging, or collecting metadata).

### Writer Monad Implementation

```javascript
// ✅ Writer monad for logging/accumulation
class Writer {
  constructor(value, log) {
    this.value = value;
    this.log = log;
  }

  map(fn) {
    return new Writer(fn(this.value), this.log);
  }

  flatMap(fn) {
    const result = fn(this.value);
    return new Writer(result.value, this.log.concat(result.log));
  }

  static of(value) {
    return new Writer(value, []);
  }

  static tell(message) {
    return new Writer(undefined, [message]);
  }

  inspect() {
    return `Writer(${JSON.stringify(this.value)}, [${this.log.join(', ')}])`;
  }
}

// Example: Computation with logging
const add = (a, b) => Writer.tell(`Adding ${a} + ${b}`).flatMap(() => Writer.of(a + b));

const multiply = (a, b) => Writer.tell(`Multiplying ${a} * ${b}`).flatMap(() => Writer.of(a * b));

const computation = add(3, 4)
  .flatMap((sum) => multiply(sum, 2))
  .flatMap((product) => Writer.tell(`Final result: ${product}`).flatMap(() => Writer.of(product)));

console.log(computation.inspect());
// Writer(14, [Adding 3 + 4, Multiplying 7 * 2, Final result: 14])

// Example: Factorial with step tracking
const factorial = (n) => {
  if (n <= 1) {
    return Writer.tell(`Base case: ${n}! = 1`).flatMap(() => Writer.of(1));
  }

  return factorial(n - 1).flatMap((prev) =>
    Writer.tell(`${n}! = ${n} * ${prev}`).flatMap(() => Writer.of(n * prev)),
  );
};

const factResult = factorial(5);
console.log(factResult.inspect());
console.log('Steps:', factResult.log);
```

## Async Monad

Handles asynchronous computations in a monadic way.

### Async Monad Implementation

```javascript
// ✅ Async monad (enhanced Promise)
class Async {
  constructor(promise) {
    this.promise = promise;
  }

  map(fn) {
    return new Async(this.promise.then(fn));
  }

  flatMap(fn) {
    return new Async(this.promise.then((value) => fn(value).promise));
  }

  catch(errorHandler) {
    return new Async(this.promise.catch(errorHandler));
  }

  finally(finallyHandler) {
    return new Async(this.promise.finally(finallyHandler));
  }

  run() {
    return this.promise;
  }

  static of(value) {
    return new Async(Promise.resolve(value));
  }

  static reject(error) {
    return new Async(Promise.reject(error));
  }

  static all(asyncs) {
    return new Async(Promise.all(asyncs.map((async) => async.promise)));
  }

  static race(asyncs) {
    return new Async(Promise.race(asyncs.map((async) => async.promise)));
  }

  inspect() {
    return 'Async(Promise)';
  }
}

// Example: API calls with Async monad
const fetchUser = (id) => Async.of(`User ${id}`); // Simulated async operation

const fetchPosts = (user) => Async.of([`${user}'s post 1`, `${user}'s post 2`]);

const fetchComments = (post) => Async.of([`Comment on ${post}`]);

const getUserData = (userId) =>
  fetchUser(userId)
    .flatMap((user) => fetchPosts(user).map((posts) => ({ user, posts })))
    .flatMap((userData) =>
      Async.all(
        userData.posts.map((post) => fetchComments(post).map((comments) => ({ post, comments }))),
      ).map((postComments) => ({ ...userData, postComments })),
    );

// Usage
getUserData(123)
  .run()
  .then((result) => console.log('User data:', result))
  .catch((error) => console.error('Error:', error));
```

## Monad Transformers

Combine multiple monads to handle complex scenarios.

### MaybeT (Maybe Transformer)

```javascript
// ✅ MaybeT - Maybe transformer for Promise<Maybe<T>>
class MaybeT {
  constructor(promise) {
    this.promise = promise; // Promise<Maybe<T>>
  }

  map(fn) {
    return new MaybeT(this.promise.then((maybe) => maybe.map(fn)));
  }

  flatMap(fn) {
    return new MaybeT(
      this.promise.then((maybe) =>
        maybe.isNothing() ? Promise.resolve(Maybe.nothing()) : fn(maybe.value).promise,
      ),
    );
  }

  run() {
    return this.promise;
  }

  static lift(promise) {
    return new MaybeT(promise.then(Maybe.of));
  }

  static of(value) {
    return new MaybeT(Promise.resolve(Maybe.of(value)));
  }

  static nothing() {
    return new MaybeT(Promise.resolve(Maybe.nothing()));
  }
}

// Example: Safe async operations
const safeParseJSON = (str) =>
  MaybeT.of(str)
    .map((s) => {
      try {
        return JSON.parse(s);
      } catch (e) {
        return null;
      }
    })
    .flatMap((obj) => (obj ? MaybeT.of(obj) : MaybeT.nothing()));

const fetchAndParseUser = (url) =>
  MaybeT.lift(fetch(url).then((r) => r.text()))
    .flatMap(safeParseJSON)
    .map((user) => ({ ...user, fetched: true }));

// Usage would be:
// fetchAndParseUser('/api/user/123').run()
//     .then(maybe => maybe.fold(
//         () => console.log('No user found'),
//         user => console.log('User:', user)
//     ));
```

## Real-World Applications

### Form Validation Pipeline

```javascript
// ✅ Complex form validation with Either monad
const validateForm = (formData) => {
  const validateRequired = (field, value) =>
    !value || value.trim() === ''
      ? Either.left(`${field} is required`)
      : Either.right(value.trim());

  const validateEmail = (email) =>
    !/\S+@\S+\.\S+/.test(email) ? Either.left('Invalid email format') : Either.right(email);

  const validatePassword = (password) =>
    password.length < 8
      ? Either.left('Password must be at least 8 characters')
      : Either.right(password);

  const validatePasswordMatch = (password, confirmPassword) =>
    password !== confirmPassword ? Either.left('Passwords do not match') : Either.right(password);

  // Applicative validation (collect all errors)
  const validateName = validateRequired('Name', formData.name);
  const validateEmailField = validateRequired('Email', formData.email).flatMap(validateEmail);
  const validatePasswordField = validateRequired('Password', formData.password).flatMap(
    validatePassword,
  );
  const validateConfirmPassword = validatePasswordField.flatMap((password) =>
    validatePasswordMatch(password, formData.confirmPassword),
  );

  // Combine all validations
  return validateName.flatMap((name) =>
    validateEmailField.flatMap((email) =>
      validateConfirmPassword.map((password) => ({
        name,
        email,
        password,
        valid: true,
      })),
    ),
  );
};

// Test the validation
const validForm = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'secretpassword',
  confirmPassword: 'secretpassword',
};

const invalidForm = {
  name: '',
  email: 'invalid-email',
  password: '123',
  confirmPassword: '456',
};

console.log(validateForm(validForm).inspect());
console.log(validateForm(invalidForm).inspect());
```

### Database Query Pipeline

```javascript
// ✅ Database operations with IO monad
const createConnection = () =>
  IO.from(() => {
    console.log('Creating database connection...');
    return { connected: true, id: Math.random() };
  });

const executeQuery = (connection, query) =>
  IO.from(() => {
    console.log(`Executing query: ${query}`);
    return {
      results: [`Result for ${query}`],
      affectedRows: 1,
    };
  });

const closeConnection = (connection) =>
  IO.from(() => {
    console.log(`Closing connection ${connection.id}`);
    return 'Connection closed';
  });

// Database operation pipeline
const databaseOperation = (query) =>
  createConnection().flatMap((conn) =>
    executeQuery(conn, query).flatMap((results) => closeConnection(conn).map(() => results)),
  );

// Execute the pipeline
const result = databaseOperation('SELECT * FROM users').run();
console.log('Query result:', result);
```

### Configuration Management

```javascript
// ✅ Configuration with Reader monad
const createConfigReader = () => {
  const getDbConfig = () => Reader.asks((env) => env.database);
  const getApiConfig = () => Reader.asks((env) => env.api);
  const getFeatureFlags = () => Reader.asks((env) => env.features);

  const createDbConnection = () =>
    getDbConfig().map((config) => ({
      host: config.host,
      port: config.port,
      connected: true,
    }));

  const createApiClient = () =>
    getApiConfig().flatMap((config) =>
      getFeatureFlags().map((features) => ({
        baseUrl: config.baseUrl,
        timeout: config.timeout,
        features: features.api,
      })),
    );

  const initializeApp = () =>
    createDbConnection().flatMap((db) => createApiClient().map((api) => ({ database: db, api })));

  return { initializeApp };
};

// Environment configuration
const environment = {
  database: { host: 'localhost', port: 5432 },
  api: { baseUrl: 'https://api.example.com', timeout: 5000 },
  features: { api: { caching: true, retry: true } },
};

const configReader = createConfigReader();
const appConfig = configReader.initializeApp().run(environment);
console.log('App configuration:', appConfig);
```

---

## 🎯 Key Takeaways

1. **Monads are about composition** - chain operations while handling context
2. **Three laws govern monads** - left identity, right identity, and associativity
3. **flatMap is the key** - it enables monadic composition and prevents nesting
4. **Each monad handles specific contexts**:
   - Maybe: null/undefined values
   - Either: success/failure scenarios
   - IO: side effects
   - State: stateful computations
   - Reader: dependency injection
   - Writer: accumulation/logging
5. **Monad transformers** combine multiple monads for complex scenarios
6. **Real-world applications** include validation, database operations, and configuration management
7. **Separation of concerns** - business logic separate from context handling
8. **Abstraction power** - write generic code that works with any monad

Monads are the most powerful abstraction in functional programming, enabling elegant composition of complex operations while maintaining purity and predictability.
