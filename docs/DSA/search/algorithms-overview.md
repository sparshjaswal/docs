# Searching

> **One-line summary**: Locate a target within a collection — from O(n) linear scans to O(log n) binary search on sorted data.

---

## Algorithms in this section

Runnable implementations (with tests) live alongside this guide in this folder:

- [Linear Search](./linear-search/) — O(n), works on unsorted data
- [Binary Search](./binary-search/) — O(log n), requires sorted input
- [Jump Search](./jump-search/) — O(√n), sorted input, block jumps
- [Interpolation Search](./interpolation-search/) — O(log log n) average on uniformly distributed sorted data

---

## Quick Comparison

| Algorithm            | Time (avg)   | Requires Sorted? |
| -------------------- | ------------ | ---------------- |
| Linear Search        | O(n)         | No               |
| Binary Search        | O(log n)     | Yes              |
| Jump Search          | O(√n)        | Yes              |
| Interpolation Search | O(log log n) | Yes (uniform)    |

---

## Related Topics

- [Sorting](../sorting/README.md) — prerequisite for binary/jump/interpolation search
- [Binary Search](../binary-search/README.md) — problem-set applications of binary search

[← Back to Home](../index.md) · © sparshjaswal