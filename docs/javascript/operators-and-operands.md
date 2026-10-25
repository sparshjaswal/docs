---
id: javascript-operators-and-operands
slug: /javascript/operators-and-operands
title: "Operators and expressions"
sidebar_label: "Operators and expressions"
---

# Operators and expressions

An operator performs an operation, such as `+` in `2 + 3`. The values it works on are **operands**. The whole calculation is an **expression** because it produces a value.

1. Start with arithmetic and comparisons, predicting each result.
2. Use parentheses to make grouping clear before studying precedence rules.
3. Compare `&&`, `||`, and `??` using zero, empty text, `null`, and `undefined`.
4. Learn optional chaining when reading properties that may be missing.

**Short-circuiting** means an operation can skip an expression it does not need to evaluate. A statement, such as an `if` or a declaration, organizes the work rather than simply naming one resulting value.

## Operators to recognize

| Group | Examples | Watch for |
| --- | --- | --- |
| Arithmetic | `+`, `-`, `*`, `/`, `%`, `**` | `+` can concatenate strings; `%` is remainder |
| Comparison | `===`, `!==`, `<`, `<=`, `>`, `>=` | Prefer deliberate types; loose equality coerces |
| Logical | `&&`, `\|\|`, `!`, `??` | `&&`, `\|\|`, and `??` select operands; `!` returns a Boolean |
| Assignment | `=`, `+=`, `&&=`, `\|\|=`, `??=` | Logical assignment short-circuits |
| Access | `.`, `[]`, `?.` | Optional chaining only protects nullish links |
| Bitwise | `&`, `\|`, `^`, `~`, `<<`, `>>`, `>>>` | Number bitwise operations generally use 32-bit integers |
| Other | `typeof`, `in`, `instanceof`, `delete`, `?:` | Each answers a different question about values/objects |

## Preserve meaningful falsy values

```js runnable
const settings = { retries: 0, name: '' };
console.log(settings.retries || 3);
console.log(settings.retries ?? 3);
console.log(settings.profile?.city ?? 'Unknown');
```

```text output
3
0
Unknown
```

Use a truthiness default only when zero, false, and empty strings should all trigger the fallback. Use a nullish default when only `null` and `undefined` mean missing.

## Equality and precedence

```js runnable
console.log(2 + 3 * 4);
console.log((2 + 3) * 4);
console.log('5' === 5);
console.log(Object.is(NaN, NaN));
console.log(Object.is(0, -0));
```

```text output
14
20
false
true
false
```

Parentheses make intent explicit. `===` does not equate NaN with itself; `Object.is` does and distinguishes signed zero. Array `includes` uses a third relation, SameValueZero, which treats signed zero as equal.

## Logical assignment and evaluation order — ES2021

```js runnable
const options = { retries: 0, label: '', enabled: true };
let defaults = 0;
options.retries ??= (++defaults, 3);
options.label ||= 'Untitled';
options.enabled &&= false;
console.log(options.retries, options.label, options.enabled, defaults);
```

```text output
0 Untitled false 0
```

The right-hand expression runs only if the selected condition requires assignment. The left-hand reference is evaluated once, which matters with getters and computed keys. Use ??= for null/undefined, ||= for every falsy value, and &&= when replacing an existing truthy value.

## Optional chaining boundaries — ES2020

Optional chaining applies to property access (`value?.key`), computed access (`value?.[key]`), and calls (`callback?.()`). It only short-circuits a nullish value; a present non-callable value still throws when called. It does not catch a getter's exception or make an undeclared name safe. A continuous chain stops, but grouping can end the protection: `(user?.address).city` may throw.

Mixing ?? directly with && or || without grouping is a syntax error. Parenthesize the intended grouping and test zero, false, empty string, null, and undefined separately. Optional chaining is not an assignment target.

## Interview questions {/* #interview-questions */}

