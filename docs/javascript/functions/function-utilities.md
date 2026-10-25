---
title: 'Function utilities: binding, once, and debounce'
sidebar_label: 'Binding and function utilities'
---

# Function utilities: binding, once, and debounce

**After functions and closures.** A function utility wraps another function to change how it is called. It can fix a receiver, allow one successful call, or wait until typing has paused before starting a search.

1. Trace the arguments and `this` passed to the original function.
2. Study `once` and decide whether a failed attempt should be retried.
3. Study **debounce**: delay a call until repeated activity settles.
4. Add cancellation so an abandoned page or feature does not leave work waiting.

Read [ordinary and arrow functions](./function-lambda.md), [closures](./function-closure.md), and [receivers](../objects-and-classes.md) first. The receiver is the object used as `this` for an ordinary method call. Debounce and throttle solve different timing problems; compare them only after tracing one delayed call.

## Arguments and receivers are separate inputs

An ordinary function gets its receiver from the call. `call` supplies arguments individually, `apply` takes an array-like argument list, and `bind` creates a function with a saved receiver and optional leading arguments. An arrow captures `this` from its surrounding scope; rebinding it does not replace that captured value.

```js runnable
const invoice = {
  subtotal: 20,
  total(tax, delivery) {
    return this.subtotal + tax + delivery;
  },
};
const calculate = invoice.total;
console.log(calculate.call(invoice, 2, 3));
console.log(calculate.apply(invoice, [2, 3]));
const withTax = calculate.bind(invoice, 2);
console.log(withTax(3));
```

```text output
25
25
25
```

