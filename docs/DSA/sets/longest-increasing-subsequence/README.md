---
id: dsa-sets-longest-increasing-subsequence-readme
title: "Longest Increasing Subsequence"
slug: /DSA/sets/longest-increasing-subsequence/README
sidebar_label: "Longest Increasing Subsequence"
---

# Longest Increasing Subsequence

**Read first:** [Dynamic Programming](../../dp/README.md).

**Practice focus:** Trace the ending-at-position DP first; then distinguish a tails array from the actual subsequence.

Find the longest strictly increasing sequence that keeps the input order. You may skip values. In `[3, 1, 2, 4]`, one answer is `[1, 2, 4]`, of length 3. Equal values do not extend a strictly increasing sequence.

## Start with dynamic programming

Let `dp[i]` be the longest increasing subsequence ending at index `i`. Start each entry at 1. For each earlier `j` with `values[j] < values[i]`, consider `dp[j] + 1`. The maximum entry is the answer; an empty array has answer 0.

## Example

| Index | Value | `dp[i]` | Explanation |
| --- | --- | --- | --- |
| 0 | 3 | 1 | Start with 3. |
| 1 | 1 | 1 | 1 cannot follow 3. |
| 2 | 2 | 2 | Append 2 to `[1]`. |
| 3 | 4 | 3 | Append 4 to `[1, 2]`. |

```js runnable
function lisLength(values) {
  const dp = Array(values.length).fill(1);
  let best = 0;
  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < i; j++) {
      if (values[j] < values[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
    best = Math.max(best, dp[i]);
  }
  return best;
}
console.log(lisLength([3, 1, 2, 4]));
console.log(lisLength([2, 2, 2]));
console.log(lisLength([]));
```

```text output
3
1
0
```

## Complexity

The simple table uses O(n²) time and O(n) space. To recover the actual subsequence, store the predecessor that produced each best entry and follow those indices backward.

For O(n log n) time, keep `tails[k]`, the smallest possible final value for an increasing subsequence of length `k + 1`. Binary-search for the first tail greater than or equal to the new value and replace it, or append if none exists. A smaller tail leaves more room for future values. The `tails` array gives the length; its values do not necessarily form a valid subsequence of the original input. Reconstruction still needs predecessor information.

## Check your understanding

Trace an increasing array, a decreasing array, repeated values, and negative values. Explain why sorting the input first changes the problem: it loses the original order.

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Longest_increasing_subsequence)
- [Dynamic Programming Approach on YouTube](https://www.youtube.com/watch?v=CE2b_-XfVDk&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

**Next:** [Binary Search](../../binary-search/README.md).
