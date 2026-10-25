---
id: dsa-math-integer-partition-readme
title: "Integer Partition"
slug: /DSA/math/integer-partition/README
sidebar_label: "Integer Partition"
---

# Integer Partition

**Read first:** [Dynamic Programming](../../dp/README.md).

**Practice focus:** List the partitions of a small integer and avoid counting reordered copies as new answers.

An integer partition writes a positive integer as a sum of positive integers, without counting different orders twice. The partitions of 3 are `3`, `2 + 1`, and `1 + 1 + 1`. `1 + 2` is the same partition as `2 + 1`.

For 4, there are five such groups:

```
4
3 + 1
2 + 2
2 + 1 + 1
1 + 1 + 1 + 1
```

The order-dependent composition `1 + 3` is the same partition
as `3 + 1`, while the two distinct
compositions `1 + 2 + 1` and `1 + 1 + 2` represent the same
partition `2 + 1 + 1`.

Young diagrams associated to the partitions of the positive
integers `1` through `8`. They are arranged so that images
under the reflection about the main diagonal of the square
are conjugate partitions.

![Rows of dots represent the parts of an integer partition; the total number of dots stays fixed.](https://upload.wikimedia.org/wikipedia/commons/d/d8/Ferrer_partitioning_diagrams.svg)

## Exercise and failure drill

Explain why looping over candidate part sizes before totals counts unordered partitions rather than ordered compositions.

<details>
<summary>Expected trace and debugging checks</summary>

Each state incorporates parts in a fixed order, so a partition is built once regardless of the order in which its summands could be written. Reversing the loop interpretation can count different sequences as distinct.

</details>

## Interview reasoning

What is the empty case? There is one partition of zero: choose no parts. This identity supplies the base case when counting partitions with dynamic programming.

## References

- [Wikipedia](<https://en.wikipedia.org/wiki/Partition_(number_theory)>)
- [YouTube](https://www.youtube.com/watch?v=ZaVM057DuzE&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

**Next:** [Combination Sum Problem](../../sets/combination-sum/README.md).
