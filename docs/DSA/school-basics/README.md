---
id: dsa-school-basics-readme
title: "🏫 School Level Basics"
slug: /DSA/school-basics/README
sidebar_label: "Programming basics"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Programming basics: turn a rule into steps

**Before this lesson:** complete [JavaScript for DSA](../javascript-for-dsa.md) through functions and loops. Learn the meaning of O(n) in [counting work](../complexity.md). You only need ordinary arithmetic here; recursion, prime sieves, and bit tricks come later.

A program carries out exact instructions. “Add the digits” is a goal, but the computer needs the steps: take one digit, add it to the total, remove it, and repeat. Start with a small example that you can check on paper.

## Learning steps

A rule such as “count scores above 50” must become exact checks and updates. Start with values you can verify on paper.

1. State the input and expected answer for one small case.
2. Trace digit extraction and counting loops one step at a time.
3. Solve a simulation by following the problem’s rules in order.

## One complete problem: sum the digits

**Contract:** receive a nonnegative safe integer and return the sum of its decimal digits. For 204, return `2 + 0 + 4 = 6`. For zero, return zero. We leave the caller's number unchanged.

A **decimal digit** is one of `0` through `9`. `%` gives the remainder after division: `204 % 10` is `4` because `204 = 20 × 10 + 4`. Dividing by ten and rounding down removes the last digit: `Math.floor(204 / 10)` is `20`.

<AlgorithmWalkthrough name="digits" />

```js runnable
function sumDigits(number) {
  if (!Number.isSafeInteger(number) || number < 0) {
    throw new RangeError('Use a nonnegative safe integer');
  }
  let remaining = number;
  let total = 0;
  while (remaining > 0) {
    const lastDigit = remaining % 10;
    total += lastDigit;
    remaining = Math.floor(remaining / 10);
  }
  return total;
}

console.log(sumDigits(204));
console.log(sumDigits(0));
console.log(sumDigits(999));
```

```text output
6
0
27
```

### Read each symbol

| Code | Meaning and purpose |
| --- | --- |
| `function sumDigits(number)` | Name a reusable operation and its input. Calling it supplies a value for `number`. |
| `{ ... }` | Group the instructions in a function, condition, or loop. |
| `Number.isSafeInteger(number)` | Check that the number is an exactly supported integer before using arithmetic on its digits. |
| `!condition` | Reverse true and false: reject when the check is not true. |
| `conditionA \|\| conditionB` | True if either condition is true. Here, either invalid kind or negative value is rejected. |
| `let remaining = number` | Make a working variable. `=` assigns a value; it does not test equality. |
| `while (remaining > 0)` | Repeat while some positive part of the number remains. Test the condition before each repetition. |
| `const lastDigit` | Name a value that is not reassigned during this repetition. A fresh value is created on the next repetition. |
| `total += lastDigit` | Short form of `total = total + lastDigit`. |
| `return total` | End the function and send its answer back to the caller. |

Use `===` to test equality. Writing `remaining = 0` inside a condition changes the variable instead of comparing it. Do not divide without `Math.floor`: `204 / 10` is `20.4`, which is no longer an integer with the intended digits.

### Walk through 204

```text
+------+-----------+------------+-------------+-----------+
| Step | remaining | last digit | total after | next part |
+------+-----------+------------+-------------+-----------+
|  1   |    204    |     4      |      4      |    20     |
|  2   |     20    |     0      |      4      |     2     |
|  3   |      2    |     2      |      6      |     0     |
+------+-----------+------------+-------------+-----------+
Stop: remaining is zero. Return 6.
```

Each row consumes exactly one rightmost digit. A zero inside the number is still processed; it simply adds nothing. The loop skips input zero entirely, and the initial total already gives the right result.

**Why it works:** before each iteration, `total` is the sum of the removed digits, and `remaining` contains all digits not yet removed. One step removes one digit and adds exactly that digit. The fact stays true until no digits remain. This is an **invariant**, a fact that every step preserves.

**Cost:** O(d) time for d decimal digits and O(1) extra memory for a fixed number of Number variables. A larger integer given as text should be processed as text or BigInt; converting it to Number first can lose digits.

## A second problem: count items that follow a rule

Suppose a contest asks how many scores are at least a passing mark. Check each score once. This is a **scan**: visiting items in order. A **counter** records how many successful checks you have seen.

```js runnable
function countPassing(scores, passingMark) {
  let count = 0;
  for (const score of scores) {
    if (score >= passingMark) count++;
  }
  return count;
}

console.log(countPassing([35, 50, 80, 49], 50));
console.log(countPassing([], 50));
```

```text output
2
0
```

