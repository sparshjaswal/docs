---
id: dsa-stack-interview-guide
title: Stacks
slug: /DSA/stack/interview-guide
sidebar_label: Stacks
---


# Stacks

## Pattern Recognition

- **LIFO (Last-In, First-Out):** The last element added to the stack is the first one to be removed.
- **Common Use Cases:**
    - **Function Calls (Call Stack):** Managing active function calls in a program.
    - **Undo/Redo Operations:** Keeping track of previous states.
    - **Parsing and Expression Evaluation:** Converting infix to postfix/prefix, and evaluating expressions.
    - **Backtracking:** Keeping track of the path taken in a search.

## Interview Strategy

1.  **Identify the LIFO pattern:** If the problem involves processing elements in reverse order of their arrival, a stack is a good candidate.
2.  **Think about the operations:** `push`, `pop`, `peek` (or `top`), `isEmpty`.
3.  **Consider using a stack to simplify recursion:** Some recursive solutions can be converted to an iterative one using a stack.
4.  **Discuss complexity:** Stack operations are typically O(1).

## Multiple Solutions

### Example Problem: Valid Parentheses

**Solution: Using a Stack (O(n))**

```javascript
function isValid(s) {
    const stack = [];
    const map = {
        "(": ")",
        "[": "]",
        "{": "}"
    };

    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        if (map[char]) {
            stack.push(char);
        } else {
            if (stack.length === 0) {
                return false;
            }
            const lastOpen = stack.pop();
            if (map[lastOpen] !== char) {
                return false;
            }
        }
    }

    return stack.length === 0;
}
```

## Complexity Analysis

| Operation | Time Complexity | Space Complexity |
| --------- | --------------- | ---------------- |
| Push      | O(1)            | O(n) in worst case (all pushes) |
| Pop       | O(1)            | O(n) in worst case |
| Peek      | O(1)            | O(n) in worst case |
| IsEmpty   | O(1)            | O(n) in worst case |

## Dry Runs

**Problem:** `isValid("()[]{}")`

1.  `i = 0`, `char = '('`. Push `(` onto the stack.
2.  `i = 1`, `char = ')'`. Pop `(`. `map[ '(' ]` is `)`. Match. Stack is empty.
3.  `i = 2`, `char = '['`. Push `[` onto the stack.
4.  `i = 3`, `char = ']'`. Pop `[`. `map[ '[' ]` is `]`. Match. Stack is empty.
5.  `i = 4`, `char = '{'`. Push `{` onto the stack.
6.  `i = 5`, `char = '}'`. Pop `{`. `map[ '{' ]` is `}`. Match. Stack is empty.
7.  Loop ends. Stack is empty. Return `true`.

## Visualization

- **Stack:** A vertical pile of plates. You can only add or remove a plate from the top.

## LeetCode References

- [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)
- [Min Stack](https://leetcode.com/problems/min-stack/)
- [Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/)
- [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)

## Company-Specific Questions

- **Facebook:** Simplify a file path.
- **Bloomberg:** Design a stock span algorithm.
- **Twitter:** Implement a queue using two stacks.

## Variations

- **Monotonic Stack:** A stack where the elements are always in a sorted order (either increasing or decreasing). Useful for finding the next greater/smaller element.
- **Implementing a Queue with Stacks:** A classic problem that demonstrates understanding of both data structures.

## Revision Notes

- Stacks are simple but powerful. Look for LIFO patterns.
- The monotonic stack is a more advanced and useful pattern for certain problems.
- Be comfortable with the standard stack operations and their complexities.
