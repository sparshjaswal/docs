# Observer Pattern 🔔

> **Definition**: The Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.

## 🎯 Intent

Create a subscription mechanism to notify multiple objects about any events that happen to the object they're observing.

## 🤔 Problem

Imagine you're building an e-commerce application. Customers are interested in a particular product that's currently out of stock. You could have customers check the availability every day, but this would be wasteful. Alternatively, you could send emails to all customers whenever any product becomes available, but this would spam customers who aren't interested in that specific product.

## 💡 Solution

The Observer pattern adds a subscription mechanism to the publisher class so individual objects can subscribe to or unsubscribe from event notifications. This mechanism consists of:

1. **Subject (Publisher)**: Maintains a list of observers and provides methods to subscribe/unsubscribe
2. **Observer (Subscriber)**: Defines an interface for objects that should be notified of changes
3. **Concrete Subject**: Stores state of interest and notifies observers when state changes
4. **Concrete Observer**: Implements the Observer interface to keep state consistent with the subject

## 🏗️ Structure

```
┌─────────────────────────────┐
│         Subject              │
├─────────────────────────────┤
│ - observers: Observer[]      │
├─────────────────────────────┤
│ + subscribe(observer): void  │
│ + unsubscribe(observer): void│
│ + notify(data): void         │
└──────────┬──────────────────┘
           │ notifies
           ▼
┌─────────────────────────────┐
│     «interface» Observer     │
├─────────────────────────────┤
│ + update(data): void         │
└──────────┬──────────────────┘
           │ implements
           ▼
┌─────────────────────────────┐
│    ConcreteObserver          │
├─────────────────────────────┤
│ - state                      │
├─────────────────────────────┤
│ + update(data): void         │
└─────────────────────────────┘
```

## 💻 Code Example

### Basic Implementation

```typescript
// Observer interface
interface Observer {
  update(data: unknown): void;
}

// Subject (Publisher)
class Subject {
  private observers: Observer[] = [];

  subscribe(observer: Observer): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  protected notify(data: unknown): void {
    this.observers.forEach((observer) => observer.update(data));
  }
}

// Concrete Subject
class NewsAgency extends Subject {
  private news: string = '';

  setNews(news: string): void {
    this.news = news;
    this.notify(news);
  }

  getNews(): string {
    return this.news;
  }
}

// Concrete Observers
class NewsChannel implements Observer {
  constructor(private name: string) {}

  update(news: unknown): void {
    console.log(`${this.name} broadcasting: ${news}`);
  }
}

class OnlinePortal implements Observer {
  constructor(private name: string) {}

  update(news: unknown): void {
    console.log(`${this.name} published online: ${news}`);
  }
}

// Usage
const agency = new NewsAgency();
const cnn = new NewsChannel('CNN');
const bbc = new NewsChannel('BBC');
const portal = new OnlinePortal('News Portal');

agency.subscribe(cnn);
agency.subscribe(bbc);
agency.subscribe(portal);

agency.setNews('Breaking: New JavaScript framework released!');
// Output:
// CNN broadcasting: Breaking: New JavaScript framework released!
// BBC broadcasting: Breaking: New JavaScript framework released!
// News Portal published online: Breaking: New JavaScript framework released!
```

## 🌟 Real-World Examples

### 1. Stock Price Monitor

```typescript
interface StockData {
  symbol: string;
  price: number;
  timestamp: Date;
}

class Stock extends Subject {
  constructor(public symbol: string, private price: number) {
    super();
  }

  setPrice(price: number): void {
    this.price = price;
    this.notify({ symbol: this.symbol, price, timestamp: new Date() });
  }
}

class StockDisplay implements Observer {
  constructor(private name: string) {}

  update(data: unknown): void {
    const { symbol, price } = data as StockData;
    console.log(`${this.name}: ${symbol} is now $${price}`);
  }
}

class StockAlert implements Observer {
  constructor(private threshold: number) {}

  update(data: unknown): void {
    const stockData = data as StockData;
    if (stockData.price > this.threshold) {
      console.log(`🚨 ALERT: ${stockData.symbol} exceeded $${this.threshold}!`);
    }
  }
}

const appleStock = new Stock('AAPL', 150);
const dashboard = new StockDisplay('Dashboard');
const priceAlert = new StockAlert(180);

appleStock.subscribe(dashboard);
appleStock.subscribe(priceAlert);
appleStock.setPrice(185);
```

