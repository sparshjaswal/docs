---
title: System Design
slug: /system-design
description: One connected course from a single request to production distributed systems.
pagination_prev: null
pagination_next: system-design/foundations/computer-fundamentals
---

# System Design

System design is the work of deciding how programs, data, machines, and people cooperate to meet a need. Start with a school task list: who can change a task, where is it saved, and what happens when the network fails? The same questions lead to the architecture of a payment system or a global video service.

This is the repository's authoritative System Design course. Follow the single sequence below and the matching sidebar. It brings the former backend lessons, design notes, and engineering case studies into their canonical topics.

## Audience, prerequisites, and outcomes

School-level learners can start with basic arithmetic and a willingness to trace steps. The opening lessons explain machines, requests, and data. Before implementing examples, learn [JavaScript functions](../javascript/functions/README.md), [async work](../javascript/asynchronous/async-await.md), and [basic data structures](../DSA/index.md). No paid cloud account is required for the design exercises.

Backend and full-stack engineers should build the task-service project. Engineers studying distributed systems should test each stated invariant under failure. Interview candidates should explain each checkpoint aloud. These are ways to use the same sequence, not separate routes through copied material. Experienced readers can attempt a checkpoint first and use the linked lesson to resolve gaps.

By the end, you should be able to define requirements and invariants, estimate capacity with units, choose interfaces and data ownership, explain trade-offs, bound partial failure, plan safe changes, and defend a recovery procedure with measured evidence.

## Study method

Read the simple explanation, trace the diagram, inspect the implementation details, and attempt the failure exercise. Keep a notebook with assumptions, a request flow, a data model, a capacity estimate, and the decision you would change if the workload changed. A diagram describes the accompanying contract; a box labeled “cache” or “queue” does not establish correctness by itself.

Each lesson has a prerequisite/previous link and a next link matching Docusaurus pagination. The later sections apply earlier mechanisms. Code marked `js runnable` has an executable check. Framework/configuration fragments name external dependencies and illustrate a contract; they are not a deployable application without the missing environment, credentials, and integrations.

## Complete course contents

### Understand the system

| Step | Canonical lesson | Learning outcome |
| --- | --- | --- |
| 1 | [Start here: computers, requests, and data](foundations/computer-fundamentals.md) | Understand programs, bytes, machines, and one request. |
| 2 | [Requirements and invariants](foundations/requirements.md) | Turn a user need into constraints, invariants, and measurable success. |
| 3 | [Processes, memory, and concurrency](foundations/processes.md) | Trace execution, memory, concurrency, and operating-system boundaries. |
| 4 | [Network foundations](foundations/networking.md) | Explain addressing, transport, routing, DNS, and cloud networks. |
| 5 | [From a browser address to a response](foundations/request-flow.md) | Follow a browser request through DNS, TLS, HTTP, and rendering. |
| 6 | [Capacity, latency, and growth](foundations/capacity.md) | Estimate traffic and storage with units; find the measured bottleneck. |

### Define service boundaries

| Step | Canonical lesson | Learning outcome |
| --- | --- | --- |
| 7 | [API Design](interfaces/api-design.md) | Define stable operations, pagination, errors, and retry contracts. |
| 8 | [Validation](interfaces/validation.md) | Check input shape, business rules, and concurrent database constraints. |
| 9 | [Authentication, sessions, and delegated access](interfaces/authentication.md) | Establish identity with sessions, tokens, OAuth, OIDC, and recovery. |
| 10 | [Security and trust boundaries](interfaces/security.md) | Protect data across tenant, network, and privilege boundaries. |
| 11 | [Implementing a service in Node.js](interfaces/server-runtime.md) | Connect HTTP routing, application services, and explicit dependencies. |
| 12 | [Error Handling](interfaces/error-handling.md) | Make failures actionable without hiding uncertain write outcomes. |
| 13 | [gRPC](interfaces/grpc.md) | Design typed RPC and streaming with deadlines and cancellation. |
| 14 | [API Gateway](interfaces/api-gateway.md) | Route and protect external traffic while preserving service ownership. |
| 15 | [BFF (Backend for Frontend)](interfaces/bff.md) | Compose a client-specific response with bounded fan-out and authority. |
| 16 | [WebSockets](interfaces/websockets.md) | Maintain live connections, authorize messages, and recover after reconnect. |

