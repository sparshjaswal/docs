---
id: dsa-binary-search-readme
title: "🔍 Binary Search"
slug: /DSA/binary-search/README
sidebar_label: "Binary Search"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Binary Search

Binary search checks the middle of an ordered group, then removes the half that cannot contain the answer. Learn [arrays](../Array/README.md) and [search](../search/README.md) first. Use the [pattern guide](../patterns.md) to distinguish a monotonic decision problem from a general optimization problem.

<AlgorithmWalkthrough name="binarySearch" />

## Learning steps

A sorted score list can answer “where does 60 begin?” A capacity problem can ask “what is the first size that works?” Both need a boundary that only moves one way.

1. Learn exact lookup in the [short introduction](../search/binary-search/README.md).
2. Find lower and upper bounds, including missing values and duplicates.
3. Prove that feasibility changes only once before searching an answer range.

## Choose the search space

| Request | Search space | Required argument |
| --- | --- | --- |
| Exact lookup, insertion point, duplicate range | Indices in a sorted array | Comparing the middle value eliminates one side. |
| Minimum feasible capacity, speed, or divisor | Ordered candidate answers | Feasibility changes from false to true at most once. |
| Search a rotated sorted array | Indices, using the sorted half | The usual logarithmic variant assumes distinct values. |
| Peak search | Indices, using adjacent comparisons | Discarding one side must preserve at least one peak; this is not arbitrary optimization. |

An interval must shrink on every iteration. Choose one boundary convention and keep it throughout the loop. The templates below use half-open index intervals: left is included, right is excluded.

## Lower bound, exact lookup, and duplicate ranges

`lowerBound` returns the first index whose value is at least the target, or the array length when no such value exists. `upperBound` returns the first index whose value is greater than the target. Input must be sorted ascending and contain comparable numbers, without `NaN`.

**Invariant:** every index before `left` is too small; every index at or after `right` satisfies the boundary condition. The unresolved interval is `[left, right)`. At termination, both boundaries meet at the insertion point.

```js runnable
function lowerBound(values, target) {
  let left = 0;
  let right = values.length;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (values[mid] < target) left = mid + 1;
    else right = mid;
  }
  return left;
}

function upperBound(values, target) {
  let left = 0;
  let right = values.length;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (values[mid] <= target) left = mid + 1;
    else right = mid;
  }
  return left;
}

function binarySearch(values, target) {
  const index = lowerBound(values, target);
  return index < values.length && values[index] === target ? index : -1;
}

const values = [1, 3, 3, 7];
console.log(JSON.stringify([lowerBound([], 7), lowerBound(values, 3), lowerBound(values, 9)]));
console.log(JSON.stringify([binarySearch(values, 3), binarySearch(values, 4)]));
console.log(JSON.stringify([lowerBound(values, 3), upperBound(values, 3) - 1]));
```

```text output
[0,1,4]
[1,-1]
[1,2]
```

For an absent target, lower and upper bounds are equal. Check that the target exists before treating `upperBound - 1` as its last occurrence. Its count is always `upperBound - lowerBound`.

### Trace: first 3 in [1, 3, 3, 7]

| Before: left, right | mid | Comparison | After |
| --- | --- | --- | --- |
| 0, 4 | 2 | 3 is at least 3 | right = 2 |
| 0, 2 | 1 | 3 is at least 3 | right = 1 |
| 0, 1 | 0 | 1 is less than 3 | left = 1 |
| 1, 1 | — | No unresolved indices | Return 1 |

## Binary search on the answer

For a nonempty array of positive integers, find the smallest positive divisor whose rounded-up division sum is at most `threshold`. If the threshold is smaller than the number of elements, no divisor works. Assume all values and accumulated sums stay within JavaScript's safe-integer range.

**Monotonicity:** increasing the divisor cannot increase any rounded-up quotient. Thus feasibility changes only from false to true. The largest input value is feasible whenever the threshold is at least the array length.

```js runnable
function smallestDivisor(values, threshold) {
  if (threshold < values.length) return -1;
  let left = 1;
  let right = 1;
  for (const value of values) right = Math.max(right, value);

  function feasible(divisor) {
    let total = 0;
    for (const value of values) {
      total += Math.ceil(value / divisor);
      if (total > threshold) return false;
    }
    return true;
  }

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (feasible(mid)) right = mid;
    else left = mid + 1;
  }
  return left;
}

console.log(smallestDivisor([1, 2, 5, 9], 6));
console.log(smallestDivisor([2, 3], 1));
console.log(smallestDivisor([7], 7));
```

```text output
5
-1
1
```

