---
id: dsa-recursion-readme
title: "Recursion"
slug: /DSA/recursion/README
sidebar_label: "Recursion"
---

import PracticeProblem from '@site/src/components/PracticeProblem';
import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Recursion: let a smaller problem help

**Learn first:** [functions, return values, conditions, loops, and arrays](../javascript-for-dsa.md), [complexity](../complexity.md), and the last-in, first-out rule of a [stack](../stack/README.md). By the end, you should be able to trace calls, explain why a recursive function stops, and choose a loop when deep recursion is unsafe.

Imagine multiplying `3 × 2 × 1`. If someone has already found `2 × 1`, you only need to multiply their answer by `3`. **Recursion** turns that idea into code: a function asks the same function to solve a smaller instance, then uses the returned answer.

Use recursion when the input naturally splits into smaller parts: a branch of a tree, half of an array, or the remaining choices in a search. A simple scan usually needs only a loop. Recursive code is not automatically faster; its value is expressing the structure of the problem clearly.

## Learning steps

A folder can contain smaller folders. A function can process each smaller folder using the same rule, then return to its caller.

1. Identify the smallest case and the smaller recursive input.
2. Trace calls and returned values using the factorial example.
3. Compare repeated Fibonacci calls with saved answers and a loop.

## Three questions before writing code

1. **What does one call promise to return?** For `factorial(n)`, the product of the integers from `1` to `n`. This is the function's **contract**.
2. **Which input can I answer immediately?** `factorial(0)` and `factorial(1)` are `1`. This is the **base case**.
3. **How does every other call get closer to that case?** For `n > 1`, ask for `factorial(n - 1)`, then multiply its answer by `n`. This is the **recursive case**.

The symbol `n!` means factorial; it is mathematical notation, not JavaScript syntax. In code, `!` means logical NOT. Write the multiplication explicitly.

<AlgorithmWalkthrough name="recursion" />

## A complete first program

The input is an integer from `0` through `18`. This range keeps every result within JavaScript's safe-integer range. The algorithm does not change its input.

```js runnable
function factorial(number) {
  if (!Number.isInteger(number) || number < 0 || number > 18) {
    throw new RangeError('Use an integer from 0 through 18');
  }
  if (number <= 1) return 1;
  const smallerAnswer = factorial(number - 1);
  return number * smallerAnswer;
}

console.log(factorial(3));
console.log(factorial(0));
console.log(factorial(6));
```

```text output
6
1
720
```

`return` sends a value back to the call that asked for it. `smallerAnswer` does not receive a value until the smaller call finishes. Each call has its **own** `number` and `smallerAnswer`; changing the local state of one call does not replace another call's local state.

### Follow the calls and returns

```text
New calls go downward:                Answers return upward:

factorial(3): waits for 3 * [ ? ]      factorial(3): 3 * 2 = 6
              |                                      ^
              v                                      |
factorial(2): waits for 2 * [ ? ]      factorial(2): 2 * 1 = 2
              |                                      ^
              v                                      |
factorial(1): returns 1               factorial(1): 1
```

Each row is one call, not a separate function definition. The runtime remembers the unfinished calls on the **call stack**. The latest unfinished call resumes first. Returning from the base case therefore finishes `factorial(2)` before `factorial(3)`. This return journey is often called **unwinding**.

| Step | What runs | What remains unfinished |
| --- | --- | --- |
| 1 | `factorial(3)` calls `factorial(2)` | Multiply the smaller answer by `3` |
| 2 | `factorial(2)` calls `factorial(1)` | Multiply by `2`, then by `3` |
| 3 | `factorial(1)` returns `1` | The two waiting multiplications |
| 4 | `factorial(2)` returns `2 * 1 = 2` | The multiplication by `3` |
| 5 | `factorial(3)` returns `3 * 2 = 6` | Nothing |

### Why this is correct

The base cases match the definition. For a larger `n`, suppose the smaller call correctly returns `(n - 1)!`. Multiplying that answer by `n` gives exactly `n!`. This reasoning from a correct smaller case to the next case is **induction**. It works because repeated subtraction reaches the base case; saying "assume the smaller call works" without proving progress would leave a gap.

