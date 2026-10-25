---
title: "Indexing, chunks, and search choices"
sidebar_position: 2
description: "Build useful passages and compare lexical, dense, hybrid, and reranked retrieval with access and freshness controls."
---

# Indexing, chunks, and search choices

**Before this lesson:** [Retrieval basics: find evidence before answering](01-retrieval-basics.md).

An **index** is a prepared structure that helps search find candidates efficiently. **Indexing** turns source material into searchable records. A **chunk** is one portion of a document stored as a search unit.

The school handbook is too long to use as one answer passage, but splitting every ten words can separate a rule from its exception. Chunking is therefore a reading problem as well as a size problem: preserve the information needed to interpret the sentence.

## Prepare trustworthy records

For each source, record an ID, version, title, section, update time, and access rules. An **access-control list**, or **ACL**, identifies who may use it. The application obtains permissions from trusted identity and policy data; it must not accept a caller’s claim to be “staff” as proof.

1. Extract text while retaining headings, lists, and table meaning.
2. Remove duplicate copies and identify superseded versions.
3. Split at useful boundaries, such as a section or complete rule.
4. Attach source metadata and permissions to every chunk.
5. Build search records, then test known questions before publishing the index.

For example, keep “Books: 21 days. Reference copies: library use only” together when the exception changes the answer. Small overlapping chunks can preserve boundary context, but overlap also produces repeated evidence. Deduplicate selected results so three copies of one rule do not look like three independent sources.

## Walk a document through ingestion

Suppose handbook `H1` has two sections: borrowing rules and opening hours. Version 2 changes the borrowing period from 14 days to 21. Keep source identity separate from the identity of a particular searchable passage:

```json
{
  "chunk_id": "H1-v2-borrowing-01",
  "source_id": "H1",
  "version": 2,
  "section": "Borrowing",
  "text": "Ordinary books: 21 days. Reference copies stay in the library.",
  "access_scope": "students-and-staff",
  "status": "current"
}
```

This is fictional metadata supplied by the ingestion application, not fields that a model or document author can use to grant access. A source can have many chunks, and a new source version can produce different chunks. Retain enough location information to open the original passage when a citation is selected.

Consider the question “Can I take the reference atlas home for 21 days?” A fixed-length split might return only “Ordinary books: 21 days.” A section-aware split keeps the exception with the rule. A third design indexes small passages but expands a hit to its parent section before answering. Compare these designs on questions that need an exception, not just questions that quote the first sentence.

| Chunking choice | Likely benefit | Cost or failure to measure |
| --- | --- | --- |
| Short fixed windows | Simple size control | Rules and exceptions can separate. |
| Complete sections | More intact meaning | Long sections may carry irrelevant text. |
| Small hits plus parent expansion | Precise search with additional context | More metadata and context-selection work. |
| Overlapping windows | Some boundary context survives | Repeated text consumes space and can inflate apparent evidence. |

For a table, repeat the needed column headings with extracted rows. The row “Friday, 18:00” is ambiguous if the heading “Closing time” is lost. The best text extractor is not necessarily the one that produces the longest string.

**Ingestion checkpoint:** query a versioned source, replace it, remove it, and revoke a user's access in your fixture collection. For each operation, inspect the search results and the answer cache. A pipeline that only tests additions has not demonstrated correct deletion or revocation.

## Lexical ranking: BM25

**BM25** is a word-based relevance score. It rewards matching query terms, gives uncommon terms more weight, limits the benefit from repeating a term, and adjusts for document length. It is a ranking method, not a probability that an answer is correct. The [information-retrieval textbook’s BM25 section](https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html) gives the equations.

One ingredient is inverse document frequency: a word found in fewer documents can be more useful for distinguishing results. This small example uses a positive IDF variant; it does not implement all of BM25.

```python runnable
import math

document_count = 10
for term, matching_documents in [("library", 8), ("telescope", 1)]:
    idf = math.log(1 + (document_count - matching_documents + 0.5)
                   / (matching_documents + 0.5))
    print(f"{term}: {idf:.3f}")
```

```text output
library: 0.258
telescope: 1.992
```

A rare misspelling can also receive a large weight. Scoring needs sensible tokenization and evaluation, not blind trust in a number.

