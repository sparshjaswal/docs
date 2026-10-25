---
id: dsa-graphs-breadth-first-search-readme
title: "Breadth-First Search (BFS)"
slug: /DSA/graphs/breadth-first-search/README
sidebar_label: "Breadth-First Search (BFS)"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Breadth-First Search (BFS)

**Read first:** [Queue](../../queue/README.md).

**Practice focus:** Trace the queue one layer at a time and mark each vertex when it joins the queue.

Breadth-first search (BFS) visits the starting node, then its neighbors, then their unvisited neighbors. A queue keeps that order. When every edge has the same cost, the first time a node is discovered gives a route with the fewest edges.


<AlgorithmWalkthrough name="bfs" />

## JavaScript Implementation {/* #pseudocode */}

For a rooted binary tree, visit nodes one level at a time. Each node has a `value`, `left`, and `right`; missing children are `null`. An empty root produces an empty result. Two level arrays act as batches of a queue, avoiding repeated `shift()` calls.

```js runnable
function levelOrder(root) {
  if (root === null) return [];
  const result = [];
  let level = [root];
  while (level.length > 0) {
    const nextLevel = [];
    for (const node of level) {
      result.push(node.value);
      if (node.left !== null) nextLevel.push(node.left);
      if (node.right !== null) nextLevel.push(node.right);
    }
    level = nextLevel;
  }
  return result;
}

const tree = {
  value: 1,
  left: { value: 2, left: null, right: null },
  right: {
    value: 3,
    left: { value: 4, left: null, right: null },
    right: null,
  },
};
console.log(levelOrder(tree).join(','));
console.log(JSON.stringify(levelOrder(null)));
```

```text output
1,2,3,4
[]
```

The level arrays take O(w) extra space, where w is the maximum level width. The returned array takes O(n) space. Each node is visited once, giving O(n) time. This implementation expects a tree with no cycles or shared children.

For a graph, also mark vertices as discovered when they enter the queue, so cycles and shared neighbors do not enqueue the same vertex repeatedly. With adjacency lists and O(1) queue operations, graph traversal takes O(V + E) time. See the [graph traversal example](../README.md) for that version.

See the [tree guide](../../trees/README.md) for a JavaScript level-order example. The separate source implementations support their respective data structures:

| Data structure | Implementation | Legacy tests |
| --- | --- | --- |
| Graph | [breadthFirstSearch.js](./breadthFirstSearch.js) | [Tests](./__test__/breadthFirstSearch.test.js) |
| Binary tree | [breadthFirstSearch.js](../../trees/breadth-first-search/breadthFirstSearch.js) | [Tests](../../trees/breadth-first-search/__test__/breadthFirstSearch.test.js) |

## Exercise and failure drill

In a diamond graph A→B, A→C, B→D, C→D, list the enqueue events when discovery is marked immediately.

<details>
<summary>Expected trace and debugging checks</summary>

A, B, C, and D each enter once, assuming B precedes C in the neighbor list. Marking only on removal can enqueue D twice. Distances are stable, but equal-length parent choices can depend on neighbor order.

</details>

## Interview reasoning

Can BFS minimize a path with unequal edge costs? Ordinary BFS minimizes edge count. Use the appropriate [shortest-path method](../dijkstra/README.md) when costs vary.

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Breadth-first_search)
- [Tree Traversals (Inorder, Preorder and Postorder)](https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/)
- [BFS vs DFS](https://www.geeksforgeeks.org/bfs-vs-dfs-binary-tree/)
- [BFS Visualization](https://www.cs.usfca.edu/~galles/visualization/BFS.html)

**Next:** [Depth-First Search (DFS)](../depth-first-search/README.md).
