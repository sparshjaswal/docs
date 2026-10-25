---
title: "API Gateway"
slug: "/system-design/api-gateway"
pagination_prev: "system-design/interfaces/grpc"
pagination_next: "system-design/interfaces/bff"
---

<span id="api-gateway-"></span>

# API Gateway

Route and protect external traffic while preserving service ownership.

**Prerequisite / previous:** [gRPC](grpc.md) · **Next:** [BFF (Backend for Frontend)](bff.md)

An API gateway receives client requests and routes them to backend services. It can apply shared rules such as authentication checks and rate limits. Keep the gateway focused so it does not become a place where every business rule is mixed together.


---

## Start with a task-list example

A school reception desk directs visitors to the right office. A gateway can send task requests to the task service and reminder requests to the reminder service.

1. List the services a client needs to call.
2. Define which request path belongs to each service.
3. Forward one request and return its response.
4. Test a missing route and an unavailable service.

## Words to know

| Word | Meaning |
| --- | --- |
| Route | A rule that chooses where a request goes. |
| Upstream | The service that receives a forwarded request. |
| Timeout | A limit on how long a component waits. |

## Why an API Gateway?

When clients use several backend services, a shared entry point can make routing and common request checks easier. Consider these possible needs:

- **Clients become chatty** — multiple round-trips to different services increase latency
- **Cross-cutting concerns duplicate** — every service implements auth, rate limiting, logging
- **Client logic bloats** — clients must know service locations, handle partial failures, compose data
- **Protocol coupling** — internal services may use gRPC, Thrift, or message queues; clients typically speak HTTP/JSON

A gateway can address some of these needs, while adding another component to run and monitor.

```mermaid
graph LR
    accTitle: Why an API Gateway?
    subgraph Clients
        A[Web App]
        B[Mobile App]
        C[IoT Device]
        D[Third-party API]
    end

    subgraph "API Gateway"
        E[Auth & Rate Limiting]
        F[Routing & Transformation]
        G[API Composition]
    end

    subgraph Microservices
        H[User Service]
        I[Order Service]
        J[Inventory Service]
        K[Payment Service]
        L[Notification Service]
    end

    A --> E
    B --> E
    C --> E
    D --> E
    E --> F
    F --> G
    G --> H
    G --> I
    G --> J
    G --> K
    G --> L
```

---

## Core Responsibilities

### 1. Request Routing

The gateway inspects incoming requests (URL path, headers, query parameters) and forwards them to the appropriate backend service. Routing rules may be static (config file) or dynamic (service discovery).

```yaml
# Kong declarative routing example
services:
  - name: user-service
    url: http://user-service:3000
    routes:
      - name: user-routes
        paths:
          - /api/users
        strip_path: true
  - name: order-service
    url: http://order-service:3001
    routes:
      - name: order-routes
        paths:
          - /api/orders
```

```mermaid
sequenceDiagram
    accTitle: Kong declarative routing example
    participant Client
    participant Gateway
    participant UserService
    participant OrderService

    Client->>Gateway: GET /api/users/42
    Gateway->>Gateway: Match route /api/users → user-service
    Gateway->>UserService: GET /users/42
    UserService-->>Gateway: 200 { id: 42, name: "Alice" }
    Gateway-->>Client: 200 { id: 42, name: "Alice" }

    Client->>Gateway: POST /api/orders
    Gateway->>Gateway: Match route /api/orders → order-service
    Gateway->>OrderService: POST /orders
    OrderService-->>Gateway: 201 { id: 1001 }
    Gateway-->>Client: 201 { id: 1001 }
```

### 2. Authentication & Authorization

Validate credentials at the edge and keep resource authorization in the domain service. See [authentication](authentication.md) for token/session verification and [security](security.md) for trust boundaries.

### 3. Rate Limiting

Apply identity-aware admission before expensive work. Choose a quota-store outage policy per operation. The algorithms, atomic Redis examples, and retry contract are in [rate limiting](../services/rate-limiting.md).

### 4. Request & Response Transformation

The gateway can modify requests before forwarding and responses before returning to clients. This includes header injection, payload restructuring, and protocol translation.

**Common transformations:**

