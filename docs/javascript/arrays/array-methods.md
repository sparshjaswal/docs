---
id: javascript-arrays-array-methods
title: "JavaScript Array Methods"
slug: /javascript/arrays/array-methods
sidebar_label: "Array methods"
---

# JavaScript Array Methods

An array method is a built-in operation on a list. For a class register, you might find one student, keep students in a group, or turn each record into a name. The useful question is “What result do I need?”

Start with the [array foundations](./index.md), then practise these three jobs:

1. **Find or check:** `find` returns a matching item; `some` answers whether a match exists.
2. **Make a new list:** `map` changes each item into a result; `filter` keeps items that pass a check.
3. **Combine values:** use a loop first, then read `reduce` as a way to carry one result through the list.

**Mutation** means changing the original array. Check that before using a method: sorting a shared class register can change what another part of your program sees. The method tables below are a reference; you do not need to memorize them. [Array properties](./array-properties.md) explains `length` and other details.

## Choose a method by the result you need {/* #choose-by-result */}

For a dense array, start with the output contract. Use `map` for one transformed result per element, `filter` for selected original elements, `find` for one matching value, `some` or `every` for a Boolean, and `reduce` for an accumulated result. Use `forEach` when the purpose is a side effect and no result collection is needed.

**Worked task:** from valid order records, total the quantities of paid orders. The input must remain unchanged; an empty input should total zero.

```js runnable
const orders = [
  { paid: true, quantity: 2 },
  { paid: false, quantity: 5 },
  { paid: true, quantity: 3 },
];
const paid = orders.filter(order => order.paid);
const quantities = paid.map(order => order.quantity);
const total = quantities.reduce((sum, quantity) => sum + quantity, 0);
console.log(quantities.join(','), total);
console.log(orders.length, paid[0] === orders[0]);
console.log([].reduce((sum, quantity) => sum + quantity, 0));
```

```text output
2,3 5
3 true
0
```

The filter keeps the first and third records. The map extracts 2 and 3. The reducer starts at 0, then produces 2 and 5. That initial value also defines the empty-input answer and prevents an empty-array error.

The selected array is new, but its record objects are shared with the source. These callbacks only read them, so this pipeline does not mutate the input. A callback that writes `order.quantity` would still change the shared object. “Non-mutating method” describes the method’s own behavior, not every callback a caller might supply.

