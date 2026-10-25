---
id: dsa-graphs-dijkstra-readme
title: "Dijkstra's Algorithm"
slug: /DSA/graphs/dijkstra/README
sidebar_label: "Dijkstra's Algorithm"
---

import useBaseUrl from '@docusaurus/useBaseUrl';

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Dijkstra: cheapest routes with nonnegative costs

**Practice focus:** Compare the direct bus route with a cheaper two-edge route, then trace each distance improvement.

**Learn first:** [graph vertices, directed edges, and adjacency lists](../README.md), [BFS](../breadth-first-search/README.md), [arrays](../../Array/README.md), and [complexity](../../complexity.md). A [min-heap](../../heap/README.md) improves the running time later; the first implementation below uses a plain scan so that the shortest-path reasoning comes first.

Imagine three bus stops. A direct trip from A to C costs 5, but A to B costs 2 and B to C costs 1. The two-part trip costs only 3. The route with the fewest edges is not necessarily the cheapest route.

```text
         cost 2          cost 1
  [A] ------------> [B] ------------> [C]
   |                                   ^
   `---------------- cost 5 -----------'

  [D]   no connecting edges
```

Arrows show allowed travel directions. A weight labels the cost of one edge. The **cost of a path** is the sum of its edge weights. Dijkstra's algorithm finds the minimum total cost from one **source** vertex to every reachable vertex when **all edge weights are nonnegative**: zero is allowed, negative costs are not.

Use ordinary BFS when all edges have the same positive cost. Use Dijkstra for different nonnegative costs, such as travel times or move penalties. If negative edges are allowed, study [Bellman–Ford](../bellman-ford/README.md) instead. The [graph guide](../README.md) compares these choices.

## What we remember

For each vertex, keep:

- A **tentative distance**: the cheapest source-to-vertex route found so far. "Tentative" means that a better route might still be found.
- A **settled flag**: whether we have proved that distance is final.
- A **parent**: the preceding vertex on the best route, so we can reconstruct the path later.

Set the source's distance to `0`: staying where you are costs nothing. Set every other distance to `Infinity`, meaning "no route found yet," not a very large real edge cost.

### Relaxation: try a route through the current vertex

Suppose B currently costs 2 to reach and the edge B → C costs 1. The candidate route to C costs `2 + 1 = 3`. Compare it with C's old value of 5. Keep the smaller value, and record B as C's parent. This comparison and possible update is called **relaxing an edge**.

```text
Before: C has distance 5, parent A
Try:    distance[B] + weight(B, C) = 2 + 1 = 3
After:  C has distance 3, parent B, because 3 < 5
```

Discovering C does not settle it. It remains eligible for improvement until it is the nearest unsettled vertex.

<AlgorithmWalkthrough name="dijkstra" />

## Follow the full example

The walkthrough shows A, B, and C. The table also includes disconnected D. `∞` represents JavaScript's `Infinity`.

| Action | A | B | C | D | Settled vertices | Reason |
| --- | --- | --- | --- | --- | --- | --- |
| Initialize | 0 | ∞ | ∞ | ∞ | none | Only the source is known reachable |
| Select A; relax A → B and A → C | 0 | 2 | 5 | ∞ | A | A is the nearest unsettled vertex |
| Select B; relax B → C | 0 | 2 | 3 | ∞ | A, B | The new route costs `2 + 1`, improving 5 |
| Select C | 0 | 2 | 3 | ∞ | A, B, C | C is now nearest and has no outgoing edges |
| Stop | 0 | 2 | 3 | ∞ | A, B, C | Every remaining unsettled distance is infinite |

The parent chain for C is `C ← B ← A`. Reverse it to report the route `A → B → C`. D has no path from A; leave its distance infinite.

## Complete JavaScript implementation

Vertices are numbered `0` through `graph.length - 1`. `graph[v]` is an array of outgoing `{ to, weight }` edges. The source must be a valid vertex, every weight must be a nonnegative safe integer, and all considered path costs must remain within JavaScript's safe-integer range. The function does not change the graph.

The source example uses A = 0, B = 1, C = 2, D = 3. For an undirected graph, add both directed entries for each edge.

```js runnable
function dijkstra(graph, source) {
  const vertexCount = graph.length;
  const distances = Array(vertexCount).fill(Infinity);
  const parents = Array(vertexCount).fill(-1);
  const settled = Array(vertexCount).fill(false);
  distances[source] = 0;

  for (let round = 0; round < vertexCount; round++) {
    let current = -1;
    // Choose the unsettled vertex with the smallest known distance.
    for (let vertex = 0; vertex < vertexCount; vertex++) {
      if (!settled[vertex] &&
          (current === -1 || distances[vertex] < distances[current])) {
        current = vertex;
      }
    }
    if (current === -1 || distances[current] === Infinity) break;
    settled[current] = true;

    for (const { to, weight } of graph[current]) {
      if (settled[to]) continue;
      const candidate = distances[current] + weight;
      if (candidate < distances[to]) {
        distances[to] = candidate;
        parents[to] = current;
      }
    }
  }
  return { distances, parents };
}

