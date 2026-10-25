---
title: "Trust scores, thresholds, and forecasts"
sidebar_label: "8. Calibration and forecasting"
sidebar_position: 8
---

# Trust scores, thresholds, and forecasts

**Before this lesson:** [validation](./07-validation-and-explanations.md), [classification metrics](./04-classification-and-metrics.md), and [conditional probability](../mathematics/05-bayes-and-information.md).

Two models can make the same yes/no decisions but assign very different probabilities. If a library uses a probability to decide whether to send a reminder, the size of that probability matters.

## From a linear score to a probability

**Logistic regression** forms a weighted sum, then applies the **sigmoid** function: `p = 1 / (1 + exp(−score))`. A score of zero gives probability 0.5. Increasing the score increases the probability toward one. Training commonly minimizes binary cross-entropy, the negative log probability of the observed class. Despite its name, logistic regression is commonly used for classification.

It is a useful, interpretable baseline for roughly linear decision boundaries. A nearest-neighbor model instead predicts from nearby training examples; it needs a meaningful distance and can be expensive at prediction time. A support vector machine seeks a separating boundary with a wide margin; its score is not automatically a calibrated probability. Trees can capture nonlinear rules but also need probability checks. Choose with validation evidence, not a universal ranking of algorithms.

## Calibration asks whether probabilities match frequencies

A model is **calibrated** when, among comparable cases assigned probability 0.8, roughly 80% have the event. This is a population statement, not a promise about any one record.

Imagine four cases receive probability 0.9 and only two have the event. For this small group, observed frequency is 0.5. That is evidence of overconfidence, with substantial uncertainty because the group is tiny.

The **Brier score** averages squared differences between probabilities and binary outcomes. Lower is better. It measures more than calibration alone, so pair it with a reliability table that compares average probability and observed frequency in groups.

```python runnable
outcomes = [1, 0, 1, 0]
overconfident = [0.9] * 4
moderate = [0.5] * 4

def brier(probabilities, labels):
    return sum((p - y) ** 2 for p, y in zip(probabilities, labels)) / len(labels)

print(f"overconfident: {brier(overconfident, outcomes):.2f}")
print(f"moderate: {brier(moderate, outcomes):.2f}")
```

```text output
overconfident: 0.41
moderate: 0.25
```

Both systems can produce the same thresholded labels. Their probability quality differs. Do not tune a calibration map on the final test set. Reserve calibration data or use a suitable cross-validation procedure; then evaluate the complete fitted pipeline on untouched data. The [scikit-learn calibration guide](https://scikit-learn.org/stable/modules/calibration.html) describes reliability diagrams and calibration methods.

## Turn probabilities into decisions

Suppose a missed late return costs 4 fictional units and an unnecessary reminder costs 1. Under these simplified costs, sending a reminder has expected cost `(1 − p) × 1`; not sending it costs `p × 4`. Sending is cheaper when p is greater than 0.2.

This assumes the costs are meaningful and the probabilities describe the population. Also consider reminder capacity, user annoyance, and uneven errors across groups. Class imbalance makes accuracy especially misleading: predicting “ordinary” on every record can score well when the unusual event is rare.

Resampling can help a learner notice rare classes. Apply it within training folds, never before the split. It can change the effective class distribution, making later probability calibration important. Class weighting is another option; collecting better representative labels may be more valuable than either.

## Forecast only from information available at the time

A **time series** is a measurement ordered over time. A **lag** uses an earlier value as an input. A **forecast horizon** is how far ahead you predict. If you forecast Monday's loans on Sunday evening, Monday's actual weather or end-of-day count is unavailable.

Use a chronological split. In **rolling-origin evaluation**, repeatedly train on earlier history and evaluate on the next time window. A gap between windows can prevent overlap when labels or features span several days. [TimeSeriesSplit](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html) supports ordered folds; irregular timestamps still require care about what a row and test duration mean.

```python runnable
loans = [10, 12, 14, 16, 18, 20]
errors = []
for day in range(3, len(loans)):
    prediction = sum(loans[day - 3:day]) / 3
    errors.append(abs(prediction - loans[day]))
print(f"past-three-day baseline MAE: {sum(errors) / len(errors):.1f}")
```

```text output
past-three-day baseline MAE: 4.0
```

This rising fictional series exposes lag in a moving average. Compare with “yesterday again,” a weekly seasonal baseline, and a trend model before choosing a complex neural forecast. Evaluate the horizon your user needs; one-day quality does not establish one-month quality.

## Practice and project extension

A classifier has 99% accuracy on a dataset with 1% positive cases. A forecast uses tomorrow's total as an input. Explain why neither result establishes success.

<details>
<summary>Check your reasoning</summary>

The classifier might always choose the majority class; inspect recall, precision, calibration, and relevant decision costs. The forecast uses unavailable future information. Rebuild features as they existed at prediction time and repeat the chronological evaluation.

</details>

Extend the [prediction project](./07-validation-and-explanations.md) with a probability-quality or chronological-evaluation report. Keep the original baseline. Submit split dates, a feature-availability table, an error table, and one example where the more complicated candidate loses.

**Remember:** ranking, probability quality, and decision quality are different questions. Answer each with the right evidence.

## Depth lab: ranking, probability, and action can disagree

A strictly increasing transformation of scores preserves their ranking but can change calibration and every thresholded decision. A model assigning [0.6,0.8] and another assigning [0.9,0.99] order two cases identically; they make very different probability claims.

**Implement:** compute a reliability table containing bin count, mean predicted probability, and observed positive frequency. Test exact bin boundaries and empty bins. Pair it with Brier score and an appropriate ranking metric. Binning choices and small counts affect the picture; a smooth plot does not create evidence.

Calibrate using a separate permitted calibration partition or a suitable cross-validation procedure. Do not use the final test labels to fit the calibration map. Evaluate the full calibrated procedure, including the chosen action threshold.

### A time-series failure you can reproduce

A rolling mean calculated with a centered window includes future observations. It can look better than a past-only feature while being unavailable at prediction time. Build both on a tiny sequence and list exactly which timestamps contribute to each prediction.

Use the required forecast horizon and account for label availability. If the outcome spans the next seven days, adjacent rows may share future information; an appropriate split/gap must reflect that overlap. An irregularly sampled table needs duration-aware reasoning, not blind assumptions that one row equals one day.

### Production and optimization

Version calibration, threshold, feature timing, and model together. Monitor probability quality after enough outcomes arrive, with subgroup counts and uncertainty. Compare a seasonal baseline before deploying a complex forecasting system.

Optimize rolling features with incremental state only when they reproduce the declared window exactly. Test late data, missing periods, revisions, and restart recovery. A fast online aggregate can still leak future information if historical evaluation reconstructs it incorrectly.

<details>
<summary>Expert defense: does resampling the positive class preserve probabilities?</summary>

Changing the effective class distribution during training can change the relationship between scores and real-world event frequencies. Assess and, where appropriate, recalibrate on representative permitted data. A classifier's ranking improvement does not automatically validate its probability values.

</details>

**Teach it:** show two equally ranked score lists, then ask a learner to price a decision under each. Deliver a reliability table, a future-window counterexample, and a forecast evaluated at the intended horizon.

**Previous:** [Validate a model and finish the ML project](07-validation-and-explanations.md) · **Next:** [Build a neural network from small operations](../deep-learning/01-neural-networks.md)
