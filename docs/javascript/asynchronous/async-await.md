# ⏰ Async/Await - Complete Guide

> **Master modern asynchronous JavaScript with clean, readable syntax**

## 📖 Table of Contents

- [What is Async/Await?](#what-is-asyncawait)
- [Async Functions](#async-functions)
- [Await Keyword](#await-keyword)
- [Error Handling](#error-handling)
- [Advanced Patterns](#advanced-patterns)
- [Performance Considerations](#performance-considerations)
- [Real-World Examples](#real-world-examples)
- [Best Practices](#best-practices)
- [Common Pitfalls](#common-pitfalls)

---

## What is Async/Await?

**Async/Await** is syntactic sugar built on top of Promises that allows you to write asynchronous code that looks and behaves more like synchronous code. It makes Promise-based code much more readable and easier to understand.

### 🧠 Mental Model

> Think of async/await like **waiting in line**:
>
> - `async` declares "this function might need to wait"
> - `await` means "wait here until this is ready"
> - The line (execution) pauses at each `await` but doesn't block other lines (other functions)

### ✨ Evolution of Asynchronous JavaScript

#### **1. Callbacks (The Dark Ages)**

```javascript
function fetchUserData(userId, callback) {
  fetchUser(userId, (userError, user) => {
    if (userError) return callback(userError);

    fetchUserPosts(user.id, (postsError, posts) => {
      if (postsError) return callback(postsError);

      fetchPostComments(posts[0].id, (commentsError, comments) => {
        if (commentsError) return callback(commentsError);

        callback(null, { user, posts, comments });
      });
    });
  });
}
```

#### **2. Promises (The Renaissance)**

```javascript
function fetchUserData(userId) {
  return fetchUser(userId)
    .then((user) => fetchUserPosts(user.id))
    .then((posts) => fetchPostComments(posts[0].id))
    .then((comments) => ({ user, posts, comments }))
    .catch((error) => {
      throw new Error(`Failed to fetch user data: ${error.message}`);
    });
}
```

#### **3. Async/Await (The Modern Era)**

```javascript
async function fetchUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchUserPosts(user.id);
    const comments = await fetchPostComments(posts[0].id);

    return { user, posts, comments };
  } catch (error) {
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }
}
```

---

## Async Functions

### 📝 **Declaration Syntax**

```javascript
// Function declaration
async function fetchData() {
  // Async code here
}

// Function expression
const fetchData = async function () {
  // Async code here
};

// Arrow function
const fetchData = async () => {
  // Async code here
};

// Method in object
const api = {
  async fetchData() {
    // Async code here
  },
};

// Method in class
class ApiClient {
  async fetchData() {
    // Async code here
  }
}
```

### 🎁 **Return Values**

```javascript
// Async functions ALWAYS return a Promise
async function example1() {
  return 'Hello'; // Returns Promise.resolve('Hello')
}

async function example2() {
  return Promise.resolve('World'); // Returns Promise.resolve('World')
}

async function example3() {
  throw new Error('Oops'); // Returns Promise.reject(Error('Oops'))
}

// Usage
example1().then((value) => console.log(value)); // "Hello"
example2().then((value) => console.log(value)); // "World"
example3().catch((error) => console.log(error.message)); // "Oops"

// Or with await
async function main() {
  try {
    const result1 = await example1(); // "Hello"
    const result2 = await example2(); // "World"
    const result3 = await example3(); // Throws error
  } catch (error) {
    console.log('Caught:', error.message);
  }
}
```

### 🎯 **Function Behavior**

```javascript
async function demonstrateAsyncBehavior() {
  console.log('1. Function starts');

  const result = await new Promise((resolve) => {
    console.log('2. Promise executor runs immediately');
    setTimeout(() => {
      console.log('3. Promise resolves after 1 second');
      resolve('Done!');
    }, 1000);
  });

  console.log('4. After await:', result);
  return result;
}

console.log('Before calling async function');
demonstrateAsyncBehavior().then((result) => {
  console.log('5. Function completed with:', result);
});
console.log('After calling async function');

// Output order:
// Before calling async function
// 1. Function starts
// 2. Promise executor runs immediately
// After calling async function
// 3. Promise resolves after 1 second
// 4. After await: Done!
// 5. Function completed with: Done!
```

---

## Await Keyword

### 🎯 **Basic Usage**

```javascript
// await can only be used inside async functions
async function fetchUserProfile(userId) {
  // await pauses execution until Promise resolves
  const response = await fetch(`/api/users/${userId}`);
  const user = await response.json();

  return user;
}

// This would cause a SyntaxError:
// const user = await fetch('/api/user'); // Error: await outside async function
```

### 🔄 **Sequential vs Parallel Execution**

#### **Sequential (one after another)**

```javascript
async function fetchDataSequentially() {
  console.log('Starting sequential fetches...');

  const user = await fetch('/api/user').then((r) => r.json()); // Wait 1 second
  const posts = await fetch('/api/posts').then((r) => r.json()); // Wait another 1 second
  const todos = await fetch('/api/todos').then((r) => r.json()); // Wait another 1 second

  // Total time: ~3 seconds
  return { user, posts, todos };
}
```

#### **Parallel (at the same time)**

```javascript
async function fetchDataParallel() {
  console.log('Starting parallel fetches...');

  // Start all requests simultaneously
  const userPromise = fetch('/api/user').then((r) => r.json());
  const postsPromise = fetch('/api/posts').then((r) => r.json());
  const todosPromise = fetch('/api/todos').then((r) => r.json());

  // Wait for all to complete
  const [user, posts, todos] = await Promise.all([userPromise, postsPromise, todosPromise]);

  // Total time: ~1 second (fastest request)
  return { user, posts, todos };
}
```

### 🎲 **Awaiting Different Promise States**

```javascript
async function awaitExamples() {
  // Await resolved promise
  const resolved = await Promise.resolve('Success!');
  console.log(resolved); // "Success!"

  // Await rejected promise (throws error)
  try {
    const rejected = await Promise.reject('Failed!');
  } catch (error) {
    console.log('Caught:', error); // "Caught: Failed!"
  }

  // Await pending promise
  const delayed = await new Promise((resolve) => {
    setTimeout(() => resolve('After delay'), 1000);
  });
  console.log(delayed); // "After delay" (after 1 second)
}
```

---

## Error Handling

### 🛡️ **Try/Catch Blocks**

```javascript
async function robustApiCall() {
  try {
    const response = await fetch('/api/data');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.valid) {
      throw new Error('Invalid data received');
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error.message);

    // Different handling based on error type
    if (error.message.includes('HTTP 404')) {
      return { error: 'Data not found' };
    } else if (error.message.includes('Invalid data')) {
      return { error: 'Data validation failed' };
    } else {
      throw error; // Re-throw unknown errors
    }
  }
}
```

### 🔄 **Multiple Error Sources**

```javascript
async function complexOperation() {
  try {
    // Network error possibility
    const response = await fetch('/api/data');
    const data = await response.json();

    // Processing error possibility
    const processed = await processData(data);

    // Validation error possibility
    const validated = await validateData(processed);

    return validated;
  } catch (error) {
    // Handle different error types
    if (error instanceof TypeError) {
      console.error('Network or parsing error:', error.message);
    } else if (error instanceof ValidationError) {
      console.error('Validation failed:', error.message);
    } else {
      console.error('Unknown error:', error.message);
    }

    throw error;
  }
}
```

### 🎯 **Error Recovery Patterns**

```javascript
async function fetchWithFallback(primaryUrl, fallbackUrl) {
  try {
    const response = await fetch(primaryUrl);
    if (!response.ok) throw new Error('Primary source failed');
    return await response.json();
  } catch (primaryError) {
    console.warn('Primary source failed, trying fallback...');

    try {
      const response = await fetch(fallbackUrl);
      if (!response.ok) throw new Error('Fallback source failed');
      return await response.json();
    } catch (fallbackError) {
      console.error('Both sources failed');
      throw new Error('All data sources unavailable');
    }
  }
}

// Usage
async function loadCriticalData() {
  try {
    const data = await fetchWithFallback('/api/data', '/api/backup-data');
    return data;
  } catch (error) {
    // Use cached data as last resort
    return getCachedData();
  }
}
```

---

## Advanced Patterns

### 🔄 **Retry Logic with Exponential Backoff**

```javascript
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw new Error(`Failed after ${maxRetries + 1} attempts: ${error.message}`);
      }

      const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Usage
async function unreliableOperation() {
  const random = Math.random();
  if (random < 0.7) {
    throw new Error('Random failure');
  }
  return 'Success!';
}

retryWithBackoff(unreliableOperation)
  .then((result) => console.log('Result:', result))
  .catch((error) => console.error('Final error:', error.message));
```

### 🎯 **Timeout Implementation**

```javascript
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Operation timed out')), ms);
  });
}

async function fetchWithTimeout(url, timeoutMs = 5000) {
  try {
    const result = await Promise.race([fetch(url).then((r) => r.json()), timeout(timeoutMs)]);
    return result;
  } catch (error) {
    if (error.message === 'Operation timed out') {
      throw new Error(`Request to ${url} timed out after ${timeoutMs}ms`);
    }
    throw error;
  }
}

// Usage
fetchWithTimeout('/api/slow-endpoint', 3000)
  .then((data) => console.log('Data:', data))
  .catch((error) => console.error('Error:', error.message));
```

### 🔀 **Conditional Awaiting**

```javascript
async function smartDataFetcher(useCache = false) {
  if (useCache) {
    const cached = getCachedData();
    if (cached) {
      console.log('Using cached data');
      return cached;
    }
  }

  console.log('Fetching fresh data');
  const response = await fetch('/api/data');
  const data = await response.json();

  if (useCache) {
    setCachedData(data);
  }

  return data;
}

// Conditional async operations
async function processUser(user, includeAnalytics = false) {
  const profile = await fetchUserProfile(user.id);

  let analytics = null;
  if (includeAnalytics) {
    analytics = await fetchUserAnalytics(user.id);
  }

  return {
    ...profile,
    analytics,
  };
}
```

### 🔄 **Async Iteration**

```javascript
// Process items sequentially
async function processItemsSequentially(items) {
  const results = [];

  for (const item of items) {
    const result = await processItem(item);
    results.push(result);
  }

  return results;
}

// Process items with controlled concurrency
async function processItemsConcurrently(items, concurrency = 3) {
  const results = [];

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map((item) => processItem(item)));
    results.push(...batchResults);
  }

  return results;
}

// Async generator for streaming data
async function* fetchDataStream(pageSize = 10) {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(`/api/data?page=${page}&size=${pageSize}`);
    const data = await response.json();

    yield data.items;

    hasMore = data.hasMore;
    page++;
  }
}

// Usage
async function consumeDataStream() {
  for await (const batch of fetchDataStream()) {
    console.log('Processing batch:', batch.length);
    // Process batch
  }
}
```

---

## Performance Considerations

### 🚀 **Parallel vs Sequential Execution**

```javascript
// SLOW: Sequential execution (3 seconds total)
async function slowDataFetch() {
  const start = Date.now();

  const users = await fetch('/api/users').then((r) => r.json()); // 1s
  const posts = await fetch('/api/posts').then((r) => r.json()); // 1s
  const comments = await fetch('/api/comments').then((r) => r.json()); // 1s

  console.log(`Sequential took: ${Date.now() - start}ms`);
  return { users, posts, comments };
}

// FAST: Parallel execution (1 second total)
async function fastDataFetch() {
  const start = Date.now();

  const [users, posts, comments] = await Promise.all([
    fetch('/api/users').then((r) => r.json()),
    fetch('/api/posts').then((r) => r.json()),
    fetch('/api/comments').then((r) => r.json()),
  ]);

  console.log(`Parallel took: ${Date.now() - start}ms`);
  return { users, posts, comments };
}
```

### 🎯 **When to Use Sequential vs Parallel**

```javascript
async function userDashboard(userId) {
  // Sequential: posts depend on user data
  const user = await fetchUser(userId);
  const posts = await fetchUserPosts(user.id); // Needs user.id

  // Parallel: independent operations
  const [analytics, notifications, settings] = await Promise.all([
    fetchUserAnalytics(userId),
    fetchUserNotifications(userId),
    fetchUserSettings(userId),
  ]);

  return {
    user,
    posts,
    analytics,
    notifications,
    settings,
  };
}
```

### 🔧 **Memory and Resource Management**

```javascript
// Efficient streaming for large datasets
async function processLargeDataset() {
  const response = await fetch('/api/large-dataset');
  const reader = response.body.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      // Process chunk without loading entire dataset into memory
      await processChunk(value);
    }
  } finally {
    reader.releaseLock();
  }
}

// Avoid memory leaks with cleanup
async function fetchWithCleanup() {
  const controller = new AbortController();

  try {
    const response = await fetch('/api/data', {
      signal: controller.signal,
    });
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request cancelled');
    }
    throw error;
  } finally {
    // Cleanup happens automatically with try/finally
  }
}
```

---

## Real-World Examples

### 📱 **Progressive Data Loading**

```javascript
class DashboardLoader {
  constructor(userId) {
    this.userId = userId;
    this.cache = new Map();
  }

  async loadEssentialData() {
    console.log('Loading essential data...');

    try {
      // Load critical data first
      const user = await this.fetchUser();
      this.renderUserProfile(user);

      // Load secondary data in parallel
      const [notifications, quickStats] = await Promise.all([
        this.fetchNotifications(),
        this.fetchQuickStats(),
      ]);

      this.renderNotifications(notifications);
      this.renderQuickStats(quickStats);

      // Load heavy data in background
      this.loadHeavyDataInBackground();
    } catch (error) {
      this.showErrorMessage('Failed to load dashboard');
      console.error(error);
    }
  }

  async loadHeavyDataInBackground() {
    try {
      // Use low priority for heavy operations
      await this.delay(100); // Let UI update first

      const [analytics, reports, history] = await Promise.all([
        this.fetchAnalytics(),
        this.fetchReports(),
        this.fetchHistory(),
      ]);

      this.renderAnalytics(analytics);
      this.renderReports(reports);
      this.renderHistory(history);
    } catch (error) {
      console.warn('Background data loading failed:', error);
      // Don't disrupt user experience for non-critical data
    }
  }

  async fetchUser() {
    if (this.cache.has('user')) {
      return this.cache.get('user');
    }

    const user = await fetch(`/api/users/${this.userId}`).then((r) => r.json());
    this.cache.set('user', user);
    return user;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Usage
const dashboard = new DashboardLoader('user123');
dashboard.loadEssentialData();
```

### 🔄 **Robust API Client**

```javascript
class ApiClient {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.defaultTimeout = options.timeout || 10000;
    this.retryAttempts = options.retryAttempts || 3;
    this.retryDelay = options.retryDelay || 1000;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const timeout = options.timeout || this.defaultTimeout;

    return await this.retryWithBackoff(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }

        throw error;
      }
    });
  }

  async retryWithBackoff(fn) {
    let lastError;

    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        if (attempt === this.retryAttempts - 1) {
          throw error;
        }

        const delay = this.retryDelay * Math.pow(2, attempt);
        console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Convenience methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
  }
}

// Usage
const api = new ApiClient('https://api.example.com', {
  timeout: 5000,
  retryAttempts: 3,
});

async function loadUserData(userId) {
  try {
    const user = await api.get(`/users/${userId}`);
    const posts = await api.get(`/users/${userId}/posts`);

    return { user, posts };
  } catch (error) {
    console.error('Failed to load user data:', error.message);
    throw error;
  }
}
```

---

## Best Practices

### 1. 🎯 **Use Async/Await for Readability**

```javascript
// GOOD: Clean, readable async code
async function fetchUserProfile(userId) {
  try {
    const user = await fetchUser(userId);
    const preferences = await fetchUserPreferences(userId);
    return { ...user, preferences };
  } catch (error) {
    throw new Error(`Failed to load profile: ${error.message}`);
  }
}

// AVOID: Mixing async/await with .then()
async function mixedPatterns(userId) {
  const user = await fetchUser(userId);
  return fetchUserPreferences(userId).then((preferences) => {
    return { ...user, preferences };
  });
}
```

### 2. ⚡ **Optimize for Performance**

```javascript
// GOOD: Parallel when possible
async function loadDashboard() {
  const [user, notifications, settings] = await Promise.all([
    fetchUser(),
    fetchNotifications(),
    fetchSettings(),
  ]);
  return { user, notifications, settings };
}

// AVOID: Unnecessary sequential execution
async function loadDashboardSlow() {
  const user = await fetchUser();
  const notifications = await fetchNotifications();
  const settings = await fetchSettings();
  return { user, notifications, settings };
}
```

### 3. 🛡️ **Handle Errors Properly**

```javascript
// GOOD: Comprehensive error handling
async function robustOperation() {
  try {
    const result = await riskyOperation();
    return result;
  } catch (error) {
    console.error('Operation failed:', error.message);
    // Provide fallback or user-friendly error
    throw new Error('Service temporarily unavailable');
  }
}

// AVOID: Unhandled promise rejections
async function riskyOperation() {
  const result = await fetch('/api/data'); // No error handling!
  return result.json();
}
```

### 4. 🔄 **Use Appropriate Patterns**

```javascript
// Sequential when order matters
async function setupUserAccount(userData) {
  const user = await createUser(userData);
  const profile = await createProfile(user.id);
  const settings = await setupDefaultSettings(user.id);
  return { user, profile, settings };
}

// Parallel when independent
async function loadPageData() {
  const [header, sidebar, content] = await Promise.all([
    loadHeader(),
    loadSidebar(),
    loadContent(),
  ]);
  return { header, sidebar, content };
}
```

---

## Common Pitfalls

### 1. 🚫 **Forgetting await**

```javascript
// WRONG: Promise not awaited
async function wrongWay() {
  const data = fetch('/api/data'); // Returns Promise, not data!
  console.log(data); // [object Promise]
  return data;
}

// CORRECT: Properly awaited
async function rightWay() {
  const response = await fetch('/api/data');
  const data = await response.json();
  console.log(data); // Actual data
  return data;
}
```

### 2. 🚫 **Sequential When Could Be Parallel**

```javascript
// INEFFICIENT: Sequential execution
async function inefficient() {
  const user = await fetch('/api/user').then((r) => r.json()); // 1 second
  const posts = await fetch('/api/posts').then((r) => r.json()); // 1 second
  // Total: 2 seconds
  return { user, posts };
}

// EFFICIENT: Parallel execution
async function efficient() {
  const [user, posts] = await Promise.all([
    fetch('/api/user').then((r) => r.json()),
    fetch('/api/posts').then((r) => r.json()),
  ]);
  // Total: 1 second
  return { user, posts };
}
```

### 3. 🚫 **Improper Error Handling**

```javascript
// WRONG: Catching errors too broadly
async function tooGeneric() {
  try {
    const result = await complexOperation();
    return result;
  } catch (error) {
    return null; // Loses important error information
  }
}

// BETTER: Specific error handling
async function specificHandling() {
  try {
    const result = await complexOperation();
    return result;
  } catch (error) {
    if (error.name === 'NetworkError') {
      throw new Error('Network connection failed');
    } else if (error.name === 'ValidationError') {
      throw new Error('Invalid data provided');
    } else {
      throw error; // Re-throw unknown errors
    }
  }
}
```

---

## 📊 Async/Await vs Promises vs Callbacks

| Feature            | Callbacks            | Promises       | Async/Await |
| ------------------ | -------------------- | -------------- | ----------- |
| **Syntax**         | Nested functions     | .then() chains | Linear code |
| **Readability**    | Poor (callback hell) | Good           | Excellent   |
| **Error Handling** | Manual per callback  | .catch()       | try/catch   |
| **Debugging**      | Difficult            | Better         | Natural     |
| **Performance**    | Good                 | Good           | Good        |
| **Learning Curve** | Low                  | Medium         | Low         |

---

## 🎯 Key Takeaways

1. **Async functions always return Promises** - even if you return a regular value
2. **await can only be used inside async functions** - with the exception of top-level await in modules
3. **Use Promise.all() for parallel operations** - don't await unnecessarily in sequence
4. **Handle errors with try/catch** - much cleaner than .catch() chains
5. **Sequential for dependencies, parallel for independence** - choose the right pattern
6. **Async/await is syntactic sugar** - it's still Promises underneath
7. **Always consider performance implications** - parallel vs sequential execution

---

## 📚 Further Reading

- [MDN: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN: await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [JavaScript.info: Async/await](https://javascript.info/async-await)

---

_Ready to write cleaner asynchronous code? Start using async/await to simplify your Promise-based applications!_ 🚀
