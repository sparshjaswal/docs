---
id: dsa-sorting-shell-sort-readme
title: "Shellsort"
slug: /DSA/sorting/shell-sort/README
sidebar_label: "Shellsort"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Shell sort

**Read first:** [Insertion sort](../insertion-sort/README.md).

**Practice focus:** Sort gap-separated positions, reduce the gap, and finish with a gap of one.

Run insertion sort on positions separated by a gap. Reduce the gap and repeat. The final gap must be 1 so the whole array becomes sorted.

<AlgorithmWalkthrough name="shellSort" />

## Cost and limits

| Question | Answer |
| --- | --- |
| Best-case time | Depends on the gaps |
| Worst-case time | O(n²) for the simple repeatedly-halved gap sequence |
| Extra space | O(1) |
| Keeps equal keys in their original order? | No |

Here, n is the number of input values. Performance depends on the gap sequence. Do not apply a bound from one sequence to a different sequence.

## Read the implementation

[Open ShellSort.js](./ShellSort.js), then compare it with the steps above. The repository source may use helpers or a different variant; check its imports before running it by itself.

## Exercise and failure drill

Run a gap-2 pass on `[4, 3, 2, 1]`, then the final gap-1 pass. State what is sorted after each pass.

<details>
<summary>Expected trace and debugging checks</summary>

The gap-2 subsequences become ordered, giving `[2, 1, 4, 3]`. The final insertion-sort pass gives `[1, 2, 3, 4]`. Omitting gap 1 can leave the whole array unsorted.

</details>

## Interview reasoning

Why should a Shell sort complexity claim name its gap sequence? Different sequences change the movement and comparison bounds; there is no one universal bound for every variant.

## References

- [Sorting overview and comparison](../README.md)
- [Princeton Algorithms: sorting](https://algs4.cs.princeton.edu/20sorting/)

**Next:** [Merge sort: sort small pieces, then combine them](../merge-sort/README.md).
