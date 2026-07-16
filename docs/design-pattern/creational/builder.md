# Builder Pattern 🏗️

> **Definition**: The Builder pattern separates the construction of complex objects from their representation, allowing the same construction process to create different representations.

## 🎯 Intent

Construct complex objects step by step. The pattern allows you to produce different types and representations of an object using the same construction code.

## 🤔 Problem

Imagine creating a complex object like a House. A house might have walls, doors, windows, a roof, a garage, a swimming pool, a garden, etc. The simple approach would be to create a huge constructor with all possible parameters:

```javascript
// This becomes unwieldy quickly
class House {
  constructor(walls, doors, windows, roof, garage, pool, garden, basement, attic) {
    // Too many parameters!
  }
}
```

This approach has several problems:
- Most parameters will be optional, leading to telescoping constructors
- The constructor becomes hard to read and maintain
- Creating different variations becomes cumbersome

## 💡 Solution

The Builder pattern suggests extracting the object construction code out of its own class and move it to separate objects called builders.

The pattern organizes object construction into a set of steps. To create an object, you execute a series of these steps on a builder object. The important part is that you don't need to call all steps - you can call only those steps that are necessary for producing a particular configuration of an object.

## 🏗️ Structure

```
Director
├── construct(builder)
└── setBuilder(builder)

Builder (interface)
├── reset()
├── buildPartA()
├── buildPartB()
├── buildPartC()
└── getResult()

ConcreteBuilder implements Builder
├── product: Product
├── reset(): void
├── buildPartA(): void
├── buildPartB(): void
├── buildPartC(): void
└── getResult(): Product

Product
└── parts[]
```

## 💻 Code Example

### Basic Implementation

```javascript
// Product class
class House {
  constructor() {
    this.parts = [];
  }

  addPart(part) {
    this.parts.push(part);
  }

  describe() {
    console.log(`🏠 House with: ${this.parts.join(', ')}`);
    return this.parts;
  }
}

// Abstract Builder
class HouseBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.house = new House();
    return this;
  }

  // Abstract methods
  buildFoundation() { throw new Error("buildFoundation() must be implemented"); }
  buildWalls() { throw new Error("buildWalls() must be implemented"); }
  buildRoof() { throw new Error("buildRoof() must be implemented"); }
  buildDoors() { throw new Error("buildDoors() must be implemented"); }
  buildWindows() { throw new Error("buildWindows() must be implemented"); }

  getResult() {
    const result = this.house;
    this.reset(); // Reset for next construction
    return result;
  }
}

// Concrete Builder - Modern House
class ModernHouseBuilder extends HouseBuilder {
  buildFoundation() {
    console.log("🏗️ Building concrete slab foundation");
    this.house.addPart("Concrete slab foundation");
    return this;
  }

  buildWalls() {
    console.log("🧱 Building glass and steel walls");
    this.house.addPart("Glass and steel walls");
    return this;
  }

  buildRoof() {
    console.log("🏠 Building flat roof with solar panels");
    this.house.addPart("Flat roof with solar panels");
    return this;
  }

  buildDoors() {
    console.log("🚪 Installing smart glass doors");
    this.house.addPart("Smart glass doors");
    return this;
  }

  buildWindows() {
    console.log("🪟 Installing floor-to-ceiling windows");
    this.house.addPart("Floor-to-ceiling windows");
    return this;
  }

  addSmartHome() {
    console.log("🤖 Installing smart home system");
    this.house.addPart("Smart home automation system");
    return this;
  }

  addPool() {
    console.log("🏊 Adding infinity pool");
    this.house.addPart("Infinity pool");
    return this;
  }
}

// Concrete Builder - Traditional House
class TraditionalHouseBuilder extends HouseBuilder {
  buildFoundation() {
    console.log("🏗️ Building stone foundation");
    this.house.addPart("Stone foundation");
    return this;
  }

  buildWalls() {
    console.log("🧱 Building brick walls");
    this.house.addPart("Brick walls");
    return this;
  }

  buildRoof() {
    console.log("🏠 Building pitched roof with tiles");
    this.house.addPart("Pitched tile roof");
    return this;
  }

  buildDoors() {
    console.log("🚪 Installing wooden doors");
    this.house.addPart("Wooden doors");
    return this;
  }

  buildWindows() {
    console.log("🪟 Installing traditional windows");
    this.house.addPart("Traditional windows");
    return this;
  }

  addFireplace() {
    console.log("🔥 Adding stone fireplace");
    this.house.addPart("Stone fireplace");
    return this;
  }

  addGarden() {
    console.log("🌹 Adding cottage garden");
    this.house.addPart("Cottage garden");
    return this;
  }
}

// Director class
class HouseDirector {
  constructor() {
    this.builder = null;
  }

  setBuilder(builder) {
    this.builder = builder;
  }

  // Different construction algorithms
  constructBasicHouse() {
    if (!this.builder) throw new Error("Builder not set");

    console.log("🏗️ Constructing basic house...");
    return this.builder
      .buildFoundation()
      .buildWalls()
      .buildRoof()
      .buildDoors()
      .buildWindows();
  }

  constructLuxuryHouse() {
    if (!this.builder) throw new Error("Builder not set");

    console.log("🏗️ Constructing luxury house...");
    this.constructBasicHouse();

    // Add luxury features based on builder type
    if (this.builder instanceof ModernHouseBuilder) {
      this.builder.addSmartHome().addPool();
    } else if (this.builder instanceof TraditionalHouseBuilder) {
      this.builder.addFireplace().addGarden();
    }

    return this.builder;
  }
}

// Usage
function demonstrateBuilder() {
  console.log("=== Builder Pattern Demo ===\n");

  const director = new HouseDirector();

  // Build modern houses
  console.log("Building Modern Houses:");
  console.log("-".repeat(30));

  const modernBuilder = new ModernHouseBuilder();
  director.setBuilder(modernBuilder);

  // Basic modern house
  director.constructBasicHouse();
  const basicModernHouse = modernBuilder.getResult();
  basicModernHouse.describe();

  console.log();

  // Luxury modern house
  director.constructLuxuryHouse();
  const luxuryModernHouse = modernBuilder.getResult();
  luxuryModernHouse.describe();

  console.log("\n" + "=".repeat(50) + "\n");

  // Build traditional houses
  console.log("Building Traditional Houses:");
  console.log("-".repeat(30));

  const traditionalBuilder = new TraditionalHouseBuilder();
  director.setBuilder(traditionalBuilder);

  // Basic traditional house
  director.constructBasicHouse();
  const basicTraditionalHouse = traditionalBuilder.getResult();
  basicTraditionalHouse.describe();

  console.log();

  // Luxury traditional house
  director.constructLuxuryHouse();
  const luxuryTraditionalHouse = traditionalBuilder.getResult();
  luxuryTraditionalHouse.describe();
}

demonstrateBuilder();
```