There are `O(n)` calls and `O(n)` simultaneous stack frames in the general recurrence. We count arithmetic as constant time here because the example restricts numbers to safe integers. An iterative factorial needs the same `O(n)` arithmetic operations but only `O(1)` extra space. For unbounded `BigInt` factorials, multiplication cost grows with the number of digits; do not silently reuse the constant-time arithmetic assumption.

## Repeated work: three ways to find Fibonacci numbers

Define `F(0) = 0`, `F(1) = 1`, and `F(n) = F(n - 1) + F(n - 2)` for larger `n`. Each number is the sum of the previous two. Direct recursion follows the definition but solves some inputs repeatedly:

```text
F(5)
|-- F(4)
|   |-- F(3) <-- same input appears again below
|   `-- F(2)
`-- F(3)     <-- repeated work
    |-- F(2)
    `-- F(1)
```

**Memoization** means remembering an answer by the input that produced it. A `Map` lets a later call reuse that answer. It is safe here because `F(3)` always has the same answer, regardless of who asks for it.

The following complete comparison uses a small input so that the slow version finishes quickly. The functions require an integer `n` from `0` through `78` for exact `Number` results; use the naive version only for small demonstrations.

```js runnable
function fibonacciNaive(n) {
  if (n <= 1) return n;
  return fibonacciNaive(n - 1) + fibonacciNaive(n - 2);
}

function fibonacciMemo(n, answers = new Map()) {
  if (n <= 1) return n;
  if (answers.has(n)) return answers.get(n);
  const answer = fibonacciMemo(n - 1, answers) + fibonacciMemo(n - 2, answers);
  answers.set(n, answer);
  return answer;
}

function fibonacciLoop(n) {
  if (n <= 1) return n;
  let previous = 0; // F(0)
  let current = 1;  // F(1)
  for (let index = 2; index <= n; index++) {
    const next = previous + current;
    previous = current;
    current = next;
  }
  return current;
}

