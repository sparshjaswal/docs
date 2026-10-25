---
id: javascript-functions-readme
slug: /javascript/functions/README
title: "Functions: a learning path"
sidebar_label: "Functions overview"
sidebar_position: 1
---

# Functions: a learning path

A function is a named or stored piece of work you can run again. For example, a score converter can accept a score, calculate a grade, and return it. Its inputs are **arguments**; the names receiving those inputs are **parameters**.

1. Write and call a simple function in the first lesson.
2. Change its input and explain its return value.
3. Pass a function as a callback, then learn how a closure remembers surrounding variables.
4. Study recursion, caching, and timing utilities after these foundations.

Functions are also values: they can be stored, passed to another function, and returned. The route below introduces each use when you need it.

| Order | Lesson | Checkpoint |
| --- | --- | --- |
| 1 | [Function types](./function-types.md) | Write a declaration, expression, predicate, and higher-order function |
| 2 | [Arrow functions](./function-lambda.md) | Explain lexical `this` and implicit returns |
| 3 | [Callbacks](./function-callback.md) | Distinguish synchronous invocation from deferred work |
| 4 | [Closures](./function-closure.md) | Keep state private without making it global |
| 5 | [IIFEs](./function-iife.md) | Recognize older encapsulation patterns and their module alternatives |
| 6 | [Recursion](./function-recursion.md) | Define a base case and ensure progress toward it |
| 7 | [Memoization](./function-memoization.md) | Choose a valid cache key and a bounded cache lifetime |
| 8 | [Binding and function utilities](./function-utilities.md) | Preserve receivers, retry after failure, and cancel delayed work |

## Start with a function contract

Specify inputs, output, errors, and side effects. A pure transformation is easier to test when its result depends only on its arguments and it does not mutate observable state.

```js runnable
function selectNames(users, predicate) {
  return users.filter(predicate).map(user => user.name);
}
const users = [{ name: 'Asha', active: true }, { name: 'Noor', active: false }];
console.log(selectNames(users, user => user.active).join(', '));
console.log(users.length);
```

```text output
Asha
2
```

`selectNames` is a higher-order function because it accepts another function. Its callback runs synchronously during `filter`; being a callback does not make it asynchronous. JavaScript does not enforce a function's arity: omitted parameters receive `undefined` unless defaulted, and additional arguments are permitted.

## Declarations, expressions, parameters, and receivers

A declaration such as `function add(a, b) { return a + b; }` establishes a named function binding. An expression such as `const add = function (a, b) { return a + b; };` creates a value when that expression evaluates. A named function expression also has an internal name useful for self-reference. Declaration timing and lexical-binding initialization differ; see [hoisting](../fundamentals/hoisting.md).

ES2015 default/rest parameters, arrows, and destructuring make contracts concise, but defaults only handle undefined. Rest collects remaining arguments into a real array. The older arguments object is array-like, belongs to ordinary functions, and has legacy aliasing behavior for simple non-strict parameter lists. Arrows inherit arguments from their enclosing context.

```js runnable
function format(label = 'Item', ...values) {
  return `${label}: ${values.join(', ')}`;
}
console.log(format(undefined, 2, 3));
console.log(format(null, 2));
function receiver() { return this.value; }
console.log(receiver.call({ value: 4 }));
console.log(receiver.apply({ value: 5 }, []));
console.log(receiver.bind({ value: 6 })());
```

```text output
Item: 2, 3
null: 2
4
5
6
```

Call passes individual arguments; apply accepts an array-like argument list; bind produces a new function with a fixed ordinary-call receiver and optional leading arguments. Binding cannot replace an arrow's lexical this. A function's length/name are metadata, not runtime type or arity enforcement.

Function kinds have different protocols: an ordinary function returns a value, an async function returns a promise (2017), a generator returns an iterator (2015), and an async generator returns an async iterator (2018). Study [collection protocols](../collections-and-iteration.md) before treating these return values interchangeably.

## Interview preparation

Practise the questions alongside their concept explanations: [Parameters](function-types.md#interview-questions) · [Arrows and this](function-lambda.md#interview-questions) · [Callbacks](function-callback.md#interview-questions) · [Closures](function-closure.md#interview-questions) · [Binding and debounce](function-utilities.md#interview-questions) · [Memoization](function-memoization.md#interview-questions).

Predict each worked example, explain the result, and answer its follow-up. Use the [complete interview route](../index.md#interview-preparation) to cover the remaining topics.

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| 1 — Implement `applyTwice(fn, value)` and verify that incrementing twice transforms 3 into 5. | Practice | — | — |
| 2 — Write a pure filter that leaves its input unchanged, then test empty input. | Practice | — | — |
| 3 — Explain how a returned function can still access a parameter after the outer call finishes. | Practice | — | — |

## Next steps

Next: [function objects, factories, and references](../objects-and-classes.md#function-object-references), then [objects, prototypes, and `this`](../objects-and-classes.md), [promises](../asynchronous/promises.md), and [testing functions](../testing-guide.md).