### 2. React Hook Pattern

```typescript
import { useState, useEffect, useCallback } from 'react';

// Generic observable store
class Store<T> {
  private listeners: Set<(data: T) => void> = new Set();

  constructor(private state: T) {}

  getState(): T {
    return this.state;
  }

  setState(next: T): void {
    this.state = next;
    this.listeners.forEach((fn) => fn(this.state));
  }

  subscribe(listener: (data: T) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

// Custom hook
function useStore<T>(store: Store<T>): T {
  const [state, setState] = useState<T>(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(setState);
    return unsubscribe; // cleanup on unmount
  }, [store]);

  return state;
}

// Usage in React component
const userStore = new Store({ name: 'Alice', online: false });

function UserStatus() {
  const user = useStore(userStore);
  return <div>{user.name} is {user.online ? '🟢 online' : '🔴 offline'}</div>;
}
```

### 3. Custom EventEmitter (Browser-Style)

```typescript
type EventHandler = (...args: any[]) => void;

class EventEmitter {
  private events = new Map<string, Set<EventHandler>>();

  on(event: string, handler: EventHandler): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(handler);
  }

  off(event: string, handler: EventHandler): void {
    this.events.get(event)?.delete(handler);
  }

  emit(event: string, ...args: unknown[]): void {
    this.events.get(event)?.forEach((handler) => handler(...args));
  }

  once(event: string, handler: EventHandler): void {
    const wrapper = (...args: unknown[]) => {
      handler(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }
}

// Usage
const bus = new EventEmitter();

bus.on('user:login', (userId: string) => {
  console.log(`User ${userId} logged in`);
});

bus.once('app:ready', () => {
  console.log('One-time init');
});

bus.emit('user:login', '42');
bus.emit('app:ready');
bus.emit('app:ready'); // no output - handler removed after first call
```

## ⚠️ Common Pitfalls

### 1. Memory Leaks from Forgotten Unsubscriptions

Observers hold references to the subject. If not unsubscribed, they prevent garbage collection.

```typescript
// ❌ BAD: component unmounts but observer stays subscribed
class BadComponent {
  constructor(store: Subject) {
    store.subscribe(this); // never unsubscribes
  }
}

// ✅ GOOD: explicit cleanup or WeakRef-based subscription
class GoodComponent {
  private unsubscribe: () => void;

  constructor(store: Subject) {
    this.unsubscribe = store.subscribe(this);
  }

  destroy(): void {
    this.unsubscribe(); // clean up
  }
}
```

### 2. Observer Modifying Collection During Iteration

If an observer calls `unsubscribe()` inside `update()`, it mutates the array being iterated:

```typescript
// ✅ FIX: iterate over a snapshot
protected notify(data: unknown): void {
  const snapshot = [...this.observers];
  snapshot.forEach((observer) => observer.update(data));
}
```

### 3. Circular Update Chains

Observer A reacts to a change by triggering a change that Observer B reacts to, which triggers Observer A again — infinite loop.

```typescript
// ✅ FIX with a re-entrancy guard
private notifying = false;

protected notify(data: unknown): void {
  if (this.notifying) return; // prevent re-entrant calls
  this.notifying = true;
  try {
    this.observers.forEach((obs) => obs.update(data));
  } finally {
    this.notifying = false;
  }
}
```

## ⚡ Performance Considerations

- **Debounce rapid updates**: When state changes burst (e.g., typing), notify on a schedule
- **Selective notification**: Only notify observers interested in the specific change
- **Microtask batching**: Use `queueMicrotask` or `Promise.resolve()` to batch synchronous updates
- **Lazy/Observable pattern**: Compute derived values only when an observer requests them

```typescript
class DebouncedSubject extends Subject {
  private timer: ReturnType<typeof setTimeout> | null = null;

  protected notify(data: unknown): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      super.notify(data);
      this.timer = null;
    }, 16); // ~60fps
  }
}
```

## 🆚 Observer vs Pub/Sub

These terms are often confused. They're related but distinct:

