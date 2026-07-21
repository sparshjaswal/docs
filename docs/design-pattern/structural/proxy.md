---
id: design-pattern-structural-proxy
title: Proxy Pattern 🛡️
slug: /design-pattern/structural/proxy
sidebar_label: Proxy Pattern 🛡️
---

# Proxy Pattern 🛡️

> **Definition**: The Proxy pattern provides a placeholder or surrogate for another object to control access to it. It acts as an intermediary between a client and the real object.

## 🎯 Intent

Provide a surrogate or placeholder for another object to control access to it. The proxy forwards requests to the real object when appropriate.

## 🤔 Problem

You want to control access to an object for various reasons:

- **Lazy initialization**: Create expensive objects only when needed
- **Access control**: Restrict access to sensitive objects
- **Caching**: Cache results of expensive operations
- **Logging**: Log requests before forwarding them
- **Remote objects**: Represent objects in different address spaces

Direct access to the object might not always be desirable or possible.

## 💡 Solution

The Proxy pattern suggests creating a proxy class with the same interface as the original object. The proxy receives client requests, performs some work (access control, caching, etc.), and then forwards the request to the real object.

## 🏗️ Structure

```
Subject (interface)
└── request()

RealSubject implements Subject
└── request()

Proxy implements Subject
├── realSubject: RealSubject
├── request() → checkAccess() + realSubject.request() + logRequest()
├── checkAccess()
└── logRequest()
```

## 💻 Simple Example

### Image Proxy (Lazy Loading)

```javascript
// Subject interface
class Image {
  display() {
    throw new Error('display() method must be implemented');
  }

  getSize() {
    throw new Error('getSize() method must be implemented');
  }
}

// Real subject - Actual image
class RealImage extends Image {
  constructor(filename) {
    super();
    this.filename = filename;
    this.loadImage();
  }

  loadImage() {
    console.log(`📥 Loading image from disk: ${this.filename}`);
    // Simulate expensive loading operation
    this.data = `Image data for ${this.filename}`;
    this.size = Math.floor(Math.random() * 1000) + 100; // Random size
    console.log(`✅ Image loaded: ${this.filename} (${this.size} KB)`);
  }

  display() {
    console.log(`🖼️ Displaying image: ${this.filename}`);
  }

  getSize() {
    return this.size;
  }
}

// Proxy - Controls access to RealImage
class ImageProxy extends Image {
  constructor(filename) {
    super();
    this.filename = filename;
    this.realImage = null; // Lazy initialization
  }

  display() {
    console.log(`🔄 Proxy: Request to display ${this.filename}`);

    // Load real image only when needed (lazy loading)
    if (!this.realImage) {
      console.log('🔄 Proxy: Creating real image (first access)');
      this.realImage = new RealImage(this.filename);
    }

    this.realImage.display();
  }

  getSize() {
    console.log(`🔄 Proxy: Request for size of ${this.filename}`);

    if (!this.realImage) {
      console.log('🔄 Proxy: Creating real image to get size');
      this.realImage = new RealImage(this.filename);
    }

    return this.realImage.getSize();
  }
}

// Usage
console.log('=== Image Proxy Demo ===\n');

console.log('Creating image proxies (no actual loading yet):');
console.log('-'.repeat(45));

const image1 = new ImageProxy('photo1.jpg');
const image2 = new ImageProxy('photo2.jpg');
const image3 = new ImageProxy('photo3.jpg');

console.log('✅ Three image proxies created\n');

console.log('Displaying images (triggers loading):');
console.log('-'.repeat(35));

image1.display(); // First access - loads image
console.log();

image1.display(); // Second access - uses already loaded image
console.log();

console.log('Getting image sizes:');
console.log('-'.repeat(20));

console.log(`Image 1 size: ${image1.getSize()} KB`); // Already loaded
console.log(`Image 2 size: ${image2.getSize()} KB`); // First access - loads image
console.log();

image2.display(); // Already loaded, so no loading needed
```

## 🌟 Real-World Example

### Database Connection Pool Proxy

