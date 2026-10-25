---
title: "Probability, data summaries, and conditional questions"
sidebar_label: "3. Probability and statistics"
sidebar_position: 3
---

# Probability, data summaries, and conditional questions

**Prerequisites:** [functions and gradients](./02-functions-and-gradients.md), fractions, lists, and the difference between missing and zero values.

An AI result is rarely useful without knowing how often it works and under which conditions. **Probability** describes uncertainty under a model of possible outcomes. **Statistics** uses observed data to summarize what happened and estimate what may happen elsewhere. An observed fraction is evidence about a probability, not a guarantee about the next case.

## Describe the data before judging it

The **population** is the full group you want to understand. A **sample** is the part you actually observe. Five volunteers from one class may not represent every learner using a course.

The **mean** adds values and divides by their count. The **median** is the middle value after sorting, or the mean of the two middle values when the count is even. A **distribution** describes how values are spread out. A single average hides that spread.

Consider study durations `[10, 10, 10, 10, 60]`. The mean is 20 minutes, but four of five sessions last 10 minutes. The median is 10. Neither number is “the true typical value” without deciding what question the summary should answer.

The **standard deviation** measures spread around the mean in the original units. The sample version uses a denominator of n − 1 in its variance calculation. A large spread means a mean alone is an incomplete description. Python provides these summaries in its [statistics module](https://docs.python.org/3/library/statistics.html).

```python runnable
from statistics import mean, median, stdev

durations = [10, 10, 10, 10, 60]
print(f"mean={mean(durations):.1f}")
print(f"median={median(durations):.1f}")
print(f"sample_sd={stdev(durations):.2f}")
errors_flagged = 18
all_flagged = 67
print(f"error among flagged={errors_flagged / all_flagged:.1%}")
```

```text output
mean=20.0
median=10.0
sample_sd=22.36
error among flagged=26.9%
```

## Calculate spread instead of only naming it

Take three study durations: 10, 20, and 30 minutes. Their mean is 20. Subtract the mean to get deviations −10, 0, and 10. Adding those deviations gives zero, even though the sessions differ. We need a measure that does not let positive and negative differences cancel.

Square the deviations to get 100, 0, and 100. Their sum is 200. **Variance** summarizes these squared deviations. If these three sessions are the whole population being described, divide by 3: population variance is about 66.67 square minutes. Its square root, about 8.16 minutes, is the population standard deviation.

If these sessions are a random sample used to estimate a larger population's variance, the usual sample formula divides by `n − 1`: here `200 / 2 = 100`, giving sample standard deviation 10 minutes. Estimating the mean from the same sample consumes one independent piece of information. The correction makes sample variance unbiased under the usual independent, identically distributed sampling assumptions; it does not fix an unrepresentative sample.

Do not confuse **spread of individual observations** with **uncertainty about their mean**. Gathering more independent observations can make the mean estimate more precise without making individual sessions more alike. The next lesson develops this distinction.

### Equal averages can hide different experiences

Two study groups both average 20 minutes. One has durations [19, 20, 21]; the other [1, 20, 39]. A planner needs the spread to allow enough time for individual learners. A funding report about total hours may primarily need the mean and count. The best summary depends on the decision.

**Try it:** one branch records 9 successful loans out of 10 attempts; another records 1 out of 2. What is the overall success rate? Is it the average of 90% and 50%?

<details>
<summary>Check the denominator</summary>

The overall rate is `(9 + 1) / (10 + 2) = 10/12`, about 83.3%. Averaging the two percentages gives 70%, which weights branches equally rather than attempts equally. Either weighting can answer a deliberately chosen question, but they are different questions.

</details>

## Keep the denominator attached to the question

An **event** is an outcome or set of outcomes of interest. Probabilities run from 0 through 1. If events are mutually exclusive and cover every possibility, their probabilities add to 1. A random variable assigns a number to an outcome; its **expected value** is a probability-weighted mean. It need not be a possible individual outcome: a fair six-sided die has expected value 3.5.

A **conditional probability** changes the group under consideration. Suppose a fictional checker reviews 1,000 records:

| Checker result | Actual error | Actually clean | Total |
| --- | ---: | ---: | ---: |
| Flagged | 18 | 49 | 67 |
| Not flagged | 2 | 931 | 933 |
| Total | 20 | 980 | 1,000 |

“Flagged given an error” is 18/20 = 90%. “An error given a flag” is 18/67, about 26.9%. Reversing the words changes the denominator. Errors are rare, so even a 5% false-flag rate among clean records produces many false alarms.

**Bayes' rule** expresses this relationship: `P(error | flag) = P(flag | error) × P(error) / P(flag)`. The vertical bar means “given.” The count table is often easier to inspect than the formula.

Two events are **independent** when learning one does not change the probability of the other. Do not multiply their separate probabilities unless that assumption is justified. Two errors from the same broken parser may be strongly related.

## Practice: a changing population

If the same checker is used on a dataset containing many more actual errors, must the fraction of flagged records that contain errors stay 26.9%? Also explain why a missing duration should not silently become a zero-duration session.

<details>
<summary>Check your answer</summary>

No. Even with unchanged error-detection and false-flag rates, the base rate of actual errors changes the mix among flagged records. Recompute the counts for the new population. A missing duration means it was not measured; replacing it with zero would pull the mean downward and change the question being answered.

</details>

## Tradeoffs and useful references

The mean includes every value and supports many later calculations, but extreme values can move it substantially. The median resists a few extremes but does not summarize their size. Report a count and spread alongside a central value when they affect the decision.

Correlation means two quantities vary together; it does not by itself show that changing one causes the other. The next lesson examines how an experiment can support a stronger claim. For deeper probability study, MIT's [Introduction to Probability and Statistics](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/) includes conditional probability, random variables, and inference.

## Depth lab: the denominator changes the question

A library has 100 members, 20 of whom borrowed a science book. Of those 20, five returned late. The observed rate “late among science borrowers” is 5/20. The rate “science borrower and late among all members” is 5/100. Neither equals “science borrower among late returners” unless you also know the total number of late returners.

Write a two-way count table before computing conditional rates. Missing cells represent missing evidence, not zero. **Independence** means a joint probability factors into the product of marginal probabilities. Zero correlation is weaker: a nonlinear relationship can have zero linear correlation.

### Implement a stable running summary

```python runnable
def mean_and_sample_variance(values):
    count, mean, m2 = 0, 0.0, 0.0
    for value in values:
        count += 1
        delta = value - mean
        mean += delta / count
        m2 += delta * (value - mean)
    if count < 2:
        raise ValueError("At least two observations required")
    return mean, m2 / (count - 1)

mean, variance = mean_and_sample_variance([2.0, 4.0, 6.0])
print(mean, variance)
```

```text output
4.0 4.0
```

This running calculation avoids storing the entire sequence and avoids the especially cancellation-prone “mean of squares minus square of mean” formula. It still uses finite-precision arithmetic. The denominator count−1 estimates sample variance under the usual sampling assumptions; using count describes the average squared deviation of the supplied finite population.

### Debug, optimize, and apply

A dashboard may average branch averages without weighting branch sizes. That estimates an average branch, not an average member. State the unit of analysis before interpreting either result. Inspect missingness, weighting, and duplicated observations when summaries disagree.

For production streams, preserve count, mean, and variance state with a version and unit. Handle empty and one-item inputs explicitly. Compare a streaming implementation with a batch oracle over ordinary and large-offset data, measuring both memory and numerical error.

<details>
<summary>Expert defense: does a large number of rows guarantee a precise estimate?</summary>

No. Rows may be repeated or strongly related, the sample may exclude important populations, and measurements may be biased. A million duplicated observations do not provide a million independent pieces of evidence. Identify the sampling unit and collection process before quoting uncertainty.

</details>

**Teach it:** have a learner fill the count table, name each denominator, and explain why spread among observations differs from uncertainty about their mean.

**Previous:** [Functions, slopes, and gradient-based improvement](02-functions-and-gradients.md) · **Next:** [Experiments, uncertainty, and an evidence-audit project](04-experiments-and-uncertainty.md)
