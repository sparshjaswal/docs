---
id: dsa-uncategorized-readme
title: "Mixed algorithm practice"
slug: /DSA/uncategorized/README
sidebar_label: "Mixed practice"
---

# Mixed algorithm practice

Use these problems after learning their underlying techniques. The challenge is to select and justify a method when the problem does not name it. Prerequisites depend on the row you choose; start with the [pattern selection guide](../patterns.md).

## Choose a practice problem

| Problem | Prerequisite | Checkpoint |
| --- | --- | --- |
| [Tower of Hanoi](hanoi-tower/README.md) | [Recursion](../recursion/README.md) | Explain the smaller subproblem and legal moves. |
| [Matrix rotation](square-matrix-rotation/README.md) | [Matrices](../matrix/README.md) | Track one coordinate through the transformation. |
| [Jump game](jump-game/README.md) | [Greedy](../greedy/README.md) | Prove the reachable-prefix invariant. |
| [Unique paths](unique-paths/README.md) | [Dynamic programming](../dp/README.md) | Define a state and its boundary cases. |
| [Trapped rainwater](rain-terraces/README.md) | [Two pointers](../two-pointers/README.md) | Justify which boundary is sufficient at each step. |
| [Staircase](recursive-staircase/README.md) | Recursion and dynamic programming | Avoid counting the same subproblem repeatedly. |
| [Stock profit](best-time-to-buy-sell-stocks/README.md) | Arrays and state | Distinguish transaction rules before choosing a recurrence. |
| [N-Queens](n-queens/README.md) | [Backtracking](../backtracking/README.md) | Prune a conflict and undo state correctly. |
| [Knight's tour](knight-tour/README.md) | Backtracking and graphs | Distinguish finding one tour from counting all tours. |

## A problem-solving contract

Write the output, mutation policy, input bounds, and meaning of “no solution.” Solve a tiny case directly. Only then choose an optimization and state what it preserves. A method that solves one version of a problem may fail after a small rule change.

## Failure drill

Change the stock problem from one transaction to multiple transactions with a fee. Explain why the original state may be insufficient. Then change unique paths to include blocked cells and show which boundary conditions must change.

<details>
<summary>Expected reasoning</summary>

The transaction rule determines which past decisions affect the future; a single minimum-so-far value cannot express every fee and holding-state variant. Blocked cells contribute zero routes, including when the start or destination is blocked. Re-derive the state from the contract instead of patching a familiar answer blindly.

</details>

## Interview and revision checklist

Explain a brute-force baseline, one invariant or recurrence, time and auxiliary space with named input sizes, and a counterexample to a tempting wrong method. Test empty or minimal input, a boundary, and a case that exercises the optimization.

**Key takeaway:** choose from constraints and preserved information, not keywords. Continue with the [graduated practice plan](../practice-plan.md) and [stage assessments](../assessments/README.md).
