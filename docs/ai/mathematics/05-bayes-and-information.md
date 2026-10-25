---
title: "Update beliefs and measure information"
sidebar_label: "5. Bayes and information"
sidebar_position: 5
---

# Update beliefs and measure information

**Before this lesson:** [probability](./03-probability-and-statistics.md), [logarithms](./02-functions-and-gradients.md), and [fair experiments](./04-experiments-and-uncertainty.md).

A signal changes what we believe, but a useful signal is not perfect proof. Suppose a library checks whether book records have duplicate entries. Only a small fraction really are duplicates. Even a fairly accurate detector may produce many false alarms because most entries are ordinary records.

## Bayes' rule is careful counting

Imagine 1,000 records. There are 10 true duplicates and 990 ordinary records. A detector flags 8 duplicates and 99 ordinary records. Among its 107 flags, only 8 are true duplicates: about 7.5%.

The **prior probability** is the probability before the new evidence: 10/1,000. The **likelihood** asks how often the evidence appears under a particular case: the detector flags 8/10 duplicates. The **posterior probability** is the updated probability after seeing the evidence: 8/107.

Using D for duplicate and F for flag:

`P(D | F) = P(F | D) × P(D) / P(F)`

The vertical bar means “given.” The denominator includes **all** ways to get a flag, including flags on ordinary records. Swapping `P(F | D)` with `P(D | F)` is the mistake this calculation prevents.

```python runnable
prior = 0.01
flag_if_duplicate = 0.8
flag_if_ordinary = 0.1
flag_rate = prior * flag_if_duplicate + (1 - prior) * flag_if_ordinary
posterior = prior * flag_if_duplicate / flag_rate
print(f"duplicate given flag: {posterior:.3f}")
```

```text output
duplicate given flag: 0.075
```

This assumes these rates apply to the new records. If the collection changes, old rates may no longer describe it. Counting a relevant sample is often more useful than expressing false precision with many decimal places.

## Expectation: average a possible future

An **expected value** multiplies each possible value by its probability and adds the products. If a book lookup takes 1 second with probability 0.8 and 6 seconds with probability 0.2, the expected time is `1 × 0.8 + 6 × 0.2 = 2` seconds. No individual request needs to take exactly 2 seconds.

Expected cost helps compare actions with different outcomes. It does not describe the worst case. A system with a good average can still have an unacceptable slow tail. We will use both average and tail measurements in production lessons.

## Surprising events carry more information

If a predicted event has probability p, its **surprisal** in bits is `−log₂(p)`. The subscript 2 means a logarithm with base two. Probability 1 gives zero surprise; probability 1/2 gives one bit; probability 1/8 gives three bits.

**Entropy** is the expected surprisal under a probability distribution. A fair two-sided choice has one bit of entropy. A certain outcome has zero. Here entropy describes uncertainty in the chosen distribution; it is not a measure of whether a statement is true.

**Cross-entropy** measures surprise when events from one distribution are scored using another distribution's probabilities. If the observed next word is “book” and your model gives it probability 0.25, its negative log probability is a penalty. Increasing its probability lowers that penalty. Later language-model training averages this kind of penalty across tokens.

```python runnable
import math

def entropy(probabilities):
    return sum(-p * math.log2(p) for p in probabilities if p > 0)

print(f"fair choice: {entropy([0.5, 0.5]):.1f} bits")
print(f"certain choice: {entropy([1.0, 0.0]):.1f} bits")
print(f"surprise at probability 0.25: {-math.log2(0.25):.1f} bits")
```

```text output
fair choice: 1.0 bits
certain choice: 0.0 bits
surprise at probability 0.25: 2.0 bits
```

Natural logarithms measure the same idea in **nats** instead of bits. State which convention your loss uses. A zero probability for an observed event produces an infinite theoretical penalty; careful numerical implementations work with stable log probabilities rather than blindly computing `log(0)`.

## Advantages, alternatives, and limits

