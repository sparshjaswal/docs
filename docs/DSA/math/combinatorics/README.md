---
id: dsa-math-combinatorics
title: "Combinatorics: Counting Choices"
slug: /DSA/math/combinatorics
sidebar_label: "Combinatorics"
---

# Combinatorics: count without listing everything

**Practice focus:** Decide whether order and repetition matter before choosing a counting formula.

**Prerequisites:** loops, arrays, [factorials](../factorial/README.md), and [BigInt and modular arithmetic](../modular-arithmetic/README.md) for the later sections. **Combinatorics** studies ways to choose, arrange, and count objects. It helps when a problem asks “how many?” and generating every outcome is too slow.

Suppose you have two shirts and three pairs of trousers. Each shirt can be paired with each pair of trousers, so there are `2 × 3 = 6` outfits. This is the **product rule**: multiply the choices at successive steps when each earlier choice leaves the stated number of later choices.

```text
                    choose trousers
+---------+       +-----+-----+-----+
| Shirt A | ----> | A-1 | A-2 | A-3 |
+---------+       +-----+-----+-----+
+---------+       +-----+-----+-----+
| Shirt B | ----> | B-1 | B-2 | B-3 |
+---------+       +-----+-----+-----+
                 2 rows × 3 = 6 outfits
```

The **sum rule** adds counts of disjoint cases. Choosing one drink from 2 juices or 3 teas gives 5 choices, assuming no drink belongs to both groups. If cases overlap, adding counts alone counts the overlap twice. For two sets, `|A ∪ B| = |A| + |B| - |A ∩ B|`. The vertical bars here mean “number of elements,” not absolute value or JavaScript syntax.

## Decide whether order matters

From Ana, Bo, and Cy, choose a captain and a deputy. Ana-then-Bo differs from Bo-then-Ana because the roles differ. There are `3 × 2 = 6` arrangements. An ordered selection of r distinct objects from n is a **permutation**, `P(n, r) = n! / (n - r)!`.

Now choose a two-person team with no roles. Ana with Bo is the same team as Bo with Ana. Each team was counted `2! = 2` times, so there are 3 teams. An unordered selection without repetition is a **combination**, written `C(n, r)` or “n choose r”: `n! / (r! × (n - r)!)`. Here `n!` means `n × (n - 1) × ... × 1`, with `0! = 1`.

| Question | Model | Example |
| --- | --- | --- |
| Each position independently chooses one of n values; repetition allowed | `n^r` | Three-digit codes over 4 symbols: `4³` |
| Choose r distinct items and order them | `P(n, r)` | Captain and deputy from 5 people: `5 × 4` |
| Choose r distinct items; order does not matter | `C(n, r)` | Two-person team from 5 people: 10 |
| Cases overlap | Subtract duplicate counts | Divisible by 2 or 3: subtract those divisible by 6 |

Do not pick a formula from a keyword alone. State whether objects are distinct, whether reuse is allowed, whether order matters, and whether there are additional restrictions.

## Exact binomial coefficients without huge factorials

Computing three factorials creates much larger intermediate values than needed. Build the answer one factor at a time. After step i, `answer = C(n - r + i, i)`, so each division below is exact. We also use symmetry: choosing r items is equivalent to choosing the n - r items to leave out.

```js runnable
function choose(n, r) {
  if (!Number.isSafeInteger(n) || !Number.isSafeInteger(r) || n < 0) {
    throw new RangeError('Expected safe integers and nonnegative n');
  }
  if (r < 0 || r > n) return 0n;
  r = Math.min(r, n - r);
  let answer = 1n;
  for (let i = 1; i <= r; i++) {
    answer = answer * BigInt(n - r + i) / BigInt(i);
  }
  return answer;
}

console.log(choose(5, 2).toString());
console.log(choose(60, 30).toString());
console.log(choose(0, 0).toString());
console.log(choose(4, 5).toString());
```

```text output
10
118264581564861424
1
0
```

For `C(5, 2)`, start at 1. At i = 1 the answer becomes `1 × 4 / 1 = 4`; at i = 2 it becomes `4 × 5 / 2 = 10`. Multiplication must happen **before** division: `answer / i` might not be integral on its own. BigInt division truncates, so changing that order can silently lose information.

The loop takes O(min(r, n - r)) big-integer arithmetic steps and a constant number of BigInt values. Their storage and arithmetic cost grow with the result's bit length. This method is useful for a modest number of exact queries. For many queries modulo a prime, preprocess factorials instead.

## Pascal's recurrence connects counting to DP

