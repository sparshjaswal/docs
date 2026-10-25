---
title: '8. Correctness, cost, and translation'
sidebar_position: 8
---

# 8. Correctness, cost, and translation

A plausible example is useful evidence, but it is not a proof for every allowed input. Combine a clear argument with tests that expose likely mistakes.

## Step 1: explain why the algorithm works

For a loop, answer these questions:

| Question | Example: find the maximum of a nonempty list |
| --- | --- |
| What is true at the start? | The first value is the maximum of the one-item prefix. |
| Why does one step preserve it? | Compare the next value with the old best and keep the larger. |
| Why does it stop? | The index increases until every item has been read. |
| What follows at the end? | The processed prefix is the whole array, so best is its maximum. |

For recursion, show that each call gets a smaller valid problem and eventually reaches a stopping case with a known answer. For dynamic programming, explain what each stored answer means and why the earlier answers it needs are ready.

## Step 2: translate the meaning, not just the symbols

| Pseudocode | JavaScript | Detail to check |
| --- | --- | --- |
| `x ← value` | `let x = value` initially; `x = value` later | Use `const` if it will not be reassigned. |
| `x = y` in a condition | `x === y` | `=` would assign instead of compare. |
| `AND`, `OR`, `NOT` | `&&`, `\|\|`, `!` | Keep bounds checks before array reads. |
| `APPEND(a, x)` | `a.push(x)` | This mutates the array. |
| `COPY(a)` | `[...a]` | This is a shallow copy. |
| `NONE` | An explicit choice such as `null` or `-1` | Pick a value that cannot be confused with a valid result. |
| Mathematical integer | `Number` or `BigInt` | Check range and arithmetic rules. |

## Step 3: keep the boundary rule unchanged

This is the exclusive-right binary search from [lesson 4](./04-search-and-patterns.md), with `-1` for absent targets:

```js runnable
import assert from "node:assert/strict";

function binarySearch(values, target) {
  let left = 0;
  let right = values.length;
  while (left < right) {
    const middle = left + Math.floor((right - left) / 2);
    if (values[middle] === target) return middle;
    if (values[middle] < target) left = middle + 1;
    else right = middle;
  }
  return -1;
}

assert.equal(binarySearch([], 7), -1);
assert.equal(binarySearch([7], 7), 0);
assert.equal(binarySearch([7], 6), -1);
assert.equal(binarySearch([1, 3, 5, 7, 9], 7), 3);
assert.equal(binarySearch([1, 3, 5, 7, 9], 8), -1);
const values = [1, 2, 2, 2, 5];
assert.equal(values[binarySearch(values, 2)], 2);
console.log("Binary search checks passed");
```

```text output
Binary search checks passed
```

The duplicate check accepts any matching position, as promised. Demanding the first matching index would test a different contract.

## Step 4: estimate time and space separately

Count how work grows with input size. One scan is usually `O(n)`; two separate scans are still `O(n)`. Two nested full scans can be `O(n²)`. A loop that halves its remaining search range is `O(log n)`. These claims assume the work inside each step has the stated cost.

Space includes temporary arrays, sets, maps, and the recursion stack. Report output space separately when useful. A recursive algorithm can use linear stack space even when it creates no explicit array.

## Step 5: use a review checklist

| Check | A useful test or question |
| --- | --- |
| Contract | Are empty input, duplicates, mutation, and invalid values defined? |
| Initialization | Does the first state represent an actual valid answer or an explicit “unknown”? |
| Boundaries | Does a one-item input work? Is the upper endpoint included or excluded? |
| Progress | What value moves toward termination? |
| Result | Does the function return what was requested: value, position, count, or path? |
| Tests | Would each assertion fail if a likely bug were introduced? |

## Apply it to your project

Review your task functions with empty input, repeated completion, a missing ID, and a blank title. Compare the observed result with the rules you wrote before coding.

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| Maximum value | Practice | Completion check: Write the contract, pseudocode, trace, invariant, and JavaScript; test all-negative input. | — |
| Balanced brackets | Practice | Completion check: Define allowed bracket characters; test an unexpected closing bracket and leftover opening brackets. | — |
| Shortest unweighted path | Practice | Completion check: Return an actual path and verify every consecutive pair is an edge. | — |
| Minimum coins | Practice | Completion check: Return the minimum count and explain why largest-coin-first can fail. | — |

## Interview and debugging check

<details>
<summary>The JavaScript output matches three examples. What remains to justify?</summary>

Examples do not prove all valid inputs. Explain initialization, preservation of the invariant, termination, and how the final state implies the result. Then test contract boundaries, numeric limits, and mutation behavior in the actual language.

</details>

## Next steps

You can now use the [DSA pattern guide](../DSA/patterns.md) to choose a method and the [JavaScript practice guide](../javascript/workbook.md) for complete examples and answers.
