---
id: dsa-array-readme
title: "Array"
slug: /DSA/Array/README
sidebar_label: "Arrays"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Array

An array keeps values in numbered positions. The numbering starts at 0: in `[10, 20, 30]`, index 1 holds 20. Use an array when the order matters or you need to read a known position quickly.

In the usual array model, reading one position takes O(1) time. Inserting near the start takes O(n) because later values must move. Appending to a dynamic array is O(1) on average over many appends; an occasional resize copies the existing values.

JavaScript arrays can grow, contain different value types, and have empty slots. Their storage depends on the engine. The estimates here use the usual indexed-array model.

<AlgorithmWalkthrough name="array" />

## Learning steps

A row of daily temperatures is an array. A position tells you which day; the stored value tells you its temperature.

1. Read and change one numbered position.
2. Insert or remove a value and trace which later values move.
3. Compare a full scan with searching an already sorted array.

## JavaScript for Basic Operations {/* #pseudocode-for-basic-operations */}

These examples use ordinary JavaScript arrays with no empty slots. Insert, update, and delete operations change the original array. JavaScript manages storage growth for us.

### Access and Update

Use an integer index from 0 through `length - 1` to read or update an existing item. Reading an index outside the array returns `undefined`; assigning beyond the end grows the array and can create empty slots.

```js runnable
const values = [10, 20, 30];
console.log(values[1]);
values[1] = 25;
console.log(JSON.stringify(values));
```

```text output
20
[10,25,30]
```

### Insert

`push` appends at the end. To insert elsewhere, move items one position right, starting at the end so no value is overwritten. An insertion index may equal `length`. Prepending means inserting at index 0.

```js runnable
function append(values, value) {
  values.push(value);
}

function insertAt(values, index, value) {
  if (!Number.isInteger(index) || index < 0 || index > values.length) {
    throw new RangeError('Insertion index is outside the array');
  }
  for (let i = values.length; i > index; i--) {
    values[i] = values[i - 1];
  }
  values[index] = value;
}

function prepend(values, value) {
  insertAt(values, 0, value);
}

const values = [20, 40];
append(values, 50);
insertAt(values, 1, 30);
prepend(values, 10);
console.log(JSON.stringify(values));
```

```text output
[10,20,30,40,50]
```

In application code, `values.splice(index, 0, value)` performs the insertion after you validate the index. The loop above shows the shifts behind the O(n) cost.

### Search

Linear search works even when values are unsorted. This example uses strict equality (`===`), so objects match by reference and `NaN` does not match itself.

```js runnable
function contains(values, target) {
  for (const value of values) {
    if (value === target) return true;
  }
  return false;
}

console.log(contains([30, 10, 20], 10));
console.log(contains([], 10));
```

```text output
true
false
```

Binary search requires numbers sorted in ascending order, with no `NaN` values. It returns a matching index or `-1`; when values repeat, it may return any matching position.

```js runnable
function binarySearch(values, target) {
  let left = 0;
  let right = values.length - 1;
  while (left <= right) {
    const middle = left + Math.floor((right - left) / 2);
    if (values[middle] === target) return middle;
    if (values[middle] < target) left = middle + 1;
    else right = middle - 1;
  }
  return -1;
}

console.log(binarySearch([10, 20, 30, 40], 30));
console.log(binarySearch([10, 20, 30, 40], 25));
```

```text output
2
-1
```

### Delete

Move later values left, then shorten the array. `removeAt` returns the removed value and rejects invalid indices. `removeValue` removes only the first matching value and returns whether it found one. Its `indexOf` search uses strict equality and also works on unsorted arrays.

```js runnable
function removeAt(values, index) {
  if (!Number.isInteger(index) || index < 0 || index >= values.length) {
    throw new RangeError('Removal index is outside the array');
  }
  const removed = values[index];
  for (let i = index; i < values.length - 1; i++) {
    values[i] = values[i + 1];
  }
  values.length--;
  return removed;
}

function removeValue(values, target) {
  const index = values.indexOf(target);
  if (index === -1) return false;
  removeAt(values, index);
  return true;
}

const values = [30, 10, 30, 20];
console.log(removeValue(values, 30));
console.log(removeAt(values, 1));
console.log(JSON.stringify(values));
console.log(removeValue(values, 99));
```

```text output
true
30
[10,20]
false
```

### Traverse

A generator yields one value at a time. Iteration over an empty array produces no values.

```js runnable
function* traverse(values) {
  for (let i = 0; i < values.length; i++) {
    yield values[i];
  }
}

console.log([...traverse([10, 20, 30])].join(','));
```

```text output
10,20,30
```

### Traverse in Reverse

Start at the last index and move toward 0. This reads the array without reversing or copying it; the spread in the demonstration collects the yielded values into a separate array.

```js runnable
function* reverseTraverse(values) {
  for (let i = values.length - 1; i >= 0; i--) {
    yield values[i];
  }
}

console.log([...reverseTraverse([10, 20, 30])].join(','));
```

