---
title: "AI Engineer studio: a demand-planning service"
sidebar_label: "AI Engineer"
sidebar_position: 1
pagination_prev: ai/careers
pagination_next: null
---

# AI Engineer studio: a demand-planning service

**Entry:** complete the shared curriculum and [capstone brief](../careers.md). Revisit [forecasting](../machine-learning/08-calibration-and-time.md), [serving](../engineering/01-serving-and-apis.md), and [release evaluation](../engineering/02-evaluation-and-monitoring.md) if you cannot explain them without a framework.

**Client:** a fictional library wants to estimate next week's loans so staff can plan shelving time. An estimate supports a human decision; it does not automatically change anyone's schedule.

## Define a data contract

Each daily row contains date, branch, opening hours, public-holiday flag, and observed loans. Record when each field became available. A future observed loan count cannot be a feature. Use synthetic data with a published generator, or permissioned historical records with documented provenance.

Reserve the latest time window for final evaluation. Use earlier rolling windows to choose settings. Separate branches when your claim is about a new branch, and explain why that differs from forecasting the future of familiar branches.

## Build three inspectable versions

1. Predict the previous comparable week's count.
2. Train a small regression or tree model using only available historical features.
3. Expose the selected procedure through a local API with validated dates and branch IDs.

Train preprocessing with the model and version them together. A **pipeline** packages transformations and prediction into one procedure. Save a data schema and a model card beside the artifact. The [offline regression project](../machine-learning/07-validation-and-explanations.md) is a starting implementation, not a finished time-series benchmark.

Compare mean absolute error, large-error cases, performance by branch, and how the result changes the actual planning decision. Include a model that loses to the baseline if that is what your experiment finds.

## Work through an incident

On Monday, a branch renames its ID. The service receives the new ID while the model knows only the old one. Silently mapping it to zero can produce a plausible but wrong estimate.

Require an explicit supported-branch policy. Return a clear unsupported-input response or use a documented baseline. Alert on unknown IDs and missing dates. Keep the old version available until the new data contract and model are evaluated.

This illustrates **training-serving skew**: the training procedure and live inputs differ in meaning or transformation. Tests should compare the saved pipeline's predictions before and after loading, and verify that the API uses the same transformation.

## Milestones and review evidence

| Milestone | Deliverable | Reviewer should try |
| --- | --- | --- |
| Baseline | Reproducible split and seasonal forecast | Move the cutoff and inspect feature timestamps. |
| Candidate | Experiment table and slice errors | Recompute one metric from saved predictions. |
| Service | Local endpoint and input contract | Send missing, malformed, and unknown fields. |
| Operations | Monitoring and rollback demonstration | Load the previous artifact after a failed release gate. |

Set your acceptance threshold before the final test. For example, require an improvement in MAE without worsening the largest branch's errors beyond a declared tolerance. The threshold should reflect your scenario, not pretend to be an industry-wide standard.

## Challenge: distribution changes

Simulate a new school term that changes borrowing patterns. Compare an input-change alert with a delayed quality alert once actual loans arrive. A shift in input values does not prove model failure; a stable input distribution does not prove unchanged quality.

<details>
<summary>What the review should conclude</summary>

Show which change was detected, how quickly, and what action followed. Do not automatically retrain on every alert. Check data integrity, compare the baseline, and validate a candidate before replacing the model.

</details>

**Finish when:** another person can reproduce the experiment, start the service, trigger one invalid-input response, and perform a rollback. Apply the [common rubric](../careers.md#review-the-work-not-the-tool-list). Explain when a spreadsheet or scheduled SQL report would be the better solution.

## Depth lab: defend the predictor under a changed data contract

Run a review with three artifacts open: raw timestamped data, the saved preprocessing/model bundle, and API predictions. The reviewer selects one row and asks which information was available at prediction time. Reconstruct the features without using later outcomes.

**Failure drill:** rename a branch, omit one day's records, and delay labels by a week. Demonstrate which requests use a declared baseline, which are rejected, and which remain unscored pending outcomes. A missing label is not a successful prediction. Restore the previous bundle and show that its input contract still matches the service.

| Defense question | A strong answer establishes |
| --- | --- |
| Why use a time split? | The deployment predicts a later period; random splitting can expose future patterns. A new-branch claim needs another grouping rule. |
| Why this error metric? | Its units and weighting match the planning decision, with large mistakes and branch slices reported separately. |
| Why not use a larger model? | A measured baseline comparison identifies whether extra complexity improves useful outcomes at acceptable cost. |
| How would you detect training-serving skew? | The same raw fixture passes through offline and serving transformations, with versioned expected features and predictions. |

**Optimization requirement:** profile feature preparation, model computation, and request handling independently. Improve one bottleneck and repeat the quality comparison. A faster endpoint returning stale or differently transformed features fails the contract.

**Teach-back and sign-off:** explain one forecast to a nontechnical planner without presenting it as certainty. Then ask another developer to reproduce your split, calculate one metric manually, trigger the incident, and recover using only the handoff notes. Record which evidence is simulated and which was measured.

**Return:** [Choose a direction](../careers.md) · [Syllabus](../syllabus.md)
