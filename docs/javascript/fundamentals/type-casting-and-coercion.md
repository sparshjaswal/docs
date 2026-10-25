---
id: javascript-fundamentals-type-casting-and-coercion
slug: /javascript/fundamentals/type-casting-and-coercion
title: "Conversions, coercion, and equality"
sidebar_label: "Conversions and equality"
---

# Conversions, coercion, and equality

A form may give you the text `"12"` when you need the number `12`. **Conversion** changes how a value is represented. An explicit conversion asks for it, as in `Number(text)`. **Coercion** happens because an operator or language rule requests a conversion.

1. Learn [types and values](./types-of-identifiers.md), then compare text with numbers.
2. Convert input deliberately and check the result before calculating.
3. Separate “Is this truthy?” from “Are these values equal?” and “Is this a valid score?”
4. Trace operators such as `+` using the types of their inputs.

A **truthy** value acts like true in a condition; that does not prove it is valid input. This lesson keeps conversion, equality, and validation as separate decisions.

## A condition is not an equality test {/* #truthiness-and-equality */}

An `if` condition asks whether its value converts to true. It does not compare that value with `true` using `==` or `===`. Ordinary empty arrays and empty objects are truthy; their size is a separate property you must inspect.

```js runnable
const items = [];
console.log(Boolean(items), items.length === 0);
console.log(Boolean('0'), '0' == false, '0' === false);
console.log(Boolean('false'), Boolean(''));
```

```text output
true true
true true false
true false
```

`'0'` is a nonempty string, so it is truthy. In `'0' == false`, abstract equality applies conversion rules and eventually compares numeric zeros; strict equality instead rejects the differing types. The letters in `'false'` do not give that string Boolean meaning.

For ordinary language values, the falsy values are `false`, `undefined`, `null`, positive and negative numeric zero, `0n`, `NaN`, and the empty string. Browsers retain a special legacy exception for `document.all`; it is not a model for ordinary objects.

