---
slug: /javascript/arrays/basics
---

# Arrays

Arrays are ordered, zero-indexed collections that can hold values of any type. They are dynamic (grow/shrink) and implemented as objects under the hood.

Key characteristics:

- Zero-based indexing: first element is at index `0`.
- Dynamic size: you can add/remove elements at runtime.
- Heterogeneous: elements can be of different types.
- May contain "holes" (sparse arrays) if you assign beyond current length.

## Creating Arrays

```js
// Preferred: literal syntax
const nums = [1, 2, 3];

// From individual arguments
const ofNums = Array.of(1, 2, 3);

// From iterable/array-like
const fromStr = Array.from('abc'); // ['a','b','c']
const doubled = Array.from([1, 2, 3], (n) => n * 2); // [2, 4, 6]

// Create N items (initialized)
const fiveZeros = Array(5).fill(0); // [0,0,0,0,0]
```

Accessibility note: Prefer explicit initialization (e.g., `fill`) to avoid surprises from holes in sparse arrays.

## Accessing and Updating

```js
const a = ['x', 'y', 'z'];

a[0]; // 'x'
a.at(-1); // 'z'  (ES2022: negative index from end)

// Immutable update by index (ES2023)
const next = a.with(1, 'Y'); // ['x','Y','z']

// In-place update (mutates)
a[1] = 'Y'; // avoid in React reducers/state
```

## Copy vs Reference (simple)

```js
// Assignment makes a reference (both names point to the same array)
const original = [1, 2, 3];
const ref = original; // ref and original are the same array; mutations affect both

// Shallow copy (new top‑level array; nested objects/arrays are still shared)
const copy1 = [...original];
const copy2 = original.slice();
const copy3 = Array.from(original);

// Shallow copy pitfall with nested data
const nested = [[1], [2]];
const shallow = [...nested];
shallow[0].push(99);
// nested -> [[1, 99], [2]] (inner array reference is shared)

// Deep copy (independent nested structures)
const deep =
  typeof structuredClone === 'function'
    ? structuredClone(nested) // handles many built‑ins (Array, Object, Map, Set, Date, RegExp, etc.)
    : JSON.parse(JSON.stringify(nested)); // fallback: JSON‑safe only (drops functions/undefined/Symbol, loses Date/Map/Set/BigInt)
```

## Multidimensional Arrays

```js
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
];
const item = matrix[1][2]; // 6
```

## Iteration Patterns

```js
const arr = [1, 2, 3];

for (const n of arr) {
  // ...
}

for (const [i, v] of arr.entries()) {
  // index + value
}

arr.forEach((v, i) => {
  // side effects only (returns undefined)
});

// Prefer map/filter/reduce for transformations (pure, chainable)
const squares = arr.map((n) => n * 2);
```

## Real‑world examples

### React state updates (immutability friendly)

```tsx
import { useState } from 'react';

type Todo = { id: number; title: string; done: boolean };

export function Todos() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, title: 'Write docs', done: false },
    { id: 2, title: 'Ship build', done: true },
  ]);

  // Insert immutably
  const addTodo = (title: string) =>
    setTodos((prev) =>
      prev.toSpliced(prev.length, 0, {
        id: Date.now(),
        title,
        done: false,
      }),
    ); // ES2023: returns new array

  // Toggle immutably by index
  const toggle = (i: number) =>
    setTodos((prev) => prev.with(i, { ...prev[i], done: !prev[i].done }));

  // Sort immutably by title
  const sortByTitle = () =>
    setTodos((prev) => prev.toSorted((a, b) => a.title.localeCompare(b.title)));

  return null;
}
```

### Redux-style reducer (no mutation)

```ts
interface Add {
  type: 'add';
  payload: number;
}
interface RemoveAt {
  type: 'removeAt';
  index: number;
}

type Action = Add | RemoveAt;

export function reducer(state: number[], action: Action): number[] {
  switch (action.type) {
    case 'add':
      return state.toSpliced(state.length, 0, action.payload);
    case 'removeAt':
      return state.toSpliced(action.index, 1);
    default:
      return state;
  }
}
```

## Performance notes

- Immutable vs in-place:
  - `toSorted`, `toReversed`, `toSpliced`, `with` allocate a new array (extra memory, but safer for state).
  - `sort`, `reverse`, `splice` mutate in place (no extra array, but dangerous for shared references/React state).
- Big‑O highlights:
  - Index access: O(1)
  - Push/pop (end): amortized O(1)
  - Shift/unshift (start): O(n) (elements reindexed)
  - toSpliced/concat/slice: O(n) copy cost proportional to result size
- Sparse arrays (holes) degrade performance of iteration and some VMs’ optimizations—prefer dense arrays.

## Compatibility & polyfills (ES2023 methods)

Methods: `Array.prototype.toSorted`, `toReversed`, `toSpliced`, `with`.

- Supported in modern evergreen browsers and Node 20+. For older targets, use a ponyfill/polyfill.
- Recommended: Babel + core-js or a lightweight ponyfill where needed.

Ponyfill example (drop into a utilities module):

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

Usage with fallback:

```js
const sorted = arr.toSorted ? arr.toSorted(cmp) : toSorted(arr, cmp);
```

## TypeScript tips

- Prefer `readonly T[]` for immutable inputs.
- Use tuples for fixed-length heterogeneous lists: `readonly [number, string]`.
- Narrowing unknown values:

```ts
function ensureArray<T>(x: T | T[]): T[] {
  return Array.isArray(x) ? x : [x];
}
```

## Common pitfalls

- Avoid `for...in` on arrays (iterates keys including custom properties). Use `for...of` or classic `for`.
- Don’t use `delete arr[i]` (creates a hole). Use `toSpliced(i, 1)` or `splice(i, 1)`.
- Be careful comparing arrays: `[] === []` is false; compare contents or serialize.
- `JSON.stringify` skips holes but keeps `undefined` inside arrays as `null` in JSON arrays.

Further reading:

1. [Array Methods](./array-methods.md)
1. [Array Properties](./array-properties.md)
1. [Array Patterns](./array-patterns.md)
