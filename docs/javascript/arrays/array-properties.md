---
id: javascript-arrays-array-properties
title: "Array Properties"
slug: /javascript/arrays/array-properties
sidebar_label: "Array properties"
---

# Array Properties

An array has items and also properties that describe or support it. The most useful first property is `length`. In a list with three items at positions `0`, `1`, and `2`, the length is `3`.

1. Read `length`, then add an item and observe the change.
2. Use `Array.isArray` to check whether an input is an array.
3. Use `join` when you need one string, such as names separated by commas.

Return to `prototype`, `constructor`, and symbols after [objects and classes](../objects-and-classes.md). A **prototype** is another object JavaScript can consult when a property is missing. These reference sections explain how array operations are shared; you do not need them to begin using lists.

## length <span className="badge badge--secondary">Legacy</span>

The `length` is a nonnegative integer below 2³², greater than every existing array index. It includes empty slots, so it is not necessarily the number of stored elements. It is normally writable.

```js
const arr = [1, 2, 3];
console.log(arr.length); // 3

arr.length = 2; // truncate
console.log(arr); // [1, 2]

arr.length = 5; // extend with holes
console.log(arr); // [1, 2, &lt;3 empty items>]
```

Notes:

- Reducing `length` deletes indexed properties beyond the new bound. It has no universal O(1) guarantee and can fail if a removed property is non-configurable. Releasing references also does not promise immediate garbage collection.
- Assigning beyond current length creates a sparse array (holes). Prefer dense arrays for performance and predictability.
- Writing `length` smaller than current size discards elements beyond the new length.

TypeScript:

```ts
function truncate<T>(arr: T[], n: number): T[] {
  if (!Number.isInteger(n) || n < 0) throw new RangeError('Invalid limit');
  return arr.slice(0, n); // truncate without extending or mutating the input
}
```

## prototype (Array.prototype) <span className="badge badge--secondary">Legacy</span>

Holds the shared methods for all array instances (e.g., `map`, `filter`, `reduce`).

```js
Array.prototype.first = function () {
  return this[0];
};
['a', 'b'].first(); // 'a'
```

Caution: Avoid modifying built-ins in application code—monkey patching can break dependencies and assumptions in libraries. Prefer standalone helpers or utility modules.

## Array.isArray <span className="badge badge--secondary">Added in ES5</span>

Safely check if a value is an array.

```js
Array.isArray([]); // true
Array.isArray({}); // false
Array.isArray(new Uint8Array()); // false (typed arrays are not regular Arrays)
```

TypeScript narrowing example:

```ts
function toArray<T>(x: T | T[]): T[] {
  return Array.isArray(x) ? x : [x];
}
```

## Symbol.iterator <span className="badge badge--info">Added in ES2015</span>

Regular arrays are iterable.

```js
const arr = [1, 2, 3];
for (const v of arr) {
  // iterates values
}
```

Tip: Use `for...of`, `entries()`, or array methods (`map`, `filter`) instead of `for...in` to avoid iterating inherited keys.

## toString and join <span className="badge badge--secondary">Legacy</span>

```js
[1, 2, 3].toString(); // '1,2,3'
[1, 2, 3].join('-'); // '1-2-3'
```

Notes:

- `join` treats holes as empty strings; `JSON.stringify([,])` becomes `[null]` while `[,].join(',')` becomes `""`; `[,,].join(',')` becomes `","`.
- Use `join` to express joining a sequence with a separator; benchmark before claiming it is faster than another construction.

## constructor <span className="badge badge--secondary">Legacy</span>

An ordinary array inherits `constructor` from `Array.prototype`. This property can be overwritten and does not reliably identify how an object was created; use `Array.isArray` for the array check.

```js
[].constructor === Array; // true
```

## Less‑common but useful symbols

### Symbol.isConcatSpreadable <span className="badge badge--info">Added in ES2015</span>

Controls spread behavior in `concat`.

```js
const arr = [1, 2];
const arr2 = [3, 4];
arr2[Symbol.isConcatSpreadable] = false;
[].concat(arr, arr2); // [1, 2, [3, 4]]

const like = { 0: 'x', 1: 'y', length: 2, [Symbol.isConcatSpreadable]: true };
[].concat(like); // ['x','y'] (array‑like is spread)
```

### Symbol.species <span className="badge badge--info">Added in ES2015</span>

Lets subclasses override which constructor is used for derived objects.

```js
class MyArray extends Array {
  static get [Symbol.species]() {
    return Array;
  }
}
const a = new MyArray(1, 2, 3);
const mapped = a.map((x) => x);
mapped instanceof MyArray; // false, uses Array because of Symbol.species
```

### Symbol.unscopables <span className="badge badge--info">Added in ES2015</span>

Prevents certain props from being introduced into `with` scopes (legacy edge case).

```js
Array.prototype[Symbol.unscopables];
// e.g., { copyWithin: true, entries: true, fill: true, find: true, ... }
```

## Compatibility notes (ES2023)

If your target lacks `toSorted`, `toReversed`, `toSpliced`, or `with`, choose a maintained standards-compatible polyfill or an explicitly narrower helper. Short spread/slice wrappers are not complete replacements: negative indices, out-of-range errors, omitted arguments, holes, and subclasses change the contract.

