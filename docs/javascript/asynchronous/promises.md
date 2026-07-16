# 🤝 JavaScript Promises - Complete Guide

> **Master asynchronous programming with Promises for cleaner, more maintainable code**

## 📖 Table of Contents
- [What are Promises?](#what-are-promises)
- [Promise States](#promise-states)
- [Creating Promises](#creating-promises)
- [Consuming Promises](#consuming-promises)
- [Promise Methods](#promise-methods)
- [Promise Chaining](#promise-chaining)
- [Error Handling](#error-handling)
- [Advanced Patterns](#advanced-patterns)
- [Real-World Examples](#real-world-examples)
- [Best Practices](#best-practices)

---

## What are Promises?

A **Promise** is an object representing the eventual completion (or failure) of an asynchronous operation. It's a placeholder for a future value that allows you to write asynchronous code in a more synchronous-looking way.

### 🧠 Mental Model
> Think of a Promise like a **restaurant order receipt**:
> - You place an order (start async operation)
> - Get a receipt (Promise object)
> - Receipt has order number (pending state)
> - Eventually: food arrives (resolved) or order cancelled (rejected)
> - You can attach actions: "when ready, eat it" (.then) or "if cancelled, get refund" (.catch)

### ✨ Why Promises?

#### **Before Promises (Callback Hell)**
```javascript
// Nested callbacks - hard to read and maintain
getData(function(a) {
    getMoreData(a, function(b) {
        getEvenMoreData(b, function(c) {
            getFinalData(c, function(d) {
                // Finally use the data
                console.log(d);
            }, function(error) {
                console.error(error);
            });
        }, function(error) {
            console.error(error);
        });
    }, function(error) {
        console.error(error);
    });
}, function(error) {
    console.error(error);
});
```

#### **With Promises (Clean Chain)**
```javascript
// Clean, readable chain
getData()
    .then(a => getMoreData(a))
    .then(b => getEvenMoreData(b))
    .then(c => getFinalData(c))
    .then(d => console.log(d))
    .catch(error => console.error(error));
```

---

## Promise States

A Promise has three possible states:

```javascript
// Visual representation of Promise states
/*
┌─────────────┐
│   PENDING   │ ──┐
│ (initial)   │   │
└─────────────┘   │
                  │
        ┌─────────▼─────────┐
        │                  │
┌───────▼──────┐  ┌────────▼────────┐
│   FULFILLED  │  │    REJECTED     │
│ (resolved)   │  │    (error)      │
└──────────────┘  └─────────────────┘
*/

// Example of state transitions
const promise = new Promise((resolve, reject) => {
    console.log('State: PENDING');

    setTimeout(() => {
        const success = Math.random() > 0.5;

        if (success) {
            resolve('Success!'); // State: FULFILLED
        } else {
            reject('Error!');    // State: REJECTED
        }
    }, 1000);
});

promise
    .then(result => console.log('FULFILLED:', result))
    .catch(error => console.log('REJECTED:', error));
```

### 📊 State Properties
```javascript
// Checking Promise state (for educational purposes)
const pendingPromise = new Promise(() => {}); // Never resolves
const resolvedPromise = Promise.resolve('Done');
const rejectedPromise = Promise.reject('Failed');

// Note: You can't directly check state in production code
// Use .then()/.catch() instead
```

---

## Creating Promises

### 🆕 **Promise Constructor**

```javascript
// Basic Promise creation
const myPromise = new Promise((resolve, reject) => {
    // Async operation simulation
    const isSuccess = Math.random() > 0.5;

    setTimeout(() => {
        if (isSuccess) {
            resolve('Operation successful!'); // Fulfill the promise
        } else {
            reject(new Error('Operation failed!')); // Reject the promise
        }
    }, 1000);
});
```

### ⚡ **Promise.resolve() and Promise.reject()**

```javascript
// Create immediately resolved promise
const resolvedPromise = Promise.resolve('Immediate success');
const resolvedWithValue = Promise.resolve({ data: 'Some data' });

// Create immediately rejected promise
const rejectedPromise = Promise.reject('Immediate failure');
const rejectedWithError = Promise.reject(new Error('Something went wrong'));

// Usage
resolvedPromise.then(value => console.log(value)); // "Immediate success"
rejectedPromise.catch(error => console.log(error)); // "Immediate failure"
```

### 🔄 **Converting Callbacks to Promises**

```javascript
// Old callback-style function
function fetchDataCallback(callback) {
    setTimeout(() => {
        callback(null, 'Data fetched');
    }, 1000);
}

// Convert to Promise
function fetchDataPromise() {
    return new Promise((resolve, reject) => {
        fetchDataCallback((error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

// Modern usage
fetchDataPromise()
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

---

## Consuming Promises

### 📥 **.then() Method**

```javascript
const promise = fetch('https://api.example.com/data');

// Basic .then()
promise.then(response => {
    console.log('Response received:', response);
});

// .then() with transformation
promise
    .then(response => response.json()) // Transform response
    .then(data => {
        console.log('Parsed data:', data);
        return data.items; // Return for next .then()
    })
    .then(items => {
        console.log('Items:', items);
    });
```

### ❌ **.catch() Method**

```javascript
fetch('https://api.example.com/data')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => {
        console.error('Error occurred:', error.message);
    });
```

### 🔄 **.finally() Method**

```javascript
let loading = true;

fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => {
        console.log('Data:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        loading = false; // Always executed
        console.log('Request completed');
    });
```

---

## Promise Methods

### 🔗 **Promise.all()**
Waits for ALL promises to resolve, fails if ANY rejects.

```javascript
const promise1 = fetch('/api/users');
const promise2 = fetch('/api/posts');
const promise3 = fetch('/api/comments');

Promise.all([promise1, promise2, promise3])
    .then(responses => {
        console.log('All requests completed');
        // All responses available
        return Promise.all(responses.map(r => r.json()));
    })
    .then(([users, posts, comments]) => {
        console.log('Users:', users);
        console.log('Posts:', posts);
        console.log('Comments:', comments);
    })
    .catch(error => {
        console.error('One or more requests failed:', error);
    });

// Practical example: Loading dashboard data
async function loadDashboard() {
    try {
        const [userProfile, notifications, analytics] = await Promise.all([
            fetch('/api/profile').then(r => r.json()),
            fetch('/api/notifications').then(r => r.json()),
            fetch('/api/analytics').then(r => r.json())
        ]);

        renderDashboard({ userProfile, notifications, analytics });
    } catch (error) {
        showErrorMessage('Failed to load dashboard');
    }
}
```

### 🏁 **Promise.race()**
Resolves/rejects with the FIRST promise that settles.

```javascript
const fastAPI = fetch('/api/fast-server');
const slowAPI = fetch('/api/slow-server');

Promise.race([fastAPI, slowAPI])
    .then(response => {
        console.log('First response received');
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error('First error:', error));

// Practical example: Timeout implementation
function fetchWithTimeout(url, timeout = 5000) {
    const fetchPromise = fetch(url);
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
    );

    return Promise.race([fetchPromise, timeoutPromise]);
}

// Usage
fetchWithTimeout('/api/data', 3000)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => {
        if (error.message === 'Request timeout') {
            console.log('Request took too long');
        } else {
            console.log('Request failed:', error);
        }
    });
```

### 🎯 **Promise.allSettled()**
Waits for ALL promises to settle, returns results for all.

```javascript
const promises = [
    fetch('/api/user/1'),
    fetch('/api/user/2'),
    fetch('/api/user/999'), // This might fail
    fetch('/api/user/3')
];

Promise.allSettled(promises)
    .then(results => {
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                console.log(`Promise ${index} succeeded:`, result.value);
            } else {
                console.log(`Promise ${index} failed:`, result.reason);
            }
        });
    });

// Practical example: Batch operations with partial failures
async function syncUsers(userIds) {
    const syncPromises = userIds.map(id =>
        fetch(`/api/sync-user/${id}`).catch(err => ({ error: err, userId: id }))
    );

    const results = await Promise.allSettled(syncPromises);

    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Sync completed: ${succeeded} succeeded, ${failed} failed`);
    return results;
}
```

### 🥇 **Promise.any()**
Resolves with the FIRST successful promise, rejects only if ALL fail.

```javascript
const mirrors = [
    fetch('https://api1.example.com/data'),
    fetch('https://api2.example.com/data'),
    fetch('https://api3.example.com/data')
];

Promise.any(mirrors)
    .then(response => {
        console.log('Got data from fastest working mirror');
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => {
        console.error('All mirrors failed:', error);
    });
```

---

## Promise Chaining

### 🔗 **Linear Chaining**

```javascript
// Each .then() receives the return value of the previous .then()
fetch('/api/user')
    .then(response => {
        console.log('1. Response received');
        return response.json(); // Return promise
    })
    .then(user => {
        console.log('2. User data parsed:', user);
        return fetch(`/api/user/${user.id}/posts`); // Return another promise
    })
    .then(response => {
        console.log('3. Posts response received');
        return response.json();
    })
    .then(posts => {
        console.log('4. Posts data:', posts);
        return posts.map(post => post.title); // Return regular value
    })
    .then(titles => {
        console.log('5. Post titles:', titles);
    })
    .catch(error => {
        console.error('Error in chain:', error);
    });
```

### 🌿 **Branching Chains**

```javascript
const userPromise = fetch('/api/user').then(r => r.json());

// Branch 1: Get user posts
const postsPromise = userPromise
    .then(user => fetch(`/api/user/${user.id}/posts`))
    .then(r => r.json());

// Branch 2: Get user followers
const followersPromise = userPromise
    .then(user => fetch(`/api/user/${user.id}/followers`))
    .then(r => r.json());

// Combine results
Promise.all([userPromise, postsPromise, followersPromise])
    .then(([user, posts, followers]) => {
        console.log('User profile:', { user, posts, followers });
    });
```

---

## Error Handling

### 🎯 **Error Propagation**

```javascript
fetch('/api/data')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        if (!data.valid) {
            throw new Error('Invalid data received');
        }
        return processData(data);
    })
    .then(result => {
        console.log('Success:', result);
    })
    .catch(error => {
        // Catches errors from any step above
        console.error('Error in chain:', error.message);

        // Different handling based on error type
        if (error.message.includes('HTTP 404')) {
            showNotFoundMessage();
        } else if (error.message.includes('Invalid data')) {
            showDataErrorMessage();
        } else {
            showGenericErrorMessage();
        }
    });
```

### 🔄 **Error Recovery**

```javascript
fetch('/api/primary-data')
    .catch(() => {
        console.log('Primary API failed, trying backup...');
        return fetch('/api/backup-data');
    })
    .catch(() => {
        console.log('Backup API failed, using cached data...');
        return getCachedData();
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data obtained:', data);
    })
    .catch(error => {
        console.error('All data sources failed:', error);
        showOfflineMessage();
    });
```

### 🔁 **Retry Logic**

```javascript
function fetchWithRetry(url, options = {}, retries = 3) {
    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response;
        })
        .catch(error => {
            if (retries > 0) {
                console.log(`Retrying... ${retries} attempts left`);
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve(fetchWithRetry(url, options, retries - 1));
                    }, 1000); // Wait 1 second before retry
                });
            } else {
                throw error;
            }
        });
}

// Usage
fetchWithRetry('/api/unreliable-endpoint')
    .then(response => response.json())
    .then(data => console.log('Data:', data))
    .catch(error => console.error('Failed after retries:', error));
```

---

## Advanced Patterns

### 🏭 **Promise Factories**

```javascript
// Create promises on demand
function createDelayedPromise(value, delay) {
    return () => new Promise(resolve => {
        setTimeout(() => resolve(value), delay);
    });
}

// Sequential execution of promise factories
async function executeSequentially(factories) {
    const results = [];
    for (const factory of factories) {
        const result = await factory();
        results.push(result);
    }
    return results;
}

// Usage
const tasks = [
    createDelayedPromise('Task 1', 1000),
    createDelayedPromise('Task 2', 500),
    createDelayedPromise('Task 3', 800)
];

executeSequentially(tasks)
    .then(results => console.log('Sequential results:', results));
```

### 🎯 **Promise Pools (Concurrency Limiting)**

```javascript
class PromisePool {
    constructor(limit = 3) {
        this.limit = limit;
        this.running = 0;
        this.queue = [];
    }

    async add(promiseFactory) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                promiseFactory,
                resolve,
                reject
            });
            this.process();
        });
    }

    async process() {
        if (this.running >= this.limit || this.queue.length === 0) {
            return;
        }

        this.running++;
        const { promiseFactory, resolve, reject } = this.queue.shift();

        try {
            const result = await promiseFactory();
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            this.running--;
            this.process();
        }
    }
}

// Usage
const pool = new PromisePool(2); // Max 2 concurrent requests

const urls = [
    '/api/data1',
    '/api/data2',
    '/api/data3',
    '/api/data4',
    '/api/data5'
];

const promises = urls.map(url =>
    pool.add(() => fetch(url).then(r => r.json()))
);

Promise.all(promises)
    .then(results => console.log('All data:', results));
```

### 📊 **Promise Memoization**

```javascript
function memoizePromise(fn) {
    const cache = new Map();

    return function(...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const promise = fn.apply(this, args);
        cache.set(key, promise);

        // Remove from cache if promise rejects
        promise.catch(() => cache.delete(key));

        return promise;
    };
}

// Usage
const fetchUser = memoizePromise(async (userId) => {
    console.log(`Fetching user ${userId}...`);
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
});

// First call: makes API request
fetchUser(1).then(user => console.log('User 1:', user));

// Second call: returns cached promise
fetchUser(1).then(user => console.log('User 1 (cached):', user));
```

---

## Real-World Examples

### 📱 **Loading Screen with Progress**

```javascript
class LoadingManager {
    constructor() {
        this.tasks = [];
        this.completed = 0;
    }

    addTask(name, promise) {
        this.tasks.push({ name, promise });
        this.updateProgress();

        promise.finally(() => {
            this.completed++;
            this.updateProgress();
        });

        return promise;
    }

    updateProgress() {
        const progress = (this.completed / this.tasks.length) * 100;
        document.querySelector('.progress-bar').style.width = `${progress}%`;
        document.querySelector('.progress-text').textContent =
            `Loading... ${this.completed}/${this.tasks.length}`;
    }

    async loadAll() {
        const results = await Promise.allSettled(
            this.tasks.map(task => task.promise)
        );

        document.querySelector('.loading-screen').style.display = 'none';
        return results;
    }
}

// Usage
const loader = new LoadingManager();

loader.addTask('User Profile', fetch('/api/profile').then(r => r.json()));
loader.addTask('Dashboard Data', fetch('/api/dashboard').then(r => r.json()));
loader.addTask('Notifications', fetch('/api/notifications').then(r => r.json()));

loader.loadAll().then(results => {
    console.log('Application loaded', results);
});
```

### 🔄 **Auto-retry with Exponential Backoff**

```javascript
class ApiClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}, retries = 3) {
        const url = `${this.baseURL}${endpoint}`;

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url, {
                    ...options,
                    timeout: 5000
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                return await response.json();

            } catch (error) {
                const isLastAttempt = attempt === retries;

                if (isLastAttempt) {
                    throw new Error(`Request failed after ${retries + 1} attempts: ${error.message}`);
                }

                // Exponential backoff: 1s, 2s, 4s, 8s...
                const delay = Math.pow(2, attempt) * 1000;
                console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);

                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
}

// Usage
const api = new ApiClient('https://api.example.com');

api.request('/users')
    .then(users => console.log('Users:', users))
    .catch(error => console.error('Failed to fetch users:', error));
```

---

## Best Practices

### 1. 🎯 **Always Handle Errors**
```javascript
// BAD: Unhandled promise rejection
fetch('/api/data').then(data => console.log(data));

// GOOD: Proper error handling
fetch('/api/data')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Request failed:', error));
```

### 2. 🔄 **Return Promises in .then()**
```javascript
// BAD: Breaking the chain
fetch('/api/user')
    .then(response => {
        response.json().then(user => {
            console.log(user); // Nested promise
        });
    });

// GOOD: Proper chaining
fetch('/api/user')
    .then(response => response.json())
    .then(user => console.log(user));
```

### 3. 🎭 **Use Promise.all() for Independent Operations**
```javascript
// BAD: Sequential when could be parallel
const user = await fetch('/api/user').then(r => r.json());
const posts = await fetch('/api/posts').then(r => r.json());
const comments = await fetch('/api/comments').then(r => r.json());

// GOOD: Parallel execution
const [user, posts, comments] = await Promise.all([
    fetch('/api/user').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/comments').then(r => r.json())
]);
```

### 4. 🔒 **Don't Mix Async/Await with .then()**
```javascript
// BAD: Mixing patterns
async function fetchData() {
    const response = await fetch('/api/data');
    return response.json().then(data => data.items);
}

// GOOD: Consistent async/await
async function fetchData() {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data.items;
}
```

---

## 📊 Promise vs Callback vs Async/Await

| Feature | Callbacks | Promises | Async/Await |
|---------|-----------|----------|-------------|
| **Readability** | Poor (callback hell) | Good | Excellent |
| **Error Handling** | Manual per callback | .catch() | try/catch |
| **Composability** | Difficult | Good | Excellent |
| **Debugging** | Hard | Better | Best |
| **Learning Curve** | Low | Medium | Medium |

---

## 🎯 Key Takeaways

1. **Promises solve callback hell** with cleaner, more readable code
2. **Three states**: pending, fulfilled, rejected
3. **Always handle errors** with .catch() or try/catch
4. **Chain operations** with .then() for sequential execution
5. **Use Promise.all()** for parallel independent operations
6. **Promise.race()** for timeout or fastest response scenarios
7. **Convert callbacks to promises** for better code organization
8. **Combine with async/await** for even cleaner syntax

---

## 📚 Further Reading

- [MDN: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Promises/A+ Specification](https://promisesaplus.com/)
- [JavaScript.info: Promises](https://javascript.info/promise-basics)

---

*Ready to write better asynchronous code? Start using Promises to eliminate callback hell today!* 🚀
