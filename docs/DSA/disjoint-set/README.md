---
id: dsa-disjoint-set-readme
title: "Disjoint Set"
slug: /DSA/disjoint-set/README
sidebar_label: "Disjoint Set"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

# Disjoint Set

**Prerequisites:** arrays, loops, and [graph connectivity](../graphs/README.md). A **disjoint set**, also called union–find, keeps track of separate groups. Each item belongs to exactly one group. Think of students joining clubs: joining two clubs puts all their members in one group, even when you name only one member from each club.

- **find(x):** return the representative of x's group.
- **union(a, b):** join the groups containing a and b.
- If `find(a) === find(b)`, the items are already connected.

For example, start with `{A}`, `{B}`, `{C}`. After joining A and B, the groups are `{A, B}` and `{C}`. Joining A and B again changes nothing. This structure checks connectivity; it does not store a route between two items.

With path compression and union by rank or size, operations take nearly constant amortized time.

```text
Initially: each item is a root       After union(0, 1), union(1, 2)

 [0]  [1]  [2]  [3]                    [0]       [3]
                                       ^ ^
                                      /   \
                                    [1]   [2]

4 groups                             2 groups: {0,1,2} and {3}
```

Arrows point to each item's parent. A root is an item whose parent is itself. Although the second union names 1 and 2, it joins their **roots**, attaching 2 to 0. The parent arrow is a grouping shortcut; it does not claim that the original graph contains an edge from 2 to 0.

Use union–find when connections are added over time and you repeatedly need to ask whether two items are connected. A fresh BFS or DFS answers one query, but repeatedly traversing a growing graph can waste work. Union–find keeps exactly the grouping information needed for those repeated queries.

## Learning steps

As roads open between towns, you may only need to know whether two towns belong to the same connected region.

1. Start with one group per item and trace a real merge.
2. Follow parent links to representatives and shorten later searches.
3. Ignore repeated joins and use the structure for connectivity, not route reconstruction.

## Implementation

- [DisjointSet.js](./DisjointSet.js)
- [DisjointSetAdhoc.js](./DisjointSetAdhoc.js) - The minimalistic (ad hoc) version of a DisjointSet (or a UnionFind) data structure that doesn't have external dependencies and that is easy to copy-paste and use during the coding interview if allowed by the interviewer (since many data structures in JS are missing).

## Worked examples and answers {/* #workbook-practice */}

