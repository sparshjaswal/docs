---
id: dsa-math-modular-arithmetic
title: "Modular Arithmetic and Inverses"
slug: /DSA/math/modular-arithmetic
sidebar_label: "Modular Arithmetic"
---

# Modular arithmetic: keep only the remainder

**Practice focus:** Normalize a remainder, then check the GCD condition before trying modular division.

**Prerequisites:** [GCD](../euclidean-algorithm/README.md), [fast powering](../fast-powering/README.md), and `BigInt`. A **modulus** is the positive number we divide by when keeping a remainder. On a clock with positions 0 through 11, moving forward 15 steps from 0 ends at 3: `15 mod 12 = 3`.

Two integers are **congruent modulo m** when their difference is divisible by m. We write `a ≡ b (mod m)`; it means a and b have the same normalized remainder. The symbols say that `15 ≡ 3 (mod 12)`, not that 15 and 3 are the same integer.

Use modular arithmetic when a problem explicitly requests an answer modulo a number, when grouping values by remainder, or when tracking cyclic positions. It does not preserve ordering: a larger original value can have a smaller remainder.

## Which operations are safe to reduce early?

If `a = qm + r`, the part `qm` disappears after taking the remainder. Substituting this form proves that we can reduce both operands before addition, subtraction, and multiplication. This lets a counting algorithm keep small residues instead of an enormous exact answer.

| Operation | Rule | Example modulo 7 |
| --- | --- | --- |
| Add | `(a + b) mod m` | `(6 + 5) mod 7 = 4` |
| Subtract | `(a - b) mod m` | `(2 - 5) mod 7 = 4` |
| Multiply | `(a × b) mod m` | `(6 × 5) mod 7 = 2` |
| Divide | Requires a modular inverse, when one exists | Ordinary integer division is not a replacement |

JavaScript `%` is a **remainder** operator: `-3 % 7` is -3. Normalize with `((value % modulus) + modulus) % modulus` to obtain a value from 0 through `modulus - 1`. We use `BigInt` below: even if a common modulus fits `Number`, multiplying two residues near a billion can exceed `Number.MAX_SAFE_INTEGER` **before** `%` runs.

## Modular exponentiation

The loop is the same repeated-squaring idea as fast powering. Now its invariant is `result × base^remaining ≡ originalBase^originalExponent (mod modulus)` rather than equality. Reducing after multiplication preserves this invariant.

```js runnable
function normalizedMod(value, modulus) {
  return ((value % modulus) + modulus) % modulus;
}

function modPow(base, exponent, modulus) {
  if (modulus <= 0n || exponent < 0n) {
    throw new RangeError('Need a positive modulus and nonnegative exponent');
  }
  base = normalizedMod(base, modulus);
  let result = 1n % modulus;
  while (exponent > 0n) {
    if (exponent % 2n === 1n) result = (result * base) % modulus;
    base = (base * base) % modulus;
    exponent /= 2n;
  }
  return result;
}

console.log(normalizedMod(-3n, 7n).toString());
console.log(modPow(3n, 5n, 7n).toString());
console.log(modPow(2n, 1000000000n, 1000000007n).toString());
console.log(modPow(8n, 0n, 1n).toString());
```

```text output
4
5
140625001
0
```

For `3⁵ mod 7`, the states before the three iterations are `(result, base, exponent) = (1, 3, 5)`, `(3, 2, 2)`, and `(3, 4, 1)`. The last collected product is `3 × 4 mod 7 = 5`. When the exponent reaches zero, the invariant proves that `result` is the desired remainder. Modulo 1, every result is 0, including a zero exponent; this is why initialization uses `1n % modulus`.

The algorithm performs O(log e) modular multiplication steps for positive exponent e. It holds a constant number of BigInts, with intermediate bit lengths O(log m) plus the exponent's bits. BigInt arithmetic cost depends on these lengths; O(log e) counts the steps, not individual bit operations.

## Division requires an inverse

