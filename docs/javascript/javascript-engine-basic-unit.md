---
id: javascript-javascript-engine-basic-unit
title: "Unit of JavaScript Compiler"
slug: /javascript/javascript-engine-basic-unit
sidebar_label: "Unit of JavaScript Compiler"
---

# Unit of JavaScript Compiler

### Parser

lexical Code

### AST

Abstract syntax tree

### Interpreter

Reads/Scans the code line by line and no intermediate code is generated.

### Profiler

### Complier

Reads/Scans the complete code and translate into machine code.

### Optimize code

### ByteCode

# ⚡ JavaScript Event Loop - Complete Guide

> **Understanding the heart of JavaScript's asynchronous execution model**

## 📖 Table of Contents

- [What is the Event Loop?](#what-is-the-event-loop)
- [JavaScript Engine Architecture](#javascript-engine-architecture)
- [Key Components](#key-components)
- [How the Event Loop Works](#how-the-event-loop-works)
- [Practical Examples](#practical-examples)
- [Common Misconceptions](#common-misconceptions)
- [Performance Implications](#performance-implications)
- [Best Practices](#best-practices)
- [Interview Questions](#interview-questions)

---

## What is the Event Loop?

The **Event Loop** is JavaScript's mechanism for handling **asynchronous operations** in a **single-threaded environment**. It's the reason JavaScript can perform non-blocking operations despite being single-threaded.

### 🧠 Mental Model

> Think of the Event Loop as a **restaurant waiter**:
>
> - Takes orders (events) from customers (your code)
> - Delivers orders to the kitchen (Web APIs)
> - Brings completed dishes back to customers (executes callbacks)
> - Manages multiple tables efficiently without keeping anyone waiting too long

---

## JavaScript Engine Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Call Stack    │    │   Web APIs      │
│                 │    │  - setTimeout   │
│  function3()    │    │  - DOM Events   │
│  function2()    │    │  - HTTP Requests│
│  function1()    │◄──►│  - File I/O     │
│                 │    │                 │
└─────────────────┘    └─────────────────┘
         ▲                       │
         │                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Event Loop    │    │ Callback Queue  │
│                 │    │                 │
│ Monitors Stack  │    │  callback1()    │
│ & Queues        │    │  callback2()    │
│                 │    │  callback3()    │
└─────────────────┘    └─────────────────┘
```

---

## Key Components

### 📚 **Call Stack** (LIFO - Last In, First Out)

- **Purpose**: Keeps track of function calls
- **Structure**: Stack data structure
- **Behavior**: Functions are pushed when called, popped when completed

```javascript
function first() {
  console.log('First function');
  second();
}

function second() {
  console.log('Second function');
  third();
}

function third() {
  console.log('Third function');
}

first();

// Call Stack execution:
// 1. first() pushed
// 2. second() pushed
// 3. third() pushed
// 4. third() popped (completed)
// 5. second() popped (completed)
// 6. first() popped (completed)
```

### 🏪 **Heap** (Memory Storage)

- **Purpose**: Stores objects and variables
- **Structure**: Unorganized memory region
- **Behavior**: Objects allocated here, garbage collected when not referenced

```javascript
const user = {
  // Object stored in heap
  name: 'John', // Properties stored in heap
  age: 30, // Referenced by 'user' variable
};
```

### 🌐 **Web APIs** (Browser/Node.js Environment)

- **Purpose**: Handle asynchronous operations
- **Examples**: setTimeout, DOM events, HTTP requests, File I/O
- **Behavior**: Execute outside the main thread

### 📬 **Callback Queue** (FIFO - First In, First Out)

- **Purpose**: Holds completed async operations
- **Structure**: Queue data structure
- **Behavior**: Callbacks wait here until Call Stack is empty

### 🔄 **Event Loop** (The Coordinator)

- **Purpose**: Manages execution flow
- **Job**: Monitors Call Stack and moves callbacks from queue to stack
- **Rule**: Only moves callbacks when Call Stack is empty

---

## How the Event Loop Works

### 🔄 The Event Loop Cycle

```javascript
// Step-by-step execution example
console.log('Start'); // 1. Executes immediately

setTimeout(() => {
  // 2. Goes to Web APIs
  console.log('Timeout callback'); // 5. Executes after stack is empty
}, 0);

console.log('End'); // 3. Executes immediately

// Output:
// Start
// End
// Timeout callback
```

### 📊 Execution Flow Diagram

```
1. Execute: console.log('Start')
   Call Stack: [console.log]
   Output: "Start"

2. Encounter: setTimeout(callback, 0)
   Call Stack: [setTimeout]
   Web APIs: [Timer: 0ms]

3. Timer completes immediately
   Web APIs: []
   Callback Queue: [callback]

4. Execute: console.log('End')
   Call Stack: [console.log]
   Output: "End"

5. Call Stack empty, Event Loop moves callback
   Call Stack: [callback]
   Output: "Timeout callback"
```

---

## Practical Examples

### Example 1: Basic Async Behavior

```javascript
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve().then(() => console.log('C'));

console.log('D');

// Output: A, D, C, B
// Explanation:
// - A, D: Synchronous, execute immediately
// - C: Microtask (Promise), higher priority than setTimeout
// - B: Macrotask (setTimeout), lowest priority
```

### Example 2: Understanding Microtasks vs Macrotasks

```javascript
// Macrotasks (lower priority)
setTimeout(() => console.log('setTimeout 1'), 0);
setTimeout(() => console.log('setTimeout 2'), 0);

// Microtasks (higher priority)
Promise.resolve().then(() => console.log('Promise 1'));
Promise.resolve().then(() => console.log('Promise 2'));

console.log('Sync');

// Output:
// Sync
// Promise 1
// Promise 2
// setTimeout 1
// setTimeout 2
```

### Example 3: Complex Execution Order

```javascript
console.log('=== Start ===');

setTimeout(() => {
  console.log('Timeout 1');
  Promise.resolve().then(() => console.log('Promise in Timeout'));
}, 0);

Promise.resolve().then(() => {
  console.log('Promise 1');
  setTimeout(() => console.log('Timeout in Promise'), 0);
});

queueMicrotask(() => console.log('Microtask'));

console.log('=== End ===');

// Output:
// === Start ===
// === End ===
// Promise 1
// Microtask
// Timeout 1
// Promise in Timeout
// Timeout in Promise
```

### Example 4: Event Handling

```javascript
// HTML: <button id="btn">Click me</button>

document.getElementById('btn').addEventListener('click', () => {
  console.log('Button clicked');

  setTimeout(() => console.log('Click timeout'), 0);

  Promise.resolve().then(() => console.log('Click promise'));
});

// When button is clicked:
// Button clicked
// Click promise
// Click timeout
```

---

## Common Misconceptions

### Myth 1: "setTimeout(fn, 0) executes immediately"

```javascript
// Wrong understanding
setTimeout(() => console.log('This runs immediately'), 0);

// Reality: It goes to callback queue and waits for stack to be empty
console.log('This actually runs first');
```

### Myth 2: "JavaScript is multi-threaded"

```javascript
// JavaScript engine is single-threaded
// Web APIs provide the illusion of concurrency
// But JavaScript code execution is always single-threaded
```

### Myth 3: "Promises are always faster than setTimeout"

```javascript
// Correct: Promises are microtasks (higher priority)
Promise.resolve().then(() => console.log('Promise'));
setTimeout(() => console.log('Timeout'), 0);

// But this doesn't mean Promises are "faster" - they have higher priority
```

---

## Performance Implications

### ⚠️ Blocking the Event Loop

```javascript
// BAD: Blocks the event loop
function heavyTask() {
  const start = Date.now();
  while (Date.now() - start < 5000) {
    // Blocks for 5 seconds - nothing else can run!
  }
}

heavyTask(); // Browser becomes unresponsive
```

### ✅ Non-blocking Solutions

```javascript
// GOOD: Break heavy tasks into chunks
function heavyTaskNonBlocking(dataChunk, callback) {
  // Process small chunk
  processChunk(dataChunk);

  // Continue with next chunk asynchronously
  if (hasMoreData()) {
    setTimeout(() => {
      heavyTaskNonBlocking(nextChunk(), callback);
    }, 0);
  } else {
    callback();
  }
}

// BETTER: Use Web Workers for CPU-intensive tasks
const worker = new Worker('heavy-task-worker.js');
worker.postMessage(data);
worker.onmessage = (result) => {
  // Handle result without blocking main thread
};
```

### 📊 Performance Monitoring

```javascript
// Monitor Event Loop lag
function measureEventLoopLag() {
  const start = process.hrtime.bigint();

  setImmediate(() => {
    const lag = process.hrtime.bigint() - start;
    console.log(`Event Loop Lag: ${lag / 1000000n}ms`);
  });
}

setInterval(measureEventLoopLag, 1000);
```

---

## Best Practices

### 1. 🔄 **Keep the Event Loop Free**

```javascript
// Avoid long-running synchronous operations
// Break them into smaller async chunks
```

### 2. 🎯 **Understand Task Priorities**

```javascript
// Microtasks: process.nextTick, Promises, queueMicrotask
// Macrotasks: setTimeout, setInterval, I/O operations

// Use appropriately based on urgency
Promise.resolve().then(() => {
  // High priority update
});

setTimeout(() => {
  // Lower priority operation
}, 0);
```

### 3. 📈 **Optimize Async Operations**

```javascript
// Group similar operations
const promises = [fetch('/api/data1'), fetch('/api/data2'), fetch('/api/data3')];

Promise.all(promises).then((results) => {
  // Handle all results together
});
```

### 4. 🔍 **Debug with Tools**

```javascript
// Use browser DevTools Performance tab
// Monitor Call Stack and Async operations
// Look for long tasks that block the event loop
```

---

## Interview Questions

### 🎯 **Beginner Level**

**Q1: What is the Event Loop?**

```
A: The Event Loop is JavaScript's mechanism for handling asynchronous
operations. It continuously monitors the Call Stack and callback queues,
moving callbacks to the stack when it's empty.
```

**Q2: Predict the output:**

```javascript
console.log('A');
setTimeout(() => console.log('B'), 0);
console.log('C');

// Answer: A, C, B
```

### 🔥 **Intermediate Level**

**Q3: Explain microtasks vs macrotasks**

```javascript
// Microtasks: Promises, queueMicrotask
// Macrotasks: setTimeout, setInterval, I/O
// Microtasks have higher priority and run before macrotasks
```

**Q4: What's wrong with this code?**

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Issue: Prints 3, 3, 3 instead of 0, 1, 2
// Solution: Use let or closures
```

### 🚀 **Advanced Level**

**Q5: How would you implement a non-blocking loop?**

```javascript
function nonBlockingLoop(array, processor, callback) {
  function processChunk(index) {
    const chunkSize = 100;
    let processed = 0;

    while (processed < chunkSize && index < array.length) {
      processor(array[index++]);
      processed++;
    }

    if (index < array.length) {
      setTimeout(() => processChunk(index), 0);
    } else {
      callback();
    }
  }

  processChunk(0);
}
```

---

## 🎯 Key Takeaways

1. **JavaScript is single-threaded** but uses the Event Loop for concurrency
2. **Call Stack** executes functions synchronously
3. **Web APIs** handle asynchronous operations outside the main thread
4. **Event Loop** coordinates between stack and queues
5. **Microtasks** (Promises) have higher priority than **macrotasks** (setTimeout)
6. **Blocking operations** should be avoided or broken into chunks
7. **Understanding the Event Loop** is crucial for debugging async issues

---

## 📚 Further Reading

- [MDN: Concurrency model and Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
- [Philip Roberts: What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)
- [Jake Archibald: Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

---

_Ready to master asynchronous JavaScript? Practice these examples and experiment with different async patterns!_ 🚀

# Event Loop

Concurrency Model And Event Loop

JavaScript has a concurrency model based on an event loop, which is responsible for executing the code, collecting and processing events, and executing queued sub-tasks.

**Concurrency** means multiple computations are happening at the same time

**Stack** A Stack is an ordered collection of items where the addition and removal of item items happens at one end. This ordering principle is sometimes called LIFO, last-in first-out.

**Queue** :- A queue is an ordered collection of items where the addition of new items happens at one end, called the “rear,” and the removal of existing items occurs at the other end, commonly called the “front.” This ordering principle is sometimes called FIFO, first-in first-out. It is also known as “first-come first-served.”

**Heap** it is group of memory space available for developer for store object in any random order.

The Event Loop has one simple job — to monitor the Call Stack and the Callback Queue. If the Call Stack is empty, it will take the first event from the queue and will push it to the Call Stack, which effectively runs it. Such an iteration is called a tick in the Event Loop. Each event is just a function callback.
