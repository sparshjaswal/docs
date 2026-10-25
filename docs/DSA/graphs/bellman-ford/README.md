---
id: dsa-graphs-bellman-ford-readme
title: "Bellman–Ford Algorithm"
slug: /DSA/graphs/bellman-ford/README
sidebar_label: "Bellman–Ford Algorithm"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Bellman–Ford Algorithm

**Practice focus:** Trace complete edge-relaxation rounds and explain what an improvement after the usual rounds means.

**Prerequisites:** directed weighted graphs, arrays, and [shortest-path relaxation](../dijkstra/README.md). Learn to handle negative edges and detect a negative cycle reachable from the chosen source.

Bellman–Ford finds the cheapest routes from one starting vertex in a **directed weighted graph**: arrows give allowed directions, and each arrow has a cost. Costs may be negative. Repeatedly check every edge for a cheaper route. If a reachable cycle keeps lowering the cost, the affected routes have no finite cheapest answer.

<AlgorithmWalkthrough name="bellmanFord" />

## Relaxation and the round invariant

`distance[v]` is the best source-to-v path cost found so far. For an edge `[u, v, weight]`, improve it only if u is reachable and `distance[u] + weight` is smaller. Initialize the source to zero and all other vertices to Infinity.

After r full edge scans, all shortest paths using at most r edges have been accounted for, although in-place updates may propagate farther during the same scan. Without a reachable negative cycle, a shortest path can be chosen without repeated vertices and therefore uses at most V − 1 edges. One more improving relaxation proves a reachable negative cycle exists. A negative edge by itself does not prove a cycle.

### Trace edges in an inconvenient order

Take `0 → 1` with weight 4, `0 → 2` with weight 1, and `2 → 1` with weight −2. Scan the edge `2 → 1` first:

| Full scan | Distances for vertices 0, 1, 2 | Reason |
| --- | --- | --- |
| Initial | `[0, Infinity, Infinity]` | Only the source is reachable |
| 1 | `[0, 4, 1]` | The edge from 2 cannot help until 2 is reached |
| 2 | `[0, -1, 1]` | The route through 2 improves vertex 1 |

This explains why one edge scan is not enough in general. A full scan with no changes is a valid early stopping condition: every relaxation is already stable.

## A complete JavaScript example

Assume `n >= 1`, valid vertex IDs, a valid source, and finite small weights whose path sums stay within the numeric precision required by the problem. Return a distance array, preserving Infinity for unreachable vertices, or `null` for a negative cycle reachable from `start`.

```js runnable
import assert from 'node:assert/strict';

function bellmanFord(n, edges, start) {
  const distance = Array(n).fill(Infinity);
  distance[start] = 0;
  for (let round = 1; round < n; round += 1) {
    let changed = false;
    for (const [from, to, weight] of edges) {
      if (distance[from] !== Infinity && distance[from] + weight < distance[to]) {
        distance[to] = distance[from] + weight;
        changed = true;
      }
    }
    if (!changed) break;
  }
  for (const [from, to, weight] of edges) {
    if (distance[from] !== Infinity && distance[from] + weight < distance[to]) {
      return null;
    }
  }
  return distance;
}

const edges = [[2, 1, -2], [0, 1, 4], [0, 2, 1]];
assert.deepEqual(bellmanFord(3, edges, 0), [0, -1, 1]);
assert.deepEqual(bellmanFord(1, [], 0), [0]);
assert.equal(bellmanFord(1, [[0, 0, -1]], 0), null);
assert.equal(bellmanFord(3, [[0, 1, 1], [1, 2, -2], [2, 1, 1]], 0), null);
assert.deepEqual(bellmanFord(3, [[1, 2, -2], [2, 1, 1]], 0), [0, Infinity, Infinity]);
console.log(bellmanFord(3, edges, 0).join(', '));
console.log('negative edges, reachable cycles, and unreachable cycles checked');
```

```text output
0, -1, 1
negative edges, reachable cycles, and unreachable cycles checked
```

The reachability guard prevents an unrelated negative cycle from invalidating this source's answer. Returning `null` is this example's whole-result policy; a richer API can identify only the vertices whose costs are unbounded below. Reconstructing paths also requires predecessor tracking and a policy for negative cycles.

## Complexity

The edge scans take O(VE) work in the worst case; including initialization, the bound is O(V + VE). Early stopping after a stable first scan takes O(V + E), including the final cycle check. Auxiliary space is O(V); the edge list is input storage. Avoid describing a JavaScript implementation's initialization cost as zero when E is small.

Use BFS for unweighted edges, a topological pass for a weighted DAG, and Dijkstra when its nonnegative-weight assumptions hold. Bellman–Ford trades more work for support for negative weights and reachable-negative-cycle detection.

## Worked examples and answers {/* #workbook-practice */}

