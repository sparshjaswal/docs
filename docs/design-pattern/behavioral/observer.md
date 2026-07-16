# Observer Pattern 🔔

> **Definition**: The Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.

## 🎯 Intent

Create a subscription mechanism to notify multiple objects about any events that happen to the object they're observing.

## 🤔 Problem

Imagine you're building an e-commerce application. Customers are interested in a particular product that's currently out of stock. You could have customers check the availability every day, but this would be wasteful. Alternatively, you could send emails to all customers whenever any product becomes available, but this would spam customers who aren't interested in that specific product.

## 💡 Solution

The Observer pattern suggests that you add a subscription mechanism to the publisher class so individual objects can subscribe to event notifications. This mechanism consists of:

1. **Subject (Publisher)**: Maintains a list of observers and provides methods to add/remove observers
2. **Observer (Subscriber)**: Defines an interface for objects that should be notified of changes
3. **Concrete Subject**: Stores state of interest and notifies observers when state changes
4. **Concrete Observer**: Implements the Observer interface to keep state consistent with the subject

## 🏗️ Structure

```
Subject (Publisher)
├── observers: Observer[]
├── subscribe(observer)
├── unsubscribe(observer)
└── notify()

Observer (Subscriber)
└── update(data)

ConcreteSubject extends Subject
├── state
├── setState(state)
└── getState()

ConcreteObserver implements Observer
├── update(data)
└── doSomething()
```

## 💻 Code Example

### Basic Implementation

```javascript
// Observer interface
class Observer {
  update(data) {
    throw new Error("update() method must be implemented");
  }
}

// Subject (Publisher)
class Subject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }
}

// Concrete Subject
class NewsAgency extends Subject {
  constructor() {
    super();
    this.news = "";
  }

  setNews(news) {
    this.news = news;
    this.notify(news);
  }

  getNews() {
    return this.news;
  }
}

// Concrete Observers
class NewsChannel extends Observer {
  constructor(name) {
    super();
    this.name = name;
    this.news = "";
  }

  update(news) {
    this.news = news;
    console.log(`${this.name} broadcasting: ${news}`);
  }
}

class OnlinePortal extends Observer {
  constructor(name) {
    super();
    this.name = name;
    this.news = "";
  }

  update(news) {
    this.news = news;
    console.log(`${this.name} published online: ${news}`);
  }
}

// Usage
const agency = new NewsAgency();
const cnn = new NewsChannel("CNN");
const bbc = new NewsChannel("BBC");
const portal = new OnlinePortal("News Portal");

agency.subscribe(cnn);
agency.subscribe(bbc);
agency.subscribe(portal);

agency.setNews("Breaking: New JavaScript framework released!");
// Output:
// CNN broadcasting: Breaking: New JavaScript framework released!
// BBC broadcasting: Breaking: New JavaScript framework released!
// News Portal published online: Breaking: New JavaScript framework released!
```

## 🌟 Real-World Examples

### 1. Stock Price Monitor

```javascript
class Stock extends Subject {
  constructor(symbol, price) {
    super();
    this.symbol = symbol;
    this.price = price;
  }

  setPrice(price) {
    this.price = price;
    this.notify({
      symbol: this.symbol,
      price: price,
      timestamp: new Date()
    });
  }
}

class StockDisplay extends Observer {
  constructor(name) {
    super();
    this.name = name;
  }

  update(stockData) {
    console.log(`${this.name}: ${stockData.symbol} is now $${stockData.price}`);
  }
}

class StockAlert extends Observer {
  constructor(threshold) {
    super();
    this.threshold = threshold;
  }

  update(stockData) {
    if (stockData.price > this.threshold) {
      console.log(`🚨 ALERT: ${stockData.symbol} exceeded $${this.threshold}!`);
    }
  }
}

// Usage
const appleStock = new Stock("AAPL", 150);
const dashboard = new StockDisplay("Dashboard");
const mobileApp = new StockDisplay("Mobile App");
const priceAlert = new StockAlert(180);

appleStock.subscribe(dashboard);
appleStock.subscribe(mobileApp);
appleStock.subscribe(priceAlert);

appleStock.setPrice(185);
```

### 2. Model-View Architecture

