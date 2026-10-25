---
id: dsa-printing-pattern-readme
title: "📉 Printing Patterns"
slug: /DSA/printing-pattern/README
sidebar_label: "Pattern exercises"
---

# 📉 Printing Patterns

Use an outer loop for rows and an inner loop for positions in each row. Before writing code, draw a small pattern and decide what belongs at each position.

---

## Learning steps

Printing a seating grid or a small text picture is practice in converting a drawing into row-and-column rules.

1. Draw height three and count symbols and spaces in each row.
2. Write one row’s rule before placing it inside the outer loop.
3. Combine upper and lower halves without printing the middle twice.

## Concept

Pattern printing problems help develop:

- **Nested loop control** — understanding row-column relationships
- **Mathematical thinking** — finding formulas for positions and values
- **Logical reasoning** — breaking complex patterns into simple rules
- **2D visualization** — essential for matrix and grid problems

**Common patterns**: stars, numbers, alphabets, geometric shapes, mathematical sequences.

---

## Common Techniques

### Basic Triangle Pattern

```javascript
function printTriangle(n) {
  for (let i = 1; i <= n; i++) {
    let row = '';
    for (let j = 1; j <= i; j++) {
      row += '* ';
    }
    console.log(row);
  }
}
```

### Number Pyramid

```javascript
function numberPyramid(n) {
  for (let i = 1; i <= n; i++) {
    let spaces = ' '.repeat(n - i);
    let numbers = '';
    for (let j = 1; j <= i; j++) {
      numbers += j + ' ';
    }
    console.log(spaces + numbers);
  }
}
```

### Diamond Pattern

```javascript
function diamond(n) {
  // Upper half
  for (let i = 1; i <= n; i++) {
    console.log(' '.repeat(n - i) + '*'.repeat(2 * i - 1));
  }
  // Lower half
  for (let i = n - 1; i >= 1; i--) {
    console.log(' '.repeat(n - i) + '*'.repeat(2 * i - 1));
  }
}
```

---

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| Solid rectangle | Easy | Positive rows and columns; print that many `*` characters in each row. | [Rectangle](./P-PrintRectPattern/index.mdx) |
| Hollow rectangle | Easy | Print the border; inner positions are spaces. A one-row rectangle has no interior. | — |
| Right triangle | Easy | For height n, row r has r stars, from 1 through n. Reverse the counts for the inverted version. | — |
| Floyd's triangle | Easy | Fill rows of lengths 1, 2, …, n with consecutive integers starting at 1. | [Floyd's triangle](./P-PrintFloydsTriangle/index.mdx) |
| X in a box | Easy | In an n × n grid, mark both diagonals. Define odd and even sizes. | [X pattern](./P-PrintXInBox/index.mdx) |
| Concentric numbers | Easy | Print rings from n down to 1 in a square of side `2n − 1`. | [Concentric rectangle](./P-ConcentricRect/index.mdx) |
| Matrix diagonals | Easy | Print each diagonal in order; state where each traversal starts. | [Diagonal traversal](./P-PrintMatrixDiagonal/index.mdx) |
| Checkerboard | Easy | Use one symbol when `(row + column) % 2 = 0` and another otherwise. | — |
| Multiplication table | Easy | Cell `(r, c)` contains `(r + 1) × (c + 1)`; align columns using a fixed width. | — |
| Centered pyramid | Medium | Height n; row r has `n − r` leading spaces and `2r − 1` stars. | — |
| Diamond | Medium | Join an increasing centered pyramid with a decreasing one; print the middle row once. Number and hollow versions use the same outline. | — |
| Hourglass | Medium | Reverse the diamond's row-width rule. “Sandglass” is the same pattern. | — |
| Butterfly | Medium | Grow two triangles at opposite edges and shrink the gap; mirror the rows without repeating the center. | — |
| Pascal's triangle | Medium | Each inner value adds its two parents; see [the worked trace](../math/pascal-triangle/README.md). | — |
| Spiral matrix | Medium | Fill a rectangular grid clockwise, shrinking four boundaries; visit each cell once. | — |
| Zigzag and wave | Medium | Choose a period and map each column to a row; state how endpoints turn. | — |
| Sequence triangle | Medium | Fill row lengths 1 through n using Fibonacci numbers, primes, or letters. Define the sequence and its starting values. | — |
| Sierpiński triangle | Hard | Recursively replace a triangle with three smaller corner triangles. Stop at a stated depth. | — |
| Tessellation | Hard | Choose a tile, its dimensions, and how adjacent tiles meet before writing loops. | — |
| Coordinate drawings | Hard | For hearts, hexagons, cubes, knots, or mandalas, first define the grid and the rule for every marked cell. A shape name alone is not a complete problem. | — |

## Tips for Pattern Problems

1. **Analyze the pattern first** — identify rows, columns, and relationships
2. **Find the mathematical formula** — express position in terms of row/column indices
3. **Handle spaces carefully** — leading spaces often determine alignment
4. **Test with small inputs** — verify logic with n=3 or n=4 before scaling
5. **Break complex patterns** — divide into simpler sub-patterns

---

## Related Topics

- [Matrix](../matrix/README.md) — 2D array manipulation
- [Math](../math/README.md) — mathematical sequences and formulas
- [Recursion](../recursion/README.md) — recursive pattern generation
- [School Basics](../school-basics/README.md) — fundamental programming concepts

[← Back to Home](../index.md) · © sparshjaswal

**Next:** [grid algorithms](../matrix/README.md).
