---
id: dsa-sets-knapsack-problem-readme
title: "Knapsack Problem"
slug: /DSA/sets/knapsack-problem/README
sidebar_label: "Knapsack Problem"
---

# Knapsack Problem

**Read first:** [Dynamic Programming](../../dp/README.md).

**Practice focus:** Define the item-and-capacity state before compressing the table or changing loop direction.

Choose items to get the most value without exceeding a weight limit. In the 0/1 version, take each item at most once. With capacity 3 and items `(weight 2, value 4)` and `(weight 3, value 5)`, choose the second item: both together are too heavy.

It derives its name from the problem faced by someone who is
constrained by a fixed-size knapsack and must fill it with the
most valuable items.

Example of a one-dimensional (constraint) knapsack problem:
which boxes should be chosen to maximize the amount of money
while still keeping the overall weight under or equal to 15 kg?

![Choose items with the largest combined value while staying within the bag’s weight limit.](https://upload.wikimedia.org/wikipedia/commons/f/fd/Knapsack.svg)

## Definition

### 0/1 knapsack problem

The most common problem being solved is the **0/1 knapsack problem**,
which restricts the number `xi` of copies of each kind of item to zero or one.

Given a set of n items numbered from `1` up to `n`, each with a
weight `wi` and a value `vi`, along with a maximum weight
capacity `W`,

maximize `sum(value[i] × count[i])`

subject to `sum(weight[i] × count[i]) ≤ capacity`
and `count[i] is either 0 or 1`

Here `xi` represents the number of instances of item `i` to
include in the knapsack. Informally, the problem is to maximize
the sum of the values of the items in the knapsack so that the
sum of the weights is less than or equal to the knapsack's
capacity.

### Bounded knapsack problem (BKP)

The **bounded knapsack problem (BKP)** removes the restriction
that there is only one of each item, but restricts the number
`xi` of copies of each kind of item to a maximum non-negative
integer value `c`:

maximize `sum(value[i] × count[i])`

subject to `sum(weight[i] × count[i]) ≤ capacity`
and `count[i] is an integer from 0 through its available limit`

### Unbounded knapsack problem (UKP)

The **unbounded knapsack problem (UKP)** places no upper bound
on the number of copies of each kind of item and can be
formulated as above except for that the only restriction
on `xi` is that it is a non-negative integer.

maximize `sum(value[i] × count[i])`

subject to `sum(weight[i] × count[i]) ≤ capacity`
and `count[i] is any nonnegative integer`

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Knapsack_problem)
- [0/1 Knapsack Problem on YouTube](https://www.youtube.com/watch?v=8LusJS5-AGo&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

**Next:** [Advanced DP: intervals, trees, and subsets](../../dp/advanced.md).
