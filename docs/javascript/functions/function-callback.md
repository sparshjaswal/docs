---
id: javascript-functions-function-callback
slug: /javascript/functions/function-callback
title: "Callbacks and timing"
sidebar_label: "Callbacks and timing"
sidebar_position: 4
---

# Callbacks and timing

A callback is a function you give to another operation so that operation can call it. For example, you can give `map` a function that changes each score into a label.

1. Write the callback separately and call it yourself.
2. Pass the function to another operation without calling it at that moment.
3. Trace when that operation calls it and which arguments it supplies.
4. Compare an array callback that runs during the current operation with a timer callback that runs later.

A callback is not automatically asynchronous. The receiving API decides when it runs, what values it receives, and what its return value means. Learn [ordinary functions](./function-types.md) first.

## Synchronous callbacks

Array methods such as `map` invoke their callbacks before returning. Here, every transformed value is available immediately.

```js runnable
const values = [2, 4].map(value => value * 3);
console.log(values.join(', '));
```

```text output
6, 12
```

## Deferred callbacks

Returning from a timer callback does not return from the function that scheduled it. Deliver a deferred value through the callback, or expose a promise.

```js runnable
function readLater(callback) {
  setTimeout(() => callback(null, 10), 0);
}
console.log('scheduled');
readLater((error, value) => {
  if (error) {
    console.error(error.message);
    return;
  }
  console.log(value * 2);
});
console.log('continuing');
```

```text output
scheduled
continuing
20
```

This example uses Node's common error-first convention: `(error, result)`. Browser event listeners use a different contract and receive an event object. A zero timer delay makes a callback eligible later; it does not interrupt current synchronous execution.

