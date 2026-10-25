---
title: "Trees"
description: Learn tree vocabulary, node references, traversals, depth, and ancestor problems with complete JavaScript examples.
keywords:
  - trees
  - binary tree
  - bst
  - tree traversal
  - dfs
  - bfs
---

import PracticeProblem from '@site/src/components/PracticeProblem';
import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Trees: follow branches without losing your place

**Learn first:** [objects and references](../javascript-for-dsa.md), [stacks](../stack/README.md), [queues](../queue/README.md), and [recursion](../recursion/README.md). You will learn to represent a tree, choose a visit order, trace pending work, and combine answers from children.

Imagine folders inside folders. A folder can contain several smaller folders, and each of those can contain more. A **tree** models this branching relationship. The starting node is the **root**; the nodes directly below another node are its **children**.

A rooted tree has exactly one route from the root to each node. Every node except the root has one parent, and there are no cycles: following child links never brings you back to a node you already passed. A **binary tree** gives each node at most two child positions, named `left` and `right`. Either position may be empty.

## Learning steps

A folder tree has a starting folder and branches below it. A search needs to remember which branches still wait to be visited.

1. Name roots, children, leaves, and missing child links.
2. Trace depth-first orders with a stack and level order with a queue.
3. Combine child answers to compute height or a common ancestor.

## Read the structure before writing code

```text
             root
              |
              v
            [ 2 ]       depth 0
          left right
           /     \
          v       v
        [ 1 ]   [ 3 ]   depth 1
         leaf    leaf
```

Each box is a separate node object. An arrow is a reference to another object, not a numerical comparison. The node containing `1` has `left: null` and `right: null`; `null` means that no node exists in that position. Missing child arrows are omitted from the picture.

| Word | Meaning in this chapter |
| --- | --- |
| Node | One object containing a value and child references |
| Edge | One connection between a parent and a child |
| Root | The starting node, with no parent |
| Leaf | A node with no children |
| Siblings | Nodes with the same parent; `1` and `3` are siblings |
| Subtree | A chosen node together with all nodes below it |
| Depth | Number of edges from the root; the root has depth `0` |
| Height | Number of nodes on the longest downward path; a leaf has height `1`, an empty tree has height `0` |
| Ancestor | A node above another on its route from the root |

Some books count height in **edges**, making a leaf's height `0`. Read the problem's convention. This chapter counts height in nodes, matching the usual LeetCode `maxDepth` result: the pictured tree has height `2`.

### JavaScript representation

```js runnable
const root = {
  val: 2,
  left: { val: 1, left: null, right: null },
  right: { val: 3, left: null, right: null },
};

const leftNode = root.left; // Another reference to the SAME node.
console.log(root.val);
console.log(leftNode.val);
console.log(leftNode === root.left);
console.log(leftNode.left === null);
```

```text output
2
1
true
true
```

LeetCode normally supplies the root object to your function. Its displayed input `[2,1,3]` describes a tree in level order; it does **not** mean that your function receives that array. A CodeChef problem may instead supply numbered vertices and edges; build an [adjacency list](../graphs/README.md) from that statement's input format. Do not assume one representation for every judge.

## Choose a visit order

**Traversal** means visiting the nodes systematically. Depth-first search (**DFS**) completes a branch before returning to another branch. Breadth-first search (**BFS**) visits one depth at a time.

| Order | Rule at each node | Result for the picture | Use it when |
| --- | --- | --- | --- |
| Preorder | Node, left subtree, right subtree | `2, 1, 3` | A parent's information must be available before its children |
| Inorder | Left subtree, node, right subtree | `1, 2, 3` | Reading sorted keys of a valid binary search tree |
| Postorder | Left subtree, right subtree, node | `1, 3, 2` | A parent needs answers from both children, such as subtree height |
| Level order | All nodes at depth `0`, then depth `1`, and so on | `[[2], [1, 3]]` | The question mentions levels, nearest nodes, or a view from one side |

Inorder is sorted only when the tree satisfies the **binary search tree** ordering rule. An arbitrary binary tree has no ordering guarantee. Preorder alone also cannot uniquely serialize an arbitrary tree unless missing child positions are recorded.

<AlgorithmWalkthrough name="tree" />

## Iterative preorder: keep pending work in a stack {/* #iterative-preorder */}

Start with the root as the one pending node. Remove the most recently added node, record its value, and add its children. Push the **right** child first so that the **left** child is removed first. This implements node–left–right order without recursive calls.

```js runnable
function preorderTraversal(root) {
  if (root === null) return [];
  const pending = [root];
  const values = [];

  while (pending.length > 0) {
    const node = pending.pop();
    values.push(node.val);
    if (node.right !== null) pending.push(node.right);
    if (node.left !== null) pending.push(node.left);
  }
  return values;
}

const root = {
  val: 2,
  left: { val: 1, left: null, right: null },
  right: { val: 3, left: null, right: null },
};
console.log(JSON.stringify(preorderTraversal(root)));
console.log(JSON.stringify(preorderTraversal(null)));
```

```text output
[2,1,3]
[]
```

```text
The RIGHT end of pending is the stack top: pop() removes it.

Before visit       Visit       Pending after pushing children       Output
[2]                  2         [3, 1]                               [2]
[3, 1]               1         [3]                                  [2, 1]
[3]                  3         []                                   [2, 1, 3]
```

**Why it works:** the stack contains the roots of subtrees still waiting to be visited, with the next subtree on top. Visiting a node before adding its children gives preorder. Putting the left child on top makes its whole subtree finish before the right subtree. Every non-root node has exactly one parent, so each node is pushed and visited once. A valid tree needs no separate visited set; a general graph may need one.