For `[35, 50, 80, 49]`, the counter changes `0 → 0 → 1 → 2 → 2`. `>=` includes the boundary score 50; `>` would incorrectly exclude it. Before reading the next score, `count` describes precisely the scores already read. Every input is examined, so the time is O(n) and auxiliary space O(1). Negative scores or repeated scores need no special logic if the problem allows them.

## Simulation: follow the statement literally

An **implementation** or **ad hoc** problem may have no named algorithm. Its challenge is converting rules into the correct order of steps. For a robot that starts at zero, reads `L` as one step left and `R` as one step right, simulate each command.

```js runnable
function finalPosition(commands) {
  let position = 0;
  for (const command of commands) {
    if (command === 'L') position--;
    else if (command === 'R') position++;
    else throw new RangeError('Only L and R commands are allowed');
  }
  return position;
}

console.log(finalPosition('RLLR')); // 0 -> 1 -> 0 -> -1 -> 0
console.log(finalPosition(''));
```

```text output
0
0
```

This takes O(n) time and O(1) auxiliary space. After each command, the variable equals the robot's actual position. Look for simulation when events change a small state and the input is small enough to process every event. If there are a billion repeated identical commands, first ask whether arithmetic can replace the repetition.

## Practice before opening the answers

1. **Trace:** what are the successive totals for `sumDigits(105)`? Why does the middle zero not stop the loop?
2. **Modify:** count scores strictly below a threshold. Include an empty-input example.
3. **Combine:** return the farthest distance from zero reached by the robot at any time, including the start. For `RRLLL`, the answer is 2, although its final distance is 1.

<details>
<summary>Hints</summary>

Track the whole remaining number, not just its last digit. Change the score comparison. For the robot, keep both the current position and the largest absolute position seen so far.

</details>

<details>
<summary>Solutions and explanations</summary>

1. Totals are 5, 5, 6. After extracting 5, the remaining number is 10, so it is still positive. After extracting 0, the remaining number is 1.
2. Replace the test with `score < threshold`. The initial count gives zero for an empty array.
3. Each position is determined by the preceding position and one command. Updating the maximum after every move covers every visited position.

```js runnable
function farthestDistance(commands) {
  let position = 0;
  let farthest = 0;
  for (const command of commands) {
    if (command === 'L') position--;
    else if (command === 'R') position++;
    else throw new RangeError('Only L and R commands are allowed');
    farthest = Math.max(farthest, Math.abs(position));
  }
  return farthest;
}
console.log(farthestDistance('RRLLL'));
console.log(farthestDistance(''));
```

```text output
2
0
```

The new solution is still O(n) time and O(1) auxiliary space. Keeping only the final position would lose the information the question asks for.

</details>

