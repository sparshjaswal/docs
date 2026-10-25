---
title: "8. LLM tokenization, pretraining, fine-tuning, RLHF, and DPO"
sidebar_position: 8
---

# LLM tokenization, pretraining, fine-tuning, RLHF, and DPO

**Prerequisites:** [NLP](07-nlp.md), Transformer blocks, cross-entropy, gradients, and held-out evaluation. Follow [choose a model strategy](../model-building/01-choose-a-model-strategy.md) through [fine-tune and release](../model-building/04-fine-tune-and-release.md) alongside this guide.

## What it is and why it matters

A large language model estimates distributions over token sequences. Its capabilities depend on architecture, data, training, and adaptation. Using an endpoint, fine-tuning existing weights, and pretraining from scratch are different jobs with very different data and compute requirements.

## Learn in this order

### Tokenization and the data contract

Study character, byte, subword, byte-pair, and unigram tokenization; vocabulary size; special tokens; padding; truncation; and chat templates. The tokenizer converts text to IDs, and embeddings map IDs to vectors. An ID's numerical magnitude has no linguistic meaning.

Preserve document boundaries, split before evaluation contamination can occur, and keep training and inference formatting consistent. Mask labels for padding and any positions excluded by the training objective. Deduplicate at appropriate document and source levels. Record data rights, languages, domains, and exclusions.

**Practice:** tokenize names, code, numbers, emoji, and several languages. Compare token counts and reconstruct the original text where the tokenizer supports it. Run the [tokenizer lab](../model-building/02-data-and-tokenizers.md).

### Architecture and pretraining

Revisit causal attention, feed-forward layers, normalization, residuals, and positional information. Learn how positional encodings, grouped-query attention, and mixture-of-experts designs change a particular implementation; do not assume all decoder models share one architecture.

Pretraining repeatedly predicts target tokens and updates weights to reduce loss. Track tokens processed, loss on held-out sources, optimizer state, and checkpoint recovery. A mixture-of-experts model routes representations through selected expert networks; total parameters and active computation are different quantities.

**Practice:** train the [tiny model](../model-building/03-train-a-small-model.md), save it, reload it, and verify identical evaluation results. A tiny experiment teaches mechanics; it is not a miniature proof of frontier-model capability.

### Fine-tuning and parameter-efficient adaptation

Supervised fine-tuning (SFT) learns from desired input/output examples. Full fine-tuning updates all chosen parameters; parameter-efficient methods update a smaller set. LoRA represents an update using low-rank factors, reducing trainable parameters while retaining the base weights.

Separate teaching a behavior from supplying fresh facts. Fine-tuning can shape format or domain behavior, but frequently changing knowledge is often better served through retrieval or a database. Check forgetting, harmful regressions, data leakage, and the base-model license. Keep adapter and base-model revisions together.

**Practice:** compare a prompt-only baseline with a small adapter on the same held-out task. Measure quality, training cost, inference behavior, and failures on unrelated inputs.

### RLHF: a short reinforcement-learning bridge

In reinforcement learning, a **policy** chooses actions and a **reward** scores outcomes. For language generation, a policy can be the model's distribution over responses. Optimizing reward changes which responses become more likely; a high learned reward is not identical to correctness.

One common RLHF pipeline starts with supervised training, collects human preferences between responses, trains a reward model, and optimizes the language policy against that reward while limiting deviation from a reference. Preference consistency, annotator expertise, and reward exploitation matter. RLHF is a family of methods, not a universal recipe.

**Practice:** write a comparison rubric and label 20 response pairs twice, separated in time. Inspect inconsistent preferences before discussing a reward model. Study the [alignment lesson](../generative-ai/05-decoding-and-alignment.md).

### DPO: learn directly from preferences

Direct preference optimization uses chosen/rejected pairs and a reference model to adjust relative response probabilities without the separate reward-model-and-RL loop of the common RLHF pipeline above. Its objective encourages a higher relative likelihood for preferred responses while controlling the relationship to the reference.

DPO still needs meaningful preference data. If “longer” is consistently preferred regardless of correctness, the model may learn verbosity rather than usefulness. Neither DPO nor RLHF guarantees safety, truthfulness, or broad alignment.

**Practice:** inspect a preference dataset for length bias, duplicated prompts across splits, ties, and unsupported “chosen” answers. Run a small optional DPO experiment only after the SFT baseline and evaluation set exist.

## Mastery lab: calculate what a preference update rewards

