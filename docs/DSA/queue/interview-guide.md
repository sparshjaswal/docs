---
id: dsa-queue-interview-guide
title: "Queues"
slug: /DSA/queue/interview-guide
sidebar_label: "Queues"
---

# Queues

## Pattern Recognition

- **FIFO (First-In, First-Out):** The first element added to the queue is the first one to be removed.
- **Common Use Cases:**
  - **Breadth-First Search (BFS):** To explore a graph or tree level by level.
  - **Scheduling:** In operating systems for task scheduling.
  - **Buffering:** In networking to handle data streams.
  - **Order Processing:** In e-commerce systems to process orders in the order they were received.

## Interview Strategy

1.  **Identify the FIFO pattern:** If the problem involves processing elements in the order they were added, a queue is a good choice.
2.  **Think about the operations:** `enqueue` (or `add`), `dequeue` (or `remove`), `peek` (or `front`), `isEmpty`.
3.  **Consider using a queue for BFS:** This is the most common application of queues in algorithm problems.
4.  **Discuss complexity:** Queue operations are typically O(1).

## Multiple Solutions

### Example Problem: Implement a Stack using Queues

**Solution: Using two queues (O(n) for push, O(1) for pop)**

```javascript
class StackUsingQueues {
  constructor() {
    this.q1 = [];
    this.q2 = [];
  }

  push(x) {
    this.q2.push(x);
    while (this.q1.length > 0) {
      this.q2.push(this.q1.shift());
    }
    [this.q1, this.q2] = [this.q2, this.q1];
  }

  pop() {
    return this.q1.shift();
  }

  top() {
    return this.q1[0];
  }

  empty() {
    return this.q1.length === 0;
  }
}
```

## Complexity Analysis

| Operation | Time Complexity (Array-based)                                                    | Space Complexity |
| --------- | -------------------------------------------------------------------------------- | ---------------- |
| Enqueue   | O(1) (amortized)                                                                 | O(n)             |
| Dequeue   | O(n) (if at beginning of array) or O(1) (if using a proper queue implementation) | O(n)             |
| Peek      | O(1)                                                                             | O(n)             |
| IsEmpty   | O(1)                                                                             | O(n)             |

## Dry Runs

**Problem:** `StackUsingQueues`

1.  `push(1)`: `q2 = [1]`. `q1` is empty. `q1 = [1]`, `q2 = []`.
2.  `push(2)`: `q2 = [2]`. `q1 = [1]`. `q2.push(q1.shift())` -> `q2 = [2, 1]`. `q1 = [2, 1]`, `q2 = []`.
3.  `pop()`: `q1.shift()` -> returns `2`. `q1` is now `[1]`.

## Visualization

- **Queue:** A horizontal line of people waiting. The person at the front of the line is served first.

## LeetCode References

- [Implement Stack using Queues](https://leetcode.com/problems/implement-stack-using-queues/)
- [Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/)
- [Number of Islands](https://leetcode.com/problems/number-of-islands/) (uses BFS with a queue)
- [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) (uses BFS with a queue)

## Company-Specific Questions

- **Facebook:** Given a binary tree, return the level order traversal of its nodes' values.
- **Amazon:** You are given a stream of integers and a window size, calculate the moving average of all integers in the sliding window.
- **Google:** Implement a rate limiter.

## Variations

- **Circular Queue:** A queue implemented with a fixed-size array where the end of the array wraps around to the beginning.
- **Deque (Double-Ended Queue):** A queue where you can add and remove elements from both the front and the back.
- **Priority Queue:** A queue where each element has a priority, and the element with the highest priority is served first.

## Revision Notes

- Queues are fundamental for BFS, which is a very common graph and tree traversal algorithm.
- Understand the difference between a queue and a stack.
- Be aware of the potential for O(n) dequeue operations if you use a simple array in JavaScript.
