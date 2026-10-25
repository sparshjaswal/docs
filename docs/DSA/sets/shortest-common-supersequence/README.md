---
id: dsa-sets-shortest-common-supersequence-readme
title: "Shortest Common Supersequence"
slug: /DSA/sets/shortest-common-supersequence/README
sidebar_label: "Shortest Common Supersequence"
---

# Shortest Common Supersequence

**Practice focus:** Reuse shared characters once and verify that both original inputs remain subsequences of the result.

A supersequence contains each input in order, with gaps allowed. The shortest common supersequence (SCS) of `ab` and `ac` may be `abc` or `acb`. We want the shortest length, not just any string containing both.

**Before you start:** read [longest common subsequence](../longest-common-subsequence/README.md). Shared characters can be used once rather than copied twice, so the optimal length is `m + n - LCS length`.

## Build the length table

`dp[i][j]` is the shortest length for prefixes of lengths `i` and `j`.

| Situation | Rule | Why |
| --- | --- | --- |
| First prefix is empty | `dp[0][j] = j` | Copy the second prefix. |
| Second prefix is empty | `dp[i][0] = i` | Copy the first prefix. |
| Last characters match | `1 + dp[i - 1][j - 1]` | One character serves both. |
| Last characters differ | `1 + min(dp[i - 1][j], dp[i][j - 1])` | Append one character, taking the shorter option. |

## Example

For `ab` and `ac`, the final characters differ. Taking `c` leaves `ab` and `a`; their common final `a` can be shared after accounting for `b`. Backtracking and reversing gives `abc`. For `geek` and `eke`, `geeke` is one answer.

## Implementation

```js runnable
function shortestCommonSupersequence(first, second) {
  const dp = Array.from({ length: first.length + 1 },
    () => Array(second.length + 1).fill(0));
  for (let i = 0; i <= first.length; i++) dp[i][0] = i;
  for (let j = 0; j <= second.length; j++) dp[0][j] = j;
  for (let i = 1; i <= first.length; i++) {
    for (let j = 1; j <= second.length; j++) {
      dp[i][j] = first[i - 1] === second[j - 1]
        ? 1 + dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const result = [];
  let i = first.length;
  let j = second.length;
  while (i > 0 || j > 0) {
    if (i === 0) result.push(second[--j]);
    else if (j === 0) result.push(first[--i]);
    else if (first[i - 1] === second[j - 1]) {
      result.push(first[--i]);
      j--;
    } else if (dp[i - 1][j] < dp[i][j - 1]) result.push(first[--i]);
    else result.push(second[--j]);
  }
  return result.reverse().join('');
}
console.log(shortestCommonSupersequence('ab', 'ac'));
console.log(shortestCommonSupersequence('', 'abc'));
```

```text output
abc
abc
```

## Complexity and checks

The table takes O(mn) time and space; backtracking takes O(m + n). This version compares UTF-16 code units. Check that both inputs are subsequences of the result and its length matches `m + n - LCS length`. Checking only containment would accept an unnecessarily long answer. If answers tie, this implementation chooses the second input's final character first while walking backward.

## References

- [GeeksForGeeks](https://www.geeksforgeeks.org/shortest-common-supersequence/)

**Next:** [Levenshtein Distance](../../strings/levenshtein-distance/README.md).
