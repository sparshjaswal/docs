---
id: dsa-sets-fisher-yates-readme
title: "Fisher–Yates shuffle"
slug: /DSA/sets/fisher-yates/README
sidebar_label: "Fisher–Yates shuffle"
---

# Fisher–Yates shuffle

**Read first:** [Array](../../Array/README.md).

**Practice focus:** Freeze one position after each swap and explain why the random index must include the current position.

Fisher–Yates puts an array into a random order. Starting at its last index `i`, select an index from `0` through `i`, swap those two values, then move left. The input is changed in place.

## Trace one possible shuffle

| Step | Random index | Array after the swap | Position now fixed |
| --- | --- | --- | --- |
| Start | — | `[A, B, C]` | None |
| `i = 2` | `0` | `[C, B, A]` | Last position contains A |
| `i = 1` | `0` | `[B, C, A]` | Middle position contains C |

Each step chooses uniformly among the remaining items. There are `n × (n - 1) × ... × 1 = n!` possible sequences of choices, one per permutation. Uniform, independent choices therefore give every permutation the same probability.

## Implementation

An injected random source makes the example repeatable. A real call may omit the second argument to use `Math.random`.

```js runnable
function shuffle(values, random = Math.random) {
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}
console.log(shuffle(['A', 'B', 'C'], () => 0).join(', '));
console.log(shuffle([], () => 0).length);
```

```text output
B, C, A
0
```

## Cost and common mistakes

The loop takes O(n) time and O(1) extra space. To preserve the input, shuffle a copy; that copy costs O(n) space. The random source must return a value from 0 inclusive to 1 exclusive. Repeated values stay repeated.

Choosing from the whole array on every iteration breaks the argument above. Sorting with a random comparator is also not a uniform shuffle. A deterministic test checks swaps and preserved items, but does not establish the quality of a random generator. `Math.random` is not suitable for security-sensitive random choices.

## Check your understanding

List all six possible outcomes for three distinct items. Check that no item disappears or appears twice. Explain why the one remaining item needs no extra random choice.

## References

[Wikipedia](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)

**Next:** [Weighted Random](../../statistics/weighted-random/README.md).
