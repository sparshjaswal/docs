---
id: dsa-sorting-bubble-sort-readme
title: "Bubble Sort"
slug: /DSA/sorting/bubble-sort/README
sidebar_label: "Bubble Sort"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Bubble sort

**Read first:** [Sorting](../README.md).

**Practice focus:** Trace adjacent swaps and identify the finished suffix after each pass.

Compare neighboring values and swap them when they are in the wrong order. After each full pass, the largest remaining value is at the right end.

<AlgorithmWalkthrough name="bubbleSort" />

## Cost and limits

| Question | Answer |
| --- | --- |
| Best-case time | O(n) with an early-stop check |
| Worst-case time | O(n²) |
| Extra space | O(1) |
| Keeps equal keys in their original order? | Yes, if equal values are not swapped |

Here, n is the number of input values. The estimates describe the standard algorithm; extra copies or a different implementation can change memory use.

## Read the implementation

[Open BubbleSort.js](./BubbleSort.js), then compare it with the steps above. The repository source may use helpers or a different variant; check its imports before running it by itself.

## Exercise and failure drill

For `[3, 1, 2]`, record the array after one full left-to-right pass. Then sort records with equal keys and different IDs.

<details>
<summary>Expected trace and debugging checks</summary>

The first pass ends at `[1, 2, 3]`, with 3 in its final position. Swapping only strictly out-of-order neighbors preserves equal-key order. If an already sorted array still takes quadratic work, inspect whether the early-stop flag is reset and checked per pass.

</details>

## Interview reasoning

Why is bubble sort rarely the default for large arrays? Its repeated adjacent comparisons take quadratic worst-case work; use the [sorting comparison](../README.md) to choose from actual constraints.

## References

- [Sorting overview and comparison](../README.md)
- [Princeton Algorithms: sorting](https://algs4.cs.princeton.edu/20sorting/)

**Next:** [Insertion sort](../insertion-sort/README.md).
