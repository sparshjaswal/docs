---
id: javascript-testing-guide
slug: /javascript/testing-guide
title: "Testing JavaScript with runnable examples"
sidebar_label: "Testing JavaScript"
---

# Testing JavaScript with runnable examples

A test checks that a program does what you expect. For a score calculator, give it known scores, run the calculation, and check the total. An **assertion** is the check that reports a failure when the actual result differs from the expected one.

1. Write one input and its expected result before writing the test.
2. Run the operation and assert that result.
3. Add empty input, a boundary value, and an invalid input when the function's rules require them.
4. For asynchronous work, wait for the result before checking it.

Start with the dependency-free test below. Later sections cover controlled completion order and wider tests. A useful test should catch a plausible mistake; checking a function's private implementation details usually makes later improvements harder.

## Run a test without dependencies

Save this as `total.test.mjs` and run `node --test total.test.mjs`. Node’s built-in runner is also used by this repository; the older repository examples do not imply that Jest is installed.

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';

function totalCents(items) {
  if (Array.from(items).some(value => !Number.isSafeInteger(value) || value < 0)) {
    throw new RangeError('Prices must be nonnegative safe integers');
  }
  const total = items.reduce((sum, value) => sum + value, 0);
  if (!Number.isSafeInteger(total)) throw new RangeError('Total exceeds safe range');
  return total;
}

test('totals prices without mutating the input', () => {
  const prices = [125, 0, 275];
  assert.equal(totalCents(prices), 400);
  assert.deepEqual(prices, [125, 0, 275]);
});

test('handles empty input and rejects invalid prices', () => {
  assert.equal(totalCents([]), 0);
  assert.throws(() => totalCents(new Array(2)), RangeError);
  for (const value of [-1, NaN, Infinity, 1.5]) {
    assert.throws(() => totalCents([value]), RangeError);
  }
  assert.throws(() => totalCents([Number.MAX_SAFE_INTEGER, 1]), RangeError);
});
```

In an application, export `totalCents` from a source module and import it into the test. Keeping both here makes the first example independently runnable.

## Test asynchronous behavior by awaiting it

```js runnable
import assert from 'node:assert/strict';
async function loadTitle(fetchRecord) {
  const record = await fetchRecord();
  if (typeof record.title !== 'string') throw new TypeError('Missing title');
  return record.title;
}
assert.equal(await loadTitle(async () => ({ title: 'Modules' })), 'Modules');
await assert.rejects(() => loadTitle(async () => ({})), TypeError);
await assert.rejects(() => loadTitle(async () => { throw new Error('offline'); }), /offline/);
console.log('success, validation, and request failure checked');
```

```text output
success, validation, and request failure checked
```

Inject dependencies at the boundary. This fake models outcomes without issuing network requests. Always await a rejection assertion; otherwise the test may finish before the failure is observed.

## Test completion order without sleeping {/* #test-completion-order */}

A request can start first and finish last. Control completion explicitly so a race test does not depend on the network or timer speed. This self-contained example models the token check used by the [search controller](./browser-state-and-network.md#a-request-controller-with-explicit-ownership).

```js runnable
import assert from 'node:assert/strict';

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

let current;
const renders = [];
async function display(request) {
  const token = {};
  current = token;
  try {
    const value = await request;
    if (token === current) renders.push(value);
  } catch (error) {
    if (token === current) renders.push(`error: ${error.message}`);
  }
}

const oldRequest = deferred();
const newRequest = deferred();
const oldJob = display(oldRequest.promise);
const newJob = display(newRequest.promise);
newRequest.resolve('new result');
await newJob;
oldRequest.resolve('stale result');
await oldJob;
assert.deepEqual(renders, ['new result']);

