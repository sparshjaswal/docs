---
title: "API Design"
description: REST and GraphQL API design principles, patterns, and best practices for building robust and maintainable APIs.
---

# API Design 🔌

API design is the process of defining the contract between a server and its clients — the endpoints, data formats, error handling, and interaction patterns that make an API intuitive, consistent, and maintainable.

> _A well-designed API is self-documenting: the URL structure, HTTP methods, and response codes tell the story._

---

## REST (Representational State Transfer)

REST is an architectural style for distributed hypermedia systems. It defines a set of constraints that, when followed, produce APIs that are scalable, stateless, and cacheable.

### Core Principles

| Principle             | Description                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------- |
| **Stateless**         | Each request contains all information the server needs — no server-side session              |
| **Resource-based**    | URLs represent resources (nouns), not actions (verbs)                                        |
| **Uniform interface** | Standard HTTP methods: GET, POST, PUT, PATCH, DELETE                                         |
| **Representation**    | Resources can have multiple representations (JSON, XML, HTML)                                |
| **HATEOAS**           | Hypermedia as the Engine of Application State — responses include links to related resources |

### HTTP Methods & Status Codes

| Method    | CRUD              | Idempotent? | Safe? |
| --------- | ----------------- | ----------- | ----- |
| `GET`     | Read              | ✅          | ✅    |
| `POST`    | Create            | ❌          | ❌    |
| `PUT`     | Update (full)     | ✅          | ❌    |
| `PATCH`   | Update (partial)  | ❌          | ❌    |
| `DELETE`  | Delete            | ✅          | ❌    |
| `HEAD`    | Metadata only     | ✅          | ✅    |
| `OPTIONS` | Supported methods | ✅          | ✅    |

**Common status codes:**

| Code                        | Meaning                 | When to use                                    |
| --------------------------- | ----------------------- | ---------------------------------------------- |
| `200 OK`                    | Success                 | GET, PUT, PATCH success                        |
| `201 Created`               | Resource created        | POST success (include Location header)         |
| `204 No Content`            | Success, no body        | DELETE success                                 |
| `301 Moved Permanently`     | URL changed             | Resource moved to new canonical URL            |
| `304 Not Modified`          | Not modified            | Caching — use with ETag/If-None-Match          |
| `400 Bad Request`           | Client error            | Invalid input, malformed JSON                  |
| `401 Unauthorized`          | Authentication required | Missing/invalid credentials                    |
| `403 Forbidden`             | Not allowed             | Authenticated but insufficient permissions     |
| `404 Not Found`             | Resource not found      | Single resource or collection                  |
| `409 Conflict`              | State conflict          | Duplicate resource, version mismatch           |
| `422 Unprocessable Entity`  | Validation failure      | Semantic errors (well-formed, but invalid)     |
| `429 Too Many Requests`     | Rate limited            | Include Retry-After header                     |
| `500 Internal Server Error` | Unexpected error        | Unhandled exception (never expose stack trace) |
| `503 Service Unavailable`   | Temporary outage        | Maintenance, overload — include Retry-After    |

### REST Design Patterns

**Nested resources** (be careful with depth — max 2–3 levels):

```
GET  /users/:id/orders
GET  /users/:id/orders/:orderId
POST /users/:id/orders
```

**Pagination:**

```json
// Request
GET /api/users?page=2&limit=20&sort=createdAt:desc

// Response
{
  "data": [...],
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  },
  "links": {
    "self": "/api/users?page=2&limit=20",
    "first": "/api/users?page=1&limit=20",
    "prev": "/api/users?page=1&limit=20",
    "next": "/api/users?page=3&limit=20",
    "last": "/api/users?page=8&limit=20"
  }
}
```

**Filtering, searching, sorting:**

```
GET /api/users?status=active&role=admin
GET /api/users?q=john          // full-text search
GET /api/users?fields=id,name,email  // sparse fieldsets
```

