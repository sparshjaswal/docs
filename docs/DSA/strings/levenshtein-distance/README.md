---
id: dsa-strings-levenshtein-distance-readme
title: "Levenshtein Distance"
slug: /DSA/strings/levenshtein-distance/README
sidebar_label: "Levenshtein Distance"
---

# Levenshtein Distance

**Read first:** [Dynamic Programming](../../dp/README.md).

**Practice focus:** Define the cost for two prefixes, then compare insertion, deletion, replacement, and a free match.

Levenshtein distance is the fewest edits needed to change one string into another. Each insertion, deletion, or replacement costs one. Matching characters cost zero. For `cat → cut`, replacing `a` with `u` gives distance 1.

## Definition

Let `distance[i][j]` be the cost to change the first `i` characters of the source into the first `j` characters of the target. These examples use ASCII characters; decide what a character means before extending the algorithm to Unicode.

| Case | Cost | Reason |
| --- | --- | --- |
| Empty source | `distance[0][j] = j` | Insert all j target characters. |
| Empty target | `distance[i][0] = i` | Delete all i source characters. |
| Delete last source character | `distance[i - 1][j] + 1` | Solve the shorter source first. |
| Insert last target character | `distance[i][j - 1] + 1` | Solve the shorter target first. |
| Match or replace | `distance[i - 1][j - 1] + cost` | cost is 0 for equal characters, otherwise 1. |

For a nonempty pair of prefixes, take the minimum of the final three candidates. The zero-or-one match cost applies **only to the diagonal candidate**; insertion and deletion still cost one.

## Example

`kitten → sitten → sittin → sitting` uses two replacements and one insertion, for distance 3.

## Dynamic Programming Approach Explanation

For `ME → MY`, rows represent source prefixes and columns represent target prefixes:

| Source / target | Empty | M | MY |
| --- | --- | --- | --- |
| Empty | 0 | 1 | 2 |
| M | 1 | 0 | 1 |
| ME | 2 | 1 | 1 |

At the bottom-right cell, deletion costs `1 + 1 = 2`, insertion costs `1 + 1 = 2`, and replacement costs `0 + 1 = 1`. Choose 1. The table includes empty prefixes, so its size is `(source.length + 1) × (target.length + 1)`.

```js runnable
function levenshteinDistance(source, target) {
  const distance = Array.from({ length: source.length + 1 }, () =>
    Array(target.length + 1).fill(0),
  );
  for (let i = 0; i <= source.length; i++) distance[i][0] = i;
  for (let j = 0; j <= target.length; j++) distance[0][j] = j;
  for (let i = 1; i <= source.length; i++) {
    for (let j = 1; j <= target.length; j++) {
      const cost = source[i - 1] === target[j - 1] ? 0 : 1;
      distance[i][j] = Math.min(
        distance[i - 1][j] + 1,
        distance[i][j - 1] + 1,
        distance[i - 1][j - 1] + cost,
      );
    }
  }
  return distance[source.length][target.length];
}

console.log(levenshteinDistance('kitten', 'sitting'));
console.log(levenshteinDistance('', 'cat'));
console.log(levenshteinDistance('same', 'same'));
```

```text output
3
3
0
```

JavaScript string indexing counts UTF-16 code units. For the ASCII inputs used here, those are individual characters. Counting Unicode code points or user-visible characters requires splitting both strings appropriately before filling the table.

Fill rows from top to bottom and columns from left to right. Each dependency is ready when needed. For lengths `m` and `n`, the full table costs `O(mn)` time and space. Keeping two rows reduces extra space to `O(n)` when only the distance is needed. Returning the actual edits needs additional reconstruction information.

## Applications

Use edit distance for spelling suggestions and approximate matching. It measures edits, not meaning: two words can be close in spelling but unrelated in meaning. Transposing two letters is not a single edit in ordinary Levenshtein distance.

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| Empty string to `cat` | Practice | Expected distance: 3 | — |
| `same` to `same` | Practice | Expected distance: 0 | — |
| `ME` to `MY` | Practice | Expected distance: 1 | — |
| `kitten` to `sitting` | Practice | Expected distance: 3 | — |

## References

[Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance). Continue with [dynamic programming](../../dp/README.md).

**Next:** [Regular Expression Matching](../regular-expression-matching/README.md).