function reconstructPath(result, target) {
  if (result.distances[target] === Infinity) return [];
  const path = [];
  for (let vertex = target; vertex !== -1; vertex = result.parents[vertex]) {
    path.push(vertex);
  }
  return path.reverse();
}

const graph = [
  [{ to: 1, weight: 2 }, { to: 2, weight: 5 }], // A
  [{ to: 2, weight: 1 }],                      // B
  [],                                        // C
  [],                                        // D
];
const names = ['A', 'B', 'C', 'D'];
const result = dijkstra(graph, 0);
console.log(result.distances.map(value => value === Infinity ? 'unreachable' : value).join(' '));
console.log(reconstructPath(result, 2).map(vertex => names[vertex]).join(' -> '));
console.log(JSON.stringify(reconstructPath(result, 3)));
console.log(JSON.stringify(reconstructPath(result, 0)));
```

```text output
0 2 3 unreachable
A -> B -> C
[]
[0]
```

`-1` is a sentinel meaning "no parent." The source has no predecessor, so the reconstruction loop stops there. The explicit unreachable check prevents pretending that disconnected D has a source-to-D path. The algorithm can return one of several equally cheap paths; ties do not change the minimum cost.

### Why choosing the nearest vertex is safe

The main invariant is: **every settled vertex has its true minimum distance**. Every finite tentative distance is also the cost of an actual discovered path, so it can never be smaller than the true minimum.

Consider the nearest unsettled vertex `u`. Suppose a cheaper route to `u` existed. On that route, take the first vertex `x` that is still unsettled. Its predecessor was already settled, so relaxing that predecessor's outgoing edge would have given `x` a tentative distance no larger than the route's cost up to `x`. Because the remaining edges are nonnegative, that prefix costs no more than the whole supposedly cheaper route to `u`. Then `x` would have a smaller tentative distance than `u`, contradicting how we selected `u`. Thus settling `u` preserves the invariant.

The source starts with the correct distance `0`, establishing the first case. Each loop settles another vertex, and the graph has finitely many vertices, so the algorithm stops. If the nearest unsettled distance is infinite, no reachable unsettled vertex remains.

### What negative edges break

Consider A → B with cost 2, A → C with cost 5, and C → B with cost −10. Dijkstra settles B at cost 2 before processing C, even though A → C → B costs −5. A longer-looking prefix can become cheaper after a negative edge. The proof's nonnegative-remainder step no longer applies. Changing tie handling or adding a visited set cannot repair that assumption.

## From the clear version to the faster version

Let `V` be the number of vertices and `E` the number of directed edge entries. The code scans up to `V` candidates in each of up to `V` rounds, and examines each reachable outgoing edge once. Time is **`O(V² + E)`**. The distance, parent, and settled arrays use **`O(V)` auxiliary space**, excluding the input adjacency list. Reconstructing one path uses time and output space proportional to the path length, at most `O(V)`.

This version is useful for learning and for small or dense graphs. For a large sparse graph, most of those vertex scans waste work. A min-heap retrieves the next candidate by tentative distance more efficiently:

1. Push a record `{ vertex: source, distance: 0 }`, using a comparator on `distance`.
2. Pop the smallest record. If its recorded distance is different from `distances[vertex]`, discard it: it describes an older, worse route.
3. Relax its outgoing edges. Whenever a distance improves, update the array and push a **new** record. Do not mutate a priority inside the heap.
4. Stop when the heap is empty. If only one target is requested, you may stop when its current, non-stale record is popped; merely discovering it is too early.

For our example, the heap may hold both `{ vertex: C, distance: 5 }` and `{ vertex: C, distance: 3 }`. The record for 3 is processed first. When 5 is later popped, the distance array still says 3, so discard the stale record.

Use the course's [complete comparator heap](../../heap/README.md#implementation) rather than sorting the whole pending array after every insertion. This **lazy-entry** heap version can store `O(E)` records, so its general bound is `O(V + (E + 1) log(E + 2))` time, with the convenient looser bound `O((V + E) log(E + 2))`, and `O(V + E)` auxiliary space. The `+2` handles a graph with no edges without a `log(0)` expression. For a simple graph, `E ≤ V²`, giving the familiar `O((V + E) log(V + 1))` bound. A heap with an indexed decrease-key operation can instead keep one record per vertex, but needs additional bookkeeping.

The heap changes how we choose the next vertex. It does not change the relaxation rule or the correctness requirement on weights.

## Complete heap version and both judge interfaces

Read the [heap implementation](../../heap/README.md#implementation) first. The complete example below repeats that small structure so it can run by itself. The algorithm has the same graph and numeric contract as the scan version; all considered path sums must be safe integers. For the stdin drill, require at least one vertex and a valid source in every case. The parser assumes well-formed input.

```text
Step  Pending records in removal order     Best distances [A,B,C,D]
  0   [(A,0)]                             [0, infinity, infinity, infinity]
  1   [(B,2), (C,5)]                      [0, 2, 5, infinity]
  2   [(C,3), (C,5)]                      [0, 2, 3, infinity]
  3   [(C,5)]                             [0, 2, 3, infinity]
  4   []  discard (C,5): 5 != 3            [0, 2, 3, infinity]