```javascript
// Subject interface
class DatabaseConnection {
  query(sql) {
    throw new Error('query() method must be implemented');
  }

  close() {
    throw new Error('close() method must be implemented');
  }

  isConnected() {
    throw new Error('isConnected() method must be implemented');
  }
}

// Real subject - Actual database connection
class RealDatabaseConnection extends DatabaseConnection {
  constructor(connectionString) {
    super();
    this.connectionString = connectionString;
    this.connected = false;
    this.queryCount = 0;
    this.connect();
  }

  connect() {
    console.log(`🔗 Establishing real database connection: ${this.connectionString}`);
    // Simulate connection delay
    this.connected = true;
    console.log('✅ Database connection established');
  }

  query(sql) {
    if (!this.connected) {
      throw new Error('Not connected to database');
    }

    this.queryCount++;
    console.log(`📊 Executing query #${this.queryCount}: ${sql}`);

    // Simulate query execution
    const result = `Result for: ${sql}`;
    console.log(`📋 Query result: ${result}`);
    return result;
  }

  close() {
    if (this.connected) {
      console.log('🔒 Closing database connection');
      this.connected = false;
      console.log(`📊 Total queries executed: ${this.queryCount}`);
    }
  }

  isConnected() {
    return this.connected;
  }
}

// Proxy with access control and caching
class DatabaseConnectionProxy extends DatabaseConnection {
  constructor(connectionString, userRole) {
    super();
    this.connectionString = connectionString;
    this.userRole = userRole;
    this.realConnection = null;
    this.queryCache = new Map();
    this.accessLog = [];
  }

  query(sql) {
    const timestamp = new Date().toISOString();

    // Access control
    if (!this.checkPermission(sql)) {
      const error = `❌ Access denied: ${this.userRole} cannot execute: ${sql}`;
      console.log(error);
      this.logAccess(sql, 'DENIED', timestamp);
      throw new Error(error);
    }

    // Check cache first
    if (this.queryCache.has(sql)) {
      console.log(`💾 Cache hit for query: ${sql}`);
      const cachedResult = this.queryCache.get(sql);
      this.logAccess(sql, 'CACHE_HIT', timestamp);
      return cachedResult;
    }

    // Lazy initialization of real connection
    if (!this.realConnection) {
      console.log('🔄 Proxy: Creating real database connection');
      this.realConnection = new RealDatabaseConnection(this.connectionString);
    }

    // Execute query through real connection
    console.log(`🔄 Proxy: Forwarding query to real connection`);
    const result = this.realConnection.query(sql);

    // Cache the result
    this.queryCache.set(sql, result);
    console.log(`💾 Query result cached`);

    this.logAccess(sql, 'SUCCESS', timestamp);
    return result;
  }

  checkPermission(sql) {
    const sqlUpper = sql.toUpperCase();

    // Simple access control rules
    if (this.userRole === 'admin') {
      return true; // Admin can do anything
    } else if (this.userRole === 'user') {
      // Users can only SELECT
      return sqlUpper.startsWith('SELECT');
    } else if (this.userRole === 'readonly') {
      // Read-only can only SELECT from specific tables
      return sqlUpper.startsWith('SELECT') && !sqlUpper.includes('SENSITIVE');
    }

    return false;
  }

  logAccess(sql, status, timestamp) {
    const logEntry = {
      timestamp,
      user: this.userRole,
      query: sql,
      status,
    };
    this.accessLog.push(logEntry);
    console.log(`📝 Access logged: ${this.userRole} - ${status}`);
  }

  close() {
    if (this.realConnection) {
      this.realConnection.close();
    }

    // Show access statistics
    console.log('\n📊 Access Statistics:');
    const stats = this.getAccessStats();
    console.log(`   Total attempts: ${stats.total}`);
    console.log(`   Successful: ${stats.success}`);
    console.log(`   Cache hits: ${stats.cacheHits}`);
    console.log(`   Denied: ${stats.denied}`);
  }

  isConnected() {
    return this.realConnection ? this.realConnection.isConnected() : false;
  }

  getAccessStats() {
    const stats = { total: 0, success: 0, cacheHits: 0, denied: 0 };

    for (const entry of this.accessLog) {
      stats.total++;
      switch (entry.status) {
        case 'SUCCESS':
          stats.success++;
          break;
        case 'CACHE_HIT':
          stats.cacheHits++;
          break;
        case 'DENIED':
          stats.denied++;
          break;
      }
    }

    return stats;
  }

