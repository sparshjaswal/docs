---
title: "6. Neural networks, CNNs, recurrence, attention, and Transformers"
sidebar_position: 6
---

# Neural networks, CNNs, recurrence, attention, and Transformers

**Prerequisites:** [mathematics](03-mathematics.md), [data science](04-data-science.md), and [ML evaluation](05-machine-learning.md). Work through the [core neural-network sequence](../deep-learning/01-neural-networks.md), including backpropagation, before using a large pretrained model.

## What it is and why it matters

A neural network composes learned transformations. Early transformations produce intermediate features; later transformations use them for a prediction. The architecture limits which computations are convenient, while the data and objective determine what is learned. A larger network is not automatically the right baseline for a small table.

## Learn in this order

### Neural networks and the training loop

Learn weighted sums, biases, nonlinear activations, loss functions, forward computation, backpropagation, and optimizer updates. Without nonlinearities, stacked linear layers collapse into a single linear transformation. A batch is a set of examples processed together; an epoch is a pass through the training dataset under the declared sampling procedure.

Study initialization, normalization, regularization, dropout, early stopping, and gradient clipping. Learn the difference between training and evaluation modes and between mode changes and disabling gradient recording. Debug by overfitting a tiny batch, checking labels and shapes, and comparing analytical gradients with finite differences.

**Practice:** implement a small multilayer network for a nonlinear task, then reproduce it in PyTorch. Complete the [gradient check](../deep-learning/02-backpropagation.md) and [training project](../deep-learning/02-training-and-pytorch.md).

### CNNs: exploit local structure

A convolutional neural network uses filters shared across locations. Shared weights reduce parameter count and express the assumption that a useful local pattern can occur in many places. Study channels, kernels, stride, padding, receptive fields, pooling, residual networks, and transfer learning.

Classification gives an image label; detection adds object locations; segmentation labels pixels. These require different targets and metrics. CNNs can also process temporal signals, but the axis meaning and valid augmentations must match the task.

**Practice:** calculate output shapes and parameter counts before running a layer. Fine-tune a small image classifier and evaluate near-duplicates, lighting changes, and small classes using the [vision lesson](../deep-learning/03-vision-and-convolutions.md).

### RNNs and LSTMs: carry information through time

A recurrent neural network (RNN) updates a hidden state using the current input and the previous state. Parameters are reused over time. Training unfolds those repeated operations and propagates gradients through them; long chains can make gradients shrink or grow.

Long short-term memory (LSTM) networks add a memory cell and learned gates. A forget gate scales old memory, an input gate controls the proposed update, and an output gate controls the exposed state. In a simplified scalar example, `new_cell = forget * old_cell + input * candidate`. With values `0.8, 2.0, 0.1, 0.5`, the new cell is `1.65`. Gates help preserve information, but do not guarantee unlimited memory or solve every long-range problem.

**Practice:** trace that update, then compare a small RNN and LSTM on sequences where an early symbol determines a later label. Keep hidden state from leaking between unrelated examples. Compare with a simple fixed-window baseline.

### Attention: select information by content

Attention computes compatibility between queries and keys, turns scores into normalized weights, and combines values. Scaled dot-product attention uses `softmax(QKᵀ / sqrt(d))V`. The [attention lesson](../deep-learning/04-sequences-and-attention.md) calculates each step using two small vectors.

Learn self-attention, cross-attention, causal masks, padding masks, and positional information. A mask defines allowed information; an impressive score cannot authorize looking at a future target. Attention weights are not automatically faithful explanations of a model's decision.

**Practice:** mask out one value, change it drastically, and verify that the allowed query's result is unchanged.

### Transformers: combine attention with trainable feature processing

A Transformer block combines attention, feed-forward layers, residual connections, and normalization. Multi-head attention uses several projections, then combines their outputs. Encoder models can read all supplied input positions; causal decoders restrict access for next-token prediction; encoder–decoder models connect a source representation to a generated target.

Trace dimensions through a block before scaling it. Learn the distinction between attention scores over positions and output scores over a vocabulary. Dense attention compares pairs of positions, so sequence length has an important computational cost. Architecture variations should be studied against a specific implementation.

**Practice:** build or inspect a tiny causal block, verify the mask, and compare next-token loss with a simple sequence baseline. Follow the [Transformer lesson](../deep-learning/05-transformers.md).

## Mastery lab: prove that a causal mask works

A causal model must not use future tokens to predict the current next token. The mask therefore applies to attention scores before normalization. Replacing forbidden scores with zero is wrong: `exp(0)` still receives positive probability. Exclude those positions or use the appropriate negative-infinity mask.