This example is O(n log M) for maximum value M ≥ 2, with O(1) extra space; M = 1 takes O(n) including the initial scan. More generally, answer search costs the number of iterations times the cost of one feasibility check. See [shipping capacity](./LC-1101-capacity-to-ship-packages-within-d-days/index.mdx) for another monotonic predicate.

## Search a rotated sorted array

With distinct values, at least one half is sorted. Check whether the target belongs to that half before discarding it. This template uses a closed interval `[left, right]`, so equality is included in the loop condition.

```js runnable
function searchRotated(values, target) {
  let left = 0;
  let right = values.length - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (values[mid] === target) return mid;
    if (values[left] <= values[mid]) {
      if (values[left] <= target && target < values[mid]) right = mid - 1;
      else left = mid + 1;
    } else {
      if (values[mid] < target && target <= values[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}

console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 0));
console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 3));
console.log(searchRotated([], 3));
```

```text output
4
-1
-1
```

Duplicates can make the sorted-half test ambiguous. A duplicate-aware variant may need to discard equal endpoints individually and can degrade to O(n).

## Complexity and pitfalls

| Variant | Time | Extra space |
| --- | --- | --- |
| Lower/upper bound, exact lookup | O(log n) for nonempty input | O(1) |
| Duplicate range using two boundaries | O(log n) | O(1) |
| Rotated lookup with distinct values | O(log n) | O(1) |
| Answer search across W candidates | O(C log W) for W ≥ 2, check cost C | Depends on the predicate |

- Empty input is valid for the index-search helpers; lower and upper bound return 0, exact lookup returns -1.
- Sorting first may cost more than one linear search and changes original positions. Preserve indices if the output needs them.
- A half-open loop uses `left < right`; a closed exact-search loop uses `left <= right`. Neither is universally correct without its invariant.
- Prefer `Math.floor` to bitwise midpoint shortcuts, which coerce JavaScript numbers to signed 32-bit integers.
- The answer-space upper bound must include a feasible answer, or infeasibility must be handled explicitly.
- A function name such as `feasible` does not prove monotonicity. Explain how increasing the candidate changes the result.


## Worked examples and answers {/* #workbook-practice */}