**Choose the question first:** use `items.length === 0` for emptiness, `value === undefined` for that exact missing value, and a documented schema for valid input. Use [nullish defaults](../operators-and-operands.md) when zero, false, or an empty string must be preserved. [MDN truthy values](https://developer.mozilla.org/en-US/docs/Glossary/Truthy).

## Parse deliberately

```js runnable
console.log(Number('42'), Number(''), Number('42px'));
console.log(Number.parseInt('42px', 10));
console.log(Boolean('false'), Boolean(''), Boolean([]));
console.log(String(null));
```

```text output
42 0 NaN
42
true false true
null
```

`Number` converts the whole string after trimming surrounding whitespace; `parseInt` can accept a numeric prefix. Neither establishes your application's input policy. For example, a form may need to reject an empty string before calling `Number`. `Boolean('false')` is true because any nonempty string is truthy.

## Turn a conversion into an input contract

“Can Number convert this?” and “does this application accept this?” are different questions. This helper accepts a nonblank string that converts to a finite Number. Because it deliberately uses Number's grammar, hexadecimal and exponent notation are accepted. A decimal-only field needs an additional grammar rule.

```js runnable
import assert from 'node:assert/strict';

function readFinite(text) {
  if (typeof text !== 'string' || text.trim() === '') {
    throw new TypeError('Expected a nonblank string');
  }
  const value = Number(text);
  if (!Number.isFinite(value)) throw new RangeError('Expected a finite number');
  return value;
}

assert.equal(readFinite(' 19.5 '), 19.5);
assert.equal(readFinite('0'), 0);
assert.equal(readFinite('1e2'), 100);
assert.equal(readFinite('0x10'), 16);
for (const text of ['', ' ', '12px', 'NaN', 'Infinity']) {
  assert.throws(() => readFinite(text));
}
assert.throws(() => readFinite(null), TypeError);
console.log('blank, malformed, finite, zero, and notation rules checked');
```

```text output
blank, malformed, finite, zero, and notation rules checked
```

`Number.isFinite` checks a number without coercing a string first. Finiteness is not safe-integer validation, a range limit, or an application unit: a port, age, price, and measurement need different additional rules. Compare the [workbook project contracts](../workbook-projects.md).

## Operators choose different conversions

```js runnable
console.log('1' + 5);
console.log('1' - 5);
console.log(0 == false, 0 === false);
console.log(null == undefined, null === undefined);
console.log(NaN === NaN, Object.is(NaN, NaN));
console.log(0 === -0, Object.is(0, -0));
```

```text output
15
-4
true false
true false
false true
true false
```

`+` can concatenate strings; numeric subtraction requests numeric operands. Abstract equality (`==`) has several conversion rules; when one operand is a Boolean it converts that Boolean to a Number, rather than converting the other operand to a Boolean. Prefer `===` when your contract does not intentionally require coercion.

Objects compare by identity. Object-to-primitive conversion can invoke `Symbol.toPrimitive`, `valueOf`, or `toString`; using plain objects as ordinary object property keys commonly converts them to the same string. Use a [Map](../collections-and-iteration.md) when object identity should be the key.

## Floating-point precision

Number uses IEEE 754 binary64 arithmetic. Many decimal fractions are not represented exactly. BigInt is a separate integer type, with different arithmetic and conversion rules.

```js runnable
console.log(0.1 + 0.2 === 0.3);
console.log((0.1 + 0.2).toFixed(2));
console.log(typeof (0.1 + 0.2).toFixed(2));
console.log(Number.isSafeInteger(9007199254740992));
```

```text output
false
0.30
string
false
```

`toFixed` formats a result as a string; it does not repair the underlying arithmetic. Approximate comparisons need a tolerance chosen for the scale and domain; blindly adding `Number.EPSILON` is not a universal fix. [Precise summation (ES2026)](../numbers-and-math.md#precise-summation--es2026) reduces accumulation error but does not create decimal arithmetic.

## Interview questions {/* #interview-questions */}

**Level: Beginner.** [How to practise](../index.md#interview-preparation).

### 1. Why do plus and minus behave differently with a numeric string?

<details>
<summary>Answer and worked example</summary>

`+` can concatenate strings after primitive conversion. Numeric subtraction converts its operands to numeric values. Strict equality does not first convert different operand types.

```js runnable
console.log('5' + 2);
console.log('5' - 2);
console.log(0 == false, 0 === false);
console.log(Boolean('false'), Number(''));
```

**Expected output**

```text output
52
3
true false
true 0
```

The nonempty string "false" is truthy. An empty string converts to zero, which is why converting a blank form input without validating it can silently accept missing data.

</details>

### 2. Should a numeric form field use parseInt or Number without validation?

**Apply it:** Implement a quantity parser that accepts only 1–3 ASCII digits representing 0 through 100. Reject spaces, units, signs, exponents, and blank input.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

Neither alone validates the field. `parseInt("12px", 10)` accepts a numeric prefix; `Number("")` accepts blank input as zero. State the permitted syntax, reject blank text, convert, then check finiteness, integer requirements, and range.

A narrow quantity field needs a narrower grammar than `Number`. Here leading zeros are allowed, and invalid input throws.

```js runnable
function readQuantity(text) {
  if (typeof text !== 'string' || !/^[0-9]{1,3}$/.test(text)) {
    throw new TypeError('Expected 1–3 digits');
  }
  const value = Number(text);
  if (value > 100) throw new RangeError('Quantity must be at most 100');
  return value;
}
for (const text of ['0', '007', '100', '', '12px', '1e2', ' 2', '2\n', '101']) {
  try {
    console.log(JSON.stringify(text), readQuantity(text));
  } catch (error) {
    console.log(JSON.stringify(text), error.name);
  }
}
```

**Expected output**

```text output
"0" 0
"007" 7
"100" 100
"" TypeError
"12px" TypeError
"1e2" TypeError
" 2" TypeError
"2\n" TypeError
"101" RangeError
```

Validate syntax first, then convert, then check the domain range. Without the multiline flag, `^` and `$` require the digits to occupy the entire input, so spaces and a final newline are rejected too. All accepted values here are safe integers because the grammar and range are bounded. If the product later permits surrounding spaces, trim explicitly and update the contract and tests together. See [MDN: input boundary assertions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Input_boundary_assertion).

</details>

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](../workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 23. Syntax coercion and equality in depth {/* #workbook-23 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** separate conversion, equality, and defaults.

Predict each output pair in the example independently. The first pair changes an operator while keeping the text input. The next pairs compare the equality rules used for `NaN` and signed zero. The final assignment tests whether zero counts as missing.

Review [operator conversions](#operators-choose-different-conversions) and [truthiness versus equality](#truthiness-and-equality). For syntax questions, use [operators and expressions](../operators-and-operands.md) and [language semantics](../language-semantics.md). Keep source code separate from data; the exercises do not need `eval` or the Function constructor.

**Worked example**

```js
console.log("5" + 2, "5" - 2);
console.log(NaN === NaN, Object.is(NaN, NaN));
console.log(Object.is(0, -0), [NaN].includes(NaN));
let count = 0;
count ??= 10;
console.log(count);
```

**Expected output**

```text
52 3
false true
false true
0
```

**Why the example works**

The first line applies two different conversion rules. The next two lines compare equality definitions. The final assignment leaves 0 untouched because it is neither null nor undefined. Read these as four separate decisions rather than memorizing one vague rule that JavaScript converts types.

</details>

Find **23A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-23-answer">
<summary>Check your reasoning and answer</summary>

**23A.** An array is an object, and every ordinary object is truthy. Its length does not participate in boolean conversion. Test length === 0 to ask whether the array is empty.

**23B.** Each method follows its own comparison rule. includes uses SameValueZero, while indexOf uses strict equality. Since NaN is not strictly equal to itself, indexOf returns -1.

**23C.** Check the representation before conversion so a blank string cannot become an accepted zero. Number.isFinite then rejects NaN and both infinities without any further coercion.

**Reference code**

```js
function readFinite(text) {
  if (typeof text !== "string" || text.trim() === "") {
    throw new TypeError("A nonblank string is required");
  }
  const value = Number(text);
  if (!Number.isFinite(value)) throw new RangeError("Not finite");
  return value;
}
```

**Check the result**

```js
assert.equal(readFinite(" 0 "), 0);
assert.equal(readFinite("-2.5"), -2.5);
assert.throws(() => readFinite(" "));
assert.throws(() => readFinite("Infinity"));
assert.throws(() => readFinite("12px"));
```

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **23A — Why is Boolean([]) true?** | **Must fix** | [Worked example](#workbook-23) | [Answer](#workbook-23-answer) |
| **23B — Why can includes find NaN when indexOf cannot?** | **Must fix** | [Worked example](#workbook-23) | [Answer](#workbook-23-answer) |
| **23C — Write readFinite(text): reject blank strings and values that do not convert to a finite number.** | **Must fix** | [Worked example](#workbook-23) | [Answer](#workbook-23-answer) |
| 1 — Convert a nonempty decimal input to a finite Number, rejecting empty and malformed strings. | Practice | — | — |
| 2 — Predict `'5' + 1`, `'5' - 1`, `Boolean('0')`, and `[] === []`. | Practice | — | — |
| 3 — Explain why formatting a price and storing a numeric price are separate operations. | Practice | — | — |

## Next steps

References: [MDN equality comparisons](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness), [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number). Continue with [operators](../operators-and-operands.md).
