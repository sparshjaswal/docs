---
title: "16. AI engineering: contracts, workflows, evaluation, and observability"
sidebar_position: 16
---

# AI engineering: contracts, workflows, evaluation, and observability

**Prerequisites:** model behavior, RAG, agents, API design, and responsible AI. Use your frontend/backend experience to build a complete product path, then follow the [engineering lessons](../engineering/01-serving-and-apis.md).

## What it is and why it matters

AI engineering turns probabilistic model behavior into an application with understandable outcomes. It includes contracts, evaluation data, failure handling, user experience, and operations. A successful model call is only one step in a successful user task.

## Learn in this order

### Function calling and application contracts

Function calling describes structured action requests produced by a model; the application still decides whether and how to execute them. Define arguments, return types, errors, permissions, idempotency, timeouts, and version compatibility. Keep user identity outside model-controlled fields.

Separate a tool proposal, accepted request, completed operation, and confirmed result. A timeout can leave the outcome unknown. The UI should display “checking status” or another accurate state rather than infer success.

**Practice:** build a contract test suite for one read tool and one simulated write tool. Include duplicate requests, changed arguments, and malformed responses.

### Workflows and full-stack product behavior

Use deterministic steps for required ordering and a model only where interpretation or adaptive choice helps. Long work can return a job ID and continue through a worker. Design streaming, cancellation, retries, approvals, and resume behavior together.

On the frontend, distinguish generated text from verified facts and actual side effects. Offer citations, useful error recovery, and a way to correct a result. Preserve keyboard accessibility and a readable non-streaming fallback.

**Practice:** implement a React or equivalent UI over a Python service. Disconnect mid-task, reconnect, and show the correct persisted status without running the task twice.

### Evaluation at several layers

Unit tests check deterministic code; contract tests check boundaries; integration tests check actual services; task evaluations check useful outcomes. Keep offline fixtures and live-model measurements labeled separately.

Use versioned test sets, objective graders where possible, reviewed language rubrics, and repeated trials. A model judge needs calibration against human labels and should not silently decide every ambiguous case. Include latency, cost per useful task, and supported user slices.

**Practice:** compare two application versions on the same reserved cases. Report confidence or variation, regressions, and cases where the candidate is worse. See [evaluation and monitoring](../engineering/02-evaluation-and-monitoring.md).

### Observability

Logs describe events, metrics summarize measurements, and traces connect the steps of a request. Trace retrieval, generation, tool execution, validation, and queueing with shared identifiers. Record model, prompt, schema, index, and tool versions.

Collect enough to diagnose failures without indiscriminately storing sensitive prompts. Separate user-visible evidence from internal debugging data. A latency spike needs timing per stage; a wrong answer needs the actual allowed evidence and context.

**Practice:** inject a slow retrieval call and a malformed model result. Diagnose each using traces without reading a secret or reconstructing private model reasoning.

### Guardrails and fallback design

Guardrails are checks and constraints around application behavior. Deterministic schemas, access rules, quotas, and sandbox boundaries provide different guarantees from probabilistic content classifiers. A classifier can help flag material for review; it is not an infallible security boundary.

Define useful fallbacks: a deterministic lookup, a draft for review, an evidence-gap response, or a retryable job state. The fallback should match the failure reason rather than always return a generic apology.

**Practice:** test prompt injection, unavailable providers, missing evidence, exhausted context, and denied actions. Confirm the declared fallback and total resource bound.

## Mastery lab: model the user-visible job lifecycle

A successful HTTP request may only mean that a job was accepted. It does not mean generation completed, evidence was validated, or an external action succeeded. Define those states explicitly so the UI and backend do not disagree.

Use a durable job record with an ID, owner, input revision, state, timestamps, cancellation intent, result reference, and error class. Separate `accepted`, `running`, `awaiting_review`, `succeeded`, `failed`, and `cancelled`. Record whether cancellation arrived before or after a side effect committed; a cancel button cannot undo an already completed remote action.

### Implement a release decision from explicit evidence

```python runnable
def release(report):
    checks = {
        "quality": report["passed"] / report["total"] >= 0.9,
        "latency": report["p95_ms"] <= 1500,
        "access": report["access_violations"] == 0,
    }
    return all(checks.values()), [k for k,v in checks.items() if not v]
print(release({"passed": 95, "total": 100, "p95_ms": 1200,
               "access_violations": 1}))
```

```text output
(False, ['access'])
```

The thresholds are illustrative product requirements. Real evaluators must validate report fields, reject empty datasets, and attach dataset/version evidence. Passing a quality average does not override an access-control failure.

### Debug and optimize the entire path

Trace browser → API → queue → worker → model/tool → validator → persisted result. Carry a correlation ID across boundaries. Distinguish queue wait, model latency, tool latency, validation time, and response delivery. A low model latency with a long queue still gives users a slow product.

Test disconnected clients, duplicate submissions, cancellation, malformed outputs, unavailable dependencies, and stale job polling. For function calling, validate both the argument schema and the user's authority over the target. The model's proposed function name is data until the host dispatches an approved operation.

Optimize end-to-end useful completion, not only token throughput. Streaming can improve perceived responsiveness but may expose text before final validation; design which outputs may stream and which require withholding or review. Cache only when user, permissions, relevant versions, and freshness permit reuse.

**System design:** keep model adapters, tools, business policy, storage, and evaluation replaceable. A deployment should expose actionable health and readiness signals, bounded admission, and a rollback path. Logs should help locate failures without becoming an unbounded copy of user data.

**Interview defense:** “Our model endpoint has 99.9% success, but users report many failures.” Define success at each layer and count rejected, timed-out, cancelled, invalid, and unsupported results. Avoid a denominator containing only completed model calls.

**Teach it:** ask a learner to label what the system knows after each arrow in the request path. Give them a duplicate submission and a disconnected browser. Deliver a working full-stack path, job-state contract, failure replay, release gate, and measured optimization.

## Mini project and real-world use

Build a complete developer-support assistant: UI, authenticated API, scoped retrieval, checked output, job state, evaluation harness, and sanitized traces. Use the [effective development workflow](../engineering/06-effective-ai-development.md) to give coding assistants bounded tasks with independent verification.

Real uses include internal developer tools, support automation, document review, and business workflow assistance.

**Completion evidence:** a working end-to-end path, failure-state UI, reproducible evaluation, action-boundary tests, trace examples, and a release decision based on measured outcomes.

## Interview questions

1. What separates a model-generated tool call from an authorized operation?
2. Which failures require a retry, fallback, human review, or immediate stop?
3. How do you evaluate a feature when outputs are not deterministic?
4. What must a trace record to explain a RAG failure?
5. Why can a fast response increase total user task time?
6. Which guardrails enforce a hard boundary, and which only estimate risk?

## Curated resources

- **Course:** [Full Stack Deep Learning](https://fullstackdeeplearning.com/course/2022/), for data, deployment, testing, and product concerns.
- **Book:** [AI Engineering](https://www.oreilly.com/library/view/ai-engineering/9781098166298/), Chip Huyen.
- **Paper:** [HELM: Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110), for evaluating beyond one score.
- **GitHub:** [HELM](https://github.com/stanford-crfm/helm) for evaluation methodology and [OpenTelemetry Python](https://github.com/open-telemetry/opentelemetry-python) for instrumentation.

**Previous:** [Frameworks](15-frameworks.md) · **Next:** [MLOps and LLMOps](17-mlops-llmops.md).