| Transformation            | Direction | Example                                                  |
| ------------------------- | --------- | -------------------------------------------------------- |
| **Add headers**           | Request   | Inject `X-Request-ID`, `X-User-ID` for tracing           |
| **Strip headers**         | Response  | Remove `Server`, `X-Powered-By` for security             |
| **Protocol translation**  | Both      | Accept HTTP/JSON from client, forward gRPC to service    |
| **Payload restructuring** | Response  | Convert snake_case to camelCase, flatten nested response |
| **Legacy compatibility**  | Both      | Map old API surface to new service endpoints             |
| **Response compression**  | Response  | Gzip/Brotli for payloads > threshold                     |
| **Request validation**    | Request   | Validate JSON schema, reject malformed payloads at edge  |

**Kong request transformer:**

```yaml
plugins:
  - name: request-transformer
    route: user-routes
    config:
      add:
        headers:
          - 'X-Request-ID:$(uuid)'
          - 'X-Gateway-Timestamp:$(timestamp)'
        querystring:
          - 'gateway:kong'
      remove:
        headers:
          - 'X-Internal-Debug'
```

**Custom transformation middleware:**

```typescript
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export function requestTransformer(req: Request, res: Response, next: NextFunction): void {
  // Inject correlation ID
  const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
  req.headers['x-correlation-id'] = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);

  // Strip sensitive internal headers before forwarding
  delete req.headers['x-internal-token'];
  delete req.headers['authorization']; // re-inject after gateway auth if needed

  next();
}

// Response transformation — intercept and modify
export function responseTransformer(originalBody: unknown, req: Request): unknown {
  if (typeof originalBody !== 'object' || originalBody === null) return originalBody;

  const body = originalBody as Record<string, unknown>;

  // Convert snake_case keys to camelCase
  return Object.entries(body).reduce<Record<string, unknown>>((acc, [key, value]) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = value;
    return acc;
  }, {});
}
```

### 5. API Composition / Aggregation

Instead of requiring clients to make multiple calls, the gateway can fan out to several services, aggregate responses, and return a single coalesced result.

```mermaid
sequenceDiagram
    accTitle: 5. API Composition / Aggregation
    participant Client
    participant Gateway
    participant UserService
    participant OrderService
    participant InventoryService

    Client->>Gateway: GET /api/dashboard
    Gateway->>UserService: GET /users/me
    Gateway->>OrderService: GET /orders?status=active
    Gateway->>InventoryService: GET /inventory/summary
    UserService-->>Gateway: { name, email }
    OrderService-->>Gateway: [{ id, total }]
    InventoryService-->>Gateway: { items: 42 }
    Gateway->>Gateway: Compose response
    Gateway-->>Client: { user, orders, inventory }
```

**Custom composition endpoint (Node.js):**

```typescript
import express, { Request, Response, NextFunction } from 'express';
import axios, { AxiosError } from 'axios';

const app = express();

interface DashboardResponse {
  user: { id: string; name: string; email: string };
  activeOrders: Array<{ id: string; total: number; status: string }>;
  inventory: { totalItems: number; lowStock: number };
}

app.get('/api/dashboard', async (req: Request, res: Response) => {
  const userId = (req as any).userId; // injected by auth middleware

  try {
    // Fan-out requests in parallel
    const [userResp, ordersResp, inventoryResp] = await Promise.allSettled([
      axios.get(`http://user-service:3000/users/${userId}`, { timeout: 2000 }),
      axios.get(`http://order-service:3001/orders`, {
        params: { userId, status: 'active' },
        timeout: 2000,
      }),
      axios.get(`http://inventory-service:3002/inventory/summary`, { timeout: 2000 }),
    ]);

    const dashboard: Partial<DashboardResponse> = {};

    // Graceful degradation — don't fail if one service is down
    if (userResp.status === 'fulfilled') {
      dashboard.user = userResp.value.data;
    }
    if (ordersResp.status === 'fulfilled') {
      dashboard.activeOrders = ordersResp.value.data;
    }
    if (inventoryResp.status === 'fulfilled') {
      dashboard.inventory = inventoryResp.value.data;
    }

    res.json({ data: dashboard });
  } catch (err) {
    const axiosErr = err as AxiosError;
    res.status(502).json({
      error: {
        code: 'COMPOSITION_FAILED',
        message: 'Failed to compose dashboard response',
        details: axiosErr.message,
      },
    });
  }
});
```

### 6. Circuit Breaking

A gateway deadline and a circuit breaker bound different failures. Use the [resilience](../operations/resilience.md) contract and propagate the remaining request budget to services.

### 7. Observability

The gateway can measure requests that pass through it. Service-side logs and traces are still needed to explain what happened after forwarding.

**What to observe:**

| Pillar            | Data                                           | Tools                         |
| ----------------- | ---------------------------------------------- | ----------------------------- |
| **Logging**       | Request/response metadata, errors, latencies   | ELK stack, Loki               |
| **Metrics**       | Request count, error rate, latency percentiles | Prometheus + Grafana          |
| **Tracing**       | Distributed traces with correlation IDs        | Jaeger, Zipkin, OpenTelemetry |
| **Health checks** | Upstream service health, gateway self-health   | Built-in health endpoints     |

**Gateway metrics middleware (prom-client):**

```typescript
import { Registry, Counter, Histogram, Gauge } from 'prom-client';

