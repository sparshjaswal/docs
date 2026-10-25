---
id: dsa-sorting-readme
title: "🔃 Sorting"
slug: /DSA/sorting/README
sidebar_label: "Sorting"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# 🔃 Sorting

Sorting puts values in order. For example, `[3, 1, 2]` becomes `[1, 2, 3]`. Ordered values make it easier to find neighbors, merge overlaps, scan with two pointers, or use binary search.

**Prerequisites:** arrays, indexes, loops, and functions. First learn the numeric comparator and one simple algorithm such as insertion sort. Study [recursion](../recursion/README.md) before implementing merge sort or quicksort, and [heaps](../heap/README.md) before heapsort. Then learn counting sort and radix sort when integer-key constraints make them useful. You can begin sorting practice before learning every sorting algorithm.

---


<AlgorithmWalkthrough name="bubbleSort" />

## Learning steps

Sorting a class score sheet can make the lowest score easy to find. The comparison rule decides whether you order scores, names, or several fields.

1. Write a numeric comparator and trace insertion sort.
2. After recursion, compare merge sort and quicksort.
3. Use counting or radix sort only when the key range and digit rules fit.

## Compare sorting methods

Sorting puts values into a chosen order. For example, sorting `[3, 1, 2]` in ascending order gives `[1, 2, 3]`. Different algorithms reach that result in different ways.

### Complete Algorithm Comparison

| Algorithm      | Time (best) | Time (avg) | Time (worst) | Space    | Stable? | When to Use                                 |
| -------------- | ----------- | ---------- | ------------ | -------- | ------- | ------------------------------------------- |
| Bubble Sort    | O(n)        | O(n²)      | O(n²)        | O(1)     | Yes     | Teaching only; nearly-sorted tiny arrays    |
| Selection Sort | O(n²)       | O(n²)      | O(n²)        | O(1)     | No      | Minimizing number of swaps                  |
| Insertion Sort | O(n)        | O(n²)      | O(n²)        | O(1)     | Yes     | Small or nearly-sorted data; online sorting |
| Merge Sort     | O(n log n)  | O(n log n) | O(n log n)   | O(n)     | Yes     | Stable sort; linked lists; external sorting |
| Quick Sort     | O(n log n)  | O(n log n) expected for randomized distinct keys | O(n²) | O(log n) stack for our smaller-side-recursion version | No | Partitioning and selection |
| Heap Sort      | O(n log n)  | O(n log n) | O(n log n)   | O(1)     | No      | Guaranteed O(n log n) with O(1) space       |
| Counting Sort  | O(n + k)    | O(n + k)   | O(n + k)     | O(n + k) for stable output | Yes     | Small integer range k                       |
| Radix Sort     | O(d(n+b))   | O(d(n+b))  | O(d(n+b))    | O(n+b)   | Yes     | Fixed-width integers/strings                |

> **k** = value range for counting sort. **d** = number of digits and **b** = digit base for radix sort. **Stable** = equal elements keep their original relative order.

The usual quicksort that recursively calls both partitions can require O(n) stack space. Our [quicksort lesson](./quick-sort/README.md) recurses only into the smaller partition, bounding stack space by O(log n); it still has O(n²) worst-case time. The stability entries describe the standard variants taught here, not every possible implementation.

**Cyclic placement** is a specialized O(n)-time, O(1)-extra-space technique for a permutation of the integers 1 through n. Duplicate or out-of-range values change its contract; see below.

### Choose from the problem's constraints

```text
Need only an extreme or kth item?
  yes --> consider a heap or selection, not necessarily a full sort
  no  --> Is the integer key range small?
            yes --> counting sort
            no  --> Need guaranteed O(n log n) comparisons?
                      yes --> merge sort (buffer) or heapsort (in place)
                      no  --> consider quicksort and its pivot risks
```

This is a guide to algorithm properties. In a judge problem that allows library sorting, begin with a correct comparator. For a small or nearly sorted array, insertion sort is also useful; the main lesson is to justify a method using the constraints instead of memorizing one favorite sort.

### Stability — Why It Matters

A **stable** sort preserves the relative order of records with equal keys. This is essential when sorting by **multiple criteria** (e.g., sort by name, then stably by age). Merge, insertion, counting, and radix sorts are stable; quick, heap, and selection sorts are not.

---

## JavaScript sorting and the learning sequence

