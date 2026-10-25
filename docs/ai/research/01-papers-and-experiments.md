---
title: "Read a paper and test its claim"
sidebar_label: "1. Papers and experiments"
sidebar_position: 1
---

# Read a paper and test its claim

**Before this lesson:** complete the [inference systems lab](../engineering/07-inference-systems.md). You can now build and evaluate a system. Research adds a different question: what new, well-supported claim can you make?

A **research question** names an uncertainty. A **hypothesis** is a proposed answer that an experiment can challenge. “Build a better chatbot” is too broad. “Does adding document titles to retrieval improve evidence recall on short catalogue questions at the same candidate budget?” is testable.

## Read in three passes

First read the abstract, figures, and conclusion to identify the problem and main claim. Then inspect the method and evaluation: what changed, compared with what, on which data, under which budget? Finally trace equations and code only after those questions are clear.

Create a claim ledger in your own words:

| Claim | Evidence to locate | Question to ask |
| --- | --- | --- |
| A method is more accurate | Dataset, split, metric, baseline, repeated runs | Was the comparison fair? |
| A method is faster | Hardware, batch size, precision, measured operation | Is this training speed or serving latency? |
| A component is necessary | An ablation removing that component | Did other settings stay comparable? |
| A method is robust | Tests under stated changes or attacks | Which changes were actually tested? |

An **ablation** removes or changes one component to measure its contribution. It does not automatically explain the entire mechanism: removing a part may also change compute or training stability.

For example, [Attention Is All You Need](https://arxiv.org/abs/1706.03762) presents the original Transformer architecture and experiments. Use your earlier attention lesson to identify its inputs, attention blocks, positional information, and evaluation setting. Do not assume a later language model uses every detail of that original system.

## Reproduce before extending

**Reproduction** attempts to obtain a reported result under the stated conditions. **Replication** is often used for testing a claim with independently produced code or data; terminology varies, so describe exactly what you did.

Record the code revision, dataset version, split IDs, package versions, seeds, hardware, settings, and run commands. A seed controls a source of pseudo-randomness, but different hardware or algorithms may still yield different results. Save raw per-example results, not only a chart.

Start with the smallest meaningful reproduction. Confirm data shapes, loss calculations, and one training step. Then reproduce a baseline and only afterwards add the proposed change. If your baseline is broken, the improvement has no clear meaning.

## Compare fairly

Use matched data splits and a stated search budget. A new model tuned 100 times should not be compared with a baseline given one arbitrary setting. Count failed runs, report variation across seeds where relevant, and distinguish planned comparisons from exploratory findings.

Suppose five matched runs improve accuracy by 0.1, 0.2, −0.1, 0.0, and 0.1 percentage points. Reporting only the best run gives a misleading picture. Compute the paired differences, inspect their variability, and decide whether the effect matters for the real task. A statistical difference can be too small to justify added cost.

Avoid **benchmark contamination**: evaluation questions or close duplicates may already be in training or development material. For generated systems, hidden provider training data makes absence of contamination difficult to prove. Describe what you checked and what remains unknown.

## Exercise: repair a weak experiment

A report says, “Our model wins by 2%.” Its baseline uses less training data; the test set selected the final settings; the best of ten runs is reported. Write a repair plan.

<details>
<summary>Compare your plan</summary>

Define the metric and whether 2% is relative or two percentage points. Match available data and explain any unavoidable differences. Use validation data for choices, then evaluate on a new untouched test set. Report all planned runs or an agreed summary with variation. Include resource use and failure cases. The repaired result may be smaller or disappear; that is useful evidence.

</details>

**Deliverable:** write a two-page reproduction proposal: question, paper claim, baseline, data and split, planned change, metrics, compute limit, and what result would count against your hypothesis. Ask another learner to identify missing assumptions. The [NeurIPS paper checklist](https://neurips.cc/public/guides/PaperChecklist) offers questions about reporting reproducible evidence and limitations.

## Depth lab: test whether two improvements interact

An ablation can miss interactions. Suppose you change both data cleaning and the model architecture. A **factorial comparison** tests neither change, each change separately, and both together. It asks whether one change's benefit depends on the other.

```python runnable
scores = {"baseline": 0.70, "cleaning": 0.74, "architecture": 0.73, "both": 0.82}
cleaning_alone = scores["cleaning"] - scores["baseline"]
architecture_alone = scores["architecture"] - scores["baseline"]
interaction = (scores["both"] - scores["baseline"]
               - cleaning_alone - architecture_alone)
print(f"cleaning gain: {cleaning_alone:.2f}")
print(f"architecture gain: {architecture_alone:.2f}")
print(f"interaction: {interaction:.2f}")
```

```text output
cleaning gain: 0.04
architecture gain: 0.03
interaction: 0.05
```

These invented scores use one additive scale. The combined gain exceeds the sum of separate gains by five percentage points. That suggests an interaction worth investigating, but uncertainty, metric scale, and controlled conditions matter. It does not establish a mechanistic explanation from four point estimates.

**Reproduction method:** implement the simplest reference version, inspect one example and one gradient, then reproduce the baseline. Preserve data and compute budgets across comparisons or state the differences. If the published experiment is unaffordable, define a smaller claim and explain what the reduced setting cannot test.

**Debugging:** build a discrepancy ledger covering preprocessing, data splits, objective, initialization, optimization, evaluation, and numerical settings. Change one suspected source of disagreement at a time. A failed reproduction can reveal an undocumented assumption without proving the entire paper wrong.

**Production connection:** an academic metric may not match your product's constraints. Translate the claimed improvement into a task-specific evaluation with latency, resource, permission, and recovery requirements. Do not present a research reproduction as a production release.

**Optimization:** match search budgets as well as final training budgets. If the new method required many unsuccessful runs to tune, report that cost. A more efficient implementation can be useful even when its scientific method is unchanged; identify which contribution you are claiming.

<details>
<summary>Interview defense: does removing a component establish that it caused the gain?</summary>

It provides evidence under the particular comparison. Removal can change compute, optimization difficulty, and interactions with other components. Include suitable controls, repeated runs, and matched settings. Limit the conclusion to what the experiment isolates.

</details>

**Teach-back:** explain the four-cell comparison to someone who has read only the abstract. Ask them to propose a result that would contradict your preferred explanation, then include that test in the experiment plan.

**Previous:** [Make inference fast without hiding its costs](../engineering/07-inference-systems.md) · **Next:** [Understand training and inference at scale](02-training-at-scale.md)