console.log(fibonacciNaive(10));
console.log(fibonacciMemo(10));
console.log(fibonacciLoop(10));
console.log(fibonacciLoop(0));
```

```text output
55
55
55
0
```

The loop keeps the invariant that, before iteration `index`, `previous` is `F(index - 2)` and `current` is `F(index - 1)`. One addition moves both forward by one position. After the iteration for `index = n`, `current` is `F(n)`. The early return handles `0` and `1` without entering the loop.

| Completed iterations | `previous` | `current` |
| --- | --- | --- |
| 0 | `F(0) = 0` | `F(1) = 1` |
| 1 | `F(1) = 1` | `F(2) = 1` |
| 2 | `F(2) = 1` | `F(3) = 2` |
| 3 | `F(3) = 2` | `F(4) = 3` |
| 4 | `F(4) = 3` | `F(5) = 5` |

| Approach | Time | Extra space | Tradeoff |
| --- | --- | --- | --- |
| Direct recursion | `O(2^n)` upper bound | `O(n)` call stack | Mirrors the definition but repeats work |
| Memoized recursion | `O(n)` expected with `Map` lookups | `O(n)` cache and call stack | Computes each distinct input once |
| Loop | `O(n)` | `O(1)` | Keeps only the two answers needed next |

The exponential version does not need exponential stack space: one branch finishes before the next branch runs. **Total calls** measure work; **deepest active chain** measures stack space. Continue to [dynamic programming](../dp/README.md) when you can explain that distinction.

## JavaScript limits and implementation choices

A correct recursive algorithm can still exceed the runtime's call-stack limit. There is no single portable safe depth for every JavaScript judge. Do not assume that a tail-recursive function will use constant stack space.

For a straight sequence such as factorial, use a loop when recursion adds no useful structure. For branching traversal, keep pending work in an explicit array stack with `push()` and `pop()`; the [iterative tree traversal](../trees/README.md#iterative-preorder) shows a complete implementation. This avoids growing the runtime call stack, but pending work still occupies memory.

Common mistakes to check:

- **No progress:** calling `factorial(n)` from `factorial(n)` never reaches a smaller input.
- **No returned answer:** `factorial(n - 1);` alone discards the result. Use the returned value.
- **A missing input rule:** a negative input does not belong to this factorial contract.
- **A shared mutable array:** callers may see later changes to the same array. In [backtracking](../backtracking/README.md), undo choices or copy a completed answer deliberately.
- **Repeated subproblems:** use a cache only when its key contains all state that affects the answer.
- **Hidden copying:** `array.slice(1)` on every call copies data. Passing an index avoids that repeated cost.

## Understanding checks

1. Does a base case alone guarantee that recursion stops?
2. Does the base case return directly to the first call?
3. Why does memoization make Fibonacci faster without making its stack constant-sized?

<details>
<summary>Check the answers</summary>

1. No. Every recursive path must reach it. Calling the same input repeatedly still fails.
2. It returns to the most recent waiting call. That call may then return to another caller.
3. It removes repeated calculations, but the first descent can still contain `n` nested calls. A loop removes that call chain.

</details>

## Graduated exercises

1. **Trace:** draw the calls for `factorial(4)`, then write the returned values in order.
2. **Implement:** write `sumDigits(number)` recursively for a nonnegative safe integer. For `407`, return `11`; for `0`, return `0`. State the base case and the smaller input.
3. **Choose and justify:** if an array may contain 100,000 items, would you sum it with one recursive call per item? Write a loop and explain the memory difference. Then move to the tree exercises to practice branching recursion.

<details>
<summary>Hints</summary>

1. The smallest call runs first, but the original call finishes last.
2. `number % 10` gives the last digit; `Math.floor(number / 10)` removes it.
3. Only one running total is needed. The result does not depend on keeping earlier calls unfinished.

</details>

<details>
<summary>Solutions — open after attempting</summary>

1. Calls: `4 → 3 → 2 → 1`. Returned answers: `1 → 2 → 6 → 24`.
2. Each call removes one digit. The empty remainder contributes zero; adding the removed digit reconstructs the sum. For a positive `d`-digit input, time and stack space are `O(d)`.
3. The loop is suitable. It uses `O(n)` time and `O(1)` extra space; the direct recursive scan uses `O(n)` stack space and may exceed the runtime limit. The sums in this example fit in the safe-integer range.

```js runnable
function sumDigits(number) {
  if (number === 0) return 0;
  return number % 10 + sumDigits(Math.floor(number / 10));
}

function sumArray(values) {
  let total = 0;
  for (const value of values) total += value;
  return total;
}

