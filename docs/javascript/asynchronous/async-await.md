---
id: javascript-asynchronous-async-await
slug: /javascript/asynchronous/async-await
title: "Async/await, concurrency, and cancellation"
sidebar_label: "Async/await and cancellation"
---

# Async/await, concurrency, and cancellation

`async` and `await` help you write steps that wait for results. Imagine loading a student's record before displaying their timetable. The second step needs the first result, so it must wait.

Read [promises](./promises.md) first. An async function always returns a promise. `await` pauses that function's progress while its result is pending; other JavaScript work can still run.

1. Follow one successful request and inspect the returned value.
2. Make the request fail and follow the `try`/`catch` path.
3. Compare dependent work with independent work that can start together.
4. Return to timeouts, cancellation, and concurrency limits when your application makes several requests.

**Concurrency** means managing work whose lifetimes overlap. **Cancellation** means asking an operation to stop. Neither happens automatically because you wrote `await`.

## A returned promise and an awaited value are different {/* #await-and-error-boundaries */}

Calling an async function produces a promise. A returned value fulfills it; an uncaught exception rejects it. `await` evaluates its operand and suspends this function’s continuation. On fulfillment, execution resumes with the fulfilled value; on rejection, it resumes by throwing at the `await` expression.

```js runnable
async function fail() {
  throw new Error('offline');
}
async function forward() {
  try {
    return fail();
  } catch {
    return 'local fallback';
  }
}
async function recover() {
  try {
    return await fail();
  } catch {
    return 'local fallback';
  }
}
console.log(await forward().catch(error => `caller: ${error.message}`));
console.log(await recover());
```

```text output
caller: offline
local fallback
```

`fail()` returns a rejected promise; the call does not synchronously throw into `forward`’s catch. Returning that promise makes `forward` adopt its rejection, which the caller handles. In `recover`, `await` exposes the rejection as a throw inside the local `try`, so the local fallback is used.

