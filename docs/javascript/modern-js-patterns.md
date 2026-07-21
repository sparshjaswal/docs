---
id: javascript-modern-js-patterns
title: 🔥 Modern JavaScript Patterns & Advanced Techniques
slug: /javascript/modern-js-patterns
sidebar_label: 🔥 Modern JavaScript Pattern...
---

# 🔥 Modern JavaScript Patterns & Advanced Techniques

> **Advanced patterns for professional JavaScript development in 2025**

## Table of Contents

- [Advanced ES6+ Features](#advanced-es6-features)
- [Design Patterns in JavaScript](#design-patterns-in-javascript)
- [Performance Optimization Patterns](#performance-optimization-patterns)
- [Reactive Programming](#reactive-programming)
- [Advanced Type Safety](#advanced-type-safety)
- [Micro-optimizations](#micro-optimizations)

---

## Advanced ES6+ Features

### Optional Chaining & Nullish Coalescing

```javascript
// ✅ Safe property access
const user = {
  profile: {
    address: {
      street: '123 Main St',
    },
  },
};

// Optional chaining (?.)
const street = user?.profile?.address?.street; // '123 Main St'
const phone = user?.profile?.contact?.phone; // undefined (no error)

// Nullish coalescing (??)
const displayName = user?.name ?? 'Anonymous';
const port = process.env.PORT ?? 3000;

// ✅ Advanced usage
const config = {
  api: {
    timeout: null,
    retries: 0,
  },
};

// Only use default if null or undefined (not for falsy values)
const timeout = config?.api?.timeout ?? 5000; // 5000 (null triggers default)
const retries = config?.api?.retries ?? 3; // 0 (doesn't trigger default)
```

### Advanced Destructuring Patterns

```javascript
// ✅ Nested destructuring with defaults
const response = {
  data: {
    users: [
      { id: 1, name: 'Alice', metadata: { role: 'admin' } },
      { id: 2, name: 'Bob' },
    ],
  },
  meta: {
    total: 2,
    page: 1,
  },
};

const {
  data: {
    users: [
      { name: firstName, metadata: { role: firstUserRole = 'user' } = {} },
      { name: secondName = 'Unknown' } = {},
    ] = [],
  } = {},
  meta: { total = 0, page = 1 } = {},
} = response;

// ✅ Dynamic property destructuring
const dynamicKey = 'username';
const userData = { username: 'john_doe', email: 'john@example.com' };
const { [dynamicKey]: extractedValue } = userData; // 'john_doe'

// ✅ Rest patterns in destructuring
const { username, ...otherUserData } = userData;
const [first, ...remaining] = [1, 2, 3, 4, 5];
```

### Template Literals & Tagged Templates

```javascript
// ✅ Advanced template literals
const createQuery = (table, conditions) => `
  SELECT *
  FROM ${table}
  WHERE ${Object.entries(conditions)
    .map(([key, value]) => `${key} = '${value}'`)
    .join(' AND ')}
`;

// ✅ Tagged template literals
const html = (strings, ...values) => {
  return strings.reduce((result, string, i) => {
    const value = values[i] ? escapeHtml(values[i]) : '';
    return result + string + value;
  }, '');
};

const escapeHtml = (str) =>
  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Usage - automatically escapes values
const userInput = '<script>alert("xss")</script>';
const safeHtml = html`<div>User input: ${userInput}</div>`;
// Result: <div>User input: &lt;script&gt;alert("xss")&lt;/script&gt;</div>

// ✅ SQL-like tagged template
const sql = (strings, ...values) => ({
  query: strings.join('?'),
  params: values,
});

const userId = 123;
const status = 'active';
const query = sql`
  SELECT * FROM users
  WHERE id = ${userId} AND status = ${status}
`;
// { query: "SELECT * FROM users WHERE id = ? AND status = ?", params: [123, "active"] }
```

---

## Design Patterns in JavaScript

### Advanced Module Patterns

```javascript
// ✅ Module with private methods using WeakMap
const UserManager = (() => {
  const privateProps = new WeakMap();

  class UserManager {
    constructor() {
      privateProps.set(this, {
        users: new Map(),
        validateUser: (user) => {
          return user && typeof user.name === 'string' && user.name.length > 0;
        },
        generateId: () => Date.now().toString(36) + Math.random().toString(36).substr(2),
      });
    }

    addUser(userData) {
      const private = privateProps.get(this);

      if (!private.validateUser(userData)) {
        throw new Error('Invalid user data');
      }

      const id = private.generateId();
      const user = { id, ...userData, createdAt: new Date() };
      private.users.set(id, user);

      return user;
    }

    getUser(id) {
      return privateProps.get(this).users.get(id);
    }

    getAllUsers() {
      return Array.from(privateProps.get(this).users.values());
    }
  }

  return UserManager;
})();
```

### Observer Pattern with Modern JavaScript

```javascript
// ✅ Modern Observer pattern with EventTarget
class EventEmitter extends EventTarget {
  emit(eventName, data) {
    this.dispatchEvent(new CustomEvent(eventName, { detail: data }));
  }

  on(eventName, callback) {
    this.addEventListener(eventName, callback);
    return () => this.removeEventListener(eventName, callback); // Return cleanup function
  }

  once(eventName, callback) {
    this.addEventListener(eventName, callback, { once: true });
  }
}

// ✅ Reactive Store pattern
class ReactiveStore extends EventEmitter {
  constructor(initialState = {}) {
    super();
    this._state = { ...initialState };
    this._subscribers = new Set();
  }

  get state() {
    return { ...this._state }; // Return immutable copy
  }

  setState(updates) {
    const prevState = this.state;
    this._state = { ...this._state, ...updates };

    this.emit('stateChange', {
      prevState,
      nextState: this.state,
      updates,
    });
  }

  subscribe(callback) {
    this._subscribers.add(callback);

    // Return unsubscribe function
    return () => {
      this._subscribers.delete(callback);
    };
  }

  getSnapshot() {
    return this.state;
  }
}

// Usage
const store = new ReactiveStore({ count: 0, user: null });

const unsubscribe = store.on('stateChange', ({ nextState, updates }) => {
  console.log('State updated:', updates);
  console.log('New state:', nextState);
});

store.setState({ count: 1 });
store.setState({ user: { name: 'Alice' } });
```

### Command Pattern for Undo/Redo

```javascript
// ✅ Command pattern with undo/redo
class Command {
  execute() {
    throw new Error('Execute method must be implemented');
  }

  undo() {
    throw new Error('Undo method must be implemented');
  }
}

class AddItemCommand extends Command {
  constructor(list, item) {
    super();
    this.list = list;
    this.item = item;
  }

  execute() {
    this.list.push(this.item);
  }

  undo() {
    const index = this.list.indexOf(this.item);
    if (index > -1) {
      this.list.splice(index, 1);
    }
  }
}

class RemoveItemCommand extends Command {
  constructor(list, index) {
    super();
    this.list = list;
    this.index = index;
    this.removedItem = null;
  }

  execute() {
    this.removedItem = this.list.splice(this.index, 1)[0];
  }

  undo() {
    if (this.removedItem) {
      this.list.splice(this.index, 0, this.removedItem);
    }
  }
}

class CommandManager {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
  }

  execute(command) {
    // Remove any commands after current index (for when we're in middle of history)
    this.history = this.history.slice(0, this.currentIndex + 1);

    command.execute();
    this.history.push(command);
    this.currentIndex++;
  }

  undo() {
    if (this.canUndo()) {
      const command = this.history[this.currentIndex];
      command.undo();
      this.currentIndex--;
    }
  }

  redo() {
    if (this.canRedo()) {
      this.currentIndex++;
      const command = this.history[this.currentIndex];
      command.execute();
    }
  }

  canUndo() {
    return this.currentIndex >= 0;
  }

  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }
}
```

---

## Performance Optimization Patterns

### Virtual Scrolling Implementation

```javascript
// ✅ Virtual scrolling for large lists
class VirtualList {
  constructor(container, items, itemHeight, visibleCount) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.visibleCount = visibleCount;
    this.scrollTop = 0;

    this.totalHeight = items.length * itemHeight;
    this.visibleStart = 0;
    this.visibleEnd = Math.min(visibleCount, items.length);

    this.setupContainer();
    this.render();
    this.attachScrollListener();
  }

  setupContainer() {
    this.container.style.height = `${this.visibleCount * this.itemHeight}px`;
    this.container.style.overflow = 'auto';
    this.container.style.position = 'relative';

    // Create virtual height element
    this.spacer = document.createElement('div');
    this.spacer.style.height = `${this.totalHeight}px`;
    this.spacer.style.position = 'absolute';
    this.spacer.style.top = '0';
    this.spacer.style.width = '1px';
    this.container.appendChild(this.spacer);
  }

  attachScrollListener() {
    this.container.addEventListener(
      'scroll',
      this.throttle(() => this.handleScroll(), 16),
    );
  }

  handleScroll() {
    this.scrollTop = this.container.scrollTop;
    const newVisibleStart = Math.floor(this.scrollTop / this.itemHeight);
    const newVisibleEnd = Math.min(newVisibleStart + this.visibleCount, this.items.length);

    if (newVisibleStart !== this.visibleStart || newVisibleEnd !== this.visibleEnd) {
      this.visibleStart = newVisibleStart;
      this.visibleEnd = newVisibleEnd;
      this.render();
    }
  }

  render() {
    // Clear existing items
    const existingItems = this.container.querySelectorAll('.virtual-item');
    existingItems.forEach((item) => item.remove());

    // Render visible items
    for (let i = this.visibleStart; i < this.visibleEnd; i++) {
      const item = this.createItemElement(this.items[i], i);
      item.style.position = 'absolute';
      item.style.top = `${i * this.itemHeight}px`;
      item.style.height = `${this.itemHeight}px`;
      item.className = 'virtual-item';
      this.container.appendChild(item);
    }
  }

  createItemElement(data, index) {
    const div = document.createElement('div');
    div.textContent = `Item ${index}: ${data.name || data}`;
    return div;
  }

  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
}
```

### Lazy Loading with Intersection Observer

```javascript
// ✅ Advanced lazy loading system
class LazyLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: '50px',
      threshold: 0.1,
      ...options,
    };

    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.options);

    this.loadingPromises = new Map();
  }

  observe(element, loadFn) {
    if (typeof loadFn !== 'function') {
      throw new Error('Load function is required');
    }

    element.dataset.loadFn = this.registerLoadFunction(loadFn);
    this.observer.observe(element);
  }

  registerLoadFunction(fn) {
    const id = `lazy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.loadingPromises.set(id, fn);
    return id;
  }

  async handleIntersection(entries) {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        await this.loadElement(entry.target);
        this.observer.unobserve(entry.target);
      }
    }
  }

  async loadElement(element) {
    const loadFnId = element.dataset.loadFn;
    const loadFn = this.loadingPromises.get(loadFnId);

    if (!loadFn) return;

    try {
      element.classList.add('loading');
      await loadFn(element);
      element.classList.remove('loading');
      element.classList.add('loaded');
    } catch (error) {
      element.classList.remove('loading');
      element.classList.add('error');
      console.error('Lazy loading failed:', error);
    } finally {
      this.loadingPromises.delete(loadFnId);
    }
  }

  disconnect() {
    this.observer.disconnect();
    this.loadingPromises.clear();
  }
}

// Usage
const lazyLoader = new LazyLoader({ rootMargin: '100px' });

// Lazy load images
document.querySelectorAll('img[data-src]').forEach((img) => {
  lazyLoader.observe(img, async (element) => {
    const src = element.dataset.src;
    const response = await fetch(src);
    const blob = await response.blob();
    element.src = URL.createObjectURL(blob);
  });
});

// Lazy load components
document.querySelectorAll('.lazy-component').forEach((container) => {
  lazyLoader.observe(container, async (element) => {
    const componentName = element.dataset.component;
    const Component = await import(`./components/${componentName}.js`);
    const instance = new Component.default();
    instance.render(element);
  });
});
```

---

## Reactive Programming

### Observable Pattern Implementation

```javascript
// ✅ Modern Observable implementation
class Observable {
  constructor(subscriber) {
    this._subscriber = subscriber;
  }

  subscribe(observer) {
    const normalizedObserver = typeof observer === 'function' ? { next: observer } : observer;

    const subscription = {
      closed: false,
      unsubscribe() {
        this.closed = true;
      },
    };

    try {
      const teardown = this._subscriber({
        next: (value) => {
          if (!subscription.closed && normalizedObserver.next) {
            normalizedObserver.next(value);
          }
        },
        error: (error) => {
          if (!subscription.closed) {
            subscription.closed = true;
            if (normalizedObserver.error) {
              normalizedObserver.error(error);
            }
          }
        },
        complete: () => {
          if (!subscription.closed) {
            subscription.closed = true;
            if (normalizedObserver.complete) {
              normalizedObserver.complete();
            }
          }
        },
      });

      if (typeof teardown === 'function') {
        subscription.unsubscribe = () => {
          subscription.closed = true;
          teardown();
        };
      }
    } catch (error) {
      normalizedObserver.error?.(error);
    }

    return subscription;
  }

  map(fn) {
    return new Observable((observer) => {
      return this.subscribe({
        next: (value) => observer.next(fn(value)),
        error: (error) => observer.error(error),
        complete: () => observer.complete(),
      });
    });
  }

  filter(predicate) {
    return new Observable((observer) => {
      return this.subscribe({
        next: (value) => {
          if (predicate(value)) {
            observer.next(value);
          }
        },
        error: (error) => observer.error(error),
        complete: () => observer.complete(),
      });
    });
  }

  debounce(ms) {
    return new Observable((observer) => {
      let timeoutId;

      return this.subscribe({
        next: (value) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => observer.next(value), ms);
        },
        error: (error) => observer.error(error),
        complete: () => observer.complete(),
      });
    });
  }

  static fromEvent(element, eventName) {
    return new Observable((observer) => {
      const handler = (event) => observer.next(event);
      element.addEventListener(eventName, handler);

      return () => element.removeEventListener(eventName, handler);
    });
  }

  static fromPromise(promise) {
    return new Observable((observer) => {
      promise
        .then((value) => {
          observer.next(value);
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }

  static interval(ms) {
    return new Observable((observer) => {
      let count = 0;
      const intervalId = setInterval(() => {
        observer.next(count++);
      }, ms);

      return () => clearInterval(intervalId);
    });
  }
}

// Usage examples
const clicks$ = Observable.fromEvent(document, 'click');
const doubleClicks$ = clicks$.debounce(300).filter((event) => event.detail === 2);

doubleClicks$.subscribe((event) => {
  console.log('Double click at:', event.clientX, event.clientY);
});

// Search with debouncing
const searchInput = document.getElementById('search');
const search$ = Observable.fromEvent(searchInput, 'input')
  .map((event) => event.target.value)
  .filter((value) => value.length > 2)
  .debounce(300);

search$.subscribe(async (query) => {
  const results = await searchAPI(query);
  displayResults(results);
});
```

---

## Advanced Type Safety

### Runtime Type Validation

```javascript
// ✅ Comprehensive type validation system
const Types = {
  string: (value) => typeof value === 'string',
  number: (value) => typeof value === 'number' && !isNaN(value),
  boolean: (value) => typeof value === 'boolean',
  array: (value) => Array.isArray(value),
  object: (value) => value !== null && typeof value === 'object' && !Array.isArray(value),
  function: (value) => typeof value === 'function',

  arrayOf: (typeValidator) => (value) => {
    return Array.isArray(value) && value.every(typeValidator);
  },

  objectOf: (schema) => (value) => {
    if (!Types.object(value)) return false;

    return Object.entries(schema).every(([key, validator]) => {
      const hasProperty = key in value;
      const isOptional = validator.optional;

      if (!hasProperty && !isOptional) return false;
      if (!hasProperty && isOptional) return true;

      const actualValidator = isOptional ? validator.type : validator;
      return actualValidator(value[key]);
    });
  },

  optional: (typeValidator) => ({
    type: typeValidator,
    optional: true,
  }),

  oneOf:
    (...validators) =>
    (value) => {
      return validators.some((validator) => validator(value));
    },

  validate: (value, validator, path = '') => {
    const isValid = validator(value);
    if (!isValid) {
      throw new TypeError(
        `Type validation failed at ${path || 'root'}: expected valid type, got ${typeof value}`,
      );
    }
    return value;
  },
};

// ✅ Schema validation example
const UserSchema = Types.objectOf({
  id: Types.number,
  name: Types.string,
  email: Types.string,
  age: Types.optional(Types.number),
  preferences: Types.optional(
    Types.objectOf({
      theme: Types.oneOf(
        (value) => value === 'light',
        (value) => value === 'dark',
      ),
      notifications: Types.boolean,
    }),
  ),
  roles: Types.arrayOf(Types.string),
});

// Usage
const validateUser = (userData) => {
  try {
    return Types.validate(userData, UserSchema, 'user');
  } catch (error) {
    console.error('User validation failed:', error.message);
    throw error;
  }
};

// API wrapper with validation
const createTypedAPI = (schema) => {
  return (endpoint) => async (data) => {
    // Validate input
    Types.validate(data, schema.input, `${endpoint}.input`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    // Validate output
    return Types.validate(result, schema.output, `${endpoint}.output`);
  };
};

const createUserAPI = createTypedAPI({
  input: UserSchema,
  output: Types.objectOf({
    success: Types.boolean,
    user: UserSchema,
    token: Types.optional(Types.string),
  }),
});
```

---

## Micro-optimizations

### Memory-Efficient Patterns

```javascript
// ✅ Object pooling for frequent allocations
class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
    this.used = new Set();

    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }

  acquire() {
    let obj;

    if (this.pool.length > 0) {
      obj = this.pool.pop();
    } else {
      obj = this.createFn();
    }

    this.used.add(obj);
    return obj;
  }

  release(obj) {
    if (this.used.has(obj)) {
      this.used.delete(obj);
      this.resetFn(obj);
      this.pool.push(obj);
    }
  }

  clear() {
    this.pool.length = 0;
    this.used.clear();
  }
}

// Usage for expensive objects
const vectorPool = new ObjectPool(
  () => ({ x: 0, y: 0, z: 0 }),
  (vector) => {
    vector.x = 0;
    vector.y = 0;
    vector.z = 0;
  },
);

// ✅ Efficient string operations
class StringBuilder {
  constructor() {
    this.parts = [];
  }

  append(str) {
    this.parts.push(str);
    return this;
  }

  appendLine(str = '') {
    this.parts.push(str, '\n');
    return this;
  }

  toString() {
    return this.parts.join('');
  }

  clear() {
    this.parts.length = 0;
    return this;
  }
}

// ✅ Efficient array operations
const ArrayUtils = {
  // Remove items without creating new array
  removeInPlace: (array, predicate) => {
    let writeIndex = 0;
    for (let readIndex = 0; readIndex < array.length; readIndex++) {
      if (!predicate(array[readIndex])) {
        array[writeIndex] = array[readIndex];
        writeIndex++;
      }
    }
    array.length = writeIndex;
    return array;
  },

  // Binary search for sorted arrays
  binarySearch: (array, target, compareFn = (a, b) => a - b) => {
    let left = 0;
    let right = array.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const comparison = compareFn(array[mid], target);

      if (comparison === 0) return mid;
      if (comparison < 0) left = mid + 1;
      else right = mid - 1;
    }

    return -1;
  },

  // Partition array in-place
  partition: (array, predicate) => {
    let left = 0;
    let right = array.length - 1;

    while (left < right) {
      while (left < right && predicate(array[left])) left++;
      while (left < right && !predicate(array[right])) right--;

      if (left < right) {
        [array[left], array[right]] = [array[right], array[left]];
        left++;
        right--;
      }
    }

    return left;
  },
};
```

### Performance Monitoring

```javascript
// ✅ Performance monitoring utilities
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = [];
  }

  measure(name, fn) {
    const start = performance.now();
    let result;
    let error;

    try {
      result = fn();

      if (result instanceof Promise) {
        return result.finally(() => {
          this.recordMetric(name, performance.now() - start);
        });
      }
    } catch (e) {
      error = e;
    } finally {
      this.recordMetric(name, performance.now() - start, error);
    }

    if (error) throw error;
    return result;
  }

  recordMetric(name, duration, error = null) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, {
        count: 0,
        totalTime: 0,
        minTime: Infinity,
        maxTime: 0,
        errors: 0,
      });
    }

    const metric = this.metrics.get(name);
    metric.count++;
    metric.totalTime += duration;
    metric.minTime = Math.min(metric.minTime, duration);
    metric.maxTime = Math.max(metric.maxTime, duration);

    if (error) metric.errors++;

    // Notify observers
    this.observers.forEach((observer) => {
      observer({ name, duration, error, metric });
    });
  }

  getMetrics(name) {
    const metric = this.metrics.get(name);
    if (!metric) return null;

    return {
      ...metric,
      averageTime: metric.totalTime / metric.count,
      errorRate: metric.errors / metric.count,
    };
  }

  getAllMetrics() {
    const result = {};
    this.metrics.forEach((metric, name) => {
      result[name] = this.getMetrics(name);
    });
    return result;
  }

  subscribe(observer) {
    this.observers.push(observer);
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) this.observers.splice(index, 1);
    };
  }

  clear() {
    this.metrics.clear();
  }
}

