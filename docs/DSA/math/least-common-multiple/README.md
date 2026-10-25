---
id: dsa-math-least-common-multiple-readme
title: "Least common multiple"
slug: /DSA/math/least-common-multiple/README
sidebar_label: "Least common multiple"
---

# LCM: when two repetitions meet

**Practice focus:** List two repeating schedules, find their first shared time, then derive the GCD-based calculation.

**Prerequisite:** [GCD and Euclid's algorithm](../euclidean-algorithm/README.md). A **multiple** is the result of multiplying an integer by another integer. For positive inputs, the **least common multiple** (LCM) is the smallest positive number that is a multiple of both.

One bell rings every 4 minutes; another rings every 6. Starting together, when do they next ring together?

```text
Minutes:  0   2   4   6   8  10  12
4-minute: |       |       |       |
6-minute: |           |           |
                                 ^ next meeting
```

The first common positive time is 12. Use LCM for synchronized cycles, finding common denominators, or forming a quantity divisible by several group sizes.

## From scanning multiples to using GCD

Listing multiples works for small examples, but the first meeting may be large. Factorization explains a faster rule: the GCD uses the smaller exponent of each shared prime; the LCM uses the larger. Together those exponents add up to the exponents in the product `a × b`. Thus, for positive integers, `gcd(a, b) × lcm(a, b) = a × b`.

Compute `(a / gcd(a, b)) × b`, dividing first to keep the intermediate smaller. This does **not** guarantee a safe `Number` result. The example uses `BigInt` so even the final product is exact. By programming convention the LCM is zero if either input is zero; absolute values handle negative inputs.

```js runnable
function gcdBigInt(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

function lcm(a, b) {
  if (a === 0n || b === 0n) return 0n;
  const result = (a / gcdBigInt(a, b)) * b;
  return result < 0n ? -result : result;
}

console.log(lcm(4n, 6n).toString());
console.log(lcm(-4n, 6n).toString());
console.log(lcm(0n, 0n).toString());
console.log(lcm(1000000007n, 1000000009n).toString());
```

```text output
12
12
0
1000000016000000063
```

An `n` after an integer literal creates a `BigInt`. Do not mix it with `Number` arithmetic. Read large input tokens directly with `BigInt(token)`; converting them to `Number` first could already lose digits. `.toString()` produces judge-friendly decimal output.

The GCD needs O(log(min(|a|, |b|))) remainder steps for nonzero inputs, followed by one division and one multiplication. BigInt operation costs grow with operand size; this is an arithmetic-operation count. The algorithm holds a constant number of integer values, whose storage grows with their bit lengths.

## Check and extend

1. Predict the result for 5 and 7; then for 5 and 10.
2. Find the LCM of 4, 6, and 10 using two calls.
3. Why must the zero check happen before division?

<details>
<summary>Hint</summary>

Reduce repeated events two at a time. Remember that `gcd(0, 0)` is zero in this implementation.

</details>

<details>
<summary>Answers</summary>

1. The answers are 35 and 10. Coprime numbers share no prime factor, so their LCM is their product; if one divides the other, the larger number is already the LCM.
2. `lcm(lcm(4n, 6n), 10n)` is `lcm(12n, 10n)`, which is 60.
3. Otherwise the `(0, 0)` input would divide by zero. Defining its LCM as zero also makes accumulation predictable.

</details>

[Math learning order](../README.md)

**Next:** [Modular arithmetic: keep only the remainder](../modular-arithmetic/README.md).
