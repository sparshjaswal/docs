---
title: "Professional JavaScript: feature study map"
sidebar_label: "Professional JS study map"
description: "A guided route through modern JavaScript, with concept links, worked examples, pitfalls, and practice checkpoints."
---

# Professional JavaScript: feature study map

**An optional second route after the foundations.** Use this map when you can already write functions and work with arrays, and want to study modern features in related groups. Beginners should start with the [main learning path](./index.md#1-beginner-values-and-control-flow).

1. Pick one group and follow its links to the full lessons.
2. Explain the concrete problem each feature solves.
3. Complete that group's checkpoint before moving on.

The topic progression draws on the public [Master.dev course outline](https://master.dev/courses/pro-js-features/). The explanations, examples, and exercises here are independently authored, and the route does not require the videos. Each concept has one detailed lesson; this map links to it instead of repeating it.

Use the [running instructions](./index.md#run-the-examples). Browser and multi-file examples state their own setup. Later-edition features stay with the concepts they extend; check their edition and runtime support separately.

## 1. Introduction and feature adoption {/* #feature-adoption */}

Separate three questions: who defines behavior, which edition contains it, and which deployed engines implement it. A feature name or TypeScript declaration cannot answer all three.

| Study | Work through | Evidence of understanding |
| --- | --- | --- |
| Language history | [ECMAScript milestones](./history.md#the-milestones-that-explain-modern-code) | Explain why ES6 and ES2015 name the same edition. |
| Standards and hosts | [Language boundaries](./index.md#what-belongs-to-javascript) | Classify Promise, DOM, fetch, and TypeScript by their owner. |
| Proposal maturity | [TC39 stages](./compatibility.md#tc39-process) | Distinguish Stage 2.7 validation, Stage 3 implementation, and publication. |
| Shipping features | [Transforms and polyfills](./compatibility.md#syntax-transforms-and-polyfills-solve-different-problems), [adoption walkthrough](./compatibility.md#adoption-walkthrough) | Test syntax support and API support independently. |

**Checkpoint:** choose one recent array method. Record its edition, your deployment targets, how you checked support, and the fallback or minimum-version policy. Use the [annual feature inventory](./index.md#ecmascript-20152026-feature-coverage) to locate its specification.

## 2. ES6 foundations in application code {/* #es6-foundations */}

Study bindings before shortcuts: imports, closures, `this`, and object properties refer to different mechanisms. Trace which value is read and when, then shorten the syntax.

| Study | Detailed lesson | Question to resolve |
| --- | --- | --- |
| Modules and dependency graphs | [Imports](./import-and-export.md), [evaluation trace](./import-and-export.md#module-graph) | Why does a shared dependency execute once, and what can make a cycle fail? |
| Block bindings | [Declarations](./fundamentals/variables-var-let-const.md), [scope](./fundamentals/scope.md), [initialization](./fundamentals/hoisting.md) | Why can a declared binding still be unreadable? |
| Construction and inheritance | [Prototype inheritance](./prototype-inheritance.md), [class construction](./objects-and-classes.md#construction-inheritance-and-static-behavior) | Which members belong to the instance, prototype, or constructor? |
| Interpolated text | [Templates](./template-literals.md) | Does inserting a value also escape it for its destination? |
| Arrow callbacks | [Arrow functions](./functions/function-lambda.md) | Which enclosing call supplies `this` and `arguments`? |
| Literal properties and methods | [Object literals](./objects-and-classes.md#object-literals-ownership-and-conversion) | How do computed names differ from fixed property names? |
| Collecting and expanding values | [Rest and spread](./spread-operator.md) | What gets copied, and what still shares identity? |
| Extracting inputs | [Destructuring](./destructuring.md), [parameter defaults](./destructuring.md#parameter-defaults) | Which defaults run for omitted input, `undefined`, `null`, and zero? |

**Checkpoint:** build a two-module formatter with a configurable prefix and a counter. Preserve an empty prefix, expose a live count, and explain why copying an exported object's properties does not create live imports. Follow the [module graph exercise](./import-and-export.md#module-graph) before introducing a cycle.

## 3. Language improvements after ES6 {/* #language-improvements */}

Most mistakes here come from treating different kinds of absence or ownership as equivalent. Choose a rule first: should `null` request a fallback, should zero be kept, and should inherited properties count?

| Study | Detailed lesson | Question to resolve |
| --- | --- | --- |
| Small syntax changes | [Grammar](./language-semantics.md#small-grammar-enhancements), [globalThis](./language-semantics.md#global-objects-and-eval-refinements), [function source](./language-semantics.md#function-source-text--es2019) | Why do trailing commas, optional catch bindings, and source inspection have different limits? |
| Object copying | [Spread](./spread-operator.md), [descriptors](./objects-and-classes.md#descriptors-and-shallow-copies) | Can copying invoke getters or setters? Does it preserve a prototype? |
| Missing values | [Nullish defaults](./operators-and-operands.md#preserve-meaningful-falsy-values), [optional access](./operators-and-operands.md#optional-chaining-boundaries--es2020) | Where does short-circuiting stop? |
| Conditional assignment and powers | [Logical assignment](./operators-and-operands.md#logical-assignment-and-evaluation-order--es2021), [Math](./numbers-and-math.md#math-methods-by-purpose) | When is the right-hand expression evaluated? |
| Private and static members | [Private state](./objects-and-classes.md#methods-fields-and-private-state), [initialization order](./objects-and-classes.md#class-initialization) | Why is a static block run on evaluation rather than on each instance? |
| Object utilities | [Ownership, entries, values, and descriptors](./objects-and-classes.md#object-literals-ownership-and-conversion) | What happens to symbol keys, duplicate keys, and getters? |
| Text operations | [Padding, trimming, and matching](./strings-and-regular-expressions.md#choose-the-simplest-text-operation) | Which operation searches literal text and which interprets a pattern? |
| Large integers | [Numbers](./numbers-and-math.md), [BigInt](./numbers-and-math.md#bigint-arithmetic-and-conversion--es2020) | Where is precision lost when converting a large identifier? |

**Checkpoint:** normalize an options object without mutating it. Preserve `0`, `false`, and `''`; define what `null` means; and reject an invalid type. Test a shared nested object to prove whether the result is isolated or only shallowly copied.

## 4. Arrays and collections {/* #collections */}

Choose the data model before choosing a method. Ordered values, key/value associations, membership, and byte storage have different contracts.

| Study | Detailed lesson | Question to resolve |
| --- | --- | --- |
| Arrays, sets, and maps | [Collection choice](./collections-and-iteration.md#choose-a-collection), [weak collections](./metaprogramming-and-memory.md#weak-collections-and-eligible-symbols) | Does key identity matter, and must entries be enumerable? |
| Views of bytes | [Typed arrays and DataView](./binary-data-and-shared-memory.md#choose-a-view) | Does this view share storage or own a copy? |
| Producing a sequence | [Iterator protocol](./collections-and-iteration.md#iterable-versus-iterator), [generator delegation and cleanup](./collections-and-iteration.md#delegation-sent-values-and-cleanup) | Can this iterator be replayed, and what happens on early exit? |
| Reading and changing arrays | [Method guide](./arrays/array-methods.md), [array properties](./arrays/array-properties.md) | What are the mutation and empty-input rules for fill, copyWithin, find, flat, includes, and sort? |

**Checkpoint:** index records by ID with a Map, deduplicate tags with a Set, and return a sorted copy of the records. Explain your duplicate-ID policy and demonstrate that a copied array still shares its record objects. Then repeat the transformation over a generator and explain when work begins.

## 5. Asynchronous programming {/* #async */}

Track work creation, settlement, and observation separately. `await` suspends a continuation; it neither makes CPU-heavy work parallel nor automatically cancels obsolete work.

| Study | Detailed lesson | Question to resolve |
| --- | --- | --- |
| Promise mechanics | [States and connected chains](./asynchronous/promises.md#promise-state) | Does returning a promise connect its failure to the caller? |
| Async functions | [Async/await](./asynchronous/async-await.md), [event loop](./asynchronous/asynchronous.md) | Which operations are sequential, and which have already started? |
| Combining outcomes | [Combinators](./asynchronous/promises.md#select-a-combinator), [controlled completion trace](./asynchronous/promises.md#completion-trace) | Do you need every success, every outcome, first success, or first settlement? |
| Cleanup | [finally behavior](./asynchronous/promises.md#finally-outcomes), [errors](./error-handling.md) | Can cleanup replace the original outcome? |
| Async sequences and module startup | [Async generators](./collections-and-iteration.md#stream-asynchronously--es2018), [top-level await](./import-and-export.md#top-level-await-boundary) | Who waits for each item or for module initialization? |

**Checkpoint:** simulate three independent sources, including one rejection. Produce a partial-result report with `allSettled`, then implement a first-success policy with `any`. Explain why the latter does not stop the remaining sources. Use [cancellation and bounded concurrency](./asynchronous/async-await.md) when connecting real I/O.

## 6. Advanced techniques {/* #advanced */}

For each abstraction, identify the invariant it must preserve. A proxy cannot invent arbitrary answers, a weak reference cannot guarantee resource cleanup, and a tag does not automatically make interpolated input safe.

| Study | Detailed lesson | Question to resolve |
| --- | --- | --- |
| Tail position | [Tail calls and portable iteration](./language-semantics.md#tail-call-walkthrough) | Is work left after the recursive call returns? |
| Intercepting operations | [Proxy and Reflect](./metaprogramming-and-memory.md#proxy-traps-and-invariants--es2015) | Which target restrictions must the trap preserve? |
| Protocol keys | [Symbols](./symbol.md) | Is a symbol unique, registered, enumerable, or private? These are separate questions. |
| Diagnostics and executables | [Error causes](./error-handling.md), [hashbang setup](./language-semantics.md#hashbang-cli) | How is a causal error chain different from its message? What launches the script? |
| Object lifetime | [Weak references](./metaprogramming-and-memory.md#weakref-and-finalizationregistry--es2021), [registry retention](./metaprogramming-and-memory.md#registry-retention) | Could the cleanup bookkeeping itself retain the target? |
| Module-relative resources | [Import metadata](./import-and-export.md#namespace-exports-metadata-and-evaluation-order) | Is a relative path based on the module, page, or working directory? |
| Template functions | [Raw segments and typed substitutions](./template-literals.md#tag-contract) | What information would ordinary string concatenation lose? |
| Regex enhancements | [Flags](./strings-and-regular-expressions.md#flags-and-their-interactions), [captures and lookbehind](./strings-and-regular-expressions.md#captures-lookbehind-and-match-indices), [Unicode](./strings-and-regular-expressions.md#unicode-properties-and-sets), [sticky scanning](./strings-and-regular-expressions.md#sticky-scanner) | Can a search skip invalid text that a parser must reject? |

**Checkpoint:** explain a proxy invariant failure, repair a scanner that skips invalid punctuation, and replace an assumed finalizer with an explicit lifecycle operation. Predict all results without relying on garbage collection timing.

## 7. Put the features together {/* #capstone */}

Build a small in-memory reading-list service before adding a UI. Use modules for storage and reporting, a Map keyed by string ID, a class with private state, and pure functions for filtering and sorting. Accept an options object where an omitted limit defaults to ten and zero returns no entries. Return snapshots with a documented policy for nested mutable data.

Add an async import function that accepts records from several promise-returning sources. Report successful records and per-source errors in input order. Validate records at this boundary; syntax conveniences do not replace validation. Preserve the original failure as an error cause when adding context. Do not require a network server for the exercise: resolved and rejected promises are enough.

| Acceptance case | Expected behavior |
| --- | --- |
| Same ID arrives twice | Apply and explain one deliberate update or rejection policy. |
| Limit is omitted, zero, or invalid | Default, return no entries, or reject respectively. |
| A caller mutates a returned record | Behavior matches the documented snapshot policy. |
| One source rejects | Other outcomes remain available, and the report identifies the failed source. |
| No sources | Return an empty report without waiting forever. |
| Repeated module imports | Shared module state follows the resolved module identity. |

Test observable behavior using the [testing guide](./testing-guide.md), then extend the [existing projects](./projects.md). Finish by explaining one compatibility choice, one failure boundary, and one ownership decision. Use the [interview route](./index.md#interview-preparation) and [workbook](./workbook.md) for further practice.
