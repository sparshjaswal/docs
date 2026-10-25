---
id: javascript-functions-function-memoization
slug: /javascript/functions/function-memoization
title: "Memoization with explicit cache rules"
sidebar_label: "Memoization"
sidebar_position: 8
---

# Memoization with explicit cache rules

Memoization means remembering a calculation's result so repeated requests for the same input can reuse it. Think of writing an already calculated answer in a notebook before doing the same long calculation again.

1. Run the function normally and identify what makes its result depend on its input.
2. Choose a key for the saved result and look it up before calculating.
3. Test repeated inputs, different inputs, and a failed calculation.
4. Limit how much the cache can keep, then measure whether it helps.

A **cache** is storage for reusable results. It costs memory and needs clear rules for keys and old results. Study functions, [Map](../collections-and-iteration.md), and [closures](./function-closure.md) first. Add caching when repeated computation is costly, not just because it is possible.

## A bounded single-argument cache

This implementation caches a pure synchronous function of one primitive argument. It uses `Map.has`, so a cached `undefined` is still a hit. When capacity is reached, it removes the oldest inserted key; this is FIFO eviction, not an LRU cache.

```js runnable
function memoizeUnary(fn, capacity = 100) {
  if (!Number.isInteger(capacity) || capacity < 1) {
    throw new RangeError('capacity must be a positive integer');
  }
  const cache = new Map();
  const negativeZero = Symbol('negative zero cache key');
  return value => {
    const key = Object.is(value, -0) ? negativeZero : value;
    if (cache.has(key)) return cache.get(key);
    const result = fn(value);
    if (cache.size === capacity) cache.delete(cache.keys().next().value);
    cache.set(key, result);
    return result;
  };
}
let calls = 0;
const square = memoizeUnary(value => { calls++; return value * value; }, 2);
console.log(square(4), square(4), calls);
square(5);
square(6);
console.log(square(4), calls);
const reciprocal = memoizeUnary(value => 1 / value);
console.log(reciprocal(0), reciprocal(-0));
```

```text output
16 16 1
16 4
Infinity -Infinity
```