Attempt the linked [Practice Problems](#practice-problems) before opening their answers. See the [workbook guide](../../../javascript/workbook.md) for the A–C exercise format.

### 42. Weighted shortest paths and relaxation {/* #workbook-42 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** choose shortest-path rules from the allowed edge weights.

A **tentative distance** is the best cost found so far. **Relaxing an edge** means checking whether reaching its end through its start gives a cheaper route. Start the source at zero and other vertices at Infinity.

The worked example below is scan-based [Dijkstra](../dijkstra/README.md), which requires nonnegative weights. Choosing the smallest tentative distance finalizes it because going through a farther unvisited vertex cannot improve it. The scan costs O(V² + E); a heap can reduce repeated selection work, but stale replacement records must be skipped.

Use [BFS](../breadth-first-search/README.md) for equal costs, a deque for 0/1 costs, or [topological order](../topological-sorting/README.md) for a DAG. The Bellman–Ford example above handles negative edges and detects reachable negative cycles. [Floyd–Warshall](../floyd-warshall/README.md) explains all-pairs distances and its outer intermediate-vertex loop.

To return a route, record predecessors on improvements and follow them backward after checking reachability. More than one cheapest route may exist. Keep weights finite and accumulated costs within appropriate Number limits; NaN and overflow break comparisons. A BigInt version needs a separate unreachable marker because it cannot use Number Infinity in arithmetic.

**Worked example**

```js
function dijkstra(graph, start) {
  const n = graph.length;
  const distance = Array(n).fill(Infinity);
  const used = Array(n).fill(false);
  distance[start] = 0;
  for (let step = 0; step < n; step++) {
    let u = -1;
    for (let v = 0; v < n; v++) {
      if (!used[v] && (u === -1 || distance[v] < distance[u])) u = v;
    }
    if (u === -1 || distance[u] === Infinity) break;
    used[u] = true;
    for (const [v, weight] of graph[u]) {
      if (weight < 0) throw new RangeError("Negative weight");
      distance[v] = Math.min(distance[v], distance[u] + weight);
    }
  }
  return distance;
}
const weighted = [[[1, 4], [2, 1]], [], [[1, 2]]];
console.log(dijkstra(weighted, 0).join(","));
```

**Expected output**

```text
0,3,1
```

**Why the example works**

The direct path to 1 costs 4. Vertex 2 is finalized first at distance 1 and improves vertex 1 to 3. The next minimum is then 1. The contract requires every graph weight to be finite and nonnegative; the local negative check only encounters reachable edges.

</details>

Find **42A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-42-answer">
<summary>Check your reasoning and answer</summary>

For Node checks, add `import assert from "node:assert/strict";` at the top of your file. Browser and multi-file examples use the setup stated above.

**42A.** Its finalization proof assumes that adding an edge cannot reduce a path cost. A negative edge from a later vertex can invalidate a previously finalized result.

**42B.** Every edge already satisfies the relaxation inequality for the current distances. Repeating the same operations without any changed input cannot create a new improvement.

**42C.** Each pass propagates possible improvements across edges. After V-1 passes, an additional reachable improvement proves that a path can keep benefiting from a cycle. Ignore unreachable sources of edges by checking for Infinity.

**Reference code**

Use the worked example above first if the answer calls its functions or classes. Run each lesson in its own `.mjs` file.

```js
function bellmanFord(n, edges, start) {
  const distance = Array(n).fill(Infinity);
  distance[start] = 0;
  for (let pass = 0; pass < n - 1; pass++) {
    let changed = false;
    for (const [u, v, w] of edges) {
      if (distance[u] !== Infinity && distance[u] + w < distance[v]) {
        distance[v] = distance[u] + w;
        changed = true;
      }
    }
    if (!changed) break;
  }
  for (const [u, v, w] of edges) {
    if (distance[u] !== Infinity && distance[u] + w < distance[v]) {
      return null;
    }
  }
  return distance;
}
```

**Check the result**

```js
assert.deepEqual(bellmanFord(3, [[0, 1, 4], [0, 2, 1], [2, 1, -2]], 0),
  [0, -1, 1]);
assert.equal(bellmanFord(2, [[0, 1, -1], [1, 0, -1]], 0), null);
assert.deepEqual(bellmanFord(2, [], 0), [0, Infinity]);
```

</details>

## References

- [Princeton Algorithms: shortest paths](https://algs4.cs.princeton.edu/44sp/index.php)

- [Wikipedia](https://en.wikipedia.org/wiki/Bellman%E2%80%93Ford_algorithm)
- [On YouTube by Michael Sambol](https://www.youtube.com/watch?v=obWXjtg0L64&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **42A — Why does Dijkstra require nonnegative weights?** | **Must fix** | [Worked example](#workbook-42) | [Answer](#workbook-42-answer) |
| **42B — Why can Bellman-Ford stop early if a round changes nothing?** | **Must fix** | [Worked example](#workbook-42) | [Answer](#workbook-42-answer) |
| **42C — Implement bellmanFord(n, edges, start). Return distances, or null for a reachable negative cycle. Edges are [u, v, weight] triples with valid identifiers and finite small weights.** | **Must fix** | [Worked example](#workbook-42) | [Answer](#workbook-42-answer) |

## Continue learning

**Next:** [Floyd–Warshall Algorithm](../floyd-warshall/README.md).
