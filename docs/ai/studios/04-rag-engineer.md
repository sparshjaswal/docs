---
title: "RAG Engineer studio: a changing, permissioned handbook"
sidebar_label: "RAG Engineer"
sidebar_position: 4
pagination_prev: ai/careers
pagination_next: null
---

# RAG Engineer studio: a changing, permissioned handbook

**Entry:** the shared curriculum and [capstone brief](../careers.md). Revisit [hybrid retrieval](../rag/05-hybrid-search-lab.md), [answer grounding](../rag/03-grounded-answers.md), and [security boundaries](../engineering/03-security-and-governance.md).

**Client:** students and staff ask questions about a fictional handbook. Some documents are public; others are staff-only. Policies change over time. Answers need current, authorized evidence or an explicit explanation of what is missing.

## Create the benchmark before the assistant

Write 20 short documents with stable IDs, version dates, owners, access scopes, and supersession links. Include one contradictory pair, one deleted policy, one table, one exact identifier, and one irrelevant document containing instructions aimed at the assistant.

Create at least 40 questions with expected evidence IDs and answerability labels. Divide them into development and final sets by policy family where practical, so near-duplicate questions do not straddle the split. Include a user identity in each permission-sensitive case.

These counts are learning-project sizes, not evidence that the final system is ready for unrestricted deployment.

## Build the system in observable layers

Start with exact keyword search and source excerpts. Add chunking only when document size makes it necessary. Preserve titles, section boundaries, table context, and stable source offsets where available.

Compare retrieval variants using the [offline evidence project](../rag/04-rag-evaluation.md) and [fusion lab](../rag/05-hybrid-search-lab.md). Replace fixed rankings with real embeddings only in a separately measured extension.

For every answer, save the authorized candidate IDs, ranked evidence, actual context selected, generated claims, and validation result. Redact protected content from general logs. A trace must help diagnose a failure without becoming a second unauthorized document store.

## Handle updates as part of the product

Change one policy after building the index. Verify that retrieval selects the new effective version and old cached answers are invalidated. Delete another document and test both index removal and answer-cache behavior.

Choose between synchronous updates and a delayed indexing pipeline. Delayed indexing can be cheaper and more resilient, but it needs a declared freshness target and an observable lag. Show the evidence version or date when it matters to the user.

## Separate failure measurements

| Layer | Question |
| --- | --- |
| Access | Did protected material stay outside unauthorized contexts and caches? |
| Retrieval | Were relevant passages in the candidate set? |
| Selection | Did the final context retain the needed evidence? |
| Answer | Does every substantive claim have supporting evidence? |
| Abstention | Does the system stop when evidence is absent or contradictory? |
| Operations | Are freshness, latency, and costs within the declared target? |

Manually inspect a sample of citation support. A valid document ID is not proof that the cited text supports the sentence. Report unanswerable cases separately so a system cannot earn high answer accuracy by refusing everything.

## Challenge: remove a staff role mid-session

A staff user asks a question, loses the staff role, then repeats it. The answer cache already contains a staff-only result.

<details>
<summary>Expected reasoning</summary>

Recheck current authorization before using cached evidence or an answer. Include permission scope in cache design and define invalidation for revocation. A previously authorized result does not grant permanent access. Test the behavior after a process restart as well.

</details>

**Deliver:** corpus and query manifests, an access test matrix, retrieval and answer metrics, version-update trace, cache invalidation test, and two architecture alternatives. Explain why retrieval is preferable to fine-tuning for this changing source collection.

**Finish when:** a reviewer can change a policy, remove a permission, and observe the documented behavior. Apply the [common rubric](../careers.md#review-the-work-not-the-tool-list).

## Depth lab: defend an answer through every evidence boundary

Pick a question that requires a rule and its exception. Trace source extraction, chunk IDs, authorization, candidate ranking, selected context, final claims, and citations. At each stage, explain what information could be lost or incorrectly admitted.

**Failure drill:** remove the exception from the final context while leaving it in the retrieved candidates. Your retrieval-recall score may remain unchanged; the answer-support check should expose the incomplete evidence. Restore the exception, then revoke access to the source and repeat through a warm cache.

| Defense question | A strong answer establishes |
| --- | --- |
| Why not fine-tune the handbook facts? | Current versioned evidence, citations, updates, and permissions are explicit retrieval requirements. |
| Can high ANN recall prove useful retrieval? | It compares approximate neighbors with exact vector neighbors; task relevance needs separate labels. |
| What can a reranker repair? | Ordering within supplied candidates, not a passage missing from that candidate set. |
| What does a valid citation prove? | Identifier existence and allowed membership only; semantic support and source applicability remain separate checks. |

**Optimization requirement:** compare lexical, dense if implemented, fused, and reranked variants under the same corpus and final evidence budget. Report insufficient-evidence cases and latency as well as average relevance. Retain the simplest system satisfying the declared constraints.

**Teach-back and sign-off:** have a reviewer update, delete, and restrict a source without changing your application code. Explain the observed freshness and revocation behavior, including propagation delay and cache invalidation. The handoff should let them reproduce one supported answer, one contradiction, and one justified abstention.

**Return:** [Choose a direction](../careers.md) · [Syllabus](../syllabus.md)
