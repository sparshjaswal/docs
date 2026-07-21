# Chain of Responsibility Pattern ⛓️

> **Definition**: The Chain of Responsibility pattern passes requests along a chain of handlers. Upon receiving a request, each handler decides either to process the request or to pass it to the next handler in the chain.

## 🎯 Intent

Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request. Chain the receiving objects and pass the request along the chain until an object handles it.

## 🤔 Problem

You want to process a request through a series of handlers without coupling the sender to specific handlers. Consider scenarios like:

- **Request Processing**: HTTP request filters, middleware
- **Event Handling**: GUI event propagation
- **Approval Workflow**: Document approval chain
- **Error Handling**: Different error handlers for different error types
- **Validation**: Multi-step validation process

The sender shouldn't know which handler will process the request or the order of handlers.

## 💡 Solution

The Chain of Responsibility pattern suggests linking handlers into a chain. Each handler has a field for storing a reference to the next handler. When a handler receives a request, it can either process it or pass it along to the next handler.

## 🏗️ Structure

```
Handler (abstract)
├── +nextHandler: Handler
├── +setNext(handler: Handler): Handler
└── +handle(request): void

ConcreteHandler1 extends Handler
├── +handle(request): void → process or super.handle(request)

ConcreteHandler2 extends Handler
├── +handle(request): void → process or super.handle(request)

Client → handler1.setNext(handler2).setNext(handler3)
      → handler1.handle(request)
```

## 💻 Simple Example

### Support Ticket System

```javascript
// Abstract Handler
class SupportHandler {
  constructor() {
    this.nextHandler = null;
  }

  setNext(handler) {
    this.nextHandler = handler;
    return handler; // Return handler for method chaining
  }

  handle(ticket) {
    if (this.canHandle(ticket)) {
      return this.process(ticket);
    } else if (this.nextHandler) {
      console.log(`🔄 ${this.constructor.name}: Passing to next handler`);
      return this.nextHandler.handle(ticket);
    } else {
      console.log(
        `❌ No handler available for ticket: ${ticket.type} (Priority: ${ticket.priority})`,
      );
      return null;
    }
  }

  canHandle(ticket) {
    throw new Error('canHandle() method must be implemented');
  }

  process(ticket) {
    throw new Error('process() method must be implemented');
  }
}

// Concrete Handler - Level 1 Support
class Level1Support extends SupportHandler {
  canHandle(ticket) {
    return ticket.type === 'basic' && ticket.priority <= 2;
  }

  process(ticket) {
    console.log(`👨‍💻 Level 1 Support: Handling ticket #${ticket.id}`);
    console.log(`   Type: ${ticket.type}`);
    console.log(`   Priority: ${ticket.priority}`);
    console.log(`   Issue: ${ticket.description}`);
    console.log(`   ✅ Resolved with standard procedure`);

    return {
      handledBy: 'Level 1 Support',
      resolution: 'Standard procedure applied',
      ticketId: ticket.id,
      resolvedAt: new Date(),
    };
  }
}

// Concrete Handler - Level 2 Support
class Level2Support extends SupportHandler {
  canHandle(ticket) {
    return (
      (ticket.type === 'technical' && ticket.priority <= 3) ||
      (ticket.type === 'basic' && ticket.priority <= 4)
    );
  }

  process(ticket) {
    console.log(`🔧 Level 2 Support: Handling ticket #${ticket.id}`);
    console.log(`   Type: ${ticket.type}`);
    console.log(`   Priority: ${ticket.priority}`);
    console.log(`   Issue: ${ticket.description}`);
    console.log(`   ✅ Resolved with technical expertise`);

    return {
      handledBy: 'Level 2 Support',
      resolution: 'Technical solution provided',
      ticketId: ticket.id,
      resolvedAt: new Date(),
    };
  }
}

// Concrete Handler - Level 3 Support (Senior/Expert)
class Level3Support extends SupportHandler {
  canHandle(ticket) {
    return ticket.type === 'critical' || ticket.priority >= 4;
  }