A `try/catch` around the scheduling call does not catch an exception thrown later inside the timer callback. Handle the error inside that callback or convert the API to a promise that rejects. For compatible Node APIs, [`util.promisify`](https://nodejs.org/api/util.html#utilpromisifyoriginal) performs the conversion.

## Common mistakes

- `items.map(parseInt)` passes an index as the second argument, which `parseInt` treats as the radix. Use `items.map(text => Number.parseInt(text, 10))`.
- `forEach(async item => ...)` does not wait for callback promises. Use a `for...of` loop or `Promise.all(items.map(...))` according to the intended concurrency.
- Passing `object.method` can lose the receiver. Use a wrapper or `bind` if the method needs `this`.
- A callback API should document whether it can invoke the callback more than once. Event subscriptions and one-shot requests have different lifecycles.

## Interview questions {/* #interview-questions */}

**Level: Beginner.** [How to practise](../index.md#interview-preparation).

### 1. Is a callback always asynchronous?

<details>
<summary>Answer and worked example</summary>

No. A callback is a function supplied to other code. The receiving API determines whether it runs immediately, later, once, or repeatedly.

```js runnable
const order = ['before'];
const doubled = [1, 2].map(value => {
  order.push(`map ${value}`);
  return value * 2;
});
order.push('after');
console.log(order.join(', '));
console.log(doubled.join(', '));
```

**Expected output**

```text output
before, map 1, map 2, after
2, 4
```

Array.map invokes its callbacks synchronously while constructing the result. No task or promise is involved in this example.

</details>

### 2. Why is mapping parseInt directly over strings a common bug?

**Apply it:** Trace every argument passed by map before choosing a conversion callback.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

map supplies value, index, and array. parseInt treats its second argument as a radix, so the index changes conversion. Use `text => parseInt(text, 10)` under a suitable input contract, or validate and convert with Number when complete numeric syntax is required.

The bug comes from incompatible function signatures, not from asynchronous execution.

```js runnable
const input = ['10', '10', '10'];
console.log(input.map(parseInt).map(String).join(','));
console.log(input.map(text => parseInt(text, 10)).join(','));
console.log(input.map(Number).join(','));
```

**Expected output**

```text output
10,NaN,2
10,10,10
10,10,10
```

`map` calls `parseInt("10", 0)`, `parseInt("10", 1)`, and `parseInt("10", 2)`: inferred decimal, invalid radix, then binary. The wrapper fixes the radix. `Number` ignores the extra callback arguments, but follows a different conversion grammar. Neither choice removes the need to validate user input; for example, `parseInt("10px", 10)` accepts a prefix.

</details>

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](../workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 12. Callbacks and array transformations {/* #workbook-12 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** choose a callback by the result you need.

Use the same four input numbers for three different jobs. `map` produces a new value for every input, `filter` keeps values that pass a check, and `reduce` carries a running result through the list. Predict each output before running all three.

See [synchronous callbacks](#synchronous-callbacks) and [array method choice](../arrays/array-methods.md#choose-by-result). Read the arguments an API supplies to its callback; a callback may receive an index as well as a value. Pass the function to the operation instead of accidentally calling it too early.

**Worked example**

```js
const values = [1, 2, 3, 4];
const doubled = values.map((n) => n * 2);
const evens = values.filter((n) => n % 2 === 0);
const total = values.reduce((sum, n) => sum + n, 0);
console.log(doubled.join(","));
console.log(evens.join(","));
console.log(total);
```

**Expected output**

```text
2,4,6,8
2,4
10
```

map creates four output elements, filter keeps two, and reduce returns one number. All callbacks here avoid changing the input. The initial accumulator 0 also makes the same reduce expression valid for an empty array.

**Trace the example step by step**

1. map visits each number and returns twice that number. Its result is a separate array with four elements.

2. filter evaluates the remainder test and keeps only 2 and 4 from the original input.

3. reduce starts with 0 and adds 1, then 2, then 3, then 4, ending at 10.

4. The input stays unchanged because none of these callbacks writes to it. A callback that mutates an object could still cause a side effect.

**Common mistakes and how to reason about them**

forEach performs an action for every element but does not collect return values. Using map does not automatically make a callback pure: editing a property on an object element still changes that object. With every, empty input returns true because no element disproves the condition; with some, empty input returns false because no element proves it.

</details>

Find **12A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-12-answer">
<summary>Check your reasoning and answer</summary>

**12A.** true. No element violates the condition. By comparison, [].some(...) is false.

every asks whether all visited elements satisfy a condition. There is no counterexample in an empty collection, so it returns true. If your rule also requires an element, check values.length &gt; 0 separately.

**12B.** forEach ignores callback return values and returns undefined. Use map for transformation.

forEach calls the function for its effects and discards each callback result. Its own return value is undefined. map builds an output array from those results and therefore fits the transformation.

**12C.** Square every value, then add the squares with an initial total of zero.

For [2, 3], map produces [4, 9] and reduce accumulates 0 + 4 + 9 = 13. For [], map returns [] and reduce returns its initial value 0. The mapped array uses O(n) auxiliary storage.

**Reference code**

```js
function sumSquares(values) {
  return values.map((n) => n * n)
    .reduce((sum, n) => sum + n, 0);
}
```

**Check the result**

```js
assert.equal(sumSquares([2, 3]), 13);
assert.equal(sumSquares([]), 0);
```

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **12A — What does [].every(n =&gt; n &gt; 0) return?** | **Must fix** | [Worked example](#workbook-12) | [Answer](#workbook-12-answer) |
| **12B — Why does const doubled = values.forEach(n =&gt; n * 2); not create a transformed array?** | **Must fix** | [Worked example](#workbook-12) | [Answer](#workbook-12-answer) |
| **12C — Write sumSquares(values) using map and reduce. An empty array should produce 0.** | **Must fix** | [Worked example](#workbook-12) | [Answer](#workbook-12-answer) |
| 1 — Predict the output of the timer example before running it. | Practice | — | — |
| 2 — Convert `readLater` into a promise-returning function and consume it with `await`. | Practice | — | — |
| 3 — Parse `['10', '11', '12']` into decimal numbers without accidentally using the index as the radix. | Practice | — | — |

## Next steps

Next: [event loop](../asynchronous/asynchronous.md), [promises](../asynchronous/promises.md), and [event listener cleanup](../event-handling.md).
