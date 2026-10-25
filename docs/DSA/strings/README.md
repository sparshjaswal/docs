---
id: dsa-strings-readme
title: "🔤 Strings"
slug: /DSA/strings/README
sidebar_label: "Strings"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Strings

A string stores text. Common tasks include finding a word, counting letters, and checking whether text reads the same backward. Start with plain English letters, then learn how JavaScript handles other characters.

<AlgorithmWalkthrough name="palindrome" />

## Learning steps

A search box receives text. Before searching it, decide whether spaces, letter case, and accented letters affect a match.

1. Read characters and build a new string without changing the old one.
2. Count letters and trace a palindrome check from both ends.
3. Choose a text-search method only after stating what one character means.

## Read the problem carefully

Three similar words describe different tasks:

| Word | Meaning | Example using `abc` |
| --- | --- | --- |
| Substring | Consecutive characters; no gaps | `ab` is a substring; `ac` is not. |
| Subsequence | Keep the order, but you may skip characters | `ac` is a subsequence. |
| Anagram | Use the same characters the same number of times, in any order | `cab` is an anagram. |

A palindrome reads the same backward, such as `level`. Decide whether spaces, punctuation, and letter case should count before writing the check.

## Strings cannot be changed in place

A JavaScript string is **immutable**: operations return a new string. They do not change a character inside the old one.

```js runnable
const word = 'cat';
const changed = 'b' + word.slice(1);
console.log(word);
console.log(changed);
console.log(word.slice(0, 2));
console.log(word.indexOf('a'));
```

```text output
cat
bat
ca
1
```

`slice(start, end)` includes the start position and stops before the end. `indexOf` returns the first matching position, or -1 when there is no match.

## What counts as one character?

JavaScript stores strings as UTF-16 code units. A plain English letter uses one unit, but some symbols use two. So `length` and `s[i]` do not always count or read a whole visible character. [MDN explains string length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length).

```js runnable
const text = 'A😀B';
console.log(text.length);
console.log([...text].length);
console.log([...text].reverse().join(''));
```

```text output
4
3
B😀A
```

Spread (`[...text]`) and `for...of` read Unicode code points, which keeps this emoji together. Some visible characters contain several code points. For user-facing text, see [text segmentation](../../javascript/strings-and-regular-expressions.md). For a coding problem limited to `a`–`z`, ordinary indexing is enough.

## Choose a useful pattern

| Task | Starting point | Small example |
| --- | --- | --- |
| Compare the two ends | [Two pointers](../two-pointers/README.md) | Compare `l` with `l`, then `e` with `e` in `level`. |
| Find a range with no repeated letters | [Sliding window](../sliding-window/README.md) | In `abca`, shrink the window when the second `a` arrives. |
| Count letters or compare anagrams | [Hashing](../hashing/README.md) | `aba` has counts `a: 2`, `b: 1`. |
| Find an exact pattern efficiently | [KMP](./knuth-morris-pratt/README.md) | Reuse earlier matches after a mismatch. |
| Compare nearby substring hashes | [Rabin–Karp](./rabin-karp/README.md) | Update a hash as the window moves, then verify matching text. |
| Count edits between two words | [Dynamic programming](../dp/README.md) | `cat` becomes `cut` with one replacement. |

## Try a complete small example

This function checks a palindrome after keeping only English letters and digits. The cleaned string is a copy, so the function uses O(n) extra space even though the two indices use O(1).

```js runnable
function isPlainPalindrome(text) {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = cleaned.length - 1;
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }
  return true;
}
console.log(isPlainPalindrome('Never odd or even'));
console.log(isPlainPalindrome('hello'));
console.log(isPlainPalindrome(''));
```

```text output
true
false
true
```

The empty cleaned string counts as a palindrome in this contract. Time is O(n), where n is the original string length.

## Common mistakes

