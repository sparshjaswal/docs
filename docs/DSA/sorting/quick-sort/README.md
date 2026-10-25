---
id: dsa-sorting-quick-sort-readme
title: "Quicksort"
slug: /DSA/sorting/quick-sort/README
sidebar_label: "Quicksort"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Quicksort: put one pivot in its final place

**Practice focus:** Trace the pivot partition and distinguish a correct partition from balanced partition sizes.

**Prerequisites:** arrays, swaps, [recursion](../../recursion/README.md), and [merge sort](../merge-sort/README.md). A **pivot** is a selected value used to divide the work. Imagine placing books shorter than one chosen book to its left and all other books to its right. The groups are not sorted yet, but the chosen book can now stand between them.

Quicksort repeatedly **partitions** an array around a pivot, then sorts the remaining groups. It is useful for understanding partitioning and selection problems. This in-place version mutates the supplied array; it does not preserve the order of equal records.

For sorting prerequisites, follow the [sorting overview](../README.md).

<AlgorithmWalkthrough name="quickSort" />

## Understand partitioning before recursion

For `[4, 1, 3, 2]`, choose the last value, 2. Scan the first three values, keeping a boundary for the region smaller than 2. The value 4 stays outside that region. When 1 appears, swap it into the region: `[1, 4, 3, 2]`. The value 3 is not smaller. Finally exchange the pivot with the first value outside the smaller region: `[1, 2, 3, 4]`. Here both groups happen to be sorted already; generally they are not.

During scanning, the invariant is: positions before `smallerEnd` are smaller than the pivot; positions from `smallerEnd` to `scan - 1` are at least the pivot; later positions are unexamined. After the final swap, the pivot is in a valid final sorted position. Recursing on the two sides preserves that position.

## Complete implementation with bounded call depth

The contract is an array of finite numbers. The function returns the same array after sorting it. To avoid a deep JavaScript call stack, it recursively sorts only the **smaller** partition and continues with the larger partition in a loop. Every recursive call therefore has at most half as many elements as its caller.

```js runnable
function quickSort(values) {
  function partition(left, right) {
    const pivot = values[right];
    let smallerEnd = left;
    for (let scan = left; scan < right; scan++) {
      if (values[scan] < pivot) {
        [values[smallerEnd], values[scan]] = [values[scan], values[smallerEnd]];
        smallerEnd++;
      }
    }
    [values[smallerEnd], values[right]] = [values[right], values[smallerEnd]];
    return smallerEnd;
  }
  function sortRange(left, right) {
    while (left < right) {
      const pivotIndex = partition(left, right);
      if (pivotIndex - left < right - pivotIndex) {
        sortRange(left, pivotIndex - 1);
        left = pivotIndex + 1;
      } else {
        sortRange(pivotIndex + 1, right);
        right = pivotIndex - 1;
      }
    }
  }
  sortRange(0, values.length - 1);
  return values;
}

const values = [4, 1, 3, 2];
console.log(quickSort(values).join(','));
console.log(quickSort(values) === values);
console.log(quickSort([3, 3, -1, 0]).join(','));
console.log(JSON.stringify(quickSort([])));
```

```text output
1,2,3,4
true
-1,0,3,3
[]
```

**Why the full algorithm works.** Partition places one pivot correctly, and both remaining ranges are strictly smaller. The empty and one-item ranges need no work. Applying the same argument to each range sorts all values. Excluding the pivot from both later ranges guarantees progress even with duplicates.

Balanced partitions give O(n log n) time. This example deliberately uses the final value as pivot, so sorted, reverse-sorted, or all-equal inputs can give O(n²) time. Randomly choosing a pivot improves expected time to O(n log n) on distinct values, but does not remove the worst case; a three-way partition also helps with many duplicates. The smaller-side recursion keeps this implementation's extra call stack at O(log n) even when time is quadratic. The simpler version that recursively calls both sides can require O(n) stack space and overflow JavaScript's stack.

Common mistakes are including the pivot again, moving the boundary for a value that is not smaller, assuming partition sorts each side, and promising a worst-case O(n log n) bound for this two-way algorithm. For ordinary judge tasks that only need sorting, a numeric `Array.sort((a, b) => a - b)` is usually the first implementation to consider; verify the problem's restrictions and do not rely on an unspecified internal sorting algorithm.

## Checks and practice

1. **Check:** trace partition on `[2, 2, 2]`. Where is the first pivot placed?
2. **Apply:** why can a last-element pivot be slow on already sorted input even with bounded recursion depth?
3. **Extend:** to find only the kth smallest item, which partition still needs work after locating the pivot's rank?

<details>
<summary>Hints</summary>

The comparison is strictly less than. Count how many elements a bad partition removes. A rank lies on at most one side of a pivot.

</details>

<details>
<summary>Answers</summary>

1. No value is smaller, so the pivot goes to index 0. The remaining two equal items still need processing.
2. Each partition scans nearly the whole remaining range but removes only one pivot: `n + (n - 1) + ...` work. Bounding the stack changes memory usage, not those comparisons.
3. Continue only into the side containing the requested rank, or stop if the pivot has that rank. This is quickselect; appropriate randomized partitioning gives expected O(n) time, but a simple implementation still has O(n²) worst-case time.

</details>

[Sorting overview](../README.md)

**Next:** [Heapsort](../heap-sort/README.md).
