# 🎟️ Queue

> **One-line summary**: First-in first-out (FIFO) — the backbone of BFS, level-order traversal, and rate-limiting.

---

## Concept

A queue supports:

- `enqueue(x)` — add to rear: O(1)
- `dequeue()` — remove from front: O(1)
- `peek()` — read front: O(1)

**Variants**: circular buffer (fixed-size), deque (double-ended), monotonic deque (sliding window max).

---

## Diagram

![Queue Circular Buffer](../../../assets/images/queue-circular-buffer.svg)
![Queue GIF](../../../assets/images/sliding-window-flow-anim.svg)

---

## Time & Space Complexity

| Operation         | Time   | Space |
| ----------------- | ------ | ----- |
| Enqueue / Dequeue | O(1)   | O(1)  |
| BFS traversal     | O(V+E) | O(V)  |

---

## Common Patterns

### BFS Level Order

```javascript
function levelOrder(root) {
  if (!root) return [];
  const result = [],
    queue = [root];
  while (queue.length) {
    const level = [],
      size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}
```

### Monotonic Deque (Sliding Window Max)

```javascript
function maxSlidingWindow(nums, k) {
  const deque = [],
    result = [];
  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] < i - k + 1) deque.shift();
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) result.push(nums[deque[0]]);
  }
  return result;
}
```

---

## Pitfalls

- JS `array.shift()` is O(n) — for performance use a pointer-based deque or linked list
- BFS: process all nodes at current level before moving to next (use `size` snapshot)

---

## Practice Problems

