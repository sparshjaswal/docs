---
id: javascript-arrays-array-patterns
title: "Array Patterns"
slug: /javascript/arrays/array-patterns
sidebar_label: "Array patterns"
---

# Array Patterns

A pattern is a small recipe you can reuse. These recipes solve everyday list problems: remove a chosen item, split a long list into pages, count repeated words, or update one record.

1. Start with insert, remove, and replace. Write down the original list and the result you want.
2. Try grouping and counting when your task needs a summary, such as the number of students in each class.
3. Use chunks for separate groups and sliding windows for overlapping groups. Trace their positions on paper before running the code.

The examples usually return a new array. That is a **shallow copy**: nested objects remain shared unless the example copies them too. Use the ownership discussion in [array foundations](./index.md) before choosing deeper copying. Avoid `delete` for removing array items because it leaves a hole. Check the compatibility table before using recent copying methods such as `toSorted`.

## Compatibility of features used (ECMAScript editions)

- ES2015/ES6 (2015): Array.from, Array.of, spread syntax (...), Set/Map, entries/keys/values.
- ES2016: includes.
- ES2019: flat, flatMap.
- ES2022: at.
- ES2023: toSorted, toReversed, toSpliced, with, findLast, findLastIndex.
  Notes:
- The patterns also show slice/spread fallbacks that work on older engines.
- For wide support, consider polyfills (e.g., core‑js) or transpiling. structuredClone is available in modern browsers and Node 18+; otherwise use a library-based deep clone when truly needed.

The index-based helpers below assume dense ordinary arrays and valid nonnegative integer indices. They are application helpers, not exact polyfills. For `move`, `to` is the final index in the result; for insertion, an index equal to the array length appends. Validate external indices before calling them.

## Insert at index (immutable)

```javascript
const numbers = [1, 2, 3];
const i = numbers.indexOf(2); // 1
const next = [...numbers.slice(0, i), 4, ...numbers.slice(i)];
// numbers unchanged; next -> [1, 4, 2, 3]
```

## Remove by value or index (immutable)

```javascript
const numbers = [1, 2, 3, 2, 4];
// remove by value (first occurrence)
const first2 = numbers.indexOf(2);
const withoutFirst2 = numbers.filter((n, idx) => idx !== first2);
// remove all matching values
const withoutAll2 = numbers.filter((n) => n !== 2);
// remove by index
const removeAt = (arr, index) => [...arr.slice(0, index), ...arr.slice(index + 1)];
// Modern alternative
const alsoRemoveAt = (arr, index) => arr.toSpliced(index, 1);
```

## Replace/update at index (immutable)

```javascript
const replaceAt = (arr, index, value) => [...arr.slice(0, index), value, ...arr.slice(index + 1)];
// ES2023
const next2 = ['a', 'b', 'c'].with(1, 'B'); // ['a','B','c']
```

## Move or swap items (immutable)

```javascript
const move = (arr, from, to) => {
  const item = arr[from];
  const removed = arr.toSpliced(from, 1);
  return [...removed.slice(0, to), item, ...removed.slice(to)];
};

const swap = (arr, i, j) => arr.with(i, arr[j]).with(j, arr[i]);
```

## Unique values (dedupe)

```javascript
const values = [3, 3, 2, 1, 2];
const unique = [...new Set(values)]; // [3, 2, 1]

// Unique by key (keep first)
const uniqueBy = (arr, keyFn) => {
  const seen = new Set();
  return arr.filter((x) => {
    const k = keyFn(x);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};
```

## Intersection / Union / Difference (sets)

```javascript
const a = [1, 2, 3];
const b = [2, 3, 4];
const A = new Set(a);
const B = new Set(b);

const intersection = [...A].filter((x) => B.has(x)); // [2,3]
const union = [...new Set([...a, ...b])]; // [1,2,3,4]
const difference = [...A].filter((x) => !B.has(x)); // [1]
```

## Partition (split by predicate)

```javascript
const partition = (arr, pred) =>
  arr.reduce(
    (acc, x) => {
      acc[pred(x) ? 0 : 1].push(x);
      return acc;
    },
    [[], []],
  );
// partition([1,2,3,4], x => x % 2 === 0) -> [[2,4],[1,3]]
```

## Chunk an array

```javascript
const chunk = (arr, size) => {
  if (!Number.isSafeInteger(size) || size < 1) throw new RangeError('Invalid size');
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );
};
// chunk([1,2,3,4,5], 2) -> [[1,2],[3,4],[5]]
```

## Zip / Unzip

```javascript
const zip = (...arrays) => {
  if (arrays.length === 0) return [];
  const len = Math.min(...arrays.map((a) => a.length));
  return Array.from({ length: len }, (_, i) => arrays.map((a) => a[i]));
};

const unzip = (zipped) => zipped.length === 0
  ? []
  : zipped[0].map((_, i) => zipped.map((row) => row[i]));
// unzip expects rectangular rows; zip stops at the shortest input.
```

## Sliding window

```javascript
const windowed = (arr, size, step = 1) => {
  if (!Number.isSafeInteger(size) || size < 1 ||
      !Number.isSafeInteger(step) || step < 1) {
    throw new RangeError('Size and step must be positive safe integers');
  }
  const out = [];
  for (let i = 0; i + size <= arr.length; i += step) {
    out.push(arr.slice(i, i + size));
  }
  return out;
};
// windowed([1,2,3,4], 3) -> [[1,2,3],[2,3,4]]
```

## Flatten and flatMap

