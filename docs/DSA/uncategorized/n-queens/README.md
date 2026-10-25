---
id: dsa-uncategorized-n-queens-readme
title: "N-Queens Problem"
slug: /DSA/uncategorized/n-queens/README
sidebar_label: "N-Queens Problem"
---

# N-Queens Problem

**Read first:** [Backtracking](../../backtracking/README.md).

**Practice focus:** Place one queen per row and track columns and both diagonal directions.

Place n queens on an n × n board so no two share a row, column, or diagonal. Try one row at a time. Track used columns and diagonals so you can reject an unsafe square before exploring further.

For example, following is a solution for 4 Queen problem.

![A valid queen arrangement has no shared row, column, or diagonal.](https://cdncontribute.geeksforgeeks.org/wp-content/uploads/N_Queen_Problem.jpg)

The expected output is a binary matrix which has 1s for the blocks
where queens are placed. For example following is the output matrix
for above 4 queen solution.

```
{ 0,  1,  0,  0}
{ 0,  0,  0,  1}
{ 1,  0,  0,  0}
{ 0,  0,  1,  0}
```

## Naive Algorithm

Represent a placement as `columns[row] = column`. A simple exhaustive search tries every column for every row and checks conflicts only after placing all queens. This JavaScript returns the first valid placement, or `null` if none exists. It accepts nonnegative integer sizes; size 0 has the empty placement `[]`. Use small boards: there are nⁿ candidates, each requiring up to O(n²) pair checks.

```js runnable
function naiveNQueens(n) {
  if (!Number.isInteger(n) || n < 0) throw new RangeError('Use a nonnegative integer');
  const columns = [];
  function place(row) {
    if (row === n) {
      for (let first = 0; first < n; first++) {
        for (let second = first + 1; second < n; second++) {
          if (columns[first] === columns[second] ||
              Math.abs(columns[first] - columns[second]) === second - first) return null;
        }
      }
      return [...columns];
    }
    for (let column = 0; column < n; column++) {
      columns[row] = column;
      const result = place(row + 1);
      if (result !== null) return result;
    }
    return null;
  }
  return place(0);
}

console.log(JSON.stringify(naiveNQueens(4)));
console.log(naiveNQueens(3));
```

```text output
[1,3,0,2]
null
```

## Backtracking Algorithm

Reject an unsafe square immediately instead of waiting for a complete board. Place one queen in each row. Track used columns, `row - column` diagonals, and `row + column` diagonals in sets. If a deeper call cannot finish, remove the tentative queen and try the next column.

```js runnable
function solveNQueens(n) {
  if (!Number.isInteger(n) || n < 0) throw new RangeError('Use a nonnegative integer');
  const columns = [];
  const usedColumns = new Set();
  const descending = new Set();
  const ascending = new Set();

  function place(row) {
    if (row === n) return [...columns];
    for (let column = 0; column < n; column++) {
      const down = row - column;
      const up = row + column;
      if (usedColumns.has(column) || descending.has(down) || ascending.has(up)) continue;
      columns.push(column);
      usedColumns.add(column);
      descending.add(down);
      ascending.add(up);
      const result = place(row + 1);
      if (result !== null) return result;
      columns.pop();
      usedColumns.delete(column);
      descending.delete(down);
      ascending.delete(up);
    }
    return null;
  }
  return place(0);
}

const columns = solveNQueens(4);
console.log(JSON.stringify(columns));
const board = columns.map(column => Array.from({ length: columns.length }, (_, c) => Number(c === column)));
console.log(JSON.stringify(board));
console.log(solveNQueens(2));
```

```text output
[1,3,0,2]
[[0,1,0,0],[0,0,0,1],[1,0,0,0],[0,0,1,0]]
null
```

Both functions return one solution, not all solutions. The backtracking search uses O(n) extra space for the sets, current placement, and call stack. A conservative time bound is O(n × n!) because each partial permutation scans up to n columns; rejecting diagonals usually cuts the search substantially. The binary board above is an optional O(n²) display format. Deep recursion and the size of the search make large boards unsuitable for these teaching implementations.

## Bitwise Solution

Bitwise algorithm basically approaches the problem like this:

- Queens can attack diagonally, vertically, or horizontally. As a result, there
  can only be one queen in each row, one in each column, and at most one on each
  diagonal.
- Since we know there can only one queen per row, we will start at the first row,
  place a queen, then move to the second row, place a second queen, and so on until
  either a) we reach a valid solution or b) we reach a dead end (ie. we can't place
  a queen such that it is "safe" from the other queens).
- Since we are only placing one queen per row, we don't need to worry about
  horizontal attacks, since no queen will ever be on the same row as another queen.
- That means we only need to check three things before placing a queen on a
  certain square: 1) The square's column doesn't have any other queens on it, 2)
  the square's left diagonal doesn't have any other queens on it, and 3) the
  square's right diagonal doesn't have any other queens on it.
- If we ever reach a point where there is nowhere safe to place a queen, we can
  give up on our current attempt and immediately test out the next possibility.

First let's talk about the recursive function. You'll notice that it accepts
3 parameters: `leftDiagonal`, `column`, and `rightDiagonal`. Each of these is
technically an integer, but the algorithm takes advantage of the fact that an
integer is represented by a sequence of bits. So, think of each of these
parameters as a sequence of `N` bits.

Each bit in each of the parameters represents whether the corresponding location
on the current row is occupied or attacked. A set bit (1) means unavailable.

For example:

- For `N=4`, column having a value of `0010` would mean that the 3rd column is
  already occupied by a queen.
- For `N=8`, ld having a value of `00011000` at row 5 would mean that the
  top-left-to-bottom-right diagonals that pass through columns 4 and 5 of that
  row are already occupied by queens.

Below is a visual aid for `leftDiagonal`, `column`, and `rightDiagonal`.

| Attack direction | Shared value for an attacking pair |
| --- | --- |
| Same row | `row` |
| Same column | `column` |
| Down-right / up-left diagonal | `row - column` |
| Down-left / up-right diagonal | `row + column` |

For zero-based positions `(0, 1)` and `(2, 3)`, both have `row - column = -1`, so they attack diagonally. The four-queen solution above uses columns `[1, 3, 0, 2]`; its column, difference, and sum values are all distinct.

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Eight_queens_puzzle)
- [GeeksForGeeks](https://www.geeksforgeeks.org/backtracking-set-3-n-queen-problem/)
- [On YouTube by Abdul Bari](https://www.youtube.com/watch?v=xFv_Hl4B83A&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [On YouTube by Tushar Roy](https://www.youtube.com/watch?v=xouin83ebxE&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- Bitwise Solution
  - [Wikipedia](https://en.wikipedia.org/wiki/Eight_queens_puzzle)
  - [Solution by Greg Trowbridge](http://gregtrowbridge.com/a-bitwise-solution-to-the-n-queens-problem-in-javascript/)

**Next:** [Knights Tour](../knight-tour/README.md).
