---
title: "Advanced DP: intervals, trees, and subsets"
sidebar_label: "Advanced DP"
---

# Advanced DP: intervals, trees, and subsets

**Prerequisites:** [basic DP](./README.md), [prefix sums](../prefix-sum/README.md), [trees](../trees/README.md), and [bit masks](../bit-manipulation/README.md). First solve a one-dimensional recurrence and a grid or string recurrence. These extensions change the meaning of a state; they do not replace the state → transition → base case → evaluation order method.

If a cache key leaves out information that changes future choices, two different problems will incorrectly share one answer. The examples below show how the shape of the remaining work determines the state.

## Learning steps

A saved answer must describe enough of the unfinished task. A range, a branch, and a chosen set need different descriptions.

1. Split an interval and combine its best subanswers.
2. Keep the information a parent needs from each tree child.
3. Represent a small chosen set with a mask and compare against every assignment on tiny inputs.

## Interval DP: solve a whole range

Imagine piles of stones in a row. You may merge two neighboring piles and pay their combined size. Merge all piles as cheaply as possible. For `[3, 2, 4]`, merging 3 and 2 costs 5, then merging 5 and 4 costs 9: total 14. Starting with 2 and 4 costs 6 + 9 = 15. Choosing the first merge greedily is not a general proof.

**Recognition:** the problem repeatedly splits or joins contiguous ranges, and the final operation separates the answer into two smaller ranges. Examples include matrix-chain ordering and some expression or partition problems.

Think about the **last** merge. It combines a left group `[left ... split]` and a right group `[split + 1 ... right]`. Trying every split covers every possible last merge.

```text
Original indices:      0       1       2
Piles:               [ 3 ]   [ 2 ]   [ 4 ]

Last split at 0:      [ 3 ] | [ 2     4 ]
smaller costs:          0   +     6       + range sum 9 = 15

Last split at 1:      [ 3     2 ] | [ 4 ]
smaller costs:            5      +   0    + range sum 9 = 14
```

Define `cost[left][right]` as the minimum cost to merge that inclusive interval into one pile. A one-pile interval costs zero. The recurrence minimizes `cost[left][split] + cost[split + 1][right] + sum(left, right)`. Fill intervals from shortest to longest so both smaller costs already exist.

```js runnable
function minimumMergeCost(piles) {
  const length = piles.length;
  if (length === 0) return 0;
  const prefix = [0];
  for (const pile of piles) prefix.push(prefix[prefix.length - 1] + pile);
  const cost = Array.from({ length }, () => Array(length).fill(0));
  for (let width = 2; width <= length; width++) {
    for (let left = 0; left + width <= length; left++) {
      const right = left + width - 1;
      const rangeSum = prefix[right + 1] - prefix[left];
      cost[left][right] = Infinity;
      for (let split = left; split < right; split++) {
        const candidate = cost[left][split] + cost[split + 1][right] + rangeSum;
        cost[left][right] = Math.min(cost[left][right], candidate);
      }
    }
  }
  return cost[0][length - 1];
}

console.log(minimumMergeCost([3, 2, 4]));
console.log(minimumMergeCost([5]));
console.log(minimumMergeCost([]));
```

```text output
14
0
0
```

**Contract:** piles are nonnegative integers; all sums and costs must remain safe Number integers. The input is unchanged. Empty input costs zero. This example allows merging exactly two adjacent piles; a problem requiring exactly k piles at each merge needs different states or feasibility rules.

**Why it works:** any valid final merge has one split. If either side used a nonoptimal merge plan, replacing it with a cheaper plan would lower the total without changing the final range sum. Therefore optimal smaller costs suffice. All splits are examined, so no optimal plan is missed. Increasing interval width is an induction: every dependency has smaller width.

There are O(n²) intervals, each with O(n) possible splits: O(n³) time and O(n²) auxiliary space. Prefix sums make each range-sum query O(1). A recurrence with the same table shape is not automatically optimizable; specialized optimizations require additional proofs.

