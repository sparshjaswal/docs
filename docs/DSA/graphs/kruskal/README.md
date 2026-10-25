---
id: dsa-graphs-kruskal-readme
title: "Kruskal's Algorithm"
slug: /DSA/graphs/kruskal/README
sidebar_label: "Kruskal's Algorithm"
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Kruskal's Algorithm

**Read first:** [Disjoint Set](../../disjoint-set/README.md).

**Practice focus:** Sort edges by cost and reject an edge only when its endpoints are already connected.

Kruskal’s algorithm connects all nodes as cheaply as possible without making a cycle. Sort edges by cost, then add an edge only if it joins two separate groups. Union–find keeps track of those groups. This solves the minimum spanning tree problem on a connected, undirected, weighted graph.

<AlgorithmWalkthrough name="kruskal" />



The trace shows why the cheapest remaining edge is rejected when its endpoints are already connected.

## Minimum Spanning Tree

A **minimum spanning tree** (MST) or minimum weight spanning tree
is a subset of the edges of a connected, edge-weighted
undirected graph that connects all the vertices together,
without any cycles and with the minimum possible total edge
weight. That is, it is a spanning tree whose sum of edge weights
is as small as possible. More generally, any edge-weighted
undirected graph (not necessarily connected) has a minimum
spanning forest, which is a union of the minimum spanning
trees for its connected components.

![A minimum spanning tree connects every node with minimum total edge weight and no cycle.](https://upload.wikimedia.org/wikipedia/commons/d/d2/Minimum_spanning_tree.svg)

A planar graph and its minimum spanning tree. Each edge is
labeled with its weight, which here is roughly proportional
to its length.

![Different spanning trees can have the same minimum total weight. The cheapest tree need not be unique.](https://upload.wikimedia.org/wikipedia/commons/c/c9/Multiple_minimum_spanning_trees.svg)

This figure shows there may be more than one minimum spanning
tree in a graph. In the figure, the two trees below the graph
are two possibilities of minimum spanning tree of the given graph.

## References

- [Minimum Spanning Tree on Wikipedia](https://en.wikipedia.org/wiki/Minimum_spanning_tree)
- [Kruskal's Algorithm on Wikipedia](https://en.wikipedia.org/wiki/Kruskal%27s_algorithm)
- [Kruskal's Algorithm on YouTube by Tushar Roy](https://www.youtube.com/watch?v=fAuF0EuZVCk&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [Kruskal's Algorithm on YouTube by Michael Sambol](https://www.youtube.com/watch?v=71UQH7Pr9kU&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

**Next:** [Prims Algorithm](../prim/README.md).
