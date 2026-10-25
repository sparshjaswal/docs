---
id: dsa-math-fast-powering-readme
title: "Fast Powering Algorithm"
slug: /DSA/math/fast-powering/README
sidebar_label: "Fast Powering Algorithm"
---

# Fast powering: reuse the squares

**Practice focus:** Build reusable squares and trace which exponent bits select them.

**Prerequisites:** multiplication, integer division, loops, and `BigInt`. A power is repeated multiplication: `3⁵ = 3 × 3 × 3 × 3 × 3`. The base is 3 and the exponent is 5. In JavaScript, exponentiation is `**`; `^` means bitwise XOR.

Multiplying by the base five times is fine for 5, but not for an exponent of a billion. Instead, reuse squares: `3² = 9`, `3⁴ = 81`, and `3⁵ = 81 × 3 = 243`. Use **exponentiation by squaring** whenever an exponent is large and repeated multiplication has an associative operation.

## The rule and its invariant

An even power satisfies `base^(2k) = (base²)^k`. An odd power satisfies `base^(2k + 1) = base × (base²)^k`. Each step removes one possible factor and halves the remaining exponent.

Keep three values: `result` (the factors already collected), `base` (the next reusable power), and `remaining` (how many of that power are still needed). The **invariant**, a statement that stays true through the loop, is `result × base^remaining = originalBase^originalExponent`.

| Start of iteration | result | base | remaining | Action |
| --- | --- | --- | --- | --- |
| 1 | 1 | 3 | 5 | Odd: collect 3; square base; halve exponent |
| 2 | 3 | 9 | 2 | Even: collect nothing; square base; halve exponent |
| 3 | 3 | 81 | 1 | Odd: collect 81; exponent becomes zero |
| Done | 243 | 81 | 0 | Return 243 |

## Runnable implementation

The contract is a `BigInt` base and a nonnegative `BigInt` exponent. This function defines a zero exponent to give 1, including `0n ** 0n`, matching JavaScript exponentiation. Negative exponents would usually produce fractions and are outside this contract.

```js runnable
function power(base, exponent) {
  if (exponent < 0n) throw new RangeError('Expected a nonnegative exponent');
  let result = 1n;
  let remaining = exponent;
  while (remaining > 0n) {
    if (remaining % 2n === 1n) result *= base;
    remaining /= 2n; // BigInt division truncates; this is floor for nonnegative values.
    if (remaining > 0n) base *= base;
  }
  return result;
}

console.log(power(3n, 5n).toString());
console.log(power(-2n, 3n).toString());
console.log(power(9n, 0n).toString());
console.log(power(2n, 60n).toString());
```

```text output
243
-8
1
1152921504606846976
```

When the exponent becomes zero the invariant leaves only `result`, proving correctness. Skipping the final unused square avoids an unnecessary large multiplication. The number of multiplication steps is O(log e) for positive exponent e, and the loop holds O(1) integer values. BigInt values grow with the answer: neither bit storage nor multiplication cost is constant. Constructing an astronomically long result is still expensive.

If the problem asks for the answer **modulo m**, reduce after every multiplication. This bounds the intermediate bit length and prevents constructing the full power. Learn that adaptation, and why `Number` multiplication can lose precision before `%`, in [modular arithmetic](../modular-arithmetic/README.md).

## Checks and practice

1. Why does an odd exponent need one extra copy of the base?
2. Calculate `2¹³` by choosing from `2¹`, `2²`, `2⁴`, and `2⁸`.
3. Why would a recursive version that independently calculates the same half-power twice lose the speedup?

<details>
<summary>Hints</summary>

Separate `2k + 1` into `2k` and 1. Write 13 as a sum of powers of two. Count the repeated work in a recursion tree.

</details>

<details>
<summary>Answers</summary>

1. Squaring handles the paired factors; one unpaired factor remains.
2. `13 = 8 + 4 + 1`, so `2¹³ = 256 × 16 × 2 = 8192`.
3. Recomputing both identical halves gives roughly twice as many calls at each level, yielding O(e) calls instead of O(log e). Save one half-power and square it, or use the loop above.

</details>

[Math learning order](../README.md)

**Next:** [Modular arithmetic: keep only the remainder](../modular-arithmetic/README.md).
