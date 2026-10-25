---
title: "Prepare data, tokenizers, and prediction targets"
sidebar_position: 2
description: "Build a training-only vocabulary, preserve evaluation boundaries, and prepare correct next-token labels before training."
---

# Prepare data, tokenizers, and prediction targets

**Before this lesson:** [choose a model strategy](./01-choose-a-model-strategy.md). A **dataset** is the collection of examples you use. A **tokenizer** turns text into token IDs: integers that identify pieces of text. A model learns from those IDs, so mistakes here become mistakes in every later experiment.

Start with a small collection you can inspect. The coming project contains fictional school sentences written inside its script. Their purpose is to expose the training process. They are too few and too similar to represent real language use. For a real project, record each document's source, permission to use it, collection date, language, and grouping information.

## Split sources before making chunks

Use three separate groups. Training examples drive gradient updates. Validation examples help select settings and checkpoints. Test examples remain untouched until the experiment's choices are fixed. If you repeatedly change the model after reading test results, those examples have become development data; obtain a fresh final test set.

Remove exact duplicates and investigate near duplicates before splitting. Put related examples in the same split when they would otherwise leak information. Pages from one notice, messages from one conversation, or versions of the same document should not quietly appear on both sides. For forecasting or changing policies, a time-based split may better represent future use than random mixing.

Only after assigning documents to splits should you divide them into shorter token sequences. Randomly splitting chunks from the same source can create an easy-looking test whose answers were already present in training. Keep a manifest mapping every chunk back to its source and split. A manifest is a small inventory, not another model.

## Train the tokenizer on training text only

Our teaching tokenizer learns the set of characters found in training text. It sorts them so the mapping is repeatable. It also reserves four special IDs: **PAD** fills unused batch positions; **BOS** marks the beginning of a document; **EOS** marks its end; **UNK** represents a character outside the fitted vocabulary.

```python runnable
training = ["cat", "café"]
special = ["<PAD>", "<BOS>", "<EOS>", "<UNK>"]
tokens = special + sorted(set("".join(training)))
lookup = {token: index for index, token in enumerate(tokens)}

def encode(text):
    return [lookup["<BOS>"]] + [lookup.get(char, lookup["<UNK>"])
                                  for char in text] + [lookup["<EOS>"]]

print(tokens)
print("Known:", encode("café"))
print("Unseen:", encode("cat!"))
```

```text output
['<PAD>', '<BOS>', '<EOS>', '<UNK>', 'a', 'c', 'f', 't', 'é']
Known: [1, 5, 4, 6, 8, 2]
Unseen: [1, 5, 4, 7, 3, 2]
```

The exclamation mark stays unknown. Adding it after inspecting the test set would change the fitted tokenizer using held-out information. Measure unknown-token frequency by language and source; do not silently remove difficult examples to improve the score.

Python's string iteration uses Unicode code points. A visible character can contain several code points, as with a letter plus a combining accent or some emoji. **Normalization** applies a chosen rule to equivalent text representations. Test that rule on your actual languages and identifiers, and apply the same rule at training and inference. Removing accents or lowercasing everything can destroy information. The [Unicode normalization specification](https://www.unicode.org/reports/tr15/) explains the distinctions.

## Move from characters to subwords deliberately

A character vocabulary is small but creates long sequences. A word vocabulary creates unknown words easily. **Subword tokenization** divides words into reusable pieces. Byte Pair Encoding, or **BPE**, learns frequent merges between pieces. Larger vocabularies can shorten some sequences while increasing vocabulary-related parameters; compare coverage and sequence lengths rather than assuming bigger is better.

This optional example trains BPE using Hugging Face Tokenizers. It needs the `tokenizers` package and is separate from the checked standard-library project. It illustrates fitting a new tokenizer for a new model; do not replace an existing pretrained model's tokenizer with this one.

```python
from tokenizers import Tokenizer
from tokenizers.models import BPE
from tokenizers.pre_tokenizers import Whitespace
from tokenizers.trainers import BpeTrainer

training_documents = ["the class reads a book", "the library lends books"]
tokenizer = Tokenizer(BPE(unk_token="[UNK]"))
tokenizer.pre_tokenizer = Whitespace()
trainer = BpeTrainer(vocab_size=100, min_frequency=1,
                     special_tokens=["[PAD]", "[BOS]", "[EOS]", "[UNK]"])
tokenizer.train_from_iterator(training_documents, trainer=trainer)
tokenizer.save("school-tokenizer.json")
print(tokenizer.encode("the library").tokens)
```

