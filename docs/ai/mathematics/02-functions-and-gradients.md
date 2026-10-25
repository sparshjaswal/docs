---
title: "Functions, slopes, and gradient-based improvement"
sidebar_label: "2. Functions and gradients"
sidebar_position: 2
---

# Functions, slopes, and gradient-based improvement

**Prerequisites:** [vectors and weights](./01-vectors-and-matrices.md), Python functions, and ordinary arithmetic.

A mathematical **function** maps an input to an output. `f(x) = 2x + 1` means “double the input and add one.” A model is a function with adjustable numbers called **parameters**. To improve it, we need a way to measure error and a way to decide how to change those parameters.

## Exponentials and logarithms

An **exponential** raises a fixed number to a changing power. For example, `2 ** 3` is `2 × 2 × 2 = 8`. The function `exp(x)` uses the number **e**, approximately 2.718, as its base: it means e raised to the power x. Its mathematical result is positive, even when x is negative.

The **natural logarithm**, `log(y)`, asks the reverse question: “Which power of e produces y?” It accepts positive real inputs. Thus `log(exp(x)) = x`, and `exp(log(y)) = y` for positive y. Python provides these functions in its [math module](https://docs.python.org/3/library/math.html#math.exp).

```python runnable
import math

print(f"exp(0) = {math.exp(0):.1f}")
print(f"log(1) = {math.log(1):.1f}")
print(f"exp(log(4)) = {math.exp(math.log(4)):.1f}")
print(f"log(exp(2)) = {math.log(math.exp(2)):.1f}")
```

```text output
exp(0) = 1.0
log(1) = 0.0
exp(log(4)) = 4.0
log(exp(2)) = 2.0
```

Later models use exponentials to turn scores into positive weights. Logarithms turn products into sums: `log(a × b) = log(a) + log(b)` for positive a and b. This helps express errors based on probabilities. Do not apply the real logarithm to zero or a negative value. Computer arithmetic also has limits: very large exponentials can overflow, so later lessons show ways to keep calculations within range.

## Measure how a result changes

A **loss** is a number describing how badly a prediction misses a target. Smaller is better under the chosen definition. Consider the deliberately tiny loss:

`L(w) = (w − 3)²`

Here w is the only adjustable parameter. The target is 3. At w = 0 the loss is 9; at w = 2 it is 1; at w = 3 it is zero. Squaring makes both positive and negative errors costly and penalizes larger errors more strongly.

The **slope**, or derivative, describes the local rate at which the loss changes when w changes. For this function, the derivative is `2(w − 3)`. At w = 0, the slope is −6: moving a little to the right reduces the loss. At w = 4, the slope is positive: moving left reduces it.

A derivative describes a small local change. It does not promise that an arbitrarily large step in that direction will improve the result.

## Take a controlled downhill step

**Gradient descent** subtracts a multiple of the slope from the parameter. That positive multiplier is the **learning rate**:

`new_w = old_w − learning_rate × slope(old_w)`

```python runnable
import math

def loss(w):
    return (w - 3) ** 2

def slope(w):
    return 2 * (w - 3)

w = 0.0
for step in range(4):
    print(f"step={step} w={w:.3f} loss={loss(w):.4f}")
    w = w - 0.25 * slope(w)

point = 1.0
epsilon = 0.00001
numerical = (loss(point + epsilon) - loss(point - epsilon)) / (2 * epsilon)
print(f"gradient check: {math.isclose(numerical, slope(point), rel_tol=1e-7)}")
```

```text output
step=0 w=0.000 loss=9.0000
step=1 w=1.500 loss=2.2500
step=2 w=2.250 loss=0.5625
step=3 w=2.625 loss=0.1406
gradient check: True
```

The numerical check estimates a slope by comparing losses just to either side. It provides an independent check of our derivative formula. An extremely tiny difference can suffer from floating-point subtraction error, while a large difference may poorly describe local behavior.

## Extend one slope to several parameters

A **partial derivative** changes one parameter while holding the others fixed. The **gradient** is the vector of all those partial derivatives. For `L(w, b) = (w − 3)² + (b − 1)²`, the gradient is `[2(w − 3), 2(b − 1)]`. The same downhill rule updates both entries.

The **chain rule** handles a calculation built from smaller functions. If `prediction = 2w + 1` and `loss = (prediction − 7)²`, then change travels through both steps. Multiply the loss's slope with respect to prediction, `2(prediction − 7)`, by the prediction's slope with respect to w, which is 2. Ignoring one step gives the wrong derivative. MIT's [differentiation lessons](https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/) develop slopes and the chain rule from this idea.

## Practice: a step can be too large

Starting from w = 0, use learning rate 1 in the first loss. Calculate the next two parameter values. Does the loss decrease? Then try learning rate 0.25 by hand.

<details>
<summary>Check your answer</summary>

With rate 1, the first update is `0 − 1 × (−6) = 6`; the next is `6 − 1 × 6 = 0`. The loss stays 9 and the parameter oscillates. Rate 0.25 moves from 0 to 1.5 to 2.25, reducing loss to 2.25 and then 0.5625.

</details>

## Choices and common mistakes

A small learning rate can make progress slow; a large one can overshoot. Large feature scales can produce large gradients, which is one reason later lessons discuss scaling. At a zero gradient, a general function may have a minimum, maximum, or another stationary shape; our simple bowl is a particularly friendly case.

Real learning losses may be noisy or have many low regions. A lower training loss also does not guarantee better behavior on new data. Gradients tell us how to adjust a chosen objective; they do not decide whether that objective matches the real problem.

## Depth lab: one parameter can affect several paths

For `f(w) = w*w + w`, w appears three times in the computation. Its derivative is `2*w + 1`. Automatic differentiation must add contributions from every route, not update the weight after the first route.

```python runnable
def f(w):
    return w*w + w

w, epsilon = 3.0, 1e-5
analytic = 2*w + 1
numeric = (f(w+epsilon)-f(w-epsilon))/(2*epsilon)
print(f"analytic: {analytic:.3f}")
print(f"numeric: {numeric:.3f}")
assert abs(analytic-numeric) < 1e-6
```

```text output
analytic: 7.000
numeric: 7.000
```

A **partial derivative** changes one input while holding the others fixed. A **gradient** collects partial derivatives for a scalar output. A **Jacobian** collects them for every component of a vector output. Backpropagation efficiently combines local derivatives for the scalar loss used in training.

### Diagnose an unstable update

For `L(w)=(w-3)^2`, the derivative is `2*(w-3)`. With learning rate η, the new error is `(1-2*η)*(w-3)`. The error shrinks in this exact one-dimensional quadratic when `0 < η < 1`. At η=1 it flips sign without shrinking; above 1 its magnitude grows. This derivation explains oscillation rather than merely naming “too high a learning rate.”

Implement these updates for several rates with the same initial weight. Record loss before and after each step. A derivative check validates a local calculation; it does not prove that an arbitrary finite step improves the loss.

### Numerical and production boundaries

Finite differences trade truncation error against floating-point cancellation. Sweep several reasonable step sizes on a smooth small example. At a nondifferentiable point, a central difference may not match the derivative convention chosen by the implementation; test away from the kink as well.

In production training, record the objective reduction, parameter version, precision, and update rule. Optimize by using automatic differentiation and vectorized kernels after validating the tiny mechanism. Gradient clipping bounds an update signal but cannot fix an incorrect objective or leaked data.

<details>
<summary>Expert defense: why should all gradients use the same parameter state?</summary>

The gradient is defined at one point in parameter space. Updating a parameter while calculating another path can mix derivatives from different points and implement a different algorithm. Save the forward values, accumulate contributions, then apply the declared update.

</details>

**Teach it:** draw the two multiplication inputs and the addition path for w. Ask a learner to identify all three contributions, then predict the quadratic update at η=1.

**Previous:** [Vectors and matrices: give numbers a structure](01-vectors-and-matrices.md) · **Next:** [Probability, data summaries, and conditional questions](03-probability-and-statistics.md)