const registry = new Registry();

const httpRequestsTotal = new Counter({
  name: 'gateway_http_requests_total',
  help: 'Total HTTP requests through the gateway',
  labelNames: ['method', 'route', 'status_code'],
  registers: [registry],
});

const httpRequestDurationMs = new Histogram({
  name: 'gateway_http_request_duration_ms',
  help: 'HTTP request duration in ms',
  labelNames: ['method', 'route'],
  buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
  registers: [registry],
});

const upstreamHealth = new Gauge({
  name: 'gateway_upstream_healthy',
  help: 'Whether upstream service is healthy (1 = healthy, 0 = unhealthy)',
  labelNames: ['service'],
  registers: [registry],
});

export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const route = req.route?.path || req.path;

    httpRequestsTotal.inc({ method: req.method, route, status_code: res.statusCode });
    httpRequestDurationMs.observe({ method: req.method, route }, duration);
  });

  next();
}

app.get('/metrics', async (_req: Request, res: Response) => {
  res.setHeader('Content-Type', registry.contentType);
  res.end(await registry.metrics());
});

// Health check with upstream probes
app.get('/health', async (_req: Request, res: Response) => {
  const checks = await Promise.all([
    checkService('user-service', 'http://user-service:3000/health'),
    checkService('order-service', 'http://order-service:3001/health'),
  ]);

  const healthy = checks.every((c) => c.healthy);

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'healthy' : 'degraded',
    services: checks,
  });
});

async function checkService(
  name: string,
  url: string,
): Promise<{ name: string; healthy: boolean; latencyMs: number }> {
  const start = Date.now();
  try {
    await axios.get(url, { timeout: 2000 });
    const latency = Date.now() - start;
    upstreamHealth.set({ service: name }, 1);
    return { name, healthy: true, latencyMs: latency };
  } catch {
    upstreamHealth.set({ service: name }, 0);
    return { name, healthy: false, latencyMs: Date.now() - start };
  }
}
```

---

## API Gateway vs Reverse Proxy vs Load Balancer

These three components are often confused. Here's how they differ:

```mermaid
graph TD
    accTitle: API Gateway vs Reverse Proxy vs Load Balancer
    subgraph "Load Balancer"
        LB[Distributes traffic across\nmultiple instances of the\nSAME service]
    end

    subgraph "Reverse Proxy"
        RP[Forwards requests to ONE\nbackend server; hides\nbackend topology]
    end

    subgraph "API Gateway"
        AG[Routes to DIFFERENT services;\nhandles auth, rate limiting,\ntransformation, composition]
    end

    Client --> AG
    AG --> LB
    LB --> Service1[User Service - Instance 1]
    LB --> Service2[User Service - Instance 2]
    AG --> RP
    RP --> Service3[Legacy Monolith]