The last square call recomputes 4 because its entry was evicted. A private key preserves the difference between `0` and `-0`: ordinary Map keys use SameValueZero and would otherwise conflate them, breaking the reciprocal example. [MDN key equality](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#key_equality). Exceptions are not cached: the function throws before insertion. A caller also needs a policy for invalidating results when external data changes.

## Choose keys and ownership deliberately

| Situation | Decision |
| --- | --- |
| Several arguments | Use an explicit key or nested maps; a newly allocated array is a different Map key each call |
| Object arguments | Identity-based keys do not notice mutations inside the object |
| Object results | Returning the cached object shares it with all callers; mutations affect later results |
| Network requests | Define expiry, rejection eviction, and cancellation ownership |
| Sensitive or large inputs | Limit retained data and clear the cache when its owner is disposed |

`JSON.stringify(args)` is not a universal key: it fails on cycles and BigInt, loses some values, and can merge inputs that your function considers different. A memoizer also cannot make an impure function pure. Caching `Date.now()` or a function that reads mutable global settings changes its behavior.

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](../index.md#interview-preparation).

### 1. Why is a truthiness check insufficient for a memoization cache?

<details>
<summary>Answer and worked example</summary>

Valid cached results can be zero, false, an empty string, or undefined. Check key presence rather than the truthiness of the stored value.

```js runnable
const cache = new Map();
let computations = 0;
function cachedLength(text) {
  if (cache.has(text)) return cache.get(text);
  computations++;
  const result = text.length;
  cache.set(text, result);
  return result;
}
console.log(cachedLength(''), cachedLength(''), computations);
```

**Expected output**

```text output
0 0 1
```

The empty string has length zero, but the second lookup is still a cache hit. This small example assumes string inputs and illustrates presence checking; it does not implement bounded retention.

</details>

### 2. When can memoization return an incorrect answer even with Map.has?

**Apply it:** Find why a cache keyed by object identity becomes stale after that object changes, even when Map.has is used correctly.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

When keys omit an input, mutable objects change under the same identity, external state changes, or equality merges inputs the function distinguishes. Specify invalidation, capacity, exception/rejection handling, and whether callers may mutate cached results.

This intentionally incomplete cache is useful for diagnosing the missing contract.

```js runnable
const totals = new Map();
function cachedTotal(cart) {
  if (!totals.has(cart)) totals.set(cart, cart.price * cart.quantity);
  return totals.get(cart);
}
const cart = { price: 10, quantity: 1 };
console.log(cachedTotal(cart));
cart.quantity = 2;
console.log(cachedTotal(cart), cart.price * cart.quantity);
totals.delete(cart);
console.log(cachedTotal(cart));
```

**Expected output**

```text output
10
10 20
20
```

The identity is unchanged while an input field has changed. `Map.has` fixes missing-versus-falsy detection; it cannot fix stale inputs. Choose immutable inputs, a versioned key, or explicit invalidation based on the application’s mutation model. Replacing Map with WeakMap can change retention, but does not correct the stale result.

</details>

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](../workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 22. Memoization and dynamic programming {/* #workbook-22 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** avoid calculating the same Fibonacci value repeatedly.

Assume a small nonnegative integer. Follow `fib(10)` by checking the stopping case, then the saved results, then the two smaller calls. Each computed result is stored before it is returned.

Review [cache keys and ownership](#choose-keys-and-ownership-deliberately). The related [dynamic-programming lesson](../../DSA/dp/README.md) explains states and how smaller answers combine. Start by making the answer correct; compare recursive caching with bottom-up computation only after you can state what each saved entry means.

**Worked example**

```js
function fib(n, memo = new Map()) {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const answer = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, answer);
  return answer;
}
console.log(fib(10));
```

**Expected output**

```text
55
```

The same memo is passed into both recursive branches. A cached state returns immediately. The default Map is created once per top-level call, so separate calls do not accidentally share a permanent cache.

**Trace the example step by step**

1. The top-level call creates a fresh Map. Base cases return 0 or 1 directly.

2. For a larger state, the function first checks whether its answer is already cached. A hit avoids expanding that subproblem again.

3. Both recursive branches receive the same Map. After their answers return, the current result is stored under n.

4. For n = 10, the saved recurrence produces 55. Each distinct non-base state is computed once, giving O(n) time under the stated map and numeric assumptions.

The iterative exercise uses the same recurrence. This table previews how its two saved values change after each completed iteration.

Completed iterations previous current

0 F(0) = 0 F(1) = 1

1 F(1) = 1 F(2) = 1

2 F(2) = 1 F(3) = 2

3 F(3) = 2 F(4) = 3

4 F(4) = 3 F(5) = 5

**Common mistakes and how to reason about them**

A new cache inside every recursive branch prevents reuse across branches. A permanent global cache can instead retain unwanted data or mix incompatible input assumptions. For very large Fibonacci indices, ordinary Number precision fails and recursive depth may also fail. The small-number contract keeps these separate from learning the recurrence.

</details>

Find **22A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-22-answer">
<summary>Check your reasoning and answer</summary>

**22A.** A fresh cache in every branch would prevent reuse across overlapping subproblems.

Sharing the memo lets one branch benefit from results computed by another. A fresh Map in each branch would remember only that branch's work, allowing the same states to be expanded repeatedly elsewhere.

**22B.** Define the state, its transition from other states, and its base cases.

Define the state's meaning, the transition that combines dependency results, and the base cases that need no smaller answer. Then choose an evaluation order and storage strategy. Starting with an array or a Map before defining the state often hides an unclear recurrence.

**22C.** Keep F(i) and F(i + 1) in two variables and advance them together.

Before iteration i, previous represents F(i) and current represents F(i + 1). The simultaneous update sets them to F(i + 1) and F(i + 2). After n iterations, previous is F(n). For n = 0, the loop runs zero times and correctly returns 0.

**Reference code**

```js
function fibIterative(n) {
  let previous = 0, current = 1;
  for (let i = 0; i < n; i++) {
    [previous, current] = [current, previous + current];
  }
  return previous;
}
```

**Check the result**

```js
assert.equal(fibIterative(0), 0);
assert.equal(fibIterative(1), 1);
assert.equal(fibIterative(10), 55);
```

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **22A — Why must recursive calls receive the same memo?** | **Must fix** | [Worked example](#workbook-22) | [Answer](#workbook-22-answer) |
| **22B — Which three things should you define before implementing a DP problem?** | **Must fix** | [Worked example](#workbook-22) | [Answer](#workbook-22-answer) |
| **22C — Write fibIterative(n) with O(n) time and O(1) auxiliary space for small nonnegative integers.** | **Must fix** | [Worked example](#workbook-22) | [Answer](#workbook-22-answer) |
| 1 — Cache a function that returns `undefined`; verify it executes once for repeated input. | Practice | — | — |
| 2 — With capacity 2, run inputs `1, 2, 1, 3, 1` and predict FIFO eviction. Explain how LRU would differ. | Practice | — | — |
| 3 — Add a `clear()` operation and test that the next call recomputes. | Practice | — | — |
| 4 — Design a two-argument key that distinguishes `(1, 23)` from `(12, 3)`. | Practice | — | — |

## Next steps

References: [Map behavior](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), [closures](./function-closure.md), and the [DSA LRU cache guide](../../DSA/lru-cache/README.md).
