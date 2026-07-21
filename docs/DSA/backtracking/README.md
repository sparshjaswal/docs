# 🔙 Backtracking

> **One-line summary**: Systematic exhaustive search that builds candidates incrementally and abandons ("backtracks") a partial candidate as soon as it cannot lead to a valid solution.

---

## Concept

Backtracking explores the space of all candidate solutions by extending a partial solution one step at a time. At each step it checks whether the current partial candidate can still lead to a complete valid solution; if not, it prunes that branch and returns to the previous decision point.

**General template:**

```javascript
function backtrack(state, choices, result) {
  if (isComplete(state)) {
    result.push([...state]);
    return;
  }
  for (const choice of choices) {
    if (!isValid(state, choice)) continue; // prune
    state.push(choice); // choose
    backtrack(state, nextChoices(choices, choice), result);
    state.pop(); // un-choose (backtrack)
  }
}
```

**Typical complexity**: exponential — O(bᵈ) where `b` is the branching factor and `d` is the depth — but pruning dramatically reduces the explored space in practice.

---

## Classic Backtracking Problems

These genuine backtracking algorithms live in the DSA docs (some under `../uncategorized/` and `../sets/`):

- [N-Queens Problem](../uncategorized/n-queens/)
- [Knight's Tour](../uncategorized/knight-tour/)
- [Jump Game (backtracking variant)](../uncategorized/jump-game/)
- [Unique Paths (backtracking variant)](../uncategorized/unique-paths/)
- [Power Set](../sets/power-set/)
- [Combinations](../sets/combinations/)
- [Combination Sum](../sets/combination-sum/)
- [Permutations](../sets/permutations/)
- [Hamiltonian Cycle](../graphs/hamiltonian-cycle/)

---

## When to Use Backtracking

✅ Use when you must enumerate or search **all** configurations: permutations, combinations, subsets, board placements (N-Queens), path/tour finding, constraint satisfaction (Sudoku).

❌ Avoid when a greedy or dynamic-programming approach gives the answer in polynomial time.

---

## Pitfalls

- Forgetting to **un-choose** (restore state) after recursion — corrupts subsequent branches.
- Weak pruning — without early `isValid` checks, the search degenerates to brute force.
- Mutating shared state without copying when storing a solution.

---

## Related Topics

- [Recursion](../recursion/README.md) — backtracking is recursion with state restoration
- [Sets](../sets/) — subsets, permutations, and combinations
- [Dynamic Programming](../dp/README.md) — overlapping subproblems can replace re-exploration

[← Back to Home](../index.md) · © sparshjaswal