```javascript
const nested = [1, [2, [3, 4]]];
const flatOnce = nested.flat(); // [1, 2, [3, 4]]
const flatAll = nested.flat(Infinity); // [1, 2, 3, 4]

const users = [
  { name: 'Ada', tags: ['js', 'ml'] },
  { name: 'Linus', tags: ['c'] },
];
const tags = users.flatMap((u) => u.tags); // ['js','ml','c']
```

## Group by key

```javascript
const people = [
  { name: 'Ada', team: 'A' },
  { name: 'Grace', team: 'B' },
  { name: 'Linus', team: 'A' },
];
const groupBy = (arr, key) =>
  arr.reduce((acc, item) => {
    const k = item[key];
    (acc[k] ||= []).push(item);
    return acc;
  }, Object.create(null));
// groupBy(people, 'team') -> { A: [...], B: [...] }
```

The null-prototype accumulator safely handles string keys such as `"__proto__"` and `"constructor"`. These helpers coerce keys to property keys; use `Map` when distinct object identities must remain distinct keys.

## Count occurrences / Count by key

```javascript
const letters = ['a', 'b', 'a'];
const counts = letters.reduce((acc, ch) => {
  acc.set(ch, (acc.get(ch) || 0) + 1);
  return acc;
}, new Map());
// Map { 'a' => 2, 'b' => 1 }

const countBy = (arr, keyFn) =>
  arr.reduce((acc, x) => {
    const k = keyFn(x);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, Object.create(null));
```

## Immutable sort (stable) and multi-key sort

```javascript
const nums = [10, 2, 1];
const asc = nums.toSorted((a, b) => a - b); // nums unchanged

const people = [
  { first: 'Ada', last: 'Lovelace' },
  { first: 'Ada', last: 'Byron' },
  { first: 'Grace', last: 'Hopper' },
];
const byLastThenFirst = people.toSorted(
  (a, b) => a.last.localeCompare(b.last) || a.first.localeCompare(b.first),
);
```

## Shuffle (Fisher–Yates, immutable)

```javascript
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
```

## Sum/average/min/max

This small dense numeric example chooses 0 for an empty average. Empty min/max produce Infinity/-Infinity. For large arrays, use a loop instead of spreading every element into function arguments.

```javascript
const arr = [1, 2, 3, 4];
const sum = arr.reduce((a, n) => a + n, 0);
const avg = arr.length ? sum / arr.length : 0;
const min = Math.min(...arr);
const max = Math.max(...arr);
```

## Update objects in arrays immutably

```javascript
const users = [
  { id: 1, name: 'Ada' },
  { id: 2, name: 'Linus' },
];
const rename = (arr, id, name) => arr.map((u) => (u.id === id ? { ...u, name } : u));
```

## Async mapping

Check HTTP status before parsing, and handle rejection at the caller. `Promise.all` preserves input order but does not cancel other requests on failure. Limit concurrency for large inputs; validate each decoded record before using it.

```javascript
const urls = ['a.json', 'b.json'];
// Browser module, served beside these JSON files.
const results = await Promise.all(urls.map(async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.json();
}));
```

Notes and pitfalls:

- With ordinary unmodified prototypes, map/filter/forEach skip holes, while Array.from and spread yield undefined for them. Inherited indexed properties can change these observations.
- includes handles NaN (indexOf does not). Example: [NaN].includes(NaN) === true.
- Numeric sort requires a comparator; otherwise it sorts lexicographically.
- Prefer immutable helpers when managing UI state or shared data; mutation is fine for hot inner loops when safe and measured.

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](../index.md#interview-preparation).

### 1. How would you deduplicate records by ID while preserving the first occurrence?

<details>
<summary>Answer and worked example</summary>

Track IDs in a Set and retain a record only when its ID is first encountered. This assumes each record has a valid ID under the application’s chosen equality policy.

```js runnable
function firstById(records) {
  const seen = new Set();
  return records.filter(record => {
    if (seen.has(record.id)) return false;
    seen.add(record.id);
    return true;
  });
}
const input = [{ id: 1, name: 'first' }, { id: 1, name: 'later' }, { id: 2, name: 'other' }];
console.log(firstById(input).map(item => item.name).join(', '));
console.log(input.length);
```

**Expected output**

```text output
first, other
3
```

Filtering preserves encounter order and does not mutate the source array. Objects in the result are still shared references. Under average constant-time Set operations, the pass takes O(n) time and O(k) tracking space for k distinct IDs.

</details>

### 2. Why does new Set(records) not deduplicate separate objects with equal fields?

**Apply it:** Compare deduplication by object identity with deduplication by ID when later records contain updated data.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

Set compares objects by identity, not structural contents. Choose a domain key, and specify whether the first or last record wins. Missing IDs would all share one undefined key, so validate them if that is not intended.

For this small example every record has a valid numeric ID. Decide both the winner and the output order.

```js runnable
const records = [
  { id: 1, name: 'old' },
  { id: 2, name: 'other' },
  { id: 1, name: 'new' },
];
console.log(new Set(records).size);
const byId = new Map(records.map(record => [record.id, record]));
console.log([...byId.values()].map(record => record.name).join(','));
```

**Expected output**

```text output
3
new,other
```

The Set sees three separate objects. Repeated `Map.set` calls replace the value for ID 1 but do not move that key’s position: the last value wins in first-key-insertion order. If the requirement is first record wins, check `has` before setting, as in question 1. If it is order by last occurrence, this implementation needs an additional ordering policy.

</details>