```js runnable
const values = ['a', 'b', 'c'];
console.log(values.with(-1, 'Z').join(', '));
try { values.with(3, 'Z'); }
catch (error) { console.log(error.name); }
console.log(values.join(', '));
console.log(JSON.stringify([,].join(',')), JSON.stringify([,,].join(',')));
```

```text output
a, b, Z
RangeError
a, b, c
"" ","
```

`copy[-1] = value` creates a named property rather than replacing the last element, while `copy[copy.length] = value` appends instead of throwing. Test the actual deployment versions using [MDN compatibility tables](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/with#browser_compatibility). Syntax transpilation alone does not implement missing methods.

## Performance checklist

- Prefer dense arrays over sparse ones.
- Avoid `delete arr[i]`; use `toSpliced(i, 1)` or `splice(i, 1)`.
- Batch operations (e.g., map once instead of multiple passes) when possible.
- Immutability allocates copies—safer for state, but measure in hot paths.

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](../index.md#interview-preparation).

### 1. Are an empty slot and an explicit undefined element the same?

<details>
<summary>Answer and worked example</summary>

They can produce the same value when read, but property presence differs. Some array methods skip absent positions while iteration-based copying produces values for them.

```js runnable
const sparse = new Array(2);
sparse[1] = undefined;
console.log(sparse.length, Object.hasOwn(sparse, 0), Object.hasOwn(sparse, 1));
let calls = 0;
sparse.forEach(() => calls++);
console.log(calls);
console.log(Object.hasOwn([...sparse], 0));
```

**Expected output**

```text output
2 false true
1
true
```

With ordinary unmodified prototypes, forEach visits only the explicit element. Spread iterates both positions and creates an own undefined element for the hole.

</details>

### 2. Does setting array.length to a smaller number just change metadata?

**Apply it:** Predict whether shrinking and then growing an array restores its deleted elements.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

No. For an ordinary array it removes indexed properties at or beyond the new length, subject to descriptor restrictions. Increasing length creates holes rather than initialized elements. Do not promise constant-time truncation for every array.

Observe both the length and whether an index is an own property.

```js runnable
const values = ['a', 'b', 'c'];
values.length = 1;
values.length = 3;
console.log(values.length, Object.hasOwn(values, 1));
console.log(values[1]);
let visits = 0;
values.forEach(() => visits++);
console.log(visits);
console.log(Array.from(values, value => String(value)).join(','));
```

**Expected output**

```text output
3 false
undefined
1
a,undefined,undefined
```

Shrinking deletes the ordinary indexed properties. Growing reserves a larger index range but does not restore values. `forEach` skips these holes, whereas the array iterator used by `Array.from` reads them as `undefined` here. A missing property and a present property containing `undefined` can therefore produce the same read while behaving differently during traversal.

</details>

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](../workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 24. Arrays copying and collection operations {/* #workbook-24 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** create independent rows and keep an unsorted input unchanged.

`Array.from` calls its row-creation function separately for each row. Draw the two row arrays, push 7 into the first, and predict the second row. Then trace the copied numeric sort while keeping the original values visible.

Use the [length explanation](#length-legacy) and [array method reference](./array-methods.md) for details. Filling an array with one inner array would repeat a reference rather than create independent rows. Avoid holes while learning: an empty position is not always treated the same as a stored `undefined`.

**Worked example**

```js
const rows = Array.from({ length: 2 }, () => []);
rows[0].push(7);
const values = [9, 2, 11];
const ordered = [...values].sort((a, b) => a - b);
console.log(JSON.stringify(rows));
console.log(JSON.stringify(values));
console.log(JSON.stringify(ordered));
```

**Expected output**

```text
[[7],[]]
[9,2,11]
[2,9,11]
```

**Why the example works**

The callback allocates two independent rows. Spread then copies only the outer numeric array, which is sufficient because its elements are primitive numbers. Sorting the copy preserves the original sequence. A numeric comparator orders 11 after 9 rather than comparing their string forms.

</details>

Find **24A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-24-answer">
<summary>Check your reasoning and answer</summary>

**24A.** fill evaluates its object argument once, then repeats that one reference. Use a factory callback with Array.from when each position must own a different object.

**24B.** True. every checks whether any element violates the predicate. The empty array has no such counterexample; it does not claim that an element exists.

**24C.** A Set removes duplicates according to SameValueZero. Spreading its values creates a new array, and the numeric comparator sorts that array without changing the caller's array.

**Reference code**

```js
function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a - b);
}
```

**Check the result**

```js
const values = [3, -1, 3, 0];
assert.deepEqual(uniqueSorted(values), [-1, 0, 3]);
assert.deepEqual(values, [3, -1, 3, 0]);
assert.deepEqual(uniqueSorted([]), []);
```

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **24A — Why does Array(2).fill(\{\}) create shared state?** | **Must fix** | [Worked example](#workbook-24) | [Answer](#workbook-24-answer) |
| **24B — What does [].every(x =&gt; x &gt; 0) return and why?** | **Must fix** | [Worked example](#workbook-24) | [Answer](#workbook-24-answer) |
| **24C — Write uniqueSorted(values) for finite numbers, preserving the input.** | **Must fix** | [Worked example](#workbook-24) | [Answer](#workbook-24-answer) |

## References

References: [MDN array length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length), [MDN join](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join).