  clearCache() {
    const cacheSize = this.queryCache.size;
    this.queryCache.clear();
    console.log(`🗑️ Cache cleared (${cacheSize} entries removed)`);
  }
}

// Usage
console.log('=== Database Connection Proxy Demo ===\n');

console.log('Testing with different user roles:');
console.log('-'.repeat(35));

// Admin user
console.log('1. Admin user:');
console.log('-'.repeat(13));
const adminProxy = new DatabaseConnectionProxy('postgresql://localhost:5432/mydb', 'admin');

adminProxy.query('SELECT * FROM users');
adminProxy.query('SELECT * FROM users'); // Cache hit
adminProxy.query("INSERT INTO users (name) VALUES ('John')");
adminProxy.query('DELETE FROM sensitive_data WHERE id = 1');

adminProxy.close();

console.log('\n' + '='.repeat(50) + '\n');

// Regular user
console.log('2. Regular user:');
console.log('-'.repeat(15));
const userProxy = new DatabaseConnectionProxy('postgresql://localhost:5432/mydb', 'user');

userProxy.query('SELECT * FROM products');
userProxy.query('SELECT * FROM products'); // Cache hit

try {
  userProxy.query('DELETE FROM products WHERE id = 1'); // Should be denied
} catch (error) {
  // Access denied error
}

userProxy.close();

console.log('\n' + '='.repeat(50) + '\n');

// Read-only user
console.log('3. Read-only user:');
console.log('-'.repeat(17));
const readonlyProxy = new DatabaseConnectionProxy('postgresql://localhost:5432/mydb', 'readonly');

readonlyProxy.query('SELECT name FROM public_data');

try {
  readonlyProxy.query('SELECT * FROM sensitive_data'); // Should be denied
} catch (error) {
  // Access denied error
}

readonlyProxy.close();
```

## 🔧 Another Simple Example

### Web Service Proxy (Caching & Rate Limiting)

```javascript
// Subject interface
class WebService {
  makeRequest(endpoint, data) {
    throw new Error('makeRequest() method must be implemented');
  }
}

// Real subject - Actual web service
class RealWebService extends WebService {
  constructor(baseUrl) {
    super();
    this.baseUrl = baseUrl;
  }

  makeRequest(endpoint, data = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`🌐 Making HTTP request to: ${url}`);
    console.log(`📦 Request data:`, data);

    // Simulate network request delay
    const responseTime = Math.floor(Math.random() * 1000) + 500;
    console.log(`⏱️ Request took ${responseTime}ms`);

    // Simulate response
    const response = {
      status: 200,
      data: `Response from ${endpoint}`,
      timestamp: new Date().toISOString(),
      responseTime,
    };

    console.log(`📨 Response:`, response);
    return response;
  }
}

// Proxy with caching and rate limiting
class WebServiceProxy extends WebService {
  constructor(baseUrl, rateLimit = 5) {
    super();
    this.realService = new RealWebService(baseUrl);
    this.cache = new Map();
    this.rateLimit = rateLimit; // requests per minute
    this.requestTimes = [];
    this.requestCount = 0;
  }

  makeRequest(endpoint, data = {}) {
    this.requestCount++;
    console.log(`🔄 Proxy: Request #${this.requestCount} to ${endpoint}`);

    // Rate limiting check
    if (!this.checkRateLimit()) {
      const error = '❌ Rate limit exceeded. Please try again later.';
      console.log(error);
      throw new Error(error);
    }

    // Create cache key
    const cacheKey = this.getCacheKey(endpoint, data);

    // Check cache first
    if (this.cache.has(cacheKey)) {
      console.log(`💾 Cache hit for: ${endpoint}`);
      const cachedResponse = this.cache.get(cacheKey);
      console.log(`📨 Cached response:`, cachedResponse);
      return cachedResponse;
    }

    // Forward to real service
    console.log(`🔄 Proxy: Forwarding to real service`);
    const response = this.realService.makeRequest(endpoint, data);

    // Cache the response (with TTL)
    this.cache.set(cacheKey, response);
    console.log(`💾 Response cached for: ${endpoint}`);

    // Update rate limit tracking
    this.requestTimes.push(Date.now());

    return response;
  }

