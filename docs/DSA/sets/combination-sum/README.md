---
id: dsa-sets-combination-sum-readme
title: "Combination Sum Problem"
slug: /DSA/sets/combination-sum/README
sidebar_label: "Combination Sum Problem"
---

# Combination Sum Problem

**Read first:** [Backtracking](../../backtracking/README.md).

**Practice focus:** Reuse a chosen positive candidate when allowed, but avoid returning different orders of the same group.

Choose positive numbers that add to a target. The candidate list contains no duplicates, but you may reuse a candidate any number of times. Return each combination once: choosing 2 then 3 is the same combination as choosing 3 then 2.

**Note:**

- All numbers (including `target`) will be positive integers.
- The solution set must not contain duplicate combinations.

## Examples

```
Input: candidates = [2,3,6,7], target = 7,

A solution set is:
[
  [7],
  [2,2,3]
]
```

```
Input: candidates = [2,3,5], target = 8,

A solution set is:
[
  [2,2,2,2],
  [2,3,3],
  [3,5]
]
```

## Explanations

The search must keep every valid combination and avoid repeating the same combination in another order.

Here is an example of decision tree for the situation when `candidates = [2, 3]` and `target = 6`:

```
                0
              /   \
           +2      +3
          /   \      \
       +2       +3    +3
      /  \     /  \     \
    +2    ✘   ✘   ✘     ✓
   /  \
  ✓    ✘
```

## Keep choices in a fixed order

Backtracking is a direct way to enumerate the combinations. Dynamic programming can also support enumeration or counting; it is not ruled out simply because the task asks for every result.

Carry a starting index so later choices never move backward in the sorted candidate list. Reuse the same index when an item may be chosen again. This produces `[2, 2, 3]` once, without also producing its permutations.

```js runnable
function combinationSum(candidates, target) {
  const values = [...candidates].sort((a, b) => a - b);
  const result = [];
  const path = [];
  function search(start, remaining) {
    if (remaining === 0) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < values.length && values[i] <= remaining; i++) {
      path.push(values[i]);
      search(i, remaining - values[i]);
      path.pop();
    }
  }
  search(0, target);
  return result;
}
console.log(JSON.stringify(combinationSum([2, 3, 6, 7], 7)));
console.log(JSON.stringify(combinationSum([4], 3)));
```

```text output
[[2,2,3],[7]]
[]
```

## Cost and boundaries

Candidates must be distinct positive integers. A zero or negative candidate would invalidate the decreasing-remainder argument and can cause nontermination. For minimum candidate `a`, search depth is at most `floor(target / a)`. Work can grow exponentially, and storing all results costs at least their total size. The current path uses space proportional to search depth, excluding output and the sorted copy.

Check that each returned combination sums to the target and has nondecreasing values. Test a target below every candidate, one usable candidate, and a target with several combinations.

## References

- [LeetCode](https://leetcode.com/problems/combination-sum/description/)

**Next:** [Integer Partition](../../math/integer-partition/README.md).
