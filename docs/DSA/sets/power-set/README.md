---
id: dsa-sets-power-set-readme
title: "Power Set"
slug: /DSA/sets/power-set/README
sidebar_label: "Power Set"
---

# Power Set

**Read first:** [Backtracking](../../backtracking/README.md).

**Practice focus:** Make an include-or-exclude choice for each distinct item and retain the empty subset.

The **power set** lists every subset: every possible choice of items, including choosing nothing and choosing everything. For a set S, the notation `P(S)` names this collection. Each distinct item gives two choices—include it or leave it out.

For example for `{x, y, z}`, the subsets
are:

```text
{
  {}, // (also denoted empty set ∅ or the null set)
  {x},
  {y},
  {z},
  {x, y},
  {x, z},
  {y, z},
  {x, y, z}
}
```

![A power set contains every subset, including the empty set and the complete original set.](https://www.mathsisfun.com/sets/images/power-set.svg)

Here is how we may illustrate the elements of the power set of the set `{x, y, z}` ordered with respect to
inclusion:

![Subsets of three items are grouped by size; links show how adding one item makes a larger subset.](https://upload.wikimedia.org/wikipedia/commons/e/ea/Hasse_diagram_of_powerset_of_3.svg)

**Number of Subsets**

If `S` is a finite set with `|S| = n` elements, then the number of subsets
of `S` is `|P(S)| = 2^n`. This fact, which is the motivation for the
notation `2^S`, may be demonstrated simply as follows:

> First, order the elements of `S` in any manner. We write any subset of `S` in
> the format `{γ1, γ2, ..., γn}` where `γi , 1 ≤ i ≤ n`, can take the value
> of `0` or `1`. If `γi = 1`, the `i`-th element of `S` is in the subset;
> otherwise, the `i`-th element is not in the subset. Clearly the number of
> distinct subsets that can be constructed this way is `2^n` as `γi ∈ {0, 1}`.

## Algorithms

### Bitwise Solution

Each number in binary representation in a range from `0` to `2^n` does exactly
what we need: it shows by its bits (`0` or `1`) whether to include related
element from the set or not. For example, for the set `{1, 2, 3}` the binary
number of `0b010` would mean that we need to include only `2` to the current set.

|     | `abc` |   Subset    |
| :-: | :---: | :---------: |
| `0` | `000` |    `{}`     |
| `1` | `001` |    `{c}`    |
| `2` | `010` |    `{b}`    |
| `3` | `011` |  `{c, b}`   |
| `4` | `100` |    `{a}`    |
| `5` | `101` |  `{a, c}`   |
| `6` | `110` |  `{a, b}`   |
| `7` | `111` | `{a, b, c}` |

> See [bwPowerSet.js](./bwPowerSet.js) file for bitwise solution.

### Backtracking Solution

In backtracking approach we're constantly trying to add next element of the set
to the subset, memorizing it and then removing it and try the same with the next
element.

> See [btPowerSet.js](./btPowerSet.js) file for backtracking solution.

### Cascading Solution

Start with the empty subset. For each new item, copy every existing subset and add that item to each copy. Keep the old subsets too: they represent the choice to leave the item out.

```js runnable
function powerSet(values) {
  const subsets = [[]];
  for (const value of new Set(values)) {
    const previousCount = subsets.length;
    for (let i = 0; i < previousCount; i++) {
      subsets.push([...subsets[i], value]);
    }
  }
  return subsets;
}

console.log(JSON.stringify(powerSet([1, 2, 3])));
console.log(JSON.stringify(powerSet([])));
```

```text output
[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
[[]]
```

`previousCount` freezes the number of subsets to extend. Without it, the loop would also extend newly added subsets and never finish for a nonempty input. `new Set(values)` treats repeated inputs as one set element, using JavaScript's Set equality rules.

| Item added | Subsets after this step |
| --- | --- |
| None | `[[]]` |
| 1 | `[[], [1]]` |
| 2 | `[[], [1], [2], [1, 2]]` |
| 3 | `[[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]` |

For n distinct items, there are 2ⁿ subsets. Copying their contents takes O(n × 2ⁿ) time and output space; the empty input still has one subset. Subsets are new arrays, but object elements are shared references. The input array is unchanged.

See [caPowerSet.js](./caPowerSet.js) for the separate source implementation.

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Power_set)
- [Math is Fun](https://www.mathsisfun.com/sets/power-set.html)

**Next:** [Combinations](../combinations/README.md).