**Level: Beginner.** [How to practise](./index.md#interview-preparation).

### 1. When should a default use nullish coalescing instead of logical OR?

<details>
<summary>Answer and worked example</summary>

Use `??` when only null and undefined mean missing. `||` falls back for every falsy value, including a legitimate zero or empty string.

```js runnable
const quantity = 0;
console.log(quantity || 10, quantity ?? 10);
const user = null;
let reads = 0;
console.log(user?.[reads++], reads);
```

**Expected output**

```text output
10 0
undefined 0
```

The nullish receiver short-circuits the optional property access, so the index expression is not evaluated. These operators choose behavior for missing values; they do not validate arbitrary data.

</details>

### 2. Does optional chaining protect every operation in an expression?

**Apply it:** Predict the behavior of a continuous optional chain, a grouped chain, and an optional call on a present number.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

No. An undeclared root still throws, a present non-callable value still cannot be called, and `(user?.profile).name` tries to read name from undefined when user is nullish. Keep the optional chain continuous where absence is allowed.

Optional chaining checks for `null` or `undefined` at its optional boundary; it does not validate the whole data model.

```js runnable
const user = null;
console.log(user?.profile.name);
try {
  console.log((user?.profile).name);
} catch (error) {
  console.log(error.name);
}
try {
  ({ save: 42 }).save?.();
} catch (error) {
  console.log(error.name);
}
```

**Expected output**

```text output
undefined
TypeError
TypeError
```

The first chain stops at `user` and skips the rest. Grouping finishes that chain, leaving an ordinary `.name` read on `undefined`. The optional call only skips a nullish `save`; 42 is present but not callable. If `user` exists and `profile` may be absent, use `user?.profile?.name`. Use validation when a missing field indicates corrupt data rather than an optional feature.

</details>

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](./workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 03. Operators equality and missing values {/* #workbook-03 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** choose a fallback without losing a valid zero.

A score of zero is a real result. Before running the example, predict whether `||` and `??` preserve it. Then compare a number with text, calculate a remainder, and read a missing address.

Use [missing-value defaults](#preserve-meaningful-falsy-values) and [optional chaining](#optional-chaining-boundaries--es2020) as your reference. Ask two separate questions: “Can I read this property?” and “Which missing values should receive a fallback?” Parentheses can make a longer expression's intended grouping clear.

**Worked example**

```js
const score = 0;
console.log(score || 10);
console.log(score ?? 10);
console.log(5 === "5");
console.log(7 % 2);
const user = { name: "Mira" };
console.log(user.address?.city ?? "Unknown");
```

**Expected output**

```text
10
0
false
1
Unknown
```

The first default replaces a valid zero because zero is falsy. The second preserves it. Optional chaining returns undefined for the missing address, and ?? supplies the fallback label.

**Trace the example step by step**

1. score &#124;&#124; 10 examines whether 0 is truthy. It is not, so the result is the fallback 10.

2. score ?? 10 asks whether score is null or undefined. It is neither, so the result stays 0.

3. 5 === "5" is false because the operands have different types. 7 % 2 is 1 because dividing 7 by 2 leaves a remainder of 1.

4. user.address is undefined. The optional lookup of city stops, producing undefined, and the final ?? supplies "Unknown".

**Common mistakes and how to reason about them**

Do not confuse =, which assigns, with ===, which compares. Do not assume an empty collection is falsy; use array.length when checking whether it contains elements. Optional chaining is useful for permitted missing data, but it should not hide a property that your program actually requires.

</details>

Find **03A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-03-answer">
<summary>Check your reasoning and answer</summary>

**03A.** true and false. An empty array is still an object and is truthy.

An array is an object, and ordinary objects are truthy regardless of their size. An empty string is one of the falsy primitives. For a collection, distinguish the question "does this value exist?" from "does this collection contain anything?".

**03B.** Use const actual = volume ?? 50;. It preserves 0.

Using ?? preserves an explicit zero and supplies 50 only when the value is null or undefined. If values such as -1 are invalid, validate them separately; a default operator is not a complete range check.

**03C.** A number is even when division by 2 leaves a remainder of zero.

Even integers divide into pairs with no remainder. The test works for 8 and -4, giving true, and for 7, giving false. JavaScript may produce negative zero as a remainder, but negative zero is strictly equal to zero.

**Reference code**

```js
function isEven(n) {
  return n % 2 === 0;
}
```

**Check the result**

```js
assert.equal(isEven(8), true);
assert.equal(isEven(7), false);
assert.equal(isEven(-4), true);
```

</details>

<span id="practice" />

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **03A — Predict Boolean([]) and Boolean("").** | **Must fix** | [Worked example](#workbook-03) | [Answer](#workbook-03-answer) |
| **03B — A volume setting can be 0. Fix const actual = volume &#124;&#124; 50; so a missing setting still defaults to 50.** | **Must fix** | [Worked example](#workbook-03) | [Answer](#workbook-03-answer) |
| **03C — Write isEven(n) for integer inputs. Test 8, 7, and -4.** | **Must fix** | [Worked example](#workbook-03) | [Answer](#workbook-03-answer) |
| Write a default expression preserving all non-nullish inputs. | Practice | — | — |
| Predict `2 ** 3 ** 2`; explain right-associative exponentiation. | Practice | — | — |
| Explain why `typeof null` is `'object'` but null is a primitive value. | Practice | — | — |

## Continue learning

Continue with [numbers and Math](./numbers-and-math.md) for exponentiation and numeric conversions. Reference: [expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators).
