# Adapter Pattern 🔌

> **Definition**: The Adapter pattern allows incompatible interfaces to work together. It acts as a bridge between two incompatible interfaces by wrapping an existing class with a new interface.

## 🎯 Intent

Convert the interface of a class into another interface clients expect. Adapter lets classes work together that couldn't otherwise because of incompatible interfaces.

## 🤔 Problem

You have an existing class with a useful method, but its interface doesn't match what your new code expects. You can't modify the existing class, and you don't want to change your new code to accommodate the old interface.

For example, you have a `Rectangle` class with `getWidth()` and `getHeight()` methods, but your new code expects an interface with `width()` and `height()` methods.

## 💡 Solution

Create an adapter class that wraps the existing class and provides the interface your code expects. The adapter translates calls from the new interface to the old interface.

## 🏗️ Structure

```
Client
└── uses → Target (interface)
              └── request()

Target ← implements ← Adapter
                    ├── adaptee: Adaptee
                    └── request() → adaptee.specificRequest()

Adaptee
└── specificRequest()
```

## 💻 Simple Example

### Basic Media Player Adapter

```javascript
// Old audio player (Adaptee)
class OldAudioPlayer {
  playMp3(filename) {
    console.log(`🎵 Playing MP3 file: ${filename}`);
  }
}

// New media formats that we want to support
class Mp4Player {
  playMp4(filename) {
    console.log(`🎬 Playing MP4 file: ${filename}`);
  }
}

class FlacPlayer {
  playFlac(filename) {
    console.log(`🎼 Playing FLAC file: ${filename}`);
  }
}

// Target interface that client expects
class MediaPlayer {
  play(audioType, filename) {
    throw new Error('play() method must be implemented');
  }
}

// Adapter that makes old and new players work together
class MediaAdapter extends MediaPlayer {
  constructor(audioType) {
    super();
    if (audioType === 'mp4') {
      this.player = new Mp4Player();
    } else if (audioType === 'flac') {
      this.player = new FlacPlayer();
    }
  }

  play(audioType, filename) {
    if (audioType === 'mp4') {
      this.player.playMp4(filename);
    } else if (audioType === 'flac') {
      this.player.playFlac(filename);
    }
  }
}

// Client code - Audio player that supports multiple formats
class AudioPlayer extends MediaPlayer {
  constructor() {
    super();
    this.oldPlayer = new OldAudioPlayer();
  }

  play(audioType, filename) {
    if (audioType === 'mp3') {
      // Use the old player directly for MP3
      this.oldPlayer.playMp3(filename);
    } else if (audioType === 'mp4' || audioType === 'flac') {
      // Use adapter for new formats
      const adapter = new MediaAdapter(audioType);
      adapter.play(audioType, filename);
    } else {
      console.log(`❌ ${audioType} format not supported`);
    }
  }
}

// Usage
console.log('=== Media Player Adapter Demo ===\n');

const player = new AudioPlayer();

player.play('mp3', 'song1.mp3');
player.play('mp4', 'video1.mp4');
player.play('flac', 'music.flac');
player.play('avi', 'movie.avi'); // Unsupported format
```

## 🌟 Real-World Example

### Database Adapter

```javascript
// Different database systems with incompatible interfaces

// MySQL Database (Adaptee 1)
class MySQLDatabase {
  mysqlConnect(host, username, password) {
    console.log(`🐬 Connecting to MySQL at ${host}`);
    return { connected: true, type: 'mysql' };
  }

  mysqlQuery(sql) {
    console.log(`🐬 MySQL Query: ${sql}`);
    return { rows: [{ id: 1, name: 'John' }] };
  }

  mysqlClose() {
    console.log('🐬 MySQL connection closed');
  }
}

// PostgreSQL Database (Adaptee 2)
class PostgreSQLDatabase {
  pgConnect(connectionString) {
    console.log(`🐘 Connecting to PostgreSQL: ${connectionString}`);
    return { status: 'connected', db: 'postgresql' };
  }

  pgExecute(query) {
    console.log(`🐘 PostgreSQL Execute: ${query}`);
    return { data: [{ id: 1, name: 'Jane' }] };
  }

  pgDisconnect() {
    console.log('🐘 PostgreSQL disconnected');
  }
}

// Target interface that client expects
class DatabaseInterface {
  connect(config) {
    throw new Error('connect() method must be implemented');
  }

  query(sql) {
    throw new Error('query() method must be implemented');
  }

  close() {
    throw new Error('close() method must be implemented');
  }
}

// MySQL Adapter
class MySQLAdapter extends DatabaseInterface {
  constructor() {
    super();
    this.database = new MySQLDatabase();
    this.connection = null;
  }

  connect(config) {
    this.connection = this.database.mysqlConnect(config.host, config.username, config.password);
    return this.connection;
  }

  query(sql) {
    if (!this.connection) {
      throw new Error('Not connected to MySQL');
    }
    return this.database.mysqlQuery(sql);
  }

  close() {
    if (this.connection) {
      this.database.mysqlClose();
      this.connection = null;
    }
  }
}

// PostgreSQL Adapter
class PostgreSQLAdapter extends DatabaseInterface {
  constructor() {
    super();
    this.database = new PostgreSQLDatabase();
    this.connection = null;
  }

  connect(config) {
    const connectionString = `postgresql://${config.username}:${config.password}@${config.host}/${config.database}`;
    this.connection = this.database.pgConnect(connectionString);
    return this.connection;
  }

  query(sql) {
    if (!this.connection) {
      throw new Error('Not connected to PostgreSQL');
    }
    return this.database.pgExecute(sql);
  }

  close() {
    if (this.connection) {
      this.database.pgDisconnect();
      this.connection = null;
    }
  }
}

