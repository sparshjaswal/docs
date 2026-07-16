# ➗ Math

> **One-line summary**: Number theory, combinatorics, and arithmetic tricks — the foundation of competitive programming warm-ups.

---

## Key Topics

| Topic                       | Key Insight                             |
| --------------------------- | --------------------------------------- |
| GCD / LCM                   | Euclidean: `gcd(a,b) = gcd(b, a%b)`     |
| Sieve of Eratosthenes       | Find all primes ≤ n in O(n log log n)   |
| Modular Arithmetic          | `(a+b)%m = ((a%m)+(b%m))%m`             |
| Combinatorics               | `nCr = n! / (r! * (n-r)!)`              |
| Trailing zeros in n!        | Count factor-5s: `⌊n/5⌋ + ⌊n/25⌋ + ...` |
| Perfect square              | `Math.sqrt(n) % 1 === 0`                |
| [Fibonacci](./fibonacci.md) |                                         |

---

## Common Patterns

### GCD / LCM

```javascript
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}
function lcm(a, b) {
  return (a / gcd(a, b)) * b;
}
```

### Sieve of Eratosthenes

```javascript
function sieve(n) {
  const p = new Array(n + 1).fill(true);
  p[0] = p[1] = false;
  for (let i = 2; i * i <= n; i++) if (p[i]) for (let j = i * i; j <= n; j += i) p[j] = false;
  return p;
}
```

### Trailing Zeros

```javascript
function trailingZeros(n) {
  let c = 0;
  while (n >= 5) {
    n = Math.floor(n / 5);
    c += n;
  }
  return c;
}
```

---

## Practice Problems

### Easy Problems

