---
id: dsa-priority-queue-readme
title: "Priority Queue"
slug: /DSA/priority-queue/README
sidebar_label: "Priority Queue"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

# Priority queues: choose importance before arrival order

**Prerequisites:** [arrays and comparators](../javascript-for-dsa.md), an ordinary [queue](../queue/README.md), and the [binary heap](../heap/README.md). A priority queue describes an operation: return the most important waiting item. A heap is one efficient structure that implements that operation.

Imagine tasks A, B, and C arriving in that order. A has priority 5; B and C have priority 1. Suppose a smaller number means more urgent. An ordinary FIFO queue returns A first. A **min-priority queue** returns B or C first, according to its tie rule. Here we deliberately serve equal-priority tasks in arrival order, so B comes before C.

```text
Arrival order:
    [A: priority 5] -> [B: priority 1] -> [C: priority 1]

Removal order with smaller numbers first and arrival-order ties:
    1. [B: 1]      2. [C: 1]      3. [A: 5]
        ^               ^               ^
    earliest 1       later 1       larger priority
```

Priority is separate from the item's value. A task named "1" is not automatically more urgent than a task named "9". A **max-priority queue** reverses the priority comparison and returns the largest priority first.

## Learning steps

A hospital-style waiting list is a useful model: urgency decides who goes next, and equal urgency needs a clear tie rule.

1. Implement priority selection by scanning so the contract is clear.
2. Add arrival-order ties and test equal priorities.
3. Replace the scan with a heap when repeated selection becomes costly.

## Start with a complete scan-based implementation

The simplest useful baseline stores entries in arrival order. Enqueue appends one entry. To remove the best item, scan for its index, remove it, and preserve the relative order of the others. This is a correct priority queue even though it is slower than a heap for many removals.

The class below accepts finite `Number` priorities; values can be task labels or other data. Equal priorities use arrival order. `peek()` reads the next value without removing it, `dequeue()` removes it, and either returns `undefined` when empty. If `undefined` itself is stored as a value, use `size` to distinguish that from emptiness. Callers should not modify the internal `entries` array.

```js runnable
class ScanPriorityQueue {
  constructor() {
    this.entries = [];
  }

  get size() {
    return this.entries.length;
  }

  enqueue(value, priority) {
    if (!Number.isFinite(priority)) {
      throw new RangeError('Priority must be a finite Number');
    }
    this.entries.push({ value, priority });
  }

  bestIndex() {
    if (this.size === 0) return -1;
    let best = 0;
    for (let index = 1; index < this.size; index++) {
      // Strict comparison preserves the first arrival when priorities tie.
      if (this.entries[index].priority < this.entries[best].priority) {
        best = index;
      }
    }
    return best;
  }

  peek() {
    const index = this.bestIndex();
    return index === -1 ? undefined : this.entries[index].value;
  }

  dequeue() {
    const index = this.bestIndex();
    if (index === -1) return undefined;
    const [entry] = this.entries.splice(index, 1);
    return entry.value;
  }
}

const tasks = new ScanPriorityQueue();
tasks.enqueue('A', 5);
tasks.enqueue('B', 1);
tasks.enqueue('C', 1);
console.log(tasks.peek(), tasks.size);
console.log(tasks.dequeue(), tasks.dequeue(), tasks.dequeue());
console.log(tasks.dequeue());
```

```text output
B 3
B C A
undefined
```

| Operation | Stored entries afterward | Returned value |
| --- | --- | --- |
| Enqueue A, B, C | `[A:5, B:1, C:1]` | none |
| `peek()` | `[A:5, B:1, C:1]` | B; nothing removed |
| First `dequeue()` | `[A:5, C:1]` | B |
| Second `dequeue()` | `[A:5]` | C |
| Third `dequeue()` | `[]` | A |

**Why it works:** after examining any prefix of the entries, `best` identifies its earliest minimum-priority entry. A strictly smaller priority replaces it; an equal priority does not. After the full scan, it is the desired next entry. `splice` removes that entry while preserving the order of the others, so the same tie rule remains valid for later removals.

For `n` waiting entries, `enqueue` is amortized `O(1)` under the dynamic-array model; `peek` and `dequeue` are `O(n)`. Removing an interior array entry may shift the following entries, which is still `O(n)`. `size` is `O(1)`, and stored entries occupy `O(n)` space. Adding and then removing `n` tasks this way takes `O(n²)` time in the worst case.

## Improve selection with the existing heap