For `n` nodes and height `h`, time is `O(n)`, auxiliary stack space is `O(h)` for this binary-tree traversal, and the returned array uses `O(n)` space. An explicit stack avoids the JavaScript runtime's recursion-depth limit; it does not make the pending work free.

## Recursion: let each child return an answer

For inorder traversal, visit the left subtree, append the current value, then visit the right subtree. For height, ask both children for their heights, take the larger answer, and add one for the current node. These are different ways to use the same branching structure.

```js runnable
function inorderTraversal(root) {
  const values = [];
  function visit(node) {
    if (node === null) return;
    visit(node.left);
    values.push(node.val);
    visit(node.right);
  }
  visit(root);
  return values;
}

function maxDepth(root) {
  if (root === null) return 0;
  const leftHeight = maxDepth(root.left);
  const rightHeight = maxDepth(root.right);
  return 1 + Math.max(leftHeight, rightHeight);
}

const root = {
  val: 2,
  left: { val: 1, left: null, right: null },
  right: { val: 3, left: null, right: null },
};
console.log(JSON.stringify(inorderTraversal(root)));
console.log(maxDepth(root));
console.log(maxDepth(null));
```

```text output
[1,2,3]
2
0
```

```text
Height answers travel UP toward the parent:

                  [2] returns 1 + max(1, 1) = 2
                   ^                        ^
                   |                        |
    [1] returns 1 + max(0, 0) = 1    [3] returns 1 + max(0, 0) = 1
          ^             ^                 ^             ^
        null=0        null=0            null=0        null=0
```

**Why height is correct:** an empty subtree has no nodes, so its height is zero. Every downward path from a real node enters either the left or right subtree. If their answers are correct, choosing the longer one and adding the current node gives exactly the longest path. Recursion reaches empty children because each call moves into a smaller subtree.

Both functions visit every node once: `O(n)` time and `O(h)` call-stack space. Inorder additionally returns `O(n)` values. A balanced tree has `h = O(log n)`, while a chain can have `h = n`. For a potentially deep input, use iteration. The next BFS example can find height by counting its levels, avoiding the runtime call stack.

## Level-order BFS: finish one frontier at a time

A **frontier** is the group of nodes waiting at the current depth. Collect their values and their children in separate arrays. Once the current group is finished, its children become the next frontier. This avoids removing the first element of an array repeatedly with `shift()`.

```js runnable
function levelOrder(root) {
  if (root === null) return [];
  let frontier = [root];
  const levels = [];

  while (frontier.length > 0) {
    const values = [];
    const nextFrontier = [];
    for (const node of frontier) {
      values.push(node.val);
      if (node.left !== null) nextFrontier.push(node.left);
      if (node.right !== null) nextFrontier.push(node.right);
    }
    levels.push(values);
    frontier = nextFrontier;
  }
  return levels;
}

const root = {
  val: 2,
  left: { val: 1, left: null, right: null },
  right: { val: 3, left: null, right: null },
};
console.log(JSON.stringify(levelOrder(root)));
console.log(JSON.stringify(levelOrder(null)));
```

```text output
[[2],[1,3]]
[]
```

```text
Depth     Frontier     Collected values     Next frontier
  0         [2]              [2]                [1, 3]
  1         [1, 3]           [1, 3]             []  -> stop
```

**Why it works:** at the start of each loop, `frontier` contains exactly one depth in left-to-right order. Its children are exactly the next depth. Appending each parent's left child before its right child preserves that order. Every node appears in one frontier, so time is `O(n)`. If the largest level contains `w` nodes, the current and next frontier together use `O(w)` auxiliary space. The returned levels contain all `n` values and use `O(n)` output space. For a reusable FIFO interface, see the [efficient queue](../queue/README.md).

## Lowest common ancestor: combine two searches

The **lowest common ancestor** of nodes `p` and `q` is their deepest shared ancestor. For this problem, a node counts as its own ancestor: if `p` is above `q`, the answer can be `p`.

Contract: `p` and `q` are distinct node objects that both exist in the tree. Compare references, not values; two different nodes may store the same number.

```text
          [4]
         /   \
       [2]   [7]
      /   \
    [1]   [3]

The searches for nodes 1 and 3 meet at node 2.
```

```js runnable
function lowestCommonAncestor(root, p, q) {
  if (root === null || root === p || root === q) return root;
  const leftAnswer = lowestCommonAncestor(root.left, p, q);
  const rightAnswer = lowestCommonAncestor(root.right, p, q);
  if (leftAnswer !== null && rightAnswer !== null) return root;
  return leftAnswer !== null ? leftAnswer : rightAnswer;
}

const first = { val: 1, left: null, right: null };
const third = { val: 3, left: null, right: null };
const parent = { val: 2, left: first, right: third };
const root = {
  val: 4,
  left: parent,
  right: { val: 7, left: null, right: null },
};
console.log(lowestCommonAncestor(root, first, third).val);
console.log(lowestCommonAncestor(root, parent, third).val);
```

```text output
2
2
```

A call returns `null` when its subtree contains neither target. It returns a target or an already found ancestor when there is useful evidence below it. If both children return evidence, the targets lie on opposite sides, so the current node is their first meeting point. If only one child returns evidence, pass that answer upward. Encountering a target stops that branch: if the other target is below it, it is already their ancestor; otherwise a higher node joins the two branches. This relies on the contract that both targets exist. Without that guarantee, separately verify their presence.

