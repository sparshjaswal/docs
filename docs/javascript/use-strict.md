---
id: javascript-use-strict
slug: /javascript/use-strict
title: "Strict mode and modules"
sidebar_label: "Strict mode"
---

# Strict mode and modules

Strict mode makes several mistakes produce clear errors instead of being silently accepted. For example, accidentally assigning to an undeclared name should be caught early.

1. Run a small classic script with and without `'use strict'` and compare its behavior.
2. Place the directive before ordinary statements if you use it in a classic script.
3. Recognize that ES modules and class bodies already run in strict mode.

A **directive** is a special instruction in the source. Here it must be an unparenthesized string literal at the start of the script or function body, among any other directives. The example below shows a classic script; modules do not need the same line.

```js title="classic-script.js"
'use strict';
function readReceiver() {
  return this;
}
console.log(readReceiver()); // undefined
```

`('use strict')` is an ordinary expression, not a strict-mode directive. A directive added after other executable statements also does not enable strict mode. A bundler's output mode depends on its configuration; do not assume every emitted classic script is strict.

## Errors instead of silent failures

The following checked example runs as an ES module, so strict mode is automatic.

```js runnable
const settings = Object.freeze({ mode: 'light' });
try {
  settings.mode = 'dark';
} catch (error) {
  console.log(error.name);
}
function receiver() { return this; }
console.log(receiver() === undefined);
```

```text output
TypeError
true
```

Strict code rejects assignment to undeclared bindings and writes to non-writable properties. It forbids `with`, duplicate ordinary parameter names, and deleting a lexical binding. Deleting a non-configurable object property throws. Some are early syntax errors, so code may fail to parse before any statement runs.

## Function-level strictness

A function can have its own directive when it has a simple parameter list. A function with defaults, rest parameters, or destructuring cannot contain a `'use strict'` directive in its own body; place strictness in the surrounding script or use a module instead.

Strict mode does not freeze objects, validate input, or protect against every application bug. Its ordinary-function `this` rule also does not change an arrow's lexical `this`.

## Interview questions {/* #interview-questions */}

**Level: Beginner.** [How to practise](./index.md#interview-preparation).

### 1. What changes when an ordinary function is called without a receiver in strict mode?

<details>
<summary>Answer and worked example</summary>

Its this value remains undefined instead of being substituted with the global object. ES modules are already strict; the example also declares strictness inside the function.

```js runnable
function inspectThis() {
  'use strict';
  return this === undefined;
}
console.log(inspectThis());
console.log(inspectThis.call({}));
```

**Expected output**

```text output
true
false
```

The direct call has no receiver. call explicitly supplies an object, so the second invocation receives that object.

</details>

### 2. Does adding use strict to a block enable strict mode just for that block?

**Apply it:** Review a legacy classic script that puts "use strict" inside an if block. Decide where the directive belongs and how the answer changes for a module.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

No. A directive applies to an entire script or function body when placed in its directive prologue. Modules and class bodies have strict semantics automatically. A string expression inside an ordinary if block is not a strict-mode switch.

**Code-review answer:** a string expression inside an `if` block changes no strictness rules. Put the directive before ordinary statements in the script, or in the directive prologue of a function body with a simple parameter list. Comments before the directive are fine; an ordinary statement before it ends the directive prologue.

For a file loaded with `type="module"`, strict semantics already apply. Adding a directive does not make an individual block “more strict.” Also avoid placing a `"use strict"` directive inside a function with default, rest, or destructured parameters: that combination is a syntax error. Use a surrounding strict scope, such as a module, instead.

**Check your explanation:** distinguish a parse-time syntax error from a runtime error such as an assignment to an undeclared name. A `try` inside a file cannot rescue that file if it never parses.

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| 1 — Explain why moving `'use strict'` below a function call has no effect. | Practice | — | — |
| 2 — Compare a plain function call with `object.method()` in a module. | Practice | — | — |
| 3 — Try assigning to an undeclared name in an isolated module and identify the error type. | Practice | — | — |

## Next steps

References: [MDN strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode), [modules](./import-and-export.md), [this and classes](./objects-and-classes.md).
