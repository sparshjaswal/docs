---
id: dsa-trees-interview-guide
title: "Trees"
slug: /DSA/trees/interview-guide
sidebar_label: "Trees"
---

# Trees

## Pattern Recognition

- **Hierarchical Structure:** Trees represent hierarchical data with a root node and child nodes.
- **Recursive Nature:** Many tree problems can be solved recursively, as a tree is a recursive data structure.
- **Traversal Algorithms:**
  - **Depth-First Search (DFS):** In-order, Pre-order, Post-order.
  - **Breadth-First Search (BFS):** Level-order traversal.
- **Types of Trees:**
  - **Binary Tree:** Each node has at most two children.
  - **Binary Search Tree (BST):** A binary tree where the left child is smaller than the parent, and the right child is larger.
  - **Balanced Binary Tree (e.g., AVL Tree, Red-Black Tree):** A BST that automatically keeps its height small.
  - **Trie:** A tree-like data structure for storing strings.

## Interview Strategy

1.  **Clarify the type of tree:** Is it a binary tree, a BST, or another type?
2.  **Choose the right traversal:** DFS is often used for problems involving path sums, depth, and exploring all nodes. BFS is used for finding the shortest path or level-by-level traversal.
3.  **Use recursion:** Recursion is a natural fit for tree problems.
4.  **Handle null nodes:** Be careful to handle cases where a node is null.
5.  **Discuss complexity:** The complexity of tree algorithms is often expressed in terms of the number of nodes (n) and the height of the tree (h).

## Multiple Solutions

### Example Problem: Maximum Depth of a Binary Tree

**Solution 1: Recursive (DFS)**

```javascript
function maxDepthRecursive(root) {
  if (root === null) {
    return 0;
  }
  const leftDepth = maxDepthRecursive(root.left);
  const rightDepth = maxDepthRecursive(root.right);
  return Math.max(leftDepth, rightDepth) + 1;
}
```

**Solution 2: Iterative (BFS)**

```javascript
function maxDepthIterative(root) {
  if (root === null) {
    return 0;
  }
  const queue = [root];
  let depth = 0;
  while (queue.length > 0) {
    depth++;
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
  }
  return depth;
}
```

## Complexity Analysis

| Algorithm       | Time Complexity | Space Complexity (Balanced Tree)  | Space Complexity (Unbalanced Tree) |
| --------------- | --------------- | --------------------------------- | ---------------------------------- |
| DFS (Recursive) | O(n)            | O(log n)                          | O(n)                               |
| BFS (Iterative) | O(n)            | O(w) where w is max width of tree | O(n)                               |

## Dry Runs

**Problem:** `maxDepthRecursive(3 -> 9, 20 -> 15, 7)`

1.  `maxDepth(3)` -> `1 + max(maxDepth(9), maxDepth(20))`
2.  `maxDepth(9)` -> `1 + max(maxDepth(null), maxDepth(null))` -> `1 + 0 = 1`
3.  `maxDepth(20)` -> `1 + max(maxDepth(15), maxDepth(7))`
4.  `maxDepth(15)` -> `1 + 0 = 1`
5.  `maxDepth(7)` -> `1 + 0 = 1`
6.  `maxDepth(20)` -> `1 + max(1, 1) = 2`
7.  `maxDepth(3)` -> `1 + max(1, 2) = 3`

## Visualization

- **Tree:** A diagram of nodes connected by lines, with the root at the top.
- **Traversals:** Drawing the path taken through the tree for each traversal algorithm.

## LeetCode References

- [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/)
- [Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/)
- [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)
- [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)

## Company-Specific Questions

- **Google:** Find the lowest common ancestor of two nodes in a binary tree.
- **Facebook:** Serialize and deserialize a binary tree.
- **Amazon:** Given a binary tree, check if it is a valid binary search tree.

## Variations

- **N-ary Tree:** A tree where each node can have more than two children.
- **Trie (Prefix Tree):** A specialized tree for storing and searching for strings.
- **Segment Tree:** A tree for storing information about intervals or segments.

## Revision Notes

- Master the three DFS traversals (in-order, pre-order, post-order) and BFS (level-order).
- Understand the properties of a BST.
- Recursion is your friend for tree problems.
- Be able to solve problems both recursively and iteratively.