An **inverse of a modulo m** is a number x such that `a × x ≡ 1 (mod m)`. Modulo 7, 3 has inverse 5 because `3 × 5 = 15`, whose remainder is 1. Therefore solving `3 × answer ≡ 6 (mod 7)` gives `answer ≡ 6 × 5 ≡ 2`.

An inverse exists **exactly when `gcd(a, m) = 1`**. For example, 2 has no inverse modulo 6: every product with 2 has an even remainder, so it cannot have remainder 1. Never replace modular division with `/`, and never assume all nonzero residues are invertible for a composite modulus.

For a **prime modulus p**, every nonzero residue has an inverse. Fermat's little theorem states `a^(p - 1) ≡ 1 (mod p)` when p does not divide a. Thus `a^(p - 2)` is its inverse. Why does the theorem hold? Multiplying residues `1, 2, ..., p - 1` by a permutes the same nonzero residues; cancelling their nonzero product gives the stated power relation. The [combinatorics lesson](../combinatorics/README.md#modular-binomial) includes complete executable code using this inverse for binomial coefficients.

For a composite modulus, the **extended Euclidean algorithm** finds integers x and y satisfying `ax + my = gcd(a, m)`. If the GCD is 1, reducing this equation modulo m leaves `ax ≡ 1`, so x is the inverse. The following code supports both prime and composite moduli greater than 1 and returns `null` when division is impossible.

```js runnable
function modularInverse(value, modulus) {
  if (modulus <= 1n) throw new RangeError('Modulus must exceed 1');
  let oldRemainder = modulus;
  let remainder = ((value % modulus) + modulus) % modulus;
  let oldCoefficient = 0n;
  let coefficient = 1n;
  while (remainder !== 0n) {
    const quotient = oldRemainder / remainder;
    [oldRemainder, remainder] =
      [remainder, oldRemainder - quotient * remainder];
    [oldCoefficient, coefficient] =
      [coefficient, oldCoefficient - quotient * coefficient];
  }
  if (oldRemainder !== 1n) return null;
  return ((oldCoefficient % modulus) + modulus) % modulus;
}

console.log(modularInverse(3n, 7n)?.toString());
console.log(modularInverse(3n, 10n)?.toString());
console.log(modularInverse(2n, 6n));
console.log(modularInverse(-3n, 7n)?.toString());
```

```text output
5
7
null
2
```

Each remainder is kept with its coefficient of the original normalized value. Subtracting a quotient times one remainder from the other requires the **same subtraction on the coefficients**. For 3 modulo 7, the `(remainder, coefficient)` pairs successively include `(7, 0)`, `(3, 1)`, and `(1, -2)`; `-2 mod 7 = 5` is the inverse. This preserves the equation needed for correctness. The Euclidean loop takes O(log m) division steps and a constant number of BigInt variables.

## Checks and graduated practice

1. **Check:** compute `(-2 + 9) mod 5` and `(-2 × 9) mod 5` as normalized remainders.
2. **Apply:** find the inverse of 4 modulo 7. Why is there no inverse of 4 modulo 8?
3. **Extend:** a repeated-doubling count asks for `2^n mod 1,000,000,007` where n is supplied as a decimal string. Which conversion must happen before the loop?

<details>
<summary>Hints</summary>

Normalize negative remainders. An inverse multiplied by its value must leave 1. Preserve every digit of a large exponent.

</details>

<details>
<summary>Answers</summary>

1. The answers are 2 and 2. The second calculation is -18, whose normalized remainder modulo 5 is 2.
2. The inverse is 2 because `4 × 2 ≡ 1 (mod 7)`. No inverse exists modulo 8 because the GCD is 4 rather than 1.
3. Parse `n` directly with `BigInt(token)` and call `modPow(2n, n, 1000000007n)`. Parsing through `Number` may round a large exponent before conversion. Print the answer with `.toString()`.

</details>

[Math learning order](../README.md)

**Next:** [Combinatorics: count without listing everything](../combinatorics/README.md).