Attempt the linked [Practice Problems](#practice-problems) before opening their answers. See the [workbook guide](../../javascript/workbook.md) for the A–C exercise format.

### 47. Union Find and connected components {/* #workbook-47 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** merge groups and test membership without storing a route.

Trace the parent-array diagram above. `find(x)` returns a root representative; `union(a, b)` joins different roots. The representative need not be the smallest value or first inserted item. Compare representatives for equality rather than giving their numeric values a meaning.

Union by size joins the smaller tree below the larger. Path compression shortens visited parent routes. Together they give nearly constant **amortized** work: low average cost over a sequence, including the expensive operations. The formal bound is O(α(n)) per operation, where the inverse-Ackermann function α grows extremely slowly.

For an undirected simple graph, joining already-connected endpoints closes a cycle. Decrement a component count only on a real merge. [Kruskal’s algorithm](../graphs/kruskal/README.md) uses these checks after sorting edges; connected input gives a minimum spanning tree, and disconnected input gives a forest. Basic union–find does not recover a route or support arbitrary edge removal efficiently. Use graph traversal when the route itself is required.

**Worked example**

```js runnable
class UnionFind {
  constructor(n) {
    if (!Number.isSafeInteger(n) || n < 0) throw new RangeError('Invalid size');
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = Array(n).fill(1);
    this.components = n;
  }
  find(x) {
    if (!Number.isInteger(x) || x < 0 || x >= this.parent.length) {
      throw new RangeError('Invalid item');
    }
    while (x !== this.parent[x]) {
      this.parent[x] = this.parent[this.parent[x]];
      x = this.parent[x];
    }
    return x;
  }
  union(a, b) {
    a = this.find(a);
    b = this.find(b);
    if (a === b) return false;
    if (this.size[a] < this.size[b]) [a, b] = [b, a];
    this.parent[b] = a;
    this.size[a] += this.size[b];
    this.components--;
    return true;
  }
}
const groups = new UnionFind(4);
groups.union(0, 1);
groups.union(1, 2);
console.log(groups.find(0) === groups.find(2));
console.log(groups.components);
console.log(groups.union(0, 2)); // Already connected: no group disappears.
console.log(groups.components);
console.log(new UnionFind(0).components);
```

```text output
true
2
false
2
0
```

**Why the example works**

The first merge joins 0 and 1, and the second brings 2 into that group. Vertex 3 stays separate. `find` applies **path halving**, linking a visited node to its grandparent while moving upward. That grandparent belongs to the same tree, so shortening the path preserves every item's group. The root still represents exactly the same members.

**Why union is correct.** If two roots are equal, the groups already coincide and nothing should change. Otherwise linking one root below the other merges exactly those two groups and leaves every other tree untouched. Updating only the surviving root's size records the merged membership count. Non-root size entries are no longer used for decisions. Repeated unions and self-unions therefore return false and keep the component count unchanged.

The contract is a nonnegative integer n small enough to allocate its arrays, with item labels from 0 through n - 1. Invalid labels throw. Empty structures have zero components; no `find` or `union` call is valid on them. `find` can mutate parent links through path halving even though it is answering a query.

Initialization and storage are O(n). Union by size alone limits a tree's depth to O(log n): whenever a node's depth grows, the size of its containing tree at least doubles. Combining size balancing with path halving gives O(α(n)) **amortized** time per operation over a sequence, where α is the extremely slowly growing inverse Ackermann function. Amortized means an average bound over the whole sequence, not a promise that every single call has the same cost. The full amortized bound is an advanced analysis; correctness follows from preserving the represented groups.

Do not decrement the group count for an unsuccessful union, attach arbitrary non-roots instead of roots, or interpret the representative as the smallest member. Basic union–find cannot remove connections or answer directed reachability.

</details>

Find **47A–C** in the [Practice Problems](#practice-problems) table.

<details>
<summary>Hints for 47A–C</summary>

A: count how many distinct groups existed before and after a repeated union. B: compare the original edge `(1, 2)` with the parent shortcut in the diagram. C: begin with n groups, then let `union` decide whether each edge changes that count; isolated vertices never disappear.

</details>

<details id="workbook-47-answer">
<summary>Check your reasoning and answer</summary>

For Node checks, add `import assert from "node:assert/strict";` at the top of your file. Browser and multi-file examples use the setup stated above.

**47A.** The two items already belong to one group, so no partition changes. Decrementing would make repeated edges or repeated union calls corrupt the component count.

**47B.** No. Parent links describe the data structure's grouping forest, not necessarily graph edges in an actual route. Use stored graph adjacency and traversal when a path is required.

**47C.** Start with n singleton groups and merge each edge's endpoints. The structure itself avoids counting redundant edges as additional merges. Isolated vertices remain components.

**Reference code**

Use the worked example above first if the answer calls its functions or classes. Run each lesson in its own `.mjs` file.

```js
function componentCount(n, edges) {
  const groups = new UnionFind(n);
  for (const [a, b] of edges) groups.union(a, b);
  return groups.components;
}
```

**Check the result**

```js
assert.equal(componentCount(4, [[0, 1], [1, 2], [0, 2]]), 2);
assert.equal(componentCount(3, []), 3);
assert.equal(componentCount(0, []), 0);
```

</details>

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **47A — Why does union of an already connected pair keep the count unchanged?** | **Must fix** | [Worked example](#workbook-47) | [Answer](#workbook-47-answer) |
| **47B — Can this structure directly return a path between two vertices?** | **Must fix** | [Worked example](#workbook-47) | [Answer](#workbook-47-answer) |
| **47C — Write componentCount(n, edges) for valid undirected edge pairs using UnionFind.** | **Must fix** | [Worked example](#workbook-47) | [Answer](#workbook-47-answer) |
| [LC 1971 — Find if Path Exists in Graph](https://leetcode.com/problems/find-if-path-exists-in-graph/) | Easy | [LeetCode](https://leetcode.com/problems/find-if-path-exists-in-graph/) | — |
| <PracticeProblem id={261} title={"Graph Valid Tree"} text={"Problem statement\nGiven n vertices labeled 0 through n - 1 and undirected edges, determine whether the graph is a\ntree. A tree connects all vertices and contains no cycle. There are no duplicate edges or self-loops.\nA single vertex with no edges is a tree.\nInput \u0026 expected result\nEach edge connects its endpoints in both directions. Every one of the n vertices must belong to the\nsame connected component, including vertices absent from edges. Return a boolean; checking\nonly that no cycle exists is insufficient.\nEXAMPLE 1\nInput: n = 4, edges = [[0,1],[1,2],[1,3]]\nOutput: true\nExplanation: All four vertices are connected, and no edge path returns to its start without\nretracing an edge, so the graph is a tree.\nEXAMPLE 2\nInput: n = 4, edges = [[0,1],[2,3]]\nOutput: false\nExplanation: The graph has no cycle but consists of two disconnected components.\nConstraints \u0026 guarantees\n• n is positive\n• each edge contains two distinct labels in 0..n-1\n• The graph is undirected, without repeated edges or self-loops\nPremium source: current numeric bounds could not be publicly verified.\nJavaScript starter\nfunction validTree(n, edges) {\n  // TODO: write your solution.\n}"} /> | Medium · Premium | [LeetCode](https://leetcode.com/problems/graph-valid-tree/) | — |
| <PracticeProblem id={323} title={"Number of Connected Components in an Undirected Graph"} text={"Problem statement\nAn undirected graph has n vertices numbered 0 through n - 1 and the connections listed in edges.\nReturn the number of connected components. Vertices are in the same component when an edge\npath connects them; an isolated vertex forms a component by itself.\nInput \u0026 expected result\nThe vertex set is defined by n, so count isolated vertices even when no edge mentions them. The\norder of edges does not affect connectivity. Return one integer count rather than the component\nmemberships or their sizes.\nEXAMPLE 1\nInput: n = 6, edges = [[0,1],[1,2],[3,4]]\nOutput: 3\nExplanation: The components are {0,1,2}, {3,4}, and the isolated vertex {5}, giving a total of\nthree.\nEXAMPLE 2\nInput: n = 3, edges = []\nOutput: 3\nExplanation: With no connections, every vertex forms its own component.\nConstraints \u0026 guarantees\n• Vertices use labels 0..n-1\n• each edge connects two vertices\n• The graph is undirected\n• isolated vertices are included\nPremium source: current numeric bounds could not be publicly verified.\nJavaScript starter\nfunction countComponents(n, edges) {\n  // TODO: write your solution.\n}"} /> | Medium · Premium | [LeetCode](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) | — |
| <PracticeProblem id={547} title={"Number of Provinces"} text={"Problem statement \u0026 expected result\nThe symmetric adjacency matrix describes direct city connections. Cities connected through any chain belong to\none province. Return the number of connected components, counting an isolated city as its own province.\nEXAMPLE 1\nInput: isConnected = [[1,1,0],[1,1,0],[0,0,1]]\nOutput: 2\nExplanation: The first two cities form one component; the third is separate.\nEXAMPLE 2\nInput: isConnected = [[1,0,0],[0,1,0],[0,0,1]]\nOutput: 3\nExplanation: Each city is disconnected from the other two.\nConstraints \u0026 guarantees\n- 1 \u003c= n \u003c= 200\n- n == isConnected.length\n- n == isConnected[i].length\n- isConnected[i][j] is 1 or 0.\n- isConnected[i][i] == 1\n- isConnected[i][j] == isConnected[j][i]\nJavaScript starter\nfunction findCircleNum(isConnected) {\n// TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/number-of-provinces/) | — |
| <PracticeProblem id={684} title={"Redundant Connection"} text={"Problem statement\nAn undirected graph was formed from a tree on nodes 1 through n by adding one extra edge\nbetween different nodes. edges gives all edges in input order. Return an edge that can be removed\nto restore a tree. If multiple edges qualify, return the one appearing latest in the input.\nInput \u0026 expected result\nThe required output is the two endpoints of one existing edge, in that edge's supplied order.\nRemoving it must leave every vertex connected with no cycle. The last-in-input tie rule applies\namong all edges whose removal would work.\nEXAMPLE 1\nInput: edges = [[1,2],[2,3],[3,4],[1,4]]\nOutput: [1,4]\nExplanation: The first three edges already connect all four nodes as a tree. Adding [1,4] closes a\ncycle and is last among its edges.\nEXAMPLE 2\nInput: edges = [[1,2],[1,3],[2,3],[3,4]]\nOutput: [2,3]\nExplanation: The triangle's latest edge is [2,3]. Removing [3,4] would instead disconnect node 4.\nConstraints \u0026 guarantees\n• n == edges.length\n• n: 3 through 1000 (inclusive)\n• edges[i].length == 2\n• 1 \u003c= a_i \u003c b_i \u003c= edges.length\n• a_i != b_i\n• The graph is connected and contains no repeated edge\nJavaScript starter\nfunction findRedundantConnection(edges) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/redundant-connection/) | — |
| <PracticeProblem id={721} title={"Accounts Merge"} text={"Problem statement\nEach account is a name followed by email addresses. Accounts sharing an email belong to the\nsame person, including connections through intermediate accounts. Merge each connected group,\nkeeping its name once and its unique emails sorted. Equal names alone do not justify merging; all\naccounts for one person have the same name.\nInput \u0026 expected result\nReturn merged accounts in any order. Emails within each account must be sorted.\nEXAMPLE 1\nInput: accounts = [[\"Sam\",\"a@x.co\"],\n [\"Sam\",\"b@x.co\",\"a@x.co\"]]\nOutput: [[\"Sam\",\"a@x.co\",\"b@x.co\"]]\nExplanation: The shared address connects the two records.\nEXAMPLE 2\nInput: accounts = [[\"Lee\",\"a@x.co\"],\n [\"Lee\",\"b@x.co\"]]\nOutput: [[\"Lee\",\"a@x.co\"],[\"Lee\",\"b@x.co\"]]\nExplanation: Matching names without a shared email remain separate.\nConstraints \u0026 guarantees\n• 1 \u003c= accounts.length \u003c= 1000\n• 2 \u003c= accounts[i].length \u003c= 10\n• 1 \u003c= accounts[i][j].length \u003c= 30\n• accounts[i][0] consists of English letters\n• accounts[i][j] (for j \u003e 0) is a valid email\nJavaScript starter\nfunction accountsMerge(accounts) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/accounts-merge/) | — |
| <PracticeProblem id={990} title={"Satisfiability of Equality Equations"} text={"Problem statement \u0026 expected result\nEach equation compares two lowercase, single-letter variables using == or !=. Return whether some assignment\nof integer values can satisfy all equations simultaneously. Equality relationships must remain consistent with\nevery inequality.\nEXAMPLE 1\nInput: equations = [\"a==b\",\"b!=a\"]\nOutput: false\nExplanation: The same two variables cannot be both equal and unequal.\nEXAMPLE 2\nInput: equations = [\"b==a\",\"a==b\"]\nOutput: true\nExplanation: Both statements impose the same consistent equality.\nConstraints \u0026 guarantees\n- 1 \u003c= equations.length \u003c= 500\n- equations[i].length == 4\n- equations[i][0] is a lowercase letter.\n- equations[i][1] is either '=' or '!'.\n- equations[i][2] is '='.\n- equations[i][3] is a lowercase letter.\nJavaScript starter\nfunction equationsPossible(equations) {\n// TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/satisfiability-of-equality-equations/) | — |
| <PracticeProblem id={1102} title={"Path With Maximum Minimum Value"} text={"Problem statement \u0026 expected result\nA route connects the upper-left and lower-right cells using four-directional moves. Its score is the smallest cell\nvalue on the route, including the endpoints. Return the largest score obtainable among all routes.\nEXAMPLE 1\nInput: grid = [[5,4,5],[1,2,6],[7,4,6]]\nOutput: 4\nExplanation: A route through the top row and right edge has minimum value 4.\nEXAMPLE 2\nInput: grid = [[2,2,1,2,2,2],[1,2,2,2,1,2]]\nOutput: 2\nExplanation: A route using only cells of value 2 connects the endpoints.\nConstraints \u0026 guarantees\nReference snapshot limits; current Premium bounds unverified.\n- m == grid.length\n- n == grid[i].length\n- 1 \u003c= m, n \u003c= 100\n- 0 \u003c= grid[i][j] \u003c= 10^9\nJavaScript starter\nfunction maximumMinimumPath(grid) {\n// TODO: write your solution.\n}"} /> | Medium · Premium | [LeetCode](https://leetcode.com/problems/path-with-maximum-minimum-value/) | — |
| <PracticeProblem id={1135} title={"Connecting Cities With Minimum Cost"} text={"Problem statement \u0026 expected result\nSelect bidirectional connections that link all cities numbered 1 through n. Each [cityA, cityB, cost] has the stated\ncost. Return the minimum total selected cost, or -1 if the available connections cannot connect every city.\nEXAMPLE 1\nInput: n = 3, connections = [[1,2,5],[1,3,6],[2,3,1]]\nOutput: 6\nExplanation: Connections costing 5 and 1 connect all three cities for 6.\nEXAMPLE 2\nInput: n = 4, connections = [[1,2,3],[3,4,4]]\nOutput: -1\nExplanation: There is no connection between the two city pairs.\nConstraints \u0026 guarantees\nReference snapshot limits; current Premium bounds unverified.\n- 1 \u003c= n \u003c= 10^4\n- 1 \u003c= connections.length \u003c= 10^4\n- connections[i].length == 3\n- 1 \u003c= xi, yi \u003c= n\n- xi != yi\n- 0 \u003c= costi \u003c= 10^5\nJavaScript starter\nfunction minimumCost(n, connections) {\n// TODO: write your solution.\n}"} /> | Medium · Premium | [LeetCode](https://leetcode.com/problems/connecting-cities-with-minimum-cost/) | — |
| <PracticeProblem id={1202} title={"Smallest String With Swaps"} text={"Problem statement \u0026 expected result\nEach pair authorizes exchanging the characters at its two zero-based indices. You may apply authorized swaps\nany number of times, including none. Return the lexicographically smallest string reachable from s.\nEXAMPLE 1\nInput: s = \"dcab\", pairs = [[0,3],[1,2]]\nOutput: \"bacd\"\nExplanation: Swaps are restricted to the two independent index pairs.\nEXAMPLE 2\nInput: s = \"dcab\", pairs = [[0,3],[1,2],[0,2]]\nOutput: \"abcd\"\nExplanation: The allowed pairs connect all positions, allowing the sorted string.\nConstraints \u0026 guarantees\n- 1 \u003c= s.length \u003c= 10^5\n- 0 \u003c= pairs.length \u003c= 10^5\n- 0 \u003c= pairs[i][0], pairs[i][1] \u003c s.length\n- s only contains lower case English letters.\nJavaScript starter\nfunction smallestStringWithSwaps(s, pairs) {\n// TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/smallest-string-with-swaps/) | — |
| <PracticeProblem id={1319} title={"Number of Operations to Make Network Connected"} text={"Problem statement \u0026 expected result\nThe initial network has n computers numbered 0 through n-1 and the listed cables. One operation relocates an\nexisting cable to connect another pair of computers. Return the fewest operations needed to connect the whole\nnetwork, or -1 if its cable count is insufficient.\nEXAMPLE 1\nInput: n = 4, connections = [[0,1],[0,2],[1,2]]\nOutput: 1\nExplanation: Relocate a redundant triangle cable to connect computer 3.\nEXAMPLE 2\nInput: n = 6, connections = [[0,1],[0,2],[0,3],[1,2],[1,3]]\nOutput: 2\nExplanation: Two relocations connect the isolated computers 4 and 5.\nConstraints \u0026 guarantees\n- 1 \u003c= n \u003c= 10^5\n- 1 \u003c= connections.length \u003c= min(n * (n - 1) / 2, 10^5)\n- connections[i].length == 2\n- 0 \u003c= ai, bi \u003c n\n- ai != bi\n- There are no repeated connections.\n- No two computers are connected by more than one cable.\nJavaScript starter\nfunction makeConnected(n, connections) {\n// TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/number-of-operations-to-make-network-connected/) | — |
| <PracticeProblem id={1584} title={"Min Cost to Connect All Points"} text={"Problem statement\npoints lists integer coordinates in the plane. Connecting two points costs their Manhattan distance:\nthe absolute x difference plus the absolute y difference. Connect every point so that any pair is\njoined by some path, using the smallest total connection cost. Return that cost. A single point\nneeds no connection.\nInput \u0026 expected result\nAny two points may be connected directly at the specified cost. The selected connections must\nprovide exactly one simple route between each pair of points. Add each selected connection's cost\nonce and return the minimum total, not the list of connections.\nEXAMPLE 1\nInput: points = [[0,0],[1,0],[1,2]]\nOutput: 3\nExplanation: Connect [0,0] to [1,0] at cost 1 and [1,0] to [1,2] at cost 2, totaling 3.\nEXAMPLE 2\nInput: points = [[-2,1],[3,4]]\nOutput: 8\nExplanation: The only connection costs abs(-2 - 3) + abs(1 - 4) = 5 + 3.\nConstraints \u0026 guarantees\n• points.length: 1 through 1000 (inclusive)\n• x_i, y_i: -10^6 through 10^6 (inclusive)\n• Coordinate pairs do not repeat\nJavaScript starter\nfunction minCostConnectPoints(points) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/min-cost-to-connect-all-points/) | — |
| <PracticeProblem id={778} title={"Swim in Rising Water"} text={"Problem statement\ngrid is a square elevation map with distinct nonnegative heights. At time t, water covers every cell\nof height at most t. You can move freely between horizontally or vertically adjacent covered cells.\nReturn the earliest time at which you can travel from the top-left cell to the bottom-right cell,\nincluding covering both endpoints.\nInput \u0026 expected result\nTime is a water-level threshold, not a per-step movement cost. At a fixed time, any number of legal\nneighboring moves can be made. Every cell along the chosen path, including the starting cell, must\nhave elevation at most t.\nEXAMPLE 1\nInput: grid = [[0,3],[1,2]]\nOutput: 2\nExplanation: At time 2, the path with elevations 0,1,2 is covered. The height-3 cell is\nunnecessary.\nEXAMPLE 2\nInput: grid = [[3,0],[1,2]]\nOutput: 3\nExplanation: The starting cell has elevation 3, so travel cannot begin before water reaches that\nheight.\nConstraints \u0026 guarantees\n• n == grid.length\n• n == grid[i].length\n• n: 1 through 50 (inclusive)\n• 0 \u003c= grid[i][j] \u003c n^2\n• Every cell elevation is distinct\nJavaScript starter\nfunction swimInWater(grid) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/swim-in-rising-water/) | — |
| [LC 827 — Making A Large Island](https://leetcode.com/problems/making-a-large-island/) | Hard | [LeetCode](https://leetcode.com/problems/making-a-large-island/) | — |
| <PracticeProblem id={1168} title={"Optimize Water Distribution in a Village"} text={"Problem statement \u0026 expected result\nSupply all houses numbered 1 through n. A well at house i costs wells[i-1]; a bidirectional pipe has the stated\nconnection cost. Water may flow through multiple pipes from a well. Return the smallest combined cost of wells\nand pipes serving every house.\nEXAMPLE 1\nInput: n = 3, wells = [1,2,2], pipes = [[1,2,1],[2,3,1]]\nOutput: 3\nExplanation: One well costing 1 and two pipes costing 1 each supply all houses.\nEXAMPLE 2\nInput: n = 2, wells = [1,1], pipes = [[1,2,1],[1,2,2]]\nOutput: 2\nExplanation: Two wells cost 2; one well plus the cheaper pipe also costs 2.\nConstraints \u0026 guarantees\nReference snapshot limits; current Premium bounds unverified.\n- 2 \u003c= n \u003c= 10^4\n- wells.length == n\n- 0 \u003c= wells[i] \u003c= 10^5\n- 1 \u003c= pipes.length \u003c= 10^4\n- pipes[j].length == 3\n- 1 \u003c= house1j, house2j \u003c= n\n- 0 \u003c= costj \u003c= 10^5\n- house1j != house2j\nJavaScript starter\nfunction minCostToSupplyWater(n, wells, pipes) {\n// TODO: write your solution.\n}"} /> | Hard · Premium | [LeetCode](https://leetcode.com/problems/optimize-water-distribution-in-a-village/) | — |
| <PracticeProblem id={1489} title={"Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree"} text={"Problem statement \u0026 expected result\nIn a connected weighted undirected graph, classify edges by their role in minimum spanning trees. A critical edge\nbelongs to every MST; removing it increases the optimum cost or destroys connectivity. A pseudo-critical edge\nbelongs to some MSTs but not all. Return [criticalIndices, pseudoCriticalIndices], using original input indices.\nEXAMPLE 1\nInput: n = 5, edges = [[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]]\nOutput: [[0,1],[2,3,4,5]]\nExplanation: Edges 0 and 1 are unavoidable; indices 2 through 5 are optional MST choices.\nEXAMPLE 2\nInput: n = 4, edges = [[0,1,1],[1,2,1],[2,3,1],[0,3,1]]\nOutput: [[],[0,1,2,3]]\nExplanation: Any three edges of the equal-weight cycle form an MST.\nConstraints \u0026 guarantees\n- 2 \u003c= n \u003c= 100\n- 1 \u003c= edges.length \u003c= min(200, n * (n - 1) / 2)\n- edges[i].length == 3\n- 0 \u003c= ai \u003c bi \u003c n\n- 1 \u003c= weighti \u003c= 1000\n- All pairs (ai, bi) are distinct.\nJavaScript starter\nfunction findCriticalAndPseudoCriticalEdges(n, edges) {\n// TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/) | — |
| <PracticeProblem id={1579} title={"Remove Max Number of Edges to Keep Graph Fully Traversable"} text={"Problem statement \u0026 expected result\nEdges [type,u,v] connect nodes numbered 1 through n. Type 1 is available to Alice, type 2 to Bob, and type 3 to\nboth. Remove as many edges as possible while each traveler can still reach every node using their allowed\nedges. Return the maximum removable count, or -1 if impossible.\nEXAMPLE 1\nInput: n = 4, edges = [[3,1,2],[3,2,3],[1,1,3],[1,2,4],[1,1,2],[2,3,4]]\nOutput: 2\nExplanation: Two redundant Alice-only edges can be removed while both travelers stay connected.\nEXAMPLE 2\nInput: n = 4, edges = [[3,1,2],[3,2,3],[1,1,4],[2,1,4]]\nOutput: 0\nExplanation: All four edges are needed to keep both allowed graphs connected.\nConstraints \u0026 guarantees\n- 1 \u003c= n \u003c= 10^5\n- 1 \u003c= edges.length \u003c= min(10^5, 3 * n * (n - 1) / 2)\n- edges[i].length == 3\n- 1 \u003c= typei \u003c= 3\n- 1 \u003c= ui \u003c vi \u003c= n\n- All tuples (typei, ui, vi) are distinct.\nJavaScript starter\nfunction maxNumEdgesToRemove(n, edges) {\n// TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/remove-max-number-of-edges-to-keep-graph-fully-traversable/) | — |

{/* END GENERATED PRACTICE PROBLEMS */}

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Disjoint-set_data_structure)
- [By Abdul Bari on YouTube](https://www.youtube.com/watch?v=wU6udHRIkcc&index=14&t=0s&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

**Next:** [prefix trees](../trie/README.md).