  process(ticket) {
    console.log(`🚨 Level 3 Support: Handling ticket #${ticket.id}`);
    console.log(`   Type: ${ticket.type}`);
    console.log(`   Priority: ${ticket.priority}`);
    console.log(`   Issue: ${ticket.description}`);
    console.log(`   ✅ Resolved by senior expert`);

    return {
      handledBy: 'Level 3 Support',
      resolution: 'Expert-level solution provided',
      ticketId: ticket.id,
      resolvedAt: new Date(),
    };
  }
}

// Ticket class
class SupportTicket {
  constructor(id, type, priority, description) {
    this.id = id;
    this.type = type; // 'basic', 'technical', 'critical'
    this.priority = priority; // 1-5 (1=lowest, 5=highest)
    this.description = description;
    this.createdAt = new Date();
  }
}

// Usage
console.log('=== Support Ticket Chain Demo ===\n');

console.log('Setting up support chain:');
console.log('-'.repeat(25));

// Create handlers
const level1 = new Level1Support();
const level2 = new Level2Support();
const level3 = new Level3Support();

// Set up chain: Level1 → Level2 → Level3
level1.setNext(level2).setNext(level3);

console.log('✅ Support chain established: Level1 → Level2 → Level3\n');

console.log('Processing various tickets:');
console.log('-'.repeat(30));

// Test different types of tickets
const tickets = [
  new SupportTicket(1001, 'basic', 1, 'Password reset request'),
  new SupportTicket(1002, 'technical', 2, 'Software installation issue'),
  new SupportTicket(1003, 'basic', 3, 'Account access problem'),
  new SupportTicket(1004, 'critical', 5, 'Server outage - production down'),
  new SupportTicket(1005, 'technical', 4, 'Database performance issues'),
  new SupportTicket(1006, 'unknown', 1, 'Unhandled ticket type'),
];

tickets.forEach((ticket, index) => {
  console.log(`\n${index + 1}. Processing Ticket #${ticket.id}:`);
  console.log('-'.repeat(35));

  const result = level1.handle(ticket);

  if (result) {
    console.log(`📋 Resolution Summary: ${result.resolution} by ${result.handledBy}`);
  }
});
```

## 🌟 Real-World Example

### HTTP Request Middleware Chain

```javascript
// Abstract Middleware Handler
class Middleware {
  constructor() {
    this.next = null;
  }

  setNext(middleware) {
    this.next = middleware;
    return middleware;
  }

  handle(request, response) {
    if (this.process(request, response)) {
      if (this.next) {
        return this.next.handle(request, response);
      }
      return true; // Request processed successfully
    }
    return false; // Request rejected
  }

  process(request, response) {
    throw new Error('process() method must be implemented');
  }
}

// Concrete Middleware - Authentication
class AuthenticationMiddleware extends Middleware {
  process(request, response) {
    console.log(`🔐 AuthenticationMiddleware: Checking authentication`);

    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      console.log(`❌ Authentication failed: No authorization header`);
      response.status = 401;
      response.body = { error: 'Authentication required' };
      return false;
    }

    // Simulate token validation
    const token = authHeader.replace('Bearer ', '');
    if (token === 'invalid_token') {
      console.log(`❌ Authentication failed: Invalid token`);
      response.status = 401;
      response.body = { error: 'Invalid token' };
      return false;
    }

    // Add user info to request
    request.user = { id: 123, username: 'john_doe', role: 'user' };
    console.log(`✅ Authentication successful: User ${request.user.username}`);
    return true;
  }
}

// Concrete Middleware - Authorization
class AuthorizationMiddleware extends Middleware {
  constructor(requiredRole = 'user') {
    super();
    this.requiredRole = requiredRole;
  }

  process(request, response) {
    console.log(`🛡️ AuthorizationMiddleware: Checking authorization`);

    if (!request.user) {
      console.log(`❌ Authorization failed: No user information`);
      response.status = 401;
      response.body = { error: 'User not authenticated' };
      return false;
    }

    const userRole = request.user.role;
    const roleHierarchy = { user: 1, admin: 2, superadmin: 3 };

    if (roleHierarchy[userRole] < roleHierarchy[this.requiredRole]) {
      console.log(
        `❌ Authorization failed: Insufficient permissions (has: ${userRole}, needs: ${this.requiredRole})`,
      );
      response.status = 403;
      response.body = { error: 'Insufficient permissions' };
      return false;
    }

    console.log(`✅ Authorization successful: User has ${userRole} role`);
    return true;
  }
}

