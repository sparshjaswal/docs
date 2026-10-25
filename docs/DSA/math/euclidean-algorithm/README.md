---
id: dsa-math-euclidean-algorithm-readme
title: "Euclidean algorithm"
slug: /DSA/math/euclidean-algorithm/README
sidebar_label: "Euclidean algorithm"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# GCD: making the largest equal groups

**Practice focus:** Make equal gift packs, then trace how remainders preserve the common divisors.

**Prerequisites:** [divisors](../prime-factors/README.md), remainders, and a `while` loop. The **greatest common divisor**, or GCD, is the largest positive integer that divides both numbers.

You have 18 pencils and 12 erasers. Make identical gift packs, using everything. Six packs work: each gets 3 pencils and 2 erasers. No larger number of packs divides both totals. Therefore `gcd(18, 12) = 6`.

Recognize GCD in problems about equal-sized groups, reducing fractions, or repeating lengths. Trying every candidate from 1 to the smaller number takes O(min(a, b)) checks. Euclid's method skips many candidates by using remainders.

## Why remainders preserve the answer

Dividing 18 by 12 gives one full group and a remainder of 6: `18 = 1 × 12 + 6`. Any number that divides 18 and 12 also divides their difference, 6. In the other direction, any number that divides 12 and 6 divides their sum, 18. The two pairs therefore have exactly the same common divisors.

More generally, write `a = quotient × b + remainder`. This proves the rule `gcd(a, b) = gcd(b, a % b)`. We keep applying it until the second value is zero. Every integer divides zero; thus the last nonzero value is the GCD.

| Step | First value | Second value | Remainder |
| --- | --- | --- | --- |
| 1 | 18 | 12 | `18 % 12 = 6` |
| 2 | 12 | 6 | `12 % 6 = 0` |
| Stop | 6 | 0 | Answer: 6 |

<AlgorithmWalkthrough name="euclid" />

The larger example above applies exactly the same rule to 1071 and 462. Each step preserves the answer and makes the second value smaller, so the loop must finish.

## Runnable implementation

This version accepts safe integer `Number` inputs, including negatives. It returns a nonnegative result. We define `gcd(0, 0)` as 0 for a convenient programming convention; there is no largest positive divisor of two zeros.

```js runnable
function gcd(first, second) {
  if (!Number.isSafeInteger(first) || !Number.isSafeInteger(second)) {
    throw new RangeError('Expected safe integers');
  }
  let a = Math.abs(first);
  let b = Math.abs(second);
  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a;
}

console.log(gcd(18, 12));
console.log(gcd(-18, 12));
console.log(gcd(0, 7));
console.log(gcd(0, 0));
```

```text output
6
6
7
0
```

The temporary `remainder` is important: overwriting `a` before calculating `a % b` would lose an input to the calculation. The iterative version uses no recursive call stack.

For positive inputs the algorithm takes O(log(min(a, b))) remainder steps and O(1) extra space, treating safe-integer arithmetic as constant-time. A zero input returns immediately. With arbitrary-size `BigInt`, the number of remainder steps has the same bound, but each remainder operation also depends on the number of bits.

## Understanding checks

1. Find `gcd(35, 14)` by writing every pair.
2. Why is `gcd(8, 0)` equal to 8?
3. How could you find the GCD of an entire array?

<details>
<summary>Hints</summary>

Use the remainder rule. For the array, combine one new value with the GCD of everything processed so far.

</details>

<details>
<summary>Answers</summary>

1. `(35, 14) → (14, 7) → (7, 0)`, giving 7.
2. Every divisor of 8 also divides zero, and 8 is the largest positive divisor of 8.
3. Start at 0 and repeatedly set `answer = gcd(answer, value)`. A number divides all processed values exactly when it divides their accumulated GCD. Define the empty-array answer in the problem contract; 0 is a useful convention.

</details>

[Next: LCM and repeating events](../least-common-multiple/README.md) · [Math learning order](../README.md)

**Next:** [LCM: when two repetitions meet](../least-common-multiple/README.md).
