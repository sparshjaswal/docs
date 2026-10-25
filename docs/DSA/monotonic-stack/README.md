---
id: dsa-monotonic-stack-readme
title: "📉 Monotonic Stack"
slug: /DSA/monotonic-stack/README
sidebar_label: "Monotonic Stack"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# 📉 Monotonic Stack

Keep items on a stack while they wait for an answer. When a new value answers one of them, remove it. Keeping the waiting values in order makes this efficient.

---

<AlgorithmWalkthrough name="monotonicStack" />

## Learning steps

For each day’s temperature, find the first later warmer day. Earlier days wait on a stack until a new temperature answers them.

1. Store unresolved indices and trace equal values carefully.
2. Count each index’s push and possible pop to explain linear total work.
3. Change the answer from a value to a waiting distance, then attempt histogram problems.

## Concept

A **monotonic** order moves in one direction: values rise or fall without reversing. Store indices so you can return either a value or its distance. For the next-greater task, a larger incoming value answers smaller waiting values at the top; pop those indices, then store the new one.

Each index is pushed once and popped at most once. Across the whole input, that gives O(n) total stack work. Other tasks use a different removal rule, so define what the waiting indices mean before choosing increasing or decreasing order.

For a left-to-right next-strictly-greater scan, equal values stay on the stack, so its values are **non-increasing**, not necessarily strictly decreasing. Pop only when the incoming value is greater; for “greater or equal,” pop on equality too. Other scan directions and previous-element queries use different removal rules.

The invariant is that every stored index is unresolved. When a larger value arrives, it is the first qualifying value for each popped index: any earlier qualifying value would already have popped it. See the [pattern guide](../patterns.md) to distinguish nearest-neighbor queries from a heap's global minimum/maximum.

---

## Diagram

For next **strictly greater** values in `[2, 2, 3]`, both equal 2s wait for the later 3. The stack stores their indices.

| Incoming value | Waiting indices after the step | Answers found |
| --- | --- | --- |
| 2 at index 0 | `[0]` | None |
| 2 at index 1 | `[0, 1]` | None; equality is not greater |
| 3 at index 2 | `[2]` | Index 0 → 3 and index 1 → 3 |

The final index has no later greater value, so its answer keeps the missing-result marker.

---

## Time & Space Complexity

| Operation                      | Time | Space |
| ------------------------------ | ---- | ----- |
| Build NGE array                | O(n) | O(n)  |
| Daily Temperatures             | O(n) | O(n)  |
| Largest Rectangle in Histogram | O(n) | O(n)  |

---

## Common Patterns

### Pattern 1 — Next Greater Element

```js runnable
function nextGreaterElement(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = []; // stores indices
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) result[stack.pop()] = nums[i];
    stack.push(i);
  }
  return result;
}

console.log(JSON.stringify(nextGreaterElement([2, 2, 3])));
console.log(JSON.stringify(nextGreaterElement([3, 2, 1])));
console.log(JSON.stringify(nextGreaterElement([])));
```

```text output
[3,3,-1]
[-1,-1,-1]
[]
```

This template returns values and uses -1 when none exists. Store answer indices instead if -1 is a valid value whose presence must be distinguished from “not found.” Unresolved indices correctly retain the default; they do not need a final pop loop for this query.

### Pattern 2 — Daily Temperatures

```javascript
function dailyTemperatures(temps) {
  const result = new Array(temps.length).fill(0);
  const stack = [];
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[i] > temps[stack[stack.length - 1]]) {
      const idx = stack.pop();
      result[idx] = i - idx;
    }
    stack.push(i);
  }
  return result;
}
```

---

## When to Use

- Finding next/previous greater or smaller elements
- Range-based problems with comparisons
- Span and width problems (largest rectangle, trapping rain)
- Stock span problems

---

## Pitfalls

- Storing values instead of indices (indices let you compute distances)
- Forgetting a final boundary/sentinel pass for problems such as histogram area; next-greater queries can leave unresolved answers at their default
- Confusing increasing vs decreasing stack direction

---

## Worked examples and answers {/* #workbook-practice */}

