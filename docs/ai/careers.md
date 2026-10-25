---
title: "Choose a role and build a capstone"
sidebar_label: "12. Role-based capstones"
sidebar_position: 12
pagination_next: null
---

# Choose a role and build a capstone

**Before this lesson:** complete the shared route through [research practice](./research/04-causal-and-reproducible-studies.md). The roles below overlap, and job titles differ between organizations. Use them as project directions, not fixed boundaries or a promise of employment.

Choose one capstone first. Build the smallest useful version, establish a baseline, and collect evidence before adding complexity. A reviewer should be able to run your work, understand your decisions, and identify its limits.

## Match your evidence to the role

| Direction | Capstone | Evidence that makes the project convincing |
| --- | --- | --- |
| AI Engineer | A demand predictor connected to a small planning service | Data validation, leakage-free split, baseline comparison, API tests, monitoring, and rollback. |
| LLM Engineer | A domain adaptation experiment on permissioned text | Prompt-only baseline, adaptation method, held-out evaluation, general-capability regressions, memory and latency report. |
| GenAI Engineer | A content assistant with structured outputs and review | Quality rubric, schema checks, source/asset rights, unsupported-content handling, cost per accepted output. |
| RAG Engineer | A permission-aware library or handbook assistant | Query set, retrieval metrics, grounded answers, citations, abstention, freshness, and access-boundary tests. |
| AI Agent Developer | A read-first assistant that proposes controlled changes | Typed tools, bounded loops, approval records, replayable state, idempotent writes, and adversarial evaluations. |
| AI Researcher | A focused paper reproduction plus one justified change | Matched baselines, controlled ablation, multiple runs, uncertainty, reproducible artifacts, and an honest limitations section. |
| AI Architect | An evaluated end-to-end design for one of the systems above | Requirements, two credible alternatives, measurements, cost model, threat model, ownership, and migration/recovery plan. |

Use a course project as a starting point, then make a meaningful independent change. For language-model work, extend the [training and adaptation experiment](./model-building/03-train-a-small-model.md). For an agent or conversational product, connect the [catalogue agent](./agents/05-build-a-model-agent.md) to the [browser chatbot](./bots/02-build-a-chatbot.md), preserving session and permission boundaries. For every model-backed application, include a measured [context-budget comparison](./engineering/05-token-and-context-budgets.md) and the [development evidence](./engineering/06-effective-ai-development.md) needed to reproduce it.

## A common project brief

Each direction has a complete studio brief with a case study, implementation milestones, evaluation requirements, a challenge, and a review gate. Choose one; the studios are alternatives after the shared route.

| Direction | Independent studio |
| --- | --- |
| AI Engineer | [Demand-planning service](./studios/01-ai-engineer.md) |
| LLM Engineer | [Adapt, evaluate, and serve a model](./studios/02-llm-engineer.md) |
| GenAI Engineer | [Evidence-aware content workbench](./studios/03-genai-engineer.md) |
| RAG Engineer | [Changing, permissioned handbook](./studios/04-rag-engineer.md) |
| AI Agent Developer | [Recoverable library assistant](./studios/05-agent-developer.md) |
| AI Researcher | [Reproduce, question, extend](./studios/06-ai-researcher.md) |
| AI Architect | [Defend an end-to-end design](./studios/07-ai-architect.md) |

Write one page before implementation. Name the user and the decision the system supports. State the accepted inputs, desired outputs, simplest non-AI alternative, supported population, unacceptable failures, and available resources. Define a measurable success criterion and who judges usefulness.

For a RAG assistant, “answers sound good” is insufficient. A better brief names the source collection, user permissions, question types, citation requirements, and behavior when evidence is absent. For an agent, state exactly which tools may read, which may write, and what requires approval.

Keep the scope small enough to inspect. Ten well-designed failure cases often reveal more than a polished interface around an unmeasured model. They are a starting set, however, not enough evidence for a large deployment claim.

## Build in four milestones