### Store and serve data

| Step | Canonical lesson | Learning outcome |
| --- | --- | --- |
| 17 | [Data models, indexes, and transactions](data/databases.md) | Choose models, indexes, transactions, and isolation by access pattern. |
| 18 | [Storage interfaces and large objects](data/storage.md) | Select file, block, or object storage and make uploads recoverable. |
| 19 | [Caching](data/caching.md) | Balance freshness, correctness, eviction, and origin protection. |
| 20 | [Search indexing and crawling](data/search.md) | Build a derived index with crawling, ranking, and deletion rules. |
| 21 | [Data Pipelines Overview](data/data-pipelines.md) | Handle ingestion, event-time windows, checkpoints, and replay. |
| 22 | [Time-series data](data/time-series.md) | Control label cardinality, retention, and aggregate resolution. |

### Coordinate work

| Step | Canonical lesson | Learning outcome |
| --- | --- | --- |
| 23 | [Load Balancing](services/load-balancing.md) | Choose traffic distribution, health checks, and connection behavior. |
| 24 | [Service Discovery](services/service-discovery.md) | Resolve changing endpoints and handle stale routing information. |
| 25 | [Rate Limiting](services/rate-limiting.md) | Control fairness, admission, bursts, and counter failures. |
| 26 | [Message Queues](services/message-queues.md) | Define acknowledgement, retry, ordering, and backpressure boundaries. |
| 27 | [Realtime delivery and notifications](services/notifications.md) | Deliver updates through providers with deduplication and preferences. |
| 28 | [Microservices](services/microservices.md) | Choose ownership and deployment boundaries from concrete needs. |
| 29 | [Event sourcing, CQRS, and change data capture](services/event-sourcing.md) | Distinguish event notification, history, CQRS, CDC, and outbox delivery. |

### Operate and change safely

| Step | Canonical lesson | Learning outcome |
| --- | --- | --- |
| 30 | [Containers and orchestration](operations/containers.md) | Separate runtime isolation, scheduling, readiness, and liveness. |
| 31 | [Deployments, configuration, and safe change](operations/deployments.md) | Ship compatible code, configuration, schema, and infrastructure changes. |
| 32 | [Observability and service objectives](operations/observability.md) | Measure user outcomes and diagnose failures using signals and SLOs. |
| 33 | [Timeouts, retries, and failure isolation](operations/resilience.md) | Bound waiting, retries, concurrency, and cascading failure. |
| 34 | [Cloud service selection and cost](operations/cloud-platforms.md) | Compare service responsibilities, cost, and resource efficiency. |
| 35 | [Serverless execution and isolation](operations/serverless.md) | Evaluate execution limits, isolation, state, and per-use cost. |

### Distribute state

| Step | Canonical lesson | Learning outcome |
| --- | --- | --- |
| 36 | [Replication](distributed/replication.md) | Choose acknowledgement and failover contracts; rehearse regional recovery. |
| 37 | [Consistency Models](distributed/consistency-models.md) | Specify the visibility and ordering promised to a reader. |
| 38 | [CAP Theorem](distributed/cap-theorem.md) | Reason about a partition without reducing design to a slogan. |
| 39 | [Consensus and leader election](distributed/consensus.md) | Explain agreement, quorum, leader terms, and fencing. |
| 40 | [Distributed transactions and sagas](distributed/distributed-transactions.md) | Compare atomic commit with compensating workflows. |
| 41 | [Sharding](distributed/sharding.md) | Partition ownership and migrate data while preserving invariants. |
| 42 | [Clocks, time, and ordering](distributed/clocks.md) | Separate chronology, elapsed time, causal order, and lease safety. |
| 43 | [Identifiers in distributed systems](distributed/ids.md) | Allocate unique identities under concurrency and clock changes. |
| 44 | [Geospatial indexing and proximity search](distributed/geospatial.md) | Retrieve spatial candidates, filter by distance, and protect location privacy. |

