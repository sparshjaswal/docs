---
id: dsa-two-pointers-readme
title: "👈👉 Two Pointers"
slug: /DSA/two-pointers/README
sidebar_label: "Two Pointers"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# 👈👉 Two Pointers

Keep two positions in the input and move one at a time. Before moving a position, explain why the choices you skip cannot contain a better answer.

---

<AlgorithmWalkthrough name="twoPointers" />

## Learning steps

Choose two sorted book prices that total a budget. Comparing the cheapest and most expensive remaining prices tells you which end can move.

1. Trace the pair-sum example and justify each discarded endpoint.
2. Use separate read and write positions to move zeroes.
3. Compare array indices with the slow and fast node references in a list.

## Concept

A **pointer** here usually means an index: a number naming a position. Keep two of them and give each a job.

- **From opposite ends:** move left and right toward each other, as in sorted pair sums or palindrome checks.
- **From the same end:** one position reads input while another writes accepted values, or two positions track progress through sequences.
- **Through nodes:** slow and fast references follow links at different speeds to detect a cycle.

**Prerequisite:** each movement needs a reason that the discarded choices cannot improve the answer. Sorted order supplies that reason for pair-sum search; palindrome comparisons and container-height problems use different arguments and must not be sorted arbitrarily.

| Variant | State and invariant | Input requirement |
| --- | --- | --- |
| Pair sum | All possible pairs not yet eliminated lie between left and right. | Ascending values; retain original indices separately if sorting first. |
| Read/write compaction | The written prefix contains the accepted values in their original order. | Input may be modified; sorting is not required for moving zeroes. |
| Subsequence matching | The matched prefix is the earliest one achievable in the consumed target prefix. | Input order must be preserved. |
| Cycle detection | Slow and fast follow the same next pointers at different speeds. | Compare node identity, not node values. |

See [pattern selection](../patterns.md) for the difference between a pair search and a contiguous sliding window.

---

## Diagram


```
Sorted: [1, 2, 3, 4, 6]  target=6
         L              R
Step 1: 1+6=7 > 6 → R--
Step 2: 1+4=5 < 6 → L++
Step 3: 2+4=6 ✓
```

---

## Time & Space Complexity

| Variant                         | Time   | Space |
| ------------------------------- | ------ | ----- |
| Two Sum Sorted                  | O(n)   | O(1)  |
| Remove duplicates / Move Zeroes | O(n)   | O(1)  |
| Merge into an array with spare trailing capacity | O(m+n) | O(1) extra |
| Is Subsequence                  | O(n)   | O(1)  |
| Trapping Rain Water             | O(n)   | O(1)  |

---

## Common Patterns

### Pattern 1 — Opposite Direction (Two Sum Sorted)

For a sorted array, return two distinct zero-based indices, or an empty array if there is no pair. If the endpoint sum is too small, every pair using the current left value and an earlier right index is also too small; discard left. The symmetric argument discards right when the sum is too large. Assume sums remain within safe numeric bounds.

```js runnable
function twoSumSorted(arr, target) {
  let left = 0,
    right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [];
}

console.log(JSON.stringify(twoSumSorted([1, 2, 3, 4, 6], 6)));
console.log(JSON.stringify(twoSumSorted([2, 2], 4)));
console.log(JSON.stringify(twoSumSorted([2], 4)));
console.log(JSON.stringify(twoSumSorted([], 4)));
```

```text output
[1,3]
[0,1]
[]
[]
```

### Pattern 2 — Same Direction (Move Zeroes)

```javascript
function moveZeroes(nums) {
  let insertPos = 0;
  for (let i = 0; i < nums.length; i++) if (nums[i] !== 0) nums[insertPos++] = nums[i];
  while (insertPos < nums.length) nums[insertPos++] = 0;
}
```

### Pattern 3 — Fast/Slow (Is Subsequence)

```javascript
function isSubsequence(s, t) {
  let i = 0,
    j = 0;
  while (i < s.length && j < t.length) {
    if (s[i] === t[j]) i++;
    j++;
  }
  return i === s.length;
}
```

### Pattern 4 — Fast/Slow (Cycle Detection in Linked List)

```javascript
function hasCycle(head) {
  let slow = head,
    fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
```

---

## When to Use

