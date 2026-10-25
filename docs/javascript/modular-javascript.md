---
id: javascript-modular-javascript
slug: /javascript/modular-javascript
title: "Organizing a JavaScript application"
sidebar_label: "Application structure"
---

# Organizing a JavaScript application

Once a program grows, putting everything in one file makes changes hard to follow. Organizing an application means deciding which piece owns each job and which pieces may call each other.

1. Keep a small calculation separate from page or network operations.
2. Give each module one clear responsibility and a small public interface.
3. Draw arrows showing which module depends on which other module.
4. Pass outside operations into code you want to test, so a test can supply a controlled replacement.

Read [import and export](./import-and-export.md) for file syntax first. A **dependency** is something a piece of code needs from elsewhere. Good boundaries help a change stay understandable without forcing you to reread the whole application.

## Start with a dependency direction

```text
browser entry
  ├── view: DOM and events
  ├── service: async orchestration
  │     └── adapter: fetch or storage
  └── model: pure data rules
```

The model has no dependency on the browser entry. The view renders values and reports user actions. The service coordinates effects and passes valid data to the model. Small applications can keep these roles in fewer files; the distinction matters more than a directory count.

## Inject the effect you need to test

```js runnable
function createCatalog(loadItems) {
  return {
    async search(query) {
      const items = await loadItems();
      const normalized = query.trim().toLowerCase();
      return items.filter(item => item.title.toLowerCase().includes(normalized));
    },
  };
}
const catalog = createCatalog(async () => [
  { id: 1, title: 'Modules' },
  { id: 2, title: 'Promises' },
]);
console.log((await catalog.search(' mod ')).map(item => item.id).join(', '));
```

```text output
1
```

The example assumes validated records with string titles. A real network adapter must check response status and validate that shape before returning it. The service does not silently swallow errors; its caller owns the visible error state. See [async failures](./asynchronous/async-await.md) and [tests with injected dependencies](./testing-guide.md).

## Keep module initialization predictable

Importing a utility should not unexpectedly start a server, attach page listeners, or launch a polling loop. Export an explicit setup operation and return cleanup when it acquires resources. The application entry decides when to call it.

```js runnable
function createSubscription(source, onValue) {
  return source.subscribe(onValue);
}
const handlers = new Set();
const source = {
  subscribe(handler) {
    handlers.add(handler);
    return () => handlers.delete(handler);
  },
  emit(value) { for (const handler of [...handlers]) handler(value); },
};
const dispose = createSubscription(source, value => console.log(value));
source.emit('connected');
dispose();
source.emit('ignored');
console.log(handlers.size);
```

```text output
connected
0
```

A DOM adapter might use an AbortController to clean up listeners. A storage adapter might need an async close method. Name that lifecycle in the public contract.

## Avoid dependency surprises

- Import directly from the module that owns a capability when a large re-export index hides cycles or adds unrelated side effects.
- Keep configuration explicit; reading mutable global settings inside many modules makes tests order-dependent.
- Use dynamic import for a feature that actually benefits from deferred loading. A new file alone does not guarantee a smaller deployed bundle.
- Treat third-party dependencies as part of the build and maintenance cost. Inspect their supported environments and lockfile changes.
- Use ESM and CommonJS deliberately. File extensions, package `type`, and package exports affect Node resolution.

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](./index.md#interview-preparation).

### 1. How can you test a module that normally loads network data without making a request?

<details>
<summary>Answer and worked example</summary>

Inject the loading operation at the module boundary. The model or service can then be exercised with deterministic data and failures while the real adapter owns HTTP and schema checks.

```js runnable
function createService(load) {
  return { async count() { return (await load()).length; } };
}
const good = createService(async () => ['a', 'b']);
const failed = createService(async () => { throw new Error('offline'); });
console.log(await good.count());
try { await failed.count(); }
catch (error) { console.log(error.message); }
```

**Expected output**

```text output
2
offline
```

The same service logic handles a controlled success and failure. No global fetch replacement or public endpoint is involved. This example assumes the adapter returns a validated array.

</details>

### 2. Why avoid starting timers or registering listeners at module import time?

**Apply it:** Design setup and cleanup so two mounted consumers can subscribe independently and repeated cleanup is harmless.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

Those effects make lifetime and test isolation implicit. Export a setup operation that returns cleanup, and let the application entry own when it runs. Import caching is not a substitute for managing mounts, shutdown, or multiple independent application instances.

Use a small in-memory subscription boundary to test ownership without browser APIs or real timers.

```js runnable
const listeners = new Set();
function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
function mount(label, subscribeToUpdates) {
  const unsubscribe = subscribeToUpdates(value => console.log(label, value));
  return () => { unsubscribe(); };
}
const stopA = mount('A', subscribe);
const stopB = mount('B', subscribe);
for (const listener of listeners) listener(1);
stopA();
stopA();
for (const listener of listeners) listener(2);
stopB();
console.log(listeners.size);
```

**Expected output**

```text output
A 1
B 1
B 2
0
```

Each mount creates and owns one listener. Cleaning up A leaves B active; cleaning up twice does not remove someone else’s subscription. The module can export these functions without subscribing at import time. Apply the same ownership rule to DOM listeners, timers, sockets, and request cancellation, with the cleanup operations those dependencies require.

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| 1 — Split the catalog example into a model, an adapter, and an entry module. Keep its behavior unchanged. | Practice | — | — |
| 2 — Test a failed load without issuing a network request. | Practice | — | — |
| 3 — Add a setup/dispose pair for a browser event listener and verify that disposal prevents later updates. | Practice | — | — |
| 4 — Draw the imports in a small application and remove one unnecessary cycle. | Practice | — | — |

## Next steps

References: [Node modules](https://nodejs.org/api/esm.html), [MDN modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). Apply these boundaries in the [projects](./projects.md).
