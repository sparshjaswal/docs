---
title: "CodeChef roadmap coverage and course changes"
sidebar_label: "Roadmap coverage"
---

# CodeChef roadmap coverage and course changes

Independently rechecked on **23 October 2026** by reading the rendered official [CodeChef DSA roadmap](https://www.codechef.com/roadmap/data-structures-and-algorithms). The existing mapping also records its [public syllabus endpoint](https://www.codechef.com/api/roadmap/syllabus/data-structures-and-algorithms); this review verified the live course cards and level descriptions, not access to paid lessons. The current catalog contains **32 entries**: 8 beginner, 10 intermediate, 5 advanced, and 9 more advanced. “Learn” and “Practice” entries are separate even when they share a topic name.

This is a **topic coverage checklist**, not a claim to reproduce every CodeChef lesson, paid problem, judge environment, or difficulty rating. The local course supplies JavaScript explanations and examples, while the official links supply the current CodeChef practice path. Titles and module names are recorded in `data/codechef-dsa-roadmap.json` so this dated comparison can be reviewed when the external roadmap changes.

In the table, ✓ means a local teaching destination exists for the advertised topic. To mark a topic learned, also complete its trace, explain why the method works, and solve a new problem independently. Use the [practice progression](./practice-plan.md) and each chapter's exercises, hints, answers, and practice table.

## Beginner

| Covered | Official roadmap entry | Local theory, examples, and practice |
| --- | --- | --- |
| ✓ | [Time complexity](https://www.codechef.com/learn/course/time-complexity) (learn) | [Count work and prove it](./complexity.md) |
| ✓ | [Practice Arrays](https://www.codechef.com/practice/arrays-new) (practice) | [Arrays](./Array/README.md) |
| ✓ | [Practice Strings](https://www.codechef.com/practice/strings-new) (practice) | [Strings](./strings/README.md) |
| ✓ | [Hashing](https://www.codechef.com/learn/course/hashing) (learn) | [Hashing](./hashing/README.md), [Hash tables](./hash-table/README.md) |
| ✓ | [Two Pointers and Sliding Window Technique](https://www.codechef.com/practice/two-pointers-new) (practice) | [Two pointers](./two-pointers/README.md), [Sliding window](./sliding-window/README.md) |
| ✓ | [Searching and Sorting Algorithms](https://www.codechef.com/learn/course/searching-sorting-new) (learn) | [Search](./search/README.md), [Sorting](./sorting/README.md) |
| ✓ | [Practice Sorting](https://www.codechef.com/practice/sorting-new) (practice) | [Sorting practice](./sorting/README.md) |
| ✓ | [Learn Binary Search](https://www.codechef.com/learn/course/binary-search-new) (learn) | [Binary search](./binary-search/README.md) |

## Intermediate

| Covered | Official roadmap entry | Local theory, examples, and practice |
| --- | --- | --- |
| ✓ | [Intermediate Arrays and 2D Arrays](https://www.codechef.com/practice/arrays-intermediate) (practice) | [Matrices](./matrix/README.md), [Prefix sums](./prefix-sum/README.md) |
| ✓ | [Practice Strings - Intermediate](https://www.codechef.com/practice/strings-intermediate) (practice) | [Strings](./strings/README.md), [Sliding window](./sliding-window/README.md) |
| ✓ | [Linked Lists](https://www.codechef.com/learn/course/linked-lists-new) (learn) | [Singly and circular lists](./linked-list/README.md), [Doubly linked lists](./doubly-linked-list/README.md) |
| ✓ | [Practice Linked Lists](https://www.codechef.com/practice/linked-lists-new) (practice) | [Linked-list practice](./linked-list/README.md) |
| ✓ | [Learn Stacks and Queues](https://www.codechef.com/learn/course/stacks-and-queues-new) (learn) | [Stacks](./stack/README.md), [Efficient queues](./queue/README.md) |
| ✓ | [Practice Stacks and Queues](https://www.codechef.com/practice/stacks-and-queues-new) (practice) | [Stack practice](./stack/README.md), [Queue practice](./queue/README.md) |
| ✓ | [Learn Recursion](https://www.codechef.com/learn/course/recursion-new) (learn) | [Recursion](./recursion/README.md) |
| ✓ | [Heaps](https://www.codechef.com/learn/course/heaps) (learn) | [Comparator heap](./heap/README.md), [Heap sort](./sorting/heap-sort/README.md) |
| ✓ | [Practice Binary Search](https://www.codechef.com/practice/binary-search-new) (practice) | [Binary search on answers](./binary-search/README.md) |
| ✓ | [Intermediate Searching and Sorting algorithms](https://www.codechef.com/learn/course/sorting-intermediate) (learn) | [Merge](./sorting/merge-sort/README.md), [Quick](./sorting/quick-sort/README.md), [Counting](./sorting/counting-sort/README.md), [Radix](./sorting/radix-sort/README.md) |

## Advanced

| Covered | Official roadmap entry | Local theory, examples, and practice |
| --- | --- | --- |
| ✓ | [Advanced Arrays and Strings](https://www.codechef.com/practice/arrays-strings-advanced) (practice) | [Monotonic stacks](./monotonic-stack/README.md), [KMP](./strings/knuth-morris-pratt/README.md), [Z algorithm](./strings/z-algorithm/README.md) |
| ✓ | [Trees and Binary trees](https://www.codechef.com/learn/course/trees-new) (learn) | [Trees](./trees/README.md), [BST](./trees/binary-search-tree/README.md) |
| ✓ | [Learn Graphs](https://www.codechef.com/learn/course/graphs-new) (learn) | [Graphs](./graphs/README.md), [Cycles](./graphs/detect-cycle/README.md) |
| ✓ | [Greedy Algorithms](https://www.codechef.com/learn/course/greedy-algorithms) (learn) | [Greedy proofs](./greedy/README.md) |
| ✓ | [Dynamic programming](https://www.codechef.com/learn/course/dynamic-programming-new) (learn) | [Dynamic programming](./dp/README.md) |

## More Advanced Topics and Algorithms

| Covered | Official roadmap entry | Local theory, examples, and practice |
| --- | --- | --- |
| ✓ | [Learn Advanced Graphs](https://www.codechef.com/learn/course/graphs-advanced) (learn) | [Disjoint sets](./disjoint-set/README.md), [Topological sorting](./graphs/topological-sorting/README.md) |
| ✓ | [Greedy Algorithms](https://www.codechef.com/practice/greedy-algorithms) (practice) | [Greedy practice](./greedy/README.md) |
| ✓ | [Dynamic programming advanced](https://www.codechef.com/learn/course/dynamic-programming-advanced) (learn) | [Interval, tree, subset DP](./dp/advanced.md), [Knapsack](./sets/knapsack-problem/README.md), [String DP](./sets/longest-common-subsequence/README.md) |
| ✓ | [Bit Manipulation](https://www.codechef.com/learn/course/bit-manipulation) (learn) | [Bit manipulation](./bit-manipulation/README.md) |
| ✓ | [Bit manipulation](https://www.codechef.com/practice/bit-manipulation) (practice) | [Bit practice](./bit-manipulation/README.md) |
| ✓ | [Practice Adhoc / Implementation based problems](https://www.codechef.com/practice/adhoc-implementation) (practice) | [Simulation basics](./school-basics/README.md), [Mixed practice](./practice-plan.md), [Combined techniques](./uncategorized/README.md) |
| ✓ | [Number theory](https://www.codechef.com/learn/course/number-theory) (learn) | [Number theory path](./math/README.md), [Modular arithmetic](./math/modular-arithmetic/README.md) |
| ✓ | [Combinatorics](https://www.codechef.com/learn/course/combinatorics) (learn) | [Combinatorics](./math/combinatorics/README.md), [Enumeration](./backtracking/README.md) |
| ✓ | [Tries](https://www.codechef.com/learn/course/tries) (learn) | [Trie operations](./trie/README.md) |

## Concise coverage checklist

- ✓ Beginner: complexity, arrays, strings, hashing, two pointers/windows, searching, sorting, binary search — **8 entries**.
- ✓ Intermediate: matrices, intermediate strings, linked lists, stacks/queues, recursion, heaps, binary search practice, four intermediate sorts — **10 entries**.
- ✓ Advanced: advanced arrays/strings, trees/BST, graphs, greedy, basic DP — **5 entries**.
- ✓ More advanced: DSU/topological sorting, greedy practice, advanced DP, bit operations, implementation drills, number theory, combinatorics, tries — **9 entries**.
- ✓ Level-description topics: [backtracking](./backtracking/README.md), [Fenwick trees](./trees/fenwick-tree/README.md), and [segment trees](./trees/segment-tree/README.md). These appear in level descriptions even though they are not separate course cards.

The live page's main catalog has four levels and 32 cards. Some FAQ copy describes a different level count, and the general FAQ advertises an older course count. This comparison uses the actual displayed catalog. Problem counts, durations, and ratings are not prerequisites or proficiency guarantees.

## Findings in the supplied version and changes in this revision

The supplied version already had broad topic coverage, a JavaScript bridge, monochrome walkthroughs, queues/heaps, and basic and advanced DP. Missing teaching depth does not always mean a missing heading. This revision preserves that work and addresses the following concrete gaps.

| Audit finding | Change made now | Teaching outcome |
| --- | --- | --- |
| The first page said how to study but did not walk a complete beginner through the first session. | Added first-run instructions and explicit prerequisite checks to the [course entrance](./index.md). | Learners can begin, and can tell when to return to references, recursion, masks, or simpler range queries. |
| Three mixed drills were insufficient to assess all eight stages independently. | Added [eight assessments](./assessments/README.md), [separate runnable solutions](./assessments/solutions.md), and a reasoning rubric. | Each stage checks implementation, proof, boundary cases, and transfer, with prompts printable without solutions. |
| The faster Dijkstra implementation was only an algorithm recipe and an exercise. | Added a complete lazy-heap implementation, stale-record trace, LeetCode 743 adapter, and downloadable stdin drill in [Dijkstra](./graphs/dijkstra/README.md). | Learners can connect the proof to a practical sparse-graph implementation. |
| Range updates were discussed but not implemented. | Added [lazy propagation](./trees/segment-tree/range-updates.md), including push/pull invariants and overlap diagrams. | Advanced learners can reason about overlapping additions, empty intervals, and deferred work. |
| Combining known tools was less developed than learning them separately. | Added multi-source BFS, coordinate compression plus Fenwick inversion counting, and exact combination counting in the assessments. | Learners justify combining structures rather than matching only familiar problem titles. |
| The checklist treated Fenwick/segment trees as beyond the roadmap headings without identifying their level-description coverage. | Distinguished course-card coverage from level-description coverage, and documented the fresh live-page check. | The comparison states precisely what the official source supports. |

**Added:** eight stage assessments, their separately presented solutions, complete heap shortest paths and stdin download, lazy range updates, and advanced combination exercises. **Strengthened:** first-session guidance, prerequisite order, correctness proofs, numeric contracts, judge interfaces, and independent practice. **Removed from mandatory work:** no further subject removal was needed in this supplied version. **Kept optional:** browser/DOM/UI, events, async/networking, and specialized application material remain outside the DSA progression. Existing practice questions and routes are retained.

## Earlier revisions already present in the supplied course

| Finding in the previous course | Revision | Why it helps |
| --- | --- | --- |
| The DSA start assumed JavaScript knowledge and immediately introduced GCD recursion, sieves, and XOR swapping. | Added [JavaScript for DSA](./javascript-for-dsa.md), [complexity and correctness](./complexity.md), and rewrote [programming basics](./school-basics/README.md). | Inputs, symbols, variables, loops, and invariants come before techniques that depend on them. |
| Code snippets often omitted a call, expected output, or the judge wrapper. | Added checked runnable examples and explicit LeetCode-function versus CodeChef-stdin contracts. | Learners can run the example and distinguish algorithm logic from parsing and printing. |
| Queues and heaps lacked a clear reusable implementation at the point of introduction. | Added a compacting queue and a comparator-based binary heap, with cost proofs. | Graph and selection algorithms no longer depend on unexplained library structures or repeated `shift()`. |
| Several topic introductions had working ideas but no checked complete example. | Strengthened hashing, hash tables, sets, search, priority queues, DSU, Fenwick/segment trees, and LRU, with runnable examples and explicit contracts. | Readers can test the promised operations and connect each data structure to its invariant and limits. |
| Circular lists were named without showing their stopping rule. | Added a circular traversal, singleton handling, reference diagrams, reversal and merge proofs. | Learners see why waiting for `null` would not terminate. |
| Number theory was scattered across short formulas; modular inverses, SPF, and combinatorics needed a connected path. | Added modular arithmetic and combinatorics; strengthened factorization, GCD/LCM, sieve/SPF and fast powering. | Numeric contracts and prerequisites lead into counting and modular methods safely. |
| Intermediate sorting and trie operations were described more fully than they were implemented. | Added runnable merge/quick/counting/radix treatments and trie deletion/autocomplete. | Learners can trace stability, key-range tradeoffs, shared prefixes, and pruning. |
| Advanced DP families were named without complete state-design examples. | Added [interval, tree, and subset DP](./dp/advanced.md). | Each state has a meaning, proof, evaluation order, cost, and practice extension. |
| Trees used an inefficient queue pattern and mixed height conventions; recursion needed a safer bridge. | Strengthened tree/recursion lessons and added iterative traversal guidance. | Definitions, costs, and executable code now agree. |
| Walkthrough colors and text-only transcripts lost information when printed. | Shared walkthroughs use numbered steps, explicit Focus/Completed/Set aside labels, distinct outlines, and a printable full-state transcript. | State changes remain understandable without color or animation. |
| Some complex topics appeared too early or obscured the problem-solving path. | Reordered prerequisites and identified optional applications below. | Learners can focus on a useful progression without deleting advanced techniques that solve contest problems. |

## Scope: retained, moved, and removed

**Retained in the problem-solving path:** language basics; arrays, strings, objects, Map and Set; references; numeric comparators; useful destructuring and iteration; safe integer and BigInt arithmetic; bit masks; queues and heaps; recursion/backtracking; trees, graphs and DSU; greedy and DP; number theory and combinatorics; tries; range-query structures and string matching. Advanced does not mean unnecessary.

**Optional application reading:** browser/DOM/UI, events, asynchronous programming, networking, and package tooling remain in the wider JavaScript course. They are not DSA prerequisites. Statistics, cryptography, image processing, machine learning, Bloom filters, specialized heap families, and Fourier/geometry extensions remain optional reference material. Their existing routes and unique material are retained.

**Removed from the required learning path:** XOR swapping as a beginner technique, sieve/GCD snippets before their prerequisites, and repetitive color-dependent Dijkstra image steps. The earlier C++ course remains removed; this revision teaches JavaScript. No imported practice questions were deleted or renumbered.

**Useful additions beyond the named CodeChef headings:** JavaScript judge I/O and numeric safety, prefix/difference sums, monotonic structures, shortest-path variants, KMP/Z matching, and LRU composition. Fenwick and segment trees are also named in the official level descriptions; lazy propagation supplies additional implementation depth. These support LeetCode and harder contest variations, so they remain available after their prerequisites.

## Verification and limits

For this revision, `yarn verify` passed: **332 documentation pages**, **370 executable examples**, **50 Node workbook runs**, lint, type checks, and **105 tests**. One capability-gated general JavaScript example (`Math.sumPrecise`) was unsupported by the local runtime and syntax-checked only; it is outside this DSA path. `yarn build` passed with strict internal-link and anchor checks. The assessment and lazy-propagation pages were also inspected in the built site.

The new regression suite executes the code from the lessons themselves. It compares runs, uniqueness, windows, and inversions with exhaustive enumeration; graph distances with an independent all-pairs algorithm; coin DP with BFS over totals; combinations with Pascal's recurrence; and lazy updates with a plain array. Standalone stdin programs are checked on empty input, whitespace variations, and multiple cases.


Code fences marked `js runnable` execute with their adjacent exact `text output` through `yarn check:javascript`. Regression tests exercise important implementation boundaries and compare selected algorithms with small exhaustive solutions. `yarn verify` checks documentation structure, the practice catalog, examples, lint, types, and test suites; `yarn build` checks the production site and internal links. A capability-gated example elsewhere in the general JavaScript course may be reported as unsupported by the local Node runtime.

These checks do not imply that every historical source-only snippet or archived Jest suite has been migrated, nor that examples have been submitted to every external judge. The judge chooses its own Node version, time limit, and supported packages; read that environment before using newer APIs. Progress is demonstrated by independent solutions and repeated practice, not by the number of pages read.