```javascript
class UserModel extends Subject {
  constructor() {
    super();
    this.users = [];
  }

  addUser(user) {
    this.users.push(user);
    this.notify({ action: 'add', user, users: this.users });
  }

  removeUser(userId) {
    const user = this.users.find(u => u.id === userId);
    this.users = this.users.filter(u => u.id !== userId);
    this.notify({ action: 'remove', user, users: this.users });
  }
}

class UserListView extends Observer {
  update(data) {
    console.log(`📋 User List updated: ${data.users.length} users`);
    if (data.action === 'add') {
      console.log(`➕ Added: ${data.user.name}`);
    } else if (data.action === 'remove') {
      console.log(`➖ Removed: ${data.user.name}`);
    }
  }
}

class UserStatsView extends Observer {
  update(data) {
    const totalUsers = data.users.length;
    const activeUsers = data.users.filter(u => u.active).length;
    console.log(`📊 Stats: ${totalUsers} total, ${activeUsers} active`);
  }
}
```

### 3. Event System with Custom Events

```javascript
class EventEmitter extends Subject {
  constructor() {
    super();
    this.events = new Map();
  }

  on(event, observer) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(observer);
  }

  off(event, observer) {
    if (this.events.has(event)) {
      const observers = this.events.get(event);
      this.events.set(event, observers.filter(obs => obs !== observer));
    }
  }

  emit(event, data) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(observer => observer.update(data));
    }
  }
}

class Logger extends Observer {
  update(data) {
    console.log(`📝 Log: ${JSON.stringify(data)}`);
  }
}

class EmailService extends Observer {
  update(data) {
    if (data.type === 'user_registered') {
      console.log(`📧 Welcome email sent to ${data.email}`);
    }
  }
}

// Usage
const eventBus = new EventEmitter();
const logger = new Logger();
const emailService = new EmailService();

eventBus.on('user_registered', logger);
eventBus.on('user_registered', emailService);

eventBus.emit('user_registered', {
  type: 'user_registered',
  userId: 123,
  email: 'john@example.com'
});
```

## ✅ Pros

- **Open/Closed Principle**: You can introduce new subscriber classes without changing publisher code
- **Loose Coupling**: The publisher doesn't need to know concrete classes of subscribers
- **Dynamic Relationships**: You can establish relations between objects at runtime
- **Broadcast Communication**: One-to-many communication is easy to implement

## ❌ Cons

- **Random Order**: Subscribers are notified in random order
- **Memory Leaks**: Observers might not get garbage collected if not properly unsubscribed
- **Performance**: If there are many observers, notifications can be slow
- **Complex Dependencies**: Can create complex webs of dependencies that are hard to understand

## 🎯 When to Use

- **Model-View architectures**: When changes to one object require updating multiple UI components
- **Event handling systems**: When you need to handle events in multiple places
- **Publish-Subscribe systems**: When you need loose coupling between components
- **Real-time data updates**: Stock prices, chat messages, live feeds
- **Caching**: When cached data needs to be invalidated across multiple caches

## 🎭 Variations

### 1. **Push vs Pull Model**

```javascript
// Push Model - Subject sends data
class PushSubject extends Subject {
  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }
}

// Pull Model - Observer requests data
class PullSubject extends Subject {
  notify() {
    this.observers.forEach(observer => observer.update(this));
  }
}

class PullObserver extends Observer {
  update(subject) {
    const data = subject.getData(); // Observer pulls data
    this.handleData(data);
  }
}
```

### 2. **Async Observer**

```javascript
class AsyncSubject extends Subject {
  async notify(data) {
    const promises = this.observers.map(observer => observer.update(data));
    await Promise.all(promises);
  }
}

class AsyncObserver extends Observer {
  async update(data) {
    // Perform async operations
    await this.processDataAsync(data);
  }
}
```

## 🔗 Related Patterns

- **Mediator**: Both patterns promote loose coupling, but Observer distributes communication by introducing observer objects
- **Command**: Can use Observer to notify about command execution
- **MVC/MVP**: Observer is fundamental to these architectural patterns

## 📚 Further Reading

- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [Observer Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/observer)
- [JavaScript Event System](https://developer.mozilla.org/en-US/docs/Web/Events)
