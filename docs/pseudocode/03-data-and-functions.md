---
title: '3. Arrays, strings, and functions'
sidebar_position: 3
---

# 3. Arrays, strings, and functions

An array stores an ordered list. A function names a reusable task. Use a function when its input and result can be explained in one sentence.

## Step 1: state the empty-input rule

Find the largest value in a **nonempty** array of finite numbers. An empty array is outside this contract; a public API could reject it or return `NONE`, but must say which.

```text
FUNCTION maximum(values)
    REQUIRE LENGTH(values) > 0
    best ← values[0]
    FOR i FROM 1 TO LENGTH(values) - 1
        IF values[i] > best THEN
            best ← values[i]
        END IF
    END FOR
    RETURN best
END FUNCTION
```

Starting with `0` would be wrong for `[-8, -3]`: zero is not in the input. Starting with an actual item also handles a one-item list without a special loop case.

| Input checked so far | best | Why? |
| --- | --- | --- |
| `[3]` | 3 | The first value is the largest seen so far. |
| `[3, 1]` | 3 | 1 does not improve the answer. |
| `[3, 1, 4]` | 4 | 4 is larger than the previous best. |

## Step 2: separate a rule from a scan

Task: count English vowels in a string containing only lowercase ASCII letters. Restricting the alphabet keeps “character” unambiguous in this first example.

```text
FUNCTION isVowel(character)
    RETURN character IN {"a", "e", "i", "o", "u"}
END FUNCTION

FUNCTION countVowels(text)
    count ← 0
    FOR EACH character IN text
        IF isVowel(character) THEN
            count ← count + 1
        END IF
    END FOR
    RETURN count
END FUNCTION
```

The helper decides one thing. The caller controls the repetition. Empty text performs no iterations and returns zero.

```js runnable
function countVowels(text) {
  let count = 0;
  for (const character of text) {
    if ("aeiou".includes(character)) count += 1;
  }
  return count;
}
console.log(countVowels("paper"));
console.log(countVowels(""));
```

```text output
2
0
```

Each character needs at most five comparisons, so time is `O(n)` and extra space is `O(1)`. If you need Unicode text, define whether you count code points or visible characters; JavaScript string positions are UTF-16 code units. See [strings and regular expressions](../javascript/strings-and-regular-expressions.md).

## Step 3: decide whether input may change

`SORT(values)` often changes the input. `SORT(COPY(values))` protects the original list but needs extra storage. A shallow copy protects the array's positions; nested objects can still be shared. Include this decision in the contract, not as a surprise in the implementation.

## Apply it to your project

Describe a reusable step that finds a task by ID. Decide what it returns when the ID is missing and whether it may change the task list.

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| Maximum | Practice | Contract and checks: `[-8, -3] → -3`, `[7] → 7`; explicitly reject empty input. | — |
| Count matches | Practice | Contract and checks: Count a given value; `[2, 1, 2], 2 → 2`, `[], 2 → 0`. | — |
| Filter positives | Practice | Contract and checks: Return a new array; `[-1, 0, 3] → [3]`; preserve the input. | — |
| Word count | Practice | Contract and checks: Define whether repeated spaces and punctuation separate words before writing steps. | — |

## Interview and debugging check

<details>
<summary>A function returns a sorted list. May it change the original list?</summary>

The contract must say. Sorting in place may be appropriate, but a caller expecting an independent result can lose its original ordering. Test input identity and contents after the call, not just the returned values.

</details>

## Next steps

Next: [search, sorting, and common patterns](./04-search-and-patterns.md).