Attempt the linked [Practice Problems](#practice-problems) before opening their answers. See the [workbook guide](../../javascript/workbook.md) for the A–C exercise format.

### 21. Binary search and reusable problem patterns {/* #workbook-21 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** explain why a search may safely skip candidates, then apply that reasoning to a pair-sum problem.

The example below uses a **closed interval**: both `left` and `right` remain possible answers. The [exact-lookup lesson](../search/binary-search/README.md#keep-one-interval-convention) explains its shrinking rule. Unlike the lower-bound version above, it returns any matching duplicate, not necessarily the first. Sorting first has a cost and may change the original positions.

For exercise C, read the [two-pointer pair-sum argument](../two-pointers/README.md#pattern-1--opposite-direction-two-sum-sorted). With sorted values, a sum that is too small rules out the current left value paired with every remaining smaller right value. A sum that is too large rules out the current right value with every remaining larger left value. Keep the indices distinct.

For neighboring-value tasks, compare [sliding windows](../sliding-window/README.md) with [prefix sums](../prefix-sum/README.md). A sum-based shrinking rule may require nonnegative values; prefix subtraction does not have that restriction. These are separate assumptions, not interchangeable templates.

**Worked example**

```js
function binarySearch(values, target) {
  let left = 0, right = values.length - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (values[mid] === target) return mid;
    if (values[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
console.log(binarySearch([2, 4, 7, 9], 7));
```

**Expected output**

```text
2
```

The target index is 2. The interval always contains every remaining possible answer. Updates exclude the already-checked middle position. Binary search uses O(log n) time and O(1) auxiliary space here.

**Trace the example step by step**

1. For [2, 4, 7, 9], left is 0 and right is 3. The first midpoint is 1, whose value is 4.

2. Because 4 &lt; 7, indices 0 and 1 cannot contain the target. Set left to 2.

3. The remaining interval is [2, 3]. Its midpoint is 2, whose value is 7.

4. Return index 2. Repeated halving gives O(log n) comparisons, while the few indices use O(1) auxiliary space.

Search interval Middle value Decision for target 7

left 0 and right 3 values[1] is 4 Set left to 2

left 2 and right 3 values[2] is 7 Return index 2

**Common mistakes and how to reason about them**

Do not sort solely to use binary search without counting the sorting cost. A one-off membership question may be cheaper with a linear scan. Do not update left = mid or right = mid in this inclusive version; the interval can stop shrinking. For pair sums, left &lt; right prevents using the same element twice.

</details>

Find **21A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-21-answer">
<summary>Check your reasoning and answer</summary>

For Node checks, add `import assert from "node:assert/strict";` at the top of your file. Browser and multi-file examples use the setup stated above.

**21A.** -1. right starts at -1, so the loop does not execute.

For empty input, right is -1 and left is 0. The condition left &lt;= right is false immediately, so the function returns -1 without reading an array element.

**21B.** Discarding a half is justified only by the ordering assumption; an unsorted half might contain the target.

Without sorting, a small middle value does not imply that everything to its left is small. The function can discard a region containing the answer. The elimination proof, rather than the code shape, explains the prerequisite.

**21C.** Move inward according to whether the sum is too small or too large. Stop when the indices meet.

For [1, 2, 4, 6] and target 8, 1 + 6 is too small, so advance left; 2 + 6 then succeeds. For target 12, the function must not reuse the sole 6. Each move shrinks the search region, giving O(n) time and O(1) auxiliary space for already sorted input.

**Reference code**

```js
function hasPairSum(sorted, target) {
  let left = 0, right = sorted.length - 1;
  while (left < right) {
    const sum = sorted[left] + sorted[right];
    if (sum === target) return true;
    if (sum < target) left++;
    else right--;
  }
  return false;
}
```

**Check the result**

```js
assert.equal(hasPairSum([1, 3, 4, 8], 7), true);
assert.equal(hasPairSum([3], 6), false);
assert.equal(hasPairSum([-3, 1, 4], 1), true);
```

</details>

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **21A — What does binarySearch([], 7) return?** | **Must fix** | [Worked example](#workbook-21) | [Answer](#workbook-21-answer) |
| **21B — Why can this function fail on an unsorted array?** | **Must fix** | [Worked example](#workbook-21) | [Answer](#workbook-21-answer) |
| **21C — Write hasPairSum(sorted, target) using two pointers and distinct indices. Return a boolean.** | **Must fix** | [Worked example](#workbook-21) | [Answer](#workbook-21-answer) |
| <PracticeProblem id={69} title={"Sqrt(x)"} text={"Problem statement\nGiven nonnegative integer x, return the greatest integer r such that r squared is no greater than x.\nThis is the square root rounded down. Do not use built-in square-root or exponentiation functions\nor operators to calculate the answer.\nInput \u0026 expected result\nThe output must be a nonnegative integer satisfying r*r \u003c= x and (r + 1)*(r + 1) \u003e x. Perfect\nsquares return their exact integer root. Respect the restriction on root and exponentiation helpers.\nEXAMPLE 1\nInput: x = 20\nOutput: 4\nExplanation: Four squared is 16 and five squared is 25, so 4 is the greatest integer whose\nsquare does not exceed 20.\nEXAMPLE 2\nInput: x = 36\nOutput: 6\nExplanation: Thirty-six is a perfect square, so no rounding changes its exact root.\nConstraints \u0026 guarantees\n• x: 0 through 2^31 - 1 (inclusive)\nJavaScript starter\nfunction mySqrt(x) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/sqrtx/) | — |
| <PracticeProblem id={278} title={"First Bad Version"} text={"Problem statement\nVersions are numbered 1 through n. Starting at one unknown bad version, every subsequent\nversion is bad. The judge provides isBadVersion(version). Find the first bad version while\nminimizing calls to that function.\nInput \u0026 expected result\nThe displayed bad value defines the judge's hidden behavior; it is not an argument to your search\nfunction.\nEXAMPLE 1\nInput: n = 8, bad = 6\nOutput: 6\nExplanation: Versions 1 through 5 pass; versions 6 through 8 fail.\nEXAMPLE 2\nInput: n = 1, bad = 1\nOutput: 1\nExplanation: The only version is the first bad version.\nConstraints \u0026 guarantees\n• 1 \u003c= bad \u003c= n \u003c= 2^31 - 1\nJavaScript starter\nvar solution = function(isBadVersion) {\n  return function(n) {\n    // TODO: return the first bad version.\n  };\n};"} /> | Easy | [LeetCode](https://leetcode.com/problems/first-bad-version/) | — |
| <PracticeProblem id={704} title={"Binary Search"} text={"Problem statement\nGiven a strictly increasing integer array nums, return the zero-based index of target or -1 if it does\nnot appear. Use binary search or another algorithm with O(log n) running time. nums is nonempty.\nInput \u0026 expected result\nReturn an existing position only for an exact equality match. An absent value yields -1 rather than\nan insertion position. The sorted, distinct input permits logarithmic-time search, and no\nmodification of nums is required.\nEXAMPLE 1\nInput: nums = [-4,0,3,9], target = 3\nOutput: 2\nExplanation: The value 3 is the third entry, which has zero-based index 2.\nEXAMPLE 2\nInput: nums = [1,4,8], target = 6\nOutput: -1\nExplanation: Although 6 belongs between 4 and 8 numerically, it is not an array element.\nConstraints \u0026 guarantees\n• nums.length: 1 through 10^4 (inclusive)\n• -10^4 \u003c nums[i], target \u003c 10^4\n• Values are distinct and in increasing order\nJavaScript starter\nfunction search(nums, target) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/binary-search/) | — |
| [LC 1539 — Kth Missing Positive Number](https://leetcode.com/problems/kth-missing-positive-number/) | Easy | [LeetCode](https://leetcode.com/problems/kth-missing-positive-number/) | — |
| <PracticeProblem id={33} title={"Search in Rotated Sorted Array"} text={"Problem statement\nnums was formed by rotating a strictly increasing array, possibly by zero positions. Find target and\nreturn its zero-based index in the current array, or -1 if absent. All values are distinct. Your search\nmust run in O(log n) time.\nInput \u0026 expected result\nReturn the target's position after rotation, not where it appeared in the original sorted array. A\nrotation preserves each sorted segment's order and contains no duplicate values. Report -1 only\nwhen target is not present.\nEXAMPLE 1\nInput: nums = [8,10,1,3,5], target = 3\nOutput: 3\nExplanation: In the supplied rotated array, value 3 is at zero-based index 3.\nEXAMPLE 2\nInput: nums = [6,8,1,3], target = 5\nOutput: -1\nExplanation: The target does not appear in either part of the rotated array.\nConstraints \u0026 guarantees\n• nums.length: 1 through 5000 (inclusive)\n• nums[i]: -10^4 through 10^4 (inclusive)\n• target: -10^4 through 10^4 (inclusive)\n• Values are distinct\n• the array is an increasing sequence after an optional cyclic rotation\nJavaScript starter\nfunction search(nums, target) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/search-in-rotated-sorted-array/) | — |
| <PracticeProblem id={34} title={"Find First and Last Position of Element in Sorted Array"} text={"Problem statement\nnums is sorted in ascending order and may contain duplicates. Return the first and last indices at\nwhich target appears. Return [-1,-1] if it is absent, including for an empty input array. Use O(log n)\ntime rather than scanning the array.\nInput \u0026 expected result\nBoth output positions are inclusive and refer to the original array. If target occurs once, the first\nand last indices are equal. The logarithmic-time requirement still applies when a large fraction of\nthe array contains target.\nEXAMPLE 1\nInput: nums = [1,2,2,2,5], target = 2\nOutput: [1,3]\nExplanation: The value 2 fills indices 1,2,3, so its first and last positions are 1 and 3.\nEXAMPLE 2\nInput: nums = [4,4,4], target = 4\nOutput: [0,2]\nExplanation: Every entry matches, and the inclusive range covers the entire array.\nConstraints \u0026 guarantees\n• nums.length: 0 through 10^5 (inclusive)\n• nums[i]: -10^9 through 10^9 (inclusive)\n• target: -10^9 through 10^9 (inclusive)\n• Values are in nondecreasing order\nJavaScript starter\nfunction searchRange(nums, target) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) | — |
| <PracticeProblem id={74} title={"Search a 2D Matrix"} text={"Problem statement\nmatrix is rectangular, with each row sorted ascending and the first value of every row larger than\nthe last value of the preceding row. Determine whether target occurs in the matrix. Use O(log(m *\nn)) time for m rows and n columns.\nInput \u0026 expected result\nReturn true or false rather than a coordinate. The row-boundary guarantee makes every later row's\nvalues larger than those in the previous row. Both dimensions are positive, and target need not lie\nwithin the matrix's value range.\nEXAMPLE 1\nInput: matrix = [[1,4,7],[10,13,16]], target = 13\nOutput: true\nExplanation: The requested value 13 occurs in the second row, so the existence query is true.\nEXAMPLE 2\nInput: matrix = [[1,3],[6,8]], target = 5\nOutput: false\nExplanation: The target lies between existing values but does not occur in any cell.\nConstraints \u0026 guarantees\n• m == matrix.length\n• n == matrix[i].length\n• m, n: 1 through 100 (inclusive)\n• matrix[i][j], target: -10^4 through 10^4 (inclusive)\nJavaScript starter\nfunction searchMatrix(matrix, target) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/search-a-2d-matrix/) | — |
| <PracticeProblem id={153} title={"Find Minimum in Rotated Sorted Array"} text={"Problem statement\nA nonempty strictly increasing array has been rotated, possibly back to its original order. Return\nthe smallest value in the resulting nums. All values are distinct. Your algorithm must take O(log n)\ntime.\nInput \u0026 expected result\nReturn the minimum element's value, not its index or the rotation count. The array may already be\nsorted after a full rotation. The distinct-value guarantee is available when deciding which portion\ncan contain the minimum.\nEXAMPLE 1\nInput: nums = [7,9,1,3,5]\nOutput: 1\nExplanation: The rotation places value 1 between 9 and 3, and it remains the smallest value in\nthe array.\nEXAMPLE 2\nInput: nums = [2,4,6]\nOutput: 2\nExplanation: The array is already in sorted order, so the minimum is its first element.\nConstraints \u0026 guarantees\n• n == nums.length\n• n: 1 through 5000 (inclusive)\n• nums[i]: -5000 through 5000 (inclusive)\n• Values are distinct\n• the increasing sequence has undergone 1 through n rotations, allowing its original order\nJavaScript starter\nfunction findMin(nums) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) | — |
| <PracticeProblem id={162} title={"Find Peak Element"} text={"Problem statement\nFind an index of a peak in nums: a value strictly greater than its immediate neighbors. Treat\npositions outside the array as negative infinity, so an endpoint may be a peak. Adjacent elements\nare unequal. If there are several peaks, return any one. Use O(log n) time.\nInput \u0026 expected result\nThe result is an index, not the peak's value. Only immediate left and right neighbors matter, so a\npeak need not be the global maximum. An array of length one has its sole position as a valid peak.\nEXAMPLE 1\nInput: nums = [1,4,3,2]\nOutput: 1\nExplanation: Value 4 at index 1 is greater than both neighboring values 1 and 3.\nEXAMPLE 2\nInput: nums = [5,3,1]\nOutput: 0\nExplanation: The first element exceeds its only real neighbor, and its missing left neighbor is\ntreated as negative infinity.\nConstraints \u0026 guarantees\n• nums.length: 1 through 1000 (inclusive)\n• nums[i]: -2^31 through 2^31 - 1 (inclusive)\n• Every pair of neighboring values differs\nJavaScript starter\nfunction findPeakElement(nums) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/find-peak-element/) | — |
| [LC 378 — Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) | Medium | [LeetCode](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) | — |
| <PracticeProblem id={658} title={"Find K Closest Elements"} text={"Problem statement\nSelect k elements of sorted array arr that are closest to x, keeping repeated values as separate\nelements. Compare absolute distances; when distances tie, the smaller value is preferred. Return\nthe selected values in ascending order.\nInput \u0026 expected result\nReturn values rather than indices. The target x need not occur in arr.\nEXAMPLE 1\nInput: arr = [1,3,5,7], k = 2, x = 4\nOutput: [3,5]\nExplanation: Both selected values are one unit from 4.\nEXAMPLE 2\nInput: arr = [1,3], k = 1, x = 2\nOutput: [1]\nExplanation: Distances tie, so the smaller value wins.\nConstraints \u0026 guarantees\n• 1 \u003c= k \u003c= arr.length\n• 1 \u003c= arr.length \u003c= 10^4\n• arr is nondecreasing\n• -10^4 \u003c= arr[i], x \u003c= 10^4\nJavaScript starter\nfunction findClosestElements(arr, k, x) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/find-k-closest-elements/) | — |
| <PracticeProblem id={875} title={"Koko Eating Bananas"} text={"Problem statement\npiles contains positive banana counts. At integer speed k, Koko chooses one pile each hour and\neats up to k bananas from it. If that pile has fewer than k, she finishes it and waits for the next hour\nrather than starting another pile. Return the smallest positive speed that finishes every pile within\nh hours. h is at least the number of piles.\nInput \u0026 expected result\nKoko uses one fixed positive integer speed for every hour. Each nonempty pile takes a whole\nnumber of hours, and spare capacity in a finishing hour cannot be transferred to another pile.\nMinimize speed while meeting the overall deadline.\nEXAMPLE 1\nInput: piles = [4,8], h = 4\nOutput: 4\nExplanation: At speed 4, the piles take one and two hours. Speed 3 would take two and three\nhours, exceeding the four-hour limit.\nEXAMPLE 2\nInput: piles = [3,7], h = 2\nOutput: 7\nExplanation: With exactly one hour available per pile, the speed must be enough to finish the\nlarger pile in one hour.\nConstraints \u0026 guarantees\n• piles.length: 1 through 10^4 (inclusive)\n• h: piles.length through 10^9 (inclusive)\n• piles[i]: 1 through 10^9 (inclusive)\nJavaScript starter\nfunction minEatingSpeed(piles, h) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/koko-eating-bananas/) | — |
| <PracticeProblem id={981} title={"Time Based Key-Value Store"} text={"Problem statement\nImplement TimeMap. set(key,value,timestamp) records a value at that time. get(key,timestamp)\nreturns the value recorded for that key at the greatest stored time no later than the requested\ntime, or \"\" if none exists. set timestamps are strictly increasing across calls. The constructor\ncreates an empty store.\nInput \u0026 expected result\nDifferent keys maintain independent histories. A lookup may ask about a time between updates,\nbefore the first update, or after the last update. get does not add a record and must return an\nempty string when no qualifying history exists.\nEXAMPLE 1\nOperations: set(\"a\",\"old\",2), set(\"a\",\"new\",5), get(\"a\",4), get(\"a\",5)\nQuery results: \"old\", \"new\"\nExplanation: Time 4 uses the earlier record at time 2; time 5 includes the update made exactly\nat that timestamp.\nEXAMPLE 2\nOperations: set(\"x\",\"v\",5), get(\"x\",4), get(\"x\",9), get(\"y\",9)\nQuery results: \"\", \"v\", \"\"\nExplanation: No x record exists by time 4, the time-5 record remains valid at time 9, and y has\nno history.\nConstraints \u0026 guarantees\n• key.length, value.length: 1 through 100 (inclusive)\n• timestamp: 1 through 10^7 (inclusive)\n• Keys and values use a-z and digits. set timestamps increase strictly across calls. Combined method\ncalls: at most 2 * 10^5\nJavaScript starter\nclass TimeMap {\n  constructor() { /* TODO */ }\n  set(key, value, timestamp) { /* TODO */ }\n  get(key, timestamp) { /* TODO */ }\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/time-based-key-value-store/) | — |
| <PracticeProblem id={1011} title={"Capacity To Ship Packages Within D Days"} text={"Problem statement \u0026 expected result\nShip the packages in their given order within at most days days. Each day's consecutive batch must fit within one\nfixed ship capacity. Return the smallest capacity that can ship every package; packages cannot be split or\nreordered.\nEXAMPLE 1\nInput: weights = [1,2,3,4,5,6,7,8,9,10], days = 5\nOutput: 15\nExplanation: Capacity 15 permits daily batches ending at weights 5, 7, 8, 9 and 10.\nEXAMPLE 2\nInput: weights = [3,2,2,4,1,4], days = 3\nOutput: 6\nExplanation: Capacity 6 allows [3,2], [2,4], and [1,4].\nConstraints \u0026 guarantees\n- 1 \u003c= days \u003c= weights.length \u003c= 5 * 10^4\n- 1 \u003c= weights[i] \u003c= 500\nJavaScript starter\nfunction shipWithinDays(weights, days) {\n// TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/) | [Example](./LC-1101-capacity-to-ship-packages-within-d-days/index.mdx) |
| [LC 1146 — Snapshot Array](https://leetcode.com/problems/snapshot-array/) | Medium | [LeetCode](https://leetcode.com/problems/snapshot-array/) | — |
| <PracticeProblem id={1283} title={"Find the Smallest Divisor Given a Threshold"} text={"Problem statement \u0026 expected result\nChoose a positive integer divisor d. Divide every input value by d, rounding each quotient upward, and sum the\nrounded results. Return the smallest d whose total is at most threshold. A feasible divisor is guaranteed.\nEXAMPLE 1\nInput: nums = [1,2,5,9], threshold = 6\nOutput: 5\nExplanation: Divisor 5 produces rounded values [1,1,1,2], totaling 5; divisor 4 totals 7.\nEXAMPLE 2\nInput: nums = [44,22,33,11,1], threshold = 5\nOutput: 44\nExplanation: Five positive values must each round to 1, requiring divisor at least 44.\nConstraints \u0026 guarantees\n- 1 \u003c= nums.length \u003c= 5 * 10^4\n- 1 \u003c= nums[i] \u003c= 10^6\n- nums.length \u003c= threshold \u003c= 10^6\nJavaScript starter\nfunction smallestDivisor(nums, threshold) {\n// TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/) | [Example](./LC-1283-find-the-smallest-divisor-given-a-threshold/index.mdx) |
| <PracticeProblem id={1482} title={"Minimum Number of Days to Make m Bouquets"} text={"Problem statement \u0026 expected result\nFlower i becomes available on bloomDay[i]. Form m bouquets, each using k consecutive available flowers. A\nflower can belong to only one bouquet. Return the earliest possible day, or -1 when the garden cannot supply\nenough flowers.\nEXAMPLE 1\nInput: bloomDay = [1,10,3,10,2], m = 3, k = 1\nOutput: 3\nExplanation: By day 3, three flowers have bloomed and each forms its own bouquet.\nEXAMPLE 2\nInput: bloomDay = [1,10,3,10,2], m = 3, k = 2\nOutput: -1\nExplanation: Three two-flower bouquets require six flowers, but only five exist.\nConstraints \u0026 guarantees\n- bloomDay.length == n\n- 1 \u003c= n \u003c= 10^5\n- 1 \u003c= bloomDay[i] \u003c= 10^9\n- 1 \u003c= m \u003c= 10^6\n- 1 \u003c= k \u003c= n\nJavaScript starter\nfunction minDays(bloomDay, m, k) {\n// TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/) | — |
| [LC 1552 — Magnetic Force Between Two Balls](https://leetcode.com/problems/magnetic-force-between-two-balls/) | Medium | [LeetCode](https://leetcode.com/problems/magnetic-force-between-two-balls/) | — |
| [LC 1901 — Find a Peak Element II](https://leetcode.com/problems/find-a-peak-element-ii/) | Medium | [LeetCode](https://leetcode.com/problems/find-a-peak-element-ii/) | — |
| <PracticeProblem id={4} title={"Median of Two Sorted Arrays"} text={"Problem statement\nnums1 and nums2 are sorted integer arrays, and at least one contains an element. Return the\nmedian of their combined values: the middle value for an odd total length, or the mean of the two\nmiddle values for an even total. Required running time is O(log(m + n)); fully merging the arrays is\ntoo slow.\nInput \u0026 expected result\nTreat all values from both inputs as one multiset in sorted order, keeping duplicates. Either\nindividual array may be empty. The median may be fractional; return a number rather than\nrounding or choosing one of the middle entries.\nEXAMPLE 1\nInput: nums1 = [1,5], nums2 = [2,3,8]\nOutput: 3\nExplanation: The conceptual combined order is 1,2,3,5,8. Its single middle value is 3.\nEXAMPLE 2\nInput: nums1 = [], nums2 = [2,7]\nOutput: 4.5\nExplanation: The total length is even, so the median is the average of 2 and 7.\nConstraints \u0026 guarantees\n• m = nums1.length\n• n = nums2.length\n• m and n: 0 through 1000\n• combined length: 1 through 2000\n• Array values: -10^6 through 10^6. Both arrays are nondecreasing\nJavaScript starter\nfunction findMedianSortedArrays(nums1, nums2) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/median-of-two-sorted-arrays/) | — |
| <PracticeProblem id={774} title={"Minimize Max Distance to Gas Station"} text={"Problem statement \u0026 expected result\nAdd k stations between the existing sorted positions. New stations may have real-valued coordinates. Minimize\nthe largest distance between neighboring stations and return that distance. Absolute error up to 10^-6 is\naccepted.\nEXAMPLE 1\nInput: stations = [1,2,3,4,5,6,7,8,9,10], k = 9\nOutput: 0.50000\nExplanation: One new station in every unit gap reduces each gap to 0.5.\nEXAMPLE 2\nInput: stations = [23,24,36,39,46,56,57,65,84,98], k = 1\nOutput: 14.00000\nExplanation: Splitting the largest gap leaves a maximum gap of 14.\nConstraints \u0026 guarantees\nReference snapshot limits; current Premium bounds unverified.\n- 10 \u003c= stations.length \u003c= 2000\n- 0 \u003c= stations[i] \u003c= 10^8\n- stations is sorted in a strictly increasing order.\n- 1 \u003c= k \u003c= 10^6\nJavaScript starter\nfunction minmaxGasDist(stations, k) {\n// TODO: write your solution.\n}"} /> | Hard · Premium | [LeetCode](https://leetcode.com/problems/minimize-max-distance-to-gas-station/) | — |
| G14 — Find lower and upper insertion boundaries for a target. | Exercise | Binary search. Related only: [LC 35](https://leetcode.com/problems/search-insert-position/) - Search Insert Position. Insertion position only; does not return both lower and upper boundaries. Related only: [LC 34](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) - Find First and Last Position of Element in Sorted Array. First and last matching positions, rather than insertion boundaries. | — |
| G15 — Find the kth smallest entry across two sorted arrays. | Exercise | Binary search | — |
| G16 — Calculate a square root to specified precision. | Exercise | Binary search. Related only: [LC 69](https://leetcode.com/problems/sqrtx/) - Sqrt(x). Returns the integer floor of the square root; no arbitrary-precision fractional result. | — |
| G17 — Calculate an nth root to specified precision. | Exercise | Binary search | — |
| [LC 374 — Guess Number Higher or Lower](https://leetcode.com/problems/guess-number-higher-or-lower/) | Easy | [LeetCode](https://leetcode.com/problems/guess-number-higher-or-lower/) |  |
| [LC 441 — Arranging Coins](https://leetcode.com/problems/arranging-coins/) | Easy | [LeetCode](https://leetcode.com/problems/arranging-coins/) |  |
| [LC 744 — Find Smallest Letter Greater Than Target](https://leetcode.com/problems/find-smallest-letter-greater-than-target/) | Easy | [LeetCode](https://leetcode.com/problems/find-smallest-letter-greater-than-target/) |  |
| [LC 852 — Peak Index in a Mountain Array](https://leetcode.com/problems/peak-index-in-a-mountain-array/) | Easy | [LeetCode](https://leetcode.com/problems/peak-index-in-a-mountain-array/) |  |
| [LC 1351 — Count Negative Numbers in a Sorted Matrix](https://leetcode.com/problems/count-negative-numbers-in-a-sorted-matrix/) | Easy | [LeetCode](https://leetcode.com/problems/count-negative-numbers-in-a-sorted-matrix/) |  |
| [CC — Binary Search Basic (BINSRCH)](https://www.codechef.com/problems/BINSRCH) | Easy | — |  |
| [CC — Find Element (FINDELEM)](https://www.codechef.com/problems/FINDELEM) | Easy | — |  |
| [LC 81 — Search in Rotated Sorted Array II](https://leetcode.com/problems/search-in-rotated-sorted-array-ii/) | Medium | [LeetCode](https://leetcode.com/problems/search-in-rotated-sorted-array-ii/) |  |
| [LC 154 — Find Minimum in Rotated Sorted Array II](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/) | Medium | [LeetCode](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/) |  |
| [LC 240 — Search a 2D Matrix II](https://leetcode.com/problems/search-a-2d-matrix-ii/) | Medium | [LeetCode](https://leetcode.com/problems/search-a-2d-matrix-ii/) |  |
| [LC 275 — H-Index II](https://leetcode.com/problems/h-index-ii/) | Medium | [LeetCode](https://leetcode.com/problems/h-index-ii/) |  |
| [LC 540 — Single Element in a Sorted Array](https://leetcode.com/problems/single-element-in-a-sorted-array/) | Medium | [LeetCode](https://leetcode.com/problems/single-element-in-a-sorted-array/) |  |
| [LC 702 — Search in a Sorted Array of Unknown Size](https://leetcode.com/problems/search-in-a-sorted-array-of-unknown-size/) | Medium | [LeetCode](https://leetcode.com/problems/search-in-a-sorted-array-of-unknown-size/) |  |
| [CC — Binary Search on Answer (BINSANS)](https://www.codechef.com/problems/BINSANS) | Medium | — |  |
| [CC — Rotated Array Search (ROTARR)](https://www.codechef.com/problems/ROTARR) | Medium | — |  |
| [LC 302 — Smallest Rectangle Enclosing Black Pixels](https://leetcode.com/problems/smallest-rectangle-enclosing-black-pixels/) | Hard | [LeetCode](https://leetcode.com/problems/smallest-rectangle-enclosing-black-pixels/) |  |
| [LC 719 — Find K-th Smallest Pair Distance](https://leetcode.com/problems/find-k-th-smallest-pair-distance/) | Hard | [LeetCode](https://leetcode.com/problems/find-k-th-smallest-pair-distance/) |  |
| [LC 786 — K-th Smallest Prime Fraction](https://leetcode.com/problems/k-th-smallest-prime-fraction/) | Hard | [LeetCode](https://leetcode.com/problems/k-th-smallest-prime-fraction/) |  |
| [LC 1095 — Find in Mountain Array](https://leetcode.com/problems/find-in-mountain-array/) | Hard | [LeetCode](https://leetcode.com/problems/find-in-mountain-array/) |  |
| [LC 1231 — Divide Chocolate](https://leetcode.com/problems/divide-chocolate/) | Hard | [LeetCode](https://leetcode.com/problems/divide-chocolate/) |  |
| [CC — Binary Search in Rotated Array (BINROT)](https://www.codechef.com/problems/BINROT) | Hard | — |  |
| [CC — Advanced Binary Search (ADVBINS)](https://www.codechef.com/problems/ADVBINS) | Hard | — |  |

{/* END GENERATED PRACTICE PROBLEMS */}

## 🔗 Related Topics

- **[Dynamic Programming](../dp/README.md)** — Binary search can optimize DP solutions
- **[Divide and Conquer](../recursion/README.md)** — Binary search is a classic D&C algorithm

---

## 🎯 Quick Interview Prep Checklist

- [ ] Master the standard binary search template
- [ ] Understand first/last occurrence patterns
- [ ] Practice binary search on answer problems
- [ ] Know how to handle rotated sorted arrays
- [ ] Comfortable with 2D matrix search
- [ ] Understand when binary search applies
- [ ] Practice peak finding algorithms
- [ ] Know common pitfalls and edge cases

[← Back to Home](../index.md) · © sparshjaswal

**Next:** [recursion](../recursion/README.md).
