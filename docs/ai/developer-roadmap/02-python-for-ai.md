---
title: "2. Python, software design, APIs, and async"
sidebar_position: 2
---

# Python, software design, APIs, and async

**Prerequisites:** [AI fundamentals](01-ai-fundamentals.md). You may skip familiar syntax only after completing the exercises. Use the core [Python lessons](../foundations/02-python-values.md) through [environments and packages](../foundations/06-git-environments-and-packages.md) for worked introductions.

## What it is and why it matters

Python connects data preparation, numerical libraries, training, and model-serving tools. Your JavaScript or backend experience transfers, but Python's iteration, mutability, packaging, and concurrency rules deserve deliberate practice. A reproducible experiment is a small software product: someone else must be able to run it.

## Learn in this order

### Fundamentals and reproducibility

Learn values, collections, conditions, loops, functions, modules, exceptions, comprehensions, iterators, generators, and context managers. Understand references: assigning a list to a second variable does not copy it. Practice shallow versus nested copying, default arguments, file encodings, and explicit handling of missing values.

Use an isolated environment, a dependency record, configuration separate from secrets, and a command-line entry point. Type annotations help tools and readers; ordinary Python does not enforce them at runtime. Tests should check meaningful behavior, including invalid input.

**Practice:** port a small TypeScript CSV-processing function into Python. Add tests for an empty file, missing field, duplicate row, and malformed number. Use a generator to process records without reading the entire file into memory.

### OOP and design patterns

A class bundles state and behavior. Learn instance attributes, methods, composition, inheritance, dataclasses, and interfaces expressed with protocols or small abstract classes. Prefer composition when a service needs interchangeable components.

Use an **adapter** to isolate a model provider, a **strategy** to swap ranking methods, and a **repository** to hide storage details. Dependency injection means supplying these collaborators from outside, making tests able to use fakes. Patterns are tools for a concrete change boundary, not a requirement to turn every function into a class.

**Practice:** implement one `SearchService` with an injected storage adapter; replace disk storage with an in-memory fake without changing the service.

### DSA for AI applications

Learn arrays/lists, dictionaries, sets, stacks, queues, heaps, trees, graphs, sorting, binary search, and time/space complexity. Hash lookups support deduplication; queues support work scheduling; heaps keep the best `k` candidates; graph traversal supports dependency planning. A nested scan over all query/document pairs can dominate an otherwise small application.

**Practice:** deduplicate IDs while retaining order, implement breadth-first traversal of a dependency graph, and compare keeping top results by full sorting versus a bounded heap. Use the [DSA library](../../DSA/index.md) when a data structure is unfamiliar.

### APIs and async programming

An API needs a schema, identity, input limits, timeouts, error categories, and a versioned contract. Learn HTTP clients, JSON validation, pagination, retries, streaming, and cancellation. A retry is appropriate only when the operation and failure permit it.

`async def` defines a coroutine; `await` yields while an asynchronous operation waits. Concurrency can overlap network waits. It does not automatically speed up CPU-bound Python computation. Use bounded concurrency so a large batch does not create unbounded requests. **Backpressure** means limiting incoming work when downstream capacity is full.

This offline example uses a semaphore, a counter limiting how many tasks enter a section at once:

```python runnable
import asyncio

async def main():
    limit = asyncio.Semaphore(2)

    async def lookup(item):
        async with limit:
            await asyncio.sleep(0)
            return item.upper()

    results = await asyncio.gather(
        *(lookup(item) for item in ["data", "model", "test"])
    )
    print(results)

asyncio.run(main())
```

```text output
['DATA', 'MODEL', 'TEST']
```

`gather` returns results in input order here. No network or model is involved. Extend it with simulated errors and a timeout; explain whether unfinished tasks should be cancelled or allowed to finish.

## Mastery lab: a bounded worker with an explicit contract

### Implement the mechanism before choosing a framework

A semaphore limits concurrent work; it does not prevent creating a million waiting tasks. A bounded queue limits work waiting in memory. Those are different resource constraints. Build a worker pool from a queue when inputs arrive continuously. Each item must be acknowledged exactly once by the worker's cleanup path, even if processing fails.

