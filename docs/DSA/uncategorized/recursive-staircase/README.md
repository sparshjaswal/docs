---
id: dsa-uncategorized-recursive-staircase-readme
title: "Recursive Staircase Problem"
slug: /DSA/uncategorized/recursive-staircase/README
sidebar_label: "Recursive Staircase Problem"
---

# Recursive Staircase Problem

**Read first:** [Recursion: let a smaller problem help](../../recursion/README.md).

**Practice focus:** Group routes by their final move and calculate the smallest cases before compressing the table.

## The Problem

Count the ordered ways to climb `n` stairs when each move is 1 or 2 stairs. `1 + 2` and `2 + 1` are different ways. For `n = 0`, there is one way: make no moves.

## The Solution

Every route to stair `n` ends with either a one-stair move from `n - 1` or a two-stair move from `n - 2`. These groups do not overlap, so `ways(n) = ways(n - 1) + ways(n - 2)`.

| Stair | Ways | Reason |
| --- | --- | --- |
| 0 | 1 | Empty route |
| 1 | 1 | `[1]` |
| 2 | 2 | `[1, 1]`, `[2]` |
| 3 | 3 | Extend the 2 routes to stair 2 and the 1 route to stair 1. |
| 4 | 5 | `3 + 2` |

Only two previous counts are needed. BigInt preserves exact results after ordinary Number integers would lose precision.

```js runnable
function countWays(n) {
  if (!Number.isSafeInteger(n) || n < 0) throw new RangeError('Use a nonnegative safe integer');
  let previous = 1n;
  let current = 1n;
  for (let stair = 2; stair <= n; stair++) {
    [previous, current] = [current, previous + current];
  }
  return current;
}
console.log(String(countWays(0)));
console.log(String(countWays(4)));
console.log(String(countWays(10)));
```

```text output
1
5
89
```

## Compare approaches

| Approach | Arithmetic operations | Stored counts / call frames |
| --- | --- | --- |
| Plain recursion | O(2ⁿ) upper bound | O(n) call-stack depth |
| Memoized recursion | O(n) | O(n) counts and stack |
| Bottom-up table | O(n) | O(n) counts |
| Two running counts | O(n) | O(1) counts |

BigInt arithmetic grows more expensive as the counts grow; O(1) counts does not mean a constant number of bits. The final count needs O(n) bits. Existing [recursive](./recursiveStaircaseBF.js), [memoized](./recursiveStaircaseMEM.js), [table](./recursiveStaircaseDP.js), and [iterative](./recursiveStaircaseIT.js) implementations illustrate the approaches; compare their zero-input and number-size contracts with this version.

## Check your understanding

List all five routes for four stairs. Then change the allowed moves to 1 or 3 and derive new base cases before changing the recurrence. For general patterns, continue with [dynamic programming](../../dp/README.md).

## References

- [On YouTube by Gayle Laakmann McDowell](https://www.youtube.com/watch?v=eREiwuvzaUM&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=81&t=0s)
- [GeeksForGeeks](https://www.geeksforgeeks.org/count-ways-reach-nth-stair/)

**Next:** [Dynamic Programming](../../dp/README.md).