For a preferred response `chosen` and a rejected response `rejected`, a DPO training pair compares their log-probability difference under the policy with the same difference under a reference. Write the margin as `beta * ((policy_chosen-policy_rejected) - (reference_chosen-reference_rejected))`. Its pair loss is `-log(sigmoid(margin))`.

```python runnable
import math
def pair_loss(pc, pr, rc, rr, beta=1.0):
    margin = beta * ((pc-pr)-(rc-rr))
    # Stable softplus(-margin).
    return max(0.0, -margin) + math.log1p(math.exp(-abs(margin)))
print(round(pair_loss(-2, -3, -2, -3), 3))
print(round(pair_loss(-1, -3, -2, -3), 3))
```

```text output
0.693
0.313
```

When policy and reference have the same relative preference, the margin is zero. Increasing the policy's relative preference lowers the pair loss. The numbers are sequence log probabilities, not raw logits or per-token averages unless a deliberately different objective is specified. A lower loss establishes fit to the preference data; it does not independently establish correctness. Study the [original DPO objective](https://arxiv.org/abs/2305.18290) after tracing this pair.

### Implement the pieces and verify the boundaries

Implement a tiny tokenizer, embedding lookup, causal next-token loss, and training loop before adaptation. In a batched loss, check shifted labels and padding masks explicitly. In instruction tuning, record which prompt and response positions contribute to loss. Save tokenizer, special-token IDs, template, model configuration, weights, and training state as compatible artifacts.

For LoRA, take a base matrix with 8 output and 6 input dimensions. A rank-2 update uses matrices shaped 8-by-2 and 2-by-6: 28 trainable values instead of 48 for the full matrix. The product still has shape 8-by-6. Implement that product and compare merged and unmerged forward results. This is a parameter-count example, not a claim that all training or serving memory shrinks by the same ratio.

### Debug, optimize, and operate

A falling loss with nonsense generation can come from label alignment, token-ID mismatch, template mismatch, decoding settings, or a narrow training distribution. Start by overfitting one short sequence, save/reload, and compare logits. Then expand the data while preserving a source-separated evaluation set.

Profile tokens per second, memory, padding waste, and checkpoint cost. Compare sequence packing, parameter-efficient updates, and lower precision under a fixed task budget. Quantization may change quality; merging adapters changes artifact management. A production release needs a compatible rollback artifact and regression results outside the fine-tuning domain.

**Interview defense:** “Why can DPO make responses longer without making them more correct?” Explain preference-data bias, relative sequence likelihood, and an evaluation that separates length from task success. For RLHF, identify reward-model error and reward exploitation as additional failure boundaries.

**Teach it:** calculate the two pair losses above, then reverse a preference label. Ask the learner to explain what the optimizer will reward. Deliver the numeric derivation, a tested small training artifact, a formatting failure fixture, and an adaptation decision report.

## Mini project and real-world use

Create a reproducible adaptation report for a small extraction or style task. Compare baseline, SFT/LoRA, and—if resources permit—a preference-trained candidate. The minimum project can stop after a rigorous SFT comparison; the preference experiment is an extension with its own budget.

Uses include domain extraction, consistent formatting, code assistants, and specialized language behavior. Forecasting training cost without measuring throughput is a planning estimate, not a benchmark.

**Completion evidence:** data provenance, tokenizer/template version, saved artifact, training configuration, evaluation split, baseline comparison, and a model card explaining limitations.

## Interview questions

1. Why must tokenizer, chat template, and model weights be compatible?
2. What changes in pretraining, SFT, and inference?
3. How can LoRA reduce trainable parameters without reducing every inference cost?
4. What does a reward model measure, and how can it be exploited?
5. What loop does DPO avoid, and what data problems remain?
6. When should you choose retrieval instead of fine-tuning?

## Curated resources

- **Course:** [Stanford CS336: Language Modeling from Scratch](https://cs336.stanford.edu/), after the math and deep-learning gates.
- **Book:** [Build a Large Language Model (From Scratch)](https://www.manning.com/books/build-a-large-language-model-from-scratch), Sebastian Raschka.
- **Papers:** [LoRA](https://arxiv.org/abs/2106.09685), [InstructGPT / RLHF](https://arxiv.org/abs/2203.02155), and [DPO](https://arxiv.org/abs/2305.18290). Read each with the assumptions and experiment design in view.
- **GitHub:** [LLMs from scratch](https://github.com/rasbt/LLMs-from-scratch), [PEFT](https://github.com/huggingface/peft), and [TRL](https://github.com/huggingface/trl).

**Previous:** [NLP](07-nlp.md) · **Next:** [Prompt engineering](09-prompt-engineering.md).
