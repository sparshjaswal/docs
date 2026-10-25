---
title: "5. Machine learning and trustworthy evaluation"
sidebar_position: 5
---

# Machine learning and trustworthy evaluation

**Prerequisites:** modules 2–4: Python, mathematics, and data science. Follow the [core ML lessons](../machine-learning/01-problem-framing.md) in order; this guide connects them into a developer's project.

## What it is and why it matters

ML learns a mapping or structure from examples. The central challenge is generalization: performance on genuinely new cases. A model that memorizes an evaluation dataset has not solved that challenge. Define the decision, prediction time, available information, and loss before selecting an algorithm.

## Learn in this order

### Regression and classification

Regression predicts a quantity; classification predicts a category or score used to choose a category. Start with a constant baseline, linear regression, logistic regression, nearest neighbors, and simple trees. Then learn support-vector machines, random forests, and gradient boosting.

Linear models offer useful simplicity; trees capture interactions without assuming a straight-line relationship. More flexible models can fit complex patterns and noise. Compare methods under the same split and tuning budget. Use [regression](../machine-learning/03-regression-and-optimization.md) and [classification metrics](../machine-learning/04-classification-and-metrics.md).

**Practice:** predict ticket resolution time and ticket urgency as separate tasks. Compare mean/majority baselines with linear and tree models. State why the labels and losses differ.

### Feature engineering and preprocessing

Features represent information available at prediction time. Learn scaling, categorical encoding, missing-value indicators, transformations, interactions, and text features. Target encoding requires careful out-of-fold construction; otherwise labels can leak into the inputs.

Put transformations and the estimator in a fitted pipeline. Fit each transformation only on the training partition inside cross-validation. A feature recording “refund issued” cannot be used to predict whether a new ticket will need a refund when that event is still in the future.

**Practice:** deliberately add a post-outcome feature and observe the inflated score. Remove it and document the prediction-time contract.

### Clustering, recommendations, and unusual cases

Clustering groups examples according to a representation and distance. Study K-means, hierarchical clustering, and density-based clustering; compare their assumptions and handling of noise. A cluster is not automatically a meaningful business category.

Recommendations rank items for a user or context. Begin with popularity and content similarity, then study collaborative filtering and matrix factorization. Evaluate against a time-appropriate split and consider cold-start users. Anomaly detection identifies unusual patterns; unusual does not always mean harmful.

**Practice:** group tickets by text features, inspect representatives, and name where the groups fail. Build a popularity baseline before adding personalized ranking.

### Model evaluation, calibration, and selection

Use training data to fit, validation data to choose, and held-out test data for a final assessment. Use grouped splits for related users and time splits for forecasting. Learn cross-validation, hyperparameter search, regularization, bias–variance tradeoffs, learning curves, and uncertainty over repeated runs.

For regression, compare MAE and RMSE; large errors influence them differently. For classification, inspect precision, recall, F1, ROC/PR curves, class counts, and a threshold chosen for the actual error costs. For probability outputs, assess calibration. Ranking needs ranking metrics. Use [validation](../machine-learning/07-validation-and-explanations.md) and [calibration and time](../machine-learning/08-calibration-and-time.md).

**Practice:** choose a threshold using a stated review capacity, then evaluate it once on the reserved set. Report useful results per reviewer-hour, not only a model score.

### Interpretability and the limits of a prediction

Inspect coefficients, permutation importance, error slices, and local explanations where appropriate. Correlated features can make individual importance unstable. Explaining a prediction does not establish a causal relationship or justify a decision's fairness.

**Practice:** remove one feature family and retrain. Compare the new score with its claimed importance. Add a failure report for the smallest supported group rather than hiding it in an average.

## Mastery lab: choose a decision threshold from costs

A classifier score is not yet a business action. If a false negative costs five units and a false positive costs one, compare candidate thresholds using `5*FN + FP` on validation data. The cost model is an assumption to discuss with the decision owner, not a universal metric.

```python runnable
scores = [0.9, 0.7, 0.6, 0.4, 0.2]
labels = [1, 0, 1, 1, 0]
for threshold in [0.5, 0.3]:
    predicted = [int(s >= threshold) for s in scores]
    fp = sum(p == 1 and y == 0 for p,y in zip(predicted,labels))
    fn = sum(p == 0 and y == 1 for p,y in zip(predicted,labels))
    print(threshold, fp, fn, 5*fn+fp)
```

