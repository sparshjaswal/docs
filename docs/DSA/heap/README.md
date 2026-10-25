---
id: dsa-heap-readme
title: "Heap (Priority Queue)"
slug: /DSA/heap/README
sidebar_label: "Heaps"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Heap (Priority Queue)

A heap keeps the smallest or largest value ready to remove. Imagine tasks arriving with costs 5, 1, and 3. If you always need the cheapest waiting task, arrival order is unhelpful: the answer is 1 even though 5 arrived first. This is a **priority queue**. A binary heap is one efficient way to implement it.

**Before this lesson:** know [arrays and comparators](../javascript-for-dsa.md), [binary trees](../trees/README.md), and logarithmic complexity. You will learn the heap invariant, implement a comparator-based heap, and use it to keep only the best k candidates.

## Learning steps

A task scheduler repeatedly needs the most urgent waiting task. It does not need every other task fully sorted.

1. Read the parent-child rule and map tree positions to array indices.
2. Trace upward repair after insertion and downward repair after removal.
3. Keep the best k candidates while testing ties and an empty heap.

## Intuition before implementation

An unsorted array has cheap insertion, but finding the minimum requires a full scan. Sorting after every insertion keeps the minimum easy to find but does much unnecessary work. A heap maintains just enough order: in a **min-heap**, every parent is no larger than either child. A **max-heap** reverses that comparison.

```text
Tree positions                 Same nodes in an array
            1                  position: 0  1  2  3  4
           / \                 value:   [1, 4, 3, 8, 6]
          4   3
         / \
        8   6
```

Every parent is at most its children, so following a path from the root can never reach a smaller value. The root is therefore the global minimum. But 4 precedes 3 in the array: **a heap is not a fully sorted array**. The tree is **complete**: all levels except possibly the last are full, and the last fills left to right. Completeness allows array storage and keeps the height O(log n).

For a node at index `index`, its left child is `2 * index + 1`, its right child is `2 * index + 2`, and its parent is `Math.floor((index - 1) / 2)`. There is no parent for index 0. These positions are not values or priorities.

<AlgorithmWalkthrough name="heap" />

## Repair the one path that changed

**Insertion:** append the new value at the next open position. Compare it with its parent and swap while it should come earlier. This is **sifting up**. All old parent-child relationships were valid; only the new value's upward path can violate the rule.

**Removal:** save the root, move the last item into its place, then swap it with its smaller child while necessary. This is **sifting down**. Choose the smaller child so that the promoted child is no larger than either of its new children. Stop when the replacement belongs above both children or reaches a leaf.

For `[1, 4, 3, 8, 6]`, inserting 2 appends at index 5. Its parent is index 2, containing 3, so swap them. The new parent is 1, so stop: `[1, 4, 2, 8, 6, 3]`. Removing 1 then moves 3 to the root and swaps it with 2, yielding `[2, 4, 3, 8, 6]`. Only the affected path changed, so all other valid relationships stayed valid. Together with the root-minimum argument, this proves that `pop()` returns the next smallest value.

## Complete comparator heap {/* #implementation */}

The comparator returns a negative number when its first argument should come earlier. The default gives a min-heap of finite Numbers. `(a, b) => b - a` gives a max-heap. For records, compare the priority field and optionally a unique sequence number to break ties. The comparator must be consistent; do not mutate a stored priority without repairing the heap.

`constructor` sets up a new object, `this` refers to it, and `get size()` exposes the number of waiting values. Both `peek()` and `pop()` return `undefined` on an empty heap. If you store `undefined`, use `size` to test emptiness and provide a comparator that handles it. The visible fields are for learning; callers should use the methods.

