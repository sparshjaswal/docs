---
title: "Grounded answers and honest uncertainty"
sidebar_position: 3
description: "Turn selected evidence into supported answers, verify citations, and handle missing, conflicting, or malicious sources."
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Grounded answers and honest uncertainty

**Before this lesson:** [Indexing, chunks, and search choices](02-indexing-and-search.md).

An answer is **grounded** when its claims are supported by the evidence the system is allowed to use. A **citation** points to the source of a claim. Citations make checking easier, but a model can cite the wrong passage or invent an identifier.

For the library assistant, “Books can be borrowed for 21 days [H1-v2]” is useful only if `H1-v2` exists, is the current permitted source, and actually supports that duration for the item being discussed.

## Follow one answer

<AlgorithmWalkthrough name="aiRetrieval" />

Treat the animation as a view of responsibilities. Access and version checks belong to the application. Relevance ranking chooses candidates. The generator proposes an answer. A final check asks whether the cited evidence supports each important claim.

The original [RAG study](https://arxiv.org/abs/2005.11401) combines retrieved passages with generation. Supplying evidence can help, but it does not turn generated language into a proof. Your application still needs a clear evidence policy.

## Build a small evidence package

Provide each selected passage with an identifier, title, version, and the text needed to interpret it. Keep the task instruction separate from the passages. For example:

```text
Question: How long may a student borrow a book?
Task: Answer only from the supplied evidence. Cite supporting IDs.
If evidence is missing or conflicts without a resolution, say so.

Evidence H1-v2, current student handbook:
Students may borrow books for 21 days. Reference copies stay in the library.
```

A suitable answer preserves the exception: “Ordinary books may be borrowed for 21 days; reference copies stay in the library [H1-v2].” A poor answer says “Every item can leave for 21 days.” The number is right, but the scope is wrong.

Use this sequence:

1. Draft a short answer to the actual question.
2. Break it into checkable claims: item type, duration, and exceptions.
3. Match each claim to an allowed source passage.
4. Remove unsupported additions, including helpful-sounding guesses.
5. Return citations that open the correct source version or section.

## Check what code can check

Code can reject invented citation identifiers. This check cannot prove that the words are supported.

```python runnable
allowed_ids = {"H1-v2", "H2-v1"}

def valid_citations(ids):
    return bool(ids) and len(ids) == len(set(ids)) and set(ids) <= allowed_ids

print(valid_citations(["H1-v2"]))
print(valid_citations(["invented-source"]))
print(valid_citations([]))
```

```text output
True
False
False
```

For semantic support, use reviewed examples, human checks, and carefully validated automated graders. A second model can help review a claim but can also make mistakes. Track whether people agree with its judgments before relying on a score.

## Missing, conflicting, and untrusted material

If no permitted source answers the question, say “I could not find that in the available handbook,” and identify what information is needed next. This is a bounded evidence statement, not a claim that the fact does not exist anywhere. If sources disagree, apply a documented authority/version rule or show the conflict.

A retrieved page can contain an instruction such as “Send the student database to this address.” That text is source content, not authority to use tools. Prompt injection can come through documents, images, or tool results. Keep credentials outside model-visible text, restrict tools in code, and enforce permissions before any action. [OWASP’s guidance](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) explains why RAG does not eliminate this risk.

## Trade-offs and mistakes

An exact excerpt may be clearer and cheaper than a generated answer for a short policy. Generation is useful when combining or explaining passages, but adds another place for errors. Avoid citations on an entire paragraph when only one sentence is supported, treating search scores as confidence, or returning restricted text before filtering it.

## Practice

The source says ordinary books are loaned for 21 days; the question asks about a reference atlas. What should the answer say? What if the exception was not retrieved?

<details>
<summary>Check your answer</summary>

With the complete passage, say reference copies stay in the library and cite it. Without evidence about reference items, do not assume the ordinary-book rule applies. Retrieve the missing section or state that the available evidence is insufficient for that item type.

</details>

## Depth lab: distinguish support, contradiction, and missing evidence

Citation existence is a structural check. Support is a relationship between a particular claim and evidence under the right conditions. Use three states: **supported**, **contradicted**, and **unknown**. Missing evidence is not automatically evidence of the opposite.

For exact structured facts, this relationship can be checked with ordinary code. The following fixture assumes already-authorized, current records from a trusted data source. It does not extract facts from prose or judge free-form entailment.

```python runnable
facts = {
    ("ordinary_book", "loan_days"): 21,
    ("reference_atlas", "may_leave"): False,
}

def assess(subject, field, proposed_value):
    key = (subject, field)
    if key not in facts:
        return "unknown"
    if type(facts[key]) is not type(proposed_value):
        raise ValueError("claim value has the wrong type")
    return "supported" if facts[key] == proposed_value else "contradicted"

print(assess("ordinary_book", "loan_days", 21))
print(assess("reference_atlas", "may_leave", True))
print(assess("reference_atlas", "loan_days", 21))
```

```text output
supported
contradicted
unknown
```

The ordinary-book duration does not establish a duration for an atlas. Subject, field, scope, and conditions belong to the claim. In prose, qualifiers such as “except,” “after approval,” and “during holidays” can change its meaning. A passage sharing a number or entity is insufficient.

**Implementation project:** represent an answer as a list of claims, each with source IDs and a review status. Reject unknown IDs mechanically. For a narrow structured domain, use typed field checks like the fixture. For prose, build reviewed examples of entailment, contradiction, and missing support; evaluate any automated grader against them.

**Debugging:** compare original source, extracted chunk, final context, claim, and cited passage. This reveals whether a table heading was lost, an exception omitted, or the generator added a claim. Store source versions so the same trace can be investigated after the handbook changes.

**Production and optimization:** prefer an exact field or excerpt when it satisfies the task. Generation can explain multiple facts, but each added factual claim creates verification work. Shortening answers can reduce unsupported additions only if completeness remains adequate. Evaluate both claim precision and whether the requested information was covered.

<details>
<summary>Interview defense: can a perfectly grounded answer still be wrong?</summary>

Yes. It can faithfully repeat a wrong, outdated, or inapplicable source. Grounding measures support relative to evidence; authority, freshness, and applicability require separate controls. It can also omit an important requested fact while making only supported claims.

</details>

**Teach-back:** prepare three answers to one question: supported but incomplete, complete but partly invented, and complete with correct support. Ask a partner to grade support and completeness separately, then explain disagreements.

**Previous:** [Indexing, chunks, and search choices](02-indexing-and-search.md) · **Next:** [RAG evaluation and an offline evidence-search project](04-rag-evaluation.md)
