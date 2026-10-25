---
title: "Problem-solving patterns"
description: Choose an algorithm from its assumptions, maintained state, invariant, and failure cases.
sidebar_label: "Pattern selection"
---

# Problem-solving patterns

Use this guide after you can trace loops and estimate their cost. The [DSA roadmap](./index.md) supplies the learning order; linked concepts supply implementations and practice tables.

A pattern earns its speed by avoiding work that cannot change the answer. Before using a template, write down **what the state means**, **why discarding something is safe**, and **which input assumption the argument needs**.

## Learning steps

Two questions can use the same words but need different algorithms. “Find a range” does not tell you whether to use a window, prefix sums, or DP.

1. Write the requested output and the input rules.
2. Choose the fact your method must preserve after every step.
3. Challenge that choice with a case where its assumption fails.

## Recognition and invariants

| Pattern | Useful signal | State and invariant | Cost and boundary |
| --- | --- | --- | --- |
| [Hash lookup](./hashing/README.md) | Membership, duplicate counts, complement pairs | A set or map summarizes the processed prefix. Check for a complement before inserting the current item when indices must differ. | Expected O(n) for a pass with expected O(1) map operations; O(n) space. |
| [Opposite two pointers](./two-pointers/README.md) | Pair search in sorted data | Candidates not yet ruled out lie between left and right; ordering justifies moving an endpoint. | O(n) after sorting; sorting may add O(n log n) and lose original indices. |
| [Fast/slow pointers](./linked-list/README.md) | Linked-list middle or cycle | Pointers move at different speeds through the same next-pointer relation. | O(n) time, O(1) extra space; sorted values are unnecessary. |
| [Fixed window](./sliding-window/README.md) | Exactly k consecutive elements | The sum or counts describe exactly the current k positions. | O(n) with constant-time updates; negative values are allowed for fixed-size sums. |
| [Variable window](./sliding-window/README.md) | Longest valid or shortest sufficient contiguous range | The state describes the current range; shrinking preserves a route to future answers. | Often O(n); prove the condition permits forward-only boundaries. |
| [Prefix sum and frequency map](./prefix-sum/README.md) | Exact-sum subarrays, including negative values | Earlier prefixes equal to current sum minus target each identify one valid start. | Expected O(n) time, O(n) space; query before inserting the current prefix. |
| [Binary search](./binary-search/README.md) | Sorted lookup or first feasible answer | Ruled-out candidates cannot contain the answer; the candidate interval shrinks. | O(log n) comparisons, or O(C log W) for a check costing C over W candidate values. |
| Sort and scan intervals | Merge overlaps or select compatible ranges | Merging retains disjoint processed ranges; selection retains a finish time that leaves room for future intervals. | Usually O(n log n); merge by start order, select unweighted intervals by finish order. |
| [Monotonic stack](./monotonic-stack/README.md) | Nearest greater/smaller element or span | Unresolved indices stay in monotonic value order; an arriving value resolves a suffix. | O(n) total pushes and pops, O(n) space; equality depends on the question. |
| [Heap / priority queue](./heap/README.md) | Top-k, repeated best choice, merging sorted streams | The root is the next candidate; a size-k min-heap can retain the largest k values seen. | Top-k: O(n log k) for k ≥ 2, O(k) space; k = 1 is a linear scan. |
| [BFS / DFS](./graphs/README.md) | Reachability, traversal, components | Visited state prevents repeated expansion; BFS processes unweighted distance layers. | O(V + E) with adjacency lists; BFS is not a general weighted shortest-path method. |
| [Topological ordering](./graphs/topological-sorting/README.md) | Prerequisites in a directed graph | Zero-indegree vertices have no unfinished prerequisites. | O(V + E); processing fewer than V vertices indicates a directed cycle. |
| [Disjoint set](./disjoint-set/README.md) | Connectivity under edge additions | Each root represents a component; union joins distinct components. | Near-constant amortized operations with path compression and union by rank/size; does not return paths. |
| [Backtracking](./backtracking/README.md) | Enumerate configurations or search a small choice space | The path is a valid partial answer; restore it before trying a sibling choice. | Often exponential; output size and copying matter even with pruning. |
| [Greedy](./greedy/README.md) | An irreversible local choice can be proved safe | An exchange or dominance argument shows an optimal solution remains possible after the choice. | Task-dependent; a plausible local rule is not a proof. |
| [Dynamic programming](./dp/README.md) | Repeated subproblems with compact state | Each cached value answers a precisely defined state; dependencies are computed first or on demand. | Distinct states × work per state; state count can still be exponential. |
| [Kadane](./kadanes-algorithm/README.md) | Maximum nonempty contiguous sum | Track the best sum ending here separately from the best anywhere so far. | O(n) time, O(1) extra space; initialize from an element for all-negative input. |

## Distinguish similar problems

### Contiguous ranges: window, prefix sum, or Kadane?

| Request | Approach | Why |
| --- | --- | --- |
| Maximum sum of exactly k consecutive elements | Fixed window | The outgoing and incoming elements determine the update. |
| Shortest subarray with sum at least a positive target, nonnegative values | Variable window | Extending cannot decrease the sum; shrinking cannot increase it. |
| Count subarrays with sum exactly k, signed values | Prefix sum + frequency map | Earlier offset prefixes identify ranges without monotonic sums. |
| Maximum subarray sum, signed values | Kadane | Extend the best ending state or start a new range. |
| Many static range-sum queries | Prefix array | One O(n) build supports O(1) queries. |
| Range queries interleaved with updates | [Fenwick](./trees/fenwick-tree/README.md) or [segment tree](./trees/segment-tree/README.md) | A static prefix array would need rebuilding after changes. |

