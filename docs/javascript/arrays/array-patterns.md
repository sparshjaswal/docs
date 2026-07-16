# Array Patterns

Practical, copy-safe (immutable) patterns you can use with arrays every day. Examples prefer non-mutating approaches and call out caveats for nested objects, sparse arrays, and performance.

Key ideas:
- Most examples are shallow: nested objects/arrays are still shared. Use structuredClone (Node 18+/modern browsers) for deep copies when needed.
- Modern non-mutating helpers: toSorted, toReversed, toSpliced, and with(). Use when supported; otherwise emulate with slice/spread on a copy.
- Avoid delete on arrays (creates holes). Prefer slicing/splicing or toSpliced.

## Compatibility of features used (ECMAScript editions)
- ES2015/ES6 (2015): Array.from, Array.of, spread syntax (...), Set/Map, entries/keys/values.
- ES2016: includes.
- ES2019: flat, flatMap.
- ES2022: at.
- ES2023: toSorted, toReversed, toSpliced, with, findLast, findLastIndex.
Notes:
- The patterns also show slice/spread fallbacks that work on older engines.
- For wide support, consider polyfills (e.g., core‑js) or transpiling. structuredClone is available in modern browsers and Node 18+; otherwise use a library-based deep clone when truly needed.

## Insert at index (immutable)
```javascript
const numbers = [1, 2, 3];
const i = numbers.indexOf(2); // 1
const next = [
  ...numbers.slice(0, i),
  4,
  ...numbers.slice(i)
];
// numbers unchanged; next -> [1, 4, 2, 3]
```

## Remove by value or index (immutable)
```javascript
const numbers = [1, 2, 3, 2, 4];
// remove by value (first occurrence)
const withoutFirst2 = numbers.filter((n, idx, arr) => idx !== arr.indexOf(2));
// remove all matching values
const withoutAll2 = numbers.filter(n => n !== 2);
// remove by index
const removeAt = (arr, index) => [
  ...arr.slice(0, index),
  ...arr.slice(index + 1)
];
// Modern alternative
const alsoRemoveAt = (arr, index) => arr.toSpliced(index, 1);
```

## Replace/update at index (immutable)
```javascript
const replaceAt = (arr, index, value) => [
  ...arr.slice(0, index),
  value,
  ...arr.slice(index + 1)
];
// ES2023
const next2 = ['a', 'b', 'c'].with(1, 'B'); // ['a','B','c']
```

## Move or swap items (immutable)
```javascript
const move = (arr, from, to) => {
  const item = arr[from];
  const removed = arr.toSpliced(from, 1);
  return [
    ...removed.slice(0, to),
    item,
    ...removed.slice(to)
  ];
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
  return arr.filter(x => {
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

const intersection = a.filter(x => B.has(x));       // [2,3]
const union = [...new Set([...a, ...b])];           // [1,2,3,4]
const difference = a.filter(x => !B.has(x));        // [1]
```

## Partition (split by predicate)
```javascript
const partition = (arr, pred) => arr.reduce((acc, x) => {
  acc[pred(x) ? 0 : 1].push(x);
  return acc;
}, [[], []]);
// partition([1,2,3,4], x => x % 2 === 0) -> [[2,4],[1,3]]
```

## Chunk an array
```javascript
const chunk = (arr, size) => Array.from(
  { length: Math.ceil(arr.length / size) },
  (_, i) => arr.slice(i * size, i * size + size)
);
// chunk([1,2,3,4,5], 2) -> [[1,2],[3,4],[5]]
```

## Zip / Unzip
```javascript
const zip = (...arrays) => {
  const len = Math.min(...arrays.map(a => a.length));
  return Array.from({ length: len }, (_, i) => arrays.map(a => a[i]));
};

const unzip = (zipped) => zipped[0].map((_, i) => zipped.map(row => row[i]));
```

## Sliding window
```javascript
const windowed = (arr, size, step = 1) => {
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
const flatOnce = nested.flat();        // [1, 2, [3, 4]]
const flatAll = nested.flat(Infinity); // [1, 2, 3, 4]

const users = [{ name: 'Ada', tags: ['js', 'ml'] }, { name: 'Linus', tags: ['c'] }];
const tags = users.flatMap(u => u.tags); // ['js','ml','c']
```

## Group by key
```javascript
const people = [
  { name: 'Ada', team: 'A' },
  { name: 'Grace', team: 'B' },
  { name: 'Linus', team: 'A' }
];
const groupBy = (arr, key) => arr.reduce((acc, item) => {
  const k = item[key];
  (acc[k] ||= []).push(item);
  return acc;
}, {});
// groupBy(people, 'team') -> { A: [...], B: [...] }
```

## Count occurrences / Count by key
```javascript
const letters = ['a', 'b', 'a'];
const counts = letters.reduce((acc, ch) => {
  acc.set(ch, (acc.get(ch) || 0) + 1);
  return acc;
}, new Map());
// Map { 'a' => 2, 'b' => 1 }

const countBy = (arr, keyFn) => arr.reduce((acc, x) => {
  const k = keyFn(x);
  acc[k] = (acc[k] || 0) + 1;
  return acc;
}, {});
```

## Immutable sort (stable) and multi-key sort
```javascript
const nums = [10, 2, 1];
const asc = nums.toSorted((a, b) => a - b); // nums unchanged

const people = [
  { first: 'Ada', last: 'Lovelace' },
  { first: 'Ada', last: 'Byron' },
  { first: 'Grace', last: 'Hopper' }
];
const byLastThenFirst = people.toSorted((a, b) =>
  a.last.localeCompare(b.last) || a.first.localeCompare(b.first)
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
  { id: 2, name: 'Linus' }
];
const rename = (arr, id, name) => arr.map(u => u.id === id ? { ...u, name } : u);
```

## Async mapping (correctly)
```javascript
const urls = ['a.json', 'b.json'];
const results = await Promise.all(urls.map(u => fetch(u).then(r => r.json())));
```

Notes and pitfalls:
- map/filter/forEach skip holes in sparse arrays. Array.from and spread convert holes to undefined.
- includes handles NaN (indexOf does not). Example: [NaN].includes(NaN) === true.
- Numeric sort requires a comparator; otherwise it sorts lexicographically.
- Prefer immutable helpers when managing UI state or shared data; mutation is fine for hot inner loops when safe and measured.
