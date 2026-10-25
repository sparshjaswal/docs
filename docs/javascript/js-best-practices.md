---
id: javascript-js-best-practices
slug: /javascript/js-best-practices
title: "JavaScript production practices"
sidebar_label: "Production practices"
---

# JavaScript production practices

A working program should also be understandable when you return to it later. These practices help you turn a small exercise into a feature someone can use: clear input rules, useful error messages, tests, and cleanup.

1. Choose one of the [course projects](./projects.md) and make the smallest working version.
2. Test missing or invalid input and one failed operation.
3. Check what data it changes and what resources it leaves open.
4. Review it with the [mastery checklist](./quick-reference-cheatsheet.md).

**Production** means the environment where real users run the application. **A contract** describes what an operation accepts, returns, changes, and may fail to do. Learn these practices by improving a real example, rather than trying to memorize every rule at once.

## Make data contracts explicit

Use `const` unless a binding needs reassignment. Name functions for their operation and distinguish pure transformations from effects. Validate external input where it enters the application; TypeScript declarations do not validate network payloads.

```js runnable
function parsePageSize(value) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 100) {
    throw new RangeError('pageSize must be an integer from 1 to 100');
  }
  return value;
}
console.log(parsePageSize(20));
try { parsePageSize('20'); } catch (error) { console.log(error.name); }
```

```text output
20
RangeError
```

This contract intentionally requires a Number. A form adapter can perform an explicit string conversion first, while rejecting blank input. Document which layer owns that conversion.

## Handle failures and resource lifetimes

- Check HTTP response status before parsing a successful payload. Fetch does not reject merely because a response is 404 or 500.
- Await work you own and report failures where a caller can act on them. Preserve an underlying error with `cause` when adding context.
- Cancel obsolete requests or ignore stale results. Promise combinators do not cancel losing operations.
- Remove listeners, stop timers, disconnect observers, and bound caches when their owner is disposed.
- Define retry limits and which operations are safe to retry; avoid retrying every failure indiscriminately.

Worked examples: [errors](./error-handling.md), [async/await](./asynchronous/async-await.md), [events](./event-handling.md), [memoization](./functions/function-memoization.md).

## Render and measure carefully

Use `textContent` for untrusted text. If rich HTML is a requirement, use an appropriate maintained sanitization approach and a reviewed policy; string escaping is context-specific, and a template element is not a sanitizer. Keep secrets out of browser-delivered source and enforce authorization at the service boundary.

In the browser, separate layout reads from batches of writes where profiling shows repeated forced layout. Use workers for suitable CPU-heavy independent work. A microtask loop can starve rendering; adding `async` does not make CPU work nonblocking. Profile before replacing readable code with a speculative micro-optimization.

## Maintain compatibility and tests

| Before release | Evidence |
| --- | --- |
| Runtime targets | Written browser/Node policy and checks for required APIs |
| Correctness | Normal, empty, invalid, and failure-path tests |
| Interaction | Keyboard access, meaningful labels, focus, loading/error/empty states |
| Performance | Representative profile and a before/after measurement |
| Dependencies | Reviewed changes, locked versions, reproducible install |
| Diagnostics | Actionable errors without unnecessary personal data or secrets |

Run this repository's `yarn verify` and `yarn build`. The first checks marked JavaScript examples, generated practice content, lint, types, and supported tests. The second validates internal links, anchors, images, and production compilation. Neither proves all browser targets or legacy snippets correct.

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](./index.md#interview-preparation).

### 1. Why can convenient numeric coercion be a bad input-validation policy?

<details>
<summary>Answer and worked example</summary>

Coercion can accept values your application never intended. Decide whether the API accepts numbers or strings, then validate that specific representation and its range.

```js runnable
function pageSize(value) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 100) {
    throw new RangeError('Expected 1 through 100');
  }
  return value;
}
console.log(pageSize(25));
for (const invalid of ['25', '', 0, NaN]) {
  try { pageSize(invalid); }
  catch (error) { console.log(error.name); }
}
```

**Expected output**

```text output
25
RangeError
RangeError
RangeError
RangeError
```

This contract rejects strings even when they look numeric. A form adapter can implement a separate, explicit text-parsing policy before calling the numeric API.

</details>

### 2. Which production concerns would you raise when reviewing a fetch-based search box?

**Apply it:** Review a search box that works on a fast connection but sometimes shows the wrong result or an unexplained empty screen.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

Check HTTP status, response schema, stale-result ownership, cancellation, disposal, keyboard submission, loading/error/empty states, and retry safety. Verify those behaviors with controlled tests and real browser interactions; successful JSON parsing alone does not prove a correct feature.

Use observable scenarios to turn a broad review into concrete acceptance criteria:

| Scenario | Expected behavior |
| --- | --- |
| HTTP response is 500 with a JSON body | Treat status as a failure; parsing JSON does not make it a successful search |
| Response is valid JSON with the wrong shape | Reject it at the data boundary and show a useful error state |
| Older request completes after a newer one | Preserve the newer request’s state |
| Query produces no matches | Show an empty-result message, distinct from loading and failure |
| View is disposed during a request | Abort where supported and ignore late state updates |
| User submits with the keyboard | Use the form’s submit behavior and provide accessible status feedback |

Then review retry behavior, especially whether repeating an operation can duplicate a side effect. Use the [browser state lesson](./browser-state-and-network.md) for the complete ownership pattern and the [DOM lesson](./document-object-model.md) for safe rendering. Performance tuning should follow a correct lifecycle and a measured bottleneck.

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| 1 — Add validation and failure tests to a project without duplicating the production algorithm in assertions. | Practice | — | — |
| 2 — Document every resource acquired by a page and the operation that releases it. | Practice | — | — |
| 3 — Identify an assumed runtime feature and add a compatibility decision to the README. | Practice | — | — |
| 4 — Measure one slow interaction, fix its actual bottleneck, and record the evidence. | Practice | — | — |

## Next steps

References: [MDN performance fundamentals](https://developer.mozilla.org/en-US/docs/Web/Performance/Fundamentals), [Node test runner](https://nodejs.org/api/test.html), and [compatibility](./compatibility.md).