The [complete comparator heap](../heap/README.md#implementation) implements the same behavior with `O(log n)` insertion/removal and `O(1)` peeking. It keeps the best entry at the root instead of scanning all entries each time. Keep the queue's behavior and change its underlying structure.

For equal-priority arrival order, give each entry an increasing `order` number. Use the canonical `BinaryHeap` class with the comparator `(first, second) => first.priority - second.priority || first.order - second.order`. The priority comparison decides first; when it is zero, the arrival number breaks the tie. Keep priorities finite and arrival counters within the safe-integer range. An ordinary heap does not promise this tie order automatically.

The heap lesson already includes a complete runnable task-record example. Its `push(record)`, `peek()`, and `pop()` correspond to enqueue, inspect, and dequeue; read the record's value field after removal. Use the scan version as a small-input correctness oracle when implementing your heap version.

| Implementation | Add one | Inspect best | Remove best | Appropriate use |
| --- | --- | --- | --- | --- |
| Unsorted array above | Amortized O(1) | O(n) | O(n) | Simple baseline or very few removals |
| Sorted array | O(n) to insert in place | O(1) | O(1) if best is at the end | Small queues where ordered access is also useful |
| Binary heap | O(log n) | O(1) | O(log n) | Repeated additions and best-item removals |

These bounds assume constant-time comparisons; include the comparator's cost if priorities are expensive to compute or compare. Sorting the entire array after each insertion does not achieve the heap's insertion bound.

## Recognize where the behavior is useful

- **Next event by time:** use the earliest scheduled time as priority; decide the tie rule explicitly.
- **Repeated smallest/largest candidate:** examples include merging sorted streams and maintaining the best k items. See the [heap patterns](../heap/README.md).
- **Cheapest pending route:** [Dijkstra](../graphs/dijkstra/README.md) uses tentative distance as priority and discards stale records when a route improves.

A priority queue does not prove that choosing the locally best item solves the whole problem. For example, a task with a small cost may have prerequisites. You still need the problem's correctness argument. It is also not a structure for fast arbitrary lookup or membership; add a map if those operations are required.

Do not change the priority field of a record already inside a heap and assume the root remains correct. Remove and reinsert it using a supported operation, or insert a new record and use an explicit stale-record rule. A FIFO queue is enough when arrival order alone is the required order.

## Checks and graduated practice

1. **Trace:** after adding A:5, B:1, C:1, remove one item, then add D:0. What is the remaining removal order?
2. **Modify:** change the scan queue into a max-priority queue while preserving arrival-order ties. Which comparison changes?
3. **Improve:** use the linked heap implementation for the same trace. Explain why an arrival number belongs in the comparator.

<details>
<summary>Hints</summary>

1. Remove B before considering D's later arrival. A later item may still have higher priority.
2. Only replace the best entry when a strictly larger priority appears.
3. Equal-priority records are otherwise indistinguishable to the heap comparator.

</details>

<details>
<summary>Answers and reasoning</summary>

1. The first removal is B. The remaining order is D, C, A. D's priority 0 beats C's 1, regardless of arrival time.
2. Replace `<` with `>` in `bestIndex`. Keeping the comparison strict still retains the earliest entry in a tie.
3. Store `{ value, priority, order }` records and compare priority, then order. The result matches the scan queue, but each add/remove now takes O(log n) rather than requiring a linear scan on removal. A priority-only comparator could return B and C in either order. For regression checking, compare both implementations after interleaved insertions and removals, including equal priorities, zero, negative priorities, and an empty queue.

</details>

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| <PracticeProblem id={253} title={"Meeting Rooms II"} text={"Problem statement\nGiven meeting intervals [start,end], return the smallest number of rooms needed to hold them all.\nOverlapping meetings need different rooms. A room becomes available at a meeting's end time, so\nanother meeting may begin at that same time. The intervals may be unsorted.\nInput \u0026 expected result\nReturn the number of rooms needed at the busiest time. Rooms can be reused after meetings end,\nso the answer need not equal the total number of meetings.\nEXAMPLE 1\nInput: intervals = [[1,4],[2,5],[5,7]]\nOutput: 2\nExplanation: The first two meetings overlap and need two rooms. The meeting starting at 5 can\nreuse a room that has just become free.\nEXAMPLE 2\nInput: intervals = [[1,2],[2,3],[3,4]]\nOutput: 1\nExplanation: The meetings touch but never overlap in time.\nConstraints \u0026 guarantees\n• Each interval provides a start and end, with start \u003c end\n• A room becomes reusable at its meeting's end time\nPremium source: current numeric bounds could not be publicly verified.\nJavaScript starter\nfunction minMeetingRooms(intervals) {\n  // TODO: write your solution.\n}"} /> | Medium · Premium | [LeetCode](https://leetcode.com/problems/meeting-rooms-ii/) | — |
| <PracticeProblem id={621} title={"Task Scheduler"} text={"Problem statement\ntasks contains uppercase task labels. Every execution takes one time unit. Identical labels must\nhave at least n intervening time units between executions, occupied by other tasks or idle time.\nYou may reorder tasks freely, but must execute every occurrence once. Return the smallest total\nduration.\nInput \u0026 expected result\nThe same-label cooldown is measured between execution slots, not between start times alone.\nDifferent labels have no cooldown relative to each other. Idle slots count toward total duration, and\nn = 0 permits consecutive identical tasks.\nEXAMPLE 1\nInput: tasks = [\"A\",\"A\",\"A\",\"B\"], n = 1\nOutput: 5; A, B, A, idle, A is valid\nExplanation: The three A tasks need intervening slots. One B fills a gap, and one idle slot fills the\nother, producing five slots total.\nEXAMPLE 2\nInput: tasks = [\"A\",\"A\",\"B\",\"B\"], n = 2\nOutput: 5\nExplanation: A, B, idle, A, B gives two intervening slots between each pair of identical labels.\nConstraints \u0026 guarantees\n• tasks.length: 1 through 10^4 (inclusive)\n• n: 0 through 100 (inclusive)\n• Task labels: A-Z\nJavaScript starter\nfunction leastInterval(tasks, n) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/task-scheduler/) | — |
| <PracticeProblem id={1514} title={"Path with Maximum Probability"} text={"Problem statement \u0026 expected result\nEach undirected edge has a success probability. A route's success probability is the product of its edge\nprobabilities. Return the greatest route probability from start_node to end_node, or zero if they are disconnected.\nError up to 10^-5 is accepted.\nEXAMPLE 1\nInput: n = 3, edges = [[0,1],[1,2],[0,2]], succProb = [0.5,0.5,0.2], start = 0, end = 2\nOutput: 0.25000\nExplanation: The two-edge path succeeds with probability 0.5*0.5 = 0.25.\nEXAMPLE 2\nInput: n = 3, edges = [[0,1],[1,2],[0,2]], succProb = [0.5,0.5,0.3], start = 0, end = 2\nOutput: 0.30000\nExplanation: The direct edge has probability 0.3, exceeding the two-edge route.\nConstraints \u0026 guarantees\n- 2 \u003c= n \u003c= 10^4\n- 0 \u003c= start, end \u003c n\n- start != end\n- 0 \u003c= a, b \u003c n\n- a != b\n- 0 \u003c= succProb.length == edges.length \u003c= 2*10^4\n- 0 \u003c= succProb[i] \u003c= 1\n- There is at most one edge between every two nodes.\nJavaScript starter\nfunction maxProbability(n, edges, succProb, start_node, end_node) {\n// TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/path-with-maximum-probability/) | — |
| <PracticeProblem id={759} title={"Employee Free Time"} text={"Problem statement\nEach employee has a sorted list of nonoverlapping working intervals. Find every finite interval of\npositive duration during which all employees are free. Return those common free intervals in time\norder. Exclude unbounded time before all work or after all work, and exclude zero-duration gaps.\nInput \u0026 expected result\nThe judge uses Interval objects with start and end fields. Examples display them as [start,end]\npairs.\nEXAMPLE 1\nInput: schedule = [[[1,3],[6,8]],[[2,4],[7,9]]]\nOutput intervals: [[4,6]]\nExplanation: All employees are free between the end of the first work block and the next start.\nEXAMPLE 2\nInput: schedule = [[[1,5]],[[2,6]]]\nOutput intervals: []\nExplanation: The combined work has no finite gap inside it.\nConstraints \u0026 guarantees\n• Each working interval has start \u003c end.\n• Each employee's intervals are sorted and do not overlap.\nPremium source: current numeric bounds could not be publicly verified.\nJavaScript starter\nfunction employeeFreeTime(schedule) {\n  // TODO: write your solution.\n}"} /> | Hard · Premium | [LeetCode](https://leetcode.com/problems/employee-free-time/) | — |
| <PracticeProblem id={1851} title={"Minimum Interval to Include Each Query"} text={"Problem statement\nFor each integer in queries, find the shortest closed interval [left,right] in intervals that contains it.\nAn interval's size is right - left + 1. Return that size, or -1 if none contains the query. Preserve the\noriginal query order, and treat repeated queries as separate output positions.\nInput \u0026 expected result\nReturn answers in the same order as queries, even if processing them in a different order. Size\ncounts every integer point including both endpoints, so a one-point interval has size 1.\nEXAMPLE 1\nInput: intervals = [[1,5],[2,3],[7,9]], queries = [2,6,8]\nOutput: [2,-1,3]\nExplanation: Query 2 uses [2,3] of size 2; 6 is uncovered; and [7,9] has size 3 for query 8.\nEXAMPLE 2\nInput: intervals = [[4,4]], queries = [4,5,4]\nOutput: [1,-1,1]\nExplanation: The repeated covered query receives the same size-one answer at both positions.\nConstraints \u0026 guarantees\n• intervals.length: 1 through 10^5 (inclusive)\n• queries.length: 1 through 10^5 (inclusive)\n• intervals[i].length == 2\n• 1 \u003c= left_i \u003c= right_i \u003c= 10^7\n• queries[j]: 1 through 10^7 (inclusive)\nJavaScript starter\nfunction minInterval(intervals, queries) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/minimum-interval-to-include-each-query/) | — |

{/* END GENERATED PRACTICE PROBLEMS */}

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Priority_queue)
- [YouTube](https://www.youtube.com/watch?v=wptevk0bshY&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=6)

**Next:** [graphs](../graphs/README.md).