**Next:** [arrays](../Array/README.md), where indices let you connect neighboring items. Return to [number theory](../math/README.md) later for divisibility, primes, and GCD. Use the [judge input/output guide](../javascript-for-dsa.md) to submit these functions as complete programs.

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| <PracticeProblem id={9} title={"Palindrome Number"} text={"Problem statement\nDetermine whether the decimal representation of integer x reads identically from left to right and\nright to left. Negative values are not palindromes because of their minus sign. Zero is a\npalindrome. Try to solve the problem without converting x into a string.\nInput \u0026 expected result\nRead the usual decimal representation without padding it with leading zeros. Return a boolean. For\na positive number ending in zero, reversing its digits would begin with a zero that is absent from\nthe original representation.\nEXAMPLE 1\nInput: x = 1221\nOutput: true\nExplanation: The sequence of decimal digits 1,2,2,1 is identical when read in reverse.\nEXAMPLE 2\nInput: x = 10\nOutput: false\nExplanation: The decimal string 10 does not read the same backward; an artificial leading zero\ncannot make it a palindrome.\nConstraints \u0026 guarantees\n• x: -2^31 through 2^31 - 1 (inclusive)\nJavaScript starter\nfunction isPalindrome(x) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/palindrome-number/) | [Example](./LC-9-palindrome-number/index.mdx) |
| <PracticeProblem id={58} title={"Length of Last Word"} text={"Problem statement\ns contains English letters and spaces, with at least one word. A word is a maximal consecutive run\nof non-space characters. Return the number of characters in the last word, ignoring any spaces at\nthe end. Do not count the spaces separating words.\nInput \u0026 expected result\nReturn an integer length rather than the final word itself. Leading spaces and repeated separators\nare allowed. The input guarantees that at least one non-space word exists.\nEXAMPLE 1\nInput: s = \" practice makes progress \"\nOutput: 8\nExplanation: After ignoring the trailing spaces, the final word is progress, which has eight\nletters.\nEXAMPLE 2\nInput: s = \"x \"\nOutput: 1\nExplanation: Trailing spaces do not contribute to the final word's length.\nConstraints \u0026 guarantees\n• s.length: 1 through 10^4 (inclusive)\n• Alphabet: English letters and spaces. At least one word is present\nJavaScript starter\nfunction lengthOfLastWord(s) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/length-of-last-word/) | — |
| <PracticeProblem id={66} title={"Plus One"} text={"Problem statement\ndigits represents a nonnegative integer in base 10, most significant digit first, without leading\nzeros unless the value is zero. Add one and return the resulting digit array. Carry may propagate\nacross several digits or create a new leading digit. Do not assume the number fits a native numeric\ntype.\nInput \u0026 expected result\nThe array stores digits individually, not a number in each position. Return a decimal digit array in\nthe same most-significant-first order. Retain internal zeros as needed, and ensure every result\nelement remains between 0 and 9.\nEXAMPLE 1\nInput: digits = [4,9,9]\nOutput: [5,0,0]\nExplanation: Adding one to the final 9 creates a carry through the next 9, increasing 4 to 5 and\nleaving two zeros.\nEXAMPLE 2\nInput: digits = [9,9]\nOutput: [1,0,0]\nExplanation: Ninety-nine plus one is 100, so the result needs an additional digit.\nConstraints \u0026 guarantees\n• digits.length: 1 through 100 (inclusive)\n• digits[i]: 0 through 9 (inclusive)\n• No unnecessary zero precedes the most significant digit\nJavaScript starter\nfunction plusOne(digits) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/plus-one/) | — |
| <PracticeProblem id={7} title={"Reverse Integer"} text={"Problem statement\nReverse the decimal digits of signed 32-bit integer x, preserving its sign. Discard any leading zeros\nin the reversed value. Return 0 when the reversed integer falls outside\n[-2147483648,2147483647]. Do not rely on a wider integer container to bypass the required\noverflow handling.\nInput \u0026 expected result\nThe sign remains attached to the reversed magnitude, and the result must lie within the signed\n32-bit interval. A reversed value outside that interval returns the sentinel 0 rather than being\nclamped or wrapped. Trailing input zeros disappear after reversal.\nEXAMPLE 1\nInput: x = -120\nOutput: -21\nExplanation: Reversing the magnitude 120 gives 021, numerically 21. Restoring the negative\nsign gives -21.\nEXAMPLE 2\nInput: x = 1563847412\nOutput: 0\nExplanation: Its reversed digits form 2147483651, which is greater than the maximum signed\n32-bit integer.\nConstraints \u0026 guarantees\n• x: -2^31 through 2^31 - 1 (inclusive)\nJavaScript starter\nfunction reverse(x) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/reverse-integer/) | — |
| [LC 1071 — GCD of Strings](https://leetcode.com/problems/greatest-common-divisor-of-strings/) | Easy | [LeetCode](https://leetcode.com/problems/greatest-common-divisor-of-strings/) | [View Solution](./LC-1071-greatest-common-divisor-of-strings/index.mdx) |
| [CC — ATM (HS08TEST)](https://www.codechef.com/problems/HS08TEST) | Easy | — |  |
| [CC — Factorial (FCTRL)](https://www.codechef.com/problems/FCTRL) | Easy | — | [View Solution](./FactorialOfNumber/index.mdx) |
| [CC — Chef and Squares (CHFSQRS)](https://www.codechef.com/problems/CHFSQRS) | Easy | — |  |
| [CC — Number of Rectangles (NRECT)](https://www.codechef.com/problems/NRECT) | Easy | — |  |
| [CC — Palindrome (PALIN)](https://www.codechef.com/problems/PALIN) | Easy | — |  |
| [LC 412 — Fizz Buzz](https://leetcode.com/problems/fizz-buzz/) | Easy | [LeetCode](https://leetcode.com/problems/fizz-buzz/) |  |
| [CC — Life, the Universe, and Everything (TEST)](https://www.codechef.com/problems/TEST) | Easy | — |  |
| [CC — Enormous Input Test (INTEST)](https://www.codechef.com/problems/INTEST) | Easy | — |  |
| [CC — Reverse The Number (FLOW007)](https://www.codechef.com/problems/FLOW007) | Easy | — |  |
| [CC — Find Remainder (FLOW002)](https://www.codechef.com/problems/FLOW002) | Easy | — |  |

{/* END GENERATED PRACTICE PROBLEMS */}

## Related Topics

- [Math](../math/README.md) — deeper number theory
- [Bit Manipulation](../bit-manipulation/README.md) — binary representation and bounded bit operations
- [Two Pointers](../two-pointers/README.md) — palindrome with two pointers

[← Back to Home](../index.md) · © sparshjaswal

**Next:** [arrays](../Array/README.md).
