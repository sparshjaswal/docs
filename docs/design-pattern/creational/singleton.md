# Singleton Pattern 🏯

> **Definition**: The Singleton pattern ensures that a class has only one instance and provides a global point of access to that instance.

## 🎯 Intent

Ensure a class has only one instance, and provide a global point of access to it. This is useful when exactly one object is needed to coordinate actions across the system.

## 🤔 Problem

You need to ensure that a class has only one instance because:

- **Resource Management**: Database connections, file systems, or print spoolers
- **Configuration Settings**: Application settings that should be consistent
- **Logging**: Central logging mechanism
- **Caching**: Shared cache across the application
- **Thread Pools**: Managing limited resources

Having multiple instances could cause:

- Resource conflicts
- Inconsistent behavior
- Memory waste
- Synchronization issues

## 💡 Solution

The Singleton pattern solves this by making the class responsible for keeping track of its sole instance. The class ensures that no other instance can be created and provides a way to access the instance.

## 🏗️ Structure

```
Singleton
├── -instance: Singleton (static)
├── -constructor() (private)
├── +getInstance(): Singleton (static)
└── +businessLogic()

Client → Singleton.getInstance()
```

## 💻 Simple Example

### Application Settings

```javascript
// Basic Singleton - Application Settings
class AppSettings {
  constructor() {
    // Prevent direct instantiation
    if (AppSettings.instance) {
      return AppSettings.instance;
    }

    // Initialize settings
    this.settings = {
      theme: 'light',
      language: 'en',
      apiUrl: 'https://api.example.com',
      timeout: 5000,
      debug: false,
    };

    this.version = '1.0.0';
    this.created = new Date();

    // Store instance
    AppSettings.instance = this;

    console.log('⚙️ AppSettings instance created');
  }

  static getInstance() {
    if (!AppSettings.instance) {
      console.log('🏭 Creating new AppSettings instance');
      AppSettings.instance = new AppSettings();
    } else {
      console.log('♻️ Returning existing AppSettings instance');
    }

    return AppSettings.instance;
  }

  getSetting(key) {
    console.log(`🔍 Getting setting: ${key} = ${this.settings[key]}`);
    return this.settings[key];
  }

  setSetting(key, value) {
    const oldValue = this.settings[key];
    this.settings[key] = value;
    console.log(`📝 Setting updated: ${key} = ${value} (was: ${oldValue})`);
  }

  getAllSettings() {
    console.log('📋 Current Settings:');
    Object.entries(this.settings).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });
    return { ...this.settings };
  }

  resetToDefaults() {
    console.log('🔄 Resetting to default settings');
    this.settings = {
      theme: 'light',
      language: 'en',
      apiUrl: 'https://api.example.com',
      timeout: 5000,
      debug: false,
    };
  }

  getInfo() {
    console.log(`ℹ️ AppSettings Info:`);
    console.log(`   Version: ${this.version}`);
    console.log(`   Created: ${this.created.toLocaleString()}`);
    console.log(`   Instance ID: ${this.constructor.name}@${this.created.getTime()}`);
  }
}

// Usage
console.log('=== Application Settings Singleton Demo ===\n');

console.log('Getting instances from different parts of the app:');
console.log('-'.repeat(50));

// Simulate different modules accessing settings
console.log('1. Main App Module:');
const mainAppSettings = AppSettings.getInstance();
mainAppSettings.setSetting('theme', 'dark');
mainAppSettings.setSetting('debug', true);

console.log('\n2. User Interface Module:');
const uiSettings = AppSettings.getInstance();
console.log(`UI Theme: ${uiSettings.getSetting('theme')}`);

console.log('\n3. API Module:');
const apiSettings = AppSettings.getInstance();
console.log(`API URL: ${apiSettings.getSetting('apiUrl')}`);
apiSettings.setSetting('timeout', 10000);

console.log('\n4. Logger Module:');
const loggerSettings = AppSettings.getInstance();
console.log(`Debug Mode: ${loggerSettings.getSetting('debug')}`);

console.log('\nVerifying all instances are the same:');
console.log('-'.repeat(35));
console.log(`mainAppSettings === uiSettings: ${mainAppSettings === uiSettings}`);
console.log(`uiSettings === apiSettings: ${uiSettings === apiSettings}`);
console.log(`apiSettings === loggerSettings: ${apiSettings === loggerSettings}`);

console.log('\nFinal settings state:');
console.log('-'.repeat(20));
mainAppSettings.getAllSettings();
mainAppSettings.getInfo();
```

## 🌟 Real-World Example

### Database Connection Manager

