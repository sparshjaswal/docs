---
id: functional-programming-referential-programming-getting-started
title: 'Referential transparency'
slug: /functional-programming/referential-programming/getting-started
sidebar_label: '3. Referential transparency'
sidebar_position: 4
description: 'Referential transparency: small JavaScript examples, step-by-step explanations, and checked exercises.'
---

# Referential transparency

Can you replace a calculation with its answer without changing what the program does? When the answer is yes, the calculation is called **referentially transparent**. For example, replacing a side-effect-free `square(4)` with `16` should leave the surrounding calculation unchanged.

**Before you start:** read [pure functions](../pure-function-and-side-effect/getting-started.md) and [composition](../function-and-composition/getting-started.md). You will learn when substitution and caching preserve behavior, and where JavaScript needs extra care.


**First pass:** Start with numbers, then compare two new objects. Learn why keeping one saved object can change later behavior. Read the caching example after that; the mathematical vocabulary is an optional deeper step.

## Replace a calculation with its answer {/* #what-is-referential-transparency */}

```js runnable
const square = (number) => number * number;
const original = square(4) + square(4);
const replaced = 16 + 16;
console.log(original);
console.log(replaced);
```

```text output
32
32
```

For ordinary numeric inputs in this example, calculating `square(4)` has no observable action. Replacing it with `16` preserves the result.

A function that prints a message and returns `16` is different: replacing the call with `16` removes the message. A clock read is different too: replacing two reads with one stored value can change the result.

## Same contents are not the same object {/* #substitutability */}

JavaScript can observe object identity. Two new objects can contain the same values and still compare unequal.

```js runnable
const makePoint = () => ({ x: 1, y: 2 });
console.log(makePoint() === makePoint());
const saved = makePoint();
console.log(saved === saved);
```

```text output
false
true
```

Replacing both calls with a single cached object changes the equality result. It also makes callers share any later mutations. When we call an object-building function pure in this course, callers compare contents and leave returned data unchanged. This way of thinking is called **value semantics**. Strict substitution in arbitrary JavaScript must account for identity, getters, proxies, and mutation as well.

Do not confuse referential transparency with referential equality (`===` on objects). The first is a property of an expression; the second checks whether references point to the same object.

## Memoization is a contract, not a free optimization {/* #memoization-and-substitution */}

Memoization remembers a result for an input and returns it on a later call. It works only when returning the saved result preserves the behavior callers expect.

```js runnable
const memoizeInteger = (fn) => {
  const cache = new Map();
  return (number) => {
    if (!Number.isSafeInteger(number) || Object.is(number, -0)) {
      throw new TypeError('Use a safe integer other than negative zero');
    }
    if (!cache.has(number)) cache.set(number, fn(number));
    return cache.get(number);
  };
};
const square = memoizeInteger((number) => number * number);
console.log(square(12));
console.log(square(12));
```

```text output
144
144
```

This teaching helper supports one safe integer argument except negative zero. The supplied function must depend only on that number and return a value safe to share. Its cache grows with the number of different inputs and never removes old entries. For exact integer squares, keep the result within the safe integer range too.

| Question before caching                                     | What can go wrong                                                |
| ----------------------------------------------------------- | ---------------------------------------------------------------- |
| Does the function read time, randomness, or changing state? | The saved result becomes stale or suppresses a needed action.    |
| Does the key include every input?                           | Different requests can receive the same cached result.           |
| Are keys objects?                                           | Identity-based keys do not detect changes to an object's fields. |
| Can callers change the returned object?                     | One caller can change another caller's result.                   |
| Is the cache bounded?                                       | Retained keys and results can keep memory alive.                 |

`JSON.stringify(args)` is not a general cache-key algorithm: `undefined` and `null` can collide in arrays, some values are omitted, and cycles fail. Choose a key for your actual input domain. Wrapping recursive Fibonacci only at the outer call caches repeated top-level requests; it does not cache its internal recursive calls.

## Reason about steps, then check the assumptions {/* #equational-reasoning */}

For pure callbacks that depend only on the element, mapping twice can be expressed as one map:

