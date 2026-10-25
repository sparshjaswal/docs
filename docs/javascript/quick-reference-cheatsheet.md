---
id: javascript-quick-reference-cheatsheet
slug: /javascript/quick-reference-cheatsheet
title: "JavaScript mastery checklist"
sidebar_label: "Mastery checklist"
---

# JavaScript mastery checklist

Use this checklist to find the next thing to practise after a lesson. It is not a list you must complete before writing useful code. Start with foundations and functions; return to advanced sections later in the [learning path](./index.md).

1. Pick one statement and explain it in your own words.
2. Write or trace a small example that demonstrates it.
3. Change one input and check whether your explanation still works.

If you cannot explain an item yet, follow its lesson link and try again. Mark progress by what you can do, not by how many method names you can remember.

## Foundations and functions

- Explain the difference between reassigning a binding and mutating an object: [variables](./fundamentals/variables-var-let-const.md).
- Identify all seven primitive types, and explain `typeof null`: [fundamentals](./fundamentals/README.md).
- Predict a temporal-dead-zone error and a shadowed variable: [scope](./fundamentals/scope.md), [hoisting](./fundamentals/hoisting.md).
- Compare `===`, `Object.is`, and collection equality: [operators](./operators-and-operands.md), [collections](./collections-and-iteration.md).
- Explain lexical `this`, closures, and synchronous callbacks: [arrows](./functions/function-lambda.md), [closures](./functions/function-closure.md), [callbacks](./functions/function-callback.md).

## Data and objects

- Choose an object, Map, Set, or WeakMap for a concrete task: [collections](./collections-and-iteration.md).
- Explain how prototype lookup differs from an own-property check: [prototype inheritance](./prototype-inheritance.md).
- Demonstrate why object spread does not deeply clone nested data: [spread](./spread-operator.md).
- Sort numbers without mutating the input: [copying array methods](./arrays/array-methods.md).
- Consume an iterator once and explain its exhausted state: [iteration](./collections-and-iteration.md).

## Async and browser work

- Predict synchronous, microtask, and timer output: [event loop](./asynchronous/asynchronous.md).
- Select `all`, `allSettled`, `any`, or `race` from an error policy: [promises](./asynchronous/promises.md).
- Limit concurrency and cancel obsolete work: [async/await](./asynchronous/async-await.md).
- Explain HTTP failure versus a rejected fetch: [async/await](./asynchronous/async-await.md).
- Implement event delegation with keyboard-operable controls and cleanup: [events](./event-handling.md).
- Render untrusted text as text, and explain when DOM updates happen: [DOM](./document-object-model.md).

## Modern editions and production

- Identify which yearly edition introduced an API: [edition map](./index.md#ecmascript-20152026-feature-coverage).
- Use ES2024 grouping and ES2025 iterator/set operations appropriately: [collections and iteration](./collections-and-iteration.md).
- Explain the scope and limits of ES2026 precise summation and JSON source access: [numbers](./numbers-and-math.md), [JSON](./json-and-serialization.md).
- Distinguish syntax transforms from API polyfills: [compatibility](./compatibility.md).
- Explain ESM live bindings and dynamic loading: [modules](./import-and-export.md).
- Test input boundaries, mutation, async failure, and cancellation: [testing](./testing-guide.md).

## Advanced language and expert reasoning

- Distinguish UTF-16 units, code points, and graphemes; explain regex lastIndex, Unicode sets, and literal escaping: [strings and regex](./strings-and-regular-expressions.md).
- Explain safe integers, BigInt conversion, storage rounding, and precise accumulation: [numbers](./numbers-and-math.md).
- Design a JSON contract that preserves large IDs and handles missing values: [serialization](./json-and-serialization.md).
- Compare buffer copying, transferring, resizing, and sharing; identify which operations need Atomics: [binary memory](./binary-data-and-shared-memory.md).
- Explain Proxy invariants, private brands, realm boundaries, and nondeterministic weak-reference cleanup: [metaprogramming](./metaprogramming-and-memory.md).
- Trace parameter initialization, per-iteration bindings, key ordering, and abrupt completion through a specification algorithm: [semantics](./language-semantics.md).
- Separate an instant from a local calendar date, and format with an explicit locale/time zone: [internationalization](./dates-and-internationalization.md).
- Measure retained memory and representative performance without assuming a particular JIT or collector implementation.

## Practice assessment

Build a searchable list from an async data source. It should keep a pure filtering function, show loading/error/empty states, ignore or abort obsolete requests, and support keyboard interaction. Write tests for an empty result, a failed request, and a query that changes before an earlier request finishes. Document the required runtime features.

Review it against the [project completion criteria](./projects.md). When you get stuck, record the smallest failed prediction and revisit that concept. Use the [quick reference](./quick-reference.md) for syntax decisions, then return to a worked lesson for the reasoning.

## Interview preparation

Practise the questions alongside their concept explanations: [Function reasoning](functions/function-types.md#interview-questions) · [Async reasoning](asynchronous/async-await.md#interview-questions) · [Browser behavior](event-handling.md#interview-questions) · [Memory](metaprogramming-and-memory.md#interview-questions).

Predict each worked example, explain the result, and answer its follow-up. Use the [complete interview route](./index.md#interview-preparation) to cover the remaining topics.
