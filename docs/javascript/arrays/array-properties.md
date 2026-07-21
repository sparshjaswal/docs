---
id: javascript-arrays-array-properties
title: "Array Properties"
slug: /javascript/arrays/array-properties
sidebar_label: "Array Properties"
---

# Array Properties

This reference covers important Array properties with practical caveats, performance notes, compatibility guidance, and TypeScript tips.

## length <span className="badge badge--secondary">Legacy</span>

Returns the number of elements in an array. It is writable.

```js
const arr = [1, 2, 3];
console.log(arr.length); // 3

arr.length = 2; // truncate
console.log(arr); // [1, 2]

arr.length = 5; // extend with holes
console.log(arr); // [1, 2, &lt;3 empty items>]
```

Notes:

- Setting `length = 0` clears an array efficiently (O(1) metadata update; engines may free memory lazily).
- Assigning beyond current length creates a sparse array (holes). Prefer dense arrays for performance and predictability.
- Writing `length` smaller than current size discards elements beyond the new length.

TypeScript:

```ts
function truncate<T>(arr: T[], n: number): T[] {
  const copy = arr.slice();
  copy.length = Math.max(0, n);
  return copy; // avoid mutating inputs in reducers/state
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

- `join` treats holes as empty strings; `JSON.stringify([,])` becomes `[null]` while `[,].join(',')` becomes "," (empty between commas).
- Prefer `join` over manual string concatenation in loops for performance and clarity.

## constructor <span className="badge badge--secondary">Legacy</span>

References the constructor function used to create the instance.

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

If your environment lacks modern immutable methods (`toSorted`, `toReversed`, `toSpliced`, `with`), provide ponyfills:

```js
export const toSorted = (arr, cmp) => [...arr].sort(cmp);
export const toReversed = (arr) => [...arr].reverse();
export const toSpliced = (arr, start, delCount, ...items) => {
  const copy = arr.slice();
  copy.splice(start, delCount, ...items);
  return copy;
};
export const withAt = (arr, index, value) => {
  const copy = arr.slice();
  copy[index] = value;
  return copy;
};
```

Targets and notes:

- Node 20+ and evergreen browsers: native support.
- Node 18+/Chrome 90+/legacy evergreen (2020–2022): transpile with Babel + core-js or use the ponyfills above.

## Performance checklist

- Prefer dense arrays over sparse ones.
- Avoid `delete arr[i]`; use `toSpliced(i, 1)` or `splice(i, 1)`.
- Batch operations (e.g., map once instead of multiple passes) when possible.
- Immutability allocates copies—safer for state, but measure in hot paths.
