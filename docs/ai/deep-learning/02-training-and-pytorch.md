---
title: "Train carefully with and without PyTorch"
sidebar_label: "3. Train carefully with and without PyTorch"
sidebar_position: 2
---

# Train carefully with and without PyTorch

**Before this lesson:** [Backpropagation, one multiplication at a time](02-backpropagation.md).

A **training loop** repeats prediction, loss calculation, gradient calculation, and a parameter update. A **batch** is the set of examples used for one update. An **epoch** is one pass through the training examples. These terms describe different quantities: one epoch can contain many updates.

Begin with a tiny model that you can inspect. Record the data split and baseline before experimenting. Lower training loss is evidence that optimization is working; validation and test results answer different questions about generalization.

## Read the loop as five separate jobs

1. Fetch training inputs and targets with the expected shapes and types.
2. Clear accumulated gradients unless accumulation is deliberate.
3. Compute predictions and the scalar loss.
4. Differentiate the loss with respect to trainable parameters.
5. Ask the optimizer to update those parameters.

PyTorch stores arrays as tensors and records differentiable operations for **automatic differentiation**, which computes their gradients. Some layers behave differently while fitting and evaluating: **dropout** randomly omits activations during training; **batch normalization** normalizes activations and may keep running statistics. Its gradients normally accumulate, so clearing them is part of an ordinary update loop. `model.train()` and `model.eval()` select behavior for layers such as dropout and batch normalization; they do not by themselves enable or disable gradient recording. [PyTorch optimization tutorial](https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html).

## Run the standard-library training project first

Download [xor_network.py](pathname:///examples/ai/deep-learning/xor_network.py). This is a fully runnable two-layer network with manually calculated gradients, not a call to a training library. It creates 100 coordinate pairs. The label is one when the coordinates have opposite signs. It uses 60 training, 20 validation, and 20 test points.

Open a terminal in the folder containing the downloaded file:

```sh
python3 xor_network.py
```

Expected output:

```text
Rows: train=60 validation=20 test=20; hidden units=6
Training loss: 0.741 -> 0.068
Selected epoch: 800; validation loss: 0.156
Test accuracy: network=1.00; majority baseline=0.40
Checks passed: finite-difference gradient, lower training loss, separate holdout
```

Read `forward`, then `loss`, `gradients`, and `update`. The project checks one gradient against a small numerical perturbation, trains six tanh hidden units, and saves the checkpoint with lowest validation loss. The final test is evaluated only after checkpoint selection. **Early stopping** uses validation behavior to choose when to stop or which checkpoint to keep; it must not choose on the test set.

A 1.00 result here covers only 20 synthetic test points from one simple construction. It is not a claim about images, language, or all possible coordinates. Rerun controlled experiments with other splits and report variation rather than selecting the nicest seed.

## Optional: express the loop in PyTorch

This block requires the external `torch` package; it is not part of the offline standard-library checks. Choose a supported Python version, create a virtual environment, and follow the [official installation selector](https://pytorch.org/get-started/locally/) for your operating system and CPU or accelerator. A CPU is enough for this example. No dataset download is required.

```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install torch
```

In Windows Command Prompt, activate with `.venv\Scripts\activate.bat` instead. The simple install command is a starting point; use the selector if your platform needs a different package command.

```python
import torch

torch.manual_seed(7)
x = torch.tensor([[0.0], [1.0], [2.0], [3.0]])
y = 2 * x + 1
model = torch.nn.Linear(1, 1)
optimizer = torch.optim.SGD(model.parameters(), lr=0.05)
loss_fn = torch.nn.MSELoss()
initial = loss_fn(model(x), y).detach().item()
model.train()
for _ in range(300):
    optimizer.zero_grad()
    loss = loss_fn(model(x), y)
    loss.backward()
    optimizer.step()
model.eval()
with torch.no_grad():
    final = loss_fn(model(x), y).item()
assert final < initial
print("Training loss decreased")
```

This verifies training mechanics on four points. It deliberately does not estimate generalization; use the separate partitions in the project for that.

## Debug with measurements

Inspect finite losses, gradient magnitudes, target shape, learning rate, and a small set of predictions. Changing a random seed can help reveal instability, but is not a remedy for leakage. Record package versions and hardware; a seed alone does not promise identical results across all environments.

**Weight decay** discourages large parameter values. Like dropout, it alters training behavior and needs validation. Save the model configuration, parameters, preprocessing, and selection rule together, not just a file called “best model”.

## Practice

Why is `model.eval()` insufficient to disable gradients? Why should the validation loop avoid `optimizer.step()`?

<details>
<summary>Check your reasoning</summary>

Evaluation mode changes selected layer behavior. Use `torch.no_grad()` or an appropriate inference context to avoid recording gradients. Updating parameters with validation loss turns validation examples into training information and invalidates their role as an independent selection signal. Keep the loop roles explicit.

</details>

---

## Depth lab: unequal microbatches need correct weighting

Gradient accumulation processes several microbatches before one optimizer step. It can reduce peak activation memory, but the accumulated gradient must match the intended loss. Averaging each microbatch's mean equally is wrong when the microbatches contain different numbers of contributing examples or tokens.

```python runnable
# Per-example gradients at one unchanged parameter state.
microbatches = [[2.0, 4.0], [12.0]]
wrong = sum(sum(batch)/len(batch) for batch in microbatches)/len(microbatches)
correct = sum(sum(batch) for batch in microbatches)/sum(map(len, microbatches))
print(wrong, correct)
assert correct == 6.0
```

```text output
7.5 6.0
```

The intended mean is (2+4+12)/3 = 6. The incorrect method gives the single-example batch half the total weight. For language modeling, the relevant count may be valid target tokens after masking, not the number of sequences. Normalize consistently and step only after accumulating the intended batch.

### A training diagnosis with competing hypotheses

If loss diverges, first verify finite inputs and labels, target alignment, loss reduction, gradients, and update scale on one small batch. Then test learning rate and precision. If training improves but validation worsens, inspect split quality, overfitting, and distribution mismatch. If both remain poor, inspect capacity, features, labels, and optimization. These observations suggest hypotheses; none identifies the cause alone.

For a batch-size change, hold the intended objective constant before comparing throughput. Accumulated microbatches are not automatically identical to a single large batch when batch-dependent layers or randomness change behavior. Record those differences instead of calling every mismatch a bug.

### Release and optimization evidence

A resumable training artifact may need optimizer moments, scheduler position, random-generator states, data position, and model configuration in addition to weights. Test resume by comparing a short uninterrupted run with an interrupted/reloaded run under controlled deterministic conditions. Exact reproducibility across hardware and kernels requires more than a seed.

Profile data loading, transfers, forward, backward, optimizer, and checkpoint writing separately. Use a tiny overfit test for implementation diagnosis, a held-out split for model selection, and a final reserved evaluation for reporting.

<details>
<summary>Expert defense: why might doubling batch size change quality even if an epoch still sees the same rows?</summary>

The number and noise of parameter updates change. Loss reduction, learning-rate schedule, batch-dependent behavior, and regularization interactions may also change. Compare effective batch size, updates, tokens/examples processed, and tuning budget—not only epoch count.

</details>

**Teach and demonstrate:** reproduce the weighting error, implement a correctly normalized accumulation loop, test checkpoint resume, and defend one measured speed/memory improvement without hiding quality regressions.

**Previous:** [Backpropagation, one multiplication at a time](02-backpropagation.md) · **Next:** [Learn visual patterns with convolutions](03-vision-and-convolutions.md)
