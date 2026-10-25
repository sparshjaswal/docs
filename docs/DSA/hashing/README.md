---
id: dsa-hashing-readme
title: "Hashing (Map / Set)"
slug: /DSA/hashing/README
sidebar_label: "Hashing (maps & sets)"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Hashing (Map / Set)

Suppose you have scores `[4, 8, 2, 7]` and need two different positions whose values add to 11. For each value, you could search the whole earlier list. Or you could remember where each earlier value occurred, so finding its partner becomes a lookup. That is the main problem-solving use of a **map**.

**Prerequisites:** arrays, loops, functions, and [JavaScript Map/Set operations](../javascript-for-dsa.md#4-choose-an-object-map-or-set). A **key** identifies an entry; its **value** is the information stored for that key. A `Map` stores key → value pairs. A `Set` stores membership alone. Learn [sets](../sets/README.md) when you need only yes/no membership.

## Learning steps

Imagine counting votes for class activities. Keep one count beside each activity name instead of searching the whole ballot pile again.

1. Use a Set for “have I seen this?” and a Map for a stored count or position.
2. Trace a frequency count, then a pair-sum lookup.
3. Check repeated values and distinguish a missing key from a stored zero.

## What hashing contributes

A hash function sends a key to a bucket number, and a hash table looks for the actual key inside that bucket. Two different keys can share a bucket: a **collision**. A collision must not make one key replace another. The [hash-table chapter](../hash-table/README.md) implements this with small lists.

For JavaScript problem solving, use `Map` unless the task asks you to build the structure. Its interface is what your algorithm needs; JavaScript does not require a particular internal hash-table implementation. The usual analysis here assumes expected O(1) operations on short keys, yielding O(n) storage for n entries. A conventional hash table can take O(n) per operation in a worst-case collision chain; ECMAScript promises average sublinear access for `Map`, not a worst-case O(1) guarantee. Long keys and expensive equality/hashing can add their own cost. See the [language collection specification](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map-objects).

## From checking every pair to remembering partners

A brute-force solution tries every pair of positions `first < second`, taking O(n²) time and O(1) working space. A map trades O(n) memory for expected O(n) time. Before reading a new value, ask whether the required **complement**, `target - value`, is already in the map.

```text
+----------+-----------+------------------+-------------------+
| position | new value | needed for 11    | earlier positions |
+----------+-----------+------------------+-------------------+
|    0     |     4     |        7         | empty             |
|    1     |     8     |        3         | 4 -> 0            |
|    2     |     2     |        9         | 4 -> 0, 8 -> 1    |
|    3     |     7     |        4         | 4 -> 0, 8 -> 1,   |
|          |           |                  | 2 -> 2            |
+----------+-----------+------------------+-------------------+
```

At position 3, the map says that 4 occurred at position 0. Return `[0, 3]`. The arrow means “value maps to its earlier position,” not an edge in the input array. Query before insertion so the current position cannot be its own partner.

<AlgorithmWalkthrough name="hashing" />

### Complete two-sum function

**Contract:** `values` and `target` are safe integers, and the required sums and differences remain within the safe Number range. Return one valid pair of distinct indices, or `null` if no pair exists. This explicit no-answer case extends the original LeetCode problem, which guarantees a pair. The input is not mutated.

```js runnable
function twoSum(values, target) {
  const earlierPosition = new Map();
  for (let index = 0; index < values.length; index++) {
    const needed = target - values[index];
    if (earlierPosition.has(needed)) {
      return [earlierPosition.get(needed), index];
    }
    earlierPosition.set(values[index], index);
  }
  return null;
}
console.log(JSON.stringify(twoSum([4, 8, 2, 7], 11)));
console.log(JSON.stringify(twoSum([6, 6], 12)));
console.log(JSON.stringify(twoSum([6], 12)));
console.log(JSON.stringify(twoSum([], 0)));
```

```text output
[0,3]
[0,1]
null
null
```

**Invariant:** before position i is processed, every map entry names an occurrence strictly before i, and every distinct earlier value has an entry. A found complement therefore gives two distinct valid positions. If a valid pair exists, its later endpoint will find the earlier value, unless another valid pair has already returned. Updating a repeated value's stored position is safe because it is still earlier than any future position. If the scan ends, no later endpoint found a partner, so no pair exists. Time is expected O(n), extra space O(n), under the map model above.

## Frequency counts and canonical keys

Use a frequency map when multiplicity matters. For `[4, 7, 4]`, the entries are `4 -> 2` and `7 -> 1`; a Set would lose the fact that 4 occurs twice.

```js runnable
function frequencies(values) {
  const counts = new Map();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}
console.log(JSON.stringify([...frequencies([4, 7, 4])]));
console.log(JSON.stringify([...frequencies([])]));
```

```text output
[[4,2],[7,1]]
[]
```

After every visit, each stored count equals the number of occurrences already seen; incrementing precisely the current value preserves that invariant. For n values and u distinct keys, time is expected O(n), storage O(u). `?? 0` provides the starting count only when no count exists. The spread in the demonstration converts map entries into an array for readable output.

A **canonical key** gives equivalent inputs the same representation. For example, sorting the letters of `"arc"` and `"car"` gives `"acr"`, so the same key can collect anagram groups. Include key-construction cost: sorting a word of length L takes O(L log L) comparisons under the comparison-sort model. Read the complete [group-anagrams example](./LC-49-group-anagrams/index.mdx) after frequency maps.

## Recognize the pattern and its limits

| Clue in a problem | Useful information to store |
| --- | --- |
| “Have I seen this before?” | Membership in a Set |
| “How many occurrences?” | A value's frequency in a Map |
| “Where was its partner?” | A value's earlier index |
| “Which inputs are equivalent?” | Groups under a canonical key |
| “Have I solved this state?” | A cached answer, after learning [memoization](../dp/README.md) |

Map insertion order is not sorted-key order. For predecessor, successor, or interval queries, consider sorting, a search tree, or a range-query structure. For one lookup in a tiny array, a scan avoids building an extra structure. Weak collections are useful for object-lifetime metadata but are optional here: contest algorithms usually need enumerable, explicitly retained entries.

## Mistakes and understanding checks

Use `Map.has(key)` to distinguish a missing key from one whose stored value is `undefined`. Separate object instances are different keys even if their fields match. An ordinary object has string/Symbol property keys and inherited properties; a Map is usually clearer for arbitrary contest keys. Do not rely on a plain object's truthiness or on a numeric key remaining distinct from its string spelling.

1. **Trace:** Why does `[6, 6]` with target 12 work, while `[6]` does not?
2. **Choose:** Would a Set suffice when returning two indices? What information would it lose?
3. **Modify:** Count how many times each lowercase letter appears. Compare a Map with an array of 26 counts.
4. **Extend:** Find the first value whose total frequency is 1. Why do you need a second scan in input order?
5. **Transfer later:** Learn [prefix sums](../prefix-sum/README.md), then count subarrays of a given sum with a map of prefix-sum frequencies. Do not apply a simple positive-only window when negatives are allowed.

<details>
<summary>Hints</summary>

Query the map before adding the current position. Returning indices requires storing positions, not just presence. A fixed alphabet can use an array index per letter. A frequency map tells how often, while the input order tells which qualifying value is first.

</details>

<details>
<summary>Answers</summary>

The first 6 has no earlier partner and is stored at index 0; the second finds it. One 6 cannot reuse its own position. A Set can establish that a pair exists but does not by itself return the earlier index. For a fixed 26-letter alphabet, a count array uses constant-size storage; a Map is more flexible for arbitrary keys. To find the first unique value, first compute all counts, then scan the original values and return the first with count 1. A one-pass early answer is unsafe because a later occurrence can invalidate it. Both passes together are expected O(n), not O(n²).

</details>

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| <PracticeProblem id={1} title={"Two Sum"} text={"Problem statement\nFind two distinct indices in nums whose values sum to target. Return their zero-based indices in\nany order. Exactly one pair exists, and you cannot use the same array position twice. Values may\nbe negative, repeated, or unsorted.\nInput \u0026 expected result\nReturn positions, not the values that add to target. Unlike the sorted-array version, this input need\nnot be ordered, and the result uses zero-based indices.\nEXAMPLE 1\nInput: nums = [4,8,2,7], target = 11\nOutput: [0,3]\nExplanation: The values at indices 0 and 3 are 4 and 7. Their sum is 11.\nEXAMPLE 2\nInput: nums = [6,6], target = 12\nOutput: [0,1]\nExplanation: The two equal values are usable because they occupy separate indices.\nConstraints \u0026 guarantees\n• nums.length: 2 through 10^4 (inclusive)\n• nums[i]: -10^9 through 10^9 (inclusive)\n• target: -10^9 through 10^9 (inclusive)\n• Exactly one pair of different indices satisfies the sum\nJavaScript starter\nfunction twoSum(nums, target) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/two-sum/) | [Example](./LC-1-two-sum/index.mdx) |
| <PracticeProblem id={169} title={"Majority Element"} text={"Problem statement\nA nonempty integer array nums contains one value that occurs more than half as many times as\nthere are elements. Return that majority value. You may rely on its existence. Try to process the\narray in linear time with constant additional space.\nInput \u0026 expected result\nReturn the value itself, not its frequency or position. The majority threshold is strictly greater than\nhalf the array length. The existence guarantee means no special result for a missing majority is\nneeded.\nEXAMPLE 1\nInput: nums = [6,2,6,6,3]\nOutput: 6\nExplanation: The value 6 occurs three times among five elements. Three is greater than half of\nfive, so 6 is the majority.\nEXAMPLE 2\nInput: nums = [9]\nOutput: 9\nExplanation: The only element occupies more than half of the array.\nConstraints \u0026 guarantees\n• n == nums.length\n• n: 1 through 5 * 10^4 (inclusive)\n• nums[i]: -10^9 through 10^9 (inclusive)\n• A value occupying more than half the positions is guaranteed\nJavaScript starter\nfunction majorityElement(nums) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/majority-element/) | — |
| <PracticeProblem id={205} title={"Isomorphic Strings"} text={"Problem statement\nStrings s and t have equal length. Determine whether replacing each distinct character of s\nconsistently with one character produces t. Two different characters of s cannot map to the same\ncharacter, while a character may map to itself. Character order must remain unchanged.\nInput \u0026 expected result\nThe mapping is directional but must also be one-to-one. Repeated occurrences of one source\ncharacter cannot be assigned different target characters, and two source characters cannot share\none target.\nEXAMPLE 1\nInput: s = \"paper\", t = \"title\"\nOutput: true\nExplanation: The consistent assignments p to t, a to i, e to l, and r to e transform the entire\nstring.\nEXAMPLE 2\nInput: s = \"ab\", t = \"cc\"\nOutput: false\nExplanation: Two different source characters would both have to map to c.\nConstraints \u0026 guarantees\n• s.length: 1 through 5 * 10^4 (inclusive)\n• t.length == s.length\n• Character set for both strings: ASCII\nJavaScript starter\nfunction isIsomorphic(s, t) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/isomorphic-strings/) | — |
| <PracticeProblem id={242} title={"Valid Anagram"} text={"Problem statement\nReturn true if s and t contain exactly the same letters with the same frequencies, so one can be\nrearranged into the other. The strings contain lowercase English letters. Different lengths or any\nunequal character count make the answer false.\nInput \u0026 expected result\nReturn a boolean based on character multiplicity. Matching the same distinct letters is not\nsufficient if one string repeats a letter more often.\nEXAMPLE 1\nInput: s = \"silent\", t = \"listen\"\nOutput: true\nExplanation: Both words have one copy of each of the letters s, i, l, e, n, and t.\nEXAMPLE 2\nInput: s = \"aab\", t = \"abb\"\nOutput: false\nExplanation: The counts of a and b differ.\nConstraints \u0026 guarantees\n• s.length, t.length: 1 through 5 * 10^4 (inclusive)\n• Both strings use a-z\nJavaScript starter\nfunction isAnagram(s, t) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/valid-anagram/) | [Example](./LC-242-valid-anagram/index.mdx) |
| <PracticeProblem id={290} title={"Word Pattern"} text={"Problem statement\nCheck whether the characters of pattern correspond one-to-one with the words in s. Each pattern\ncharacter must always match the same word, and different characters must match different words.\ns has nonempty words separated by single spaces. The number of words must equal the pattern\nlength.\nInput \u0026 expected result\nCompare pattern length with the number of words, not the number of letters in s. Whole words are\nthe units mapped to pattern characters.\nEXAMPLE 1\nInput: pattern = \"abba\", s = \"red blue blue red\"\nOutput: true\nExplanation: a consistently matches red, while b consistently matches blue. Each mapping is\nunique in both directions.\nEXAMPLE 2\nInput: pattern = \"ab\", s = \"red red\"\nOutput: false\nExplanation: Distinct pattern characters cannot both correspond to red.\nConstraints \u0026 guarantees\n• pattern.length: 1 through 300 (inclusive)\n• s.length: 1 through 3000 (inclusive)\n• pattern uses a-z\n• s uses a-z and spaces. Words have exactly one separating space, with none at either end\nJavaScript starter\nfunction wordPattern(pattern, s) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/word-pattern/) | — |
| <PracticeProblem id={383} title={"Ransom Note"} text={"Problem statement\nDetermine whether ransomNote can be formed using letters from magazine. Each occurrence in\nmagazine may be used at most once, so repeated letters in the note require enough copies. Both\ninputs contain lowercase English letters. Return a boolean.\nInput \u0026 expected result\nReturn a boolean; constructing or returning the note text is unnecessary. magazine is a pool of\nindividual letters, so their original positions do not restrict how the note is assembled.\nEXAMPLE 1\nInput: ransomNote = \"book\", magazine = \"lookbook\"\nOutput: true\nExplanation: The magazine provides b, k, and at least two copies of o, which is enough for book.\nEXAMPLE 2\nInput: ransomNote = \"aa\", magazine = \"a\"\nOutput: false\nExplanation: One available a cannot be used twice.\nConstraints \u0026 guarantees\n• ransomNote.length, magazine.length: 1 through 10^5 (inclusive)\n• Both strings use a-z\nJavaScript starter\nfunction canConstruct(ransomNote, magazine) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/ransom-note/) | — |
| <PracticeProblem id={409} title={"Longest Palindrome"} text={"Problem statement\nUsing the characters of s, build the longest possible palindrome and return its length. You may\nrearrange characters and leave some unused, but cannot use a character more times than it\nappears. Uppercase and lowercase letters are distinct.\nInput \u0026 expected result\nReturn the length, not a constructed string. This is not a longest-substring task.\nEXAMPLE 1\nInput: s = \"aabbccd\"\nOutput: 7\nExplanation: All characters can form a palindrome such as abcdcba.\nEXAMPLE 2\nInput: s = \"Aa\"\nOutput: 1\nExplanation: A and a are different characters, so only one can be used.\nConstraints \u0026 guarantees\n• 1 \u003c= s.length \u003c= 2000\n• Only English letters, in either case, appear\nJavaScript starter\nfunction longestPalindrome(s) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/longest-palindrome/) | — |
| [LC 448 — Find All Numbers Disappeared in an Array](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/) | Easy | [LeetCode](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/) | — |
| [LC 645 — Set Mismatch](https://leetcode.com/problems/set-mismatch/) | Easy | [LeetCode](https://leetcode.com/problems/set-mismatch/) | — |
| <PracticeProblem id={49} title={"Group Anagrams"} text={"Problem statement\nPartition strs into groups of anagrams. Strings belong in the same group exactly when their\ncharacters can be rearranged to match. Preserve every input occurrence, including duplicate\nstrings and empty strings. Return the groups in any order, with any ordering inside each group.\nInput \u0026 expected result\nThe output is a collection of groups, not a set of unique strings. Equal input strings remain as\nseparate occurrences in the same group, and empty strings belong together.\nEXAMPLE 1\nInput: strs = [\"arc\",\"car\",\"rat\",\"tar\",\"a\"]\nOne valid result: [[\"arc\",\"car\"],[\"rat\",\"tar\"],[\"a\"]]\nExplanation: arc and car share character counts, as do rat and tar. The single a has no partner.\nEXAMPLE 2\nInput: strs = [\"\",\"\", \"x\"]\nOne valid result: [[\"\",\"\"],[\"x\"]]\nExplanation: Both empty-string occurrences must be preserved.\nConstraints \u0026 guarantees\n• strs.length: 1 through 10^4 (inclusive)\n• strs[i].length: 0 through 100 (inclusive)\n• Each string uses a-z, with empty strings allowed\nJavaScript starter\nfunction groupAnagrams(strs) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/group-anagrams/) | [Example](./LC-49-group-anagrams/index.mdx) |
| <PracticeProblem id={128} title={"Longest Consecutive Sequence"} text={"Problem statement\nReturn the length of the longest run of consecutive integer values present in nums. The values may\nappear anywhere and in any order; the run is not required to be a contiguous array segment.\nDuplicate values do not extend a run. Use an algorithm with O(n) time complexity.\nInput \u0026 expected result\nReturn the number of distinct consecutive values in the best run. A missing intermediate value\nbreaks a run, and extra copies of a value do not lengthen it.\nEXAMPLE 1\nInput: nums = [9,1,4,3,2,2]\nOutput: 4, for values 1,2,3,4\nExplanation: The values 1, 2, 3, and 4 form a run regardless of their input positions. The\nrepeated 2 contributes no extra length.\nEXAMPLE 2\nInput: nums = [10,10,12]\nOutput: 1\nExplanation: 11 is absent, so 10 and 12 cannot belong to the same consecutive run.\nConstraints \u0026 guarantees\n• nums.length: 0 through 10^5 (inclusive)\n• nums[i]: -10^9 through 10^9 (inclusive)\nJavaScript starter\nfunction longestConsecutive(nums) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/longest-consecutive-sequence/) | [Example](./LC-128-longest-consecutive-sequence/index.mdx) |
| <PracticeProblem id={380} title={"Insert Delete GetRandom O(1)"} text={"Problem statement\nImplement a collection of distinct integers. The constructor creates an empty collection. insert(val)\nadds an absent value and reports true, or returns false if it already exists. remove(val) deletes a\npresent value and reports true, otherwise false. getRandom() returns a uniformly chosen stored\nvalue; it is called only when the collection is nonempty. Each operation must have average O(1)\nrunning time.\nInput \u0026 expected result\ninsert and remove return booleans. getRandom returns a stored integer, with equal probability for\neach distinct stored value. Removing and reinserting a value is permitted, and duplicate insertion\nmust not create another occurrence.\nEXAMPLE 1\nOperations: insert(8), insert(8), insert(3), remove(8), getRandom()\nResults: true, false, true, true, 3\nExplanation: After removing 8, only 3 remains, so getRandom must return 3. A second insertion\nof 8 had reported false and added nothing.\nEXAMPLE 2\nOperations: remove(5), insert(5), remove(5), insert(5), getRandom()\nResults: false, true, true, true, 5\nExplanation: An absent value cannot be removed, and a removed value can be inserted again.\nConstraints \u0026 guarantees\n• val: -2^31 through 2^31 - 1 (inclusive)\n• Total method calls: at most 2 * 10^5. Random queries occur only with a nonempty set\nJavaScript starter\nclass RandomizedSet {\n  constructor() { /* TODO */ }\n  insert(val) { /* TODO */ }\n  remove(val) { /* TODO */ }\n  getRandom() { /* TODO */ }\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/insert-delete-getrandom-o1/) | — |
| <PracticeProblem id={2013} title={"Detect Squares"} text={"Problem statement\nImplement DetectSquares. add(point) stores one occurrence of an integer coordinate pair; identical\npoints count as separate occurrences. count(point) returns how many ways three stored\noccurrences and the query point can form a square of positive area whose sides are parallel to the\ncoordinate axes. The query need not be stored and is not automatically added.\nInput \u0026 expected result\nOnly axis-aligned squares with nonzero side length qualify. Stored multiplicities multiply the\nnumber of available choices for the other three corners. The query point supplies one corner\nregardless of whether that coordinate has previously been added.\nEXAMPLE 1\nAdd [1,1], [1,3], [3,1]; count([3,3]) returns 1.\nAdd [1,1] again; count([3,3]) now returns 2.\nExplanation: The three stored coordinates complete one square with [3,3]. Duplicating [1,1]\ncreates a second choice for that corner and doubles the count.\nEXAMPLE 2\nAdd [0,0], [0,2], [3,0]; count([3,2])\nOutput: 0\nExplanation: These corners form a 3-by-2 rectangle, not a square.\nConstraints \u0026 guarantees\n• point.length == 2\n• x, y: 0 through 1000 (inclusive)\n• Combined add/count calls: at most 3000\nJavaScript starter\nclass DetectSquares {\n  constructor() { /* TODO */ }\n  add(point) { /* TODO */ }\n  count(point) { /* TODO */ }\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/detect-squares/) | — |
| <PracticeProblem id={41} title={"First Missing Positive"} text={"Problem statement\nReturn the smallest integer greater than zero that does not occur in nums. Negative values, zero,\nand duplicates do not change which positive integers are present. Your algorithm must use O(n)\ntime and O(1) auxiliary space.\nInput \u0026 expected result\nReturn the missing positive value, not its index.\nEXAMPLE 1\nInput: nums = [2,3,0,2]\nOutput: 1\nExplanation: The smallest positive integer is absent.\nEXAMPLE 2\nInput: nums = [1,2,4,-5]\nOutput: 3\nExplanation: Both 1 and 2 are present; 3 is the first gap.\nConstraints \u0026 guarantees\n• 1 \u003c= nums.length \u003c= 10^5\n• -2^31 \u003c= nums[i] \u003c= 2^31 - 1\nJavaScript starter\nfunction firstMissingPositive(nums) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/first-missing-positive/) | — |
| <PracticeProblem id={149} title={"Max Points on a Line"} text={"Problem statement\npoints contains distinct coordinates in the plane. Return the largest number of points lying on a\nsingle straight line. Lines may be vertical, horizontal, or sloped, and points need not be adjacent in\nthe input. A one-point input has answer 1.\nInput \u0026 expected result\nCount points on an infinite straight line, not merely a segment between adjacent input points. Each\ndistinct coordinate contributes at most one point. Return the maximum count; you do not need to\nreturn the line's slope, equation, or endpoints.\nEXAMPLE 1\nInput: points = [[0,0],[1,2],[2,4],[3,1]]\nOutput: 3\nExplanation: Points [0,0], [1,2], and [2,4] lie on y = 2x. The remaining point does not lie on that\nline.\nEXAMPLE 2\nInput: points = [[2,0],[2,3],[2,-4],[0,1]]\nOutput: 3\nExplanation: The three points with x-coordinate 2 lie on the same vertical line.\nConstraints \u0026 guarantees\n• points.length: 1 through 300 (inclusive)\n• points[i].length == 2\n• x_i, y_i: -10^4 through 10^4 (inclusive)\n• Coordinate pairs do not repeat\nJavaScript starter\nfunction maxPoints(points) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/max-points-on-a-line/) | — |
| <PracticeProblem id={269} title={"Alien Dictionary"} text={"Problem statement\nwords is claimed to be sorted lexicographically under an unknown ordering of lowercase letters.\nInfer an ordering of all distinct letters that occur and return it as a string. When words differ, their\nfirst unequal letters decide their order; a proper prefix must precede the longer word. Return any\nvalid ordering, or an empty string if the list is inconsistent.\nInput \u0026 expected result\nInclude every distinct letter appearing in the input exactly once, even if its relative order is\nunconstrained. The output describes alphabet order rather than a rearrangement of the words. A\nlonger word preceding its exact prefix makes the input invalid.\nEXAMPLE 1\nInput: words = [\"za\",\"zb\",\"ca\",\"cb\"]\nOne valid result: \"zcab\"\nExplanation: The words require a before b and z before c. The order z,c,a,b satisfies both\nrelations and includes all observed letters.\nEXAMPLE 2\nInput: words = [\"abc\",\"ab\"]\nOutput: \"\"\nExplanation: A word cannot sort before its own shorter prefix under any ordering of the letters.\nConstraints \u0026 guarantees\n• Input words contain lowercase English letters\n• Infer an order over all observed letters\n• reject inconsistent input\nPremium source: current numeric bounds could not be publicly verified.\nJavaScript starter\nfunction alienOrder(words) {\n  // TODO: write your solution.\n}"} /> | Hard · Premium | [LeetCode](https://leetcode.com/problems/alien-dictionary/) | — |
| [LC 381 — Insert Delete GetRandom O(1) - Duplicates allowed](https://leetcode.com/problems/insert-delete-getrandom-o1-duplicates-allowed/) | Hard | [LeetCode](https://leetcode.com/problems/insert-delete-getrandom-o1-duplicates-allowed/) | — |
| [LC 929 — Unique Email Addresses](https://leetcode.com/problems/unique-email-addresses/) | Easy | [LeetCode](https://leetcode.com/problems/unique-email-addresses/) | [View Solution](./LC-929-unique-email-addresses/index.mdx) |
| [LC 575 — Distribute Candies](https://leetcode.com/problems/distribute-candies/) | Easy | [LeetCode](https://leetcode.com/problems/distribute-candies/) | [View Solution](./LC-575-distribute-candies/index.mdx) |
| [LC 349 — Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays/) | Easy | [LeetCode](https://leetcode.com/problems/intersection-of-two-arrays/) | [View Solution](./LC-349-intersection-of-two-arrays/index.mdx) |
| [LC 387 — First Unique Character in a String](https://leetcode.com/problems/first-unique-character-in-a-string/) | Easy | [LeetCode](https://leetcode.com/problems/first-unique-character-in-a-string/) |  |
| [LC 771 — Jewels and Stones](https://leetcode.com/problems/jewels-and-stones/) | Easy | [LeetCode](https://leetcode.com/problems/jewels-and-stones/) |  |
| [LC 1002 — Find Common Characters](https://leetcode.com/problems/find-common-characters/) | Easy | [LeetCode](https://leetcode.com/problems/find-common-characters/) |  |
| [LC 1207 — Unique Number of Occurrences](https://leetcode.com/problems/unique-number-of-occurrences/) | Easy | [LeetCode](https://leetcode.com/problems/unique-number-of-occurrences/) |  |
| [CC — Frequency of Characters (FREQ)](https://www.codechef.com/problems/FREQ) | Easy | — |  |
| [CC — Count Distinct Elements (DISTELEM)](https://www.codechef.com/problems/DISTELEM) | Easy | — |  |
| [LC 187 — Repeated DNA Sequences](https://leetcode.com/problems/repeated-dna-sequences/) | Medium | [LeetCode](https://leetcode.com/problems/repeated-dna-sequences/) |  |
| [LC 454 — 4Sum II](https://leetcode.com/problems/4sum-ii/) | Medium | [LeetCode](https://leetcode.com/problems/4sum-ii/) |  |
| [LC 1010 — Pairs of Songs With Total Durations Divisible by 60](https://leetcode.com/problems/pairs-of-songs-with-total-durations-divisible-by-60/) | Medium | [LeetCode](https://leetcode.com/problems/pairs-of-songs-with-total-durations-divisible-by-60/) |  |
| [CC — Subarray with Given Sum (SUBSUM)](https://www.codechef.com/problems/SUBSUM) | Medium | — |  |
| [CC — Hash Table Operations (HASHTBL)](https://www.codechef.com/problems/HASHTBL) | Medium | — |  |
| [CC — Advanced Hashing (ADVHASH)](https://www.codechef.com/problems/ADVHASH) | Hard | — |  |

{/* END GENERATED PRACTICE PROBLEMS */}

## Related Topics

- [Prefix Sum](../prefix-sum/README.md) — hash maps power "subarray sum = K"
- [Sliding Window](../sliding-window/README.md) — freq maps track window contents
- [Two Pointers](../two-pointers/README.md)

**Next:** [how a hash table handles collisions](../hash-table/README.md).
