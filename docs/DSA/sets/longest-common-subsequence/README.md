---
id: dsa-sets-longest-common-subsequence-readme
title: "Longest common subsequence problem"
slug: /DSA/sets/longest-common-subsequence/README
sidebar_label: "Longest common subsequence ..."
---

# Longest common subsequence problem

**Read first:** [Dynamic Programming](../../dp/README.md).

**Practice focus:** Compare two prefixes and decide whether their last characters can contribute one shared match.

A longest common subsequence (LCS) keeps order in both inputs but may skip items. For `abc` and `ac`, the answer is `ac`, of length 2. Unlike a substring, its characters do not need to be adjacent.

## Application

LCS models ordered agreement between sequences and helps explain text comparison. Real diff tools may use other algorithms and heuristics; this lesson teaches the underlying dynamic-programming problem.

## Define a smaller problem

`dp[i][j]` is the LCS length of the first `i` characters of one string and first `j` of the other. An empty prefix has answer 0.

- If the last characters match, use `1 + dp[i - 1][j - 1]`.
- Otherwise one of those last characters must be skipped: take the larger of `dp[i - 1][j]` and `dp[i][j - 1]`.

## Example

| Prefix / prefix | Empty | `a` | `ac` |
| --- | --- | --- | --- |
| Empty | 0 | 0 | 0 |
| `a` | 0 | 1 | 1 |
| `ab` | 0 | 1 | 1 |
| `abc` | 0 | 1 | 2 |

For `ABCDGH` and `AEDFHR`, one answer is `ADH`. For `AGGTAB` and `GXTXAYB`, it is `GTAB`.

## Implementation

```js runnable
function lcsLength(first, second) {
  const dp = Array.from({ length: first.length + 1 },
    () => Array(second.length + 1).fill(0));
  for (let i = 1; i <= first.length; i++) {
    for (let j = 1; j <= second.length; j++) {
      dp[i][j] = first[i - 1] === second[j - 1]
        ? 1 + dp[i - 1][j - 1]
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[first.length][second.length];
}
console.log(lcsLength('abc', 'ac'));
console.log(lcsLength('AGGTAB', 'GXTXAYB'));
console.log(lcsLength('', 'abc'));
```

```text output
2
4
0
```

## Recover a sequence and check the cost

To recover a sequence, walk backward from the final cell. On a matching character, keep it and move diagonally. Otherwise move to a neighboring cell with the same optimal value. Reverse the collected characters at the end. Ties may give several valid answers.

The table needs O(mn) time and space. If only the length is needed, keep two rows for O(n) space. This implementation compares UTF-16 code units. Test empty strings, identical strings, no shared characters, and multiple possible LCS answers.

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Longest_common_subsequence_problem)
- [YouTube](https://www.youtube.com/watch?v=NnD96abizww&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

**Next:** [Shortest Common Supersequence](../shortest-common-supersequence/README.md).
