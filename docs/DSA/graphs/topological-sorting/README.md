---
id: dsa-graphs-topological-sorting-readme
title: "Topological Sorting"
slug: /DSA/graphs/topological-sorting/README
sidebar_label: "Topological Sorting"
---

# Topological Sorting

**Practice focus:** Count unfinished prerequisites, remove one ready task, and explain what blocks the remaining tasks.

**Prerequisites:** directed adjacency lists, [queues](../../queue/README.md), and [graph traversal](../README.md). Learn to order prerequisites, detect when no complete order exists, and distinguish a blocked vertex from a vertex on a cycle.

A **topological order** is a task list where every prerequisite appears before the task that needs it. If an arrow goes from u to v, place u earlier than v. Tasks without a dependency between them may appear in either order.

A directed cycle makes a complete order impossible: each task in the cycle waits for another. A graph with no directed cycles is called a **DAG**, short for directed acyclic graph. It has at least one valid topological order.

![A topological order places every prerequisite before the task that depends on it.](https://upload.wikimedia.org/wikipedia/commons/c/c6/Topological_Ordering.svg)

In this drawing, each arrow goes from an earlier task at the upper left toward a later task at the lower right.

## Example

![A directed graph without cycles can have more than one valid topological order.](https://upload.wikimedia.org/wikipedia/commons/0/03/Directed_acyclic_graph_2.svg)

The graph shown above has many valid topological sorts, including:

- `5, 7, 3, 11, 8, 2, 9, 10` (visual left-to-right, top-to-bottom)
- `3, 5, 7, 8, 11, 2, 9, 10` (smallest-numbered available vertex first)
- `5, 7, 3, 8, 11, 10, 9, 2` (fewest edges first)
- `7, 5, 11, 3, 10, 8, 9, 2` (largest-numbered available vertex first)
- `5, 7, 11, 2, 3, 8, 9, 10` (attempting top-to-bottom, left-to-right)
- `3, 7, 8, 5, 11, 10, 2, 9` (arbitrary)

## Kahn's algorithm: count unfinished prerequisites

Use the direction **prerequisite → dependent**. In the graph `0 → 2`, `1 → 2`, `2 → 3`, task 2 requires both 0 and 1. Its indegree is 2; completing only one prerequisite must not make it ready.

| Completed vertex | Ready queue after processing | Remaining indegree of 2 | Remaining indegree of 3 |
| --- | --- | ---: | ---: |
| none | 0, 1 | 2 | 1 |
| 0 | 1 | 1 | 1 |
| 1 | 2 | 0 | 1 |
| 2 | 3 | 0 | 0 |
| 3 | empty | 0 | 0 |

**Invariant:** the queue contains discovered vertices with no unfinished incoming edges. Removing a queued vertex removes its outgoing prerequisites from consideration. Every vertex and edge is processed once, giving O(V + E) time and O(V) auxiliary space.

The self-contained example accepts an adjacency array with valid integer vertex IDs from 0 through `graph.length - 1`. It returns a complete order, or `null` if a cycle prevents one. The input graph is unchanged.

```js runnable
import assert from 'node:assert/strict';

function topologicalOrder(graph) {
  const indegree = Array(graph.length).fill(0);
  for (const neighbors of graph) {
    for (const vertex of neighbors) indegree[vertex] += 1;
  }
  const ready = [];
  for (let vertex = 0; vertex < graph.length; vertex += 1) {
    if (indegree[vertex] === 0) ready.push(vertex);
  }
  const order = [];
  for (let head = 0; head < ready.length; head += 1) {
    const vertex = ready[head];
    order.push(vertex);
    for (const neighbor of graph[vertex]) {
      indegree[neighbor] -= 1;
      if (indegree[neighbor] === 0) ready.push(neighbor);
    }
  }
  return order.length === graph.length ? order : null;
}

assert.deepEqual(topologicalOrder([]), []);
assert.deepEqual(topologicalOrder([[], []]), [0, 1]);
assert.equal(topologicalOrder([[0]]), null);
assert.equal(topologicalOrder([[1], [0, 2], []]), null);
console.log(JSON.stringify(topologicalOrder([[2], [2], [3], []])));
console.log('empty, disconnected, self-loop, and blocked-descendant cases checked');
```

```text output
[0,1,2,3]
empty, disconnected, self-loop, and blocked-descendant cases checked
```

A head index avoids repeatedly removing the first array element. If fewer than V vertices are emitted, some cycle remains, but **not every unprocessed vertex lies on that cycle**: in `0 → 1 → 0` with `1 → 2`, vertex 2 is blocked downstream. Use a cycle-finding or strongly connected components algorithm to identify actual cycle members.

Several orders may be correct. Test a proposed order by checking that every vertex appears exactly once and every edge moves forward in the order. If the product requires the smallest available ID first, use a priority queue and account for its extra cost.

## Application

For laundry, washing must finish before drying. Model tasks as vertices and draw `wash → dry`. A topological order respects that dependency; it does not estimate task durations or decide how many machines can run in parallel.

Another application is **dependency resolution**. If package `a` depends on package `b`, use edge `b → a` so the prerequisite is installed first. An input format that stores `a → b` instead needs its edges reversed, or an explicitly reversed interpretation of the resulting order. Naming the edge convention prevents accidentally installing dependents first.

## Worked examples and answers {/* #workbook-practice */}

Attempt the linked [Practice Problems](#practice-problems) before opening their answers. See the [workbook guide](../../../javascript/workbook.md) for the A–C exercise format.

### 41. Topological sorting and cycle detection {/* #workbook-41 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** build a schedule that respects every prerequisite.

Use [Kahn’s ready-task algorithm](#kahns-algorithm-count-unfinished-prerequisites) to trace the worked example. An edge from u to v means u must appear first; labels need not be in numeric order. **Indegree** counts incoming edges. A zero count means all prerequisites have already been emitted.

If fewer than V vertices are emitted, no full topological order exists. Some blocked vertices may merely be downstream of the cycle. A normal queue returns one valid order in O(V + E) time and O(V) extra space. A min-priority queue can instead choose the smallest ready identifier, with added heap work.

[Directed cycle detection](../detect-cycle/README.md) uses unvisited, active, and finished states. An edge to an active ancestor reveals a cycle; an edge to a finished vertex does not. Reversing DFS finishing order produces a topological order only when there is no such cycle. In an undirected graph, the parent edge is expected; parallel edges require edge-identity care.

**Worked example**

```js
function topologicalOrder(graph) {
  const indegree = Array(graph.length).fill(0);
  for (const neighbors of graph) {
    for (const v of neighbors) indegree[v]++;
  }
  const queue = [];
  indegree.forEach((degree, v) => { if (degree === 0) queue.push(v); });
  const order = [];
  for (let head = 0; head < queue.length; head++) {
    const u = queue[head];
    order.push(u);
    for (const v of graph[u]) {
      if (--indegree[v] === 0) queue.push(v);
    }
  }
  return order.length === graph.length ? order : null;
}
console.log(topologicalOrder([[2], [2], [3], []]).join(","));
console.log(topologicalOrder([[1], [0]]));
```

**Expected output**

```text
0,1,2,3
null
```

**Why the example works**

Both 0 and 1 begin ready. Processing only 0 does not release 2 because one prerequisite remains. Processing 1 drops that count to zero. In the cycle example, neither vertex begins ready, so the incomplete result is rejected.

</details>

Find **41A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-41-answer">
<summary>Check your reasoning and answer</summary>

For Node checks, add `import assert from "node:assert/strict";` at the top of your file. Browser and multi-file examples use the setup stated above.

**41A.** Yes. Vertices without a dependency relationship may appear in either relative order. A scheduling policy can select among valid choices but does not change the dependency requirement.

**41B.** No. A vertex can remain blocked by a prerequisite that depends on a cycle. Kahn's failure proves that a cycle exists somewhere in the remaining dependency structure.

**41C.** Check length, identifier range, and uniqueness, then map each vertex to its position. Every directed edge must move from a smaller position to a larger one.

**Reference code**

Use the worked example above first if the answer calls its functions or classes. Run each lesson in its own `.mjs` file.

```js
function isTopological(graph, order) {
  if (order.length !== graph.length) return false;
  const position = Array(graph.length).fill(-1);
  for (let i = 0; i < order.length; i++) {
    const v = order[i];
    if (!Number.isInteger(v) || v < 0 || v >= graph.length ||
        position[v] !== -1) return false;
    position[v] = i;
  }
  return graph.every((neighbors, u) =>
    neighbors.every(v => position[u] < position[v]));
}
```

**Check the result**

```js
assert.equal(isTopological([[1], []], [0, 1]), true);
assert.equal(isTopological([[1], []], [1, 0]), false);
assert.equal(isTopological([[], []], [0, 0]), false);
assert.equal(isTopological([], []), true);
```

</details>

## References

- [Princeton Algorithms: directed graphs](https://algs4.cs.princeton.edu/42digraph/)

- [Wikipedia](https://en.wikipedia.org/wiki/Topological_sorting)
- [Topological Sorting on YouTube by Tushar Roy](https://www.youtube.com/watch?v=ddTC4Zovtbc&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **41A — Can a DAG have multiple correct orders?** | **Must fix** | [Worked example](#workbook-41) | [Answer](#workbook-41-answer) |
| **41B — Does every unprocessed vertex necessarily lie on a cycle?** | **Must fix** | [Worked example](#workbook-41) | [Answer](#workbook-41-answer) |
| **41C — Write isTopological(graph, order) to validate a proposed complete order.** | **Must fix** | [Worked example](#workbook-41) | [Answer](#workbook-41-answer) |

## Continue learning

**Next:** [Strongly Connected Component](../strongly-connected-components/README.md).