## 🌟 Real-World Examples

### 1. SQL Query Builder

```javascript
// Product - SQL Query
class SQLQuery {
  constructor() {
    this.selectFields = [];
    this.fromTable = '';
    this.joinClauses = [];
    this.whereConditions = [];
    this.groupByFields = [];
    this.havingConditions = [];
    this.orderByFields = [];
    this.limitCount = null;
    this.offsetCount = null;
  }

  toString() {
    let query = '';

    // SELECT clause
    if (this.selectFields.length > 0) {
      query += `SELECT ${this.selectFields.join(', ')}`;
    }

    // FROM clause
    if (this.fromTable) {
      query += ` FROM ${this.fromTable}`;
    }

    // JOIN clauses
    if (this.joinClauses.length > 0) {
      query += ` ${this.joinClauses.join(' ')}`;
    }

    // WHERE clause
    if (this.whereConditions.length > 0) {
      query += ` WHERE ${this.whereConditions.join(' AND ')}`;
    }

    // GROUP BY clause
    if (this.groupByFields.length > 0) {
      query += ` GROUP BY ${this.groupByFields.join(', ')}`;
    }

    // HAVING clause
    if (this.havingConditions.length > 0) {
      query += ` HAVING ${this.havingConditions.join(' AND ')}`;
    }

    // ORDER BY clause
    if (this.orderByFields.length > 0) {
      query += ` ORDER BY ${this.orderByFields.join(', ')}`;
    }

    // LIMIT clause
    if (this.limitCount !== null) {
      query += ` LIMIT ${this.limitCount}`;
    }

    // OFFSET clause
    if (this.offsetCount !== null) {
      query += ` OFFSET ${this.offsetCount}`;
    }

    return query + ';';
  }
}

// Builder
class QueryBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.query = new SQLQuery();
    return this;
  }

  select(...fields) {
    if (fields.length === 0) {
      this.query.selectFields.push('*');
    } else {
      this.query.selectFields.push(...fields);
    }
    console.log(`📊 SELECT: ${fields.join(', ') || '*'}`);
    return this;
  }

  from(table) {
    this.query.fromTable = table;
    console.log(`📋 FROM: ${table}`);
    return this;
  }

  join(table, condition, type = 'INNER') {
    const joinClause = `${type} JOIN ${table} ON ${condition}`;
    this.query.joinClauses.push(joinClause);
    console.log(`🔗 JOIN: ${joinClause}`);
    return this;
  }

  leftJoin(table, condition) {
    return this.join(table, condition, 'LEFT');
  }

  rightJoin(table, condition) {
    return this.join(table, condition, 'RIGHT');
  }

  where(condition) {
    this.query.whereConditions.push(condition);
    console.log(`🔍 WHERE: ${condition}`);
    return this;
  }

  groupBy(...fields) {
    this.query.groupByFields.push(...fields);
    console.log(`📊 GROUP BY: ${fields.join(', ')}`);
    return this;
  }

  having(condition) {
    this.query.havingConditions.push(condition);
    console.log(`🔍 HAVING: ${condition}`);
    return this;
  }

  orderBy(field, direction = 'ASC') {
    const orderClause = `${field} ${direction}`;
    this.query.orderByFields.push(orderClause);
    console.log(`📈 ORDER BY: ${orderClause}`);
    return this;
  }

  limit(count) {
    this.query.limitCount = count;
    console.log(`🔢 LIMIT: ${count}`);
    return this;
  }

  offset(count) {
    this.query.offsetCount = count;
    console.log(`⏭️ OFFSET: ${count}`);
    return this;
  }

  build() {
    const result = this.query;
    this.reset();
    return result;
  }
}

// Usage examples
console.log("=== SQL Query Builder Demo ===\n");

const queryBuilder = new QueryBuilder();

// Simple query
console.log("Building Simple Query:");
console.log("-".repeat(25));
const simpleQuery = queryBuilder
  .select('name', 'email')
  .from('users')
  .where('active = 1')
  .orderBy('name')
  .build();

console.log("📝 Generated Query:");
console.log(simpleQuery.toString());

console.log("\n" + "=".repeat(40) + "\n");

// Complex query with joins
console.log("Building Complex Query:");
console.log("-".repeat(25));
const complexQuery = queryBuilder
  .select('u.name', 'u.email', 'p.title', 'COUNT(c.id) as comment_count')
  .from('users u')
  .leftJoin('posts p', 'p.user_id = u.id')
  .leftJoin('comments c', 'c.post_id = p.id')
  .where('u.active = 1')
  .where('p.published = 1')
  .groupBy('u.id', 'p.id')
  .having('comment_count > 5')
  .orderBy('comment_count', 'DESC')
  .limit(10)
  .build();

console.log("📝 Generated Query:");
console.log(complexQuery.toString());
```

