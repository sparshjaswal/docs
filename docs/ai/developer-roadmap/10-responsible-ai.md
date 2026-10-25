---
title: "10. Responsible AI, safety, bias, privacy, security, and governance"
sidebar_position: 10
---

# Responsible AI, safety, bias, privacy, security, and governance

**Prerequisites:** data provenance, statistical evaluation, and [LLM/prompt behavior](09-prompt-engineering.md). Apply the basics from the first dataset onward; this dedicated module comes before connecting models to sensitive data or external actions.

## What it is and why it matters

Responsible AI asks who benefits, who can be harmed, what the system can actually establish, and who remains accountable. It combines technical measurements with decisions about acceptable use, oversight, and remedies. It is part of design and operation, not a badge added after a demo.

## Learn in this order

### Safety and reliability

Distinguish ordinary errors, foreseeable misuse, unsafe actions, and behavior outside the intended domain. Define the task boundary and consequences of failure. A system giving a bad book recommendation has different requirements from one controlling equipment.

Use capability limits, human review where needed, staged releases, incident procedures, and explicit stopping rules. Test plausible failures and adversarial inputs, but do not confuse “no failures observed” with “failure is impossible.” Frontier-model alignment and long-term safety are research areas with unresolved questions.

**Practice:** build a hazard table for a support assistant: scenario, affected person, possible harm, detection, prevention, and recovery owner.

### Bias and fairness

Bias can enter through sampling, labels, measurement, historical decisions, representation, and deployment. Evaluate errors across relevant groups and intersections, with adequate sample counts and privacy protections.

Fairness metrics answer different questions: equal selection rates, equal error rates, and calibrated probabilities need not recommend the same intervention. Their compatibility depends on the setting. Choose metrics with affected stakeholders and the decision context, not because one number makes the model look favorable.

**Practice:** inspect false-negative and false-positive rates by supported group. Report uncertainty for small groups. Compare a model change with a process change, such as additional review.

### Privacy and data rights

Minimize data collection; document purpose, source, access, retention, and deletion. Personal information can appear in training data, prompts, retrieval chunks, traces, caches, and evaluation screenshots. Removing a name alone does not guarantee anonymity.

Learn the difference between de-identification, encryption, access control, and differential privacy. Differential privacy provides a formal bound on how much an output distribution can depend on one person's contribution under a specified mechanism and accounting; it does not mean “add a little noise and data becomes safe.”

**Practice:** trace one fictional person's record through the entire application. Demonstrate deletion or explain retention obligations and technical limits. Verify that tenant-specific caches cannot return another tenant's content.

### Security and adversarial behavior

A threat model identifies assets, trust boundaries, attackers, and possible paths to harm. For AI systems, include prompt injection, poisoned data, malicious retrieved content, unauthorized tool calls, credential exposure, unsafe generated code, and dependency/model artifact risks.

Treat model output and external content as untrusted inputs. Put authentication, authorization, path restrictions, parameterized queries, and action validation in application code. A prompt telling the model to be careful is not an access-control system. For tool-enabled applications, test the whole path from input to side effect.

**Practice:** place a harmless fake instruction in a retrieved document asking for a forbidden action. Verify that trusted permissions remain unchanged and the action gate blocks it.

### Governance and accountability

Governance assigns ownership and records decisions about datasets, model versions, deployment scope, evaluations, changes, incidents, and retirement. A model card describes intended uses, evidence, and limitations; a data record describes collection and permitted use.

The [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) offers a structure for organizing risk work. It is not itself a universal legal-compliance certificate. For a real deployment, identify applicable requirements using the relevant authoritative rules and qualified review.

**Practice:** write a model card and a release decision explaining what evidence is sufficient, what remains uncertain, and who can roll back.

## Mastery lab: a better average can hide a worse outcome

Evaluate a hypothetical triage system on two groups. Group A has 90 correct decisions out of 100; group B has 6 out of 10. Overall accuracy is 96/110, about 87.3%, but that number conceals the smaller group's 60% result. Group B's small sample also makes its estimate uncertain. Neither ignoring the group nor presenting its rate without counts is adequate.

