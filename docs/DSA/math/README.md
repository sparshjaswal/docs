---
id: dsa-math-readme
title: "➗ Math"
slug: /DSA/math/README
sidebar_label: "Math"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

# Math for problem solving

Math questions become easier when you explain what is being counted or preserved before selecting a formula. Start with the first three lessons after learning loops and arrays. Return to modular arithmetic and combinatorics after you are comfortable with integer limits and `BigInt`; they are not prerequisites for learning an array or a linked list.

## Learning steps

You do not need advanced mathematics for every algorithm. Choose the calculation that matches the question: factors, repeated cycles, counts, or remainders.

1. Begin with divisors, primes, GCD, and LCM.
2. Check integer precision before modular arithmetic or fast powers.
3. Study counting formulas only after defining which outcomes are distinct.

## Follow this learning order

| Step | Lesson | What you should be able to explain |
| --- | --- | --- |
| 1 | [Factors and divisors](./prime-factors/README.md) | Why divisor pairs let us stop at a square root; why 1 is not prime. |
| 2 | [GCD](./euclidean-algorithm/README.md) → [LCM](./least-common-multiple/README.md) | Why a remainder preserves common divisors; when two cycles meet. |
| 3 | [Primality](./primality-test/README.md) → [sieve and smallest prime factors](./sieve-of-eratosthenes/README.md) | When one query needs trial division and when many queries justify a table. |
| 4 | [Factorial](./factorial/README.md) → [fast powering](./fast-powering/README.md) | How an accumulator works; how reusing squares reduces multiplications. |
| 5 | [Modular arithmetic and inverses](./modular-arithmetic/README.md) | Why reducing early works; why division needs an inverse; how to avoid precision loss. |
| 6 | [Combinatorics](./combinatorics/README.md) → [Pascal's triangle](./pascal-triangle/README.md) | Distinguish ordered arrangements from teams; derive counting recurrences and binomial queries. |

A **safe integer** is a `Number` whose integer value is exact within JavaScript's guaranteed range, from `-(2^53 - 1)` to `2^53 - 1`. Check intermediate products and sums, not just input values. The large-count examples use `BigInt`, while array positions remain ordinary numbers.

## One problem: count trailing zeros without constructing a factorial

A trailing zero comes from a factor of 10, and `10 = 2 × 5`. In `n!` there are at least as many factors of 2 as factors of 5, so count the 5s. Each multiple of 5 contributes one, each multiple of 25 contributes another, and each multiple of 125 another.

For `30!`, the multiples `5, 10, 15, 20, 25, 30` contribute 6 factors of 5, and 25 contributes one extra. The answer is 7. We never need the enormous factorial itself.

```js runnable
function trailingZeroes(n) {
  if (!Number.isSafeInteger(n) || n < 0) {
    throw new RangeError('Expected a nonnegative safe integer');
  }
  let remaining = n;
  let count = 0;
  while (remaining >= 5) {
    remaining = Math.floor(remaining / 5);
    count += remaining;
  }
  return count;
}

console.log(trailingZeroes(30));
console.log(trailingZeroes(100));
console.log(trailingZeroes(0));
```

```text output
7
24
0
```

Each iteration counts exactly one further power of 5 in the factors, so no factor is missed or double-counted. Repeated division avoids computing an overflowing power of 5. This needs O(log n) time and O(1) extra space. A common mistake is counting only the multiples of 5 and forgetting the extra copies in 25, 125, and so on.

**Check:** how many trailing zeros are in `25!`?

<details>
<summary>Hint</summary>

List the multiples of 5, then ask whether any contribute a second factor of 5.

</details>

<details>
<summary>Answer</summary>

There are 6: five multiples of 5, plus a second factor from 25. Multiplying out the factorial would solve a harder problem than the one asked.

</details>

## Optional mathematics, after the core

[Fibonacci](./fibonacci.md) connects recurrences to dynamic programming. [Integer partitions](./integer-partition/README.md) extend counting. [Horner's method](./horner-method/README.md), [matrix operations](./matrix/README.md), and [complex numbers](./complex-number/README.md) matter for particular advanced problems; study them when a problem needs them.

[Fourier transforms](./fourier-transform/README.md), [radians](./radian/README.md), [Euclidean geometry](./euclidean-distance/README.md), [the Liu Hui approximation](./liu-hui/README.md), and the [full floating-point bit layout](./binary-floating-point/README.md) are specialist extensions. They remain available without interrupting the core DSA path. Understanding the safe-integer and rounding pitfalls is still required even if you skip the full bit layout.

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| <PracticeProblem id={13} title={"Roman to Integer"} text={"Problem statement\nConvert a valid Roman numeral s to an integer. I, V, X, L, C, D, and M represent 1, 5, 10, 50, 100,\n500, and 1000. Ordinarily symbols add. In the pairs IV, IX, XL, XC, CD, and CM, subtract the smaller\nsymbol from the following larger symbol. s represents a value from 1 through 3999.\nInput \u0026 expected result\nThe string is already a valid Roman representation; validation of arbitrary malformed notation is\nnot required. Read the permitted subtractive pairs as units, with the remaining symbols adding\ntheir values.\nEXAMPLE 1\nInput: s = \"XLIV\"\nOutput: 44\nExplanation: XL contributes 40 and IV contributes 4. Together they represent 44.\nEXAMPLE 2\nInput: s = \"DCCII\"\nOutput: 702\nExplanation: D, CC, and II contribute 500, 200, and 2.\nConstraints \u0026 guarantees\n• s.length: 1 through 15 (inclusive)\n• Alphabet: I, V, X, L, C, D, M. The input is a valid Roman representation of an integer from 1 through\n3999\nJavaScript starter\nfunction romanToInt(s) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/roman-to-integer/) | — |
| <PracticeProblem id={202} title={"Happy Number"} text={"Problem statement\nStarting with a positive integer n, replace it repeatedly with the sum of the squares of its decimal\ndigits. Return true if the process eventually reaches 1. Return false if it continues in a repeating\ncycle that never reaches 1.\nInput \u0026 expected result\nReturn whether the repeated digit-square operation reaches 1. The process is deterministic: once a\nprevious value appears again without reaching 1, further repetition cannot change the outcome.\nEXAMPLE 1\nInput: n = 7\nOutput: true; 7 -\u003e 49 -\u003e 97 -\u003e 130 -\u003e 10 -\u003e 1\nExplanation: Following the successive digit-square sums eventually produces 1, establishing\nthat 7 is happy.\nEXAMPLE 2\nInput: n = 1\nOutput: true\nExplanation: The starting value already satisfies the target condition.\nConstraints \u0026 guarantees\n• n: 1 through 2^31 - 1 (inclusive)\nJavaScript starter\nfunction isHappy(n) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/happy-number/) | — |
| [LC 326 — Power of Three](https://leetcode.com/problems/power-of-three/) | Easy | [LeetCode](https://leetcode.com/problems/power-of-three/) | — |
| <PracticeProblem id={12} title={"Integer to Roman"} text={"Problem statement\nConvert an integer num from 1 through 3999 to its standard Roman numeral. Use I, V, X, L, C, D,\nand M, with subtractive forms IV, IX, XL, XC, CD, and CM. Write the thousands, hundreds, tens, and\nunits in order, using standard notation rather than alternatives such as four consecutive I symbols.\nInput \u0026 expected result\nReturn the numeral as an uppercase string. The output must follow the six permitted subtractive\ncases, so values such as 4 and 9 use IV and IX rather than repeating I excessively.\nEXAMPLE 1\nInput: num = 944\nOutput: \"CMXLIV\"\nExplanation: The hundreds are CM for 900, the tens are XL for 40, and the units are IV for 4.\nEXAMPLE 2\nInput: num = 58\nOutput: \"LVIII\"\nExplanation: 50, 5, and 3 are represented by L, V, and III.\nConstraints \u0026 guarantees\n• num: 1 through 3999 (inclusive)\nJavaScript starter\nfunction intToRoman(num) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/integer-to-roman/) | — |
| <PracticeProblem id={43} title={"Multiply Strings"} text={"Problem statement\nnum1 and num2 are nonempty strings of decimal digits representing nonnegative integers without\nunnecessary leading zeros. Return their product as a decimal string. Do not convert the full inputs\nto numeric values or use a big-integer library or BigInt to perform the multiplication.\nInput \u0026 expected result\nThe output must contain decimal digits only, with no leading zeros except for the single character\n\"0\". Individual digits may be processed numerically, but parsing either complete input into a\nnumeric type violates the intended restriction.\nEXAMPLE 1\nInput: num1 = \"24\", num2 = \"13\"\nOutput: \"312\"\nExplanation: Twenty-four multiplied by thirteen is 312, so the function returns the string \"312\".\nEXAMPLE 2\nInput: num1 = \"0\", num2 = \"987\"\nOutput: \"0\"\nExplanation: A zero factor produces zero, represented as a single digit without padding.\nConstraints \u0026 guarantees\n• num1.length, num2.length: 1 through 200 (inclusive)\n• Decimal digit strings have no leading zero unless the value is zero\nJavaScript starter\nfunction multiply(num1, num2) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/multiply-strings/) | — |
| <PracticeProblem id={172} title={"Factorial Trailing Zeroes"} text={"Problem statement\nReturn the number of trailing zero digits in n factorial, where n is nonnegative and n factorial is the\nproduct of integers 1 through n. By definition, 0 factorial is 1. Compute the count without\nconstructing the entire factorial. Aim for logarithmic running time.\nInput \u0026 expected result\nCount only the consecutive zeros at the end of the factorial's decimal representation, not zeros\nelsewhere. Return an integer count. The factorial itself grows rapidly, so computing it explicitly is\nnot needed for the requested result.\nEXAMPLE 1\nInput: n = 30\nOutput: 7\nExplanation: The decimal representation of 30! ends with seven zeros, so the trailing-zero count\nis 7.\nEXAMPLE 2\nInput: n = 4\nOutput: 0\nExplanation: Four factorial is 24, whose final decimal digit is not zero.\nConstraints \u0026 guarantees\n• n: 0 through 10^4 (inclusive)\nJavaScript starter\nfunction trailingZeroes(n) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/factorial-trailing-zeroes/) | — |
| [LC 168 — Excel Sheet Column Title](https://leetcode.com/problems/excel-sheet-column-title/) | Easy | [LeetCode](https://leetcode.com/problems/excel-sheet-column-title/) |  |
| [LC 171 — Excel Sheet Column Number](https://leetcode.com/problems/excel-sheet-column-number/) | Easy | [LeetCode](https://leetcode.com/problems/excel-sheet-column-number/) |  |
| [LC 258 — Add Digits](https://leetcode.com/problems/add-digits/) | Easy | [LeetCode](https://leetcode.com/problems/add-digits/) |  |
| [LC 263 — Ugly Number](https://leetcode.com/problems/ugly-number/) | Easy | [LeetCode](https://leetcode.com/problems/ugly-number/) |  |
| [LC 367 — Valid Perfect Square](https://leetcode.com/problems/valid-perfect-square/) | Easy | [LeetCode](https://leetcode.com/problems/valid-perfect-square/) |  |
| [LC 415 — Add Strings](https://leetcode.com/problems/add-strings/) | Easy | [LeetCode](https://leetcode.com/problems/add-strings/) |  |
| [LC 507 — Perfect Number](https://leetcode.com/problems/perfect-number/) | Easy | [LeetCode](https://leetcode.com/problems/perfect-number/) |  |
| [LC 728 — Self Dividing Numbers](https://leetcode.com/problems/self-dividing-numbers/) | Easy | [LeetCode](https://leetcode.com/problems/self-dividing-numbers/) |  |
| [LC 1175 — Prime Arrangements](https://leetcode.com/problems/prime-arrangements/) | Easy | [LeetCode](https://leetcode.com/problems/prime-arrangements/) |  |
| [LC 1281 — Subtract the Product and Sum of Digits](https://leetcode.com/problems/subtract-the-product-and-sum-of-digits-of-an-integer/) | Easy | [LeetCode](https://leetcode.com/problems/subtract-the-product-and-sum-of-digits-of-an-integer/) |  |
| [LC 1317 — Convert Integer to the Sum of Two No-Zero Integers](https://leetcode.com/problems/convert-integer-to-the-sum-of-two-no-zero-integers/) | Easy | [LeetCode](https://leetcode.com/problems/convert-integer-to-the-sum-of-two-no-zero-integers/) |  |
| [LC 1323 — Maximum 69 Number](https://leetcode.com/problems/maximum-69-number/) | Easy | [LeetCode](https://leetcode.com/problems/maximum-69-number/) |  |
| [LC 1360 — Number of Days Between Two Dates](https://leetcode.com/problems/number-of-days-between-two-dates/) | Easy | [LeetCode](https://leetcode.com/problems/number-of-days-between-two-dates/) |  |
| [CC — Add Two Numbers (FLOW001)](https://www.codechef.com/problems/FLOW001) | Easy | — |  |
| [CC — Small Factorials (FLOW018)](https://www.codechef.com/problems/FLOW018) | Easy | — |  |
| [CC — First and Last Digit (FLOW004)](https://www.codechef.com/problems/FLOW004) | Easy | — |  |
| [CC — Sum of Digits (FLOW006)](https://www.codechef.com/problems/FLOW006) | Easy | — |  |
| [CC — GCD and LCM (FLOW016)](https://www.codechef.com/problems/FLOW016) | Easy | — |  |
| [CC — Prime Generator (PRIME1)](https://www.codechef.com/problems/PRIME1) | Easy | — |  |
| [CC — Reverse Number (REVNUM)](https://www.codechef.com/problems/REVNUM) | Easy | — |  |
| [LC 29 — Divide Two Integers](https://leetcode.com/problems/divide-two-integers/) | Medium | [LeetCode](https://leetcode.com/problems/divide-two-integers/) |  |
| [LC 166 — Fraction to Recurring Decimal](https://leetcode.com/problems/fraction-to-recurring-decimal/) | Medium | [LeetCode](https://leetcode.com/problems/fraction-to-recurring-decimal/) |  |
| [LC 204 — Count Primes](https://leetcode.com/problems/count-primes/) | Medium | [LeetCode](https://leetcode.com/problems/count-primes/) |  |
| [LC 264 — Ugly Number II](https://leetcode.com/problems/ugly-number-ii/) | Medium | [LeetCode](https://leetcode.com/problems/ugly-number-ii/) |  |
| [LC 319 — Bulb Switcher](https://leetcode.com/problems/bulb-switcher/) | Medium | [LeetCode](https://leetcode.com/problems/bulb-switcher/) |  |
| [LC 365 — Water and Jug Problem](https://leetcode.com/problems/water-and-jug-problem/) | Medium | [LeetCode](https://leetcode.com/problems/water-and-jug-problem/) |  |
| [LC 396 — Rotate Function](https://leetcode.com/problems/rotate-function/) | Medium | [LeetCode](https://leetcode.com/problems/rotate-function/) |  |
| [LC 470 — Implement Rand10 Using Rand7](https://leetcode.com/problems/implement-rand10-using-rand7/) | Medium | [LeetCode](https://leetcode.com/problems/implement-rand10-using-rand7/) |  |
| [LC 593 — Valid Square](https://leetcode.com/problems/valid-square/) | Medium | [LeetCode](https://leetcode.com/problems/valid-square/) |  |
| [LC 633 — Sum of Square Numbers](https://leetcode.com/problems/sum-of-square-numbers/) | Medium | [LeetCode](https://leetcode.com/problems/sum-of-square-numbers/) |  |
| [LC 754 — Reach a Number](https://leetcode.com/problems/reach-a-number/) | Medium | [LeetCode](https://leetcode.com/problems/reach-a-number/) |  |
| [LC 780 — Reaching Points](https://leetcode.com/problems/reaching-points/) | Medium | [LeetCode](https://leetcode.com/problems/reaching-points/) |  |
| [LC 829 — Consecutive Numbers Sum](https://leetcode.com/problems/consecutive-numbers-sum/) | Medium | [LeetCode](https://leetcode.com/problems/consecutive-numbers-sum/) |  |
| [LC 858 — Mirror Reflection](https://leetcode.com/problems/mirror-reflection/) | Medium | [LeetCode](https://leetcode.com/problems/mirror-reflection/) |  |
| [LC 914 — X of a Kind in a Deck of Cards](https://leetcode.com/problems/x-of-a-kind-in-a-deck-of-cards/) | Medium | [LeetCode](https://leetcode.com/problems/x-of-a-kind-in-a-deck-of-cards/) |  |
| [LC 1006 — Clumsy Factorial](https://leetcode.com/problems/clumsy-factorial/) | Medium | [LeetCode](https://leetcode.com/problems/clumsy-factorial/) |  |
| [LC 1217 — Minimum Cost to Move Chips to The Same Position](https://leetcode.com/problems/minimum-cost-to-move-chips-to-the-same-position/) | Medium | [LeetCode](https://leetcode.com/problems/minimum-cost-to-move-chips-to-the-same-position/) |  |
| [LC 1390 — Four Divisors](https://leetcode.com/problems/four-divisors/) | Medium | [LeetCode](https://leetcode.com/problems/four-divisors/) |  |
| [CC — Modular Exponentiation (MODEX)](https://www.codechef.com/problems/MODEX) | Medium | — |  |
| [CC — Catalan Numbers (CATALAN)](https://www.codechef.com/problems/CATALAN) | Medium | — |  |
| [CC — Number Theory (NUMTHEORY)](https://www.codechef.com/problems/NUMTHEORY) | Medium | — |  |
| [LC 60 — Permutation Sequence](https://leetcode.com/problems/permutation-sequence/) | Hard | [LeetCode](https://leetcode.com/problems/permutation-sequence/) |  |
| [LC 233 — Number of Digit One](https://leetcode.com/problems/number-of-digit-one/) | Hard | [LeetCode](https://leetcode.com/problems/number-of-digit-one/) |  |
| [LC 335 — Self Crossing](https://leetcode.com/problems/self-crossing/) | Hard | [LeetCode](https://leetcode.com/problems/self-crossing/) |  |
| [LC 391 — Perfect Rectangle](https://leetcode.com/problems/perfect-rectangle/) | Hard | [LeetCode](https://leetcode.com/problems/perfect-rectangle/) |  |
| [LC 458 — Poor Pigs](https://leetcode.com/problems/poor-pigs/) | Hard | [LeetCode](https://leetcode.com/problems/poor-pigs/) |  |
| [LC 564 — Find the Closest Palindrome](https://leetcode.com/problems/find-the-closest-palindrome/) | Hard | [LeetCode](https://leetcode.com/problems/find-the-closest-palindrome/) |  |
| [LC 587 — Erect the Fence](https://leetcode.com/problems/erect-the-fence/) | Hard | [LeetCode](https://leetcode.com/problems/erect-the-fence/) |  |
| [LC 679 — 24 Game](https://leetcode.com/problems/24-game/) | Hard | [LeetCode](https://leetcode.com/problems/24-game/) |  |
| [LC 753 — Cracking the Safe](https://leetcode.com/problems/cracking-the-safe/) | Hard | [LeetCode](https://leetcode.com/problems/cracking-the-safe/) |  |
| [LC 810 — Chalkboard XOR Game](https://leetcode.com/problems/chalkboard-xor-game/) | Hard | [LeetCode](https://leetcode.com/problems/chalkboard-xor-game/) |  |
| [LC 887 — Super Egg Drop](https://leetcode.com/problems/super-egg-drop/) | Hard | [LeetCode](https://leetcode.com/problems/super-egg-drop/) |  |
| [LC 906 — Super Palindromes](https://leetcode.com/problems/super-palindromes/) | Hard | [LeetCode](https://leetcode.com/problems/super-palindromes/) |  |
| [LC 1088 — Confusing Number II](https://leetcode.com/problems/confusing-number-ii/) | Hard | [LeetCode](https://leetcode.com/problems/confusing-number-ii/) |  |
| [LC 1363 — Largest Multiple of Three](https://leetcode.com/problems/largest-multiple-of-three/) | Hard | [LeetCode](https://leetcode.com/problems/largest-multiple-of-three/) |  |
| [LC 1397 — Find All Good Strings](https://leetcode.com/problems/find-all-good-strings/) | Hard | [LeetCode](https://leetcode.com/problems/find-all-good-strings/) |  |
| [CC — Advanced Number Theory (ADVNUM)](https://www.codechef.com/problems/ADVNUM) | Hard | — |  |
| [CC — Chinese Remainder Theorem (CRT)](https://www.codechef.com/problems/CRT) | Hard | — |  |
| [CC — Extended Euclidean (EXTEUC)](https://www.codechef.com/problems/EXTEUC) | Hard | — |  |

{/* END GENERATED PRACTICE PROBLEMS */}

## Related Topics

- [School Basics](../school-basics/README.md) — primes, GCD, factorial
- [Bit Manipulation](../bit-manipulation/README.md) — arithmetic bit tricks

[← Back to Home](../index.md) · © sparshjaswal

**Next:** [bits and masks](../bit-manipulation/README.md).