Bayesian reasoning makes assumptions and base rates explicit. A full Bayesian model can represent uncertainty about its parameters, but choosing priors and computing updates may be hard. A direct empirical frequency table is a useful first alternative when sufficient relevant examples exist.

Cross-entropy rewards probability quality rather than just the winning label. Accuracy counts only whether a decision was right. Neither replaces a task-specific check: a low text-prediction loss does not prove that an answer is supported by a source.

## Practice and checkpoint

The detector now examines a collection where half of all records are duplicates. Its conditional flag rates stay 0.8 and 0.1. What fraction of flags are genuine? Why did the answer change?

<details>
<summary>Check your reasoning</summary>

The probability is `0.5 × 0.8 / (0.5 × 0.8 + 0.5 × 0.1) = 8/9`, about 88.9%. The detector's conditional behavior did not change, but the base rate did. Report the population when reporting a detector's useful precision.

</details>

**Project extension:** add a frequency table, a base-rate sensitivity calculation, and an uncertainty statement to the [math comparison project](./04-experiments-and-uncertainty.md). Explain which rates were measured and which were hypothetical.

**Remember:** condition in the right direction; keep all routes to the evidence in the denominator; and distinguish a probability score from a verified fact.

## Depth lab: derive odds updates and probability penalties

Bayes' rule can be written in odds form. Prior odds are `p/(1-p)`. For a positive signal, multiply by the likelihood ratio `P(signal|event)/P(signal|no event)` to obtain posterior odds, then convert odds o back to probability `o/(1+o)`. This is the same counting rule in a useful algebraic form.

Using the earlier detector, prior odds are 0.01/0.99 and the likelihood ratio is 0.8/0.1=8. Posterior odds are about 0.0808, giving probability about 0.0748. A large likelihood ratio can still leave a low posterior when the base rate is very small.

### Implement and compare distributions

For distributions p and q on the same outcomes, cross-entropy is `-sum(p*log(q))` and entropy is `-sum(p*log(p))`. Their difference is KL divergence `sum(p*log(p/q))`. Terms where p is zero contribute zero; if p is positive and q is zero, the theoretical penalty is infinite.

```python runnable
import math
p, q = [0.75, 0.25], [0.5, 0.5]
entropy = -sum(a*math.log2(a) for a in p)
cross_entropy = -sum(a*math.log2(b) for a,b in zip(p,q))
kl = sum(a*math.log2(a/b) for a,b in zip(p,q))
print(f"entropy: {entropy:.3f}")
print(f"cross-entropy: {cross_entropy:.3f}")
print(f"KL: {kl:.3f}")
assert abs(cross_entropy - entropy - kl) < 1e-12
```

```text output
entropy: 0.811
cross-entropy: 1.000
KL: 0.189
```

### Debug and apply

Validate that values are finite, nonnegative, normalized, and aligned to the same outcome labels before comparing distributions. Accidentally permuting labels can produce a plausible but meaningless loss. KL is generally asymmetric; it is not a symmetric geometric distance.

In a production model, compare the probability distribution with observed outcomes and the actual decision cost. Low cross-entropy does not establish factual support, fairness, or useful behavior. Use stable log-probability implementations for extreme scores rather than exponentiating and then taking logs unnecessarily.

<details>
<summary>Expert defense: can two independent-looking signals simply multiply their likelihood ratios?</summary>

Only under the required conditional assumptions or with the correct joint likelihood. Two detectors using the same underlying evidence can be strongly dependent. Multiplying marginal likelihood ratios can double-count evidence and create unjustified confidence.

</details>

**Teach it:** derive the detector posterior by counts and by odds. Then show two duplicated signals and ask why repetition is not new independent evidence. Keep both implementations and invalid-distribution tests.

**Previous:** [Experiments, uncertainty, and an evidence-audit project](04-experiments-and-uncertainty.md) · **Next:** [Linear transformations and useful compression](06-transformations-and-compression.md)
