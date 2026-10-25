---
id: dsa-math-square-root-readme
title: "Square Root (Newton's Method)"
slug: /DSA/math/square-root/README
sidebar_label: "Square Root (Newton's Method)"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Square Root (Newton's Method)

**Read first:** [Programming basics: turn a rule into steps](../../school-basics/README.md).

**Practice focus:** Separate an exact integer-root task from an approximate root, then define when iteration stops.

The square root of x is the nonnegative number that gives x when multiplied by itself. For 9, it is 3. For 2, the answer is not a whole number, so numerical algorithms stop when the approximation is accurate enough.

Finding `√S` is
the same as solving the equation `x² − S = 0` for a
positive `x`. Therefore, any general numerical root-finding algorithm can be used.

**Newton's method** (also known as the Newton–Raphson method), named after
_Isaac Newton_ and _Joseph Raphson_, is one example of a root-finding algorithm. It is a
method for finding successively better approximations to the roots of a real-valued function.

Let's start by explaining the general idea of Newton's method and then apply it to our particular
case with finding a square root of the number.

## Newton's Method General Idea

The Newton–Raphson method in one variable is implemented as follows:

The method starts with a function `f` defined over the real numbers `x`, the function's derivative `f'`, and an
initial guess `x0` for a root of the function `f`. If the function satisfies the assumptions made in the derivation
of the formula and the initial guess is close, then a better approximation `x1` is:

`x₁ = x₀ − f(x₀) / f′(x₀)`

Geometrically, `(x1, 0)` is the intersection of the `x`-axis and the tangent of
the graph of `f` at `(x0, f (x0))`.

The process is repeated as:

`next = current − f(current) / f′(current)`

until a sufficiently accurate value is reached.

<AlgorithmWalkthrough name="newtonRoot" />

## Newton's Method of Finding a Square Root

As it was mentioned above, finding `√S` is
the same as solving the equation `x² − S = 0` for a
positive `x`.

The derivative of the function `f(x)` in case of square root problem is `2x`.

After applying the Newton's formula (see above) we get the following equation for our algorithm iterations:

```js runnable
const radicand = 9;
let estimate = 5;
estimate = estimate - (estimate ** 2 - radicand) / (2 * estimate);
console.log(estimate);
```

```text output
3.4
```

This performs one update: the estimate moves from 5 to 3.4, closer to the exact answer 3. For a positive radicand, start with a positive estimate so the denominator is not zero. Handle a radicand of 0 separately; negative real inputs have no real square root. A complete approximation repeats the update until the change is within a chosen tolerance, with an iteration limit.

The `x² − S` above is how far away `x²` is from where it needs to be, and the
division by `2x` is the derivative of `x²`, to scale how much we adjust `x` by how
quickly `x²` is changing.

## References

- [Methods of computing square roots on Wikipedia](https://en.wikipedia.org/wiki/Methods_of_computing_square_roots)
- [Newton's method on Wikipedia](https://en.wikipedia.org/wiki/Newton%27s_method)

**Next:** [Euclidean Distance](../euclidean-distance/README.md).