Extracting `invoice.total` does not preserve its receiver. Binding saves the receiver and `tax`; `delivery` is still supplied at the later call. See the [ECMAScript function operations](https://tc39.es/ecma262/2026/multipage/fundamental-objects.html#sec-function.prototype.call).

## Run once after the first successful call

Define “once” before implementing it. Here the function is synchronous: cache its first successful return value, including `undefined`; if it throws, let a later call retry. Later arguments and receivers are ignored after success. A recursive attempt to call the same wrapper while it is running is rejected.

```js runnable
import assert from 'node:assert/strict';

function once(fn) {
  let state = 'ready';
  let result;
  return function (...args) {
    if (state === 'done') return result;
    if (state === 'running') throw new Error('Reentrant once call');
    state = 'running';
    try {
      result = fn.apply(this, args);
      state = 'done';
      return result;
    } catch (error) {
      state = 'ready';
      throw error;
    }
  };
}

let attempts = 0;
const service = {
  prefix: 'item',
  create: once(function (id) {
    attempts += 1;
    if (attempts === 1) throw new Error('Try again');
    return `${this.prefix}:${id}`;
  }),
};
assert.throws(() => service.create(7), /Try again/);
assert.equal(service.create(7), 'item:7');
assert.equal(service.create(99), 'item:7');
assert.equal(attempts, 2);

let notifications = 0;
const notify = once(() => {
  notifications += 1;
});
notify();
notify();
assert.equal(notifications, 1);
console.log('retry, receiver, cached result, and undefined checked');
```

```text output
retry, receiver, cached result, and undefined checked
```

The state records success independently of the cached value. Testing `if (result)` would repeat work when a successful result was `0`, `false`, or `undefined`. This wrapper does **not** retry a rejected promise: returning that promise is a successful synchronous return. An async variant needs a separate pending/fulfilled/rejected contract.

## Debounce with cancellation and flushing

A trailing debounce runs after a quiet period. Every call replaces the pending arguments and receiver. The wrapper returns `undefined`; it cannot synchronously return a result that will be computed later. `cancel()` drops pending work, and `flush()` immediately runs it and returns its result.

```js runnable
import assert from 'node:assert/strict';

function debounce(fn, delayMs) {
  if (!Number.isInteger(delayMs) || delayMs < 0 || delayMs > 2_147_483_647) {
    throw new RangeError('Invalid timer delay');
  }
  let timer;
  let pending;
  function invoke() {
    const call = pending;
    pending = undefined;
    timer = undefined;
    if (call) return fn.apply(call.receiver, call.args);
  }
  function wrapped(...args) {
    clearTimeout(timer);
    pending = { receiver: this, args };
    timer = setTimeout(invoke, delayMs);
  }
  wrapped.cancel = () => {
    clearTimeout(timer);
    timer = undefined;
    pending = undefined;
  };
  wrapped.flush = () => {
    clearTimeout(timer);
    return invoke();
  };
  return wrapped;
}

const messages = [];
const view = {
  prefix: 'search',
  update: debounce(function (text) {
    const message = `${this.prefix}:${text}`;
    messages.push(message);
    return message;
  }, 1000),
};
view.update('j');
view.update('js');
assert.equal(view.update.flush(), 'search:js');
view.update('discard');
view.update.cancel();
assert.equal(view.update.flush(), undefined);
assert.deepEqual(messages, ['search:js']);
console.log(messages.join(', '));
```

```text output
search:js
```

This check uses `flush` and `cancel` rather than waiting for a wall-clock deadline. A timer makes a callback eligible to run after a delay; a busy runtime can run it later. On an actual timer invocation, thrown errors need the owner's error policy. This teaching helper does not manage promises returned by `fn`.

Clearing `pending` **before** calling `fn` releases old argument references and allows `fn` to schedule another invocation safely. The view that owns the wrapper should call `cancel()` during teardown. This does not stop an operation that already began; pair it with [request cancellation and freshness checks](../browser-state-and-network.md).

## Debounce versus throttle

For calls at 0, 40, and 80 milliseconds with a 100-millisecond interval:

| Policy                        | Intended behavior                                                         |
| ----------------------------- | ------------------------------------------------------------------------- |
| Trailing debounce             | One invocation after the last call's quiet period, eligible around 180 ms |
| Leading throttle              | Run at the first call; suppress later calls during its interval           |
| Leading and trailing throttle | Also retain a final update according to a documented trailing-call rule   |

Choose debounce for a settled search phrase and throttle for periodic progress during continuous activity. Specify whether the first call, last call, or both run; whether suppressed arguments are retained; and what disposal does. Neither pattern makes CPU work parallel or guarantees exact timer timing.

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](../index.md#interview-preparation).

### 1. Why can removing a bound listener fail?

<details>
<summary>Answer and worked example</summary>

Every bind call creates a new function object. Registration and removal must use the same callback reference; binding the same original function twice does not satisfy that requirement.

```js runnable
const receiver = { id: 1 };
function read() { return this.id; }
const saved = read.bind(receiver);
const listeners = new Set([saved]);
console.log(listeners.delete(read.bind(receiver)), listeners.size);
console.log(listeners.delete(saved), listeners.size);
```

**Expected output**

```text output
false 1
true 0
```

The Set models callback identity, not full DOM event dispatch. A real DOM removeEventListener call must also match event type and capture setting.

</details>

### 2. How do debounce and throttle differ, and what must their contracts specify?

**Apply it:** Choose scheduling behavior for a search field and a scroll-position indicator, then specify what should happen when their component is removed.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

A trailing debounce waits for a quiet interval; a throttle limits how often work runs during sustained calls. Specify leading/trailing behavior, the latest arguments and receiver, cancellation, flushing, and disposal. Neither moves heavy work to another thread.

**Search field:** a trailing debounce can wait for typing to pause and send the most recent query. It reduces starts but does not prevent an already started, older response from arriving late; request ownership or cancellation is still a separate concern.

**Scroll indicator:** a throttle can provide intermediate updates during sustained input. State whether a final trailing update is required; a leading-only throttle can leave the displayed position behind the final event. For paint-related work, consider scheduling one update per animation frame rather than assuming a fixed interval matches the display.

**Lifecycle contract:** cancel pending callbacks on disposal, release captured references, and define whether an explicit flush runs the latest call immediately. Test latest arguments, receiver preservation, cancellation, and reentrant calls with controlled timers. A timing utility controls when work starts; it does not reduce the CPU cost of each invocation. Use the complete implementations earlier in this lesson rather than dropping cleanup behavior from an interview shorthand.

</details>

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](../workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 25. Function design binding and reusable behavior {/* #workbook-25 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** keep arguments and the method receiver separate.

`bind` creates `invoice` with `cart` as its receiver and 2 as a saved first argument. Trace the later call to `invoice()` using those saved inputs. Next, trace `add(5)` as a function that returns another function, which receives 3.

Review [arguments and receivers](#arguments-and-receivers-are-separate-inputs). For the timing exercises, use the [debounce implementation](#debounce-with-cancellation-and-flushing), including cancellation and flushing. A scheduled call's eventual result is different from the timer identifier returned when it is scheduled.

**Worked example**

```js
const cart = {
  base: 10,
  total(tax) { return this.base + tax; }
};
const invoice = cart.total.bind(cart, 2);
const add = a => b => a + b;
console.log(invoice());
console.log(add(5)(3));
```

**Expected output**

```text
12
8
```

**Why the example works**

bind saves both the receiver and the leading tax argument, so invoice needs no arguments. The outer add call closes over 5 and returns a new function; the inner call supplies 3. No global variable is needed to remember the first value.

</details>

Find **25A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-25-answer">
<summary>Check your reasoning and answer</summary>

**25A.** An arrow has lexical this rather than its own dynamic this binding. call, apply, and bind cannot replace that captured receiver, although bind can still prefill arguments.

**25B.** Use debounce when intermediate events have no lasting value and the latest settled value is what matters. Throttle is appropriate when sustained activity still requires periodic updates.

**25C.** Set the completion flag after fn returns successfully. Setting it before the call would accidentally treat a thrown attempt as completed. Cache even undefined results, so a separate boolean is necessary.

**Reference code**

```js
function once(fn) {
  let done = false;
  let result;
  return function (...args) {
    if (!done) {
      result = fn.apply(this, args);
      done = true;
    }
    return result;
  };
}
```

**Check the result**

```js
let calls = 0;
const first = once(x => { calls++; return x * 2; });
assert.equal(first(3), 6);
assert.equal(first(9), 6);
assert.equal(calls, 1);
let attempts = 0;
const retry = once(() => {
  if (++attempts === 1) throw new Error("try again");
  return 4;
});
assert.throws(() => retry());
assert.equal(retry(), 4);
```

</details>

<span id="practice" />

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **25A — Why does binding an arrow not replace its this?** | **Must fix** | [Worked example](#workbook-25) | [Answer](#workbook-25-answer) |
| **25B — When is debounce preferable to throttle?** | **Must fix** | [Worked example](#workbook-25) | [Answer](#workbook-25-answer) |
| **25C — Implement once(fn) for synchronous functions. Cache the first successful result; if fn throws, permit a later retry.** | **Must fix** | [Worked example](#workbook-25) | [Answer](#workbook-25-answer) |
| Verify that a failed `once` invocation does not retain its receiver or arguments for the retry. | Practice | — | — |
| Add a test where a debounced callback schedules another call; flushing the first must not erase the second. | Practice | — | — |
| Design an async-once contract: should concurrent callers share one promise, and should rejection clear the cache? | Practice | — | — |

## Continue learning

Continue with [memoization](./function-memoization.md), [application patterns](../modern-js-patterns.md), and [testing](../testing-guide.md).
