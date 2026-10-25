---
title: "Check understanding and demonstrate mastery"
sidebar_label: "Stage checkpoints"
sidebar_position: 15
---

import Checkpoint from '@site/src/components/AICurriculum/Checkpoint';

# Check understanding and demonstrate mastery

Use these checks after the relevant stage. Answer before revealing the explanation. A wrong answer identifies a lesson to revisit; it is useful feedback.

<Checkpoint />

## Go beyond selecting an answer

The two questions per stage sample important ideas. They do not replace the exercises, challenges, summaries, or project checks inside the lessons. After the quiz, use three tests of understanding:

1. **Explain:** describe the idea and why it exists without reading the page.
2. **Change:** modify an input, constraint, or assumption and predict the result before running it.
3. **Defend:** compare an alternative and explain which evidence would change your choice.

## Eight mastery demonstrations

Apply these to one precise AI concept at a time, such as causal masking, retrieval ranking, or tool authorization. Keep evidence for each ability separately; a strong explanation does not replace a working implementation or a tested recovery path.

| Ability | Evidence to produce | What does not establish it |
| --- | --- | --- |
| Explain | A definition, concrete trace, assumption or invariant, and counterexample. | Repeating terminology without explaining the mechanism. |
| Implement from scratch | A small implementation of the central mechanism with independent checks and complexity analysis. | Calling a library and printing its result. |
| Use in production | An integration contract covering data, identity, resource bounds, failures, monitoring, and recovery. | A local happy-path demo. |
| Debug | A minimal reproduction, competing hypotheses, a discriminating observation, and a verified fix. | Random changes until an example passes. |
| Optimize | A baseline, representative workload, measured bottleneck, controlled change, and quality comparison. | An unmeasured claim that a rewrite is faster. |
| Design systems | An architecture with ownership, data flow, failure boundaries, capacity assumptions, and alternatives. | A diagram containing tool names without contracts. |
| Defend in interviews | A correct answer followed by a changed constraint, counterexample, and tradeoff. | Memorizing the first answer. |
| Teach | A short lesson, worked example, deliberately wrong solution, and learner transfer exercise. | An explanation the learner cannot apply to a new case. |

“From scratch” means implementing the mechanism at an educational scale, then understanding the maintained tools used in production. Keep code and data versions, expected and observed results, benchmark conditions, limitations, and review notes. The [developer roadmap modules](./developer-roadmap/index.md) contain worked mastery labs connecting these demonstrations to concrete failures and design decisions.

## Stage demonstrations

| Stage | Demonstration | A reason to revisit the lessons |
| --- | --- | --- |
| Orientation | Propose a lookup, rule, and learned solution for different tasks. | Choosing AI before stating the problem. |
| Foundations | Parse a file, reject a bad row, test a calculation, and explain a join. | Treating missing data as zero without a rule. |
| Mathematics | Trace a dot product, gradient step, conditional probability, and projection. | Giving a calculation without units or assumptions. |
| Machine learning | Fit preprocessing on training data and compare with a baseline. | Selecting a model using the final test set. |
| Deep learning | Check a derivative and diagnose a learning curve. | Calling a decreasing training loss proof of generalization. |
| Generative AI | Validate a structured output and compare decoding choices. | Treating fluent or parseable text as verified fact. |
| Model building | Train, save, load, and evaluate a tiny model on held-out text. | Reporting an artifact without tokenizer/data versions. |
| RAG | Trace a supported answer and an unanswerable query. | Checking citations only for existence. |
| Agents | Deny a forbidden action and recover a retried approved action. | Letting a model grant itself permission. |
| Bots | Isolate two users and deduplicate a repeated channel event. | Sharing conversation state accidentally. |
| Production | Fail a release gate, explain an alert, and restore a known version. | Reporting latency without rejected or failed requests. |
| Research | Reproduce a table and run a controlled ablation. | Reporting only the best seed or changing the test after seeing results. |
| Capstone | Defend a working project with measured alternatives. | Listing tools instead of evidence. |

These demonstrations are the **mastery gates**: keep their evidence in your learning log. Checkmarks on the roadmap are self-reported completion and do not certify that a gate has passed.

## Keep a concept evidence record

Choose a narrow concept and record its lesson, assumptions, hand-worked example, implementation command, observed output, failure reproduction, optimization comparison, integration boundary, and unresolved questions. Add the date and code/data versions so later changes can be compared honestly.

For each of the eight abilities, mark **not yet demonstrated**, **demonstrated with help**, or **demonstrated independently on a changed case**. These labels describe evidence rather than a universal certification. Revisit a previously passed concept after a delay and use a different example.

An interview answer should survive a follow-up: change the batch size, remove a source, delay a response, revoke a permission, or alter the workload. Explain which assumption changes and predict the result before running it. A teaching exercise should similarly end with the learner solving a new case, not simply repeating your explanation.

The [lab directory](./syllabus.md#lab-directory) gives starting examples. The [capstone evidence packet](./careers.md#depth-lab-defend-one-concept-across-all-eight-abilities) combines all eight demonstrations around one project. Keep estimates, simulations, fixture results, live integrations, and production measurements explicitly labeled.

## A fair review

Score each project dimension using the [capstone rubric](./careers.md#review-the-work-not-the-tool-list). Ask a peer to reproduce one result and one failure case. If you study alone, leave the project for a day, then follow only your written instructions.

For a failed gate, identify the narrow gap and return to its lesson. Retake the exercise with a new example. Memorizing the displayed answer is weaker evidence than explaining why a tempting alternative fails.

**Continue:** [Syllabus](./syllabus.md) · [Lab directory](./syllabus.md#lab-directory)
