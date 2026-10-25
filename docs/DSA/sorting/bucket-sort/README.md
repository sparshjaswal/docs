---
id: dsa-sorting-bucket-sort-readme
title: "Bucket Sort"
slug: /DSA/sorting/bucket-sort/README
sidebar_label: "Bucket Sort"
---

# Bucket Sort

**Read first:** [Insertion sort](../insertion-sort/README.md).

**Practice focus:** Choose bucket boundaries, sort within each bucket, and test values crowded into one bucket.

Bucket sort puts values into groups called buckets. Sort each bucket, then read the buckets in order. For numbers between 0 and 1, one bucket might hold values from 0.0 up to 0.1. Good bucket choices spread values fairly evenly; poor choices can leave nearly all values in one bucket.

## Algorithm

Bucket sort works as follows:

1. Set up an array of initially empty `buckets`.
2. **Scatter:** Go over the original array, putting each object in its `bucket`.
3. Sort each non-empty `bucket`.
4. **Gather:** Visit the `buckets` in order and put all elements back into the original array.

Elements are distributed among bins:

![Distribute values into buckets according to their value ranges.](./images/bucket_sort_1.png)

Then, elements are sorted within each bin:

![Sort within each bucket, then join the buckets from the smallest range to the largest.](./images/bucket_sort_2.png)

## Complexity

The computational complexity depends on the algorithm used to sort each bucket, the number of buckets to use, and whether the input is uniformly distributed.

The **worst-case** time complexity of bucket sort is
`O(n^2)` if the sorting algorithm used on the bucket is _insertion sort_, which is the most common use case since the expectation is that buckets will not have too many elements relative to the entire list. In the worst case, all elements are placed in one bucket, causing the running time to reduce to the worst-case complexity of insertion sort (all elements are in reverse order). If the worst-case running time of the intermediate sort used is `O(n * log(n))`, then the worst-case running time of bucket sort will also be
`O(n * log(n))`.

On **average**, when the distribution of elements across buckets is reasonably uniform, it can be shown that bucket sort runs on average `O(n + k)` for `k` buckets.

## References

- [Bucket Sort on Wikipedia](https://en.wikipedia.org/wiki/Bucket_sort)

**Next:** [Counting sort: make one place for each key](../counting-sort/README.md).
