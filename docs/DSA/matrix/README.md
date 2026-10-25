---
id: dsa-matrix-readme
title: "Matrix"
slug: /DSA/matrix/README
sidebar_label: "Matrix"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Matrix

A **matrix** is a rectangular grid of values. Think of seats in a classroom: a row tells you how far down to go, and a column tells you how far across. In JavaScript, `grid[row][column]` reads one cell. The first pair of coordinates is `(0, 0)`, not `(1, 1)`.

**Before this lesson:** know array indexing, nested loops, and [references](../javascript-for-dsa.md#3-arrays-strings-and-references). Start with row-by-row visits, then learn how boundaries let you visit a spiral without repeating cells. Grid search comes later, after queues and graphs.

## Learning steps

Use a classroom seating chart as your first grid: row and column together identify one seat.

1. Locate a cell and trace a row-by-row visit.
2. Build rows that do not accidentally share the same array.
3. Trace the spiral borders before trying flood fill later in the graph lessons.

## Read coordinates before writing loops

```text
                     column
                 0     1     2
              +-----+-----+-----+
       row 0  |  1  |  2  |  3  |
              +-----+-----+-----+
       row 1  |  4  |  5  |  6  |
              +-----+-----+-----+
       row 2  |  7  |  8  |  9  |
              +-----+-----+-----+
```

`grid[1]` selects the second row, `[4, 5, 6]`. `grid[1][2]` then selects its third entry, 6. The **value** 6 and its **position** `(1, 2)` are different things. With R rows and C columns, valid coordinates satisfy `0 <= row < R` and `0 <= column < C`.

A JavaScript array of arrays is not automatically rectangular. In this chapter's algorithms, every row must be an array of the same length. `[]` has no rows; `[[]]` has one row and no cells. A jagged input such as `[[1, 2], [3]]` does not meet this contract.

<AlgorithmWalkthrough name="matrix" />

The walkthrough uses a smaller 2-by-2 grid. In both sizes, the outer loop chooses a row and the inner loop visits all columns of that row.

```js runnable
function rowSums(grid) {
  const sums = [];
  for (const row of grid) {
    let total = 0;
    for (const value of row) total += value;
    sums.push(total);
  }
  return sums;
}
console.log(rowSums([[1, 2, 3], [4, 5, 6]]).join(","));
console.log(JSON.stringify(rowSums([])));
console.log(JSON.stringify(rowSums([[]])));
```

```text output
6,15
[]
[0]
```

After each inner-loop visit, `total` is the sum of the visited values in that row. When the row ends, its whole sum is ready. The algorithm takes O(R + R·C) time, including the R row visits, and O(R) output space. Apart from the output, it uses O(1) working space. Assume the sums stay within JavaScript's safe Number range.

## Create independent rows

Every row should normally be its own array. Calling the row-creation function once for each row guarantees this:

```js runnable
const rows = 2;
const columns = 3;
const grid = Array.from({ length: rows }, () => Array(columns).fill(0));
grid[0][1] = 7;
console.log(JSON.stringify(grid));

const sharedRows = Array(rows).fill(Array(columns).fill(0));
sharedRows[0][1] = 7;
console.log(JSON.stringify(sharedRows));
```

```text output
[[0,7,0],[0,0,0]]
[[0,7,0],[0,7,0]]
```

The second construction is a common mistake: `fill` repeats a reference to one row. Both outer entries therefore reach the same inner array. Filling a row with primitive zero values is safe; filling the outer array with one mutable row aliases that row. The [reference diagram](../javascript-for-dsa.md#3-arrays-strings-and-references) explains this distinction.

## Spiral traversal: peel one border at a time {/* #spiral-order */}

The goal is to return every cell in clockwise order, starting at the upper-left corner. For the 3-by-3 diagram, the result is `1, 2, 3, 6, 9, 8, 7, 4, 5`. This is a traversal order, not a sort: the values themselves do not decide where we move.

One baseline is to walk in four directions while storing every visited coordinate. It works, but needs O(R·C) visitation storage. A rectangle has a simpler description: four boundaries named `top`, `bottom`, `left`, and `right`. After consuming an edge, move its boundary inward. That uses only four numbers beyond the returned result.

| Pass in the first layer | Cells appended | Boundary change |
| --- | --- | --- |
| Across the top, left to right | 1, 2, 3 | `top` moves from 0 to 1 |
| Down the right, top to bottom | 6, 9 | `right` moves from 2 to 1 |
| Across the bottom, right to left | 8, 7 | `bottom` moves from 2 to 1 |
| Up the left, bottom to top | 4 | `left` moves from 0 to 1 |

Now the unvisited rectangle is just `(row 1, column 1)`, containing 5. The next top pass appends it. There is no remaining row or column to traverse again, so the algorithm stops. Corners are not repeated: every boundary changes immediately after its pass.

<AlgorithmWalkthrough name="matrixSpiral" />

### Complete implementation

This function accepts a rectangular array of rows, including `[]`, `[[]]`, and other zero-column rectangles. It returns a new array and does not change its input. It assumes valid rectangular input rather than spending another pass validating row shapes.

```js runnable
function spiralOrder(matrix) {
  if (matrix.length === 0) return [];
  const result = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let column = left; column <= right; column++) {
      result.push(matrix[top][column]);
    }
    top++;

    for (let row = top; row <= bottom; row++) {
      result.push(matrix[row][right]);
    }
    right--;

    if (top <= bottom) {
      for (let column = right; column >= left; column--) {
        result.push(matrix[bottom][column]);
      }
      bottom--;
    }
    if (left <= right) {
      for (let row = bottom; row >= top; row--) {
        result.push(matrix[row][left]);
      }
      left++;
    }
  }
  return result;
}

console.log(spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]]).join(","));
console.log(spiralOrder([[1, 2, 3]]).join(","));
console.log(spiralOrder([[1], [2], [3]]).join(","));
console.log(JSON.stringify(spiralOrder([])));
console.log(JSON.stringify(spiralOrder([[]])));
```

```text output
1,2,3,6,9,8,7,4,5
1,2,3
1,2,3
[]
[]
```

### Why it is correct

At the beginning of each loop, the boundary rectangle contains exactly the unvisited cells, and `result` contains all earlier cells in spiral order. This is the **invariant**. The top pass visits its boundary once, then excludes that row. The right pass therefore starts below the already visited top-right corner. The bottom and left passes similarly use the updated boundaries. Their guards avoid revisiting a row or column that no longer exists.

Each completed layer removes its border and leaves precisely the next inner rectangle. Every pass follows the required clockwise direction, so the invariant is preserved. The rectangle shrinks until one pair of boundaries crosses; then no cells remain. Every cell has been returned exactly once in the required order.

For R·C cells, time is O(R·C) when nonempty and O(1) for a zero-cell rectangle. The returned array occupies O(R·C) space. **Working space excluding that required output is O(1)**. Calling the whole function's memory O(1) without excluding its result would be misleading.

Every correct solution must write R·C returned values, so it cannot use fewer than proportional work on a nonempty grid. The boundary method reaches that lower bound while removing the baseline's visited-cell storage.

## Recognize nearby grid techniques

| Task | Idea and prerequisite | Cost |
| --- | --- | --- |
| Row/column sums | Nested loops; keep coordinates distinct | O(R·C) cell visits |
| Transpose | Original `(row, column)` becomes `(column, row)` in a new grid | O(R·C) time and output |
| Rotate a square 90° clockwise | Transpose in place, then reverse each row | O(n²) time, O(1) working space |
| Rotate a rectangular grid | Allocate C rows of R columns; write `rotated[column][R - 1 - row]` | O(R·C) time and output |
| Flood fill, islands, shortest grid routes | Treat cells as graph vertices; learn [BFS/DFS](../graphs/README.md) first | Usually O(R·C) time and storage |
| Many rectangle-sum queries | Build a [2D prefix sum](../prefix-sum/README.md) first | O(R·C) preprocessing, O(1) per query |

The square in-place rotation rule does not directly work on a rectangular array: its dimensions change. For diagonals, cells on one down-right diagonal share `row - column`; cells on one down-left diagonal share `row + column`. Derive such a rule from how one move changes the coordinates.

Pascal's triangle has rows of different lengths, so it is a useful array-of-arrays problem but not a rectangular matrix. Study its recurrence in the [Pascal triangle lesson](../math/pascal-triangle/README.md) and [combinatorics](../math/README.md), rather than applying the rectangular bounds blindly.

## Common mistakes

- Read `matrix[0]` only after checking whether a row exists.
- Use the number of columns for a column loop, not the number of rows. A square example can hide this mistake; always test a rectangle.
- Do not print or return a border twice when only one row or column remains.
- For flood fill, define allowed moves explicitly: four side-neighbors and eight side-or-corner neighbors describe different problems.
- When modifying a grid, decide whether later cells should see the original state or the updated state. Set Matrix Zeroes and Game of Life require special care to preserve the original information.

## Understanding checks and graduated exercises

1. **Read:** In `[[2, 8, 5], [1, 4, 9]]`, what is `grid[1][2]`? What are R and C?
2. **Trace:** Write the spiral of that same rectangular grid without running code.
3. **Explain:** Why must the bottom pass be guarded after the top row has been consumed?
4. **Implement:** Write `columnSums(grid)` for a rectangular matrix. Return `[]` when it has no cells. Assume sums remain safe Numbers.
5. **Extend:** Implement clockwise rotation using a new grid. Test a 2-by-3 input before attempting the in-place square version.
6. **Apply after graphs:** Solve flood fill, then number of islands, then shortest path in a binary matrix. State the allowed directions and whether the answer counts edges or visited cells.

<details>
<summary>Hints</summary>

The first index selects a row. The last valid column is C−1. For column sums, create C independent numeric totals and add every cell to its column. Rotation sends an old top-left cell to the new top-right position. With one remaining row, the top and bottom boundaries originally identify the same row.

</details>

<details>
<summary>Answers and a complete exercise solution</summary>

1. The value is 9; R = 2 and C = 3.
2. The spiral is `2, 8, 5, 9, 4, 1`.
3. After consuming a single remaining row, `top > bottom`. A second pass across that row would repeat values.
4. Maintain this invariant: after processing some rows, each column total is the sum of that column's processed entries. Every visit adds exactly the next required value. Time is O(R + R·C), output O(C), and working space beyond output O(1):

```js runnable
function columnSums(grid) {
  if (grid.length === 0) return [];
  const totals = Array(grid[0].length).fill(0);
  for (const row of grid) {
    for (let column = 0; column < row.length; column++) {
      totals[column] += row[column];
    }
  }
  return totals;
}
console.log(columnSums([[2, 8, 5], [1, 4, 9]]).join(","));
console.log(JSON.stringify(columnSums([])));
console.log(JSON.stringify(columnSums([[]])));
```

```text output
3,12,14
[]
[]
```

5. For each old `(row, column)`, write to `(column, R - 1 - row)` of a freshly allocated C-by-R grid. Allocate independent rows. This maps each old cell to a distinct valid new coordinate, so it uses every cell exactly once. For `[[1,2,3],[4,5,6]]`, the answer is `[[4,1],[5,2],[6,3]]`. The [Rotate Image practice prompt](#practice-problems) adds an in-place requirement for square inputs.
6. Flood fill and number of islands here use four directions; the shortest-path practice prompt permits eight and counts visited cells. Similar-looking grids can have different contracts.

</details>

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| <PracticeProblem id={733} title={"Flood Fill"} text={"Problem statement\nStarting at image[sr][sc], recolor its entire connected region to color. The region includes pixels\nconnected by horizontal or vertical steps whose original value matches the starting pixel. Pixels\njoined only diagonally are not connected.\nInput \u0026 expected result\nReturn the modified image. If the requested color already equals the starting color, the image is\nunchanged.\nEXAMPLE 1\nInput: image = [[1,1,0],[1,0,0]], sr = 0, sc = 0,\ncolor = 7\nOutput: [[7,7,0],[7,0,0]]\nExplanation: The three side-connected 1 pixels belong to the same region.\nEXAMPLE 2\nInput: image = [[2,0],[0,2]], sr = 0, sc = 0,\ncolor = 3\nOutput: [[3,0],[0,2]]\nExplanation: The bottom-right 2 touches only diagonally and is left unchanged.\nConstraints \u0026 guarantees\n• m == image.length\n• n == image[i].length\n• 1 \u003c= m, n \u003c= 50\n• 0 \u003c= image[i][j], color \u003c 2^16\n• 0 \u003c= sr \u003c m\n• 0 \u003c= sc \u003c n\nJavaScript starter\nfunction floodFill(image, sr, sc, color) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/flood-fill/) | — |
| <PracticeProblem id={36} title={"Valid Sudoku"} text={"Problem statement\nCheck whether a partially filled 9 by 9 Sudoku board obeys its current rules. Each row, column, and\n3 by 3 box may contain each digit from \"1\" to \"9\" at most once. A dot represents an empty cell and\nis ignored. Return a boolean; determining whether the puzzle can eventually be solved is not\nrequired.\nInput \u0026 expected result\nReturn true or false without filling any empty cell. All three families of groups must be checked\nindependently; a board can obey every row rule and still violate a column or box rule.\nEXAMPLE 1\nInput: an otherwise empty board whose first row begins [\"5\",\".\",\"5\"]\nOutput: false, because the row repeats 5\nExplanation: The first row contains 5 twice, which already makes the board invalid regardless of\nother cells.\nEXAMPLE 2\nInput: a 9 by 9 board containing only dots\nOutput: true\nExplanation: There are no filled entries that violate any group rule.\nConstraints \u0026 guarantees\n• Board dimensions: exactly 9 rows and 9 columns\n• Cell domain: digits \"1\" through \"9\", or \".\" for empty\nJavaScript starter\nfunction isValidSudoku(board) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/valid-sudoku/) | — |
| <PracticeProblem id={48} title={"Rotate Image"} text={"Problem statement\nmatrix is a square grid representing an image. Rotate it 90 degrees clockwise by changing the\nexisting matrix. Do not allocate another square matrix as the result. Every original element must\nmove to its rotated row and column.\nInput \u0026 expected result\nRotation changes both row and column coordinates. The original outer array and its square grid are\nthe destination, rather than a separately returned image. Repeated values remain separate cells.\nEXAMPLE 1\nInput: matrix = [[1,2],[3,4]]\nAfter the call: matrix = [[3,1],[4,2]]\nExplanation: The original left column becomes the new top row in reverse order: 3 then 1.\nEXAMPLE 2\nInput: matrix = [[9]]\nAfter the call: [[9]]\nExplanation: The center of a one-cell square stays in place.\nConstraints \u0026 guarantees\n• n == matrix.length == matrix[i].length\n• n: 1 through 20 (inclusive)\n• matrix[i][j]: -1000 through 1000 (inclusive)\nJavaScript starter\nfunction rotate(matrix) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/rotate-image/) | — |
| <PracticeProblem id={54} title={"Spiral Matrix"} text={"Problem statement\nReturn the entries of a nonempty rectangular matrix in clockwise spiral order. Start at the\nupper-left corner, traverse the outside boundary, then continue around each inner boundary. Visit\nevery cell exactly once, including any remaining single row or single column.\nInput \u0026 expected result\nReturn a one-dimensional array of all matrix values. Once an outer boundary is consumed, the\nremaining region is smaller; avoid adding a remaining row or column twice.\nEXAMPLE 1\nInput: matrix = [[1,2,3],[4,5,6]]\nOutput: [1,2,3,6,5,4]\nExplanation: The traversal crosses the top row, descends to 6, then moves left through 5 and 4.\nEXAMPLE 2\nInput: matrix = [[7],[8],[9]]\nOutput: [7,8,9]\nExplanation: A single column is visited from top to bottom exactly once.\nConstraints \u0026 guarantees\n• m == matrix.length\n• n == matrix[i].length\n• m, n: 1 through 10 (inclusive)\n• matrix[i][j]: -100 through 100 (inclusive)\nJavaScript starter\nfunction spiralOrder(matrix) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/spiral-matrix/) | [Example](./LC-54-spiral-matrix/index.mdx) |
| [LC 59 — Spiral Matrix II](https://leetcode.com/problems/spiral-matrix-ii/) | Medium | [LeetCode](https://leetcode.com/problems/spiral-matrix-ii/) | [Example](./LC-59-spiral-matrix-ii/index.mdx) |
| <PracticeProblem id={73} title={"Set Matrix Zeroes"} text={"Problem statement\nFor each cell that was zero in the original matrix, set every cell in its row and its column to zero.\nModify the matrix in place. Newly written zeros must not trigger additional rows or columns beyond\nthose implied by the original zeros. Aim for constant extra space.\nInput \u0026 expected result\nThe rule refers to the original zeros. A zero written while processing the matrix must not be\nmistaken for an additional original trigger.\nEXAMPLE 1\nInput: matrix = [[1,2,0],[4,5,6]]\nAfter the call: matrix = [[0,0,0],[4,5,0]]\nExplanation: The original zero is in row 0 and column 2. Those positions become zero, while 4\nand 5 remain untouched.\nEXAMPLE 2\nInput: matrix = [[1,2],[3,4]]\nAfter the call: [[1,2],[3,4]]\nExplanation: No original zero exists, so no row or column changes.\nConstraints \u0026 guarantees\n• m == matrix.length\n• n == matrix[0].length\n• m, n: 1 through 200 (inclusive)\n• matrix[i][j]: -2^31 through 2^31 - 1 (inclusive)\nJavaScript starter\nfunction setZeroes(matrix) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/set-matrix-zeroes/) | — |
| <PracticeProblem id={289} title={"Game of Life"} text={"Problem statement\nUpdate a binary board by one generation of Conway's Game of Life. Each cell has up to eight\nneighbors. A live cell survives only with two or three live neighbors; a dead cell becomes live only\nwith exactly three. All other next states are dead. Apply every change simultaneously based on the\nold board, and modify board in place.\nInput \u0026 expected result\nThe eight neighbors include diagonals. Border cells have fewer neighbors because positions\noutside the board do not exist. The function performs one generation, not repeated updates until\nstability.\nEXAMPLE 1\nInput: board = [[0,1,0],[0,1,0],[0,1,0]]\nAfter the call: [[0,0,0],[1,1,1],[0,0,0]]\nExplanation: The vertical line's middle survives, its two ends die, and the middle row's side cells\neach gain exactly three live neighbors.\nEXAMPLE 2\nInput: board = [[1]]\nAfter the call: [[0]]\nExplanation: The lone live cell has no live neighbors and dies.\nConstraints \u0026 guarantees\n• m == board.length\n• n == board[i].length\n• m, n: 1 through 25 (inclusive)\n• Cell domain: {0, 1}\nJavaScript starter\nfunction gameOfLife(board) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/game-of-life/) | — |
| <PracticeProblem id={542} title={"01 Matrix"} text={"Problem statement\nFor every cell of binary matrix mat, compute the shortest number of horizontal or vertical steps to\na cell containing 0. Moving to a cell that shares an edge costs one step; diagonal movement is not\nallowed.\nInput \u0026 expected result\nReturn a matrix of the same dimensions. Every zero cell has distance 0.\nEXAMPLE 1\nInput: mat = [[0,1,1],[1,1,1]]\nOutput: [[0,1,2],[1,2,3]]\nExplanation: Distances increase with the number of grid edges needed to reach the top-left\nzero.\nEXAMPLE 2\nInput: mat = [[1,0,1]]\nOutput: [[1,0,1]]\nExplanation: Each outer cell is one step from the central zero.\nConstraints \u0026 guarantees\n• m == mat.length\n• n == mat[i].length\n• 1 \u003c= m, n \u003c= 10^4\n• 1 \u003c= m * n \u003c= 10^4\n• mat[i][j] is either 0 or 1\n• At least one cell is 0\nJavaScript starter\nfunction updateMatrix(mat) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/01-matrix/) | — |
| [LC 885 — Spiral Matrix III](https://leetcode.com/problems/spiral-matrix-iii/) | Medium | [LeetCode](https://leetcode.com/problems/spiral-matrix-iii/) | — |
| <PracticeProblem id={1091} title={"Shortest Path in Binary Matrix"} text={"Problem statement \u0026 expected result\nTravel from the upper-left to the lower-right cell using only zero-valued cells. Each move may share an edge or a\ncorner, giving eight possible directions. Return the fewest visited cells, including both endpoints, or -1 if no clear\nroute exists.\nEXAMPLE 1\nInput: grid = [[0,1],[1,0]]\nOutput: 2\nExplanation: The diagonal directly connects the two clear endpoint cells.\nEXAMPLE 2\nInput: grid = [[0,0,0],[1,1,0],[1,1,0]]\nOutput: 4\nExplanation: A diagonal move shortens the route to four visited cells.\nConstraints \u0026 guarantees\n- n == grid.length\n- n == grid[i].length\n- 1 \u003c= n \u003c= 100\n- grid[i][j] is 0 or 1\nJavaScript starter\nfunction shortestPathBinaryMatrix(grid) {\n// TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/shortest-path-in-binary-matrix/) | — |
| G30 — Find the maximum-sum rectangular submatrix. | Exercise | Dynamic programming. Related only: [LC 363](https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k/) - Max Sum of Rectangle No Larger Than K. Adds an upper bound k on the rectangle sum. | — |
| [LC 118 — Pascal's Triangle](https://leetcode.com/problems/pascals-triangle/) | Easy | [LeetCode](https://leetcode.com/problems/pascals-triangle/) | [View Solution](./LC-118-pascals-triangle/index.mdx) |
| [LC 119 — Pascal's Triangle II](https://leetcode.com/problems/pascals-triangle-ii/) | Easy | [LeetCode](https://leetcode.com/problems/pascals-triangle-ii/) | [View Solution](./LC-119-pascals-triangle-ii/index.mdx) |
| [CC — Matrix Rotation (MTRNSFRM)](https://www.codechef.com/problems/MTRNSFRM) | Medium | — |  |
| [LC 463 — Island Perimeter](https://leetcode.com/problems/island-perimeter/) | Easy | [LeetCode](https://leetcode.com/problems/island-perimeter/) |  |
| [LC 498 — Diagonal Traverse](https://leetcode.com/problems/diagonal-traverse/) | Medium | [LeetCode](https://leetcode.com/problems/diagonal-traverse/) |  |
| [LC 766 — Toeplitz Matrix](https://leetcode.com/problems/toeplitz-matrix/) | Easy | [LeetCode](https://leetcode.com/problems/toeplitz-matrix/) |  |
| [LC 867 — Transpose Matrix](https://leetcode.com/problems/transpose-matrix/) | Easy | [LeetCode](https://leetcode.com/problems/transpose-matrix/) |  |
| [LC 1329 — Sort the Matrix Diagonally](https://leetcode.com/problems/sort-the-matrix-diagonally/) | Medium | [LeetCode](https://leetcode.com/problems/sort-the-matrix-diagonally/) |  |
| [LC 1380 — Lucky Numbers in a Matrix](https://leetcode.com/problems/lucky-numbers-in-a-matrix/) | Easy | [LeetCode](https://leetcode.com/problems/lucky-numbers-in-a-matrix/) |  |
| [LC 1572 — Matrix Diagonal Sum](https://leetcode.com/problems/matrix-diagonal-sum/) | Easy | [LeetCode](https://leetcode.com/problems/matrix-diagonal-sum/) |  |
| [LC 1905 — Count Sub Islands](https://leetcode.com/problems/count-sub-islands/) | Medium | [LeetCode](https://leetcode.com/problems/count-sub-islands/) |  |
| [CC — Matrix Multiplication (MATMUL)](https://www.codechef.com/problems/MATMUL) | Medium | — |  |
| [CC — Grid Paths (GRIDPATH)](https://www.codechef.com/problems/GRIDPATH) | Medium | — |  |
| [CC — 2D Array Sum (ARRAY2D)](https://www.codechef.com/problems/ARRAY2D) | Easy | — |  |

{/* END GENERATED PRACTICE PROBLEMS */}

## Related Topics

- [Two Pointers](../two-pointers/README.md) — converging pointers on matrix rows/columns
- [Graphs](../graphs/README.md) — BFS/DFS on grid = graph traversal
- [Binary Search](../binary-search/README.md) — 2D sorted matrix search

[← Back to Home](../index.md) · © sparshjaswal

**Next:** [maps and counting](../hashing/README.md).
