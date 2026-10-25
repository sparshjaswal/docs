---
title: "7. NLP, text representations, BERT, GPT, and LLaMA"
sidebar_position: 7
---

# NLP, text representations, BERT, GPT, and LLaMA

**Prerequisites:** [ML](05-machine-learning.md), [deep learning](06-deep-learning.md), and probability. You should understand embeddings, attention masks, and classification before comparing language-model families.

## What it is and why it matters

Natural language processing (NLP) turns language into representations and task outputs. Tasks include classification, named-entity recognition, parsing, search, translation, extraction, summarization, and generation. Start from the task and its evaluation; not every language task needs a generative assistant.

## Learn in this order

### Text processing and classical baselines

Learn Unicode, normalization, sentence segmentation, tokenization, regular expressions, casing, and language identification. A token is a representation unit, not necessarily a word. Stemming and lemmatization can reduce variation, but aggressive normalization can erase meaning, names, or important punctuation.

Bag-of-words counts terms. TF–IDF weights terms using document-level frequency information, making common terms less distinguishing. These representations ignore much word order, but linear classifiers on them can be strong, cheap baselines.

**Practice:** build a ticket classifier using TF–IDF. Compare messages such as “can renew” and “cannot renew”; inspect which processing choices preserve negation. Split near-duplicate messages and customer threads together.

### Embeddings and similarity

An embedding is a learned vector representation. Static word embeddings give one vector per word; contextual embeddings can represent the same word differently depending on its sentence. Sentence embeddings summarize a larger text for comparison.

Similarity depends on both representation and scoring rule. Cosine similarity compares direction; a dot product also depends on magnitude unless vectors are normalized. Similar wording does not establish factual agreement: “approved” and “not approved” may remain close in an embedding space.

**Practice:** compare lexical and embedding search on exact IDs, synonyms, negation, and domain terms. Manually label relevant pairs before choosing a model.

### BERT: use both sides of the input

BERT is an encoder-based pretrained model. **Pretraining** means learning general patterns on a broad dataset before adapting to a specific task. BERT's masked-language objective predicts selected hidden tokens using surrounding input; its original training also included a sentence-pair objective.

An encoder can support classification, token labeling, or extractive question answering. It is not simply a chat model with a different name. Pooling an encoder's outputs into a sentence vector needs a suitable method or training objective; a generic pooled BERT vector is not automatically a good retrieval embedding.

**Practice:** fine-tune a compact BERT-style encoder for ticket categories or entity spans. Compare with TF–IDF under the same split, including inference time.

### GPT and LLaMA: predict continuations

GPT refers to a family of generative pretrained Transformer models. Causal next-token learning predicts from earlier context. The historical GPT-3 paper is useful for studying in-context examples; it is not documentation for every current GPT product. Use current provider documentation for an actual API.

The original LLaMA work describes decoder language models and their training choices. Later Llama releases vary; read the exact model card, tokenizer, context limits, and license. Access to weights does not automatically grant unrestricted use or reveal the original training data. A **base model** and an instruction-tuned version can behave very differently.

**Practice:** use a permitted small local decoder model for extraction or summarization. Record its exact revision and decoding settings, and compare with an encoder or deterministic extractor. If you only use mocked outputs, label the result an application test.

### Evaluate language behavior

Use task-specific measures: label/span metrics for extraction, retrieval metrics for search, and reviewed factual support for summaries. Automatic overlap metrics capture only part of translation or summary quality. Evaluate multilingual inputs, dialect variation, domain terms, ambiguous references, and out-of-domain messages.

**Practice:** create a 30-case challenge set with five error categories. Include examples where the correct behavior is to say the source lacks the requested information.

## Mastery lab: separate token identity from meaning

A bag-of-words model counts which terms appear. It discards order unless you deliberately add features such as n-grams. This is a representation choice, not a software bug.

```python runnable
from collections import Counter
def bag(text):
    return Counter(text.lower().split())
a = bag("dog bites person")
b = bag("person bites dog")
print(a == b)
def bigrams(text):
    words = text.lower().split()
    return list(zip(words, words[1:]))
print(bigrams("dog bites person"))
print(bigrams("person bites dog"))
```

