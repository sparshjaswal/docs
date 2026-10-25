---
id: dsa-queue-readme
title: "Queue"
slug: /DSA/queue/README
sidebar_label: "Queue"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Queue

A queue works like a line at a shop: the first person to join is served first. This rule is called **FIFO**: first in, first out.

**Before this lesson:** know arrays, loops, functions, and [references](../javascript-for-dsa.md#3-arrays-strings-and-references). You will learn to preserve arrival order, implement an efficient JavaScript queue, and recognize when it is the right tool.

- **enqueue:** add an item at the back.
- **dequeue:** remove and return the item at the front.
- **peek:** read the front item without removing it.

Use a queue for tasks that should run in arrival order or for breadth-first search. In a JavaScript array, use a moving head index for repeated reads; repeatedly calling `shift()` may move the remaining items. A long-lived queue also needs to release processed items or reuse storage.

<AlgorithmWalkthrough name="queue" />

## Learning steps

A printer serves waiting documents in arrival order. Removing the first job should not require moving every remaining job.

1. Predict enqueue and dequeue results with three jobs.
2. Replace repeated front shifts with a moving head position.
3. Check storage cleanup, empty reads, and a queue used by BFS.

## What the queue remembers

The **front** is the next item to leave. The **back** is where a new item joins. A queue does not choose the largest or smallest item; a [heap](../heap/README.md) does that. A [stack](../stack/README.md) removes the most recently added item instead.

```text
                       arrival direction
                              |
                              v
next to leave <-- [A] [B] [C] <-- new items
                  ^       ^
                front    back
```

After adding A, B, and C, the next removal must return A. B then becomes the front. No value comparison is involved. This makes queues useful for processing requests in arrival order and for [breadth-first search](../graphs/breadth-first-search/README.md), which explores nearby vertices before more distant ones.

## From a simple idea to an efficient implementation

`items.push(value)` and `items.shift()` express the right behavior. However, repeated `shift()` can require moving or reindexing the remaining elements. Removing n items that way can do quadratic work under the ordinary array model. Instead, keep a number named `head`: the position of the first unread item. Reading `items[head]` and increasing `head` leaves other items in place.

```text
positions       0     1     2     3
             +-----+-----+-----+-----+
items        | used| used|  C  |  D  |
             +-----+-----+-----+-----+
                          ^
                        head = 2
active queue: C, D        size = length - head = 2
```

The array can contain a used prefix and a live suffix. The **invariant** is that the live suffix, from `head` through `length - 1`, contains exactly the waiting values in arrival order. Appending extends that order. Removing its first entry returns the earliest remaining arrival and advances the boundary, preserving the invariant.

For one bounded traversal, a moving head is enough. For a reusable queue, clear consumed references and occasionally copy the live suffix into a fresh array. Otherwise a queue that repeatedly receives and processes objects can keep unnecessary storage alive.

## Complete reusable queue {/* #implementation */}

A `class` groups state and related functions. `new ArrayQueue()` creates a queue; `constructor` sets its initial state; `this` refers to that queue. A method is a function attached to it. `get size()` lets callers read `queue.size` like a property. These are ordinary JavaScript objects; see [objects and classes](../../javascript/objects-and-classes.md) for additional practice.

This queue accepts any value. `dequeue()` and `peek()` return `undefined` when empty; use `size` to distinguish an empty queue from a stored `undefined`. The underscore-free fields are visible for teaching; do not modify them outside the class.

```js runnable
class ArrayQueue {
  constructor() {
    this.items = [];
    this.head = 0;
  }

  get size() {
    return this.items.length - this.head;
  }

  enqueue(value) {
    this.items.push(value);
  }

  peek() {
    return this.items[this.head];
  }

  dequeue() {
    if (this.size === 0) return undefined;
    const value = this.items[this.head];
    this.items[this.head] = undefined; // Release a consumed object reference.
    this.head++;

    if (this.head * 2 >= this.items.length) {
      this.items = this.items.slice(this.head);
      this.head = 0;
    }
    return value;
  }
}

const queue = new ArrayQueue();
queue.enqueue("A");
queue.enqueue("B");
queue.enqueue("C");
console.log(queue.dequeue());
queue.enqueue("D");
console.log(queue.peek(), queue.size);
console.log(queue.dequeue(), queue.dequeue(), queue.dequeue());
console.log(queue.size, queue.dequeue());
```

```text output
A
B 3
B C D
0 undefined
```

The first removal returns A and leaves B at the front. Adding D puts it after C. Removing B makes half the backing array consumed, so the code copies C and D to positions 0 and 1. Their arrival order is unchanged. Emptying the queue eventually replaces its storage with an empty array and resets `head` to 0.

An individual compaction takes O(q) time for q waiting items. But it occurs only after at least as many items have been consumed as are copied. Charge each copied item to a distinct removal since the previous compaction; across many operations the total copying is linear. This is **amortized analysis**: occasional expensive operations are spread over the whole sequence. Enqueue and dequeue therefore have amortized O(1) cost under the dynamic-array model; `peek` and `size` are O(1). Live storage is O(q), and compaction temporarily needs another O(q) array. These are not worst-case O(1) removals.

## Variants and mistakes

- A **circular queue** reuses a fixed-capacity array: wrap each index using `(index + 1) % capacity`. Track a count so that equal front/back positions can be distinguished as empty or full. This avoids copying and gives worst-case O(1) operations with a fixed capacity.
- A **deque** permits insertion and removal at both ends. Sliding-window maximum needs a deque, not just this FIFO interface; see [monotonic queues](../monotonic-stack/README.md).
- Do not use `items.length` alone as the number waiting after introducing a head index. Subtract the consumed prefix.
- In graph BFS, mark a vertex as discovered when enqueuing it. Marking only on removal can enqueue the same vertex many times.
- Do not append to an array during a `for...of` loop unless processing newly appended values is intentional. Use explicit queue state to make the stopping rule clear.

## Understanding checks and graduated exercises

1. **Trace:** enqueue 4, enqueue 9, dequeue, enqueue 2, peek. What do the two queries return?
2. **Explain:** Why does clearing `items[head]` not delete an item that is still waiting?
3. **Implement:** Solve LC 232 using two stacks. First make it correct; then move values from the input stack only when the output stack is empty.
4. **Extend:** Solve LC 622 with a circular array. Explain how your representation distinguishes empty from full.
5. **Apply:** In a grid with unit-cost moves, use a queue to find the fewest moves to a target. Explain why the first discovery of a cell gives its shortest distance.

<details>
<summary>Hints</summary>

The front is the oldest waiting value. A removed value has already been saved in a local variable. Moving one stack into another reverses order. A circular queue can store an explicit element count. BFS processes distance 0, then distance 1, then distance 2, because every new neighbor goes behind all currently waiting vertices.

</details>

<details>
<summary>Answers and reasoning</summary>

The queries return 4 and 9. Clearing a consumed slot happens only after saving its value and before advancing `head`; the live suffix begins after that slot. In the two-stack solution, each item is pushed, moved, and removed at most once, so a sequence of operations has linear total work even though one transfer can be expensive. For a circular queue, `count === 0` is empty and `count === capacity` is full. For BFS, when exploring a cell at distance d, all undiscovered neighbors get distance d + 1; any shorter path would have come from an earlier processed layer. See the [BFS lesson](../graphs/breadth-first-search/README.md) for complete code and a trace.

</details>

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| <PracticeProblem id={232} title={"Implement Queue using Stacks"} text={"Problem statement\nImplement MyQueue using two stacks. push(x) adds at the back; pop() removes and returns the\nfront value; peek() returns the front without removal; empty() reports whether there are no\nelements. Use only stack operations: push, top, pop, size, and emptiness checks.\nInput \u0026 expected result\nEach example starts with a new queue. Report query results in call order; push has no return value.\nEXAMPLE 1\nOperations: push(4), push(7), peek(), pop(), empty()\nQuery results: [4,4,false]\nExplanation: The earliest inserted value leaves first, and 7 remains.\nEXAMPLE 2\nOperations: push(9), pop(), empty()\nQuery results: [9,true]\nExplanation: Removing the only item leaves an empty queue.\nConstraints \u0026 guarantees\n• 1 \u003c= x \u003c= 9\n• At most 100 calls will be made to push, pop, peek, and empty\n• pop and peek are called only on a nonempty queue\nJavaScript starter\nclass MyQueue {\n  constructor() { /* TODO */ }\n  push(x) { /* TODO */ }\n  pop() { /* TODO */ }\n  peek() { /* TODO */ }\n  empty() { /* TODO */ }\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/implement-queue-using-stacks/) | — |
| [LC 1700 — Number of Students Unable to Eat Lunch](https://leetcode.com/problems/number-of-students-unable-to-eat-lunch/) | Easy | [LeetCode](https://leetcode.com/problems/number-of-students-unable-to-eat-lunch/) | — |
| <PracticeProblem id={362} title={"Design Hit Counter"} text={"Problem statement\nImplement HitCounter. hit(timestamp) records one event; getHits(timestamp) returns the count in\nthe last 300 seconds, including the current second. An event at time t counts when timestamp -\n300 \u003c t \u003c= timestamp. Calls arrive in chronological order, and multiple events may share a\ntimestamp.\nInput \u0026 expected result\nEach example uses a new counter. hit has no return value; count every event, including repeated\ntimestamps.\nEXAMPLE 1\nOperations: hit(10), hit(10), getHits(309), getHits(310)\nQuery results: [2,0]\nExplanation: Both hits are 299 seconds old at 309 and expire at 310.\nEXAMPLE 2\nOperations: getHits(1), hit(2), getHits(2)\nQuery results: [0,1]\nExplanation: A new counter is empty; a hit counts immediately.\nConstraints \u0026 guarantees\n• Timestamps are positive integers in seconds, received in nondecreasing order.\n• Several hits may have the same timestamp.\nPremium source: current numeric bounds could not be publicly verified.\nJavaScript starter\nclass HitCounter {\n  constructor() { /* TODO */ }\n  hit(timestamp) { /* TODO */ }\n  getHits(timestamp) { /* TODO */ }\n}"} /> | Medium · Premium | [LeetCode](https://leetcode.com/problems/design-hit-counter/) | — |
| [LC 622 — Design Circular Queue](https://leetcode.com/problems/design-circular-queue/) | Medium | [LeetCode](https://leetcode.com/problems/design-circular-queue/) | — |
| <PracticeProblem id={1438} title={"Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit"} text={"Problem statement \u0026 expected result\nReturn the length of the longest contiguous segment in which the difference between any two values is at most\nlimit. Equivalently, its maximum minus its minimum must not exceed limit.\nEXAMPLE 1\nInput: nums = [8,2,4,7], limit = 4\nOutput: 2\nExplanation: The longest qualifying run has two elements, such as [2,4].\nEXAMPLE 2\nInput: nums = [10,1,2,4,7,2], limit = 5\nOutput: 4\nExplanation: The run [2,4,7,2] has range 5 and length 4.\nConstraints \u0026 guarantees\n- 1 \u003c= nums.length \u003c= 10^5\n- 1 \u003c= nums[i] \u003c= 10^9\n- 0 \u003c= limit \u003c= 10^9\nJavaScript starter\nfunction longestSubarray(nums, limit) {\n// TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/) | — |
| <PracticeProblem id={1696} title={"Jump Game VI"} text={"Problem statement \u0026 expected result\nStart at index 0 and reach the final index. Each jump advances between 1 and k positions without leaving the\narray. The score sums values at all visited indices, including both endpoints. Return the largest possible score.\nEXAMPLE 1\nInput: nums = [1,-1,-2,4,-7,3], k = 2\nOutput: 7\nExplanation: Visit indices 0,1,3,5 for score 1-1+4+3 = 7.\nEXAMPLE 2\nInput: nums = [10,-5,-2,4,0,3], k = 3\nOutput: 17\nExplanation: Visit indices 0,3,5 for score 10+4+3 = 17.\nConstraints \u0026 guarantees\n- 1 \u003c= nums.length, k \u003c= 10^5\n- -10^4 \u003c= nums[i] \u003c= 10^4\nJavaScript starter\nfunction maxResult(nums, k) {\n// TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/jump-game-vi/) | — |
| <PracticeProblem id={862} title={"Shortest Subarray with Sum at Least K"} text={"Problem statement \u0026 expected result\nFind the shortest nonempty contiguous segment whose sum is at least k. Negative values are allowed. Return its\nlength, or -1 if every segment falls short.\nEXAMPLE 1\nInput: nums = [1], k = 1\nOutput: 1\nExplanation: The single element meets the required sum.\nEXAMPLE 2\nInput: nums = [1,2], k = 4\nOutput: -1\nExplanation: Even the entire array sums to only 3.\nConstraints \u0026 guarantees\n- 1 \u003c= nums.length \u003c= 10^5\n- -10^5 \u003c= nums[i] \u003c= 10^5\n- 1 \u003c= k \u003c= 10^9\nJavaScript starter\nfunction shortestSubarray(nums, k) {\n// TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/) | — |
| <PracticeProblem id={1425} title={"Constrained Subsequence Sum"} text={"Problem statement \u0026 expected result\nChoose a nonempty subsequence maximizing its sum. Selected indices must increase, and the gap between\nconsecutive selected indices must be at most k. You may start and finish anywhere. Return the maximum sum,\nincluding a negative result when all choices are negative.\nEXAMPLE 1\nInput: nums = [10,2,-10,5,20], k = 2\nOutput: 37\nExplanation: Choose [10,2,5,20]; every consecutive selected-index gap is at most 2.\nEXAMPLE 2\nInput: nums = [-1,-2,-3], k = 1\nOutput: -1\nExplanation: Choose just -1; an empty subsequence is not allowed.\nConstraints \u0026 guarantees\n- 1 \u003c= k \u003c= nums.length \u003c= 10^5\n- -10^4 \u003c= nums[i] \u003c= 10^4\nJavaScript starter\nfunction constrainedSubsetSum(nums, k) {\n// TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/constrained-subsequence-sum/) | — |
| <PracticeProblem id={1499} title={"Max Value of Equation"} text={"Problem statement \u0026 expected result\nPoints are sorted by strictly increasing x-coordinate. Choose two distinct points whose x-distance is at most k and\nmaximize yi + yj + abs(xi - xj). Return the maximum equation value. At least one eligible pair is guaranteed.\nEXAMPLE 1\nInput: points = [[1,3],[2,0],[5,10],[6,-10]], k = 1\nOutput: 4\nExplanation: The eligible adjacent-x pairs yield values 4 and 1.\nEXAMPLE 2\nInput: points = [[0,0],[3,0],[9,2]], k = 3\nOutput: 3\nExplanation: Only the first two points meet the x-distance limit.\nConstraints \u0026 guarantees\n- 2 \u003c= points.length \u003c= 10^5\n- points[i].length == 2\n- -10^8 \u003c= xi, yi \u003c= 10^8\n- 0 \u003c= k \u003c= 2 * 10^8\n- xi \u003c xj for all 1 \u003c= i \u003c j \u003c= points.length\n- xi form a strictly increasing sequence.\nJavaScript starter\nfunction findMaxValueOfEquation(points, k) {\n// TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/max-value-of-equation/) | — |

{/* END GENERATED PRACTICE PROBLEMS */}

## References

- [Wikipedia](<https://en.wikipedia.org/wiki/Queue_(abstract_data_type)>)
- [YouTube](https://www.youtube.com/watch?v=wjI1WNcIntg&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=3&)

**Next:** [sorting](../sorting/README.md).
