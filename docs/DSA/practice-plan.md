---
title: "Practice from first programs to hard problems"
sidebar_label: "Practice progression"
---

# Practice from first programs to hard problems

Reading gives you tools. Solving unfamiliar problems teaches you when to use them. Follow the [course stages](./index.md#learning-path), and move on when you can explain and implement a solution without looking at it. Difficulty labels are rough guides; unfamiliar prerequisites can make an “easy” problem difficult.

## Use a repeatable attempt

1. **Restate the contract.** Write the input, expected output, bounds, mutation rule, and one tiny example. “Subarray” means contiguous; “subsequence” may skip items.
2. **Solve it slowly first.** Enumerate candidates on paper. Describe a correct brute-force algorithm before optimizing. If that is difficult, reduce the input to two or three items.
3. **Locate repeated work.** Are you rescanning, sorting repeatedly, recomputing a state, or exploring an impossible branch? Choose a stored fact or invariant that avoids that work.
4. **Try to break the idea.** Check empty input if allowed, a singleton, duplicates, all-negative values, a boundary index, and the largest possible sum. A counterexample is useful progress.
5. **Implement and test.** Run normal and boundary cases. For small inputs, compare against an independently written brute-force method.
6. **Explain and revisit.** Record the invariant, cost, and mistake you made. Re-solve later with the answer hidden, then try a variation where the old assumption fails.

Use a hint after a focused attempt stops producing new observations. Ask for the smallest hint needed: clarify the state before reading a full algorithm. After reading a solution, close it and reconstruct the reasoning; copying a function is not an independent solution.

## A graduated sequence

Each destination contains the canonical explanation, examples or worked answers, and its practice set. Complete one direct application, one variation, and one mixed problem before treating a pattern as familiar.

| Stage | Start with | Then vary it | Ready to move on when… |
| --- | --- | --- | --- |
| First programs | [Digits and counting](./school-basics/README.md) | Robot simulation; repeated test cases in [judge I/O](./javascript-for-dsa.md) | You can trace each variable and explain every symbol. |
| Arrays and strings | [Scan, insert, delete](./Array/README.md), [string comparisons](./strings/README.md) | [Matrices](./matrix/README.md), frequency counts | You distinguish index/value, mutation/copy, and shared/independent rows. |
| Store past work | [Hashing](./hashing/README.md), [sets](./sets/README.md) | Count duplicates; store the earliest index | You can explain what each map key and value means. |
| Boundaries | [Two pointers](./two-pointers/README.md), [binary search](./binary-search/README.md) | Duplicate bounds; binary search on an answer | You justify every discarded candidate. |
| Contiguous ranges | [Sliding window](./sliding-window/README.md), [prefix sums](./prefix-sum/README.md) | Negative values; [maximum subarray](./kadanes-algorithm/README.md) | You identify when a shrinking-window rule is invalid. |
| References and frontiers | [Linked lists](./linked-list/README.md), [stacks](./stack/README.md), [queues](./queue/README.md) | Reverse links; detect cycles; [monotonic stacks](./monotonic-stack/README.md) | You preserve reachability and can account for total pushes and pops. |
| Structured inputs | [Recursion](./recursion/README.md), then [trees](./trees/README.md) and [graphs](./graphs/README.md) | Grid BFS; disconnected components; [topological ordering](./graphs/topological-sorting/README.md) | You choose DFS/BFS from the required property, not habit. |
| Ranked and weighted choices | [Heaps](./heap/README.md), [Dijkstra](./graphs/dijkstra/README.md), [DSU](./disjoint-set/README.md) | Top k; stale heap entries; merging components | You know why edge weights or connectivity operations constrain the method. |
| Search and proof | [Backtracking](./backtracking/README.md), [greedy](./greedy/README.md) | Duplicates; pruning; counterexamples to a tempting greedy rule | You can state a complete search space or prove a safe choice. |
| Repeated decisions | [Basic DP](./dp/README.md), [knapsack](./sets/knapsack-problem/README.md), [string DP](./sets/longest-common-subsequence/README.md) | Reconstruction; space compression; counting versus optimizing | You derive state and transition before writing loops. |
| Contest arithmetic | [Number theory](./math/README.md), [combinatorics](./math/combinatorics/README.md), [bits](./bit-manipulation/README.md) | Exact BigInt results; modular inverse; small subset masks | You check numeric bounds and the mathematical conditions of every shortcut. |
| Advanced combinations | [Interval/tree/subset DP](./dp/advanced.md), [tries](./trie/README.md), [range structures](./trees/segment-tree/README.md) | Dynamic queries; [Fenwick trees](./trees/fenwick-tree/README.md); [KMP](./strings/knuth-morris-pratt/README.md) | You can adapt a technique and explain why a simpler method is too slow or incorrect. |

Use the official practice links in the [CodeChef coverage checklist](./roadmap-coverage.md) alongside the local LeetCode tables. Platform problem counts and ordering may change. Read the actual statement rather than assuming a similar title means an identical contract.

## Independent stage assessments

Complete the [eight stage assessments](./assessments/README.md), one after each stage. They provide precise contracts, boundary cases, target constraints, and a review rubric. [Hints and runnable solutions](./assessments/solutions.md) live on a separate page so the prompts can be studied or printed without spoilers. The advanced tasks include multi-source BFS, exact counting, and compressed rank queries. Use the three shorter drills below for additional review.

## Three mixed exercises

These are original small drills. The technique is deliberately not named in each prompt. Attempt them before opening the hints.

### A. First repeated value — foundation

Receive an array of integers. Return the first value whose **second occurrence** you encounter while reading left to right, or `null` if none repeats. For `[4, 7, 7, 4]`, return 7, not 4. For `[]`, return `null`. Do not change the input.

Start with the method that compares each item against all earlier items. Then reduce the repeated searches. Include zero and negative values in your tests.

### B. Exact-sum ranges — intermediate

Count the nonempty contiguous ranges whose sum is `target`. Values may be negative. For `[1, -1, 1]` with target 1, return 3. For `[0, 0]` with target 0, return 3. Keep sums and counts within the safe integer range.

First enumerate each start and extend a running sum to each end in O(n²) time. Then consider how two running totals identify a range. Explain why simply moving the left boundary when the sum becomes too large is not safe for negative values.

### C. A cheaper assignment — advanced

Use the assignment contract in [subset DP](./dp/advanced.md): one distinct job per worker and minimum total cost. For `[[1, 2], [1, 100]]`, return 3. First enumerate all job orders for small n; then compare against the saved-state solution. Extend the answer to include the chosen jobs and verify that none repeats.

<details>
<summary>Hints, from smallest to largest</summary>

**A:** what yes/no question do you ask about every earlier value? Store membership. Check before inserting, or every item will appear to repeat itself.

**B:** if `prefix[right] - prefix[left] = target`, rearrange to find the earlier total you need. Store how many times each earlier total occurred. The empty prefix is a real starting boundary.

**C:** after assigning the first k workers, do future costs depend on the order you chose their jobs, or only on which jobs remain? Count the states of the second description.

</details>

<details>
<summary>Solutions and reasoning</summary>

**A: membership remembers the past.** Before each iteration, `seen` contains exactly the preceding values. The first successful membership test is therefore precisely the first second occurrence. Expected O(n) time and O(n) auxiliary space under the hash-set cost model; the direct comparison baseline is O(n²) time and O(1) auxiliary space.

```js runnable
function firstRepeatedValue(values) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) return value;
    seen.add(value);
  }
  return null;
}
console.log(firstRepeatedValue([4, 7, 7, 4]));
console.log(firstRepeatedValue([0, -2, 0]));
console.log(firstRepeatedValue([]));
```

```text output
7
0
null
```

**B: count earlier prefix totals.** The [complete prefix-map solution](./prefix-sum/README.md) starts with count 1 for total zero, queries `sum - target`, then inserts the current sum. Different occurrences of the same total mean different range starts. At the two zeros, the contributions are 1 then 2, giving 3. Expected O(n) time and O(n) auxiliary space. A later negative value can lower a sum, so throwing away starts merely because the current sum is too large can miss valid future ranges.

**C: save the cheapest way to reach each job set.** The [complete assignment implementation](./dp/advanced.md) takes O(n·2ⁿ) time and O(2ⁿ) auxiliary space. Assigning worker 0 job 1 and worker 1 job 0 costs 2 + 1 = 3; greedily assigning each worker its cheapest available job gives 101. To reconstruct, save the previous mask and chosen job on each improvement. Follow these links backward from the full mask, then reverse the job list.

</details>

## Judge practice and review

On LeetCode, preserve the requested function signature and return shape. On CodeChef, parse the specified test-case format, reset per-case state, and print exactly the requested result. Both need numeric-bound checks; neither needs a browser or DOM. Use the [same algorithm with two judge interfaces](./javascript-for-dsa.md) as your starting template.

After practice, classify a failure by its cause: misunderstood contract, missing prerequisite, invalid approach, implementation bug, numeric error, or excessive cost. Fix that cause and test a case that would have exposed it. A timed attempt is useful only after you can solve representative untimed examples correctly.

For a stage checkpoint, solve an unfamiliar direct problem and a variation, explain the invariant without code, and give a counterexample to an unsuitable alternative. For advanced proficiency, repeat this across mixed topics, reconstruct solutions, and revisit missed problems. No reading schedule alone guarantees expertise.