```

| Feature                 | Load Balancer                       | Reverse Proxy                 | API Gateway                                         |
| ----------------------- | ----------------------------------- | ----------------------------- | --------------------------------------------------- |
| **Primary role**        | Distribute traffic across instances | Forward requests, hide origin | Route to different services, cross-cutting concerns |
| **Routing granularity** | Instance-level (same service)       | Single backend                | Service/endpoint-level (multiple services)          |
| **Protocol handled**    | TCP, HTTP, UDP                      | HTTP, TCP                     | HTTP, WebSocket, gRPC                               |
| **Authentication**      | Rarely                              | Sometimes                     | Core feature                                        |
| **Rate limiting**       | Connection-level                    | Sometimes                     | Core feature                                        |
| **Transformation**      | No                                  | Header manipulation           | Full request/response transformation                |
| **API composition**     | No                                  | No                            | Yes                                                 |
| **Service discovery**   | Static or basic health checks       | Static                        | Dynamic (Consul, Kubernetes, DNS)                   |
| **Examples**            | HAProxy, AWS ELB, NGINX (stream)    | NGINX, Apache httpd           | Kong, Envoy, AWS API Gateway, Traefik               |

**Key distinction:** A load balancer spreads load for one service across many instances. A reverse proxy can route to multiple backends. An API gateway routes to _different_ backend services based on the request and adds intelligence at the edge.

---

## Evaluate a gateway against your workload

Product capabilities, editions, and licenses change. Compare a pinned version using a reproducible workload rather than choosing from an undated feature matrix.

| Decision | Evidence to collect |
| --- | --- |
| Protocol compatibility | Exercise HTTP, streaming, gRPC, and WebSocket requirements, including deadlines and disconnects. |
| Configuration safety | Validate schemas, roll out to a canary, test rollback, and measure propagation delay. |
| Identity and quotas | Test audience checks, per-tenant limits, and behavior when identity or quota dependencies fail. |
| Operations and cost | Compare managed-service limits with the staffing, upgrades, capacity, and recovery needed to run a proxy. |
| Extensibility | Measure plugin latency and failure isolation; review maintenance, licensing, and security ownership. |

The examples below illustrate different configuration models. They are not interchangeable production configurations. Kong removed Cassandra support in version 3.4; verify the supported database and topology for your release. [Kong upgrade guidance](https://developer.konghq.com/gateway/upgrade/lts-upgrade-28-34/).

---

## Kong Deep Dive 🦍

Kong is one of the most popular open-source API gateways. It runs on top of OpenResty (NGINX + LuaJIT), giving it NGINX's battle-tested performance with Lua's extensibility.

### Architecture

```mermaid
graph TD
    accTitle: Architecture
    subgraph "Kong Gateway Node"
        NGINX[OpenResty / NGINX]
        Core[Kong Core]
        Plugins[Plugin Runtime - Lua/Go/JS]
    end

    subgraph "Control Plane"
        Admin[Admin API]
        Manager[Kong Manager - UI]
        Deck[Deck - CLI]
    end

    subgraph "Data Store"
        DB[(PostgreSQL)]
    end

    Admin --> DB
    Deck --> Admin
    Clients --> NGINX
    NGINX --> Core
    Core --> Plugins
    Core --> DB
    NGINX --> Upstream[Upstream Services]
```

### Key Concepts

| Concept      | Description                                                                                     |
| ------------ | ----------------------------------------------------------------------------------------------- |
| **Service**  | A logical abstraction of an upstream API or microservice (URL + optional path/host/port config) |
| **Route**    | A path (or host/header/method) matching rule that directs traffic to a Service                  |
| **Upstream** | A virtual hostname representing a set of backend targets with optional health checking          |
| **Target**   | An IP address or hostname with a port that receives proxied traffic                             |
| **Consumer** | An entity that consumes the API — often a developer or application with an API key              |
| **Plugin**   | Modular components that add functionality to routes, services, or consumers                     |

### Kong in DB-less (Declarative) Mode

For infrastructure-as-code and Kubernetes-native deployments, Kong can run without a database, loading configuration from a YAML/JSON file.

```yaml
# kong.yml — declarative configuration
_format_version: '3.0'

