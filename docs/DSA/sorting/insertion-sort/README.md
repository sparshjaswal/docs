---
id: dsa-sorting-insertion-sort-readme
title: "Insertion Sort"
slug: /DSA/sorting/insertion-sort/README
sidebar_label: "Insertion Sort"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Insertion sort

**Read first:** [Sorting](../README.md).

**Practice focus:** Insert one value into a sorted prefix and count the shifts on nearly sorted and reversed data.

Keep the left part sorted. Take the next value and insert it into the correct position by shifting larger values one place right.

<AlgorithmWalkthrough name="insertionSort" />

## Cost and limits

| Question | Answer |
| --- | --- |
| Best-case time | O(n) |
| Worst-case time | O(n²) |
| Extra space | O(1) |
| Keeps equal keys in their original order? | Yes, if only strictly larger values are shifted |

Here, n is the number of input values. The estimates describe the standard algorithm; extra copies or a different implementation can change memory use.

## Read the implementation

[Open InsertionSort.js](./InsertionSort.js), then compare it with the steps above. The repository source may use helpers or a different variant; check its imports before running it by itself.

## Exercise and failure drill

Insert the final 2 into the sorted prefix `[1, 3, 4]`. Count shifted values and compare with an already sorted input.

<details>
<summary>Expected trace and debugging checks</summary>

Shift 4 and 3, then place 2 after 1. The sorted-prefix invariant must hold after each insertion. Shifting equal values can break stability; compare strictly when preserving equal-key order.

</details>

## Interview reasoning

Why can insertion sort be useful on small or nearly sorted input? It has low setup cost and work depends on how far elements move, but reverse order still requires quadratic shifts.

## References

- [Sorting overview and comparison](../README.md)
- [Princeton Algorithms: sorting](https://algs4.cs.princeton.edu/20sorting/)

**Next:** [Selection sort](../selection-sort/README.md).
