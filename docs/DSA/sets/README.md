---
id: dsa-sets-readme
title: "Sets and membership"
slug: /DSA/sets/README
sidebar_label: "Sets and membership"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

# Sets and membership

A **set** remembers which distinct values are present. Imagine a guest list: a person is either on it or not. Listing the same person twice does not add another distinct guest. An array keeps positions and repeated occurrences; a set keeps membership.

**Prerequisites:** arrays, loops, booleans, and [Set operations](../javascript-for-dsa.md#4-choose-an-object-map-or-set). You do not need recursion, combinations, or dynamic programming to begin. Those later topics have prerequisites listed separately below.

## Learning steps

A club attendance list asks who came, while a vote count asks how many times each choice appeared. A Set answers the first question.

1. Add the same value twice and observe membership.
2. Find a repeated value while scanning an array.
3. Combine two sets, then explain why permutations belong to a later topic.

## See what information a set keeps

```text
input positions:    0     1     2     3
input array:      [ 5,   -1,    3,    5 ]
                   |     |     |     |
                   +-----|-----|-----+  equal values become one member
                         |     |
set members:       { 5,  -1,    3 }
```

The set has three members even though the array has four entries. In mathematical notation, braces describe membership; order is not part of that meaning. JavaScript Set iteration follows insertion order, but it does not provide array-style indexed access such as `set[0]`.

```js runnable
const guests = new Set([5, -1, 3, 5]);
console.log(guests.size, guests.has(5));
guests.add(3);
console.log(guests.size);
console.log(guests.delete(-1), guests.has(-1));
console.log([...guests].join(","));
```

```text output
3 true
3
true false
5,3
```

`add` does not increase size when an equal member exists. `has` answers membership; `delete` reports whether a member was removed. Spread, `[...guests]`, makes an array for display. The Number 5 and string `"5"` are different members. Separate objects are also different even when their fields match. Set uses SameValueZero equality: `NaN` matches itself, and +0 and -0 are equal. See the [language Set specification](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set-objects).

## Detect a duplicate as soon as it appears

A brute-force method compares every pair of positions: O(n²) time, O(1) extra space. Sorting then checking adjacent values uses O(n log n) comparison-sort time and may change input order. A Set can trade O(n) extra space for expected O(n) time using the usual hash-table model.

```js runnable
function containsDuplicate(values) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) return true;
    seen.add(value);
  }
  return false;
}
console.log(containsDuplicate([5, -1, 3, 5]));
console.log(containsDuplicate([5, -1, 3]));
console.log(containsDuplicate([]));
```

```text output
true
false
false
```

The contract accepts an array and tests duplicates using JavaScript Set equality; it does not mutate the array. Before each visit, `seen` contains exactly the values at earlier positions. Therefore membership means an earlier equal value exists. If no membership check succeeds, every value was new, so returning false is correct. For the diagram, the first three visits add 5, -1, and 3; the final 5 matches immediately.

Scanning n inputs takes expected O(n) time under the usual constant-average-time Set model and stores at most O(n) values; an early duplicate can stop sooner. This is conventional hash-table analysis, not a specification guarantee of worst-case constant-time lookup. See [hashing costs](../hashing/README.md).

## Union, intersection, and difference

Let A be `{2, 4}` and B be `{4, 7}`. Their **union** contains anything in either set: `{2, 4, 7}`. Their **intersection** contains only shared values: `{4}`. Their **difference**, A minus B, contains members of A absent from B: `{2}`. Direction matters: B minus A is `{7}`.

Here is a portable intersection implementation using the established Set methods, without assuming a judge supports newer collection APIs:

```js runnable
function uniqueIntersection(first, second) {
  const available = new Set(first);
  const common = new Set();
  for (const value of second) {
    if (available.has(value)) common.add(value);
  }
  return [...common];
}
console.log(JSON.stringify(uniqueIntersection([2, 4, 4], [4, 4, 7])));
console.log(JSON.stringify(uniqueIntersection([], [4])));
```

```text output
[4]
[]
```

Every returned value is in both inputs, and every shared value is added when encountered in the second input. The result Set removes repeated occurrences. With input lengths n and m, expected time is O(n + m), auxiliary storage O(n + m) as a simple upper bound, and the result follows first encounter order in `second`. If a problem requires repeated shared occurrences, use frequency counts instead of this unique-intersection contract.

## Understanding checks

1. **Trace:** How many members does `new Set([0, 0, -0])` contain?
2. **Choose:** Can a Set alone tell whether 4 occurs three times? What should replace it?
3. **Modify:** Return an array of distinct input values in first occurrence order.
4. **Apply:** Implement A minus B by checking membership. Explain why A minus B may differ from B minus A.
5. **Extend:** Solve Contains Duplicate, then Intersection of Two Arrays. Compare storage and multiplicity requirements before reusing the same function.

<details>
<summary>Hints</summary>

Zero and negative zero compare equal for Set membership. A set records presence, not count. New Set construction consumes its input in order. For difference, loop over distinct values of the left input and retain only values absent from the right.

</details>

<details>
<summary>Answers</summary>

There is one zero member. Use a Map from value to count when multiplicity matters. `[...new Set(values)]` returns distinct values in first occurrence order. For difference, build `excluded = new Set(second)` and return `[...new Set(first)].filter(value => !excluded.has(value))`; this returns unique values and runs in expected O(n + m) time with O(n + m) extra storage. Swapping inputs asks a different membership question: in `{2,4}` minus `{4,7}`, 2 qualifies, while in the reverse difference 7 qualifies.

</details>

## Return to these topics after their prerequisites

The historical folders below remain available, but their names do not make them beginner prerequisites for using a Set.

| Later topic | Learn first | Lessons |
| --- | --- | --- |
| Generate subsets and arrangements | [Recursion](../recursion/README.md), then [backtracking](../backtracking/README.md) | [Power set](./power-set/README.md), [permutations](./permutations/README.md), [combinations](./combinations/README.md), [combination sum](./combination-sum/README.md) |
| Count choices | [Combinatorics](../math/combinatorics/README.md) | [Cartesian product](./cartesian-product/README.md), combinations |
| Compare sequences or optimize selections | [Dynamic programming](../dp/README.md) | [LCS](./longest-common-subsequence/README.md), [LIS](./longest-increasing-subsequence/README.md), [SCS](./shortest-common-supersequence/README.md), [knapsack](./knapsack-problem/README.md), [maximum subarray](./maximum-subarray/README.md) |
| Randomize an ordering | Basic probability and array swaps | [Fisher–Yates shuffle](./fisher-yates/README.md), optional until needed |

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| <PracticeProblem id={217} title={"Contains Duplicate"} text={"Problem statement\nDetermine whether any value appears at least twice in nums. Return true on a repeated value and\nfalse when all values are distinct. Integers may be negative, and equal values count as duplicates\nregardless of their positions.\nInput \u0026 expected result\nThe task detects equal values anywhere in the array. Their distance and order do not matter, and\nthe result is a boolean rather than a duplicate count.\nEXAMPLE 1\nInput: nums = [5,-1,3,5]\nOutput: true\nExplanation: The value 5 appears at both the first and final positions.\nEXAMPLE 2\nInput: nums = [1,2,3]\nOutput: false\nExplanation: Each value occurs exactly once.\nConstraints \u0026 guarantees\n• nums.length: 1 through 10^5 (inclusive)\n• nums[i]: -10^9 through 10^9 (inclusive)\nJavaScript starter\nfunction containsDuplicate(nums) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/contains-duplicate/) | [Example](../hashing/LC-217-contains-duplicate/index.mdx) |
| [LC 705 — Design HashSet](https://leetcode.com/problems/design-hashset/) | Easy | [LeetCode](https://leetcode.com/problems/design-hashset/) | — |

{/* END GENERATED PRACTICE PROBLEMS */}

## Related Topics

- [Backtracking](../backtracking/README.md) — generating subsets/permutations
- [Dynamic Programming](../dp/README.md) — LCS, LIS, knapsack

[← Back to Home](../index.md) · © sparshjaswal

**Next:** [linked lists](../linked-list/README.md).