| Problem                                                                                                                                           | Difficulty | Solution                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------- |
| [LC 7 — Reverse Integer](https://leetcode.com/problems/reverse-integer/)                                                                          | Easy       |                                                 |
| [LC 9 — Palindrome Number](https://leetcode.com/problems/palindrome-number/)                                                                      | Easy       |                                                 |
| [LC 13 — Roman to Integer](https://leetcode.com/problems/roman-to-integer/)                                                                       | Easy       |                                                 |
| [LC 66 — Plus One](https://leetcode.com/problems/plus-one/)                                                                                       | Easy       |                                                 |
| [LC 69 — Sqrt(x)](https://leetcode.com/problems/sqrtx/)                                                                                           | Easy       |                                                 |
| [LC 168 — Excel Sheet Column Title](https://leetcode.com/problems/excel-sheet-column-title/)                                                      | Easy       |                                                 |
| [LC 171 — Excel Sheet Column Number](https://leetcode.com/problems/excel-sheet-column-number/)                                                    | Easy       |                                                 |
| [LC 202 — Happy Number](https://leetcode.com/problems/happy-number/)                                                                              | Easy       |                                                 |
| [LC 231 — Power of Two](https://leetcode.com/problems/power-of-two/)                                                                              | Easy       |                                                 |
| [LC 258 — Add Digits](https://leetcode.com/problems/add-digits/)                                                                                  | Easy       |                                                 |
| [LC 263 — Ugly Number](https://leetcode.com/problems/ugly-number/)                                                                                | Easy       |                                                 |
| [LC 326 — Power of Three](https://leetcode.com/problems/power-of-three/)                                                                          | Easy       |                                                 |
| [LC 342 — Power of Four](https://leetcode.com/problems/power-of-four/)                                                                            | Easy       |                                                 |
| [LC 367 — Valid Perfect Square](https://leetcode.com/problems/valid-perfect-square/)                                                              | Easy       |                                                 |
| [LC 415 — Add Strings](https://leetcode.com/problems/add-strings/)                                                                                | Easy       |                                                 |
| [LC 441 — Arranging Coins](https://leetcode.com/problems/arranging-coins/)                                                                        | Easy       |                                                 |
| [LC 507 — Perfect Number](https://leetcode.com/problems/perfect-number/)                                                                          | Easy       |                                                 |
| [LC 509 — Fibonacci Number](https://leetcode.com/problems/fibonacci-number/)                                                                      | Easy       | [View Solution](./math/LC-509-Fibonacci-Number) |
| [LC 728 — Self Dividing Numbers](https://leetcode.com/problems/self-dividing-numbers/)                                                            | Easy       |                                                 |
| [LC 1137 — N-th Tribonacci Number](https://leetcode.com/problems/n-th-tribonacci-number/)                                                         | Easy       |                                                 |
| [LC 1175 — Prime Arrangements](https://leetcode.com/problems/prime-arrangements/)                                                                 | Easy       |                                                 |
| [LC 1281 — Subtract the Product and Sum of Digits](https://leetcode.com/problems/subtract-the-product-and-sum-of-digits-of-an-integer/)           | Easy       |                                                 |
| [LC 1317 — Convert Integer to the Sum of Two No-Zero Integers](https://leetcode.com/problems/convert-integer-to-the-sum-of-two-no-zero-integers/) | Easy       |                                                 |
| [LC 1323 — Maximum 69 Number](https://leetcode.com/problems/maximum-69-number/)                                                                   | Easy       |                                                 |
| [LC 1360 — Number of Days Between Two Dates](https://leetcode.com/problems/number-of-days-between-two-dates/)                                     | Easy       |                                                 |
| [CC — Add Two Numbers (FLOW001)](https://www.codechef.com/problems/FLOW001)                                                                       | Easy       |                                                 |
| [CC — Small Factorials (FLOW018)](https://www.codechef.com/problems/FLOW018)                                                                      | Easy       |                                                 |
| [CC — First and Last Digit (FLOW004)](https://www.codechef.com/problems/FLOW004)                                                                  | Easy       |                                                 |
| [CC — Sum of Digits (FLOW006)](https://www.codechef.com/problems/FLOW006)                                                                         | Easy       |                                                 |
| [CC — GCD and LCM (FLOW016)](https://www.codechef.com/problems/FLOW016)                                                                           | Easy       |                                                 |
| [CC — Prime Generator (PRIME1)](https://www.codechef.com/problems/PRIME1)                                                                         | Easy       |                                                 |
| [CC — Reverse Number (REVNUM)](https://www.codechef.com/problems/REVNUM)                                                                          | Easy       |                                                 |
| [LC 12 — Integer to Roman](https://leetcode.com/problems/integer-to-roman/)                                                                       | Medium     |                                                 |
| [LC 29 — Divide Two Integers](https://leetcode.com/problems/divide-two-integers/)                                                                 | Medium     |                                                 |
| [LC 43 — Multiply Strings](https://leetcode.com/problems/multiply-strings/)                                                                       | Medium     |                                                 |
| [LC 50 — Pow(x, n)](https://leetcode.com/problems/powx-n/)                                                                                        | Medium     |                                                 |
| [LC 166 — Fraction to Recurring Decimal](https://leetcode.com/problems/fraction-to-recurring-decimal/)                                            | Medium     |                                                 |
| [LC 172 — Factorial Trailing Zeroes](https://leetcode.com/problems/factorial-trailing-zeroes/)                                                    | Medium     |                                                 |
| [LC 204 — Count Primes](https://leetcode.com/problems/count-primes/)                                                                              | Medium     |                                                 |
| [LC 264 — Ugly Number II](https://leetcode.com/problems/ugly-number-ii/)                                                                          | Medium     |                                                 |
| [LC 279 — Perfect Squares](https://leetcode.com/problems/perfect-squares/)                                                                        | Medium     |                                                 |
| [LC 319 — Bulb Switcher](https://leetcode.com/problems/bulb-switcher/)                                                                            | Medium     |                                                 |
| [LC 365 — Water and Jug Problem](https://leetcode.com/problems/water-and-jug-problem/)                                                            | Medium     |                                                 |
| [LC 372 — Super Pow](https://leetcode.com/problems/super-pow/)                                                                                    | Medium     |                                                 |
| [LC 396 — Rotate Function](https://leetcode.com/problems/rotate-function/)                                                                        | Medium     |                                                 |
| [LC 470 — Implement Rand10 Using Rand7](https://leetcode.com/problems/implement-rand10-using-rand7/)                                              | Medium     |                                                 |
| [LC 593 — Valid Square](https://leetcode.com/problems/valid-square/)                                                                              | Medium     |                                                 |
| [LC 633 — Sum of Square Numbers](https://leetcode.com/problems/sum-of-square-numbers/)                                                            | Medium     |                                                 |
| [LC 754 — Reach a Number](https://leetcode.com/problems/reach-a-number/)                                                                          | Medium     |                                                 |
| [LC 780 — Reaching Points](https://leetcode.com/problems/reaching-points/)                                                                        | Medium     |                                                 |
| [LC 829 — Consecutive Numbers Sum](https://leetcode.com/problems/consecutive-numbers-sum/)                                                        | Medium     |                                                 |
| [LC 858 — Mirror Reflection](https://leetcode.com/problems/mirror-reflection/)                                                                    | Medium     |                                                 |
| [LC 914 — X of a Kind in a Deck of Cards](https://leetcode.com/problems/x-of-a-kind-in-a-deck-of-cards/)                                          | Medium     |                                                 |
| [LC 1006 — Clumsy Factorial](https://leetcode.com/problems/clumsy-factorial/)                                                                     | Medium     |                                                 |
| [LC 1217 — Minimum Cost to Move Chips to The Same Position](https://leetcode.com/problems/minimum-cost-to-move-chips-to-the-same-position/)       | Medium     |                                                 |
| [LC 1390 — Four Divisors](https://leetcode.com/problems/four-divisors/)                                                                           | Medium     |                                                 |
| [CC — Modular Exponentiation (MODEX)](https://www.codechef.com/problems/MODEX)                                                                    | Medium     |                                                 |
| [CC — Catalan Numbers (CATALAN)](https://www.codechef.com/problems/CATALAN)                                                                       | Medium     |                                                 |
| [CC — Number Theory (NUMTHEORY)](https://www.codechef.com/problems/NUMTHEORY)                                                                     | Medium     |                                                 |
| [LC 60 — Permutation Sequence](https://leetcode.com/problems/permutation-sequence/)                                                               | Hard       |                                                 |
| [LC 149 — Max Points on a Line](https://leetcode.com/problems/max-points-on-a-line/)                                                              | Hard       |                                                 |
| [LC 233 — Number of Digit One](https://leetcode.com/problems/number-of-digit-one/)                                                                | Hard       |                                                 |
| [LC 335 — Self Crossing](https://leetcode.com/problems/self-crossing/)                                                                            | Hard       |                                                 |
| [LC 391 — Perfect Rectangle](https://leetcode.com/problems/perfect-rectangle/)                                                                    | Hard       |                                                 |
| [LC 458 — Poor Pigs](https://leetcode.com/problems/poor-pigs/)                                                                                    | Hard       |                                                 |
| [LC 564 — Find the Closest Palindrome](https://leetcode.com/problems/find-the-closest-palindrome/)                                                | Hard       |                                                 |
| [LC 587 — Erect the Fence](https://leetcode.com/problems/erect-the-fence/)                                                                        | Hard       |                                                 |
| [LC 679 — 24 Game](https://leetcode.com/problems/24-game/)                                                                                        | Hard       |                                                 |
| [LC 753 — Cracking the Safe](https://leetcode.com/problems/cracking-the-safe/)                                                                    | Hard       |                                                 |
| [LC 810 — Chalkboard XOR Game](https://leetcode.com/problems/chalkboard-xor-game/)                                                                | Hard       |                                                 |
| [LC 887 — Super Egg Drop](https://leetcode.com/problems/super-egg-drop/)                                                                          | Hard       |                                                 |
| [LC 906 — Super Palindromes](https://leetcode.com/problems/super-palindromes/)                                                                    | Hard       |                                                 |
| [LC 1012 — Numbers With Repeated Digits](https://leetcode.com/problems/numbers-with-repeated-digits/)                                             | Hard       |                                                 |
| [LC 1088 — Confusing Number II](https://leetcode.com/problems/confusing-number-ii/)                                                               | Hard       |                                                 |
| [LC 1363 — Largest Multiple of Three](https://leetcode.com/problems/largest-multiple-of-three/)                                                   | Hard       |                                                 |
| [LC 1397 — Find All Good Strings](https://leetcode.com/problems/find-all-good-strings/)                                                           | Hard       |                                                 |
| [CC — Advanced Number Theory (ADVNUM)](https://www.codechef.com/problems/ADVNUM)                                                                  | Hard       |                                                 |
| [CC — Chinese Remainder Theorem (CRT)](https://www.codechef.com/problems/CRT)                                                                     | Hard       |                                                 |
| [CC — Extended Euclidean (EXTEUC)](https://www.codechef.com/problems/EXTEUC)                                                                      | Hard       |                                                 |

---

## Related Topics

- [School Basics](../school-basics/README.md) — primes, GCD, factorial
- [Bit Manipulation](../bit-manipulation/README.md) — arithmetic bit tricks

[← Back to Home](../index.md) · © sparshjaswal
