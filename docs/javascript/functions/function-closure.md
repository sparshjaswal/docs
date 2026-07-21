---
id: javascript-functions-function-closure
title: "JavaScript Closures"
slug: /javascript/functions/function-closure
sidebar_label: "JavaScript Closures"
---

# JavaScript Closures

## What is a Closure?

A closure gives you access to an outer function's scope from an inner function. In JavaScript, closures are created every time a function is created.

## Basic Example

```javascript
function outerFunction(x) {
  // Outer function's variable
  let outerVariable = x;

  function innerFunction(y) {
    // Inner function can access outer variable
    console.log(outerVariable + y);
  }

  return innerFunction;
}

const addFive = outerFunction(5);
addFive(3); // Output: 8
```

## How Closures Work

```javascript
function createCounter() {
  let count = 0; // Private variable

  return function () {
    count++; // Accesses outer scope
    return count;
  };
}

const counter1 = createCounter();
const counter2 = createCounter();

console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter2()); // 1 (independent counter)
```

## Practical Use Cases

### 1. Data Privacy

```javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private variable

  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount <= balance) {
        balance -= amount;
        return balance;
      }
      return 'Insufficient funds';
    },
    getBalance() {
      return balance;
    },
  };
}

const account = createBankAccount(100);
account.deposit(50); // 150
console.log(account.balance); // undefined (private!)
```

### 2. Function Factory

```javascript
function multiplyBy(factor) {
  return function (number) {
    return number * factor;
  };
}

const double = multiplyBy(2);
const triple = multiplyBy(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

### 3. Module Pattern

```javascript
const calculator = (function () {
  let result = 0; // Private variable

  return {
    add(x) {
      result += x;
      return this;
    },
    multiply(x) {
      result *= x;
      return this;
    },
    getResult() {
      return result;
    },
    reset() {
      result = 0;
      return this;
    },
  };
})();

calculator.add(5).multiply(2).getResult(); // 10
```

## Common Pitfall: Loop with Closures

### Problem:

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i); // Prints 3, 3, 3
  }, 1000);
}
```

### Solutions:

```javascript
// Solution 1: Use let instead of var
for (let i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i); // Prints 0, 1, 2
  }, 1000);
}

// Solution 2: IIFE (Immediately Invoked Function Expression)
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j); // Prints 0, 1, 2
    }, 1000);
  })(i);
}

// Solution 3: bind method
for (var i = 0; i < 3; i++) {
  setTimeout(
    function (j) {
      console.log(j); // Prints 0, 1, 2
    }.bind(null, i),
    1000,
  );
}
```

## Key Points

- Closures preserve the environment in which they were created
- Inner functions have access to outer function variables
- Variables remain accessible even after outer function returns
- Each closure maintains its own copy of variables
- Useful for data privacy, callbacks, and module patterns

```javascript
    clickCount++;
    console.log(`${name} clicked ${clickCount} times`);

    if (clickCount >= 5) {
      console.log(`${name} has been clicked too many times!`);
      event.target.disabled = true;
    }
  };
}

// In a web page:
document.getElementById('button1').addEventListener('click',
  createClickHandler('Save Button')
);

document.getElementById('button2').addEventListener('click',
  createClickHandler('Delete Button')
);
```

### 5. 🏭 Factory Functions

Creating specialized functions:

```javascript
function createValidator(rules) {
  return function (value) {
    for (const rule of rules) {
      if (!rule.test(value)) {
        return {
          isValid: false,
          message: rule.message,
        };
      }
    }

    return { isValid: true };
  };
}

const emailValidator = createValidator([
  {
    test: (value) => value.includes('@'),
    message: 'Email must contain @',
  },
  {
    test: (value) => value.length >= 5,
    message: 'Email must be at least 5 characters',
  },
  {
    test: (value) => /\.[a-z]{2,}$/i.test(value),
    message: 'Email must have valid domain',
  },
]);

console.log(emailValidator('test@example.com')); // { isValid: true }
console.log(emailValidator('invalid')); // { isValid: false, message: ... }
```

---

## 🔧 Advanced Closure Patterns

### 🏛️ Module Pattern (Pre-ES6 Modules)

```javascript
const Calculator = (function () {
  // Private variables and functions
  let history = [];

  function addToHistory(operation, result) {
    history.push({ operation, result, timestamp: new Date() });
  }

  function validateNumber(num) {
    if (typeof num !== 'number' || isNaN(num)) {
      throw new Error('Invalid number');
    }
  }

  // Public API
  return {
    add(a, b) {
      validateNumber(a);
      validateNumber(b);
      const result = a + b;
      addToHistory(`${a} + ${b}`, result);
      return result;
    },

    subtract(a, b) {
      validateNumber(a);
      validateNumber(b);
      const result = a - b;
      addToHistory(`${a} - ${b}`, result);
      return result;
    },

    getHistory() {
      return [...history]; // Return copy, not original
    },

    clearHistory() {
      history = [];
    },
  };
})();

Calculator.add(5, 3); // 8
Calculator.subtract(10, 4); // 6
console.log(Calculator.getHistory());
// [
//   { operation: "5 + 3", result: 8, timestamp: ... },
//   { operation: "10 - 4", result: 6, timestamp: ... }
// ]

// Private functions are not accessible:
// Calculator.addToHistory(); // ❌ Error
// Calculator.validateNumber(); // ❌ Error
```

### 🔄 Function Currying

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...nextArgs) {
        return curried.apply(this, args.concat(nextArgs));
      };
    }
  };
}

// Example usage
function multiply(a, b, c) {
  return a * b * c;
}

const curriedMultiply = curry(multiply);

