---
id: dsa-graphs-hamiltonian-cycle-readme
title: "Hamiltonian Path"
slug: /DSA/graphs/hamiltonian-cycle/README
sidebar_label: "Hamiltonian Path"
---

# Hamiltonian Path

**Read first:** [Backtracking](../../backtracking/README.md).

**Practice focus:** Track visited vertices and test the final connection back to the starting vertex.

A Hamiltonian path visits every **node** exactly once. A Hamiltonian cycle also returns to the start after visiting all nodes. This differs from an Eulerian path, which must use every edge exactly once.

![A Hamiltonian route visits each vertex once. A cycle also returns to the starting vertex.](https://upload.wikimedia.org/wikipedia/commons/6/6c/Hamiltonian_path_3d.svg)

One possible Hamiltonian cycle through every vertex of a
dodecahedron is shown in red – like all platonic solids, the
dodecahedron is Hamiltonian.

## Naive Algorithm

For a cycle, fix vertex 0 as the start and try every ordering of the remaining vertices. Check that consecutive vertices are connected and that the last vertex connects back to 0. Fixing the start avoids trying rotations of the same cycle.

The JavaScript below accepts a square, symmetric boolean adjacency matrix for a simple undirected graph. `graph[u][v]` is `true` when an edge exists. A cycle must contain at least three distinct vertices. Return the first cycle with 0 repeated at the end, or `null` if none exists.

```js runnable
function naiveHamiltonianCycle(graph) {
  const n = graph.length;
  if (n < 3) return null;
  const path = [0];
  const used = new Set([0]);
  function search() {
    if (path.length === n) {
      for (let i = 0; i < n; i++) {
        if (!graph[path[i]][path[(i + 1) % n]]) return null;
      }
      return [...path, 0];
    }
    for (let next = 1; next < n; next++) {
      if (used.has(next)) continue;
      path.push(next);
      used.add(next);
      const result = search();
      if (result !== null) return result;
      used.delete(next);
      path.pop();
    }
    return null;
  }
  return search();
}

const graph = [[false, true, true], [true, false, true], [true, true, false]];
console.log(JSON.stringify(naiveHamiltonianCycle(graph)));
```

```text output
[0,1,2,0]
```

There are `(n - 1)!` orders to check and O(n) work per complete order: O(n!) worst-case time. The path, used set, and recursion use O(n) extra space.

## Backtracking Algorithm

Check each edge before extending the path. If a chosen vertex leads to a dead end, remove it and try another. The final edge back to 0 is still required: a path through all vertices is not necessarily a cycle.

```js runnable
function hamiltonianCycle(graph) {
  const n = graph.length;
  if (n < 3) return null;
  const path = [0];
  const used = new Set([0]);
  function search() {
    const last = path[path.length - 1];
    if (path.length === n) return graph[last][0] ? [...path, 0] : null;
    for (let next = 1; next < n; next++) {
      if (used.has(next) || !graph[last][next]) continue;
      path.push(next);
      used.add(next);
      const result = search();
      if (result !== null) return result;
      used.delete(next);
      path.pop();
    }
    return null;
  }
  return search();
}

const triangle = [[false, true, true], [true, false, true], [true, true, false]];
const chain = [[false, true, false], [true, false, true], [false, true, false]];
console.log(JSON.stringify(hamiltonianCycle(triangle)));
console.log(hamiltonianCycle(chain));
```

```text output
[0,1,2,0]
null
```

The second graph has a Hamiltonian path `0 → 1 → 2`, but no cycle: there is no edge from 2 to 0. Early rejection reduces wasted work, though the worst-case search is still factorial, with an O(n) call stack and working state. Neither function changes the graph.

## References

- [Hamiltonian path on Wikipedia](https://en.wikipedia.org/wiki/Hamiltonian_path)
- [Hamiltonian path on YouTube](https://www.youtube.com/watch?v=dQr4wZCiJJ4&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [Hamiltonian cycle on GeeksForGeeks](https://www.geeksforgeeks.org/backtracking-set-7-hamiltonian-cycle/)

**Next:** [Travelling Salesman Problem](../travelling-salesman/README.md).
