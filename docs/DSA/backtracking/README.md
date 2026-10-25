---
id: dsa-backtracking-readme
title: "🔙 Backtracking"
slug: /DSA/backtracking/README
sidebar_label: "Backtracking"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# 🔙 Backtracking

Try one choice, explore what it leads to, then undo it and try the next choice. Use backtracking when you need to find valid combinations, arrangements, or paths.

---

<AlgorithmWalkthrough name="backtracking" />

## Learning steps

Choosing pizza toppings is a small search problem: each topping is included or left out. List the choices before adding rules that rule some out.

1. Draw the choices for two values and record the empty choice too.
2. Choose, explore, then undo; copy completed answers.
3. Add a pruning rule only when you can explain why it loses no valid answer.

## Concept

Build an answer one choice at a time. If a choice breaks a rule, undo it and try another. Stopping a branch early is called **pruning**. After exploring a choice, restore the previous state so the next branch starts correctly.

## Choose, explore, restore

This runnable subset example accepts distinct input values and leaves the input unchanged. The empty array has one subset: the empty subset.

**Invariant:** the path contains only choices made by the current recursion branch, in increasing input-index order. The start index prevents revisiting earlier choices. Copy the path when saving it, and undo the last choice before exploring a sibling branch.

```js runnable
function subsets(values) {
  const result = [];
  const path = [];
  function visit(start) {
    result.push([...path]);
    for (let i = start; i < values.length; i++) {
      path.push(values[i]);
      visit(i + 1);
      path.pop();
    }
  }
  visit(0);
  return result;
}

console.log(JSON.stringify(subsets([1, 2])));
console.log(JSON.stringify(subsets([])));
```

```text output
[[],[1],[1,2],[2]]
[[]]
```

There are 2^n subsets. Copying the outputs takes O(n · 2^n) total time and output space for n ≥ 1; recursion and the working path use O(n) auxiliary space. Pruning helps only when a condition proves a partial choice cannot lead to a needed answer; it cannot remove the cost of listing valid outputs.

| Variant | State change |
| --- | --- |
| Subsets/combinations | Advance the start index; earlier choices cannot be reused. |
| Permutations | Track used indices, since each position may choose any unused value. |
| Reusable combination candidates | Keep the chosen index available when repetition is allowed. |
| Board or path search | Mark visited/occupied state before recursion and restore it afterward. |

