---
id: dsa-trees-fenwick-tree-readme
title: "Fenwick Tree / Binary Indexed Tree"
slug: /DSA/trees/fenwick-tree/README
sidebar_label: "Fenwick Tree"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Fenwick Tree / Binary Indexed Tree

**Prerequisites:** arrays, [prefix sums](../../prefix-sum/README.md), and [bit operations](../../bit-manipulation/README.md), including JavaScript's signed 32-bit conversion. A **Fenwick tree**, also called a binary indexed tree, stores partial sums. It supports two useful operations in O(log n) time: add a change to one value, and find the total from the start through a position.

A normal prefix-sum array gives fast queries, but changing one value can require rebuilding many totals. A Fenwick tree stores overlapping ranges so only a few totals change.

For values `[1, 2, 3, 4]`, its one-based storage is:

| Internal index | Range it stores | Total |
| --- | --- | --- |
| 1 | position 1 | 1 |
| 2 | positions 1–2 | 3 |
| 3 | position 3 | 3 |
| 4 | positions 1–4 | 10 |

To query the first three values, add the totals at indices 3 and 2: `3 + 3 = 6`. The rule `i -= i & -i` finds the next needed range. To update internal position 3 by +2, update indices 3 and 4 using `i += i & -i`.

```text
Position:    1   2   3   4
Value:      [1] [2] [3] [4]
tree[1]:    [1]
tree[2]:    [1---2]
tree[3]:            [3]
tree[4]:    [1-----------4]

Prefix through 3 = block [1..2] + block [3..3]
                =       3      +      3      = 6
```

Each outline is the range summarized by one stored total. A prefix query chooses nonoverlapping outlines that together cover exactly the requested prefix. An update visits the outlines containing the changed position.

## Learning steps

A score table needs both score corrections and totals up to a chosen row. Updating every later prefix total would repeat too much work.

1. Read the stored blocks and trace a prefix query.
2. Separate zero-based public positions from one-based internal indices.
3. Add a change to the affected blocks and test against direct summation.

## Implementation Notes

The internal array has n + 1 slots. Slot 0 is unused; slots 1 through n hold the block totals. Public methods below still use ordinary zero-based positions, so convert at the boundary instead of mixing the two index systems.

The query shown above follows `3 → 2 → 0`; zero is the stopping position, not another stored block.

Use the controls below to follow one update and see which stored ranges change.

<AlgorithmWalkthrough name="fenwickUpdate" />

## Worked examples and answers {/* #workbook-practice */}

