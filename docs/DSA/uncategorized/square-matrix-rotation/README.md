---
id: dsa-uncategorized-square-matrix-rotation-readme
title: "Square Matrix In-Place Rotation"
slug: /DSA/uncategorized/square-matrix-rotation/README
sidebar_label: "Square Matrix In-Place Rota..."
---

# Square Matrix In-Place Rotation

**Read first:** [Matrix](../../matrix/README.md).

**Practice focus:** Trace the destination of one corner and then every cell before changing the original grid.

## The Problem

You are given an `n x n` 2D matrix (representing an image).
Rotate the matrix by `90` degrees (clockwise).

**Note**

You have to rotate the image **in-place**, which means you
have to modify the input 2D matrix directly. **DO NOT** allocate
another 2D matrix and do the rotation.

## Examples

**Example #1**

Given input matrix:

```
[
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]
```

Rotate the input matrix in-place such that it becomes:

```
[
  [7, 4, 1],
  [8, 5, 2],
  [9, 6, 3],
]
```

**Example #2**

Given input matrix:

```
[
  [5, 1, 9, 11],
  [2, 4, 8, 10],
  [13, 3, 6, 7],
  [15, 14, 12, 16],
]
```

Rotate the input matrix in-place such that it becomes:

```
[
  [15, 13, 2, 5],
  [14, 3, 4, 1],
  [12, 6, 8, 9],
  [16, 7, 10, 11],
]
```

## Algorithm

A clockwise rotation sends the old cell `(row, column)` to `(column, n − 1 − row)`. Verify that the top-left cell moves to the top-right before applying a rule to every cell.

One way to achieve this without another grid is:

1. **Transpose:** swap `(row, column)` with `(column, row)` across the main diagonal. Swap only one side of the diagonal so each pair changes once.
2. **Reverse every row:** swap the first and last values, then move inward.

```text
Original          After transpose    After reversing rows
A B C             A d g              g d A
d e f             B e h              h e B
g h i             C f i              i f C

The old top row A B C is now the right column, read downward.
```

Both passes visit O(n²) cells. Swapping directly in the original matrix needs only a fixed number of temporary values.

The linked [implementation](./squareMatrixRotation.js) first uses `slice()` to copy the outer array, but its row arrays are still shared. It changes the caller’s cells and returns a different outer array, using O(n) storage for that shallow copy. This is distinct from an implementation that returns the same outer object with O(1) extra storage. Decide which identity and memory contract your exercise requires.

## References

- [LeetCode](https://leetcode.com/problems/rotate-image/description/)

**Next:** [Image Processing](../../image-processing/README.md).
