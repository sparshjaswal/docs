---
id: dsa-search-binary-search-readme
title: "Binary Search"
slug: /DSA/search/binary-search/README
sidebar_label: "Binary Search"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Binary Search

**Read first:** [Linear Search](../linear-search/README.md).

**Practice focus:** Keep both endpoints as candidates and explain why every update skips the checked middle.

Binary search finds a target in a sorted array by repeatedly checking the middle. If the middle value is too small, discard it and everything to its left. If it is too large, discard it and everything to its right.

**Contract:** values are finite numbers in ascending order. Return a matching index, or `-1`. With duplicates, any matching index is acceptable in this version.

<AlgorithmWalkthrough name="binarySearch" />

## Keep one interval convention

This implementation uses a closed interval `[left, right]`: both endpoints are candidates. Before every iteration, if the target exists, at least one occurrence remains inside that interval. The sorted order justifies every discarded half.

```js runnable
function binarySearch(values, target) {
  let left = 0;
  let right = values.length - 1;
  while (left <= right) {
    const middle = left + Math.floor((right - left) / 2);
    if (values[middle] === target) return middle;
    if (values[middle] < target) left = middle + 1;
    else right = middle - 1;
  }
  return -1;
}
console.log(binarySearch([2, 5, 8, 12], 8));
console.log(binarySearch([2, 5, 8, 12], 7));
console.log(binarySearch([], 7));
```

```text output
2
-1
-1
```

For target 7, the interval moves from indices `[0, 3]` to `[2, 3]`, then becomes empty when `right` moves to 1. Moving past `middle` makes progress; assigning an endpoint back to `middle` can get stuck in a closed interval.

## Complexity

Time is O(log n) and extra space is O(1). Checking or sorting the input has an additional cost; the search assumes the sorted-input contract is already satisfied.

## Check your understanding

Test one value, a missing target below or above the range, and duplicate matches. Finding the first occurrence needs a boundary search rather than an immediate return. Continue with [binary-search patterns](../../binary-search/README.md) for lower bounds and searching a feasible answer range.

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Binary_search_algorithm)
- [YouTube](https://www.youtube.com/watch?v=P3YID7liBug&index=29&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

**Next:** [Binary Search](../../binary-search/README.md).