```javascript
// Database Connection Singleton
class DatabaseManager {
  constructor() {
    if (DatabaseManager.instance) {
      return DatabaseManager.instance;
    }

    this.connections = new Map();
    this.connectionCount = 0;
    this.maxConnections = 10;
    this.activeQueries = 0;
    this.totalQueries = 0;
    this.created = new Date();

    // Initialize default connection
    this.initializeConnection('default', {
      host: 'localhost',
      port: 5432,
      database: 'myapp',
      username: 'admin',
      password: '****',
    });

    DatabaseManager.instance = this;
    console.log('🗃️ DatabaseManager singleton created');
  }

  static getInstance() {
    if (!DatabaseManager.instance) {
      console.log('🏭 Creating new DatabaseManager instance');
      DatabaseManager.instance = new DatabaseManager();
    } else {
      console.log('♻️ Returning existing DatabaseManager instance');
    }

    return DatabaseManager.instance;
  }

  initializeConnection(name, config) {
    if (this.connections.has(name)) {
      console.log(`⚠️ Connection '${name}' already exists`);
      return false;
    }

    if (this.connectionCount >= this.maxConnections) {
      console.log(`❌ Maximum connections reached (${this.maxConnections})`);
      return false;
    }

    const connection = {
      name,
      config: { ...config, password: '****' }, // Hide password in logs
      connected: false,
      lastUsed: null,
      queryCount: 0,
      id: ++this.connectionCount,
    };

    this.connections.set(name, connection);
    console.log(`✅ Connection '${name}' initialized (ID: ${connection.id})`);
    return true;
  }

  connect(connectionName = 'default') {
    const connection = this.connections.get(connectionName);

    if (!connection) {
      console.log(`❌ Connection '${connectionName}' not found`);
      return false;
    }

    if (connection.connected) {
      console.log(`ℹ️ Connection '${connectionName}' already connected`);
      return true;
    }

    // Simulate connection establishment
    console.log(
      `🔗 Connecting to database: ${connection.config.host}:${connection.config.port}/${connection.config.database}`,
    );
    connection.connected = true;
    connection.lastUsed = new Date();

    console.log(`✅ Connected to '${connectionName}'`);
    return true;
  }

  query(sql, connectionName = 'default') {
    const connection = this.connections.get(connectionName);

    if (!connection) {
      console.log(`❌ Connection '${connectionName}' not found`);
      return null;
    }

    if (!connection.connected) {
      console.log(`🔗 Auto-connecting to '${connectionName}'`);
      if (!this.connect(connectionName)) {
        return null;
      }
    }

    // Simulate query execution
    this.activeQueries++;
    this.totalQueries++;
    connection.queryCount++;
    connection.lastUsed = new Date();

    console.log(`📊 Executing query on '${connectionName}': ${sql}`);
    console.log(`   Active queries: ${this.activeQueries}`);

    // Simulate query completion
    setTimeout(() => {
      this.activeQueries--;
    }, 100);

    return {
      connection: connectionName,
      query: sql,
      result: `Result for: ${sql}`,
      timestamp: new Date(),
    };
  }

  disconnect(connectionName = 'default') {
    const connection = this.connections.get(connectionName);

    if (!connection) {
      console.log(`❌ Connection '${connectionName}' not found`);
      return false;
    }

    if (!connection.connected) {
      console.log(`ℹ️ Connection '${connectionName}' already disconnected`);
      return true;
    }

    connection.connected = false;
    console.log(`🔒 Disconnected from '${connectionName}'`);
    return true;
  }

  getConnectionInfo(connectionName = 'default') {
    const connection = this.connections.get(connectionName);

    if (!connection) {
      console.log(`❌ Connection '${connectionName}' not found`);
      return null;
    }

    console.log(`📋 Connection Info [${connectionName}]:`);
    console.log(`   ID: ${connection.id}`);
    console.log(`   Status: ${connection.connected ? 'Connected' : 'Disconnected'}`);
    console.log(`   Host: ${connection.config.host}:${connection.config.port}`);
    console.log(`   Database: ${connection.config.database}`);
    console.log(`   Queries: ${connection.queryCount}`);
    console.log(
      `   Last Used: ${connection.lastUsed ? connection.lastUsed.toLocaleString() : 'Never'}`,
    );

    return connection;
  }

  getStats() {
    console.log(`📊 DatabaseManager Statistics:`);
    console.log(`   Total Connections: ${this.connections.size}/${this.maxConnections}`);
    console.log(`   Active Queries: ${this.activeQueries}`);
    console.log(`   Total Queries: ${this.totalQueries}`);
    console.log(`   Created: ${this.created.toLocaleString()}`);

    const connectionStats = {};
    this.connections.forEach((conn, name) => {
      connectionStats[name] = {
        connected: conn.connected,
        queries: conn.queryCount,
      };
    });

    console.log(`   Connection Status:`, connectionStats);
    return connectionStats;
  }

  closeAllConnections() {
    console.log('🔒 Closing all database connections');
    let closedCount = 0;

    this.connections.forEach((connection, name) => {
      if (connection.connected) {
        this.disconnect(name);
        closedCount++;
      }
    });

    console.log(`✅ Closed ${closedCount} connections`);
  }
}

// Usage
console.log('\n=== Database Manager Singleton Demo ===\n');

console.log('Different modules accessing database:');
console.log('-'.repeat(35));

// Module 1: User Service
console.log('1. User Service Module:');
const userServiceDB = DatabaseManager.getInstance();
userServiceDB.initializeConnection('users', {
  host: 'user-db.company.com',
  port: 5432,
  database: 'users',
  username: 'user_service',
});

userServiceDB.query('SELECT * FROM users WHERE active = true', 'users');

console.log('\n2. Product Service Module:');
const productServiceDB = DatabaseManager.getInstance();
productServiceDB.query('SELECT * FROM products WHERE in_stock = true');

console.log('\n3. Order Service Module:');
const orderServiceDB = DatabaseManager.getInstance();
orderServiceDB.initializeConnection('orders', {
  host: 'order-db.company.com',
  port: 5433,
  database: 'orders',
  username: 'order_service',
});

orderServiceDB.query("SELECT * FROM orders WHERE status = 'pending'", 'orders');

console.log('\nVerifying singleton behavior:');
console.log('-'.repeat(30));
console.log(`userServiceDB === productServiceDB: ${userServiceDB === productServiceDB}`);
console.log(`productServiceDB === orderServiceDB: ${productServiceDB === orderServiceDB}`);

console.log('\nDatabase statistics:');
console.log('-'.repeat(20));
userServiceDB.getStats();

console.log('\nConnection details:');
console.log('-'.repeat(18));
userServiceDB.getConnectionInfo('default');
console.log();
userServiceDB.getConnectionInfo('users');
console.log();
userServiceDB.getConnectionInfo('orders');

console.log('\nShutdown:');
console.log('-'.repeat(9));
userServiceDB.closeAllConnections();
```