This small character-based BPE setup does not guarantee coverage of unseen scripts. Byte-level tokenization or byte fallback can provide a broader encoding path, depending on the implementation. They still need evaluation for sequence length and language quality. Reserving BOS and EOS above does not automatically insert them: configure a postprocessor or add them explicitly when preparing examples. See the official [Tokenizers training guide](https://huggingface.co/docs/tokenizers/quicktour).

## Align inputs with the next token

For the sequence `BOS, c, a, t, EOS`, the input is `BOS, c, a, t` and the target is `c, a, t, EOS`. A **target**, also called a label, is the correct answer for a training position. Predicting the current token from itself is an easier, incorrect task.

Our standard-library model creates these pairs separately inside each document. It never creates a pair from one document's EOS to another document's first character. It samples pairs directly, so it needs no padded training batches.

The optional Transformer batches whole sequences. Its input has shape **batch × positions**, and its output scores have shape **batch × positions × vocabulary**. Padding makes rows equally long. An attention mask prevents padded positions from supplying context; a loss mask prevents them from becoming training targets. These are separate jobs. In PyTorch cross entropy, `-100` is the default ignored target value. [CrossEntropyLoss reference](https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html).

Some pretrained causal-model APIs shift labels internally. Our later LoRA recipe therefore copies the unshifted input IDs into labels and masks padding; shifting them again would skip a token. If EOS also supplies the padding ID, mask by the attention mask, not by token value, so real document endings still train the model.

## Pack sequences without hiding the boundary

**Chunking** divides a long document into bounded pieces. **Packing** places short sequences together to reduce wasted padding. State whether the last incomplete chunk is retained or dropped, whether overlaps are repeated in the loss, and whether a packed document may attend to earlier documents.

An EOS token is a learned boundary marker, not an access-control rule or an automatic attention barrier. Independent-document training needs suitable boundary-aware attention, separate examples, or an explicitly accepted cross-document objective. Start with separate examples while learning; optimize packing after the labels and evaluation are correct.

## Practice

A teammate tokenizes the entire collection, randomly splits overlapping chunks, and replaces all EOS labels with `-100` because EOS is also PAD. Identify three problems.

<details>
<summary>Check the pipeline</summary>

The tokenizer saw held-out data, overlapping chunks may leak source content between splits, and masking every EOS removes genuine stopping targets. Split and deduplicate source groups first, fit only on training text, and mask artificial padding by its position. Keep real EOS labels. Rebuild the experiment from those corrected boundaries.

</details>

## Depth lab: learn two byte-pair-style merges from scratch

**Byte-pair encoding**, or BPE, repeatedly merges frequent adjacent symbols. Production tokenizers add byte handling, normalization, special tokens, and boundary rules. This word-level exercise isolates merging; it cannot replace a pretrained model's tokenizer.

```python runnable
from collections import Counter

words = [list(word) for word in ["low", "low", "lower"]]

def merge(tokens, pair):
    result, i = [], 0
    while i < len(tokens):
        if i + 1 < len(tokens) and tuple(tokens[i:i + 2]) == pair:
            result.append(tokens[i] + tokens[i + 1])
            i += 2
        else:
            result.append(tokens[i])
            i += 1
    return result

merges = []
for _ in range(2):
    counts = Counter(pair for word in words for pair in zip(word, word[1:]))
    pair = min(counts, key=lambda p: (-counts[p], p))
    merges.append(pair)
    words = [merge(word, pair) for word in words]
print(merges)
print(["|".join(word) for word in words])
unseen = list("lowest")
for pair in merges:
    unseen = merge(unseen, pair)
print(unseen)
```

```text output
[('l', 'o'), ('lo', 'w')]
['low', 'low', 'low|e|r']
['low', 'e', 's', 't']
```

Training chooses merges with deterministic tie-breaking; inference applies learned rules. Do not relearn them per request. This example leaves unknown characters as characters, but a fixed vocabulary must define their IDs. Byte-based fallback can cover arbitrary encoded text; an unknown token can lose distinctions.

**Debugging drill:** compare composed and decomposed accents, repeated spaces, emoji, empty strings, and text resembling special tokens. Specify whether decoding preserves bytes or normalized text. This word-list exercise omits spaces and therefore does not demonstrate full-text round trips.

**Production design:** freeze tokenizer, checkpoint, and chat template together. Changing IDs without training compatible embeddings and output weights makes an old model interpret the wrong symbols. Validate lengths before batching.

**Optimization:** measure mean and high-percentile sequence lengths and unknown rates by language and source. Larger vocabularies can shorten sequences while enlarging embedding and output matrices. Compare total memory and quality, not only token counts.

<details>
<summary>Interview defense: why split documents before learning merges?</summary>

Merges are fitted preprocessing. Learning them from final evaluation text exposes that corpus during development and can bias evaluation. Fit on training sources and freeze the tokenizer. For an existing pretrained tokenizer, record provenance and evaluate coverage rather than pretending it was fitted on your split.

</details>

**Mini-project:** add decoding and word-boundary markers. Preserve a training manifest and test an unseen character without deleting it. Teach why reversible encoding and good prediction quality are separate properties.

**Previous:** [Choose what to build, train, and run](01-choose-a-model-strategy.md) · **Next:** [Train, save, and reload a small neural language model](03-train-a-small-model.md)
