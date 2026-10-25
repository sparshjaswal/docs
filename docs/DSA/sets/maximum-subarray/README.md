---
id: dsa-sets-maximum-subarray-readme
title: "Maximum subarray problem"
slug: /DSA/sets/maximum-subarray/README
sidebar_label: "Maximum subarray problem"
---

# Maximum subarray problem

**Read first:** [Kadanes Algorithm](../../kadanes-algorithm/README.md).

**Practice focus:** Compare every small range with the restart-or-extend rule, especially when every value is negative.

Choose one nonempty stretch of neighboring values with the largest total. You may choose where it starts and ends, but you cannot skip a value inside the stretch:

`sum(a[left..right])` is largest among all nonempty contiguous ranges, with `0 ≤ left ≤ right < n`.

Use the [step-by-step Kadane trace](../../kadanes-algorithm/README.md) to see why each position either starts a new range or extends the previous one. Initialize from the first item so all-negative input works.

## Example

The list usually contains both positive and negative numbers along
with `0`. For example, for the array of
values `−2, 1, −3, 4, −1, 2, 1, −5, 4` the contiguous subarray
with the largest sum is `4, −1, 2, 1`, with sum `6`.

## Implementation examples

- Brute Force solution `O(n^2)`: [bfMaximumSubarray.js](./bfMaximumSubarray.js)
- Recursive range-enumeration example `O(n²)`: [dcMaximumSubarraySum.js](./dcMaximumSubarraySum.js)
- Dynamic Programming solution `O(n)`: [dpMaximumSubarray.js](./dpMaximumSubarray.js)

## Exercise and failure drill

For `[-4, -2, -7]`, distinguish a nonempty maximum-subarray contract from one that permits the empty subarray.

<details>
<summary>Expected trace and debugging checks</summary>

The nonempty answer is -2, while allowing the empty subarray can make 0 valid. Initialize and test according to the contract. Use the [canonical Kadane lesson](../../kadanes-algorithm/README.md) for the recurrence and implementation.

</details>

## Interview reasoning

Does a maximum subarray allow skipping values? No: it is contiguous. A subsequence or subset is a different problem with different constraints.

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Maximum_subarray_problem)
- [YouTube](https://www.youtube.com/watch?v=ohHWQf1HDfU&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [GeeksForGeeks](https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/)
- [LeetCode](https://leetcode.com/explore/interview/card/top-interview-questions-easy/97/dynamic-programming/566/discuss/1595195/C++Python-7-Simple-Solutions-w-Explanation-or-Brute-Force-+-DP-+-Kadane-+-Divide-and-Conquer)

**Next:** [Rain Terraces (Trapping Rain Water) Problem](../../uncategorized/rain-terraces/README.md).
