---
id: dsa-math-matrix-readme
title: "Matrices"
slug: /DSA/math/matrix/README
sidebar_label: "Matrices"
---

# Matrices

**Read first:** [Matrix](../../matrix/README.md).

**Practice focus:** Check matrix dimensions before addition, transposition, or multiplication; trace one output cell.

A matrix is a rectangular grid. A `2 × 3` matrix has two rows and three columns. In code, we use zero-based indices: `matrix[0][2]` is the first row's third value.

```text
                 column 0  column 1  column 2
row 0                 1         2         3
row 1                 4         5         6
```

## Operations on matrices

### Addition

Add matching positions. Both matrices must have the same number of rows and columns.

```text
A = [1  2]    B = [5  6]    A + B = [ 6   8]
    [3  4]        [7  8]            [10  12]
```

For example, the top-right result is `2 + 6 = 8`.

### Subtracting

Subtract matching positions. Order matters: `A − B` is different from `B − A`.

```text
A − B = [1−5  2−6] = [−4  −4]
        [3−7  4−8]   [−4  −4]
```

### Multiply by a Constant

Multiply **every** entry by the same number. For `2 × A`, the result is `[[2, 4], [6, 8]]`. The shape stays `2 × 2`.

### Multiplying by Another Matrix

Take a row from the first matrix and a column from the second. Multiply matching values and add the products. This is a **dot product**, not entry-by-entry multiplication.

```text
A × B = [1×5 + 2×7   1×6 + 2×8] = [19  22]
        [3×5 + 4×7   3×6 + 4×8]   [43  50]
```

The inner sizes must match: an `m × k` matrix can multiply a `k × n` matrix, producing an `m × n` result. In general, `A × B ≠ B × A`; the reverse product may not even be defined. The direct three-loop algorithm uses `O(mkn)` arithmetic operations.

### Transposing

Swap row and column positions: `transpose[c][r] = original[r][c]`.

```text
Original (2 × 3)       Transpose (3 × 2)
[1  2  3]              [1  4]
[4  5  6]              [2  5]
                       [3  6]
```

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| Add two matrices | Practice | Check: Reject different shapes; check each matching cell. | — |
| Transpose twice | Practice | Check: The result must equal the original matrix. | — |
| Multiply by an identity matrix | Practice | Check: The result must equal the original when dimensions match. | — |

## References

Continue with [matrix traversal](../../matrix/README.md). Reference: [matrix operations](https://www.mathsisfun.com/algebra/matrix-introduction.html).

**Next:** [Hill Cipher](../../cryptography/hill-cipher/README.md).
