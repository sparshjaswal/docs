---
title: "Numbers, BigInt, and Math"
sidebar_label: "Numbers, BigInt, and Math"
---

# Numbers, BigInt, and Math

JavaScript numbers can represent counts, measurements, and calculation results. Begin with ordinary `Number` values. They use binary floating-point storage, which means some decimal fractions are approximations.

1. Decide what the input means: a count, a measurement, or a large integer ID.
2. Convert text carefully and reject invalid values before calculating.
3. Use Math operations, then format the result for display.
4. Learn BigInt when you need integers outside the safe Number range.

BigInt represents integers subject to available resources; it does not represent fractional values. Neither Number nor BigInt is a built-in decimal currency type. Keep precision and display formatting separate, and leave recent specialized operations for later reference.

## Represent, validate, then calculate

Number uses binary64: many decimal fractions cannot be represented exactly, and sufficiently large integers stop being distinguishable. Safe integers range from `Number.MIN_SAFE_INTEGER` to `Number.MAX_SAFE_INTEGER` (negative and positive 2⁵³ − 1).

```js runnable
console.log(0.1 + 0.2 === 0.3);
console.log(Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2);
console.log(Number.isFinite('12'), isFinite('12'));
console.log(Number.isNaN('bad'), Number.isNaN(Number('bad')));
console.log(Number.isInteger(3.0), Number.isSafeInteger(2 ** 53));
```

```text output
false
true
false true
false true
true false
```

The ES2015 Number predicates avoid coercing input. `isInteger` asks about the value that already exists; it cannot recover precision lost when parsing. `NaN` propagates through many operations, and `NaN === NaN` is false. Signed zeros compare equal with `===` but differ under `Object.is` and reciprocal division.

## Literals and parsing

ES2015 added explicit binary (`0b1010`) and octal (`0o12`) literals alongside hexadecimal. ES2021 numeric separators improve source readability, including in BigInt literals, but are not part of a numeric string consumed by `Number`.

```js runnable
console.log(0b1010, 0o12, 0x0a, 1_000);
console.log(Number('1_000'));
console.log(Number('12px'), Number.parseInt('12px', 10));
console.log(Number.parseFloat('1.5kg'));
```

```text output
10 10 10 1000
NaN
NaN 12
1.5
```

`Number.parseInt` and `Number.parseFloat` (2015) expose the existing parsing functions on Number. Prefix parsing is useful only when it matches your input contract. Reject empty/whitespace-only input explicitly if it must not become zero. For a strict decimal grammar, validate the text before conversion and then check the finite/range constraint.

## Math methods by purpose

| Purpose | APIs | Introduced |
| --- | --- | --- |
| Signs and integer parts | `sign`, `trunc` | 2015 |
| 32-bit operations | `imul`, `clz32` | 2015 |
| Roots and magnitudes | `cbrt`, `hypot` | 2015 |
| Exponentials and logs | `expm1`, `log1p`, `log2`, `log10` | 2015 |
| Hyperbolic functions | `sinh`, `cosh`, `tanh`, `asinh`, `acosh`, `atanh` | 2015 |
| Storage precision | `fround`; `f16round` | 2015; 2025 |
| Exponentiation syntax | `**`, `**=` | 2016 |
| Accurate accumulation | `sumPrecise` | 2026 |
| Existing tools | `abs`, `floor`, `ceil`, `round`, `min`, `max`, `pow`, `sqrt`, trig, `random` | Earlier JavaScript |

