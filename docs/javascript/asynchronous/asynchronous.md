---
slug: /javascript/asynchronous/basics
---

# What is Asynchronous?

1. Asynchronous code is better for performance.

2. Asynchronous code is hard to understand.

3. Asynchronous is not Blocking in nature.

4. Hardware is non-blocking in nature.

## 📋 Table of Contents

- [Asynchronous vs Synchronous Programming](#asynchronous-vs-synchronous-programming)
- [Event Loop, Call Stack & Heap](#event-loop-call-stack--heap)
- [Parallelism vs Asynchronous Programming](#parallelism-vs-asynchronous-programming)

## Asynchronous Pattern

1. callback

2. promises

3. async/await

4. Generators

## Asynchronous vs Synchronous Programming

- **Synchronous** code runs one step at a time and blocks subsequent execution.
- **Asynchronous** code starts work and continues, handling results later.

## Event Loop, Call Stack & Heap

- **Call Stack** executes synchronous function frames.
- **Heap** stores runtime objects and data.
- **Event Loop** pushes callbacks when the stack is available.

## Parallelism vs Asynchronous Programming

- **Asynchronous programming** is non-blocking flow management.
- **Parallelism** is true simultaneous execution across multiple cores/threads.