## Dense, hybrid, and reranked search

Dense search embeds queries and chunks into numeric vectors. Store the embedding model version with the index. If that representation changes, old and new vectors may no longer be comparable; plan to rebuild or migrate the index. Exact nearest-neighbor search compares candidates directly. Approximate search trades some retrieval accuracy for speed or memory efficiency.

Hybrid search combines lexical and dense results. Their raw scores may use different scales, so simply adding them can be misleading. One approach combines rank positions; another tunes weights on development questions.

A cross-encoder reranker reads a query and candidate together, then gives a relevance score. This can consider details missed by an initial broad search, at additional processing cost. It cannot restore a source that was never retrieved. The [retrieve-and-rerank documentation](https://www.sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html) explains this division of work.

## Make changes visible

Freshness includes additions, edits, removals, and permission changes. When a policy changes, update its searchable record and prevent an old cached result from reappearing. When access is revoked, enforce that revocation at query time even if rebuilding an index takes longer. Do not let a summary cache bypass the same permissions.

Use a lexical baseline first. Add dense search when paraphrases are missed; add a reranker when the right source is present but poorly ordered. Measure each change on the same questions, recording recall, response time, and resources used.

## Practice

A rule and its exception land in separate chunks. Retrieval returns only the rule. Propose two fixes, and explain one cost of each.

<details>
<summary>Check your answer</summary>

Keep the whole section in one chunk, which may include more irrelevant text. Alternatively, expand a hit to nearby or parent-section context, which adds retrieval and context-budget work. Test both against questions about the exception; a larger chunk is not automatically better.

</details>

## Depth lab: calculate BM25's saturation and length penalty

One common positive-IDF BM25 variant scores each matching query term using:

`IDF * frequency * (k1 + 1) / (frequency + k1 * (1 - b + b * length / average_length))`.

Here `k1` controls how quickly extra repetitions stop adding much value. `b` controls document-length normalization. The full score sums term contributions; tokenizer choices and the exact IDF convention are part of the implementation contract. This lab scores one term.

```python runnable
import math

def contribution(frequency, length, average_length, document_count, containing):
    k1, b = 1.2, 0.75
    idf = math.log(1 + (document_count - containing + 0.5) / (containing + 0.5))
    normalizer = k1 * (1 - b + b * length / average_length)
    return idf * frequency * (k1 + 1) / (frequency + normalizer)

for frequency, length in [(1, 100), (3, 100), (3, 300), (0, 100)]:
    print(frequency, length, round(contribution(frequency, length, 100, 10, 2), 3))
```

```text output
1 100 1.482
3 100 2.328
3 300 1.63
0 100 0.0
```

Three occurrences do not triple the score. Keeping three occurrences while tripling document length reduces the score. The formula encodes assumptions about useful repetition and length; evaluate whether those assumptions fit your corpus.

An **inverted index** maps each term to a list of documents containing it, often with frequencies and positions. Query evaluation can visit these posting lists instead of scanning every word in every document. Additions and deletions must update postings and corpus statistics. Otherwise a removed document can persist in results or statistics can become inconsistent.

**Debugging drill:** index a policy, edit its duration, and delete it. Query after each step. Verify both the visible result and stored posting entries. Repeat with a permission revocation: removal from a result cache is not a substitute for enforcing current authorization before text is returned.

**System design and optimization:** publish a new index generation only after its records and metadata are complete. Keep a generation identifier in traces and cache keys. Compare chunk sizes with a fixed final evidence budget, since a larger top-k of longer chunks changes two variables at once. Use a separate current access check where index propagation can lag.

<details>
<summary>Interview defense: why might chunking change ranking even when no source words change?</summary>

Chunks become retrieval documents. Their lengths, the number of documents, and how often a term appears across documents all change, affecting BM25 statistics. Dense representations also depend on chunk context. Chunking is therefore a model of retrieval units, not just a storage operation.

</details>

**Build and teach:** implement an in-memory inverted index for ten documents, support replacement and deletion, and compare scores with a brute-force reference. Explain which statistics change after splitting one document into two.

**Previous:** [Retrieval basics: find evidence before answering](01-retrieval-basics.md) · **Next:** [Grounded answers and honest uncertainty](03-grounded-answers.md)
