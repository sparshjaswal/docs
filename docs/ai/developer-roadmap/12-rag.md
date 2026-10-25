---
title: "12. RAG, vector databases, hybrid search, and reranking"
sidebar_position: 12
---

# RAG, vector databases, hybrid search, and reranking

**Prerequisites:** embeddings, ranking metrics, LLM context, structured outputs, and access control. Complete the [core RAG sequence](../rag/01-retrieval-basics.md).

## What it is and why it matters

Retrieval-augmented generation (RAG) retrieves evidence and uses it to produce an answer. It is useful when information changes, belongs to an organization, or must be cited. Retrieval gives the model relevant material; it does not force the answer to be true or the source to be trustworthy.

## Learn in this order

### Ingestion, chunking, and source identity

Extract text while preserving headings, tables, dates, and document identity. A chunk is a searchable passage. Small chunks can retrieve precisely but lose context; large chunks preserve context while consuming more space and adding irrelevant material.

Compare fixed windows, section-based chunks, and small hits expanded to a parent section. Preserve rule/exception pairs. Track versions, deletions, access labels, and source locations. An update must reach the index and any answer cache.

**Practice:** split a policy document containing a general rule and an exception. Write queries requiring both. Compare chunk designs using [indexing examples](../rag/02-indexing-and-search.md).

### Embeddings and vector databases

An embedding model produces a vector; a vector index finds nearby vectors; a database manages records and operational behavior. These are different responsibilities. Learn exact nearest-neighbor search first, then approximate methods such as graph-based HNSW and partition/quantization approaches.

Approximation trades search work and memory against neighbor recall. A fast index can return the wrong semantic evidence even when it finds the nearest vectors correctly. Distinguish index recall from task relevance.

**Practice:** compare exact vector search with an approximate index on a small labeled corpus. Measure relevant evidence, latency, memory, update behavior, and filtering. Start with a database you can operate, such as PostgreSQL plus pgvector, before adding a separate service.

### Hybrid search and query handling

Lexical search can match exact names, codes, and identifiers; dense retrieval can help with semantic variation. Hybrid search combines them. Raw scores from different methods may not be comparable. Rank-based fusion combines positions instead of assuming common score scales.

Query rewriting can resolve shorthand or improve recall, but can also change the user's meaning. Decomposition can split a multi-part question into smaller searches; preserve the relationship between subquestions and evidence.

**Practice:** run the [hybrid-search lab](../rag/05-hybrid-search-lab.md) on exact IDs, paraphrases, and contradictory passages. Keep a lexical-only baseline.

### Reranking and context assembly

A fast first-stage retriever selects candidates. A reranker examines fewer candidates more carefully, often scoring query/document pairs together. This can improve ordering at extra cost. No reranker can recover a relevant passage absent from its candidate set.

After ranking, deduplicate and assemble context under a token budget. Keep citations attached to passages and prioritize required exceptions. Enforce authorization before evidence enters the model; a final text filter cannot undo a data disclosure already sent upstream.

**Practice:** log retrieved candidates, reranked candidates, and the actual model context separately. Introduce a small budget and identify where essential evidence is lost.

### Answering and evaluation

Measure retrieval recall and ranking, claim support, citation accuracy, answer completeness, appropriate abstention, freshness, and end-to-end cost. Split answerable and unanswerable questions under the current user's permissions.

Use a saved evaluation set with expected evidence IDs and reviewed answers. If the retriever found the exception but the context builder dropped it, changing the generation prompt alone addresses the wrong component.

**Practice:** follow [RAG evaluation](../rag/04-rag-evaluation.md) and include inaccessible, deleted, outdated, conflicting, and absent sources.

## Mastery lab: locate the first failing stage

Suppose the answer is in document D3. The extractor omits its table, chunking separates the heading from the value, retrieval misses its chunk, or generation ignores an otherwise sufficient passage. All four failures produce a wrong answer, but changing the prompt only addresses the last one.

Start with an oracle test: give the answerer the exact relevant passage. If it still fails, fix answer generation or evaluation before tuning retrieval. If it succeeds, move upstream and inspect extraction, chunk construction, filters, and ranking.

### Implement rank fusion from scratch

Lexical and dense scores have different scales. Reciprocal-rank fusion combines rank positions rather than directly adding unrelated scores.

