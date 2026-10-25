---
id: javascript-modern-js-patterns
slug: /javascript/modern-js-patterns
title: "Practical JavaScript patterns"
sidebar_label: "Practical patterns"
---

# Practical JavaScript patterns

A programming pattern is a reusable way to arrange code for a recurring problem. Start with the problem: calculate a total without changing its input, connect several small transformations, or notify listeners when a value changes.

1. Separate a calculation from an outside action such as writing to the page.
2. Connect small functions and trace the value between them.
3. Add subscriptions or asynchronous behavior only when the feature needs them.

Read [functions](./functions/README.md), [objects](./objects-and-classes.md), and [async programming](./asynchronous/README.md) first. A **side effect** is an observable action outside a returned value, such as changing shared data or sending a request. Naming the pattern matters less than explaining the problem it solves and the extra complexity it adds.

## Pure transformations and explicit effects

Keep data transformation independent of logging, network requests, and DOM updates. Use `map` when returning one result per input and `filter` when selecting inputs.

```js runnable
const tasks = [
  { id: 1, title: 'Read', done: false },
  { id: 2, title: 'Test', done: true },
];
function rename(items, id, title) {
  return items.map(item => item.id === id ? { ...item, title } : item);
}
const next = rename(tasks, 1, 'Read modules');
console.log(next[0].title, tasks[0].title);
console.log(next[1] === tasks[1]);
```

```text output
Read modules Read
true
```

This intentionally shares unchanged records. Immutability is a discipline about allowed writes, not a claim that all nested data was cloned.

## Small pipelines

```js runnable
const trim = text => text.trim();
const lower = text => text.toLowerCase();
const pipe = (...steps) => value => steps.reduce((current, step) => step(current), value);
console.log(pipe(trim, lower)('  MODULES  '));
```

```text output
modules
```

These steps are synchronous and unary. They do not await promises. Do not silently apply this helper to async operations: use an async contract, sequential awaits, or the appropriate promise combinator. The language does not currently need a proposed pipeline operator for this example.

## Subscriptions with ownership

```js runnable
function createChannel() {
  const listeners = new Set();
  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    publish(value) {
      for (const listener of [...listeners]) listener(value);
    },
  };
}
const channel = createChannel();
const stop = channel.subscribe(value => console.log(`received ${value}`));
channel.publish(1);
stop();
channel.publish(2);
```

```text output
received 1
```

This contract invokes listeners synchronously in a snapshot of registration order. Registering the same function twice still stores one entry. A listener exception stops that publication; an async listener's returned promise is not awaited. If your use case needs failure isolation or async listeners, design and test that contract explicitly.

## Patterns for async interfaces

| Problem | Pattern | Required decision |
| --- | --- | --- |
| Fast-changing search input | Debounce and abort/ignore stale work | Who owns timers, requests, and disposal? |
| Too many independent requests | Bounded concurrency | What happens after one request fails? |
| Repeated expensive computation | Memoization | Key equality, capacity, expiry, and invalidation |
| Optional application feature | Dynamic import | Loading, error, and retry states |
| Shared domain behavior | Composition | State ownership and public interfaces |

Debouncing delays invocation until calls settle; throttling limits invocation frequency. Neither cancels an already-running request automatically. Follow the worked [once and debounce utilities](./functions/function-utilities.md), [browser state and freshness checks](./browser-state-and-network.md), [cancellation](./asynchronous/async-await.md), [memoization](./functions/function-memoization.md), [module](./import-and-export.md), and [composition](./object-composition.md) lessons.

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](./index.md#interview-preparation).

### 1. How does an immutable update preserve unchanged object identities?

<details>
<summary>Answer and worked example</summary>

Allocate the changed record and its containing array while reusing records that did not change. State whether a missing ID is a no-op and whether IDs are unique.

```js runnable
function rename(records, id, name) {
  return records.map(record => record.id === id ? { ...record, name } : record);
}
const before = [{ id: 1, name: 'Ada' }, { id: 2, name: 'Linus' }];
const after = rename(before, 1, 'Grace');
console.log(before[0].name, after[0].name);
console.log(after === before, after[0] === before[0], after[1] === before[1]);
```

**Expected output**

```text output
Ada Grace
false false true
```

The array and changed record are new, but the second record is shared. This is a shallow update; a nested field needs copying at every changed level. The helper updates all matches and always returns a new array.

</details>

### 2. When does adding a design pattern make code harder to maintain?

**Apply it:** A two-line price calculation is wrapped in a factory, strategy registry, and event bus. Decide which abstractions have an actual requirement.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

When the abstraction hides a simple operation or creates more lifecycle rules than the problem needs. Start with explicit data and dependencies, then introduce a pattern for a recurring requirement such as subscriptions, interchangeable adapters, or caching with a defined policy.

**Review answer:** begin with the calculation’s inputs, output, and variation points. If there is one pricing rule and one caller, a pure function may express the full requirement. If deployments genuinely choose among pricing rules, an injected function can provide that variation without also adding an event bus.

An event bus introduces subscription lifetime, dispatch timing, error routing, and ordering questions. Add it when multiple independently owned subscribers need those semantics, and document them. A factory is useful when construction needs configuration or independent state; merely wrapping a stateless function does not establish that need.

Ask which concrete change the abstraction makes easier and which invariants it now requires. Preserve behavior with tests while simplifying. A named pattern is useful vocabulary for a design, but its name is not evidence that the design fits the problem.

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| 1 — Extend `rename` so that an unknown ID leaves the original array unchanged; test that policy explicitly. | Practice | — | — |
| 2 — Write an async pipeline that stops after rejection, and compare it with `Promise.all` over independent tasks. | Practice | — | — |
| 3 — Define what your channel should do when a listener subscribes or unsubscribes during publication. | Practice | — | — |
| 4 — Add a `clear()` lifecycle operation without exposing the channel's internal Set. | Practice | — | — |

## Next steps

For standard-library patterns, continue with [grouping](./collections-and-iteration.md#group-records--es2024), [iterator pipelines](./collections-and-iteration.md#lazy-iterator-helpers--es2025), and [map initialization](./collections-and-iteration.md#initialize-a-map-entry--es2026).
