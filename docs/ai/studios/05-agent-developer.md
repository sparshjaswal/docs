---
title: "AI Agent Developer studio: a recoverable library assistant"
sidebar_label: "AI Agent Developer"
sidebar_position: 5
pagination_prev: ai/careers
pagination_next: null
---

# AI Agent Developer studio: a recoverable library assistant

**Entry:** the shared curriculum and [capstone brief](../careers.md). Essential labs: [model agent](../agents/05-build-a-model-agent.md), [durable actions](../agents/07-durable-workflows.md), and [bot testing](../bots/04-test-and-operate-bots.md).

**Client:** a student wants help finding an available book and preparing a reservation. The assistant may search and read availability. A concrete reservation requires the application's authorization and approval rules.

## Begin with a fixed workflow

Implement search → choose book → confirm availability → show reservation proposal. This is the baseline. Then allow a model to choose among the same read tools when the request requires flexible follow-up.

Define typed inputs and outputs for every tool. Keep user identity outside model-generated arguments. Pass it from the trusted session. Allowlist tools, bound response size, validate IDs, and keep write tools behind a separate application boundary.

The model proposes actions; code decides which actions are allowed. A prompt saying “be careful” is not an authorization check.

## Make the state inspectable

Store job ID, current user, task status, selected book, approval reference, tool receipts, remaining budget, and errors. Use the [durable action lab](../agents/07-durable-workflows.md) to understand retry semantics before connecting a remote service.

Include these endings: completed, missing information, denied, cancelled, budget exhausted, and uncertain external result. A useful assistant explains which ending occurred and what evidence supports it.

Maintain separate tool-call, token, time, and cost limits where relevant. Carry budgets across retries and restarts. A timeout checked only between operations is not a strict whole-job deadline; document whether cancellation reaches the underlying tool.

## Test trajectories, not just final sentences

A **trajectory** is the sequence of decisions, actions, observations, and state changes. A final answer can look correct even after an unauthorized lookup. Assert both the allowed path and the outcome.

Build a test matrix covering invalid tool name, malformed arguments, fabricated book ID, empty results, contradictory availability, tool failure, repeated action, changed approval payload, permission revocation, and an instruction hidden in a tool result.

Use scripted model responses to exercise each branch deterministically. Then run a separate live-model evaluation over representative tasks and repeated trials. Report task success, forbidden-action attempts, actual executed violations, resource use, and human intervention rate separately.

## Case study: a helpful but wrong retry

The student approves B17. A tool call times out after the reservation service commits it. The model suggests “try another request.” Application state marks the original operation uncertain and checks its receipt first. If the result cannot be established, it stops for reconciliation.

Do not ask another model to vote on whether a side effect happened. That is a question for the system of record.

## Challenge: should you add more agents?

A designer proposes a search agent, a planning agent, and a reviewer agent. What evidence would justify this?

<details>
<summary>Compare with the baseline</summary>

Identify independent work that benefits from separation, define ownership of state, and compare success, latency, and cost with the single-agent and fixed-workflow baselines. Correlated models can repeat the same mistake. A reviewer model cannot replace deterministic permissions or tool receipts.

</details>

**Deliver:** tool contracts, state diagram, fixture suite, live-evaluation report if run, crash/restart demonstration, approval binding, and a trace showing a denied action. A polished chat screen is optional; the execution evidence is required.

**Finish when:** another person can reproduce a duplicate-delivery case without a duplicate side effect in the stated boundary, inspect a stopped run, and distinguish fixture results from model results. Apply the [common rubric](../careers.md#review-the-work-not-the-tool-list).

## Depth lab: defend the difference between a proposal and an effect

Choose one reservation and trace the user request, model proposal, validated arguments, current authorization, required approval, operation key, execution, and receipt. State which component owns each fact. The model's final sentence cannot substitute for a receipt.

**Failure drill:** stop the process after the receiver applies the reservation but before the controller saves success. Restart and reconcile the same logical operation. Repeat with a changed book ID, an expired approval, and a revoked role. Reject changed or unauthorized actions even when an earlier attempt was permitted.

| Defense question | A strong answer establishes |
| --- | --- |
| Why is a timeout not a failed write? | The response can be lost after the effect; external state is uncertain until reconciled. |
| Where is deduplication guaranteed? | At the receiver or within a documented atomic boundary, with payload binding and retention semantics. |
| Why not add several agents? | Task independence, ownership, critical path, shared quotas, and measured benefit determine whether coordination helps. |
| How do you evaluate the controller and model? | Fault fixtures test control invariants; live task trials test actual proposal quality and reliability. |

**Optimization requirement:** measure model calls, tool time, retries, and user completion separately. Reduce repeated reads or unnecessary planning only when evidence coverage and action controls survive. Keep total and per-worker budgets consistent.

**Teach-back and sign-off:** show a successful run, a denied action, and an uncertain outcome. Ask a reviewer to predict each next transition from stored state. They should be able to distinguish stopping from completing, and to explain why a local completed flag cannot guarantee exactly one remote effect.

**Return:** [Choose a direction](../careers.md) · [Syllabus](../syllabus.md)
