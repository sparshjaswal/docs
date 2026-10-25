---
id: dsa-uncategorized-hanoi-tower-readme
title: "Tower of Hanoi"
slug: /DSA/uncategorized/hanoi-tower/README
sidebar_label: "Tower of Hanoi"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Tower of Hanoi

**Read first:** [Recursion: let a smaller problem help](../../recursion/README.md).

**Practice focus:** Move two small disks first, then identify the smaller task repeated around the largest disk’s move.

Move all disks from one rod to another. Move only one disk at a time and never place a larger disk on a smaller one. To move n disks, first move the top n − 1 out of the way, move the largest disk, then move the smaller stack onto it.

The objective of the puzzle is to move the entire stack to another
rod, obeying the following simple rules:

- Only one disk can be moved at a time.
- Each move consists of taking the upper disk from one of the
  stacks and placing it on top of another stack or on an empty rod.
- No disk may be placed on top of a smaller disk.

<AlgorithmWalkthrough name="hanoi" />

Animation of an iterative algorithm solving 6-disk problem

With `3` disks, the puzzle can be solved in `7` moves. The minimal
number of moves required to solve a Tower of Hanoi puzzle
is `2^n − 1`, where `n` is the number of disks.

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Tower_of_Hanoi)
- [HackerEarth](https://www.hackerearth.com/blog/algorithms/tower-hanoi-recursion-game-algorithm-explained/)

**Next:** [Backtracking](../../backtracking/README.md).