services:
  - name: user-service
    url: http://user-service.namespace.svc.cluster.local:3000
    connect_timeout: 5000
    read_timeout: 10000
    retries: 3
    routes:
      - name: user-routes
        paths:
          - /api/users
        strip_path: true
        methods:
          - GET
          - POST
          - PUT
          - DELETE
    plugins:
      - name: jwt
      - name: rate-limiting
        config:
          minute: 200
          policy: redis
          redis_host: redis.kong.svc.cluster.local
          redis_port: 6379
      - name: request-transformer
        config:
          add:
            headers:
              - 'X-Gateway:Kong'
      - name: cors
        config:
          origins:
            - 'https://myapp.example.com'
          methods:
            - GET
            - POST
            - PUT
            - DELETE

  - name: order-service
    url: http://order-service.namespace.svc.cluster.local:3001
    routes:
      - name: order-routes
        paths:
          - /api/orders
    plugins:
      - name: oauth2
        config:
          scopes:
            - read:orders
            - write:orders
          mandatory_scope: true
```

### Kong Custom Plugin (Lua)

```lua
-- kong/plugins/custom-logger/handler.lua
local BasePlugin = require "kong.plugins.base_plugin"
local cjson = require "cjson"

local CustomLoggerHandler = BasePlugin:extend()

function CustomLoggerHandler:new()
  CustomLoggerHandler.super.new(self, "custom-logger")
end

function CustomLoggerHandler:access(conf)
  CustomLoggerHandler.super.access(self)

  -- Inject custom header
  kong.service.request.set_header("X-Trace-Id", kong.request.get_id())

  -- Block requests from specific IP ranges
  local client_ip = kong.client.get_forwarded_ip()
  if conf.blocked_ips and conf.blocked_ips[client_ip] then
    return kong.response.exit(403, { message = "IP blocked" })
  end
end

function CustomLoggerHandler:log(conf)
  CustomLoggerHandler.super.log(self)

  local log_entry = {
    request_id = kong.request.get_id(),
    client_ip = kong.client.get_forwarded_ip(),
    method = kong.request.get_method(),
    path = kong.request.get_path(),
    latency_proxy = kong.latency.proxy,   -- ms waiting for upstream
    latency_kong = kong.latency.kong,      -- ms in Kong itself
    status = kong.response.get_status(),
    consumer = kong.client.get_credential() and kong.client.get_consumer().username,
  }

  kong.log.notice(cjson.encode(log_entry))
end

return CustomLoggerHandler
```

### Kong Performance

Kong throughput depends on hardware, payloads, TLS, plugins, and upstream latency. Benchmark your configuration. Performance tips:

- Use DB-less mode where possible (no database round-trip per request)
- Use Redis-backed rate limiting for cluster consistency
- Disable plugins per-route (only enable what's needed)
- Tune NGINX worker count and connections via environment variables

---

## Envoy & Service Mesh 🕸️

Envoy is a high-performance L7 proxy originally built by Lyft, now a CNCF graduated project. Unlike Kong (API management focus), Envoy is designed as a data plane for service meshes — though it also functions as an edge gateway.

### Envoy as Edge Gateway

```yaml
# envoy.yaml — edge proxy configuration
static_resources:
  listeners:
    - name: listener_0
      address:
        socket_address: { address: 0.0.0.0, port_value: 10000 }
      filter_chains:
        - filters:
            - name: envoy.filters.network.http_connection_manager
              typed_config:
                '@type': type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
                stat_prefix: ingress_http
                route_config:
                  name: local_route
                  virtual_hosts:
                    - name: backend
                      domains: ['*']
                      routes:
                        - match:
                            prefix: '/api/users'
                          route:
                            cluster: user_service
                            prefix_rewrite: '/'
                        - match:
                            prefix: '/api/orders'
                          route:
                            cluster: order_service
                            prefix_rewrite: '/'
                http_filters:
                  - name: envoy.filters.http.jwt_authn
                    typed_config:
                      '@type': type.googleapis.com/envoy.extensions.filters.http.jwt_authn.v3.JwtAuthentication
                      providers:
                        my_provider:
                          issuer: 'my-auth-server'
                          audiences:
                            - 'my-api'
                          from_headers:
                            - name: Authorization
                              value_prefix: 'Bearer '
                          remote_jwks:
                            http_uri:
                              uri: https://auth.example.com/.well-known/jwks.json
                              cluster: auth_cluster
                              timeout: 5s
                            cache_duration: 300s
                      rules:
                        - match:
                            prefix: '/api/'
                          requires:
                            provider_name: 'my_provider'
                  - name: envoy.filters.http.router
                    typed_config:
                      '@type': type.googleapis.com/envoy.extensions.filters.http.router.v3.Router

  clusters:
    - name: user_service
      connect_timeout: 3s
      type: STRICT_DNS
      lb_policy: ROUND_ROBIN
      load_assignment:
        cluster_name: user_service
        endpoints:
          - lb_endpoints:
              - endpoint:
                  address:
                    socket_address: { address: user-service, port_value: 3000 }
      circuit_breakers:
        thresholds:
          - priority: DEFAULT
            max_connections: 100
            max_pending_requests: 50
            max_requests: 200
            max_retries: 3

    - name: order_service
      connect_timeout: 3s
      type: STRICT_DNS
      lb_policy: ROUND_ROBIN
      load_assignment:
        cluster_name: order_service
        endpoints:
          - lb_endpoints:
              - endpoint:
                  address:
                    socket_address: { address: order-service, port_value: 3001 }

    - name: auth_cluster
      connect_timeout: 3s
      type: STRICT_DNS
      lb_policy: ROUND_ROBIN
      load_assignment:
        cluster_name: auth_cluster
        endpoints:
          - lb_endpoints:
              - endpoint:
                  address:
                    socket_address: { address: auth.example.com, port_value: 443 }
      transport_socket:
        name: envoy.transport_sockets.tls