- Sorted arrays where you need to find pairs or triplets
- Problems requiring partitioning or rearranging elements
- Optimising brute-force O(n²) solutions to O(n)
- Palindrome checking in arrays/strings
- Cycle detection in linked lists (fast/slow variant)

---

## Pitfalls

- Applying sorted pair-sum elimination to unsorted input, or sorting a problem where original order matters
- Moving both pointers simultaneously instead of one at a time
- Off-by-one: use `left < right` not `left <= right` for converging pointers

---

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| <PracticeProblem id={26} title={"Remove Duplicates from Sorted Array"} text={"Problem statement\nGiven an integer array nums sorted in ascending order, remove repeated values in place so that\neach distinct value appears exactly once. Preserve the original sorted order. Return the number k\nof distinct values; nums[0] through nums[k - 1] must contain the result. Anything after that prefix\nis ignored. Use constant extra space.\nInput \u0026 expected result\nInput: a sorted array, so every group of equal values is consecutive. Expected result: k and a sorted\nprefix of k unique values. Keep one representative of each value, even when a group is very long.\nEXAMPLE 1\nInput: nums = [0,0,2,2,2,5]\nOutput: 3; updated prefix: [0,2,5]\nExplanation: The three distinct values are 0, 2, and 5. Their frequencies do not affect how many\nrepresentatives remain.\nEXAMPLE 2\nInput: nums = [4,4,4]\nOutput: 1; updated prefix: [4]\nExplanation: All three entries represent the same distinct value.\nConstraints \u0026 guarantees\n• nums.length: 1 through 3 * 10^4 (inclusive)\n• nums[i]: -100 through 100 (inclusive)\n• Order: nondecreasing\nJavaScript starter\nfunction removeDuplicates(nums) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/remove-duplicates-from-sorted-array/) | — |
| <PracticeProblem id={27} title={"Remove Element"} text={"Problem statement\nRemove every occurrence of val from the integer array nums in place. Return the number k of\nremaining elements, and put those elements in the first k positions of nums. Their order does not\nmatter, and positions after k are ignored. Use constant additional space; do not create a\nreplacement array.\nInput \u0026 expected result\nInputs: nums is mutable and val is the value to discard. Expected result: an integer k plus an\nupdated first k positions. The judge checks that prefix, not the discarded suffix or array length.\nEXAMPLE 1\nInput: nums = [4,1,4,2], val = 4\nOutput: 2; one valid updated prefix is [1,2]\nExplanation: Two occurrences of 4 are removed. The retained values 1 and 2 occupy the first\ntwo positions; their order could also be reversed.\nEXAMPLE 2\nInput: nums = [7,7], val = 7\nOutput: 0\nExplanation: Every element is removed. There is no required retained prefix, so the array's\nremaining contents are irrelevant.\nConstraints \u0026 guarantees\n• nums.length: 0 through 100 (inclusive)\n• nums[i]: 0 through 50 (inclusive)\n• val: 0 through 100 (inclusive)\nJavaScript starter\nfunction removeElement(nums, val) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/remove-element/) | — |
| <PracticeProblem id={125} title={"Valid Palindrome"} text={"Problem statement\nDetermine whether s reads the same in both directions after removing every character that is not\nan ASCII letter or digit and treating uppercase and lowercase letters as equal. Return a boolean. If\nno letters or digits remain, the result is a palindrome.\nInput \u0026 expected result\nRetain only ASCII letters and digits for the comparison. Punctuation is ignored rather than treated\nas a separator that must match. Case differences also disappear.\nEXAMPLE 1\nInput: s = \"No lemon, no melon!\"\nOutput: true\nExplanation: Removing spaces and punctuation and ignoring case gives nolemonnomelon,\nwhich is identical in reverse.\nEXAMPLE 2\nInput: s = \"...\"\nOutput: true\nExplanation: Removing punctuation leaves an empty sequence, which is palindromic.\nConstraints \u0026 guarantees\n• s.length: 1 through 2 * 10^5 (inclusive)\n• Character set: printable ASCII\nJavaScript starter\nfunction isPalindrome(s) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/valid-palindrome/) | [Example](../school-basics/LC-125-valid-palindrome/index.mdx) |
| <PracticeProblem id={283} title={"Move Zeroes"} text={"Problem statement\nMove every zero in nums to its end while retaining the original relative order of all nonzero\nelements. Perform the changes in the same array without copying it into another array.\nInput \u0026 expected result\nThe result is the mutated nums array, with the same length and values.\nEXAMPLE 1\nInput: nums = [0,4,0,-2,7]\nAfter the call: nums = [4,-2,7,0,0]\nExplanation: The nonzero sequence 4, -2, 7 remains in order.\nEXAMPLE 2\nInput: nums = [0]\nAfter the call: nums = [0]\nExplanation: The only value is already at the end.\nConstraints \u0026 guarantees\n• 1 \u003c= nums.length \u003c= 10^4\n• -2^31 \u003c= nums[i] \u003c= 2^31 - 1\nJavaScript starter\nfunction moveZeroes(nums) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/move-zeroes/) | [Example](./LC-283-move-zeroes/index.mdx) |
| [LC 344 — Reverse String](https://leetcode.com/problems/reverse-string/) | Easy | [LeetCode](https://leetcode.com/problems/reverse-string/) | — |
| <PracticeProblem id={392} title={"Is Subsequence"} text={"Problem statement\nDetermine whether s is a subsequence of t. You may delete any number of characters from t,\nincluding none, but may not rearrange the remaining characters. Return true exactly when the\nremaining sequence can equal s. An empty s is a subsequence of every t.\nInput \u0026 expected result\nThe return value is a boolean. Characters can be skipped in t but cannot be reordered. Repeated\ncharacters in s require enough separate matching positions in t.\nEXAMPLE 1\nInput: s = \"ace\", t = \"abcde\"\nOutput: true\nExplanation: The letters a, c, and e appear in t at indices 0, 2, and 4, preserving their order.\nEXAMPLE 2\nInput: s = \"ca\", t = \"abc\"\nOutput: false\nExplanation: c occurs after a, so the requested order cannot be formed.\nConstraints \u0026 guarantees\n• s.length: 0 through 100 (inclusive)\n• t.length: 0 through 10^4 (inclusive)\n• Both strings use a-z\nJavaScript starter\nfunction isSubsequence(s, t) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/is-subsequence/) | [Example](./LC-392-is-subsequence/index.mdx) |
| <PracticeProblem id={844} title={"Backspace String Compare"} text={"Problem statement\nInterpret each string as keystrokes in an initially empty editor. A lowercase letter appends itself; #\ndeletes the most recent remaining character, if any. Return whether the two final texts are equal.\nInput \u0026 expected result\nDeleting from empty text has no effect. Follow-up: use O(n + m) time and O(1) extra space.\nEXAMPLE 1\nInput: s = \"ab##c\", t = \"#c\"\nOutput: true\nExplanation: Both editors finish with c.\nEXAMPLE 2\nInput: s = \"a#b\", t = \"a\"\nOutput: false\nExplanation: The first editor finishes with b and the second with a.\nConstraints \u0026 guarantees\n• 1 \u003c= s.length, t.length \u003c= 200\n• The strings use lowercase letters and #\nJavaScript starter\nfunction backspaceCompare(s, t) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/backspace-string-compare/) | — |
| <PracticeProblem id={977} title={"Squares of a Sorted Array"} text={"Problem statement\nSquare every element in the nondecreasing array nums and return the squared values in\nnondecreasing order. Negative inputs can produce larger squares than later positive values.\nInput \u0026 expected result\nReturn a new sorted array. Follow-up: achieve O(n) time.\nEXAMPLE 1\nInput: nums = [-5,-2,0,3]\nOutput: [0,4,9,25]\nExplanation: The squares are reordered from smallest to largest.\nEXAMPLE 2\nInput: nums = [-3,-3]\nOutput: [9,9]\nExplanation: Both occurrences remain after squaring.\nConstraints \u0026 guarantees\n• 1 \u003c= nums.length \u003c= 10^4\n• -10^4 \u003c= nums[i] \u003c= 10^4\n• nums is nondecreasing\nJavaScript starter\nfunction sortedSquares(nums) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/squares-of-a-sorted-array/) | — |
| <PracticeProblem id={11} title={"Container With Most Water"} text={"Problem statement\nEach height[i] describes a vertical line at horizontal coordinate i. Choose two lines and use the\nhorizontal axis as the bottom of a container. Its capacity is the horizontal distance between the\nlines multiplied by the shorter line's height. Return the largest capacity possible. Lines cannot be\ntilted.\nInput \u0026 expected result\nReturn the maximum area as a number. Only the two selected lines bound the container; interior\nlines do not reduce the held area. Width is the difference between their indices.\nEXAMPLE 1\nInput: height = [2,5,4,3]\nOutput: 6, using indices 1 and 3\nExplanation: Indices 1 and 3 are two units apart, and the shorter height is 3, producing area 6.\nEXAMPLE 2\nInput: height = [5,5]\nOutput: 5\nExplanation: The only pair has width 1 and usable height 5.\nConstraints \u0026 guarantees\n• n == height.length\n• n: 2 through 10^5 (inclusive)\n• height[i]: 0 through 10^4 (inclusive)\nJavaScript starter\nfunction maxArea(height) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/container-with-most-water/) | — |
| <PracticeProblem id={15} title={"3Sum"} text={"Problem statement\nReturn every distinct triple of values drawn from three different indices of nums whose sum is zero.\nTwo triples containing the same values count as the same answer even if they use different\nindices. The order of triples and the order of values inside each triple do not matter.\nInput \u0026 expected result\nReturn values rather than index triples. Repeated values may appear within an answer if there are\nenough separate occurrences in nums. Repeated equivalent answers must be removed.\nEXAMPLE 1\nInput: nums = [-2,0,1,1,2]\nOutput: [[-2,0,2],[-2,1,1]]\nExplanation: There is one triple using -2, 0, and 2, and another using -2 and the two separate\ncopies of 1.\nEXAMPLE 2\nInput: nums = [0,0,0,0]\nOutput: [[0,0,0]]\nExplanation: Several index choices exist, but they all represent the same value triple.\nConstraints \u0026 guarantees\n• nums.length: 3 through 3000 (inclusive)\n• nums[i]: -10^5 through 10^5 (inclusive)\nJavaScript starter\nfunction threeSum(nums) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/3sum/) | — |
| <PracticeProblem id={16} title={"3Sum Closest"} text={"Problem statement\nChoose three elements at different indices in nums whose sum has the smallest absolute\ndifference from target. Return that sum. Repeated values may be used when they occupy different\nindices; the best sum is guaranteed to be unique.\nInput \u0026 expected result\nReturn one number, not the three indices or the distance from target.\nEXAMPLE 1\nInput: nums = [1,4,7,10], target = 13\nOutput: 12\nExplanation: The sum 1 + 4 + 7 is one away from 13; every other triple is farther away.\nEXAMPLE 2\nInput: nums = [-3,-1,2,5], target = 1\nOutput: 1\nExplanation: The triple -3, -1, 5 reaches the target exactly.\nConstraints \u0026 guarantees\n• 3 \u003c= nums.length \u003c= 500\n• -1000 \u003c= nums[i] \u003c= 1000\n• -10^4 \u003c= target \u003c= 10^4\nJavaScript starter\nfunction threeSumClosest(nums, target) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/3sum-closest/) | — |
| <PracticeProblem id={18} title={"4Sum"} text={"Problem statement \u0026 expected result\nFind every distinct combination of four values whose sum equals target. Each combination must use four different\narray positions. Repeated input values are allowed, but duplicate value combinations must appear only once.\nReturn the combinations in any order.\nEXAMPLE 1\nInput: nums = [1,0,-1,0,-2,2], target = 0\nOutput: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]\nExplanation: These are the three distinct value quadruplets summing to zero.\nEXAMPLE 2\nInput: nums = [2,2,2,2,2], target = 8\nOutput: [[2,2,2,2]]\nExplanation: Only the four-value combination [2,2,2,2] is distinct.\nConstraints \u0026 guarantees\n- 1 \u003c= nums.length \u003c= 200\n- -10^9 \u003c= nums[i] \u003c= 10^9\n- -10^9 \u003c= target \u003c= 10^9\nJavaScript starter\nfunction fourSum(nums, target) {\n// TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/4sum/) | — |
| <PracticeProblem id={31} title={"Next Permutation"} text={"Problem statement\nRearrange nums into the next larger lexicographic permutation: compare arrays at their first\ndiffering position. If nums already represents the largest ordering, wrap around to the smallest\nordering. Modify the existing array using constant extra space.\nInput \u0026 expected result\nThe result is the updated nums array; no replacement array is returned.\nEXAMPLE 1\nInput: nums = [1,4,3]\nAfter the call: nums = [3,1,4]\nExplanation: No ordering beginning with 1 comes after [1,4,3], so the next one begins with 3.\nEXAMPLE 2\nInput: nums = [4,2,2]\nAfter the call: nums = [2,2,4]\nExplanation: The input is the largest ordering of these values, so it wraps around.\nConstraints \u0026 guarantees\n• 1 \u003c= nums.length \u003c= 100\n• 0 \u003c= nums[i] \u003c= 100\nJavaScript starter\nfunction nextPermutation(nums) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/next-permutation/) | — |
| <PracticeProblem id={80} title={"Remove Duplicates from Sorted Array II"} text={"Problem statement\nModify the sorted integer array nums in place so that no value appears more than twice. Keep the\nretained values in their original order. Return the length k of the valid prefix, which must occupy\nthe first k positions of nums. Values beyond that prefix do not matter. Use O(1) extra space.\nInput \u0026 expected result\nExpected result: the count and valid prefix after limiting each distinct value to two occurrences. Do\nnot delete an entire duplicated group. The input's order is already sorted and must stay sorted in\nthe retained prefix.\nEXAMPLE 1\nInput: nums = [1,1,1,2,3,3,3]\nOutput: 5; updated prefix: [1,1,2,3,3]\nExplanation: Three copies of 1 become two, the single 2 remains, and three copies of 3 become\ntwo. The five retained values preserve their order.\nEXAMPLE 2\nInput: nums = [0,0,0,0]\nOutput: 2; updated prefix: [0,0]\nExplanation: Two copies are allowed, regardless of how many additional copies appeared.\nConstraints \u0026 guarantees\n• nums.length: 1 through 3 * 10^4 (inclusive)\n• nums[i]: -10^4 through 10^4 (inclusive)\n• Order: nondecreasing\nJavaScript starter\nfunction removeDuplicates(nums) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/) | — |
| <PracticeProblem id={151} title={"Reverse Words in a String"} text={"Problem statement\nReverse the order of words in s. Words are sequences of non-space characters separated by one or\nmore spaces. Return a string with exactly one space between adjacent words and no leading or\ntrailing spaces. Preserve the character order inside every word.\nInput \u0026 expected result\nThe output changes word order and normalizes spacing. It does not reverse the characters of\nindividual words. Do not preserve leading, trailing, or repeated separating spaces.\nEXAMPLE 1\nInput: s = \" code every day \"\nOutput: \"day every code\"\nExplanation: The original words are code, every, and day. Reversing those three units produces\nthe shown string with single spaces.\nEXAMPLE 2\nInput: s = \" hello \"\nOutput: \"hello\"\nExplanation: A single word stays in place, but surrounding spaces disappear.\nConstraints \u0026 guarantees\n• s.length: 1 through 10^4 (inclusive)\n• Alphabet: A-Z, a-z, decimal digits, and spaces. At least one word is present\nJavaScript starter\nfunction reverseWords(s) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/reverse-words-in-a-string/) | — |
| <PracticeProblem id={167} title={"Two Sum II - Input Array Is Sorted"} text={"Problem statement\nnumbers is sorted in ascending order. Find two different positions whose values add to target and\nreturn their one-based indices in increasing order. Exactly one valid pair exists. You cannot reuse\none element, and your solution must use constant extra space.\nInput \u0026 expected result\nAlthough JavaScript arrays are indexed from zero, the required answer uses positions starting at\none. The two returned indices must refer to separate elements and be ordered increasingly.\nEXAMPLE 1\nInput: numbers = [1,3,4,8], target = 11\nOutput: [2,4]\nExplanation: The values 3 and 8 occupy one-based positions 2 and 4 and sum to 11.\nEXAMPLE 2\nInput: numbers = [2,2,5], target = 4\nOutput: [1,2]\nExplanation: Equal values are allowed when they come from two different positions.\nConstraints \u0026 guarantees\n• numbers.length: 2 through 3 * 10^4 (inclusive)\n• numbers[i]: -1000 through 1000 (inclusive)\n• target: -1000 through 1000 (inclusive)\n• Order: nondecreasing. Exactly one index pair satisfies the sum\nJavaScript starter\nfunction twoSum(numbers, target) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) | [Example](../hashing/LC-167-two-sum-ii-input-array-is-sorted/index.mdx) |
| <PracticeProblem id={189} title={"Rotate Array"} text={"Problem statement\nRotate the elements of nums to the right by k positions, where k is a nonnegative integer.\nElements that pass the last position wrap around to the beginning. Change nums itself. k may\nexceed the array length, and the array is nonempty. Find a method using constant extra space.\nInput \u0026 expected result\nThe rotation changes positions but preserves every value and occurrence. Moving right by the full\narray length restores the original order. k = 0 also leaves the input unchanged; do not return a\nreplacement array.\nEXAMPLE 1\nInput: nums = [1,2,3,4,5], k = 2\nAfter the call: nums = [4,5,1,2,3]\nExplanation: The final two elements 4 and 5 wrap to the front, and the first three elements shift\nright.\nEXAMPLE 2\nInput: nums = [2,4,6], k = 4\nAfter the call: [6,2,4]\nExplanation: Three rotations restore the array; the fourth makes one additional right rotation.\nConstraints \u0026 guarantees\n• nums.length: 1 through 10^5 (inclusive)\n• nums[i]: -2^31 through 2^31 - 1 (inclusive)\n• k: 0 through 10^5 (inclusive)\nJavaScript starter\nfunction rotate(nums, k) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/rotate-array/) | — |
| <PracticeProblem id={287} title={"Find the Duplicate Number"} text={"Problem statement\nnums contains n + 1 integers, each between 1 and n. Exactly one distinct value appears more than\nonce; it may appear more than twice. Return that repeated value. Do not alter nums, and use\nconstant extra space. Seek a solution with linear running time.\nInput \u0026 expected result\nThe input's range restriction concerns values, not indices: there are n + 1 entries but only n\nallowed values. Return the duplicate value regardless of its occurrence count. Sorting or marking\nthe original array would violate the no-modification rule.\nEXAMPLE 1\nInput: nums = [2,5,1,4,3,4]\nOutput: 4\nExplanation: The value 4 appears twice, whereas the other listed values appear once, so 4 is the\nrequired result.\nEXAMPLE 2\nInput: nums = [3,3,3,3]\nOutput: 3\nExplanation: Here n = 3. One distinct value repeats more than twice, which the problem\npermits.\nConstraints \u0026 guarantees\n• n: 1 through 10^5 (inclusive)\n• nums.length == n + 1\n• nums[i]: 1 through n (inclusive)\n• Exactly one distinct value repeats\n• it may occur more than twice. All other values occur once\nJavaScript starter\nfunction findDuplicate(nums) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/find-the-duplicate-number/) | — |
| [LC 443 — String Compression](https://leetcode.com/problems/string-compression/) | Medium | [LeetCode](https://leetcode.com/problems/string-compression/) | — |
| [LC 986 — Interval List Intersections](https://leetcode.com/problems/interval-list-intersections/) | Medium | [LeetCode](https://leetcode.com/problems/interval-list-intersections/) | — |
| [LC 2149 — Rearrange Array Elements by Sign](https://leetcode.com/problems/rearrange-array-elements-by-sign/) | Medium | [LeetCode](https://leetcode.com/problems/rearrange-array-elements-by-sign/) | — |
| <PracticeProblem id={42} title={"Trapping Rain Water"} text={"Problem statement\nheight describes vertical bars of unit width, with nonnegative integer heights. Rainwater may\ncollect in spaces bounded by taller bars to the left and right. Return the total number of unit\nsquares of water retained after rain. Bars occupy space themselves, and water outside the outer\nboundaries drains away.\nInput \u0026 expected result\nReturn a water volume measured in unit-width cells. Water above a position is limited by barriers\non both sides. Empty space above an outermost bar cannot retain water without another boundary.\nEXAMPLE 1\nInput: height = [3,0,2,0,4]\nOutput: 7\nExplanation: The three interior positions retain 3, 1, and 3 units respectively. Their sum is 7.\nEXAMPLE 2\nInput: height = [0,1,2,3]\nOutput: 0\nExplanation: The rising profile never encloses a depression between two boundaries.\nConstraints \u0026 guarantees\n• n == height.length\n• n: 1 through 2 * 10^4 (inclusive)\n• height[i]: 0 through 10^5 (inclusive)\nJavaScript starter\nfunction trap(height) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/trapping-rain-water/) | — |
| [LC 345 — Reverse Vowels of a String](https://leetcode.com/problems/reverse-vowels-of-a-string) | Easy | [LeetCode](https://leetcode.com/problems/reverse-vowels-of-a-string) |  |
| [LC 922 — Sort Array By Parity II](https://leetcode.com/problems/sort-array-by-parity-ii/) | Easy | [LeetCode](https://leetcode.com/problems/sort-array-by-parity-ii/) |  |
| [LC 1089 — Duplicate Zeros](https://leetcode.com/problems/duplicate-zeros/) | Easy | [LeetCode](https://leetcode.com/problems/duplicate-zeros/) |  |
| [LC 1768 — Merge Strings Alternately](https://leetcode.com/problems/merge-strings-alternately/) | Easy | [LeetCode](https://leetcode.com/problems/merge-strings-alternately/) |  |
| [CC — String Rotation (ROTSTRNG)](https://www.codechef.com/problems/ROTSTRNG) | Easy | — |  |
| [CC — Palindrome Check (PALCHECK)](https://www.codechef.com/problems/PALCHECK) | Easy | — |  |
| [CC — Array Partition (ARRPART)](https://www.codechef.com/problems/ARRPART) | Easy | — |  |
| [CC — Two Sum Sorted (TWOSUMSOR)](https://www.codechef.com/problems/TWOSUMSOR) | Easy | — |  |
| [LC 259 — 3Sum Smaller](https://leetcode.com/problems/3sum-smaller/) | Medium | [LeetCode](https://leetcode.com/problems/3sum-smaller/) |  |
| [LC 1040 — Moving Stones Until Consecutive II](https://leetcode.com/problems/moving-stones-until-consecutive-ii/) | Medium | [LeetCode](https://leetcode.com/problems/moving-stones-until-consecutive-ii/) |  |
| [LC 1498 — Number of Subsequences That Satisfy the Given Sum Condition](https://leetcode.com/problems/number-of-subsequences-that-satisfy-the-given-sum-condition/) | Medium | [LeetCode](https://leetcode.com/problems/number-of-subsequences-that-satisfy-the-given-sum-condition/) |  |
| [LC 1750 — Minimum Length of String After Deleting Similar Ends](https://leetcode.com/problems/minimum-length-of-string-after-deleting-similar-ends/) | Medium | [LeetCode](https://leetcode.com/problems/minimum-length-of-string-after-deleting-similar-ends/) |  |
| [CC — Make Palindrome 2 (MAKEPAL2)](https://www.codechef.com/problems/MAKEPAL2) | Medium | — |  |
| [CC — Subarray with Given Sum (SUBSUM2)](https://www.codechef.com/problems/SUBSUM2) | Medium | — |  |
| [CC — Container Water (CONTWATER)](https://www.codechef.com/problems/CONTWATER) | Medium | — | — |
| [CC — Two Pointer Technique (TWOPTR)](https://www.codechef.com/problems/TWOPTR) | Medium | — |  |
| [LC 923 — 3Sum With Multiplicity](https://leetcode.com/problems/3sum-with-multiplicity/) | Hard | [LeetCode](https://leetcode.com/problems/3sum-with-multiplicity/) |  |
| [LC 1970 — Last Day Where You Can Still Cross](https://leetcode.com/problems/last-day-where-you-can-still-cross/) | Hard | [LeetCode](https://leetcode.com/problems/last-day-where-you-can-still-cross/) |  |
| [LC 2040 — Kth Smallest Product of Two Sorted Arrays](https://leetcode.com/problems/kth-smallest-product-of-two-sorted-arrays/) | Hard | [LeetCode](https://leetcode.com/problems/kth-smallest-product-of-two-sorted-arrays/) |  |
| [CC — Advanced Two Pointers (ADVTWOPTR)](https://www.codechef.com/problems/ADVTWOPTR) | Hard | — |  |
| [CC — Rain Water Trapping (RAINWATER)](https://www.codechef.com/problems/RAINWATER) | Hard | — |  |

{/* END GENERATED PRACTICE PROBLEMS */}

## Related Topics

- [Sliding Window](../sliding-window/README.md) — same-direction two pointers with a window constraint
- [Binary Search](../binary-search/README.md) — both reduce search space
- [Sorting](../sorting/README.md) — prerequisite for opposite-direction
- [Linked List](../linked-list/README.md) — fast/slow pointer variant

[← Back to Home](../index.md) · © sparshjaswal

**Next:** [sliding windows](../sliding-window/README.md).