## Tree DP: remember what the parent needs

Suppose each tree node has a nonnegative value. Choose nodes with maximum total value, but never choose both ends of a parent-child edge. Siblings may both be chosen. Returning only “the best total below this node” loses whether the root of that subtree was chosen.

Instead return two answers: **skip** the node, or **take** it. If you take a parent, you must skip each child. If you skip the parent, each child can independently use its better state.

```text
           3                 (skip, take)
          / \                 root: (6, 7)
         2   3                left: (3, 2), right: (1, 3)
          \   \               leaves: (0, 3), (0, 1)
           3   1

Take root: 3 + skip(left)=3 + skip(right)=1 = 7.
```

**Recognition:** the input is a tree and choices in separate child subtrees become independent once a small amount of information about the parent is fixed. A general graph with cycles breaks this decomposition.

The following explicit stack computes **postorder**, children before their parent. `[node, false]` means “schedule its children”; `[node, true]` means “their answers are ready.” This avoids relying on an arbitrarily deep JavaScript call stack.

```js runnable
function bestTreeSelection(root) {
  if (root === null) return 0;
  const states = new Map();
  const stack = [[root, false]];
  while (stack.length > 0) {
    const [node, ready] = stack.pop();
    if (!ready) {
      stack.push([node, true]);
      if (node.right !== null) stack.push([node.right, false]);
      if (node.left !== null) stack.push([node.left, false]);
    } else {
      const left = states.get(node.left) ?? [0, 0];
      const right = states.get(node.right) ?? [0, 0];
      const skip = Math.max(...left) + Math.max(...right);
      const take = node.val + left[0] + right[0];
      states.set(node, [skip, take]);
    }
  }
  return Math.max(...states.get(root));
}

const leaf = (val) => ({ val, left: null, right: null });
const root = {
  val: 3,
  left: { val: 2, left: null, right: leaf(3) },
  right: { val: 3, left: null, right: leaf(1) },
};
console.log(bestTreeSelection(root));
console.log(bestTreeSelection(null));
```

```text output
7
0
```

**Contract:** a finite binary tree with distinct node objects, no shared child or cycle, nonnegative safe integer values, and a safe total. Missing children are explicitly `null`. This reads the tree without changing it.

**Why it works:** a leaf gives `(0, value)`. Assuming child pairs are correct, each legal choice either skips or takes the parent. The two formulas cover those cases and choose the best legal combination. Postorder makes this argument apply from leaves to root. O(n) time under the Map cost model and O(n) auxiliary space for saved pairs and the stack. A recursive variant needs O(h) call frames, but may exceed the runtime's recursion limit.

## Subset DP: which items remain matters

There are n workers and n jobs. `cost[worker][job]` is the cost of assigning that worker to that job. Every worker gets exactly one job and each job is used once. Trying every assignment takes n! orders.

The first k workers can be assigned in different orders yet leave exactly the same unused jobs. Their future choices then depend only on the set of jobs already used. Keep the cheapest way to reach each such set.

```text
Jobs:             2 1 0        bit positions
Used mask 101:    yes no yes    jobs 0 and 2 are taken
Set bits:        2             next worker is worker 2
Choose job 1:    101 | 010 -> 111
```

Define `best[mask]` as the minimum cost for assigning the first `countSetBits(mask)` workers to exactly those jobs. `best[0] = 0`; other states initially have no known solution (`Infinity`). Try every unused job for the next worker.

