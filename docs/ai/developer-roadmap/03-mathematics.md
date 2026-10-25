---
title: "3. Linear algebra, probability, calculus, and optimization"
sidebar_position: 3
---

# Linear algebra, probability, calculus, and optimization

**Prerequisites:** [Python](02-python-for-ai.md), arithmetic, fractions, functions, and graphs. Use [numbers and notation](../foundations/00-numbers-and-notation.md) if symbols slow you down. Follow the core [mathematics sequence](../mathematics/01-vectors-and-matrices.md) for full worked calculations.

## What it is and why it matters

Mathematics describes what a model computes, what training changes, and what an experiment can establish. Learn it with small calculations and code. You need enough understanding to diagnose a shape error, a misleading metric, or an unstable update—not only enough to recognize a formula.

## Learn in this order

### Linear algebra: represent and transform information

Start with scalars, vectors, matrices, and higher-dimensional arrays called tensors. Learn shapes, transpose, dot products, norms, matrix multiplication, linear combinations, rank, and linear independence. A matrix can transform features or store a batch; its dimensions tell you which interpretation is valid.

Then study projections, orthogonality, eigenvectors, singular value decomposition, and principal component analysis (PCA). Eigenvectors describe directions preserved by a square linear transformation. SVD also applies to rectangular matrices and helps explain low-rank approximation. PCA finds high-variance directions after appropriate centering; high variance does not necessarily mean useful predictive information.

**Practice:** multiply a 2-by-3 matrix by a three-element vector by hand and in code. Project a vector onto a direction. Compress a small centered dataset and compare reconstruction error at different ranks.

### Probability: reason before the outcome is known

Learn events, random variables, conditional probability, independence, Bayes' rule, expectation, variance, covariance, and common distributions. Conditional probability changes the population you are considering. Independence is an assumption about joint probabilities, not a synonym for zero correlation.

Bayes' rule connects prior belief, evidence, and updated belief. Base rates matter: a detector with a low false-positive rate can still produce many false alarms when the target is very rare. Study likelihood separately from probability of a parameter: likelihood evaluates candidate parameters using observed data.

**Practice:** calculate a confusion table for 10,000 cases with a rare positive class. Change the prevalence while keeping detector rates fixed. Explain why precision changes.

### Statistics: learn from a sample

Study descriptive summaries, sampling, estimators, standard errors, confidence intervals, bootstrap resampling, hypothesis tests, and multiple comparisons. Distinguish variability among observations from uncertainty about an estimated mean. A confidence interval depends on a repeated-sampling procedure and assumptions; it is not a guarantee that future observations lie inside it.

Learn experiment design and effect size before treating a small p-value as a useful result. Correlation can arise from a common cause or selection; it does not by itself establish an intervention's effect.

**Practice:** compare two methods on matched cases, resample the paired differences, and report both average improvement and uncertainty. Use [experiments](../mathematics/04-experiments-and-uncertainty.md) and [causal studies](../research/04-causal-and-reproducible-studies.md) in that order.

### Calculus: describe sensitivity

Learn derivatives, partial derivatives, gradients, the chain rule, Jacobians, and the basic meaning of integration. A derivative measures local change. A gradient collects derivatives with respect to several inputs. A Jacobian records how a vector-valued output changes with each input.

The chain rule is the basis of backpropagation: multiply local sensitivities along a computation. Automatic differentiation implements this bookkeeping; it does not choose your loss or prove that your model is appropriate.

**Practice:** differentiate a squared-error loss by hand, approximate it with a small finite difference, and compare. Try several step sizes; extremely tiny differences can amplify floating-point error.

### Optimization: turn gradients into learning

Define an objective, constraints, and parameters before choosing an optimizer. Learn gradient descent, stochastic and mini-batch updates, learning rate, momentum, adaptive updates such as Adam, regularization, convexity, and stopping rules. Too large an update can overshoot; too small can make progress impractically slow.

Convex objectives have useful global properties; neural-network objectives are generally nonconvex. A decreasing training loss does not establish generalization. Regularization and validation address different parts of that problem. Study entropy, cross-entropy, and KL divergence after probability; they connect prediction distributions to training objectives.

**Practice:** optimize `(w - 3) ** 2` with several learning rates. Plot trajectories and explain convergence, oscillation, or divergence. Use the [gradient lesson](../mathematics/02-functions-and-gradients.md).

## Mastery lab: derive, check, and diagnose a gradient

For a prediction `y_hat = w*x + b`, define the mean squared loss as the mean of `(y_hat - y)**2`. Differentiating one squared residual gives `2*(y_hat-y)`. The chain rule multiplies this by `x` for the weight and by `1` for the bias. Average those contributions over examples. The factor of two depends on whether your loss includes a one-half constant; consistency matters more than the convention.

