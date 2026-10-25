---
id: dsa-strings-regular-expression-matching-readme
title: "Regular Expression Matching"
slug: /DSA/strings/regular-expression-matching/README
sidebar_label: "Regular Expression Matching"
---

# Regular Expression Matching

**Read first:** [Dynamic Programming](../../dp/README.md).

**Practice focus:** Trace the zero-occurrence and repeated-occurrence choices for the preceding token of a star.

Given an input string `s` and a pattern `p`, implement regular
expression matching with support for `.` and `*`.

- `.` Matches any single character.
- `*` Matches zero or more of the preceding element.

The matching should cover the **entire** input string (not partial).

**Note**

- `s` could be empty and contains only lowercase letters `a-z`.
- `p` could be empty and contains only lowercase letters `a-z`, and characters like `.` or `*`.

## Examples

**Example #1**

Input:

```
s = 'aa'
p = 'a'
```

Output: `false`

Explanation: `a` does not match the entire string `aa`.

**Example #2**

Input:

```
s = 'aa'
p = 'a*'
```

Output: `true`

Explanation: `*` means zero or more of the preceding element, `a`.
Here `a*` consumes two occurrences of `a`.

**Example #3**

Input:

```
s = 'ab'
p = '.*'
```

Output: `true`

Explanation: `.*` means "zero or more (`*`) of any character (`.`)".

**Example #4**

Input:

```
s = 'aab'
p = 'c*a*b'
```

Output: `true`

Explanation: `c` can be repeated 0 times, `a*` consumes two occurrences of `a`, then `b` matches the final character.

## Solve prefixes with dynamic programming

This is a deliberately small pattern language, not a full JavaScript regular-expression engine. Assume every `*` has a valid preceding letter or dot and there are no consecutive stars.

Let `dp[i][j]` mean that the first `i` input characters match the first `j` pattern characters. For an ordinary matching character or dot, use the previous diagonal. For `x*`, either skip the pair for zero occurrences, or consume one matching input character while keeping the same pattern prefix.

```js runnable
function matches(text, pattern) {
  const dp = Array.from({ length: text.length + 1 },
    () => Array(pattern.length + 1).fill(false));
  dp[0][0] = true;
  for (let j = 2; j <= pattern.length; j++) {
    if (pattern[j - 1] === '*') dp[0][j] = dp[0][j - 2];
  }
  for (let i = 1; i <= text.length; i++) {
    for (let j = 1; j <= pattern.length; j++) {
      if (pattern[j - 1] === '*') {
        const same = pattern[j - 2] === '.' || pattern[j - 2] === text[i - 1];
        dp[i][j] = dp[i][j - 2] || (same && dp[i - 1][j]);
      } else if (pattern[j - 1] === '.' || pattern[j - 1] === text[i - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      }
    }
  }
  return dp[text.length][pattern.length];
}
console.log(matches('aab', 'c*a*b'));
console.log(matches('aa', 'a'));
console.log(matches('', 'a*'));
```

```text output
true
false
true
```

## Complexity and checks

Time and space are O(mn) for input and pattern lengths m and n. The empty-input row matters: `a*` can match zero characters, but `a` cannot. Whole-string matching means a successful prefix alone is insufficient. Test `.*`, an empty pattern, zero repetitions, and a final unmatched character.

## References

- [YouTube](https://www.youtube.com/watch?v=l3hda49XcDE&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=71&t=0s)
- [LeetCode](https://leetcode.com/problems/regular-expression-matching/description/)

**Next:** [Strings](../README.md).