```js runnable
function minimumAssignmentCost(cost) {
  const size = cost.length;
  if (size > 20 || cost.some((row) => row.length !== size)) {
    throw new RangeError('Use a square matrix with at most 20 workers');
  }
  const stateCount = 2 ** size;
  const best = Array(stateCount).fill(Infinity);
  best[0] = 0;
  for (let mask = 0; mask < stateCount; mask++) {
    let worker = 0;
    for (let bits = mask; bits !== 0; bits &= bits - 1) worker++;
    if (worker === size) continue;
    for (let job = 0; job < size; job++) {
      const bit = 1 << job;
      if ((mask & bit) !== 0) continue;
      const nextMask = mask | bit;
      best[nextMask] = Math.min(best[nextMask], best[mask] + cost[worker][job]);
    }
  }
  return best[stateCount - 1];
}

console.log(minimumAssignmentCost([[9, 2, 7], [6, 4, 3], [5, 8, 1]]));
console.log(minimumAssignmentCost([[8]]));
console.log(minimumAssignmentCost([]));
```

```text output
9
8
0
```

For the sample, assign worker 0 → job 1 (2), worker 1 → job 0 (6), and worker 2 → job 2 (1), totaling 9. **Contract:** finite safe integer entries, safe candidate totals, and n ≤ 20. Twenty is a practical upper guard, not a promise that every judge's time/memory limit permits the largest case. Negative costs are allowed because every assignment uses a fixed number of jobs and dependencies have no cycles.

**Why it works:** every partial assignment has one used-job set and one next-worker index determined by that set. Of two ways to reach the same set, the more expensive cannot improve any identical future continuation. Adding an unused bit increases the mask, so numerical mask order evaluates prerequisites first. Each complete assignment is represented, and each transition adds exactly its next cost.

O(n · 2ⁿ) time and O(2ⁿ) auxiliary space. The bit-count loop contributes at most O(n) per state. These masks fit JavaScript's positive signed 32-bit range. BigInt masks would fix bit width for larger n, but would not fix exponential state growth. For large assignment problems, a different algorithm is required.

## Graduated practice

| Level | Task | Evidence of understanding |
| --- | --- | --- |
| Bridge | Write the full table for [0/1 knapsack](../sets/knapsack-problem/README.md) before compressing it. | Explain why descending capacity prevents reusing one item. |
| Intermediate | Change interval merging to return a split plan as well as its cost. | Save which split achieved each optimum; reconstruct both subintervals. |
| Advanced | Extend tree selection to nodes with an array of children. | Sum child skip states for take; sum each child's better state for skip. |
| Advanced | Reconstruct a minimum-cost assignment. | Save the previous mask and selected job whenever an improvement is made. |

## Checks before reading solutions

1. Why must interval width start at 2 rather than overwrite single-pile costs?
2. Why is `max(left) + max(right) + node.val` invalid for the tree's take state?
3. For assignment costs `[[1, 2], [1, 100]]`, why does giving worker 0 its cheapest job fail?
4. Can the assignment state keep only the number of used jobs?

<details>
<summary>Hints</summary>

Identify base cases. Draw an edge from a chosen parent to a chosen child. Check both complete assignments. Compare the unused jobs after choosing job 0 versus job 1.

</details>

<details>
<summary>Answers and reconstruction guidance</summary>

1. A single pile needs no merge, so its cost must stay zero. There is no split to try inside it.
2. A child's best state may take that child. Taking both it and its parent violates the rule. Use the child's skip state instead.
3. Greedy costs 1 + 100 = 101. Giving worker 0 job 1 and worker 1 job 0 costs 2 + 1 = 3.
4. No. Sets `{0}` and `{1}` both contain one job but leave different future choices. This is why the mask belongs in the state.

For reconstruction, keep a choice only when it improves a state. Starting from the final state, follow saved choices backward (or recursively split intervals). Include the choice table and the returned plan in your space analysis. If ties matter, define a tie-breaking rule before implementing it.

</details>

**Next:** revisit a failed problem with the state definition hidden. Explain what past information changes future choices, then derive its recurrence yourself. Use the [practice progression](../practice-plan.md) to mix DP with problems where greedy or traversal is sufficient.

**Next:** [changing prefix sums](../trees/fenwick-tree/README.md).
