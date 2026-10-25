---
id: dsa-trees-segment-tree-readme
title: "Segment Tree"
slug: /DSA/trees/segment-tree/README
sidebar_label: "Segment Tree"
---

# Segment Tree

**Prerequisites:** arrays, [binary trees](../README.md), [prefix sums](../../prefix-sum/README.md), and half-open ranges `[left, right)`. A segment tree stores answers for ranges of an array. Each parent combines the answers from its two child ranges. Use it when values change and you need repeated range queries, such as a sum or minimum.

For `[2, 4, 1, 3]`, the root stores sum 10. Its left child stores `2 + 4 = 6`, and its right child stores `1 + 3 = 4`. Changing 4 to 5 updates that leaf and its ancestors; unrelated ranges stay the same.

Building takes O(n) time and O(n) space. A point update or a range query takes O(log n) with a constant-time associative combine operation. **Associative** means grouping does not change the answer: `(a + b) + c = a + (b + c)`.

```text
Values: [2, 4, 1, 3]             Each label is [range): sum

                    [0,4): 10
                    /        \
              [0,2): 6      [2,4): 4
               /    \         /    \
         [0,1):2  [1,2):4 [2,3):1  [3,4):3

set(1, 5) repairs: [1,2): 5 --> [0,2): 7 --> [0,4): 11
```

Only the leaf for index 1 and its ancestors contain that index, so only those summaries change. To query `[1, 4)`, combine `[1, 2)` with `[2, 4)`; do not include `[0, 1)`. Each chosen segment is wholly inside the requested interval, and together they cover it without overlap.

For a static array, prefix sums are simpler and give O(1) sum queries. When point values change, a Fenwick tree is compact for sums. Choose a segment tree when you need a more general associative operation, such as minimum, or will later need carefully designed range updates. The runnable implementation here teaches **point replacement and range sum**; continue to [range updates with lazy propagation](./range-updates.md) for a complete addition-and-sum implementation, proof, state diagrams, and exercises.

## Learning steps

A changing score table may ask for sums or minimum scores in many ranges. Store summaries of small ranges and combine them.

1. Label each node with the range it summarizes.
2. Replace one value and repair only its ancestors.
3. Combine nonoverlapping query pieces before moving to range updates.

## Worked examples and answers {/* #workbook-practice */}