// Global performance monitor
const perfMon = new PerformanceMonitor();

// Auto-log slow operations
perfMon.subscribe(({ name, duration, error }) => {
  if (duration > 100) {
    console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
  }
  if (error) {
    console.error(`Operation failed: ${name}`, error);
  }
});

// Usage decorator
const monitored = (name) => (target, propertyKey, descriptor) => {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args) {
    return perfMon.measure(`${target.constructor.name}.${propertyKey}`, () => {
      return originalMethod.apply(this, args);
    });
  };

  return descriptor;
};

// Example usage
class UserService {
  @monitored('fetchUser')
  async fetchUser(id) {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  }

  @monitored('processUsers')
  processUsers(users) {
    return users.map((user) => ({
      ...user,
      displayName: `${user.firstName} ${user.lastName}`,
    }));
  }
}
```

---

## 📊 Summary

These advanced JavaScript patterns provide:

1. **Better Performance**: Through virtual scrolling, object pooling, and efficient algorithms
2. **Type Safety**: Runtime validation and schema checking
3. **Maintainability**: Clean patterns and proper abstractions
4. **Observability**: Performance monitoring and debugging tools
5. **Modern Features**: Latest JavaScript capabilities and best practices

Use these patterns selectively based on your application's needs. Not every application requires all these optimizations, but understanding them will make you a more effective JavaScript developer.

---

> **Next Steps**: Practice implementing these patterns in your projects, measure their impact, and gradually adopt the ones that provide the most value for your specific use cases.
