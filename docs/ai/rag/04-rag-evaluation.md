---
title: "RAG evaluation and an offline evidence-search project"
sidebar_position: 4
description: "Measure retrieval and answer quality separately, test access and freshness, and run a complete lexical evidence-search demo."
---

# RAG evaluation and an offline evidence-search project

**Before this lesson:** [Grounded answers and honest uncertainty](03-grounded-answers.md).

An **evaluation set** contains representative questions and a clear way to judge the result. For RAG, judge retrieval and the answer separately. Otherwise a fluent answer can hide a missing source, or a poor answer can make a correct retriever look broken.

Create questions before tuning the search. Reserve some for final testing. Include direct questions, paraphrases, exceptions, absent information, old versions, restricted information, and conflicting passages. These cases test different parts of the system.

## Measure a stage, then the whole result

**Recall at k** asks what fraction of the relevant items appear among the first `k` retrieved results. **Precision at k** asks what fraction of those results are relevant. “Relevant” must have a written meaning: an answer-supporting passage is stronger than a passage merely about the same topic. The [information-retrieval evaluation chapter](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-unranked-retrieval-sets-1.html) explains precision and recall.

```python runnable
relevant = {"loan-rule", "reference-exception"}
retrieved = ["loan-rule", "opening-hours", "club-times"]
hits = len(relevant & set(retrieved))
print(f"Recall@3: {hits / len(relevant):.2f}")
print(f"Precision@3: {hits / len(retrieved):.2f}")
```

```text output
Recall@3: 0.50
Precision@3: 0.33
```

This retrieval missed the exception. Increasing `k` may help recall while adding irrelevant context and processing work. Test the effect rather than assuming a larger context is better.

For the final answer, check factual correctness, support for each claim, citation accuracy, useful abstention, and whether restricted information leaked. Also record end-to-end time, model/tool usage, and stale-result rate. Use a direct lookup or lexical-search baseline so complexity has to earn its cost.

## Build a scorecard that reveals the failing component

For each question, save the user scope, expected evidence IDs, retrieved IDs, evidence actually sent to the generator, answer, and reviewed claim support. This lets you distinguish a search miss from a later context-selection or generation error.

**Mean reciprocal rank**, or MRR, measures how early the first relevant result appears. A relevant result at rank 1 contributes 1; rank 2 contributes 1/2; no relevant result contributes 0. Average those values across queries. It can reward finding one useful passage early while missing a second necessary passage, so retain recall as well.

```python runnable
cases = [
    (["hours", "loan-rule", "reference-exception"], {"loan-rule", "reference-exception"}),
    (["loan-rule", "hours"], {"loan-rule"}),
    (["club-times", "hours"], {"reference-exception"}),
]
reciprocal_ranks = []
recalls = []
for retrieved, relevant in cases:
    first = next((rank for rank, item in enumerate(retrieved, 1) if item in relevant), None)
    reciprocal_ranks.append(1 / first if first is not None else 0)
    recalls.append(len(set(retrieved) & relevant) / len(relevant))
print(f"MRR: {sum(reciprocal_ranks) / len(cases):.2f}")
print(f"Mean recall over returned lists: {sum(recalls) / len(cases):.2f}")
```

```text output
MRR: 0.50
Mean recall over returned lists: 0.67
```

`next(iterator, default)` returns the first available item, or the default if there is none. The example deliberately uses variable-length returned lists; label that recall accordingly rather than pretending every list has the same cutoff.

### Measure the decision to abstain

Split questions into answerable and unanswerable under the **current user's allowed evidence**. A question can be answerable for staff and unanswerable for a student.

For answerable questions, measure how often the system supplies a supported useful answer and how often it unnecessarily abstains. For unanswerable questions, measure how often it appropriately abstains and how often it invents an answer. An assistant that refuses everything may have no unsupported answers but still fail its purpose.

Do not combine these cases into a score without showing the counts. If the evaluation set has mostly answerable questions, always answering may look deceptively good; a mostly unanswerable set can favor always refusing.

**Challenge:** retrieval contains both the rule and its exception, but the final context contains only the rule. Which component needs investigation?

<details>
<summary>Locate the evidence loss</summary>

The initial retriever found the needed passages. Inspect deduplication, reranking, context budgets, and context assembly to find where the exception disappeared. Save the actual model input; a list of retrieved IDs alone cannot establish that the generator received the evidence.

</details>

## Stage project: a complete offline evidence path