const oldFailure = deferred();
const obsoleteJob = display(oldFailure.promise);
await display(Promise.resolve('latest result'));
oldFailure.reject(new Error('old failure'));
await obsoleteJob;
assert.deepEqual(renders, ['new result', 'latest result']);
console.log('late success and late failure cannot replace current results');
```

```text output
late success and late failure cannot replace current results
```

The assertions check the observable rendered sequence. Removing either freshness guard makes the relevant test fail. This fake intentionally completes old work instead of assuming an abort always stops it. For a complete controller, also dispose while a request is pending and verify that later resolution produces no render.

## Debug the smallest failing case

Classify the failure before changing code:

| Failure | First question | Useful check |
| --- | --- | --- |
| Syntax error | Can the runtime parse the source? | `node --check lesson.mjs` |
| Runtime exception | Which operation received an invalid value? | Read the stack; pause on exceptions; inspect the boundary input |
| Wrong result | Which invariant first becomes false? | Reduce the input and trace state after each step |
| Intermittent async result | Which owner may update state now? | Control completion order and test disposal |

For example, initializing a maximum to `0` passes tests on `[3, 1]` but fails on `[-8, -2]`. Trace the accumulator: neither negative value exceeds zero. Seed from the first element after handling empty input, or choose a sentinel under an explicit numeric contract. Keep the negative-only input as a regression case instead of fixing only the displayed sample.

## Choose the right scope

| Scope | Test | Avoid |
| --- | --- | --- |
| Unit | Pure transformations, validation, domain rules | Mocking every internal helper |
| Integration | Module boundaries, storage adapters, parsing | Treating a fake as proof the real service works |
| Browser | Keyboard interaction, accessible names, focus, navigation | Assuming a DOM emulator proves browser layout |
| Performance | Representative workloads measured repeatedly | Fixed millisecond assertions on shared CI machines |

For DOM tests, interact through labels and roles, and test the rendered behavior. A real browser is required for layout, focus behavior, and many platform APIs. Keep browser tests in an explicitly configured toolchain rather than pasting Jest-specific globals into this repository’s native test suite.

## A practical checklist

- Test normal, empty, boundary, and invalid inputs where the contract distinguishes them.
- Assert that immutable operations leave their inputs unchanged.
- Check resource cleanup and stale-response handling, not only the successful result.
- Control time or inject a scheduler instead of adding arbitrary sleeps.
- Use coverage to find omissions; a high percentage is not proof of useful assertions.
- Separate benchmark measurements from pass/fail correctness tests.

## Check this guide’s examples

`yarn check:javascript` executes the self-contained `js runnable` blocks in the JavaScript and DSA guides and compares their output with the following `text output` block. Runtime-gated examples report a skip when an API is absent. This verifies the marked examples, not every historical code listing in the documentation.

References: [Node test runner](https://nodejs.org/api/test.html), [strict assertions](https://nodejs.org/api/assert.html). Apply this to the [projects](./projects.md).

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](./index.md#interview-preparation).

### 1. How do you test an asynchronous failure so the runner observes it?

<details>
<summary>Answer and worked example</summary>

Await or return the assertion’s promise. Supply a controlled failing dependency rather than relying on an external service to fail at the right moment.

```js runnable
import assert from 'node:assert/strict';
async function loadName(load) {
  const record = await load();
  if (typeof record?.name !== 'string') throw new TypeError('Invalid name');
  return record.name;
}
assert.equal(await loadName(async () => ({ name: 'Ada' })), 'Ada');
await assert.rejects(() => loadName(async () => ({})), /Invalid name/);
await assert.rejects(() => loadName(async () => { throw new Error('offline'); }), /offline/);
console.log('success, invalid data, and rejection checked');
```

**Expected output**

```text output
success, invalid data, and rejection checked
```

Each assertion finishes before the example completes. The fake dependency exercises success, invalid data, and request failure without hiding whether the application propagates an error.

</details>

### 2. What makes an assertion meaningful rather than a copy of the implementation?

**Apply it:** Write assertions that would catch a missing reduce initial value and accidental mutation, using expectations chosen independently.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

It checks an observable contract against independently chosen expectations. Include cases that challenge plausible bugs: empty input, zero, mutation, stale responses, or cleanup. A test that calculates its expected result with the same flawed algorithm can agree while both are wrong.

The contract is the total quantity for an array of valid quantity records, including an empty array, with no input mutation.

```js runnable
import assert from 'node:assert/strict';

