---
id: javascript-loops
slug: /javascript/loops
title: "Loops and iteration"
sidebar_label: "Loops and iteration"
---

# Loops and iteration

A loop repeats a step. To total a student's marks, you can start at zero, visit each mark, and add it to the running total. Trace the total after each step before writing a shorter version.

1. Use a counted `for` loop to see the start, condition, and update.
2. Use `for...of` when you need each value in a list.
3. Use `while` when repetition depends on a condition rather than a fixed list.
4. Learn `break` and `continue` by tracing which steps are skipped or stopped.

An array transformation can sometimes express the same job more clearly. Choose based on the result you need; learn [array methods](./arrays/array-methods.md) after you can explain the loop. Leave asynchronous loops for after promises.

## Choose a loop

| Construct | Best fit | Important distinction |
| --- | --- | --- |
| `for` | An index or explicit counter | Initialization, condition, and update are visible together |
| `while` | Repeat while a condition remains true | May execute zero times |
| `do...while` | Execute once, then test | Always executes at least once |
| `for...of` | Values from an iterable | Supports break/continue and iterator cleanup |
| `for...in` | Enumerable string property keys | Can include inherited properties; avoid for array values |
| `for await...of` | Async iterable values | Requires an async function or module scope |

```js runnable
const values = [4, 7, 2];
let total = 0;
for (const value of values) {
  if (value < 3) continue;
  total += value;
}
let attempts = 0;
do { attempts++; } while (attempts < 1);
console.log(total);
console.log(attempts);
```

```text output
11
1
```

Declare loop bindings with `const` or `let`. Assigning to an undeclared variable is an error in strict mode and an accidental global in some non-strict scripts.

## Iterate records deliberately

```js runnable
const record = Object.create({ inherited: true });
record.own = 'value';
console.log(Object.keys(record).join(', '));
const keys = [];
for (const key in record) keys.push(key);
console.log(keys.join(', '));
```

```text output
own
own, inherited
```

Use `Object.entries` for ordinary own key/value pairs and `Reflect.ownKeys` when symbols and non-enumerable keys matter.

## Async loops

Use `for...of` with `await` for sequential work. Use `Promise.all(items.map(operation))` when all operations may start together, or a [concurrency limit](./asynchronous/async-await.md) for a large batch. `forEach` does not await promises returned by its callback.

## Interview questions {/* #interview-questions */}

