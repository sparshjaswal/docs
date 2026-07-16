# 🚀 Modern JavaScript Best Practices & Performance Guide

> **A comprehensive guide to writing clean, efficient, and maintainable JavaScript code in 2025**

## Table of Contents
- [Code Quality & Standards](#code-quality--standards)
- [Variable & Function Best Practices](#variable--function-best-practices)
- [Error Handling & Type Safety](#error-handling--type-safety)
- [Performance Optimization](#performance-optimization)
- [Modern Async Patterns](#modern-async-patterns)
- [Testing & Debugging](#testing--debugging)
- [Security Best Practices](#security-best-practices)
- [Memory Management](#memory-management)

---

## Code Quality & Standards

### Use Strict Mode
Always use strict mode to catch common mistakes and improve performance:

```javascript
'use strict';

// ✅ Good - catches undeclared variables
const userName = 'John';

// ❌ Bad - would create global variable without strict mode
// userName = 'John';
```

### Consistent Naming Conventions

```javascript
// ✅ Good - Use descriptive, consistent names
const MAX_RETRY_ATTEMPTS = 3;
const userAccountBalance = 1500.75;
const isUserAuthenticated = true;

function calculateTotalPrice(items, taxRate) {
  return items.reduce((total, item) => total + item.price, 0) * (1 + taxRate);
}

class UserAccount {
  constructor(email, name) {
    this.email = email;
    this.name = name;
  }

  async validateCredentials() {
    // Implementation
  }
}

// ❌ Bad - Unclear, inconsistent names
const MAX = 3;
const bal = 1500.75;
const auth = true;

function calc(x, y) {
  return x.reduce((a, b) => a + b.p, 0) * (1 + y);
}
```

---

## Variable & Function Best Practices

### Prefer const and let over var

```javascript
// ✅ Good - Use const for values that won't be reassigned
const API_URL = 'https://api.example.com';
const users = ['Alice', 'Bob', 'Charlie'];

// ✅ Good - Use let for variables that will be reassigned
let currentUserIndex = 0;
let isLoading = false;

// ❌ Bad - var has function scope and hoisting issues
var count = 0; // Use let instead
var name = 'John'; // Use const instead
```

### Object and Array Destructuring

```javascript
// ✅ Good - Clean destructuring
const user = { name: 'Alice', age: 30, email: 'alice@example.com' };
const { name, age, email } = user;

const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;

// ✅ Good - Default values and renaming
const { name: userName = 'Anonymous', age: userAge = 0 } = user || {};

// ✅ Good - Function parameter destructuring
function createUser({ name, email, age = 18 }) {
  return { name, email, age, id: Date.now() };
}
```

### Modern Function Patterns

```javascript
// ✅ Good - Arrow functions for short operations
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);

// ✅ Good - Pure functions
const calculateDiscountedPrice = (price, discountPercent) => {
  return price * (1 - discountPercent / 100);
};

// ✅ Good - Higher-order functions
const createValidator = (rules) => (data) => {
  return rules.every(rule => rule(data));
};

const emailValidator = createValidator([
  data => data.includes('@'),
  data => data.length > 5,
  data => data.includes('.')
]);

// ✅ Good - Function composition
const pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value);

const processUserInput = pipe(
  input => input.trim(),
  input => input.toLowerCase(),
  input => input.replace(/\s+/g, '-')
);
```

---

## Error Handling & Type Safety

### Comprehensive Error Handling

```javascript
// ✅ Good - Result pattern for error handling
class Result {
  constructor(value, error = null) {
    this.value = value;
    this.error = error;
  }

  static success(value) {
    return new Result(value);
  }

  static failure(error) {
    return new Result(null, error);
  }

  isSuccess() {
    return this.error === null;
  }

  isFailure() {
    return this.error !== null;
  }

  map(fn) {
    return this.isSuccess() ? Result.success(fn(this.value)) : this;
  }

  flatMap(fn) {
    return this.isSuccess() ? fn(this.value) : this;
  }
}

// ✅ Good - Safe API calls
async function fetchUserSafely(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);

    if (!response.ok) {
      return Result.failure(`HTTP ${response.status}: ${response.statusText}`);
    }

    const user = await response.json();
    return Result.success(user);
  } catch (error) {
    return Result.failure(`Network error: ${error.message}`);
  }
}

// Usage
const userResult = await fetchUserSafely(123);
if (userResult.isSuccess()) {
  console.log('User:', userResult.value);
} else {
  console.error('Error:', userResult.error);
}
```

### Input Validation & Type Checking

```javascript
// ✅ Good - Runtime type validation
const validateUser = (user) => {
  const errors = [];

  if (typeof user !== 'object' || user === null) {
    errors.push('User must be an object');
    return { isValid: false, errors };
  }

  if (typeof user.name !== 'string' || user.name.trim() === '') {
    errors.push('Name must be a non-empty string');
  }

  if (typeof user.email !== 'string' || !user.email.includes('@')) {
    errors.push('Email must be a valid email address');
  }

  if (typeof user.age !== 'number' || user.age < 0 || user.age > 150) {
    errors.push('Age must be a number between 0 and 150');
  }

  return { isValid: errors.length === 0, errors };
};

// ✅ Good - Schema validation with defaults
const createUserSchema = (input) => {
  const defaults = {
    name: '',
    email: '',
    age: 18,
    isActive: true
  };

  return {
    ...defaults,
    ...input,
    name: String(input.name || '').trim(),
    email: String(input.email || '').toLowerCase().trim(),
    age: Number(input.age) || 18
  };
};
```

---

## Performance Optimization

### Efficient DOM Manipulation

```javascript
// ✅ Good - Batch DOM operations
function updateUserList(users) {
  const container = document.getElementById('user-list');
  const fragment = document.createDocumentFragment();

  users.forEach(user => {
    const userElement = document.createElement('div');
    userElement.className = 'user-item';
    userElement.textContent = `${user.name} (${user.email})`;
    fragment.appendChild(userElement);
  });

  container.appendChild(fragment);
}

// ❌ Bad - Multiple DOM manipulations
function updateUserListSlow(users) {
  const container = document.getElementById('user-list');
  users.forEach(user => {
    const userElement = document.createElement('div');
    userElement.className = 'user-item';
    userElement.textContent = `${user.name} (${user.email})`;
    container.appendChild(userElement); // Causes reflow each time
  });
}
```

### Debouncing and Throttling

```javascript
// ✅ Good - Debounce for search inputs
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

const searchInput = document.getElementById('search');
const debouncedSearch = debounce(async (query) => {
  if (query.length > 2) {
    const results = await searchUsers(query);
    displaySearchResults(results);
  }
}, 300);

searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value));

// ✅ Good - Throttle for scroll events
const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const throttledScrollHandler = throttle(() => {
  console.log('Scroll event handled');
}, 100);

window.addEventListener('scroll', throttledScrollHandler);
```

### Memoization for Expensive Operations

```javascript
// ✅ Good - Memoize expensive calculations
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

const expensiveCalculation = memoize((n) => {
  console.log(`Computing factorial of ${n}`);
  return n <= 1 ? 1 : n * expensiveCalculation(n - 1);
});

// ✅ Good - LRU Cache for limited memory
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}
```

---

## Modern Async Patterns

### Advanced Promise Patterns

```javascript
// ✅ Good - Promise utilities
const timeout = (ms) => new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Timeout')), ms)
);

const withTimeout = (promise, ms) =>
  Promise.race([promise, timeout(ms)]);

const retry = async (fn, maxAttempts = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};

// ✅ Good - Parallel processing with error handling
async function fetchMultipleUsers(userIds) {
  const results = await Promise.allSettled(
    userIds.map(id => fetchUserSafely(id))
  );

  const successful = results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value);

  const failed = results
    .filter(result => result.status === 'rejected')
    .map(result => result.reason);

  return { successful, failed };
}
```

### Modern Async Iteration

```javascript
// ✅ Good - Async generators for streaming data
async function* fetchUsersPaginated(pageSize = 10) {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`/api/users?page=${page}&size=${pageSize}`);
    const data = await response.json();

    yield data.users;

    hasMore = data.hasMore;
    page++;
  }
}

// Usage
for await (const userBatch of fetchUsersPaginated()) {
  console.log(`Processing ${userBatch.length} users`);
  // Process batch
}

// ✅ Good - Async array operations
const asyncMap = async (array, asyncFn) => {
  return Promise.all(array.map(asyncFn));
};

const asyncFilter = async (array, asyncPredicate) => {
  const results = await Promise.all(array.map(asyncPredicate));
  return array.filter((_, index) => results[index]);
};

const asyncReduce = async (array, asyncFn, initialValue) => {
  let accumulator = initialValue;
  for (const item of array) {
    accumulator = await asyncFn(accumulator, item);
  }
  return accumulator;
};
```

---

## Testing & Debugging

### Unit Testing Best Practices

```javascript
// ✅ Good - Testable function design
const calculateOrderTotal = (items, taxRate = 0, discountPercent = 0) => {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array');
  }

  const subtotal = items.reduce((sum, item) => {
    if (typeof item.price !== 'number' || item.price < 0) {
      throw new Error('Invalid item price');
    }
    return sum + item.price;
  }, 0);

  const discountAmount = subtotal * (discountPercent / 100);
  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * taxRate;

  return {
    subtotal,
    discountAmount,
    taxAmount: tax,
    total: discountedSubtotal + tax
  };
};

// ✅ Good - Test examples
const testCalculateOrderTotal = () => {
  const items = [
    { price: 10.00 },
    { price: 20.00 },
    { price: 15.00 }
  ];

  // Test basic calculation
  const result1 = calculateOrderTotal(items, 0.1, 10);
  console.assert(result1.subtotal === 45, 'Subtotal calculation failed');
  console.assert(result1.discountAmount === 4.5, 'Discount calculation failed');
  console.assert(result1.total === 44.55, 'Total calculation failed');

  // Test edge cases
  try {
    calculateOrderTotal(null);
    console.assert(false, 'Should throw error for null items');
  } catch (error) {
    console.assert(error.message === 'Items must be an array', 'Wrong error message');
  }
};
```

### Debugging Utilities

```javascript
// ✅ Good - Enhanced logging
const logger = {
  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🐛 DEBUG: ${message}`, data);
    }
  },

  info: (message, data) => {
    console.log(`ℹ️  INFO: ${message}`, data);
  },

  warn: (message, data) => {
    console.warn(`⚠️  WARN: ${message}`, data);
  },

  error: (message, error) => {
    console.error(`❌ ERROR: ${message}`, {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
};

// ✅ Good - Performance monitoring
const performanceMonitor = {
  time: (label) => {
    console.time(label);
  },

  timeEnd: (label) => {
    console.timeEnd(label);
  },

  measure: (fn, label) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${label}: ${end - start}ms`);
    return result;
  }
};
```

---

## Security Best Practices

### Input Sanitization & XSS Prevention

```javascript
// ✅ Good - HTML escaping
const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// ✅ Good - Safe DOM insertion
const safeSetContent = (element, content) => {
  element.textContent = content; // Automatically escapes
};

const safeSetHTML = (element, html) => {
  element.innerHTML = escapeHtml(html);
};

// ✅ Good - CSRF protection
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

const secureAjax = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken,
    ...options.headers
  };

  return fetch(url, { ...options, headers });
};
```

---

## Memory Management

### Preventing Memory Leaks

```javascript
// ✅ Good - Proper event listener cleanup
class EventManager {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(element, event, handler) {
    if (!this.listeners.has(element)) {
      this.listeners.set(element, new Map());
    }

    this.listeners.get(element).set(event, handler);
    element.addEventListener(event, handler);
  }

  removeEventListener(element, event) {
    if (this.listeners.has(element)) {
      const elementListeners = this.listeners.get(element);
      if (elementListeners.has(event)) {
        const handler = elementListeners.get(event);
        element.removeEventListener(event, handler);
        elementListeners.delete(event);
      }
    }
  }

  cleanup() {
    this.listeners.forEach((elementListeners, element) => {
      elementListeners.forEach((handler, event) => {
        element.removeEventListener(event, handler);
      });
    });
    this.listeners.clear();
  }
}

// ✅ Good - WeakMap for private data
const privateData = new WeakMap();

class User {
  constructor(name, email) {
    privateData.set(this, {
      name,
      email,
      createdAt: new Date()
    });
  }

  getName() {
    return privateData.get(this).name;
  }

  getEmail() {
    return privateData.get(this).email;
  }
}
```

---

## 🎯 Legacy Code Examples & Fixes

### Common Issues & Solutions

```javascript
// ❌ Bad - Global variables pollution
var userName = 'John';
var userAge = 30;

// ✅ Good - Module pattern
const UserModule = (() => {
  const userName = 'John';
  const userAge = 30;

  return {
    getUserInfo: () => ({ userName, userAge }),
    updateUserName: (newName) => userName = newName
  };
})();

// ❌ Bad - Comparison issues
const name1 = "sparsh";
const name2 = "sparsh";
console.log(name1 == name2);  // Works for primitives
console.log(name1 === name2); // Better practice

const user1 = { name: "sparsh", age: 28 };
const user2 = { name: "sparsh", age: 28 };
console.log(user1 == user2);  // false - different objects
console.log(user1 === user2); // false - different objects

// ✅ Good - Object comparison utilities
const deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;

  if (obj1 == null || obj2 == null) return false;

  if (typeof obj1 !== typeof obj2) return false;

  if (typeof obj1 !== 'object') return obj1 === obj2;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every(key => deepEqual(obj1[key], obj2[key]));
};

console.log(deepEqual(user1, user2)); // true

// ❌ Bad - No-script handling
// <noscript>Please enable JavaScript!!!</noscript>

// ✅ Good - Progressive enhancement
const enhanceWithJavaScript = () => {
  document.body.classList.add('js-enabled');

  // Initialize JavaScript-dependent features
  initializeInteractiveElements();
  enableAdvancedFeatures();
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', enhanceWithJavaScript);
} else {
  enhanceWithJavaScript();
}
```

---

## 📚 Additional Resources

- **ESLint Configuration**: Set up linting rules for consistent code quality
- **Prettier**: Automatic code formatting
- **TypeScript**: Consider migrating to TypeScript for better type safety
- **Testing Frameworks**: Jest, Vitest, or Playwright for comprehensive testing
- **Performance Tools**: Chrome DevTools, Lighthouse, webpack-bundle-analyzer

---

> **Remember**: Good JavaScript code is not just about syntax—it's about writing maintainable, performant, and secure applications that stand the test of time.
