---
title: 'SOLID design principles'
description: 'Learn the five SOLID principles through one small Node.js API.'
keywords:
  - solid principles
  - nodejs api
  - software design
  - maintainable code
sidebar_label: 'SOLID principles'
---

# SOLID principles

## Overview

SOLID is a set of five principles for code that is easier to change and test. Use them to reason about a concrete change, not to maximize the number of classes. Prerequisites: [functions](../javascript/functions/README.md), [objects](../javascript/objects-and-classes.md), and [async/await](../javascript/asynchronous/async-await.md).

By the end, you should be able to identify a responsibility, define a replacement's contract, and test that two implementations preserve it.

## Why it exists

Suppose a user endpoint directly queries one database, formats HTTP, sends email, and logs a full user record. A storage migration now risks changing response behavior and exposing private information. Separate the decisions that change for different reasons, then make their shared promises explicit.

## Mental model

Think in terms of **responsibilities and promises**. A boundary is useful when it lets one decision change while callers keep their guarantees. An interface is a contract, even if JavaScript expresses it as an object with one method. The analogy stops at names: a matching method name does not prove matching behavior.

## Visual explanation

| Principle | Question to ask | In the user API |
| --- | --- | --- |
| Single responsibility | Who asks for this behavior to change? | Storage rules and HTTP formatting have separate owners. |
| Open/closed | Which known variation can use a stable boundary? | Select a reader without rewriting the handler. |
| Liskov substitution | Can a caller safely use the replacement? | Missing users still return `null`; failures still reject. |
| Interface segregation | What does this caller actually need? | A lookup endpoint needs no write methods. |
| Dependency inversion | Does policy depend on a storage detail? | The handler consumes a reader contract; setup supplies it. |

## Real-world example: a Node.js API {/* #nodejs-api-example */}

`GET /users/:id` returns a user. Save this complete example as `users.mjs` and run `node users.mjs`; stop it with Ctrl+C. It listens only on your computer and has no authentication. It uses Node's built-in [HTTP server](https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener). The handler receives a **reader**: an object that knows how to find a user.

```js
import { createServer } from 'node:http';

const users = new Map([['1', { id: '1', name: 'Mira' }]]);
const memoryReader = {
  async findById(id) {
    return users.get(id) ?? null;
  },
};

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function createUserHandler(reader) {
  return async (req, res) => {
    const path = req.url.split('?')[0];
    const match = /^\/users\/(\d+)$/.exec(path);
    if (!match) return sendJson(res, 404, { error: 'Route not found' });
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return sendJson(res, 405, { error: 'Method not allowed' });
    }

    try {
      const user = await reader.findById(match[1]);
      sendJson(res, user ? 200 : 404, user ?? { error: 'User not found' });
    } catch {
      sendJson(res, 500, { error: 'Could not load user' });
    }
  };
}

createServer(createUserHandler(memoryReader)).listen(3001, '127.0.0.1');
```

| Request | Status | JSON response |
| --- | --- | --- |
| `GET /users/1` | `200` | `{"id":"1","name":"Mira"}` |
| `GET /users/99` | `404` | `{"error":"User not found"}` |

## Single responsibility principle

**Give each part one reason to change.** The reader handles storage, `sendJson` formats responses, and the handler handles HTTP requests. A database change belongs in the reader.

## Open/closed principle

**Add new behavior through an existing contract.** Add a database reader and pass it to `createUserHandler`. The handler stays unchanged because it still calls `findById`.

## Liskov substitution principle

**A replacement must keep the same promises.** Every reader accepts a string ID and resolves to a user shaped like `{ id, name }`, or `null` when missing. Storage failures reject the promise.

Returning `[]` for a missing user breaks this contract: the handler would send `200` instead of `404`.

## Interface segregation principle

**Give callers only the operations they need.** This endpoint needs `findById`. A reader should not need dummy `save` or `delete` methods just to work with it.

