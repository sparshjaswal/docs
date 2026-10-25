---
id: dsa-strings-hamming-distance-readme
title: "Hamming Distance"
slug: /DSA/strings/hamming-distance/README
sidebar_label: "Hamming Distance"
---

# Hamming Distance

**Read first:** [Strings](../README.md).

**Practice focus:** Compare corresponding positions only; do not shift or insert characters.

Hamming distance counts the positions with different symbols in two equal-length sequences. It does not insert, delete, or shift symbols. Use [edit distance](../levenshtein-distance/README.md) when those operations are allowed.

## Examples

| Position | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- |
| First string | c | o | d | e |
| Second string | c | a | k | e |
| Different? | No | Yes | Yes | No |

The result for `code` and `cake` is 2. For `1011101` and `1001001`, the result is also 2. Identical strings have distance 0.

## Implementation

This version works on JavaScript code points using `Array.from`. A visible symbol can contain several code points, so define a different segmentation rule if the task is about user-perceived characters.

```js runnable
function hammingDistance(first, second) {
  const left = Array.from(first);
  const right = Array.from(second);
  if (left.length !== right.length) throw new RangeError('Lengths must match');
  let distance = 0;
  for (let i = 0; i < left.length; i++) {
    if (left[i] !== right[i]) distance++;
  }
  return distance;
}
console.log(hammingDistance('code', 'cake'));
console.log(hammingDistance('', ''));
console.log(hammingDistance('😀a', '😀b'));
```

```text output
2
0
1
```

## Correctness and cost

After visiting `i` positions, the counter equals the number of mismatches in those positions. Checking the next pair either adds one or leaves the count unchanged. At the end every position has been counted once.

Time is O(n). This implementation uses O(n) space for the code-point arrays. For an ASCII-only contract, indexing the strings directly needs O(1) extra space. Reject unequal lengths instead of silently ignoring a suffix.

## Check your understanding

Explain why `cat` and `cats` have no Hamming distance under this contract. For fixed-width bit strings, compare the count of different positions with the number of set bits in their XOR.

## References

[Wikipedia](https://en.wikipedia.org/wiki/Hamming_distance)

**Next:** [Levenshtein Distance](../levenshtein-distance/README.md).