Attempt the linked [Practice Problems](#practice-problems) before opening their answers. See the [workbook guide](../../javascript/workbook.md) for the A–C exercise format.

### 50. Monotonic structures string search and numeric tools {/* #workbook-50 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** recognize what useful information remains after earlier work is discarded.

For the worked next-greater example, follow the [waiting-index rule](#concept). Each index is pushed once and popped at most once, so total work is O(n), even with a nested loop. A deque extends the idea to [sliding-window maxima](../sliding-window/README.md): expired indices leave the front and dominated values leave the back. Efficient storage matters; repeated array shifts can add work.

The other techniques in this workbook lesson have their own explanations:

| Need | Read the rule and example | Fact to preserve |
| --- | --- | --- |
| Reuse an already matched string part | [KMP](../strings/knuth-morris-pratt/README.md), [Z array](../strings/z-algorithm/README.md) | The known matching prefix remains valid. |
| Compare substring fingerprints | [Rabin–Karp](../strings/rabin-karp/README.md) | A hash match may collide; verify the actual text. |
| Find shared divisors | [Euclid’s algorithm](../math/euclidean-algorithm/README.md) | Replacing a pair with divisor and remainder preserves its GCD. |
| List primes | [Sieve](../math/sieve-of-eratosthenes/README.md) | Mark multiples without marking the prime itself. |
| Raise a number efficiently | [Fast powers](../math/fast-powering/README.md) | Squaring and consuming exponent bits preserves the required power. |
| Search the smallest feasible answer | [Binary search](../binary-search/README.md) | Feasibility changes in one direction only. |

Read [numeric limits and masks](../bit-manipulation/README.md) before combining these tools. Number bitwise work uses 32 bits; BigInt must not be mixed with Number arithmetic and grows in arithmetic cost with operand size. For positive m, `((x % m) + m) % m` gives a nonnegative remainder.

**Worked example**

```js
function nextGreater(values) {
  const answer = Array(values.length).fill(null);
  const stack = [];
  for (let i = 0; i < values.length; i++) {
    while (stack.length && values[stack.at(-1)] < values[i]) {
      answer[stack.pop()] = values[i];
    }
    stack.push(i);
  }
  return answer;
}
console.log(JSON.stringify(nextGreater([2, 1, 3, 3])));
```

**Expected output**

```text
[3,3,null,null]
```

**Why the example works**

The new 3 resolves both 1 and 2. An equal 3 does not resolve the previous 3 because the contract requires strictly greater. Unresolved indexes keep null, a sentinel distinct from any finite numeric input. Each stored index leaves the stack at most once.

</details>

Find **50A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-50-answer">
<summary>Check your reasoning and answer</summary>

For Node checks, add `import assert from "node:assert/strict";` at the top of your file. Browser and multi-file examples use the setup stated above.

**50A.** Every iteration of the inner loop permanently removes one previously pushed index. There are n pushes and at most n pops, so total stack work is O(n).

**50B.** It is the length of the longest proper prefix of the examined pattern prefix that is also its suffix. Proper means shorter than the whole examined prefix, ensuring a mismatch fallback makes progress.

**50C.** Build fallback lengths from shorter prefixes, then scan the text while maintaining the matched prefix length. A mismatch follows fallbacks until a possible extension remains. Advancing text and reducing matched length gives linear total work. This implementation deliberately indexes code units, matching ordinary string indexing.

**Reference code**

Use the worked example above first if the answer calls its functions or classes. Run each lesson in its own `.mjs` file.

```js
function kmpIndex(text, pattern) {
  if (pattern.length === 0) return 0;
  const prefix = Array(pattern.length).fill(0);
  for (let i = 1, j = 0; i < pattern.length; i++) {
    while (j > 0 && pattern[i] !== pattern[j]) j = prefix[j - 1];
    if (pattern[i] === pattern[j]) j++;
    prefix[i] = j;
  }
  for (let i = 0, j = 0; i < text.length; i++) {
    while (j > 0 && text[i] !== pattern[j]) j = prefix[j - 1];
    if (text[i] === pattern[j]) j++;
    if (j === pattern.length) return i - pattern.length + 1;
  }
  return -1;
}
```

**Check the result**

```js
assert.equal(kmpIndex("ababac", "abac"), 2);
assert.equal(kmpIndex("aaaa", "aa"), 0);
assert.equal(kmpIndex("abc", "z"), -1);
assert.equal(kmpIndex("abc", ""), 0);
assert.equal(kmpIndex("", "a"), -1);
```

</details>

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **50A — Why is the nested loop linear in total?** | **Must fix** | [Worked example](#workbook-50) | [Answer](#workbook-50-answer) |
| **50B — What does a KMP prefix-table entry represent?** | **Must fix** | [Worked example](#workbook-50) | [Answer](#workbook-50-answer) |
| **50C — Implement kmpIndex(text, pattern), returning the first UTF-16 code-unit index or -1. Return 0 for an empty pattern.** | **Must fix** | [Worked example](#workbook-50) | [Answer](#workbook-50-answer) |
| <PracticeProblem id={496} title={"Next Greater Element I"} text={"Problem statement \u0026 expected result\nFor each value in nums1, locate its occurrence in nums2 and find the first strictly larger value to its right. Return\nthose answers in nums1 order, using -1 when none exists. Both arrays have distinct values and nums1 is a\nsubset of nums2.\nEXAMPLE 1\nInput: nums1 = [4,1,2], nums2 = [1,3,4,2]\nOutput: [-1,3,-1]\nExplanation: Only 1 has a greater value to its right: the first is 3.\nEXAMPLE 2\nInput: nums1 = [2,4], nums2 = [1,2,3,4]\nOutput: [3,-1]\nExplanation: The next greater value after 2 is 3; none follows 4.\nConstraints \u0026 guarantees\n- 1 \u003c= nums1.length \u003c= nums2.length \u003c= 1000\n- 0 \u003c= nums1[i], nums2[i] \u003c= 10^4\n- All integers in nums1 and nums2 are unique.\n- All the integers of nums1 also appear in nums2.\nJavaScript starter\nfunction nextGreaterElement(nums1, nums2) {\n// TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/next-greater-element-i/) | [Example](./LC-496-next-greater-element-i/index.mdx) |
| [LC 402 — Remove K Digits](https://leetcode.com/problems/remove-k-digits/) | Medium | [LeetCode](https://leetcode.com/problems/remove-k-digits/) | — |
| <PracticeProblem id={503} title={"Next Greater Element II"} text={"Problem statement \u0026 expected result\nFor every index, find the first strictly larger value encountered while moving right around the circular array. A scan\nmay wrap from the last index to the first. Return one answer per original index; use -1 when no larger value\nexists.\nEXAMPLE 1\nInput: nums = [1,2,1]\nOutput: [2,-1,2]\nExplanation: The final 1 wraps around to find 2; neither 1 is greater than 2.\nEXAMPLE 2\nInput: nums = [1,2,3,4,3]\nOutput: [2,3,4,-1,4]\nExplanation: The final 3 finds 4 after wrapping; 4 has no larger value.\nConstraints \u0026 guarantees\n- 1 \u003c= nums.length \u003c= 10^4\n- -10^9 \u003c= nums[i] \u003c= 10^9\nJavaScript starter\nfunction nextGreaterElements(nums) {\n// TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/next-greater-element-ii/) | — |
| <PracticeProblem id={739} title={"Daily Temperatures"} text={"Problem statement\nFor each day's temperature, determine how many days must pass until a strictly warmer\ntemperature occurs. Return an array of those waiting times. If there is no later warmer day, return\n0 at that position. Equal temperatures do not end the wait.\nInput \u0026 expected result\nThe output has the same length as temperatures. At index i, use the earliest later index j with\ntemperatures[j] greater than temperatures[i], and return j - i. No day may use a temperature from\nits past.\nEXAMPLE 1\nInput: temperatures = [60,62,61,65]\nOutput: [1,2,1,0]\nExplanation: Day 0 waits one day; day 1 waits until day 3; day 2 waits one day. The final day has\nno successor.\nEXAMPLE 2\nInput: temperatures = [70,70,68]\nOutput: [0,0,0]\nExplanation: An equal temperature is not warmer, and no entry has a later strictly higher\ntemperature.\nConstraints \u0026 guarantees\n• temperatures.length: 1 through 10^5 (inclusive)\n• temperatures[i]: 30 through 100 (inclusive)\nJavaScript starter\nfunction dailyTemperatures(temperatures) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/daily-temperatures/) | [Example](./LC-739-daily-temperatures/index.mdx) |
| <PracticeProblem id={853} title={"Car Fleet"} text={"Problem statement\nCars start at distinct positions below target and travel toward it at positive speeds. Cars cannot\npass: a car catching one ahead joins its fleet and moves at that fleet's speed. Fleets may form\nexactly at the destination. position and speed describe corresponding cars. Return the number of\nseparate fleets that arrive at target.\nInput \u0026 expected result\nEach car contributes to exactly one arriving fleet. Cars that are already together continue as one\ngroup even if their original speeds differ. Return only the fleet count; the order of cars in the input\narrays is not their road order.\nEXAMPLE 1\nInput: target = 12, position = [0,6,8], speed = [1,2,1]\nOutput: 2; the last two cars merge into one fleet\nExplanation: The cars starting at 6 and 8 meet at the target after four hours. The car starting at\n0 arrives separately.\nEXAMPLE 2\nInput: target = 10, position = [2,6], speed = [2,1]\nOutput: 1\nExplanation: Both cars reach position 10 at time 4, so they count as one fleet at the destination.\nConstraints \u0026 guarantees\n• n == position.length == speed.length\n• n: 1 through 10^5 (inclusive)\n• 0 \u003c target \u003c= 10^6\n• 0 \u003c= position[i] \u003c target\n• 0 \u003c speed[i] \u003c= 10^6\n• Starting positions do not repeat\nJavaScript starter\nfunction carFleet(target, position, speed) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/car-fleet/) | — |
| <PracticeProblem id={901} title={"Online Stock Span"} text={"Problem statement \u0026 expected result\nImplement an online stock-price tracker. next(price) returns how many consecutive days, ending today, have\nprices at most today's price. Include today and stop at the first earlier strictly higher price. Each call appends one\nday.\nEXAMPLE 1\nCreate StockSpanner; call next with prices [100,80,60,70,60,75,85].\nQuery results: [1,1,1,2,1,4,6]\nExplanation: At price 85, the previous five days are all at most 85; price 100 stops the span.\nEXAMPLE 2\nCreate StockSpanner; call next with prices [30,30,20,40].\nQuery results: [1,2,1,4]\nExplanation: Equal prices extend a span; the final price covers all four days.\nConstraints \u0026 guarantees\n- 1 \u003c= price \u003c= 10^5\n- At most 10^4 calls will be made to next.\nJavaScript starter\nclass StockSpanner {\nconstructor() { /* TODO */ }\nnext(price) { /* TODO */ }\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/online-stock-span/) | — |
| [LC 907 — Sum of Subarray Minimums](https://leetcode.com/problems/sum-of-subarray-minimums/) | Medium | [LeetCode](https://leetcode.com/problems/sum-of-subarray-minimums/) | — |
| [LC 1762 — Buildings With an Ocean View](https://leetcode.com/problems/buildings-with-an-ocean-view/) | Medium · Premium | [LeetCode](https://leetcode.com/problems/buildings-with-an-ocean-view/) | — |
| [LC 2104 — Sum of Subarray Ranges](https://leetcode.com/problems/sum-of-subarray-ranges/) | Medium | [LeetCode](https://leetcode.com/problems/sum-of-subarray-ranges/) | — |
| <PracticeProblem id={84} title={"Largest Rectangle in Histogram"} text={"Problem statement\nheights describes adjacent bars of width 1. Return the area of the largest rectangle that can fit\nentirely beneath the histogram. A rectangle may span one or more consecutive bars, and its height\ncannot exceed the shortest bar it spans. Heights are nonnegative.\nInput \u0026 expected result\nReturn area as an integer, not bar indices or rectangle dimensions. A selected rectangle must use a\ncontinuous horizontal span; separated tall bars cannot be combined across a lower bar without\nreducing the rectangle's height.\nEXAMPLE 1\nInput: heights = [2,4,4,1]\nOutput: 8, from the two middle bars\nExplanation: The two bars of height 4 support a rectangle of width 2 and height 4. Its area is 8.\nEXAMPLE 2\nInput: heights = [3,3,3]\nOutput: 9\nExplanation: A height-3 rectangle spans all three unit-width bars, giving area 3 * 3.\nConstraints \u0026 guarantees\n• heights.length: 1 through 10^5 (inclusive)\n• heights[i]: 0 through 10^4 (inclusive)\nJavaScript starter\nfunction largestRectangleArea(heights) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/largest-rectangle-in-histogram/) | — |
| <PracticeProblem id={85} title={"Maximal Rectangle"} text={"Problem statement \u0026 expected result\nThe grid contains character digits \"0\" and \"1\". Return the area of the largest axis-aligned rectangle containing\nonly \"1\" cells. Its width and height may differ. Return zero if the grid has no \"1\" cells.\nEXAMPLE 1\nInput: matrix =\n[[\"1\",\"0\",\"1\",\"0\",\"0\"],[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"0\",\"0\",\"1\",\"0\"]]\nOutput: 6\nExplanation: A 2-row by 3-column all-one block has area 6.\nEXAMPLE 2\nInput: matrix = [[\"0\"]]\nOutput: 0\nExplanation: The only cell is zero, so no positive-area rectangle qualifies.\nConstraints \u0026 guarantees\n- rows == matrix.length\n- cols == matrix[i].length\n- 1 \u003c= rows, cols \u003c= 200\n- matrix[i][j] is '0' or '1'.\nJavaScript starter\nfunction maximalRectangle(matrix) {\n// TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/maximal-rectangle/) | — |
| [LC 1526 — Minimum Number of Increments on Subarrays to Form a Target Array](https://leetcode.com/problems/minimum-number-of-increments-on-subarrays-to-form-a-target-array/) | Hard | [LeetCode](https://leetcode.com/problems/minimum-number-of-increments-on-subarrays-to-form-a-target-array/) | — |
| [LC 1944 — Number of Visible People in a Queue](https://leetcode.com/problems/number-of-visible-people-in-a-queue/) | Hard | [LeetCode](https://leetcode.com/problems/number-of-visible-people-in-a-queue/) | — |
| G11 — Find elements exceeding every element to their right. | Exercise | Arrays and hashing | — |
| [LC 456 — 132 Pattern](https://leetcode.com/problems/132-pattern/) | Medium | [LeetCode](https://leetcode.com/problems/132-pattern/) |  |
| [CC — Monotonicity Check (MONOTON)](https://www.codechef.com/problems/MONOTON) | Easy | — |  |
| [LC 316 — Remove Duplicate Letters](https://leetcode.com/problems/remove-duplicate-letters/) | Medium | [LeetCode](https://leetcode.com/problems/remove-duplicate-letters/) |  |
| [LC 581 — Shortest Unsorted Continuous Subarray](https://leetcode.com/problems/shortest-unsorted-continuous-subarray/) | Medium | [LeetCode](https://leetcode.com/problems/shortest-unsorted-continuous-subarray/) |  |
| [LC 962 — Maximum Width Ramp](https://leetcode.com/problems/maximum-width-ramp/) | Medium | [LeetCode](https://leetcode.com/problems/maximum-width-ramp/) |  |
| [LC 1019 — Next Greater Node in Linked List](https://leetcode.com/problems/next-greater-node-in-linked-list/) | Medium | [LeetCode](https://leetcode.com/problems/next-greater-node-in-linked-list/) |  |
| [LC 1124 — Longest Well-Performing Interval](https://leetcode.com/problems/longest-well-performing-interval/) | Medium | [LeetCode](https://leetcode.com/problems/longest-well-performing-interval/) |  |
| [LC 1130 — Minimum Cost Tree From Leaf Values](https://leetcode.com/problems/minimum-cost-tree-from-leaf-values/) | Medium | [LeetCode](https://leetcode.com/problems/minimum-cost-tree-from-leaf-values/) |  |
| [LC 1475 — Final Prices With a Special Discount](https://leetcode.com/problems/final-prices-with-a-special-discount-in-a-shop/) | Easy | [LeetCode](https://leetcode.com/problems/final-prices-with-a-special-discount-in-a-shop/) |  |
| [LC 1504 — Count Submatrices With All Ones](https://leetcode.com/problems/count-submatrices-with-all-ones/) | Medium | [LeetCode](https://leetcode.com/problems/count-submatrices-with-all-ones/) |  |
| [LC 1673 — Find the Most Competitive Subsequence](https://leetcode.com/problems/find-the-most-competitive-subsequence/) | Medium | [LeetCode](https://leetcode.com/problems/find-the-most-competitive-subsequence/) |  |
| [LC 1793 — Maximum Score of a Good Subarray](https://leetcode.com/problems/maximum-score-of-a-good-subarray/) | Hard | [LeetCode](https://leetcode.com/problems/maximum-score-of-a-good-subarray/) |  |
| [LC 2289 — Steps to Make Array Non-decreasing](https://leetcode.com/problems/steps-to-make-array-non-decreasing/) | Medium | [LeetCode](https://leetcode.com/problems/steps-to-make-array-non-decreasing/) |  |
| [CC — Stack Operations (STACKOP)](https://www.codechef.com/problems/STACKOP) | Easy | — |  |
| [CC — Histogram Area (HISTAREA)](https://www.codechef.com/problems/HISTAREA) | Medium | — |  |

{/* END GENERATED PRACTICE PROBLEMS */}

## Related Topics

- [Stack](../stack/README.md) — monotonic stack is a specialised stack
- [Sliding Window](../sliding-window/README.md) — sliding window maximum uses monotonic deque

[← Back to Home](../index.md) · © sparshjaswal

**Next:** [contest arithmetic](../math/README.md).