```

This is **removal order**, not the heap's physical array layout. At step 2, the better record does not delete the old one. `distance !== distances[vertex]` rejects it at step 4. Nonnegative weights and strict improvement mean a current minimum cannot later improve; zero-weight cycles do not create endless equal-distance records. The earlier settled-vertex proof still applies.

The first adapter has the function contract of [LeetCode 743: Network Delay Time](https://leetcode.com/problems/network-delay-time/). The second is an original standard-input drill. For another problem, change its input and output contract deliberately rather than assuming that all graph problems use this format.

```js runnable
class BinaryHeap {
  constructor(compare = (first, second) => first - second, values = []) {
    this.compare = compare;
    this.data = values.slice(); // Preserve the caller's array.
    for (let index = Math.floor(this.data.length / 2) - 1; index >= 0; index--) {
      this.siftDown(index);
    }
  }

  get size() {
    return this.data.length;
  }

  peek() {
    return this.data[0];
  }

  push(value) {
    let index = this.data.push(value) - 1;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(this.data[parent], this.data[index]) <= 0) break;
      [this.data[parent], this.data[index]] = [this.data[index], this.data[parent]];
      index = parent;
    }
  }

  pop() {
    if (this.size === 0) return undefined;
    const answer = this.data[0];
    const last = this.data.pop();
    if (this.size > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return answer;
  }

  siftDown(index) {
    while (true) {
      const left = 2 * index + 1;
      if (left >= this.size) break;
      const right = left + 1;
      let bestChild = left;
      if (right < this.size && this.compare(this.data[right], this.data[left]) < 0) {
        bestChild = right;
      }
      if (this.compare(this.data[index], this.data[bestChild]) <= 0) break;
      [this.data[index], this.data[bestChild]] = [this.data[bestChild], this.data[index]];
      index = bestChild;
    }
  }
}

function dijkstraHeap(graph, source) {
  const distances = Array(graph.length).fill(Infinity);
  const parents = Array(graph.length).fill(-1);
  const pending = new BinaryHeap((a, b) => a.distance - b.distance);
  distances[source] = 0;
  pending.push({ vertex: source, distance: 0 });

  while (pending.size > 0) {
    const { vertex, distance } = pending.pop();
    if (distance !== distances[vertex]) continue; // An obsolete route.
    for (const { to, weight } of graph[vertex]) {
      const candidate = distance + weight;
      if (candidate < distances[to]) {
        distances[to] = candidate;
        parents[to] = vertex;
        pending.push({ vertex: to, distance: candidate });
      }
    }
  }
  return { distances, parents };
}

// LeetCode 743 interface: directed edges, labels 1 through n.
function networkDelayTime(times, n, k) {
  const graph = Array.from({ length: n }, () => []);
  for (const [from, to, weight] of times) {
    graph[from - 1].push({ to: to - 1, weight });
  }
  const { distances } = dijkstraHeap(graph, k - 1);
  let longest = 0;
  for (const distance of distances) {
    if (distance === Infinity) return -1;
    longest = Math.max(longest, distance);
  }
  return longest;
}