Attempt the linked [Practice Problems](#practice-problems) before opening their answers. See the [workbook guide](../../../javascript/workbook.md) for the A–C exercise format.

### 48. Fenwick trees and changing prefix sums {/* #workbook-48 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** update one value and answer sums without rebuilding every later prefix.

Use the block diagram above for the storage idea. `tree[i]` covers a block ending at internal index i. Its length is the value of i’s **lowest set bit**, the rightmost 1 in binary. For 6 (`110`), that value is 2, so the block covers internal positions 5 and 6.

Under the documented 32-bit bounds, `i & -i` extracts that bit: `0110 & 1010 = 0010`. Querying subtracts this value to reach the previous uncovered block; updating adds it to reach a larger containing block. The omitted leading bits are zeros for 6 and ones for −6.

The public interface is different from the internal storage: `add(index, delta)` uses a zero-based position, `sum(end)` covers positions before end, and `range(left, right)` excludes right. Delta is a change, not a replacement; setting a value needs `newValue - oldValue`.

For `[2, 5, 1, 4]`, querying the first three values visits internal positions 3 and 2, giving `1 + 7 = 8`. Updating public position 1 visits internal positions 2 and 4. The code limits logical size to 2³⁰−1 and assumes much smaller practical allocations and safe-integer sums. Building with n updates takes O(n log n); a specialized build can take O(n).

**Worked example**

```js runnable
class Fenwick {
  constructor(n) {
    if (!Number.isInteger(n) || n < 0 || n > 2 ** 30 - 1) {
      throw new RangeError("Invalid size");
    }
    this.n = n;
    this.tree = Array(n + 1).fill(0);
  }
  add(index, delta) {
    if (!Number.isSafeInteger(delta)) throw new RangeError('Expected a safe integer delta');
    if (!Number.isInteger(index) || index < 0 || index >= this.n) {
      throw new RangeError("Invalid index");
    }
    for (let i = index + 1; i <= this.n; i += i & -i) {
      this.tree[i] += delta;
    }
  }
  sum(end) {
    if (!Number.isInteger(end) || end < 0 || end > this.n) {
      throw new RangeError("Invalid endpoint");
    }
    let total = 0;
    for (let i = end; i > 0; i -= i & -i) total += this.tree[i];
    return total;
  }
  range(left, right) {
    if (left > right) throw new RangeError("Reversed range");
    return this.sum(right) - this.sum(left);
  }
}
const sums = new Fenwick(4);
[2, 5, 1, 4].forEach((value, i) => sums.add(i, value));
console.log(sums.range(1, 3));
sums.add(1, 2);
console.log(sums.range(1, 3));
console.log(sums.range(2, 2));
console.log(new Fenwick(0).sum(0));
```

```text output
6
8
0
0
```

**Why the example works**

The initial half-open range `[1, 3)` contains 5 and 1. Adding 2 at index 1 changes 5 into 7, so that range becomes 8. Public index 1 becomes internal index 2, so the update changes `tree[2]` and `tree[4]` and no other blocks.

**Why it works.** The invariant is that every stored block equals the sum of its represented original positions. Adding a delta to exactly the blocks containing its position preserves that invariant. A prefix query removes its final block at each step; the chosen blocks do not overlap and leave no gap. Subtracting two prefix sums then cancels exactly the positions before the requested range.

Removing a lowest set bit advances past one binary contribution, so a prefix query takes at most O(log n) iterations. Updates move through at most O(log n) containing blocks. Construction here is O(n) for zeros, plus O(n log n) if initialized with n calls to `add`; storage is O(n). Each operation uses O(1) working space.

The integer version requires every stored total, intermediate query sum, and returned result to remain a safe integer. Checking the input delta alone does not guarantee that accumulated sums remain exact. Negative values and negative deltas are allowed. Use a consistent BigInt-valued variant when constraints exceed this range, while keeping indexes as Number values. Empty ranges return zero, including `new Fenwick(0).sum(0)`; updating an empty structure is invalid.

Common mistakes are treating the right endpoint as inclusive, forgetting the public-to-internal `+1`, using `add` as if it replaced a value, or calling the update loop at internal index zero. At zero, `i & -i` is zero and the loop would never advance.

</details>

Find **48A–C** in the [Practice Problems](#practice-problems) table.

<details>
<summary>Hints for 48A–C</summary>

A: evaluate `0 & -0` and ask whether adding it advances an index. B: compare “add 3” with “become 3.” C: a one-item range gives the old value; calculate the difference before updating.

</details>

<details id="workbook-48-answer">
<summary>Check your reasoning and answer</summary>

For Node checks, add `import assert from "node:assert/strict";` at the top of your file. Browser and multi-file examples use the setup stated above.

**48A.** The lowest-set-bit walk needs a positive index. At zero, i &amp; -i is zero, so an update would make no progress. Translating a zero-based external index by one avoids that trap.

**48B.** add changes the current value by a delta. set replaces the value and therefore requires knowing the difference between the new and old values.

**48C.** A one-element half-open range recovers the current value. Subtract it from the requested replacement and add the difference. Two logarithmic operations still take O(log n).

**Reference code**

Use the worked example above first if the answer calls its functions or classes. Run each lesson in its own `.mjs` file.

```js
function setFenwick(tree, index, value) {
  const current = tree.range(index, index + 1);
  tree.add(index, value - current);
}
```

**Check the result**

```js
setFenwick(sums, 1, 0);
assert.equal(sums.range(1, 3), 1);
assert.equal(sums.range(2, 2), 0);
assert.equal(new Fenwick(0).sum(0), 0);
assert.throws(() => sums.add(-1, 3));
```

</details>

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **48A — Why are internal indexes one-based?** | **Must fix** | [Worked example](#workbook-48) | [Answer](#workbook-48-answer) |
| **48B — What is the difference between add and set?** | **Must fix** | [Worked example](#workbook-48) | [Answer](#workbook-48-answer) |
| **48C — Write setFenwick(tree, index, value), using the existing point range sum to compute a delta.** | **Must fix** | [Worked example](#workbook-48) | [Answer](#workbook-48-answer) |
| [LC 307 — Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/) | Medium | [LeetCode](https://leetcode.com/problems/range-sum-query-mutable/) | — |
| [LC 308 — Range Sum Query 2D - Mutable](https://leetcode.com/problems/range-sum-query-2d-mutable/) | Medium · Premium | [LeetCode](https://leetcode.com/problems/range-sum-query-2d-mutable/) | — |
| [LC 315 — Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/) | Hard | [LeetCode](https://leetcode.com/problems/count-of-smaller-numbers-after-self/) | — |
| [LC 327 — Count of Range Sum](https://leetcode.com/problems/count-of-range-sum/) | Hard | [LeetCode](https://leetcode.com/problems/count-of-range-sum/) | — |
| [LC 1649 — Create Sorted Array through Instructions](https://leetcode.com/problems/create-sorted-array-through-instructions/) | Hard | [LeetCode](https://leetcode.com/problems/create-sorted-array-through-instructions/) | — |

{/* END GENERATED PRACTICE PROBLEMS */}

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Fenwick_tree)
- [GeeksForGeeks](https://www.geeksforgeeks.org/binary-indexed-tree-or-fenwick-tree-2/)
- [YouTube](https://www.youtube.com/watch?v=CWDQJGaN1gY&index=18&t=0s&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

**Next:** [segment trees](../segment-tree/README.md).
