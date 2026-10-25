---
id: dsa-trees-avl-tree-readme
title: "AVL Tree"
slug: /DSA/trees/avl-tree/README
sidebar_label: "AVL Tree"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# AVL Tree

**Read first:** [Binary Search Tree](../binary-search-tree/README.md).

**Practice focus:** Trace one rotation, confirm inorder values stay sorted, then combine rotations for the zigzag cases.

An **AVL tree** is a binary search tree that keeps its branches short. At every node, the left and right subtree heights may differ by at most one. After insertion or deletion, a **rotation** changes a few local links to restore this rule while preserving key order.

The height stays O(log n), so lookup, insertion, and deletion take O(log n) time. AVL is named after its inventors, Adelson-Velsky and Landis.

Start with a single right rotation. The cases below show when one or two rotations are needed.

<AlgorithmWalkthrough name="avlRotation" />

AVL tree with balance factors (green)

![At every AVL node, the heights of the left and right subtrees differ by at most one.](https://upload.wikimedia.org/wikipedia/commons/a/ad/AVL-tree-wBalance_K.svg)

### AVL Tree Rotations

**Left-Left Rotation**

A chain `30 →left 20 →left 10` becomes root 20, left child 10, right child 30. Rotate right at 30.

**Right-Right Rotation**

A chain `10 →right 20 →right 30` becomes root 20, left child 10, right child 30. Rotate left at 10.

**Left-Right Rotation**

For root 30, left child 10, and 10’s right child 20: rotate left at 10, then right at 30. The new root is 20.

**Right-Left Rotation**

For root 10, right child 30, and 30’s left child 20: rotate right at 30, then left at 10. The new root is 20.

## References

- [Wikipedia](https://en.wikipedia.org/wiki/AVL_tree)
- [Tutorials Point](https://www.tutorialspoint.com/data_structures_algorithms/avl_tree_algorithm.htm)
- [BTech](http://btechsmartclass.com/data_structures/avl-trees.html)
- [AVL Tree Insertion on YouTube](https://www.youtube.com/watch?v=rbg7Qf8GkQ4&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=12&)
- [AVL Tree Interactive Visualisations](https://www.cs.usfca.edu/~galles/visualization/AVLtree.html)

**Next:** [Red–Black Tree](../red-black-tree/README.md).