1. **Baseline:** implement a rule, lookup, simple model, or fixed workflow. Save examples and expected behavior.
2. **Improvement:** add one justified model or system change. Compare it fairly against the baseline using validation data.
3. **Reliability:** add negative cases, permission tests, input limits, observability, and a recovery path. Measure performance under a stated workload.
4. **Handoff:** freeze a version and run the untouched final evaluation. Publish a reproducible local package, a clear report, and a short demonstration using permitted data.

The handoff package should contain setup commands, dependency versions, data provenance, train/validation/test definitions, configuration, evaluation outputs, test commands, and known limitations. Keep secrets and private data out of public repositories. An offline or recorded demonstration is acceptable when hosting would add unnecessary cost.

## Review the work, not the tool list

Use this rubric for your own review or a peer review. Score each area from 0 to 2: 0 means missing, 1 means demonstrated only on a happy path, and 2 means supported by repeatable evidence including a failure case.

| Area | Review question |
| --- | --- |
| Problem fit | Does the chosen method improve the baseline for a real user need? |
| Data and evaluation | Are provenance, splits, metrics, and limits clear? |
| Implementation | Can another person run it and understand the main components? |
| Reliability | Are invalid input, dependency failure, and recovery tested? |
| Responsible behavior | Are permissions, privacy, and consequential actions handled explicitly? |
| Communication | Can you explain alternatives, tradeoffs, and what remains uncertain? |

A total score helps locate gaps, but do not average away a missing critical permission boundary. Set requirements appropriate to your use case before reviewing the final result.

## Practise explaining your decisions

Prepare a five-minute walkthrough: the problem, baseline, one design decision, one measured result, one failure, and the next experiment. Then answer these questions without naming a framework first: Why this data split? Why this metric? Why RAG instead of fine-tuning? Why one workflow instead of several agents? What happens if the model host fails? What would convince you that your design is wrong?

<details>
<summary>Example of a useful answer</summary>

“We used retrieval because the handbook changes weekly and users need verifiable sources. Our baseline was keyword search. Hybrid retrieval improved evidence recall on the validation questions but increased latency. We kept a permission filter before search and measured citation support separately from retrieval. We still fail on contradictory policy versions, so the next experiment tests date filtering and explicit conflict reporting.”

</details>

Continue learning through the failures your project reveals. Use the [supporting library](./syllabus.md#check-shared-foundations-at-the-point-of-use) for software fundamentals and the [research route](./research/01-papers-and-experiments.md) for claims that need deeper evidence.

## Depth lab: defend one concept across all eight abilities

Choose one central concept from your capstone, such as leakage-free evaluation, causal attention, evidence ranking, or idempotent action execution. Prepare an evidence packet:

1. A one-page explanation with assumptions and a counterexample.
2. A small independent implementation and a hand-calculated check.
3. An integration contract with inputs, outputs, ownership, limits, and failure states.
4. A reproducible bug and the observation that identified its cause.
5. A benchmark comparing a baseline with one controlled optimization.
6. A system diagram showing dependencies and recovery boundaries.
7. Three interview questions, each with a changed constraint and defended answer.
8. A ten-minute teaching exercise containing a deliberately wrong solution.

Have a reviewer select which artifact to inspect rather than presenting only your strongest demonstration. They should be able to change an input, revoke a permission, or introduce a timeout and ask you to predict the behavior before running it.

**Review standard:** distinguish “I can explain the mechanism,” “I implemented the teaching version,” and “I have operated this under real constraints.” These are different achievements. Label simulations, estimated capacity, optional integrations, and untested deployment claims clearly.

If an optimization improves speed but harms a critical quality slice, defend the release decision with the predeclared constraints. If a research result fails to repeat, revise the claim. If you cannot explain why a test passes, return to the mechanism rather than adding another framework.

**Interview defense:** when asked about a tool you have not used, explain the underlying problem, what you know, what you would verify, and how you would test its contract. Calibrated uncertainty with a concrete investigation plan is stronger than inventing experience.

**Teach-back completion:** give a learner a new case and ask them to implement or debug it without your solution. Use their mistakes to improve your lesson. The goal is transferable understanding, supported by repeated practice and feedback, rather than a completion badge alone.

**Previous:** [From a promising result to a defensible research claim](research/04-causal-and-reproducible-studies.md) · **Next:** [Choose a professional studio](#a-common-project-brief)