With O(1) callback work, these passes take O(n) time and can allocate O(n) intermediate storage. One loop can avoid intermediate arrays if measurements justify it. Sparse arrays have method-specific behavior, covered below; do not apply dense-array visit counts to holes. [MDN map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

## Quick Scan Reference (with version badges)

Each API shows an inline badge for when it landed in ECMAScript.

- Legacy (pre‑ES5): concat, join, pop, push, reverse, shift, slice, sort, splice, unshift
- ES5 (2009): Array.isArray, forEach, map, filter, reduce, reduceRight, every, some, indexOf, lastIndexOf
- ES2015/ES6: Array.from, Array.of, entries, keys, values, copyWithin, fill, find, findIndex
- ES2016: includes
- ES2019: flat, flatMap
- ES2022: at
- ES2023: toSorted, toReversed, toSpliced, with, findLast, findLastIndex
- ES2026: Array.fromAsync

Grouping with Object.groupBy/Map.groupBy (ES2024) and lazy iterator helpers (ES2025) are covered in [collections and iteration](../collections-and-iteration.md); they are not Array.prototype methods.

### Mutating vs Non‑mutating cheat sheet

- Mutating: push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin.

- Non‑mutating: concat, slice, map, filter, reduce, reduceRight, find, findIndex, findLast, findLastIndex, includes, indexOf, lastIndexOf, flat, flatMap, every, some, join, at, toSorted, toReversed, toSpliced, with, entries, keys, values, forEach (doesn’t change array, but can cause side effects).
- Static: Array.of, Array.from, Array.fromAsync, Array.isArray

---

## Construction and Type

### Array.from <span className="badge badge--info">Added in ES2015</span>

```javascript
// (iterable/mapFn?) => Array
Array.from({ length: 3 }, (_, i) => i); // [0,1,2]
```

### Array.fromAsync <span className="badge badge--info">Added in ES2026</span>

```js runnable requires=Array.fromAsync
async function* values() { yield 2; yield 4; }
console.log(JSON.stringify(await Array.fromAsync(values(), async value => value * 3)));
```

```text output
[6,12]
```

This returns a promise for an array and awaits mapping progressively. Use it to collect finite async input; use for-await for an unbounded stream and Promise.all for already-started independent work. Read the [full consumption rules](../collections-and-iteration.md#collect-async-input--es2026) before treating these operations as interchangeable.

### Array.of <span className="badge badge--info">Added in ES2015</span>

```javascript
Array.of(1); // [1]
Array.of(1, 2, 3); // [1,2,3]
```

### Array.isArray <span className="badge badge--secondary">Added in ES5</span>

```javascript
Array.isArray([]); // true
Array.isArray(new Uint8Array()); // false (typed arrays are not regular Arrays)
```

Notes:

- Copies are shallow; nested arrays/objects share references. Use structuredClone or libraries for deep cloning when needed.

- Array.from and spread convert holes into undefined; methods like map/forEach skip holes.

---

## Adding / Removing items

### push <span className="badge badge--secondary">Legacy</span> · pop <span className="badge badge--secondary">Legacy</span>

```javascript
const arr = [1, 2, 3];
arr.push(4); // returns 4; arr is [1,2,3,4]
arr.pop(); // returns 4; arr is [1,2,3]
```

### unshift <span className="badge badge--secondary">Legacy</span> · shift <span className="badge badge--secondary">Legacy</span>

```javascript
const a = [1, 2, 3];
a.unshift(0); // returns 4; a is [0,1,2,3]
a.shift(); // returns 0; a is [1,2,3]
```

### splice <span className="badge badge--secondary">Legacy</span>

```javascript
const xs = [0, 1, 2, 3];
xs.splice(2, 0, 'x'); // returns []; xs is [0,1,'x',2,3]
xs.splice(1, 2); // returns [1,'x']; xs is [0,2,3]
```

### toSpliced <span className="badge badge--info">Added in ES2023</span>

```javascript
const base = [0, 1, 2, 3];
const inserted = base.toSpliced(2, 0, 'x'); // [0,1,'x',2,3] (base unchanged)
const removed = base.toSpliced(1, 2); // [0,3] (base unchanged)
```

---

## Access and updates

### at <span className="badge badge--info">Added in ES2022</span>

```javascript
const letters = ['x', 'y', 'z'];
letters.at(0); // 'x'
letters.at(-1); // 'z' (from end)
```

### with <span className="badge badge--info">Added in ES2023</span>

```javascript
const arr = ['x', 'y', 'z'];
const arr2 = arr.with(1, 'Y'); // ['x','Y','z'] (arr unchanged)
```

---

## Searching and testing

### indexOf <span className="badge badge--secondary">Added in ES5</span> · lastIndexOf <span className="badge badge--secondary">Added in ES5</span>

```javascript
const fruits = ['apple', 'banana', 'orange', 'banana'];
fruits.indexOf('banana'); // 1
fruits.lastIndexOf('banana'); // 3
```

### includes <span className="badge badge--info">Added in ES2016</span>

```javascript
[NaN].includes(NaN); // true (indexOf would return -1)
```

### find <span className="badge badge--info">Added in ES2015</span> · findIndex <span className="badge badge--info">Added in ES2015</span>

```javascript
const numbers = [1, 2, 3, 4];
numbers.find((n) => n > 2); // 3
numbers.findIndex((n) => n > 2); // 2
```

### findLast <span className="badge badge--info">Added in ES2023</span> · findLastIndex <span className="badge badge--info">Added in ES2023</span>

```javascript
const ns = [1, 2, 3, 4];
ns.findLast((n) => n > 2); // 4
ns.findLastIndex((n) => n > 2); // 3
```

### every <span className="badge badge--secondary">Added in ES5</span> · some <span className="badge badge--secondary">Added in ES5</span>

```javascript
[1, 2, 3].every((n) => n > 0); // true
[1, 2, 3].some((n) => n > 2); // true
```

---

## Transforming

### map <span className="badge badge--secondary">Added in ES5</span>

```javascript
[1, 2, 3].map((n) => n * 2); // [2,4,6]
```

### filter <span className="badge badge--secondary">Added in ES5</span>

```javascript
[1, 2, 3, 4, 5].filter((n) => n % 2 === 0); // [2,4]
```

### reduce <span className="badge badge--secondary">Added in ES5</span> · reduceRight <span className="badge badge--secondary">Added in ES5</span>

```javascript
[1, 2, 3, 4, 5].reduce((sum, n) => sum + n, 0); // 15
[1, 2, 3, 4, 5].reduceRight((sum, n) => sum + n, 0); // 15
```

### flat <span className="badge badge--info">Added in ES2019</span> · flatMap <span className="badge badge--info">Added in ES2019</span>

```javascript
[1, [2, [3, 4]]].flat(Infinity); // [1,2,3,4]
[{ t: ['a', 'b'] }, { t: ['c'] }].flatMap((x) => x.t); // ['a','b','c']
```

---

## Copying and immutability helpers

### slice <span className="badge badge--secondary">Legacy</span>

```javascript
const a = [0, 1, 2, 3];
a.slice(1, 3); // [1,2]
```

### concat <span className="badge badge--secondary">Legacy</span>

```javascript
[1, 2].concat([3, 4]); // [1,2,3,4]
```

### toSorted <span className="badge badge--info">Added in ES2023</span>

```javascript
const nums = [10, 2, 1];
const sorted = nums.toSorted((a, b) => a - b); // [1,2,10]; nums unchanged
```

### sort <span className="badge badge--secondary">Legacy</span>

```javascript
const ns = [10, 2, 1];
ns.sort((a, b) => a - b); // [1,2,10]; ns mutated
['ä', 'a'].sort((a, b) => a.localeCompare(b, 'de')); // locale‑aware
```

### toReversed <span className="badge badge--info">Added in ES2023</span> · reverse <span className="badge badge--secondary">Legacy</span>

```javascript
const letters = ['a', 'b', 'c'];
letters.toReversed(); // ['c','b','a'] (non‑mutating)
letters.reverse(); // ['c','b','a'] (mutates)
```

### toSpliced <span className="badge badge--info">Added in ES2023</span> · splice <span className="badge badge--secondary">Legacy</span>

```javascript
const base = [0, 1, 2, 3];
base.toSpliced(1, 2); // [0,3] (non‑mutating)
base.splice(1, 2); // returns [1,2]; base becomes [0,3]
```

---

## Filling and in‑place copying

### fill <span className="badge badge--info">Added in ES2015</span>

```javascript
new Array(5).fill(0); // [0,0,0,0,0]
['a', 'b', 'c', 'd'].fill('x', 1, 3); // ['a','x','x','d']
```

### copyWithin <span className="badge badge--info">Added in ES2015</span>

```javascript
// copyWithin(target, start, end?) -> mutates
[1, 2, 3, 4, 5].copyWithin(0, 3); // [4,5,3,4,5]
```

---

## Iteration helpers

### forEach <span className="badge badge--secondary">Added in ES5</span>

```javascript
const log = [];
[1, 2, 3].forEach((n) => log.push(n * 2));
// log: [2,4,6]
```

### entries <span className="badge badge--info">Added in ES2015</span> · keys <span className="badge badge--info">Added in ES2015</span> · values <span className="badge badge--info">Added in ES2015</span>

```javascript
const a = ['x', 'y'];
for (const [i, v] of a.entries()) {
  /* index + value */
}
for (const i of a.keys()) {
  /* indices */
}
for (const v of a.values()) {
  /* values */
}
```

---

## String/locale conversions

### join <span className="badge badge--secondary">Legacy</span>

```javascript
[1, 2, 3].join('-'); // '1-2-3'
```

### toString <span className="badge badge--secondary">Legacy</span> · toLocaleString <span className="badge badge--secondary">Legacy</span>

```javascript
[1, 2, 3].toString(); // '1,2,3'
[1234.5].toLocaleString('de-DE'); // '1.234,5'
```

---

## Notes on stability and comparators

- Modern engines implement stable sorting; toSorted also preserves stability.
- Always provide a comparator for numbers or objects.

---

## Sparse Arrays and Holes

- map/filter/forEach skip holes.
- Array.from and spread convert holes to undefined.
- `at` and direct indexing read an absent index as `undefined` unless an inherited property supplies a value. `length` counts index positions, including empty slots.

---

## Properties quick recap (examples)

These are properties rather than methods; see array-properties.md for deeper coverage.

### length <span className="badge badge--secondary">Legacy</span>

```javascript
const arr = [1, 2, 3];
arr.length; // 3
arr.length = 1; // truncate -> [1]
```

### Symbol.iterator <span className="badge badge--info">Added in ES2015</span>

```javascript
for (const v of ['a', 'b']) {
  /* iterates values */
}
```

---

## Big‑O Hints

These are common cost models for ordinary dense arrays, not ECMAScript complexity guarantees. Accessors, proxies, callbacks, element representations, and allocation affect actual work. [V8 sorting implementation notes](https://v8.dev/blog/array-sort).

- push/pop: typically amortized O(1) for a single element
- shift/unshift: O(n)
- splice (insert/remove in middle): O(n)
- includes/indexOf: O(n)
- Random access arr[i]: O(1)
- sort: typically O(n log n)

## Good Practices

- Prefer non‑mutating methods when managing UI state or shared data.

## Interview questions {/* #interview-questions */}

**Level: Beginner.** [How to practise](../index.md#interview-preparation).

### 1. Why can default sorting produce a surprising numeric order?

<details>
<summary>Answer and worked example</summary>

Ordinary Array.sort compares string forms by default. Use a numeric comparator for finite Number values, and decide whether the input may be mutated.

```js runnable
const values = [10, 2, 1];
console.log(values.toSorted().join(', '));
console.log(values.toSorted((a, b) => a - b).join(', '));
console.log(values.join(', '));
```

**Expected output**

```text output
1, 10, 2
1, 2, 10
10, 2, 1
```

toSorted returns a new array, preserving the input order. The comparator must express a consistent ordering; NaN, mixed types, or locale-sensitive text need a more explicit contract.

</details>

### 2. What is the difference between slice and splice?

**Apply it:** Remove the middle two items while distinguishing the returned value from the mutated input.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

slice copies a half-open range without removing elements. splice mutates the source and returns an array of removed elements. Its deleteCount is a count, not an end index; toSpliced is a copying alternative in supporting runtimes.

Use the same starting values to compare an end index with a deletion count.

```js runnable
const values = ['a', 'b', 'c', 'd'];
const copied = values.slice(1, 3);
console.log(copied.join(','), values.join(','));
const removed = values.splice(1, 2, 'x');
console.log(removed.join(','), values.join(','));
```

**Expected output**

```text output
b,c a,b,c,d
b,c a,x,d
```

`slice(1, 3)` reads indexes 1 and 2; its second argument is exclusive. `splice(1, 2, "x")` removes two items starting at 1 and inserts `"x"`. Its result is the removed items, not the updated array. Both copy element values shallowly when returning arrays: nested objects still share identity. When callers must retain the original sequence, choose a copying operation and test nonmutation.

</details>

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](../workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 09. Arrays mutation and sorting {/* #workbook-09 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** sort a copy and keep separate grid rows.

The source numbers are `[10, 2, 1]`. First predict their order with numeric comparison. Then track the original array and the copied array separately. Sorting the copy should not rearrange the source.

For the grid, the `Array.from` callback creates a fresh row each time. Change one cell and check the other row. Review [sorting and comparators](#notes-on-stability-and-comparators) and [copying helpers](#copying-and-immutability-helpers) rather than memorizing a second method list. A copied outer array does not automatically copy nested objects.

**Worked example**

```js
const numbers = [10, 2, 1];
const sorted = [...numbers].sort((a, b) => a - b);
console.log(sorted.join(","));
console.log(numbers.join(","));
const grid = Array.from({ length: 2 }, () => [0, 0]);
grid[0][0] = 9;
console.log(grid[1][0]);
```

**Expected output**

```text
1,2,10
10,2,1
0
```

The spread expression creates a new outer array before sorting. Each grid callback returns a separate row, so editing the first row leaves the second unchanged. Copying an array this way does not deeply copy object elements.

**Trace the example step by step**

1. The spread expression [...numbers] creates a new outer array with the same numeric elements. The original and the copy are different arrays.

2. sort((a, b) =&gt; a - b) rearranges the copy numerically to 1, 2, 10. The original retains 10, 2, 1.

3. The matrix callback runs twice and constructs a fresh [0, 0] each time. The rows therefore have different identities.

4. Changing grid[0][0] updates only the first row. Reading grid[1][0] still produces 0.

**Common mistakes and how to reason about them**

When you need a new sorted array, copy before calling sort. Do not assume a shallow copy protects nested records from mutation. For large-input DSA reasoning, count copies as work and storage: copying n elements is O(n), even when the syntax is only a few characters long.

</details>

Find **09A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-09-answer">
<summary>Check your reasoning and answer</summary>

**09A.** "1,10,2" because the default comparison uses string order.

Without a comparator, the values are compared as text and ordered 1, 10, 2. join then combines them into "1,10,2". The result differs from numerical order because the sorting rule differs.

**09B.** slice returns indices 1 and 2 without mutation. splice removes two elements starting at index 1 and mutates the source.

slice(1, 3) copies positions 1 and 2 and leaves the original unchanged. splice(1, 2) removes two elements starting at position 1. The second argument is an end position for slice but a count for splice.

**09C.** Copy first, then sort with a numeric comparator.

Spread gives sort a separate array to mutate. The comparator supplies numerical order. Test both the returned result and the unchanged source; checking only the sorted result would miss accidental mutation.

**Reference code**

```js
function sortedCopy(values) {
  return [...values].sort((a, b) => a - b);
}
```

**Check the result**

```js
const input = [3, 1, 2];
assert.deepEqual(sortedCopy(input), [1, 2, 3]);
assert.deepEqual(input, [3, 1, 2]);
```

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **09A — Predict [10, 2, 1].sort().join(",").** | **Must fix** | [Worked example](#workbook-09) | [Answer](#workbook-09-answer) |
| **09B — Explain the difference between slice(1, 3) and splice(1, 2).** | **Must fix** | [Worked example](#workbook-09) | [Answer](#workbook-09-answer) |
| **09C — Write sortedCopy(values), returning numbers in ascending order without changing values.** | **Must fix** | [Worked example](#workbook-09) | [Answer](#workbook-09-answer) |

## References

References: [MDN Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [javascript.info array methods](https://javascript.info/array-methods).
