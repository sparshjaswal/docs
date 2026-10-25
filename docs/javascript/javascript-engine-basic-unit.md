---
id: javascript-javascript-engine-basic-unit
slug: /javascript/javascript-engine-basic-unit
title: "JavaScript engines, V8, and Node.js"
sidebar_label: "Engines, V8, and Node.js"
---

# JavaScript engines, V8, and Node.js

A JavaScript **engine** reads and runs JavaScript code. A **host**, such as a browser or Node.js, supplies other tools around it, including timers, networking, and file or page access. V8 is one engine used in several hosts.

1. Follow source code through parsing and execution.
2. Trace a normal function call before learning how execution can be optimized.
3. Separate the engine's work from the host's I/O, which means input and output.
4. Use memory and performance tools only after you can reproduce a small problem.

For a beginner, the key question is “Who provides this feature?” Engine tiers and garbage-collection details are optional deeper reading, not prerequisites for making your first page.

## From source to execution

| Stage | Purpose | What to remember |
| --- | --- | --- |
| Parsing | Recognize valid syntax and construct an internal representation | Syntax errors can prevent the whole module from executing |
| Compilation and interpretation | Produce and execute an engine-specific representation | There is no required line-by-line interpreter architecture |
| Profiling and optimization | Specialize frequently executed code based on observed behavior | Strategies differ among engines and change over time |
| Deoptimization | Fall back when an optimization's assumptions stop holding | Clever source tricks do not guarantee faster execution |
| Garbage collection | Reclaim storage that is no longer needed by reachable program state | Collection timing is not under ordinary application control |

