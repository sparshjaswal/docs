---
id: dsa-graphs-travelling-salesman-readme
title: "Travelling Salesman Problem"
slug: /DSA/graphs/travelling-salesman/README
sidebar_label: "Travelling Salesman Problem"
---

# Travelling Salesman Problem

**Read first:** [Advanced DP: intervals, trees, and subsets](../../dp/advanced.md).

**Practice focus:** Compare all tours on a tiny graph before studying the subset-DP state and its memory cost.

The travelling salesman problem asks for the cheapest round trip that visits each city exactly once before returning to the start. Visiting every city is not enough: different visit orders can have different total costs.

![A travelling-salesman tour visits every city once and returns to the start; compare tours by their total length.](https://upload.wikimedia.org/wikipedia/commons/1/11/GLPK_solution_of_a_travelling_salesman_problem.svg)

Solution of a travelling salesman problem: the black line shows
the shortest possible loop that connects every red dot.

![Edge weights record travel costs between four cities. Changing the visit order can change the round-trip cost.](https://upload.wikimedia.org/wikipedia/commons/3/30/Weighted_K4.svg)

TSP can be modelled as an undirected weighted graph, such that
cities are the graph's vertices, paths are the graph's edges,
and a path's distance is the edge's weight. It is a minimization
problem starting and finishing at a specified vertex after having
visited each other vertex exactly once. Often, the model is a
complete graph (i.e. each pair of vertices is connected by an
edge). If a direct connection does not exist, the solver must account for that missing edge.

## Compare complete tours

For four cities, fix A as the start. A tour must contain three other cities and then return to A. If A–B, B–C, C–D, and D–A cost 1 each, while A–C and B–D cost 3, then A–B–C–D–A costs 4 and A–C–B–D–A costs 8. Visiting the same cities does not imply equal cost.

## Exact subset dynamic programming

Let `dp[mask][last]` be the minimum cost of starting at city 0, visiting exactly the cities in `mask`, and finishing at `last`. Initialize only `dp[1][0] = 0`; all other states begin at infinity.

Use a square cost matrix. `cost[from][to]` is a finite numeric cost or `Infinity` for a missing edge. The function returns the minimum round-trip cost, or `Infinity` when no tour exists; it does not reconstruct the route. By convention, zero or one city costs 0. This teaching version limits inputs to 18 cities because the table grows exponentially.

```js runnable
function travellingSalesman(cost) {
  const n = cost.length;
  if (n > 18) throw new RangeError('Use at most 18 cities for this exact solver');
  if (cost.some(row => row.length !== n || row.some(value =>
    typeof value !== 'number' || (!Number.isFinite(value) && value !== Infinity)))) {
    throw new TypeError('Use a square matrix of finite costs or Infinity');
  }
  if (n <= 1) return 0;
  const stateCount = 1 << n;
  const dp = Array.from({ length: stateCount }, () => new Float64Array(n).fill(Infinity));
  dp[1][0] = 0;

  for (let mask = 1; mask < stateCount; mask++) {
    for (let last = 0; last < n; last++) {
      if (dp[mask][last] === Infinity) continue;
      for (let next = 0; next < n; next++) {
        if ((mask & (1 << next)) !== 0 || cost[last][next] === Infinity) continue;
        const nextMask = mask | (1 << next);
        dp[nextMask][next] = Math.min(dp[nextMask][next], dp[mask][last] + cost[last][next]);
      }
    }
  }
  let answer = Infinity;
  for (let last = 1; last < n; last++) {
    answer = Math.min(answer, dp[stateCount - 1][last] + cost[last][0]);
  }
  return answer;
}

const cost = [[0, 1, 3, 1], [1, 0, 1, 3], [3, 1, 0, 1], [1, 3, 1, 0]];
console.log(travellingSalesman(cost));
console.log(travellingSalesman([[0, 2], [Infinity, 0]]));
```

```text output
4
Infinity
```

`1 << next` selects a city's bit; `mask | (1 << next)` adds it to the visited set. JavaScript's number bitwise operators use 32-bit integers; the 18-city limit keeps these masks within that range. Adding a city always increases the mask, so its previous state has already been processed.

A state records both the visited set and final city because future choices depend on both. The exact algorithm takes O(n² × 2ⁿ) time and O(n × 2ⁿ) space. Enumerating all visit orders takes factorial time. These limits restrict exact methods to small inputs; a nearest-neighbor heuristic is faster but does not guarantee an optimal tour.

## Check the model

Directed costs may differ in the two directions. Missing edges should remain unavailable; report no tour if none exists. A large finite penalty can hide infeasibility and requires a justified bound, so it is not a general replacement for missing edges. Special metric assumptions are needed for many approximation guarantees.

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Travelling_salesman_problem)

**Next:** [Eight independent problem-solving assessments](../../assessments/README.md).
