---
id: javascript-symbol
slug: /javascript/symbol
title: "Symbols and language protocols"
sidebar_label: "Symbols and protocols"
---

# Symbols and language protocols

**After objects.** A Symbol is a value that can act as a unique property key. Two symbols can have the same description and still be different keys, like two school lockers with the same decorative label but different locks.

1. Create two symbols and compare them.
2. Use one as an object key and read that property with the same symbol.
3. Compare ordinary `Symbol()` with the shared registry used by `Symbol.for`.
4. Learn well-known symbols when studying iteration and other language protocols.

A **protocol** is an agreed way for objects to take part in an operation. A symbol's description helps debugging; it is not its identity and does not make the property private.

```js runnable
const first = Symbol('id');
const second = Symbol('id');
const record = { [first]: 42, name: 'Guide' };
console.log(first === second);
console.log(Object.keys(record).join(', '));
console.log(Reflect.ownKeys(record).length);
console.log(Symbol.for('shared') === Symbol.for('shared'));
```

```text output
false
name
2
true
```

`Symbol.for` uses a registry; ordinary `Symbol()` creates a new identity. Symbol-keyed properties are not private: reflection can discover them. They are omitted by `Object.keys` and ordinary JSON serialization.

## Well-known symbols

The language uses symbols such as `Symbol.iterator`, `Symbol.asyncIterator`, `Symbol.toPrimitive`, and `Symbol.toStringTag` as protocol hooks. Implementing `Symbol.iterator` makes an object work with `for...of` and array spread. Read [collections and iteration](./collections-and-iteration.md) before adding custom protocol behavior.

Non-registered symbols can be weak collection keys from [ES2023 weak-reference support](./metaprogramming-and-memory.md#weak-collections-and-eligible-symbols). Do not infer this support from the presence of Symbol itself.

## Symbol descriptions and protocol inventory

ES2019 adds the description accessor: Symbol('id').description is 'id', while Symbol().description is undefined. Equal descriptions do not imply equal symbols. Symbol.keyFor retrieves a registered symbol's key; it returns undefined for an unregistered one.

| Hook | What it customizes |
| --- | --- |
| Symbol.iterator / Symbol.asyncIterator | Synchronous iteration (2015) / asynchronous iteration (2018) |
| Symbol.toPrimitive / Symbol.toStringTag | Primitive conversion / descriptive object tag |
| Symbol.hasInstance | instanceof behavior |
| Symbol.species | Constructor selection for certain derived results |
| Symbol.isConcatSpreadable | Whether Array.concat expands an object |
| Symbol.unscopables | Exclusion from legacy with-environment name lookup |
| Symbol.match / replace / search / split | String-to-regex protocol dispatch (2015) |
| Symbol.matchAll | All-match iteration dispatch (2020) |

Custom protocol hooks can execute user code during otherwise ordinary operations. A toStringTag is descriptive, not an unforgeable brand. with is forbidden in strict mode; understanding unscopables helps explain legacy behavior, not justify introducing with in new code.

```js runnable
const distance = {
  metres: 12,
  [Symbol.toPrimitive](hint) {
    return hint === 'string' ? `${this.metres} m` : this.metres;
  },
};
console.log(String(distance));
console.log(distance + 3);
console.log(Symbol('id').description, Symbol().description);
```

```text output
12 m
15
id undefined
```

<span id="practice" />

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](./index.md#interview-preparation).

### 1. Are symbols with identical descriptions equal, and are symbol properties private?

<details>
<summary>Answer and worked example</summary>

Each Symbol call creates a distinct primitive. Descriptions are labels, not identity. Symbol keys avoid accidental name collisions but remain discoverable through reflection.

```js runnable
const first = Symbol('id');
const second = Symbol('id');
const record = { name: 'Ada', [first]: 7 };
console.log(first === second);
console.log(Object.keys(record).join(', '));
console.log(Reflect.ownKeys(record).length);
console.log(Symbol.for('shared') === Symbol.for('shared'));
```

**Expected output**

```text output
false
name
2
true
```

Object.keys excludes symbol keys, while Reflect.ownKeys includes them. Symbol.for uses a registry and therefore returns the same registered symbol for the same key.

</details>

### 2. How do well-known symbols differ from symbols you create for application keys?

**Apply it:** An object has a Symbol.iterator method that returns an array. Decide whether that is enough to satisfy the iterator protocol.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

Well-known symbols name language protocols, such as Symbol.iterator for iteration. The value assigned under that key must satisfy the protocol. They are not secret keys, and a registered Symbol.for value is not eligible as a weak-collection key.

**Protocol answer:** calling `object[Symbol.iterator]()` must return an **iterator object**, which has a callable `next` method. Returning an array directly is insufficient: an array is iterable, but the array itself is not its iterator. Return `items[Symbol.iterator]()` or implement the method as a generator that yields the items.

Each `next()` result must be an object with `done` and/or `value` fields following the protocol. Decide whether each call to `Symbol.iterator` creates fresh progress or intentionally returns the same single-use iterator.

The symbol identifies a protocol hook; it does not enforce a correct implementation or hide the property. A symbol made with `Symbol("iterator")` has the same description text but is not `Symbol.iterator`, so it does not enable `for...of`. See [collections and iteration](./collections-and-iteration.md) for complete implementations.

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| Create two symbol-keyed properties with the same description and prove both remain present. Then explain why private class fields and symbol keys solve different problems. | Practice | — | — |

## Continue learning

References: [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), [ECMAScript symbol specification](https://tc39.es/ecma262/2026/multipage/fundamental-objects.html#sec-symbol-objects).
