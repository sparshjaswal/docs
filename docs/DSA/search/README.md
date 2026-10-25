---
id: dsa-search-readme
title: "Search"
slug: /DSA/search/README
sidebar_label: "Search"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

# Search

**Searching** means finding a value, a position, or a boundary that meets a condition. Before choosing an algorithm, state what the answer means. “Return whether 7 exists,” “return its first index,” and “return every matching index” are different contracts.

**Prerequisites:** array indices, comparisons, loops, and functions. Begin with scanning unsorted data. Learn [sorting](../sorting/README.md) and the idea of a maintained candidate interval before binary search. A faster search is useful only when its prerequisites hold.

## Learning steps

Looking for a name in a register may require a yes/no answer, the first position, or every matching position. Choose the output before the algorithm.

1. Scan unsorted values and return the required matches.
2. Use sorted order to rule out candidates in binary search.
3. Include preparation costs when comparing the two methods.

## Start with the information the input gives you

```text
position:      0     1     2     3
            +-----+-----+-----+-----+
values:     |  4  |  9  |  7  |  9  |
            +-----+-----+-----+-----+
scan:          1 --> 2 --> 3 --> 4
```

The numbers below “scan” label visits, not values. Searching this unsorted array for 9 cannot discard the second half just because an earlier value is small. The first match is at index 1; all matches are at indices `[1, 3]`. A missing target may require checking every position.

## Complete example: return every matching position

The [linear-search lesson](./linear-search/README.md) gives the first-match implementation and its interactive trace. This variant must continue after a match because the contract asks for **all** matching indices in increasing order. It uses strict equality and does not change the input. Thus separate objects do not match by field contents, and `NaN` does not match itself; choose another equality rule if a problem requires one.

```js runnable
function findAllIndices(values, target) {
  const positions = [];
  for (let index = 0; index < values.length; index++) {
    if (values[index] === target) positions.push(index);
  }
  return positions;
}
console.log(JSON.stringify(findAllIndices([4, 9, 7, 9], 9)));
console.log(JSON.stringify(findAllIndices([4, 9, 7, 9], 5)));
console.log(JSON.stringify(findAllIndices([], 9)));
```

```text output
[1,3]
[]
[]
```

Before each visit, `positions` contains exactly the matching indices from the already visited prefix, in increasing order. Appending the current index when it matches preserves that invariant. At the end, the prefix is the entire array, proving completeness and order. All n values are checked, so time is O(n). Working space excluding the result is O(1), while output space is O(k) for k matches. For a first-match query, an early return can make the best case O(1), but worst-case time remains O(n).

## Use sorted order to discard impossible candidates

For sorted values `[2, 5, 8, 12]` and target 8, binary search checks a middle value. If it sees 5, everything at or before that position is too small. This rules out a whole region with one comparison. Without sorted order, that inference is invalid.

The [binary-search lesson](./binary-search/README.md) teaches a closed candidate interval and returns any matching index or -1. The later [boundary-search chapter](../binary-search/README.md) teaches first/last occurrences and the insertion position used by LC 35 below. Do not replace an all-occurrences or first-occurrence contract with an arbitrary-match function.

| Situation | Good starting point | Cost and tradeoff |
| --- | --- | --- |
| One search in unsorted data | Linear scan | O(n) worst case; no preparation |
| Repeated searches in sorted data | Binary search | O(log(n + 1)) per search; no input sorting needed |
| Repeated membership checks in unsorted data | Build a Set | Expected O(n) preparation and O(1) per query; O(n) extra storage |
| Need original indices after sorting | Preserve index-value pairs | Sorting changes positions; include O(n log n) preparation and extra storage |
| Need an insertion boundary | Lower-bound binary search | O(log(n + 1)); return a boundary from 0 through n |

For one unsorted query, sorting first usually costs more than scanning. For q queries, compare repeated scans, O(q·n), against sorting once plus binary searches, O(n log n + q log(n + 1)), or a suitable lookup structure. Sorting is not free preprocessing. For a sorted array with duplicates, finding both boundaries can identify a matching interval in O(log(n + 1)) time, but explicitly returning its k indices still needs O(k) output work.

## Understanding checks and practice

1. **Read:** For `[7, 2, 7]`, what are the first index and all indices of 7?
2. **Reason:** Why can binary search discard half of a sorted array but not an arbitrary array?
3. **Modify:** Change `findAllIndices` to return only whether a match exists. When may it stop?
4. **Boundary practice:** In `[2, 4, 7, 9]`, where should 6 be inserted? Where should 10 be inserted?
5. **Tradeoff:** If the input never changes and thousands of membership queries follow, what preprocessing might be useful? What changes if each answer must include original positions?

<details>
<summary>Hints</summary>

Indices start at zero. Sorted order turns one comparison into a fact about an entire interval. A boolean existence query needs only one witness. The insertion position may equal the length. Sets preserve values, while maps can store positions.

</details>

<details>
<summary>Answers</summary>

The first index is 0 and all indices are `[0, 2]`. In ascending data, every value before a too-small middle value is also too small; unsorted input provides no such guarantee. For existence, return true at the first equality and false after a full unsuccessful scan. The insertion positions are 2 for 6 and 4 for 10. For many membership queries, a Set can amortize preparation; a Map from values to positions can retain index information. If each value may appear many times and all positions are needed, store a list of positions per key.

</details>

## Optional search variants

[Jump search](./jump-search/README.md) uses blocks in sorted data and has O(√n) search time with a suitable block size. [Interpolation search](./interpolation-search/README.md) estimates positions from numeric values; its O(log log n) average depends on a suitable distribution, and its worst case is O(n). These are useful comparisons, but linear search, binary search, and hashing are the core LeetCode/CodeChef path. Return to these variants when a problem or data model makes them relevant.

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| <PracticeProblem id={35} title={"Search Insert Position"} text={"Problem statement\nnums is a sorted array of distinct integers. Return the zero-based index of target if present.\nOtherwise return the position where inserting target would preserve sorted order, including\nposition nums.length when it belongs at the end. Use O(log n) time.\nInput \u0026 expected result\nUse the current array's zero-based positions. When target is absent, return an insertion boundary\nfrom 0 through nums.length inclusive. The function reports the position without actually inserting\nthe value or modifying nums.\nEXAMPLE 1\nInput: nums = [2,4,7,9], target = 6\nOutput: 2\nExplanation: Value 6 belongs between 4 at index 1 and 7 at index 2, so its insertion position is 2.\nEXAMPLE 2\nInput: nums = [2,5,9], target = 10\nOutput: 3\nExplanation: A value larger than every entry is inserted after the last element, at nums.length.\nConstraints \u0026 guarantees\n• nums.length: 1 through 10^4 (inclusive)\n• nums[i]: -10^4 through 10^4 (inclusive)\n• target: -10^4 through 10^4 (inclusive)\n• Values are distinct and in increasing order\nJavaScript starter\nfunction searchInsert(nums, target) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/search-insert-position/) | — |

{/* END GENERATED PRACTICE PROBLEMS */}

## Related Topics

- [Sorting](../sorting/README.md) — prerequisite for binary/jump/interpolation search
- [Binary Search](../binary-search/README.md) — problem-set applications of binary search

[← Back to Home](../index.md) · © sparshjaswal

**Next:** [two-pointer scans](../two-pointers/README.md).