Repeated input values need explicit duplicate handling. A common sorted-combination rule skips equal values at the same recursion depth, while still allowing them at deeper levels when the contract permits it. See [enumeration versus counting](../patterns.md#enumerating-answers-or-counting-them) before applying memoization.

---

## Classic Backtracking Problems

These genuine backtracking algorithms live in the DSA docs (some under `../uncategorized/` and `../sets/`):

- [N-Queens Problem](../uncategorized/n-queens/README.md)
- [Knight's Tour](../uncategorized/knight-tour/README.md)
- [Jump Game (backtracking variant)](../uncategorized/jump-game/README.md)
- [Unique Paths (backtracking variant)](../uncategorized/unique-paths/README.md)
- [Power Set](../sets/power-set/README.md)
- [Combinations](../sets/combinations/README.md)
- [Combination Sum](../sets/combination-sum/README.md)
- [Permutations](../sets/permutations/README.md)
- [Hamiltonian Cycle](../graphs/hamiltonian-cycle/README.md)

---

## When to Use Backtracking

Use backtracking to list valid arrangements or search for a solution among choices. **Enumerate** means list each answer; **constraint** means a rule each answer must obey. You may stop after the first valid answer if that is all the task requests.

If you need only a count or best value, check whether repeated states can be saved with DP. A greedy shortcut needs a proof that committing to one choice preserves the best answer.

---

## Pitfalls

- Forgetting to **un-choose** (restore state) after recursion — corrupts subsequent branches.
- Pruning without proof — rejecting a branch too early can lose a valid answer. Some tasks genuinely require exploring every choice.
- Mutating shared state without copying when storing a solution.

---

## Worked examples and answers {/* #workbook-practice */}

Attempt the linked [Practice Problems](#practice-problems) before opening their answers. See the [workbook guide](../../javascript/workbook.md) for the A–C exercise format.

### 43. Backtracking subsets and permutations {/* #workbook-43 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** explore alternatives while leaving the caller’s partial answer intact.

Follow [choose, explore, restore](#choose-explore-restore) for the subset example. Each of n distinct values may be included or excluded, giving 2ⁿ answers. Copying those answers costs O(n · 2ⁿ); no implementation can avoid the size of its required output. Permutations instead choose an unused value for each position, giving n! arrangements.

Record `[...path]`, not the changing `path` object. Undo each push before the next branch. Repeated input values need an explicit duplicate policy because different index choices can otherwise produce equal answers.

**Pruning** means stopping a branch once it cannot succeed. A sum above the target can be rejected when all future additions are nonnegative; that rule fails when negative values may lower it. [N-Queens](../uncategorized/n-queens/README.md) uses occupied columns and diagonals to reject unsafe placements early. Choosing a restrictive unresolved decision may reduce the search, but never replaces a correct undo rule.

**Worked example**

```js
function subsets(values) {
  const result = [];
  const path = [];
  function visit(index) {
    if (index === values.length) {
      result.push([...path]);
      return;
    }
    visit(index + 1);
    path.push(values[index]);
    visit(index + 1);
    path.pop();
  }
  visit(0);
  return result;
}
console.log(JSON.stringify(subsets([1, 2])));
```

**Expected output**

```text
[[],[2],[1],[1,2]]
```

**Why the example works**

The algorithm first explores excluding 1 and then both choices for 2. It returns to the root with an empty path, includes 1, and explores the remaining choices again. Copying at the leaf preserves each result after later pops.

</details>

Find **43A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-43-answer">
<summary>Check your reasoning and answer</summary>

For Node checks, add `import assert from "node:assert/strict";` at the top of your file. Browser and multi-file examples use the setup stated above.

**43A.** The working path is reused and mutated. A copy records the state at that moment; a shared reference would later show the final restored path rather than the intended answer.

**43B.** No. Even if repeated internal computations are reduced, materializing all distinct outputs requires work proportional to their total size. Enumeration has an unavoidable output cost.

**43C.** Choose each unused position, mark it, recurse, then undo both the path and the mark. A path with n values is complete. Empty input already satisfies that base case and has one empty permutation.

**Reference code**

Use the worked example above first if the answer calls its functions or classes. Run each lesson in its own `.mjs` file.

```js
function permutations(values) {
  const result = [];
  const used = Array(values.length).fill(false);
  const path = [];
  function visit() {
    if (path.length === values.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < values.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(values[i]);
      visit();
      path.pop();
      used[i] = false;
    }
  }
  visit();
  return result;
}
```

**Check the result**

```js
assert.deepEqual(permutations([]), [[]]);
assert.deepEqual(permutations([1, 2]), [[1, 2], [2, 1]]);
assert.equal(permutations([1, 2, 3]).length, 6);
```

</details>

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **43A — Why copy path when saving an answer?** | **Must fix** | [Worked example](#workbook-43) | [Answer](#workbook-43-answer) |
| **43B — Can memoization remove the cost of enumerating every distinct subset?** | **Must fix** | [Worked example](#workbook-43) | [Answer](#workbook-43-answer) |
| **43C — Write permutations(values) for distinct input values. Return [[]] for empty input.** | **Must fix** | [Worked example](#workbook-43) | [Answer](#workbook-43-answer) |
| <PracticeProblem id={17} title={"Letter Combinations of a Phone Number"} text={"Problem statement\ndigits is a nonempty string using digits 2 through 9. Return all strings obtained by choosing one\nletter per digit from a telephone keypad. The mappings are 2: abc, 3: def, 4: ghi, 5: jkl, 6: mno, 7:\npqrs, 8: tuv, 9: wxyz. Preserve digit order; return combinations in any order.\nInput \u0026 expected result\nEvery returned string has the same length as digits. Select exactly one mapped letter for each\nposition, independently of other positions. No spaces or keypad punctuation appear in the answers,\nand repeated input digits still represent separate positions.\nEXAMPLE 1\nInput: digits = \"7\"\nOutput: [\"p\",\"q\",\"r\",\"s\"]\nExplanation: Digit 7 maps to four letters, so each of p, q, r, and s is a one-character\ncombination.\nEXAMPLE 2\nInput: digits = \"22\"\nOutput: [\"aa\",\"ab\",\"ac\",\"ba\",\"bb\",\"bc\",\"ca\",\"cb\",\"cc\"]\nExplanation: Each of the two positions has three choices, producing nine different two-letter\nstrings.\nConstraints \u0026 guarantees\n• digits.length: 1 through 4 (inclusive)\n• Digit alphabet: 2 through 9\nJavaScript starter\nfunction letterCombinations(digits) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) | — |
| <PracticeProblem id={22} title={"Generate Parentheses"} text={"Problem statement\nReturn every valid string containing exactly n pairs of parentheses. A valid string closes every\nopening parenthesis, never closes before a matching opener, and finishes with no unmatched\nopeners. Include each distinct string once; the result may be in any order.\nInput \u0026 expected result\nEach output has length 2n, with n opening and n closing parentheses. Equal counts are necessary\nbut insufficient: every prefix must have at least as many opening as closing parentheses. Do not\ninclude duplicate strings.\nEXAMPLE 1\nInput: n = 2\nOutput: [\"(())\",\"()()\"]\nExplanation: The two valid two-pair arrangements are one nested pair of pairs and two\nconsecutive pairs.\nEXAMPLE 2\nInput: n = 1\nOutput: [\"()\"]\nExplanation: With one pair, the opener must precede its closer, leaving exactly one valid string.\nConstraints \u0026 guarantees\n• n: 1 through 8 (inclusive)\nJavaScript starter\nfunction generateParenthesis(n) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/generate-parentheses/) | — |
| <PracticeProblem id={39} title={"Combination Sum"} text={"Problem statement\ncandidates contains distinct positive integers. Return all unique combinations whose values sum to\ntarget. Each candidate may be used any number of times. Combinations differing only in order are\nthe same answer. Every returned combination must use only candidate values and add exactly to\ntarget.\nInput \u0026 expected result\nThe number of copies chosen for each candidate distinguishes combinations. Candidate order does\nnot matter, and values not in candidates cannot be used. If no selection reaches target exactly,\nreturn an empty outer array.\nEXAMPLE 1\nInput: candidates = [2,4,5], target = 6\nOutput: [[2,2,2],[2,4]]\nExplanation: Three copies of 2 reach 6, and one 2 plus one 4 also reach 6. No combination\ncontaining 5 can finish the remaining 1.\nEXAMPLE 2\nInput: candidates = [3,5], target = 7\nOutput: []\nExplanation: No nonnegative number of copies of 3 and 5 sums exactly to 7.\nConstraints \u0026 guarantees\n• candidates.length: 1 through 30 (inclusive)\n• candidates[i]: 2 through 40 (inclusive)\n• target: 1 through 40 (inclusive)\n• Candidate denominations do not repeat. Fewer than 150 valid combinations exist\nJavaScript starter\nfunction combinationSum(candidates, target) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/combination-sum/) | — |
| <PracticeProblem id={40} title={"Combination Sum II"} text={"Problem statement\nReturn all unique combinations of candidates that sum to target. candidates contains positive\nintegers and may contain duplicates. Each input position may be used at most once in a\ncombination. Two combinations with the same values are one answer even if they use different\nequal-valued positions. Return answers in any order.\nInput \u0026 expected result\nThe limit is one use per input occurrence, not one use per distinct value. Thus two copies of the\nsame value can both appear when two copies exist in candidates. Deduplicate the returned value\ncombinations regardless of their source positions.\nEXAMPLE 1\nInput: candidates = [1,1,2,3], target = 4\nOutput: [[1,1,2],[1,3]]\nExplanation: Both copies of 1 can combine with 2, while one 1 can combine with 3. Swapping\nthe two equal 1 positions creates no new answer.\nEXAMPLE 2\nInput: candidates = [2,2,2], target = 4\nOutput: [[2,2]]\nExplanation: Any two occurrences can supply the sum, but all such choices represent the same\nvalue combination.\nConstraints \u0026 guarantees\n• candidates.length: 1 through 100 (inclusive)\n• candidates[i]: 1 through 50 (inclusive)\n• target: 1 through 30 (inclusive)\nJavaScript starter\nfunction combinationSum2(candidates, target) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/combination-sum-ii/) | — |
| <PracticeProblem id={46} title={"Permutations"} text={"Problem statement\nnums contains distinct integers. Return all possible permutations, each using every input value\nexactly once. Different orderings are different answers. The outer array may list the permutations\nin any order.\nInput \u0026 expected result\nEvery permutation has nums.length elements and contains the same values as nums. Input values\nare unique, so each different arrangement is a distinct result. Return all arrangements, including\nthe unchanged ordering of the input.\nEXAMPLE 1\nInput: nums = [4,7]\nOutput: [[4,7],[7,4]]\nExplanation: Two distinct values have two arrangements: one with 4 first and one with 7 first.\nEXAMPLE 2\nInput: nums = [0]\nOutput: [[0]]\nExplanation: A one-element array has exactly one ordering, which is the original array.\nConstraints \u0026 guarantees\n• nums.length: 1 through 6 (inclusive)\n• nums[i]: -10 through 10 (inclusive)\n• Input values do not repeat\nJavaScript starter\nfunction permute(nums) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/permutations/) | — |
| <PracticeProblem id={47} title={"Permutations II"} text={"Problem statement \u0026 expected result\nReturn every distinct ordering of all values in nums. Duplicate input values are indistinguishable for output\ndeduplication. Every returned ordering uses the complete input multiset; output order is unrestricted.\nEXAMPLE 1\nInput: nums = [1,1,2]\nOutput: [[1,1,2], [1,2,1], [2,1,1]]\nExplanation: The repeated 1 leaves three different full orderings.\nEXAMPLE 2\nInput: nums = [1,2,3]\nOutput: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\nExplanation: Three distinct values yield six orderings.\nConstraints \u0026 guarantees\n- 1 \u003c= nums.length \u003c= 8\n- -10 \u003c= nums[i] \u003c= 10\nJavaScript starter\nfunction permuteUnique(nums) {\n// TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/permutations-ii/) | — |
| <PracticeProblem id={77} title={"Combinations"} text={"Problem statement\nReturn every way to choose k distinct numbers from the integers 1 through n, where 1 \u003c= k \u003c= n.\nThe order of selected numbers does not create a different combination. Do not repeat a\ncombination. Both the result ordering and ordering within a combination may be chosen freely.\nInput \u0026 expected result\nEach answer must contain exactly k different values from the inclusive range 1..n. Selecting the\nsame values in a different order does not create another answer. Return an array of combinations\nrather than merely their count.\nEXAMPLE 1\nInput: n = 3, k = 2\nOutput: [[1,2],[1,3],[2,3]]\nExplanation: There are three ways to choose two values from 1,2,3: the pairs 1,2; 1,3; and 2,3.\nEXAMPLE 2\nInput: n = 4, k = 4\nOutput: [[1,2,3,4]]\nExplanation: Choosing all four available numbers leaves only one possible combination.\nConstraints \u0026 guarantees\n• n: 1 through 20 (inclusive)\n• k: 1 through n (inclusive)\nJavaScript starter\nfunction combine(n, k) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/combinations/) | — |
| <PracticeProblem id={78} title={"Subsets"} text={"Problem statement\nnums contains distinct integers. Return its power set: every possible subset, including the empty\nsubset and the full set. Each value can be selected once or omitted. Do not repeat subsets;\nordering within or between subsets does not matter.\nInput \u0026 expected result\nA subset may contain any number of input values from zero through nums.length. Values are\nselected without repetition. The output consists of subsets themselves, and every mathematically\ndistinct selection must appear exactly once.\nEXAMPLE 1\nInput: nums = [2,5]\nOutput: [[],[2],[5],[2,5]]\nExplanation: For the two values 2 and 5, the choices are neither, each individually, or both.\nEXAMPLE 2\nInput: nums = [9]\nOutput: [[],[9]]\nExplanation: The only choices are to omit the value or include it once.\nConstraints \u0026 guarantees\n• nums.length: 1 through 10 (inclusive)\n• nums[i]: -10 through 10 (inclusive)\n• Input values do not repeat\nJavaScript starter\nfunction subsets(nums) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/subsets/) | — |
| <PracticeProblem id={79} title={"Word Search"} text={"Problem statement\nDetermine whether word can be formed on a rectangular letter board by starting at any cell and\nmoving horizontally or vertically between adjacent cells. Characters must match word in order, and\na cell cannot be used more than once in the same path. Matching is case-sensitive.\nInput \u0026 expected result\nReturn a boolean for the single requested word. A path can change direction between steps, and\ndistinct cells holding the same character are separate choices. Finding a matching prefix is\ninsufficient unless every character of word is consumed.\nEXAMPLE 1\nInput: board = [[\"c\",\"a\"],[\"t\",\"r\"]], word = \"car\"\nOutput: true\nExplanation: The path starts at c, moves right to a, and then down to r, matching car without\nreusing a cell.\nEXAMPLE 2\nInput: board = [[\"a\",\"b\"]], word = \"aba\"\nOutput: false\nExplanation: Returning to the first a would reuse its cell, which is not allowed.\nConstraints \u0026 guarantees\n• m == board.length\n• n = board[i].length\n• m, n: 1 through 6 (inclusive)\n• word.length: 1 through 15 (inclusive)\n• Character set: A-Z and a-z, with case preserved\nJavaScript starter\nfunction exist(board, word) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/word-search/) | — |
| <PracticeProblem id={90} title={"Subsets II"} text={"Problem statement\nReturn every distinct subset of nums, which may contain repeated integers. Each input occurrence\ncan be used at most once. Subsets containing the same multiset of values count as one answer,\nregardless of which equal positions were selected. Include the empty subset and return answers in\nany order.\nInput \u0026 expected result\nA value may appear in a subset up to its frequency in nums. The number of copies matters, but\nselecting different equal-valued positions does not. Return all distinct selections without requiring\nany particular outer ordering.\nEXAMPLE 1\nInput: nums = [2,2]\nOutput: [[],[2],[2,2]]\nExplanation: The repeated value 2 may be chosen zero times, once, or twice, producing three\ndistinct subsets.\nEXAMPLE 2\nInput: nums = [1,1,1]\nOutput: [[],[1],[1,1],[1,1,1]]\nExplanation: Four different copy counts are possible, and no other values or arrangements\ncreate new subsets.\nConstraints \u0026 guarantees\n• nums.length: 1 through 10 (inclusive)\n• nums[i]: -10 through 10 (inclusive)\nJavaScript starter\nfunction subsetsWithDup(nums) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/subsets-ii/) | — |
| [LC 93 — Restore IP Addresses](https://leetcode.com/problems/restore-ip-addresses/) | Medium | [LeetCode](https://leetcode.com/problems/restore-ip-addresses/) | — |
| <PracticeProblem id={131} title={"Palindrome Partitioning"} text={"Problem statement\nSplit s into consecutive, nonempty substrings such that every piece is a palindrome. Return every\npossible partition, with each partition listing its pieces in their original order. A palindrome reads\nthe same forward and backward. Together, a partition's pieces must reproduce the entire input\nstring.\nInput \u0026 expected result\nA partition must cover every character exactly once without changing order. Each output is an\narray of strings, and the complete result is an array of these partitions. A one-character piece is\nalways a palindrome.\nEXAMPLE 1\nInput: s = \"noon\"\nOutput: [[\"n\",\"o\",\"o\",\"n\"],[\"n\",\"oo\",\"n\"],[\"noon\"]]\nExplanation: The middle oo can stay together or split, and the full word noon is also a\npalindrome. These give the three listed partitions.\nEXAMPLE 2\nInput: s = \"ab\"\nOutput: [[\"a\",\"b\"]]\nExplanation: The whole string is not a palindrome, so both single-character pieces are required.\nConstraints \u0026 guarantees\n• s.length: 1 through 16 (inclusive)\n• Alphabet: a-z\nJavaScript starter\nfunction partition(s) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/palindrome-partitioning/) | — |
| <PracticeProblem id={139} title={"Word Break"} text={"Problem statement\nDetermine whether all of s can be split into one or more consecutive words from wordDict. Every\npiece must be a dictionary word, and pieces must reproduce the entire string in order. A dictionary\nword may be reused any number of times. Return a boolean.\nInput \u0026 expected result\nWords must cover s without gaps or overlapping positions. Dictionary membership is exact and\ncase-sensitive, with lowercase inputs here. Return true for any valid complete segmentation even if\nother attempted splits leave an unmatchable suffix.\nEXAMPLE 1\nInput: s = \"codecode\", wordDict = [\"code\",\"cod\"]\nOutput: true\nExplanation: The split code + code uses the dictionary entry twice and covers all eight\ncharacters.\nEXAMPLE 2\nInput: s = \"applepeer\", wordDict = [\"apple\",\"pear\"]\nOutput: false\nExplanation: The prefix apple matches, but the remaining peer is not a dictionary word and\ncannot be fully segmented.\nConstraints \u0026 guarantees\n• s.length: 1 through 300 (inclusive)\n• wordDict.length: 1 through 1000 (inclusive)\n• wordDict[i].length: 1 through 20 (inclusive)\n• The string and dictionary use a-z\n• dictionary entries do not repeat\nJavaScript starter\nfunction wordBreak(s, wordDict) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/word-break/) | — |
| [LC 216 — Combination Sum III](https://leetcode.com/problems/combination-sum-iii/) | Medium | [LeetCode](https://leetcode.com/problems/combination-sum-iii/) | — |
| [LC 473 — Matchsticks to Square](https://leetcode.com/problems/matchsticks-to-square/) | Medium | [LeetCode](https://leetcode.com/problems/matchsticks-to-square/) | — |
| [LC 698 — Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/) | Medium | [LeetCode](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/) | — |
| [LC 784 — Letter Case Permutation](https://leetcode.com/problems/letter-case-permutation/) | Medium | [LeetCode](https://leetcode.com/problems/letter-case-permutation/) | — |
| [LC 1066 — Campus Bikes II](https://leetcode.com/problems/campus-bikes-ii/) | Medium · Premium | [LeetCode](https://leetcode.com/problems/campus-bikes-ii/) | — |
| <PracticeProblem id={37} title={"Sudoku Solver"} text={"Problem statement\nFill the empty cells of a 9 x 9 Sudoku board. Each row, column, and 3 x 3 box must contain each\ndigit from 1 through 9 exactly once. Cells contain digit characters; a dot marks an empty cell.\nPreserve all initially supplied digits. The puzzle has exactly one solution.\nInput \u0026 expected result\nUpdate board in place. In the examples, each quoted string displays one row; the function receives\na 9 x 9 character array.\nEXAMPLE 1\nInput rows:\n[\".34678912\",\"672195348\",\"198342567\",\n \"859761423\",\"426853791\",\"713924856\",\n \"961537284\",\"287419635\",\"345286179\"]\nAfter the call: row 0 = \"534678912\";\nall other rows stay unchanged.\nExplanation: The missing first cell must be 5 to complete its row, column, and box.\nEXAMPLE 2\nInput: the completed board from Example 1\nAfter the call: the board is unchanged.\nExplanation: An already completed valid board needs no replacements.\nConstraints \u0026 guarantees\n• board.length == 9\n• board[i].length == 9\n• board[i][j] is a digit or '.'\n• The puzzle has exactly one solution\nJavaScript starter\nfunction solveSudoku(board) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/sudoku-solver/) | — |
| <PracticeProblem id={51} title={"N-Queens"} text={"Problem statement\nPlace n queens on an n by n board so that no pair shares a row, column, or diagonal. Return all\ndistinct valid boards. Represent each board as n strings, with \"Q\" for a queen and \".\" for an empty\nsquare. Return an empty array when no arrangement exists.\nInput \u0026 expected result\nEach returned board contains n rows of n characters and exactly n queens. Include every valid\narrangement once. Different rotations or reflections count separately when their queen positions\ndiffer; the outer ordering of boards is unrestricted.\nEXAMPLE 1\nInput: n = 1\nOutput: [[\"Q\"]]\nExplanation: The one-square board has one legal arrangement, represented by a single row\ncontaining Q.\nEXAMPLE 2\nInput: n = 3\nOutput: []\nExplanation: No placement of three queens on a 3 by 3 board avoids all row, column, and\ndiagonal attacks.\nConstraints \u0026 guarantees\n• n: 1 through 9 (inclusive)\nJavaScript starter\nfunction solveNQueens(n) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/n-queens/) | — |
| <PracticeProblem id={52} title={"N-Queens II"} text={"Problem statement\nCount the distinct ways to place n queens on an n by n chessboard so that no two share a row,\ncolumn, or diagonal. Boards that differ by a rotation or reflection are still distinct when their\noccupied squares differ. Return the number of valid boards, not the boards themselves.\nInput \u0026 expected result\nA board has exactly n queens, one in each row and column. Diagonal conflicts include both\ndiagonal directions. Count each valid occupied-square arrangement once; do not merge reflected\nboards or return placements as strings.\nEXAMPLE 1\nInput: n = 1\nOutput: 1\nExplanation: A single queen can occupy the only square on a 1 by 1 board without attacking\nanother queen.\nEXAMPLE 2\nInput: n = 2\nOutput: 0\nExplanation: Two queens on a 2 by 2 board necessarily share a row, column, or diagonal.\nConstraints \u0026 guarantees\n• n: 1 through 9 (inclusive)\nJavaScript starter\nfunction totalNQueens(n) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/n-queens-ii/) | — |
| [LC 282 — Expression Add Operators](https://leetcode.com/problems/expression-add-operators/) | Hard | [LeetCode](https://leetcode.com/problems/expression-add-operators/) | — |
| G12 — Enumerate valid routes through a blocked maze. | Exercise | Backtracking | — |
| G13 — Color vertices with at most m colors without adjacent matches. | Exercise | Backtracking. Related only: [LC 785](https://leetcode.com/problems/is-graph-bipartite/) - Is Graph Bipartite?. Restricted to two colors; general m-coloring is broader. | — |
| G06 — Find the cheapest tour visiting every city and returning. | Exercise | Advanced optimization | — |

{/* END GENERATED PRACTICE PROBLEMS */}

## Related Topics

- [Recursion](../recursion/README.md) — backtracking is recursion with state restoration
- [Sets](../sets/README.md) — subsets, permutations, and combinations
- [Dynamic Programming](../dp/README.md) — overlapping subproblems can replace re-exploration

[← Back to Home](../index.md) · © sparshjaswal

**Next:** [greedy choices](../greedy/README.md).