Download [evidence_search.py](pathname:///examples/ai/rag/evidence_search.py). It contains a tiny fictional school collection and needs Python 3.10 or later. There are no packages, model downloads, paid calls, or external files.

```sh
python3 evidence_search.py
python3 evidence_search.py --self-test
```

The first command prints:

```text
Mode: lexical search + exact excerpts; no language model
Q: How long can students borrow books?
Evidence: Students may borrow books for 21 days. [H1-v2]
Q: Where is the telescope stored?
No evidence found in the current sources you may access.
Q: What is the staff equipment budget?
No evidence found in the current sources you may access.
```

The program filters permissions and superseded records before ranking. It uses a BM25-style lexical score, then returns exact passages with versioned citation IDs. It requires at least two overlapping query terms as a deliberately simple evidence threshold. The self-test checks retrieval, citations, empty input, restricted data, and the exclusion of an old 14-day policy.

**This is not a semantic RAG system or an LLM answer generator.** It is a retrieval-and-excerpt teaching project. Its `role` argument is a test fixture, not authentication. A real application obtains that role from a trusted identity system. Its two-term rule can miss a good paraphrase or accept an unrelated passage with matching words. A lexical hit does not establish that every part of a question is answered.

## Run a useful experiment

1. Read the corpus and write the expected source ID for each question.
2. Change “borrow books” to a paraphrase with different words; observe a possible miss.
3. Add a current passage with a similar phrase but a different meaning.
4. Record the failures before changing tokenization, thresholds, or ranking.
5. Rerun the same questions and the reserved test questions.

The next step could be an embedding retriever, a reranker, or a constrained generator. Add one at a time. Keep access controls and version rules outside the model, and keep the extractive baseline for comparison.

## Practice

The system returns the correct citation ID but says 14 days instead of 21. Which evaluation stage failed? What if the correct passage was never retrieved?

<details>
<summary>Check your answer</summary>

The first case is an answer-support failure: the cited passage does not support the generated number. The second is a retrieval-recall failure. Record them separately. A citation-existence test alone would miss the first error, and rewriting the prompt alone would not fix the second.

</details>

## Depth lab: isolate retrieval failures with controlled replacements

An **oracle experiment** temporarily supplies an ideal component output to locate a bottleneck. For example, replace retrieved passages with human-selected evidence while keeping the generator and prompt fixed. This is diagnostic evidence, not a deployable retrieval result.

```python runnable
# Each row is one answerable query: retrieved needed evidence, supported final answer.
runs = [(True, True), (True, True), (True, False), (False, False), (False, False)]
evidence_found = sum(found for found, correct in runs)
supported = sum(correct for found, correct in runs)
print("evidence coverage:", evidence_found / len(runs))
print("supported answers:", supported / len(runs))
print("success given evidence:",
      sum(found and correct for found, correct in runs) / evidence_found)
```

```text output
evidence coverage: 0.6
supported answers: 0.4
success given evidence: 0.6666666666666666
```

The generator fails once even with required evidence present. Improving retrieval alone cannot remove that demonstrated failure. Conversely, improving the generator cannot reliably invent the evidence missing from the other two cases.

Run three controlled comparisons on the same questions: ordinary retrieval and generation; human-selected evidence with the same generator; retrieved evidence with a reviewed answer. Inspect what each replacement improves. Keep unanswerable questions in a separate slice: giving them fabricated “oracle evidence” changes the task.

**Debugging drill:** add a question needing two passages. Measure whether both reach final context. Recall of any one relevant passage can look strong while the system lacks enough information to answer. Label sufficient evidence sets where appropriate instead of assuming one gold document per question.

**Production scorecard:** include answerable coverage, supported answers across all requests, erroneous answers to unanswerable requests, correct abstentions, and permission failures. Count timeouts and invalid outputs explicitly. Conditional success among answered requests can rise simply because the system abstains more often.

**Optimization:** change one retrieval parameter on development queries, plot quality against latency, and inspect per-query regressions. Freeze the choice before final testing. Group related queries from one source when calculating uncertainty; many paraphrases of one fact are not many independent facts.

<details>
<summary>Interview defense: what does strong oracle-evidence performance prove?</summary>

It suggests that the generator can handle those evaluated cases when supplied that evidence format. It does not prove the production retriever can find it, that unseen cases work, or that access and freshness are correct. If oracle performance remains poor, investigate generation, evidence packaging, and the evaluation rubric before only tuning the index.

</details>

**Teach-back project:** produce a five-case failure report with stage traces and one targeted remedy per case. Include a retrieval miss, missing exception, unsupported generated claim, stale source, and legitimate abstention.

**Previous:** [Grounded answers and honest uncertainty](03-grounded-answers.md) · **Next:** [Build and evaluate a hybrid retrieval pipeline](05-hybrid-search-lab.md)
