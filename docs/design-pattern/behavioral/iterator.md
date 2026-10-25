---
id: design-pattern-behavioral-iterator
title: "Iterator Pattern 🔄"
slug: /design-pattern/behavioral/iterator
sidebar_label: "Iterator"
---

# Iterator Pattern 🔄

An Iterator remembers where you are in a collection and gives you the next item. Think of a bookmark that moves forward while the book stays in place.

## Example: traversing the location list {/* #javascript-walkthrough */}

This example wraps an array in a List and provides an Iterator containing the array and its current index. Callers advance using `hasNext()` and `next()`.

```js runnable
function Iterator(list) {
  this.index = 0;
  this.list = list;
  this.hasNext = function () {
    return this.index < this.list.length;
  };
  this.next = function () {
    var element = null;
    if (this.index < this.list.length) {
      element = this.list[this.index];
      this.index = this.index + 1;
    }
    return element;
  };
}
function List() {
  this.count = 0;
  this.element = new Array();
  this.add = function (element) {
    this.element.push(element);
    this.count = this.count + 1;
  };
  this.get = function (index) {
    return this.element[index];
  };
  this.size = function () {
    return this.count;
  };

  this.iterator = function () {
    return new Iterator(this.element);
  };
}
/////////////////////test///////////////////////////////////////////////////////
var list = new List();
list.add("Berkeley University");
list.add("Market Street");
list.add("Polo Alto");
list.add("Cuptino");
var iterator = list.iterator();
while (iterator.hasNext()) {
  var obj = iterator.next();
  console.log(String(obj + " -> ").trim());
}
```

```text output
Berkeley University ->
Market Street ->
Polo Alto ->
Cuptino ->
```

<span id="walk-through-the-source" />
<span id="understand-the-collaboration" />

## How it works

Iterator separates traversal position from collection contents. `List` owns the array; each `iterator()` call creates an Iterator with its own cursor starting at zero and a reference to that array. Callers request successive values without managing the index themselves.

`hasNext()` checks the cursor without changing it. `next()` reads the current entry and advances only when an entry is available. The loop prints the four locations in insertion order, then stops when `hasNext()` becomes false.

## What the example does not establish

This is a custom protocol rather than JavaScript’s `Symbol.iterator` protocol. `next()` returns null after exhaustion, so callers need `hasNext()` to distinguish completion from a stored null. Iterators have independent cursors but share the live backing array; mutation during traversal is not specified.

## Practical case: traverse a news collection

A native iterator lets `for...of` request values without exposing storage details. A generator supplies the standard `{ value, done }` protocol automatically, and each call creates a fresh cursor.

```js runnable
class NewsFeed {
  #items;
  constructor(items) { this.#items = items.map((item) => Object.freeze({ ...item })); }
  *[Symbol.iterator]() {
    for (const item of this.#items) yield item;
  }
}
const feed = new NewsFeed([
  { title: "JavaScript workshop", date: "2026-01-10" },
  { title: "Pattern discussion", date: "2026-01-17" },
]);
for (const item of feed) console.log(`${item.title} | ${item.date}`);
const first = feed[Symbol.iterator]();
const second = feed[Symbol.iterator]();
console.log(first.next().value.title === second.next().value.title);
console.log([...feed].length);
```

```text output
JavaScript workshop | 2026-01-10
Pattern discussion | 2026-01-17
true
2
```

A table renderer can consume these records and assign each cell's `textContent`. For an existing array, `items.forEach(renderRow)` is often sufficient; a custom collection is useful when traversal should hide representation or compute items lazily. `forEach` does not provide a resumable cursor or an ordinary early `break`.

The constructor copies this flat data to make a stable collection. Nested objects would need their own ownership policy. Loading pages over a network would require an asynchronous iterator and cancellation, not this synchronous loop.

## Design decisions and failure modes

An iterator hides traversal state, but the collection may change while traversal is in progress. Decide whether iteration uses a snapshot, observes changes, or rejects mutation.

## Exercises

Remove the current item during iteration, then stop early while reading a paginated remote source. Specify the expected sequence and cleanup.

<details>
<summary>Expected reasoning and checks</summary>

Test the chosen mutation policy explicitly. A resource-owning iterator needs early-exit cleanup; an async source also needs cancellation and page-size limits. Yielding values lazily does not imply that fetching them is free.

</details>

## Interview questions & answers

<details>
<summary>Iterator or a materialized array?</summary>

An array is simple when all values fit and repeated traversal is useful. Iteration can reduce peak memory or defer work, but a consumed iterator may be single-use and can fail partway through.

</details>

**Key takeaway:** Define traversal consistency, lifetime, and early-exit behavior.

## Continue reading

Use the shared [review checkpoint](../index.md#completion-checkpoint), then return to the [pattern catalog](../index.md).
