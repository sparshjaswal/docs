---
title: LC 509 Fibonacci Number
---

# Fibonacci Number

**Read first:** [Programming basics: turn a rule into steps](../../school-basics/README.md).

**Practice focus:** Trace the two saved values for n = 0, 1, and 4, staying inside this example’s bounded Number inputs.

Compute `F(n)` for `0 <= n <= 30`, where `F(0) = 0`, `F(1) = 1`, and each later value is the sum of the previous two.

Keep two variables representing consecutive values. After each iteration, advance the pair. This takes O(n) time and O(1) extra space; recursive recomputation is unnecessary.

```js runnable
function fib(n) {
  let previous = 0;
  let current = 1;
  for (let i = 0; i < n; i++) {
    [previous, current] = [current, previous + current];
  }
  return previous;
}
console.log(fib(0), fib(1), fib(4));
```

```text output
0 1 3
```

Check `fib(0) === 0`, `fib(1) === 1`, and `fib(4) === 3`. See the [math guide](../README.md) for related concepts.

**Next:** [Fibonacci Number](../fibonacci.md).
