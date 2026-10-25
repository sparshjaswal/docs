---
id: javascript-fundamentals-hoisting
title: "JavaScript Hoisting"
slug: /javascript/fundamentals/hoisting
sidebar_label: "Hoisting"
---

# JavaScript Hoisting

A name can be declared in your code without being ready to read at every earlier line. **Hoisting** is the common name for the effects of how JavaScript prepares declarations before running the surrounding code.

1. Use [scope lookup](./scope.md#scope-chain) to find which declaration a name refers to.
2. Ask whether that declaration has been initialized, meaning given its initial usable value.
3. Compare a function declaration, a `var` declaration, and a `let` or `const` declaration.
4. Predict whether an early read gives a value, `undefined`, or an error.

Do not picture the engine physically moving lines of source code. The examples show the observable behavior. Learn declarations and scope first, then use this lesson to explain early calls and reads.

## What is Hoisting?

Use two separate questions for every early read:

1. Which declaration does the name refer to?
2. Has that declaration received its initial usable value yet?

An uninitialized binding is not the same as a binding whose value is `undefined`. The first cannot be read yet; the second can. Compare the two traces below instead of memorizing the word “hoisted”.

## Variable Hoisting

### var Hoisting

```js runnable
function inspect() {
  console.log(score);
  var score = 7;
  console.log(score);
}
inspect();
```

```text output
undefined
7
```

The call’s `score` binding starts initialized to `undefined`. The first log reads that value. Reaching `var score = 7` evaluates the initializer and assigns 7. No assignment of 7 happens at the earlier log.

### let and const Hoisting (Temporal Dead Zone)

```js runnable
try {
  console.log(score);
} catch (error) {
  console.log(error.name);
}
let score;
console.log(score);
score = 7;
console.log(score);
```

```text output
ReferenceError
undefined
7
```

Before the `let` declaration executes, `score` is uninitialized. `let score;` then initializes it to `undefined`; the later assignment changes its value to 7. A `const` or class binding also has an uninitialized interval, although an ordinary `const` declaration must provide an initializer.

The **temporal dead zone** is about execution timing, not simply text above a declaration. A function may mention a later lexical binding and safely read it if the function is called after that binding is initialized.

## Function Hoisting

### Function Declarations

```js runnable
console.log(greet('Asha'));
function greet(name) {
  return `Hello, ${name}`;
}
```

```text output
Hello, Asha
```

This top-level module function declaration is initialized with a function before the call executes. Block-level declarations, legacy sloppy-script behavior, and conflicting declarations require their own scope rules; do not generalize this example to every declaration named “function.”

### Function Expressions

```js runnable
try {
  expression();
} catch (error) {
  console.log(error.name);
}
var expression = function () { return 'ready'; };
console.log(expression());
```

```text output
TypeError
ready
```

Reading `expression` succeeds and yields `undefined`. Calling that value fails because it is not callable. The function expression creates the function only when its initializer evaluates. If the declaration used `const`, the early **read** would fail with `ReferenceError` before any call could occur.

### Arrow Functions

An arrow is also an expression. Its containing declaration determines early-read behavior: a `var` binding may contain `undefined`; a `let` or `const` binding is uninitialized before its declaration. Arrows do not acquire function-declaration initialization behavior because their value is callable later.

## Practical Examples

### Example 1: Variable Hoisting

Use a binding-state trace instead of pretending the engine rewrites the file. For the `var score` example above, the state is `undefined → 7`. For the `let score` example, it is `uninitialized → undefined → 7`. Only the second sequence has a period when a read of that binding must throw.

### Example 2: Function vs Variable

In a classic script, a function declaration and a `var` declaration can share a name under rules that differ from module top-level declarations. A later assignment can replace the callable value. Avoid using this collision as a design technique; use distinct names and identify the script/module context when analyzing legacy code. See [MDN function declaration rules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function#description).

### Example 3: Scope and Hoisting

```js runnable
const label = 'outer';
function readLater() {
  return value;
}
function shadowed() {
  console.log(label);
  var label = 'inner';
  console.log(label);
}
const value = 9;
console.log(readLater());
shadowed();
console.log(label);
```

```text output
9
undefined
inner
outer
```

`readLater` mentions `value` earlier in the source but is called after initialization, so its read succeeds. `shadowed` selects its local `var label` on both reads; it never falls back to the outer constant. The first local read sees `undefined`, and the final module-level read still sees `"outer"`.

## Best Practices

Initialize data before a path can read it. Keep declarations close to their use, and choose `const` unless reassignment is required. Function declarations may intentionally appear below a high-level caller; clarity depends on the program’s structure, not an absolute ban on calling a function declared later.

## Common Gotchas

### Loop with var

Callbacks from a `var` loop share one loop binding. This is a closure-and-scope issue, not a timer copying the wrong value. Use the [loop binding walkthrough](../functions/function-closure.md#loop-callbacks-one-binding-or-one-per-iteration) to compare `var` with per-iteration `let` bindings without waiting for timers.

### Multiple Declarations

Repeating a lexical declaration in the same scope can prevent the file from parsing at all. That `SyntaxError` is different from a `ReferenceError` raised by executing an early read. Also, `typeof missingName` can return `"undefined"`, but `typeof` on a binding in its temporal dead zone throws; the interview example below demonstrates both cases.

## Key Takeaways

For any early read or call, ask three questions: **which binding is selected, is it initialized, and is its value callable if a call is attempted?** Those questions explain the results without memorizing that some declarations “move” and others do not.

References: [MDN hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting), [MDN temporal dead zone](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone_tdz), and [ECMAScript 2015 declarations](https://262.ecma-international.org/6.0/#sec-declarations-and-the-variable-statement).

## Interview questions {/* #interview-questions */}

**Level: Beginner.** [How to practise](../index.md#interview-preparation).

### 1. Why can an early read return undefined for var but throw for let?

<details>
<summary>Answer and worked example</summary>

The var binding is initialized to undefined during setup. A lexical binding exists but remains uninitialized until its declaration executes.

```js runnable
function inspect() {
  console.log(count);
  var count = 3;
  try { console.log(label); }
  catch (error) { console.log(error.name); }
  let label = 'ready';
  console.log(count, label);
}
inspect();
```

**Expected output**

```text output
undefined
ReferenceError
3 ready
```

The first read does not read the later initializer. The caught error lets execution reach the lexical declaration; only then does label become readable.

</details>

### 2. Does typeof always avoid a ReferenceError?

**Apply it:** Compare typeof on an undeclared name with typeof on a local name whose declaration has not executed.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

No. `typeof missingName` can return "undefined" for an undeclared name, but `typeof` on a lexical binding in its temporal dead zone throws. Function expressions also follow the initialization rules of their containing binding.

Run this as a standalone module where `missingInterviewName` has not been declared.

```js runnable
console.log(typeof missingInterviewName);
try {
  console.log(typeof value);
} catch (error) {
  console.log(error.name);
}
let value = 3;
console.log(typeof value);
```

**Expected output**

```text output
undefined
ReferenceError
number
```

`typeof` has special behavior for an unresolvable name, but it still reads a resolved lexical binding. That read fails while the binding is uninitialized. “The declaration moves to the top” misses this distinction: describe binding creation and initialization separately.

</details>
