---
title: Trees
description: Hierarchical node structures — master traversals (inorder, BFS, DFS), BST properties, and path problems.
keywords:
  - trees
  - binary tree
  - bst
  - tree traversal
  - dfs
  - bfs
---

# 🌳 Trees

> **One-line summary**: Hierarchical node structures — master traversals (inorder, BFS, DFS), BST properties, and path problems for O(n) or O(log n) solutions.

---

## Visual Learning

### Enhanced Tree Traversal Animation

![Enhanced Tree Traversal Animation](../../assets/images/tree-traversal-enhanced-anim.svg)
_Interactive visualization of all tree traversal methods with smooth animations, node state changes, and real-time sequence display_

### Tree Operations Complexity Chart

![Complexity Analysis](../../assets/images/complexity-cheat-sheet.svg)
_Visual comparison of time complexities for different tree operations_

---

## Core Concepts

### What are Trees?

A **tree** is a hierarchical data structure consisting of nodes connected by edges. Unlike linear structures (arrays, linked lists), trees branch outward, making them ideal for representing nested or parent-child relationships.

Formally, a tree can be defined recursively: a node (the root) containing a value and a list of references to child nodes, with exactly one path between any two nodes and no cycles.

### Key Terminology

| Term           | Definition                                                              |
| -------------- | ----------------------------------------------------------------------- |
| **Root**       | The topmost node with no parent                                         |
| **Leaf**       | A node with no children                                                 |
| **Edge**       | The link between a parent and child node                                |
| **Height**     | Length of the longest path from node to a leaf (edges)                  |
| **Depth**      | Length of the path from root to node (edges)                            |
| **Subtree**    | Any node and all its descendants, itself a valid tree                   |
| **Sibling**    | Nodes sharing the same parent                                           |
| **Ancestor**   | Any node on the path from root to a given node (including the root)     |
| **Descendant** | Any node reachable by repeatedly following child pointers               |

### Types of Trees

- **Binary Tree**: Each node has at most 2 children (left and right)
- **Binary Search Tree (BST)**: Binary tree where left subtree values < node value < right subtree values
- **Balanced Tree**: Height difference between left and right subtrees is at most 1 (e.g., AVL, Red-Black)
- **Complete Binary Tree**: All levels filled except possibly the last, filled left to right
- **Full Binary Tree**: Every node has either 0 or 2 children
- **Perfect Binary Tree**: All internal nodes have 2 children, all leaves at same level
- **N-ary Tree**: Each node can have up to N children (e.g., Trie, file system)

### Real-World Use Cases

- **File systems** — directories contain files and subdirectories (N-ary tree)
- **HTML DOM** — nested element hierarchy
- **Database indexes** — B-Trees and B+ Trees for efficient lookups
- **Expression parsing** — abstract syntax trees (ASTs) in compilers
- **Routing** — network routing tables use tree structures
- **AI/ML** — decision trees, random forests
- **Compression** — Huffman coding trees
- **Version control** — Git's commit DAG (directed acyclic graph, a tree variant)

### When NOT to Use Trees

- Simple linear access patterns (use arrays or linked lists)
- Constant-time random access required (use hash tables)
- Memory-constrained environments with high pointer overhead
- Data has no hierarchical relationship

### Essential Tree Traversals

#### Depth-First Search (DFS)

- **Inorder (L-N-R)**: Left → Node → Right
  - _Sequence_: 8 → 4 → 2 → 9 → 5 → 1 → 6 → 3 → 7
  - _Use Case_: Yields sorted order for BST, expression evaluation

- **Preorder (N-L-R)**: Node → Left → Right
  - _Sequence_: 1 → 2 → 4 → 8 → 5 → 9 → 3 → 6 → 7
  - _Use Case_: Tree serialization/copying, prefix expressions

- **Postorder (L-R-N)**: Left → Right → Node
  - _Sequence_: 8 → 4 → 9 → 5 → 2 → 6 → 7 → 3 → 1
  - _Use Case_: Tree deletion, computing directory sizes, postfix expressions

#### Breadth-First Search (BFS)

- **Level-order**: Visit nodes level by level, left to right
  - _Sequence_: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9
  - _Use Case_: Shortest path in unweighted trees, level-wise aggregation, tree printing

---

## Complexity Analysis

### BST Operations

