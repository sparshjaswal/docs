---
id: dsa-printing-pattern-readme
title: 📉 Printing Patterns
slug: /DSA/printing-pattern/README
sidebar_label: 📉 Printing Patterns
---

# 📉 Printing Patterns

> **One-line summary**: Master nested loops and logical thinking through visual pattern printing — the foundation for understanding 2D array manipulation and algorithmic problem-solving.

---

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

### Basic Patterns (Easy)

| Problem | Difficulty | Solution |
| ------- | ---------- | -------- |

| Concentric Rectangle | Easy | [View Solution](./P-ConcentricRect) |
| Print Floyd's Triangle | Easy | [View Solution](./P-PrintFloydsTriangle) |
| Print Matrix Diagonal | Easy | [View Solution](./P-PrintMatrixDiagonal) |
| Print Rectangle Pattern | Easy | [View Solution](./P-PrintRectPattern) |
| Print X in Box | Easy | [View Solution](./P-PrintXInBox) |
| Star Triangle Pattern | Easy | |
| Right Triangle Pattern | Easy | |
| Inverted Triangle | Easy | |
| Hollow Rectangle | Easy | |
| Square Pattern | Easy | |
| Number Triangle | Easy | |
| Alphabet Triangle | Easy | |
| Plus Pattern | Easy | |
| Cross Pattern | Easy | |
| Simple Diamond | Easy | |
| Arrow Pattern | Easy | |
| Checkerboard Pattern | Easy | |
| Binary Pattern | Easy | |
| Multiplication Table Pattern | Easy | |
| Even-Odd Pattern | Easy | |

### Intermediate Patterns (Medium)

| Problem              | Difficulty | Solution |
| -------------------- | ---------- | -------- |
| Number Pyramid       | Medium     |          |
| Diamond Pattern      | Medium     |          |
| Pascal's Triangle    | Medium     |          |
| Butterfly Pattern    | Medium     |          |
| Zigzag Pattern       | Medium     |          |
| Spiral Matrix        | Medium     |          |
| Heart Pattern        | Medium     |          |
| Number Diamond       | Medium     |          |
| Alphabet Pattern     | Medium     |          |
| Hourglass Pattern    | Medium     |          |
| Rhombus Pattern      | Medium     |          |
| Wave Pattern         | Medium     |          |
| Hollow Diamond       | Medium     |          |
| Fibonacci Triangle   | Medium     |          |
| Prime Number Pattern | Medium     |          |
| Matrix Spiral        | Medium     |          |
| Sandglass Pattern    | Medium     |          |
| Hexagon Pattern      | Medium     |          |
| Star Diamond         | Medium     |          |
| Number Spiral        | Medium     |          |

### Advanced Patterns (Hard)

| Problem                 | Difficulty | Solution |
| ----------------------- | ---------- | -------- |
| Complex Fractal Pattern | Hard       |          |
| Sierpinski Triangle     | Hard       |          |
| Matrix Rotation Pattern | Hard       |          |
| Multi-layer Diamond     | Hard       |          |
| 3D Cube Pattern         | Hard       |          |
| Mandala Pattern         | Hard       |          |
| Celtic Knot Pattern     | Hard       |          |
| Maze Pattern            | Hard       |          |
| Tessellation Pattern    | Hard       |          |
| Golden Ratio Spiral     | Hard       |          |

### CodeChef Pattern Problems

| Problem                                                                         | Difficulty | Solution |
| ------------------------------------------------------------------------------- | ---------- | -------- |
| [CC — Pattern Printing (PATTERN)](https://www.codechef.com/problems/PATTERN)    | Easy       |          |
| [CC — Star Pattern (STARPTR)](https://www.codechef.com/problems/STARPTR)        | Easy       |          |
| [CC — Number Pattern (NUMPTR)](https://www.codechef.com/problems/NUMPTR)        | Medium     |          |
| [CC — Triangle Pattern (TRIPTR)](https://www.codechef.com/problems/TRIPTR)      | Medium     |          |
| [CC — Diamond Design (DIAMPTR)](https://www.codechef.com/problems/DIAMPTR)      | Medium     |          |
| [CC — Complex Pattern (COMPLXPTR)](https://www.codechef.com/problems/COMPLXPTR) | Hard       |          |

---

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
