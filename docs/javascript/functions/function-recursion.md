---
id: javascript-functions-function-recursion
title: Recursion in JavaScript
slug: /javascript/functions/function-recursion
sidebar_label: Recursion in JavaScript
---

# Recursion in JavaScript

Recursion is a programming pattern where a function calls itself to solve a problem by breaking it down into smaller, similar sub-problems. Each recursive function must have a base case (termination condition) and a recursive case.

## Basic Concept

A recursive function has two main components:

1. **Base Case**: The condition that stops the recursion
2. **Recursive Case**: The part where the function calls itself

## Examples

### 1. Factorial Calculation

```javascript
function factorial(num) {
  // Base case
  if (num === 0 || num === 1) {
    return 1;
  }
  // Recursive case
  return num * factorial(num - 1);
}

console.log(factorial(5)); // Output: 120
// Execution: 5 * 4 * 3 * 2 * 1 = 120
```

### 2. Fibonacci Sequence

```javascript
function fibonacci(n) {
  // Base cases
  if (n <= 1) {
    return n;
  }
  // Recursive case
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(6)); // Output: 8
// Sequence: 0, 1, 1, 2, 3, 5, 8
```

### 3. Array Sum

```javascript
function arraySum(arr) {
  // Base case
  if (arr.length === 0) {
    return 0;
  }
  // Recursive case
  return arr[0] + arraySum(arr.slice(1));
}

console.log(arraySum([1, 2, 3, 4])); // Output: 10
```

## Best Practices

1. **Always Define a Base Case**
   - Prevent infinite recursion
   - Handle edge cases properly

2. **Consider Stack Size**
   - JavaScript has a call stack limit
   - Very deep recursion can cause stack overflow

   ```javascript
   // Could cause stack overflow with large numbers
   function badRecursion(n) {
     if (n === 0) return;
     badRecursion(n - 1);
   }
   ```

3. **Tail Recursion**
   - More memory efficient
   - Keeps track of result in parameters
   ```javascript
   function factorialTail(n, accumulator = 1) {
     if (n === 0) return accumulator;
     return factorialTail(n - 1, n * accumulator);
   }
   ```

## Common Use Cases

1. **Tree Traversal**

```javascript
function traverseTree(node) {
  if (!node) return;

  console.log(node.value);
  traverseTree(node.left);
  traverseTree(node.right);
}
```

2. **Directory/File System Operations**

```javascript
function traverseDirectory(path) {
  const files = getFiles(path);

  files.forEach((file) => {
    if (file.isDirectory()) {
      traverseDirectory(file.path);
    } else {
      processFile(file);
    }
  });
}
```

## When to Use Recursion

✅ Good Use Cases:

- Hierarchical data structures (trees, graphs)
- Problems that can be broken into similar sub-problems
- Mathematical calculations (factorial, fibonacci)
- Directory traversal

❌ Avoid When:

- Dealing with deep recursion levels
- Memory is a constraint
- Iterative solution is more straightforward
- Performance is critical (loops are generally faster)

## Further Reading

- [MDN Web Docs - Recursion](https://developer.mozilla.org/en-US/docs/Glossary/Recursion)
- [Understanding Recursion in JavaScript](https://javascript.info/recursion)