## Dependency inversion principle

**Make application logic depend on a small contract.** The handler depends on the reader's `findById` contract. Application setup chooses the concrete `memoryReader` and passes it in. Passing a dependency this way is called **dependency injection**.

## Trade-offs

A small function can be the entire abstraction. Keep direct code when there is no useful variation or independent responsibility. Introduce a reader contract when storage replacement, testing, or ownership justifies it. Open/closed does not mean existing code must never change; changing the contract intentionally may be better than maintaining an awkward extension point.

Dependency injection is the act of supplying a dependency. Dependency inversion is the direction of the design dependency: higher-level policy owns a contract that details satisfy. An injected database client can still leak database-specific assumptions into the handler.

## Failure scenarios

| Trigger | Symptom | Detection and recovery |
| --- | --- | --- |
| Replacement uses `[]` for a missing user | Endpoint returns a misleading success | Run shared missing-user checks; normalize at the adapter. |
| Replacement accepts only numeric IDs | Previously valid string IDs fail | Check accepted inputs, not just return types. |
| “One responsibility” becomes one-line classes | Changes require tracing many files | Group cohesive behavior around a real reason to change. |
| Shared fake is more permissive than the real reader | Tests pass while production fails | Run the same contract suite against the real adapter in a controlled environment. |

## Production considerations

Specify identity, tenant scope, errors, cancellation, and consistency before adding a real database reader. A handler should not mistake a timeout for “user not found.” Bound dependency time with the request budget, avoid logging full user records, and test authorization separately. SOLID does not supply those system guarantees; see [API design](../system-design/interfaces/api-design.md) and [resilience](../system-design/operations/resilience.md).

## Exercises

This complete contract check demonstrates what a replacement must preserve for present and missing users. Add a rejected-promise case when adapting a real store.

```js runnable
import assert from 'node:assert/strict';
async function checkReader(reader) {
  assert.deepEqual(await reader.findById('1'), { id: '1', name: 'Mira' });
  assert.equal(await reader.findById('missing'), null);
}
const reader = {
  async findById(id) { return id === '1' ? { id: '1', name: 'Mira' } : null; },
};
await checkReader(reader);
console.log('Reader contract passed');
```

```text output
Reader contract passed
```

Change the missing-user result to `[]`, predict the failing assertion, and repair the adapter. Then add an email notification requirement: decide whether it belongs in lookup, a separate use case, or an event after a write.

<details>
<summary>Reasoning for the notification change</summary>

A read should not unexpectedly send email on every retry. Put notification behavior behind an explicit business action and define its failure and retry contract. Splitting files alone would not fix the mistaken responsibility.

</details>

## Interview questions & answers

<details>
<summary>Can a subclass satisfy a type checker and still violate substitution?</summary>

Yes. It can require stronger input conditions, weaken output guarantees, or introduce incompatible side effects while keeping the same signature. Test the behavior relied on by callers.

</details>

<details>
<summary>How would you decide whether this endpoint needs an abstraction?</summary>

Name the change or testing boundary first. A reader is justified when the caller should be independent of storage. Extra factories or class hierarchies need their own demonstrated benefit.

</details>

## Completion checkpoint

Explain each row of the table with a counterexample. Run present, missing, and failure cases against two readers. Identify one abstraction you deliberately did not add.

**Interview cheat sheet:** responsibility → known variation → behavioral substitution → small caller contract → policy-owned dependency. **Key takeaways:** design around change, preserve promises, and prefer the smallest boundary that solves the problem.

## Further reading

- [Barbara Liskov and Jeannette Wing: A Behavioral Notion of Subtyping](https://www.cs.cmu.edu/~wing/publications/LiskovWing94.pdf).
- [Robert C. Martin: Design Principles and Design Patterns](https://web.archive.org/web/20150905081111/http://www.objectmentor.com/resources/articles/Principles_and_Patterns.pdf).