For `[1, -1, 5]` and target `5`, a nonnegative-sum shrinking rule can stop at `[-1, 5]` with sum `4` and miss the answer `[5]`. This disproves that window rule for signed inputs. Prefix sums plus a monotonic deque can solve the shortest-threshold version; a prefix-frequency map solves the **exact-sum counting** version. Those are different objectives.

### Greedy or DP?

For coins `[1, 3, 4]` and amount `6`, choosing the largest coin repeatedly produces `4 + 1 + 1`, while `3 + 3` uses fewer coins. The rule fails for arbitrary denominations. The [coin-change recurrence](./dp/README.md) compares all possible final coins.

For maximum-count non-overlapping intervals, choose the earliest finish: replacing the first interval of an optimal schedule with it cannot reduce the space left for later intervals. With different rewards, maximum count and maximum reward become different problems; weighted scheduling needs an appropriate recurrence.

### Enumerating answers or counting them?

Backtracking can list all subsets, but memoization cannot avoid outputting all `2^n` distinct results. If only a count or optimum is needed, DP may merge repeated states. The state must retain everything affecting future choices: an index, remaining capacity, or visited mask, for example.

### Graph traversal or shortest path?

Use BFS for shortest paths measured in equal-cost edges. For nonnegative weights, use [Dijkstra](./graphs/dijkstra/README.md). With negative edges, consider [Bellman–Ford](./graphs/bellman-ford/README.md), including reachable negative-cycle handling. DFS explores structure but does not generally produce shortest paths.

## Combine patterns deliberately

| Combination | Example | Separate responsibilities |
| --- | --- | --- |
| Sorting + two pointers | Three-sum search | Sorting enables pointer elimination; duplicate handling prevents repeated answers. |
| Binary search + greedy feasibility | [Shipping capacity](./binary-search/LC-1101-capacity-to-ship-packages-within-d-days/index.mdx) | Search chooses a capacity; a linear scan checks the day limit while preserving package order. |
| Prefix sum + hashing | Count target-sum subarrays | Prefixes transform a range into a difference; the map counts eligible earlier starts. |
| DFS + memoization | DP on an acyclic state graph | DFS requests a state; caching avoids recomputation. A cache alone does not resolve cycles. |
| Heap + graph relaxation | Dijkstra | The heap selects the smallest tentative distance; relaxation improves neighbors. |
| Hash map + doubly linked list | [LRU cache](./lru-cache/README.md) | The map finds a node; the list maintains recency and evicts the oldest entry. |

## Practice progression

Open each practice table and find these IDs. The first checks recognition; the second changes the state or boundary condition. Explain the invariant before coding.

| Pattern | Start with | Then try | Explain |
| --- | --- | --- | --- |
| [Two pointers](./two-pointers/README.md#practice-problems) | LC 125 — Valid Palindrome | LC 15 — 3Sum | Why can one endpoint move without skipping a needed pair? |
| [Sliding window](./sliding-window/README.md#practice-problems) | LC 643 — Maximum Average Subarray I | LC 3 — Longest Substring Without Repeating Characters | What changes when an element enters or leaves? |
| [Prefix sums](./prefix-sum/README.md#practice-problems) | LC 303 — Range Sum Query - Immutable | LC 560 — Subarray Sum Equals K | Why seed the empty prefix once? Why do repeated sums matter? |
| [Binary search](./binary-search/README.md#practice-problems) | LC 704 — Binary Search | LC 1011 — Capacity To Ship Packages Within D Days | What remains possible after each branch? What does a check cost? |
| [Monotonic stack](./monotonic-stack/README.md#practice-problems) | LC 496 — Next Greater Element I | LC 739 — Daily Temperatures | Why can a popped index be finalized? |
| [Backtracking](./backtracking/README.md#practice-problems) | LC 78 — Subsets | LC 46 — Permutations | What must be restored after a recursive call? |
| [Greedy](./greedy/README.md#practice-problems) | LC 455 — Assign Cookies | LC 435 — Non-overlapping Intervals | What exchange argument makes the choice safe? |
| [Dynamic programming](./dp/README.md#practice-problems) | LC 70 — Climbing Stairs | LC 322 — Coin Change | What does a state mean? Which smaller states determine it? |

Then try mixed practice without a topic label. Record the assumption you missed, a counterexample to a tempting approach, and a small case to rerun after changes.

## Review a solution

| Question | Evidence |
| --- | --- |
| Does the pattern apply? | The ordering, monotonicity, independence, or state-reuse assumption. |
| Is each step safe? | An invariant, exchange argument, or recurrence with base cases. |
| Does it terminate? | A boundary advances, an interval shrinks, or a finite choice set is exhausted. |
| Does the cost match the claim? | Total pointer moves, stack operations, states, and preprocessing. |
| What challenges it? | Empty/single inputs, duplicates, all-negative data, unreachable states, cycles, and boundary answers as applicable. |
| Does the JavaScript representation fit? | Numeric sort comparator; safe-integer bounds; queue with a head index; deliberate treatment of UTF-16 code units versus Unicode code points. |

**Next:** [guided mixed practice](./practice-plan.md).