### Easy Problems
| Problem | Difficulty | Solution |
|---------|-----------|----------|
| [LC 225 — Implement Stack using Queues](https://leetcode.com/problems/implement-stack-using-queues/) | Easy |  |
| [LC 232 — Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/) | Easy |  |
| [LC 346 — Moving Average from Data Stream](https://leetcode.com/problems/moving-average-from-data-stream/) | Easy |  |
| [LC 637 — Average of Levels in Binary Tree](https://leetcode.com/problems/average-of-levels-in-binary-tree/) | Easy |  |
| [LC 933 — Number of Recent Calls](https://leetcode.com/problems/number-of-recent-calls/) | Easy |  |
| [LC 1700 — Number of Students Unable to Eat Lunch](https://leetcode.com/problems/number-of-students-unable-to-eat-lunch/) | Easy |  |
| [LC 1971 — Find if Path Exists in Graph](https://leetcode.com/problems/find-if-path-exists-in-graph/) | Easy |  |
| [LC 2073 — Time Needed to Buy Tickets](https://leetcode.com/problems/time-needed-to-buy-tickets/) | Easy |  |
| [CC — Queue Operations (QUEUEOP)](https://www.codechef.com/problems/QUEUEOP) | Easy |  |
| [CC — Basic Queue (BASICQUE)](https://www.codechef.com/problems/BASICQUE) | Easy |  |
| [CC — Queue Implementation (QUEIMPL)](https://www.codechef.com/problems/QUEIMPL) | Easy |  |

### Medium Problems
| Problem | Difficulty | Solution |
|---------|-----------|----------|
| [LC 102 — Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) | Medium |  |
| [LC 103 — Binary Tree Zigzag Level Order](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/) | Medium |  |
| [LC 107 — Binary Tree Level Order Traversal II](https://leetcode.com/problems/binary-tree-level-order-traversal-ii/) | Medium |  |
| [LC 116 — Populating Next Right Pointers in Each Node](https://leetcode.com/problems/populating-next-right-pointers-in-each-node/) | Medium |  |
| [LC 117 — Populating Next Right Pointers in Each Node II](https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/) | Medium |  |
| [LC 199 — Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/) | Medium |  |
| [LC 200 — Number of Islands](https://leetcode.com/problems/number-of-islands/) | Medium |  |
| [LC 286 — Walls and Gates](https://leetcode.com/problems/walls-and-gates/) | Medium |  |
| [LC 429 — N-ary Tree Level Order Traversal](https://leetcode.com/problems/n-ary-tree-level-order-traversal/) | Medium |  |
| [LC 515 — Find Largest Value in Each Tree Row](https://leetcode.com/problems/find-largest-value-in-each-tree-row/) | Medium |  |
| [LC 542 — 01 Matrix](https://leetcode.com/problems/01-matrix/) | Medium |  |
| [LC 622 — Design Circular Queue](https://leetcode.com/problems/design-circular-queue/) | Medium |  |
| [LC 641 — Design Circular Deque](https://leetcode.com/problems/design-circular-deque/) | Medium |  |
| [LC 649 — Dota2 Senate](https://leetcode.com/problems/dota2-senate/) | Medium |  |
| [LC 752 — Open the Lock](https://leetcode.com/problems/open-the-lock/) | Medium |  |
| [LC 909 — Snakes and Ladders](https://leetcode.com/problems/snakes-and-ladders/) | Medium |  |
| [LC 950 — Reveal Cards in Increasing Order](https://leetcode.com/problems/reveal-cards-in-increasing-order/) | Medium |  |
| [LC 994 — Rotting Oranges](https://leetcode.com/problems/rotting-oranges/) | Medium |  |
| [LC 1091 — Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/) | Medium |  |
| [LC 1162 — As Far from Land as Possible](https://leetcode.com/problems/as-far-from-land-as-possible/) | Medium |  |
| [LC 1161 — Maximum Level Sum of a Binary Tree](https://leetcode.com/problems/maximum-level-sum-of-a-binary-tree/) | Medium |  |
| [LC 1302 — Deepest Leaves Sum](https://leetcode.com/problems/deepest-leaves-sum/) | Medium |  |
| [LC 1609 — Even Odd Tree](https://leetcode.com/problems/even-odd-tree/) | Medium |  |
| [LC 1823 — Find the Winner of the Circular Game](https://leetcode.com/problems/find-the-winner-of-the-circular-game/) | Medium |  |
| [LC 1926 — Nearest Exit from Entrance in Maze](https://leetcode.com/problems/nearest-exit-from-entrance-in-maze/) | Medium |  |
| [CC — Processing a Queue (QUEUE2)](https://www.codechef.com/problems/QUEUE2) | Medium |  |
| [CC — Circular Queue (CIRCQUE)](https://www.codechef.com/problems/CIRCQUE) | Medium |  |
| [CC — BFS Problems (BFSPROB)](https://www.codechef.com/problems/BFSPROB) | Medium |  |
| [CC — Level Order Traversal (LEVELORD)](https://www.codechef.com/problems/LEVELORD) | Medium |  |

### Hard Problems
| Problem | Difficulty | Solution |
|---------|-----------|----------|
| [LC 126 — Word Ladder II](https://leetcode.com/problems/word-ladder-ii/) | Hard |  |
| [LC 127 — Word Ladder](https://leetcode.com/problems/word-ladder/) | Hard |  |
| [LC 239 — Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) | Hard |  |
| [LC 317 — Shortest Distance from All Buildings](https://leetcode.com/problems/shortest-distance-from-all-buildings/) | Hard |  |
| [LC 407 — Trapping Rain Water II](https://leetcode.com/problems/trapping-rain-water-ii/) | Hard |  |
| [LC 815 — Bus Routes](https://leetcode.com/problems/bus-routes/) | Hard |  |
| [LC 847 — Shortest Path Visiting All Nodes](https://leetcode.com/problems/shortest-path-visiting-all-nodes/) | Hard |  |
| [LC 864 — Shortest Path to Get All Keys](https://leetcode.com/problems/shortest-path-to-get-all-keys/) | Hard |  |
| [LC 1036 — Escape a Large Maze](https://leetcode.com/problems/escape-a-large-maze/) | Hard |  |
| [LC 1263 — Minimum Moves to Move a Box to Their Target Location](https://leetcode.com/problems/minimum-moves-to-move-a-box-to-their-target-location/) | Hard |  |
| [LC 1293 — Shortest Path in a Grid with Obstacles Elimination](https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/) | Hard |  |
| [LC 1345 — Jump Game IV](https://leetcode.com/problems/jump-game-iv/) | Hard |  |
| [LC 1368 — Minimum Cost to Make at Least One Valid Path in a Grid](https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid/) | Hard |  |
| [LC 1728 — Cat and Mouse II](https://leetcode.com/problems/cat-and-mouse-ii/) | Hard |  |
| [CC — Advanced BFS (ADVBFS)](https://www.codechef.com/problems/ADVBFS) | Hard |  |
| [CC — Multi-source BFS (MULTIBFS)](https://www.codechef.com/problems/MULTIBFS) | Hard |  |
| [CC — Bidirectional BFS (BIBFS)](https://www.codechef.com/problems/BIBFS) | Hard |  |

---

## Related Topics

- [Graphs](../graphs/README.md) — BFS uses a queue
- [Stack](../stack/README.md) — DFS counterpart
- [Sliding Window](../sliding-window/README.md) — monotonic deque

[← Back to Home](../index.md) · © sparshjaswal