```text output
True
[('dog', 'bites'), ('bites', 'person')]
[('person', 'bites'), ('bites', 'dog')]
```

A unigram representation cannot distinguish these sentences. Bigrams preserve some local order but become sparse. Contextual representations can encode order and context, but they still need task-specific evaluation. An embedding is a learned coordinate system; its dimensions are not human-readable labels.

### Implement a sequence of stronger baselines

Build token counts, document frequency, TF–IDF, cosine similarity, and a nearest-neighbor classifier on a tiny corpus. State the zero-vector policy before dividing by a norm. Fit vocabulary and document statistics on training data. Then compare an encoder representation and a decoder prompt on the same task and held-out cases.

BERT-style masked-language modeling and GPT-style causal prediction provide different training signals. An encoder can use context on both sides in its permitted task; a causal decoder cannot use future tokens during prediction. “LLaMA” names a model family, not a separate mathematical operation replacing attention. Inspect the exact model configuration and license rather than assuming the family name determines every implementation detail.

### Production failure analysis

A normalizer that removes “not,” accents, punctuation, or code symbols can destroy the task's signal. Keep raw text and transformations traceable, with appropriate privacy controls. Evaluate language, length, formatting, domain, and ambiguous cases separately. Unicode code points, user-perceived characters, bytes, and model tokens are different units.

When search quality falls after replacing an embedding model, first check whether stored and query vectors came from compatible versions. Matching dimensions alone does not make two embedding spaces compatible. Rebuild the index or maintain explicitly separate versions during migration.

Optimize by measuring tokenization, encoding, index search, and downstream prediction separately. Batch encoding where it improves throughput within latency limits. Cache only with a key that includes relevant normalization and model revisions. Measure the effect of truncation; reduced latency can hide missing information at the end of long documents.

**Interview defense:** “Cosine similarity is high, so the two statements must agree.” Give an example involving negation or opposite relations. Explain that topical similarity and logical agreement are different tasks.

**Teach it:** let a learner predict whether bag-of-words distinguishes the two sentences above, then ask them to create another collision. Deliver a baseline comparison, a normalization failure fixture, an embedding migration plan, and a five-minute explanation of encoder versus decoder objectives.

## Mini project and real-world use

Build a multilingual support explorer: classification, entity extraction, and search over the same permitted ticket corpus. Compare a classical baseline, a compact encoder, and one decoder-based approach. Your UI should show source text beside predictions so reviewers can correct specific errors.

Real uses include document routing, contract-field extraction, support search, translation, and accessibility. Do not infer sensitive personal traits from language merely because a model can output a label.

**Completion evidence:** task definitions, shared split, model cards, per-language counts, latency comparison, and examples where the simpler baseline wins.

## Interview questions

1. When can text cleaning remove useful information?
2. Why can a TF–IDF baseline beat a larger model?
3. How do static and contextual embeddings differ?
4. Why does BERT's input visibility differ from a causal decoder's?
5. Why is “open weights” different from “open training data”?
6. How would you evaluate factual faithfulness in a summary?

## Curated resources

- **Course:** [Hugging Face LLM course](https://huggingface.co/learn/llm-course/chapter1/1), particularly tokenizers, datasets, and model adaptation.
- **Book:** [Speech and Language Processing](https://web.stanford.edu/~jurafsky/slp3/), Jurafsky and Martin; read text processing and representations before advanced model chapters.
- **Papers:** [BERT](https://arxiv.org/abs/1810.04805), [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165), and [LLaMA](https://arxiv.org/abs/2302.13971), for the named families' original research.
- **GitHub:** [Transformers](https://github.com/huggingface/transformers) and [Sentence Transformers](https://github.com/UKPLab/sentence-transformers), for different language-task and embedding workflows.

**Previous:** [Deep learning](06-deep-learning.md) · **Next:** [LLM training and adaptation](08-llms.md).
