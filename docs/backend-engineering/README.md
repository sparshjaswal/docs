---
title: "Backend Engineering"
description: Comprehensive guide to backend engineering concepts — Node.js, API design, authentication, caching, message queues, and more.
keywords:
  - backend engineering
  - nodejs
  - api design
  - authentication
  - caching
---

# ⚙️ Backend Engineering

## Learning Objectives

- Gain a practical mental model of backend systems: APIs, services, data stores, and operational concerns.
- Understand common backend primitives: authentication, validation, error handling, caching, queues, and monitoring.
- Learn patterns for building reliable, secure, and maintainable server-side applications in Node.js/TypeScript.
- Prepare production-ready code examples and interview-ready explanations for backend design questions.

## Prerequisites

- Comfortable with JavaScript or TypeScript basics
- Familiarity with HTTP, REST, and basic database concepts
- Basic understanding of asynchronous programming (callbacks, promises, async/await)

## Difficulty Level

- Beginner → Senior Engineer (progressive depth across pages)

## Estimated Reading Time

Overview: 45–60 minutes. Deep dives: 20–120 minutes per topic depending on complexity.

## Mental Model

Backends are responsible for correctness, durability, performance, and safety. Model a backend as a set of responsibilities: handle client requests (API), validate and authorize input, perform business logic, persist state, and emit events/metrics. Each responsibility has operational and security trade-offs.

## How to use this section

- Follow the Table of Contents to learn core concepts first (Node.js, API design, auth) and then advanced topics (event-driven, service discovery).
- Use code examples as templates — verify and adapt them to your stack and security requirements.

## Production Concerns (top-level)

- Observe and collect metrics (latency, error rate, traffic patterns)
- Secure data in transit and at rest (TLS, encryption, key management)
- Plan for operational recovery (backups, chaos engineering, runbooks)
- Automate deployments with safe rollouts (canary, blue/green)

## Interview & Real-world Skills

- Be able to explain authentication choices (JWT vs sessions), trade-offs in cache invalidation, and strategies for scaling write-heavy workloads.
- Practice constructing an end-to-end flow: client → gateway → service → datastore → cache → queue → worker.



A comprehensive guide to backend engineering concepts, patterns, and technologies for building robust server-side applications.

---

## Table of Contents