`Math.trunc` removes a fractional part toward zero, while `floor` goes toward negative infinity. `Math.hypot` computes a magnitude with better scaling than naively squaring every term. `log1p(x)` and `expm1(x)` help near zero where subtracting nearly equal rounded values loses useful digits. [Number and Math specification](https://tc39.es/ecma262/2026/multipage/numbers-and-dates.html).

```js runnable
console.log(Math.trunc(-2.8), Math.floor(-2.8));
console.log(Math.hypot(3, 4));
console.log(Math.imul(0xffffffff, 5));
console.log(Math.clz32(1));
console.log(2 ** 3 ** 2, (-2) ** 2);
```

```text output
-2 -3
5
-5
31
512 4
```

Exponentiation associates to the right. Parenthesize a unary negative base: `-2 ** 2` is a syntax error. Number bitwise operations generally convert to 32-bit integers; they are unsuitable as general substitutes for rounding large values. `Math.random` is not a cryptographic randomness source; cryptographic APIs are provided by the host.

## Approximation and formatting are separate

`Number.EPSILON` (2015) is the distance between 1 and the next representable Number. A meaningful tolerance must reflect the magnitude and application. A combined absolute/relative comparison is often more useful than comparing every difference to EPSILON:

```js runnable
function approximatelyEqual(a, b, absolute, relative) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return a === b;
  return Math.abs(a - b) <= Math.max(absolute, relative * Math.max(Math.abs(a), Math.abs(b)));
}
console.log(approximatelyEqual(0.1 + 0.2, 0.3, 1e-12, 1e-10));
console.log((1.25).toFixed(1), typeof (1.25).toFixed(1));
```

```text output
true
1.3 string
```

The tolerances above belong to the exercise, not a universal policy. Formatting with `toFixed`, `toPrecision`, or Intl produces text; it does not change the arithmetic model. Consider integer minor units or a deliberate decimal representation when the domain needs exact decimal quantities, with explicit scale and rounding rules.

## BigInt arithmetic and conversion — ES2020

```js runnable
const id = BigInt('9007199254740993');
console.log(String(id + 2n));
console.log(7n / 2n, -7n / 2n);
console.log(1n == 1, 1n === 1);
console.log(BigInt.asUintN(8, 257n));
console.log(BigInt.asIntN(8, 255n));
```

```text output
9007199254740995
3n -3n
true false
1n
-1n
```

Construct from original decimal text or a literal when digits matter. `BigInt(9007199254740993)` receives an already rounded Number. Arithmetic cannot generally mix Number with BigInt; comparisons have different rules, and loose equality can compare the two. Explicit `Number(big)` conversion can lose precision. BigInt division truncates, division by zero throws, unary plus and unsigned right shift are unsupported, and Math methods require Number inputs.

`asIntN`/`asUintN` wrap to a specified bit width. BigInt64Array/BigUint64Array and DataView's 64-bit integer operations connect this type to [binary storage](./binary-data-and-shared-memory.md). Ordinary JSON.stringify rejects BigInt; choose an explicit [serialization contract](./json-and-serialization.md).

## Precise summation — ES2026

```js runnable requires=Math.sumPrecise
const values = [1e20, 1, -1e20];
console.log(values.reduce((sum, value) => sum + value, 0));
console.log(Math.sumPrecise(values));
console.log(Object.is(Math.sumPrecise([]), -0));
```

```text output
0
1
true
```

`Math.sumPrecise` accumulates the supplied Number values with one final rounding rather than repeatedly losing small contributions. It rejects non-Number elements, including numeric strings and BigInts. Empty input produces negative zero. NaN or opposing infinities can still produce NaN; overflow can still produce infinity.

It cannot restore digits already lost while creating an input, and it does not make binary floating-point into decimal arithmetic. The [summation proposal](https://github.com/tc39/proposal-math-sum) explains the accuracy goal and special values. Use the marked example's skip result to identify an unsupported runtime.

<span id="practice" />

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](./index.md#interview-preparation).

### 1. Why is Number unsafe for some integer identifiers?

<details>
<summary>Answer and worked example</summary>

Beyond the safe-integer range, distinct mathematical integers can map to the same Number. Use BigInt or a string when the contract requires exact large identifiers.

```js runnable
const limit = Number.MAX_SAFE_INTEGER;
console.log(limit + 1 === limit + 2);
const exact = BigInt(limit);
console.log(exact + 1n === exact + 2n);
console.log(Number.isSafeInteger(limit + 1));
```

**Expected output**

```text output
true
false
false
```

The equality is caused by rounding, not by the integers being mathematically equal. Constructing BigInt from an already rounded Number cannot recover lost input digits.

</details>

### 2. Does Number.EPSILON provide a universal floating-point comparison tolerance?

**Apply it:** An interviewer suggests Math.abs(a - b) < Number.EPSILON for every numeric comparison. Explain which requirements are missing.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

No. It describes spacing near 1. A useful comparison needs magnitude and domain-appropriate absolute/relative tolerances. Exact money calculations also need explicit units, overflow limits, and rounding rules; replacing === with a fixed epsilon does not define those policies.

**Requirements to establish:** the units, expected magnitude, measurement or calculation error, behavior near zero, and whether infinities or NaN are valid inputs. For finite values, a common policy compares absolute error with the larger of an absolute tolerance and a relative tolerance scaled by `max(abs(a), abs(b))`. Those tolerances come from the domain; `Number.EPSILON` does not choose them for you.

Near zero, a relative tolerance alone can be too strict. At large magnitudes, a fixed tolerance of roughly 2.22 × 10⁻¹⁶ can be far smaller than representable spacing. Validate the tolerances and account for overflow in extreme-range calculations rather than presenting the formula as universal.

For money stored in bounded integer cents, compare exact integer amounts and define rounding at conversion boundaries. For an approximate physical measurement, choose tolerances justified by the measurement. These are different contracts even though both use numbers.

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| Validate a bounded integer quantity; distinguish empty text, malformed text, infinity, and an unsafe integer. | Practice | — | — |
| Add two large integer strings without losing digits, then serialize the result as a string. | Practice | — | — |
| Compare truncation, floor, and rounding for positive/negative halves and values near zero. | Practice | — | — |
| Demonstrate input-rounding loss that precise summation cannot fix. | Practice | — | — |
| Compare Float16, Float32, and Number storage for the same fraction using the binary-data lesson. | Practice | — | — |

## Continue learning

Continue to [strings](./strings-and-regular-expressions.md), [binary data](./binary-data-and-shared-memory.md), or [the learning path](./index.md).
