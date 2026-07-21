---
title: "Programming Fundamentals"
sidebar_position: 1
description: A comprehensive guide to core programming concepts — JavaScript, TypeScript, Node.js, and programming paradigms.
keywords:
  - programming fundamentals
  - javascript
  - typescript
  - nodejs
  - v8 engine
---

# Programming Fundamentals

A comprehensive guide to core programming concepts with a focus on JavaScript, TypeScript, and the Node.js ecosystem. This reference covers the fundamentals every developer needs — from language mechanics and paradigms to runtime internals and memory management.

---

## Table of Contents

- [JavaScript (ES2024+)](#javascript-es2024)
- [TypeScript](#typescript)
- [Programming Paradigms](#programming-paradigms)
  - [Functional Programming (FP)](#functional-programming-fp)
  - [Object-Oriented Programming (OOP)](#object-oriented-programming-oop)
- [Asynchronous Programming](#asynchronous-programming)
- [Event-Driven Programming](#event-driven-programming)
- [Memory Management](#memory-management)
- [Error Handling](#error-handling)
- [Modules](#modules)
- [Package Management](#package-management)
- [Node.js Runtime](#nodejs-runtime)
- [V8 Engine Internals](#v8-engine-internals)

---

## JavaScript (ES2024+)

JavaScript is a high-level, dynamically-typed, interpreted (and JIT-compiled) language conforming to the ECMAScript specification. It powers the web alongside HTML and CSS, and runs on servers via runtimes like Node.js and Deno.

### Core Building Blocks

**Variables and scope:**

```javascript
// Block-scoped, cannot be redeclared
let count = 0;

// Block-scoped, cannot be reassigned (but objects are mutable)
const MAX_LIMIT = 100;

// Function-scoped, hoisted — avoid in modern code
var legacy = 'pre-ES6';
```

**Data types** — JavaScript has 7 primitive types and 1 structural type:

| Type        | Example                  | Notes                                                      |
| ----------- | ------------------------ | ---------------------------------------------------------- |
| `string`    | `'hello'`                | Immutable, indexed by character                            |
| `number`    | `42`, `3.14`, `Infinity` | IEEE 754 double (no int/float)                             |
| `bigint`    | `9007199254740991n`      | Arbitrary-precision integer                                |
| `boolean`   | `true`, `false`          |                                                            |
| `undefined` | `let x;`                 | Variable declared but unassigned                           |
| `null`      | `let x = null;`          | Intentional absence of value                               |
| `symbol`    | `Symbol('id')`           | Guaranteed unique key                                      |
| `object`    | `{ name: 'Alice' }`      | Structural type — arrays, functions, dates are all objects |

**Operators:** arithmetic (`+`, `-`, `*`, `**`, `/`, `%`), assignment (`=`, `+=`, etc.), comparison (`==` vs `===`, `!=` vs `!==`), logical (`&&`, `||`, `??`, `!`), bitwise (`&`, `|`, `^`, `~`, `<<`, `>>`, `>>>`), and the ternary operator (`condition ? a : b`).

**Control flow:**

```javascript
// Conditional
if (score > 90) {
  /* ... */
} else if (score > 70) {
  /* ... */
} else {
  /* ... */
}

// Switch (uses strict comparison)
switch (status) {
  case 'active':
    /* ... */ break;
  case 'pending':
    /* ... */ break;
  default: /* ... */
}

// Loops
for (let i = 0; i < items.length; i++) {
  /* ... */
}
for (const item of iterable) {
  /* ... */
} // values
for (const key in object) {
  /* ... */
} // keys
while (condition) {
  /* ... */
}
do {
  /* ... */
} while (condition);
```

**Functions:**

```javascript
// Declaration (hoisted)
function add(a, b) {
  return a + b;
}

// Expression (not hoisted)
const multiply = function (a, b) {
  return a * b;
};

// Arrow (lexical this, no arguments object)
const divide = (a, b) => a / b;

// Default parameters
function greet(name = 'guest') {
  return `Hello, ${name}`;
}

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
```

**Objects and arrays:**

```javascript
// Object literal
const user = { name: 'Alice', age: 30 };

// Computed properties
const key = 'role';
const staff = { [key]: 'admin' };

// Shorthand
const name = 'Bob';
const person = { name }; // { name: 'Bob' }

// Array creation and destructuring
const arr = [1, 2, 3];
const [first, second] = arr;

// Common array methods
const doubled = arr.map((x) => x * 2);
const evens = arr.filter((x) => x % 2 === 0);
const sum = arr.reduce((acc, x) => acc + x, 0);
```

### Modern Features (ES2020–ES2024)

- **Optional chaining** (`?.`) — safe property access: `user?.address?.city`
- **Nullish coalescing** (`??`) — fallback only for `null`/`undefined`: `value ?? 'default'`
- **Logical assignment** (`||=`, `&&=`, `??=`) — assign conditionally
- **Top-level await** (ES2022, in modules) — `await` without wrapping in async function
- **Array `.at()`** — negative indexing: `arr.at(-1)` for last element
- **Object `.hasOwn()`** — safer than `.hasOwnProperty`: `Object.hasOwn(obj, 'key')`
- **`Array.prototype.toSorted()` / `toReversed()` / `toSpliced()`** — immutable array operations (ES2023)
- **`Promise.withResolvers()`** (ES2024) — create promise + resolve/reject in one call
- **RegExp `v` flag** (ES2024) — set notation and string properties in character classes
- **`Temporal` API** (Stage 3, approaching ES2025) — modern replacement for `Date`

---

## TypeScript

TypeScript is a statically typed superset of JavaScript that compiles to plain JavaScript. It catches type errors at build time, provides superior editor tooling, and makes large codebases maintainable.

### Core Type System

```typescript
// Primitive types
let name: string = 'Alice';
let age: number = 30;
let active: boolean = true;

// Arrays
let scores: number[] = [95, 87, 91];
let matrix: number[][] = [
  [1, 2],
  [3, 4],
];

// Tuples (fixed-length, typed positions)
let pair: [string, number] = ['age', 30];

// Union types — value can be one of several types
let id: string | number = 'abc123';

// Type aliases
type Status = 'idle' | 'loading' | 'success' | 'error';

// Interfaces — define object shapes (extendable)
interface User {
  id: number;
  name: string;
  email?: string; // optional property
  readonly createdAt: Date; // immutable after creation
}

// Generics — types as parameters
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

// Utility types
type PartialUser = Partial<User>; // all properties optional
type RequiredUser = Required<User>; // all properties required
type ReadonlyUser = Readonly<User>; // all properties readonly
type UserContact = Pick<User, 'email'>; // select subset
type UserWithoutId = Omit<User, 'id'>; // exclude subset
```

### Key Concepts

- **Structural typing** — TypeScript uses duck typing; two types are compatible if their shapes match, regardless of explicit declarations
- **`strict` mode** (`tsconfig.json`) — enables `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, and more. Always use it for new projects
- **`unknown` vs `any`** — `unknown` is the type-safe counterpart of `any`; you must narrow it before use
- **`never`** — represents values that never occur (e.g., a function that always throws or infinite loops)
- **Enums** — named constants. Prefer `const enum` or string literal unions to avoid generated code overhead
- **Declaration files** (`.d.ts`) — describe the shape of existing JS libraries for the type checker

---

## Programming Paradigms

### Functional Programming (FP)

FP treats computation as the evaluation of mathematical functions, avoiding mutable state and side effects.

**Core principles:**

- **Pure functions** — same input always produces same output, no side effects (no mutation, no I/O, no external state changes)

  ```javascript
  // Pure
  const add = (a, b) => a + b;

  // Impure — mutates external state
  let total = 0;
  const addToTotal = (n) => {
    total += n;
  };
  ```

- **Immutability** — data is never changed in place; new copies are returned

  ```javascript
  // Instead of arr.push(4), use:
  const newArr = [...arr, 4];

  // Instead of obj.age = 31, use:
  const newObj = { ...obj, age: 31 };
  ```

- **Higher-order functions** — functions that take or return other functions

  ```javascript
  const multiply = (factor) => (value) => value * factor;
  const double = multiply(2);
  double(5); // 10
  ```

- **Function composition** — combining simple functions into complex pipelines

  ```javascript
  const compose = (f, g) => (x) => f(g(x));
  const addOne = (x) => x + 1;
  const square = (x) => x * x;
  const squareThenAddOne = compose(addOne, square);
  squareThenAddOne(3); // 10
  ```

- **Declarative style** — describe _what_ to do, not _how_
  ```javascript
  // Imperative
  const doubled = [];
  for (let i = 0; i < nums.length; i++) {
    doubled.push(nums[i] * 2);
  }

  // Declarative
  const doubled = nums.map((x) => x * 2);
  ```

**Common FP techniques:** currying, partial application, recursion over loops, monads (Promise, Array.flatMap), and pattern matching (TC39 proposal).

### Object-Oriented Programming (OOP)

OOP models programs as collections of objects that contain data and behavior.

**Core principles:**

- **Encapsulation** — bundle data and methods, control access

  ```javascript
  class BankAccount {
    #balance = 0; // ES2022 private field

    deposit(amount) {
      if (amount > 0) this.#balance += amount;
      return this.#balance;
    }

    get balance() {
      return this.#balance;
    }
  }
  ```

- **Inheritance** — create specialized classes from general ones

  ```javascript
  class Animal {
    constructor(name) {
      this.name = name;
    }
    speak() {
      return `${this.name} makes a sound`;
    }
  }

  class Dog extends Animal {
    speak() {
      return `${this.name} barks`;
    }
  }
  ```

- **Polymorphism** — objects of different types respond to the same interface

  ```javascript
  const animals = [new Animal('generic'), new Dog('Rex')];
  animals.forEach((a) => console.log(a.speak()));
  // "generic makes a sound"
  // "Rex barks"
  ```

- **Abstraction** — expose only essential details, hide complexity

**Prototype-based nature of JS:** JavaScript uses prototypal inheritance under the hood. `class` syntax is syntactic sugar over the prototype chain. Every object has an internal `[[Prototype]]` link; property access walks up this chain.

```javascript
const parent = {
  greet() {
    return 'hello';
  },
};
const child = Object.create(parent);
child.greet(); // 'hello' — found via prototype chain
```

---

## Asynchronous Programming

JavaScript is single-threaded with a non-blocking event loop. Long-running operations (network, file I/O, timers) are delegated to the runtime, and their results are processed asynchronously via callbacks, promises, or async/await.

### Evolution of Async Patterns

**Callbacks (original approach):**

```javascript
fetchData('/api/users', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  processUsers(data, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(result);
  });
});
// Problem: callback hell — deeply nested, hard to read/error-handle
```

**Promises (ES6):**

```javascript
fetchData('/api/users')
  .then((data) => processUsers(data))
  .then((result) => console.log(result))
  .catch((err) => console.error(err));
// Promise states: pending → fulfilled (resolved) or rejected
// .then() returns a new promise, enabling chaining
```

**Async/await (ES2017):**

```javascript
async function loadUsers() {
  try {
    const data = await fetchData('/api/users');
    const result = await processUsers(data);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}
// Reads like synchronous code; error handling via try/catch
```

### Key Async Patterns

- **`Promise.all([])`** — run in parallel, fail if any rejects
- **`Promise.allSettled([])`** — run in parallel, get all results (fulfilled or rejected)
- **`Promise.race([])`** — resolve/reject with the first to settle
- **`Promise.any([])`** — resolve with the first to fulfill, reject only if all reject
- **`for await...of`** — iterate over async iterables (streams, generators)

### The Event Loop

```
Call Stack → executes synchronous code
     ↓ (when stack is empty)
Microtask Queue → Promises (.then/catch/finally), queueMicrotask, MutationObserver
     ↓ (when microtask queue is empty)
Macrotask Queue → setTimeout, setInterval, I/O callbacks, setImmediate (Node.js)
```

Microtasks run before the next macrotask. This is why `Promise.resolve().then(...)` runs before `setTimeout(..., 0)`.

---

## Event-Driven Programming

Event-driven architecture decouples producers (emitters) from consumers (listeners). The flow of execution is determined by events rather than a sequential script.

**Pattern:**

```javascript
// Node.js EventEmitter
import { EventEmitter } from 'events';

const emitter = new EventEmitter();

// Register listener
emitter.on('orderPlaced', (order) => {
  console.log(`Processing order #${order.id}`);
});

// Emit event
emitter.emit('orderPlaced', { id: 1234 });
```

**Browser events:**

```javascript
button.addEventListener('click', (event) => {
  console.log('Button clicked', event.target);
});
```

**Key concepts:**

- **Observer pattern** — subject maintains a list of observers and notifies them of state changes
- **Event bubbling/capturing** (DOM) — events propagate up (bubble) or down (capture) the DOM tree
- **Custom events** — `new CustomEvent('myEvent', { detail: {...} })` for application-specific events

---

## Memory Management

JavaScript uses automatic garbage collection (GC), but understanding how memory works is essential for writing performant applications.

### Memory Lifecycle

1. **Allocate** — memory is allocated when variables are declared, objects created, functions defined
2. **Use** — read/write operations on allocated memory
3. **Release** — GC frees memory when objects become unreachable

### Stack vs Heap

| Region    | What goes there                                              | Lifetime                                 |
| --------- | ------------------------------------------------------------ | ---------------------------------------- |
| **Stack** | Primitives, function call frames, references to heap objects | Automatic (push/pop with function calls) |
| **Heap**  | Objects, arrays, functions, closures                         | Managed by GC                            |

### Garbage Collection Algorithms

- **Mark-and-sweep** (modern engines): Start from roots (global object, call stack), mark all reachable objects, sweep away unmarked ones. This is the primary algorithm in V8.
- **Reference counting** (legacy): Track number of references to each object; free when count reaches zero. Fails with circular references, so modern engines don't rely on it.
- **Generational collection**: Most objects die young. V8 splits heap into "new space" (young generation, fast Scavenge GC) and "old space" (objects surviving multiple GC cycles, slower Mark-Sweep-Compact).

### Common Memory Leaks

- **Accidental globals** — assigning to undeclared variable creates a global property
- **Forgotten timers/callbacks** — `setInterval` references keep closures alive
- **Detached DOM nodes** — JavaScript references to removed DOM elements prevent their GC
- **Closures retaining large objects** — inner functions keep outer scope alive

**Detection:** Use Chrome DevTools Memory panel (heap snapshots, allocation timeline) or `process.memoryUsage()` in Node.js.

---

## Error Handling

Robust error handling prevents crashes and provides meaningful feedback.

### Try/Catch/Finally

```javascript
try {
  const data = JSON.parse(input);
  processData(data);
} catch (error) {
  // Narrow the error type
  if (error instanceof SyntaxError) {
    console.error('Invalid JSON:', error.message);
  } else {
    throw error; // rethrow unexpected errors
  }
} finally {
  cleanup(); // runs regardless of error
}
```

### Custom Error Types

```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

throw new ValidationError('Required field missing', 'email');
```

### Error Handling Patterns

- **Fail fast** — validate early, throw immediately on invalid state
- **Catch at boundaries** — handle errors at API entry points, not deep in internals
- **Never swallow errors** — always log or propagate; empty catch blocks hide bugs
- **Async error handling** — unhandled promise rejections crash Node.js processes; always `.catch()` or `try/catch` with `await`
- **Operational vs programmer errors** — operational (network failure, file not found) should be handled gracefully; programmer (null reference, type error) should be fixed in code

```javascript
// Global handlers (last resort)
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});
```

---

## Modules

Modules encapsulate code into reusable, self-contained units with explicit dependencies.

### CommonJS (CJS) — Node.js default

```javascript
// Export
module.exports = { add, subtract };
exports.multiply = (a, b) => a * b; // shorthand

// Import
const math = require('./math');
const { add } = require('./math');
```

- Synchronous loading (works on server, problematic in browser)
- `require()` can be called conditionally
- `module.exports` is a singleton — cached after first load

### ES Modules (ESM) — modern standard

```javascript
// Named export
export const add = (a, b) => a + b;
export function subtract(a, b) {
  return a - b;
}

// Default export
export default class Calculator {
  /* ... */
}

// Import
import Calculator, { add, subtract } from './math.js';
import * as math from './math.js';
```

- Static analysis possible (tree-shaking, bundler optimization)
- Asynchronous loading (works natively in browsers)
- `import` must be top-level (except dynamic `import()`)
- Strict mode by default

### Key Differences

| Feature           | CJS                          | ESM                                      |
| ----------------- | ---------------------------- | ---------------------------------------- |
| Syntax            | `require` / `module.exports` | `import` / `export`                      |
| Loading           | Synchronous                  | Asynchronous                             |
| This at top level | `this === module.exports`    | `this === undefined`                     |
| Live bindings     | No (copy of exports)         | Yes (bindings are live)                  |
| Dynamic import    | Always dynamic               | `import()` expression                    |
| File extension    | `.js` / `.cjs`               | `.mjs` / `.js` (with `"type": "module"`) |

---

## Package Management

### npm (Node Package Manager)

```bash
# Initialize a project
npm init -y

# Install dependencies
npm install express              # production dependency
npm install -D jest typescript   # dev dependency
npm install -g npm-check-updates # global install

# Scripts (in package.json)
"scripts": {
  "start": "node index.js",
  "test": "jest",
  "build": "tsc"
}

# Run scripts
npm run build
```

### Versioning (SemVer)

Packages follow `MAJOR.MINOR.PATCH`:

- `^1.2.3` — compatible with `>=1.2.3 &lt;2.0.0` (default for `npm install`)
- `~1.2.3` — compatible with `>=1.2.3 &lt;1.3.0`
- `1.2.3` — exact version only

### Lock Files

`package-lock.json` (npm) or `yarn.lock` (yarn) pins exact dependency trees for reproducible builds. Commit these files to version control.

### Alternative Package Managers

- **yarn** — deterministic installs, workspaces, Plug'n'Play
- **pnpm** — disk-efficient (content-addressable storage), strict dependency isolation
- **bun** — all-in-one runtime, bundler, and package manager (drop-in npm compatible)

---

## Node.js Runtime

Node.js is a JavaScript runtime built on Chrome's V8 engine, designed for building scalable network applications.

### Architecture

```
JavaScript Code
      ↓
Node.js APIs (fs, http, path, crypto, ...)
      ↓
libuv (async I/O, event loop, thread pool)
      ↓
Operating System
```

### Key Characteristics

- **Single-threaded event loop** — one main thread handles all JS execution; I/O is offloaded to the kernel or thread pool
- **Non-blocking I/O** — operations that would block (file reads, DB queries) use callbacks/promises, so the thread stays free for other requests
- **Event-driven** — the event loop picks up completed I/O operations and invokes their callbacks

### Global Objects

- `global` — the global namespace (like `window` in browsers)
- `process` — information about and control over the current Node.js process (env vars, argv, exit, memory)
- `__dirname`, `__filename` — current directory and file path (CJS only; in ESM use `import.meta.url`)
- `Buffer` — raw binary data handling
- `console` — logging utilities

### Core Modules (selection)

| Module           | Purpose                      |
| ---------------- | ---------------------------- |
| `fs`             | File system operations       |
| `http`           | HTTP server and client       |
| `path`           | File path utilities          |
| `crypto`         | Cryptographic functions      |
| `stream`         | Streaming data processing    |
| `events`         | EventEmitter base class      |
| `child_process`  | Spawn subprocesses           |
| `worker_threads` | True multi-threading         |
| `cluster`        | Multi-process load balancing |

### The Event Loop in Detail

Node.js event loop phases (each phase has a FIFO queue of callbacks):

1. **timers** — `setTimeout`, `setInterval` callbacks
2. **pending callbacks** — deferred I/O callbacks
3. **idle, prepare** — internal use
4. **poll** — retrieve new I/O events; execute I/O callbacks
5. **check** — `setImmediate` callbacks
6. **close callbacks** — `socket.on('close', ...)` etc.

Between each phase, the loop processes `process.nextTick` and microtask queues.

---

## V8 Engine Internals

V8 is Google's open-source JavaScript and WebAssembly engine, written in C++. It powers Chrome, Node.js, Deno, and Electron.

### Execution Pipeline

```
JavaScript Source Code
        ↓
    Parser → AST (Abstract Syntax Tree)
        ↓
    Ignition (Interpreter) → Bytecode
        ↓
    TurboFan (Optimizing Compiler) → Machine Code
        ↓ (if assumptions fail)
    Deoptimization → back to Bytecode
```

### Key Components

- **Ignition** — V8's interpreter. Generates bytecode from AST quickly with low memory overhead. All code starts here.
- **TurboFan** — optimizing compiler. Identifies "hot" functions (frequently executed), collects type feedback (inline caches), and generates highly optimized machine code with speculative optimizations.
- **Sparkplug** — a fast, non-optimizing compiler introduced to bridge the gap between Ignition and TurboFan. Compiles bytecode to machine code quickly without heavy optimization.
- **Maglev** (since Chrome 114/V8 11.4) — a mid-tier optimizing compiler that generates better code than Sparkplug but faster than TurboFan.

### Key Optimizations

- **Inline caching** — V8 remembers the types of objects seen at property access sites, avoiding repeated lookups
- **Hidden classes (Maps)** — V8 creates internal "shape" descriptors for objects with the same property layout, enabling fast property access like C structs
- **Function inlining** — replacing a function call with the function body to avoid call overhead

### Writing V8-Friendly Code

- Keep object shapes consistent — add properties in the same order, don't delete properties dynamically
- Avoid polymorphic functions — prefer functions that operate on consistent types
- Keep functions small — easier for TurboFan to inline
- Avoid `try/catch` in hot paths — prevents some optimizations
- Use monomorphic arrays — don't mix types in arrays (`[1, 'two', {}]`) as V8 optimizes for homogeneous arrays

### Memory Layout

V8's heap is divided into spaces:

- **New space** — young generation, scavenged quickly
- **Old space** — survived multiple GC cycles, includes old pointer and old data spaces
- **Large object space** — objects exceeding size threshold
- **Code space** — JIT-compiled code objects
- **Cell/PropertyCell/Map spaces** — internal metadata

---

## Further Reading

- [MDN Web Docs — JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [V8 Blog](https://v8.dev/blog)
- [JavaScript Visualized: Event Loop](https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif)

[← Back to Home](../index.md) &middot; &copy; sparshjaswal
