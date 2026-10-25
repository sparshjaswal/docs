---
title: "Collections and iteration"
sidebar_label: "Collections and iteration"
---

# Collections and iteration

A **collection** holds several values. Choose one by the job it must do: an array keeps a list in order, a Set keeps unique values, and a Map connects keys to values. For a school library, you might keep books in an array, unique tags in a Set, and books looked up by ID in a Map.

Start after [arrays](./arrays/index.md), [objects](./objects-and-classes.md), and functions.

1. Compare array, Map, and Set using the same small set of records.
2. Count words with a Map: read the old count, add one, and save the new count.
3. Learn the **iterator**, an object that supplies the next value when asked.
4. Return to generators, asynchronous streams, and recent helper methods after ordinary loops feel comfortable.

An **iterable** is something that can provide an iterator. Keep the container and the act of stepping through it separate in your explanation.

## Choose a collection

| Structure | Good fit | Important limitation |
| --- | --- | --- |
| Array | Ordered sequence, index access, transformations | Membership/search may require scanning |
| Object | A record with named fields | Keys are strings or symbols; inherited properties exist unless the prototype is null |
| Map | Key/value lookup with arbitrary key identities | Object keys compare by identity, not field contents |
| Set | Membership and distinct values | Objects with equal-looking fields remain distinct |
| WeakMap / WeakSet | Metadata tied to object lifetime | No enumeration or reliable size; eligible symbols are also supported from ES2023 |
| TypedArray | Fixed-format numeric binary views | Range, coercion, and precision depend on element type |

The specification does not promise that every engine implements Map/Set as the same hash table. Describe complexity assumptions separately from observable behavior.

## Build a frequency map

```js runnable
const counts = new Map();
for (const word of ['red', 'blue', 'red']) {
  counts.set(word, (counts.get(word) ?? 0) + 1);
}
console.log(JSON.stringify([...counts]));
```

```text output
[["red",2],["blue",1]]
```