```text output
30,20,10
```

## Complexities

### Time Complexity

| Access |      Search      | Insertion | Deletion |
| :----: | :--------------: | :-------: | :------: |
|  O(1)  | O(n) [O(log n)*] |   O(n)    |   O(n)   |

Notes:

- Append on a dynamic array is amortized O(1) due to geometric resizing.
- [O(log n)*] applies to BinarySearch on a sorted array.

### Space Complexity

O(n) to store n elements. Dynamic arrays may over-allocate capacity (up to O(n)) to support amortized O(1) append.

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| <PracticeProblem id={121} title={"Best Time to Buy and Sell Stock"} text={"Problem statement\nprices[i] is a stock's price on day i. You may buy one share on one day and sell it on a strictly later\nday, or make no transaction. Return the largest possible profit from at most one purchase and sale.\nIf every possible sale loses money, return 0.\nInput \u0026 expected result\nReturn a profit amount, not the trading days. A sale cannot precede its purchase, so subtracting\nthe global minimum from the global maximum is invalid if those days occur in the wrong order.\nEXAMPLE 1\nInput: prices = [8,3,6,2,7]\nOutput: 5, by buying at 2 and selling at 7\nExplanation: Buying on the day priced at 2 and selling later at 7 yields 5, more than any other\nvalid single trade.\nEXAMPLE 2\nInput: prices = [9,6,3]\nOutput: 0\nExplanation: Prices only fall. Making no transaction is better than accepting a loss.\nConstraints \u0026 guarantees\n• prices.length: 1 through 10^5 (inclusive)\n• prices[i]: 0 through 10^4 (inclusive)\nJavaScript starter\nfunction maxProfit(prices) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) | [Example](./LC-121-Best-Time-to-Buy-and-Sell-Stock/index.mdx) |
| <PracticeProblem id={228} title={"Summary Ranges"} text={"Problem statement\nnums is a sorted array with no repeated integers. Summarize it using the smallest sequence of\nranges that covers exactly its values. Consecutive integers share a range. Format a multi-value\nrange as \"a-\u003eb\" and an isolated value as \"a\". Return the strings in ascending order; an empty input\nproduces an empty result.\nInput \u0026 expected result\nEvery value must be covered once, and the ranges must not introduce values absent from nums. A\nsingle missing integer separates two ranges, even if the gap is small.\nEXAMPLE 1\nInput: nums = [-2,-1,0,3,5,6]\nOutput: [\"-2-\u003e0\",\"3\",\"5-\u003e6\"]\nExplanation: The first three values are consecutive, 3 is isolated, and 5 and 6 form the final run.\nEXAMPLE 2\nInput: nums = []\nOutput: []\nExplanation: An empty input needs no covering ranges.\nConstraints \u0026 guarantees\n• nums.length: 0 through 20 (inclusive)\n• nums[i]: -2^31 through 2^31 - 1 (inclusive)\n• Values are distinct and in increasing order\nJavaScript starter\nfunction summaryRanges(nums) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/summary-ranges/) | — |
| <PracticeProblem id={57} title={"Insert Interval"} text={"Problem statement\nintervals is sorted by start time and contains nonoverlapping closed intervals. Insert the closed\ninterval newInterval, merging all overlaps, and return a list that remains sorted and\nnonoverlapping. Touching endpoints overlap. You may construct a new result array.\nInput \u0026 expected result\nOnly the input list is guaranteed to be sorted and disjoint. The new interval may precede\neverything, follow everything, fit into a gap, or connect several existing intervals.\nEXAMPLE 1\nInput: intervals = [[1,2],[5,7]], newInterval = [2,6]\nOutput: [[1,7]]\nExplanation: The inserted [2,6] touches the first interval and overlaps the second, connecting\ntheir full span.\nEXAMPLE 2\nInput: intervals = [], newInterval = [3,5]\nOutput: [[3,5]]\nExplanation: There are no existing intervals to merge.\nConstraints \u0026 guarantees\n• intervals.length: 0 through 10^4 (inclusive)\n• intervals[i].length == 2\n• 0 \u003c= start_i \u003c= end_i \u003c= 10^5\n• newInterval.length == 2\n• 0 \u003c= start \u003c= end \u003c= 10^5\n• Existing intervals are disjoint and ordered by increasing start position\nJavaScript starter\nfunction insert(intervals, newInterval) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/insert-interval/) | [Example](./LC-57-Insert-Interval/index.mdx) |

{/* END GENERATED PRACTICE PROBLEMS */}

## References

- Wikipedia — Array: https://en.wikipedia.org/wiki/Array_data_structure
- Wikipedia — Dynamic array: https://en.wikipedia.org/wiki/Dynamic_array
- YouTube — Arrays in Data Structures: https://www.youtube.com/watch?v=fg2iGP4e2sE

**Next:** [strings](../strings/README.md).
