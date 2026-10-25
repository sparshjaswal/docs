---
id: dsa-math-sieve-of-eratosthenes-readme
title: "Sieve of Eratosthenes"
slug: /DSA/math/sieve-of-eratosthenes/README
sidebar_label: "Sieve of Eratosthenes"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Sieve: answer many prime questions together

**Practice focus:** Cross out larger multiples and explain why marking can start at the prime’s square.

**Prerequisites:** arrays, nested loops, and [why divisors come in pairs](../prime-factors/README.md). If a problem asks whether one small integer is prime, trial division is enough. If it asks about thousands of integers up to the same limit, checking each separately repeats work.

Imagine a list of every integer from 2 through 20. Keep 2, cross out its larger multiples, keep 3, and cross out its larger multiples. A number left uncrossed has no smaller prime divisor. The **sieve of Eratosthenes** performs this crossing-out process in an array.

## What each array position means

`isPrime[value]` answers whether that particular **value** is prime; it is not the value of the prime at that index. The array has `limit + 1` positions so that `limit` itself is included. Positions 0 and 1 are false because neither is prime.

<AlgorithmWalkthrough name="sieve" />

For example, when the limit is 10, crossing out multiples of 2 removes 4, 6, 8, and 10. Multiples of 3 need start only at 9: 6 was already removed by 2. The remaining values 2, 3, 5, and 7 are prime.

## Runnable implementation

This lesson uses a nonnegative safe integer limit that fits available memory. Allocating a table up to a billion is usually not a practical choice in a contest.

```js runnable
function primeTable(limit) {
  if (!Number.isSafeInteger(limit) || limit < 0) {
    throw new RangeError('Expected a nonnegative safe integer');
  }
  const isPrime = new Array(limit + 1).fill(true);
  isPrime[0] = false;
  if (limit >= 1) isPrime[1] = false;
  for (let prime = 2; prime <= limit / prime; prime++) {
    if (!isPrime[prime]) continue;
    for (let multiple = prime * prime; multiple <= limit; multiple += prime) {
      isPrime[multiple] = false;
    }
  }
  return isPrime;
}

const table = primeTable(10);
console.log(table.flatMap((prime, value) => prime ? [value] : []).join(','));
console.log(table[9], table[7]);
console.log(JSON.stringify(primeTable(0)));
```

```text output
2,3,5,7
false true
[false]
```

**Why it works.** A prime has no smaller prime divisor, so it is never crossed out. Every composite number has a prime divisor at most its square root; processing that divisor crosses it out. Starting at `prime * prime` is safe because each smaller multiple has a smaller prime factor that was already processed. Stopping the outer loop after the square-root boundary therefore leaves exactly the primes.

The preprocessing takes O(N log log N) time and O(N) space for bound N; each later lookup is O(1). This is useful when many queries reuse the table. For one large query, the allocation may cost more than trial division.

## Smallest-prime-factor tables {/* #smallest-prime-factor */}

Sometimes each query needs a whole factorization. Store the **smallest prime factor**, abbreviated SPF, of each value instead of just a yes/no flag. Then divide by the stored prime repeatedly.

For example, `spf[12] = 2`. After dividing, `spf[6] = 2`, then `spf[3] = 3`. These entries reveal `12 = 2 × 2 × 3` without trying unrelated divisors. We use 0 as a sentinel for 0 and 1, which have no prime factor.

```js runnable
function smallestPrimeFactors(limit) {
  if (!Number.isSafeInteger(limit) || limit < 0) {
    throw new RangeError('Expected a nonnegative safe integer');
  }
  const spf = new Array(limit + 1).fill(0);
  for (let prime = 2; prime <= limit; prime++) {
    if (spf[prime] !== 0) continue;
    spf[prime] = prime;
    if (prime > limit / prime) continue;
    for (let multiple = prime * prime; multiple <= limit; multiple += prime) {
      if (spf[multiple] === 0) spf[multiple] = prime;
    }
  }
  return spf;
}

function factorWithTable(number, spf) {
  if (!Number.isInteger(number) || number < 1 || number >= spf.length) {
    throw new RangeError('Query must lie between 1 and the table limit');
  }
  const factors = [];
  while (number > 1) {
    const prime = spf[number];
    factors.push(prime);
    number /= prime;
  }
  return factors;
}

const spf = smallestPrimeFactors(30);
console.log(spf.slice(2, 13).join(','));
console.log(factorWithTable(12, spf).join(' × '));
console.log(factorWithTable(25, spf).join(' × '));
console.log(JSON.stringify(factorWithTable(1, spf)));
```

```text output
2,3,2,5,2,7,2,3,2,11,2
2 × 2 × 3
5 × 5
[]
```

Prime candidates are processed in increasing order, and an existing entry is never overwritten, so each recorded factor is the smallest. The table takes O(N log log N) time and O(N) space. A query performs at most O(log x) divisions because each divides the remainder by at least 2. It needs O(log x) output space and O(1) additional working space.

## Checks, then practice

1. **Check:** why is marking from `2 * prime` correct but wasteful?
2. **Apply:** use the table to count primes in the inclusive interval `[left, right]`. How could prefix sums speed up many such queries?
3. **Extend:** find the number of distinct prime factors of every integer up to N. How should a sieve update multiples?

<details>
<summary>Hints</summary>

Earlier primes have already handled some multiples. Turn each true table entry into 1 for a prefix sum. For distinct factor counts, each prime contributes exactly once to every multiple.

</details>

<details>
<summary>Answers</summary>

1. It crosses out only composite numbers, but revisits multiples already handled by smaller primes. Starting at the square skips them.
2. Build `prefix[i + 1] = prefix[i] + (isPrime[i] ? 1 : 0)`. Then the answer is `prefix[right + 1] - prefix[left]`, O(1) after O(N) extra preprocessing.
3. Initialize counts to zero. For each prime p, increment `count[p]`, `count[2p]`, and so on once each. Do not increment repeatedly for prime powers: 8 has only one distinct prime factor, 2.

</details>

[Math learning order](../README.md)

**Next:** [Fast powering: reuse the squares](../fast-powering/README.md).
