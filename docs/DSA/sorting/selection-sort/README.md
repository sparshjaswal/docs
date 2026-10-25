---
id: dsa-sorting-selection-sort-readme
title: "Selection Sort"
slug: /DSA/sorting/selection-sort/README
sidebar_label: "Selection Sort"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Selection sort

**Read first:** [Insertion sort](../insertion-sort/README.md).

**Practice focus:** Find the next minimum, swap it into place, and mark the finished prefix.

Find the smallest value in the unsorted part, then swap it into the next output position. Repeat for the remaining positions.

<AlgorithmWalkthrough name="selectionSort" />

## Cost and limits

| Question | Answer |
| --- | --- |
| Best-case time | O(n²) |
| Worst-case time | O(n²) |
| Extra space | O(1) |
| Keeps equal keys in their original order? | No, swapping can reorder equal keys |

Here, n is the number of input values. The estimates describe the standard algorithm; extra copies or a different implementation can change memory use.

## Read the implementation

[Open SelectionSort.js](./SelectionSort.js), then compare it with the steps above. The repository source may use helpers or a different variant; check its imports before running it by itself.

## Exercise and failure drill

Sort records `(2,A), (2,B), (1,C)` with the usual minimum-selection swap. Track record identity.

<details>
<summary>Expected trace and debugging checks</summary>

The first swap gives `(1,C), (2,B), (2,A)`: equal-key order changed. The usual swap-based algorithm is not stable, despite finding a correct sorted sequence.

</details>

## Interview reasoning

Why might selection sort be chosen when writes are costly? It uses only a linear number of swaps, while still performing quadratic comparisons. State whether that trade-off fits the storage model.

## References

- [Sorting overview and comparison](../README.md)
- [Princeton Algorithms: sorting](https://algs4.cs.princeton.edu/20sorting/)

**Next:** [Merge sort: sort small pieces, then combine them](../merge-sort/README.md).