- [Node.js](#nodejs)
- [API Design](#api-design)
- [Authentication & Authorization](#authentication--authorization)
- [Validation](#validation)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Logging](#logging)
- [Monitoring](#monitoring)
- [Caching](#caching)
- [Queues](#queues)
- [Event-Driven Architecture](#event-driven-architecture)
- [WebSockets](#websockets)
- [gRPC](#grpc)
- [API Gateway](#api-gateway)
- [BFF (Backend for Frontend)](#bff-backend-for-frontend)
- [Service Discovery](#service-discovery)

---

## Node.js

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine, designed for building scalable network applications. Its event-driven, non-blocking I/O model makes it lightweight and efficient for data-intensive real-time applications.

### Express

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It's the most popular Node.js framework, offering:

- Middleware-based request processing pipeline
- Routing with HTTP method and URL pattern matching
- Template engine integration (EJS, Pug, Handlebars)
- Static file serving
- Easy integration with any database

### NestJS

NestJS is a framework for building efficient, scalable Node.js server-side applications. It uses TypeScript by default and combines elements of OOP (Object-Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

- Modular architecture inspired by Angular
- Built-in support for GraphQL, WebSockets, microservices
- Dependency injection container
- Extensive CLI tooling

---

## API Design

### REST

REST (Representational State Transfer) is an architectural style for designing networked applications. It relies on stateless, client-server communication — typically over HTTP.

**Key principles:**

- Resources identified by URLs (nouns, not verbs)
- Standard HTTP methods: GET, POST, PUT, PATCH, DELETE
- Stateless — each request contains all information needed
- Response formats: JSON (most common), XML
- Status codes convey outcome (2xx success, 4xx client error, 5xx server error)

### GraphQL

GraphQL is a query language for APIs and a runtime for fulfilling those queries. Unlike REST, clients request exactly the data they need — nothing more, nothing less.

**Key concepts:**

- **Schema**: Defines types and their relationships
- **Queries**: Read data (equivalent to GET)
- **Mutations**: Write/update data (equivalent to POST/PUT/PATCH/DELETE)
- **Subscriptions**: Real-time updates over WebSocket
- **Resolvers**: Functions that resolve each field in a query

---

## Authentication & Authorization

### JWT (JSON Web Token)

A compact, URL-safe means of representing claims between two parties. JWTs are self-contained — the payload carries all necessary user information.

- **Structure**: `header.payload.signature`
- **Stateless**: Server doesn't need to store session data
- **Common use**: API authentication (Bearer token in Authorization header)

### OAuth 2.0

An open standard for access delegation. Allows users to grant third-party applications access to their resources without sharing credentials.

- **Authorization Code flow** (most secure, server-side apps)
- **Implicit flow** (deprecated, replaced by PKCE)
- **Client Credentials flow** (machine-to-machine)
- **PKCE** (Proof Key for Code Exchange, for SPAs and mobile apps)

### OpenID Connect

An identity layer built on top of OAuth 2.0. Adds authentication (who you are) to OAuth's authorization (what you can access). Returns an ID Token (JWT) alongside the access token.

### Sessions

Server-side session management stores user state on the server, identified by a session ID (typically stored in a cookie).

- **Stateful** — server must look up session data per request
- **Cookie-based**: `Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Lax`

---

## Validation

Input validation ensures user-provided data meets application requirements before processing. Never trust client input — always validate server-side.

**Common libraries:**

- **Joi** (schema-based, declarative)
- **Zod** (TypeScript-first, static type inference)
- **class-validator** (decorator-based, pairs with NestJS)

---

## Error Handling

Proper error handling prevents crashes, provides meaningful feedback to clients, and simplifies debugging.

**Best practices:**

- Use structured error responses: `{ error: { code, message, details } }`
- Distinguish operational errors (expected) from programmer errors (bugs)
- Centralize error handling with middleware (Express: error-handling middleware with 4 params)
- Never expose stack traces or internal details in production
- Log errors with correlation IDs for tracing

---

## Rate Limiting

Rate limiting controls how many requests a client can make in a given time window, protecting against abuse and ensuring fair resource usage.

**Algorithms:**

- **Token bucket**: Tokens refill at a fixed rate; each request consumes a token
- **Leaky bucket**: Requests queue; processed at a fixed rate; overflow discarded
- **Fixed window**: Count requests in fixed time windows (e.g., 100 req/min)
- **Sliding window log**: Track timestamps; count requests in the last window
- **Sliding window counter**: Approximate sliding window with counters for current and previous windows

---

## Logging

Logging records events that occur during application execution — essential for debugging, monitoring, and auditing.

**Best practices:**

- Use structured logging (JSON) for machine parsing
- Log levels: error, warn, info, debug, trace
- Include correlation IDs to trace requests across services
- Never log sensitive data (passwords, tokens, PII)
- Use a logging library: **Winston**, **Pino** (high performance), **Bunyan**

---

## Monitoring

Monitoring collects, analyzes, and alerts on metrics to track application health and performance.

**Key areas:**

- **Application metrics**: Request rate, error rate, latency (p50, p95, p99)
- **System metrics**: CPU, memory, disk, network
- **Business metrics**: Signups, purchases, active users
- **Alerting**: Threshold-based alerts, anomaly detection

**Tools:** Prometheus + Grafana, Datadog, New Relic, OpenTelemetry

---

## Caching

Caching stores copies of frequently accessed data in a faster storage layer, reducing latency and database load.

### Redis

Redis is an in-memory data structure store used as a database, cache, and message broker.

**Common patterns:**

- **Cache-Aside**: App checks cache first; on miss, loads from DB and populates cache
- **Write-Through**: App writes to cache; cache synchronously writes to DB
- **Write-Behind**: App writes to cache; cache asynchronously writes to DB
- **Read-Through**: Cache sits between app and DB, transparently loading on miss

---

## Queues

Message queues enable asynchronous communication between services by buffering messages. They decouple producers and consumers, improving reliability and scalability.

**Use cases:**

- Background job processing (send emails, generate reports)
- Smoothing traffic spikes
- Retry failed operations with backoff
- Event-driven workflows

**Tools:** Bull/BullMQ (Redis-based), RabbitMQ, Apache Kafka, AWS SQS

---

## Event-Driven Architecture

Event-driven architecture uses events to trigger communication between decoupled services. Producers emit events; consumers react to them.

**Key concepts:**

- **Event**: A record of something that happened (immutable fact)
- **Event bus/broker**: Routes events from producers to consumers
- **Event sourcing**: State is derived from a sequence of events
- **CQRS** (Command Query Responsibility Segregation): Separate read and write models

---

## WebSockets

WebSocket is a protocol providing full-duplex communication over a single, long-lived TCP connection. Ideal for real-time applications.

**Use cases:** Chat, live notifications, collaborative editing, real-time dashboards, gaming.

**Libraries:** `ws` (Node.js), Socket.IO (adds fallbacks, rooms, auto-reconnection)

---

## gRPC

gRPC is a high-performance, open-source RPC framework using Protocol Buffers for serialization and HTTP/2 for transport.

**Advantages over REST:**

- Binary serialization (smaller, faster than JSON)
- Strongly typed contracts (`.proto` files)
- Built-in code generation for multiple languages
- Bidirectional streaming
- Built-in deadline/timeout and cancellation

---

## API Gateway

An API gateway acts as a single entry point for all client requests, routing them to appropriate backend services. It sits between clients and microservices.

**Responsibilities:**

- Request routing
- Authentication and authorization
- Rate limiting
- Request/response transformation
- API composition (aggregate multiple service calls)
- TLS termination

**Tools:** Kong, NGINX, AWS API Gateway, Envoy, Traefik

---

## BFF (Backend for Frontend)

The BFF pattern creates a dedicated backend layer for each client type (web, mobile, IoT), tailoring APIs to each client's specific needs rather than forcing a one-size-fits-all API.

**Benefits:**

- Optimize data shape and payload size per client
- Reduce over-fetching and under-fetching
- Simplify client-side logic
- Isolate client-specific concerns from core services

---

## Service Discovery

Service discovery automatically detects services and their instances in a distributed system, enabling services to find and communicate with each other without hardcoded addresses.

**Patterns:**

- **Client-side discovery**: Client queries a service registry, then load-balances across instances
- **Server-side discovery**: Client sends request to a load balancer, which queries the registry and routes the request

**Tools:** Consul, etcd, ZooKeeper, Kubernetes DNS, AWS Cloud Map

> **Note (AI-assisted draft):** The following Interview Questions, Production Checklist, and Testing & Monitoring items are a draft to accelerate review. Add org-specific runbooks and dashboard links.

## Interview Questions

- How would you design a secure authentication flow for web and mobile clients? Sketch token flows and revocation strategies.
- Explain trade-offs between JWTs and server-side sessions for a multi-region service.
- Describe how you would scale a write-heavy service: caching, queuing, sharding — what order would you attempt them in and why?

## Production Checklist

- Ensure metrics: latency (p50/p95/p99), error rate, CPU/memory, connection pools
- Document backup & restore procedures and validate recovery drills
- Define SLOs and an alerting policy with runbooks for on-call engineers
- Enforce secure defaults: TLS, key rotation, vulnerability scanning, dependency pinning

## Testing & Monitoring

- Run integration tests for authentication/authorization and key rotation scenarios
- Simulate cache miss storms, burst traffic, and queue backpressure in staging
- Validate observability: traces propagate across services, logs include correlation IDs

[← Back to Home](../index.md) · © sparshjaswal