- **Using `split('')` for emoji:** it splits code units. Use code-point iteration or text segmentation as needed.
- **Ignoring case or punctuation without being asked:** define the comparison rules first.
- **Confusing a hash match with a text match:** different strings may have the same hash.
- **Forgetting copies:** `slice`, normalization, and array conversion can add memory use.
- **Claiming one engine-independent cost for every built-in:** string storage and concatenation can be optimized differently. In a simple copying model, repeatedly copying an ever-growing string can take O(n²) total work. Collecting parts and joining once makes the intended construction clearer.

## String Algorithms Reference

Each guide contains the explanation, examples, and references for that algorithm. The source and legacy test files remain available for study.

| Guide | Purpose | Source | Tests |
| --- | --- | --- | --- |
| [Hamming distance](./hamming-distance/README.md) | Count differing positions in equal-length sequences. | [Implementation](./hamming-distance/hammingDistance.js) | [Tests](./hamming-distance/__test__/hammingDistance.test.js) |
| [Knuth–Morris–Pratt](./knuth-morris-pratt/README.md) | Search for a pattern using a prefix table. | [Implementation](./knuth-morris-pratt/knuthMorrisPratt.js) | [Tests](./knuth-morris-pratt/__test__/knuthMorrisPratt.test.js) |
| [Levenshtein distance](./levenshtein-distance/README.md) | Find the minimum number of insertions, deletions, and substitutions. | [Implementation](./levenshtein-distance/levenshteinDistance.js) | [Tests](./levenshtein-distance/__test__/levenshteinDistance.test.js) |
| [Longest common substring](./longest-common-substring/README.md) | Find a shared contiguous sequence. | [Implementation](./longest-common-substring/longestCommonSubstring.js) | [Tests](./longest-common-substring/__test__/longestCommonSubstring.test.js) |
| [Palindrome check](./palindrome/README.md) | Compare a sequence with its reverse. | [Implementation](./palindrome/isPalindrome.js) | [Tests](./palindrome/__test__/isPalindrome.test.js) |
| [Rabin–Karp](./rabin-karp/README.md) | Search using rolling hashes and verify candidate matches. | [Implementation](./rabin-karp/rabinKarp.js) | [Tests](./rabin-karp/__test__/rabinKarp.test.js) |
| [Regular expression matching](./regular-expression-matching/README.md) | Match a pattern containing dot and star operators. | [Implementation](./regular-expression-matching/regularExpressionMatching.js) | [Tests](./regular-expression-matching/__test__/regularExpressionMatching.test.js) |
| [Z algorithm](./z-algorithm/README.md) | Compute prefix-match lengths at every position. | [Implementation](./z-algorithm/zAlgorithm.js) | [Tests](./z-algorithm/__test__/zAlgorithm.test.js) |


## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| <PracticeProblem id={14} title={"Longest Common Prefix"} text={"Problem statement\nGiven an array strs of strings, return the longest prefix shared by every string. A prefix starts at the\nfirst character, and matching is case-sensitive. If the strings have no common first character, or a\nmember is empty, return the empty string.\nInput \u0026 expected result\nCompare prefixes from the start of each string. A matching substring occurring later does not\nqualify. Return the empty string when the shared prefix has length zero.\nEXAMPLE 1\nInput: strs = [\"interview\",\"internet\",\"internal\"]\nOutput: \"inter\"\nExplanation: Each string starts with inter. Their following characters differ, so no longer common\nprefix exists.\nEXAMPLE 2\nInput: strs = [\"dog\",\"cat\"]\nOutput: \"\"\nExplanation: The first characters already differ.\nConstraints \u0026 guarantees\n• strs.length: 1 through 200 (inclusive)\n• strs[i].length: 0 through 200 (inclusive)\n• Each string uses a-z\n• empty strings are permitted\nJavaScript starter\nfunction longestCommonPrefix(strs) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/longest-common-prefix/) | — |
| <PracticeProblem id={28} title={"Find the Index of the First Occurrence in a String"} text={"Problem statement\nFind the first occurrence of needle as a contiguous substring of haystack. Return the zero-based\nindex at which it begins. Matching is case-sensitive, and the entire needle must match consecutive\ncharacters. Return -1 when it never occurs. Both input strings are nonempty.\nInput \u0026 expected result\nReturn an index into haystack, not the matched text. Stop at the earliest full occurrence when\nseveral matches exist. A partial match near the end is not sufficient.\nEXAMPLE 1\nInput: haystack = \"abracadabra\", needle = \"cad\"\nOutput: 4\nExplanation: The characters at indices 4, 5, and 6 are c, a, and d, so the first complete match\nstarts at 4.\nEXAMPLE 2\nInput: haystack = \"aaaa\", needle = \"aa\"\nOutput: 0\nExplanation: Matches begin at several positions, but the earliest starts at zero.\nConstraints \u0026 guarantees\n• haystack.length, needle.length: 1 through 10^4 (inclusive)\n• Both strings use a-z\nJavaScript starter\nfunction strStr(haystack, needle) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/) | — |
| [LC 1758 — Minimum Changes To Make Alternating Binary String](https://leetcode.com/problems/minimum-changes-to-make-alternating-binary-string/) | Easy | [LeetCode](https://leetcode.com/problems/minimum-changes-to-make-alternating-binary-string/) | — |
| <PracticeProblem id={6} title={"Zigzag Conversion"} text={"Problem statement\nWrite the characters of s in a zigzag across numRows rows: move down from the first row to the\nlast, then diagonally upward to the first, repeating until the string is exhausted. Read the rows from\ntop to bottom to form the returned string. numRows is positive; one row leaves the string\nunchanged.\nInput \u0026 expected result\nCharacters are assigned to rows while traveling down and back up; then those rows are\nconcatenated. This differs from reversing the input or reading diagonals directly.\nEXAMPLE 1\nInput: s = \"ABCDEFG\", numRows = 3\nOutput: \"AEBDFCG\"\nExplanation: The three rows contain AE, BDF, and CG. Concatenating them produces AEBDFCG.\nEXAMPLE 2\nInput: s = \"ABCDE\", numRows = 1\nOutput: \"ABCDE\"\nExplanation: With one row there is no vertical movement or rearrangement.\nConstraints \u0026 guarantees\n• s.length: 1 through 1000 (inclusive)\n• numRows: 1 through 1000 (inclusive)\n• Alphabet: A-Z, a-z, comma, and period\nJavaScript starter\nfunction convert(s, numRows) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/zigzag-conversion/) | — |
| <PracticeProblem id={8} title={"String to Integer (atoi)"} text={"Problem statement\nConvert s to a signed 32-bit integer. Skip leading spaces, consume at most one leading + or -, then\nread consecutive decimal digits until another character or the end. Return 0 if no digits were\nconsumed. Clamp overflow to [-2^31, 2^31 - 1]. Implement digit conversion yourself; do not use\nparseInt, Number, or another string-to-number converter.\nInput \u0026 expected result\nReturn the parsed number. A sign is accepted only immediately after the leading spaces.\nEXAMPLE 1\nInput: s = \"  -0078end\"\nOutput: -78\nExplanation: Spaces and leading zeros do not affect the value; reading stops at e.\nEXAMPLE 2\nInput: s = \"999999999999\"\nOutput: 2147483647\nExplanation: The positive value exceeds the signed 32-bit maximum and is clamped.\nConstraints \u0026 guarantees\n• 0 \u003c= s.length \u003c= 200\n• s consists of English letters (lower-case and upper-case), digits (0 - 9), ' ', '+', '-', and '.'\nJavaScript starter\nfunction myAtoi(s) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/string-to-integer-atoi/) | — |
| [LC 38 — Count and Say](https://leetcode.com/problems/count-and-say/) | Medium | [LeetCode](https://leetcode.com/problems/count-and-say/) | — |
| [LC 165 — Compare Version Numbers](https://leetcode.com/problems/compare-version-numbers/) | Medium | [LeetCode](https://leetcode.com/problems/compare-version-numbers/) | — |
| <PracticeProblem id={271} title={"Encode and Decode Strings"} text={"Problem statement\nImplement encode(strs) and decode(s) so that a list of strings can be converted to one string and\nrecovered exactly. Preserve list order, empty strings, and every character. A delimiter might also\noccur inside an input string, so the format must be unambiguous. Decoding must work from the\nencoded value alone rather than shared saved state.\nInput \u0026 expected result\nThere is no prescribed encoded representation. The required property is exact round-trip recovery,\nincluding the number of strings and their boundaries. The two operations must work across\nseparate calls without a shared original list.\nEXAMPLE 1\nInput to encode: [\"a#b\",\"\",\"xyz\"]\nAfter decode(encode(input)): [\"a#b\",\"\",\"xyz\"]\nExplanation: The embedded # and the empty middle string both need to survive the conversion;\na naive delimiter split would not always preserve them.\nEXAMPLE 2\nInput to encode: [\"\"]\nAfter decoding the result: [\"\"]\nExplanation: A list containing one empty string must remain distinguishable from a list\ncontaining no strings.\nConstraints \u0026 guarantees\n• Input: an ordered list of strings, including possible empty strings\n• All character data and string boundaries must survive the round trip\nPremium source: current numeric bounds could not be publicly verified.\nJavaScript starter\nfunction encode(strs) {\n  // TODO: write your solution.\n}\nfunction decode(s) {\n  // TODO: write your solution.\n}"} /> | Medium · Premium | [LeetCode](https://leetcode.com/problems/encode-and-decode-strings/) | — |
| [LC 1392 — Longest Happy Prefix](https://leetcode.com/problems/longest-happy-prefix/) | Hard | [LeetCode](https://leetcode.com/problems/longest-happy-prefix/) | — |
| [LC 459 — Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern/) | Easy | [LeetCode](https://leetcode.com/problems/repeated-substring-pattern/) |  |
| [LC 520 — Detect Capital](https://leetcode.com/problems/detect-capital/) | Easy | [LeetCode](https://leetcode.com/problems/detect-capital/) |  |
| [LC 541 — Reverse String II](https://leetcode.com/problems/reverse-string-ii/) | Easy | [LeetCode](https://leetcode.com/problems/reverse-string-ii/) |  |
| [LC 557 — Reverse Words in a String III](https://leetcode.com/problems/reverse-words-in-a-string-iii/) | Easy | [LeetCode](https://leetcode.com/problems/reverse-words-in-a-string-iii/) |  |
| [LC 680 — Valid Palindrome II](https://leetcode.com/problems/valid-palindrome-ii/) | Easy | [LeetCode](https://leetcode.com/problems/valid-palindrome-ii/) |  |
| [LC 709 — To Lower Case](https://leetcode.com/problems/to-lower-case/) | Easy | [LeetCode](https://leetcode.com/problems/to-lower-case/) |  |
| [LC 796 — Rotate String](https://leetcode.com/problems/rotate-string/) | Easy | [LeetCode](https://leetcode.com/problems/rotate-string/) |  |
| [LC 819 — Most Common Word](https://leetcode.com/problems/most-common-word/) | Easy | [LeetCode](https://leetcode.com/problems/most-common-word/) |  |
| [LC 859 — Buddy Strings](https://leetcode.com/problems/buddy-strings/) | Easy | [LeetCode](https://leetcode.com/problems/buddy-strings/) |  |
| [LC 925 — Long Pressed Name](https://leetcode.com/problems/long-pressed-name/) | Easy | [LeetCode](https://leetcode.com/problems/long-pressed-name/) |  |
| [LC 1108 — Defanging an IP Address](https://leetcode.com/problems/defanging-an-ip-address/) | Easy | [LeetCode](https://leetcode.com/problems/defanging-an-ip-address/) |  |
| [CC — String Basics (STRBASIC)](https://www.codechef.com/problems/STRBASIC) | Easy | — |  |
| [CC — Character Count (CHARCOUNT)](https://www.codechef.com/problems/CHARCOUNT) | Easy | — |  |
| [CC — Palindrome Check (PALCHECK)](https://www.codechef.com/problems/PALCHECK) | Easy | — |  |
| [LC 856 — Score of Parentheses](https://leetcode.com/problems/score-of-parentheses/) | Medium | [LeetCode](https://leetcode.com/problems/score-of-parentheses/) |  |
| [LC 890 — Find and Replace Pattern](https://leetcode.com/problems/find-and-replace-pattern/) | Medium | [LeetCode](https://leetcode.com/problems/find-and-replace-pattern/) |  |
| [LC 1209 — Remove All Adjacent Duplicates in String II](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/) | Medium | [LeetCode](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/) |  |
| [LC 1249 — Minimum Remove to Make Valid Parentheses](https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/) | Medium | [LeetCode](https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/) |  |
| [CC — String Manipulation (STRMANIP)](https://www.codechef.com/problems/STRMANIP) | Medium | — |  |
| [CC — Pattern Matching (PATMATCH)](https://www.codechef.com/problems/PATMATCH) | Medium | — |  |
| [CC — Anagram Problems (ANAGRAM)](https://www.codechef.com/problems/ANAGRAM) | Medium | — |  |
| [LC 214 — Shortest Palindrome](https://leetcode.com/problems/shortest-palindrome/) | Hard | [LeetCode](https://leetcode.com/problems/shortest-palindrome/) |  |
| [LC 301 — Remove Invalid Parentheses](https://leetcode.com/problems/remove-invalid-parentheses/) | Hard | [LeetCode](https://leetcode.com/problems/remove-invalid-parentheses/) |  |
| [LC 726 — Number of Atoms](https://leetcode.com/problems/number-of-atoms/) | Hard | [LeetCode](https://leetcode.com/problems/number-of-atoms/) |  |
| [LC 1044 — Longest Duplicate Substring](https://leetcode.com/problems/longest-duplicate-substring/) | Hard | [LeetCode](https://leetcode.com/problems/longest-duplicate-substring/) |  |
| [LC 1316 — Distinct Echo Substrings](https://leetcode.com/problems/distinct-echo-substrings/) | Hard | [LeetCode](https://leetcode.com/problems/distinct-echo-substrings/) |  |
| [CC — Advanced String Algorithms (ADVSTR)](https://www.codechef.com/problems/ADVSTR) | Hard | — |  |
| [CC — KMP Algorithm (KMPALGO)](https://www.codechef.com/problems/KMPALGO) | Hard | — |  |
| [CC — String Hashing (STRHASH)](https://www.codechef.com/problems/STRHASH) | Hard | — |  |

{/* END GENERATED PRACTICE PROBLEMS */}

## 🔗 Related Topics

- **[Sliding Window](../sliding-window/README.md)** — Essential for substring problems
- **[Two Pointers](../two-pointers/README.md)** — Palindrome and string reversal
- **[Hashing](../hashing/README.md)** — Character frequency and anagram detection
- **[Dynamic Programming](../dp/README.md)** — Edit distance and string matching
- **[Backtracking](../backtracking/README.md)** — String permutations and combinations

---

## 🎯 Quick Interview Prep Checklist

- [ ] Master anagram detection (both sorting and frequency methods)
- [ ] Understand palindrome checking with two pointers
- [ ] Practice sliding window for substring problems
- [ ] Know string manipulation techniques (reverse, rotate)
- [ ] Comfortable with character frequency counting
- [ ] Understand basic pattern matching algorithms
- [ ] Practice string parsing and validation
- [ ] Know when to use StringBuilder pattern (array + join)

[← Back to Home](../index.md) · © sparshjaswal

**Next:** [matrices](../matrix/README.md).