Worst-case time is `O(n)` and call-stack space is `O(h)`. For deep trees, an iterative search with parent references is another approach; it uses `O(n)` storage. This single-query algorithm is a foundation for later techniques that answer many ancestor queries.

## Tree shapes and the limits of a technique

A **binary search tree (BST)** adds a rule about entire subtrees: with distinct keys, all left-subtree keys are smaller than the node's key, and all right-subtree keys are larger. Checking only immediate children misses violations deeper down. Search follows one child per comparison and takes `O(h)` time. An ordinary BST is not automatically balanced; sorted insertions can make it a chain. Study its full [search, insert, delete, and validation guide](./binary-search-tree/README.md) next.

| Shape or structure | Defining property | Why recognize it? |
| --- | --- | --- |
| Full binary tree | Every node has zero or two children | Rules out one-child cases |
| Complete binary tree | All levels except perhaps the last are full; the last fills from the left | Supports the array layout used by a [heap](../heap/README.md) |
| Perfect binary tree | Every internal node has two children, and all leaves share one depth | Enables formulas and specialized pointer connections |
| Balanced search tree | Additional rules keep height `O(log n)` | Supports predictable search costs; [AVL](./avl-tree/README.md) and [red-black trees](./red-black-tree/README.md) are advanced implementations |
| N-ary tree | Nodes have a collection of children rather than two named positions | Use a loop over children; a [trie](../trie/README.md) organizes string prefixes this way |

Do not use tree structure to invent an ordering guarantee. A heap is not a BST, and a general binary tree is not necessarily either. Use an array for direct index access and a `Map` for key lookup when no hierarchy is needed.

## Edge cases and understanding checks

Before submission, check an empty root, one node, a chain, missing children on either side, and repeated values. These examples assume valid trees with explicit `null` child references. Do not attach a child back to an ancestor: that creates a cycle and breaks the tree contract.

1. Why does iterative preorder push the right child first?
2. Can inorder of an arbitrary binary tree be assumed sorted?
3. A chain has 1,000 nodes. What are its height and its deepest node's depth under this chapter's conventions?
4. Does avoiding recursion mean that a traversal uses constant extra space?

<details>
<summary>Check the answers</summary>

1. The stack removes the last pushed item first, so the left child must be pushed last.
2. No. Sorted inorder requires the BST rule throughout the tree.
3. Height is `1,000` nodes; the deepest depth is `999` edges.
4. No. An explicit stack or frontier still holds pending work. Account for that storage and the output separately.

</details>

## Graduated exercises

1. **Trace:** add node `0` as the left child of node `1` in the first picture. Write preorder, inorder, postorder, and level order before running code.
2. **Implement:** count leaves. A node is a leaf only when **both** children are `null`. Return `0` for an empty tree.
3. **Transfer:** return the right-side view: the last value at each depth. Explain why merely following `root.right` misses some visible nodes.
4. **Challenge:** attempt maximum path sum and tree serialization in the practice table after you can explain child-return contracts. State whether a path may branch and how missing children are encoded before coding.

<details>
<summary>Hints for the first three exercises</summary>

1. Reapply each traversal rule at every node, including node `1`.
2. Visit every node with a stack. Count a node only after checking both child references.
3. Use BFS levels. A deeper level may exist entirely inside a left subtree.

</details>

<details>
<summary>Solutions for the first three exercises</summary>

1. Preorder: `2, 1, 0, 3`; inorder: `0, 1, 2, 3`; postorder: `0, 1, 3, 2`; level order: `[[2], [1, 3], [0]]`.
2. Each node is visited once; the two-null condition selects exactly the leaves. Time is `O(n)`, with `O(h)` auxiliary stack space for a binary tree.
3. For the modified tree, the view is `[2, 3, 0]`. Following right links stops at `3` and misses `0`. Use `levelOrder` above and select each level's last value. That simple version stores all levels (`O(n)`); collecting only each frontier's last value reduces auxiliary storage to `O(w)`, plus the view output.

```js runnable
function countLeaves(root) {
  if (root === null) return 0;
  const pending = [root];
  let leaves = 0;
  while (pending.length > 0) {
    const node = pending.pop();
    if (node.left === null && node.right === null) leaves++;
    if (node.right !== null) pending.push(node.right);
    if (node.left !== null) pending.push(node.left);
  }
  return leaves;
}

const root = {
  val: 2,
  left: {
    val: 1,
    left: { val: 0, left: null, right: null },
    right: null,
  },
  right: { val: 3, left: null, right: null },
};
console.log(countLeaves(root));
console.log(countLeaves(null));
```

```text output
2
0
```

</details>

## Continue to specialized trees

Study [BSTs](./binary-search-tree/README.md) for ordered search and [heaps](../heap/README.md) for repeated minimum/maximum extraction. Later, [Fenwick trees](./fenwick-tree/README.md) and [segment trees](./segment-tree/README.md) answer changing range queries. Their names do not mean that every ordinary tree traversal technique is their best implementation.

The [Interview Guide](./interview-guide.md) provides another practice sequence. The existing workbook below checks your understanding before the broader problem catalog.

## Worked examples and answers {/* #workbook-practice */}

