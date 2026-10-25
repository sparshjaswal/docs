---
id: dsa-graphs-eulerian-path-readme
title: "Eulerian Path"
slug: /DSA/graphs/eulerian-path/README
sidebar_label: "Eulerian Path"
---

# Eulerian Path

**Read first:** [Graphs](../README.md).

**Practice focus:** Mark edges as used and distinguish returning to a vertex from reusing an edge.

An Eulerian path uses every **edge** exactly once. It may visit a node more than once. An Eulerian cycle also ends where it started. Think of drawing every line of a shape without lifting your pen or tracing a line twice.

Euler proved that a necessary condition for the existence of Eulerian
circuits is that all vertices in the graph have an even degree, and
stated that connected graphs with all vertices of even degree have
an Eulerian circuit.

![An Eulerian circuit follows each edge once and returns to its starting node.](https://upload.wikimedia.org/wikipedia/commons/7/72/Labelled_Eulergraph.svg)

Every vertex of this graph has an even degree. Therefore, this is
an Eulerian graph. Following the edges in alphabetical order gives
an Eulerian circuit/cycle.

For the existence of Eulerian trails it is necessary that zero or
two vertices have an odd degree; this means the Königsberg graph
is not Eulerian. If there are no vertices of odd degree,
all Eulerian trails are circuits. If there are exactly two vertices
of odd degree, all Eulerian trails start at one of them and end at
the other. A graph that has an Eulerian trail but not an Eulerian
circuit is called semi-Eulerian.

![Model land areas as nodes and bridges as edges to ask whether every bridge can be crossed exactly once.](https://upload.wikimedia.org/wikipedia/commons/9/96/K%C3%B6nigsberg_graph.svg)

The Königsberg Bridges multigraph. This multigraph is not Eulerian,
therefore, a solution does not exist.

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Eulerian_path)
- [YouTube](https://www.youtube.com/watch?v=vvP4Fg4r-Ns&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

**Next:** [Hamiltonian Path](../hamiltonian-cycle/README.md).
