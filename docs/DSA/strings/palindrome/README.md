---
id: dsa-strings-palindrome-readme
title: "Palindrome Check"
slug: /DSA/strings/palindrome/README
sidebar_label: "Palindrome Check"
---

# Palindrome Check

**Read first:** [Two Pointers](../../two-pointers/README.md).

**Practice focus:** Compare opposite ends under a stated case and character policy.

A palindrome reads the same forward and backward. Decide first whether spaces, punctuation, case, or Unicode normalization should matter. This lesson compares code points exactly, so `Aa` is not a palindrome.

## Examples

| Input | Result | Reason |
| --- | --- | --- |
| `racecar` | `true` | The outer pairs and the middle match. |
| `deed` | `true` | Both pairs match. |
| `rad` | `false` | `r` differs from `d`. |
| Empty string | `true` | There is no mismatching pair. |

## Move two pointers inward

For `racecar`, compare `r/r`, then `a/a`, then `c/c`. Stop when the pointers meet. Previously checked outer pairs never need to be checked again.

```js runnable
function isPalindrome(text) {
  const characters = Array.from(text);
  let left = 0;
  let right = characters.length - 1;
  while (left < right) {
    if (characters[left] !== characters[right]) return false;
    left++;
    right--;
  }
  return true;
}
console.log(isPalindrome('racecar'));
console.log(isPalindrome('rad'));
console.log(isPalindrome(''));
```

```text output
true
false
true
```

## Cost and boundaries

Time is O(n). The code-point array takes O(n) space; direct indexing uses O(1) extra space for an ASCII-only contract. One mismatch is enough to return `false`. Strings with one symbol need no comparison.

If a problem ignores punctuation and case, normalize according to that exact rule before comparing. Do not silently apply an English-letter-only filter to a task that accepts other languages. Code points also differ from grapheme clusters such as a letter plus a combining mark.

## Check your understanding

Trace an even-length palindrome and a mismatch at the center. Then compare exact matching with the contract in the [two-pointer practice guide](../../two-pointers/README.md#practice-problems).

## References

- [GeeksForGeeks - Check if a number is Palindrome](https://www.geeksforgeeks.org/check-if-a-number-is-palindrome/)

**Next:** [Longest Common Substring Problem](../longest-common-substring/README.md).