### 2. HTTP Request Builder

```javascript
// Product - HTTP Request
class HTTPRequest {
  constructor() {
    this.method = 'GET';
    this.url = '';
    this.headers = {};
    this.queryParams = {};
    this.body = null;
    this.timeout = 5000;
    this.retries = 0;
    this.authToken = null;
  }

  getConfig() {
    const config = {
      method: this.method,
      url: this.buildUrl(),
      headers: this.headers,
      timeout: this.timeout
    };

    if (this.body) {
      config.data = this.body;
    }

    return config;
  }

  buildUrl() {
    let url = this.url;
    const paramString = Object.keys(this.queryParams)
      .map(key => `${key}=${encodeURIComponent(this.queryParams[key])}`)
      .join('&');

    if (paramString) {
      url += (url.includes('?') ? '&' : '?') + paramString;
    }

    return url;
  }

  async execute() {
    console.log(`🌐 Executing ${this.method} request to: ${this.buildUrl()}`);
    console.log(`📋 Headers:`, JSON.stringify(this.headers, null, 2));

    if (this.body) {
      console.log(`📦 Body:`, JSON.stringify(this.body, null, 2));
    }

    // Simulate HTTP request
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          data: { message: 'Request successful', url: this.buildUrl() },
          headers: { 'content-type': 'application/json' }
        });
      }, 100);
    });
  }
}

// Builder
class HTTPRequestBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.request = new HTTPRequest();
    return this;
  }

  // HTTP methods
  get(url) {
    this.request.method = 'GET';
    this.request.url = url;
    console.log(`🔍 GET: ${url}`);
    return this;
  }

  post(url) {
    this.request.method = 'POST';
    this.request.url = url;
    console.log(`📤 POST: ${url}`);
    return this;
  }

  put(url) {
    this.request.method = 'PUT';
    this.request.url = url;
    console.log(`📝 PUT: ${url}`);
    return this;
  }

  delete(url) {
    this.request.method = 'DELETE';
    this.request.url = url;
    console.log(`🗑️ DELETE: ${url}`);
    return this;
  }

  // Headers
  header(name, value) {
    this.request.headers[name] = value;
    console.log(`📋 Header: ${name} = ${value}`);
    return this;
  }

  headers(headerObj) {
    Object.assign(this.request.headers, headerObj);
    console.log(`📋 Headers:`, headerObj);
    return this;
  }

  contentType(type) {
    return this.header('Content-Type', type);
  }

  accept(type) {
    return this.header('Accept', type);
  }

  // Authentication
  bearerAuth(token) {
    this.request.authToken = token;
    return this.header('Authorization', `Bearer ${token}`);
  }

  basicAuth(username, password) {
    const credentials = btoa(`${username}:${password}`);
    return this.header('Authorization', `Basic ${credentials}`);
  }

  // Query parameters
  query(name, value) {
    this.request.queryParams[name] = value;
    console.log(`🔍 Query param: ${name} = ${value}`);
    return this;
  }

  queryParams(params) {
    Object.assign(this.request.queryParams, params);
    console.log(`🔍 Query params:`, params);
    return this;
  }

  // Body
  body(data) {
    this.request.body = data;
    console.log(`📦 Body set:`, typeof data === 'object' ? '[Object]' : data);
    return this;
  }

  json(data) {
    this.contentType('application/json');
    return this.body(JSON.stringify(data));
  }

  form(data) {
    this.contentType('application/x-www-form-urlencoded');
    const formData = Object.keys(data)
      .map(key => `${key}=${encodeURIComponent(data[key])}`)
      .join('&');
    return this.body(formData);
  }

  // Configuration
  timeout(ms) {
    this.request.timeout = ms;
    console.log(`⏱️ Timeout: ${ms}ms`);
    return this;
  }

  retries(count) {
    this.request.retries = count;
    console.log(`🔄 Retries: ${count}`);
    return this;
  }

  // Build and execute
  build() {
    const result = this.request;
    this.reset();
    return result;
  }

  async execute() {
    const request = this.build();
    return await request.execute();
  }
}

// Usage examples
async function demonstrateHTTPBuilder() {
  console.log("=== HTTP Request Builder Demo ===\n");

  const builder = new HTTPRequestBuilder();

  // Simple GET request
  console.log("Building Simple GET Request:");
  console.log("-".repeat(30));

  const getResponse = await builder
    .get('https://api.example.com/users')
    .header('User-Agent', 'MyApp/1.0')
    .query('page', 1)
    .query('limit', 10)
    .timeout(3000)
    .execute();

  console.log("✅ Response:", getResponse);

  console.log("\n" + "=".repeat(50) + "\n");

  // Complex POST request
  console.log("Building Complex POST Request:");
  console.log("-".repeat(30));

  const postResponse = await builder
    .post('https://api.example.com/users')
    .bearerAuth('eyJhbGciOiJIUzI1NiIs...')
    .accept('application/json')
    .json({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    })
    .timeout(5000)
    .retries(2)
    .execute();

  console.log("✅ Response:", postResponse);

  console.log("\n" + "=".repeat(50) + "\n");

  // Form submission
  console.log("Building Form POST Request:");
  console.log("-".repeat(30));

  const formResponse = await builder
    .post('https://api.example.com/contact')
    .form({
      name: 'Jane Smith',
      email: 'jane@example.com',
      message: 'Hello World!'
    })
    .execute();

  console.log("✅ Response:", formResponse);
}

// Run the demo
demonstrateHTTPBuilder();
```

