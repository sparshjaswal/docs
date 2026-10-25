---
id: dsa-math-fibonacci
title: "Fibonacci Number"
slug: /DSA/math/fibonacci
sidebar_label: "Fibonacci Number"
---

# Fibonacci Number

**Read first:** [Programming basics: turn a rule into steps](../school-basics/README.md).

**Practice focus:** Trace the pair of consecutive values and distinguish a constant number of BigInts from constant bit storage.

The Fibonacci sequence starts with `F(0) = 0` and `F(1) = 1`. Each later value is the sum of the previous two: `0, 1, 1, 2, 3, 5, 8, ...`.

## Keep two consecutive values

| Iteration | Previous | Current | Meaning of previous |
| --- | --- | --- | --- |
| Before the loop | 0 | 1 | F(0) |
| 1 | 1 | 1 | F(1) |
| 2 | 1 | 2 | F(2) |
| 3 | 2 | 3 | F(3) |
| 4 | 3 | 5 | F(4) |

At the start of iteration `i`, the pair holds `F(i)` and `F(i + 1)`. Replacing it with `current` and `previous + current` preserves that rule for the next iteration.

```js runnable
function fibonacci(n) {
  if (!Number.isSafeInteger(n) || n < 0) throw new RangeError('Use a nonnegative safe integer');
  let previous = 0n;
  let current = 1n;
  for (let i = 0; i < n; i++) [previous, current] = [current, previous + current];
  return previous;
}
console.log(String(fibonacci(0)));
console.log(String(fibonacci(4)));
console.log(String(fibonacci(10)));
```

```text output
0
3
55
```

## Cost and alternatives

This takes O(n) additions and keeps two counts. With BigInt, the number of bits and the cost of addition grow; constant variable count is not constant bit space. A plain recursive definition repeats the same subproblems, requiring exponential time and O(n) call-stack depth. Memoization removes repeated work but stores earlier results.

For bounded Number inputs, see the [LC 509 example](./LC-509-Fibonacci-Number/README.md). To recognize the same recurrence in a counting problem, read [staircase routes](../uncategorized/recursive-staircase/README.md).

## Check your understanding

Check the two base cases before testing larger inputs. Explain why updating `previous` first and then computing `previous + current` using that changed value would break the recurrence. Preserve the old pair, as destructuring does here.

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Fibonacci_number)

**Next:** [Recursive Staircase Problem](../uncategorized/recursive-staircase/README.md).
