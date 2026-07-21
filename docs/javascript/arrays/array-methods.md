---
id: javascript-arrays-array-methods
title: "JavaScript Array Methods"
slug: /javascript/arrays/array-methods
sidebar_label: "JavaScript Array Methods"
---

# JavaScript Array Methods

This guide groups array methods by behavior, clarifies mutating vs non‑mutating operations, and calls out common pitfalls and best practices. Examples are MDX‑safe.

Tip: For Array properties (length, prototype, Symbol.iterator, toString/join, etc.) with examples, see the companion page: array-properties.md. A quick "Properties" recap appears near the end.

## Quick Scan Reference (with version badges)

Each API shows an inline badge for when it landed in ECMAScript.

- Legacy (pre‑ES5): concat, join, pop, push, reverse, shift, slice, sort, splice, unshift
- ES5 (2009): Array.isArray, forEach, map, filter, reduce, reduceRight, every, some, indexOf, lastIndexOf
- ES2015/ES6: Array.from, Array.of, entries, keys, values, copyWithin, fill, find, findIndex
- ES2016: includes
- ES2019: flat, flatMap
- ES2022: at
- ES2023: toSorted, toReversed, toSpliced, with, findLast, findLastIndex

### Mutating vs Non‑mutating cheat sheet

- Mutating: push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin.

- Non‑mutating: concat, slice, map, filter, reduce, reduceRight, find, findIndex, findLast, findLastIndex, includes, indexOf, lastIndexOf, flat, flatMap, every, some, join, at, toSorted, toReversed, toSpliced, with, entries, keys, values, forEach (doesn’t change array, but can cause side effects).
- Static: Array.of, Array.from, Array.isArray

---

## Construction and Type

### Array.from <span className="badge badge--info">Added in ES2015</span>

```javascript
// (iterable/mapFn?) => Array
Array.from({ length: 3 }, (_, i) => i); // [0,1,2]
```

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
arr.push(4); // [1,2,3,4]
arr.pop(); // [1,2,3]
```

### unshift <span className="badge badge--secondary">Legacy</span> · shift <span className="badge badge--secondary">Legacy</span>

```javascript
const a = [1, 2, 3];
a.unshift(0); // [0,1,2,3]
a.shift(); // [1,2,3]
```

### splice <span className="badge badge--secondary">Legacy</span>

```javascript
const xs = [0, 1, 2, 3];
xs.splice(2, 0, 'x'); // insert at idx 2 -> [0,1,'x',2,3]
xs.splice(1, 2); // remove 2 starting at 1 -> [0,3]
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
base.splice(1, 2); // [0,3] (mutates base)
```

### with <span className="badge badge--info">Added in ES2023</span>

```javascript
const arr = [0, 1, 2];
arr.with(2, 99); // [0,1,99] (non‑mutating)
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
- at, direct indexing, and length include holes; be mindful when counting.

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

- push/pop: O(1)
- shift/unshift: O(n)
- splice (insert/remove in middle): O(n)
- includes/indexOf: O(n)
- Random access arr[i]: O(1)
- sort: typically O(n log n)

## Good Practices

- Prefer non‑mutating methods when managing UI state or shared data.
