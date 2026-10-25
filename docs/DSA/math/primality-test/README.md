---
id: dsa-math-primality-test-readme
title: "Primality Test"
slug: /DSA/math/primality-test/README
sidebar_label: "Primality Test"
---

# Primality Test

**Read first:** [Prime factors and divisors](../prime-factors/README.md).

**Practice focus:** Test small boundary values and explain why a composite number has a divisor no larger than its square root.

A prime number is an integer greater than 1 whose only positive divisors are 1 and itself. The numbers 0, 1, and negative integers are not prime. This lesson uses trial division for small, safe JavaScript integers.

## Why stop at the square root?

If `n = a × b` is composite, at least one factor is at most `√n`. If both were larger, their product would exceed `n`. Finding no divisor through that boundary proves primality.

| Candidate | Divisors checked after handling 2 | Result |
| --- | --- | --- |
| 17 | 3 | Prime; the next odd divisor, 5, exceeds √17. |
| 21 | 3 | Composite: `21 = 3 × 7`. |
| 25 | 3, 5 | Composite: include the square-root boundary. |

## Implementation

```js runnable
function isPrime(n) {
  if (!Number.isSafeInteger(n)) throw new RangeError('Use a safe integer');
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let divisor = 3; divisor <= n / divisor; divisor += 2) {
    if (n % divisor === 0) return false;
  }
  return true;
}
console.log(isPrime(17));
console.log(isPrime(25));
console.log(isPrime(1));
```

```text output
true
false
false
```

## Complexity and limits

Trial division takes O(√n) arithmetic steps and O(1) extra space. That is practical for small values, but slow for very large integers. It is not polynomial in the number of bits needed to represent `n`. Do not confuse this simple algorithm with more advanced primality tests.

For many queries up to a known bound, use the [sieve of Eratosthenes](../sieve-of-eratosthenes/README.md). Cryptographic prime generation needs established libraries and stronger algorithms; this example is for learning integer divisibility.

## Check your understanding

Test 2, an even number above 2, an odd square, and a negative input. Explain why using `<` instead of `<=` at the square-root boundary would wrongly accept 25.

<details>
<summary>Hint</summary>

For 25, the only prime divisor is exactly the square root. Think about which inputs the early returns handle.

</details>

<details>
<summary>Answer</summary>

The results for 2, 4, 25, and -3 are true, false, false, and false. The strict inequality would test 3 but skip 5, wrongly returning true for 25. The definition requires an integer greater than 1, so negative inputs are never prime.

</details>

## References

- [Prime Numbers on Wikipedia](https://en.wikipedia.org/wiki/Prime_number)
- [Primality Test on Wikipedia](https://en.wikipedia.org/wiki/Primality_test)

**Next:** [Sieve: answer many prime questions together](../sieve-of-eratosthenes/README.md).
