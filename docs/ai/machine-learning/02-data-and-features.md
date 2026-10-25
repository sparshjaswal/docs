---
title: "Build features without leaking the answer"
sidebar_label: "2. Build features without leaking the answer"
sidebar_position: 2
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Build features without leaking the answer

**Before this lesson:** [Frame a problem before choosing a model](01-problem-framing.md).

A training table is a collection of examples, but each row also represents a moment in a real process. Before cleaning data, identify when the prediction happens and what information exists then. **Data leakage** occurs when information unavailable for the intended prediction influences training or evaluation, making results misleadingly good.

For the delivery task, planned distance is available at dispatch. The driver's final route, actual arrival time, and a later complaint are not. A column can look harmless while still containing the answer indirectly.

## Give the partitions different jobs

A **training set** fits model parameters and preprocessing. A **validation set** helps choose features, model settings, or a decision threshold. A **test set** is reserved for a final assessment after those choices are fixed. Parameters are values the model learns; settings you choose, such as tree depth, are **hyperparameters**.

<AlgorithmWalkthrough name="aiDataSplit" />

Choose the split to match the question. For future deliveries, reserve later time periods. If several rows belong to the same customer or device, consider keeping that group together when you need performance on new groups. A random row split can place nearly identical observations on both sides. Fit preprocessing using the training partition only. If you repeat the comparison with different partitions, refit preprocessing using only the training portion of each split. [Scikit-learn leakage guidance](https://scikit-learn.org/stable/common_pitfalls.html#data-leakage).

## Turn raw values into model inputs

**Preprocessing** prepares raw data for a model. A missing-value strategy might fill a numeric column with its training median and add a flag saying it was missing. A categorical column, such as vehicle type, can use **one-hot encoding**: one indicator per known category. Define what happens to a category absent from training.

**Standardization** subtracts a training mean and divides by a training standard deviation. This puts differently scaled numeric features on more comparable scales for methods that depend on distance or gradients. It does not make a variable meaningful or normally distributed.

```python runnable
import math

training = [2.0, 4.0, 6.0]
mean = sum(training) / len(training)
scale = math.sqrt(sum((x - mean) ** 2 for x in training) / len(training))
validation_value = 8.0
print(f"Training mean: {mean:.1f}")
print(f"Transformed validation value: {(validation_value - mean) / scale:.3f}")
```

```text output
Training mean: 4.0
Transformed validation value: 2.449
```

The value 8 does not change the mean or scale. At deployment, use those saved training statistics again. Handle constant features explicitly because their standard deviation is zero. Missing values need their own policy before arithmetic.

## Inspect the meaning as well as the type

A **schema** describes expected fields and types. Add units, allowable ranges, and timing to that contract. A distance of 10 means something different in kilometers and miles. A numeric customer ID is an identifier, not necessarily a quantity with meaningful distances between IDs.

For one dispatch, write an audit row: source system, feature name, event time, availability time, and reason it is available. Join histories only up to the prediction cutoff. A correct SQL join can still leak future information if its time condition is wrong.

A model also depends on **labels**, the observed outcomes used as targets. Check inconsistent definitions, delayed labels, and who is missing from the data. Rows from only successful deliveries cannot by themselves teach the frequency of canceled jobs.

## Common mistakes

- Filling missing values or selecting features using the whole dataset before splitting.
- Keeping duplicate images or repeated records across partitions.
- Using a future aggregate, such as a customer's lifetime total, for an earlier prediction.
- Cleaning training data one way and live requests another way.

A reusable pipeline stores the preparation steps with the model. It helps keep the sequence consistent; it cannot repair an incorrectly defined prediction time.

## Practice

A dataset contains `planned_km`, `arrival_timestamp`, `vehicle_type`, and `customer_total_deliveries` calculated today. Which fields need investigation for a prediction made last month? What should happen to a vehicle category not seen during training?

<details>
<summary>Check your reasoning</summary>

Arrival is unavailable at dispatch and must not be an input. Today's customer total may include later deliveries; reconstruct it as of last month's cutoff. Planned distance and vehicle type still need source and availability checks. Choose an explicit unknown-category policy, such as a reserved unknown category; do not silently change the model's input layout.

</details>

---

## Depth lab: fit and transform are different operations

A transformation learns statistics from training data, then applies them unchanged to validation and serving data. Recomputing the mean for each incoming request changes the meaning of the features and can erase the signal.

```python runnable
import math

class Standardizer:
    def fit(self, values):
        if not values:
            raise ValueError("Training data required")
        self.mean = sum(values)/len(values)
        variance = sum((x-self.mean)**2 for x in values)/len(values)
        self.scale = math.sqrt(variance) or 1.0
        return self
    def transform(self, values):
        return [(x-self.mean)/self.scale for x in values]

transform = Standardizer().fit([2.0, 4.0, 6.0])
saved_mean = transform.mean
print(round(transform.transform([8.0])[0], 3))
assert transform.mean == saved_mean
print(Standardizer().fit([5.0, 5.0]).transform([5.0, 7.0]))
```

```text output
2.449
[0.0, 2.0]
```

The constant-feature policy uses scale one. That avoids division by zero, but a future value of seven still signals a change from the constant training value. A real pipeline also validates dimensions, finite values, feature names, and fitted state.

### Debug a hidden time leak

A transaction's event timestamp is Monday, but it was ingested Wednesday. A Tuesday prediction could not have used it, even though its event time is earlier. Store both event and availability times when reconstructing historical features. Test a late-arriving record and a future aggregate.

Use grouped or chronological partitions matching the intended claim. Fit imputers, encoders, feature selectors, and resampling inside each training fold. A pipeline object organizes steps; it cannot infer that a feature contains future information.

### Optimize and deploy the same meaning

Save preprocessing with the estimator and feature schema. Replay identical raw inputs through offline and serving paths and compare intermediate features. Cache expensive transforms only when keys include all relevant inputs and revisions. Measure conversion, joins, and model inference separately; an unnecessarily repeated feature lookup may dominate latency.

<details>
<summary>Expert defense: can an unsupervised transform leak evaluation information?</summary>

Yes. Learning scales, vocabulary, components, or feature-selection statistics from evaluation records exposes information about that population even without labels. Fit on the permitted training partition, then apply unchanged. The evaluation protocol determines which information is legitimate.

</details>

**Teach it:** ask a learner to transform eight with the saved mean, then mistakenly refit on [8]. Explain why the second procedure returns a different meaning. Keep leakage fixtures and a saved-pipeline round trip.

**Previous:** [Frame a problem before choosing a model](01-problem-framing.md) · **Next:** [Fit a regression model with gradients](03-regression-and-optimization.md)
