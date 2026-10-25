---
title: "Portfolio roadmap: from data audit to production and research"
sidebar_position: 21
---

# Portfolio roadmap: from data audit to production and research

Build one coherent body of work instead of a gallery of copied chatbot demos. A support/developer-documentation theme lets you reuse a permitted dataset while solving increasingly difficult problems. Keep each experiment's split and purpose clear; reuse of data must not turn the final test set into development material.

The [study plans](study-plans.md) schedule these projects. The six-month route can keep early artifacts compact and turn P5–P7 into one flagship product. The 12- and 24-month routes give more time for independent comparisons and P8 research.

## P1. Data-quality explorer

**After:** modules 1–4. **User:** an analyst or developer deciding whether a dataset is usable.

Build a reproducible ingestion/cleaning pipeline, a data dictionary, and five useful charts. Include missing values, duplicates, time handling, invalid records, and source permissions. Add a small dashboard only after the analysis works from a command.

**Baseline:** a simple uncleaned summary. **Evaluate:** row counts, key uniqueness, join behavior, transformation tests, and whether another person can reproduce every chart. A beautiful dashboard with undocumented manual fixes does not pass.

**Deliver:** code, source/license record, report, and before/after quality counts. Use the [data audit lab](../foundations/07-data-tables-and-sql.md) as a starting point, then change the dataset and checks.

## P2. Classical ML decision service

**After:** module 5. **User:** a reviewer prioritizing support tickets.

Predict an explicit label or quantity available at a specified decision time. Compare constant, linear, and tree-based baselines. Put preprocessing in a fitted pipeline. Expose predictions through an API with a useful review UI and fallback.

**Evaluate:** a leakage-safe split, relevant metrics, class/slice counts, threshold costs, and calibration where probabilities matter. State the capacity or error-cost assumption before choosing a threshold.

**Deliver:** experiment table, locked final test results, error examples, trained artifact, API contract, and model card. Include one reason to prefer the simpler model even if its headline score is slightly lower.

## P3. Neural-network mechanics and architecture report

**After:** module 6. **User:** another engineer deciding whether a neural approach is justified.

Implement and gradient-check a tiny network, then use PyTorch for a small image or sequence task. Compare at least two appropriate architectures or one pretrained representation against a simpler model. Add shape, mask, and training/evaluation-mode checks.

**Evaluate:** controlled splits, training curves, validation-based selection, repeatability, compute budget, and failure cases. Do not compare architectures using unrelated datasets and call the result a fair ranking.

**Deliver:** a runnable notebook or script, hand-worked calculation, trained artifact, and short architecture decision. Start from [the neural-network lab](../deep-learning/02-training-and-pytorch.md).

## P4. NLP, prompting, and model-adaptation benchmark

**After:** modules 7–10. **User:** a team choosing how to extract or summarize information.

Compare a classical or deterministic baseline, prompt-only generation, and a small fine-tuned/adapter candidate where resources allow. Build an evaluation harness with separate structure, task accuracy, and factual-support checks. Audit a small preference dataset to understand RLHF/DPO inputs.

**Evaluate:** the same reserved cases, supported languages, repeated trials where needed, failure handling, time, and cost. Record exact model/tokenizer revisions. Treat live API output and scripted fixtures as different evidence.

**Deliver:** prompts, schemas, dataset instructions, raw result records, evaluation code, and a recommendation. A negative fine-tuning result is useful if the comparison is fair.

## P4M. Optional multimodal accessibility study

**After:** module 11. **User:** someone consuming a small collection of educational clips.

Produce captions, transcripts, visual descriptions, and a source-linked summary using consented or synthetic media. Include a human correction interface.

**Evaluate:** transcription errors in names/numbers, missed events, description accuracy, temporal ordering, and performance when one modality is unavailable. Keep model generation separate from evidence extraction.

**Deliver:** a small permitted media set or reproducible generation instructions, reviewed outputs, modality scorecards, and limitations. Choose this project for a GenAI specialization; it need not become part of every engineering capstone.

## P5. Evidence-grounded documentation assistant

**After:** module 12. **User:** a developer searching an approved documentation collection.

Implement ingestion, source/version IDs, chunking, lexical search, dense search, hybrid fusion, optional reranking, and cited answers. Add at least two access scopes and source update/deletion behavior.

