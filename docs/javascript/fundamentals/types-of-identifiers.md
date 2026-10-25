---
id: javascript-fundamentals-types-of-identifiers
slug: /javascript/fundamentals/types-of-identifiers
title: "Data types and identifiers"
sidebar_label: "Data types and identifiers"
---

# Data types and identifiers

A value is a piece of data, such as `12`, `"Mira"`, or `true`. Its **type** tells JavaScript what kind of value it is. An **identifier** is a name used in code, such as `score`; the name and the value are different things.

1. Start with numbers, strings (text), and booleans (`true` and `false`).
2. Meet `undefined` and `null` as distinct values used when something is absent.
3. Compare a simple value with an object that contains several properties.
4. Return to BigInt and Symbol after ordinary values feel familiar.

A `let` binding can later receive a different type of value without changing its name. Use clear names so the intended meaning stays easy to follow.

## The eight language types

| Type | Example | `typeof` result |
| --- | --- | --- |
| Undefined | `undefined` | `"undefined"` |
| Null | `null` | `"object"` (historical behavior) |
| Boolean | `true` | `"boolean"` |
| Number | `42`, `NaN`, `Infinity` | `"number"` |
| BigInt | `42n` | `"bigint"` |
| String | `'hello'` | `"string"` |
| Symbol | `Symbol('id')` | `"symbol"` |
| Object | `{}`, `[]`, a function | `"object"`, or `"function"` for callable objects |

The first seven types are primitives. Arrays, dates, and functions are objects. The language does not promise that all primitives occupy a stack or that all objects are slower: storage and optimization are implementation details.

```js runnable
const values = [undefined, null, true, 42, 42n, 'hello', Symbol('id'), {}];
console.log(values.map(value => typeof value).join(', '));
console.log(Array.isArray([]), Number.isNaN(NaN), Number.isFinite(Infinity));
```

```text output
undefined, object, boolean, number, bigint, string, symbol, object
true true false
```

Use a check that matches your contract. `typeof value === 'number'` admits `NaN` and infinities. `value !== null && typeof value === 'object'` admits arrays and many other objects; it is not schema validation.

## Primitive values and object identity {/* #values-and-identity */}

Primitive values are immutable: an operation on a string produces a result rather than rewriting that string’s characters. A binding that holds a primitive can still be reassigned if its declaration allows it. Objects have identity and may have mutable properties; two separately created objects do not become identical because their properties look the same.

```js runnable
let word = 'cat';
const originalWord = word;
word = word.toUpperCase();
console.log(originalWord, word);

const first = { word: 'cat' };
const alias = first;
const similar = { word: 'cat' };
console.log(first === alias, first === similar);
alias.word = 'dog';
console.log(first.word, similar.word);
```

```text output
cat CAT
true false
dog cat
```

Track the object identities separately from the bindings. `alias` and `first` reach one object; `similar` reaches another. The property write changes only the shared object. Assignment copies a value in both the primitive and object cases; it does not automatically make a deep copy.