**Consistent error format:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more validation errors occurred",
    "details": [
      { "field": "email", "message": "Must be a valid email address" },
      { "field": "age", "message": "Must be >= 18" }
    ],
    "requestId": "req_abc123"
  }
}
```

### Versioning Strategies

| Strategy            | Example                               | Pros                    | Cons                             |
| ------------------- | ------------------------------------- | ----------------------- | -------------------------------- |
| URL path            | `/api/v1/users`                       | Explicit, easy to route | URL pollution                    |
| Query param         | `/api/users?version=1`                | Clean URLs              | Caching issues                   |
| Custom header       | `Accept: application/vnd.api.v1+json` | Clean URLs, flexible    | Harder to test (curl, browser)   |
| Content negotiation | `Accept: application/json; version=1` | Most RESTful            | Complex, tooling support limited |

**Recommendation:** URL path versioning for public APIs (simplest for consumers).

---

## GraphQL 🧬

GraphQL is a query language and runtime for APIs. Unlike REST's multiple endpoints, GraphQL exposes a single endpoint. Clients specify exactly which fields they need — eliminating over-fetching and under-fetching.

### Core Concepts

**Schema** — defines types and their relationships:

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
}

type Query {
  user(id: ID!): User
  posts(limit: Int): [Post!]!
}

type Mutation {
  createUser(name: String!, email: String!): User!
  createPost(title: String!, content: String!, authorId: ID!): Post!
}
```

**Queries** — read data (client specifies shape):

```graphql
# Client request — only these fields will be returned
query {
  posts(limit: 5) {
    title
    author {
      name
      email
    }
  }
}
```

**Mutations** — write/update data:

```graphql
mutation {
  createUser(name: "Alice", email: "alice@example.com") {
    id
    name
  }
}
```

**Subscriptions** — real-time updates over WebSocket:

```graphql
subscription {
  postCreated {
    title
    author {
      name
    }
  }
}
```

**Resolvers** — functions that resolve each field:

```javascript
const resolvers = {
  Query: {
    posts: () => db.posts.findAll(),
  },
  User: {
    posts: (user) => db.posts.findByAuthorId(user.id),
  },
  Mutation: {
    createPost: (_, { title, content, authorId }) => {
      return db.posts.create({ title, content, authorId });
    },
  },
};
```

### GraphQL vs REST

| Criteria           | REST                                           | GraphQL                                            |
| ------------------ | ---------------------------------------------- | -------------------------------------------------- |
| **Data fetching**  | Multiple endpoints, fixed responses            | Single endpoint, client-specified fields           |
| **Over-fetching**  | Common — getting more data than needed         | None — client requests exact fields                |
| **Under-fetching** | Common — multiple round-trips for related data | None — nested resources in one request             |
| **Versioning**     | Required over time                             | No versioning — schema evolves via deprecation     |
| **Caching**        | HTTP caching (CDN, browser)                    | Requires client-side caches (Apollo, Urql, Relay)  |
| **Tooling**        | Swagger, Postman, curl                         | GraphiQL, Apollo Studio, GraphQL Playground        |
| **Learning curve** | Low                                            | Medium — requires understanding schema and queries |
| **Best for**       | Simple CRUD APIs, public APIs                  | Complex data models, mobile apps, rapid UIs        |

### Anti-Patterns to Avoid

- **Deeply nested queries** — can cause N+1 resolver problems (use DataLoader for batching)
- **Exposing raw database types** — create a domain-specific schema, not a mirror of your DB
- **Mutations that aren't verbs** — use imperative names: `createUser`, not `userCreate`
- **Stringly-typed fields** — use enums, unions, and interfaces for type safety
- **No pagination** — every list field should be paginated to prevent unbounded queries

---

## API Security (Common to Both REST & GraphQL)

- **Always use HTTPS** — encrypt data in transit
- **Authenticate every request** — JWT Bearer token, API key, or OAuth2
- **Authorize at the resource level** — never trust client-provided IDs without verification
- **Validate all input** — schema validation before processing
- **Rate limit** — prevent abuse (token bucket, sliding window)
- **Set CORS headers** explicitly — never use `Access-Control-Allow-Origin: *` with credentials
- **Log and monitor** — track unusual patterns (sudden error spikes, large payloads)

[← Back to Backend Engineering](../README.md) · © sparshjaswal