**Evaluate:** at least 40 reviewed questions spanning answerable, missing, outdated, conflicting, exact-ID, paraphrase, and inaccessible-source cases. Measure retrieval separately from generation. Predeclare the quality and access conditions required for release.

**Deliver:** index build instructions, benchmark, citations that open exact passages, latency/cost report, and failure diagnosis. Reuse the [RAG lab](../rag/04-rag-evaluation.md), then add your own corpus and labels.

## P6. Bounded agent with MCP and durable state

**After:** modules 13–15. **User:** a developer investigating and drafting documentation changes.

Implement a plain bounded loop, validated tools, explicit state, budgets, and a simulated write requiring the relevant approval. Expose a read-only capability through MCP. Use persistent state to resume. Compare one framework implementation with the plain loop.

**Evaluate:** successful outcomes, invalid proposals, executed forbidden actions, duplicate effects, repeated loops, timeouts, restarts, and repeated-trial consistency. Compare multiple agents only if you can justify the division of work.

**Deliver:** architecture, state transitions, versioned contracts, traces, failure tests, and a framework decision. Use the [durable action lab](../agents/07-durable-workflows.md) for recovery mechanics.

## P7. Production full-stack capstone

**After:** modules 16–18. **User:** a small pilot group with a defined use case.

Combine UI, authenticated API, scoped retrieval, model adapter, checked outputs, job state, observability, and a bounded action path. Package it, record artifacts, add CI evaluations, and demonstrate staged rollout and rollback. Use Kubernetes only if your operating requirements justify it.

**Evaluate:** task success, supported-slice regressions, access boundaries, queue behavior, cancellation, p95 latency under stated load, cost per useful task, freshness, and dependency failure. Obtain a reviewer or pilot user's feedback without treating anecdotes as your whole benchmark.

**Deliver:** live or locally reproducible demo, architecture diagram, operational runbook, capacity estimate labeled against measurements, incident drill, known limitations, and release decision. Do not claim a deployed service when you only created a deployment manifest.

## P8. Independent research or systems investigation

**After:** module 19 and one primary specialization. **User:** a researcher or engineering team evaluating a narrow claim.

Choose a manageable question: a retrieval ablation, a quantization tradeoff, a multimodal robustness issue, a simulated-control comparison, a graph evidence path, or a constrained prompt-improvement loop. Reproduce a baseline before extending it.

**Evaluate:** the stated hypothesis, multiple runs where appropriate, uncertainty, independent final data, and one controlled ablation. Document compute and failed experiments. A candidate must not edit its grader or silently change the acceptance criteria.

**Deliver:** a short paper-style report, runnable reproduction, evidence table, limitations, and independent review. Select the corresponding [professional studio](../careers.md) for a deeper role-specific assessment.

## What every public-facing portfolio entry should contain

Use a project guide or another clear entry document; the filename is less important than reproducibility.

1. **Problem:** user, task, scope, and why AI might help.
2. **Baseline:** the simplest reasonable alternative.
3. **Data:** source, permitted use, collection limits, split, and transformations.
4. **System:** architecture, versions, setup, execution, and verification commands.
5. **Evaluation:** defined metrics, test counts, uncertainty, failure examples, and cost.
6. **Decision:** what improved, what did not, and why the result changes your design.
7. **Responsibility:** access controls, privacy/retention decisions, intended use, and limitations.
8. **Handoff:** a short demo, reproducible artifacts, and instructions for a new reviewer.

Never commit credentials, private user records, or model artifacts whose license forbids redistribution. Use synthetic fixtures for public reproduction when the original data cannot be shared, and explain the difference.

## Interview and portfolio presentation

Prepare a five-minute story for each flagship project: problem, baseline, surprising failure, measured change, and remaining limitation. Then practice a 30-minute design discussion where the interviewer changes a constraint, such as doubling traffic, deleting a source, or forbidding external model calls.

A strong portfolio shows judgment as well as code. Three carefully evaluated flagship projects can communicate more than ten unfinished demos. Keep early exercises as supporting evidence and make the most relevant projects easy to find.

**Return:** [Module roadmap](index.md) · [Study plans](study-plans.md).