| Operation  | Average   | Worst     | Space     | Notes                                         |
| ---------- | --------- | --------- | --------- | --------------------------------------------- |
| **Search** | O(log n)  | O(n)      | O(h)      | Degenerates to O(n) if tree becomes a chain   |
| **Insert** | O(log n)  | O(n)      | O(h)      | Must maintain BST property after insertion    |
| **Delete** | O(log n)  | O(n)      | O(h)      | Three cases: leaf, one child, or two children |

_h = height of tree (log n for balanced, n for skewed)_

### Tree Traversal Complexities

| Traversal            | Time  | Space  | Notes                                   |
| -------------------- | ----- | ------ | --------------------------------------- |
| **Inorder (DFS)**    | O(n)  | O(h)   | Stack depth for recursion               |
| **Preorder (DFS)**   | O(n)  | O(h)   | Same as above                           |
| **Postorder (DFS)**  | O(n)  | O(h)   | Same as above                           |
| **Level-order (BFS)**| O(n)  | O(w)   | Queue stores at most the widest level   |

_w = maximum width of tree (up to n/2 for a complete binary tree, so O(n) worst case)_

---

## Common Patterns

### Inorder DFS (Recursive)

```javascript
function inorder(root, result = []) {
  if (!root) return result;
  inorder(root.left, result);
  result.push(root.val);
  inorder(root.right, result);
  return result;
}
```

### Level Order BFS (Iterative)

```javascript
function levelOrder(root) {
  if (!root) return [];
  const queue = [root], result = [];
  while (queue.length) {
    const size = queue.length, level = [];
    for (let i = 0; i < size; i++) {
      const n = queue.shift();
      level.push(n.val);
      if (n.left) queue.push(n.left);
      if (n.right) queue.push(n.right);
    }
    result.push(level);
  }
  return result;
}
```

### Lowest Common Ancestor (LCA)

```javascript
function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  return left && right ? root : left || right;
}
```

### Iterative DFS (Stack-Based)

```javascript
function dfsIterative(root) {
  if (!root) return [];
  const stack = [root], result = [];
  while (stack.length) {
    const node = stack.pop();
    result.push(node.val);
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  return result;
}
```

### BST Validation

```javascript
function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  if (root.val <= min || root.val >= max) return false;
  return isValidBST(root.left, min, root.val)
      && isValidBST(root.right, root.val, max);
}
```

### Tree Height (Bottom-Up)

```javascript
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

---

## Pitfalls & Edge Cases

- **Always null-check** before accessing `.left` or `.right` — root or any child can be null
- **BST validation requires min/max bounds**, not just comparing node with its direct parent
- **Height vs depth confusion**: height = edges from node → deepest leaf; depth = edges from root → node
- **Recursion depth limits**: A skewed tree of 10⁵ nodes will overflow the call stack — use iterative approaches for deep trees
- **BFS queue size**: For a complete tree, the queue can hold n/2 nodes at the widest level
- **Duplicate values in BST**: Typically duplicates go to the left or are disallowed entirely — clarify with your interviewer
- **Inorder successor for delete**: When deleting a node with two children, replace it with the inorder successor (smallest in right subtree) or predecessor (largest in left subtree)
- **Empty tree**: Many tree functions need to handle `root === null` gracefully

---

## Implementation Reference

Runnable implementations (with tests) live alongside this guide in this folder:

- [Binary Search Tree](./binary-search-tree)
- [AVL Tree](./avl-tree)
- [Red-Black Tree](./red-black-tree)
- [Segment Tree](./segment-tree) — with min/max/sum range queries examples
- [Fenwick Tree](./fenwick-tree) (Binary Indexed Tree)
- [Breadth-First Search](./breadth-first-search)
- [Depth-First Search](./depth-first-search)

Also see the [Interview Guide](./interview-guide.md) for curated practice sets.

---

## Related Topics

- [Recursion](../recursion/README.md) — most tree algorithms are naturally recursive
- [Heap](../heap/) — a heap is a complete binary tree with ordering constraints
- [Queue](../queue/README.md) — BFS traversal depends on a queue data structure
- [Stack](../stack/README.md) — DFS traversal uses a stack (or recursion call stack)
- [Trie](../trie/README.md) — an N-ary tree specialized for string prefix operations

---

## References

- [Wikipedia — Tree (data structure)](https://en.wikipedia.org/wiki/Tree_(data_structure))
- [HackerRank — Trees video playlist](https://www.youtube.com/watch?v=oSWTXtMglKE&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=8)
- [Visualgo — BST visualization](https://visualgo.net/en/bst)

[← Back to DSA](../index.md) · &copy; sparshjaswal