// Concrete Middleware - Rate Limiting
class RateLimitMiddleware extends Middleware {
  constructor(maxRequests = 10, windowMinutes = 1) {
    super();
    this.maxRequests = maxRequests;
    this.windowMs = windowMinutes * 60 * 1000;
    this.requests = new Map(); // userId -> { count, resetTime }
  }

  process(request, response) {
    console.log(`⏱️ RateLimitMiddleware: Checking rate limits`);

    const userId = request.user?.id || request.ip;
    const now = Date.now();

    if (!this.requests.has(userId)) {
      this.requests.set(userId, { count: 0, resetTime: now + this.windowMs });
    }

    const userRequests = this.requests.get(userId);

    // Reset window if expired
    if (now > userRequests.resetTime) {
      userRequests.count = 0;
      userRequests.resetTime = now + this.windowMs;
    }

    userRequests.count++;

    if (userRequests.count > this.maxRequests) {
      const resetIn = Math.ceil((userRequests.resetTime - now) / 1000);
      console.log(
        `❌ Rate limit exceeded: ${userRequests.count}/${this.maxRequests} (resets in ${resetIn}s)`,
      );

      response.status = 429;
      response.body = {
        error: 'Rate limit exceeded',
        resetIn: resetIn,
      };
      return false;
    }

    console.log(`✅ Rate limit OK: ${userRequests.count}/${this.maxRequests} requests`);
    return true;
  }
}

// Concrete Middleware - Request Validation
class ValidationMiddleware extends Middleware {
  constructor(requiredFields = []) {
    super();
    this.requiredFields = requiredFields;
  }