```python runnable
def fuse(rankings, constant=60):
    scores = {}
    for ranking in rankings:
        if len(set(ranking)) != len(ranking):
            raise ValueError("Duplicate document in one ranking")
        for rank, document in enumerate(ranking, 1):
            scores[document] = scores.get(document, 0) + 1/(constant+rank)
    return sorted(scores, key=lambda d: (-scores[d], d))
print(fuse([["A", "B"], ["B", "C"]]))
```

```text output
['B', 'A', 'C']
```

B appears in both lists and wins. A and C receive one contribution each, with A ranked higher in its list. The constant controls how sharply rank differences matter. It is a tuning choice, not a universal optimum. Compare lexical, dense, fusion, and reranking under the same candidate budget.

### Debug, optimize, and operate

| Failure | Inspect | Useful experiment |
| --- | --- | --- |
| Relevant document absent | Source permissions, extraction, indexing lag | Search by known document ID and compare stored text. |
| Relevant chunk ranks poorly | Query normalization, chunk boundaries, model compatibility | Exact dense search and lexical baseline before approximate-index tuning. |
| Citations exist but do not support the claim | Evidence-to-claim relation | Manually review atomic claims against cited passages. |
| Removed document still appears | Index, cache, and source versions | Delete/revoke, then repeat a saved query through every serving path. |

Measure retrieval recall at a fixed candidate count and answer correctness on answerable and unanswerable queries. A citation-ID check is necessary but cannot establish entailment. Separate no evidence, inaccessible evidence, conflicting evidence, and dependency failure.

Production ingestion needs stable source IDs, versions, access metadata, update/deletion handling, and repeatable chunking. A query must enforce access before exposing candidates and again where required by the data boundary. Cache keys need relevant corpus/model/access context.

Optimize chunk size, candidate count, approximate search, and reranking only against a measured baseline. A faster approximate index can reduce recall; more chunks can increase both evidence and distraction. Track end-to-end quality, latency, cost, and freshness.

**Interview defense:** “Our retrieval recall is 95%, but answers are poor.” Explain denominator, sufficient evidence, context construction, conflicting sources, generation, and the evaluator. Choose an oracle experiment to isolate the next hypothesis.

**Teach it:** draw source → extraction → chunk → retrieval → evidence → claim. Plant one failure in each stage and have the learner identify the earliest incorrect artifact. Deliver a reproducible ablation, deletion/access tests, and a supported-answer review.

## Mini project and real-world use

Build a developer-documentation assistant over a small permitted repository. Show citations opening the exact source passage. Add document updates, deletion, user scopes, and an “insufficient evidence” response.

Uses include enterprise search, policy assistance, support knowledge bases, and research literature exploration. Exact transactional facts may still belong behind a structured API rather than a text index.

**Completion evidence:** ingestion tests, at least 40 reviewed questions, lexical/dense/hybrid comparisons, reranking ablation, access tests, deletion verification, and measured latency.

## Interview questions

1. How do chunk size and overlap affect both relevance and cost?
2. Why are vector-index recall and answer correctness different?
3. When does lexical retrieval outperform embeddings?
4. Why can increasing the candidate count hurt the final answer?
5. How do you prevent stale or cross-tenant cache results?
6. How would you diagnose correct retrieval followed by an incorrect answer?

## Curated resources

- **Course:** [Full Stack LLM Bootcamp](https://fullstackdeeplearning.com/llm-bootcamp/spring-2023/), for retrieval in an application; supplement its older examples with current library docs.
- **Book:** [Introduction to Information Retrieval](https://nlp.stanford.edu/IR-book/), Manning, Raghavan, and Schütze; learn indexing and ranking before vector-store abstractions.
- **Papers:** [RAG](https://arxiv.org/abs/2005.11401) and [Dense Passage Retrieval](https://arxiv.org/abs/2004.04906), for retrieval/generation and dense-retrieval experiments.
- **GitHub:** [pgvector](https://github.com/pgvector/pgvector), [Faiss](https://github.com/facebookresearch/faiss), and [Sentence Transformers](https://github.com/UKPLab/sentence-transformers).

**Previous:** [Multimodal generation](11-generative-multimodal.md) · **Next:** [AI agents](13-ai-agents.md).
