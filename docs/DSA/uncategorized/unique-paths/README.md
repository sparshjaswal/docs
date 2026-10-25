---
id: dsa-uncategorized-unique-paths-readme
title: "Unique Paths Problem"
slug: /DSA/uncategorized/unique-paths/README
sidebar_label: "Unique Paths Problem"
---

# Unique Paths Problem

**Read first:** [Dynamic Programming](../../dp/README.md).

**Practice focus:** Add disjoint ways arriving from above and left, then compare the answer with routes listed on a tiny grid.

Count routes from the top-left cell to the bottom-right cell of a grid, moving only right or down. A 2 × 2 grid has two routes: right then down, or down then right. At each cell, add the route counts from above and from the left.

The robot can only move either down or right at any point in
time. The robot is trying to reach the bottom-right corner
of the grid (marked 'Finish' in the diagram below).

How many possible unique paths are there?

![Count paths from the top-left cell to the bottom-right cell using only right and down moves.](https://leetcode.com/static/images/problemset/robot_maze.png)

## Examples

**Example #1**

```
Input: m = 3, n = 2
Output: 3
Explanation:
From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:
1. Right -> Right -> Down
2. Right -> Down -> Right
3. Down -> Right -> Right
```

**Example #2**

```
Input: m = 7, n = 3
Output: 28
```

## Algorithms

### Backtracking

First thought that might came to mind is that we need to build a decision tree
where `D` means moving down and `R` means moving right. For example in case
of a board with `width = 3` and `height = 2` we will have the following decision tree:

```
                START
                /   \
               D     R
             /     /   \
           R      D      R
         /      /         \
        R      R            D

       END    END          END
```

We can see three unique branches here that is the answer to our problem.

**Time Complexity**: O(2^(m + n)) is a loose upper bound: a path has at most `m + n - 2` moves, with up to two choices per move.

**Auxiliary Space Complexity**: `O(m + n)` - since we need to store current path with
positions.

### Dynamic Programming

Let `board[row][column]` count routes to that cell. The top row and leftmost column each have one route. Every other cell adds the counts from above and from the left.

This JavaScript accepts nonnegative integer dimensions and returns a `BigInt`, so large route counts stay exact. A grid with a zero dimension has no route. The example uses `width = 3` and `height = 2`, matching the three paths above.

```js runnable
function uniquePaths(width, height) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 0 || height < 0) {
    throw new RangeError('Use nonnegative integer dimensions');
  }
  if (width === 0 || height === 0) return 0n;
  const board = Array.from({ length: height }, () => Array(width).fill(1n));
  for (let row = 1; row < height; row++) {
    for (let column = 1; column < width; column++) {
      board[row][column] = board[row - 1][column] + board[row][column - 1];
    }
  }
  return board[height - 1][width - 1];
}

console.log(String(uniquePaths(3, 2)));
console.log(String(uniquePaths(7, 3)));
console.log(String(uniquePaths(1, 1)));
console.log(String(uniquePaths(0, 2)));
```

```text output
3
28
1
0
```

For the 3 × 2 grid, the route counts are:

| Row / column | 0 | 1 | 2 |
| --- | --- | --- | --- |
| 0 | 1 | 1 | 1 |
| 1 | 1 | 2 | 3 |

The bottom-right value is 3. The starting cell has one empty route, which makes the 1 × 1 answer 1 as well.

The algorithm makes O(width × height) additions and stores that many counts. BigInt arithmetic also depends on the number of bits in each count. Keeping only the current row reduces storage to O(width) counts when the full table is not needed.

### Pascal's Triangle Based

This question is actually another form of Pascal Triangle.

The corner of this rectangle is at `m + n - 2` line, and
at `min(m, n) - 1` position of the Pascal's Triangle.

## References

- [LeetCode](https://leetcode.com/problems/unique-paths/description/)

**Next:** [Recursive Staircase Problem](../recursive-staircase/README.md).
