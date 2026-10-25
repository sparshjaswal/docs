---
id: dsa-ml-k-means-readme
title: "k-Means Algorithm"
slug: /DSA/ml/k-means/README
sidebar_label: "k-Means Algorithm"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# k-Means Algorithm

**Read first:** [Euclidean Distance](../../math/euclidean-distance/README.md).

**Practice focus:** Assign points to centers, recompute each center, and inspect the next assignment round.

k-means groups nearby points into k clusters. Start with k centers, assign each point to its nearest center, then move each center to the average of its assigned points. Repeat until the assignments or centers stop changing enough. This is clustering, not classification with known labels.

The algorithm is as follows:

1. Check for errors like invalid/inconsistent data
2. Initialize the `k` cluster locations with initial/random `k` points
3. Calculate the distance of each data point from each cluster
4. Assign the cluster label of each data point equal to that of the cluster at its minimum distance
5. Calculate the centroid of each cluster based on the data points it contains
6. Repeat assignment and averaging until centers stop moving enough, or a chosen iteration limit is reached. Decide how to handle an empty cluster.

Here is a visualization of k-Means clustering for better understanding:

<AlgorithmWalkthrough name="kmeans" />

The trace uses one-dimensional points so every distance and average can be checked by hand. The same assign-and-average steps apply to vectors with more coordinates.

## Code Examples

- [kMeans.js](./kMeans.js)
- [kMeans.test.js](./__test__/kMeans.test.js) (test cases)

## Worked boundary case

For points `[0, 2, 10, 12]` and initial centers `[0, 10]`, the first assignments are `{0, 2}` and `{10, 12}`. The updated centers are 1 and 11. Trace the next assignment and confirm that it remains unchanged.

## Trade-offs and failure scenarios

For squared Euclidean distance, the arithmetic mean minimizes a cluster's within-cluster squared error. That objective does not promise meaningful real-world groups. Unequal scales can dominate assignments, outliers can pull centers, and different initialization can reach different local solutions.

An empty cluster has no defined mean; choose and test a reseeding or retention policy. Bound iterations and record the stopping criterion. For n points, k centers, d coordinates, and i iterations, straightforward assignment costs O(i n k d), excluding initialization and implementation overhead.

## Exercises and interview review

Initialize both centers at the same location. Explain how deterministic tie-breaking can leave a cluster empty and how your implementation handles it.

<details>
<summary>Expected reasoning</summary>

If all equal-distance points choose the first center, the second receives none. Dividing its coordinate sum by zero is not a valid repair. Apply the documented empty-cluster policy, preserve a finite center, and check the result under the same stopping rule. Repeated initializations compare objective values, but do not prove a global optimum or semantic correctness.

</details>

**Recall cue:** assignment → mean → repeat → stopping and empty-cluster policy. Unlike k-NN, training labels are not supplied; cluster numbers are not semantic class names.

## References

- [scikit-learn: k-means clustering](https://scikit-learn.org/stable/modules/clustering.html#k-means).

**Next:** [Machine Learning Algorithms](../README.md).
