---
id: dsa-search-interpolation-search-readme
title: "Interpolation Search"
slug: /DSA/search/interpolation-search/README
sidebar_label: "Interpolation Search"
---

# Interpolation Search

**Read first:** [Binary Search](../binary-search/README.md).

**Practice focus:** Estimate a candidate from value spacing and test uneven data where that estimate is poor.

Interpolation search guesses where a target lies in a sorted numeric array using the values at both ends. A target near the high end suggests a position near the right. This works best when values are spread fairly evenly; highly uneven data can make it slow.

For example we have a sorted array of `n` uniformly distributed values `arr[]`,
and we need to write a function to search for a particular element `x` in the array.

**Linear Search** finds the element in `O(n)` time, **Jump Search** takes `O(√ n)` time
and **Binary Search** take `O(Log n)` time.

The **Interpolation Search** is an improvement over Binary Search for instances,
where the values in a sorted array are _uniformly_ distributed. Binary Search
always goes to the middle element to check. On the other hand, interpolation
search may go to different locations according to the value of the key being
searched. For example, if the value of the key is closer to the last element,
interpolation search is likely to start search toward the end side.

## JavaScript Implementation

Estimate the target's fraction of the value range, then apply that fraction to the index range. Round down to get an integer index. The array must contain finite numbers in ascending order; if repeated values match, any matching index is acceptable.

```js runnable
function interpolationSearch(values, target) {
  let low = 0;
  let high = values.length - 1;
  while (low <= high && target >= values[low] && target <= values[high]) {
    if (values[low] === values[high]) return values[low] === target ? low : -1;
    const fraction = (target - values[low]) / (values[high] - values[low]);
    // A midpoint fallback handles overflow in a range of extreme finite numbers.
    const estimate = Number.isFinite(fraction)
      ? low + Math.floor(fraction * (high - low))
      : low + Math.floor((high - low) / 2);
    const position = Math.max(low, Math.min(high, estimate));
    if (values[position] === target) return position;
    if (values[position] < target) low = position + 1;
    else high = position - 1;
  }
  return -1;
}

console.log(interpolationSearch([10, 20, 30, 40, 50], 40));
console.log(interpolationSearch([7, 7, 7], 7));
console.log(interpolationSearch([], 7));
console.log(interpolationSearch([10, 20, 30], 25));
```

```text output
3
0
-1
-1
```

Equal endpoints need a separate check to avoid dividing by zero. After each unsuccessful comparison, the search interval shrinks past the checked position. This guarantees progress even for uneven data.

## Complexity

Expected time is O(log log n) under a roughly uniform value distribution. Worst-case time is O(n), so binary search is a more predictable choice when that assumption does not hold. Extra space is O(1).

## Exercise and failure drill

Search an array whose values are all equal, then a sorted array with one extreme outlier.

<details>
<summary>Expected trace and debugging checks</summary>

Equal endpoints make the interpolation denominator zero, so handle that case before estimating a position. Skew can make estimated positions poor; bound progress and consider falling back to binary search.

</details>

## Interview reasoning

When is the attractive average cost plausible? Under a suitable distribution and access model. Sorted order alone does not imply a near-uniform value distribution or prevent linear worst-case behavior.

## References

- [GeeksForGeeks](https://www.geeksforgeeks.org/interpolation-search/)
- [Wikipedia](https://en.wikipedia.org/wiki/Interpolation_search)

**Next:** [Search](../README.md).
