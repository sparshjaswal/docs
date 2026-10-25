---
id: dsa-sliding-window-readme
title: "🪟 Sliding Window"
slug: /DSA/sliding-window/README
sidebar_label: "Sliding Window"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Sliding Window

A sliding window is a group of neighboring values. Move its ends while keeping useful information, such as the sum or letter counts. Learn [two pointers](../two-pointers/README.md) and [hashing](../hashing/README.md) first. A linear window algorithm requires both forward-only boundaries and cheap state updates.

<AlgorithmWalkthrough name="slidingWindow" />

## Learning steps

To find the warmest three-day period, move a three-day window: remove yesterday’s outgoing value and add the new day.

1. Keep a running sum for a window of fixed length.
2. Use counts to maintain the longest range without repeats.
3. Try a shortest-sum window only after checking its nonnegative-input rule.

## Choose the window rule

| Variant | Maintained state | When to record the answer |
| --- | --- | --- |
| Fixed size k | Exactly k consecutive elements | After the incoming and outgoing elements update the window. |
| Longest valid range | A range satisfying an upper bound, such as no repeated characters | After shrinking until valid. |
| Shortest sufficient range | A range meeting a lower bound, such as a nonnegative sum reaching a target | While valid, before each left-boundary removal. |

Contiguity alone is insufficient. For sum-based variable windows, negative values can invalidate the rule for discarding a left endpoint. Use the [pattern comparison](../patterns.md#contiguous-ranges-window-prefix-sum-or-kadane) and [prefix sums](../prefix-sum/README.md) when the required monotonicity is absent.

## Fixed window: maximum sum of k elements

Contract: k is an integer from 1 through the array length. Invalid k throws. Values may be negative; assume all sums fit safely in a JavaScript Number. The function does not modify the input.

**Invariant:** the running sum equals the last k processed elements. Initialize from a real window so an all-negative array cannot incorrectly return zero.

```js runnable
function maxSumK(values, k) {
  if (!Number.isInteger(k) || k < 1 || k > values.length) {
    throw new RangeError('k must be between 1 and the array length');
  }
  let sum = 0;
  for (let i = 0; i < k; i++) sum += values[i];
  let best = sum;
  for (let right = k; right < values.length; right++) {
    sum += values[right] - values[right - k];
    best = Math.max(best, sum);
  }
  return best;
}

console.log(maxSumK([2, 1, 5, 1, 3, 2], 3));
console.log(maxSumK([-5, -2, -3], 2));
console.log(maxSumK([4], 1));
```

```text output
9
-5
4
```

## Longest valid window: no repeated characters

Store the last index of each character. If it lies inside the current window, advance left to the following index. Never move left backward. This example treats characters as UTF-16 code units, suitable for ASCII practice inputs; user-perceived Unicode characters require a deliberate segmentation strategy.

```js runnable
function lengthOfLongestSubstring(text) {
  const lastSeen = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < text.length; right++) {
    if (lastSeen.has(text[right])) {
      left = Math.max(left, lastSeen.get(text[right]) + 1);
    }
    lastSeen.set(text[right], right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

console.log(lengthOfLongestSubstring('abba'));
console.log(lengthOfLongestSubstring('abcabcbb'));
console.log(lengthOfLongestSubstring(''));
```

```text output
2
3
0
```

For `abba`, the second `b` moves left to index 2. The final `a` was last seen at index 0, outside the current window; `Math.max` prevents reopening an invalid range.

## Shortest sufficient window: reach a target sum

Contract: target is positive and every input value is nonnegative. Return 0 if no nonempty range qualifies. Assume sums remain safe integers. Unlike longest-valid windows, record each qualifying answer **before** shrinking.

```js runnable
function minLengthAtLeast(values, target) {
  let left = 0;
  let sum = 0;
  let best = Infinity;
  for (let right = 0; right < values.length; right++) {
    sum += values[right];
    while (sum >= target) {
      best = Math.min(best, right - left + 1);
      sum -= values[left++];
    }
  }
  return best === Infinity ? 0 : best;
}

console.log(minLengthAtLeast([2, 3, 1, 2, 4, 3], 7));
console.log(minLengthAtLeast([0, 0, 7], 7));
console.log(minLengthAtLeast([1, 2], 8));
console.log(minLengthAtLeast([], 7));
```

```text output
2
1
0
0
```

### Trace of shrinking

| Current range, target 7 | Sum | Action |
| --- | --- | --- |
| [2, 3, 1, 2] | 8 | Record length 4; remove 2. |
| [3, 1, 2] | 6 | Stop shrinking; extend right. |
| [3, 1, 2, 4] | 10 | Record length 4; remove 3. |
| [1, 2, 4] | 7 | Record length 3; remove 1. |
| [2, 4, 3] after the next extension | 9 | Record length 3; remove 2. |
| [4, 3] | 7 | Record length 2; remove 4. |

Each endpoint advances at most n times, even though the code contains a nested loop.

## Complexity and boundaries

| Template | Time | Extra space |
| --- | --- | --- |
| Fixed-size sum | O(n) | O(1) |
| Longest substring via last-seen map | Expected O(n) | O(d), distinct code units seen |
| Shortest nonnegative-sum range | O(n) | O(1) |

- A fixed sum window accepts negative values; the nonnegative threshold template does not.
- Subsequence problems can skip positions, so a contiguous window is generally the wrong state.
- Window maxima need more than an add/subtract sum: a monotonic deque supports O(n) total processing.
- [Interval merging and scheduling](../patterns.md#recognition-and-invariants) use sorting and a scan; they are separate patterns from a window over consecutive input positions.


## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| <PracticeProblem id={219} title={"Contains Duplicate II"} text={"Problem statement\nReturn true if nums has two distinct indices i and j with equal values and a distance of at most k\nbetween the indices. Return false otherwise. k is nonnegative; when k is zero, two distinct indices\ncannot satisfy the distance requirement.\nInput \u0026 expected result\nThe distance is the absolute difference between indices. Equal values outside the permitted\ndistance do not qualify, and k = 0 cannot include two distinct positions.\nEXAMPLE 1\nInput: nums = [8,1,8], k = 2\nOutput: true\nExplanation: The two 8 values occur at indices 0 and 2, whose distance is exactly the allowed\nvalue 2.\nEXAMPLE 2\nInput: nums = [3,1,3], k = 1\nOutput: false\nExplanation: The matching values are two positions apart, exceeding k.\nConstraints \u0026 guarantees\n• nums.length: 1 through 10^5 (inclusive)\n• nums[i]: -10^9 through 10^9 (inclusive)\n• k: 0 through 10^5 (inclusive)\nJavaScript starter\nfunction containsNearbyDuplicate(nums, k) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/contains-duplicate-ii/) | [Example](../hashing/LC-219-contains-duplicate-ii/index.mdx) |
| [LC 643 — Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/) | Easy | [LeetCode](https://leetcode.com/problems/maximum-average-subarray-i/) | — |
| [LC 1876 — Substrings of Size Three with Distinct Characters](https://leetcode.com/problems/substrings-of-size-three-with-distinct-characters/) | Easy | [LeetCode](https://leetcode.com/problems/substrings-of-size-three-with-distinct-characters/) | — |
| <PracticeProblem id={3} title={"Longest Substring Without Repeating Characters"} text={"Problem statement\nReturn the length of the longest contiguous substring of s that contains no repeated character. A\nsubstring cannot skip positions. Letters, digits, spaces, and punctuation all count as characters. If s\nis empty, return 0.\nInput \u0026 expected result\nA substring is contiguous, unlike a subsequence. Repeating any character makes that candidate\ninvalid, even when the duplicate is far away within it.\nEXAMPLE 1\nInput: s = \"abcaefb\"\nOutput: 5, for example the substring \"bcaef\"\nExplanation: bcaef has five distinct characters. Extending it right would repeat b, and no\nsix-character window has all distinct values.\nEXAMPLE 2\nInput: s = \"bbbb\"\nOutput: 1\nExplanation: Every substring of length two or more repeats b.\nConstraints \u0026 guarantees\n• s.length: 0 through 10^5 (inclusive)\n• Character types: English letters, decimal digits, spaces, and symbols\nJavaScript starter\nfunction lengthOfLongestSubstring(s) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | — |
| <PracticeProblem id={209} title={"Minimum Size Subarray Sum"} text={"Problem statement\nnums contains positive integers, and target is positive. Find the smallest length of a nonempty\ncontiguous segment whose sum is at least target. Return that length, or 0 if even the entire array\nhas insufficient sum. Elements of a candidate segment must occupy consecutive positions.\nInput \u0026 expected result\nReturn a length, with 0 reserved for no qualifying segment. All input values are positive, and a valid\nsegment must contain consecutive positions. The sum may exceed target rather than equal it.\nEXAMPLE 1\nInput: target = 7, nums = [2,1,5,2,3]\nOutput: 2, for example the segment [5,2]\nExplanation: The adjacent values 5 and 2 sum to 7. No individual value reaches 7, so length 2 is\nminimal.\nEXAMPLE 2\nInput: target = 10, nums = [1,2,3]\nOutput: 0\nExplanation: Even all elements together total only 6.\nConstraints \u0026 guarantees\n• target: 1 through 10^9 (inclusive)\n• nums.length: 1 through 10^5 (inclusive)\n• nums[i]: 1 through 10^4 (inclusive)\nJavaScript starter\nfunction minSubArrayLen(target, nums) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/minimum-size-subarray-sum/) | — |
| [LC 340 — Longest Substring with At Most K Distinct Characters](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/) | Medium · Premium | [LeetCode](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/) | — |
| <PracticeProblem id={424} title={"Longest Repeating Character Replacement"} text={"Problem statement\ns consists of uppercase English letters. You may replace at most k characters with any uppercase\nletters. Return the largest length of a contiguous segment that can become one repeated letter\nafter those replacements. You do not need to return the modified string.\nInput \u0026 expected result\nReturn only the best achievable length. The target repeated letter may be chosen independently\nfor a candidate window, and using fewer than k changes is permitted.\nEXAMPLE 1\nInput: s = \"ABAB\", k = 2\nOutput: 4, by changing both B characters to A\nExplanation: Changing both B characters to A makes the entire four-character string uniform.\nEXAMPLE 2\nInput: s = \"ABBA\", k = 0\nOutput: 2\nExplanation: With no replacements, the longest existing uniform segment is BB.\nConstraints \u0026 guarantees\n• s.length: 1 through 10^5 (inclusive)\n• k: 0 through s.length (inclusive)\n• Alphabet: A-Z\nJavaScript starter\nfunction characterReplacement(s, k) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/longest-repeating-character-replacement/) | — |
| <PracticeProblem id={438} title={"Find All Anagrams in a String"} text={"Problem statement\nFind every starting index in s of a contiguous substring that contains exactly the same characters,\nwith the same frequencies, as p. The character order may differ. Overlapping matches are allowed.\nInput \u0026 expected result\nReturn zero-based indices in any order. If p is longer than s, the result is empty.\nEXAMPLE 1\nInput: s = \"abab\", p = \"ab\"\nOutput: [0,1,2]\nExplanation: The three length-two windows are ab, ba, and ab.\nEXAMPLE 2\nInput: s = \"aaac\", p = \"ac\"\nOutput: [2]\nExplanation: Only the final two characters have one a and one c.\nConstraints \u0026 guarantees\n• 1 \u003c= s.length, p.length \u003c= 3 * 10^4\n• Both strings use lowercase English letters\nJavaScript starter\nfunction findAnagrams(s, p) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/find-all-anagrams-in-a-string/) | — |
| <PracticeProblem id={567} title={"Permutation in String"} text={"Problem statement\nReturn true if some contiguous substring of s2 is a rearrangement of s1. The substring must have\nexactly s1.length characters and match each character's count. Both strings contain lowercase\nEnglish letters. Return false if no such substring exists.\nInput \u0026 expected result\nThe candidate must have the same length as s1. It may rearrange letters, but may neither omit nor\nadd occurrences. A longer window containing the letters does not qualify.\nEXAMPLE 1\nInput: s1 = \"ab\", s2 = \"zzbaq\"\nOutput: true, because \"ba\" is present\nExplanation: The adjacent substring ba has exactly one a and one b, matching s1's frequencies.\nEXAMPLE 2\nInput: s1 = \"aab\", s2 = \"ab\"\nOutput: false\nExplanation: s2 is shorter and lacks the second required a.\nConstraints \u0026 guarantees\n• s1.length, s2.length: 1 through 10^4 (inclusive)\n• Both strings use a-z\nJavaScript starter\nfunction checkInclusion(s1, s2) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/permutation-in-string/) | — |
| [LC 713 — Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k/) | Medium | [LeetCode](https://leetcode.com/problems/subarray-product-less-than-k/) | — |
| <PracticeProblem id={904} title={"Fruit Into Baskets"} text={"Problem statement \u0026 expected result\nChoose a contiguous run of trees containing at most two distinct fruit types. One fruit is picked from each visited\ntree, and each basket holds only one type. Return the maximum run length; a run containing only one type is\nallowed.\nEXAMPLE 1\nInput: fruits = [1,2,1]\nOutput: 3\nExplanation: All three trees use only types 1 and 2.\nEXAMPLE 2\nInput: fruits = [0,1,2,2]\nOutput: 3\nExplanation: The final three trees have types 1 and 2.\nConstraints \u0026 guarantees\n- 1 \u003c= fruits.length \u003c= 10^5\n- 0 \u003c= fruits[i] \u003c fruits.length\nJavaScript starter\nfunction totalFruit(fruits) {\n// TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/fruit-into-baskets/) | — |
| [LC 1004 — Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii/) | Medium | [LeetCode](https://leetcode.com/problems/max-consecutive-ones-iii/) | — |
| [LC 1052 — Grumpy Bookstore Owner](https://leetcode.com/problems/grumpy-bookstore-owner/) | Medium | [LeetCode](https://leetcode.com/problems/grumpy-bookstore-owner/) | — |
| [LC 1208 — Get Equal Substrings Within Budget](https://leetcode.com/problems/get-equal-substrings-within-budget/) | Medium | [LeetCode](https://leetcode.com/problems/get-equal-substrings-within-budget/) | — |
| [LC 1343 — Number of Sub-arrays of Size K and Average Greater than or Equal to Threshold](https://leetcode.com/problems/number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold/) | Medium | [LeetCode](https://leetcode.com/problems/number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold/) | — |
| [LC 1358 — Number of Substrings Containing All Three Characters](https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/) | Medium | [LeetCode](https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/) | — |
| [LC 1456 — Maximum Number of Vowels in a Substring of Given Length](https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/) | Medium | [LeetCode](https://leetcode.com/problems/maximum-number-of-vowels-in-a-substring-of-given-length/) | — |
| [LC 1493 — Longest Subarray of 1's After Deleting One Element](https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/) | Medium | [LeetCode](https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/) | — |
| [LC 1695 — Maximum Erasure Value](https://leetcode.com/problems/maximum-erasure-value/) | Medium | [LeetCode](https://leetcode.com/problems/maximum-erasure-value/) | — |
| [LC 2461 — Maximum Sum of Distinct Subarrays With Length K](https://leetcode.com/problems/maximum-sum-of-distinct-subarrays-with-length-k/) | Medium | [LeetCode](https://leetcode.com/problems/maximum-sum-of-distinct-subarrays-with-length-k/) | — |
| <PracticeProblem id={30} title={"Substring with Concatenation of All Words"} text={"Problem statement\nEvery string in words has the same positive length. Find each starting index in s where a\ncontiguous segment is exactly a concatenation of all strings in words, used once each, in any\norder. Repeated words must be used the required number of times. Matches may overlap; return\nindices in any order.\nInput \u0026 expected result\nEach candidate window has total length equal to the number of words multiplied by their common\nlength. The word ordering is flexible, but multiplicities must match exactly.\nEXAMPLE 1\nInput: s = \"catdogcat\", words = [\"cat\",\"dog\"]\nOutput: [0,3]\nExplanation: catdog and dogcat both use the two required words once. Their starts are 0 and 3.\nEXAMPLE 2\nInput: s = \"aaaaaa\", words = [\"aa\",\"aa\"]\nOutput: [0,1,2]\nExplanation: Each length-four window contains two copies of aa, and overlapping windows are\nallowed.\nConstraints \u0026 guarantees\n• s.length: 1 through 10^4 (inclusive)\n• words.length: 1 through 5000 (inclusive)\n• words[i].length: 1 through 30 (inclusive)\n• The text and words use a-z. All words have equal length\nJavaScript starter\nfunction findSubstring(s, words) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/substring-with-concatenation-of-all-words/) | — |
| <PracticeProblem id={76} title={"Minimum Window Substring"} text={"Problem statement\nFind the shortest contiguous substring of s containing every character of t at least as many times\nas it appears in t. Extra characters may occur in the window. Matching is case-sensitive. Return the\nsubstring, or an empty string if no window qualifies. When a solution exists, the minimum answer is\nunique.\nInput \u0026 expected result\nReturn the actual minimum window, not its length or indices. Repeated characters in t impose\nrepeated requirements; containing just the distinct character set is insufficient.\nEXAMPLE 1\nInput: s = \"zzabxc\", t = \"abc\"\nOutput: \"abxc\"\nExplanation: The window abxc contains a, b, and c. Removing either end would lose a required\ncharacter.\nEXAMPLE 2\nInput: s = \"abc\", t = \"aa\"\nOutput: \"\"\nExplanation: s contains only one a, so the required multiplicity cannot be met.\nConstraints \u0026 guarantees\n• m == s.length\n• n == t.length\n• m, n: 1 through 10^5 (inclusive)\n• Both strings use A-Z and a-z. The minimum answer is unique when one exists\nJavaScript starter\nfunction minWindow(s, t) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/minimum-window-substring/) | — |
| <PracticeProblem id={239} title={"Sliding Window Maximum"} text={"Problem statement\nA window of k consecutive elements moves through nums one position at a time, from left to right.\nReturn the maximum value in each window, in that same order. k is between 1 and nums.length.\nThere are nums.length - k + 1 answers.\nInput \u0026 expected result\nThe output contains one maximum per complete window. Return the values rather than their\nlocations. Moving the window removes its oldest element and introduces the next one.\nEXAMPLE 1\nInput: nums = [4,2,5,1,3], k = 3\nOutput: [5,5,5]\nExplanation: The windows [4,2,5], [2,5,1], and [5,1,3] each have maximum 5.\nEXAMPLE 2\nInput: nums = [2,-1,4], k = 1\nOutput: [2,-1,4]\nExplanation: Every window contains one element, so each maximum is that element itself.\nConstraints \u0026 guarantees\n• nums.length: 1 through 10^5 (inclusive)\n• nums[i]: -10^4 through 10^4 (inclusive)\n• k: 1 through nums.length (inclusive)\nJavaScript starter\nfunction maxSlidingWindow(nums, k) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/sliding-window-maximum/) | — |
| [LC 992 — Subarrays with K Different Integers](https://leetcode.com/problems/subarrays-with-k-different-integers/) | Hard | [LeetCode](https://leetcode.com/problems/subarrays-with-k-different-integers/) | — |
| G37 — Minimize equalization cost for each moving window. | Exercise | Heaps and scheduling | — |
| [LC 1652 — Defuse the Bomb](https://leetcode.com/problems/defuse-the-bomb/) | Easy | [LeetCode](https://leetcode.com/problems/defuse-the-bomb/) |  |
| [LC 1984 — Minimum Difference Between Highest and Lowest of K Scores](https://leetcode.com/problems/minimum-difference-between-highest-and-lowest-of-k-scores/) | Easy | [LeetCode](https://leetcode.com/problems/minimum-difference-between-highest-and-lowest-of-k-scores/) |  |
| [LC 2269 — Find the K-Beauty of a Number](https://leetcode.com/problems/find-the-k-beauty-of-a-number/) | Easy | [LeetCode](https://leetcode.com/problems/find-the-k-beauty-of-a-number/) |  |
| [LC 2379 — Minimum Recolors to Get K Consecutive Black Blocks](https://leetcode.com/problems/minimum-recolors-to-get-k-consecutive-black-blocks/) | Easy | [LeetCode](https://leetcode.com/problems/minimum-recolors-to-get-k-consecutive-black-blocks/) |  |
| [CC — Fixed Window Sum (FIXWIN)](https://www.codechef.com/problems/FIXWIN) | Easy | — |  |
| [CC — Sliding Window Basic (SLIDEWIN)](https://www.codechef.com/problems/SLIDEWIN) | Easy | — |  |
| [CC — Maximum Window (MAXWIN)](https://www.codechef.com/problems/MAXWIN) | Easy | — |  |
| [LC 159 — Longest Substring with At Most Two Distinct Characters](https://leetcode.com/problems/longest-substring-with-at-most-two-distinct-characters/) | Medium | [LeetCode](https://leetcode.com/problems/longest-substring-with-at-most-two-distinct-characters/) |  |
| [LC 395 — Longest Substring with At Least K Repeating Characters](https://leetcode.com/problems/longest-substring-with-at-least-k-repeating-characters/) | Medium | [LeetCode](https://leetcode.com/problems/longest-substring-with-at-least-k-repeating-characters/) |  |
| [LC 1838 — Frequency of the Most Frequent Element](https://leetcode.com/problems/frequency-of-the-most-frequent-element/) | Medium | [LeetCode](https://leetcode.com/problems/frequency-of-the-most-frequent-element/) |  |
| [LC 2024 — Maximize the Confusion of an Exam](https://leetcode.com/problems/maximize-the-confusion-of-an-exam/) | Medium | [LeetCode](https://leetcode.com/problems/maximize-the-confusion-of-an-exam/) |  |
| [CC — Maximum Unique Subarray Window (UNQEQ)](https://www.codechef.com/problems/UNQEQ) | Medium | — |  |
| [CC — Dynamic Window (DYNWIN)](https://www.codechef.com/problems/DYNWIN) | Medium | — |  |
| [CC — Interval Merging (INTMERGE)](https://www.codechef.com/problems/INTMERGE) | Medium | — |  |
| [CC — Substring Matching (SUBMATCH)](https://www.codechef.com/problems/SUBMATCH) | Medium | — |  |
| [LC 727 — Minimum Window Subsequence](https://leetcode.com/problems/minimum-window-subsequence/) | Hard | [LeetCode](https://leetcode.com/problems/minimum-window-subsequence/) |  |
| [LC 1687 — Delivering Boxes from Storage to Ports](https://leetcode.com/problems/delivering-boxes-from-storage-to-ports/) | Hard | [LeetCode](https://leetcode.com/problems/delivering-boxes-from-storage-to-ports/) |  |
| [LC 2009 — Minimum Number of Operations to Make Array Continuous](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-continuous/) | Hard | [LeetCode](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-continuous/) |  |
| [LC 2444 — Count Subarrays With Fixed Bounds](https://leetcode.com/problems/count-subarrays-with-fixed-bounds/) | Hard | [LeetCode](https://leetcode.com/problems/count-subarrays-with-fixed-bounds/) |  |
| [CC — Advanced Sliding Window (ADVSLIDE)](https://www.codechef.com/problems/ADVSLIDE) | Hard | — |  |
| [CC — Complex Window Operations (COMPLEXWIN)](https://www.codechef.com/problems/COMPLEXWIN) | Hard | — |  |
| [CC — Sliding Window Maximum (SLIDEMAX)](https://www.codechef.com/problems/SLIDEMAX) | Hard | — |  |

{/* END GENERATED PRACTICE PROBLEMS */}

## Related Topics

- [Two Pointers](../two-pointers/README.md) — sliding window is two pointers with a constraint
- [Hashing](../hashing/README.md) — frequency maps used inside windows
- [Prefix Sum](../prefix-sum/README.md)

[← Back to Home](../index.md) · © sparshjaswal

**Next:** [prefix sums](../prefix-sum/README.md).