```

### Service Mesh Architecture

A service mesh can use sidecars or an ambient/shared proxy model. In this sidecar example, each instance has a proxy. Together, the proxies form the **data plane** — every inter-service call flows through them. A **control plane** (Istio, Linkerd, Consul Connect) configures the proxies.

```mermaid
graph TD
    accTitle: Service Mesh Architecture
    subgraph "Control Plane"
        Istio[Istiod / Control Plane]
    end

    subgraph "Node 1"
        S1A[Service A]
        P1[Envoy Sidecar]
        S1A --- P1
        P1 --- Network
    end

    subgraph "Node 2"
        S2B[Service B]
        P2[Envoy Sidecar]
        S2B --- P2
        P2 --- Network
    end

    subgraph "Node 3"
        S3C[Service C]
        P3[Envoy Sidecar]
        S3C --- P3
        P3 --- Network
    end

    Istio -->|xDS config| P1
    Istio -->|xDS config| P2
    Istio -->|xDS config| P3

    P1 -->|mTLS| P2
    P2 -->|mTLS| P3
```

**Gateway in a mesh:** The same Envoy proxy serves as both the sidecar for inter-service traffic AND the edge gateway for external ingress. This unifies the configuration and observability model.

| Aspect             | API Gateway (Edge)                        | Service Mesh Sidecar                       |
| ------------------ | ----------------------------------------- | ------------------------------------------ |
| **Scope**          | North-south traffic (external ↔ internal) | East-west traffic (service ↔ service)      |
| **Authentication** | End-user (JWT, OAuth, API keys)           | Workload identity (mTLS, SPIFFE)           |
| **Rate limiting**  | Per consumer / API key                    | Per service / instance                     |
| **Resilience**     | Circuit breaking at edge                  | Circuit breaking between services          |
| **Tool**           | Kong, AWS API Gateway, NGINX              | Envoy (Istio/Consul); Linkerd uses its own proxy |

---

## Gateway Deployment Patterns

### Pattern 1: Edge Gateway Only

```mermaid
graph LR
    accTitle: Pattern 1: Edge Gateway Only
    Internet --> GW[API Gateway]
    GW --> S1[Service A]
    GW --> S2[Service B]
    GW --> S3[Service C]
```

Simplest setup. All external traffic hits the gateway; internal service-to-service calls are direct.

### Pattern 2: Edge Gateway + Service Mesh

```mermaid
graph LR
    accTitle: Pattern 2: Edge Gateway + Service Mesh
    Internet --> EGW[Edge Gateway]
    EGW --> Mesh[Service Mesh]
    Mesh --> S1[Service A]
    Mesh --> S2[Service B]
    Mesh --> S3[Service C]
    S1 -.->|mTLS via sidecar| S2
