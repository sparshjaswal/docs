---
title: "Metaprogramming, realms, and memory"
sidebar_label: "Metaprogramming and memory"
---

# Metaprogramming, realms, and memory

**Optional advanced lesson.** Metaprogramming changes how normal-looking language operations behave. For example, a Proxy can intercept a property read. Memory management is about which objects a running program can still reach and therefore may need to keep.

1. Use Reflect to study an ordinary object operation.
2. Add a Proxy and trace what its handler changes.
3. Draw the references that keep an object alive.
4. Investigate weak references only after understanding explicit ownership and cleanup.

Read objects, property descriptors, prototypes, symbols, classes, and closures first. An **invariant** is a rule an operation must not break. A **realm** is a JavaScript environment with its own built-in objects. These tools need careful reasoning because simple syntax can trigger extra behavior.

## Reflect and ordinary operations — ES2015

Reflect exposes operations corresponding to object internal methods. Its methods include `get`, `set`, `has`, `deleteProperty`, `defineProperty`, `getOwnPropertyDescriptor`, `ownKeys`, `getPrototypeOf`, `setPrototypeOf`, `isExtensible`, `preventExtensions`, `apply`, and `construct`.

`Reflect.get(target, key, receiver)` matters when accessors use `this`: the receiver becomes their `this`. `Reflect.set` similarly preserves receiver behavior for setters and inherited properties. Reflect methods have defined success/failure results; for example, defineProperty returns false for an ordinary rejected definition while Object.defineProperty throws. Invalid inputs can still throw.

```js runnable
const base = { get label() { return this.name.toUpperCase(); } };
const item = Object.assign(Object.create(base), { name: 'book' });
console.log(Reflect.get(base, 'label', item));
console.log(Reflect.set(Object.freeze({ value: 1 }), 'value', 2));
console.log(Reflect.ownKeys({ [Symbol('id')]: 7, name: 'book' }).length);
```

```text output
BOOK
false
2
```

## Proxy traps and invariants — ES2015

A Proxy wraps a target and a handler. Traps can intercept property reads/writes, ownership, enumeration, prototype operations, calls, and construction. Omitted traps forward to the target. Use Reflect to preserve the corresponding ordinary operation unless changing it is intentional.

```js runnable
const model = new Proxy({ quantity: 1 }, {
  set(target, key, value, receiver) {
    if (key === 'quantity' && (!Number.isSafeInteger(value) || value < 0)) {
      throw new RangeError('quantity must be a nonnegative safe integer');
    }
    return Reflect.set(target, key, value, receiver);
  },
});
model.quantity = 3;
console.log(model.quantity);
try { model.quantity = -1; }
catch (error) { console.log(error.name); }
```

```text output
3
RangeError
```

This guards assignments through the wrapper. It is not a security boundary: a retained target reference bypasses it, and other operations such as defineProperty need their own policy. A set trap returns a success boolean; a false result makes an assignment throw in strict mode.

Traps must obey invariants. A get trap cannot report a different value for a target's non-writable, non-configurable data property. ownKeys cannot hide non-configurable own keys, and has cannot pretend certain protected properties are absent. Violations throw TypeError; returning a convenient answer does not override the object model.

```js runnable
const target = Object.freeze({ answer: 42 });
const proxy = new Proxy(target, { get() { return 0; } });
try { console.log(proxy.answer); }
catch (error) { console.log(error.name); }
const { proxy: temporary, revoke } = Proxy.revocable({ value: 7 }, {});
console.log(temporary.value);
revoke();
try { console.log(temporary.value); }
catch (error) { console.log(error.name); }
```

```text output
TypeError
7
TypeError
```

Revocation disables the proxy's future operations; it does not erase data already read or remove other target references. [Proxy and Reflect specification](https://tc39.es/ecma262/2026/multipage/reflection.html).

## Internal slots, private brands, and realms

A Proxy is a distinct object. Native Map methods expect Map internal slots on their receiver; a simple Proxy around Map does not acquire those slots. Private class fields similarly require the receiver to carry the declaring class's private brand. Blindly binding every method to a target can change identity and receiver behavior, so wrappers need an explicit contract.

```js runnable
class Box {
  #value = 3;
  read() { return this.#value; }
}
const box = new Box();
console.log(box.read());
try { console.log(new Proxy(box, {}).read()); }
catch (error) { console.log(error.name); }
```

```text output
3
TypeError
```

