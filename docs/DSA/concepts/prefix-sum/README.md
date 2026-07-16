
# ➕ Prefix Sum

> **One-line summary**: Pre-compute cumulative sums so any range query `sum(L..R)` is answered in O(1) after O(n) preprocessing.

---

## Concept

Build a prefix sum array `p` where `p[i] = arr[0] + arr[1] + ... + arr[i]`.

```
Range sum [L, R] = p[R] - p[L-1]   (with p[-1] = 0)
```

**Difference array** is the inverse: apply range updates in O(1), read values in O(n).

---

## Diagram

![Prefix Sum Flow](../../../assets/images/prefix-sum-flow.svg)
![Prefix Sum Animation](../../../assets/images/prefix-sum-flow-anim.svg)

---

## Time & Space Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Build prefix array | O(n) | O(n) |
| Range query | O(1) | O(1) |
| Difference array update | O(1) | O(n) |

---

## Common Patterns

### Basic Prefix Sum
```javascript
function buildPrefix(arr) {
  const p = new Array(arr.length + 1).fill(0);
  for (let i = 0; i < arr.length; i++) p[i + 1] = p[i] + arr[i];
  return p;
}
function rangeSum(p, l, r) { return p[r + 1] - p[l]; }
```

### Subarray Sum Equals K (hash map + prefix)
```javascript
function subarraySum(nums, k) {
  const map = new Map([[0, 1]]);
  let count = 0, sum = 0;
  for (const n of nums) {
    sum += n;
    count += (map.get(sum - k) || 0);
    map.set(sum, (map.get(sum) || 0) + 1);
  }
  return count;
}
```

---

## Pitfalls

- Off-by-one: use 1-indexed prefix array to avoid `p[-1]` issues
- 2D prefix sum: remember the inclusion-exclusion formula

---

## Practice Problems

| Problem | Difficulty | Solution |
|---------|-----------|----------|
| [LC 1480 — Running Sum of 1D Array](https://leetcode.com/problems/running-sum-of-1d-array/) | Easy |  |
| [LC 303 — Range Sum Query](https://leetcode.com/problems/range-sum-query-immutable/) | Easy |  |
| [LC 560 — Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) | Medium |  |
| [LC 525 — Contiguous Array](https://leetcode.com/problems/contiguous-array/) | Medium |  |
| [LC 304 — Range Sum Query 2D](https://leetcode.com/problems/range-sum-query-2d-immutable/) | Medium |  |
| [LC 1171 — Remove Zero Sum Consecutive Nodes](https://leetcode.com/problems/remove-zero-sum-consecutive-nodes-from-linked-list/) | Medium |  |
| [CC — Sumtastic (SUMTASTIC)](https://www.codechef.com/problems/SUMTASTIC) | Medium |  |
| [CC — Chef Segment (CHSEG)](https://www.codechef.com/problems/CHSEG) | Medium |  |
| [LC 363 — Max Sum of Rectangle No Larger Than K](https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k/) | Hard |  |
| [LC 930 — Binary Subarrays With Sum](https://leetcode.com/problems/binary-subarrays-with-sum/) | Medium |  |
| [LC 523 — Continuous Subarray Sum](https://leetcode.com/problems/continuous-subarray-sum/) | Medium |  |
| [LC 238 — Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/) | Medium |  |
| [LC 724 — Find Pivot Index](https://leetcode.com/problems/find-pivot-index/) | Easy |  |
| [LC 1031 — Maximum Sum of Two Non-Overlapping Subarrays](https://leetcode.com/problems/maximum-sum-of-two-non-overlapping-subarrays/) | Medium |  |
| [LC 1094 — Car Pooling](https://leetcode.com/problems/car-pooling/) | Medium |  |
| [LC 1109 — Corporate Flight Bookings](https://leetcode.com/problems/corporate-flight-bookings/) | Medium |  |
| [LC 1248 — Count Number of Nice Subarrays](https://leetcode.com/problems/count-number-of-nice-subarrays/) | Medium |  |
| [LC 1314 — Matrix Block Sum](https://leetcode.com/problems/matrix-block-sum/) | Medium |  |
| [LC 1442 — Count Triplets That Can Form Two Arrays of Equal XOR](https://leetcode.com/problems/count-triplets-that-can-form-two-arrays-of-equal-xor/) | Medium |  |
| [LC 1590 — Make Sum Divisible by P](https://leetcode.com/problems/make-sum-divisible-by-p/) | Medium |  |
| [LC 1658 — Minimum Operations to Reduce X to Zero](https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero/) | Medium |  |
| [LC 1664 — Ways to Make a Fair Array](https://leetcode.com/problems/ways-to-make-a-fair-array/) | Medium |  |
| [LC 1732 — Find the Highest Altitude](https://leetcode.com/problems/find-the-highest-altitude/) | Easy |  |
| [LC 1991 — Find the Middle Index in Array](https://leetcode.com/problems/find-the-middle-index-in-array/) | Easy |  |
| [CC — Range Sum Queries (RANGESUM)](https://www.codechef.com/problems/RANGESUM) | Easy |  |
| [CC — Prefix Sum Array (PREFSUM)](https://www.codechef.com/problems/PREFSUM) | Easy |  |
| [CC — Subarray Queries (SUBARR)](https://www.codechef.com/problems/SUBARR) | Medium |  |

---

## Related Topics

- [Hashing](../hashing/README.md) — hash map powers subarray sum = K
- [Kadane's Algorithm](../kadanes-algorithm/README.md) — complementary
- [Sliding Window](../sliding-window/README.md)

[← Back to Home](../index.md) · © sparshjaswal