### Apply the mechanisms

| Step | Canonical lesson | Learning outcome |
| --- | --- | --- |
| 45 | [Email delivery as a store-and-forward system](applications/email.md) | Separate submission, relay, acceptance, and mailbox delivery. |
| 46 | [Internationalization](applications/internationalization.md) | Preserve language, time, currency, and regional business meaning. |
| 47 | [Experiment platforms](applications/experimentation.md) | Assign stable cohorts and measure outcomes without biased attribution. |
| 48 | [AI services as fallible system components](applications/ai-systems.md) | Treat model output, retrieval, and tool execution as fallible components. |
| 49 | [Collaborative document editing](applications/collaborative-editing.md) | Merge concurrent edits, authorize documents, and rebuild history. |
| 50 | [Live streaming and latency budgets](applications/live-streaming.md) | Allocate capture, encode, transport, and playback latency budgets. |

### Build and defend complete designs

| Step | Canonical lesson | Learning outcome |
| --- | --- | --- |
| 51 | [Build and operate a task service](case-studies/task-service.md) | Implement and recover a tenant-safe API with measurable acceptance checks. |
| 52 | [Design a URL shortener](case-studies/url-shortener.md) | Allocate codes, manage expiry, and serve hot redirects. |
| 53 | [Design a durable chat system](case-studies/chat-system.md) | Persist messages, enforce membership, and recover delivery state. |
| 54 | [Design a social feed](case-studies/social-feed.md) | Choose fan-out, ranking, pagination, and deletion semantics. |
| 55 | [Design a video upload and playback platform](case-studies/video-platform.md) | Coordinate uploads, processing, publication, and playback. |
| 56 | [Design a ride dispatch service](case-studies/ride-dispatch.md) | Protect assignment invariants amid stale positions and delayed messages. |
| 57 | [Payment processing and reconciliation](case-studies/payments.md) | Handle unknown charges, settlement boundaries, and reconciliation. |
| 58 | [Designing an ordered matching service](case-studies/stock-exchange.md) | Order matching decisions and rebuild deterministic state. |
| 59 | [Architecture reviews and interviews](case-studies/design-review.md) | Defend assumptions, estimates, failure recovery, and trade-offs. |

## Sources and diagram assets

- [Source provenance and verification](references/sources.md) — Source ownership, retained illustrations, and the scope of verification.
- [Research papers](references/research-papers.md) — Primary papers for deeper investigation after the associated lesson.
- [Engineering reading list](references/scalability-reading-list.md) — Historical external bibliography; a research reference, not another syllabus.
- [Illustration catalog](references/illustrations.md) — Find original source illustrations preserved during consolidation.
- [Editable architecture diagrams](diagrams/README.md) — Open the preserved Excalidraw sources and image assets.

## Progress checklist

- [ ] Trace one request and state its owner, success condition, and uncertain outcome.
- [ ] Define an API with validation, tenant authorization, and retry behavior.
- [ ] Choose a data model and prove a concurrent update cannot violate its invariant.
- [ ] Calculate capacity, queue growth, and cache freshness with explicit assumptions.
- [ ] Diagnose an incident using user-facing signals and a bounded recovery plan.
- [ ] Explain replication, consistency, consensus, and transactions without conflating them.
- [ ] Test stale clocks, duplicate messages, partial failure, and regional recovery.
- [ ] Complete a worked design and defend a simpler alternative.

## Keep one source of truth

The ordering and descriptions live in `data/system-design-course.json`, which the existing sidebar consumes. Add a concept to its existing canonical page before creating a new lesson. The [contributor guide](https://github.com/sparshjaswal/docs/blob/main/CONTRIBUTING.md) describes source links, diagrams, and checks. Historical URLs redirect to the canonical lesson; they are compatibility aliases, not additional content pages. Sources and illustration credits remain in the source notes.