`Array.sort()` without a comparator compares string representations: 10 sorts before 2. For finite numbers, `(a, b) => a - b` returns a negative value when a belongs before b, zero for equal values, and a positive value when a belongs after b. It returns a number, **not a boolean**. `sort` changes the array, so copy first when the original order matters.

```js runnable
const values = [10, 2, 1, 2];
const sorted = [...values].sort((a, b) => a - b);
console.log(sorted.join(','));
console.log(values.join(','));
const teams = [{ name: 'Bo', score: 2 }, { name: 'Ana', score: 2 }, { name: 'Cy', score: 1 }];
teams.sort((a, b) => a.score - b.score || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
console.log(teams.map(team => team.name).join(','));
```

```text output
1,2,2,10
10,2,1,2
Cy,Ana,Bo
```

The record comparator first compares scores; equal scores are broken by names. For `BigInt` keys, use `a < b ? -1 : a > b ? 1 : 0` rather than subtracting: a comparator must return a `Number`, not a BigInt. Do not mutate values inside a comparator. Built-in sort's time and space depend on the engine; do not claim a particular internal algorithm as a JavaScript language guarantee.

| Learn in this order | What changes from the previous idea |
| --- | --- |
| [Insertion sort](./insertion-sort/README.md) | Keep a sorted prefix, then insert one value. The workbook below includes a complete implementation. |
| [Merge sort](./merge-sort/README.md), after recursion | Sort halves and combine them with two indexes; stable O(n log n) work. |
| [Quicksort](./quick-sort/README.md), after recursion | Partition around a pivot; understand the bad-pivot cases and bounded-stack variant. |
| [Heapsort](./heap-sort/README.md), after heaps | Repeatedly extract an extreme with a worst-case bound and constant array workspace. |
| [Counting sort](./counting-sort/README.md) | Use a small integer range; preserve attached records with stable placement. |
| [Radix sort](./radix-sort/README.md), after stability | Reuse a stable digit pass, keeping the ordering established by earlier passes. |

Bubble and selection sorts are short learning exercises. [Shell sort](./shell-sort/README.md) and [bucket sort](./bucket-sort/README.md) are optional extensions; their assumptions and performance differ from the core methods above.

### Cyclic sort: use values as their destination indexes

Suppose the input promises each integer from 1 through n **exactly once**. Value 1 belongs at index 0, value 2 at index 1, and so on. A misplaced value tells us its destination directly, so exchange it with the value there and inspect the new value at the current index.

```js runnable
function cyclicSort(values) {
  let index = 0;
  while (index < values.length) {
    const destination = values[index] - 1;
    if (destination === index) {
      index++;
    } else {
      [values[index], values[destination]] = [values[destination], values[index]];
    }
  }
  return values;
}

console.log(cyclicSort([3, 1, 2]).join(','));
console.log(cyclicSort([1]).join(','));
console.log(JSON.stringify(cyclicSort([])));
```

```text output
1,2,3
1
[]
```

For `[3, 1, 2]`, move 3 to index 2 to get `[2, 1, 3]`, then move 2 to index 1 to get `[1, 2, 3]`. Each swap fixes at least one destination permanently, so there are at most O(n) swaps and O(n) index advances. Extra space is O(1), and the input is mutated. This speedup relies on the permutation promise. Duplicates may prevent progress in this version, and out-of-range values may access invalid positions; verify the promise before choosing it. Missing-number variants need their own guarded placement rule.

## Pitfalls

- Quick sort worst case O(n²) on sorted input — random pivots reduce the chance; 3-way partition helps with repeated values
- Stable vs unstable: use stable sort when equal elements must maintain relative order
- Modern JavaScript guarantees stable `Array.sort()` (ES2019 onward), but your comparator must be consistent; stability does not repair an incorrect comparator.

---

## Worked examples and answers {/* #workbook-practice */}