```text output
0.5 1 1 6
0.3 1 0 1
```

The lower threshold wins on these five validation examples. That does not prove it wins in the population. Lock the choice before using a reserved test set; report counts and uncertainty. If each positive prediction consumes a review slot, also evaluate review capacity. This connects model quality to an operational decision.

### Implement the important families

For regression, derive and implement a linear model's loss and gradients. For classification, implement a numerically stable sigmoid and binary loss, then compare predictions with a trusted implementation on tiny data. For a tree, enumerate candidate splits and verify the weighted impurity calculation. For clustering, implement assignment and centroid updates, including an empty-cluster policy. For feature engineering, implement a fitted transform whose training statistics are reused unchanged at prediction time.

The [core ML sequence](../machine-learning/01-problem-framing.md) supplies the worked calculations and runnable examples. Extend each with a deliberately misleading dataset: a post-outcome feature, an unseen category, an extreme scale, or a related user appearing in both partitions.

### Debug, optimize, and design the release

| Observation | First hypothesis to test | Evidence |
| --- | --- | --- |
| Near-perfect validation, poor new-user results | Related entities cross partitions. | Re-evaluate with a group split. |
| Good offline scores, wrong production predictions | Feature meaning or preprocessing differs. | Replay identical raw records through both paths. |
| Good overall accuracy, missed rare events | Majority class dominates the denominator. | Confusion counts and class-specific recall. |
| Correct ranking, misleading confidence | Scores are poorly calibrated. | Reliability comparison on held-out cases. |

A production artifact includes the fitted preprocessing, estimator, feature schema, threshold, data references, and evaluation report. Release those as a compatible unit. Monitor inputs immediately and outcomes when labels become available; prediction drift alone does not prove accuracy drift.

Optimize the measured bottleneck: vectorize transforms, batch appropriate requests, or choose a smaller model while checking the same quality slices. Use a simple baseline when it meets the requirement. Follow the [scikit-learn leakage and preprocessing guidance](https://scikit-learn.org/stable/common_pitfalls.html) when moving from the educational implementation to a maintained pipeline.

**Interview defense:** explain why cross-validation cannot rescue a feature that contains future information. Then describe an online/offline feature contract and a test that would detect a violation.

**Teach it:** have a learner choose the threshold before revealing the costs, then after. Ask them to explain why accuracy and decision value disagree. Submit the threshold report, leakage fixture, reproducible model, and rollback decision.

## Mini project and real-world use

Build a ticket-triage model and a review UI. Keep a deterministic fallback, a confidence or abstention policy, and human corrections separate from the original labels. Use a simple model before a neural network.

Real uses include demand prediction, churn analysis, fraud screening, search ranking, and quality inspection. A forecast's accuracy does not alone tell you whether acting on it improves an outcome.

**Completion evidence:** dataset contract, leakage audit, at least two baselines, fitted pipeline, locked test split, uncertainty or repeated-run report, and error analysis.

## Interview questions

1. Why is logistic regression a classifier despite its name?
2. How can cross-validation still leak information?
3. Why can an imbalanced classifier have high accuracy and be useless?
4. What does calibration measure that ranking metrics do not?
5. How would you evaluate a recommender for new users?
6. Why does feature importance not establish causality?

## Curated resources

- **Course:** [Stanford CS229's archived public materials](https://cs229.stanford.edu/materials.html-full) for mathematical foundations; use the introductory [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course) first if needed. Current university-only materials are not required for this roadmap.
- **Book:** [An Introduction to Statistical Learning](https://www.statlearning.com/), including the Python edition, for modeling and evaluation.
- **Paper:** [A Few Useful Things to Know about Machine Learning](https://doi.org/10.1145/2347736.2347755), Pedro Domingos, for generalization and practical mistakes.
- **GitHub:** [scikit-learn](https://github.com/scikit-learn/scikit-learn); focus on examples, pipelines, and model-selection tests.

**Previous:** [Data science](04-data-science.md) · **Next:** [Deep learning](06-deep-learning.md).