### 3. Configuration Builder

```javascript
// Product - Application Configuration
class AppConfig {
  constructor() {
    this.database = {};
    this.server = {};
    this.logging = {};
    this.security = {};
    this.cache = {};
    this.email = {};
    this.features = {};
  }

  validate() {
    const errors = [];

    // Validate required database settings
    if (!this.database.host) errors.push("Database host is required");
    if (!this.database.name) errors.push("Database name is required");

    // Validate server settings
    if (!this.server.port) errors.push("Server port is required");

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed:\n- ${errors.join('\n- ')}`);
    }

    return true;
  }

  toJSON() {
    return {
      database: this.database,
      server: this.server,
      logging: this.logging,
      security: this.security,
      cache: this.cache,
      email: this.email,
      features: this.features
    };
  }

  toString() {
    return JSON.stringify(this.toJSON(), null, 2);
  }
}

// Builder
class ConfigBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.config = new AppConfig();
    return this;
  }

  // Database configuration
  database(options) {
    Object.assign(this.config.database, options);
    console.log("🗄️ Database config:", options);
    return this;
  }

  mysql(options = {}) {
    return this.database({
      type: 'mysql',
      port: 3306,
      ...options
    });
  }

  postgresql(options = {}) {
    return this.database({
      type: 'postgresql',
      port: 5432,
      ...options
    });
  }

  mongodb(options = {}) {
    return this.database({
      type: 'mongodb',
      port: 27017,
      ...options
    });
  }

  // Server configuration
  server(options) {
    Object.assign(this.config.server, options);
    console.log("🖥️ Server config:", options);
    return this;
  }

  port(port) {
    this.config.server.port = port;
    console.log(`🔌 Server port: ${port}`);
    return this;
  }

  host(host) {
    this.config.server.host = host;
    console.log(`🌐 Server host: ${host}`);
    return this;
  }

  // Logging configuration
  logging(options) {
    Object.assign(this.config.logging, options);
    console.log("📝 Logging config:", options);
    return this;
  }

  logLevel(level) {
    this.config.logging.level = level;
    console.log(`📊 Log level: ${level}`);
    return this;
  }

  logFile(filename) {
    this.config.logging.file = filename;
    console.log(`📄 Log file: ${filename}`);
    return this;
  }

  // Security configuration
  security(options) {
    Object.assign(this.config.security, options);
    console.log("🔒 Security config:", options);
    return this;
  }

  jwtSecret(secret) {
    this.config.security.jwtSecret = secret;
    console.log("🔑 JWT secret configured");
    return this;
  }

  cors(options = {}) {
    this.config.security.cors = {
      enabled: true,
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      ...options
    };
    console.log("🌐 CORS configured:", this.config.security.cors);
    return this;
  }

  // Cache configuration
  cache(options) {
    Object.assign(this.config.cache, options);
    console.log("💾 Cache config:", options);
    return this;
  }

  redis(options = {}) {
    return this.cache({
      type: 'redis',
      host: 'localhost',
      port: 6379,
      ...options
    });
  }

  memcached(options = {}) {
    return this.cache({
      type: 'memcached',
      host: 'localhost',
      port: 11211,
      ...options
    });
  }

  // Email configuration
  email(options) {
    Object.assign(this.config.email, options);
    console.log("📧 Email config set");
    return this;
  }

  smtp(options) {
    return this.email({
      type: 'smtp',
      ...options
    });
  }

  // Feature flags
  features(options) {
    Object.assign(this.config.features, options);
    console.log("🎛️ Features configured:", options);
    return this;
  }

  enableFeature(feature, enabled = true) {
    this.config.features[feature] = enabled;
    console.log(`🎛️ Feature ${feature}: ${enabled ? 'enabled' : 'disabled'}`);
    return this;
  }

  // Environment-specific configurations
  development() {
    return this
      .logLevel('debug')
      .cors({ origin: 'http://localhost:3000' })
      .enableFeature('debug', true)
      .enableFeature('hotReload', true);
  }

  production() {
    return this
      .logLevel('error')
      .cors({ origin: 'https://myapp.com' })
      .enableFeature('debug', false)
      .enableFeature('monitoring', true)
      .enableFeature('compression', true);
  }

  testing() {
    return this
      .logLevel('warn')
      .database({ name: 'test_db' })
      .enableFeature('debug', true)
      .enableFeature('testMode', true);
  }

  build() {
    const result = this.config;
    result.validate(); // Validate before returning
    this.reset();
    return result;
  }
}