This is a reason to use `return await` when local error handling or cleanup must cover the asynchronous operation. Returning the promise directly is fine when this function deliberately delegates that responsibility to its caller. Neither form cancels the operation. See [javascript.info async/await error handling](https://javascript.info/async-await#error-handling).

## Sequential dependencies versus independent work

```js runnable
async function price() { return 20; }
async function stock() { return 3; }
const [unitPrice, available] = await Promise.all([price(), stock()]);
console.log(unitPrice * available);
```

```text output
60
```

Both calls start before the await. For dependent work, await the first result and then start the second. Concurrency is useful while waiting, but a large synchronous computation inside either function still occupies the calling thread.

## Fetch with an explicit failure policy

**Browser or Node with fetch support.** This definition does not make a request until called. Supply your own endpoint and connect cancellation to the owner of the operation.

```js
async function fetchJson(url, { signal } = {}) {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

const controller = new AbortController();
// const data = await fetchJson('/api/items', { signal: controller.signal });
// controller.abort(); // Call when this operation is no longer needed.
```

Fetch does not reject merely because a server returned HTTP 404 or 500. Check status, then handle JSON parsing failures separately when the application needs that distinction. Aborting is cooperative; it does not roll back effects the server has already committed.

## A timeout must also clean up

```js
async function fetchJsonWithTimeout(url, milliseconds = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), milliseconds);
  try {
    return await fetchJson(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
```

This depends on the `fetchJson` definition above. Validate timeout inputs at your API boundary. If a caller also has a signal, deliberately compose the signals using supported host APIs or a listener with cleanup. `Promise.race` alone does not stop network work.

## Limit concurrency deliberately

For small independent batches, `Promise.all` is straightforward. For large batches, use a bounded worker pool. This example validates the limit and preserves input order:

```js runnable
async function mapLimit(items, limit, transform) {
  if (!Number.isInteger(limit) || limit < 1) throw new RangeError('Invalid limit');
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await transform(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
console.log(JSON.stringify(await mapLimit([3, 1, 2], 2, async value => value * 10)));
```

```text output
[30,10,20]
```

This helper bounds in-flight calls but is not a cancellation system: if one worker rejects, others may continue processing. Choose a fail-fast, stop-scheduling, or collect-all policy explicitly before applying it to side-effecting work.

## Collect every outcome, including synchronous throws

`Promise.allSettled(tasks.map(task => task()))` never reaches the combinator if one call throws while `map` is running. Defer each call through a promise reaction so both a synchronous throw and an asynchronous rejection become settled records.

```js runnable
async function collectResults(tasks) {
  return Promise.allSettled(tasks.map(task => Promise.resolve().then(() => task())));
}
const results = await collectResults([
  () => 2,
  () => { throw new Error('offline'); },
  async () => 6,
]);
console.log(results.map(result => result.status === 'fulfilled'
  ? `value:${result.value}` : `error:${result.reason.message}`).join(', '));
console.log((await collectResults([])).length);
```

```text output
value:2, error:offline, value:6
0
```

The array follows input order, even if completion order differs. This starts all tasks and waits for all to settle; it does not limit concurrency, cancel work, or guarantee completion when a task never settles. Use the bounded worker pattern for a large batch and specify how failures affect further scheduling.

## Stop consuming an async stream deliberately

An async generator can release its own resources in `finally`. A `break` from `for await...of` requests iterator closure, which runs this generator's cleanup:

```js runnable
async function* records() {
  try {
    yield 'first';
    yield 'second';
  } finally {
    console.log('source closed');
  }
}
for await (const record of records()) {
  console.log(record);
  break;
}
```

```text output
first
source closed
```

Processing each item before asking for another bounds consumer-side buffering; collecting everything with `Array.fromAsync` changes that memory contract. Generator closure cannot interrupt arbitrary pending host I/O by itself. A real stream or request still needs its supported cancellation mechanism and an owner responsible for invoking it.

## Common mistakes

- `forEach(async item => ...)` does not await the returned promises. Use `for...of` for sequential work or a promise combinator for concurrent work.
- `try { return promise; } catch { ... }` does not catch a later rejection. Await inside the try when that scope owns rejection handling.
- An aborted request can race with a completed one. For search UIs, also check a request identifier before rendering stale results.
- Do not catch an error and silently return `undefined` unless that is an intentional part of the function’s contract.

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](../index.md#interview-preparation).

### 1. Does declaring a function async make its whole body run later?

<details>
<summary>Answer and worked example</summary>

No. Calling it starts execution immediately and runs until it suspends, returns, or throws. Await suspends that async invocation; it does not block the whole JavaScript agent.

```js runnable
async function work() {
  console.log('inside');
  await 0;
  console.log('resumed');
  return 7;
}
const pending = work();
console.log('caller');
console.log(await pending);
```

**Expected output**

```text output
inside
caller
resumed
7
```

Even awaiting the non-promise value 0 introduces an asynchronous continuation. The caller runs before resumed; awaiting pending then receives the returned value.

</details>

### 2. When does await in a loop cause unnecessary serialization?

**Apply it:** Trace when each operation starts in sequential and concurrent versions. Avoid measuring elapsed time to infer the ordering.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

When operations are independent and the desired contract permits concurrency. Sequential await is correct when each step depends on the previous result or order matters. For independent tasks, use a bounded pool or Promise.all for a small batch; async alone does not impose a concurrency limit.

The dependency logs make the difference deterministic. Each fake operation suspends once.

```js runnable
async function job(id, trace) {
  trace.push(`start ${id}`);
  await Promise.resolve();
  trace.push(`end ${id}`);
  return id;
}
const sequential = [];
for (const id of [1, 2]) await job(id, sequential);
console.log(sequential.join(' | '));

const concurrent = [];
const results = await Promise.all([1, 2].map(id => job(id, concurrent)));
console.log(concurrent.join(' | '));
console.log(results.join(','));
```

**Expected output**

```text output
start 1 | end 1 | start 2 | end 2
start 1 | start 2 | end 1 | end 2
1,2
```

In the first version, job 2 is not called until job 1 completes. In the second, `map` calls both jobs before awaiting the combined result. Their waiting periods can overlap; their JavaScript instructions still run on the same thread here. Use concurrency only when dependencies and service limits permit it. For a large list, use a bounded pool rather than launching every job at once. See [javascript.info: async/await](https://javascript.info/async-await).

</details>

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](../workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 33. Async orchestration cancellation and streams {/* #workbook-33 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** choose how several asynchronous outcomes are reported.

The first group requires both successful results, kept in input order. The second group includes a rejection and asks for every outcome. Predict the values and status strings before running it.

Use [independent versus dependent work](#sequential-dependencies-versus-independent-work), [concurrency limits](#limit-concurrency-deliberately), and [async stream cleanup](#stop-consuming-an-async-stream-deliberately) for the follow-ups. Promise combinators do not automatically cancel other work. When consuming chunks, decide how partial data is kept until a complete item arrives.

**Worked example**

```js
const first = Promise.resolve("A");
const second = Promise.resolve("B");
console.log((await Promise.all([first, second])).join(","));
const results = await Promise.allSettled([
  Promise.resolve(3), Promise.reject(new Error("missing"))
]);
console.log(results.map(x => x.status).join(","));
```

**Expected output**

```text
A,B
fulfilled,rejected
```

**Why the example works**

Promise.all preserves the array order. allSettled turns each settlement into a record, so the rejected operation appears as a status rather than rejecting the combined result. The caller still has to inspect that status; collection does not mean the failure is repaired.

</details>

Find **33A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-33-answer">
<summary>Check your reasoning and answer</summary>

**33A.** No. Promise is a result abstraction without general cancellation. The underlying operation needs a separate cancellation mechanism such as an AbortSignal when supported.

**33B.** The function executes synchronous statements on its current agent until it reaches a suspension point. A long loop can therefore block that agent even inside an async function.

**33C.** Wrap each task invocation in a promise reaction. A synchronous throw then becomes a rejection collected by allSettled, rather than escaping while the input array is being built.

**Reference code**

```js
async function collectResults(tasks) {
  return Promise.allSettled(
    tasks.map(task => Promise.resolve().then(() => task()))
  );
}
```

**Check the result**

```js
const results = await collectResults([
  () => 4, () => { throw new Error("no"); },
  async () => 7
]);
assert.deepEqual(results.map(x => x.status),
  ["fulfilled", "rejected", "fulfilled"]);
assert.equal(results[0].value, 4);
assert.deepEqual(await collectResults([]), []);
```

</details>

<span id="practice" />

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **33A — Does Promise.all cancel other inputs after one rejection?** | **Must fix** | [Worked example](#workbook-33) | [Answer](#workbook-33-answer) |
| **33B — Why does async not make a long CPU loop nonblocking?** | **Must fix** | [Worked example](#workbook-33) | [Answer](#workbook-33-answer) |
| **33C — Write collectResults(tasks), where each task is a zero-argument function. Run them concurrently and return allSettled records even if a task throws synchronously.** | **Must fix** | [Worked example](#workbook-33) | [Answer](#workbook-33-answer) |
| Add tests proving `mapLimit` never exceeds its concurrency bound and retains result order. | Practice | — | — |
| Simulate a 404, invalid JSON, a rejected fetch, and cancellation without making live network calls. | Practice | — | — |
| Explain which component clears timers and aborts requests when a view is removed. | Practice | — | — |

## Continue learning

References: [async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), [Fetch Standard](https://fetch.spec.whatwg.org/). Continue with [testing](../testing-guide.md).
