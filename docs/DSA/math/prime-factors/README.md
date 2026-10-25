---
id: dsa-math-prime-factors-readme
title: "Prime Factors"
slug: /DSA/math/prime-factors/README
sidebar_label: "Prime Factors"
---

# Prime factors and divisors

**Practice focus:** Pack counters into equal rows, list divisor pairs, and then separate prime factors from all divisors.

**Before this lesson:** loops, arrays, integer division, and the remainder operator `%`. A **divisor** of a positive integer divides it with remainder zero: 3 divides 12 because `12 % 3 === 0`. A **prime** is an integer greater than 1 whose only positive divisors are 1 and itself. The number 1 is neither prime nor composite.

Imagine packing 12 counters into equal rows. The possible row sizes are 1, 2, 3, 4, 6, and 12. These are its divisors. Its **prime factorization** is different: `12 = 2 × 2 × 3`. Prime factors are the small building blocks; divisors are all the allowed group sizes.

Use these ideas when a problem asks about equal groups, divisibility, the number of factors, or a product's structure. For a single primality question, see [trial division](../primality-test/README.md); for many inputs with a shared small bound, use a [smallest-prime-factor table](../sieve-of-eratosthenes/README.md#smallest-prime-factor).

## Factor pairs explain the square-root boundary

```text
12 counters, rearranged into rectangles

1 × 12         2 × 6        3 × 4
[............] [......]     [....]
               [......]     [....]
                            [....]

small factor: 1, 2, 3       partner: 12, 6, 4
```

Each rectangle gives a pair of divisors. At least one side is at most `√n`; otherwise both sides would be larger than `√n`, making their product larger than `n`. Therefore, testing all integers through the square root finds every pair. Include the boundary: 5 divides 25.

## Complete implementations

The contract is a positive safe JavaScript integer. The returned divisor list is sorted; the factor list contains repeated primes. Neither function changes its input. `number / divisor` avoids computing a potentially oversized square.

```js runnable
function requirePositiveInteger(value) {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new RangeError('Expected a positive safe integer');
  }
}

function divisorsOf(number) {
  requirePositiveInteger(number);
  const small = [];
  const large = [];
  for (let divisor = 1; divisor <= number / divisor; divisor++) {
    if (number % divisor !== 0) continue;
    small.push(divisor);
    const partner = number / divisor;
    if (partner !== divisor) large.push(partner); // Do not repeat a square root.
  }
  return small.concat(large.reverse());
}

function primeFactorsOf(number) {
  requirePositiveInteger(number);
  let remaining = number;
  const factors = [];
  for (let divisor = 2; divisor <= remaining / divisor; divisor++) {
    while (remaining % divisor === 0) {
      factors.push(divisor);
      remaining /= divisor;
    }
  }
  if (remaining > 1) factors.push(remaining);
  return factors;
}

console.log(divisorsOf(12).join(','));
console.log(divisorsOf(25).join(','));
console.log(primeFactorsOf(12).join(' × '));
console.log(JSON.stringify(primeFactorsOf(1)));
```

```text output
1,2,3,4,6,12
1,5,25
2 × 2 × 3
[]
```

For 12, the factor loop divides by 2 twice: the remainder becomes 6, then 3. It then stops because `2 > 3 / 2`. The remaining 3 is prime, so it is appended. For 1, the empty product is 1, so there are no prime factors to return.

**Why it works.** Every successful division removes one factor without changing the product of the collected factors times `remaining`. When a candidate divides the remainder, no smaller prime divides it anymore, so that candidate must be prime. At termination a composite remainder would need a divisor no larger than its square root, contradicting the stopping condition. Any remainder greater than 1 is therefore prime.

Both algorithms perform O(√n) trial steps in the worst case. Divisor collection needs O(d) output space for d divisors; factorization needs O(log n) output space because every extracted factor is at least 2. The loops use O(1) working space beyond those arrays. Safe integer input does not make trial division fast for enormous values; choose a sieve when the constraints support it.

## Counting divisors from prime powers

For `12 = 2² × 3¹`, a divisor chooses how many 2s to use (0, 1, or 2) and how many 3s to use (0 or 1). The choices are independent, so there are `(2 + 1) × (1 + 1) = 6` divisors. In general, multiply `(exponent + 1)` for every distinct prime. Repeated factors matter: counting only the distinct primes loses this information.

## Try it before opening the answer

1. **Check:** why must `divisorsOf(36)` include 6 only once?
2. **Apply:** factor 72 and count its positive divisors without listing all of them.
3. **Extend:** return the sum of divisors of a positive integer. What changes in the factor-pair loop?

<details>
<summary>Hints</summary>

For a square, both sides of one factor pair are equal. For 72, divide repeatedly by 2 and then 3. For the sum, add each pair instead of storing it.

</details>

<details>
<summary>Answers and reasoning</summary>

1. The pair `(6, 6)` names the same divisor twice. The `partner !== divisor` condition prevents duplication.
2. `72 = 2³ × 3²`, so there are `4 × 3 = 12` divisors.
3. Start `sum = 0`. At each successful division add `divisor`, then add `partner` only when it differs. For 12 the answer is 28; for 1 it is 1. Use `BigInt` if the resulting sum may exceed the safe integer limit, even if the input itself is safe.

</details>

[Next: GCD and equal groups](../euclidean-algorithm/README.md) · [Math learning order](../README.md)

**Next:** [GCD: making the largest equal groups](../euclidean-algorithm/README.md).
