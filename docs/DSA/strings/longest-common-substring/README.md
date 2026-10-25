---
id: dsa-strings-longest-common-substring-readme
title: "Longest Common Substring Problem"
slug: /DSA/strings/longest-common-substring/README
sidebar_label: "Longest Common Substring Pr..."
---

# Longest Common Substring Problem

**Read first:** [Dynamic Programming](../../dp/README.md).

**Practice focus:** Reset a suffix match after a mismatch and distinguish adjacent matches from skipped-character matches.

Find the longest contiguous piece shared by two strings. “Contiguous” means no skipped positions. For `ABABC` and `BABCA`, an answer is `BABC`. A [subsequence](../../sets/longest-common-subsequence/README.md) may skip positions and needs a different recurrence.

## Define the state

Let `dp[i][j]` be the length of the common suffix ending at `first[i - 1]` and `second[j - 1]`. If the characters match, extend the previous diagonal by one. Otherwise set the length to zero, because a substring cannot jump over a mismatch.

| First prefix / second prefix | Empty | `B` | `BA` | `BAB` |
| --- | --- | --- | --- | --- |
| Empty | 0 | 0 | 0 | 0 |
| `A` | 0 | 0 | 1 | 0 |
| `AB` | 0 | 1 | 0 | 2 |
| `ABA` | 0 | 0 | 2 | 0 |

The answer is the largest cell, not necessarily the bottom-right cell. Record its ending position to recover the substring.

## Implementation

Only the previous row is needed. Update from right to left so `row[j - 1]` still belongs to that previous row. Indices here are JavaScript UTF-16 code-unit indices.

```js runnable
function longestCommonSubstring(first, second) {
  const row = Array(second.length + 1).fill(0);
  let best = 0;
  let end = 0;
  for (let i = 1; i <= first.length; i++) {
    for (let j = second.length; j >= 1; j--) {
      row[j] = first[i - 1] === second[j - 1] ? row[j - 1] + 1 : 0;
      if (row[j] > best) {
        best = row[j];
        end = i;
      }
    }
  }
  return first.slice(end - best, end);
}
console.log(longestCommonSubstring('ABABC', 'BABCA'));
console.log(JSON.stringify(longestCommonSubstring('abc', 'xyz')));
```

```text output
BABC
""
```

## Complexity and checks

For lengths `m` and `n`, this takes O(mn) time and O(n) working space, plus the returned substring. An empty input or no shared character gives the empty string. Several answers can tie; this implementation keeps the first maximum it encounters.

The three-string example `ABABC`, `BABCA`, `ABCBA` has answer `ABC`. The two-string function does not solve that general case. Repeatedly taking a pairwise longest substring can discard a shorter candidate needed by a later string.

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Longest_common_substring_problem)
- [YouTube](https://www.youtube.com/watch?v=BysNXJHzCEs&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

**Next:** [Longest common subsequence problem](../../sets/longest-common-subsequence/README.md).
