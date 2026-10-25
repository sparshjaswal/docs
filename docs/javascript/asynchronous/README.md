---
id: javascript-asynchronous-readme
slug: /javascript/asynchronous/README
title: "Asynchronous JavaScript"
sidebar_label: "Asynchronous JavaScript"
---

# Asynchronous JavaScript

Some jobs finish later: a download, a timer, or a user's next click. **Asynchronous** code lets your program arrange what should happen when that work is ready. It does not mean every job runs at the same time.

Follow this route:

1. [Execution and the event loop](./asynchronous.md): trace which function runs now and which waits.
2. [Promises](./promises.md): represent a result that may arrive later or fail.
3. [Async/await and cancellation](./async-await.md): write the steps of a waiting operation and stop work you no longer need.
4. [Error handling](../error-handling.md): decide what the user should see if a step fails.

A useful project is a button that loads a list. First show “Loading”, then show either the list or an error. Add overlapping requests only after that single request works.

## Choose the right composition

| Need | Technique | Failure behavior |
| --- | --- | --- |
| Result B depends on result A | Sequential `await` | Stop or handle the failure before continuing |
| All independent results are needed | Start operations, then `Promise.all` | Rejects when an input rejects; other operations continue |
| Every outcome is needed | `Promise.allSettled` | Returns fulfillment/rejection records |
| Any successful result is enough | `Promise.any` | Rejects with AggregateError if every input rejects |
| First settled result determines the outcome | `Promise.race` | A rejection can win; losing work continues |
| Process a stream progressively | `for await...of` | Consumer must handle iteration errors and cleanup |

Concurrency overlaps waiting work. Parallelism executes work on multiple agents/cores. Using `Promise.all` does not, by itself, provide parallel JavaScript execution.

## Edition connections

[Promises and combinators](./promises.md) · [Async functions](./async-await.md) · [Async iteration and collection](../collections-and-iteration.md) · [Top-level await](../import-and-export.md) · [Feature coverage by edition](../index.md#ecmascript-20152026-feature-coverage)

## Check your understanding

Before moving on, demonstrate a rejection path, distinguish sequential from concurrent startup, and explain who owns cancellation and resource cleanup. A successful example alone does not establish reliable async behavior.

## Interview preparation

Practise the questions alongside their concept explanations: [Output order](asynchronous.md#interview-questions) · [Promise combinators](promises.md#interview-questions) · [Await and concurrency](async-await.md#interview-questions).

Predict each worked example, explain the result, and answer its follow-up. Use the [complete interview route](../index.md#interview-preparation) to cover the remaining topics.

## Failure drill: timeout is not cancellation

Race a slow operation against a timeout. After the timeout wins, identify whether the slow operation is still running and whether it can still change state.

<details>
<summary>Expected reasoning</summary>

`Promise.race` observes the first settlement and does not stop the losing work. Use the operation's supported cancellation mechanism and reject stale results at the owner boundary. If the operation is a server mutation, reconcile its outcome before an unsafe retry. Test both a late success and a late failure.

</details>
