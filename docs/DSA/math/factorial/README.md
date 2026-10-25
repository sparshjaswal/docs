---
id: dsa-math-factorial-readme
title: "Factorial"
slug: /DSA/math/factorial/README
sidebar_label: "Factorial"
---

# Factorial

**Read first:** [Programming basics: turn a rule into steps](../../school-basics/README.md).

**Practice focus:** Count arrangements of three distinct items, then calculate 3! and explain why 0! is 1.

A **factorial**, written `n!`, multiplies the whole numbers from 1 through n. It counts ways to arrange n distinct items: choose any item first, any remaining item second, and continue. For example:

```
5! = 5 * 4 * 3 * 2 * 1 = 120
```

| n   |                n! |
| --- | ----------------: |
| 0   |                 1 |
| 1   |                 1 |
| 2   |                 2 |
| 3   |                 6 |
| 4   |                24 |
| 5   |               120 |
| 6   |               720 |
| 7   |             5 040 |
| 8   |            40 320 |
| 9   |           362 880 |
| 10  |         3 628 800 |
| 11  |        39 916 800 |
| 12  |       479 001 600 |
| 13  |     6 227 020 800 |
| 14  |    87 178 291 200 |
| 15  | 1 307 674 368 000 |

## Build the product

Start the accumulator at 1. After multiplying by `k`, it contains `k!`. For `n = 0` or `n = 1`, the loop does no work and the answer stays 1. Zero factorial counts the single way to arrange an empty collection.

```js runnable
import { FactorialOfNumber } from '../../school-basics/FactorialOfNumber/FactorialOfNumber.js';
console.log(String(FactorialOfNumber(0)));
console.log(String(FactorialOfNumber(5)));
console.log(String(FactorialOfNumber(20)));
```

```text output
1
120
2432902008176640000
```

This imports the [worked factorial implementation](../../school-basics/FactorialOfNumber/index.mdx). It uses BigInt for exact results and rejects negative, fractional, or unsafe Number inputs. Run it from this lesson's directory with Node.js 24 or newer.

## Cost and checks

There are O(n) multiplications. The result grows to Θ(n log n) bits, so multiplication cost and storage also grow. An iterative product avoids recursion depth limits. Check `0!`, `1!`, and the recurrence `n! = n × (n - 1)!` for small inputs. Do not return 0 for `0!`.

## References

[Wikipedia](https://en.wikipedia.org/wiki/Factorial)

**Next:** [Combinatorics: count without listing everything](../combinatorics/README.md).