For a concrete implementation, V8 documents its [Ignition interpreter](https://v8.dev/docs/ignition) and [TurboFan optimizing compiler](https://v8.dev/docs/turbofan). Other engines use their own pipelines; those implementation details are not JavaScript language requirements.

## V8 execution tiers

V8 is the engine used by Chrome and Node.js. Its documented tiered architecture includes:

| Component | Role |
| --- | --- |
| Parser | Analyze source syntax and construct an internal representation |
| Ignition | Execute bytecode and gather feedback |
| Sparkplug | Compile bytecode quickly into baseline machine code |
| Maglev | Produce optimized machine code with a relatively short compilation budget |
| TurboFan | Spend more optimization work on code expected to benefit |

Treat this as a model of the engine, not a promise that every function passes through every tier. The selected tiers and thresholds depend on the V8 version, configuration, platform, and workload. [V8's explanation of Maglev and tiering](https://v8.dev/blog/maglev).

Feedback can record the object shapes or value types observed at an operation. **Inline caches** help reuse information about operations such as property access. Optimized code may specialize for these observations, inline calls, and guard assumptions. When an assumption fails, **deoptimization** recovers a less specialized execution state. This preserves language behavior; it is not a JavaScript exception. See [V8's object shapes and property storage](https://v8.dev/blog/fast-properties).

Prefer clear data models and measure actual hot paths. A blanket rule such as “never use `try/catch` in a loop” is not a reliable performance strategy. Optimization can change after a runtime upgrade, and microbenchmarks can miss real allocation, I/O, and rendering costs.

## Calls and execution contexts

```js runnable
function inner(value) {
  console.log('inner');
  return value * 2;
}
function outer() {
  console.log('before');
  const result = inner(3);
  console.log('after', result);
}
outer();
```

```text output
before
inner
after 6
```

The current call waits for `inner` to return. Each call has parameters and local bindings. Lexical scope determines which outer bindings are accessible, while the call stack describes currently active calls. A [closure](./functions/function-closure.md) can retain access to a lexical environment after the creating call returns.

## Execution, concurrency, and memory

A long synchronous calculation blocks other JavaScript jobs on the same agent. Marking it `async` does not move that calculation to another thread. Browsers can use workers and Node can use worker threads for independent CPU work. The host may also perform I/O concurrently.

The [event-loop lesson](./asynchronous/asynchronous.md) explains tasks, promise reactions, and microtask checkpoints. A promise represents an eventual outcome; it is not itself a background thread. Browser scheduling and Node scheduling have host-specific details.

Garbage collection follows reachability rather than a rule such as “free everything when the function returns.” An event listener, cache, or closure may retain a large object graph. Clean up subscriptions and bound cache growth. Weak references do not offer a reliable cleanup timer.

## Node.js as a host

Node.js combines V8 execution with host APIs, native bindings, and facilities such as libuv for event-loop and I/O coordination. V8 executes JavaScript; it does not itself supply Node's file-system or server APIs. The operating system and, for selected operations, a worker pool perform work outside the JavaScript call stack. This does not turn an arbitrary JavaScript loop into background work. [Node's event-loop and worker-pool overview](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop).

| Facility | Typical purpose |
| --- | --- |
| `node:fs` / `node:fs/promises` | File-system operations with synchronous, callback, or promise APIs |
| `node:http` / `node:https` | HTTP servers and clients |
| `node:path` | Platform-aware path manipulation |
| `node:crypto` | Cryptographic primitives and random data |
| `node:stream` | Incremental processing with flow control |
| `node:events` | In-process event emitters |
| `node:child_process` | Start other processes |
| `node:worker_threads` | Run JavaScript in additional threads |
| `node:cluster` | Coordinate multiple Node processes, including shared server ports |

Check each API's contract. Synchronous file operations block the calling thread. Streams can control buffering through backpressure. Worker threads are useful for suitable CPU workloads; spawning a worker for every tiny operation can cost more than the work. Separate processes have separate memory spaces, while workers can exchange messages and explicitly shared memory. [Node API index](https://nodejs.org/api/), [worker threads](https://nodejs.org/api/worker_threads.html), [streams](https://nodejs.org/api/stream.html).

### Globals and module context

`globalThis` is the standard way to access the global object; Node also exposes the older `global` name. `process` provides process arguments, environment, lifecycle, and diagnostics. `Buffer` handles byte sequences and `console` provides logging. These host facilities are separate from ECMAScript's built-ins. [Node globals](https://nodejs.org/api/globals.html).

`__filename` and `__dirname` are CommonJS module variables, not universal globals. In ESM, `import.meta.url` identifies the module, and `new URL('./data.json', import.meta.url)` resolves a resource relative to it. This differs from resolving a path relative to `process.cwd()`. Keep credentials out of logs when inspecting environment variables or arguments.

```js runnable
// Node ES module; no files are read or written.
import { basename } from 'node:path';
import { Buffer } from 'node:buffer';

console.log(basename('catalog.json'));
console.log(Buffer.from('JS', 'utf8').toString('hex'));
console.log(typeof process.versions.node === 'string');
```

```text output
catalog.json
4a53
true
```

Continue with [CommonJS and ESM](./import-and-export.md#commonjs-in-nodejs), [Node event-loop phases](./asynchronous/asynchronous.md#nodejs-scheduling), and [EventEmitter](./event-handling.md#nodejs-eventemitter) for the host-specific behavior behind these APIs.

## V8 memory and garbage collection

V8 uses tracing and a generational heap. Marking follows references from roots to find live objects; sweeping makes unused space reusable, and compaction can move survivors to reduce fragmentation. Young and old generations let collections concentrate on different lifetime patterns. An unreachable cycle can be collected; a reachable cache with unwanted entries cannot be reclaimed just because the application no longer finds those entries useful.

Collection work can be incremental, parallel, or concurrent. These terms describe how work is divided relative to application execution; they do not promise pause-free collection. Exact heap regions and algorithms evolve. V8's [Orinoco explanation](https://v8.dev/blog/trash-talk) develops this model without making it an ECMAScript requirement.

Avoid equating primitives with stack storage and objects with one fixed heap representation. An optimizing engine can place values in registers, specialize representations, or eliminate allocations while preserving observable behavior. Use [reachability and retention diagnostics](./metaprogramming-and-memory.md#diagnose-retained-memory) to investigate an actual leak.

## Debug before optimizing

1. Reproduce the slow interaction or computation with representative inputs.
2. Record a browser performance profile or use the relevant Node diagnostic tool.
3. Identify whether time is spent in CPU work, network waits, layout, or allocation.
4. Change the responsible operation and remeasure the same workload.

## Interview questions {/* #interview-questions */}

**Level: Advanced.** [How to practise](./index.md#interview-preparation).

### 1. Can an optimizing compiler assume a function always receives the types from its first call?

<details>
<summary>Answer and worked example</summary>

An engine may optimize based on observations, but it must preserve JavaScript semantics for later valid inputs. Source code alone does not prove which optimization tier runs or whether a deoptimization occurs.

```js runnable
function combine(left, right) { return left + right; }
for (let i = 0; i < 10; i++) combine(i, 1);
console.log(combine(2, 3));
console.log(combine('2', 3));
```

**Expected output**

```text output
5
23
```

Previous numeric calls do not change how + treats a later string. An engine can guard assumptions or use a more general implementation; the program does not dictate that internal choice.

</details>

### 2. How would you investigate growing memory instead of assuming a garbage-collector bug?

**Apply it:** A dashboard’s heap grows after repeated navigation. Propose an investigation that can distinguish retained application data from temporary allocation.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

Repeat a setup/dispose lifecycle under comparable conditions, inspect heap snapshots and retaining paths, and find unwanted references from listeners, caches, timers, or application state. A temporary heap increase or an unreachable cycle alone is not proof of a leak.

1. Reproduce a fixed sequence: mount the dashboard, perform the same interaction, dispose it, and repeat. Keep the workload comparable.
2. Compare heap snapshots and object counts after equivalent lifecycle points. Look for objects whose retained count grows across cycles, not just a high peak during work.
3. Follow retaining paths to their owners: event listeners, subscriptions, timers, caches, detached nodes, or global state.
4. Remove or bound the unwanted reference and repeat the same experiment. Confirm both behavior and memory trend.

Avoid retaining the suspect objects in console variables while investigating. An unreachable cycle can be collected; a reachable listener chain can keep an entire graph alive. Garbage collectors may reserve memory or collect at different times, so a single process-memory number is not enough to prove a leak or its repair. Report the workload, runtime, measurement method, and remaining uncertainty.

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| 1 — Trace the call stack for the example and identify when `result` becomes available. | Practice | — | — |
| 2 — Explain why `async function work() { expensiveCalculation(); }` can still block the main thread. | Practice | — | — |
| 3 — Find one application-owned listener or cache and describe when its retained data becomes unreachable. | Practice | — | — |
| 4 — Classify `Array`, `Buffer`, `document`, and `node:fs` by language or host ownership. | Practice | — | — |
| 5 — Explain why a deoptimization or a single increase in heap usage is insufficient evidence of a bug. | Practice | — | — |

## Next steps

References: [MDN execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model), [Node worker threads](https://nodejs.org/api/worker_threads.html). Next: [event loop](./asynchronous/asynchronous.md).

## How does Garbage Collection work?

![How does Garbage Collection work? — reference illustration](https://assets.bytebytego.com/diagrams/0200-garbage-collection-101.png)

### Exercise

The p99 request latency rises while average CPU stays moderate. Correlate allocation rate, heap occupancy, pause time, and retained objects before changing collector settings. Distinguish a memory leak from normal collection work.
