---
title: "11. Generative AI for text, images, audio, video, and multiple modalities"
sidebar_position: 11
---

# Generative AI for text, images, audio, video, and multiple modalities

**Prerequisites:** deep learning, language models, and [responsible AI](10-responsible-ai.md). Use the core [multimodal lesson](../generative-ai/04-multimodal-generation.md) for the first small experiment.

## What it is and why it matters

A modality is a form of information, such as text, pixels, or sound. A generative system produces a new output; a multimodal system relates more than one information form. Understanding an image, generating an image, and editing an image are distinct tasks with distinct evaluation needs.

## Learn in this order

### Text generation and sampling

Use the language-model foundation: a model predicts a distribution and a decoding procedure selects tokens. Temperature and top-p sampling change selection behavior without retraining the model. Lower randomness does not establish factual correctness.

**Practice:** keep the prompt fixed and vary one decoding setting. Compare diversity, task success, length, and unsupported claims. See [decoding](../generative-ai/05-decoding-and-alignment.md).

### Images: compare generative approaches

An autoencoder compresses and reconstructs data. A variational autoencoder adds a probabilistic latent representation. A generative adversarial network trains a generator against a discriminator. Diffusion models learn to reverse a gradual corruption process; many practical image systems operate in a compressed latent space. These approaches make different tradeoffs in training stability, sampling cost, and output behavior.

Conditioning supplies information such as text, an image, or a mask to guide generation. It is not a guarantee that all requested spatial relationships are preserved. Image fidelity, diversity, prompt adherence, and unwanted duplication are separate concerns.

**Practice:** use a permitted pretrained model to generate or edit a small set of synthetic diagrams. Evaluate labels, object count, spatial relations, and repeated-seed behavior. Do not judge correctness only by visual polish.

### Audio: signals and language

Learn waveforms, sample rate, channels, spectrograms, transcription, speech synthesis, and speaker segmentation. Automatic speech recognition converts audio to text; text-to-speech converts text to audio. A model trained on clean speech may fail on accents, overlapping speakers, noise, or domain vocabulary.

Word error rate summarizes insertions, deletions, and substitutions, but a single mistaken number or negation can matter more than several harmless words. Voice generation needs appropriate consent and clear labeling in your project.

**Practice:** transcribe short consented or synthetic clips with noise variations. Evaluate names, numbers, timestamps, and negation separately from the aggregate score.

### Video: time changes the task

Video combines visual frames over time, often with audio. Frame-level quality does not establish temporal consistency, correct event order, or accurate physical motion. Sampling a few frames may miss a brief but crucial event.

**Practice:** create a short, permitted clip with a known sequence of events. Compare a frame-sampling summary with a timestamped event checklist. Measure missed events before adding longer inputs.

### Multimodal representations and fusion

A contrastive model can learn to bring matching text/image representations closer and mismatched ones farther apart. Other architectures connect modality encoders to a language model through projection or attention. **Early fusion** combines information sooner; **late fusion** combines separate outputs. These are design choices rather than universal rankings.

Errors compound across stages. An OCR mistake can become a confident but incorrect answer. A diagram can contain instructions that should remain untrusted document content. Evaluate each modality and the combined task, including cases where one modality is missing or contradicts another.

**Practice:** compare OCR plus text extraction against a vision-language model on invoices with a known schema. Preserve the original image and highlight extracted evidence.

## Mastery lab: trace error through a multimodal pipeline

A lecture assistant may transform audio into a transcript, the transcript into segments, and segments into a summary. If speech recognition turns “do not restart” into “restart,” a fluent summary can amplify the first error. Evaluate the stages separately and preserve timestamps so a user can inspect the original evidence.

### Implement a small alignment metric

Word error rate uses the minimum number of substitutions, deletions, and insertions needed to transform a reference into a hypothesis, divided by reference length. The dynamic-programming recurrence compares those three edits; it is not simply the fraction of unequal positions.

```python runnable
def edits(reference, hypothesis):
    previous = list(range(len(hypothesis)+1))
    for i, word in enumerate(reference, 1):
        row = [i]
        for j, candidate in enumerate(hypothesis, 1):
            row.append(min(row[-1]+1, previous[j]+1,
                           previous[j-1]+(word != candidate)))
        previous = row
    return previous[-1]
reference = "do not restart".split()
hypothesis = "do restart".split()
print(edits(reference, hypothesis))
print(round(edits(reference, hypothesis)/len(reference), 3))
```

```text output
1
0.333
```

One deleted word reverses the instruction. A word-level average therefore cannot replace critical-content evaluation. For empty references, define a policy explicitly instead of dividing by zero. WER can exceed one when there are many insertions.

### Extend the mechanism across modalities

For images, implement a tiny convolution and an image normalization round trip. For diffusion, simulate adding known Gaussian noise to a tiny signal and derive the denoising target; do not mistake a scalar simulation for a usable image generator. For audio, trace sample rate, frame length, and timestamps. For video, align frame times and audio times before summarizing. Text generation reuses the tokenizer, causal objective, and decoding lessons.

Production input contracts include format, duration, dimensions, codec support, size, and provenance. Validate decoded content rather than trusting a filename. Bound decoding and inference resources. Preserve an explicit distinction between generated content and source evidence.

### Debug, optimize, and defend

If timestamps drift, compare units and sample-rate conversion before changing the model. If image answers miss small text, inspect resizing and cropping. If video summaries miss events, inspect sampling frequency. Optimize frame selection, batching, resolution, and model size while measuring the errors each choice introduces.

**System design:** separate upload, validation, asynchronous processing, artifact storage, review, and deletion. Store versioned transformations and links back to evidence. A job can succeed technically while failing quality review; represent those as different states.

**Interview defense:** explain why better average WER can coexist with worse safety-critical transcription. Propose an evaluation slice for names, quantities, negation, and domain terminology.

**Teach it:** demonstrate the three-word example, then ask the learner to invent an equally short high-impact error in an image or video pipeline. Deliver a stage-level scorecard, alignment tests, a failure investigation, and a measured quality/cost comparison.

## Mini project and real-world use

Build an accessibility assistant for a small set of consented educational clips: transcript, captions, image descriptions, and a source-linked summary. Include a reviewer screen for names and numerical facts. Keep generation and factual extraction separate in the evaluation.

Uses include assistive interfaces, document processing, content production, meeting summaries, and visual search. Establish data rights and privacy before using recordings from real people.

**Completion evidence:** modality-specific metrics, a combined-task rubric, latency/cost, source references, correction workflow, and failures caused by missing or conflicting inputs.

## Interview questions

1. How do a GAN and a diffusion model learn to generate?
2. What changes when generation happens in latent space?
3. Why can low word error rate hide an important transcription failure?
4. Why is a collection of good frames insufficient to evaluate video?
5. How would you locate an error in an OCR-to-summary pipeline?

## Curated resources

- **Courses:** [Hugging Face Diffusion course](https://huggingface.co/learn/diffusion-course/unit0/1) and [Audio course](https://huggingface.co/learn/audio-course/chapter0/introduction).
- **Book:** [Dive into Deep Learning](https://d2l.ai/), for the generative-model and representation foundations; pair it with current modality-specific documentation.
- **Papers:** [Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239), [CLIP](https://arxiv.org/abs/2103.00020), and [Whisper](https://arxiv.org/abs/2212.04356).
- **GitHub:** [Diffusers](https://github.com/huggingface/diffusers), for pretrained generative pipelines. Select a small compatible model and read its model card.

**Previous:** [Responsible AI](10-responsible-ai.md) · **Next:** [RAG](12-rag.md).
