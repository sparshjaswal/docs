---
id: dsa-strings-knuth-morris-pratt-readme
title: "Knuth–Morris–Pratt Algorithm"
slug: /DSA/strings/knuth-morris-pratt/README
sidebar_label: "Knuth–Morris–Pratt Algorithm"
---

# Knuth–Morris–Pratt Algorithm

KMP finds the first occurrence of a pattern inside text. After a mismatch it reuses the part that already matched, instead of checking the same text positions again.

**Before you start:** understand array indices and [linear search](../../search/linear-search/README.md). The implementation below compares JavaScript UTF-16 code units, like `String#indexOf`, and returns a code-unit index.

## Learning steps

Searching a long log for a repeated phrase can waste work after a mismatch. KMP remembers which part of the phrase still matches.

1. Build the prefix table by matching a pattern against itself.
2. Trace one mismatch without moving backward through the text.
3. Test repeated letters and an empty pattern before reading the cost proof.

## Build the prefix table

A **prefix** starts at the beginning; a **suffix** ends at the end.

`lps[i]` is the length of the longest proper prefix of `pattern[0..i]` that is also a suffix. “Proper” means shorter than the whole prefix. For `ababac`:

| Index | 0 | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- | --- |
| Character | a | b | a | b | a | c |
| `lps` | 0 | 0 | 1 | 2 | 3 | 0 |

The prefix `ababa` begins and ends with `aba`, so its entry is 3. This table describes the pattern alone; build it once before searching.

## Follow a mismatch

Search for `ababac` in `abababac`. The first five characters match. At text index 5, `b` does not match the required `c`. Set the matched length from 5 to `lps[4]`, which is 3. Keep the text index at 5. The suffix `aba` is still useful, and the next pattern character is `b`. Continue to find a match starting at index 2.

The invariant is: the `j` characters immediately before the current text index equal the first `j` pattern characters. Falling back to `lps[j - 1]` preserves that fact.

```mermaid
flowchart LR
  accTitle: KMP keeps a matched suffix after a mismatch
  accDescr: While finding ababac in abababac, five characters match. At text index five, b differs from c. The prefix table reduces the matched length from five to three without moving the text index, keeping the suffix aba, then b matches the next pattern character.
  A["Matched ababa: length 5"] --> B["At text index 5: b differs from c"]
  B --> C["lps[4] = 3: keep aba"]
  C --> D["Same text b matches pattern[3]"]
  D --> E["Continue with matched length 4"]
```

## Implementation

```js runnable
function kmp(text, pattern) {
  if (pattern.length === 0) return 0;
  const lps = Array(pattern.length).fill(0);
  for (let i = 1, j = 0; i < pattern.length;) {
    if (pattern[i] === pattern[j]) lps[i++] = ++j;
    else if (j > 0) j = lps[j - 1];
    else i++;
  }
  for (let i = 0, j = 0; i < text.length;) {
    if (text[i] === pattern[j]) {
      i++;
      if (++j === pattern.length) return i - j;
    } else if (j > 0) j = lps[j - 1];
    else i++;
  }
  return -1;
}
console.log(kmp('abababac', 'ababac'));
console.log(kmp('abc', 'z'));
console.log(kmp('', ''));
```

```text output
2
-1
0
```

## Complexity

For text length `n` and pattern length `m`, preprocessing takes O(m), searching takes O(n), and the table uses O(m) space. A fallback can happen several times at one text index, but the total number of advances and fallbacks is linear. KMP gives a worst-case guarantee; it is not automatically faster than a native string search on every input.

## Check your understanding

Trace the prefix table for `aaaa`: it is `[0, 1, 2, 3]`. Then try a pattern longer than the text, a match at the last position, and repeated-prefix mismatches. For all matches, record each match and fall back to `lps[m - 1]` so overlapping matches remain possible.

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm)
- [YouTube](https://www.youtube.com/watch?v=GTJr8OvyEVQ&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

**Next:** [the Z algorithm](../z-algorithm/README.md).
