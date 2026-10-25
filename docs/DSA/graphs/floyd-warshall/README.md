---
id: dsa-graphs-floyd-warshall-readme
title: "Floyd–Warshall Algorithm"
slug: /DSA/graphs/floyd-warshall/README
sidebar_label: "Floyd–Warshall Algorithm"
---

# Floyd–Warshall Algorithm

**Read first:** [Bellman–Ford Algorithm](../bellman-ford/README.md).

**Practice focus:** Allow one more intermediate stop at a time; keep that stop as the outer loop.

Floyd–Warshall finds the shortest distance between every pair of nodes. Try each node as an allowed stop along the route. For nodes i and j, compare the current distance with the route i → k → j. Negative edges are allowed, but a reachable negative cycle prevents a finite shortest answer for affected pairs.

## Algorithm

The Floyd–Warshall algorithm compares all possible paths through the graph between
each pair of vertices. It is able to do this with `O(|V|^3)` comparisons in a graph.
This is remarkable considering that there may be up to `|V|^2` edges in the graph,
without enumerating every path. It does so by incrementally improving an
estimate on the shortest path between two vertices, until the estimate is optimal.

Consider a graph `G` with vertices `V` numbered `1` through `N`. Further consider
a function `shortestPath(i, j, k)` that returns the shortest possible path
from `i` to `j` using vertices only from the set `{1, 2, ..., k}` as
intermediate points along the way. Now, given this function, our goal is to
find the shortest path from each `i` to each `j` using only vertices
in `{1, 2, ..., N}`.

Initialize `distance[i][i] = 0`, direct edges to their weights (take the smallest for parallel edges), and other entries to infinity. A negative self-loop must keep its negative weight.

This implementation uses zero-based IDs: diagram vertex 1 becomes code index 0. Pass directed edges as `[from, to, weight]`, with valid vertex IDs and finite weights. Unreachable pairs remain `Infinity`. A negative cycle makes the function throw, so it never returns misleading finite distances for that case.

```js runnable
function floydWarshall(vertexCount, edges) {
  const distance = Array.from({ length: vertexCount }, (_, i) =>
    Array.from({ length: vertexCount }, (_, j) => i === j ? 0 : Infinity),
  );
  for (const [from, to, weight] of edges) {
    distance[from][to] = Math.min(distance[from][to], weight);
  }
  for (let k = 0; k < vertexCount; k++) {
    for (let i = 0; i < vertexCount; i++) {
      if (distance[i][k] === Infinity) continue;
      for (let j = 0; j < vertexCount; j++) {
        if (distance[k][j] === Infinity) continue;
        distance[i][j] = Math.min(distance[i][j], distance[i][k] + distance[k][j]);
      }
    }
  }
  if (distance.some((row, i) => row[i] < 0)) {
    throw new RangeError('Graph contains a negative cycle');
  }
  return distance;
}

const distances = floydWarshall(4, [[0, 2, -2], [1, 0, 4], [1, 2, 3], [2, 3, 2], [3, 1, -1]]);
console.log(JSON.stringify(distances));
console.log(floydWarshall(2, [])[0][1]);
```

```text output
[[0,-1,-2,0],[4,0,2,4],[5,1,0,2],[3,-1,1,0]]
Infinity
```

Keep `k` as the outer loop. After its pass, all paths may use vertices through k as intermediate stops. Time is `O(N³)` and storage is `O(N²)`. A negative diagonal entry after processing identifies a vertex on a negative cycle; every pair that can reach and leave such a cycle has no finite shortest-path answer.

## Example

The algorithm above is executed on the graph on the left below:

![Floyd–Warshall compares a direct best-known route with a route through each allowed intermediate node.](https://upload.wikimedia.org/wikipedia/commons/2/2e/Floyd-Warshall_example.svg)

In the tables below `i` is row numbers and `j` is column numbers.

**k = 0**

|       |  1  |  2  |  3  |  4  |
| :---: | :-: | :-: | :-: | :-: |
| **1** |  0  |  ∞  | −2  |  ∞  |
| **2** |  4  |  0  |  3  |  ∞  |
| **3** |  ∞  |  ∞  |  0  |  2  |
| **4** |  ∞  | −1  |  ∞  |  0  |

**k = 1**

|       |  1  |  2  |  3  |  4  |
| :---: | :-: | :-: | :-: | :-: |
| **1** |  0  |  ∞  | −2  |  ∞  |
| **2** |  4  |  0  |  2  |  ∞  |
| **3** |  ∞  |  ∞  |  0  |  2  |
| **4** |  ∞  | −1  |  ∞  |  0  |

**k = 2**

|       |  1  |  2  |  3  |  4  |
| :---: | :-: | :-: | :-: | :-: |
| **1** |  0  |  ∞  | −2  |  ∞  |
| **2** |  4  |  0  |  2  |  ∞  |
| **3** |  ∞  |  ∞  |  0  |  2  |
| **4** |  3  | −1  |  1  |  0  |

**k = 3**

|       |  1  |  2  |  3  |  4  |
| :---: | :-: | :-: | :-: | :-: |
| **1** |  0  |  ∞  | −2  |  0  |
| **2** |  4  |  0  |  2  |  4  |
| **3** |  ∞  |  ∞  |  0  |  2  |
| **4** |  3  | −1  |  1  |  0  |

**k = 4**

|       |  1  |  2  |  3  |  4  |
| :---: | :-: | :-: | :-: | :-: |
| **1** |  0  | −1  | −2  |  0  |
| **2** |  4  |  0  |  2  |  4  |
| **3** |  5  |  1  |  0  |  2  |
| **4** |  3  | −1  |  1  |  0  |

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm)
- [YouTube (by Abdul Bari)](https://www.youtube.com/watch?v=oNI0rf2P9gE&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=74)
- [YouTube (by Tushar Roy)](https://www.youtube.com/watch?v=LwJdNfdLF9s&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=75)

**Next:** [Kruskals Algorithm](../kruskal/README.md).
