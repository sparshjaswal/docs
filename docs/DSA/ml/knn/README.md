---
id: dsa-ml-knn-readme
title: "k-Nearest Neighbors Algorithm"
slug: /DSA/ml/knn/README
sidebar_label: "k-Nearest Neighbors Algorithm"
---

# k-nearest neighbors

## Overview

k-nearest neighbors (k-NN) predicts a label from nearby labeled examples. Prerequisites: [Euclidean distance](../../math/euclidean-distance/README.md) and [sorting](../../sorting/README.md). This lesson owns the algorithmic trace; use the [AI validation lesson](../../../ai/machine-learning/07-validation-and-explanations.md) for a full evaluation workflow.

## Why it exists

For a small dataset, retaining examples and comparing a query with them can be a useful baseline. It avoids learning a complex model, but moves much of the work to prediction time.

## Mental model

Nearby examples vote under a chosen representation and distance rule. “Nearby” is an assumption about useful similarity, not proof that labels should match. Here `k` counts neighbors; in [k-means](../k-means/README.md), it counts clusters.

## Visual explanation

For a one-dimensional query at 1 and `k = 3`:

| Example position | Label | Absolute distance from 1 |
| --- | --- | --- |
| 0 | A | 1 |
| 2 | B | 1 |
| 3 | B | 2 |

All three vote, so B wins 2–1. With `k = 1`, the two nearest points are tied in distance; a stated tie policy is necessary. An odd `k` does not prevent a multiclass vote tie such as A, B, C.

## How it works

1. Validate dimensions, labels, and `1 ≤ k ≤ n`.
2. Apply the same feature transformation to stored examples and the query.
3. Compute distances and select k neighbors with a deterministic cutoff policy.
4. Aggregate their labels; define vote ties and optional distance weighting.
5. Return the prediction with the contract needed by its caller.

For n examples and d coordinates, a brute-force query computes distances in O(nd) arithmetic work. Fully sorting them adds O(n log n); retaining only the k best can change the selection cost. The stored training data still consumes space. Indexes have separate dimensionality and approximation trade-offs.

## Real-world example

Classify fruit by weight and sweetness. If weight is in grams and sweetness on a small scale, raw distance may mostly reflect weight. Decide the intended scaling, fit learned transformations on training data only, and evaluate on held-out examples.

## Trade-offs and failure scenarios

A small k follows local variation but can be sensitive to noise. A larger k smooths predictions while potentially ignoring a small meaningful group. Duplicate points, class imbalance, missing values, and outliers need explicit handling. More neighbors do not automatically produce a better model.

## Production considerations

Record feature definitions, training-data version, k, distance, and tie policy with the model. Measure query cost and held-out quality separately. Detect inputs outside the supported feature contract rather than silently coercing missing values into zero.

## Exercises

For neighbors with labels A, B, C at equal distances and `k = 3`, propose a deterministic tie rule. Then explain how you would choose k without repeatedly tuning it on the final test set.

<details>
<summary>Expected reasoning</summary>

An odd count can still tie across three classes. Choose a documented secondary criterion or report uncertainty; never let accidental input order define a hidden policy. Tune on training/validation splits and reserve the final test set for the final evaluation.

</details>

## Interview questions & answers

<details>
<summary>Does a small training phase imply cheap prediction?</summary>

No. A basic k-NN model stores examples; each query may compare against all of them. The work has moved rather than disappeared.

</details>

**Revision cues:** representation → distance → neighbors → vote → validation. **Key takeaways:** define ties, separate preprocessing from evaluation data, and measure the prediction workload.

## Further reading

- [scikit-learn: nearest neighbors](https://scikit-learn.org/stable/modules/neighbors.html).

**Next:** [k-means](../k-means/README.md).
