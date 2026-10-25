---
title: "Identifiers in distributed systems"
slug: "/system-design/ids"
pagination_prev: "system-design/distributed/clocks"
pagination_next: "system-design/distributed/geospatial"
---

<span id="identifiers-in-distributed-systems"></span>

# Identifiers in distributed systems

Allocate unique identities under concurrency and clock changes.

**Prerequisite / previous:** [Clocks, time, and ordering](clocks.md) · **Next:** [Geospatial indexing and proximity search](geospatial.md)


An identifier distinguishes one entity or operation from another. A school roll number only has meaning within its school and year; a distributed ID also needs an explicit scope and lifetime. Uniqueness, sort order, and secrecy are different requirements.

## Compare allocation strategies

| Strategy | Strength | Trade-off |
| --- | --- | --- |
| Database sequence | Simple allocation and local uniqueness | Coordination, gaps, and predictable values |
| Reserved ID ranges | Amortizes allocator calls | Wasted ranges after crashes; ownership must be durable |
| UUIDv4 | Independent random generation | Probabilistic uniqueness; random index locality |
| UUIDv7 | Time-ordered format with random bits | Timestamp disclosure and clock/order assumptions |
| Snowflake-style ID | Compact timestamp, worker, sequence layout | Unique worker assignment, sequence exhaustion, clock rollback |
| Atomic counter service | Easy increment interface | Durability and failover can affect uniqueness |

UUID versions differ; it is incorrect to say all UUIDs are nonsequential. The [UUID standard, RFC 9562](https://www.rfc-editor.org/rfc/rfc9562.html), specifies the formats. Enforce a database uniqueness constraint where collisions must be detected, and define retry behavior.

## Worked bit budget

An illustrative positive 64-bit layout reserves one sign bit, 41 timestamp bits, 10 worker bits, and 12 per-time-unit sequence bits. With milliseconds, 12 bits allow 4,096 allocations per worker per millisecond and 10 bits distinguish 1,024 workers. The timestamp epoch and 41-bit lifetime must be documented. These are theoretical bit limits, not a throughput benchmark.

On clock rollback, the generator must block, reject, or follow a documented logical-time strategy. Silently continuing with a reused timestamp and sequence can collide. Reusing a worker ID while an old process is still alive is another collision path. Sorting IDs approximately by time does not give a causal or globally linearizable order.

## IDs are not permission checks

A task ID can be guessed without granting access if the server enforces ownership. Conversely, an unguessable ID does not replace authorization. Do not expose a sequence if revealing creation volume matters; choose a separate public identifier when needed. An idempotency key identifies one intended operation and must be scoped to the caller, request fingerprint, and retention window.

## Failure and scaling exercise

Restart an allocator after reserving a range, simulate a backward clock step, exhaust the per-millisecond sequence, and run two processes with the same worker ID. **Check:** each outcome is either safely rejected or preserves the declared uniqueness scope. Include backup restore and replica promotion in the counter-service case.

**Interview questions:** when are gaps acceptable? Why is a Redis increment alone insufficient to prove durable global uniqueness after failover? Which requirements actually justify 64-bit time-ordered IDs rather than a standard UUID?

## Architecture flow

```mermaid
flowchart LR
  accTitle: ID allocation records ownership before returning a stable identifier
  C[Create request] --> A[Choose random or allocated ID]
 A --> U[Atomic uniqueness constraint]
 U -->|Accepted| R[Return stable ID]
 U -->|Collision| A
```