**Level: Beginner.** [How to practise](./index.md#interview-preparation).

### 1. How do for...in and for...of differ when iterating an array?

<details>
<summary>Answer and worked example</summary>

`for...in` enumerates enumerable string keys, including applicable inherited keys. `for...of` consumes values from the iterable protocol.

```js runnable
const values = ['a', 'b'];
values.extra = 'note';
const keys = [];
const items = [];
for (const key in values) keys.push(key);
for (const value of values) items.push(value);
console.log(keys.join(', '));
console.log(items.join(', '));
```

**Expected output**

```text output
0, 1, extra
a, b
```

The extra property participates in key enumeration. The ordinary array iterator visits indexed positions rather than every enumerable property.

</details>

### 2. Can an async forEach callback make forEach wait for all work?

**Apply it:** Compare the returned value of forEach with the promise returned by Promise.all. Identify when the result collection becomes complete.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

No. forEach discards callback return values and returns undefined. Use `for...of` with await for sequential work, or map to promises and await Promise.all for independent work. Bound concurrency when the collection can be large.

Use immediately fulfilled promises to expose the scheduling mistake without relying on network speed or timer delays.

```js runnable
const values = [1, 2];
const collected = [];
const returned = values.forEach(async value => {
  const doubled = await Promise.resolve(value * 2);
  collected.push(doubled);
});
console.log(returned, collected.length);
const results = await Promise.all(values.map(async value => value * 2));
console.log(results.join(','));
console.log(collected.join(','));
```

**Expected output**

```text output
undefined 0
2,4
2,4
```

The first log runs before either `forEach` callback resumes. Those callbacks happen to finish before the last log in this controlled example; `forEach` provides no completion handle and does not collect rejections. The `map` version returns each promise to `Promise.all`, giving the caller one operation to await and catch. For dependent steps, use `for...of` and await inside the loop. See [MDN: forEach and promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#description).

</details>

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](./workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 05. Loops and tracing state {/* #workbook-05 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** follow a value that changes during a loop.

Make a small table with columns for `i`, `values[i]`, and `total` after the addition. Fill one row for each item in `[3, 5, 2]`, then compare your table with the printed output.

The total begins at zero because nothing has been added yet. The loop stops before `i` reaches `values.length`, so the last valid index is included without reading beyond the list. Use [the loop comparison](#choose-a-loop) before choosing a different form. Repeat the trace with an empty list.

**Worked example**

```js
const values = [3, 5, 2];
let total = 0;
for (let i = 0; i < values.length; i++) {
  total += values[i];
  console.log(i, total);
}
console.log("Sum:", total);
```

**Expected output**

```text
0 3
1 8
2 10
Sum: 10
```

After each iteration, total is the sum of the values visited so far. It begins at 0 because no values have been visited. The invariant also explains why an empty array should have a sum of 0.

**Trace the example step by step**

1. The array holds the input values; total starts at the additive identity 0.

2. The loop reads values[i]. The statement total += values[i] means total = total + values[i].

3. After every iteration, the saved total includes the current value and all earlier values, with no value counted twice.

4. When the loop finishes, the accumulator is the answer. With empty input the loop does no work, leaving the correct sum of 0.

Index Current value Total after addition

0 3 3

1 5 8

2 2 10

**Common mistakes and how to reason about them**

For an array of length n, valid ordinary element indices run from 0 through n - 1. Accessing index n normally produces undefined, which can turn arithmetic into NaN. break leaves the loop, while continue skips to its next iteration. In a while loop, check that continue cannot accidentally skip the state update and create an infinite loop.

</details>

Find **05A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-05-answer">
<summary>Check your reasoning and answer</summary>

**05A.** 1, 2, and 3. The loop stops when i becomes 4.

The condition is checked before printing. Values 1, 2, and 3 satisfy i &lt; 4. The update then makes i equal to 4, and the next condition check ends the loop without printing 4.

**05B.** Use i &lt; values.length. The largest valid index is length - 1.

The last position is one less than the length because indexing begins at zero. With an empty array, i starts at 0 and i &lt; 0 is immediately false, which also handles the empty case naturally.

**05C.** Start a count at zero and increase it only for values greater than zero.

For [-2, 0, 3, 5], the running count is 0, 0, 1, 2. Only the predicate value &gt; 0 decides whether to add one. The algorithm visits every value once and uses one counter, so its time is O(n) and auxiliary space is O(1) under the usual numeric model.

**Reference code**

```js
function countPositive(values) {
  let count = 0;
  for (const value of values) {
    if (value > 0) count++;
  }
  return count;
}
```

**Check the result**

```js
assert.equal(countPositive([-2, 0, 3, 5]), 2);
assert.equal(countPositive([]), 0);
```

</details>

<span id="practice" />

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **05A — List the values printed by for (let i = 1; i &lt; 4; i++) console.log(i);.** | **Must fix** | [Worked example](#workbook-05) | [Answer](#workbook-05-answer) |
| **05B — Fix an array loop that uses i &lt;= values.length.** | **Must fix** | [Worked example](#workbook-05) | [Answer](#workbook-05-answer) |
| **05C — Write countPositive(values), counting numbers strictly greater than zero.** | **Must fix** | [Worked example](#workbook-05) | [Answer](#workbook-05-answer) |
| Find the first matching item and stop immediately. | Practice | — | — |
| Write a countdown that always terminates for a valid nonnegative integer input. | Practice | — | — |
| Consume an async generator without collecting all values in memory. | Practice | — | — |

## Continue learning

Continue with [collections and iteration](./collections-and-iteration.md) and [array methods](./arrays/array-methods.md).