// Original CodeChef-style drill, not an official problem's input contract.
// T; then each case: V E source; then E directed edges: from to weight.
// Labels are 1-based. Print all V distances, using -1 for unreachable.
function solveRoutes(input) {
  if (input.trim() === '') return '';
  const tokens = input.trim().split(/\s+/);
  let position = 0;
  const nextNumber = () => Number(tokens[position++]);
  const testCases = nextNumber();
  const answers = [];
  for (let test = 0; test < testCases; test++) {
    const vertexCount = nextNumber();
    const edgeCount = nextNumber();
    const source = nextNumber() - 1;
    const graph = Array.from({ length: vertexCount }, () => []);
    for (let edge = 0; edge < edgeCount; edge++) {
      const from = nextNumber() - 1;
      const to = nextNumber() - 1;
      const weight = nextNumber();
      graph[from].push({ to, weight });
    }
    const { distances } = dijkstraHeap(graph, source);
    answers.push(distances.map(value => value === Infinity ? -1 : value).join(' '));
  }
  return answers.join('\n');
}
console.log(networkDelayTime([[1, 2, 2], [1, 3, 5], [2, 3, 1]], 3, 1));
console.log(solveRoutes('2\n4 3 1\n1 2 2\n1 3 5\n2 3 1\n1 0 1\n'));
```

```text output
3
0 2 3 -1
0
```

For the first call all three vertices are reachable by time 3. In the first stdin case D is unreachable, so its printed distance is `-1`. The second case contains one isolated source, whose distance to itself is 0. Every case constructs fresh graph, distance, parent, and heap storage.

The <a href={useBaseUrl('/examples/dijkstra-routes.cjs')} download>complete standard-input download</a> includes the same heap and algorithm with a Node stdin wrapper. Run `node dijkstra-routes.cjs < input.txt`. For LeetCode, submit `BinaryHeap`, `dijkstraHeap`, and `networkDelayTime` together; omit the demo calls and stdin adapter.

Parsing and formatting add O(B + V) work for B input characters in a case, under the usual token-conversion model. The split-token adapter retains the entire input and all output strings; budget that memory separately from the graph/heap analysis. Avoid spreading a very large distances array into `Math.max(...distances)`, which can exceed the engine's function-argument limit; the adapter scans instead.

**Exercise:** return early for one requested target. The safe position is after the stale-entry check when that target is popped, never when its first distance is inserted. Preserve the full traversal when every vertex's distance is required.

## Judge use and common mistakes

On LeetCode, return the requested value from the supplied function. For example, a "time for every node to receive a signal" question takes the maximum finite distance, or returns the required failure value if any node is unreachable. On CodeChef, parse the statement's edge list, build the adjacency list, and format unreachable results exactly as requested; see the [standard-input adapter](../../javascript-for-dsa.md). Neither platform expects debugging traces in the submission output.

Check these details:

- **Direction:** one directed edge does not authorize travel back along it.
- **Indexing:** convert input numbered from 1 to zero-based indices once, consistently.
- **Zero-cost edges:** they are valid. Use `<` for an improvement; equal-distance paths need not be inserted repeatedly.
- **Disconnected vertices:** preserve `Infinity` internally. Use the statement's required output, often `-1`, only when formatting.
- **Large costs:** floating-point precision can corrupt distance comparisons. Prove that all computed integer costs fit `Number`, or design a consistent `BigInt` version with a separate unreachable marker.
- **JSON output:** `JSON.stringify(Infinity)` produces `null`; the example deliberately formats unreachable distances as text.
- **Repeated edges and self-loops:** nonnegative versions are safe; the relaxation test keeps only strict improvements.
- **One vertex:** distance from the source to itself is zero, even without edges. The function's contract requires a valid source, so an empty graph is not a valid call.

## Understanding checks and graduated exercises

1. **Check:** why is marking a vertex settled as soon as it is first discovered wrong?
2. **Trace:** replace A → C's weight 5 with 1 in the example. Give the settled order and final distances.
3. **Implement:** add an edge C → D of weight 4. Predict D's distance and reconstructed route before running the program.
4. **Improve:** implement the lazy-entry heap version using the linked heap. Compare its result with the scan version on small graphs, including a graph where a tentative distance improves twice.

<details>
<summary>Hints</summary>

1. Compare C's first route with its later route in the original example.
2. After settling A, always choose the smaller tentative distance next.
3. C's final distance stays 3; add the cost of its new outgoing edge.
4. Store the distance inside each heap record and compare it with the current distance array before relaxing anything.

</details>

<details>
<summary>Answers and review criteria</summary>

1. A first route need not be cheapest. C is first discovered with cost 5, then improved to 3 through B. Finalize only when selecting the nearest unsettled vertex.
2. Settled order: A, C, B. Distances: `[0, 2, 1, Infinity]`; D remains unreachable. A → B → C now costs 3 and does not improve C.
3. D's distance is `3 + 4 = 7`; its route is A → B → C → D. Set `graph[2]` to `[{ to: 3, weight: 4 }]` in the runnable example and reconstruct target `3`.
4. Your heap solution must discard stale entries, push only strict improvements, and match the scan version's distances. It may choose a different parent on an equal-cost route. Check a single vertex, a zero-weight edge, disconnected vertices, and A → B cost 10, A → C cost 1, C → B cost 1: B improves from 10 to 2. The old B record must do no work after that improvement. Do not mark a vertex final when inserting its first heap record.

</details>

Continue with [Bellman–Ford](../bellman-ford/README.md) to see what changes when negative weights are allowed, or [graph practice](../README.md#practice-problems) to choose problems by constraints rather than by algorithm name.

**Next:** [Bellman–Ford Algorithm](../bellman-ford/README.md).