Focus on one particular person among n. An r-person team either contains that person or does not. The two cases are disjoint and exhaustive: `C(n, r) = C(n - 1, r - 1) + C(n - 1, r)`. There is one way to choose nobody and one way to choose everyone. These base cases and recurrence form [Pascal's triangle](../pascal-triangle/README.md).

This is also a dynamic programming solution using only addition. It works with any positive modulus, including composite ones, because it never divides. It costs O(nr) additions for a rectangular table, with O(r) space if rows are reused. Update a one-dimensional row from **right to left**, so the previous row's values are not overwritten too early.

## Many binomial queries modulo a prime {/* #modular-binomial */}

Suppose all queries have `0 ≤ r ≤ n ≤ N`, and a **known prime** p is greater than N. Precompute `factorial[i] = i! mod p` and its inverse for every i. Then `C(n, r) mod p = factorial[n] × inverseFactorial[r] × inverseFactorial[n - r] mod p`.

The condition **N < p is essential**: otherwise a factorial includes p, becomes zero modulo p, and has no inverse. This routine assumes the problem guarantees a prime modulus; it does not test primality. For n at least p, use a different method such as Lucas's theorem, or a suitable DP when constraints allow it. Do not apply this table unchanged.

```js runnable
function modPow(base, exponent, modulus) {
  let result = 1n;
  while (exponent > 0n) {
    if (exponent % 2n === 1n) result = result * base % modulus;
    base = base * base % modulus;
    exponent /= 2n;
  }
  return result;
}

function binomialTable(limit, prime) {
  if (!Number.isSafeInteger(limit) || limit < 0 || BigInt(limit) >= prime) {
    throw new RangeError('Need 0 <= limit < the known prime modulus');
  }
  const factorial = new Array(limit + 1).fill(1n);
  const inverseFactorial = new Array(limit + 1).fill(1n);
  for (let i = 1; i <= limit; i++) {
    factorial[i] = factorial[i - 1] * BigInt(i) % prime;
  }
  inverseFactorial[limit] = modPow(factorial[limit], prime - 2n, prime);
  for (let i = limit; i > 0; i--) {
    inverseFactorial[i - 1] = inverseFactorial[i] * BigInt(i) % prime;
  }
  return function chooseMod(n, r) {
    if (!Number.isInteger(n) || n < 0 || n > limit || !Number.isInteger(r)) {
      throw new RangeError('Query must use integer indexes within the table');
    }
    if (r < 0 || r > n) return 0n;
    return factorial[n] * inverseFactorial[r] % prime * inverseFactorial[n - r] % prime;
  };
}

const chooseMod = binomialTable(10, 1000000007n);
console.log(chooseMod(5, 2).toString());
console.log(chooseMod(10, 3).toString());
console.log(chooseMod(0, 0).toString());
console.log(chooseMod(3, 4).toString());
```

```text output
10
120
1
0
```

Fermat's theorem provides the inverse of `N!`. Because `i! = i × (i - 1)!`, multiplying the inverse of `i!` by i gives the inverse of `(i - 1)!`. That proves the backward loop; the factorial formula proves each query. Preprocessing takes O(N + log p) modular arithmetic steps and O(N) residues; each query takes O(1) modular arithmetic steps. BigInt operations still depend on the modulus's bit length.

## Graduated practice

1. **Check:** choose two class representatives from 6 students. How many choices are there if they have equal roles? What if one is captain and one is deputy?
2. **Apply:** count shortest routes from the top-left to bottom-right of a 3-row, 4-column grid, moving only right or down with no obstacles.
3. **Extend:** count integers from 1 through 30 divisible by 2 or 3.
4. **Challenge:** distribute 5 identical candies among 3 distinct children, allowing a child to receive none. Explain why placing two separators among seven positions counts the distributions.

<details>
<summary>Hints</summary>

Decide whether roles distinguish arrangements. A shortest grid route is a sequence with a fixed number of right and down moves. Subtract double-counted multiples. For candies, `**|***|` means the three children get 2, 3, and 0 candies.

</details>

<details>
<summary>Solutions and limitations</summary>

1. Equal roles give `C(6, 2) = 15`. Distinct roles give `P(6, 2) = 6 × 5 = 30`.
2. Each route uses 2 down moves and 3 right moves. Choose the 2 down positions among 5: `C(5, 2) = 10`. Obstacles invalidate this simple formula; use grid DP instead.
3. There are 15 multiples of 2 and 10 multiples of 3. Five multiples of 6 were counted twice. The answer is `15 + 10 - 5 = 20`.
4. Five stars represent candies and two bars divide them into three ordered groups. Choose the bar positions: `C(7, 2) = 21`. This **stars-and-bars** rule generalizes to `C(candies + children - 1, children - 1)` for nonnegative distributions into at least one distinct child. Positive minimums or upper bounds change the counting problem.

</details>

[Math learning order](../README.md)

**Next:** [Pascals triangle: each count comes from two smaller counts](../pascal-triangle/README.md).
