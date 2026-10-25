---
id: javascript-fundamentals-readme
slug: /javascript/fundamentals/README
title: "JavaScript fundamentals"
sidebar_label: "Fundamentals overview"
sidebar_position: 1
---

# JavaScript fundamentals

JavaScript is a language for giving a computer instructions. Begin with tiny programs: store a name, add two scores, and display a result. You need a browser console or Node.js; the [course setup](../index.md#run-the-examples) explains how to run an example.

1. Learn values such as text, numbers, and true/false.
2. Give a value a name with `const` or `let`.
3. Calculate a result and make a choice with a condition.
4. Learn where a name can be used and when its value becomes available.

Do one small example at a time. Change the input and predict the output before running it. The reading order below keeps scope and hoisting after you have met variables.

## Read in this order

1. [Variables: `var`, `let`, and `const`](./variables-var-let-const.md): distinguish a binding from its value.
2. [Data types and identifiers](./types-of-identifiers.md): name values and inspect their types.
3. [Conversions and coercion](./type-casting-and-coercion.md): understand equality, arithmetic, and conditions.
4. [Scope](./scope.md): determine which binding an expression reads.
5. [Hoisting and the temporal dead zone](./hoisting.md): reason about declarations before execution reaches them.
6. [Operators](../operators-and-operands.md), [control flow](../flow-of-control.md), and [loops](../loops.md): combine these rules into a program.

## Values, bindings, and objects

ECMAScript has seven primitive types: Undefined, Null, Boolean, Number, BigInt, String, and Symbol. The eighth type is Object. Arrays, functions, dates, and regular expressions are objects with different behavior; they are not separate language types. `typeof null` returns `"object"` for historical reasons, and `typeof` reports callable objects as `"function"`.

Assignment copies a value. With an object value, two bindings can refer to the same object. Reassigning one binding is different from mutating that shared object.

```js runnable
const original = { count: 1 };
let alias = original;
alias.count++;
alias = { count: 99 };
console.log(original.count);
console.log(alias.count);
console.log(typeof null, Array.isArray([]));
```

```text output
2
99
object true
```

`const` prevents reassignment of the binding; it does not freeze the object. See [objects and classes](../objects-and-classes.md) and [shallow copies](../spread-operator.md).

## Scope depends on context

A block can create a scope for `let` and `const`. A function creates a scope for its parameters and local declarations. A module has its own top-level scope. A classic browser script behaves differently from an ES module: do not assume every top-level variable becomes a property on `globalThis`. Inner code can access an outer binding unless a nearer declaration shadows it.

## Interview preparation

Practise the questions alongside their concept explanations: [Variables](variables-var-let-const.md#interview-questions) · [Types](types-of-identifiers.md#interview-questions) · [Conversions](type-casting-and-coercion.md#interview-questions) · [Scope](scope.md#interview-questions) · [Hoisting](hoisting.md#interview-questions).

Predict each worked example, explain the result, and answer its follow-up. Use the [complete interview route](../index.md#interview-preparation) to cover the remaining topics.

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](../workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 01. Running your first program {/* #workbook-01 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** run a small calculation and explain each line.

Three notebooks cost 40 each. The example names the price and quantity, multiplies them, then prints the total. Predict the result before running it. Change the quantity, save the file, and run it again.

Use the [course setup](../index.md#run-the-examples) if this is your first file. The terminal runs the file; `console.log` belongs inside it. A line starting with `//` is a comment for the reader. If your change seems to have no effect, check the saved filename and the terminal's current folder.

**Worked example**

```js
// Calculate the cost of three notebooks.
const price = 40;
const quantity = 3;
const total = price * quantity;
console.log("Total:", total);
```

**Expected output**

```text
Total: 120
```

The first two declarations give names to values. Multiplication calculates a new value. The last line prints the label and the result. Changing quantity changes the calculation without rewriting the formula.

**Trace the example step by step**

1. const price = 40 creates a binding named price with numeric value 40. The text price is an identifier; it is not printed automatically.

2. const quantity = 3 creates the second input. Multiplication reads both inputs and produces 120.

3. const total stores 120. console.log receives two arguments separated by a comma: a text label and a number.

4. The console displays Total: 120. Printing is an observable effect. It does not create a reusable result for another calculation.

**Common mistakes and how to reason about them**

Change one thing at a time. Try changing quantity, then the label, then the arithmetic operator. Predict the result before running again. If several things change together, it becomes harder to connect a changed result to its cause.

</details>

Find **01A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-01-answer">
<summary>Check your reasoning and answer</summary>

**01A.** Total: 200. The program multiplies 40 by 5.

The formula is evaluated using the new input: 40 multiplied by 5 is 200. The label stays the same because changing quantity does not change the string passed to console.log.

**01B.** Use console.log("Hello");. Without quotes, Hello is treated as a variable name.

Quotes tell the parser that Hello is literal text. Without quotes, JavaScript searches for a binding named Hello. If none exists, evaluating that identifier throws before console.log can print anything.

**01C.** Multiply width by height. The area is 24.

Area measures how many square units cover the rectangle. Each of 4 rows contains 6 units, giving 6 * 4 = 24. Named dimensions make it easy to test another rectangle without changing the formula.

**Reference code**

```js
const width = 6;
const height = 4;
console.log(width * height);
```

**Check the result**

```js
assert.equal(width * height, 24);
```

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **01A — Predict the output when quantity is 5.** | **Must fix** | [Worked example](#workbook-01) | [Answer](#workbook-01-answer) |
| **01B — Fix this instruction: console.log(Hello);. It should print the word Hello.** | **Must fix** | [Worked example](#workbook-01) | [Answer](#workbook-01-answer) |
| **01C — Write a program for a rectangle with width 6 and height 4. Print its area.** | **Must fix** | [Worked example](#workbook-01) | [Answer](#workbook-01-answer) |
| 1 — Create two bindings for one object. Mutate a property, then reassign one binding. Predict all three observations before running the program. | Practice | — | — |
| 2 — Validate an input that must be a finite Number. Reject `NaN`, `Infinity`, strings, and missing values; accept zero. | Practice | — | — |
| 3 — Write a block with an outer `count` and an inner `count`. Explain which binding each log reads. | Practice | — | — |
| 4 — Calculate a total from an array. Specify what should happen for empty input and malformed entries. | Practice | — | — |

## Next steps

Continue with [functions](../functions/README.md). Reference: [MDN JavaScript data types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures).