## 🔧 Another Simple Example

### Logger Singleton

```javascript
// Logger Singleton with different log levels
class Logger {
  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }

    this.logs = [];
    this.level = 'info'; // debug, info, warn, error
    this.maxLogs = 1000;
    this.created = new Date();
    this.logCount = 0;

    Logger.instance = this;
    console.log('📝 Logger singleton created');
  }

  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLevel(level) {
    const levels = ['debug', 'info', 'warn', 'error'];
    if (!levels.includes(level)) {
      this.error(`Invalid log level: ${level}`);
      return;
    }

    const oldLevel = this.level;
    this.level = level;
    this.info(`Log level changed from ${oldLevel} to ${level}`);
  }

  shouldLog(level) {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[level] >= levels[this.level];
  }

  log(level, message, category = 'GENERAL') {
    if (!this.shouldLog(level)) {
      return;
    }

    const logEntry = {
      id: ++this.logCount,
      timestamp: new Date(),
      level: level.toUpperCase(),
      category,
      message,
    };

    this.logs.push(logEntry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Output to console with formatting
    const emoji = { debug: '🐛', info: 'ℹ️', warn: '⚠️', error: '❌' };
    const timestamp = logEntry.timestamp.toLocaleTimeString();
    console.log(`${emoji[level]} [${timestamp}] ${category}: ${message}`);
  }

  debug(message, category) {
    this.log('debug', message, category);
  }

  info(message, category) {
    this.log('info', message, category);
  }

  warn(message, category) {
    this.log('warn', message, category);
  }

  error(message, category) {
    this.log('error', message, category);
  }

  getStats() {
    const stats = { debug: 0, info: 0, warn: 0, error: 0 };
    this.logs.forEach((log) => {
      stats[log.level.toLowerCase()]++;
    });

    console.log('📊 Logger Statistics:');
    console.log(`   Total Logs: ${this.logCount}`);
    console.log(`   Current Level: ${this.level}`);
    console.log(`   Debug: ${stats.debug}`);
    console.log(`   Info: ${stats.info}`);
    console.log(`   Warn: ${stats.warn}`);
    console.log(`   Error: ${stats.error}`);
    console.log(`   Created: ${this.created.toLocaleString()}`);

    return stats;
  }

  getRecentLogs(count = 10) {
    const recent = this.logs.slice(-count);
    console.log(`📋 Recent ${count} logs:`);
    recent.forEach((log) => {
      console.log(`   ${log.id}: [${log.level}] ${log.category} - ${log.message}`);
    });
    return recent;
  }

  clearLogs() {
    const count = this.logs.length;
    this.logs = [];
    console.log(`🗑️ Cleared ${count} logs`);
  }
}

// Usage
console.log('\n=== Logger Singleton Demo ===\n');

console.log('Different modules using logger:');
console.log('-'.repeat(30));

// Module 1
console.log('1. Authentication Module:');
const authLogger = Logger.getInstance();
authLogger.info('User login attempt', 'AUTH');
authLogger.warn('Invalid password attempt', 'AUTH');
authLogger.info('User successfully logged in', 'AUTH');

console.log('\n2. Database Module:');
const dbLogger = Logger.getInstance();
dbLogger.debug('Connection pool initialized', 'DATABASE');
dbLogger.info('Query executed successfully', 'DATABASE');
dbLogger.error('Connection timeout', 'DATABASE');

console.log('\n3. API Module:');
const apiLogger = Logger.getInstance();
apiLogger.info('API server started on port 3000', 'API');
apiLogger.warn('Rate limit approaching for user 123', 'API');

console.log('\nVerifying singleton:');
console.log('-'.repeat(18));
console.log(`authLogger === dbLogger: ${authLogger === dbLogger}`);
console.log(`dbLogger === apiLogger: ${dbLogger === apiLogger}`);

console.log('\nChanging log level:');
console.log('-'.repeat(18));
authLogger.setLevel('warn');

console.log('\nTesting with new level (debug should be filtered):');
authLogger.debug("This debug message won't show", 'TEST');
authLogger.warn('This warning will show', 'TEST');

console.log('\nLogger statistics:');
console.log('-'.repeat(18));
authLogger.getStats();

console.log();
authLogger.getRecentLogs(5);
```