function totalQuantity(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
assert.equal(totalQuantity([]), 0);
assert.equal(totalQuantity([{ quantity: 0 }]), 0);
const items = [{ quantity: 2 }, { quantity: 3 }];
const before = structuredClone(items);
assert.equal(totalQuantity(items), 5);
assert.deepEqual(items, before);
console.log('empty, zero, total, and nonmutation checked');
```

**Expected output**

```text output
empty, zero, total, and nonmutation checked
```

An implementation that omits the initial accumulator fails the empty case. The mixed-quantity case catches returning only the last quantity instead of the total. The snapshot assertion checks the nonmutation promise separately from the returned number. These tests deliberately do not define behavior for invalid records: either document that precondition or add validation and rejection tests. Do not compute expected totals by repeating the same reduce expression inside the assertions.

</details>

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](./workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 14. Errors debugging and meaningful tests {/* #workbook-14 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** explain both a successful calculation and a failure.

Trace `divide(8, 2)` first. Then trace `divide(8, 0)` and identify the statement that throws. Once it throws, follow the catch block instead of continuing through the rest of the try block.

Use [the test setup](#run-a-test-without-dependencies) to turn the function's rules into assertions. Test a normal result and the required error. A syntax error prevents parsing, a runtime error occurs during execution, and a logic error produces the wrong result. [Debug the smallest failing case](#debug-the-smallest-failing-case) instead of changing several things at once.

**Worked example**

```js
function divide(a, b) {
  if (b === 0) throw new Error("Divisor must not be zero");
  return a / b;
}
try {
  console.log(divide(8, 2));
  divide(8, 0);
} catch (error) {
  console.log(error.message);
}
```

**Expected output**

```text
4
Divisor must not be zero
```

The first call succeeds. The second throws before division occurs, so control moves to catch. Throwing is an explicit contract choice: ordinary JavaScript number division by zero can produce Infinity instead.

**Trace the example step by step**

1. divide(8, 2) passes the zero-divisor guard, returns 4, and the console prints it.

2. divide(8, 0) reaches throw. That call stops before reaching the division return.

3. Control transfers to the matching catch. Statements later in the interrupted try block would be skipped.

4. The catch prints the Error object's message. This function deliberately rejects zero even though ordinary Number division can produce Infinity.

**Common mistakes and how to reason about them**

Do not hide errors with an empty catch. Read enough of the stack trace to locate your own code. Test empty input when permitted, boundary values, duplicates, and cases that challenge your initialization. A suite should be small enough to understand and strong enough to catch meaningful mistakes.

</details>

Find **14A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-14-answer">
<summary>Check your reasoning and answer</summary>

**14A.** The missing parenthesis is a syntax error. The incorrect total is a logic error if execution otherwise succeeds.

A missing parenthesis violates grammar and is a syntax error. A wrong total with valid execution is a logic error. Calling a nonexistent function is a runtime error: the grammar can be valid while the operation fails.

**14B.** Initializing the maximum to 0 incorrectly returns 0 for all-negative input.

For [-8, -2], starting best at 0 returns a value that was never an input. Initializing from the first input avoids this invented candidate. A negative-only test exposes the distinction immediately.

**14C.** Initialize from the first actual element after handling the empty case.

After the empty case returns null, the first element is a valid candidate. Each comparison preserves the invariant that best is the maximum processed value. Test [3, 1] =&gt; 3, [-8, -2] =&gt; -2, and [] =&gt; null.

**Reference code**

```js
function maximum(values) {
  if (values.length === 0) return null;
  let best = values[0];
  for (const value of values) if (value > best) best = value;
  return best;
}
```

**Check the result**

```js
assert.equal(maximum([3, 1]), 3);
assert.equal(maximum([-8, -2]), -2);
assert.equal(maximum([]), null);
```

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **14A — Classify a missing closing parenthesis and an incorrect total as syntax, runtime, or logic errors.** | **Must fix** | [Worked example](#workbook-14) | [Answer](#workbook-14-answer) |
| **14B — Why should a maximum-finding function be tested with only negative numbers?** | **Must fix** | [Worked example](#workbook-14) | [Answer](#workbook-14-answer) |
| **14C — Write maximum(values), returning null for an empty array. Test [3, 1], [-8, -2], and [].** | **Must fix** | [Worked example](#workbook-14) | [Answer](#workbook-14-answer) |