```

External traffic enters through the edge gateway; internal traffic flows through the mesh with mTLS and fine-grained policies.

### Pattern 3: BFF Gateway

```mermaid
graph LR
    accTitle: Pattern 3: BFF Gateway
    Web[Web Client] --> BFF1[Web BFF Gateway]
    Mobile[Mobile Client] --> BFF2[Mobile BFF Gateway]
    Third[Third-party] --> API[Public API Gateway]

    BFF1 --> S1[User Service]
    BFF1 --> S2[Order Service]
    BFF2 --> S1
    BFF2 --> S3[Catalog Service - Lightweight]
    API --> S1
    API --> S3
```

Separate gateways for different client types, each tailored to that client's specific data needs.

---

## Best Practices

### 1. Keep the Gateway Thin

Keep task rules in the task service. Use the gateway for shared request handling so a routing change does not also change business behavior.

**✅ Gateway responsibilities:**

- Authentication and token validation
- Rate limiting and throttling
- Request routing and load balancing
- Header manipulation
- TLS termination
- Observability (logging, metrics, tracing)

**❌ NOT gateway responsibilities:**

- Order validation rules
- Discount calculation
- Inventory allocation
- Complex data transformations

### 2. Avoid Gateway Coupling

Services should NOT know about the gateway. They should work identically whether called directly or through the gateway. Avoid injecting gateway-specific headers or tokens into service logic.

### 3. Use Correlation IDs

Generate a unique ID at the gateway for every request and propagate it to every downstream call. This enables distributed tracing.

```typescript
// At the gateway
const correlationId = uuidv4();
req.headers['x-correlation-id'] = correlationId;

// Propagate to downstream calls
axios.get('http://user-service/users', {
  headers: { 'X-Correlation-ID': correlationId },
});
```

### 4. Handle Timeouts at Every Layer

- **Gateway → Client:** Set reasonable connection and read timeouts
- **Gateway → Service:** Configure per-service timeouts (shorter than client timeout)
- **Service → Service:** Use circuit breakers with timeouts

```yaml
# Example: layered timeouts
# Client timeout: 10s
# Gateway proxy timeout: 8s
# Service processing timeout: 5s
# Circuit breaker trip: 3 consecutive timeouts
```

### 5. Plan for Gateway Failure

The gateway is a single point of failure. Mitigate with:

- **Multiple gateway instances** behind a load balancer
- **Health checks** with fast failure detection
- **Graceful degradation** — if a plugin breaks, fail open or closed per policy
- **Stateless gateways** — store state externally (Redis, PostgreSQL) so any instance can handle any request

### 6. Version Your Gateway Configuration

Treat gateway config as code. Version it in Git, test changes in staging, deploy via CI/CD.

```bash
# Kong decK — sync config to gateway
deck sync --state kong.yml --kong-addr http://localhost:8001

# Validate before applying
deck validate -s kong.yml
```

---

## Security at the Gateway

| Layer              | Threat                          | Mitigation                                                     |
| ------------------ | ------------------------------- | -------------------------------------------------------------- |
| **Transport**      | Eavesdropping, MITM             | TLS termination at gateway, HSTS headers                       |
| **Authentication** | Impersonation, credential theft | JWT validation, API key rotation, OAuth2 token introspection   |
| **Injection**      | SQLi, XSS, command injection    | Request validation, body size limits, content-type enforcement |
| **DDoS**           | Volumetric attacks              | Rate limiting, IP reputation, WAF rules, CDN                   |
| **Data exposure**  | Sensitive data in responses     | Response filtering, strip internal headers                     |
| **Reconnaissance** | API probing, schema discovery   | Rate limit unknown routes, obfuscate error messages            |

**Hardening checklist:**

```typescript
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Security middleware stack for a custom gateway
gatewayApp.use(helmet()); // Secure HTTP headers
gatewayApp.use(hpp()); // HTTP parameter pollution protection
gatewayApp.use(
  cors({
    // Strict CORS
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    credentials: true,
  }),
);
gatewayApp.use(
  rateLimit({
    // Global rate limit
    windowMs: 60_000,
    max: 1000,
  }),
);

