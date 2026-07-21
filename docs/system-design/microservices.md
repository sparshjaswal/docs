---
title: "Microservices"
sidebar_position: 13
---

# Microservices

> **One-line summary**: Microservices split a system into small, independently deployable services aligned to business capabilities — trading operational complexity for team autonomy and independent scaling.

---

## 🧩 Core Concepts

### Monolith vs. Microservices

```mermaid
flowchart TB
    subgraph Monolith
        M[Single Deployable<br/>UI + Orders + Payments + Users]
        M --> MDB[(Shared DB)]
    end
    subgraph Microservices
        GW[API Gateway]
        GW --> S1[Orders Svc] --> D1[(Orders DB)]
        GW --> S2[Payments Svc] --> D2[(Payments DB)]
        GW --> S3[Users Svc] --> D3[(Users DB)]
    end
```

| Aspect               | Monolith                     | Microservices                           |
| -------------------- | ---------------------------- | --------------------------------------- |
| **Deployment**       | One unit                     | Independent per service                 |
| **Scaling**          | Whole app together           | Per-service, targeted                   |
| **Tech stack**       | Uniform                      | Polyglot allowed                        |
| **Team autonomy**    | Coupled                      | High (own service end-to-end)           |
| **Data**             | Shared DB, easy joins/txns   | DB-per-service, distributed data        |
| **Operational cost** | Low                          | High (infra, observability, networking) |
| **Fault isolation**  | Weak (one bug can crash all) | Strong (blast radius contained)         |
| **Local dev/debug**  | Simple                       | Complex (many moving parts)             |

**Start with a well-structured monolith**; extract services when team size, scaling needs, or deployment friction justify the added complexity.

### Service Boundaries & DDD

Use **Domain-Driven Design** to draw boundaries. Each service should own a **bounded context** — a cohesive business capability with its **own data**. Aim for **high cohesion inside** a service and **loose coupling between** services. Avoid the _distributed monolith_ anti-pattern (services that must deploy together).

### Service Discovery

Instances come and go (autoscaling, failures), so their network locations are dynamic. A **service registry** tracks healthy instances.

```mermaid
flowchart LR
    S[Service Instance] -->|register / heartbeat| R[(Service Registry)]
    C[Caller] -->|lookup 'orders'| R
    R -->|healthy instances| C
    C --> S
```

- **Client-side discovery** — caller queries the registry and load-balances itself.
- **Server-side discovery** — a load balancer / gateway resolves the target (e.g., Kubernetes Services, Consul, Eureka).

### API Gateway

A single entry point for clients that handles cross-cutting concerns so individual services don't have to:

- Routing & request aggregation
- Authentication / authorization
- Rate limiting & throttling
- TLS termination, caching, request/response transformation

See [API Design](./api-design.md) for the contract details behind the gateway.

### Inter-Service Communication: Sync vs. Async

```mermaid
flowchart LR
    subgraph Sync[Synchronous]
        A[Order Svc] -->|REST/gRPC request| B[Payment Svc]
        B -->|response| A
    end
    subgraph Async[Asynchronous]
        C[Order Svc] -->|publish event| Q[(Broker)]
        Q --> D[Payment Svc]
        Q --> E[Notification Svc]
    end
```

|                    | Synchronous (REST/gRPC)     | Asynchronous (events/queues)        |
| ------------------ | --------------------------- | ----------------------------------- |
| **Coupling**       | Temporal (both must be up)  | Decoupled                           |
| **Latency**        | Immediate response          | Eventual                            |
| **Failure impact** | Cascades if downstream slow | Absorbed by broker                  |
| **Best for**       | Query needing an answer now | Fire-and-forget, fan-out, workflows |

Prefer **async messaging** for workflows and fan-out (see [Message Queues](./message-queues.md)); use **sync** when the caller genuinely needs an immediate result.

---

## 🔄 Saga Pattern (Distributed Transactions)

Without a shared database you can't use a single ACID transaction across services. A **saga** is a sequence of local transactions; if one step fails, **compensating transactions** undo the prior steps.

```mermaid
sequenceDiagram
    participant O as Order
    participant P as Payment
    participant I as Inventory
    O->>O: create order (pending)
    O->>P: charge customer
    P-->>O: charged
    O->>I: reserve stock
    I-->>O: out of stock (fail)
    O->>P: refund (compensate)
    O->>O: cancel order
```

- **Choreography** — services react to each other's events; no central coordinator. Simple but harder to trace.
- **Orchestration** — a central orchestrator drives the steps and compensations. Clearer control flow, single point to reason about.

Sagas provide **eventual consistency** rather than immediate atomicity — see [Consistency Models](./consistency-models.md).

---

## 🔎 Observability

With many services, you can't debug by reading one log file. The three pillars:

- **Logging** — structured, centralized logs correlated by a **trace/correlation ID**.
- **Metrics** — numeric time series (latency, error rate, throughput, saturation — the RED/USE methods).
- **Tracing** — distributed traces follow a request across service hops to pinpoint bottlenecks.

```mermaid
flowchart LR
    Svc1 --> Col[Telemetry Collector]
    Svc2 --> Col
    Svc3 --> Col
    Col --> Logs[(Logs)]
    Col --> Metrics[(Metrics)]
    Col --> Traces[(Traces)]
    Logs & Metrics & Traces --> Dash[Dashboards & Alerts]
```

---

## 🛡️ Resilience Patterns

| Pattern                          | Problem it solves                       | How                                                     |
| -------------------------------- | --------------------------------------- | ------------------------------------------------------- |
| **Timeouts**                     | Hanging calls tie up resources          | Cap how long a call may wait                            |
| **Retries (+ backoff + jitter)** | Transient failures                      | Retry idempotent calls with exponential backoff         |
| **Circuit breaker**              | Cascading failures to a sick service    | Trip open after N failures, fail fast, probe to recover |
| **Bulkhead**                     | One dependency exhausting all resources | Isolate pools per dependency                            |
| **Fallback**                     | Degrade gracefully                      | Serve cached/default response                           |

```mermaid
stateDiagram-v2
    [*] --> Closed
    Closed --> Open: failures >= threshold
    Open --> HalfOpen: after cooldown
    HalfOpen --> Closed: probe succeeds
    HalfOpen --> Open: probe fails
```

Combine retries with **idempotency** (see [API Design](./api-design.md)) to avoid duplicate side effects.

---

## ⚖️ Trade-offs / When to Use

| Adopt microservices when...                  | Stay monolithic when...                            |
| -------------------------------------------- | -------------------------------------------------- |
| Multiple teams need to ship independently    | Small team / early-stage product                   |
| Components have very different scaling needs | Domain is not yet well understood                  |
| You need fault isolation and polyglot stacks | Operational maturity (CI/CD, observability) is low |
| Deployment of the monolith is a bottleneck   | Simplicity and low latency joins matter most       |

**Prerequisites**: strong automation (CI/CD), containerization/orchestration, centralized observability, and clear ownership — without these, microservices amplify pain.

---

> **Note (AI-assisted draft):** The following Interview Questions, Production Checklist, and Testing & Monitoring items are a draft. Add organization-specific CI/CD links and observability dashboards as needed.

## Interview Questions

### How do you decide whether to extract a component from the monolith into a microservice?

Extract when the component has a clear bounded context, independent scalability or deployment needs, or when multiple teams need independent ownership. Also consider operational maturity: CI/CD, observability, and test automation must be in place. If the cost (operational complexity, network overhead) outweighs the benefits, keep it in the monolith.

### Compare choreography vs orchestration for sagas — when is each preferable?

- Choreography: services emit and react to events with no central coordinator. Prefer when you want low coupling and simpler scaling, but the flow can be harder to observe and reason about.
- Orchestration: a central orchestrator commands each step and compensations. Prefer when you need clear flow control, visibility, and easier error handling at the cost of a single control point.

Choose choreography for lightweight event-driven flows and orchestration when correctness and clear sequencing are critical.

### How do you design service boundaries to minimize cross-service transactions and latency?

Design around business capabilities (bounded contexts) so the most common transactions and queries are local to a service. Co-locate frequently-accessed data, prefer async interactions for long-running work, and use shared caches or denormalization to avoid synchronous cross-service joins. Define SLAs for inter-service calls and instrument end-to-end traces.

## Production Checklist

- Ensure CI/CD pipelines for each service and a global integration test workflow
- Centralize observability (traces, metrics, logs) and enforce structured logs with correlation IDs
- Harden network policies, mTLS, and service-to-service auth (e.g., SPIFFE/SPIRE)
- Automate schema and contract migrations with consumer-driven contract tests
- Maintain a shared dashboard with SLOs and error budgets per service

## Testing & Monitoring

- Run integration tests that validate sagas and compensations end-to-end
- Simulate partial failures and validate circuit breakers and bulkheads behave correctly
- Measure cross-service latency and set SLOs per interaction
- Validate tracing propagation (trace IDs) across service boundaries under load

## 🔗 Related Topics

- [Scalability](./scalability.md) — scale individual services independently
- [Load Balancing](./load-balancing.md) — distribute traffic across service instances
- [Consistency Models](./consistency-models.md) — sagas yield eventual consistency
- [Rate Limiting](./rate-limiting.md) — enforced at the API gateway
- [Message Queues](./message-queues.md) — async backbone for inter-service events
- [API Design](./api-design.md) — the contracts services expose

[← Back to System Design](./index.md) · © sparshjaswal
