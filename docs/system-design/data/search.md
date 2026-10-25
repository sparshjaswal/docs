---
title: "Search indexing and crawling"
slug: "/system-design/search"
pagination_prev: "system-design/data/caching"
pagination_next: "system-design/data/data-pipelines"
---

<span id="search-indexing-and-crawling"></span>

# Search indexing and crawling

Build a derived index with crawling, ranking, and deletion rules.

**Prerequisite / previous:** [Caching](caching.md) · **Next:** [Data Pipelines Overview](data-pipelines.md)

Search usually maintains a derived index so that queries need not scan every source record. A school library catalog is a useful analogy: the catalog helps find books, but changes to the shelves must eventually reach the catalog.

## Collection, indexing, and retrieval

A crawler discovers URLs from seeds and links, respects site access and rate policies, fetches bounded content, and records outcomes for retries. Normalize URLs conservatively: different query strings can represent different content. Deduplicate both URL identities and content where appropriate. A [Bloom filter](../../DSA/bloom-filter/README.md) can reduce exact-set lookups, but false positives mean it must not silently suppress required pages when completeness matters.

An inverted index maps analyzed terms to matching documents. Tokenization, language handling, synonyms, and ranking affect relevance. Elasticsearch uses mappings and Lucene indexes; accepting JSON does not mean schema-free operation. Indexing and refreshing are different steps, so search visibility is generally near real time rather than synchronous with every write. An entire search engine should not be described simply as an LSM-tree dictionary.

## Request flow

Parse and bound the query, retrieve candidates, rank them, apply authorization, and return a paginated result. Preserve tenant and deletion rules even while an index lags. For private data, a stale index must not become an authorization bypass. Search indexes support product discovery, autocomplete, log analysis, geospatial queries, and analytics, but each workload needs its own freshness, relevance, retention, and cost targets.

## Failure modes and scale

Shards allow parallel indexing and retrieval but increase fan-out and coordination. Skewed terms, expensive wildcard queries, mapping explosions, huge documents, and deep pagination can overwhelm an otherwise healthy cluster. Use bounded queries and versioned indexing. Rebuild a new index from the source of truth, catch up changes, validate, and switch readers with rollback available.

## Exercise

A product is deleted while its old version remains searchable. Design a tombstone/authorization check and a replay-safe indexing event. Then compare exact URL deduplication with a Bloom-filter precheck under a 1% false-positive rate. Explain the effect on completeness and storage, not just speed.

Related: [event sourcing and projections](../services/event-sourcing.md), [databases](databases.md), [sharding](../distributed/sharding.md), and [caching](caching.md).

## Design trade-offs and production exercise

Search indexes exist because scanning every source record for every query is expensive. An inverted index maps terms to candidate documents; ranking orders those candidates. Indexing is often asynchronous, trading immediate visibility for batching and throughput. Deletion and permission changes need explicit propagation and read-time enforcement.

A school library search can omit a newly added book until refresh. If a private document becomes public or the reverse, which system decides visibility during index lag? Bound query fan-out, rebuild an index beside the live one, compare results, and switch an alias only after validation.

## Architecture flow

```mermaid
flowchart LR
  accTitle: Source changes feed a searchable index with a separate authorization check
  D[Authoritative records] --> E[Change stream]
 E --> I[Derived search index]
 Q[Query] --> I
 I --> A[Authorize candidate documents]
 A --> R[Ranked response]
```

## Further reading

- [Elastic: near real-time search](https://www.elastic.co/docs/manage-data/data-store/near-real-time-search).
