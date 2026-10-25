---
id: dsa-greedy-readme
title: "💡 Greedy"
slug: /DSA/greedy/README
sidebar_label: "Greedy"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# 💡 Greedy

A greedy algorithm makes one choice and keeps it. The choice must leave a way to reach the best final answer. A choice that looks good right now is not enough by itself.

---


<AlgorithmWalkthrough name="greedy" />

## Learning steps

A classroom can host only one activity at a time. To fit the most activities, the next finishing time matters more than the longest activity.

1. Trace earliest-finish interval selection.
2. Explain why replacing a first choice cannot reduce the final count.
3. Try a counterexample before reusing the rule for different rewards or coins.

## Concept

Before committing to a choice, show that it cannot block the best final result. One way is to take a best solution and replace its first choice with yours without making it worse. This is called an **exchange argument**. If you cannot justify the choice, try a counterexample or a different method. See [greedy versus DP](../patterns.md#greedy-or-dp) for a coin-change counterexample.

Many greedy algorithms sort first, which costs O(n log n). Others, such as the Jump Game scan below, take O(n). Count the actual steps.

---

## Common Patterns

### Interval Scheduling (sort by end time)

Contract: maximize the number of non-overlapping intervals with equal value. Each interval has start less than end; touching endpoints are compatible. Empty input returns 0, and the input order is preserved.

Choose the earliest finish: an optimal schedule's first interval can be replaced with it without pushing that finish later. The remaining intervals still fit, so the same argument applies to the suffix. Sorting by earliest start or shortest duration does not establish this property.

```js runnable
function maxNonOverlapping(intervals) {
  const ordered = [...intervals].sort((a, b) => a[1] - b[1]);
  let count = 0,
    lastEnd = -Infinity;
  for (const [s, e] of ordered)
    if (s >= lastEnd) {
      count++;
      lastEnd = e;
    }
  return count;
}

console.log(maxNonOverlapping([[0, 10], [1, 2], [2, 3], [3, 4]]));
console.log(maxNonOverlapping([]));
```

```text output
3
0
```

Time is O(n log n) for sorting plus O(n) scanning; the copy uses O(n) extra space. Weighted rewards change the objective and require a different algorithm. Merging overlapping intervals instead sorts by start and extends the current merged endpoint; it does not maximize a selected count.

### Jump Game

```javascript
function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}
```

---

## Pitfalls

- Greedy doesn't always work — verify with exchange argument or counterexample
- 0/1 Knapsack fails with greedy — use DP
- Greedy needs correct sorting criterion — wrong sort → wrong answer

---

## Worked examples and answers {/* #workbook-practice */}

Attempt the linked [Practice Problems](#practice-problems) before opening their answers. See the [workbook guide](../../javascript/workbook.md) for the A–C exercise format.

### 44. Greedy algorithms and exchange arguments {/* #workbook-44 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** justify a choice that will not be reconsidered later.

The [interval-scheduling example](#interval-scheduling-sort-by-end-time) gives the earliest-finish proof. Read the worked trace below with that proof in mind. Intervals are half-open `[start, end)`: a task ending at 4 can be followed by one starting at 4. Changing the endpoint policy changes the comparison.

The objective matters. Maximizing the number of intervals differs from maximizing their total reward. For coins `[1, 3, 4]` and amount 6, choosing 4 first uses three coins, while 3 + 3 uses two. A small counterexample can reject a tempting greedy rule.

An **exchange argument** swaps a greedy choice into a best solution without making it worse. A **stays-ahead argument** compares progress after each step. A **cut argument** justifies a connection across two groups in a minimum spanning tree. [Kruskal](../graphs/kruskal/README.md) and [Prim](../graphs/prim/README.md) use the last idea; they do not solve general shortest paths.

**Worked example**

```js
function selectIntervals(intervals) {
  const ordered = [...intervals].sort((a, b) => a.end - b.end);
  const chosen = [];
  let end = -Infinity;
  for (const interval of ordered) {
    if (interval.start >= end) {
      chosen.push(interval);
      end = interval.end;
    }
  }
  return chosen;
}
const intervals = [
  { start: 0, end: 4 }, { start: 1, end: 2 },
  { start: 2, end: 3 }, { start: 3, end: 5 }
];
console.log(selectIntervals(intervals).length);
```

**Expected output**

```text
3
```

**Why the example works**

Choosing [1,2) leaves room for [2,3) and [3,5). The long interval [0,4) blocks that sequence. Sorting a copy preserves the caller's array order, though the selected interval objects are shared references. Sorting dominates the O(n log n) time cost.

</details>

Find **44A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-44-answer">
<summary>Check your reasoning and answer</summary>

For Node checks, add `import assert from "node:assert/strict";` at the top of your file. Browser and multi-file examples use the setup stated above.

**44A.** An early-starting interval can occupy nearly the whole timeline and block many short intervals. Finishing time measures the remaining room for future choices more directly.

**44B.** It preserves feasibility and the number of selected intervals while replacing the first choice. That proves there exists an optimal solution containing the greedy first interval.

**44C.** The existing selection procedure already satisfies the stated interval contract and preserves array order. Reading its length reuses the proven behavior rather than duplicating the greedy logic.

**Reference code**

Use the worked example above first if the answer calls its functions or classes. Run each lesson in its own `.mjs` file.

```js
function maxNonoverlapping(intervals) {
  return selectIntervals(intervals).length;
}
```

**Check the result**

```js
assert.equal(maxNonoverlapping([]), 0);
assert.equal(maxNonoverlapping(intervals), 3);
const snapshot = JSON.stringify(intervals);
maxNonoverlapping(intervals);
assert.equal(JSON.stringify(intervals), snapshot);
```

</details>

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **44A — Why is earliest start an unreliable greedy rule here?** | **Must fix** | [Worked example](#workbook-44) | [Answer](#workbook-44-answer) |
| **44B — What exactly does the exchange argument preserve?** | **Must fix** | [Worked example](#workbook-44) | [Answer](#workbook-44-answer) |
| **44C — Write maxNonoverlapping(intervals) returning the count without mutating the input. Reuse selectIntervals.** | **Must fix** | [Worked example](#workbook-44) | [Answer](#workbook-44-answer) |
| <PracticeProblem id={252} title={"Meeting Rooms"} text={"Problem statement\nEach interval [start,end] is a meeting with start earlier than end. Determine whether a single\nperson can attend every meeting without simultaneous commitments. A meeting ending exactly\nwhen another begins causes no conflict. The input may be unsorted.\nInput \u0026 expected result\nReturn whether a single room, and therefore one attendee, can serve the whole schedule. Use time\nintervals rather than the input ordering to judge overlaps.\nEXAMPLE 1\nInput: intervals = [[1,3],[3,5],[6,8]]\nOutput: true\nExplanation: Each meeting finishes no later than the next one starts, including the exact\nboundary at time 3.\nEXAMPLE 2\nInput: intervals = [[1,4],[2,3]]\nOutput: false\nExplanation: Both meetings are active between times 2 and 3.\nConstraints \u0026 guarantees\n• Each interval provides a start and end, with start \u003c end\n• A meeting may begin exactly when another one ends\nPremium source: current numeric bounds could not be publicly verified.\nJavaScript starter\nfunction canAttendMeetings(intervals) {\n  // TODO: write your solution.\n}"} /> | Easy · Premium | [LeetCode](https://leetcode.com/problems/meeting-rooms/) | — |
| [LC 455 — Assign Cookies](https://leetcode.com/problems/assign-cookies/) | Easy | [LeetCode](https://leetcode.com/problems/assign-cookies/) | — |
| [LC 860 — Lemonade Change](https://leetcode.com/problems/lemonade-change/) | Easy | [LeetCode](https://leetcode.com/problems/lemonade-change/) | — |
| <PracticeProblem id={45} title={"Jump Game II"} text={"Problem statement\nYou start at the first position of nums, and nums[i] is the maximum forward jump length from\nposition i. Return the fewest jumps needed to reach the last position. You may choose a shorter\njump than the maximum. The input guarantees that the last position can be reached; a\none-element array needs no jumps.\nInput \u0026 expected result\nOnly the number of moves matters, not total distance traveled. A jump may end anywhere within\nthe current allowance. Because reachability is guaranteed, a failure value such as -1 is not part of\nthe required output.\nEXAMPLE 1\nInput: nums = [2,1,2,1,0]\nOutput: 2; visit indices 0, 2, 4\nExplanation: Jumping to index 2 uses the first allowance of 2; another jump of 2 reaches the last\nposition.\nEXAMPLE 2\nInput: nums = [0]\nOutput: 0\nExplanation: The starting index is already the destination.\nConstraints \u0026 guarantees\n• nums.length: 1 through 10^4 (inclusive)\n• nums[i]: 0 through 1000 (inclusive)\n• The final position can always be reached\nJavaScript starter\nfunction jump(nums) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/jump-game-ii/) | — |
| <PracticeProblem id={55} title={"Jump Game"} text={"Problem statement\nStart at index 0 of nums. The nonnegative integer nums[i] gives the maximum number of positions\nyou may jump forward from index i; you may choose any shorter positive jump. Determine whether\nsome sequence of jumps reaches the final index. An array containing just its starting position is\nalready reachable.\nInput \u0026 expected result\nReturn whether the last index is reachable, rather than the number of jumps. A zero prevents\nleaving that position, but it may be jumped over. The value at the final position does not affect\narrival.\nEXAMPLE 1\nInput: nums = [2,0,1,0]\nOutput: true; jump from index 0 to 2, then to 3\nExplanation: The first jump can skip the zero at index 1. From index 2, a one-position jump\nreaches the destination.\nEXAMPLE 2\nInput: nums = [1,0,2]\nOutput: false\nExplanation: The first move must land on the zero, and no further jump is possible.\nConstraints \u0026 guarantees\n• nums.length: 1 through 10^4 (inclusive)\n• nums[i]: 0 through 10^5 (inclusive)\nJavaScript starter\nfunction canJump(nums) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/jump-game/) | — |
| <PracticeProblem id={122} title={"Best Time to Buy and Sell Stock II"} text={"Problem statement\nGiven daily prices for one stock, return the greatest total profit obtainable through any number of\npurchases and sales. You can hold at most one share at a time. A purchase and sale may occur on\nthe same day, but you must sell your current share before holding another. Making no trades is\nallowed.\nInput \u0026 expected result\nThe answer is the sum of profits over completed trades. There is no transaction limit, fee, or\ncooldown here. Each purchase must still respect the one-share holding restriction.\nEXAMPLE 1\nInput: prices = [2,5,1,4]\nOutput: 6, from gains of 3 and 3\nExplanation: The share can be bought at 2 and sold at 5, then bought at 1 and sold at 4. Both\ntrades earn 3.\nEXAMPLE 2\nInput: prices = [3,3,3]\nOutput: 0\nExplanation: Any purchase and sale break even, so no positive profit exists.\nConstraints \u0026 guarantees\n• prices.length: 1 through 3 * 10^4 (inclusive)\n• prices[i]: 0 through 10^4 (inclusive)\nJavaScript starter\nfunction maxProfit(prices) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/) | — |
| <PracticeProblem id={134} title={"Gas Station"} text={"Problem statement\nThere are n fuel stations on a circular route. At station i you can collect gas[i] units, and traveling\nto the next station requires cost[i] units. Begin at a station of your choice with an empty tank of\nunlimited capacity. Return the starting index that permits one complete clockwise circuit, or -1 if\nnone works. A valid start, if one exists, is unique.\nInput \u0026 expected result\nThe route wraps from station n - 1 to station 0. Fuel collected at a station is available before\ndeparting it. Your tank must never become negative during the circuit, including the final trip back\nto the start.\nEXAMPLE 1\nInput: gas = [1,2,3], cost = [2,2,2]\nOutput: 2\nExplanation: Starting at station 2 builds enough fuel to cover station 0's deficit and complete the\ncircuit. The other starting positions fail earlier.\nEXAMPLE 2\nInput: gas = [1,1], cost = [2,2]\nOutput: -1\nExplanation: The route supplies only two units of fuel but requires four.\nConstraints \u0026 guarantees\n• n == gas.length == cost.length\n• n: 1 through 10^5 (inclusive)\n• gas[i], cost[i]: 0 through 10^4 (inclusive)\n• A feasible starting station, when one exists, is unique\nJavaScript starter\nfunction canCompleteCircuit(gas, cost) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/gas-station/) | — |
| <PracticeProblem id={406} title={"Queue Reconstruction by Height"} text={"Problem statement \u0026 expected result\nEach person is described by [height, k], where k counts earlier people whose height is at least this person's\nheight. Reorder all input people into a queue satisfying every count. Return the array from front to back; a valid\nreconstruction is guaranteed.\nEXAMPLE 1\nInput: people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]\nOutput: [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]\nExplanation: Each k equals the number of earlier people at least as tall.\nEXAMPLE 2\nInput: people = [[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]\nOutput: [[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]\nExplanation: The returned arrangement satisfies all six preceding-height counts.\nConstraints \u0026 guarantees\n- 1 \u003c= people.length \u003c= 2000\n- 0 \u003c= hi \u003c= 10^6\n- 0 \u003c= ki \u003c people.length\n- It is guaranteed that the queue can be reconstructed.\nJavaScript starter\nfunction reconstructQueue(people) {\n// TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/queue-reconstruction-by-height/) | — |
| <PracticeProblem id={435} title={"Non-overlapping Intervals"} text={"Problem statement\nRemove as few intervals as possible so that the remaining intervals do not overlap. Return the\nminimum removal count. Intervals have start earlier than end, and touching endpoints are allowed:\n[1,2] and [2,3] do not overlap. The input need not be sorted.\nInput \u0026 expected result\nReturn how many intervals to discard, not the remaining intervals. Any maximum-size compatible\nsubset is acceptable internally; only the minimum removal count is judged.\nEXAMPLE 1\nInput: intervals = [[1,3],[2,4],[3,5]]\nOutput: 1\nExplanation: Removing [2,4] leaves [1,3] and [3,5], which may touch at 3 without overlapping.\nEXAMPLE 2\nInput: intervals = [[1,2],[2,3]]\nOutput: 0\nExplanation: The input already satisfies the nonoverlap rule.\nConstraints \u0026 guarantees\n• intervals.length: 1 through 10^5 (inclusive)\n• intervals[i].length == 2\n• -5 * 10^4 \u003c= start_i \u003c end_i \u003c= 5 * 10^4\nJavaScript starter\nfunction eraseOverlapIntervals(intervals) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/non-overlapping-intervals/) | — |
| <PracticeProblem id={452} title={"Minimum Number of Arrows to Burst Balloons"} text={"Problem statement\nEach balloon is represented by a closed horizontal span [start,end] in points. An arrow fired\nvertically at x bursts every balloon whose span contains x, including endpoints. Return the\nminimum number of arrows needed to burst all balloons. An arrow can hit multiple balloons; their\nvertical positions do not limit it.\nInput \u0026 expected result\nReturn a count of arrows, not their coordinates. Firing at a shared endpoint is valid because balloon\nspans are closed intervals.\nEXAMPLE 1\nInput: points = [[1,3],[2,4],[5,6]]\nOutput: 2\nExplanation: One arrow placed in the overlap of the first two spans bursts both; another is\nneeded for the disjoint third span.\nEXAMPLE 2\nInput: points = [[1,2],[2,3]]\nOutput: 1\nExplanation: An arrow at x = 2 lies inside both closed spans.\nConstraints \u0026 guarantees\n• points.length: 1 through 10^5 (inclusive)\n• points[i].length == 2\n• -2^31 \u003c= x_start \u003c x_end \u003c= 2^31 - 1\nJavaScript starter\nfunction findMinArrowShots(points) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/) | — |
| <PracticeProblem id={678} title={"Valid Parenthesis String"} text={"Problem statement\ns consists of \"(\", \")\", and \"*\". Each star may independently act as an opening parenthesis, a closing\nparenthesis, or nothing. Return true if some set of choices produces balanced parentheses, with\nevery closing parenthesis matched by an earlier opener.\nInput \u0026 expected result\nDifferent stars can have different meanings within the same string. Ignoring a star removes it\nentirely rather than leaving a character. The output asks whether at least one interpretation works,\nnot how many valid interpretations there are.\nEXAMPLE 1\nInput: s = \"(*()\"\nOutput: true, by interpreting the star as \")\"\nExplanation: Using the star as a closing parenthesis turns the string into ()(), which is balanced.\nEXAMPLE 2\nInput: s = \"*(\"\nOutput: false\nExplanation: No choice for the earlier star can provide a closing parenthesis after the final\nopener.\nConstraints \u0026 guarantees\n• s.length: 1 through 100 (inclusive)\n• Character set: (, ), *\nJavaScript starter\nfunction checkValidString(s) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/valid-parenthesis-string/) | — |
| <PracticeProblem id={763} title={"Partition Labels"} text={"Problem statement\nPartition s into the greatest possible number of consecutive pieces so that each letter occurs in at\nmost one piece. Every character must belong to exactly one piece, and pieces must remain in input\norder. Return their lengths. s contains lowercase English letters.\nInput \u0026 expected result\nChoose boundaries without reordering or deleting characters. If a letter appears several times, all\nits occurrences must lie in one resulting piece. The answer lists lengths in order, and their sum\nmust equal s.length.\nEXAMPLE 1\nInput: s = \"abaccdeef\"\nOutput: [3,2,1,2,1]\nExplanation: The pieces are aba, cc, d, ee, and f. No letter crosses a boundary, and none of\nthese pieces can be split further legally.\nEXAMPLE 2\nInput: s = \"abca\"\nOutput: [4]\nExplanation: The two a occurrences force the first and last positions into the same piece,\ncovering the whole string.\nConstraints \u0026 guarantees\n• s.length: 1 through 500 (inclusive)\n• Alphabet: a-z\nJavaScript starter\nfunction partitionLabels(s) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/partition-labels/) | — |
| [LC 767 — Reorganize String](https://leetcode.com/problems/reorganize-string/) | Medium | [LeetCode](https://leetcode.com/problems/reorganize-string/) | — |
| <PracticeProblem id={846} title={"Hand of Straights"} text={"Problem statement\nhand lists the integer values of cards. Determine whether every card can be placed into groups of\nexactly groupSize cards, with each group forming a sequence of consecutive integer values.\nDuplicate cards are separate cards, and every card must be used once. Return a boolean.\nInput \u0026 expected result\nEach group uses consecutive values with a step of exactly one. Equal-valued cards may appear in\ndifferent groups but cannot replace a missing next value within a group. All cards must be\nassigned; leaving an incomplete group is invalid.\nEXAMPLE 1\nInput: hand = [4,5,6,8,9,10], groupSize = 3\nOutput: true, with groups [4,5,6] and [8,9,10]\nExplanation: The six cards form two complete runs of length three: 4,5,6 and 8,9,10.\nEXAMPLE 2\nInput: hand = [1,2,3,4], groupSize = 3\nOutput: false\nExplanation: Four cards cannot be partitioned into groups containing exactly three cards each.\nConstraints \u0026 guarantees\n• hand.length: 1 through 10^4 (inclusive)\n• hand[i]: 0 through 10^9 (inclusive)\n• groupSize: 1 through hand.length (inclusive)\nJavaScript starter\nfunction isNStraightHand(hand, groupSize) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/hand-of-straights/) | — |
| [LC 1229 — Meeting Scheduler](https://leetcode.com/problems/meeting-scheduler/) | Medium · Premium | [LeetCode](https://leetcode.com/problems/meeting-scheduler/) | — |
| <PracticeProblem id={1899} title={"Merge Triplets to Form Target Triplet"} text={"Problem statement\ntriplets contains integer triples. One operation replaces a chosen triple with the componentwise\nmaximum of itself and another triple; the other triple remains available. Determine whether\nrepeated operations can make any triple equal target exactly. Components can increase but never\ndecrease.\nInput \u0026 expected result\nA merge uses two different triplet positions and changes one selected position to the three\ncoordinatewise maxima. You may perform zero operations if target already exists. Return a\nboolean, and require exact equality in every coordinate.\nEXAMPLE 1\nInput: triplets = [[2,1,3],[1,4,2]], target = [2,4,3]\nOutput: true\nExplanation: Taking the maximum in each coordinate yields [max(2,1),max(1,4),max(3,2)] =\n[2,4,3].\nEXAMPLE 2\nInput: triplets = [[3,2,2],[2,3,2]], target = [2,2,2]\nOutput: false\nExplanation: Both available triplets already exceed the target in a coordinate, and merging\ncannot decrease those values.\nConstraints \u0026 guarantees\n• triplets.length: 1 through 10^5 (inclusive)\n• triplets[i].length == target.length == 3\n• a_i, b_i, c_i, x, y, z: 1 through 1000 (inclusive)\nJavaScript starter\nfunction mergeTriplets(triplets, target) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/merge-triplets-to-form-target-triplet/) | — |
| <PracticeProblem id={68} title={"Text Justification"} text={"Problem statement\nArrange words into lines exactly maxWidth characters long. Put as many whole words as possible\non each line without changing their order. For a nonfinal line with multiple words, distribute\npadding between words as evenly as possible, placing any extra spaces in the leftmost gaps. A\none-word line and the final line use single spaces between words and trailing padding. Every word\nfits within maxWidth. Return the lines.\nInput \u0026 expected result\nReturn an array of padded strings, including their spaces. Word lengths exclude spaces. Do not\nsplit a word across lines, and do not use full justification for the final line.\nEXAMPLE 1\nInput: words = [\"one\",\"two\",\"six\"], maxWidth = 8\nOutput: [\"one two\",\"six \"]\nExplanation: The first two words fit together and require two spaces in their only gap. The final\nword is padded on the right to width 8.\nEXAMPLE 2\nInput: words = [\"a\",\"b\",\"c\",\"dd\"], maxWidth = 5\nOutput: [\"a b c\",\"dd \"]\nExplanation: The first line is exactly full; the final line receives trailing spaces.\nConstraints \u0026 guarantees\n• words.length: 1 through 300 (inclusive)\n• words[i].length: 1 through 20 (inclusive)\n• maxWidth: 1 through 100 (inclusive)\n• words[i].length \u003c= maxWidth\n• Each word uses English letters and symbols, with no internal spaces\nJavaScript starter\nfunction fullJustify(words, maxWidth) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/text-justification/) | — |
| <PracticeProblem id={135} title={"Candy"} text={"Problem statement\nChildren stand in a line, with their ratings recorded in ratings. Give each child at least one candy.\nWhenever two neighboring children have different ratings, the child with the higher rating must\nreceive more candies. Children with equal ratings impose no relative requirement. Return the\nsmallest possible total number of candies.\nInput \u0026 expected result\nReturn the total candy count, not an allocation array. Only immediate neighbors impose\ncomparisons; nonadjacent children need not receive quantities ordered by their ratings.\nEXAMPLE 1\nInput: ratings = [1,3,2,2]\nOutput: 5; allocation [1,2,1,1] works\nExplanation: The child rated 3 needs more than both neighbors. Giving [1,2,1,1] meets that rule\nand the one-candy minimum.\nEXAMPLE 2\nInput: ratings = [5,5,5]\nOutput: 3\nExplanation: Equal ratings create no extra requirement, so one candy per child is enough.\nConstraints \u0026 guarantees\n• 1 \u003c= n == ratings.length \u003c= 5 * 10^4\n• ratings[i]: 0 through 5 * 10^4 (inclusive)\nJavaScript starter\nfunction candy(ratings) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/candy/) | — |
| <PracticeProblem id={502} title={"IPO"} text={"Problem statement\nYou begin with capital w and may complete at most k distinct projects, one at a time. Project i\nrequires current capital of at least capital[i] and adds profits[i] to your capital when finished. The\nrequirement is a threshold, not a cost deducted from your balance. Profits are nonnegative. Return\nthe greatest final capital achievable.\nInput \u0026 expected result\nChoose each project at most once and finish it before choosing the next. A completed project's\nprofit becomes available immediately for later requirements. You may stop early when no further\nproject is affordable or when k projects are completed.\nEXAMPLE 1\nInput: k = 2, w = 0, profits = [2,4,6], capital = [0,2,5]\nOutput: 6, after choosing the first two projects\nExplanation: The zero-capital project raises capital to 2. Completing the project requiring 2 adds\n4, producing final capital 6.\nEXAMPLE 2\nInput: k = 3, w = 1, profits = [5,7], capital = [2,4]\nOutput: 1\nExplanation: Neither project can be started with capital 1, so the initial capital remains\nunchanged.\nConstraints \u0026 guarantees\n• k: 1 through 10^5 (inclusive)\n• w: 0 through 10^9 (inclusive)\n• n == profits.length\n• n == capital.length\n• n: 1 through 10^5 (inclusive)\n• profits[i]: 0 through 10^4 (inclusive)\n• capital[i]: 0 through 10^9 (inclusive)\nJavaScript starter\nfunction findMaximizedCapital(k, w, profits, capital) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/ipo/) | — |
| [LC 630 — Course Schedule III](https://leetcode.com/problems/course-schedule-iii/) | Hard | [LeetCode](https://leetcode.com/problems/course-schedule-iii/) | — |
| [LC 1383 — Maximum Performance of a Team](https://leetcode.com/problems/maximum-performance-of-a-team/) | Hard | [LeetCode](https://leetcode.com/problems/maximum-performance-of-a-team/) | — |
| [LC 1665 — Minimum Initial Energy to Finish Tasks](https://leetcode.com/problems/minimum-initial-energy-to-finish-tasks/) | Hard | [LeetCode](https://leetcode.com/problems/minimum-initial-energy-to-finish-tasks/) | — |
| G33 — Choose the largest compatible set of nonoverlapping activities. | Exercise | Greedy. The equivalent removal-count variant is also in the LeetCode section as problem 435. Related only: [LC 435](https://leetcode.com/problems/non-overlapping-intervals/) - Non-overlapping Intervals. Minimum removals equals total activities minus the maximum compatible count; output is a removal count. | — |
| G34 — Maximize packed value when items may be divided. | Exercise | Greedy | — |
| G35 — Schedule deadline-constrained jobs to maximize earned profit. | Exercise | Greedy | — |
| [LC 1005 — Maximize Sum After K Negations](https://leetcode.com/problems/maximize-sum-of-array-after-k-negations/) | Easy | [LeetCode](https://leetcode.com/problems/maximize-sum-of-array-after-k-negations/) |  |
| [CC — Good Sequences (CHEFSQ)](https://www.codechef.com/problems/CHEFSQ) | Easy | — |  |
| [CC — Election Chips (ELECCHRP)](https://www.codechef.com/problems/ELECCHRP) | Medium | — |  |
| [LC 944 — Delete Columns to Make Sorted](https://leetcode.com/problems/delete-columns-to-make-sorted/) | Easy | [LeetCode](https://leetcode.com/problems/delete-columns-to-make-sorted/) |  |
| [LC 1221 — Split a String in Balanced Strings](https://leetcode.com/problems/split-a-string-in-balanced-strings/) | Easy | [LeetCode](https://leetcode.com/problems/split-a-string-in-balanced-strings/) |  |
| [LC 1710 — Maximum Units on a Truck](https://leetcode.com/problems/maximum-units-on-a-truck/) | Easy | [LeetCode](https://leetcode.com/problems/maximum-units-on-a-truck/) |  |
| [LC 1029 — Two City Scheduling](https://leetcode.com/problems/two-city-scheduling/) | Medium | [LeetCode](https://leetcode.com/problems/two-city-scheduling/) |  |
| [LC 1247 — Minimum Swaps to Make Strings Equal](https://leetcode.com/problems/minimum-swaps-to-make-strings-equal/) | Medium | [LeetCode](https://leetcode.com/problems/minimum-swaps-to-make-strings-equal/) |  |
| [LC 1481 — Least Number of Unique Integers after K Removals](https://leetcode.com/problems/least-number-of-unique-integers-after-k-removals/) | Medium | [LeetCode](https://leetcode.com/problems/least-number-of-unique-integers-after-k-removals/) |  |
| [LC 1642 — Furthest Building You Can Reach](https://leetcode.com/problems/furthest-building-you-can-reach/) | Medium | [LeetCode](https://leetcode.com/problems/furthest-building-you-can-reach/) |  |
| [LC 1647 — Minimum Deletions to Make Character Frequencies Unique](https://leetcode.com/problems/minimum-deletions-to-make-character-frequencies-unique/) | Medium | [LeetCode](https://leetcode.com/problems/minimum-deletions-to-make-character-frequencies-unique/) |  |
| [CC — Activity Selection (ACTSEL)](https://www.codechef.com/problems/ACTSEL) | Medium | — |  |
| [CC — Fractional Knapsack (FRACKNAP)](https://www.codechef.com/problems/FRACKNAP) | Medium | — |  |
| [LC 321 — Create Maximum Number](https://leetcode.com/problems/create-maximum-number/) | Hard | [LeetCode](https://leetcode.com/problems/create-maximum-number/) |  |
| [LC 330 — Patching Array](https://leetcode.com/problems/patching-array/) | Hard | [LeetCode](https://leetcode.com/problems/patching-array/) |  |
| [LC 757 — Set Intersection Size At Least Two](https://leetcode.com/problems/set-intersection-size-at-least-two/) | Hard | [LeetCode](https://leetcode.com/problems/set-intersection-size-at-least-two/) |  |
| [LC 765 — Couples Holding Hands](https://leetcode.com/problems/couples-holding-hands/) | Hard | [LeetCode](https://leetcode.com/problems/couples-holding-hands/) |  |
| [LC 968 — Binary Tree Cameras](https://leetcode.com/problems/binary-tree-cameras/) | Hard | [LeetCode](https://leetcode.com/problems/binary-tree-cameras/) |  |
| [CC — Job Sequencing (JOBSEQ)](https://www.codechef.com/problems/JOBSEQ) | Hard | — |  |
| [CC — Advanced Greedy (ADVGREEDY)](https://www.codechef.com/problems/ADVGREEDY) | Hard | — |  |

{/* END GENERATED PRACTICE PROBLEMS */}

## Related Topics

- [Dynamic Programming](../dp/README.md) — when greedy fails, DP is next
- [Sorting](../sorting/README.md) — greedy often starts with a sort

[← Back to Home](../index.md) · © sparshjaswal

**Next:** [dynamic programming](../dp/README.md).
