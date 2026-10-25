---
id: dsa-math-horner-method-readme
title: "Horner's Method"
slug: /DSA/math/horner-method/README
sidebar_label: "Horner's Method"
---

# Horner's Method

**Read first:** [Programming basics: turn a rule into steps](../../school-basics/README.md).

**Practice focus:** Evaluate 2x² + 3x + 4 one multiply-and-add step at a time, keeping coefficients in descending order.

Horner's method evaluates a polynomial without calculating each power separately. Store coefficients from the **highest power to the constant term**. For `2x² + 3x + 4`, use `[2, 3, 4]`.

## Rewrite the expression

```text
2x² + 3x + 4 = (2x + 3)x + 4
```

Start with the first coefficient. For every remaining coefficient, multiply the running result by `x`, then add that coefficient.

| At x = 2 | Calculation | Running result |
| --- | --- | --- |
| Start | First coefficient | 2 |
| Read 3 | `2 × 2 + 3` | 7 |
| Read 4 | `7 × 2 + 4` | 18 |

The update is `result = result * x + coefficient`. Writing `result *= x + coefficient` changes the meaning and gives a wrong answer.

## Implementation

```js runnable
function evaluatePolynomial(coefficients, x) {
  if (coefficients.length === 0) return 0;
  let result = coefficients[0];
  for (let i = 1; i < coefficients.length; i += 1) {
    result = result * x + coefficients[i];
  }
  return result;
}
console.log(evaluatePolynomial([2, 3, 4], 2));
console.log(evaluatePolynomial([4, 2, 3, 1, 3], 2));
console.log(evaluatePolynomial([7], 10));
```

```text output
18
97
7
```

For a degree-`n` polynomial with `n + 1` coefficients, this version performs `n` multiplications and `n` additions: `O(n)` time and `O(1)` extra space. This counts arithmetic operations; very large exact integers have additional arithmetic cost.

Keep zero coefficients for missing powers: `x² + 1` is `[1, 0, 1]`, not `[1, 1]`. The example defines an empty coefficient list as the zero polynomial.

## Exercise and failure drill

Evaluate coefficients `[2, -3, 4]` as `2x² - 3x + 4` at x = 2. State coefficient order before tracing.

<details>
<summary>Expected trace and debugging checks</summary>

Horner updates are 2, then 1, then 6. Reversing coefficient order evaluates a different polynomial. Floating-point arithmetic can still accumulate rounding error; fewer multiplications do not guarantee exactness.

</details>

## Interview reasoning

What does Horner improve? It evaluates a degree-n polynomial in linear arithmetic operations without separately computing every power. The arithmetic model determines precision and actual cost.

## References

[Horner's method](https://en.wikipedia.org/wiki/Horner%27s_method)

**Next:** [Polynomial Rolling Hash](../../cryptography/polynomial-hash/README.md).