Attempt the linked [Practice Problems](#practice-problems) before opening their answers. See the [workbook guide](../../../javascript/workbook.md) for the A–C exercise format.

### 49. Segment trees and range aggregation {/* #workbook-49 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** combine complete range pieces and repair only changed ancestors.

Use the tree diagram above to locate leaves, parents, and query pieces. The code specializes to sums, rounds leaf capacity up to a power of two, and fills spare leaves with zero. Capacity stays below twice n for nonempty input, so storage is O(n).

Zero is the **identity** for sums: adding it changes nothing. Minimum queries instead use Infinity. The combining rule must be **associative**, meaning regrouping does not change the result. It need not be commutative: joining strings preserves grouping but not reversed order. An order-sensitive query needs separate left and right accumulators.

The half-open query excludes its right endpoint. At each level, take a left boundary piece if it is a right child, and take a right boundary piece after moving the boundary left when needed. Then move to parents. These pieces cover the query without overlap. Validate indices before accessing storage; the example uses arithmetic division for parents instead of 32-bit shifts.

[Lazy range updates](./range-updates.md) need an extra rule: a pending addition d over L values changes their sum by d × L. Additions combine by addition; mixing assignment and addition requires preserving their order. Learn point replacement first, then use the separate range-update lesson for the complete implementation.

**Worked example**

```js runnable
class SegmentSum {
  constructor(values) {
    if (!values.every(Number.isSafeInteger)) throw new RangeError('Expected safe integer values');
    this.n = values.length;
    this.size = 1;
    while (this.size < this.n) this.size *= 2;
    this.tree = Array(this.size * 2).fill(0);
    values.forEach((value, i) => { this.tree[this.size + i] = value; });
    for (let i = this.size - 1; i > 0; i--) {
      this.tree[i] = this.tree[i * 2] + this.tree[i * 2 + 1];
    }
  }
  set(index, value) {
    if (!Number.isSafeInteger(value)) throw new RangeError('Expected a safe integer value');
    if (!Number.isInteger(index) || index < 0 || index >= this.n) {
      throw new RangeError("Invalid index");
    }
    let i = this.size + index;
    this.tree[i] = value;
    while (i > 1) {
      i = Math.floor(i / 2);
      this.tree[i] = this.tree[i * 2] + this.tree[i * 2 + 1];
    }
  }
  sum(left, right) {
    if (!Number.isInteger(left) || !Number.isInteger(right) ||
        left < 0 || left > right || right > this.n) {
      throw new RangeError("Invalid range");
    }
    let result = 0;
    left += this.size;
    right += this.size;
    while (left < right) {
      if (left % 2 === 1) result += this.tree[left++];
      if (right % 2 === 1) result += this.tree[--right];
      left = Math.floor(left / 2);
      right = Math.floor(right / 2);
    }
    return result;
  }
}
const segments = new SegmentSum([2, 5, 1, 4]);
console.log(segments.sum(1, 4));
segments.set(2, 10);
console.log(segments.sum(1, 4));
console.log(segments.sum(2, 2));
console.log(new SegmentSum([]).sum(0, 0));
```

```text output
10
19
0
0
```

**Why the example works**

The first query sums `5 + 1 + 4`. With capacity 4, the leaves occupy internal positions 4 through 7. Query `[1, 4)` starts with boundaries 5 and 8: include leaf 5, move upward, and then include node 3 for original positions 2 and 3. The selected segments cover exactly the requested range. Replacing index 2 changes its leaf and ancestors, then the second query returns `5 + 10 + 4`.

**Why it works.** The build establishes that every parent equals the sum of its children's ranges. Updating a leaf recomputes exactly the ancestors whose ranges contain it, preserving that invariant. During a query, the accumulated answer covers already selected pieces, and the two boundaries enclose everything still needed. Taking boundary pieces before moving upward preserves this partition without gaps or overlaps. When the boundaries meet, no requested value remains unaccounted for. Unused padded leaves contain zero, the sum identity, so they cannot alter an answer.

Building and storage take O(n) for nonempty input. Each query visits at most two boundary pieces per level, and each update follows one ancestor path, so both take O(log n) time with O(1) working space. Empty input uses a constant-size zero tree and answers `[0, 0)` with zero; it has no valid update index. A one-item tree handles its update without entering the ancestor loop.

This integer example requires every tree total, intermediate query sum, and answer to remain a safe Number integer. Safe input values alone do not guarantee safe sums. Floating-point addition is not perfectly associative, so do not silently generalize the exact-integer reasoning to arbitrary decimals. Use a BigInt-valued variant when constraints require larger exact sums.

Common mistakes are mixing inclusive and half-open endpoints, using a non-associative combination such as subtraction, modifying only the leaf during an update, or assuming this point-update API already implements lazy range updates. Always re-evaluate the invariant when changing the stored summary or update type.

</details>

Find **49A–C** in the [Practice Problems](#practice-problems) table.

<details>
<summary>Hints for 49A–C</summary>

A: the same interval can be grouped using different tree boundaries. B: adding 3 to four values changes their sum by 12, and children must eventually learn about it. C: build once, apply each point replacement, then query `[0, values.length)`.

</details>

<details id="workbook-49-answer">
<summary>Check your reasoning and answer</summary>

For Node checks, add `import assert from "node:assert/strict";` at the top of your file. Browser and multi-file examples use the setup stated above.

**49A.** The tree groups adjacent values into different segment boundaries. Associativity guarantees that these regroupings produce the same result as combining the original sequence.

**49B.** It needs the affected segment length to adjust the sum and a pending tag to remember work owed to children. Correctly composing tags is part of the data structure's invariant.

**49C.** Build once, perform each replacement in logarithmic time, then query the full half-open interval. The source array stays unchanged because the tree copied its values into leaves.

**Reference code**

Use the worked example above first if the answer calls its functions or classes. Run each lesson in its own `.mjs` file.

```js
function totalAfterUpdates(values, updates) {
  const tree = new SegmentSum(values);
  for (const [index, value] of updates) tree.set(index, value);
  return tree.sum(0, values.length);
}
```

**Check the result**

```js
assert.equal(totalAfterUpdates([1, 2, 3], [[1, 10], [0, -1]]), 12);
assert.equal(totalAfterUpdates([], []), 0);
assert.equal(new SegmentSum([2]).sum(0, 0), 0);
assert.throws(() => new SegmentSum([2]).sum(0, 2));
```

</details>

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **49A — Why must the combination be associative?** | **Must fix** | [Worked example](#workbook-49) | [Answer](#workbook-49-answer) |
| **49B — What extra information does a lazy range-sum update need?** | **Must fix** | [Worked example](#workbook-49) | [Answer](#workbook-49-answer) |
| **49C — Write totalAfterUpdates(values, updates). Apply valid [index, value] replacements and return the full sum using SegmentSum.** | **Must fix** | [Worked example](#workbook-49) | [Answer](#workbook-49-answer) |
| [LC 218 — The Skyline Problem](https://leetcode.com/problems/the-skyline-problem/) | Hard | [LeetCode](https://leetcode.com/problems/the-skyline-problem/) | — |
| [LC 732 — My Calendar III](https://leetcode.com/problems/my-calendar-iii/) | Hard | [LeetCode](https://leetcode.com/problems/my-calendar-iii/) | — |
| [LC 850 — Rectangle Area II](https://leetcode.com/problems/rectangle-area-ii/) | Hard | [LeetCode](https://leetcode.com/problems/rectangle-area-ii/) | — |

{/* END GENERATED PRACTICE PROBLEMS */}

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Segment_tree)
- [YouTube](https://www.youtube.com/watch?v=ZBHKZF5w4YU&index=65&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [GeeksForGeeks](https://www.geeksforgeeks.org/segment-tree-set-1-sum-of-given-range/)

**Next:** [lazy range updates](./range-updates.md).
