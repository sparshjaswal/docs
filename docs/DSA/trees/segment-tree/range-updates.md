---
title: "Range updates with lazy propagation"
sidebar_label: "Range updates"
---

# Range updates with lazy propagation

**Practice focus:** Apply a range addition to its summary now and defer child updates until a later descent needs them.

**Learn first:** [point-update segment trees](./README.md), [half-open ranges](../../assessments/README.md#notation-you-will-need), and [recursion](../../recursion/README.md). This is a stage 8 extension. Learn the simpler point-update tree before adding deferred work.

Imagine a row of accounts. You must repeatedly add a bonus to every balance in an interval and ask for an interval's total. Updating each balance individually costs O(k) for an interval of length k, or O(k log n) through individual segment-tree updates. A long interval is slow even though its total change is easy: **bonus × number of accounts**.

**Lazy propagation** records work that children still need, while updating the parent summary immediately. “Lazy” describes postponing unnecessary descent; queries still return current answers. It is useful for many interleaved range updates and range queries. If all updates happen before any queries, a [difference array](../../prefix-sum/README.md) can be simpler. If only points change, use the simpler tree.

## Two facts in each node

For a node representing `[left, right)`, store:

- `sum`: the current total for its entire interval, including additions applied at that node.
- `pending`: an addition already included in `sum` but not yet applied to its children.

A child may lag behind an ancestor's pending value. Before inspecting that child, **push** the value: apply it to both child summaries and tags, then clear the parent's tag. After partially updating children, **pull** their sums back into the parent.

For `[2, 4, 1, 3]`, add 5 to `[0, 4)`, then ask for `[1, 3)`:

```text
1. Before addition. Label: [range) sum / pending
                   [0,4) 10 / 0
                   /           \
         [0,2) 6 / 0          [2,4) 4 / 0

2. Full cover: update only the root
                   [0,4) 30 / 5
                   /           \
         [0,2) 6 / 0          [2,4) 4 / 0
         children still owe the parent's +5

3. Partial query: push root's +5 to both children
                   [0,4) 30 / 0
                   /           \
         [0,2) 16 / 5         [2,4) 14 / 5

4. Push each child's +5 before visiting individual leaves
   [0,1) 7   [1,2) 9   [2,3) 6   [3,4) 8
               |-----------|
              query [1,3): 9 + 6 = 15
```

The root increases by `5 * 4 = 20`. Each child increases by `5 * 2 = 10`. Step 4 chooses two disjoint leaves; the others do not contribute. This diagram shows sums; leaves have no children, so their pending additions need never be pushed further.

## Three overlap cases

An operation visits a node representing `[left, right)`:

1. **No overlap:** ignore the node; a sum query contributes 0.
2. **Full cover:** return its sum, or add `delta * (right - left)` to its sum and delta to its pending tag. Do not descend.
3. **Partial cover:** push any pending addition, visit both children, and after an update pull their new sum.

Two additions compose by addition: pending +3 followed by +5 is pending +8. Assignment is a different operation; “set to 3” followed by “add 5” is not interchangeable with the reverse order. This implementation intentionally supports addition only. Do not adapt it to assignment merely by renaming variables.

## Complete implementation

The public operations use zero-based half-open ranges, including an empty range. The tree accepts an empty input, whose only valid interval is `[0, 0)`. Values and deltas must be finite safe integers, and **every stored sum, pending sum, multiplication, and intermediate result must stay safe**. The class validates boundaries; the caller must establish numeric bounds. An input of length at most 200000, values/deltas of absolute value at most 100, and at most 10000 updates is one sufficient conservative bound.

```js runnable
class RangeAddSum {
  constructor(values) {
    this.length = values.length;
    this.sums = Array(Math.max(1, 4 * this.length)).fill(0);
    this.pending = Array(this.sums.length).fill(0);
    if (this.length > 0) this.build(1, 0, this.length, values);
  }

  build(node, left, right, values) {
    if (right - left === 1) {
      this.sums[node] = values[left];
      return;
    }
    const middle = Math.floor((left + right) / 2);
    this.build(node * 2, left, middle, values);
    this.build(node * 2 + 1, middle, right, values);
    this.pull(node);
  }

  pull(node) {
    this.sums[node] = this.sums[node * 2] + this.sums[node * 2 + 1];
  }

  apply(node, left, right, delta) {
    this.sums[node] += delta * (right - left);
    this.pending[node] += delta;
  }

  push(node, left, right) {
    if (this.pending[node] === 0 || right - left === 1) return;
    const middle = Math.floor((left + right) / 2);
    this.apply(node * 2, left, middle, this.pending[node]);
    this.apply(node * 2 + 1, middle, right, this.pending[node]);
    this.pending[node] = 0;
  }

  validateRange(from, to) {
    if (!Number.isInteger(from) || !Number.isInteger(to) ||
        from < 0 || to < from || to > this.length) {
      throw new RangeError('Expected 0 <= from <= to <= length');
    }
  }

  add(from, to, delta) {
    this.validateRange(from, to);
    if (from === to) return;
    this.update(1, 0, this.length, from, to, delta);
  }

  update(node, left, right, from, to, delta) {
    if (to <= left || right <= from) return;
    if (from <= left && right <= to) {
      this.apply(node, left, right, delta);
      return;
    }
    this.push(node, left, right);
    const middle = Math.floor((left + right) / 2);
    this.update(node * 2, left, middle, from, to, delta);
    this.update(node * 2 + 1, middle, right, from, to, delta);
    this.pull(node);
  }

  sum(from, to) {
    this.validateRange(from, to);
    if (from === to) return 0;
    return this.query(1, 0, this.length, from, to);
  }

  query(node, left, right, from, to) {
    if (to <= left || right <= from) return 0;
    if (from <= left && right <= to) return this.sums[node];
    this.push(node, left, right);
    const middle = Math.floor((left + right) / 2);
    return this.query(node * 2, left, middle, from, to) +
      this.query(node * 2 + 1, middle, right, from, to);
  }
}

const tree = new RangeAddSum([2, 4, 1, 3]);
tree.add(0, 4, 5);
console.log(tree.sum(1, 3));
tree.add(2, 4, -2);
console.log(tree.sum(0, 4));
console.log(tree.sum(3, 3));
console.log(new RangeAddSum([]).sum(0, 0));
```

```text output
15
26
0
0
```

`this` refers to the instance on which a method is called, such as `tree.sum(...)`. `new` creates an instance and runs the constructor. Methods like `update` and `push` are implementation helpers; call `add` and `sum` from outside. The constructor reads the input into summaries and never mutates its array.

After the first update the balances are `[7, 9, 6, 8]`. After the second they are `[7, 9, 4, 6]`, whose total is 26. Queries may move deferred work down the tree, but do not change these logical values.

## Why it is correct and fast

Build establishes the sum invariant at leaves, then at parents by adding disjoint child intervals. A full-cover addition increases every element once, so increasing the summary by delta times length is exact. Its tag records exactly the children's missing change. Pushing applies that change once to each child's disjoint interval and clears it at the parent, preserving the represented values. For a partial update, the recursive calls are correct on smaller intervals; pulling restores the parent's sum. A query adds disjoint covered intervals and excludes all uncovered intervals, so neither duplicates nor omits an element. Each descent shortens a non-leaf interval, proving termination.

A contiguous query or update has at most two partially covered nodes at each depth: the nodes containing its boundaries. Other visited nodes are fully covered or disjoint and stop immediately. The tree has O(log(n + 1)) depth, so each operation costs O(log(n + 1)), with O(1) empty-range handling. Construction takes O(n + 1) time and storage. Recursion uses O(log(n + 1)) live frames. This balanced recursion is shallow; it differs from following a linked chain of n nodes, which risks exhausting the JavaScript call stack.

## Mistakes to catch on paper

Forgetting the length multiplier gives the wrong sum for a multi-element interval. Forgetting to push before partial descent makes a child stale. Forgetting to clear a pushed tag applies the update twice. Pulling a parent before pushing its own outstanding tag overwrites a current sum with stale children. Using inclusive endpoints in one method and exclusive endpoints in another changes the set of affected values.

A three-element array exposes assumptions that n is a power of two. A full-range update followed by a point query exposes missing push logic. Two overlapping updates expose composition errors. Empty intervals expose termination errors. Compare a small random sequence against an ordinary array updated with a loop.

## Exercises, hints, and solutions

1. Trace `add(0, 3, 2)` then `add(1, 2, -1)` on `[1, 2, 3]`. Predict `sum(1, 3)`.
2. Why must `push` clear the parent's tag even though its sum does not change?
3. A contest supplies **inclusive, one-based** `[L, R]`. Translate it to this class's API.
4. Could the same tag update a range minimum? What changes and what stays the same?

<details>
<summary>Hints</summary>

Write the resulting three balances directly first. A tag represents work still owed, not a permanent history. Count the elements in each interval convention. Adding the same delta to every value moves the minimum by that delta.

</details>

<details>
<summary>Solutions</summary>

1. The balances become `[3, 3, 5]`; the answer is 8. The point update descends through the earlier full-range addition only after pushing it.
2. Children have now received the addition. Retaining the tag would apply it again on a future descent, even though the parent already counted it once.
3. Use `add(L - 1, R, delta)` or `sum(L - 1, R)`. Both interval descriptions have `R - L + 1` elements. Convert at the input boundary.
4. For a minimum tree, full coverage changes the summary by delta, not delta times length; pull uses `Math.min`; the no-overlap query identity is `Infinity`. Pending additions still compose by addition. The stored summary must match its operation; changing only the query is insufficient.

</details>

Return to [segment trees](./README.md) or attempt [assessment 8](../../assessments/README.md#8-count-out-of-order-pairs--combine-advanced-tools) before adding more advanced data structures.

**Next:** [Eight independent problem-solving assessments](../../assessments/README.md).
