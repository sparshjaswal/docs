---
id: dsa-statistics-readme
title: "📈 Statistics"
slug: /DSA/statistics/README
sidebar_label: "Statistics"
---

# Statistics for algorithm experiments

Statistics helps describe variation and assess evidence. This section's worked algorithm is [weighted random selection](weighted-random/README.md); the broader explanation of probability belongs in [AI mathematics](../../ai/mathematics/03-probability-and-statistics.md). Prerequisites: [prefix sums](../prefix-sum/README.md) and [binary search](../binary-search/README.md).

## Mental model

Weights define relative chances, not a schedule. With weights `[1, 3]`, the second option has probability `3/4` on each independent draw under the model. Four draws need not contain exactly three selections of that option.

## Choose the check

| Concern | Useful check | Misleading check |
| --- | --- | --- |
| Range boundaries | Inject exact draws at every boundary | Hope random trials hit boundaries. |
| Invalid weights | Reject negative, non-finite, or all-zero weights | Divide by an invalid total and inspect the result. |
| Reproducibility | Record input, algorithm, and random source or seed | Treat two different random runs as identical workloads. |
| Long-run distribution | Use a planned statistical check with tolerances | Require exact expected counts from a small sample. |

## Real-world example

A background scheduler assigns work with weights 1 and 3. Random selection may produce a long streak for one worker. If the contract requires a bounded waiting time or exact short-window allocation, choose a scheduling policy designed for that requirement rather than assuming random sampling supplies fairness bounds.

## Exercises

For cumulative intervals `[0, 1)` and `[1, 4)`, assign draws `0`, `0.999`, `1`, and `3.999`. Then explain why a generator that can return the upper endpoint needs different handling.

<details>
<summary>Expected outcomes</summary>

The first two draws select the first option and the last two select the second. A draw of `4` is outside the stated half-open range. The implementation must preserve the random source's interval contract rather than assigning it accidentally. Deterministic boundary checks complement distribution checks.

</details>

## Interview questions & answers

<details>
<summary>Does a passing frequency test prove the sampler is correct?</summary>

No. It provides evidence about the tested distribution and sample size. A boundary bug or invalid-input bug may remain. Conversely, a correct sampler can produce an unusual sample, so statistical checks need a deliberate false-alarm policy.

</details>

**Revision checklist:** interval endpoints, weight validation, deterministic checks, randomness assumptions, and uncertainty. **Key takeaway:** separate exact invariants from probabilistic expectations.

**Next:** [Weighted random selection](weighted-random/README.md). [Return to DSA](../index.md).