Each realm has its own intrinsics such as Array.prototype and Error.prototype. `instanceof` follows constructor/prototype relationships (unless customized); it is not a universal brand test across realms. Use Array.isArray for arrays and [Error.isError](./error-handling.md#recognize-errors-across-realms--es2026) for errors in supporting runtimes.

`new.target` tells a constructor which constructor initiated construction. Reflect.construct can select a different newTarget, and `extends` can subclass supported built-ins. `Symbol.species` affects construction by some older copying APIs, but newer array-by-copy methods deliberately create ordinary arrays. Prefer composition when subclassing would require surprising return-type or mutation rules.

## Reachability and leaks

Garbage collection reclaims unreachable objects, not merely objects whose local variable went out of scope. Closures, event listeners, timers, module state, and unbounded Map caches can keep large graphs reachable. A cycle alone is not necessarily a leak; a path from a live root is the important question.

Use explicit lifecycle cleanup for subscriptions and timers, bounded caches for memoization, and heap snapshots for suspected retention. Allocation count alone does not measure retained memory. Do not make correctness depend on a collector running at a particular moment.

## Diagnose retained memory

Start with a repeatable lifecycle: mount and dispose a view, complete a request, or populate and clear a cache. Compare retained objects after several repetitions and equivalent idle/collection conditions; temporary allocation spikes alone are not evidence of a leak.

In a browser, take heap snapshots and inspect retaining paths. A detached DOM node can remain reachable through a listener closure or application collection. Find that retaining owner, then remove the subscription, clear the cache entry, or release the reference when its lifetime ends. [Chrome heap snapshot guide](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots).

In Node, `process.memoryUsage()` reports several measures: `heapUsed` and `heapTotal` concern V8's heap, `external` covers associated native allocations, and `rss` covers the process's resident memory. Buffer backing stores can contribute outside the ordinary JavaScript heap; the measurements are not interchangeable. Repeated samples suggest where to investigate, but a heap snapshot or allocation profile is needed to explain retention. [Node memory usage](https://nodejs.org/api/process.html#processmemoryusage).

For collector terminology and implementation limits, see [V8 memory and garbage collection](./javascript-engine-basic-unit.md#v8-memory-and-garbage-collection). Keep essential cleanup explicit even if a diagnostic tool can request collection.

## Weak collections and eligible symbols

WeakMap and WeakSet (2015) associate information with eligible keys without keeping those keys alive solely because they are entries. Keys were initially objects; ES2023 also permits non-registered symbols in weak collections and weak-reference facilities. Symbols from `Symbol.for` are not eligible.

```js runnable
const metadata = new WeakMap();
const owner = {};
metadata.set(owner, { visited: true });
console.log(metadata.get(owner).visited);
const token = Symbol('session');
metadata.set(token, 7);
console.log(metadata.get(token));
try { metadata.set(Symbol.for('shared'), 8); }
catch (error) { console.log(error.name); }
```

```text output
true
7
TypeError
```

There is no enumeration or size, because exposing collection-dependent membership that way would reveal garbage collection decisions. Use Map when you need to list entries. WeakMap values are not weak references simply because their keys are weak. ES2026 adds `getOrInsert` and `getOrInsertComputed` to WeakMap as well as Map; see [collection initialization](./collections-and-iteration.md#initialize-a-map-entry--es2026).

## WeakRef and FinalizationRegistry — ES2021

WeakRef.deref returns the target or undefined. If you need it for an operation, dereference once and keep the returned value strongly reachable while using it. A weak cache must recompute correctly after a miss; collection is not an eviction schedule.

```js runnable
const target = { label: 'temporary' };
const reference = new WeakRef(target);
const current = reference.deref();
console.log(current?.label);
```

```text output
temporary
```

This intentionally holds a strong reference; it makes no prediction about a later collection. FinalizationRegistry.register associates a target with a held value and optional unregister token; unregister removes matching registrations. The held value must not retain the target through its own object graph. Callbacks can be delayed indefinitely or never run before shutdown, so they cannot guarantee file closure, lock release, or required writes. Use them only for optional cleanup/diagnostics whose omission preserves correctness. [Weak references specification](https://tc39.es/ecma262/2026/multipage/managing-memory.html).

### Keep cleanup bookkeeping from retaining its target {/* #registry-retention */}

A registry holds its cleanup value strongly. Registering a small identifier is useful; registering an object that points back to the target can defeat collection. The callback also must not close over the target. Registration is bookkeeping, not a scheduled cleanup task.

```js runnable
const registry = new FinalizationRegistry(label => {
  // Optional diagnostics only; application correctness must not depend on this.
  void label;
});
const owner = { label: 'preview' };
const token = {};
registry.register(owner, 'preview', token);
console.log(registry.unregister(token));
console.log(registry.unregister(token));
```

```text output
true
false
```

This example tests deterministic unregistration and does not request garbage collection or wait for a callback. The first call removes the registration; the second finds none. Unregistering does not invoke cleanup or release a resource for you. A held value such as `{ owner }` would retain the target indirectly and make this design ineffective.

| Requirement | Appropriate mechanism |
| --- | --- |
| Stop a timer or remove a listener when a view closes | An explicit disposal operation called by the owner |
| Store metadata without independently retaining an object key | WeakMap |
| Reuse a value if it still exists, otherwise rebuild it | WeakRef with a correct cache-miss path |
| Optional observation after collection | FinalizationRegistry, with no deadline or delivery guarantee |

Do not use a finalizer to commit data, release a required lock, or guarantee file closure. The callback may run much later or never. Even dereferencing a weak reference successfully now does not promise availability after a later async boundary unless you retain the result. See [memory-management semantics](https://tc39.es/ecma262/multipage/managing-memory.html#sec-finalization-registry-objects) and the [explicit cleanup exercise](#workbook-32).

**Try it:** draw the references for `registry → held value → owner`. Remove the edge to the owner without losing the diagnostic label. Explain why waiting one second would not be a valid test of collection.

## Interview questions {/* #interview-questions */}

**Level: Advanced.** [How to practise](./index.md#interview-preparation).

### 1. Can a Proxy report any value it wants for a frozen property?

<details>
<summary>Answer and worked example</summary>

No. Proxy traps must respect invariants. In particular, a get trap cannot report a different value for a non-writable, non-configurable data property.

```js runnable
const target = Object.freeze({ answer: 42 });
const misleading = new Proxy(target, { get: () => 0 });
try { console.log(misleading.answer); }
catch (error) { console.log(error.name); }
const forwarding = new Proxy(target, {
  get(object, key, receiver) { return Reflect.get(object, key, receiver); },
});
console.log(forwarding.answer);
```

**Expected output**

```text output
TypeError
42
```

The first trap violates the frozen property’s invariant. Reflect.get applies the ordinary operation while preserving the receiver argument for accessor behavior.

</details>

### 2. Can FinalizationRegistry replace an explicit dispose operation?

**Apply it:** A panel registers a window listener that captures a large data object. Explain why removing the panel from the DOM may not release the data.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

No. Collection and finalizer timing are nondeterministic, and a callback may never run before shutdown. Release required resources explicitly. Weak references can support optional caches or diagnostics, but cannot guarantee timely file closure, listener cleanup, or saved data.

**Retaining path:** the long-lived window owns a listener; the listener’s closure can still reach the data. Removing a DOM node does not remove a listener registered on a different, long-lived target. A finalizer cannot serve as the primary repair, and the retained object may never even become eligible for collection.

Give the panel an explicit disposal operation that removes the same listener function with the matching capture setting, cancels its pending work, and releases application-owned references. An abort signal can help group supported event-listener cleanup, but the owner still has to trigger it.

Verify by repeating mount/dispose cycles and inspecting retaining paths under comparable conditions. Do not assert that a finalizer runs after a particular delay: garbage collection and finalization are nondeterministic. The testable contract is that disposal removes the resource registration and prevents later callbacks.

</details>

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](./workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 27. Symbols reflection and proxies {/* #workbook-27 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** compare ordinary property listing with reflective inspection.

The record has one string key and one symbol key. Predict what `Object.keys` lists, then what `Reflect.ownKeys` counts. Compare two fresh symbols with two requests to `Symbol.for` using the same name.

Review [symbols](./symbol.md) and [Reflect](#reflect-and-ordinary-operations--es2015). Symbol keys are discoverable; they are not secret storage. Before the Proxy exercise, read [traps and invariants](#proxy-traps-and-invariants--es2015): an intercepted operation still has rules it must preserve.

**Worked example**

```js
const tag = Symbol("tag");
const record = { name: "Mira", [tag]: 12 };
console.log(Object.keys(record).join(","));
console.log(Reflect.ownKeys(record).length);
console.log(Symbol("x") === Symbol("x"));
console.log(Symbol.for("x") === Symbol.for("x"));
```

**Expected output**

```text
name
2
false
true
```

**Why the example works**

The string-key enumeration sees name, while Reflect.ownKeys also sees the symbol. Descriptions do not determine symbol identity, but registry keys do. No hidden property needs to be guessed to inspect the object correctly.

</details>

Find **27A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-27-answer">
<summary>Check your reasoning and answer</summary>

**27A.** No. Reflect.ownKeys and Object.getOwnPropertySymbols expose symbol keys. Use private class fields or an appropriate closure when language-enforced encapsulation is required.

**27B.** Reflect.set applies the normal assignment semantics and reports success. It avoids a hand-written trap accidentally ignoring setters, receivers, or a failed write.

**27C.** Validate the constrained property, then forward the operation. Returning the Reflect result respects ordinary failure behavior. This example validates assignment through this wrapper; it is not a complete security boundary.

**Reference code**

```js
function checkedScore() {
  return new Proxy({ score: 0 }, {
    set(target, key, value, receiver) {
      if (key === "score" &&
          (!Number.isFinite(value) || value < 0 || value > 100)) {
        throw new RangeError("Invalid score");
      }
      return Reflect.set(target, key, value, receiver);
    }
  });
}
```

**Check the result**

```js
const score = checkedScore();
score.score = 80;
assert.equal(score.score, 80);
assert.throws(() => { score.score = NaN; });
assert.throws(() => { score.score = 101; });
```

</details>

### 32. Memory weak collections and resource cleanup {/* #workbook-32 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** release a resource on success and on failure.

Trace `useResource(false)` and record the events. Then trace `useResource(true)`: follow the thrown error through `finally` before the outer catch records it. Compare both paths to confirm that closing is explicit.

Review [reachability and leaks](#reachability-and-leaks) and [weak references](#weakref-and-finalizationregistry--es2021). Garbage collection is about reclaiming unreachable objects; it cannot provide a reliable schedule for essential cleanup. Use explicit close, unsubscribe, cancel, or `try`/`finally` rules for the resource your program owns.

**Worked example**

```js
const events = [];
function useResource(fail) {
  events.push("open");
  try {
    if (fail) throw new Error("work failed");
    return 7;
  } finally {
    events.push("close");
  }
}
console.log(useResource(false));
try { useResource(true); } catch { events.push("caught"); }
console.log(events.join(","));
```

**Expected output**

```text
7
open,close,open,close,caught
```

**Why the example works**

Cleanup happens before the successful call returns 7. It also happens while the failing call unwinds, before the caller catches the error. The finally block contains no return, so it preserves both the normal result and the original failure.

</details>

Find **32A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-32-answer">
<summary>Check your reasoning and answer</summary>

**32A.** The returned function can still access its lexical environment. If that environment retains the array and the closure remains reachable, the array may remain reachable as well.

**32B.** The callback may run much later or not before the process exits. Resource correctness needs an explicit lifetime, independent of whether and when garbage collection occurs.

**32C.** The closure stores the active state. Marking it inactive before calling off prevents repeated calls from retrying a partially completed unsubscribe operation; the contract here is at most one off call.

**Reference code**

```js
function makeSubscription(on, off, handler) {
  on(handler);
  let active = true;
  return () => {
    if (!active) return;
    active = false;
    off(handler);
  };
}
```

**Check the result**

```js
const events = [];
const fn = () => {};
const dispose = makeSubscription(
  h => events.push(["on", h]), h => events.push(["off", h]), fn);
dispose();
dispose();
assert.deepEqual(events, [["on", fn], ["off", fn]]);
```

</details>

<span id="practice" />

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **27A — Is a symbol property private?** | **Must fix** | [Worked example](#workbook-27) | [Answer](#workbook-27-answer) |
| **27B — Why forward a proxy set trap through Reflect.set?** | **Must fix** | [Worked example](#workbook-27) | [Answer](#workbook-27-answer) |
| **27C — Create checkedScore() returning a proxy that accepts only finite scores from 0 to 100 when assigning its score property.** | **Must fix** | [Worked example](#workbook-27) | [Answer](#workbook-27-answer) |
| **32A — Why can a closure retain a large array after its creator returns?** | **Must fix** | [Worked example](#workbook-32) | [Answer](#workbook-32-answer) |
| **32B — Why is FinalizationRegistry unsuitable for required cleanup?** | **Must fix** | [Worked example](#workbook-32) | [Answer](#workbook-32-answer) |
| **32C — Write makeSubscription(on, off, handler). Call on(handler) once and return a disposer that calls off(handler) at most once.** | **Must fix** | [Worked example](#workbook-32) | [Answer](#workbook-32-answer) |
| Add a getter to the Proxy model and demonstrate why forwarding the receiver matters. | Practice | — | — |
| Test get/set/defineProperty/deleteProperty against your validation policy; document the wrapper's limits. | Practice | — | — |
| Compare Map and WeakMap for an enumerable cache versus metadata tied to an object. | Practice | — | — |
| Explain how a listener closure can retain a detached DOM subtree and identify explicit teardown. | Practice | — | — |
| Design a cache that still behaves correctly if every weak lookup misses. | Practice | — | — |

## Continue learning

Continue with [binary memory](./binary-data-and-shared-memory.md), [language semantics](./language-semantics.md), and [the learning path](./index.md).