```python runnable
x, y = [1.0, 2.0], [2.0, 4.0]
def loss(w, b):
    return sum((w*a+b-t)**2 for a,t in zip(x,y)) / len(x)

w, b, eps = 0.0, 0.0, 1e-5
dw = sum(2*(w*a+b-t)*a for a,t in zip(x,y)) / len(x)
db = sum(2*(w*a+b-t) for a,t in zip(x,y)) / len(x)
numeric = (loss(w+eps,b)-loss(w-eps,b))/(2*eps)
assert abs(dw-numeric) < 1e-6
print(dw, db)
print(round(loss(w,b), 3), round(loss(w-0.1*dw,b-0.1*db), 3))
```

```text output
-10.0 -6.0
10.0 1.06
```

A negative weight derivative says increasing the weight locally reduces the loss. Gradient descent subtracts the derivative, so the first weight becomes 1.0. It does not say the derivative will remain negative after that step. Explain why a numerical derivative checks a local calculation but does not establish good generalization.

### Debug and optimize with the right mathematical tool

| Symptom | Discriminating check | Repair to investigate |
| --- | --- | --- |
| Plausible values with the wrong prediction shape | Write dimensions beside every matrix multiplication. | Correct the axis or transpose; do not reshape until the intended meaning is clear. |
| Gradients disagree | Compare one parameter with a central finite difference on a smooth tiny case. | Check reduction, chain rule, and shared-parameter contributions. |
| Training oscillates | Plot loss with several step sizes on the same initial state. | Reduce the learning rate or improve feature scaling. |
| Metric jumps between samples | Count independent sampling units and estimate uncertainty. | Collect more relevant independent evidence; avoid treating correlated rows as independent. |
| A rare class has many false alarms | Reconstruct counts using prevalence and conditional rates. | Reassess the decision threshold and actual error costs. |

For linear algebra, implement dot product, matrix multiplication, projection, and power iteration on tiny matrices before using optimized kernels. For probability, enumerate a finite sample space before using simulation. For statistics, implement the mean, sample variance, and a seeded bootstrap with the sampling unit stated. For optimization, compare gradient descent with an analytic solution when one exists. These checks provide independent oracles, rather than asking two copies of the same implementation to agree.

### Production design, interview defense, and teaching

Store feature units, ordering, scaling parameters, and the loss convention with a trained artifact. Changing minutes to seconds at serving time can break a model while every numeric type still passes validation. Use optimized numerical libraries in production and define tolerances appropriate to precision and conditioning; exact equality is often the wrong floating-point test.

**Interview defense:** “Why can a correct gradient still fail to train a useful model?” Cover step size, conditioning, objective choice, data quality, capacity, and evaluation leakage. Then explain which one measurement you would collect first in a given failure.

**Teach it:** derive the two gradients above on paper, let the learner predict their signs, then change one target. Ask them to explain the changed update without running the code. For each mathematical subtopic, repeat the hand calculation → implementation → counterexample → application cycle.

## Mini project and real-world use

Build a small “model math notebook” containing a linear transformation, a Bayes calculation, a confidence interval, a gradient check, and an optimizer comparison. Each experiment needs a hand-worked example, a plot, and a statement of assumptions.

These skills support recommendation vectors, neural-network training, experiment analysis, model calibration, and compressed representations. Avoid memorizing a matrix trick without understanding what the rows and columns represent.

**Completion evidence:** explain each calculation without a library, then reproduce it with a library and justify any numerical difference.

## Interview questions

1. Why are a dot product and element-wise multiplication different operations?
2. When can zero correlation coexist with dependence?
3. What is the difference between standard deviation and standard error?
4. How does the chain rule connect a loss to an early network weight?
5. Why can a lower training loss produce worse test performance?
6. When would a low-rank approximation remove a rare but important signal?

## Curated resources

- **Courses:** [MIT 18.06 Linear Algebra](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/) and [Stanford CS229's archived public notes](https://cs229.stanford.edu/materials.html-full). Use the archive for self-study; some current course materials require university access.
- **Books:** [Mathematics for Machine Learning](https://mml-book.github.io/) for the bridge to ML; [Convex Optimization](https://web.stanford.edu/~boyd/cvxbook/) for advanced optimization after calculus.
- **Paper:** [Adam: A Method for Stochastic Optimization](https://arxiv.org/abs/1412.6980); derive the basic gradient update before reading its adaptive rule.
- **GitHub:** [Mathematics for Machine Learning notebooks](https://github.com/mml-book/mml-book.github.io), for numerical experiments accompanying the book.

**Previous:** [Python](02-python-for-ai.md) · **Next:** [Data science](04-data-science.md).