This example combines ES2015 collections and ES2020 nullish defaults. [Map initialization](#initialize-a-map-entry--es2026) can help when a missing key needs a computed value.

## Iterable versus iterator

An **iterable** supplies a `Symbol.iterator` method. Calling it returns an **iterator**, whose `next()` returns `{value, done}`. Arrays are iterable; their iterator objects have consumable state. A generator creates an iterator using `yield`.

```js runnable
function* range(start, end) {
  for (let value = start; value <= end; value++) yield value;
}
const iterator = range(2, 4);
console.log(iterator.next().value);
console.log(JSON.stringify([...iterator]));
console.log(JSON.stringify([...iterator]));
```

```text output
2
[3,4]
[]
```

Create a new generator object to iterate again. Spreading an infinite generator never completes; consume only the required portion. Early exit from `for...of` calls an iterator’s `return` method when available, allowing generator `finally` blocks to clean up.

## Async iteration

An async iterable supplies `Symbol.asyncIterator`. Its iterator’s `next()` returns a promise for an iteration result. `for await...of` consumes this protocol and can also consume synchronous iterables. Use it for paginated data or streamed chunks; it is not a request to run all iterations concurrently.

Continue below with async generators (ES2018), lazy iterator helpers (ES2025), and async collection and iterator sequencing (ES2026).

## Avoid the object-key trap

```js runnable
const first = { id: 1 };
const second = { id: 1 };
const seen = new Set([first, second]);
console.log(seen.size);
console.log(new Set([NaN, NaN, 0, -0]).size);
```

```text output
2
2
```

If the domain uses a stable ID, key by that ID rather than by object identity. If records can share an ID with conflicting data, decide whether to keep the first, keep the last, merge, or reject the conflict.

## Map and Set operations — ES2015

Map exposes set/get/has/delete/clear, size, entries/keys/values, and forEach. Set exposes add/has/delete/clear, size, values/keys/entries, and forEach. Both iterate in insertion order. Updating a Map key preserves its position; deleting and reinserting appends it. SameValueZero treats NaN as equal to itself and treats positive/negative zero as equal.

Use has to distinguish an absent key from one storing undefined. A property assignment such as `map[key] = value` does not create a Map entry. Map.forEach receives `(value, key, map)`; Set.forEach supplies its value twice for the first two arguments. Weak collections have a smaller, non-enumerable API; see [weak references](./metaprogramming-and-memory.md).

```js runnable
const cache = new Map([['present', undefined]]);
console.log(cache.has('present'), cache.has('missing'));
cache.set('second', 2).set('present', 3);
console.log([...cache.keys()].join(', '));
cache.delete('present');
cache.set('present', 4);
console.log([...cache.keys()].join(', '));
```

```text output
true false
present, second
second, present
```

## Delegation, sent values, and cleanup

Generator functions are called to create suspended generator objects; their body starts at the first next call. `yield` suspends with a value, and a later next(value) supplies the result of that yield expression. `yield*` delegates to another iterable. A generator's final return value is available in a done result, but is not one of the values visited by for-of.

```js runnable
function* sequence() {
  try {
    yield* [1, 2, 3];
  } finally {
    console.log('closed');
  }
}
for (const value of sequence()) {
  console.log(value);
  break;
}
```

```text output
1
closed
```

Early loop exit invokes return when present. A custom iterator can expose next, return, and throw, but their semantics must follow the protocol. An iterable that returns itself is usually single-use; one that constructs a new iterator can be replayed. Do not rely on the garbage collector to close abandoned iteration.

## Stream asynchronously — ES2018

```js runnable
async function* pages() {
  try {
    yield ['first', 'second'];
    yield ['third'];
  } finally {
    console.log('stream closed');
  }
}
for await (const page of pages()) {
  console.log(page.join(', '));
  break;
}
```

```text output
first, second
stream closed
```

Async generators combine suspension with promise-based results. `for await...of` awaits each step; a break awaits iterator closure. Consumption controls when the next item is requested, which supports pull-based backpressure, but cannot undo work the producer already started. If a synchronous generator yields a rejecting promise, the async-from-sync adaptation has cleanup subtleties; prefer an async generator when the protocol includes asynchronous failures.

## Group records — ES2024

```js runnable requires=Object.groupBy
const tasks = [
  { title: 'Read', state: 'done' },
  { title: 'Build', state: 'todo' },
  { title: 'Test', state: 'todo' },
];
const groups = Object.groupBy(tasks, task => task.state);
console.log(groups.todo.map(task => task.title).join(', '));
console.log(Object.getPrototypeOf(groups) === null);
```

```text output
Build, Test
true
```

The result has a null prototype, so do not call `groups.hasOwnProperty`. `Object.groupBy` coerces keys to property keys. `Map.groupBy` supports arbitrary keys, including object identity. Elements themselves are not cloned.

## Set algebra — ES2025

```js runnable requires=Set.prototype.intersection
const required = new Set(['read', 'write']);
const granted = new Set(['read', 'share']);
console.log([...required.intersection(granted)].join(', '));
console.log([...required.difference(granted)].join(', '));
console.log(required.isSubsetOf(granted));
```

```text output
read
write
false
```

The operations do not mutate the input sets. Do not confuse set membership with permission enforcement: a server still needs to authorize actual operations.


| Method | Result |
| --- | --- |
| union | Elements in either set |
| intersection | Elements in both sets |
| difference | Elements in the receiver but not the other set |
| symmetricDifference | Elements in exactly one set |
| isSubsetOf / isSupersetOf | Every element of one set is contained in the other |
| isDisjointFrom | No common elements |

The argument can be set-like (size, has, keys), including a Map viewed through its keys; an ordinary Array is not set-like. Result iteration order follows each operation's rules, so do not assume every operation keeps the receiver's order; intersection can traverse the smaller set. [Set methods proposal](https://github.com/tc39/proposal-set-methods).

## Lazy iterator helpers — ES2025

```js runnable requires=Iterator.from
let visited = 0;
const selected = Iterator.from([1, 2, 3, 4, 5])
  .map(value => { visited++; return value * 10; })
  .filter(value => value >= 20)
  .take(2)
  .toArray();
console.log(JSON.stringify(selected));
console.log(visited);
```

```text output
[20,30]
3
```

Intermediate helpers are lazy; `toArray` consumes the pipeline. Iterator instances are usually single-use. These are synchronous iterator helpers, not a promise-aware async pipeline.


| Helper | Consumption |
| --- | --- |
| map / filter / flatMap | Lazy transformation, selection, or one-level iterable expansion |
| take / drop | Limit or skip a number of yielded values |
| reduce / forEach | Consume to an accumulator or side effects |
| some / every / find | Consume until an answer is known or input ends |
| toArray | Consume and retain all remaining values |

Iterator.from adapts an iterable or iterator into the helper-capable interface. These callbacks are synchronous: an async predicate returns a truthy Promise instead of awaiting a boolean. Reduce on empty input without an initial value throws. Terminal operations consume state, and short-circuiting helpers close their input where required. A take limit is essential before collecting an infinite source. [Iterator helpers proposal](https://github.com/tc39/proposal-iterator-helpers).

## Sequence iterables — ES2026

```js runnable requires=Iterator.concat
const combined = Iterator.concat(['read', 'write'], new Set(['test']));
console.log(combined.take(2).toArray().join(', '));
```

```text output
read, write
```

`Iterator.concat` traverses one iterable before moving to the next. It does not concatenate eagerly allocated arrays or consume inputs concurrently. Pass iterable objects such as arrays, sets, and generator objects; a primitive string is not accepted by this API. Iterators are stateful and can be exhausted. [Iterator sequencing proposal](https://github.com/tc39/proposal-iterator-sequencing).

## Initialize a map entry — ES2026

```js runnable requires=Map.prototype.getOrInsertComputed
const cache = new Map([['zero', 0], ['unset', undefined]]);
let calls = 0;
const create = key => { calls++; return key.length; };
console.log(cache.getOrInsertComputed('zero', create));
console.log(cache.getOrInsertComputed('new', create));
console.log(cache.getOrInsert('unset', 99));
console.log(calls);
```

```text output
0
3
undefined
1
```

Both `Map` and `WeakMap` gain `getOrInsert` and `getOrInsertComputed`. Presence matters: an existing `undefined` remains a stored value. The computed form invokes its callback only for a missing key. By contrast, arguments passed to `getOrInsert(key, expensive())` are evaluated before the method runs, even when the key exists. WeakMap keys must still satisfy weak-key eligibility rules. [Upsert proposal](https://github.com/tc39/proposal-upsert).

## Collect async input — ES2026

```js runnable requires=Array.fromAsync
async function* amounts() {
  yield 2;
  yield 5;
}
const doubled = await Array.fromAsync(amounts(), async value => value * 2);
console.log(JSON.stringify(doubled));
```

```text output
[4,10]
```

The method returns a promise for an array and consumes input progressively. It accepts async iterables, synchronous iterables, or array-like input. Its mapper result is awaited. It is not a concurrent replacement for `Promise.all`: compare sequential consumption with collecting already-started independent operations. For an unbounded stream, use `for await...of` and process incrementally instead of retaining every value. [API behavior](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fromAsync).


For a synchronous iterable, Array.fromAsync awaits yielded values before passing them to its mapper. For a custom async iterable it uses each async step's value according to that protocol; it does not generally add the same extra value-await step before a mapper. The mapper's result is awaited in either case. Already-created promises may already be running before iteration begins: sequential consumption alone does not establish a concurrency limit over their creation.

**Practice extension:** group records using owner objects as keys; implement a lazy search over an infinite generator; cache undefined without rerunning an initializer; compare Promise.all, Array.fromAsync, and incremental for-await consumption on bounded input.

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](./index.md#interview-preparation).

### 1. When would Map distinguish keys that an ordinary object merges?

<details>
<summary>Answer and worked example</summary>

Map can use object identities directly. Ordinary object property keys are strings or symbols, so using ordinary objects as keys coerces them and can create collisions.

```js runnable
const a = { id: 1 };
const b = { id: 1 };
const map = new Map([[a, 'first'], [b, 'second']]);
console.log(map.size, map.get(a));
const record = Object.create(null);
record[a] = 'first';
record[b] = 'second';
console.log(Object.keys(record).length, record[a]);
```

**Expected output**

```text output
2 first
1 second
```

These two plain objects coerce to the same string property key, but their identities remain different Map keys. A null prototype avoids inherited-key surprises; it does not prevent key coercion.

</details>

### 2. Can a generator object be iterated twice to replay its values?

**Apply it:** Predict a second traversal of one generator object, then stop a fresh generator early and observe its cleanup.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

An exhausted generator stays exhausted. A generator function can create a fresh generator for another traversal. Distinguish an iterable factory from one iterator’s progress, and close a resource-owning iterator when consumption ends early.

A generator function produces an iterator with its own progress. The `finally` block makes normal early closing visible.

```js runnable
function* values() {
  try {
    yield 1;
    yield 2;
  } finally {
    console.log('cleanup');
  }
}
const iterator = values();
console.log([...iterator].join(','));
console.log([...iterator].length);
for (const value of values()) {
  console.log(value);
  break;
}
```

**Expected output**

```text output
cleanup
1,2
0
1
cleanup
```

The first spread consumes the iterator to completion, including cleanup, before logging the resulting values. The second spread finds it exhausted. `for...of` closes the fresh generator on `break`, entering its `finally`. Merely abandoning an iterator reference does not guarantee this explicit cleanup path; resource ownership still needs a defined lifetime.

</details>

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](./workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 11. Maps sets and frequency counting {/* #workbook-11 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** count repeated values and keep unique values.

Trace the fruit list one item at a time. For each fruit, read its current count, use zero if no count exists, and store one more. Afterward, compare looking up a count with asking whether a key exists.

The Set example removes repeated numbers while keeping the first insertion order. Use [collection choice](#choose-a-collection) and [Map/Set operations](#map-and-set-operations--es2015) for the rules. Separate object instances remain different keys or members even when their properties look the same; decide what identity your task needs.

**Worked example**

```js
const counts = new Map();
for (const fruit of ["apple", "pear", "apple"]) {
  counts.set(fruit, (counts.get(fruit) ?? 0) + 1);
}
console.log(counts.get("apple"));
console.log(counts.has("banana"));
console.log([...new Set([3, 3, 1])].join(","));
```

**Expected output**

```text
2
false
3,1
```

The first apple starts at zero and becomes one; the second becomes two. The set keeps the first insertion order while removing the repeated 3. Object-based counting needs extra care with special property names; Map keeps the intent clearer.

**Trace the example step by step**

1. The first apple has no count, so undefined ?? 0 produces 0 and its stored count becomes 1.

2. pear also starts at 0 and becomes 1. The second apple retrieves 1 and stores 2.

3. counts.has("banana") is false because no such key has been inserted.

4. The Set keeps 3 and 1. Seeing 3 again does not add another entry, and iteration preserves the insertion order of retained values.

**Common mistakes and how to reason about them**

Do not confuse map.size with array.length, or map.set with bracket assignment. map[key] = value creates an ordinary property on the Map object rather than an entry in its collection. For content-based deduplication, define a suitable key, such as an ID, instead of expecting object identity to compare fields.

</details>

Find **11A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-11-answer">
<summary>Check your reasoning and answer</summary>

**11A.** 2. Numeric 1 and string "1" are different values.

The repeated numeric 1 is stored once, and the string "1" is separate, making size 2. A Set uses its equality rule without automatically converting numeric-looking strings into numbers.

**11B.** The key may be missing or may have undefined stored as its value. Use has to tell them apart.

A lookup result alone cannot distinguish absence from stored undefined. Use has when the distinction matters. For a map known to store only positive counts, defaulting a missing get result to zero follows the contract.

**11C.** Count first, then scan the original sequence again to preserve order.

For "swiss", final counts are s:3, w:1, and i:1. The second scan encounters w before i, so w is returned. For "aabb", none qualifies and null expresses absence. With average constant-time map operations, the two passes give O(n) time.

**Reference code**

```js
function firstUnique(text) {
  const counts = new Map();
  for (const c of text) counts.set(c, (counts.get(c) ?? 0) + 1);
  for (const c of text) if (counts.get(c) === 1) return c;
  return null;
}
```

**Check the result**

```js
assert.equal(firstUnique("aabbcdd"), "c");
assert.equal(firstUnique("aabb"), null);
assert.equal(firstUnique(""), null);
```

</details>

### 18. Iterators generators and numeric tools {/* #workbook-18 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** recognize two advanced tools without mixing their jobs.

First trace `range(2, 5)`: each request resumes the generator, produces the current number, and pauses again at `yield`. The end value is excluded. Then read the BigInt calculation and the decimal comparison as separate examples.

Use [iterables and iterators](#iterable-versus-iterator) for the sequence and [numbers and BigInt](./numbers-and-math.md) for arithmetic. BigInt has no fractional part, and mixing it with Number arithmetic needs an explicit conversion decision. Return to binary storage and dates in their own lessons when a task needs them.

**Worked example**

```js
function* range(start, end) {
  for (let n = start; n < end; n++) yield n;
}
console.log([...range(2, 5)].join(","));
const large = 9007199254740993n;
console.log(String(large + 1n));
console.log(0.1 + 0.2 === 0.3);
```

**Expected output**

```text
2,3,4
9007199254740994
false
```

range generates values as they are requested. Spreading consumes the generator into an array. The n suffix creates BigInt literals; String produces a printable decimal form without the suffix.

**Trace the example step by step**

1. range(2, 5) creates a generator. Its loop first yields 2, then resumes to yield 3 and 4.

2. When n reaches 5, n &lt; end becomes false and the generator finishes. Spread collects the yielded values into an array.

3. The n suffix creates a BigInt literal. Adding 1n produces the exact next integer, beyond Number's safe range.

4. String converts that BigInt to printable decimal text. The final equality test reveals the floating-point rounding difference.

**Common mistakes and how to reason about them**

Do not use bitwise operators as a general replacement for mathematical operations on large Number values; they usually convert to 32-bit integers. Do not mix 1n and 1 in arithmetic. For huge integer algorithms, an addition itself can grow more expensive as the number of digits grows, so the usual constant-time arithmetic model needs qualification.

</details>

Find **18A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-18-answer">
<summary>Check your reasoning and answer</summary>

**18A.** It returns an object with done: true and value: undefined for this generator.

Once this generator finishes, another next() returns done: true and value: undefined. It does not restart automatically. Call the generator function again to create a fresh iterator.

**18B.** BigInt and Number cannot be mixed in addition. Use 1n + 1n or explicitly convert when appropriate.

BigInt and Number are different numeric types with different precision rules. JavaScript requires an explicit choice instead of silently converting one arithmetic operand. Use 1n + 1n when integer BigInt arithmetic is intended.

**18C.** Advance by 2 on each iteration and yield each value.

The generator starts at 0 and adds 2 after each yield, so every yielded value is even. The strict upper bound excludes limit itself. A limit of 0 produces no values; a limit of 5 produces 0, 2, and 4.

**Reference code**

```js
function* evenNumbers(limit) {
  for (let n = 0; n < limit; n += 2) yield n;
}
```

**Check the result**

```js
assert.deepEqual([...evenNumbers(7)], [0, 2, 4, 6]);
assert.deepEqual([...evenNumbers(0)], []);
```

</details>

<span id="practice" />

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **11A — What is new Set([1, 1, "1"]).size?** | **Must fix** | [Worked example](#workbook-11) | [Answer](#workbook-11-answer) |
| **11B — Why can get(key) === undefined be ambiguous?** | **Must fix** | [Worked example](#workbook-11) | [Answer](#workbook-11-answer) |
| **11C — Write firstUnique(text), returning the first non-repeated code point, or null when none exists.** | **Must fix** | [Worked example](#workbook-11) | [Answer](#workbook-11-answer) |
| **18A — What happens when an exhausted generator receives another next() call?** | **Must fix** | [Worked example](#workbook-18) | [Answer](#workbook-18-answer) |
| **18B — Why is 1n + 1 invalid?** | **Must fix** | [Worked example](#workbook-18) | [Answer](#workbook-18-answer) |
| **18C — Write a generator evenNumbers(limit) yielding even integers from 0 up to, but excluding, a nonnegative integer limit.** | **Must fix** | [Worked example](#workbook-18) | [Answer](#workbook-18-answer) |
| Group words by first letter using a Map; preserve encounter order within each group. | Practice | — | — |
| Write an iterable that produces a fresh finite iterator on every iteration. | Practice | — | — |
| Consume only five entries from a generator without first allocating all its values. | Practice | — | — |

## Continue learning

References: [keyed collections](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections), [iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols). Return to [the learning path](./index.md).
