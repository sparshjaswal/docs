---
title: "Projects and mastery checkpoints"
sidebar_label: "Projects and checkpoints"
---

# Projects and mastery checkpoints

A project combines several lessons into something you can use. Start small: a program that receives data, calculates a result, and prints it. Add a page or a network request after the calculation works.

1. Choose the project matching your stage of the [learning path](./index.md).
2. Write one example input and the result you expect.
3. Build the smallest working version, then test empty input and one failure.
4. Explain what you would change before adding another feature.

Begin with the [expense-summary and word-frequency projects](./workbook-projects.md), which include step-by-step traces and checked solutions. The projects below extend those skills into applications. A **completion criterion** is a behavior you can demonstrate, such as showing an empty-state message when no records match.

## Price analyzer {/* #price-analyzer */}

**Level:** foundations. Read numeric input, reject invalid records, compute totals, and sort results without changing the original list.

**Done when:** an empty list returns zero; a zero price stays zero; `NaN`, Infinity, and negative values follow a documented validation rule; sorting uses a numeric comparator. Explain where floating-point rounding enters the calculation.

Use [operators](./operators-and-operands.md), [loops](./loops.md), [arrays](./arrays/index.md), and [copying array methods](./arrays/array-methods.md).

## Searchable reading list {/* #reading-list */}

**Level:** functions, collections, and browser events. Add titles, assign tags, filter by a search phrase, and mark books as completed.

**Done when:** keyboard users can add and remove entries; duplicate IDs are handled; user-entered titles are inserted with `textContent`; empty results have a useful message; re-rendering does not accumulate duplicate event listeners. Persistence should tolerate missing or invalid stored data.

Keep `filterBooks(books, query)` pure and keep DOM operations in a separate module. Use [classes and object identity](./objects-and-classes.md), [collections](./collections-and-iteration.md), [DOM](./document-object-model.md), [event delegation](./event-handling.md), and [validated storage](./browser-state-and-network.md#treat-persisted-json-as-external-input).

## Resilient data dashboard

**Level:** async programming. Load multiple independent panels, show partial results, and cancel obsolete searches.

**Done when:** one failing panel does not erase successful panels; an older response cannot overwrite a newer search; HTTP errors, malformed JSON, and aborted operations produce distinct intended outcomes; request concurrency stays within a configured bound.

Use [promises](./asynchronous/promises.md), [async/await](./asynchronous/async-await.md), [request freshness and disposal](./browser-state-and-network.md), and [error handling](./error-handling.md). Test with injected fake requests, not an unreliable public endpoint.

## Edition migration lab

**Level:** modern ECMAScript. Choose one function and write a behavior-preserving refactor with a newer feature.

| Legacy pattern | Candidate replacement | Edge case to preserve |
| --- | --- | --- |
| `value || defaultValue` | `value ?? defaultValue` | Legitimate zero, false, and empty string |
| Copy then mutate array | `toSorted`, `toSpliced`, or `with` | Shallow object identity and bounds |
| Manual grouping | `Object.groupBy` / `Map.groupBy` | Key coercion and missing groups |
| Eager transform chain | Iterator helpers | Consumption, early stopping, and repeatability |
| Missing map entry setup | `getOrInsertComputed` | An existing `undefined` value |

**Done when:** both versions pass the same tests, their mutation behavior matches the documented contract, and the runtime-support decision is written down.

## Streaming catalog pipeline

**Level:** advanced text, numbers, and async collections. Import catalog records from an async generator, validate each record, group accepted records by owner, and report invalid ones without losing successful work.

**Done when:** identifiers beyond Number.MAX_SAFE_INTEGER survive serialization; international names are normalized only under a documented policy; literal searches accept regex punctuation; processing can stop early and close the iterator. Compare incremental processing with Array.fromAsync and explain the memory tradeoff. Add an export encoded as UTF-8/base64 using a supporting runtime.

Use [strings and regex](./strings-and-regular-expressions.md), [numbers](./numbers-and-math.md), [JSON](./json-and-serialization.md), [collections](./collections-and-iteration.md), and [binary codecs](./binary-data-and-shared-memory.md).

## Ownership and memory lab

**Level:** expert. Build a small binary record reader with an explicit buffer owner, then add object metadata and a validating wrapper.

**Done when:** DataView reads mixed-width fields with an explicit byte order; tests distinguish a shared subarray from a copied slice; transferring ownership invalidates the old access path; Proxy behavior obeys invariants; metadata uses Map or WeakMap according to whether enumeration is required. Describe cleanup without depending on a finalizer. An optional worker extension must define its message or atomic synchronization protocol before sharing mutable storage.

Use [binary memory](./binary-data-and-shared-memory.md), [metaprogramming](./metaprogramming-and-memory.md), and [language semantics](./language-semantics.md). Record a heap/profile observation separately from correctness assertions.

## Capstone: modular learning tracker {/* #capstone */}

Combine the reading list and dashboard into a small application with modules for domain logic, storage, network access, and presentation.

Deliver a runnable application, a short architecture diagram, setup instructions, and tests for the main success and failure paths. Include input validation, accessible forms, explicit loading/empty/error states, cleanup of listeners and requests, and a documented compatibility target.

**Review questions:** Which state is shared? Which functions are pure? Who owns each resource? What happens if an operation finishes after its view is removed? Which failures should be retried, shown, logged, or propagated?

Use [testing](./testing-guide.md), [modules](./import-and-export.md), [compatibility](./compatibility.md), and [design patterns](../design-pattern/index.md). When you can explain these choices with examples from your own code, revisit the [mastery checklist](./quick-reference-cheatsheet.md).

## Interview preparation

Practise the questions alongside their concept explanations: [Contracts and tie-breaking](workbook-projects.md#interview-questions) · [Module design](modular-javascript.md#interview-questions) · [Stale requests](browser-state-and-network.md#interview-questions) · [Tests](testing-guide.md#interview-questions).

Predict each worked example, explain the result, and answer its follow-up. Use the [complete interview route](./index.md#interview-preparation) to cover the remaining topics.
