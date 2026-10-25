---
title: "Eight independent problem-solving assessments"
sidebar_label: "Stage assessments"
---

# Eight independent problem-solving assessments

Use one assessment after each [course stage](../index.md#learning-path). These are original exercises, not copied platform statements. Each can be solved locally without an account. The functions use LeetCode-style contracts; assessment 1 also requires a CodeChef-style program. Judge-specific names and formats must always follow the actual problem statement.

For every attempt, write five things before reading the solution: **contract, baseline, improvement, correctness, cost**. A baseline is a simple correct method, even if slow. An improvement must preserve its answer. A proof explains all allowed inputs; tests check selected inputs. Neither replaces the other.

Read only your current stage. Keep the [separate hints and solutions](./solutions.md) closed until you have traced a small input and tried to break your own idea. Each solution contains runnable JavaScript and a reason it works.

## Notation you will need

`n` means the number of items. Indices begin at 0. The half-open range `[left, right)` includes `left` and excludes `right`; its length is `right - left`. `[2, 2)` is empty. A **prefix** starts at the beginning; a **suffix** ends at the end. A **subarray** is contiguous; a **subsequence** preserves order but can skip positions.

```text
positions       0     1     2     3     4
values        [ 8 ] [ 3 ] [ 5 ] [ 1 ] [ 9 ]
boundaries   0     1     2     3     4     5
                        |-----------|
                          [2, 4)
                          values 5, 1
```

A boundary sits between items. `right = n` is a valid boundary, but never a valid index to read. In a diagram, arrows show relationships or processing order, not real JavaScript memory addresses. Unless specified otherwise, inputs are dense arrays and integer intermediate results must fit `Number.MAX_SAFE_INTEGER`.

## 1. A run of successful days — first programs

**Learn first:** [variables, loops, functions, and judge I/O](../javascript-for-dsa.md). Given an array of daily scores and a threshold, return the longest consecutive run of scores at least that threshold. A run cannot skip a failed day. Empty input returns 0. Do not modify the input. Allow negative scores and thresholds; `n ≤ 200000`.

For `[5, 7, 1, 8, 9, 10]` and threshold 5, return 3. The first run has length 2 and the last has length 3.

1. Trace the length of the run ending at each position.
2. Implement `longestRun(scores, threshold)`, then explain why one counter is not enough.
3. Write a standard-input program: first `T`, then for each case `N threshold`, followed by exactly N scores. Print one answer per line. Whitespace may be spaces or newlines.

```text
Input                Output
2                    3
6 5                  0
5 7 1 8 9 10
0 -1
```

Check all successes, all failures, a singleton, and consecutive test cases. Your per-case state must start fresh.

## 2. Reverse rows without changing the original — arrays and references

**Learn first:** [arrays](../Array/README.md), [matrices](../matrix/README.md), and shallow copies. Return a new matrix with each row reversed. Support empty rows and a matrix with no rows. Do not change the original, and ensure no returned row shares its array object with an original row. The values are primitive numbers, not nested objects.

`[[1, 2], [], [3]]` becomes `[[2, 1], [], [3]]`. Afterwards, changing the returned first value must leave the original 1 intact. For R rows and M total cells, target O(R + M) time.

Explain why `matrix.slice()` alone is insufficient and why `Array(R).fill([])` is dangerous. Count required output space separately from temporary working space.

## 3. First item that appears exactly once — stored state

**Learn first:** [Map and frequency counts](../hashing/README.md). Return the first value in input order whose total count is exactly one; return `null` if absent. Values are safe integers; `n ≤ 200000`; preserve input.

For `[4, 7, 4, 9, 7, 2]`, return 9. For `[0, 0]`, return `null`; for `[0, 1, 1]`, return 0. A value seen only once so far may repeat later.

Describe the quadratic baseline, then use expected O(n) time under the hash-map model. Explain why `if (answer)` is an incorrect existence test when the answer may be zero.

## 4. Reach a target with the shortest range — boundaries

**Learn first:** [sliding windows](../sliding-window/README.md). Given **positive** integer values and a positive target, return the length of the shortest nonempty subarray with sum at least the target. Return 0 if absent. For `[2, 3, 1, 2, 4, 3]`, target 7, return 2. Assume `n ≤ 200000`, values and target at most 10⁹.

Start by extending every possible start, then aim for O(n) time and O(1) auxiliary space. Explain why an inner `while` loop need not make this quadratic. Finally test your reasoning on `[1, -1, 3]`, target 3: which assumption breaks, and what answer should be returned? You need not implement the negative-value extension yet.

## 5. Distance to any service station — graph frontiers

**Learn first:** [queues](../queue/README.md), [graphs and BFS](../graphs/README.md). An undirected unweighted graph represents towns. Given its adjacency lists and a list of station vertices, return each town's minimum number of edges to **any** station. Unreachable towns get `-1`. Duplicate station labels are allowed; an empty list means all towns are unreachable. Vertices and station labels are valid zero-based indices; `V + E ≤ 300000`.

```text
[0: station] --- [1] --- [2] --- [3: station]
                         |
                        [4]       [5: isolated]
```

For this graph and stations `[0, 3]`, return `[0, 1, 1, 0, 2, -1]`. First consider running one BFS per station. Can one shared frontier compute all answers in O(V + E + S), where S includes repeated station entries? Explain why starting all sources at distance 0 is valid. Then consider a directed graph: does this compute distance **to** a station or distance **from** one?

## 6. Make an exact total — dynamic programming

**Learn first:** [greedy counterexamples](../greedy/README.md) and [DP](../dp/README.md). Given distinct positive integer coin values and a nonnegative amount, use unlimited copies to make the amount with the fewest coins. Return `-1` if impossible. Empty coin lists are allowed. Amount at most 10000; at most 100 coin types.

For coins `[1, 3, 4]` and amount 6, return 2. For `[2]`, amount 3, return `-1`; amount 0 always returns 0. Show why taking the largest affordable coin can fail. Define exactly what `best[x]` means and why smaller totals can be solved first. Give time in terms of both the amount and number of coin types.

## 7. Count committees exactly — contest arithmetic

**Learn first:** [BigInt](../javascript-for-dsa.md#6-make-the-numbers-safe) and [combinations](../math/combinatorics/README.md). From n distinct people, count unordered groups of size k. Return a BigInt. Require integer `0 ≤ n ≤ 1000`; return `0n` if integer k lies outside `[0, n]`. The empty group counts once.

For `(5, 2)`, return `10n`; `(60, 30)` must be exact, not rounded. Avoid enumerating all groups or computing huge factorials unnecessarily. Explain why every division in your chosen recurrence has no remainder. State cost as a number of BigInt operations and acknowledge their growing digit cost.

## 8. Count out-of-order pairs — combine advanced tools

**Learn first:** [numeric sorting](../sorting/README.md), [binary search](../binary-search/README.md), [Fenwick trees](../trees/fenwick-tree/README.md). Count pairs of indices `i < j` with `values[i] > values[j]`. Equal values do not count. Input values are safe integers, can be negative, and may have huge gaps. Preserve input. Require `n ≤ 200000`, so the pair count fits Number.

For `[3, 1, 2, 1]`, return 4. List the four pairs first. A quadratic pair scan is the reference answer for small tests. Aim for O(n log n) time and O(n) space. Explain how to replace values with order-preserving small ranks, why equal values share a rank, and how a prefix-count structure distinguishes strictly smaller from smaller-or-equal values.

## Review and deliberate practice

Score each dimension 0 (missing), 1 (needed a hint), or 2 (independent): contract and edge cases; correct baseline; justified improvement; correct implementation; accurate cost. Aim for 2 on every dimension, with no correctness failures. A high total does not compensate for a wrong algorithm. If you need a hint, complete the solution, then attempt a fresh variation before moving on.

After each assessment, choose one related problem from the chapter's LeetCode table and one from the [official CodeChef practice links](../roadmap-coverage.md). Hide the topic label when selecting later mixed problems. Keep an error log with the smallest failing input, violated assumption, repair, and revisit date. Re-solve a missed idea after a few days, then again after a longer gap. Adjust spacing to recall, rather than rushing through a fixed calendar.

At the advanced stage, alternate untimed proof work and timed mixed practice. Afterwards, **upsolve**: solve an unfinished contest problem without the clock, using progressively larger hints only when needed. Test optimized methods against small exhaustive baselines. Explain why a technique fails when one assumption changes. These habits develop proficiency; finishing a list alone does not establish expertise.

**When ready:** [open hints and separate solutions](./solutions.md).
