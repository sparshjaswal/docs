---
id: dsa-uncategorized-knight-tour-readme
title: "Knight's Tour"
slug: /DSA/uncategorized/knight-tour/README
sidebar_label: "Knight's Tour"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Knight's Tour

**Read first:** [Backtracking](../../backtracking/README.md).

**Practice focus:** Mark a visited square, try a legal knight move, and undo the mark when that branch fails.

A knight’s tour visits every square on a chessboard exactly once using knight moves: two squares in one direction and one sideways. Backtracking tries a move, continues if possible, and undoes it when the remaining squares cannot be reached.

The **knight's tour problem** is the mathematical problem of
finding a knight's tour. Creating a program to find a knight's
tour is a common problem given to computer science students.
Variations of the knight's tour problem involve chessboards of
different sizes than the usual `8×8`, as well as irregular
(non-rectangular) boards.

The knight's tour problem is an instance of the more
general **Hamiltonian path problem** in graph theory. The problem of finding
a closed knight's tour is similarly an instance of the Hamiltonian
cycle problem.

<AlgorithmWalkthrough name="knightChoices" />

An open tour does not need to end one knight move from its starting square.



A closed tour adds that final connection. Board size changes which tours are possible.

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Knight%27s_tour)
- [GeeksForGeeks](https://www.geeksforgeeks.org/backtracking-set-1-the-knights-tour-problem/)

**Next:** [Hamiltonian Path](../../graphs/hamiltonian-cycle/README.md).
