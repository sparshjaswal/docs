---
title: "1. AI fundamentals, history, and the ecosystem"
sidebar_position: 1
---

# AI fundamentals, history, and the ecosystem

**Prerequisites:** none. Your experience building web applications helps with examples, but no AI mathematics is assumed. Start with the [course orientation](../orientation.md).

## What it is and why it matters

Artificial intelligence studies systems that perform tasks such as prediction, search, perception, language use, and decision-making. The practical question is not “Where can I add a chatbot?” It is “Which decision or task can this system improve, and how will I know?” Your first skill is choosing a problem and a measurable baseline.

## Learn in this order

### AI, machine learning, deep learning, and generative AI

**AI** is the broad field. A rule-based planner can be AI without learning from examples. **Machine learning (ML)** fits patterns from data rather than specifying every decision by hand. **Deep learning (DL)** uses neural networks with multiple learned transformations. **Generative AI** produces content such as text, images, or audio. These labels overlap: a modern language generator commonly uses deep learning, while a simple statistical text generator need not be a deep network.

A classifier maps input to a category; a generator models possible outputs and produces one. Neither automatically knows whether its output is true. **Training** changes a model using data. **Inference** uses the trained model. A database update or a new chat message is not necessarily a training update.

**Practice:** classify a password rule, a spam predictor, an image classifier, and a text generator using these definitions. Identify which behavior comes from hand-written rules and which comes from learned parameters.

### Narrow AI, AGI, and ASI

**Narrow AI** is designed or evaluated for a bounded set of tasks. **Artificial general intelligence (AGI)** refers to broadly general capability, but definitions and measurement criteria differ. **Artificial superintelligence (ASI)** describes hypothetical capability substantially exceeding human capability across broad domains. These are concepts to analyze, not three product tiers or a guaranteed sequence with known dates.

Separate demonstrated performance from a claim about generality. A system can excel at code completion and fail a simple task with an unfamiliar interface. A high benchmark score does not establish reliable performance in every environment.

**Practice:** rewrite “This agent is intelligent” as three testable claims, including task distribution, success measure, and resource limit.

### History: learn the problems behind the milestones

Turing's 1950 work asked how to investigate machine intelligence through behavior. The 1955 proposal for the 1956 Dartmouth summer project helped establish AI as a named research field. Symbolic search and expert systems emphasized explicit knowledge and rules; their limits included brittle knowledge engineering. Statistical learning emphasized generalization from examples. Neural networks developed alongside these approaches, with modern deep learning accelerated by data, compute, and training methods. ImageNet-era vision advances in the 2010s and Transformers from 2017 helped shape today's foundation-model ecosystem.

This is a compressed history, not a story in which each method made every earlier one obsolete. Search, logic, optimization, probabilistic models, and control remain useful. An ordinary database query can outperform a language model on an exact factual lookup.

**Practice:** make a timeline pairing each approach with a problem it solved and one limitation. Do not memorize dates without understanding the tradeoff.

### The ecosystem and your developer advantage

Separate data providers, model researchers, model hosts, application developers, infrastructure teams, and evaluators. A model repository distributes artifacts; a hosted endpoint serves requests; an application supplies identity, context, tools, and a user experience. Open weights, open source, open training data, and permission for commercial use are different claims.

As a full-stack developer, reuse your knowledge of APIs, databases, authentication, queues, deployment, and UI testing. Add statistics, data provenance, model evaluation, and uncertainty. The browser should communicate progress and limitations; it should not treat a fluent answer as verified application state.

## Mastery lab: turn a claim into a decision

### Explain the mechanism and build a baseline

Consider routing support tickets to “billing” or “other.” A rule uses a condition chosen by a person. A learned classifier estimates a mapping from labeled examples. A generator predicts an output sequence; it may produce a category, but that does not make every generated category correct. The difference is how the behavior is obtained, not whether the system has a chat interface.

Implement this rule before using a model. The labels are deliberately simple; the third case exposes a limitation of keyword matching.

```python runnable
def route(text):
    words = set(text.lower().replace(".", "").split())
    return "billing" if words & {"invoice", "payment"} else "other"

cases = [
    ("Where is my invoice?", "billing"),
    ("Please reset my password.", "other"),
    ("Payment is fine. I cannot sign in.", "other"),
]
# Punctuation handling is intentionally incomplete.
predictions = [route(text) for text, _ in cases]
print(predictions)
print(sum(p == label for p, (_, label) in zip(predictions, cases)))
```

```text output
['other', 'other', 'billing']
1
```

The first error comes from preprocessing: `invoice?` does not equal `invoice`. The last error comes from meaning: mentioning a payment does not make payment the user's problem. Removing punctuation repairs one failure but cannot repair the other. This separates a coding bug from a limitation of the decision rule.

### Debug, optimize, and design the production path

First save the raw input, normalized representation, rule version, and decision in a privacy-appropriate test fixture. Test a punctuation fix on all cases. Then construct examples involving negation and multiple requests. Compare rules, a small classifier, and a generator on a reserved dataset. Optimize the actual objective—correct routing under a review budget—rather than model complexity.

In a product, place the router behind a validated request contract and keep a manual correction path. Store the original prediction separately from the correction so later evaluation does not silently rewrite history. A low-confidence or unsupported category should have an explicit fallback. A model can be a component of this system without owning the business decision.

**Interview defense:** “Why not use a large model for everything?” A strong answer names the task, baseline error, cost, latency, failure consequences, and evidence that would justify the added complexity. “AI is more accurate” is not a comparison.

**Teach it:** use the three cases above to explain rule errors, representation errors, and model errors. Ask the learner to invent a fourth case that punctuation removal cannot fix. Keep the resulting dataset and decision report as evidence for the [eight mastery demonstrations](../assessments.md#eight-mastery-demonstrations).

## Mini project and real-world use

Write a two-page proposal for a support-ticket assistant. Specify the user, baseline workflow, input data, expected output, failure costs, and how a reviewer will judge success. Compare a rules-only router, a learned classifier, and an assistant that drafts responses. Do not build all three yet.

Real uses include search ranking, demand forecasting, visual inspection, accessibility tools, and draft generation. Each has different error costs; an appealing demo does not settle the business case.

**Completion evidence:** a problem statement, five success cases, five failure cases, and a reason the simplest baseline is insufficient—or a decision to keep it.

## Interview questions

1. Can a system be AI without ML? Give a search or rules example.
2. How do training and inference differ in data flow and cost?
3. Why does generative capability not establish factual reliability?
4. What evidence would distinguish task-specific success from a claim of general capability?
5. Which components of an AI product are ordinary software engineering?

## Curated resources

- **Course:** [Harvard CS50 AI](https://cs50.harvard.edu/ai/) for search, knowledge, uncertainty, learning, and language. Do its programming projects after the Python module.
- **Book:** [Artificial Intelligence: A Modern Approach](https://www.pearson.com/en-us/subject-catalog/p/artificial-intelligence-a-modern-approach/P200000003500/9780134610993), Russell and Norvig; use the introductory and intelligent-agent chapters now, mathematical chapters later.
- **Paper / historical source:** [The Dartmouth proposal, reprinted in AI Magazine](https://ojs.aaai.org/aimagazine/index.php/aimagazine/article/view/1904/0); compare its research ambitions with measurable modern tasks.
- **GitHub:** [AIMA Python](https://github.com/aimacode/aima-python), accompanying implementations. Read a search example after learning queues and graphs.

**Next:** [Python for AI](02-python-for-ai.md).
