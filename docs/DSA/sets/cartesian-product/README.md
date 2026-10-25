---
id: dsa-sets-cartesian-product-readme
title: "Cartesian Product"
slug: /DSA/sets/cartesian-product/README
sidebar_label: "Cartesian Product"
---

# Cartesian Product

**Read first:** [Array](../../Array/README.md).

**Practice focus:** Pair every color with every size and count the pairs before writing the nested loops.

The Cartesian product of two collections contains every ordered pair with one item from each collection. Use it when enumerating choices, such as every color and size of a shirt.

## Build every pair

| First collection | Second collection | Output pairs |
| --- | --- | --- |
| `red` | `small`, `large` | `(red, small)`, `(red, large)` |
| `blue` | `small`, `large` | `(blue, small)`, `(blue, large)` |

The first loop selects a color; the second loop restarts from the first size for each color. Every possible pair is visited exactly once for distinct input values.

```js runnable
function cartesianProduct(left, right) {
  const pairs = [];
  for (const first of left) {
    for (const second of right) pairs.push([first, second]);
  }
  return pairs;
}
console.log(JSON.stringify(cartesianProduct(['red', 'blue'], ['S', 'L'])));
console.log(cartesianProduct([], [1, 2]).length);
```

```text output
[["red","S"],["red","L"],["blue","S"],["blue","L"]]
0
```

## Cost and boundaries

Collections of sizes `m` and `n` produce `m × n` pairs: O(mn) time and O(mn) output space. A generator can yield one pair at a time to reduce retained memory, but cannot avoid the work of producing all pairs. If either input is empty, the result is empty.

This implementation accepts arrays. Repeated input values produce repeated pairs. Mathematical sets contain unique members, so deduplicate first if that is your contract. The pair `(red, S)` is ordered; reversing the inputs changes the pair structure.

## Check your understanding

Add a third collection with two materials. Two colors, two sizes, and two materials give eight triples. Explain how nested loops differ from pairing items at matching indices, which would miss combinations.

## References

[Wikipedia](https://en.wikipedia.org/wiki/Cartesian_product)

**Next:** [Combinations](../combinations/README.md).