  process(request, response) {
    console.log(`✔️ ValidationMiddleware: Validating request`);

    const missingFields = [];

    // Check required fields in body
    this.requiredFields.forEach((field) => {
      if (!request.body || !request.body[field]) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      console.log(`❌ Validation failed: Missing fields: ${missingFields.join(', ')}`);
      response.status = 400;
      response.body = {
        error: 'Validation failed',
        missingFields: missingFields,
      };
      return false;
    }

    console.log(`✅ Validation successful: All required fields present`);
    return true;
  }
}

// Concrete Middleware - Request Logger
class LoggerMiddleware extends Middleware {
  process(request, response) {
    const timestamp = new Date().toISOString();
    console.log(`📝 LoggerMiddleware: ${timestamp} ${request.method} ${request.path}`);
    console.log(`   User-Agent: ${request.headers['user-agent'] || 'Unknown'}`);
    console.log(`   IP: ${request.ip}`);

    // Always continue to next middleware
    return true;
  }
}

// HTTP Request/Response classes for demo
class HTTPRequest {
  constructor(method, path, headers = {}, body = null) {
    this.method = method;
    this.path = path;
    this.headers = headers;
    this.body = body;
    this.ip = '192.168.1.1';
    this.user = null; // Will be set by authentication middleware
  }
}

class HTTPResponse {
  constructor() {
    this.status = 200;
    this.body = null;
    this.headers = {};
  }
}

// Usage
console.log('\n=== HTTP Middleware Chain Demo ===\n');

console.log('Setting up middleware chain:');
console.log('-'.repeat(30));

// Create middleware components
const logger = new LoggerMiddleware();
const auth = new AuthenticationMiddleware();
const authorization = new AuthorizationMiddleware('user');
const rateLimit = new RateLimitMiddleware(3, 1); // 3 requests per minute
const validation = new ValidationMiddleware(['title', 'content']);

// Set up middleware chain
logger.setNext(auth).setNext(authorization).setNext(rateLimit).setNext(validation);

console.log('✅ Middleware chain: Logger → Auth → Authorization → RateLimit → Validation\n');

console.log('Processing different requests:');
console.log('-'.repeat(35));

// Test requests
const testRequests = [
  {
    name: 'Valid authenticated request',
    request: new HTTPRequest(
      'POST',
      '/api/posts',
      {
        authorization: 'Bearer valid_token',
        'user-agent': 'MyApp/1.0',
      },
      { title: 'My Post', content: 'Post content here' },
    ),
  },
  {
    name: 'Request without authentication',
    request: new HTTPRequest(
      'POST',
      '/api/posts',
      {
        'user-agent': 'MyApp/1.0',
      },
      { title: 'My Post', content: 'Post content here' },
    ),
  },
  {
    name: 'Request with invalid token',
    request: new HTTPRequest(
      'POST',
      '/api/posts',
      {
        authorization: 'Bearer invalid_token',
        'user-agent': 'MyApp/1.0',
      },
      { title: 'My Post', content: 'Post content here' },
    ),
  },
  {
    name: 'Request with missing validation fields',
    request: new HTTPRequest(
      'POST',
      '/api/posts',
      {
        authorization: 'Bearer valid_token',
        'user-agent': 'MyApp/1.0',
      },
      { title: 'My Post' },
    ), // Missing 'content' field
  },
];

testRequests.forEach((test, index) => {
  console.log(`\n${index + 1}. ${test.name}:`);
  console.log('-'.repeat(40));

  const response = new HTTPResponse();
  const success = logger.handle(test.request, response);

  console.log(`\n📊 Result: ${success ? 'SUCCESS' : 'FAILED'}`);
  if (response.status !== 200) {
    console.log(`   Status: ${response.status}`);
    console.log(`   Error:`, response.body);
  }
});

// Test rate limiting
console.log(`\n${'='.repeat(50)}\n`);
console.log('Testing rate limiting with multiple requests:');
console.log('-'.repeat(45));

for (let i = 1; i <= 5; i++) {
  console.log(`\nRequest ${i}:`);
  console.log('-'.repeat(12));

  const request = new HTTPRequest(
    'POST',
    '/api/posts',
    {
      authorization: 'Bearer valid_token',
      'user-agent': 'MyApp/1.0',
    },
    { title: `Post ${i}`, content: `Content for post ${i}` },
  );

  const response = new HTTPResponse();
  const success = logger.handle(request, response);

  console.log(`📊 Result: ${success ? 'SUCCESS' : 'FAILED'}`);
  if (response.status !== 200) {
    console.log(`   Status: ${response.status}`);
    console.log(`   Error:`, response.body);
  }
}
```

## ✅ Pros

- **Decoupling**: Decouples sender from receivers
- **Flexibility**: Can add/remove handlers dynamically
- **Single Responsibility**: Each handler has one responsibility
- **Runtime Configuration**: Chain can be configured at runtime
- **Request Processing**: Multiple handlers can process the same request

## ❌ Cons

- **Performance**: Request might traverse the entire chain
- **Debugging**: Can be difficult to debug the chain execution
- **No Guarantee**: No guarantee that request will be handled
- **Chain Management**: Managing the chain can become complex

## 🎯 When to Use

- **Multiple Processors**: Multiple objects can handle a request
- **Dynamic Handler Set**: The set of handlers should be specified dynamically
- **Unknown Recipients**: You don't want to specify receivers explicitly
- **Request Filtering**: Need to filter requests through multiple criteria
- **Event Handling**: GUI events that bubble up through components

## 🔄 Chain Variations

### 1. **Pure Chain of Responsibility**

- Only one handler processes the request
- Request stops after first successful handling

### 2. **Chain with Fallback** (shown in examples)

- Handlers can reject and pass to next handler
- Default handler at the end

### 3. **Processing Chain**

- All handlers in the chain process the request
- Each handler modifies the request

### 4. **Conditional Chain**

```javascript
class ConditionalHandler extends Handler {
  constructor(condition) {
    super();
    this.condition = condition;
  }

  handle(request) {
    if (this.condition(request)) {
      return this.process(request);
    } else if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return null;
  }
}
```

## 🔗 Related Patterns

- **Decorator**: Both use object composition, but Chain of Responsibility passes requests while Decorator adds behavior
- **Command**: Both can implement undo/redo, but Command encapsulates requests while Chain of Responsibility processes them
- **Composite**: Chain uses composition to build handlers, similar to Composite's tree structure
- **Template Method**: Handlers might use Template Method to define processing steps

## 📚 Further Reading

- [Chain of Responsibility - Refactoring.Guru](https://refactoring.guru/design-patterns/chain-of-responsibility)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [JavaScript Middleware Patterns](https://expressjs.com/en/guide/using-middleware.html)