```python runnable
import math
def attend(scores, values, allowed):
    active = [s for s, ok in zip(scores, allowed) if ok]
    if not active:
        raise ValueError("No permitted keys")
    peak = max(active)
    weights = [math.exp(s-peak) if ok else 0.0
               for s, ok in zip(scores, allowed)]
    total = sum(weights)
    return sum(w*v for w,v in zip(weights,values))/total

print(attend([1.0, 2.0], [10.0, 1000.0], [True, False]))
print(attend([1.0, 2.0], [10.0, -9999.0], [True, False]))
print(round(attend([1.0, 2.0], [10.0, 1000.0], [True, True]), 3))
```

```text output
10.0
10.0
733.748
```

The first two results are identical despite a drastic change to the forbidden value. This is a behavioral property, stronger than merely checking the mask's shape. Extend it to a whole decoder: change future tokens and check earlier logits in evaluation mode, with randomness disabled and a suitable numeric tolerance.

### Implement and explain the architecture families

Build a scalar neuron and its gradients, then a dense layer. Implement a tiny convolution by nested loops and compare it with a library on padding and stride cases. Unroll an RNN over three steps; shared weights receive gradient contributions from every use. For an LSTM, trace the cell state separately from the hidden state and explain the input, forget, and output gates. For attention, calculate scores, mask, probabilities, and weighted values in separate steps. Assemble a tiny Transformer only after each block has a shape and gradient check.

The [backpropagation](../deep-learning/02-backpropagation.md), [convolution](../deep-learning/03-vision-and-convolutions.md), and [Transformer](../deep-learning/05-transformers.md) lessons provide the detailed starting calculations. A model library becomes easier to debug when each operation has an independently checked small version.

### Debug and optimize a real training run

First overfit a tiny clean batch. If it cannot learn, check labels, loss, gradients, optimizer updates, and train/evaluation mode before increasing data or model size. If tiny-batch training succeeds but validation fails, investigate split design, distribution, capacity, and regularization. Inspect gradient norms and non-finite values; clipping can limit a symptom while leaving a data or objective bug unresolved.

Measure data loading, forward pass, backward pass, optimizer updates, and memory separately. Compare mixed precision, batching, or checkpointing against a quality baseline. Numerical results can depend on precision and operation ordering; require an appropriate tolerance rather than bitwise identity across every device.

**Production design:** version preprocessing, weights, architecture configuration, label mapping, and inference settings together. Bound input shapes and batch sizes. Test loading a checkpoint into a clean process and compare known inputs before rollout.

**Interview defense:** “Training loss improved after removing the attention mask.” Explain information leakage, then propose an invariance test rather than relying on a plausible loss curve.

**Teach it:** use two values, one visible and one hidden, to explain attention. Ask the learner to construct a mask bug that passes a shape test. The deliverable is a checked small implementation, a failed-mask fixture, a profiling report, and a release contract.

## Mini project and real-world use

Create an architecture comparison report: an image task for a CNN and a sequence task for a recurrent or attention model. Keep datasets small, splits fixed, and compute budgets explicit. Reusing pretrained features is a legitimate baseline; training from scratch is a separate experiment.

Uses include defect detection, time-series signals, speech representations, translation, and language modeling. Record accuracy, failure cases, latency, memory, and data requirements.

**Completion evidence:** a gradient check, shape trace, training curves, validation-based selection, and a held-out comparison with a simpler model.

## Interview questions

1. Why do nonlinear activations matter?
2. How does weight sharing change a convolution's parameter count?
3. Why can gradients vanish in an unfolded RNN, and how do LSTM gates help?
4. How do causal and padding masks differ?
5. What do residual connections contribute?
6. Which parts of a Transformer mix positions, and which transform features within a position?

## Curated resources

- **Course:** [Practical Deep Learning for Coders](https://course.fast.ai/), for building and evaluating models.
- **Books:** [Dive into Deep Learning](https://d2l.ai/) for runnable neural-network, CNN, RNN, LSTM, and attention chapters; [Deep Learning](https://www.deeplearningbook.org/) for mathematical depth.
- **Papers:** [Long Short-Term Memory](https://doi.org/10.1162/neco.1997.9.8.1735) and [Attention Is All You Need](https://arxiv.org/abs/1706.03762), read after implementing their smaller building blocks. The LSTM link identifies the original paper; use the book chapters for a current implementation with forget gates.
- **GitHub:** [PyTorch examples](https://github.com/pytorch/examples), for training-loop and architecture implementations.

**Previous:** [Machine learning](05-machine-learning.md) · **Next:** [NLP](07-nlp.md).