| Aspect                    | Observer Pattern                        | Publish/Subscribe                        |
| ------------------------- | --------------------------------------- | ---------------------------------------- |
| **Coupling**              | Subject knows about its observers       | Publishers don't know subscribers        |
| **Channel**               | Direct method call                      | Through an event bus/broker              |
| **Filtering**             | Observers receive all notifications     | Subscribers pick specific topics/events  |
| **Location**              | Same process/address space              | Can be cross-process (message queues)    |
| **Typical use**           | UI updates, model-view binding          | Microservices, event-driven architecture |

## 🔄 Built-in JavaScript Observers

JavaScript ships with observer-like APIs that follow the same pattern:

| API                      | Observes                              | Use Case                          |
| ------------------------ | ------------------------------------- | --------------------------------- |
| `EventTarget`            | DOM events (click, keydown, etc.)     | UI interactivity                  |
| `MutationObserver`       | DOM tree mutations                    | Lazy-loading, attribute watching  |
| `IntersectionObserver`   | Element visibility in viewport        | Infinite scroll, lazy images      |
| `ResizeObserver`         | Element size changes                  | Responsive layouts                |
| `PerformanceObserver`    | Performance timeline entries          | Real metrics monitoring           |

```typescript
// IntersectionObserver - lazy-load images
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target as HTMLImageElement;
      img.src = img.dataset.src!;
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach((img) => observer.observe(img));
```

## ✅ Pros

- **Open/Closed Principle**: Introduce new subscriber classes without changing publisher code
- **Loose Coupling**: The publisher doesn't need to know concrete classes of subscribers
- **Dynamic Relationships**: Establish relations between objects at runtime
- **Broadcast Communication**: One-to-many communication is easy to implement

## ❌ Cons

- **Random Order**: Subscribers are notified in unspecified order (use priority queues if ordering matters)
- **Memory Leaks**: Observers linger if not properly unsubscribed
- **Performance Overhead**: Large observer lists slow down notifications
- **Debugging Complexity**: Cascading updates are hard to trace

## 🎯 When to Use

- **Model-View architectures**: Changes to one object update multiple UI components
- **Event handling systems**: Handle events in multiple places
- **Real-time data updates**: Stock tickers, chat messages, live feeds
- **State management**: Notify components when shared state changes (Redux, Zustand)
- **Caching**: Invalidate cached data across multiple cache layers

## 🎭 Variations

### 1. Push vs Pull Model

```typescript
// PUSH: Subject sends full data payload
class PushSubject extends Subject {
  protected notify(data: unknown): void {
    this.observers.forEach((obs) => obs.update(data));
  }
}

// PULL: Observer requests the data it needs
class PullSubject extends Subject {
  protected notify(): void {
    this.observers.forEach((obs) => obs.update(this));
  }
}

class PullObserver implements Observer {
  update(subject: unknown): void {
    const data = (subject as PullSubject).getData(); // pull only what's needed
    this.handleData(data);
  }
}
```

### 2. WeakMap-based Subscription (Auto Cleanup)

```typescript
class WeakRefSubject {
  private observers = new Set<WeakRef<Observer>>();

  subscribe(observer: Observer): void {
    this.observers.add(new WeakRef(observer));
  }

  protected notify(data: unknown): void {
    this.observers.forEach((ref) => {
      const observer = ref.deref();
      if (observer) observer.update(data);
      else this.observers.delete(ref); // auto-remove garbage-collected observers
    });
  }
}
```

### 3. Async Observer

```typescript
interface AsyncObserver {
  update(data: unknown): Promise<void>;
}

class AsyncSubject {
  private observers: AsyncObserver[] = [];

  async notify(data: unknown): Promise<void> {
    await Promise.all(this.observers.map((obs) => obs.update(data)));
  }
}
```

## 🔗 Related Patterns

- **Mediator**: Both promote loose coupling, but Mediator centralizes communication while Observer distributes it
- **Command**: Use Observer to notify listeners when commands execute
- **MVC/MVP/MVVM**: Observer is fundamental to these architectural patterns for view-model binding
- **State Management (Redux/Zustand)**: Modern libraries implement Observer under the hood for reactive UI updates

## 📚 Further Reading

- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [Observer Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/observer)
- [JavaScript Event System](https://developer.mozilla.org/en-US/docs/Web/Events)
- [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
