---
id: dsa-ml-readme
title: "🤖 Machine Learning Algorithms"
slug: /DSA/ml/README
sidebar_label: "Machine learning"
---

# Machine learning algorithms: distance and grouping

These DSA lessons focus on the mechanics and cost of two distance-based algorithms. For the full modeling lifecycle, use the canonical [AI machine-learning track](../../ai/machine-learning/01-problem-framing.md). Prerequisites: [arrays](../Array/README.md), [Euclidean distance](../math/euclidean-distance/README.md), and averages.

## Choose the problem

| Question | Method | Required input | Result |
| --- | --- | --- | --- |
| What label resembles nearby labeled examples? | [k-nearest neighbors](knn/README.md) | Measurements and known labels | A predicted label or value |
| How can unlabeled points be grouped around centers? | [k-means](k-means/README.md) | Measurements and a chosen cluster count | Assignments and centers |

The letter `k` means different things: neighbors consulted in k-NN, clusters formed in k-means. Neither method discovers the intended meaning of a distance function by itself.

## How to study the mechanisms

Trace a one-dimensional example by hand before adding coordinates. For k-NN, write distances, select neighbors, and apply a stated voting rule. For k-means, write assignments and new averages, then repeat. The linked lessons own those traces.

## Failure and production reasoning

A feature measured in thousands can dominate another measured in fractions. Scaling may change the meaning of “nearby”; fit any learned scaling parameters on training data rather than leaking evaluation data into the model. Missing values, duplicate points, outliers, and ties need policies.

Brute-force neighbor search computes distances against stored examples. More dimensions and records increase that work; an index is an optimization with its own assumptions. k-means can reach different solutions from different initial centers. Record initialization, stopping criteria, and validation evidence rather than declaring one run universally best.

## Exercise and interview review

Compare fruit using weight in grams and sweetness on a small rating scale. Multiply only the weight column by 1,000. Should the predictions stay the same? Explain what the answer says about the representation.

<details>
<summary>Expected reasoning</summary>

Unadjusted Euclidean distances generally change because the weight difference becomes more influential. Unit conversion should not silently change the intended similarity rule. Choose a transformation based on the domain and fit learned transformations using training data only; then validate on held-out examples.

</details>

**Interview cue:** why does an odd neighbor count not eliminate every tie? With multiple classes, three neighbors can vote for three different labels; equal distances at the cutoff also need a rule.

**Key takeaways:** labels distinguish prediction from clustering, distance embeds assumptions, and evaluation is separate from executing an algorithm.

**Next:** [k-nearest neighbors](knn/README.md), then [k-means](k-means/README.md). For model evaluation, continue with [validation and explanations](../../ai/machine-learning/07-validation-and-explanations.md).