// Usage examples
function demonstrateConfigBuilder() {
  console.log("=== Configuration Builder Demo ===\n");

  const builder = new ConfigBuilder();

  // Development configuration
  console.log("Building Development Configuration:");
  console.log("-".repeat(35));

  const devConfig = builder
    .postgresql({
      host: 'localhost',
      name: 'myapp_dev',
      username: 'dev_user',
      password: 'dev_pass'
    })
    .port(3000)
    .host('localhost')
    .development()
    .redis({ host: 'localhost' })
    .smtp({
      host: 'localhost',
      port: 1025,
      secure: false
    })
    .jwtSecret('dev-secret-key')
    .build();

  console.log("✅ Development Config:");
  console.log(devConfig.toString());

  console.log("\n" + "=".repeat(60) + "\n");

  // Production configuration
  console.log("Building Production Configuration:");
  console.log("-".repeat(35));

  const prodConfig = builder
    .mysql({
      host: 'prod-db.example.com',
      name: 'myapp_prod',
      username: 'prod_user',
      password: process.env.DB_PASSWORD || 'secure-password',
      ssl: true
    })
    .port(8080)
    .host('0.0.0.0')
    .production()
    .redis({
      host: 'redis.example.com',
      password: process.env.REDIS_PASSWORD || 'redis-password'
    })
    .smtp({
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    })
    .jwtSecret(process.env.JWT_SECRET || 'super-secure-secret')
    .build();

  console.log("✅ Production Config:");
  console.log(prodConfig.toString());

  console.log("\n" + "=".repeat(60) + "\n");

  // Testing configuration
  console.log("Building Test Configuration:");
  console.log("-".repeat(30));

  const testConfig = builder
    .mongodb({
      host: 'localhost',
      name: 'myapp_test'
    })
    .port(3001)
    .testing()
    .logFile('test.log')
    .enableFeature('mockData', true)
    .build();

  console.log("✅ Test Config:");
  console.log(testConfig.toString());
}

