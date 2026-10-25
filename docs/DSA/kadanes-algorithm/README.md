---
id: dsa-kadanes-algorithm-readme
title: "📈 Kadane's Algorithm"
slug: /DSA/kadanes-algorithm/README
sidebar_label: "Kadane's Algorithm"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Kadane's Algorithm

Find the largest sum from one or more neighboring array values, with no gaps. This group is called a **nonempty contiguous subarray**. This is a small [dynamic-programming](../dp/README.md) recurrence, not a threshold-based sliding window. Input must be nonempty; values may be negative and sums must fit safely in a JavaScript Number.

<AlgorithmWalkthrough name="kadane" />

## Learning steps

Imagine daily gains and losses. Find one uninterrupted period with the largest total; skipping an inconvenient day would answer a different question.

1. Keep the best nonempty sum ending at the current position.
2. Choose between extending yesterday’s range and starting today.
3. Check all-negative input before studying the circular variant.

## State and recurrence

At each index, either extend the best subarray ending at the previous index or begin a new subarray here.

- `ending` is the best nonempty sum ending exactly at the current position.
- `best` is the best nonempty sum anywhere in the processed prefix.
- Transition: `ending = Math.max(value, ending + value)`, then update `best`.

Initialize both from the first element. Initializing the answer to zero would allow an empty subarray and give the wrong result on all-negative input.

## Linear and circular variants

A circular answer either lies in the ordinary array or wraps around its ends. A wrapping answer is the total sum minus a minimum-sum middle subarray. When all values are negative, excluding that minimum could remove the entire array; return the largest element instead.

```js runnable
function maxSubarraySum(values) {
  if (!values.length) throw new RangeError('A nonempty array is required');
  let ending = values[0];
  let best = values[0];
  for (let i = 1; i < values.length; i++) {
    ending = Math.max(values[i], ending + values[i]);
    best = Math.max(best, ending);
  }
  return best;
}

function maxCircular(values) {
  if (!values.length) throw new RangeError('A nonempty array is required');
  let total = values[0];
  let maxEnding = values[0];
  let minEnding = values[0];
  let bestMax = values[0];
  let bestMin = values[0];
  for (let i = 1; i < values.length; i++) {
    const value = values[i];
    maxEnding = Math.max(value, maxEnding + value);
    minEnding = Math.min(value, minEnding + value);
    bestMax = Math.max(bestMax, maxEnding);
    bestMin = Math.min(bestMin, minEnding);
    total += value;
  }
  return bestMax < 0 ? bestMax : Math.max(bestMax, total - bestMin);
}

console.log(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
console.log(maxSubarraySum([-8, -3, -6]));
console.log(maxCircular([5, -3, 5]));
console.log(maxCircular([-3, -2, -5]));
console.log(maxCircular([0]));
```

```text output
6
-3
10
-2
0
```

## Trace: restart or extend?

| Value in [-2, 1, -3, 4, -1, 2, 1] | Best ending here | Best so far |
| --- | --- | --- |
| -2 | -2 | -2 |
| 1 | 1 | 1 |
| -3 | -2 | 1 |
| 4 | 4 | 4 |
| -1 | 3 | 4 |
| 2 | 5 | 5 |
| 1 | 6 | 6 |

Both implementations take O(n) time and O(1) extra space and leave the input unchanged. Returning the subarray itself also requires tracking its start and end indices.

## Distinguish related tasks

| Task | Approach |
| --- | --- |
| Best sum with any nonempty length | Kadane |
| Best sum of exactly k elements | [Fixed sliding window](../sliding-window/README.md) |
| Count subarrays with an exact sum | [Prefix sum + frequency map](../prefix-sum/README.md) |
| Maximum product subarray | Track both maximum and minimum products; multiplication by a negative value swaps their roles. |

See the [pattern selection guide](../patterns.md) for the assumptions separating these problems.


## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| <PracticeProblem id={53} title={"Maximum Subarray"} text={"Problem statement\nReturn the largest sum obtainable from a nonempty contiguous segment of nums. The segment\nmay contain one element or the entire array. Negative values are permitted, and when all values\nare negative the answer is the largest single value, not 0.\nInput \u0026 expected result\nContiguous means taking every array position between a chosen start and end. At least one\nposition must be selected. Return only the maximum sum; the task does not require the segment's\nindices or a copy of its elements.\nEXAMPLE 1\nInput: nums = [-3,4,-1,2,-5]\nOutput: 5, for segment [4,-1,2]\nExplanation: The consecutive segment 4,-1,2 sums to 5, which is greater than any other\nnonempty segment's sum.\nEXAMPLE 2\nInput: nums = [-7,-2,-5]\nOutput: -2\nExplanation: The best valid choice is the single element -2; an empty segment with sum 0 is not\nallowed.\nConstraints \u0026 guarantees\n• nums.length: 1 through 10^5 (inclusive)\n• nums[i]: -10^4 through 10^4 (inclusive)\nJavaScript starter\nfunction maxSubArray(nums) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/maximum-subarray/) | [Example](./LC-53-maximum-subarray/index.mdx) |
| <PracticeProblem id={152} title={"Maximum Product Subarray"} text={"Problem statement\nReturn the largest product of a nonempty contiguous segment of nums. Values may be negative or\nzero, so multiplying another number can change the sign or reset the product. A one-element\nsegment is allowed. The required answer fits a signed 32-bit integer.\nInput \u0026 expected result\nEvery selected position between the endpoints belongs to the segment. The empty product is not a\ncandidate. A zero may itself be the best one-element segment, and two negative factors can make\na larger positive product.\nEXAMPLE 1\nInput: nums = [-2,3,-4]\nOutput: 24\nExplanation: Multiplying all three consecutive values gives (-2) * 3 * (-4) = 24, larger than any\nshorter segment's product.\nEXAMPLE 2\nInput: nums = [-2,0,-1]\nOutput: 0\nExplanation: The two negatives cannot be combined without including the zero, so the best\nproduct is zero.\nConstraints \u0026 guarantees\n• nums.length: 1 through 2 * 10^4 (inclusive)\n• nums[i]: -10 through 10 (inclusive)\n• Every contiguous subarray product fits a signed 32-bit integer\nJavaScript starter\nfunction maxProduct(nums) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/maximum-product-subarray/) | — |
| <PracticeProblem id={918} title={"Maximum Sum Circular Subarray"} text={"Problem statement\nnums is circular: the element after the last is the first. Return the maximum sum of a nonempty\ncontiguous segment on this circle. The segment may wrap around the end, but it may include each\narray position at most once. Negative values are allowed.\nInput \u0026 expected result\nChoose one starting position and move forward for between one and nums.length positions.\nWrapping is optional. A selected segment cannot circle repeatedly or count an element twice, and\nchoosing no elements is not permitted.\nEXAMPLE 1\nInput: nums = [4,-6,5]\nOutput: 9, for the wrapped segment [5,4]\nExplanation: Wrapping from the last element 5 to the first element 4 gives sum 9 while\nexcluding the negative middle value.\nEXAMPLE 2\nInput: nums = [-4,-1,-6]\nOutput: -1\nExplanation: Every longer segment adds negative values, so the single element -1 is optimal.\nConstraints \u0026 guarantees\n• n == nums.length\n• n: 1 through 3 * 10^4 (inclusive)\n• nums[i]: -3 * 10^4 through 3 * 10^4 (inclusive)\nJavaScript starter\nfunction maxSubarraySumCircular(nums) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/maximum-sum-circular-subarray/) | — |
| [LC 1749 — Maximum Absolute Sum of Any Subarray](https://leetcode.com/problems/maximum-absolute-sum-of-any-subarray/) | Medium | [LeetCode](https://leetcode.com/problems/maximum-absolute-sum-of-any-subarray/) |  |
| [CC — Maximum Subarray Sum (KCON)](https://www.codechef.com/problems/KCON) | Medium | — |  |
| [LC 1567 — Maximum Length of Subarray With Positive Product](https://leetcode.com/problems/maximum-length-of-subarray-with-positive-product/) | Medium | [LeetCode](https://leetcode.com/problems/maximum-length-of-subarray-with-positive-product/) |  |
| [LC 1856 — Maximum Subarray Min-Product](https://leetcode.com/problems/maximum-subarray-min-product/) | Medium | [LeetCode](https://leetcode.com/problems/maximum-subarray-min-product/) |  |
| [LC 1186 — Maximum Subarray Sum with One Deletion](https://leetcode.com/problems/maximum-subarray-sum-with-one-deletion/) | Medium | [LeetCode](https://leetcode.com/problems/maximum-subarray-sum-with-one-deletion/) |  |
| [LC 697 — Degree of an Array](https://leetcode.com/problems/degree-of-an-array/) | Easy | [LeetCode](https://leetcode.com/problems/degree-of-an-array/) |  |
| [LC 978 — Longest Turbulent Subarray](https://leetcode.com/problems/longest-turbulent-subarray/) | Medium | [LeetCode](https://leetcode.com/problems/longest-turbulent-subarray/) |  |
| [LC 1191 — K-Concatenation Maximum Sum](https://leetcode.com/problems/k-concatenation-maximum-sum/) | Medium | [LeetCode](https://leetcode.com/problems/k-concatenation-maximum-sum/) |  |
| [LC 1395 — Count Number of Teams](https://leetcode.com/problems/count-number-of-teams/) | Medium | [LeetCode](https://leetcode.com/problems/count-number-of-teams/) |  |
| [LC 1524 — Number of Sub-arrays With Odd Sum](https://leetcode.com/problems/number-of-sub-arrays-with-odd-sum/) | Medium | [LeetCode](https://leetcode.com/problems/number-of-sub-arrays-with-odd-sum/) |  |
| [LC 1546 — Maximum Number of Non-Overlapping Subarrays](https://leetcode.com/problems/maximum-number-of-non-overlapping-subarrays-with-sum-equals-target/) | Medium | [LeetCode](https://leetcode.com/problems/maximum-number-of-non-overlapping-subarrays-with-sum-equals-target/) |  |
| [CC — Chef and Subarrays (CHEFSUM)](https://www.codechef.com/problems/CHEFSUM) | Medium | — |  |
| [CC — Maximum Subarray (MAXSUM)](https://www.codechef.com/problems/MAXSUM) | Easy | — |  |
| [CC — Subarray with Given Sum (SUBSUM)](https://www.codechef.com/problems/SUBSUM) | Medium | — |  |

{/* END GENERATED PRACTICE PROBLEMS */}

## Related Topics

- [Prefix Sum](../prefix-sum/README.md) — complementary single-pass technique
- [Dynamic Programming](../dp/README.md) — Kadane is a 1D DP solved greedily
- [Sliding Window](../sliding-window/README.md) — for bounded subarray variants

[← Back to Home](../index.md) · © sparshjaswal

**Next:** [monotonic stacks](../monotonic-stack/README.md).
