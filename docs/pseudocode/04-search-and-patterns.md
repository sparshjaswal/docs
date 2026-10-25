---
title: '4. Search, sorting, and common patterns'
sidebar_position: 4
---

# 4. Search, sorting, and common patterns

Choose a method from the input rules. “It uses an array” is not enough to choose binary search: the values or the condition you search must have a useful order.

## Step 1: begin with a complete simple solution

For an unsorted list, scan from left to right. Return the first matching index, or `-1` if absent. For a list of `n` items, this may check all `n` items. We call that `O(n)` time. The scan leaves the list unchanged.

```text
FUNCTION linearSearch(values, target)
    FOR i FROM 0 TO LENGTH(values) - 1
        IF values[i] = target THEN RETURN i
    END FOR
    RETURN -1
END FUNCTION
```

## Step 2: use order to remove candidates

For an ascending sorted list, binary search can return **any** matching index in `O(log n)` time. This contract differs from “first match.” Use exclusive upper bound `right`: candidates are at positions `left` through `right - 1`.

```text
FUNCTION binarySearch(values, target)
    left ← 0
    right ← LENGTH(values)
    WHILE left < right
        middle ← left + FLOOR((right - left) / 2)
        IF values[middle] = target THEN RETURN middle
        IF values[middle] < target THEN
            left ← middle + 1
        ELSE
            right ← middle
        END IF
    END WHILE
    RETURN -1
END FUNCTION
```

| Search for 7 in `[1, 3, 5, 7, 9]` | left | right (excluded) | middle | Action |
| --- | --- | --- | --- | --- |
| First check | 0 | 5 | 2 | `5 < 7`: move left to 3. |
| Second check | 3 | 5 | 4 | `9 > 7`: move right to 4. |
| Third check | 3 | 4 | 3 | Found 7; return index 3. |

Every failed check removes the middle and at least one candidate. An empty list starts with `left = right = 0`, so it returns `-1` without reading an item. Never mix this boundary rule with the inclusive `left ≤ right` version in another example.

## Step 3: understand sorting before using it

Insertion sort grows a sorted prefix. Save the current value, shift larger values right, and insert the saved value into the gap.

```text
FUNCTION insertionSort(values)
    FOR i FROM 1 TO LENGTH(values) - 1
        current ← values[i]
        j ← i - 1
        WHILE j ≥ 0 AND values[j] > current
            values[j + 1] ← values[j]
            j ← j - 1
        END WHILE
        values[j + 1] ← current
    END FOR
    RETURN values
END FUNCTION
```

`[3, 1, 2] → [1, 3, 2] → [1, 2, 3]`. This version changes the input and uses constant extra space. Worst-case time is `O(n²)`; an already sorted array takes `O(n)` comparisons. `j ≥ 0` must be checked before reading `values[j]`.

## Step 4: match the problem to a pattern

| Input clue | Candidate pattern | Required question |
| --- | --- | --- |
| Sorted pair sum | [Two pointers](../DSA/two-pointers/README.md) | Why can moving this pointer rule out all skipped pairs? |
| Consecutive items | [Sliding window](../DSA/sliding-window/README.md) | Does expanding or shrinking change validity predictably? |
| Repeated range sums | [Prefix sums](../DSA/prefix-sum/README.md) | Is the input fixed between queries? |
| Repeated membership checks | [Hashing](../DSA/hashing/README.md) | What key identifies the state you need to remember? |

A positive-number sum window cannot be copied unchanged to arbitrary negative numbers. Write the assumption that makes each discarded candidate safe to skip.

## Apply it to your project

Find a task title by scanning an unsorted list. Then explain what you would need to do before binary search could help. Include the cost of preparing the sorted list.

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| Binary search | Practice | Check: Empty input, one item, missing target, and duplicate values. | — |
| First matching index | Practice | Check: Modify the search so it keeps looking left after a match. | — |
| Insertion sort | Practice | Check: `[3, 1, 2]`, `[2, 2]`, and `[]`; state whether it mutates. | — |

## Interview and debugging check

<details>
<summary>Why can binary search discard half the candidates?</summary>

A sorted order or another monotone predicate makes the comparison informative about an entire region. Without that property, the discarded region may contain the answer. Give an unsorted counterexample before proposing binary search.

</details>

## Next steps

Next: [recursion and backtracking](./05-recursion-and-backtracking.md).
