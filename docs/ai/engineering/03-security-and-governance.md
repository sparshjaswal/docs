---
title: "Protect data and define responsibility"
sidebar_label: "3. Security and governance"
sidebar_position: 3
---

# Protect data and define responsibility

**Before this lesson:** [evaluation and monitoring](./02-evaluation-and-monitoring.md). You have already seen untrusted retrieved text and tool validation in the agent lessons. Here we connect those ideas to the whole organization.

**Security** protects systems from unauthorized access and actions. **Privacy** concerns appropriate handling of information about people. **Governance** makes responsibilities, decision rules, and review processes explicit. A model can pass an accuracy test while failing all three.

Start with a **threat model**: describe valuable assets, who can access them, how information enters or leaves, and what could go wrong. An asset may be a private document, an account, a tool permission, or even a user's trust in an answer.

## Trace a library assistant's boundaries

The assistant can search public book descriptions. Staff notes are private. A malicious description might tell the model to reveal those notes. The instruction is text inside a source; it has no authority to change access policy. Enforce source permissions before retrieval and enforce tool permissions again before execution. A prompt asking the model to “be safe” cannot replace those checks.

| Failure | Prevention or containment | Evidence to test |
| --- | --- | --- |
| A student sees staff-only notes | Server-side identity and document access filtering | Cross-user and cross-role retrieval tests. |
| Retrieved text requests an unauthorized action | Treat sources as data; validate and authorize tool calls independently | Injection attempts inside documents and tool results. |
| Logs store private questions forever | Minimize, redact, restrict access, and expire records | Retention and deletion tests. |
| A new model artifact runs unexpected code | Verify origin, format, checksum, and loading behavior | Reproducible artifact loading in an isolated environment. |
| A tool action runs twice after a retry | Use an operation ID and an idempotent handler | Retry the same action and inspect its effect. |

**Idempotent** means repeating an operation has the same intended effect as performing it once. It is essential for payments or bookings, but also useful for simple writes. A retry loop without this property can multiply side effects.

## Collect the smallest useful dataset

Record why data is needed, where it came from, who may use it, and when it should be removed. Do not treat a public URL as permission for every reuse. Check the dataset's terms and provenance, and record consent or other authorization where applicable. Removing names alone may leave other identifying combinations.

Training and retrieval have different deletion implications. Removing a document from a search index does not remove information already included in model training. Keep the data lineage—the record of where data flowed—so a deletion request can reach copies, indexes, caches, and logs. Exact obligations depend on context; involve the appropriate owner before a real deployment.

## Document intended use and limits

A **model card** describes a model's intended uses, evaluation, limitations, and relevant risks. A **dataset datasheet** explains collection, contents, intended use, and maintenance. These records help other people decide whether a system suits their problem; they are not certificates of universal safety. [Model Cards](https://arxiv.org/abs/1810.03993), [Datasheets for Datasets](https://arxiv.org/abs/1803.09010).

For the library assistant, document supported languages, catalogue coverage, update frequency, known retrieval failures, and who handles incorrect results. If a system affects a consequential decision, define meaningful human review rather than adding a person who simply accepts every model answer.

An incident plan needs an owner, a way to restrict or stop the affected behavior, evidence preservation rules, and a recovery procedure. Practise with a fictional leaked-source incident before using real private data. NIST's AI Risk Management Framework provides a voluntary structure for organizing this work; using a framework is not the same as meeting every applicable legal obligation. [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework).

## Exercise: review an unsafe proposal

A team proposes storing every user's full conversation, giving the assistant a shared administrator key, and asking it to ignore malicious instructions. Identify three concrete changes.

<details>
<summary>Compare a safer design</summary>

Collect only justified conversation data with access and retention controls. Replace the shared administrator key with narrow server-side permissions tied to the current user and operation. Treat source text as untrusted, validate tool arguments, enforce authorization outside the model, and require human approval for consequential actions. Test refusal, cross-user boundaries, and recovery—not only helpful responses.

</details>

**Project addition:** write a one-page threat model for your RAG or agent project. Include one hostile document, one unauthorized user, one accidental duplicate action, and the exact test that detects each failure. Keep the test fixtures fictional.

## Depth lab: test boundaries and subgroup errors separately

A threat model begins with assets, actors, entry points, and allowed information flows. For a handbook agent, assets include private documents, credentials, tool authority, and user state. Entry points include user text, retrieved passages, images, tool results, and installed integration code.

Draw an untrusted document entering retrieval, then reaching the model, then proposing a tool call. Mark the exact code boundary that rejects a request outside the caller's authority. A prompt saying “ignore malicious instructions” is useful guidance, but it does not enforce that boundary.

**Implementation exercise:** create fictional records for two tenants. Test direct lookups, search results, caches, summaries, exports, and delayed jobs. The unauthorized tenant's content must never reach the model input or final output. Include a permission change after a job is queued and before it executes.

Responsible behavior also includes unequal errors. Measure relevant subgroups with sufficient data and a clearly defined label:

```python runnable
groups = {
    "A": {"tp": 18, "fn": 2, "fp": 8, "tn": 72},
    "B": {"tp": 12, "fn": 8, "fp": 4, "tn": 76},
}
for name, counts in groups.items():
    tpr = counts["tp"] / (counts["tp"] + counts["fn"])
    fpr = counts["fp"] / (counts["fp"] + counts["tn"])
    print(name, f"TPR={tpr:.2f}", f"FPR={fpr:.2f}")
```

```text output
A TPR=0.90 FPR=0.10
B TPR=0.60 FPR=0.05
```

This fictional classifier misses more positive cases in group B while producing fewer false alarms. No single number establishes fairness. Investigate labels, representation, sampling, thresholds, uncertainty, and the consequences of each error. Group information itself may be sensitive; collect and use it only under an appropriate policy.

**Debugging and optimization:** red-team a concrete boundary with reproducible fixtures, then verify that the fix preserves legitimate access. Redaction can reduce logging exposure but is not a proof of anonymization. Hashes, rare attributes, and combinations of fields can still identify people.

**Production governance:** assign an owner for data, models, integrations, incidents, and release decisions. Record intended use, limits, review criteria, retention, and rollback authority. Version these decisions with the system rather than leaving them in a detached checklist.

<details>
<summary>Interview defense: does a better average score justify release?</summary>

Not by itself. A release can improve average quality while worsening an important subgroup or violating a critical permission boundary. Examine the task-specific harms, uncertainty, and non-negotiable controls. A higher aggregate score cannot compensate for an unauthorized disclosure.

</details>

**Teach-back:** present one security failure, one privacy failure, and one unequal-error pattern. Explain why they need different evidence and remedies even when all arise in the same application.

**Previous:** [Evaluate releases and monitor real use](02-evaluation-and-monitoring.md) · **Next:** [Design an AI system and release it deliberately](04-architecture-and-cost.md)
