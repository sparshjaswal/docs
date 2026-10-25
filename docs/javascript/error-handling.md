---
id: javascript-error-handling
slug: /javascript/error-handling
title: "Errors and recovery"
sidebar_label: "Errors and recovery"
---

# Errors and recovery

An operation can fail: a file may be missing, a network request may stop, or text may not be valid JSON. Error handling decides what happens next instead of leaving the program in an unclear state.

1. Identify the step that may fail.
2. Use `try`/`catch` where you can make a useful decision, such as showing a message or asking the caller to try again.
3. Preserve the original reason when adding context.
4. For a promise, handle the asynchronous failure too; a surrounding synchronous `try` alone may not see it.

A function's **contract** is its promise about accepted inputs, results, and failures. Decide whether the function can recover or should let its caller choose. The example below adds context to a JSON parsing failure.

```js runnable
function parseSettings(text) {
  try { return JSON.parse(text); }
  catch (cause) { throw new Error('Could not parse settings', { cause }); }
}
try { parseSettings('{invalid'); }
catch (error) {
  console.log(error.message);
  console.log(error.cause.name);
}
```

```text output
Could not parse settings
SyntaxError
```

The `cause` option is ES2022. JavaScript can throw any value, so code at an untrusted boundary must not assume every caught value has a `message` property. [Error.isError (ES2026)](#recognize-errors-across-realms--es2026) also handles errors from another realm.

## Async failures need async handling

A surrounding synchronous `try/catch` does not catch a later timer callback’s exception or a promise rejection that is never awaited. Await inside the try or attach a rejection handler at the owning boundary.

```js runnable
async function save() { throw new Error('offline'); }
try { await save(); }
catch (error) { console.log(`Not saved: ${error.message}`); }
```

```text output
Not saved: offline
```

## Recovery rules

| Failure | Reasonable policy |
| --- | --- |
| Invalid user input | Show an actionable validation message |
| Missing optional data | Use a documented fallback |
| Temporary request failure | Retry only when safe, with bounded attempts and delay |
| Programmer error or violated invariant | Fail visibly and fix the cause |
| Cancellation | Treat as an expected lifecycle event when intended |

Cleanup belongs in `finally`, but throwing or returning from a finally block can replace the earlier outcome. Global error handlers are useful for reporting; they do not substitute for local recovery. Avoid exposing private request details in user-facing messages.

## Error types and optional catch binding

Use TypeError for an inappropriate type/operation, RangeError for an out-of-range value, and SyntaxError for invalid grammar. ReferenceError commonly indicates a missing or uninitialized binding. URIError relates to the URI encoding/decoding functions, and EvalError remains a legacy built-in name. Choose domain-specific subclasses when callers need a stable classification rather than parsing messages.

ES2019 permits `catch { ... }` without a binding. Use it when the policy truly needs no exception details; otherwise preserve enough information to diagnose a failure. AggregateError (ES2021) collects multiple errors, including Promise.any's all-rejected result. The cause option (ES2022) links a higher-level error to an underlying value without flattening it into a message.

```js runnable
class ValidationError extends Error {
  constructor(field, message, options) {
    super(message, options);
    this.name = 'ValidationError';
    this.field = field;
  }
}
const error = new ValidationError('quantity', 'Invalid quantity', { cause: 'not numeric' });
console.log(error instanceof Error, error.name, error.field);
console.log(error.cause);
```

```text output
true ValidationError quantity
not numeric
```

Error stack formatting is host/engine-specific and may reveal implementation details. Do not use message or stack text as a stable machine-readable error code. A finally block that returns can suppress a prior throw; keep cleanup separate from the decision to recover.

## Recognize errors across realms — ES2026

```js runnable requires=Error.isError
import vm from 'node:vm';
const foreign = vm.runInNewContext('new TypeError("invalid")');
console.log(foreign instanceof Error);
console.log(Error.isError(foreign));
console.log(Error.isError({ name: 'Error', message: 'lookalike' }));
```

```text output
false
true
false
```

This example uses Node’s VM API to create another realm. `Error.isError` checks the error brand instead of depending on one realm’s `Error.prototype`. A lookalike object does not pass merely because it has error-shaped properties. JavaScript can throw any value, so a false result does not mean a caught value can be ignored. [Error brand-check proposal](https://github.com/tc39/proposal-is-error).

## Node.js process boundaries

Observe rejected promises where the operation is owned, and handle emitter failures according to the [event source's contract](./event-handling.md#nodejs-eventemitter). A process-wide callback is too late to repair arbitrary application state.

Node's default handling of unhandled rejections depends on its rejection mode and installed handlers. Do not rely on a global logger to make a failed request successful or to leave the process healthy. An uncaught exception is a last-resort boundary: perform only appropriate synchronous cleanup/reporting and let an external supervisor restart the process. `uncaughtExceptionMonitor` can observe an exception without replacing Node's default fatal behavior. [Node process error events](https://nodejs.org/api/process.html#event-uncaughtexception).

At request and job boundaries, preserve the cause, report a useful failure, and release owned resources. Distinguish an ordinary operation failure from a fatal process state; use [tests](./testing-guide.md) to demonstrate that expected failures finish without leaving subscriptions or work running.

<span id="practice" />

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](./index.md#interview-preparation).

### 1. Why can a return in finally hide a failure?

<details>
<summary>Answer and worked example</summary>

A completion from finally can replace the pending return or throw from the protected code. Cleanup should usually avoid returning.

```js runnable
function hiddenFailure() {
  try { throw new Error('work failed'); }
  finally { return 'overridden'; }
}
console.log(hiddenFailure());
function preservedFailure() {
  try { throw new Error('work failed'); }
  finally { console.log('cleanup'); }
}
try { preservedFailure(); }
catch (error) { console.log(error.message); }
```

**Expected output**

```text output
overridden
cleanup
work failed
```

The first function replaces the throw with a successful return. In the second, finally completes normally, so the original exception reaches the caller.

</details>

### 2. Why can try/catch miss an error in a timer callback?

**Apply it:** Wrap a callback-based failure in a promise so the caller can handle it with await and try/catch.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

The try block may have finished before the callback runs. Catch at the callback boundary or represent the operation with a promise that the caller awaits inside try. Also distinguish a rejected fetch from an HTTP error response that still fulfills fetch.

A later callback must report failure through the promise’s rejection path. Throwing inside that callback alone does not reject the surrounding promise.

```js runnable
function readLater() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const value = JSON.parse('{broken');
        resolve(value);
      } catch (error) {
        reject(error);
      }
    }, 0);
  });
}
try {
  await readLater();
} catch (error) {
  console.log(error.name);
}
```

**Expected output**

```text output
SyntaxError
```

The promise constructor catches synchronous executor throws, but the timer callback runs after that executor has returned. Its local catch converts the later exception into rejection, and the caller’s `await` exposes that rejection inside its own `try`. Real error-first callback APIs should reject when their error argument is present. Avoid wrapping an API that already returns a promise just to add another promise layer.

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| Test invalid input, a rejected dependency, and cleanup after failure. Explain why retrying a non-idempotent operation can repeat its side effects. | Practice | — | — |

## Continue learning

Continue with [testing](./testing-guide.md) and [async/await](./asynchronous/async-await.md).