```js runnable
const values = [1, 2, 3];
const double = (value) => value * 2;
const addOne = (value) => value + 1;
console.log(JSON.stringify(values.map(double).map(addOne)));
console.log(JSON.stringify(values.map((value) => addOne(double(value)))));
```

```text output
[3,5,7]
[3,5,7]
```

If the callbacks log, read the array argument, or change shared state, the order and observed data can differ. The rewrite needs the assumptions, not just matching output for one example.

Arithmetic laws also need care. JavaScript Numbers use floating-point arithmetic:

```js runnable
console.log(1e16 + -1e16 + 1);
console.log(1e16 + (-1e16 + 1));
```

```text output
1
0
```

Regrouping the same additions changes the rounded result. Purity does not make floating-point arithmetic obey every law of exact real arithmetic.

## Optional mathematical vocabulary {/* #mathematical-foundations */}

| Term                         | Meaning here                                               | Small example                          |
| ---------------------------- | ---------------------------------------------------------- | -------------------------------------- |
| Mapping                      | A rule from input values to output values                  | `number => number * 2`                 |
| Lambda                       | An anonymous function                                      | `x => x + 1`                           |
| Beta reduction               | Substitute an argument into a function body                | `(x => x + 1)(3)` becomes `3 + 1`.     |
| Alpha renaming               | Rename a bound variable without changing what it refers to | `x => x + 1` and `n => n + 1`          |
| Identity function            | Return the input unchanged                                 | `x => x`                               |
| Associativity of composition | Group compatible pure function compositions differently    | Both groupings calculate `f(g(h(x)))`. |
| Monoid                       | An associative operation plus an identity value            | String concatenation with `''`         |

Renaming a variable must not capture a name from another scope. Similarly, removing an unused call is safe only when the call has no effects or observable failure. A JavaScript engine may optimize code, but these lessons do not promise a particular optimization.

Church encoding represents data using functions. Here a pair stores two values by remembering them in a closure:

```js runnable
const pair = (first, second) => (select) => select(first, second);
const first = (a, b) => a;
const second = (a, b) => b;
const point = pair(3, 5);
console.log(point(first));
console.log(point(second));
```

```text output
3
5
```

This is useful for understanding the theory. An array or object usually expresses a pair more clearly in application code. The next lessons connect substitution to [functor laws](../functor-functions/getting-started.md#functor-laws) and [monad laws](../monads/getting-started.md#monad-laws).

## What tests can show {/* #testing-referential-transparency */}

Tests can find changing results, input mutation, unexpected output, or unsafe sharing. They cannot prove purity for every possible input and environment. Avoid a test helper that declares a function “pure” merely because repeated JSON strings match.

Run the [worked exercises](./exercises.js):

```sh
node docs/functional-programming/referential-programming/exercises.js
```

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| Replace a pure calculation | Practice | Expected behavior: The final number stays the same<br />Case to check: The original call does not log. | — |
| Compare two new records | Practice | Expected behavior: Equal contents can have different references<br />Case to check: Explain why caching changes `===`. | — |
| Memoize one integer input | Practice | Expected behavior: Repeated input reuses its result<br />Case to check: Zero and a cached `undefined` result work. | — |
| Refuse unsafe cache keys | Practice | Expected behavior: Reject unsupported inputs<br />Case to check: Negative zero, fractions, and objects are rejected. | — |
| Combine two maps | Practice | Expected behavior: Same element values with pure unary callbacks<br />Case to check: Explain why logging changes the reasoning. | — |

## Use it in the project

A completed-task count may change after the task list changes. Explain why remembering the old count is safe only when you can tell that its inputs are still the same. Test the empty list and a list changed after the first count.

## Production and interview review

Bound cache growth and include every relevant input, such as locale or configuration version. Measure retained memory alongside saved computation.

<details>
<summary>Can memoizing by object identity safely cache a calculation over a mutable object?</summary>

Only if the cache contract accounts for mutation. An unchanged reference can contain changed values, so an identity-keyed cached result can be stale. Immutable values, versioned keys, or deliberate invalidation address different workloads.

</details>

## Continue learning

Next: [functors](../functor-functions/getting-started.md).
