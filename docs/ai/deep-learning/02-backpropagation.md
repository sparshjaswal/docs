---
title: "Backpropagation, one multiplication at a time"
sidebar_label: "2. Backpropagation"
sidebar_position: 1.5
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Backpropagation, one multiplication at a time

**Before this lesson:** [neural-network units](./01-neural-networks.md) and the [chain rule](../mathematics/02-functions-and-gradients.md). You know that training needs a slope for every adjustable number.

**Backpropagation** is an efficient way to apply the chain rule through a network. It calculates gradients. An **optimizer** then uses those gradients to update parameters. Keeping these two jobs separate makes training easier to debug.

## Follow a two-weight model

Use an input x = 2, a first weight a = 3, a second weight b = 4, and a target y = 10. For now, use only multiplication so every derivative is visible:

`hidden = a × x = 6`\
`prediction = b × hidden = 24`\
`loss = (prediction − y)² / 2 = 98`

The loss slope with respect to prediction is `prediction − y = 14`. The slope of prediction with respect to b is hidden = 6, so the slope for b is `14 × 6 = 84`.

To reach a, pass backward through b and x: `14 × 4 × 2 = 112`. Do not update b before calculating a's gradient: both gradients must describe the same forward calculation.

<AlgorithmWalkthrough name="aiBackpropagation" />

This two-linear-layer model is equivalent to one linear layer. Nonlinear activations make real networks more expressive; their derivatives become additional factors in the same chain. For ReLU, the derivative is 1 above zero and 0 below zero. At zero it is not differentiable; implementations choose a convention.

## Check the derivative independently

```python runnable
def loss(a, b):
    prediction = b * (a * 2)
    return (prediction - 10) ** 2 / 2

a, b = 3.0, 4.0
error = b * (a * 2) - 10
grad_a = error * b * 2
grad_b = error * a * 2
epsilon = 1e-5
numerical = (loss(a + epsilon, b) - loss(a - epsilon, b)) / (2 * epsilon)
assert abs(numerical - grad_a) < 1e-6
print(f"gradients: a={grad_a:.1f}, b={grad_b:.1f}")
new_a, new_b = a - 0.001 * grad_a, b - 0.001 * grad_b
print(f"loss decreased: {loss(new_a, new_b) < loss(a, b)}")
```

```text output
gradients: a=112.0, b=84.0
loss decreased: True
```

A numerical gradient perturbs one parameter and recomputes the loss. It is slow for millions of parameters but useful for tiny correctness tests. Avoid checking at activation corners, and try several moderate perturbation sizes before blaming a mismatch on rounding.

## Why automatic differentiation helps

**Automatic differentiation** records supported operations and composes their derivative rules. It is not random guessing and is not the same as estimating every derivative with finite differences. When two paths use one parameter, contributions from both paths must be added.

Intermediate results needed during the backward pass consume memory. **Gradient checkpointing** saves fewer intermediate results and recomputes some later. It trades extra computation for less memory. In contrast, a saved training checkpoint stores model state on disk so training can resume.

The official [PyTorch automatic differentiation tutorial](https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html) introduces gradient tracking. Its [autograd walkthrough](https://docs.pytorch.org/tutorials/beginner/introyt/autogradyt_tutorial.html) explains graphs and accumulation. The next lesson uses those ideas in a full loop.

## Choose an update rule and control instability

**Stochastic gradient descent**, or SGD, uses the gradient from a small batch: a group of training examples. **Momentum** keeps a moving trace of earlier gradients so updates can sustain a direction. **Adam** also tracks squared-gradient information to adapt update sizes by parameter. These approaches require tuning; Adam is not proof that a chosen objective or dataset is suitable.

**Weight decay** discourages large weights. **Dropout** temporarily removes some activations during training to reduce reliance on particular paths. **Normalization** rescales intermediate values; batch normalization uses batch statistics, while layer normalization works across features within an example. Their training and inference behavior differs, so use the framework's correct modes.

**Gradient clipping** limits the gradient norm. It can control extreme updates but does not repair mislabeled data, a wrong loss, or a broadcasting error. Record training loss, validation loss, gradient norms, and learning rate. If training loss improves while validation worsens, adding more training steps may make generalization worse.

## Practice and project extension

Set b = 0 in the worked model. What happens to the gradient for a? Does the gradient for b also become zero?

<details>
<summary>Check the chain</summary>

The prediction is zero and the error is −10. The gradient for a includes b, so it is zero. The gradient for b is `−10 × 6 = −60`. A zero gradient in one part of a model does not imply every parameter stops learning.

</details>

**Checkpoint:** independently check both derivatives, then add a bias and check its derivative. Finally change the learning rate and record when the loss increases. Save this result with your neural-network project; a gradient check is implementation evidence, not evidence of real-world prediction quality.

## Depth lab: build a tiny reverse-mode engine

A computation graph can reuse a value. Backpropagation must add contributions at that shared value, not overwrite one with another. Reverse topological order ensures a node receives all downstream contributions before it sends gradients to its parents.

```python runnable
class Value:
    def __init__(self, data, parents=()):
        self.data, self.grad, self.parents = data, 0.0, parents
        self.pullback = lambda: None
    def __add__(self, other):
        out = Value(self.data + other.data, (self, other))
        def pullback():
            self.grad += out.grad
            other.grad += out.grad
        out.pullback = pullback
        return out
    def __mul__(self, other):
        out = Value(self.data * other.data, (self, other))
        def pullback():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad
        out.pullback = pullback
        return out
    def backward(self):
        order, seen = [], set()
        def visit(node):
            if node in seen:
                return
            seen.add(node)
            for parent in node.parents:
                visit(parent)
            order.append(node)
        visit(self)
        for node in order:
            node.grad = 0.0
        self.grad = 1.0
        for node in reversed(order):
            node.pullback()

x = Value(3.0)
square = x * x
loss = square + square
loss.backward()
print(loss.data, x.grad)
assert x.grad == 12.0
```

```text output
18.0 12.0
```

The objective is 2x², whose derivative is 4x. The add node sends two contributions to `square`. The multiply node then sends two contributions to x because x is both operands. Graph traversal visits a node once, but derivative contributions follow every operand use. Replacing `+=` with assignment loses those contributions.

### From educational engine to production differentiation

This engine supports only scalar addition and multiplication and clears gradients on each backward call. It has no tensor broadcasting, device execution, higher derivatives, or graph mutation protection. It also assumes forward values are unchanged until backward completes. Frameworks provide many more rules and lifecycle guarantees; this small implementation explains the central mechanism.

Use a central finite difference on `2*x*x` to check the result. Then build a deeper graph and count forward and backward operations. Reverse mode is attractive when one scalar loss depends on many parameters: one backward traversal computes their gradients rather than perturbing each parameter separately.

Memory grows with saved graph/intermediate state. Checkpointing can trade recomputation for fewer retained activations. It is distinct from saving a model checkpoint to disk. Debug missing, zero, exploding, and non-finite gradients as different symptoms.

<details>
<summary>Expert defense: why can an in-place parameter update corrupt backward?</summary>

Local derivative rules use values from the forward computation. Updating a value before every dependent gradient has been calculated mixes states from different computations. Compute all gradients for one forward state before the optimizer changes parameters, unless the algorithm explicitly defines another update scheme.

</details>

**Teach and demonstrate:** draw the shared square node, trace both contributions, introduce the overwrite bug, and show the independent derivative check catching it.

**Previous:** [Build a neural network from small operations](01-neural-networks.md) · **Next:** [Train carefully with and without PyTorch](02-training-and-pytorch.md)
