---
id: dsa-linked-list-interview-guide
title: Linked Lists
slug: /DSA/linked-list/interview-guide
sidebar_label: Linked Lists
---


# Linked Lists

## Pattern Recognition

- **Nodes and Pointers:** Linked lists consist of nodes, where each node contains data and a pointer to the next node.
- **Dynamic Size:** Linked lists can grow and shrink dynamically.
- **No Contiguous Memory:** Unlike arrays, linked list nodes are not stored in contiguous memory locations.
- **Common Patterns:**
    - **Two Pointers (Fast and Slow):** Used to detect cycles, find the middle element, or solve other problems in a single pass.
    - **Dummy Head Node:** A sentinel node at the beginning of the list to simplify insertion and deletion operations at the head.
    - **Reversing a Linked List:** A common subproblem in many linked list questions.

## Interview Strategy

1.  **Visualize the list:** Draw the nodes and pointers to understand the structure.
2.  **Handle edge cases:** Empty list, single-node list, etc.
3.  **Be careful with pointers:** Keep track of `head`, `tail`, `current`, `prev`, and `next` pointers.
4.  **Consider a dummy head:** It can simplify your code significantly.
5.  **Discuss complexity:** Analyze the time and space complexity of your solution.

## Multiple Solutions

### Example Problem: Reverse a Linked List

**Solution 1: Iterative (O(n))**

```javascript
function reverseListIterative(head) {
    let prev = null;
    let current = head;
    while (current !== null) {
        const nextTemp = current.next;
        current.next = prev;
        prev = current;
        current = nextTemp;
    }
    return prev;
}
```

**Solution 2: Recursive (O(n))**

```javascript
function reverseListRecursive(head) {
    if (head === null || head.next === null) {
        return head;
    }
    const p = reverseListRecursive(head.next);
    head.next.next = head;
    head.next = null;
    return p;
}
```

## Complexity Analysis

| Operation          | Time Complexity | Space Complexity (Iterative) | Space Complexity (Recursive) |
| ------------------ | --------------- | ---------------------------- | ---------------------------- |
| Access (by index)  | O(n)            | -                            | -                            |
| Search             | O(n)            | -                            | -                            |
| Insertion (at head)| O(1)            | -                            | -                            |
| Insertion (at tail)| O(n) or O(1) with tail pointer | -               | -                          |
| Deletion (at head) | O(1)            | -                            | -                            |
| Deletion (at tail) | O(n)            | -                            | -                            |
| Reversal           | O(n)            | O(1)                         | O(n) due to recursion stack  |

## Dry Runs

**Problem:** `reverseListIterative(1 -> 2 -> 3 -> null)`

1.  `prev = null`, `current = 1`. `nextTemp = 2`, `1.next = null`, `prev = 1`, `current = 2`.
2.  `prev = 1`, `current = 2`. `nextTemp = 3`, `2.next = 1`, `prev = 2`, `current = 3`.
3.  `prev = 2`, `current = 3`. `nextTemp = null`, `3.next = 2`, `prev = 3`, `current = null`.
4.  Loop terminates. Return `prev` which is `3`.

## Visualization

- **Nodes:** Boxes with two compartments: data and a pointer (arrow) to the next node.
- **Reversal:** Arrows changing direction one by one.
- **Fast and Slow Pointers:** Two pointers moving at different speeds through the list.

## LeetCode References

- [Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)
- [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)
- [Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/)
- [Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)

## Company-Specific Questions

- **Amazon:** Find the intersection of two linked lists.
- **Google:** Copy a linked list with a random pointer.
- **Microsoft:** Add two numbers represented by linked lists.

## Variations

- **Doubly Linked List:** Each node has a pointer to the previous node as well as the next node.
- **Circular Linked List:** The last node points back to the first node.
- **Skip List:** A probabilistic data structure for efficient searching.

## Revision Notes

- The fast and slow pointer technique is extremely useful.
- A dummy head node is your best friend for insertions/deletions.
- Be able to reverse a linked list both iteratively and recursively.
- Practice pointer manipulation carefully.
