---
id: javascript-quick-reference
slug: /javascript/quick-reference
title: "Modern JavaScript quick reference"
sidebar_label: "Quick reference"
---

# Modern JavaScript quick reference

Use this page when you know the job you want to do but have forgotten the JavaScript construct. For example: “Keep zero but use a default for a missing value” or “Make a new list without changing the original”.

1. Find the need in a table.
2. Read the caution beside the suggested construct.
3. Open the linked lesson for an explanation and example.

Begin with everyday decisions; use the asynchronous table after learning promises. The [ES2015–2026 inventory](./index.md#ecmascript-20152026-feature-coverage) is the single reference for feature editions. This page is a lookup aid alongside the lessons, not a second course to memorize.

## Everyday decisions

| Need | Choose | Watch for |
| --- | --- | --- |
| A binding that will not be reassigned | `const` | An object value can still mutate |
| A changing local binding | `let` | Its block scope and temporal dead zone |
| A fallback only for missing values | `value ?? fallback` | Preserves `0`, `false`, and `''` |
| Safe access through nullable data | `user?.profile?.name` | Does not validate types or protect an undeclared root |
| Check an own property | `Object.hasOwn(object, key)` | Includes an own property whose value is `undefined` |
| A string/identity-keyed collection | `Map` | Object keys compare by identity |
| Unique values | `Set` | Separate object instances remain distinct |
| A shallow array/object copy | `[...items]` / `{...record}` | Nested objects remain shared |
| An exact integer beyond safe Number range | `BigInt` | Cannot freely mix with Number arithmetic |
| A new sorted array | `items.toSorted(compare)` | Numeric sorting needs `(a, b) => a - b` |
| Group values by a property | `Object.groupBy` | Result has a null prototype; feature-detect targets |
| A lazy transformation | Iterator helpers | Single-use state; eager array methods may be simpler |

Lessons: [operators](./operators-and-operands.md), [collections](./collections-and-iteration.md), [array methods](./arrays/array-methods.md), [objects](./objects-and-classes.md).

## Safe defaults and transformations

```js runnable
const input = { count: 0, label: '', tags: ['js', 'js', 'web'] };
const normalized = {
  count: input.count ?? 1,
  label: input.label || 'Untitled',
  tags: [...new Set(input.tags)],
};
console.log(JSON.stringify(normalized));
```

```text output
{"count":0,"label":"Untitled","tags":["js","web"]}
```

The label policy intentionally treats an empty string as missing; the count policy does not treat zero as missing. Neither operator validates arbitrary input. See [destructuring](./destructuring.md) for defaults, which apply only to `undefined`.

## Async selection

| Required outcome | Construct | Failure behavior |
| --- | --- | --- |
| Next operation needs the previous result | Sequential `await` | Stops at rejection unless handled |
| Need every independent result | `Promise.all` | Rejects on the first observed rejection |
| Need every outcome, including failures | `Promise.allSettled` | Reports status objects after all settle |
| Need the first success | `Promise.any` | Rejects with AggregateError if all reject |
| Need the first settlement | `Promise.race` | Adopts that fulfillment or rejection |
| Consume an async stream | `for await...of` | Allows processing one value at a time |
| Collect async input into an array | `Array.fromAsync` | Progressive consumption; retains all results |

These combinators do not cancel work automatically. See [promises](./asynchronous/promises.md), [cancellation](./asynchronous/async-await.md), and [async collection](./collections-and-iteration.md#collect-async-input--es2026).

## Edition landmarks

Use the [single edition inventory](./index.md#ecmascript-20152026-feature-coverage) to look up a feature's introduction. Check [runtime compatibility](./compatibility.md) for your actual targets; the publication year alone does not establish support. Use the [mastery checklist](./quick-reference-cheatsheet.md) to choose a practice task.

## Interview preparation

Practise the questions alongside their concept explanations: [Values and coercion](fundamentals/type-casting-and-coercion.md#interview-questions) · [Closures](functions/function-closure.md#interview-questions) · [Event loop](asynchronous/asynchronous.md#interview-questions) · [Objects](objects-and-classes.md#interview-questions).

Predict each worked example, explain the result, and answer its follow-up. Use the [complete interview route](./index.md#interview-preparation) to cover the remaining topics.
