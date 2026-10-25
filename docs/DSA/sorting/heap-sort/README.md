---
id: dsa-sorting-heap-sort-readme
title: "Heap Sort"
slug: /DSA/sorting/heap-sort/README
sidebar_label: "Heap Sort"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Heapsort

**Read first:** [Heap (Priority Queue)](../../heap/README.md).

**Practice focus:** Move the largest remaining value into the sorted suffix, then repair only the remaining heap.

Build a max-heap so the largest value is at the root. Swap that value to the end, shorten the heap, and repair it. Repeat until every value is in place.

<AlgorithmWalkthrough name="heapSort" />

## Cost and limits

| Question | Answer |
| --- | --- |
| Best-case time | O(n log n) general bound |
| Worst-case time | O(n log n) |
| Extra space | O(1) with iterative heap repair |
| Keeps equal keys in their original order? | No |

Here, n is the number of input values. The estimates describe the standard algorithm; extra copies or a different implementation can change memory use.

## Read the implementation

[Open HeapSort.js](./HeapSort.js), then compare it with the steps above. The repository source may use helpers or a different variant; check its imports before running it by itself.

## Exercise and failure drill

Build a max heap from `[4, 1, 3, 2]`. After extracting the maximum, identify the heap boundary and the sorted suffix.

<details>
<summary>Expected trace and debugging checks</summary>

The maximum belongs at the end; shrink the active heap before restoring its invariant. Accidentally including the sorted suffix in heap repair corrupts completed work.

</details>

## Interview reasoning

Why is heapsort not a stable sort? Long-distance exchanges can reorder equal keys. Stability requires extra design or a different algorithm; the heap invariant alone concerns key order.

## References

- [Sorting overview and comparison](../README.md)
- [Princeton Algorithms: sorting](https://algs4.cs.princeton.edu/20sorting/)

**Next:** [Sorting](../README.md).