console.log(sumDigits(407));
console.log(sumDigits(0));
console.log(sumArray([4, 0, 7]));
console.log(sumArray([]));
```

```text output
11
0
11
0
```

</details>

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| [LC 94 — Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/) | Easy | [LeetCode](https://leetcode.com/problems/binary-tree-inorder-traversal/) | — |
| <PracticeProblem id={100} title={"Same Tree"} text={"Problem statement\nDetermine whether binary trees p and q are identical. They must have the same structure, and\nevery pair of nodes at corresponding positions must have equal values. Two empty trees are\nidentical. Equal traversals alone are not sufficient if child positions differ.\nInput \u0026 expected result\nReturn a boolean without constructing a replacement tree. A missing left child and a missing right\nchild are different structural positions. Corresponding null children match, but a null child cannot\nmatch an existing node.\nEXAMPLE 1\nInput: p = [2,1,3], q = [2,1,3]\nOutput: true\nExplanation: Both trees have root 2, left child 1, and right child 3, with the same missing\nchildren below them.\nEXAMPLE 2\nInput: p = [1,2], q = [1,null,2]\nOutput: false\nExplanation: The node valued 2 is on opposite sides of the root, so the structures differ.\nConstraints \u0026 guarantees\n• Node.val: -10^4 through 10^4 (inclusive)\n• Each tree has 0 through 100 nodes\nJavaScript starter\nfunction isSameTree(p, q) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/same-tree/) | — |
| <PracticeProblem id={101} title={"Symmetric Tree"} text={"Problem statement\nDetermine whether a binary tree is a mirror image of itself around its root. Mirrored nodes must\nhave equal values, with the left child on one side corresponding to the right child on the other.\nReturn a boolean; a tree with only a root is symmetric.\nInput \u0026 expected result\nCompare positions reflected across the root, including missing children. Having the same values on\nboth sides is insufficient if their placement is not mirrored. Return true only when both structure\nand values match at every reflected pair.\nEXAMPLE 1\nInput tree: [8,4,4,1,6,6,1]\nOutput: true\nExplanation: The two 4 nodes mirror each other; their children are 1,6 on the left and 6,1 on the\nright.\nEXAMPLE 2\nInput tree: [1,2,2,null,3,null,3]\nOutput: false\nExplanation: Both 3 nodes are right children. Mirror symmetry would require one to be a left\nchild.\nConstraints \u0026 guarantees\n• Node.val: -100 through 100 (inclusive)\n• Tree size: 1 through 1000 nodes\nJavaScript starter\nfunction isSymmetric(root) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/symmetric-tree/) | — |
| <PracticeProblem id={104} title={"Maximum Depth of Binary Tree"} text={"Problem statement\nReturn the maximum depth of a binary tree. Depth counts nodes along a path from the root to a\nleaf, so a tree consisting only of its root has depth 1. A null root has depth 0. Children are reached\nthrough left and right pointers.\nInput \u0026 expected result\nMeasure length in nodes, not edges. Only paths that begin at root and end at a leaf are candidates.\nA missing child does not add a level, and different branches may have different depths.\nEXAMPLE 1\nInput tree, level order: [5,2,8,null,3]\nOutput: 3\nExplanation: The path 5 -\u003e 2 -\u003e 3 contains three nodes and is longer than the path from 5\ndirectly to 8.\nEXAMPLE 2\nInput tree: [9]\nOutput: 1\nExplanation: The single root is also a leaf, so the longest root-to-leaf path contains one node.\nConstraints \u0026 guarantees\n• Node.val: -100 through 100 (inclusive)\n• Tree size: 0 through 10^4 nodes\nJavaScript starter\nfunction maxDepth(root) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/maximum-depth-of-binary-tree/) | — |
| <PracticeProblem id={110} title={"Balanced Binary Tree"} text={"Problem statement\nDetermine whether a binary tree is height-balanced. At every node, the heights of its left and right\nsubtrees must differ by at most one. This condition must hold throughout the tree, not just at its\nroot. An empty tree is balanced.\nInput \u0026 expected result\nHeight counts the longest downward route within a subtree; either consistent node-based or\nedge-based height conventions give the same differences. Return a boolean. A balanced root does\nnot excuse an unbalanced descendant.\nEXAMPLE 1\nInput tree: [1,2,null,3]\nOutput: false\nExplanation: At root 1, the left branch extends through 2 to 3 while the right subtree is empty,\nproducing a height difference of two.\nEXAMPLE 2\nInput tree: [1,2,3,4]\nOutput: true\nExplanation: Every node's two subtree heights differ by at most one, including the root.\nConstraints \u0026 guarantees\n• Node.val: -10^4 through 10^4 (inclusive)\n• Tree size: 0 through 5000 nodes\nJavaScript starter\nfunction isBalanced(root) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/balanced-binary-tree/) | — |
| <PracticeProblem id={112} title={"Path Sum"} text={"Problem statement\nDetermine whether a binary tree has a root-to-leaf path whose node values sum to targetSum. A\nleaf has no children, so stopping at an internal node does not qualify. A null tree has no such path.\nValues may be negative.\nInput \u0026 expected result\nReturn true if at least one complete root-to-leaf path matches, even when other paths do not. Each\nnode's value contributes once along that path. An internal prefix equal to targetSum is not a valid\nendpoint.\nEXAMPLE 1\nInput tree: [5,2,8,1,4], targetSum = 8\nOutput: true, from path 5 -\u003e 2 -\u003e 1\nExplanation: The path through nodes 5,2,1 ends at a leaf and sums to 8, so one qualifying path\nexists.\nEXAMPLE 2\nInput tree: [5,3], targetSum = 5\nOutput: false\nExplanation: The root alone sums to 5 but is not a leaf. The only root-to-leaf path sums to 8.\nConstraints \u0026 guarantees\n• Node.val: -1000 through 1000 (inclusive)\n• targetSum: -1000 through 1000 (inclusive)\n• Tree size: 0 through 5000 nodes\nJavaScript starter\nfunction hasPathSum(root, targetSum) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/path-sum/) | — |
| [LC 144 — Binary Tree Preorder Traversal](https://leetcode.com/problems/binary-tree-preorder-traversal/) | Easy | [LeetCode](https://leetcode.com/problems/binary-tree-preorder-traversal/) | — |
| [LC 145 — Binary Tree Postorder Traversal](https://leetcode.com/problems/binary-tree-postorder-traversal/) | Easy | [LeetCode](https://leetcode.com/problems/binary-tree-postorder-traversal/) | — |
| <PracticeProblem id={226} title={"Invert Binary Tree"} text={"Problem statement\nInvert a binary tree by swapping every node's left and right subtrees. Return the root after the\nchanges. Preserve all node values, and apply the swap throughout the tree rather than only at the\nroot. An empty tree remains empty.\nInput \u0026 expected result\nEach local left/right swap also applies within descendants. Return the root reference for the fully\ninverted tree. Array notation in examples describes the resulting shape in level order, with null\nmarkers where a child is missing.\nEXAMPLE 1\nInput tree: [4,2,7,1,3]\nReturn tree: [4,7,2,null,null,3,1]\nExplanation: The root's subtrees exchange sides, and nodes 1 and 3 also exchange positions\nbeneath their parent 2.\nEXAMPLE 2\nInput tree: [1,null,2]\nReturn tree: [1,2]\nExplanation: The original right child becomes the left child, and the root's right pointer becomes\nnull.\nConstraints \u0026 guarantees\n• Node.val: -100 through 100 (inclusive)\n• Tree size: 0 through 100 nodes\nJavaScript starter\nfunction invertTree(root) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/invert-binary-tree/) | — |
| [LC 509 — Fibonacci Number](https://leetcode.com/problems/fibonacci-number/) | Easy | [LeetCode](https://leetcode.com/problems/fibonacci-number/) | [Example](../math/LC-509-Fibonacci-Number/README.md) |
| <PracticeProblem id={50} title={"Pow(x, n)"} text={"Problem statement\nImplement x raised to the integer power n. x is a real number, and n may be positive, zero, or\nnegative, including the minimum signed 32-bit integer. A negative exponent means the reciprocal\nof the corresponding positive power. Inputs avoid an undefined zero-base nonpositive exponent.\nReturn a numeric result efficiently.\nInput \u0026 expected result\nReturn a floating-point number rather than a formatted string. The sign of a negative base depends\non exponent parity. When n is zero, the defined input has result 1; a negative n requires reciprocal\nbehavior without overflowing while handling its magnitude.\nEXAMPLE 1\nInput: x = 2, n = -3\nOutput: 0.125\nExplanation: The value 2^-3 is 1 / 2^3 = 1/8, which equals 0.125.\nEXAMPLE 2\nInput: x = -2, n = 3\nOutput: -8\nExplanation: Multiplying an odd number of negative factors produces a negative result.\nConstraints \u0026 guarantees\n• -100.0 \u003c x \u003c 100.0\n• n: -2^31 through 2^31-1 (inclusive)\n• x^n: -10^4 through 10^4 (inclusive)\n• The exponent is an integer. A zero base is permitted only with a positive exponent\nJavaScript starter\nfunction myPow(x, n) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/powx-n/) | — |
| <PracticeProblem id={105} title={"Construct Binary Tree from Preorder and Inorder Traversal"} text={"Problem statement\npreorder and inorder describe traversals of the same binary tree, and node values are unique. In\npreorder a node comes before its left and right subtrees; in inorder it comes between them.\nReconstruct the tree and return its root. The traversals are valid and have matching lengths and\nvalues.\nInput \u0026 expected result\nThe first traversal lists each root before its descendants; the second locates that root between its\nleft and right descendants. Return a tree whose two traversals exactly reproduce the inputs. Do not\nreturn an array as the function result.\nEXAMPLE 1\nInput: preorder = [4,2,1,3,6], inorder = [1,2,3,4,6]\nReturn tree: [4,2,6,1,3]\nExplanation: The returned tree has preorder 4,2,1,3,6 and inorder 1,2,3,4,6, matching both\nsupplied traversals.\nEXAMPLE 2\nInput: preorder = [8], inorder = [8]\nReturn tree: [8]\nExplanation: With one shared value, the reconstructed tree contains only that root.\nConstraints \u0026 guarantees\n• preorder.length: 1 through 3000 (inclusive)\n• inorder.length == preorder.length\n• preorder[i], inorder[i]: -3000 through 3000 (inclusive)\n• Both traversals describe the same valid tree and use the same distinct values\nJavaScript starter\nfunction buildTree(preorder, inorder) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) | — |
| <PracticeProblem id={106} title={"Construct Binary Tree from Inorder and Postorder Traversal"} text={"Problem statement\ninorder and postorder are valid traversals of one binary tree whose node values are unique. Inorder\nvisits left subtree, node, then right subtree; postorder visits left, right, then node. Reconstruct the\noriginal tree and return its root.\nInput \u0026 expected result\nBoth arrays contain exactly the tree's node values, without repetitions. Build child references so\nthat traversing the returned root in either specified order matches its corresponding input array.\nThe level-order result shown in examples is only display notation.\nEXAMPLE 1\nInput: inorder = [1,2,3,4,6], postorder = [1,3,2,6,4]\nReturn tree: [4,2,6,1,3]\nExplanation: The resulting tree's left subtree contains 1,2,3, its root is 4, and its right subtree is\nthe single node 6.\nEXAMPLE 2\nInput: inorder = [2,5], postorder = [2,5]\nReturn tree: [5,2]\nExplanation: Node 2 is visited before root 5 in both traversals, so it is the root's left child.\nConstraints \u0026 guarantees\n• inorder.length: 1 through 3000 (inclusive)\n• postorder.length == inorder.length\n• inorder[i], postorder[i]: -3000 through 3000 (inclusive)\n• Both traversals describe the same valid tree and use the same distinct values\nJavaScript starter\nfunction buildTree(inorder, postorder) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/) | — |
| <PracticeProblem id={113} title={"Path Sum II"} text={"Problem statement\nReturn every path from the root to a leaf whose node values sum to targetSum. A leaf has no\nchildren. Each result path contains the visited values in root-to-leaf order; stopping at an internal\nnode is not a valid path.\nInput \u0026 expected result\nReturn an array of value arrays. An empty tree or no matching path gives [].\nEXAMPLE 1\nInput: root = [5,3,8,1,4], targetSum = 9\nOutput: [[5,3,1]]\nExplanation: The path 5 -\u003e 3 -\u003e 1 ends at a leaf and totals 9.\nEXAMPLE 2\nInput: root = [2,1], targetSum = 2\nOutput: []\nExplanation: The root has a child, so the root alone is not a root-to-leaf path.\nConstraints \u0026 guarantees\n• Tree node count: [0, 5000]\n• -1000 \u003c= Node.val \u003c= 1000\n• -1000 \u003c= targetSum \u003c= 1000\nJavaScript starter\nfunction pathSum(root, targetSum) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/path-sum-ii/) | — |
| <PracticeProblem id={236} title={"Lowest Common Ancestor of a Binary Tree"} text={"Problem statement\nFind the lowest common ancestor of distinct nodes p and q in a binary tree. This is the deepest\nnode whose subtree contains both; a node counts as its own descendant. p and q are guaranteed\nto exist. Return the node itself, using node identity rather than a newly created value.\nInput \u0026 expected result\nThe tree is not necessarily a BST, so numerical ordering does not define ancestry. An answer can\nbe p or q when one lies below the other. Return an existing node reference whose subtree includes\nboth targets.\nEXAMPLE 1\nInput tree: [6,2,8,1,4], p = node 1, q = node 4\nOutput: node 2\nExplanation: Nodes 1 and 4 lie below node 2, and no deeper node contains both of them.\nEXAMPLE 2\nInput tree: [3,1,5], p = node 3, q = node 1\nOutput: node 3\nExplanation: The root is one target and is an ancestor of the other, so it is their lowest common\nancestor.\nConstraints \u0026 guarantees\n• Node.val: -10^9 through 10^9 (inclusive)\n• p != q\n• Tree size: 2 through 10^5 nodes. Values are distinct\n• both targets belong to the tree\nJavaScript starter\nfunction lowestCommonAncestor(root, p, q) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/) | — |
| [LC 687 — Longest Univalue Path](https://leetcode.com/problems/longest-univalue-path/) | Medium | [LeetCode](https://leetcode.com/problems/longest-univalue-path/) | — |
| [LC 95 — Unique Binary Search Trees II](https://leetcode.com/problems/unique-binary-search-trees-ii/) | Medium | [LeetCode](https://leetcode.com/problems/unique-binary-search-trees-ii/) |  |
| [LC 894 — All Possible Full Binary Trees](https://leetcode.com/problems/all-possible-full-binary-trees/) | Medium | [LeetCode](https://leetcode.com/problems/all-possible-full-binary-trees/) |  |
| [CC — Recamán Sequence (RECAMAN)](https://www.codechef.com/problems/RECAMAN) | Easy | — |  |
| [LC 241 — Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses/) | Medium | [LeetCode](https://leetcode.com/problems/different-ways-to-add-parentheses/) |  |
| [LC 111 — Minimum Depth of Binary Tree](https://leetcode.com/problems/minimum-depth-of-binary-tree/) | Easy | [LeetCode](https://leetcode.com/problems/minimum-depth-of-binary-tree/) |  |
| [LC 372 — Super Pow](https://leetcode.com/problems/super-pow/) | Medium | [LeetCode](https://leetcode.com/problems/super-pow/) |  |
| [LC 390 — Elimination Game](https://leetcode.com/problems/elimination-game/) | Medium | [LeetCode](https://leetcode.com/problems/elimination-game/) |  |
| [LC 486 — Predict the Winner](https://leetcode.com/problems/predict-the-winner/) | Medium | [LeetCode](https://leetcode.com/problems/predict-the-winner/) |  |
| [LC 1137 — N-th Tribonacci Number](https://leetcode.com/problems/n-th-tribonacci-number/) | Easy | [LeetCode](https://leetcode.com/problems/n-th-tribonacci-number/) |  |
| [LC 1545 — Find Kth Bit in Nth Binary String](https://leetcode.com/problems/find-kth-bit-in-nth-binary-string/) | Medium | [LeetCode](https://leetcode.com/problems/find-kth-bit-in-nth-binary-string/) |  |
| [CC — Factorial (FACT)](https://www.codechef.com/problems/FACT) | Easy | — |  |
| [CC — Tower of Hanoi (HANOI)](https://www.codechef.com/problems/HANOI) | Medium | — |  |
| [CC — Recursive Function (RECFUNC)](https://www.codechef.com/problems/RECFUNC) | Easy | — |  |

{/* END GENERATED PRACTICE PROBLEMS */}

## Related Topics

- [Backtracking](../backtracking/README.md) — recursion with undo
- [Dynamic Programming](../dp/README.md) — memoised recursion
- [Trees](../trees/README.md) — most tree algorithms are recursive

[← Back to Home](../index.md) · © sparshjaswal

**Next:** [trees](../trees/README.md).