```js runnable
class BinaryHeap {
  constructor(compare = (first, second) => first - second, values = []) {
    this.compare = compare;
    this.data = values.slice(); // Preserve the caller's array.
    for (let index = Math.floor(this.data.length / 2) - 1; index >= 0; index--) {
      this.siftDown(index);
    }
  }

  get size() {
    return this.data.length;
  }

  peek() {
    return this.data[0];
  }

  push(value) {
    let index = this.data.push(value) - 1;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(this.data[parent], this.data[index]) <= 0) break;
      [this.data[parent], this.data[index]] = [this.data[index], this.data[parent]];
      index = parent;
    }
  }

  pop() {
    if (this.size === 0) return undefined;
    const answer = this.data[0];
    const last = this.data.pop();
    if (this.size > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return answer;
  }

  siftDown(index) {
    while (true) {
      const left = 2 * index + 1;
      if (left >= this.size) break;
      const right = left + 1;
      let bestChild = left;
      if (right < this.size && this.compare(this.data[right], this.data[left]) < 0) {
        bestChild = right;
      }
      if (this.compare(this.data[index], this.data[bestChild]) <= 0) break;
      [this.data[index], this.data[bestChild]] = [this.data[bestChild], this.data[index]];
      index = bestChild;
    }
  }
}

const minimums = new BinaryHeap((a, b) => a - b, [5, 1, 3]);
minimums.push(2);
console.log(minimums.peek(), minimums.size);
console.log(minimums.pop(), minimums.pop(), minimums.pop(), minimums.pop());
console.log(minimums.pop());

const tasks = new BinaryHeap((a, b) => a.cost - b.cost || a.order - b.order);
tasks.push({ name: "late", cost: 5, order: 1 });
tasks.push({ name: "early", cost: 5, order: 0 });
console.log(tasks.pop().name);
```

```text output
1 4
1 2 3 5
undefined
early
```

The constructor runs bottom-up **heapify**: leaves are already valid heaps; each downward repair combines a parent with valid child heaps. This proves the entire structure is a heap when the root is repaired. Heapify takes O(n), not O(n log n): about half the nodes are leaves, a quarter can move only one level, an eighth only two, and so on. The total is bounded by n times the convergent series `1/2 + 2/4 + 3/8 + ...`.

| Operation | Time | Extra space beyond stored heap |
| --- | --- | --- |
| `peek`, `size` | O(1) | O(1) |
| `push`, `pop` | O(log n) comparisons; dynamic-array append is amortized | O(1), excluding backing-array growth |
| Construct from n values | O(n) | O(n), because this implementation copies the input |
| Extract all values in order | O(n log n) | O(n) if collecting the output |

The heap itself stores O(n) values. These costs assume a constant-time comparator. BigInt comparisons, long strings, or expensive computed priorities need their comparison cost included.

## Keep the largest k values

For the kth largest of n values, sorting a copy is a useful O(n log n) baseline. To keep only k candidates, use a **min-heap of the largest k values seen so far**. Its root is the weakest retained candidate. After inserting a new value, remove the minimum if size exceeds k. A discarded value cannot belong ahead of the k retained values; this preserves the selection invariant.

For input `[4, 1, 7, 3]` and k = 2, the retained sets after each arrival are `{4}`, `{1, 4}`, `{4, 7}`, `{4, 7}`. The minimum retained value is 4, the second largest. Duplicates count as separate occurrences. See the [complete kth-largest implementation](./LC-215-kth-largest-element-in-an-array/index.mdx) for runnable code and tests. Selection takes O(n log(k + 1)) time and O(k) space; `k + 1` keeps the statement meaningful when k is 1. For a one-off selection, quickselect is another choice; a heap also works with a stream of arrivals.

## Recognize other heap problems