// Client code - Application that works with any database
class Application {
  constructor(databaseAdapter) {
    this.db = databaseAdapter;
  }

  run() {
    // Same interface for all database types
    const config = {
      host: 'localhost',
      username: 'admin',
      password: 'password',
      database: 'myapp',
    };

    console.log('🚀 Starting application...');
    this.db.connect(config);

    const results = this.db.query('SELECT * FROM users');
    console.log('📊 Query results:', results);

    this.db.close();
    console.log('🏁 Application finished\n');
  }
}

// Usage
console.log('=== Database Adapter Demo ===\n');

// Use MySQL
console.log('Using MySQL Database:');
console.log('-'.repeat(20));
const mysqlApp = new Application(new MySQLAdapter());
mysqlApp.run();

// Use PostgreSQL
console.log('Using PostgreSQL Database:');
console.log('-'.repeat(25));
const pgApp = new Application(new PostgreSQLAdapter());
pgApp.run();
```

## 🔧 Another Simple Example

### Payment Gateway Adapter

```javascript
// Old payment system (Adaptee)
class OldPaymentGateway {
  makePayment(amount) {
    console.log(`💰 Processing $${amount} through old gateway`);
    return { status: 'success', reference: `OLD_${Date.now()}` };
  }
}

// New payment interface that client expects
class PaymentInterface {
  processPayment(amount, currency) {
    throw new Error('processPayment() method must be implemented');
  }
}

// Adapter to make old gateway work with new interface
class PaymentAdapter extends PaymentInterface {
  constructor() {
    super();
    this.oldGateway = new OldPaymentGateway();
  }

  processPayment(amount, currency = 'USD') {
    console.log(`🔄 Adapting payment: ${amount} ${currency}`);

    // Convert to format expected by old gateway
    const dollarAmount = currency === 'USD' ? amount : amount * 1.1; // Simple conversion

    // Use the old gateway
    const result = this.oldGateway.makePayment(dollarAmount);

    // Convert response to new format
    return {
      success: result.status === 'success',
      transactionId: result.reference,
      amount: amount,
      currency: currency,
    };
  }
}

// Client code
class ShoppingCart {
  constructor(paymentProcessor) {
    this.paymentProcessor = paymentProcessor;
    this.items = [];
  }

  addItem(item, price) {
    this.items.push({ item, price });
  }

  checkout() {
    const total = this.items.reduce((sum, item) => sum + item.price, 0);

    console.log('🛒 Checkout Summary:');
    this.items.forEach((item) => console.log(`   ${item.item}: $${item.price}`));
    console.log(`   Total: $${total}`);

    const result = this.paymentProcessor.processPayment(total, 'USD');

    if (result.success) {
      console.log(`✅ Payment successful! Transaction ID: ${result.transactionId}`);
    } else {
      console.log('❌ Payment failed!');
    }
  }
}

// Usage
console.log('=== Payment Gateway Adapter Demo ===\n');

const cart = new ShoppingCart(new PaymentAdapter());
cart.addItem('Laptop', 999.99);
cart.addItem('Mouse', 29.99);
cart.checkout();
```

## ✅ Pros

- **Reusability**: Allows you to reuse existing classes with incompatible interfaces
- **Separation of Concerns**: Separates interface conversion from business logic
- **Open/Closed Principle**: You can add new adapters without changing existing code
- **Single Responsibility**: Each adapter handles one specific interface conversion

## ❌ Cons

- **Code Complexity**: Increases the overall complexity of the code
- **Performance**: Adds a layer of indirection which may impact performance
- **Maintenance**: More classes to maintain

## 🎯 When to Use

- **Legacy Integration**: When you need to integrate with legacy systems
- **Third-party Libraries**: When working with third-party libraries with different interfaces
- **Interface Mismatch**: When you can't modify existing classes but need different interfaces
- **Gradual Migration**: When migrating from old systems to new ones

## 🔄 Types of Adapters

### 1. **Object Adapter** (shown in examples above)

- Uses composition
- More flexible
- Can adapt multiple related classes

### 2. **Class Adapter** (using mixins in JavaScript)

```javascript
class ClassAdapter extends OldClass {
  newMethod() {
    return this.oldMethod();
  }
}
```

## 🔗 Related Patterns

- **Bridge**: Both provide abstraction, but Bridge is designed upfront while Adapter is added later
- **Decorator**: Both wrap objects, but Decorator adds behavior while Adapter changes interface
- **Facade**: Both provide simplified interfaces, but Facade simplifies while Adapter converts
- **Proxy**: Both provide surrogate objects, but Proxy controls access while Adapter converts interface

## 📚 Further Reading

- [Adapter Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/adapter)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [JavaScript Adapter Pattern Examples](https://www.dofactory.com/javascript/design-patterns/adapter)