// Body size limits prevent large payload attacks
gatewayApp.use(express.json({ limit: '1mb' }));
gatewayApp.use(express.urlencoded({ limit: '1mb', extended: false }));

// Never expose server information
gatewayApp.disable('x-powered-by');
```

---

## Troubleshooting Common Issues

| Symptom                   | Likely Cause                                      | Fix                                                                  |
| ------------------------- | ------------------------------------------------- | -------------------------------------------------------------------- |
| `502 Bad Gateway`         | Upstream service unreachable or crashed           | Check upstream health, DNS resolution, network policies              |
| `504 Gateway Timeout`     | Upstream took too long to respond                 | Increase proxy timeout or optimize downstream service                |
| `429 Too Many Requests`   | Client exceeded rate limit                        | Check consumer quotas, adjust limits, verify Redis (if cluster mode) |
| Intermittent `503`        | Circuit breaker open due to cascading failures    | Investigate downstream, check timeout configurations                 |
| `CORS` errors in browser  | Gateway not handling preflight or missing headers | Enable CORS plugin, verify `Access-Control-Allow-Origin`             |
| Stale routes after deploy | Gateway caching old service discovery data        | Reduce DNS TTL, restart gateway, use dynamic service discovery       |

---

## Express Gateway — A Quick Start

Express Gateway is a Node.js-based API gateway built on Express. It's YAML-configured and extensible via plugins.

```yaml
# config/gateway.config.yml
http:
  port: 8080

apiEndpoints:
  api:
    host: 'api.mydomain.com'
    paths: '/api/*'

serviceEndpoints:
  userService:
    url: 'http://localhost:3000'
  orderService:
    url: 'http://localhost:3001'

policies:
  - jwt
  - rate-limit
  - proxy
  - cors

pipelines:
  - name: default
    apiEndpoints:
      - api
    policies:
      - cors:
      - jwt:
          - action:
              secretOrPublicKey: 'supersecret'
      - rate-limit:
          - action:
              max: 50
              windowMs: 60000
      - proxy:
          - action:
              serviceEndpoint: userService
              changeOrigin: true
```

---

## Decision Flow: Choosing a Gateway

```mermaid
flowchart TD
    accTitle: Decision Flow: Choosing a Gateway
    Start[Need an API Gateway?] --> Q1{Managed or Self-Hosted?}

    Q1 -->|Managed| AWS{AWS Ecosystem?}
    AWS -->|Yes| AWSGW[AWS API Gateway]
    AWS -->|No| Cloud{Google/Azure?}
    Cloud -->|Yes| CloudGW[Cloud Native Gateway\nApigee / Azure API Management]
    Cloud -->|No| ManagedOther[Consider Kong Konnect]

    Q1 -->|Self-Hosted| Q2{What Scale?}

    Q2 -->|Small / Node.js Shop| EG[Express Gateway]
    Q2 -->|Medium / Enterprise| Q3{Primary Use Case?}

    Q3 -->|API Management\nMulti-team, Plugins| Kong[Kong Gateway]
    Q3 -->|Kubernetes Ingress| Traefik[Traefik]
    Q3 -->|Service Mesh\nHigh-scale L7| Envoy[Envoy]
    Q3 -->|Simple Routing\nStatic Content| NGINX[NGINX]
```

---

## Integration exercise

Configure one route to the task service with request-size limits, authenticated identity, a documented timeout, and a per-tenant quota. Exercise a denied request, an unavailable upstream, an expired credential, and a quota-store outage. The gateway must not turn these into a false successful response. Compare its behavior with a direct authorized call to the service.

## Summary

Trace one task request through the gateway and its destination service. Then make the service unavailable and check the response, timeout, and logs. If the extra component does not solve a clear problem, keep the smaller design.

## Design trade-offs and production exercise

A shared gateway simplifies policy rollout but increases the blast radius of a bad rule. Route configuration must be tested and rolled out gradually. Adding authentication at the gateway does not remove authorization from a domain owner.

For a school portal, throttle expensive report exports separately from attendance updates. Test loss of the quota store and state which routes fail closed. How do you keep a gateway rollout from cutting off every client?
