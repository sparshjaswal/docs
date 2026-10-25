---
id: dsa-sorting-merge-sort-readme
title: "Merge Sort"
slug: /DSA/sorting/merge-sort/README
sidebar_label: "Merge Sort"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Merge sort: sort small pieces, then combine them

**Practice focus:** Merge two sorted lists before tracing the recursive splits that produce them.

**Prerequisites:** arrays, indexes, and [recursion](../../recursion/README.md). Imagine two queues of students, each already ordered by height. The shorter of the two front students must be the shortest remaining student overall. Move that student to the result, then compare the new fronts.

**Merge sort** uses that observation after recursively sorting two halves. It is useful when you need a stable O(n log n) comparison sort and can afford O(n) extra space. The same merge reasoning also supports interval processing, sorted linked lists, and counting inversions.

**Learning order:** if you reached sorting before the recursion stage, first learn numeric comparators, insertion sort, and the idea of merging two sorted arrays. Read the linked recursion lesson before implementing the recursive algorithm here, then return to this page.

<AlgorithmWalkthrough name="mergeSort" />

## Complete implementation

The input is an array of finite `Number` values. The function returns a new sorted array, leaving the input unchanged. For arrays of records, replace the numeric comparison with a consistent comparator.

```js runnable
function mergeSort(values) {
  if (values.length <= 1) return [...values];
  const middle = Math.floor(values.length / 2);
  const left = mergeSort(values.slice(0, middle));
  const right = mergeSort(values.slice(middle));
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      result.push(left[leftIndex++]);
    } else {
      result.push(right[rightIndex++]);
    }
  }
  while (leftIndex < left.length) result.push(left[leftIndex++]);
  while (rightIndex < right.length) result.push(right[rightIndex++]);
  return result;
}

const values = [4, 1, 3, 2];
console.log(mergeSort(values).join(','));
console.log(values.join(','));
console.log(mergeSort([3, -1, 3]).join(','));
console.log(JSON.stringify(mergeSort([])));
```

```text output
1,2,3,4
4,1,3,2
-1,3,3
[]
```

For `[4, 1, 3, 2]`, splitting gives `[4, 1]` and `[3, 2]`. The recursive calls return `[1, 4]` and `[2, 3]`. Merge chooses 1, then 2, then 3. The right half is exhausted, so append the remaining 4. Exhausting one half does not mean the whole merge is finished.

**Why it works.** A zero- or one-item array is already sorted. Assume the recursive calls return correctly sorted halves. Their smallest unused values are at the two current indexes, so taking the smaller appends the smallest remaining value overall. The output prefix stays sorted and contains exactly the consumed items. Once every item is consumed, the full result is sorted. Choosing the left item on equality keeps equal records in their original order, giving stability.

The halves roughly divide the input by two at each level, giving O(log n) levels. Merging all pieces at any one level processes O(n) items, so time is O(n log n) in the best and worst cases. Peak extra storage is O(n), including copied subarrays and merged results, plus an O(log n) call stack. A reusable buffer can reduce allocation overhead while keeping the same asymptotic bound.

Do not repeatedly remove the first element with `shift()`: moving the remaining elements can turn a linear merge into quadratic work. Use indexes. Remember the base case, and do not return the original array for length 1 if your contract promises a new outer array.

## Checks and practice

1. **Check:** merge `[1, 4]` and `[2, 3]` by writing the two indexes after every choice.
2. **Apply:** label equal values `2A` and `2B`, with A originally earlier. Why does `<=` preserve their order?
3. **Extend:** count inversions, pairs of indexes i before j with `values[i] > values[j]`. When a right value beats a left value during merging, how many new inversions does it create?

<details>
<summary>Hints</summary>

Advance only the index from which you took an item. Equal items in the left half were earlier in the original array. All remaining left items are at least as large as the left front.

</details>

<details>
<summary>Answers</summary>

1. The chosen values are 1, 2, 3, 4; index pairs after each are `(1, 0)`, `(1, 1)`, `(1, 2)`, and `(2, 2)`.
2. On equality, the earlier half wins. Each recursive call preserves order inside its own half, so stability holds for the full array.
3. When `right[rightIndex] < left[leftIndex]`, it forms an inversion with every unconsumed left item: add `left.length - leftIndex`. Count inversions within each half recursively as well. Equal values do not form inversions. The total can exceed a 32-bit integer; check the answer bounds.

</details>

[Next: quicksort](../quick-sort/README.md) · [Sorting overview](../README.md)

**Next:** [Quicksort: put one pivot in its final place](../quick-sort/README.md).