```python runnable
import asyncio

async def run():
    queue = asyncio.Queue(maxsize=2)
    results = {}
    async def worker():
        while True:
            item = await queue.get()
            try:
                if item is None:
                    return
                await asyncio.sleep(0)
                results[item] = item * item
            finally:
                queue.task_done()

    workers = [asyncio.create_task(worker()) for _ in range(2)]
    for item in range(5):
        await queue.put(item)
    for _ in workers:
        await queue.put(None)
    await queue.join()
    await asyncio.gather(*workers)
    print([results[i] for i in range(5)])

asyncio.run(run())
```

```text output
[0, 1, 4, 9, 16]
```

Trace queue capacity, active workers, and completed results separately. At most two items wait in this queue, while two workers may be processing other items. The results dictionary still grows with total input: bounded work queues do not imply bounded end-to-end memory. Stream results to a sink for an unbounded input.

### Debug the failure boundary

Remove `task_done()` and explain why `join()` waits forever. Next, raise an exception inside a worker. The `finally` acknowledges that item, but losing a worker can still leave later work unprocessed. For production, define whether failures stop the batch or become recorded item failures; supervise workers and propagate cancellation. See Python's [task and cancellation documentation](https://docs.python.org/3/library/asyncio-task.html).

CPU-heavy Python work does not become parallel merely because the function is `async`. Measure event-loop delay, queue wait, processing time, and memory separately. Move CPU work to a suitable execution boundary only after measuring it; native numerical libraries have their own threading behavior.

### Production, design, and defense

Wrap external APIs in adapters with explicit input/output types. Place retries at the layer that knows whether an operation is safe to repeat. A timed-out write can have succeeded remotely, so a retry needs an idempotency contract. Separate parsing, business rules, persistence, and transport; OOP is useful when an object owns an invariant, while a pure function often suffices for transformations.

**Interview defense:** a client asks for 10,000 concurrent requests. Explain queue capacity, connection limits, deadlines, backpressure, cancellation, and failure policy before choosing a concurrency number. Compare a thread, process, and coroutine using the workload rather than slogans.

**Teach it:** draw five jobs moving through a two-seat waiting room and two workers. Ask the learner where the sixth job waits and what happens when a worker crashes. Implement and verify that failure policy as the extension.

## Mini project and real-world use

Build a small document-ingestion service with a CLI and an HTTP interface. Validate records, stream a local file, deduplicate document IDs, and process simulated lookups with bounded concurrency. Add an adapter so later modules can supply embeddings without rewriting the input pipeline.

Real uses include batch enrichment, document import, model gateways, and background evaluation jobs. Keep CPU-heavy work outside the request's event loop when it would block other users.

**Completion evidence:** setup commands, dependency record, API contract, tests, bounded batch behavior, and a clean shutdown demonstration.

## Interview questions

1. When does list assignment share state, and when does a copy still share nested state?
2. Why choose composition over a large inheritance tree for model adapters?
3. When is a heap more useful than sorting every candidate?
4. Why does calling a blocking function inside `async def` still block?
5. Which requests can you safely retry after a timeout, and what makes the others ambiguous?

## Curated resources

- **Course:** [CS50 Python](https://cs50.harvard.edu/python/) for language fundamentals; the [asyncio documentation](https://docs.python.org/3/library/asyncio.html) for current concurrency behavior.
- **Book:** [Architecture Patterns with Python](https://www.cosmicpython.com/book/preface.html), Percival and Gregory, for adapters, repositories, and testable service design.
- **Paper / design document:** [PEP 3156](https://peps.python.org/pep-3156/) explains the design behind asyncio; it is a language proposal, not an ML research paper.
- **GitHub:** [CPython](https://github.com/python/cpython); inspect library documentation and tests before attempting interpreter internals.

**Previous:** [AI fundamentals](01-ai-fundamentals.md) · **Next:** [Mathematics](03-mathematics.md).
