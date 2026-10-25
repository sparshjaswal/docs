---
title: "Linear transformations and useful compression"
sidebar_label: "6. Transformations and compression"
sidebar_position: 6
---

# Linear transformations and useful compression

**Before this lesson:** [vectors and matrices](./01-vectors-and-matrices.md), [means and spread](./03-probability-and-statistics.md), and [information](./05-bayes-and-information.md).

A matrix can describe a transformation: a consistent way to turn one vector into another. Doubling every horizontal coordinate and keeping vertical coordinates unchanged stretches a picture sideways. The matrix `[[2, 0], [0, 1]]` performs that transformation.

## Independence and rank

Suppose two columns contain distance in kilometres and metres. The second is exactly 1,000 times the first. Two columns are stored, but they supply only one independent direction of information. **Rank** counts the independent directions a matrix contains.

Low rank can arise from redundant measurements. It can also be a useful approximation: perhaps hundreds of preferences are mostly explained by a few underlying patterns. Compression can save memory, but discarding a direction can discard an important rare case.

An **eigenvector** is a nonzero direction that a square matrix scales without changing its line. The scaling factor is its **eigenvalue**. For the stretch above, `[1, 0]` is scaled by 2, and `[0, 1]` by 1. A negative eigenvalue would also reverse direction. Not every real matrix has a full set of real eigenvectors, so do not treat this simple picture as a universal decomposition.

## A projection keeps part of a vector

A **unit vector** has length one. To project a vector x onto a unit direction u, compute its dot product with u, then multiply u by that scalar. This keeps the component along u and removes the perpendicular component.

```python runnable
import math

direction = [1 / math.sqrt(2), 1 / math.sqrt(2)]
point = [3.0, 1.0]
coordinate = sum(x * u for x, u in zip(point, direction))
reconstructed = [coordinate * u for u in direction]
error = sum((x - r) ** 2 for x, r in zip(point, reconstructed))
print([round(x, 2) for x in reconstructed])
print(f"squared reconstruction error: {error:.1f}")
```

```text output
[2.0, 2.0]
squared reconstruction error: 2.0
```

The original two-number point becomes one coordinate along a diagonal. Reconstructing gives [2, 2], not [3, 1]. Compression is visible as a measurable error.

## PCA chooses directions from data

**Principal component analysis**, or **PCA**, finds perpendicular directions that retain as much variation as possible for a chosen number of components. First subtract each feature's mean. This **centering** places the average at zero. Then identify the direction of greatest spread, followed by directions perpendicular to those already chosen.

The **covariance matrix** summarizes how pairs of centered features vary together. Its eigenvectors give PCA directions; eigenvalues describe their variance. **Singular value decomposition**, or **SVD**, expresses a rectangular matrix using two sets of perpendicular directions and nonnegative scale factors. It offers another way to compute PCA and many low-rank approximations.

These are descriptions, not instructions to implement a numerically robust eigensolver yourself. In applications, use tested numerical libraries and inspect their assumptions.

```mermaid
flowchart LR
  accTitle: Compress a table and measure what is lost
  accDescr: Center the table using saved means, project onto selected directions, reconstruct approximate rows, and compare with the original centered values.
  A["Table with named features"] --> B["Subtract saved means"]
  B --> C["Project onto a few directions"]
  C --> D["Store fewer coordinates"]
  D --> E["Reconstruct and measure error"]
```

## When compression helps and when it hurts

PCA can reduce correlated inputs, support a two-dimensional plot, or reduce storage. It may fail when a low-variance feature is crucial to the decision. For example, a rare warning flag varies little but can matter more than the common range of page counts.

Scale also matters. A feature measured in thousands may dominate one measured in tenths. Decide whether to standardize features by their spread, and document why. Learn means, scales, and directions from development data only; the coming [data split lesson](../machine-learning/02-data-and-features.md) explains how to protect final evaluation data.

Alternatives include keeping original features, selecting a meaningful subset, or using a nonlinear model. PCA components mix original columns, which can make explanations harder. A two-dimensional cluster picture is not proof that categories are objectively separate.

## Practice and checkpoint

A dataset stores price in dollars, price in cents, and publication year. How many independent columns can it have? If you keep only the direction of largest variance, is the result guaranteed to preserve book-category information?

<details>
<summary>Check your reasoning</summary>

At most two columns are independent because cents is determined by dollars. There may be fewer if year also follows an exact dependency. Largest variance does not mean greatest usefulness for category prediction. Test the downstream task, including rare categories.

</details>

**Project extension:** construct ten two-dimensional points near a line. Project them onto a unit direction of your choice, reconstruct them, and report average squared reconstruction error. Compare with a perpendicular direction. Explain why you have demonstrated a projection, not automatically learned PCA.

**Remember:** name what a transformation preserves and what it loses. MIT's [linear algebra materials](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/) provide a deeper mathematical route after this introduction.

## Depth lab: learn one principal direction from scratch

Projection onto a chosen direction is not learned PCA. To learn a direction, center the data, form its covariance matrix, and find a direction with high variance. For a small positive-semidefinite covariance matrix, **power iteration** repeatedly multiplies a trial vector by the matrix and normalizes it. Under suitable conditions, including overlap with a dominant eigendirection, it converges toward a dominant direction.

```python runnable
import math
points = [[1.0, 1.0], [2.0, 2.0], [3.0, 3.0]]
means = [sum(row[j] for row in points)/len(points) for j in range(2)]
centered = [[row[j]-means[j] for j in range(2)] for row in points]
covariance = [[sum(row[i]*row[j] for row in centered)/len(centered)
               for j in range(2)] for i in range(2)]
direction = [1.0, 0.0]
for _ in range(8):
    product = [sum(row[j]*direction[j] for j in range(2))
               for row in covariance]
    norm = math.sqrt(sum(value*value for value in product))
    if norm == 0:
        raise ValueError("No direction found from this starting vector")
    direction = [value/norm for value in product]
variance = sum(direction[i]*covariance[i][j]*direction[j]
               for i in range(2) for j in range(2))
print([round(value, 3) for value in direction])
print(f"variance: {variance:.3f}")
```

```text output
[0.707, 0.707]
variance: 1.333
```

Here all centered points lie on one diagonal, so one component retains all their variation. The covariance uses division by n; using n−1 changes eigenvalues but not directions for this dataset.

### Debug and optimize

Test constant data, a starting vector orthogonal to the leading direction, repeated top eigenvalues, and strongly differently scaled features. Sign is arbitrary: u and −u describe the same one-dimensional subspace. Comparing direction vectors by exact sign can falsely report failure. Compare reconstruction or subspace behavior instead.

Power iteration teaches one mechanism, not a robust general SVD implementation. Production PCA should use tested numerical routines and version the means, scales, component directions, and feature order. Fit these using training data only. Measure reconstruction error and downstream task quality; a low-variance signal can still be essential for a rare outcome.

<details>
<summary>Expert defense: why not keep the highest-variance component automatically?</summary>

Variance describes input spread, not relevance to a target or decision. A rare indicator may have low variance and high task value. Select compression using the intended evaluation and operational memory/latency constraints, while retaining an uncompressed baseline.

</details>

**Teach it:** contrast a hand-chosen projection with the learned direction above. Ask a learner to predict the effect of multiplying one feature by 1,000 and explain whether scaling should be part of the contract.

**Previous:** [Update beliefs and measure information](05-bayes-and-information.md) · **Next:** [Frame a problem before choosing a model](../machine-learning/01-problem-framing.md)