console.log(curriedMultiply(2)(3)(4)); // 24
console.log(curriedMultiply(2, 3)(4)); // 24
console.log(curriedMultiply(2)(3, 4)); // 24

// Partial application
const double = curriedMultiply(2);
const quadruple = double(2);

console.log(quadruple(5)); // 20 (2 * 2 * 5)
```

### ⏰ Debouncing and Throttling

```javascript
function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function throttle(func, interval) {
  let lastCallTime = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastCallTime >= interval) {
      lastCallTime = now;
      func.apply(this, args);
    }
  };
}

// Usage examples
const debouncedSave = debounce(saveData, 1000);
const throttledScroll = throttle(handleScroll, 100);

// In event handlers:
// searchInput.addEventListener('input', debouncedSave);
// window.addEventListener('scroll', throttledScroll);
```

---

## ⚠️ Common Closure Pitfalls

### 🪲 The Classic Loop Problem

```javascript
// ❌ PROBLEM: All buttons alert "3"
function createButtons() {
  const buttons = [];

  for (var i = 0; i < 3; i++) {
    buttons.push(function () {
      alert('Button ' + i); // i is 3 for all functions!
    });
  }

  return buttons;
}

const buttonHandlers = createButtons();
buttonHandlers[0](); // Alerts "Button 3" (not "Button 0"!)
buttonHandlers[1](); // Alerts "Button 3" (not "Button 1"!)
buttonHandlers[2](); // Alerts "Button 3" ✓
```

**Why this happens**: All functions share the same `i` variable, which becomes 3 after the loop finishes.

### ✅ Solutions:

#### Solution 1: IIFE (Immediately Invoked Function Expression)

```javascript
function createButtons() {
  const buttons = [];

  for (var i = 0; i < 3; i++) {
    buttons.push(
      (function (index) {
        return function () {
          alert('Button ' + index);
        };
      })(i),
    ); // Immediately invoke with current i value
  }

  return buttons;
}
```

#### Solution 2: Use `let` instead of `var`

```javascript
function createButtons() {
  const buttons = [];

  for (let i = 0; i < 3; i++) {
    // let creates new binding each iteration
    buttons.push(function () {
      alert('Button ' + i);
    });
  }

  return buttons;
}
```

#### Solution 3: Bind method

```javascript
function createButtons() {
  const buttons = [];

  for (var i = 0; i < 3; i++) {
    buttons.push(
      function (index) {
        alert('Button ' + index);
      }.bind(null, i),
    );
  }

  return buttons;
}
```

### 💾 Memory Leaks

Be careful with closures that hold references to large objects:

```javascript
// ❌ POTENTIAL MEMORY LEAK
function attachListener(element) {
  const largeData = new Array(1000000).fill('data');

  element.addEventListener('click', function () {
    // Even though we don't use largeData here,
    // the closure keeps it in memory!
    console.log('Clicked');
  });
}

// ✅ BETTER: Don't capture unnecessary variables
function attachListener(element) {
  element.addEventListener('click', function () {
    console.log('Clicked');
  });
}

// ✅ OR: Explicitly null out references when done
function attachListener(element) {
  let largeData = new Array(1000000).fill('data');

  // ... use largeData ...

  element.addEventListener('click', function () {
    largeData = null; // Release the reference
    console.log('Clicked');
  });
}
```

---

## 🧪 Practice Exercises

### Exercise 1: Counter with Reset

Create a counter function that can increment, decrement, and reset:

```javascript
function createAdvancedCounter(initialValue = 0) {
  // Your code here

  return {
    increment: /* function */,
    decrement: /* function */,
    reset: /* function */,
    getValue: /* function */
  };
}

const counter = createAdvancedCounter(10);
console.log(counter.getValue()); // 10
counter.increment();
console.log(counter.getValue()); // 11
counter.reset();
console.log(counter.getValue()); // 10
```

### Exercise 2: Private Variable Logger

Create a function that maintains a private log of all values it's called with:

```javascript
function createLogger() {
  // Your code here

  return {
    log: /* function that logs and stores messages */,
    getHistory: /* function that returns all logged messages */,
    clear: /* function that clears the history */
  };
}
```

### Exercise 3: Function Timer

Create a function that measures how long other functions take to execute:

```javascript
function createTimer() {
  // Your code here - should return a function that:
  // 1. Takes another function as argument
  // 2. Measures execution time
  // 3. Returns the result and time taken
}

const timer = createTimer();
const result = timer(() => {
  // Some expensive operation
  for (let i = 0; i < 1000000; i++) {}
  return 'done';
});
console.log(result); // { result: "done", timeMs: 5.2 }
```

---

## 🎯 Key Takeaways

1. **🔒 Privacy**: Closures provide true data privacy in JavaScript
2. **💾 State Management**: Perfect for maintaining state without global variables
3. **⚡ Performance**: Enable optimization patterns like memoization
4. **🏭 Factory Pattern**: Great for creating specialized functions
5. **⚠️ Memory Awareness**: Be mindful of what variables your closures capture
6. **🔄 Event Handling**: Excellent for maintaining state in event handlers

### 🧠 Mental Checklist for Closures:

- **What variables does my inner function need?**
- **Am I accidentally capturing large objects?**
- **Is this the right pattern for my use case?**
- **Could I solve this with classes instead?**

---

**🎓 Next Chapter**: Now that you've mastered closures, let's explore [IIFE (Immediately Invoked Function Expressions)](./function-iife.md) to see how they work together with closures to create powerful patterns!

```js
  (function (index) {
    setTimeout(() => {
      console.log(array[index]);
    }, 3000);
  })(i);
}
```

1. #### Case 2 (callback)

```js
function delay() {
  var value = 10;
  setTimeout(function () {
    console.log('this is callback function' + value);
  }, 3000);
}
delay();
```
