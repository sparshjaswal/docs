---
id: dsa-math-pascal-triangle-readme
title: "Pascal's Triangle"
slug: /DSA/math/pascal-triangle/README
sidebar_label: "Pascal's Triangle"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Pascal's triangle: each count comes from two smaller counts

**Practice focus:** Build each row from the previous row and connect one entry to choosing a group.

**Prerequisites:** arrays, nested loops, and [what a combination counts](../combinatorics/README.md). Pascal's triangle starts with 1. Each new row begins and ends with 1; every inside value is the sum of the two values immediately above it.

```text
row n                 values C(n, k), from k = 0 to k = n
  0                           1
  1                         1   1
  2                       1   2   1
  3                     1   3   3   1
  4                   1   4   6   4   1
                              ^
                    the two 3s above give 6
```

Row n contains `n + 1` entries. For example, `C(4, 2) = 6` counts ways to choose two people from four. Rows and positions start at zero; “four rows” ends at row 3, while “row 4” is the fifth row.

Use the triangle when a problem asks for binomial coefficients, when you need many nearby combination counts, or when only addition is allowed under a composite modulus. It also gives a gentle introduction to **dynamic programming**: store smaller answers and reuse them.

<AlgorithmWalkthrough name="pascal" />

## Why the addition rule counts correctly

Choose k people from n people and focus on one particular person. If that person is chosen, pick the remaining k - 1 people from n - 1. If not, pick all k from n - 1. These cases do not overlap and cover every team, so `C(n, k) = C(n - 1, k - 1) + C(n - 1, k)`. There is one way to choose nobody and one way to choose everyone, explaining the edge 1s.

## Complete exact implementation

The contract is a nonnegative safe integer `rowCount` small enough for the requested triangle to fit in memory. Entries use `BigInt` because combination counts quickly exceed the exact `Number` range. Every row is a separate array.

```js runnable
function pascalTriangle(rowCount) {
  if (!Number.isSafeInteger(rowCount) || rowCount < 0) {
    throw new RangeError('Expected a nonnegative safe row count');
  }
  const rows = [];
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const row = new Array(rowIndex + 1).fill(1n);
    for (let column = 1; column < rowIndex; column++) {
      row[column] = rows[rowIndex - 1][column - 1] + rows[rowIndex - 1][column];
    }
    rows.push(row);
  }
  return rows;
}

for (const row of pascalTriangle(5)) console.log(row.map(String).join(' '));
console.log(JSON.stringify(pascalTriangle(0)));
```

```text output
1
1 1
1 2 1
1 3 3 1
1 4 6 4 1
[]
```

To create row 4, begin `[1, 1, 1, 1, 1]`. Read row 3, `[1, 3, 3, 1]`, to fill the inside: `1 + 3 = 4`, `3 + 3 = 6`, `3 + 1 = 4`. Edges remain 1. The implementation follows the proved recurrence, and the previous row is complete before the next starts.

For r rows, time is O(r²) BigInt additions and output storage is O(r²) integer values. Larger entries need more bits, so these counts are not constant-cost bit bounds. If only the final row is needed, reuse O(r) values. Updating one array must run right to left so a still-needed previous-row value is not overwritten.

Another method computes a single row from `C(n, k) = C(n, k - 1) × (n - k + 1) / k` using O(n) arithmetic steps. The [combinatorics lesson](../combinatorics/README.md) explains exact multiplication-before-division and modular alternatives. Avoid ordinary division after applying a modulus; modular division needs an inverse.

## Checks and practice

1. **Check:** how many values appear in row 5? What are its first and last values?
2. **Apply:** create row 5 from row 4 without writing code.
3. **Extend:** why does adding every entry in row n give `2^n`?

<details>
<summary>Hints</summary>

Positions run from 0 through n. Add neighbors from the preceding row. Every subset independently includes or excludes each of n distinct objects.

</details>

<details>
<summary>Answers</summary>

1. Six values; both edge values are 1.
2. `[1, 5, 10, 10, 5, 1]`.
3. Row n counts subsets by their size, covering sizes 0 through n exactly once. There are two choices for each object's membership, so altogether there are `2^n` subsets.

</details>

[Math learning order](../README.md)

**Next:** [Integer Partition](../integer-partition/README.md).
