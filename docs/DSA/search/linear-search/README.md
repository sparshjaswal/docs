---
id: dsa-search-linear-search-readme
title: "Linear Search"
slug: /DSA/search/linear-search/README
sidebar_label: "Linear Search"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Linear Search

**Read first:** [Array](../../Array/README.md).

**Practice focus:** Check each candidate in order and return the first match, including empty and missing cases.

Linear search checks values from the start until it finds a target or reaches the end. It works on unsorted arrays. The contract here returns the first matching index, or `-1` when no value matches.

<AlgorithmWalkthrough name="linearSearch" />

## Implementation

```js runnable
function linearSearch(values, target) {
  for (let i = 0; i < values.length; i++) {
    if (values[i] === target) return i;
  }
  return -1;
}
console.log(linearSearch([4, 9, 7, 9], 9));
console.log(linearSearch([4, 9, 7], 5));
console.log(linearSearch([], 5));
```

```text output
1
-1
-1
```

Before each comparison, all earlier positions are known not to match. A match is therefore the first one. If the loop finishes, every position has been checked.

## Complexity

The best case takes O(1) time when the first value matches. Worst-case time is O(n), and extra space is O(1). No sorting or copy is needed. For one search on unsorted data, sorting just to use binary search can cost more than scanning.

## Edge cases and next steps

Test an empty array, a target at either end, a missing target, and duplicates. This version uses strict equality: separate object instances do not match merely because their properties look alike, and `NaN` does not equal itself. Define another equality rule if the application needs it.

For sorted data with repeated searches, continue with [binary search](../binary-search/README.md).

## Exercise and failure drill

Search `[5, 2, 5]` for 5 under a first-index contract. Then search an empty list and an absent value.

<details>
<summary>Expected trace and debugging checks</summary>

Return index 0 for the first case and the documented absence value for the others. Changing the loop to keep scanning changes the contract to the last match unless guarded.

</details>

## Interview reasoning

When does a linear scan beat preparing a faster query structure? For one small unsorted input, preprocessing may cost more than the scan. Compare total workload, including updates and number of queries.

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Linear_search)
- [TutorialsPoint](https://www.tutorialspoint.com/data_structures_algorithms/linear_search_algorithm.htm)
- [Youtube](https://www.youtube.com/watch?v=SGU9duLE30w)

**Next:** [Binary Search](../binary-search/README.md).
