---
id: dsa-uncategorized-jump-game-readme
title: "Jump Game"
slug: /DSA/uncategorized/jump-game/README
sidebar_label: "Jump Game"
---

# Jump Game

**Read first:** [Greedy](../../greedy/README.md).

**Practice focus:** Compare exploring jumps, saving good positions, and tracking the earliest reachable good position.

## The Problem

Start at index 0 of a nonempty array. Each nonnegative value is the farthest you may jump forward from that position; you may choose a shorter jump. Decide whether you can reach the last index. This asks whether a route exists, not how many jumps the shortest route needs.

**Example #1**

```
Input: [2,3,1,1,4]
Output: true
Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.
```

**Example #2**

```
Input: [3,2,1,0,4]
Output: false
Explanation: You will always arrive at index 3 no matter what. Its maximum
             jump length is 0, which makes it impossible to reach the last index.
```

## Naming

We call a position in the array a **"good index"** if starting at that position,
we can reach the last index. Otherwise, that index is called a **"bad index"**.
The problem then reduces to whether or not index 0 is a "good index".

## Solutions

### Approach 1: Backtracking

Try each permitted next position. Reaching the end succeeds; a position with no successful next move fails. Return to the previous choice and try another. This is a clear baseline, but it repeats the same failed searches.

> See [backtrackingJumpGame.js](backtrackingJumpGame.js) file

**Time complexity:**: `O(2^n)`.
There are 2<sup>n</sup> (upper bound) ways of jumping from
the first position to the last, where `n` is the length of
array `nums`.

**Auxiliary Space Complexity**: `O(n)`.
Recursion requires additional memory for the stack frames.

### Approach 2: Dynamic Programming Top-down

Save whether each position is GOOD, BAD, or still UNKNOWN. Once a position’s result is known, every later visit can reuse it: the remaining array and allowed jumps have not changed. Saving a function’s result for reuse is **memoization**.

> See [dpTopDownJumpGame.js](dpTopDownJumpGame.js) file

**Time complexity:**: `O(n^2)`.
For every element in the array, say `i`, we are looking at the
next `nums[i]` elements to its right aiming to find a GOOD
index. `nums[i]` can be at most `n`, where `n` is the length
of array `nums`.

**Auxiliary Space Complexity**: `O(2 * n) = O(n)`.
First `n` originates from recursion. Second `n` comes from the
usage of the memo table.

### Approach 3: Dynamic Programming Bottom-up

Work from right to left. Every jump goes right, so the positions a new answer depends on are already known. Fill the same good/bad table with loops instead of recursive calls. This removes recursion depth, but scanning candidate jumps can still take quadratic work.

> See [dpBottomUpJumpGame.js](dpBottomUpJumpGame.js) file

**Time complexity:**: `O(n^2)`.
For every element in the array, say `i`, we are looking at the
next `nums[i]` elements to its right aiming to find a GOOD
index. `nums[i]` can be at most `n`, where `n` is the length
of array `nums`.

**Auxiliary Space Complexity**: `O(n)`.
This comes from the usage of the memo table.

### Approach 4: Greedy

Keep only the leftmost known GOOD position, starting with the last index. Scan left. If `index + maximumJump` reaches that GOOD position, the current index is GOOD too and becomes the new boundary. If it cannot reach the nearest GOOD position on its right, it cannot reach a farther one either. The answer is whether this boundary reaches zero.

> See [greedyJumpGame.js](greedyJumpGame.js) file

**Time complexity:**: `O(n)`.
We are doing a single pass through the `nums` array, hence `n` steps,
where `n` is the length of array `nums`.

**Auxiliary Space Complexity**: `O(1)`.
Only a fixed number of variables are needed beyond the input.

## References

- [Jump Game Fully Explained on LeetCode](https://leetcode.com/articles/jump-game/)
- [Dynamic Programming vs Divide and Conquer](https://itnext.io/dynamic-programming-vs-divide-and-conquer-2fea680becbe)
- [Dynamic Programming](https://en.wikipedia.org/wiki/Dynamic_programming)
- [Memoization on Wikipedia](https://en.wikipedia.org/wiki/Memoization)
- [Top-Down and Bottom-Up Design on Wikipedia](https://en.wikipedia.org/wiki/Top-down_and_bottom-up_design)

**Next:** [Dynamic Programming](../../dp/README.md).
