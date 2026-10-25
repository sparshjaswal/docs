---
title: "LLM Engineer studio: adapt, evaluate, and serve a model"
sidebar_label: "LLM Engineer"
sidebar_position: 2
pagination_prev: ai/careers
pagination_next: null
---

# LLM Engineer studio: adapt, evaluate, and serve a model

**Entry:** the shared curriculum and [capstone brief](../careers.md). Essential preparation: [model training](../model-building/03-train-a-small-model.md), [fine-tuning](../model-building/04-fine-tune-and-release.md), [preferences](../generative-ai/05-decoding-and-alignment.md), and [inference systems](../engineering/07-inference-systems.md).

**Client:** a fictional publisher wants a model to convert permissioned book descriptions into a consistent catalogue style. It must preserve names, dates, and numbers and avoid inventing claims.

## Separate behavior from changing knowledge

Style and response structure may benefit from adaptation. Current stock levels belong in a lookup or retrieval system. Compare a prompt-only baseline before changing weights.

Prepare source/desired-response pairs. Split by source book or document before extracting examples. Include short, long, multilingual, incomplete, and contradictory records only when your chosen model and evaluation can support those cases. Keep source rights and transformation rules with the dataset.

Publish a small data card: who supplied the records, what is excluded, intended use, train/validation/test counts, duplicate checks, and known representation gaps.

## Run a controlled adaptation experiment

Use the course's tiny trainable model for the fully offline route. It supports learning mechanics, save/load verification, and held-out comparison; it does not establish production language quality. For an optional pretrained-model run, use the complete recipe linked in [fine-tuning and release](../model-building/04-fine-tune-and-release.md), record exact package and model revisions, and check memory requirements before downloading weights.

Compare three conditions: unchanged model with a prompt, adapted model with the same evaluation prompt, and adapted model with a justified prompt change. Separate the latter change in your report so you can attribute improvements.

Record training tokens, context length, effective batch size, learning rate, update count, precision, adapter settings if used, and random seeds. Save optimizer and scheduler state if your claim includes resuming training, not merely loading inference weights.

## Evaluate useful behavior and regressions

Perplexity measures text prediction on a specified tokenizer and dataset. Also measure field preservation, unsupported additions, style-rubric agreement, schema validity, and refusal on missing inputs. A well-written hallucination should fail the content check.

Keep a small general-task regression set. **Catastrophic forgetting** describes loss of previously useful behavior after adaptation. An adapter is smaller than full-model training, but that does not guarantee no regression.

Have a reviewer score blinded output pairs using a written rubric. Report disagreement. If a model judge helps, calibrate its judgments against human examples and inspect bias toward longer answers.

## Serve the selected artifact

Benchmark one precision setting against a reference. Include time to first token, total latency, memory, and quality on the same task set. Never compare perplexities across different tokenizers as if they were directly interchangeable. Token budgets can differ even for the same input text.

| Release evidence | Required distinction |
| --- | --- |
| Model card | Intended task versus unsupported uses. |
| Data and environment | Exact source version versus a mutable model name. |
| Evaluation | Development selection versus final held-out result. |
| Performance | Measured hardware result versus calculated estimate. |
| Recovery | Loading an artifact versus resuming the full training state. |

## Challenge: a better loss, worse catalogue

The adapted model improves held-out loss but changes ISBN digits more often. Should it ship?

<details>
<summary>Decision reasoning</summary>

No, if exact identifiers are a release requirement. Loss averages many token predictions and can improve while a critical field gets worse. Keep identifiers in a deterministic path or strengthen task-specific training and validation, then evaluate a new frozen candidate.

</details>

**Finish when:** the artifact reloads reproducibly, the report distinguishes probability quality from task quality, one regression is investigated, and the release decision follows declared gates. Apply the [common rubric](../careers.md#review-the-work-not-the-tool-list).

## Depth lab: defend the artifact, objective, and release decision

Select one training example and display the text, token IDs, chat boundaries if present, attention mask, and loss mask. Explain precisely which next-token predictions contribute to the objective. Then reload the selected artifact in a fresh process and compare evaluation outputs within a stated tolerance.

**Failure drill:** pair an adapter with the wrong base revision, change the tokenizer, and truncate a required output. Your manifest or validation should detect incompatibility where possible; downstream evaluation must catch behavior changes that shapes alone cannot detect.

| Defense question | A strong answer establishes |
| --- | --- |
| Why does lower loss fail to guarantee accurate catalogue fields? | Loss averages token predictions; rare exact identifiers need separate preservation checks. |
| What does LoRA save? | Trainable parameter and optimizer state costs, with base weights, activations, and buffers still present. |
| Why save more than weights for resumption? | Optimizer, scheduler, random, and data-order state affect the next update. |
| When would you reject adaptation? | A prompt/template baseline meets the task, or measured gains fail regression, cost, or operational requirements. |

**Optimization requirement:** compare one precision, batch, or context change under fixed workload and quality criteria. Include peak memory, latency distribution, and unacceptable field changes. Label resource estimates separately from hardware measurements.

**Teach-back and sign-off:** derive one rank-one update on paper, explain a token's cross-entropy contribution, and show a counterexample where a more fluent response is less correct. A reviewer should reproduce one training/evaluation command and identify exactly what the optional live-model experiment has and has not verified.

**Return:** [Choose a direction](../careers.md) · [Syllabus](../syllabus.md)
