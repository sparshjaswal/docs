---
id: javascript-functions-function-recursion
title: "Recursion in JavaScript"
slug: /javascript/functions/function-recursion
sidebar_label: "Recursion"
---

# Recursion in JavaScript

Recursion is solving a task by calling the same function on a smaller part of it. Opening a folder, then opening each folder inside it, is a useful way to picture the structure.

1. State the smallest case you can answer immediately: the **base case**.
2. Make one recursive call on a smaller or simpler input.
3. Explain how each call gets closer to the base case.
4. Trace the returned values back through the waiting calls.

Learn ordinary function calls first. The numeric examples assume small nonnegative integers; validate other input before applying them. Start with one short trace, then compare recursion with a loop before moving to trees or more advanced algorithms.

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

Each `slice(1)` copies a suffix, so this teaching implementation does O(n²) copying and can retain O(n²) array storage along with O(n) call frames. Passing an index avoids the suffix copies; a loop also avoids recursive stack growth.

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
   - Uses constant stack space only when the runtime implements proper tail calls for this call; do not assume this in Node or across browsers.
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
// Schematic: provide getFiles and processFile for your file-system API.
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
- A measured workload shows that an iterative implementation is more suitable

## Further Reading

- [MDN Web Docs - Recursion](https://developer.mozilla.org/en-US/docs/Glossary/Recursion)
- [Understanding Recursion in JavaScript](https://javascript.info/recursion)

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](../index.md#interview-preparation).

### 1. What must a recursive function guarantee besides a base case?

<details>
<summary>Answer and worked example</summary>

Valid inputs must make progress toward that base case. State the input domain and reject values for which the recurrence would not terminate correctly.

```js runnable
function factorial(n) {
  if (!Number.isInteger(n) || n < 0 || n > 18) {
    throw new RangeError('Expected an integer from 0 to 18');
  }
  return n === 0 ? 1 : n * factorial(n - 1);
}
console.log(factorial(0), factorial(5));
try { factorial(-1); }
catch (error) { console.log(error.name); }
```

**Expected output**

```text output
1 120
RangeError
```

Each accepted call reduces n by one. The chosen upper bound keeps the returned integer within Number’s safe range and bounds stack depth. This version uses O(n) calls and O(n) stack space.

</details>

### 2. Does rewriting a function as tail-recursive guarantee constant stack space?

**Apply it:** A recursive walk succeeds on a shallow tree but overflows on a chain of 100,000 nodes. Explain a portable repair and its space cost.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

No. Proper tail calls have language conditions and uneven engine support. For portable code with unbounded depth, use iteration or an explicit stack. Also account for work inside each call, such as copying arrays with slice.

**Repair:** use an explicit stack for a general depth-first traversal. Push the root, repeatedly pop a node, process it, and push its children. If left-to-right order matters, push children in reverse order. For a linked chain, a simple loop may be enough.

The explicit stack removes dependence on the engine’s call-stack limit; it does not make memory use disappear. A stack that holds pending nodes can use O(n) space in the worst case, such as when a root has many children. A frame-based traversal can instead track the current path, with different bookkeeping. If the input is a graph rather than a tree, add a visited policy to avoid cycling or repeated work.

**Check your explanation:** name the input structure, traversal order, termination argument, and memory bound for the implementation you actually propose. A recursive call being the last-looking line is not a portable guarantee of stack reuse.

</details>

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](../workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 19. Recursion and the call stack {/* #workbook-19 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** trace a recursive calculation down and back up.

Assume a small nonnegative integer. `factorial(0)` is the stopping case and returns 1. For `factorial(4)`, write the chain of smaller calls down to zero, then work upward through the waiting multiplications.

Use the [basic recursion explanation](#basic-concept) if you cannot identify what remains to do after a recursive call. Every call needs progress toward the stopping case. For external input, decide how to reject negative numbers and other unsupported values; also consider call-stack limits for large inputs.

**Worked example**

```js
function factorial(n) {
  if (n === 0) return 1;
  return n * factorial(n - 1);
}
console.log(factorial(4));
```

**Expected output**

```text
24
```

For nonnegative integer inputs, every call decreases n. The base value is 1 because multiplying by 1 preserves the product. For n = 4, the returned values are 1, 1, 2, 6, and 24 while the calls unwind.

**Trace the example step by step**

1. factorial(4) waits for 4 * factorial(3). The smaller calls continue until factorial(0).

2. factorial(0) returns 1 without another call. This is the stopping point.

3. factorial(1) returns 1 * 1 = 1; factorial(2) returns 2 * 1 = 2; factorial(3) returns 3 * 2 = 6.

4. factorial(4) finally returns 4 * 6 = 24. A return carries each completed result to the caller waiting for it.

Returning call Calculation Returned value

factorial(0) Base case 1

factorial(1) 1 * 1 1

factorial(2) 2 * 1 2

factorial(3) 3 * 2 6

factorial(4) 4 * 6 24

**Common mistakes and how to reason about them**

Calling the recursive function without returning or otherwise using its result can discard the answer. Missing progress can produce an endless chain of calls until the runtime throws. Do not assume a large recursion depth is portable across JavaScript engines. For deep input, a loop or an explicit stack may be more reliable.

</details>

Find **19A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-19-answer">
<summary>Check your reasoning and answer</summary>

**19A.** Subtracting 1 moves farther below zero. The function eventually exceeds the call-stack limit.

For -1, subtracting 1 gives -2, then -3, and so on. The state moves away from the base case n === 0. This violates the nonnegative-integer contract and eventually exhausts the available stack.

**19B.** Calls: 3, 2, 1, 0. Returned values: 1, 1, 2, 6.

Calls descend as 3, 2, 1, 0. Returns ascend as 1, 1, 2, 6 because each waiting call multiplies the smaller answer by its own n. Writing separate call and return sequences prevents confusing input values with results.

**19C.** The base sum is 0. For positive n, add n to the sum of the preceding integers.

The sum of no positive integers is 0. For n &gt; 0, the desired sum is n plus sumTo(n - 1). For n = 3, the calls produce 3 + (2 + (1 + 0)) = 6. Use small inputs so the lesson remains about recursion rather than numeric overflow or stack exhaustion.

**Reference code**

```js
function sumTo(n) {
  if (n === 0) return 0;
  return n + sumTo(n - 1);
}
```

**Check the result**

```js
assert.equal(sumTo(4), 10);
assert.equal(sumTo(0), 0);
```

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **19A — Explain why factorial(-1) never reaches the base case in this implementation.** | **Must fix** | [Worked example](#workbook-19) | [Answer](#workbook-19-answer) |
| **19B — Trace the calls and return values for factorial(3).** | **Must fix** | [Worked example](#workbook-19) | [Answer](#workbook-19-answer) |
| **19C — Write sumTo(n) recursively for small nonnegative integers. sumTo(0) should return 0.** | **Must fix** | [Worked example](#workbook-19) | [Answer](#workbook-19-answer) |