- **Merge k sorted lists:** keep the next available item from each list. After removing the global minimum, insert the next item from that same list. Every unqueued item follows a queued item in its own sorted list, so it cannot be a smaller next answer. For n total items, time is O(n log(k + 1)), auxiliary heap storage O(k).
- **Median from a stream:** keep the lower half in a max-heap and the upper half in a min-heap. Every lower-half value must be at most every upper-half value, and their sizes differ by at most one. Move roots to rebalance after insertion. One middle root, or the average of two middle roots, gives the median.
- **Shortest paths with nonnegative edge weights:** the next unsettled minimum distance belongs in a heap. When decrease-key is inconvenient, insert an improved record and skip stale records on removal. Read [Dijkstra's algorithm](../graphs/dijkstra/README.md) for its additional correctness conditions.

Try the workbook and practice problems below in order: explain the invariant, implement the simple heap operations, solve kth largest, then combine heaps with another technique. These patterns are guides, not substitutes for proving the problem's particular rule.

## Pitfalls

- A heap orders parents against children, not siblings. Binary-searching its backing array is invalid.
- An ordinary heap is not automatically stable for equal priorities. Add a sequence number if arrival order matters.
- A min-heap is appropriate for retaining the largest k; its root is the first retained value to discard.
- Check the empty and single-item cases before assigning the replacement root. Otherwise removal can accidentally recreate a removed item.
- Re-sorting on every insertion is a valid baseline with different complexity, not a binary-heap implementation.

## Worked examples and answers {/* #workbook-practice */}

Attempt the linked [Practice Problems](#practice-problems) before opening their answers. See the [workbook guide](../../javascript/workbook.md) for the A–C exercise format.

### 38. Heaps and priority queues {/* #workbook-38 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** remove the next smallest item without sorting after every insertion.

Review [the heap shape](#intuition-before-implementation) and [repairing one path](#repair-the-one-path-that-changed). A min-heap keeps each parent no larger than its children. It does not sort the entire array. The example below uses the same array-to-tree relationship with a smaller numeric interface.

Appending and sifting upward, or replacing the root and sifting downward, takes O(log n) work. Reading the root takes O(1). Bottom-up construction takes O(n), while repeated insertion can take O(n log n). Use `Math.floor` for general index arithmetic rather than a 32-bit shortcut.

For records, see the [priority-queue contract](../priority-queue/README.md): compare the priority and use a sequence number when equal priorities must retain arrival order. Changing a queued priority requires repairing its position, or inserting a replacement record and ignoring the stale one later.

**Worked example**

```js runnable
class MinHeap {
  data = [];
  push(value) {
    const a = this.data;
    let i = a.push(value) - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (a[p] <= a[i]) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop() {
    const a = this.data;
    if (a.length === 0) return undefined;
    const answer = a[0];
    const last = a.pop();
    if (a.length === 0) return answer;
    a[0] = last;
    let i = 0;
    while (true) {
      let child = i * 2 + 1;
      if (child >= a.length) break;
      if (child + 1 < a.length && a[child + 1] < a[child]) child++;
      if (a[i] <= a[child]) break;
      [a[i], a[child]] = [a[child], a[i]];
      i = child;
    }
    return answer;
  }
}
const heap = new MinHeap();
[5, 1, 3].forEach(x => heap.push(x));
console.log(heap.pop(), heap.pop(), heap.pop());
```

```text output
1 3 5
```

**Why the example works**

Inserting 1 moves it above 5. Inserting 3 leaves it below 1. Removing 1 places the final value at the root and repairs the parent rule. Repeating removal yields sorted output even though the heap array was never fully sorted after each insertion. This implementation accepts finite numbers and exposes data for teaching; encapsulate it in production.

</details>

Find **38A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-38-answer">
<summary>Check your reasoning and answer</summary>

For Node checks, add `import assert from "node:assert/strict";` at the top of your file. Browser and multi-file examples use the setup stated above.

**38A.** No. Each parent is ordered relative to its children, but siblings and unrelated branches need not be ordered. Only the root is guaranteed to be the global minimum.

**38B.** If the larger child moved upward while the smaller child remained below it, the parent rule could still fail. Choosing the smaller child restores both immediate comparisons.

**38C.** Insert every value, then remove up to k minima. This simple version takes O(n log n + k log n) with k capped at n and O(n) space. A size-k max-heap can reduce storage when k is much smaller than n.

**Reference code**

Use the worked example above first if the answer calls its functions or classes. Run each lesson in its own `.mjs` file.

```js
function smallestK(values, k) {
  if (!Number.isInteger(k) || k < 0) throw new RangeError("Invalid k");
  const heap = new MinHeap();
  for (const value of values) heap.push(value);
  const result = [];
  for (let i = 0; i < Math.min(k, values.length); i++) {
    result.push(heap.pop());
  }
  return result;
}
```

**Check the result**

```js
assert.deepEqual(smallestK([3, 1, 1, -2], 3), [-2, 1, 1]);
assert.deepEqual(smallestK([], 2), []);
assert.deepEqual(smallestK([2], 0), []);
assert.throws(() => smallestK([2], -1));
```

</details>

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **38A — Is a heap array fully sorted?** | **Must fix** | [Worked example](#workbook-38) | [Answer](#workbook-38-answer) |
| **38B — Why choose the smaller child during a min-heap removal?** | **Must fix** | [Worked example](#workbook-38) | [Answer](#workbook-38-answer) |
| **38C — Using MinHeap, implement smallestK(values, k). Return the smallest min(k, n) finite numbers in sorted order; k is a nonnegative integer.** | **Must fix** | [Worked example](#workbook-38) | [Answer](#workbook-38-answer) |
| <PracticeProblem id={703} title={"Kth Largest Element in a Stream"} text={"Problem statement\nImplement KthLargest(k,nums) for a stream initialized with nums. add(val) appends a value and\nreturns the kth largest value seen so far, counting duplicates separately. k stays fixed. Calls that\nrequire an answer have at least k total values after insertion. The initial array may be empty when\ncompatible with that rule.\nInput \u0026 expected result\nThe constructor establishes k and the initial stream; every add both changes the stream and\nreturns its current rank statistic. The answer is the kth entry in descending order, including\nrepeated values, rather than the kth distinct value.\nEXAMPLE 1\nWith k = 2 and nums = [4,7]: add(5), add(9), add(1)\nReturn values: 5, 7, 7\nExplanation: After each insertion, the two largest values are respectively 7,5; 9,7; and 9,7, so\nthe returned second-largest values are 5,7,7.\nEXAMPLE 2\nWith k = 1 and nums = []: add(-3), add(2), add(2)\nReturn values: -3, 2, 2\nExplanation: Rank 1 is the maximum seen so far, and repeating the maximum does not change\nit.\nConstraints \u0026 guarantees\n• nums.length: 0 through 10^4 (inclusive)\n• k: 1 through nums.length + 1 (inclusive)\n• nums[i]: -10^4 through 10^4 (inclusive)\n• val: -10^4 through 10^4 (inclusive)\n• add calls: at most 10^4\nJavaScript starter\nclass KthLargest {\n  constructor(k, nums) { /* TODO */ }\n  add(val) { /* TODO */ }\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/kth-largest-element-in-a-stream/) | — |
| <PracticeProblem id={1046} title={"Last Stone Weight"} text={"Problem statement\nstones contains positive weights. Repeatedly select the two heaviest stones. If their weights\nmatch, destroy both; otherwise destroy the lighter and replace the heavier by their positive weight\ndifference. Continue until at most one stone remains. Return its weight, or 0 if all stones disappear.\nInput \u0026 expected result\nReevaluate which stones are heaviest after every smash, since a replacement stone can be\nselected again. Equal-weight stones both disappear. Return a single final weight, not the sum of\nweights before the process finishes.\nEXAMPLE 1\nInput: stones = [2,7,4]\nOutput: 1\nExplanation: Weights 7 and 4 leave a stone of weight 3. Smashing 3 with 2 leaves the final\nweight 1.\nEXAMPLE 2\nInput: stones = [5,5]\nOutput: 0\nExplanation: The equally heavy stones destroy each other, leaving no stone.\nConstraints \u0026 guarantees\n• stones.length: 1 through 30 (inclusive)\n• stones[i]: 1 through 1000 (inclusive)\nJavaScript starter\nfunction lastStoneWeight(stones) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/last-stone-weight/) | — |
| <PracticeProblem id={215} title={"Kth Largest Element in an Array"} text={"Problem statement\nReturn the kth largest element of nums when all values are ordered from largest to smallest. Count\nduplicate occurrences separately; this is not the kth distinct value. k is valid. Find an approach that\ndoes not require sorting the entire array.\nInput \u0026 expected result\nk is a one-based rank in descending order. Return a value rather than its position in nums.\nRepeated values occupy separate ranks, so the result can equal the maximum even when k is\ngreater than one.\nEXAMPLE 1\nInput: nums = [7,2,7,4], k = 2\nOutput: 7\nExplanation: The descending order is 7,7,4,2. The second entry is still 7 because duplicate\noccurrences count separately.\nEXAMPLE 2\nInput: nums = [5,1,3], k = 3\nOutput: 1\nExplanation: The third largest of three entries is the smallest entry.\nConstraints \u0026 guarantees\n• 1 \u003c= k \u003c= nums.length \u003c= 10^5\n• nums[i]: -10^4 through 10^4 (inclusive)\nJavaScript starter\nfunction findKthLargest(nums, k) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/kth-largest-element-in-an-array/) | [Example](./LC-215-kth-largest-element-in-an-array/index.mdx) |
| <PracticeProblem id={347} title={"Top K Frequent Elements"} text={"Problem statement\nReturn the k distinct values occurring most frequently in nums. k is valid, and the set of values in\nthe answer is uniquely determined. The result may be in any order. Your algorithm should run\nfaster than O(n log n), where n is the array length.\nInput \u0026 expected result\nk counts distinct values in the result, not input occurrences. Frequency determines priority;\nnumerical value is not the sorting criterion. The answer order is unrestricted.\nEXAMPLE 1\nInput: nums = [2,2,2,7,7,9], k = 2\nOutput: [2,7]\nExplanation: The frequencies are 3 for 2, 2 for 7, and 1 for 9, so the first two values are selected.\nEXAMPLE 2\nInput: nums = [9,9,9], k = 1\nOutput: [9]\nExplanation: Only one distinct value exists, regardless of its number of repetitions.\nConstraints \u0026 guarantees\n• nums.length: 1 through 10^5 (inclusive)\n• nums[i]: -10^4 through 10^4 (inclusive)\n• k: 1 through the number of distinct input values. The selected set is uniquely determined\nJavaScript starter\nfunction topKFrequent(nums, k) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/top-k-frequent-elements/) | [Example](../hashing/LC-347-top-k-frequent-elements/index.mdx) |
| <PracticeProblem id={355} title={"Design Twitter"} text={"Problem statement\nImplement Twitter. postTweet(userId,tweetId) creates a globally unique tweet.\nfollow(followerId,followeeId) and unfollow(...) change whose tweets the follower sees.\ngetNewsFeed(userId) returns at most ten newest tweet IDs from that user's own tweets and their\ncurrent followees, newest first. A user's own tweets remain visible without following themselves.\nThe constructor creates an empty service.\nInput \u0026 expected result\nMaintain users, follow relationships, and posting order across method calls. A feed includes earlier\ntweets from a currently followed user, not only tweets posted after following. Unfollowing removes\nthat user's tweets from subsequent feeds without deleting the tweets.\nEXAMPLE 1\npostTweet(1,11), postTweet(2,22), follow(1,2), getNewsFeed(1)\nFeed result: [22,11]\nExplanation: Tweet 22 was posted after tweet 11. Following user 2 allows user 1 to see both,\nwith 22 first.\nEXAMPLE 2\npostTweet(1,10), postTweet(2,20), follow(1,2), unfollow(1,2), getNewsFeed(1)\nFeed result: [10]\nExplanation: After unfollowing user 2, user 1 still sees their own tweet but no longer sees tweet\n20.\nConstraints \u0026 guarantees\n• userId, followerId, followeeId: 1 through 500 (inclusive)\n• tweetId: 0 through 10^4 (inclusive)\n• Tweet identifiers never repeat. Combined method calls: at most 3 * 10^4. Self-follow operations are\nexcluded\nJavaScript starter\nclass Twitter {\n  constructor() { /* TODO */ }\n  postTweet(userId, tweetId) { /* TODO */ }\n  getNewsFeed(userId) { /* TODO */ }\n  follow(followerId, followeeId) { /* TODO */ }\n  unfollow(followerId, followeeId) { /* TODO */ }\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/design-twitter/) | — |
| <PracticeProblem id={373} title={"Find K Pairs with Smallest Sums"} text={"Problem statement\nnums1 and nums2 are each sorted ascending. A pair chooses one element from each array, and its\nscore is their sum. Return k pairs with the smallest sums; k does not exceed the number of\navailable index pairs. Distinct index choices count separately even when values repeat.\nEqual-score pairs may be chosen in any order.\nInput \u0026 expected result\nEach returned pair has its first value from nums1 and its second from nums2. A source element\nmay participate in several pairs with different partner indices. Preserve duplicate pairs when they\narise from different index combinations among the k selected results.\nEXAMPLE 1\nInput: nums1 = [1,4], nums2 = [2,5], k = 2\nOne valid result: [[1,2],[1,5]]\nExplanation: The smallest sum is 1 + 2 = 3. The next sum is 6, shared by [1,5] and [4,2], so\neither tied pair may be second.\nEXAMPLE 2\nInput: nums1 = [1,1], nums2 = [2], k = 2\nOutput: [[1,2],[1,2]]\nExplanation: The two equal values in nums1 occupy different indices and create two available\npairs.\nConstraints \u0026 guarantees\n• nums1.length, nums2.length: 1 through 10^5 (inclusive)\n• nums1[i], nums2[i]: -10^9 through 10^9 (inclusive)\n• k: 1 through 10^4 (inclusive)\n• k \u003c= nums1.length * nums2.length\n• Both input arrays are nondecreasing\nJavaScript starter\nfunction kSmallestPairs(nums1, nums2, k) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/) | — |
| <PracticeProblem id={692} title={"Top K Frequent Words"} text={"Problem statement\nReturn the k most frequent distinct words. Order the result from highest frequency to lowest;\nwords with equal counts must appear in lexicographic order.\nInput \u0026 expected result\nReturn each selected word once, even if it appears many times in the input.\nEXAMPLE 1\nInput: words = [\"tea\",\"eat\",\"tea\",\"ate\",\"eat\"], k = 2\nOutput: [\"eat\",\"tea\"]\nExplanation: Both words occur twice; eat comes before tea lexicographically.\nEXAMPLE 2\nInput: words = [\"b\",\"a\",\"c\"], k = 2\nOutput: [\"a\",\"b\"]\nExplanation: All frequencies tie, so lexicographic order determines the first two.\nConstraints \u0026 guarantees\n• 1 \u003c= words.length \u003c= 500\n• 1 \u003c= words[i].length \u003c= 10\n• Words use lowercase English letters\n• k is in the range [1, The number of unique words[i]]\nJavaScript starter\nfunction topKFrequent(words, k) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/top-k-frequent-words/) | — |
| <PracticeProblem id={973} title={"K Closest Points to Origin"} text={"Problem statement\npoints contains two-dimensional coordinates. Return the k points with the smallest Euclidean\ndistance from the origin [0,0]. Output order does not matter. k is valid, and the selected set is\nguaranteed to be uniquely determined apart from ordering. You may compare squared distances\nrather than taking square roots.\nInput \u0026 expected result\nThe Euclidean distance of [x,y] is sqrt(x*x + y*y); negative coordinates are allowed. Return\ncoordinate pairs rather than distances or indices. Every returned point must come from the input,\nand the result contains exactly k points.\nEXAMPLE 1\nInput: points = [[1,1],[3,0],[-1,0]], k = 2\nOutput: [[1,1],[-1,0]]\nExplanation: The squared distances are 2,9,1. The points with squared distances 1 and 2 are the\ntwo closest.\nEXAMPLE 2\nInput: points = [[-2,-2],[0,1],[5,0]], k = 1\nOutput: [[0,1]]\nExplanation: Its squared distance is 1, smaller than 8 and 25 for the other points.\nConstraints \u0026 guarantees\n• 1 \u003c= k \u003c= points.length \u003c= 10^4\n• x_i, y_i: -10^4 through 10^4 (inclusive)\nJavaScript starter\nfunction kClosest(points, k) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/k-closest-points-to-origin/) | — |
| [LC 1167 — Minimum Cost to Connect Sticks](https://leetcode.com/problems/minimum-cost-to-connect-sticks/) | Medium · Premium | [LeetCode](https://leetcode.com/problems/minimum-cost-to-connect-sticks/) | — |
| <PracticeProblem id={23} title={"Merge k Sorted Lists"} text={"Problem statement\nlists contains the heads of k singly linked lists, each sorted in ascending order. Combine every node\ninto one ascending list and return its head. Some lists may be empty, k may be zero, and repeated\nvalues must all remain in the merged result.\nInput \u0026 expected result\nThe lists array contains node references, including possible null entries. The result must include\nvalues from every nonempty input in nondecreasing order. Return null when all lists are empty,\nincluding when the outer array itself is empty.\nEXAMPLE 1\nInput: lists = [[1,5],[2,4],[3]]\nReturn list: [1,2,3,4,5]\nExplanation: The five nodes across the three inputs interleave into the single ascending\nsequence 1,2,3,4,5.\nEXAMPLE 2\nInput: lists = [[],[2,2],[]]\nReturn list: [2,2]\nExplanation: Empty lists contribute nothing, while both equal-valued nodes in the remaining list\nare retained.\nConstraints \u0026 guarantees\n• k == lists.length\n• k: 0 through 10^4 (inclusive)\n• lists[i].length: 0 through 500 (inclusive)\n• lists[i][j]: -10^4 through 10^4 (inclusive)\n• Each list's values are nondecreasing. Across all lists, the total node count is at most 10^4\nJavaScript starter\nfunction mergeKLists(lists) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/merge-k-sorted-lists/) | — |
| <PracticeProblem id={295} title={"Find Median from Data Stream"} text={"Problem statement\nImplement MedianFinder for a stream of integers. addNum(num) inserts one occurrence.\nfindMedian() returns the middle value of the sorted data for an odd count, or the mean of the\nmiddle two for an even count. It is called only after at least one insertion. The constructor begins\nwith an empty stream.\nInput \u0026 expected result\nThe data structure retains every inserted occurrence, including duplicates and negative values.\nfindMedian is a query and must not remove data. For an even count, the result can be fractional;\nanswers within 10^-5 of the true value are accepted.\nEXAMPLE 1\nOperations: addNum(4), addNum(10), findMedian(), addNum(6), findMedian()\nMedian results: 7, 6\nExplanation: With 4 and 10, the median is their average, 7. Adding 6 makes the sorted middle\nvalue 6.\nEXAMPLE 2\nOperations: addNum(-2), addNum(3), findMedian()\nMedian result: 0.5\nExplanation: The two sorted values have arithmetic mean (-2 + 3) / 2 = 0.5.\nConstraints \u0026 guarantees\n• num: -10^5 through 10^5 (inclusive)\n• Median queries require at least one inserted value. Combined method calls: at most 5 * 10^4\nJavaScript starter\nclass MedianFinder {\n  constructor() { /* TODO */ }\n  addNum(num) { /* TODO */ }\n  findMedian() { /* TODO */ }\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/find-median-from-data-stream/) | — |
| [LC 407 — Trapping Rain Water II](https://leetcode.com/problems/trapping-rain-water-ii/) | Hard | [LeetCode](https://leetcode.com/problems/trapping-rain-water-ii/) | — |
| [LC 480 — Sliding Window Median](https://leetcode.com/problems/sliding-window-median/) | Hard | [LeetCode](https://leetcode.com/problems/sliding-window-median/) | — |
| <PracticeProblem id={632} title={"Smallest Range Covering Elements from K Lists"} text={"Problem statement\nFind a closed interval [a,b] containing at least one value from every sorted input list. Minimize b - a.\nIf several ranges have equal length, choose the one with the smallest left endpoint.\nInput \u0026 expected result\nReturn the two endpoints. Each input list is nonempty and sorted in nondecreasing order.\nEXAMPLE 1\nInput: nums = [[1,5],[4,6],[3,7]]\nOutput: [3,5]\nExplanation: The range contains 5, 4, and 3. No shorter interval reaches all three lists.\nEXAMPLE 2\nInput: nums = [[2,8],[2,9]]\nOutput: [2,2]\nExplanation: The shared value 2 covers both lists with a zero-length range.\nConstraints \u0026 guarantees\n• nums.length == k\n• 1 \u003c= k \u003c= 3500\n• 1 \u003c= nums[i].length \u003c= 50\n• -10^5 \u003c= nums[i][j] \u003c= 10^5\n• nums[i] is sorted in non-decreasing order\nJavaScript starter\nfunction smallestRange(nums) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/) | — |
| [LC 716 — Max Stack](https://leetcode.com/problems/max-stack/) | Hard · Premium | [LeetCode](https://leetcode.com/problems/max-stack/) | — |
| <PracticeProblem id={895} title={"Maximum Frequency Stack"} text={"Problem statement\nImplement FreqStack. push(val) adds an occurrence. pop() removes and returns a value with the\nhighest current frequency. When several values tie, remove the most recently pushed occurrence\namong those tied values. Later pops use the updated frequencies.\nInput \u0026 expected result\nEach example begins with an empty stack. pop is called only when the structure is nonempty.\nEXAMPLE 1\nOperations: push(2), push(7), push(2), push(7),\npush(9), pop(), pop()\nQuery results: [7,2]\nExplanation: 2 and 7 initially tie at frequency two; 7 was pushed later. After that pop, 2 is most\nfrequent.\nEXAMPLE 2\nOperations: push(4), push(8), pop()\nQuery results: [8]\nExplanation: Both frequencies are one, so the newest occurrence wins.\nConstraints \u0026 guarantees\n• 0 \u003c= val \u003c= 10^9\n• At most 2 * 10^4 calls will be made to push and pop\n• pop is called only when at least one occurrence is stored\nJavaScript starter\nclass FreqStack {\n  constructor() { /* TODO */ }\n  push(val) { /* TODO */ }\n  pop() { /* TODO */ }\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/maximum-frequency-stack/) | — |
| G36 — Construct minimum-cost prefix codes from symbol frequencies. | Exercise | Greedy | — |
| [CC — IPC Trainers (IPCTRAIN)](https://www.codechef.com/problems/IPCTRAIN) | Hard | — |  |
| [LC 1337 — The K Weakest Rows in a Matrix](https://leetcode.com/problems/the-k-weakest-rows-in-a-matrix/) | Easy | [LeetCode](https://leetcode.com/problems/the-k-weakest-rows-in-a-matrix/) |  |
| [LC 1464 — Maximum Product of Two Elements in an Array](https://leetcode.com/problems/maximum-product-of-two-elements-in-an-array/) | Easy | [LeetCode](https://leetcode.com/problems/maximum-product-of-two-elements-in-an-array/) |  |
| [LC 1845 — Seat Reservation Manager](https://leetcode.com/problems/seat-reservation-manager/) | Medium | [LeetCode](https://leetcode.com/problems/seat-reservation-manager/) |  |
| [LC 1353 — Maximum Number of Events That Can Be Attended](https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/) | Medium | [LeetCode](https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/) |  |
| [LC 1834 — Single-Threaded CPU](https://leetcode.com/problems/single-threaded-cpu/) | Medium | [LeetCode](https://leetcode.com/problems/single-threaded-cpu/) |  |
| [LC 2542 — Maximum Subsequence Score](https://leetcode.com/problems/maximum-subsequence-score/) | Medium | [LeetCode](https://leetcode.com/problems/maximum-subsequence-score/) |  |
| [CC — Heap Operations (HEAPOPS)](https://www.codechef.com/problems/HEAPOPS) | Medium | — |  |
| [CC — Priority Queue (PRIORQUE)](https://www.codechef.com/problems/PRIORQUE) | Medium | — |  |
| [LC 857 — Minimum Cost to Hire K Workers](https://leetcode.com/problems/minimum-cost-to-hire-k-workers/) | Hard | [LeetCode](https://leetcode.com/problems/minimum-cost-to-hire-k-workers/) |  |
| [LC 1439 — Find the Kth Smallest Sum of a Matrix With Sorted Rows](https://leetcode.com/problems/find-the-kth-smallest-sum-of-a-matrix-with-sorted-rows/) | Hard | [LeetCode](https://leetcode.com/problems/find-the-kth-smallest-sum-of-a-matrix-with-sorted-rows/) |  |
| [LC 2386 — Find the K-Sum of an Array](https://leetcode.com/problems/find-the-k-sum-of-an-array/) | Hard | [LeetCode](https://leetcode.com/problems/find-the-k-sum-of-an-array/) |  |
| [CC — Advanced Heap (ADVHEAP)](https://www.codechef.com/problems/ADVHEAP) | Hard | — |  |

{/* END GENERATED PRACTICE PROBLEMS */}

## Related Topics

- [Trees](../trees/README.md) — heap is a complete binary tree
- [Sorting](../sorting/README.md) — heapsort uses heap operations
- [Graphs](../graphs/README.md) — Dijkstra uses min-heap

---

## Heap Data Structure Reference

The comparator heap above is the portable implementation used by this lesson. The repository also retains [MinHeap.js](./MinHeap.js) and [MaxHeap.js](./MaxHeap.js) as modular implementation references. Their project imports require the repository setup; the complete example above runs by itself.

<details>
<summary>Optional: other heap families</summary>

Leftist, binomial, Fibonacci, pairing, and Brodal heaps support different tradeoffs, particularly merging heaps or changing priorities. They are not prerequisites for the LeetCode and CodeChef progression here. Learn them only when a problem requires operations that the binary heap does not provide efficiently. Their worst-case and amortized guarantees differ; do not transfer the binary-heap complexity table to another family.

</details>

For additional background, see the [binary heap reference](https://en.wikipedia.org/wiki/Binary_heap). Continue with [priority queues](../priority-queue/README.md) and [graph algorithms](../graphs/README.md) when the operations and invariant are familiar.

[← Back to Home](../index.md)

**Next:** [priority-queue contracts](../priority-queue/README.md).
