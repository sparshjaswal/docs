---
title: "AI Researcher studio: reproduce, question, extend"
sidebar_label: "AI Researcher"
sidebar_position: 6
pagination_prev: ai/careers
pagination_next: null
---

# AI Researcher studio: reproduce, question, extend

**Entry:** the shared curriculum and [capstone brief](../careers.md), especially [paper reading](../research/01-papers-and-experiments.md), [training scale](../research/02-training-at-scale.md), and [defensible experiments](../research/04-causal-and-reproducible-studies.md).

**Research question:** does adding a meaningful feature improve a predictor on new examples under a fixed training budget? This modest question is deliberately small enough to investigate thoroughly.

## Select a claim you can actually test

Start from the [feature experiment](../research/03-research-directions.md). Write the claim in one sentence. Name the population, baseline, intervention, metric, and resource constraint. “Our method is better” is not precise enough.

For a paper-based extension, choose one bounded claim whose data and compute are accessible. Read the method, evaluation protocol, and limitations before attempting to reproduce a headline. Record which parts you can reproduce and which remain outside the experiment.

## Build the reproduction package

Freeze data splits, implementation revision, dependencies, hyperparameters, seeds, and hardware description. Save raw per-example predictions and a command that generates every reported table. Run the unmodified baseline first.

If the reference implementation is unavailable, label your work a reimplementation and list interpretation choices. A discrepancy may come from data processing, hidden selection, implementation details, or randomness. Investigate before claiming that a paper is wrong.

## Add one falsifiable extension

A **falsifiable hypothesis** names evidence that could show it is wrong. For example: “A lagged borrowing feature improves next-week MAE on two held-out terms compared with the same model and budget without that feature.”

Compare the useful feature with a shuffled version and an irrelevant random feature. The shuffled condition tests whether the relationship matters, while the random condition exposes accidental selection or leakage. Keep preprocessing inside the development procedure.

Use matched compute where possible. If your candidate uses twice as many training steps, report that fact and compare a baseline given the same budget.

## Report uncertainty and negative results

Repeat the training randomness relevant to the method. Pair comparisons on the same evaluation units. If several records belong to one school, consider school-level uncertainty. Report the unit and why it is appropriate.

Distinguish an effect from its explanation. A gain from a new feature does not prove a causal effect of the real-world quantity it measures. Observational prediction and intervention are different claims.

Write a limitations section with consequences: “Only one city was sampled, so the result does not establish performance in other regions.” Avoid generic sentences that leave the reader unsure what changes.

## A research report skeleton

| Section | Required content |
| --- | --- |
| Question | Claim, scope, and what would falsify it. |
| Method | Baseline, one intervention, data, and compute. |
| Results | All planned comparisons, uncertainty, and failures. |
| Analysis | Ablation, errors, alternative explanations. |
| Reproduction | Commands, revisions, artifacts, licenses. |
| Limits | Unsupported populations and next discriminating experiment. |

Extend your reading only when it answers a concrete uncertainty. For model research, revisit attention and the original Transformer paper linked in the course. For systems research, compare inference bottlenecks. For evaluation research, test whether a metric agrees with independently judged outcomes.

## Challenge: the best seed wins

Five candidate runs score 72, 73, 74, 74, and 82. A report highlights only 82 against a baseline average of 75. What is missing?

<details>
<summary>Audit the claim</summary>

Report the candidate distribution and use a matched comparison rule. Investigate the outlier without discarding it selectively. Selecting the best candidate seed while averaging the baseline changes the question and can create an unfair advantage.

</details>

**Finish when:** a reviewer can reproduce a table, inspect a failed hypothesis, and identify the exact evidence needed to change your conclusion. Apply the [common rubric](../careers.md#review-the-work-not-the-tool-list). Expertise grows through repeated independent studies; completing one studio is a beginning research artifact.

## Depth lab: defend a claim against an alternative explanation

Write the main claim as population, intervention, comparator, outcome, and conditions. Then identify the strongest plausible alternative explanation for the observed gain: leakage, unequal tuning, task mix, randomness, or a changed evaluation rule. Design one experiment that discriminates between the explanations.

**Failure drill:** remove the meaningful feature's relationship to the target while preserving its shape and marginal distribution where practical. Explain what should change if your proposed mechanism is correct. A failed prediction should revise the claim rather than disappear from the report.

| Defense question | A strong answer establishes |
| --- | --- |
| What does a seed sweep measure? | Variation from the random mechanisms controlled in those runs, not every future population or dataset. |
| Why use paired comparisons? | Both methods are evaluated on the same units, preserving their relationship when estimating differences. |
| What does a negative result mean? | The data did not support the stated claim under these conditions; it does not automatically prove equivalence. |
| Can an ablation prove mechanism? | It isolates a controlled change only to the extent other relevant factors and interactions are addressed. |

**Optimization requirement:** report total experiment cost, including failed runs and selection. Compare matched-budget results with any best-effort result explicitly. Reproduce every displayed table from saved raw outputs rather than copying selected numbers manually.

**Teach-back and sign-off:** explain the result to someone unfamiliar with the paper, then have them identify one unsupported extrapolation. A reviewer should reproduce a table, inspect all planned comparisons, and name the observation that would make you change your conclusion. Keep exploratory findings labeled as exploration.

**Return:** [Choose a direction](../careers.md) · [Syllabus](../syllabus.md)
