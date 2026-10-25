---
title: "Adaptation: prompts, retrieval, and fine-tuning"
sidebar_position: 3
description: "Choose how to adapt a model, build a clean training set, and evaluate changes without leaking the test answers."
---

# Adaptation: prompts, retrieval, and fine-tuning

**Before this lesson:** [Prompts and structured output](02-prompts-and-structured-output.md).

**Adaptation** means making an existing model more useful for a particular job. **Fine-tuning** continues training on selected examples, changing some or all of the model’s learned weights. It is one option, not the first answer to every problem.

Our library assistant has two problems: it writes summaries in an inconsistent format, and its answer about loan periods is old. These may need different fixes. A behavior problem can call for better instructions or training examples. Frequently changing facts usually need an updated source of evidence.

## Choose what must change

| Need | Starting approach | What changes |
| --- | --- | --- |
| Clearer instructions or a new format | Prompt and worked examples | Input supplied to each call |
| Current school rules with source links | Retrieval-augmented generation, or RAG | Evidence fetched for each question |
| Repeated task behavior that prompting does not meet | Fine-tuning | Learned model parameters |
| Exact calculations or permission checks | Ordinary code | Explicit application rules |

These approaches can be combined. A fine-tuned model can still retrieve current policies, and a retrieved passage still needs a clear task instruction. RAG is taught in the [next stage](../rag/01-retrieval-basics.md); it supplies selected documents rather than changing weights for each new fact.

## How a fine-tuning experiment works

1. Record a baseline using the current model and prompt.
2. Collect input/output pairs that represent the intended task. Remove secrets and confirm you may use the data.
3. Separate training, development, and final test examples. Keep related messages or repeated templates in one split when they would leak answers across splits.
4. Train on the training examples. Use development results to choose settings.
5. Compare once against the reserved test set, including cases outside the common pattern.
6. Keep the previous version available if the new one worsens important behavior.

**Supervised fine-tuning** learns from examples of desired outputs. **Preference training** learns from judgments such as which of two responses is better. The judgments still need clear criteria; preference is not automatically factual correctness. Do not confuse a model’s generated answers with trustworthy labels.

## Full training versus small updates

Full fine-tuning updates the base model’s weights. **Parameter-efficient fine-tuning** updates a smaller added or selected set. **LoRA**, short for low-rank adaptation, freezes base weights and learns smaller matrices that represent an update. “Low rank” means using a constrained representation of that update, not deleting the need for data or evaluation. The [LoRA paper](https://arxiv.org/abs/2106.09685) introduces this method, and the [PEFT guide](https://huggingface.co/docs/peft/main/en/conceptual_guides/lora) describes an implementation.

Smaller updates can reduce training resource needs, but they do not guarantee a better result. You still load a base model, track compatible versions, choose training settings, and test for regressions. **Quantization** uses lower-precision number representations; it is a separate technique with its own accuracy and resource trade-offs.

## A worked decision

Suppose 50 held-out messages contain 30 loan questions, 10 opening-hour questions, and 10 unrelated messages. A new prompt gets 44 categories right. A fine-tuned candidate gets 46 right, but labels four unrelated messages as loan requests.

The overall count hides the failure: routing unrelated messages to a loan action may be worse than asking staff to review them. Compare results by category, measure unsupported claims, and record time and resource cost. Choose the model using the actual purpose, not only the largest score.

For the changed loan period, update the approved handbook and retrieve it. Training on a new number may not reliably remove the old one, provide a citation, or enforce who may see the source.

## Mistakes to avoid

Do not fine-tune because one prompt failed once. Check whether the task and labels are clear. Avoid training on the final test set, using many near-duplicate examples as if they were independent, or judging only training loss. Watch for **overfitting**, where the model memorizes examples instead of generalizing, and **forgetting**, where the change harms previous abilities.

## Practice

The school changes opening hours every month, but wants every summary to follow the same short style. Choose an approach for each need and name the evidence that would justify fine-tuning.

<details>
<summary>Check your answer</summary>

Retrieve the current opening-hours document. Begin with a clear prompt and examples for style. Consider fine-tuning only after a clean evaluation set shows persistent behavior failures, sufficient representative training data is available, and the improvement exceeds its resource and maintenance costs.

</details>

## Depth lab: choose an adaptation using failure slices

Classify failures by cause before choosing an adaptation method. Obsolete timetables need current evidence. Persistent style failures may need clearer examples or training. Unauthorized updates need application fixes. Fine-tuning does not repair all three.

Use development data to compare the same requests across systems. These invented numbers illustrate a decision; they are not benchmark results:

| Candidate | Supported answers out of 80 answerable requests | Correct abstentions out of 20 unanswerable requests | Median processing time |
| --- | --- | --- | --- |
| Original prompt | 64 | 19 | 0.6 seconds |
| Revised prompt | 70 | 19 | 0.7 seconds |
| Fine-tuned candidate | 74 | 13 | 0.6 seconds |

The fine-tuned model answers more answerable questions correctly but invents answers more often without evidence. The revised prompt achieves 89 correct outcomes versus 87 for fine-tuning. A stricter unsupported-answer gate can make the choice clearer still.

### Distinguish learning failures from data failures

Inspect failing examples and labels. If annotators disagree about correctness, settle the task definition first. If desired responses contain dates absent from the input, training may reward inventing dates. Repair the examples before only adjusting the learning rate.

A **learning curve** plots development performance against data quantity or training steps. Shrinking training loss with worsening development performance suggests overfitting or distribution mismatch. High loss on both splits can indicate limited capacity, poor optimization, task difficulty, or inconsistent labels; it does not prove only one cause.

**Production contract:** release model, prompt, tokenizer, preprocessing, and evaluation report as a compatible bundle. Track permitted use and source of training records. Rollback must restore the bundle: old weights with a new template can behave differently from the previous system.

**Optimization exercise:** compare a prompt baseline, fewer full-update steps, and a small adapter under a fixed development budget. Report peak memory, elapsed training time, quality slices, and inference cost. Fewer trained parameters can reduce optimizer memory without proportionally reducing all computation.

<details>
<summary>Interview defense: how do you distinguish forgetting from evaluation noise?</summary>

Use a fixed regression development set, controlled repeated runs where feasible, per-case comparisons, and uncertainty estimates. Check compatibility of tokenizer, prompt, and decoding. Consistent degradation after adaptation supports forgetting; one sampled response does not. Confirm the selected release on reserved final data.

</details>

**Teach-back:** draw three places a fix can live: input evidence, model weights, and application code. Place a changing fact, a style failure, and a permission failure appropriately. Explain when combinations are useful.

**Previous:** [Prompts and structured output](02-prompts-and-structured-output.md) · **Next:** [Multimodal generation and a tiny language-model project](04-multimodal-generation.md)