## ✅ Pros

- **Controlled Access**: Guarantees only one instance exists
- **Global Access**: Provides a global point of access
- **Lazy Initialization**: Instance created only when needed
- **Memory Efficient**: Saves memory by avoiding multiple instances
- **Consistency**: Ensures consistent state across the application

## ❌ Cons

- **Global State**: Can make testing and debugging difficult
- **Hidden Dependencies**: Makes dependencies less explicit
- **Concurrency Issues**: Can cause problems in multi-threaded environments
- **Tight Coupling**: Can create tight coupling between components
- **Difficult to Mock**: Hard to replace with mock objects for testing

## 🎯 When to Use

- **Resource Management**: Database connections, file handles, thread pools
- **Configuration**: Application settings that should be consistent
- **Logging**: Central logging mechanism
- **Caching**: Shared cache across the application
- **Hardware Access**: Printer spoolers, device drivers
- **Coordinated Access**: When you need to coordinate actions across the system

## 🔄 Implementation Variations

### 1. **Eager Initialization**

```javascript
class EagerSingleton {
  static instance = new EagerSingleton();

  constructor() {
    if (EagerSingleton.instance) {
      return EagerSingleton.instance;
    }
  }

  static getInstance() {
    return EagerSingleton.instance;
  }
}
```

### 2. **Lazy Initialization** (shown in examples above)

```javascript
static getInstance() {
  if (!MySingleton.instance) {
    MySingleton.instance = new MySingleton();
  }
  return MySingleton.instance;
}
```

### 3. **Thread-Safe (for Node.js with worker threads)**

```javascript
const singletonInstances = new Map();

class ThreadSafeSingleton {
  constructor() {
    const className = this.constructor.name;
    if (singletonInstances.has(className)) {
      return singletonInstances.get(className);
    }
    singletonInstances.set(className, this);
  }
}
```

## ⚠️ Anti-Patterns to Avoid

- **Using Singleton for everything**: Not every class needs to be a singleton
- **Making everything global**: Reduces testability and maintainability
- **Ignoring dependency injection**: Singleton can hide dependencies
- **Not considering alternatives**: Sometimes simple module patterns work better

## 🔗 Related Patterns

- **Factory Method**: Can use Singleton to ensure only one factory exists
- **Abstract Factory**: Factory instances are often singletons
- **Builder**: Director object might be a singleton
- **Prototype**: Prototype registry can be implemented as singleton
- **Facade**: Facade objects are often implemented as singletons

## 📚 Further Reading

- [Singleton Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/singleton)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [Singleton Pattern Criticisms](https://stackoverflow.com/questions/137975/what-is-so-bad-about-singletons)