// Run the demo
demonstrateConfigBuilder();
```

## ✅ Pros

- **Step-by-Step Construction**: Allows you to construct objects step by step
- **Different Representations**: Can create different representations of the same object
- **Improved Readability**: Builder methods provide a more readable way to construct objects
- **Parameter Validation**: Can validate parameters at each step
- **Immutability**: Can create immutable objects by building them completely before returning
- **Flexibility**: Easy to add new construction steps without changing existing code

## ❌ Cons

- **Code Complexity**: Increases code complexity due to multiple new classes
- **Memory Overhead**: Creates additional objects during construction
- **Learning Curve**: More complex pattern to understand initially
- **Overkill for Simple Objects**: Unnecessary for objects with few parameters

## 🎯 When to Use

- **Complex Objects**: When creating objects with many optional parameters
- **Step-by-Step Construction**: When object creation involves multiple steps
- **Different Representations**: When you need to create different representations of the same object
- **Immutable Objects**: When building immutable objects with many fields
- **Configuration Objects**: For creating configuration objects with many optional settings

## 🔄 Variations

### 1. **Fluent Interface Builder**
```javascript
class FluentBuilder {
  method1(value) {
    this.value1 = value;
    return this; // Return this for chaining
  }

  method2(value) {
    this.value2 = value;
    return this;
  }
}
```

### 2. **Step Builder**
```javascript
class StepBuilder {
  constructor() {
    return {
      step1: (value) => ({
        step2: (value) => ({
          build: () => new Product(value1, value2)
        })
      })
    };
  }
}
```

### 3. **Generic Builder**
```javascript
class GenericBuilder {
  constructor(ProductClass) {
    this.ProductClass = ProductClass;
    this.properties = {};
  }

  set(property, value) {
    this.properties[property] = value;
    return this;
  }

  build() {
    return new this.ProductClass(this.properties);
  }
}
```

## 🔗 Related Patterns

- **Abstract Factory**: Builders often use factories to create components
- **Composite**: Builder can be used to build Composite structures
- **Singleton**: Builder can be implemented as a Singleton
- **Strategy**: Different builders can represent different strategies for object construction

## 📚 Further Reading

- [Builder Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/builder)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [JavaScript Builder Pattern](https://www.dofactory.com/javascript/design-patterns/builder)