This model also explains [parameter passing](../functions/function-types.md#parameter-values), [shallow copies](../spread-operator.md), and why a Set of objects deduplicates identities rather than matching fields. See [MDN data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures).

## Valid names

Names are case-sensitive. Common names start with a letter, `_`, or `$`; later characters may include digits. JavaScript also permits Unicode identifier characters, so the rule is broader than ASCII letters. Reserved-word restrictions depend on the grammatical context and strict/module mode.

```js runnable
const $count = 2;
const _offset = 3;
const café = 4;
console.log($count + _offset + café);
```

```text output
9
```

Use descriptive `camelCase` for values and functions, and `PascalCase` for classes. Property keys have different rules: `record['first-name']` is valid even though `first-name` is not a binding name. Quoted property keys can contain spaces and punctuation.

In a module or strict script, assigning to an undeclared identifier throws a ReferenceError. Declare your bindings; accidental global creation in older sloppy scripts is a bug, not another data type.

## Interview questions {/* #interview-questions */}

**Level: Beginner.** [How to practise](../index.md#interview-preparation).

### 1. Does passing an object to a function allow the function to replace the caller’s variable?

<details>
<summary>Answer and worked example</summary>

Arguments are passed by value. For an object, that value identifies a shared object: a property mutation is visible to the caller, while rebinding the parameter is local.

```js runnable
function change(record) {
  record.count = 2;
  record = { count: 99 };
  return record.count;
}
const original = { count: 1 };
console.log(change(original), original.count);
```

**Expected output**

```text output
99 2
```

Both variables initially refer to the same object. After the local reassignment, the parameter points at a new object but original still points at the mutated first one.

</details>

### 2. How would you distinguish null, an array, and an ordinary record?

**Apply it:** Design a boundary check for a JSON user record with a nonblank string name. Decide whether null, arrays, and numeric names qualify.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

Check `value === null` first and use `Array.isArray(value)` for arrays. `typeof value === "object"` alone includes null, arrays, dates, and many other objects. Validate the fields your record contract actually requires.

For data produced by `JSON.parse`, validate the shape you will use instead of treating every object as a valid record.

```js runnable
function isUser(value) {
  return value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.hasOwn(value, 'name') &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0;
}
for (const value of [null, [], { name: 7 }, { name: ' ' }, { name: 'Asha' }]) {
  console.log(isUser(value));
}
```

**Expected output**

```text output
false
false
false
false
true
```

The checks short-circuit before any unsafe property read. This contract permits extra fields and does not trim the stored name. It is a shape check for parsed JSON, not a universal test for a “plain object” or protection against arbitrary getters and proxies. Add validation for every additional field the application consumes.

</details>

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](../workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 02. Variables types and conversion {/* #workbook-02 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** choose a declaration and convert text before doing arithmetic.

The example begins with an age stored as text. Follow these steps: convert it with `Number`, add one, then inspect both its value and type. Compare the two final calculations: does `+` receive text or numbers?

Review [variable declarations](./variables-var-let-const.md) and [conversion checks](./type-casting-and-coercion.md) when needed. Converting input is not enough to validate it: empty text, invalid text, and an out-of-range age need deliberate rules. The [type table](#the-eight-language-types) is the reference for the exercise.

**Worked example**

```js
const rawAge = "21";
let age = Number(rawAge);
age = age + 1;
console.log(age);
console.log(typeof age);
console.log("5" + 2);
console.log(Number("5") + 2);
```

**Expected output**

```text
22
number
52
7
```

The + operator concatenates when a string is involved. Explicit conversion makes the final addition numeric. NaN belongs to the number type, so typeof alone does not validate numeric input.

**Trace the example step by step**

1. rawAge initially holds a string. Number(rawAge) creates the numeric value 21; the original string is unchanged.

2. age + 1 uses numeric addition because both operands are numbers. Assignment stores the new value 22 back in age.

3. typeof age produces the string "number". typeof reports a broad type; it does not tell you whether the value is valid for your application.

4. "5" + 2 performs concatenation and produces "52". Converting "5" first changes the operation to numeric addition, producing 7.

**Common mistakes and how to reason about them**

Do not use typeof value === "number" as the only numeric check when invalid numbers are possible: NaN also has that type. Do not assume const makes an array or object read-only. Decide separately whether a name may be reassigned and whether its referenced object may be edited.

</details>

Find **02A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-02-answer">
<summary>Check your reasoning and answer</summary>

**02A.** They produce "boolean" and "undefined".

typeof returns a string describing a type. The literal true is a boolean. undefined is its own primitive value and type. The quotation marks in the written answer show that the type names themselves are strings.

**02B.** push changes the existing array. Assigning scores = [] would attempt to replace the const binding and fail.

The declaration points scores at one array. push adds an element inside that existing array, so the binding remains unchanged. Replacing scores with a new array is reassignment and is disallowed for const.

**02C.** Number converts the text; Number.isFinite checks that it is neither NaN nor an infinity. The result is 20.

Number("19.5") produces a finite numeric value. The guard allows the addition only after validation. For a reusable input routine, also specify what should happen on invalid input, such as returning null or throwing an error, instead of silently treating it as zero.

**Reference code**

```js
const amount = Number("19.5");
if (Number.isFinite(amount)) {
  console.log(amount + 0.5);
}
```

**Check the result**

```js
assert.equal(amount + 0.5, 20);
```

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **02A — What do typeof true and typeof undefined produce?** | **Must fix** | [Worked example](#workbook-02) | [Answer](#workbook-02-answer) |
| **02B — Explain why const scores = [10]; scores.push(20); works.** | **Must fix** | [Worked example](#workbook-02) | [Answer](#workbook-02-answer) |
| **02C — Convert "19.5" to a number and add 0.5. Check that the converted number is finite.** | **Must fix** | [Worked example](#workbook-02) | [Answer](#workbook-02-answer) |
| 1 — Write `isFiniteNumber(value)` and test `0`, `NaN`, `Infinity`, `'2'`, and `null`. | Practice | — | — |
| 2 — Distinguish an array from an ordinary object without checking `typeof` alone. | Practice | — | — |
| 3 — Explain why `const x = {}` and `const y = {}` produce unequal object identities. | Practice | — | — |

## Next steps

References: [MDN data structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures), [lexical grammar](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar). Next: [coercion](./type-casting-and-coercion.md).
