---
id: dsa-search-jump-search-readme
title: "Jump Search"
slug: /DSA/search/jump-search/README
sidebar_label: "Jump Search"
---

# Jump Search

**Read first:** [Linear Search](../linear-search/README.md).

**Practice focus:** Jump between sorted blocks, then scan only the block that could contain the target.

Jump search looks through a sorted array in blocks. Jump to each block’s end until it reaches or passes the target, then scan that block one item at a time. Blocks of about √n items balance the number of jumps and the final scan.

For example, suppose we have an array `arr[]` of size `n` and block (to be jumped)
of size `m`. Then we search at the indexes `arr[0]`, `arr[m]`, `arr[2 * m]`, ..., `arr[k * m]` and
so on. Once we find the interval `arr[k * m] < x < arr[(k+1) * m]`, we perform a
linear search operation from the index `k * m` to find the element `x`.

**What is the optimal block size to be skipped?**
In the worst case, we have to do `n/m` jumps and if the last checked value is
greater than the element to be searched for, we perform `m - 1` comparisons more
for linear search. Therefore the total number of comparisons in the worst case
will be `((n/m) + m - 1)`. The value of the function `((n/m) + m - 1)` will be
minimum when `m = √n`. Therefore, the best step size is `m = √n`.

## Complexity

**Time complexity**: `O(√n)` - because we do search by blocks of size `√n`.

## Exercise and failure drill

For a sorted array of length 10 and jump length 3, trace where a target near the final position can lie.

<details>
<summary>Expected trace and debugging checks</summary>

Clamp the last jump boundary to valid indices, then scan only the candidate block. Empty arrays and targets larger than the final value must not read beyond the array.

</details>

## Interview reasoning

Why does random access matter? Efficient jumps assume direct index access. A linked list does not supply that cost model; compare [binary search on linked lists](../../binary-search/linked-list/README.md).

## References

- [GeeksForGeeks](https://www.geeksforgeeks.org/jump-search/)
- [Wikipedia](https://en.wikipedia.org/wiki/Jump_search)

**Next:** [Binary Search](../binary-search/README.md).