Reconstruct confusion matrices, denominators, and uncertainty before choosing fairness measures. Equal error rates, equal selection rates, and calibration answer different questions and may conflict. The appropriate criteria depend on the decision, affected people, and constraints; a single metric cannot substitute for that analysis.

### Implement enforceable boundaries

For a document assistant, implement authorization as a deterministic predicate over authenticated identity and document ownership, independent of retrieved text:

```python runnable
def can_read(user, document):
    return (user["tenant"] == document["tenant"]
            and document["classification"] in user["allowed"])
user = {"tenant": "school-a", "allowed": {"public"}}
print(can_read(user, {"tenant": "school-a", "classification": "public"}))
print(can_read(user, {"tenant": "school-b", "classification": "public"}))
print(can_read(user, {"tenant": "school-a", "classification": "private"}))
```

```text output
True
False
False
```

The toy predicate teaches the boundary. A real service must derive identity from verified authentication, enforce access on every data path, and account for revocation. A model must not supply its own tenant or expand its permissions.

### Debug and design the system

Trace data from collection through preprocessing, model calls, retrieval, logs, analytics, and deletion. A deletion endpoint that removes the primary row but leaves an embedding, cache entry, or trace copy may not satisfy the system's stated retention contract. Keep a record of where derived data lives and how deletion propagates.

Inject harmless adversarial text into a document asking the assistant to reveal another tenant's records. A successful denial must follow from permissions and tool boundaries, not only from a polite model refusal. Redaction tests need positive and negative cases; over-redacting useful context and failing to redact sensitive data are different errors.

Optimize controls with measured tradeoffs. A smaller logging payload can reduce exposure and cost while preserving IDs, timings, and error classes needed to diagnose failures. Automated checks should escalate ambiguous cases under a defined workflow rather than silently certifying them.

**Interview defense:** “We removed names, so the data is anonymous.” Explain linkage, quasi-identifiers, small groups, free text, and retained copies. State what evidence is needed before making a privacy claim. Governance also requires ownership, intended use, review, incident response, and a change record.

**Teach it:** draw two tenants and a shared search index. Ask the learner to mark every place where access must be checked and to create one cross-tenant failure case. Deliver a data-flow diagram, tested controls, subgroup evaluation with counts, and a decision record describing unresolved risks.

## Mini project and real-world use

Audit your ticket classifier and planned assistant. Produce a data-flow diagram, group-level evaluation, access tests, retention plan, and a simulated incident report. Include at least one change to the product design prompted by the audit.

Uses include hiring tools, public-facing assistants, customer support, education, accessibility, and enterprise search. The affected people and operating context determine which risks matter.

**Completion evidence:** documented scope, ownership, test cases, residual risks, and a practical recovery process. Continue using this evidence in every later project.

## Interview questions

1. How can biased labels create a problem even when model error is low?
2. Why can two fairness metrics disagree?
3. Why is anonymization not the same as encryption?
4. Where should permission checks live in a tool-calling system?
5. What belongs in a model card, and what does it fail to prove?
6. How would you respond to a data leak through an answer cache?

## Curated resources

- **Course:** [Stanford CS324](https://stanford-cs324.github.io/winter2022/), especially harms, data, and societal context.
- **Book:** [Fairness and Machine Learning](https://fairmlbook.org/), Barocas, Hardt, and Narayanan.
- **Papers:** [Model Cards for Model Reporting](https://arxiv.org/abs/1810.03993) and [Datasheets for Datasets](https://arxiv.org/abs/1803.09010), for documenting evidence and provenance.
- **GitHub:** [Fairlearn](https://github.com/fairlearn/fairlearn), for evaluating group-level performance and mitigation tradeoffs.
- **Continue locally:** [Protect data and define responsibility](../engineering/03-security-and-governance.md).

**Previous:** [Prompt engineering](09-prompt-engineering.md) · **Next:** [Multimodal generation](11-generative-multimodal.md).
