---
id: dsa-sorting-radix-sort-readme
title: "Radix Sort"
slug: /DSA/sorting/radix-sort/README
sidebar_label: "Radix Sort"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Radix sort: sort one digit at a time

**Practice focus:** Trace ones and tens passes and explain why a stable pass preserves earlier digit work.

**Prerequisites:** integer division, arrays, and [stable counting sort](../counting-sort/README.md). A **digit** is one symbol in a number's representation. The **radix**, or base, is the number of possible digit values: decimal uses 10, from 0 through 9.

Suppose you need to order `[21, 13, 12]`. Sort by the ones digit first, getting `[21, 12, 13]`. Then sort by the tens digit while preserving the order of equal tens digits. The result is `[12, 13, 21]`. The earlier ones-digit work survives inside each tens-digit group.

Use least-significant-digit radix sort when integer keys have a manageable number of digits. Unlike comparison sorting, it uses the structure of each key. The digit count matters: it is not universally faster than `Array.sort` or merge sort.

<AlgorithmWalkthrough name="radixSort" />

## Complete decimal implementation

This teaching version accepts integers from 0 through 1,000,000,000 and returns a new array. Those bounds keep every digit calculation exact in `Number`. Negative numbers, decimals, strings, and larger integers need a different stated representation; do not silently pass them into this function.

```js runnable
function radixSort(values) {
  let maximum = 0;
  for (const value of values) {
    if (!Number.isInteger(value) || value < 0 || value > 1_000_000_000) {
      throw new RangeError('Expected integers from 0 through 1,000,000,000');
    }
    maximum = Math.max(maximum, value);
  }
  let result = [...values];
  for (let place = 1; place <= maximum; place *= 10) {
    const buckets = Array.from({ length: 10 }, () => []);
    for (const value of result) {
      const digit = Math.floor(value / place) % 10;
      buckets[digit].push(value); // Append: preserve order within equal digits.
    }
    result = [];
    for (const bucket of buckets) {
      for (const value of bucket) result.push(value);
    }
  }
  return result;
}

console.log(radixSort([21, 13, 12]).join(','));
console.log(radixSort([0, 100, 2, 10, 2]).join(','));
console.log(JSON.stringify(radixSort([])));
console.log(radixSort([0, 0]).join(','));
```

```text output
12,13,21
0,2,2,10,100
[]
0,0
```

`place = 1` selects ones, 10 selects tens, and 100 selects hundreds. Missing leading digits behave like zeros. `Array.from` creates ten **different** arrays; `new Array(10).fill([])` would put the same array reference in every bucket and corrupt the algorithm. The explicit maximum loop avoids a large `Math.max(...values)` argument list.

**Why it works.** After the first pass, values are ordered by their last digit. Assume a pass has ordered the last k digits. The next stable pass groups by digit k + 1 while preserving that lower-digit order inside each group. Thus the last k + 1 digits are ordered. Once all digits have been processed, the whole number is ordered.

For n values, d digits, and base b, time is O(d(n + b)) and extra space is O(n + b). Here b is 10 and d is at most 10. The empty and all-zero cases need no passes. Each pass must be stable: reversing a bucket can undo the lower-digit order.

## Checks and practice

1. **Check:** after the ones pass, why is `[21, 12, 13]` not yet fully sorted?
2. **Apply:** trace `[31, 11, 21]`. What happens if the tens pass reverses each equal-digit group in a larger example?
3. **Extend:** compare radix sort with counting sort for 100 integers scattered between 0 and a billion.

<details>
<summary>Hints</summary>

One pass only knows about one suffix of digits. Stability preserves earlier work. Compare ten buckets per pass with a counter for every possible full value.

</details>

<details>
<summary>Answers</summary>

1. It is ordered by ones digits 1, 2, 3, but 21 still exceeds both 12 and 13. More significant digits decide those comparisons.
2. The ones pass keeps `[31, 11, 21]`; the tens pass gives `[11, 21, 31]`. Reversing equal-digit groups can destroy the previously sorted lower digits, for example putting 13 before 12 in the tens-1 group.
3. Full-value counting sort would need about a billion counters. Decimal radix sort reuses ten buckets for at most ten passes. Comparison sorting is also a sensible choice for only 100 elements; asymptotic bounds alone do not determine the fastest implementation.

</details>

[Sorting overview](../README.md)

**Next:** [Sorting](../README.md).