Attempt the linked [Practice Problems](#practice-problems) before opening their answers. See the [workbook guide](../../javascript/workbook.md) for the A–C exercise format.

### 37. Binary trees search trees and traversal {/* #workbook-37 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** combine results from smaller trees and explain how ordering changes a search.

Review [visit orders](#choose-a-visit-order) and [returning answers from children](#recursion-let-each-child-return-an-answer). This example counts height in nodes: null has height 0, and a real node adds 1 to the larger child height. An inorder visit returns left values, the current value, then right values.

A [binary search tree](./binary-search-tree/README.md) adds an ordering rule across whole subtrees. Its insertion and deletion guide covers leaf, one-child, and two-child cases. To validate the rule, carry allowed value bounds down the tree; checking only a node and its immediate children can miss an invalid deeper value.

A search tree is not automatically balanced. A long chain can take linear work, and deep recursion can exceed the JavaScript call-stack limit. Balanced trees use additional rules and rotations—local link changes that preserve inorder order. Use an explicit stack when depth may be large.

**Worked example**

```js
function inorder(root, result = []) {
  if (root === null) return result;
  inorder(root.left, result);
  result.push(root.key);
  inorder(root.right, result);
  return result;
}
const tree = { key: 2,
  left: { key: 1, left: null, right: null },
  right: { key: 3, left: null, right: null } };
console.log(inorder(tree).join(","));
```

**Expected output**

```text
1,2,3
```

**Why the example works**

The first recursive call reaches the leftmost node before any push for the root. It appends 1, then the root appends 2, and the right traversal appends 3. One shared result array avoids repeatedly copying growing arrays at every return.

</details>

Find **37A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-37-answer">
<summary>Check your reasoning and answer</summary>

For Node checks, add `import assert from "node:assert/strict";` at the top of your file. Browser and multi-file examples use the setup stated above.

**37A.** Every left-subtree key precedes and is smaller than the current key, while every right-subtree key follows and is larger. Applying this property recursively yields sorted order.

**37B.** If each insertion consistently chooses the same side, height grows to n. Without balancing, the structure becomes a linked chain and search can visit every node.

**37C.** The base case contributes zero height. Each existing node adds one to the longer child path. Both subtrees must be measured, so total work is O(n), with O(h) recursive stack space.

**Reference code**

Use the worked example above first if the answer calls its functions or classes. Run each lesson in its own `.mjs` file.

```js
function height(root) {
  if (root === null) return 0;
  return 1 + Math.max(height(root.left), height(root.right));
}
```

**Check the result**

```js
assert.equal(height(null), 0);
assert.equal(height(tree), 2);
assert.equal(height({ key: 0, left: null, right: null }), 1);
```

</details>

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **37A — Why does inorder traversal sort a search tree?** | **Must fix** | [Worked example](#workbook-37) | [Answer](#workbook-37-answer) |
| **37B — What makes a plain search tree degenerate to linear search?** | **Must fix** | [Worked example](#workbook-37) | [Answer](#workbook-37-answer) |
| **37C — Implement height(root) using the node-count convention.** | **Must fix** | [Worked example](#workbook-37) | [Answer](#workbook-37-answer) |
| [LC 257 — Binary Tree Paths](https://leetcode.com/problems/binary-tree-paths/) | Easy | [LeetCode](https://leetcode.com/problems/binary-tree-paths/) | — |
| <PracticeProblem id={543} title={"Diameter of Binary Tree"} text={"Problem statement\nReturn the diameter of a binary tree: the greatest number of edges on a path between any two\nnodes. The path may pass through any part of the tree and need not go through the root. A tree\nwith one node has diameter 0.\nInput \u0026 expected result\nMeasure diameter in edges rather than the number of visited nodes. Endpoints may be leaves or\nany other nodes. Return an integer length, and do not require the chosen path to begin at root or\nfollow only downward links.\nEXAMPLE 1\nInput tree: [5,2,8,1,3]\nOutput: 3\nExplanation: A longest path is 1 -\u003e 2 -\u003e 5 -\u003e 8, containing three edges and four nodes.\nEXAMPLE 2\nInput tree: [1,2,3]\nOutput: 2\nExplanation: The path from node 2 through the root to node 3 contains two edges.\nConstraints \u0026 guarantees\n• Node.val: -100 through 100 (inclusive)\n• Tree size: 1 through 10^4 nodes\nJavaScript starter\nfunction diameterOfBinaryTree(root) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/diameter-of-binary-tree/) | — |
| <PracticeProblem id={572} title={"Subtree of Another Tree"} text={"Problem statement\nDetermine whether root contains a subtree identical to subRoot. Choosing a subtree means\nchoosing a node and all of its descendants. Its values and left/right structure must exactly match\nsubRoot. Merely finding the same values somewhere in root is insufficient.\nInput \u0026 expected result\nOnce a candidate node is chosen, none of its descendants may be omitted from the comparison.\nThe entire root tree is itself an eligible subtree. Both child positions and all node values must match\nthe candidate and subRoot.\nEXAMPLE 1\nInput: root = [5,2,8,1,3], subRoot = [2,1,3]\nOutput: true\nExplanation: The subtree rooted at node 2 includes exactly its children 1 and 3, matching the\nentire smaller tree.\nEXAMPLE 2\nInput: root = [3,2,4,1], subRoot = [2]\nOutput: false\nExplanation: The node valued 2 has an extra descendant, so its complete subtree is not the\nsingle-node subRoot.\nConstraints \u0026 guarantees\n• root.val: -10^4 through 10^4 (inclusive)\n• subRoot.val: -10^4 through 10^4 (inclusive)\n• root contains 1 through 2000 nodes\n• subRoot contains 1 through 1000 nodes\nJavaScript starter\nfunction isSubtree(root, subRoot) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/subtree-of-another-tree/) | — |
| <PracticeProblem id={637} title={"Average of Levels in Binary Tree"} text={"Problem statement\nFor each depth in a nonempty binary tree, calculate the arithmetic mean of all node values at that\ndepth. Return the means in order from the root level to the deepest level. Fractional answers are\nallowed.\nInput \u0026 expected result\nNodes at the same depth contribute equally to that level's mean. Return one numeric value per\nlevel, preserving depth order. The judge permits absolute error up to 10^-5, so an integer-valued\nmean need not be formatted with decimals.\nEXAMPLE 1\nInput tree: [6,2,10,1,5]\nOutput: [6,6,3]\nExplanation: The level sums and counts are 6/1, 12/2, and 6/2, producing 6,6,3.\nEXAMPLE 2\nInput tree: [2,1,4]\nOutput: [2,2.5]\nExplanation: The second level's average is (1 + 4) / 2 = 2.5.\nConstraints \u0026 guarantees\n• Node.val: -2^31 through 2^31 - 1 (inclusive)\n• Tree size: 1 through 10^4 nodes\nJavaScript starter\nfunction averageOfLevels(root) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/average-of-levels-in-binary-tree/) | — |
| <PracticeProblem id={102} title={"Binary Tree Level Order Traversal"} text={"Problem statement\nReturn the values of a binary tree grouped by depth. The outer array goes from the root level\ndownward, and each inner array lists that level's nodes from left to right. An empty tree produces\nan empty outer array.\nInput \u0026 expected result\nKeep level boundaries in the result: flattening all visited values into one array does not satisfy the\noutput format. Null positions are not included as values. Within a level, preserve the natural\nleft-to-right node order.\nEXAMPLE 1\nInput tree: [4,2,7,1,3]\nOutput: [[4],[2,7],[1,3]]\nExplanation: The root forms the first group, nodes 2 and 7 form the second, and nodes 1 and 3\nform the third.\nEXAMPLE 2\nInput tree: []\nOutput: []\nExplanation: An empty tree has no levels, so the result has no inner arrays.\nConstraints \u0026 guarantees\n• Node.val: -1000 through 1000 (inclusive)\n• Tree size: 0 through 2000 nodes\nJavaScript starter\nfunction levelOrder(root) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/binary-tree-level-order-traversal/) | — |
| <PracticeProblem id={103} title={"Binary Tree Zigzag Level Order Traversal"} text={"Problem statement\nReturn a binary tree's values one level at a time, alternating direction between levels. Read the\nroot level left to right, the next level right to left, and continue alternating. Return an array of level\narrays. An empty tree produces an empty result.\nInput \u0026 expected result\nAlternation depends on depth, not on whether a level contains one or several nodes. Omit null\npositions. The second level is reversed, the third is not, and this pattern continues for all existing\nlevels.\nEXAMPLE 1\nInput tree: [4,2,7,1,3,6,9]\nOutput: [[4],[7,2],[1,3,6,9]]\nExplanation: The second level is returned as 7,2, while the third returns to left-to-right order as\n1,3,6,9.\nEXAMPLE 2\nInput tree: [1,2,3,4,null,null,5]\nOutput: [[1],[3,2],[4,5]]\nExplanation: Missing children do not change the direction assigned to each level.\nConstraints \u0026 guarantees\n• Node.val: -100 through 100 (inclusive)\n• Tree size: 0 through 2000 nodes\nJavaScript starter\nfunction zigzagLevelOrder(root) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/) | — |
| <PracticeProblem id={114} title={"Flatten Binary Tree to Linked List"} text={"Problem statement\nFlatten a binary tree in place into a single chain using right pointers. The chain must follow the\noriginal preorder traversal: node, left subtree, then right subtree. Set every left pointer to null and\npreserve the original nodes and values. No separate list is returned. Aim for O(1) extra space.\nInput \u0026 expected result\nThe flattened result still uses the binary-tree nodes; it is not a separate ListNode list. Starting at\nroot and repeatedly following right must visit the original preorder sequence, and every node's left\nfield must be null.\nEXAMPLE 1\nInput tree: [4,2,6,1,3]\nRight-pointer chain after the call: 4 -\u003e 2 -\u003e 1 -\u003e 3 -\u003e 6\nExplanation: The tree's preorder is 4,2,1,3,6. Those same nodes become the right-only chain in\nthat order.\nEXAMPLE 2\nInput tree: [1,null,2,3]\nRight-pointer chain after the call: 1 -\u003e 2 -\u003e 3\nExplanation: The left child 3 of node 2 moves into the right-only chain after node 2.\nConstraints \u0026 guarantees\n• Node.val: -100 through 100 (inclusive)\n• Tree size: 0 through 2000 nodes\nJavaScript starter\nfunction flatten(root) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/flatten-binary-tree-to-linked-list/) | — |
| <PracticeProblem id={116} title={"Populating Next Right Pointers in Each Node"} text={"Problem statement \u0026 expected result\nFor a perfect binary tree, set each node's next pointer to the node immediately to its right on the same level. The\nfinal node of every level points to null. All next pointers initially equal null. Return root; use constant auxiliary\nspace, with recursive call frames exempted by the judge.\nEXAMPLE 1\nInput: root = [1,2,3,4,5,6,7]\nReturned root, with next links displayed: [1,#,2,3,#,4,5,6,7,#]\nExplanation: Each # marks a level end; next connects neighbors within that level.\nEXAMPLE 2\nInput: root = []\nReturned root, with next links displayed: []\nExplanation: An empty tree has no pointers to populate.\nConstraints \u0026 guarantees\n- The number of nodes in the tree is in the range [0, 2^12 - 1].\n- -1000 \u003c= Node.val \u003c= 1000\nJavaScript starter\nfunction connect(root) {\n// TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/populating-next-right-pointers-in-each-node/) | — |
| <PracticeProblem id={117} title={"Populating Next Right Pointers in Each Node II"} text={"Problem statement\nEach binary-tree node has val, left, right, and next. Initially every next pointer is null. Set next to\nthe nearest node to the right on the same level, or null when no such node exists. The tree need\nnot be perfect or complete. Return the root. Aim for constant auxiliary space apart from an implicit\nrecursive stack.\nInput \u0026 expected result\nPreserve val, left, and right; only next links describe the added horizontal connections. Each level's\nrightmost next must be null. Connections may cross between subtrees even when missing children\nleave gaps in the shape.\nEXAMPLE 1\nInput tree: [1,2,3,null,4,null,5]\nLevel links: 1 -\u003e null; 2 -\u003e 3 -\u003e null; 4 -\u003e 5 -\u003e null\nExplanation: Nodes 4 and 5 share a depth despite belonging to different parents. Their next\nlinks connect across that gap.\nEXAMPLE 2\nInput tree: [7,null,9]\nLevel links: 7 -\u003e null; 9 -\u003e null\nExplanation: There is only one node at each depth, so neither node has a neighbor to its right.\nConstraints \u0026 guarantees\n• Tree size: 0 through 6000 nodes\n• Node.val: -100 through 100\nJavaScript starter\nfunction connect(root) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/) | — |
| <PracticeProblem id={129} title={"Sum Root to Leaf Numbers"} text={"Problem statement\nEvery node in a binary tree stores one digit from 0 to 9. Read each root-to-leaf path as a base-10\ninteger formed by concatenating its digits. Return the sum of all those integers. Only paths ending\nat leaves count, and each path includes the root digit.\nInput \u0026 expected result\nA path's value depends on digit position, not the sum of its digits. Shared prefix nodes participate\nseparately in each root-to-leaf number. Return the total as an integer; leading zero digits do not\nchange a number's numeric value.\nEXAMPLE 1\nInput tree: [2,1,3]\nOutput: 44, from numbers 21 and 23\nExplanation: The two leaf paths form 21 and 23. Adding these complete numbers gives 44.\nEXAMPLE 2\nInput tree: [1,0,2,3]\nOutput: 115\nExplanation: The leaf paths form 103 and 12, whose sum is 115.\nConstraints \u0026 guarantees\n• Node.val: 0 through 9 (inclusive)\n• Tree size: 1 through 1000 nodes. Maximum depth: 10. The resulting sum fits a signed 32-bit integer\nJavaScript starter\nfunction sumNumbers(root) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/sum-root-to-leaf-numbers/) | — |
| <PracticeProblem id={199} title={"Binary Tree Right Side View"} text={"Problem statement\nImagine looking at a binary tree from its right side. Return the value of the rightmost visible node\nat each depth, starting at the root and moving downward. A level may be represented by a node\nfrom a left subtree if no node exists farther right on that level.\nInput \u0026 expected result\nReturn one value for every nonempty level, ordered by increasing depth. Visibility is determined by\nthe tree's left-to-right position at that depth, not by which branch the node belongs to or by its\nnumerical value.\nEXAMPLE 1\nInput tree: [5,2,8,null,3,7]\nOutput: [5,8,7]\nExplanation: The visible values are root 5, node 8 at the next level, and node 7 at the deepest\nlevel.\nEXAMPLE 2\nInput tree: [1,2,3,4]\nOutput: [1,3,4]\nExplanation: Node 4 remains visible at the last level because no node exists to its right at that\ndepth.\nConstraints \u0026 guarantees\n• Node.val: -100 through 100 (inclusive)\n• Tree size: 0 through 100 nodes\nJavaScript starter\nfunction rightSideView(root) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/binary-tree-right-side-view/) | — |
| <PracticeProblem id={222} title={"Count Complete Tree Nodes"} text={"Problem statement\nCount the nodes of a complete binary tree. Every level except possibly the last is full, and nodes on\nthe last level occupy the leftmost positions. Return 0 for an empty tree. Use the completeness\nguarantee to achieve better than O(n) time rather than traversing every node.\nInput \u0026 expected result\nThe input is guaranteed complete; you do not need to validate that property. Count actual nodes,\nexcluding null children. The required improvement over linear time is part of the task, even though\na full traversal could produce the count.\nEXAMPLE 1\nInput tree: [1,2,3,4,5]\nOutput: 5\nExplanation: The first two levels contain three nodes, and the last level contains two more in its\nleftmost positions.\nEXAMPLE 2\nInput tree: [1,2,3,4,5,6]\nOutput: 6\nExplanation: The final level has three nodes; the unoccupied rightmost position is not counted.\nConstraints \u0026 guarantees\n• Node.val: 0 through 5 * 10^4 (inclusive)\n• Tree size: 0 through 5 * 10^4 nodes. Completeness is guaranteed\nJavaScript starter\nfunction countNodes(root) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/count-complete-tree-nodes/) | — |
| [LC 314 — Binary Tree Vertical Order Traversal](https://leetcode.com/problems/binary-tree-vertical-order-traversal/) | Medium · Premium | [LeetCode](https://leetcode.com/problems/binary-tree-vertical-order-traversal/) | — |
| <PracticeProblem id={427} title={"Construct Quad Tree"} text={"Problem statement\nRepresent a binary n by n grid as a quad tree, where n is a power of two. A uniform region\nbecomes a leaf with its common boolean val and null children. A mixed region becomes a nonleaf\nwhose four children represent its equal top-left, top-right, bottom-left, and bottom-right quadrants.\nContinue until every leaf is uniform. Nodes have val, isLeaf, topLeft, topRight, bottomLeft, and\nbottomRight. Nonleaf val may be either boolean. Return the root.\nInput \u0026 expected result\nUse true for a uniform region of 1s and false for a uniform region of 0s. isLeaf indicates whether\nsubdivision stops. A nonleaf must have all four quadrant children in their named positions; a leaf\nhas no children.\nEXAMPLE 1\nInput: grid = [[1,1],[1,0]]\nResult: a nonleaf root with leaf quadrant values true, true, true, false\nExplanation: The grid is mixed, so the root subdivides into four one-cell leaves. Their values\nfollow top-left, top-right, bottom-left, bottom-right order.\nEXAMPLE 2\nInput: grid = [[0,0],[0,0]]\nResult: a leaf root with val = false and all children null\nExplanation: The entire grid is uniform, so no quadrant subdivision is necessary.\nConstraints \u0026 guarantees\n• n == grid.length == grid[i].length\n• n is a power of two from 1 through 64. Grid entries are numeric 0 or 1\nJavaScript starter\nfunction construct(grid) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/construct-quad-tree/) | — |
| <PracticeProblem id={515} title={"Find Largest Value in Each Tree Row"} text={"Problem statement \u0026 expected result\nReturn the maximum node value at each depth of a binary tree, ordered from the root level downward. Return an\nempty array for an empty tree.\nEXAMPLE 1\nInput: root = [1,3,2,5,3,null,9]\nOutput: [1,3,9]\nExplanation: Level maxima are 1, then 3, then 9.\nEXAMPLE 2\nInput: root = [1,2,3]\nOutput: [1,3]\nExplanation: The two children have maximum value 3.\nConstraints \u0026 guarantees\n- The number of nodes in the tree will be in the range [0, 10^4].\n- -2^31 \u003c= Node.val \u003c= 2^31 - 1\nJavaScript starter\nfunction largestValues(root) {\n// TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/find-largest-value-in-each-tree-row/) | — |
| [LC 545 — Boundary of Binary Tree](https://leetcode.com/problems/boundary-of-binary-tree/) | Medium · Premium | [LeetCode](https://leetcode.com/problems/boundary-of-binary-tree/) | — |
| <PracticeProblem id={662} title={"Maximum Width of Binary Tree"} text={"Problem statement\nReturn the largest width among the levels of a binary tree. At each level, count positions from its\nleftmost real node through its rightmost real node, including missing positions between them as if\nthe tree were complete.\nInput \u0026 expected result\nA level with one real node has width 1. The maximum width fits a signed 32-bit integer.\nEXAMPLE 1\nInput: root = [1,2,3,4,null,null,7]\nOutput: 4\nExplanation: The last level spans positions for 4, two missing children, and 7.\nEXAMPLE 2\nInput: root = [9,8,null,7]\nOutput: 1\nExplanation: Each level has one real node; empty positions outside its ends do not count.\nConstraints \u0026 guarantees\n• Tree node count: [1, 3000]\n• -100 \u003c= Node.val \u003c= 100\nJavaScript starter\nfunction widthOfBinaryTree(root) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/maximum-width-of-binary-tree/) | — |
| <PracticeProblem id={863} title={"All Nodes Distance K in Binary Tree"} text={"Problem statement\nGiven a binary tree, a reference to target, and k, return the values of all nodes exactly k edges\naway from target. Paths may move toward a parent or a child. Node values are unique.\nInput \u0026 expected result\nReturn values in any order. The example target value identifies the node reference supplied by the\njudge.\nEXAMPLE 1\nInput: root = [5,2,8,1,3], target = node 2, k = 1\nOutput: [5,1,3]\nExplanation: The parent and the two children of node 2 are one edge away.\nEXAMPLE 2\nInput: root = [7], target = node 7, k = 0\nOutput: [7]\nExplanation: A node is zero edges from itself.\nConstraints \u0026 guarantees\n• Tree node count: [1, 500]\n• 0 \u003c= Node.val \u003c= 500\n• Node values are distinct\n• target identifies a node that belongs to the tree\n• 0 \u003c= k \u003c= 1000\nJavaScript starter\nfunction distanceK(root, target, k) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/) | — |
| [LC 1123 — Lowest Common Ancestor of Deepest Leaves](https://leetcode.com/problems/lowest-common-ancestor-of-deepest-leaves/) | Medium | [LeetCode](https://leetcode.com/problems/lowest-common-ancestor-of-deepest-leaves/) | — |
| <PracticeProblem id={1448} title={"Count Good Nodes in Binary Tree"} text={"Problem statement\nA node is good when its value is at least every value on the path from the root to that node. Count\nand return all good nodes. The root is always good. Equal values qualify, and comparisons concern\neach node's own ancestor path rather than the entire tree.\nInput \u0026 expected result\nFor each node, consider the root-to-node path including that node itself. A larger value in another\nbranch does not disqualify it. Return a count, not a list of values; equal-valued nodes can each\nqualify separately.\nEXAMPLE 1\nInput tree: [5,3,7,5,4,6,9]\nOutput: 4\nExplanation: The good nodes have values 5 at the root, 7, the descendant 5, and 9. The other\nnodes have larger ancestors.\nEXAMPLE 2\nInput tree: [2,2,1]\nOutput: 2\nExplanation: The root and its equal-valued left child qualify; the right child is smaller than its\nancestor.\nConstraints \u0026 guarantees\n• Tree size: 1 through 10^5 nodes. Node values range from -10^4 through 10^4\nJavaScript starter\nfunction goodNodes(root) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/count-good-nodes-in-binary-tree/) | — |
| [LC 1650 — Lowest Common Ancestor of a Binary Tree III](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-iii/) | Medium · Premium | [LeetCode](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-iii/) | — |
| [LC 2385 — Amount of Time for Binary Tree to Be Infected](https://leetcode.com/problems/amount-of-time-for-binary-tree-to-be-infected/) | Medium | [LeetCode](https://leetcode.com/problems/amount-of-time-for-binary-tree-to-be-infected/) | — |
| <PracticeProblem id={124} title={"Binary Tree Maximum Path Sum"} text={"Problem statement\nA path in a nonempty binary tree is a sequence of adjacent nodes with no node visited twice. It\nmay start and end anywhere and does not have to include the root. Return the largest possible\nsum of values on any nonempty path. Negative node values are allowed.\nInput \u0026 expected result\nA path cannot branch into three directions or reuse a node. At least one node must be selected, so\nan all-negative tree still has a negative answer. Return only the maximum sum, without returning\nthe path's nodes.\nEXAMPLE 1\nInput tree: [2,-1,4]\nOutput: 6, from path 2 -\u003e 4\nExplanation: The path containing 2 and 4 has sum 6. Including -1 would reduce that sum to 5.\nEXAMPLE 2\nInput tree: [-5,-2,-8]\nOutput: -2\nExplanation: Selecting only the node valued -2 gives the greatest permitted nonempty path\nsum.\nConstraints \u0026 guarantees\n• Node.val: -1000 through 1000 (inclusive)\n• Tree size: 1 through 3 * 10^4 nodes\nJavaScript starter\nfunction maxPathSum(root) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/binary-tree-maximum-path-sum/) | — |
| <PracticeProblem id={297} title={"Serialize and Deserialize Binary Tree"} text={"Problem statement\nImplement serialize(root) to turn a binary tree into a string and deserialize(data) to rebuild an\nequivalent tree from that string. Preserve node values and exact child structure, including missing\nchildren. You choose the encoding format. Handle an empty tree, and do not rely on saved state\nfrom the serialization call.\nInput \u0026 expected result\nThe two functions must agree on an encoding that unambiguously represents null child positions.\nThe serialized text need not match the example display format. deserialize must return newly\nreconstructed nodes with the original structure and values.\nEXAMPLE 1\nInput tree: [7,3,9,null,4]\nAfter deserialize(serialize(root)): an equivalent [7,3,9,null,4] tree\nExplanation: A round trip preserves the missing left child below 3 and the placement of its right\nchild 4.\nEXAMPLE 2\nInput tree: [1,null,2]\nRound-trip result: an equivalent [1,null,2] tree\nExplanation: The encoding must distinguish this shape from a tree whose node 2 is the left child.\nConstraints \u0026 guarantees\n• Node.val: -1000 through 1000 (inclusive)\n• Tree size: 0 through 10^4 nodes\nJavaScript starter\nfunction serialize(root) {\n  // TODO: write your solution.\n}\nfunction deserialize(data) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) | — |
| [LC 987 — Vertical Order Traversal of a Binary Tree](https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/) | Hard | [LeetCode](https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/) | — |
| G42 — Count all nodes in a tree. | Exercise | Trees and BSTs. Related only: [LC 222](https://leetcode.com/problems/count-complete-tree-nodes/) - Count Complete Tree Nodes. Assumes a complete binary tree; the earlier exercise allows any tree. | — |
| G43 — Count nodes with no children. | Exercise | Trees and BSTs | — |
| G44 — Return the top, bottom, left, and right tree views. | Exercise | Trees and BSTs. Retained as the broader multi-view exercise; the right-view subproblem is linked separately. Related only: [LC 199](https://leetcode.com/problems/binary-tree-right-side-view/) - Binary Tree Right Side View. Covers the right-side view only; top, bottom, and left views remain general exercises. | — |
| G47 — Check that each parent equals its children's sum. | Exercise | Trees and BSTs. Related only: [LC 2236](https://leetcode.com/problems/root-equals-sum-of-children/) - Root Equals Sum of Children. Checks a tree with exactly three nodes; the general exercise checks every parent. | — |

{/* END GENERATED PRACTICE PROBLEMS */}

## Related Topics

- [Recursion](../recursion/README.md) — most tree algorithms are naturally recursive
- [Heap](../heap/README.md) — a heap is a complete binary tree with ordering constraints
- [Queue](../queue/README.md) — BFS traversal depends on a queue data structure
- [Stack](../stack/README.md) — DFS traversal uses a stack (or recursion call stack)
- [Trie](../trie/README.md) — an N-ary tree specialized for string prefix operations

---

## References

- [Wikipedia — Tree (data structure)](<https://en.wikipedia.org/wiki/Tree_(data_structure)>)
- [HackerRank — Trees video playlist](https://www.youtube.com/watch?v=oSWTXtMglKE&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=8)
- [Visualgo — BST visualization](https://visualgo.net/en/bst)

[← Back to DSA](../index.md) · &copy; sparshjaswal

**Next:** [binary search trees](./binary-search-tree/README.md).