  checkRateLimit() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000; // 1 minute in milliseconds

    // Remove old requests
    this.requestTimes = this.requestTimes.filter((time) => time > oneMinuteAgo);

    console.log(
      `🚦 Rate limit check: ${this.requestTimes.length}/${this.rateLimit} requests in last minute`,
    );

    return this.requestTimes.length < this.rateLimit;
  }

  getCacheKey(endpoint, data) {
    return `${endpoint}:${JSON.stringify(data)}`;
  }

  clearCache() {
    const cacheSize = this.cache.size;
    this.cache.clear();
    console.log(`🗑️ Cache cleared (${cacheSize} entries removed)`);
  }

  getStats() {
    return {
      totalRequests: this.requestCount,
      cachedEntries: this.cache.size,
      recentRequests: this.requestTimes.length,
      rateLimit: this.rateLimit,
    };
  }
}

// Usage
console.log('=== Web Service Proxy Demo ===\n');

const webProxy = new WebServiceProxy('https://api.example.com', 3); // 3 requests per minute

console.log('Making requests through proxy:');
console.log('-'.repeat(30));

// First request
webProxy.makeRequest('/users', { page: 1 });

console.log('\n' + '-'.repeat(40) + '\n');

// Second request (same endpoint) - should hit cache
webProxy.makeRequest('/users', { page: 1 });

console.log('\n' + '-'.repeat(40) + '\n');

// Different request
webProxy.makeRequest('/products', { category: 'electronics' });

console.log('\n' + '-'.repeat(40) + '\n');

// Another different request
webProxy.makeRequest('/orders', { status: 'pending' });

console.log('\n' + '-'.repeat(40) + '\n');

// This should hit rate limit
try {
  webProxy.makeRequest('/analytics', { range: 'monthly' });
} catch (error) {
  console.log('Caught error:', error.message);
}

console.log('\nProxy Statistics:');
console.log('-'.repeat(17));
const stats = webProxy.getStats();
console.log(`Total requests: ${stats.totalRequests}`);
console.log(`Cached entries: ${stats.cachedEntries}`);
console.log(`Recent requests: ${stats.recentRequests}`);
console.log(`Rate limit: ${stats.rateLimit} per minute`);
```

## ✅ Pros

- **Access Control**: Can control access to the real object
- **Lazy Loading**: Objects created only when needed
- **Caching**: Can cache expensive operations
- **Additional Functionality**: Can add logging, security, etc.
- **Transparency**: Same interface as the real object

## ❌ Cons

- **Complexity**: Adds another layer of abstraction
- **Performance**: May introduce latency for some operations
- **Memory**: Proxy objects consume additional memory
- **Maintenance**: Additional code to maintain

## 🎯 When to Use

- **Expensive Objects**: When object creation or operations are expensive
- **Access Control**: When you need to control access to an object
- **Remote Objects**: When working with objects in different address spaces
- **Caching**: When you want to cache results of expensive operations
- **Lazy Loading**: When you want to defer object creation until needed

## 🔄 Types of Proxies

### 1. **Virtual Proxy** (shown in Image example)

- Controls access to expensive objects
- Implements lazy loading

### 2. **Protection Proxy** (shown in Database example)

- Controls access based on permissions
- Implements security checks

### 3. **Caching Proxy** (shown in Web Service example)

- Caches results of expensive operations
- Improves performance

### 4. **Remote Proxy**

```javascript
class RemoteProxy {
  constructor(remoteUrl) {
    this.remoteUrl = remoteUrl;
  }

  async makeRequest(method, data) {
    // Forward request to remote server
    const response = await fetch(this.remoteUrl, {
      method,
      body: JSON.stringify(data),
    });
    return response.json();
  }
}
```

## 🔗 Related Patterns

- **Adapter**: Both provide different interfaces, but Adapter makes incompatible interfaces work together while Proxy provides the same interface
- **Decorator**: Both wrap objects, but Decorator adds behavior while Proxy controls access
- **Facade**: Both provide simplified access, but Facade simplifies complex subsystems while Proxy controls access to single objects

## 📚 Further Reading

- [Proxy Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/proxy)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [JavaScript Proxy Pattern Examples](https://www.dofactory.com/javascript/design-patterns/proxy)
