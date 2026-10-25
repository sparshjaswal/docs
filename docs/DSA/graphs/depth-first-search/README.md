---
id: dsa-graphs-depth-first-search-readme
title: "Depth-First Search (DFS)"
slug: /DSA/graphs/depth-first-search/README
sidebar_label: "Depth-First Search (DFS)"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Depth-First Search (DFS)

**Read first:** [Stack](../../stack/README.md).

**Practice focus:** Follow one branch, record the unfinished branches, and test a graph containing a cycle.

Depth-first search (DFS) follows one branch as far as it can, then comes back to try another. Use recursion or an explicit stack to remember unfinished branches. In a graph, mark visited nodes so a cycle cannot keep the search running forever.


<AlgorithmWalkthrough name="dfs" />

## Tree traversal

In a rooted tree, following child edges visits every node without a visited set. For a graph with cycles or multiple paths to a vertex, mark each vertex before exploring its neighbors. Recursive DFS uses O(h) stack space for a tree of height h; graph traversal takes O(V + E) time with adjacency lists.

See the [tree guide](../../trees/README.md) for preorder, inorder, and postorder examples. The separate source implementations support their respective data structures:

| Data structure | Implementation | Legacy tests |
| --- | --- | --- |
| Graph | [depthFirstSearch.js](./depthFirstSearch.js) | [Tests](./__test__/depthFirstSearch.test.js) |
| Binary tree | [depthFirstSearch.js](../../trees/depth-first-search/depthFirstSearch.js) | [Tests](../../trees/depth-first-search/__test__/depthFirstSearch.test.js) |

## Exercise and failure drill

Trace a cycle A→B→C→A and a chain long enough to exceed the language call stack. Explain two different protections.

<details>
<summary>Expected trace and debugging checks</summary>

Visited state prevents cycling; an explicit stack avoids relying on unbounded recursion depth. Neither protection replaces the other. For directed cycle detection, distinguish an active-path vertex from an already completed one.

</details>

## Interview reasoning

Does DFS find the shortest path? Its first discovered route need not minimize edges. Choose [BFS](../breadth-first-search/README.md) for an unweighted shortest route.

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Depth-first_search)
- [Tree Traversals (Inorder, Preorder and Postorder)](https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/)
- [BFS vs DFS](https://www.geeksforgeeks.org/bfs-vs-dfs-binary-tree/)
- [DFS Visualization](https://www.cs.usfca.edu/~galles/visualization/DFS.html)

**Next:** [Detect Cycle in Graphs](../detect-cycle/README.md).