Attempt the linked [Practice Problems](#practice-problems) before opening their answers. See the [workbook guide](../../javascript/workbook.md) for the A–C exercise format.

### 45. Sorting merging and selection {/* #workbook-45 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** connect an ordering method to its work, storage, and treatment of ties.

Use the [comparison table](#compare-sorting-methods) to choose a starting algorithm. [Insertion sort](./insertion-sort/README.md) maintains a sorted prefix; [selection sort](./selection-sort/README.md) chooses the next minimum; [bubble sort](./bubble-sort/README.md) swaps neighboring out-of-order values. Their simple loops help explain correctness, although their worst-case work is quadratic.

A **stable** sort keeps equal-key records in their original order. During the merge below, choose the left item on equality to preserve that order. Use indices rather than repeated front shifts. [Merge sort](./merge-sort/README.md) explains the O(log n) levels, O(n) work per level, and auxiliary array storage.

[Quicksort](./quick-sort/README.md) partitions around a pivot. Balanced choices give expected O(n log n) work, while repeated unbalanced choices can take O(n²). Quickselect keeps only the partition containing a desired rank; its simple randomized form has expected O(n) work but an O(n²) worst case. A heap can also help when only a few extreme values are needed.

[Counting sort](./counting-sort/README.md) and [radix sort](./radix-sort/README.md) use restricted keys rather than only comparisons. That extra information explains why they can beat the general comparison-sorting lower bound; range size and digit count still contribute to their cost.

**Worked example**

```js runnable
function mergeSort(values) {
  if (values.length < 2) return [...values];
  const middle = Math.floor(values.length / 2);
  const left = mergeSort(values.slice(0, middle));
  const right = mergeSort(values.slice(middle));
  const result = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);
  return result;
}
console.log(mergeSort([5, -1, 3, 3]).join(","));
```

```text output
-1,3,3,5
```

**Why the example works**

The halves are independently sorted. Each merge takes the smaller available head, so the result prefix stays sorted and contains exactly the smallest consumed values. Taking the left equal value first preserves order across halves. The returned outer array is new even for zero or one element.

</details>

Find **45A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-45-answer">
<summary>Check your reasoning and answer</summary>

For Node checks, add `import assert from "node:assert/strict";` at the top of your file. Browser and multi-file examples use the setup stated above.

**45A.** The left half originally appeared before the right half. Retaining that priority for equal keys keeps their original relative order when the halves are merged.

**45B.** Its counting storage depends on the entire key range, not only the number of observed values. Two far-apart integers can require a disproportionately large count array.

**45C.** Save the next value, shift larger prefix elements right, and insert it into the opening. Shifting only values strictly greater than the saved value preserves stability.

**Reference code**

Use the worked example above first if the answer calls its functions or classes. Run each lesson in its own `.mjs` file.

```js
function insertionSort(values) {
  const result = [...values];
  for (let i = 1; i < result.length; i++) {
    const value = result[i];
    let j = i - 1;
    while (j >= 0 && result[j] > value) {
      result[j + 1] = result[j];
      j--;
    }
    result[j + 1] = value;
  }
  return result;
}
```

**Check the result**

```js
assert.deepEqual(insertionSort([3, -1, 3, 0]), [-1, 0, 3, 3]);
assert.deepEqual(insertionSort([]), []);
assert.deepEqual(mergeSort([2, 1]), [1, 2]);
```

</details>

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **45A — Why does selecting the left equal value preserve stability?** | **Must fix** | [Worked example](#workbook-45) | [Answer](#workbook-45-answer) |
| **45B — Why can counting sort be wasteful for sparse large values?** | **Must fix** | [Worked example](#workbook-45) | [Answer](#workbook-45-answer) |
| **45C — Implement insertionSort(values) for finite numbers, returning a sorted copy.** | **Must fix** | [Worked example](#workbook-45) | [Answer](#workbook-45-answer) |
| <PracticeProblem id={88} title={"Merge Sorted Array"} text={"Problem statement\nThe first m positions of nums1 and all n positions of nums2 contain integers in ascending order,\nallowing equal values. nums1 has m + n positions; its final n positions are spare capacity, not input\nvalues. Merge the two sequences into nums1 so that every input value appears in sorted order.\nModify nums1 rather than returning a new array. Either sequence may be empty. Aim for O(m + n)\ntime.\nInput \u0026 expected result\nInputs: nums1 and nums2 are arrays; m and n identify how many values belong to each input\nsequence. Expected result: nums1 itself contains m + n sorted values. Its spare zeros must not be\nmerged as data.\nEXAMPLE 1\nInput: nums1 = [2,5,8,0,0], m = 3, nums2 = [1,7], n = 2\nAfter the call: nums1 = [1,2,5,7,8]\nExplanation: Only [2,5,8] belongs to the first input sequence. Adding the two values [1,7]\nproduces five sorted values, with no spare positions left.\nEXAMPLE 2\nInput: nums1 = [0,0], m = 0, nums2 = [-2,6], n = 2\nAfter the call: nums1 = [-2,6]\nExplanation: The first sequence is empty, so both spare positions are replaced by the second\nsequence's values.\nConstraints \u0026 guarantees\n• nums1.length == m + n\n• nums2.length == n\n• m, n: 0 through 200 (inclusive)\n• m + n: 1 through 200 (inclusive)\n• nums1[i], nums2[j]: -10^9 through 10^9 (inclusive)\nJavaScript starter\nfunction merge(nums1, m, nums2, n) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/merge-sorted-array/) | [Example](../two-pointers/LC-88-merge-sorted-array/index.mdx) |
| <PracticeProblem id={56} title={"Merge Intervals"} text={"Problem statement\nEach pair in intervals is a closed interval [start,end]. Combine overlapping intervals until none\noverlap, preserving their complete union. Touching endpoints count as overlap. Return the merged\nintervals in any order. The input may be unsorted.\nInput \u0026 expected result\nThe merged result must cover exactly the same set of points as the input. A containing interval\nabsorbs smaller intervals, and endpoint contact is enough to require merging.\nEXAMPLE 1\nInput: intervals = [[1,4],[4,7],[10,12]]\nOutput: [[1,7],[10,12]]\nExplanation: The first two closed intervals share endpoint 4, so together they form [1,7]. The\nthird is separate.\nEXAMPLE 2\nInput: intervals = [[1,10],[3,4]]\nOutput: [[1,10]]\nExplanation: The smaller interval contributes no points outside the larger one.\nConstraints \u0026 guarantees\n• intervals.length: 1 through 10^4 (inclusive)\n• intervals[i].length == 2\n• 0 \u003c= start_i \u003c= end_i \u003c= 10^4\nJavaScript starter\nfunction merge(intervals) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/merge-intervals/) | — |
| <PracticeProblem id={75} title={"Sort Colors"} text={"Problem statement\nSort nums in place so that all 0 values come first, then all 1 values, then all 2 values. These values\nrepresent red, white, and blue. Do not call a library sorting function.\nInput \u0026 expected result\nModify nums itself. Follow-up: solve it in one pass with constant extra space.\nEXAMPLE 1\nInput: nums = [1,2,0,1,0]\nAfter the call: nums = [0,0,1,1,2]\nExplanation: The color groups appear in the required order.\nEXAMPLE 2\nInput: nums = [2,2]\nAfter the call: nums = [2,2]\nExplanation: A single color group is already sorted.\nConstraints \u0026 guarantees\n• n == nums.length\n• 1 \u003c= n \u003c= 300\n• nums[i] is either 0, 1, or 2\nJavaScript starter\nfunction sortColors(nums) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/sort-colors/) | — |
| <PracticeProblem id={179} title={"Largest Number"} text={"Problem statement\nArrange all nonnegative integers in nums into an order whose concatenated decimal\nrepresentation is greatest. Treat each integer as one indivisible piece. Return the resulting\nrepresentation as a string, since it may exceed numeric limits.\nInput \u0026 expected result\nIf every value is zero, return \"0\" rather than multiple leading zeros.\nEXAMPLE 1\nInput: nums = [12,121]\nOutput: \"12121\"\nExplanation: Placing 12 before 121 produces a larger number than the reverse ordering.\nEXAMPLE 2\nInput: nums = [0,0,0]\nOutput: \"0\"\nExplanation: The largest possible value is still zero.\nConstraints \u0026 guarantees\n• 1 \u003c= nums.length \u003c= 100\n• 0 \u003c= nums[i] \u003c= 10^9\nJavaScript starter\nfunction largestNumber(nums) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/largest-number/) | — |
| <PracticeProblem id={274} title={"H-Index"} text={"Problem statement\ncitations contains the citation count for each of a researcher's papers. Return the largest integer h\nsuch that at least h papers each have at least h citations. Papers with fewer citations do not\ninvalidate that choice. Counts are nonnegative, and the array need not be sorted.\nInput \u0026 expected result\nh cannot exceed the number of papers. Citations above h still count toward the h qualifying papers.\nReturn the largest valid h; papers outside that qualifying group may have any citation count.\nEXAMPLE 1\nInput: citations = [4,4,1,0]\nOutput: 2\nExplanation: At least two papers have two or more citations, but there are not three papers with\nthree or more citations.\nEXAMPLE 2\nInput: citations = [0,0,0]\nOutput: 0\nExplanation: No paper meets even a one-citation threshold.\nConstraints \u0026 guarantees\n• n == citations.length\n• n: 1 through 5000 (inclusive)\n• citations[i]: 0 through 1000 (inclusive)\nJavaScript starter\nfunction hIndex(citations) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/h-index/) | — |
| [LC 493 — Reverse Pairs](https://leetcode.com/problems/reverse-pairs/) | Hard | [LeetCode](https://leetcode.com/problems/reverse-pairs/) | — |
| G09 — Choose chocolate packets minimizing the allocation range. | Exercise | Arrays and hashing. Choose m packets from the array to minimize the difference between maximum and minimum packet sizes. | — |
| G10 — Minimize swaps needed to sort an array. | Exercise | Arrays and hashing | — |
| [LC 912 — Sort an Array](https://leetcode.com/problems/sort-an-array/) | Medium | [LeetCode](https://leetcode.com/problems/sort-an-array/) |  |
| [CC — Turbo Sort (TSORT)](https://www.codechef.com/problems/TSORT) | Easy | — |  |
| [CC — Inversion Count (INVCNT)](https://www.codechef.com/problems/INVCNT) | Medium | — |  |
| [CC — Smallest Difference (SMASTR)](https://www.codechef.com/problems/SMASTR) | Easy | — |  |
| [LC 164 — Maximum Gap](https://leetcode.com/problems/maximum-gap/) | Hard | [LeetCode](https://leetcode.com/problems/maximum-gap/) |  |
| [LC 905 — Sort Array By Parity](https://leetcode.com/problems/sort-array-by-parity/) | Easy | [LeetCode](https://leetcode.com/problems/sort-array-by-parity/) |  |
| [LC 1636 — Sort Array by Increasing Frequency](https://leetcode.com/problems/sort-array-by-increasing-frequency/) | Easy | [LeetCode](https://leetcode.com/problems/sort-array-by-increasing-frequency/) |  |
| [LC 324 — Wiggle Sort II](https://leetcode.com/problems/wiggle-sort-ii/) | Medium | [LeetCode](https://leetcode.com/problems/wiggle-sort-ii/) |  |
| [LC 350 — Intersection of Two Arrays II](https://leetcode.com/problems/intersection-of-two-arrays-ii/) | Easy | [LeetCode](https://leetcode.com/problems/intersection-of-two-arrays-ii/) |  |
| [LC 451 — Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency/) | Medium | [LeetCode](https://leetcode.com/problems/sort-characters-by-frequency/) |  |
| [LC 506 — Relative Ranks](https://leetcode.com/problems/relative-ranks/) | Easy | [LeetCode](https://leetcode.com/problems/relative-ranks/) |  |
| [LC 561 — Array Partition](https://leetcode.com/problems/array-partition/) | Easy | [LeetCode](https://leetcode.com/problems/array-partition/) |  |
| [LC 791 — Custom Sort String](https://leetcode.com/problems/custom-sort-string/) | Medium | [LeetCode](https://leetcode.com/problems/custom-sort-string/) |  |
| [LC 1122 — Relative Sort Array](https://leetcode.com/problems/relative-sort-array/) | Easy | [LeetCode](https://leetcode.com/problems/relative-sort-array/) |  |
| [LC 1365 — How Many Numbers Are Smaller Than Current](https://leetcode.com/problems/how-many-numbers-are-smaller-than-the-current-number/) | Easy | [LeetCode](https://leetcode.com/problems/how-many-numbers-are-smaller-than-the-current-number/) |  |
| [CC — Merge Sort (MERGSORT)](https://www.codechef.com/problems/MERGSORT) | Medium | — |  |
| [CC — Quick Sort (QUICKSRT)](https://www.codechef.com/problems/QUICKSRT) | Medium | — |  |
| [CC — Counting Sort (CNTSORT)](https://www.codechef.com/problems/CNTSORT) | Easy | — |  |

{/* END GENERATED PRACTICE PROBLEMS */}

## Related Topics

- [Binary Search](../binary-search/README.md) — requires sorted input
- [Two Pointers](../two-pointers/README.md) — converging pointers need sorted array
- [Heap](../heap/README.md) — heapsort; partial sort for Top-K

[← Back to Home](../index.md) · © sparshjaswal

**Next:** [searching](../search/README.md).
