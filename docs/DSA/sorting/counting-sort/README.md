---
id: dsa-sorting-counting-sort-readme
title: "Counting Sort"
slug: /DSA/sorting/counting-sort/README
sidebar_label: "Counting Sort"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Counting sort: make one place for each key

**Practice focus:** Count keys in a small range, then place records while preserving the order of ties.

**Prerequisites:** arrays, prefix sums, and [sorting stability](../README.md). A **key** is the value used to decide order. If test scores lie between 0 and 100, count how many students have each score instead of comparing every pair of students.

Counting sort is useful when keys are integers in a **small known range**. It spends time proportional to the number of items plus the range size. Two values such as 1 and a billion do not justify a billion counters; use comparison sorting for a huge sparse range.

## From frequencies to positions

For keys `[2, 1, 2, 0]`, frequencies are `[1, 1, 2]`: one zero, one one, two twos. Cumulative counts are `[1, 2, 4]`. These are exclusive end positions: the zeros end just before position 1, the ones before 2, and the twos before 4.

<AlgorithmWalkthrough name="countingSort" />

To preserve the order of equal keys, scan the original input **right to left**. Decrease that key's end position, then put the item there. The later equal item takes the later position, leaving the earlier position for the earlier item. This property is called **stability**.

## Complete stable implementation

The function returns a new outer array and retains the original record objects. Keys must be integers within the supplied inclusive range; `keyOf` must return the same key every time it is called. The range must fit available memory. A negative key works by shifting its bucket index by `minimum`.

```js runnable
function countingSortByKey(items, keyOf, minimum, maximum) {
  if (!Number.isSafeInteger(minimum) || !Number.isSafeInteger(maximum) || maximum < minimum) {
    throw new RangeError('Expected a valid safe integer range');
  }
  const range = maximum - minimum + 1;
  const ends = new Array(range).fill(0);
  for (const item of items) {
    const key = keyOf(item);
    if (!Number.isSafeInteger(key) || key < minimum || key > maximum) {
      throw new RangeError('Key lies outside the supplied range');
    }
    ends[key - minimum]++;
  }
  for (let bucket = 1; bucket < range; bucket++) ends[bucket] += ends[bucket - 1];
  const result = new Array(items.length);
  for (let index = items.length - 1; index >= 0; index--) {
    const item = items[index];
    const bucket = keyOf(item) - minimum;
    result[--ends[bucket]] = item;
  }
  return result;
}

const records = [
  { name: 'Ana', score: 2 },
  { name: 'Bo', score: 1 },
  { name: 'Cy', score: 2 },
  { name: 'Dee', score: 0 },
];
const sorted = countingSortByKey(records, item => item.score, 0, 2);
console.log(sorted.map(item => item.name).join(','));
console.log(countingSortByKey([-1, 2, -1, 0], value => value, -1, 2).join(','));
console.log(JSON.stringify(countingSortByKey([], value => value, 0, 2)));
```

```text output
Dee,Bo,Ana,Cy
-1,-1,0,2
[]
```

For the records, Dee goes to position 0, Cy to 3, Bo to 1, and Ana to 2. Ana stays before Cy because Ana appeared first among score-2 records. Simply expanding frequencies suffices for plain integers, but would lose the attached names.

**Why it works.** Cumulative counts allocate a separate interval of the right size to every key, in increasing key order. Each placement consumes one free position from its key's interval. All items are placed exactly once, and items with equal keys retain their order by the right-to-left argument.

With n items and range k, time is O(n + k) and extra space is O(n + k), assuming constant-time key extraction. Common mistakes are allocating by the maximum instead of the range, forgetting the minimum offset, reversing the stability scan, and using counting sort when the range is too large.

## Checks and practice

1. **Check:** why does `--ends[bucket]` happen before assignment?
2. **Apply:** trace records with keys `[1, 1, 0]`. Label the first two A and B to check stability.
3. **Extend:** if only integers are stored and stability of records is irrelevant, how could you write values back into the input using the frequency counts?

<details>
<summary>Hints</summary>

The cumulative count is an exclusive end. Track the equal records' relative positions. A frequency tells you how many copies to write.

</details>

<details>
<summary>Answers</summary>

1. A key ending at position 4 owns positions up to 3, so its first free slot is one less than the exclusive end.
2. Input `[1A, 1B, 0]` becomes `[0, 1A, 1B]`; scanning backward places B later than A.
3. Iterate buckets from small to large and write `bucket + minimum` exactly `count[bucket]` times. This uses O(k) extra space but cannot reconstruct attached records from counts alone.

</details>

[Next: radix sort](../radix-sort/README.md) · [Sorting overview](../README.md)

**Next:** [Radix sort: sort one digit at a time](../radix-sort/README.md).
