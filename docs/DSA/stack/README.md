---
id: dsa-stack-readme
title: "Stack"
slug: /DSA/stack/README
sidebar_label: "Stack"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# Stack

A stack works like a pile of plates: add to the top and remove from the top. The last item added is the first item removed. This rule is called **LIFO**: last in, first out.

- **push:** add an item to the top.
- **pop:** remove and return the top item.
- **peek:** read the top item without removing it.

Use a stack for undo history, matching brackets, or remembering unfinished work.

<AlgorithmWalkthrough name="stack" />

## Learning steps

When checking nested brackets, the most recent opening bracket must close first. That waiting order is exactly a stack.

1. Predict the order after several push and pop operations.
2. Trace unfinished work and compare the order with a queue.
3. Count total operations instead of guessing from the number of loops.

## Trace a stack and account for work

Pushing A and then B leaves B on top. Popping returns B first, then A. An array's `push` and `pop` express this LIFO contract; a queue needs FIFO order instead. For queue traversal, a head index avoids repeatedly removing the first element with `shift`. See [queues](../queue/README.md) for ownership and retained-storage tradeoffs.

```js runnable
const stack = [];
for (const symbol of 'A😀B') stack.push(symbol);
const reversed = [];
while (stack.length > 0) reversed.push(stack.pop());
console.log(reversed.join(''));
console.log(stack.length);
```

```text output
B😀A
0
```

The loop iterates Unicode code points, so the emoji's surrogate pair stays together. This does not preserve multi-code-point grapheme clusters; [text segmentation](../../javascript/strings-and-regular-expressions.md) needs a different contract.

Each symbol is pushed once and popped once: two successive linear loops give O(n) total work, not O(n²). Two nested loops that each scan all n values do give O(n²). Count actual operations; a nested loop can still be linear when each element can leave a structure only once, as in [monotonic stacks](../monotonic-stack/README.md). The example uses O(n) auxiliary space, including the output construction.

## Worked examples and answers {/* #workbook-practice */}

Attempt the linked [Practice Problems](#practice-problems) before opening their answers. See the [workbook guide](../../javascript/workbook.md) for the A–C exercise format.

### 20. Complexity stacks queues and nodes {/* #workbook-20 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** connect the stack trace to the cost of the operations it uses.

Review [counting work and memory](../complexity.md) for O(1), O(n), O(log n), and O(n²). For ordinary small numbers and typical dense arrays, this lesson treats arithmetic and indexed reads as constant work; appending is amortized constant work across many appends. JavaScript does not guarantee a storage layout or a particular sorting algorithm.

Use the [stack trace above](#trace-a-stack-and-account-for-work) to predict removal order. Compare it with the [queue lesson](../queue/README.md): a moving head avoids repeatedly shifting the remaining values, but a long-lived queue must release processed references or reuse storage. The worked example below contrasts these orders.

As later preparation, [linked lists](../linked-list/README.md), [trees](../trees/README.md), and [graphs](../graphs/README.md) explain their different node connections. You need not memorize those structures to complete this stack exercise.

**Worked example**

```js
const queue = ["A", "B", "C"];
let head = 0;
while (head < queue.length) {
  const item = queue[head];
  head += 1;
  console.log(item);
}
console.log(queue.length);
```

**Expected output**

```text
A
B
C
3
```

Reading and advancing the index visits each item once. The array still has length 3 because no item was removed. That is fine for a small batch traversal; it also shows why a persistent queue needs a storage policy.

**Trace the example step by step**

1. The array contains A, B, and C, while head marks the next position to process.

2. Reading queue[head] gives A. Incrementing head advances the logical front without removing a slot.

3. The next iterations read B and C. When head equals queue.length, there is nothing left to process.

4. queue.length remains 3 because only head changed. Logical consumption and physical storage are separate facts.

**Common mistakes and how to reason about them**

Do not judge complexity by the number of source lines. A one-line copy, sort, or nested callback can do substantial work. Include extra arrays and recursive stack frames in space analysis. When discussing auxiliary space, state whether output storage is excluded, especially for functions that construct a new collection.

</details>

Find **20A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-20-answer">
<summary>Check your reasoning and answer</summary>

For Node checks, add `import assert from "node:assert/strict";` at the top of your file. Browser and multi-file examples use the setup stated above.

**20A.** O(n) and O(n squared), assuming constant work in the inner body.

One full scan performs n constant-cost steps, giving O(n). Two nested full scans perform n steps for each of n outer iterations, giving O(n squared). Two separate consecutive scans are still O(n), since their work adds rather than multiplies.

**20B.** Each shift may move the remaining values. Repeating that can accumulate quadratic work.

In a conventional array model, front removal can cost proportionally to the remaining length. Summing n + (n - 1) + ... + 1 gives quadratic growth. A head index changes each logical dequeue into a read and an increment.

**20C.** Collect code points in a stack, pop them into a second array, and join. This uses O(n) extra space and does not preserve multi-code-point grapheme clusters.

Array.from builds a stack of code points. Repeated pop reads them in reverse order, and join combines the output. The algorithm uses linear work and storage under the usual string model. It can still disrupt grapheme clusters containing several code points, so it is not a universal human-text reversal routine.

**Reference code**

```js
function reverseWithStack(text) {
  const stack = Array.from(text);
  const output = [];
  while (stack.length > 0) output.push(stack.pop());
  return output.join("");
}
```

**Check the result**

```js
assert.equal(reverseWithStack("abc"), "cba");
assert.equal(reverseWithStack("A😀"), "😀A");
```

😀 😀

```js
assert.equal(reverseWithStack(""), "");
```

</details>

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **20A — Give the time complexity of one full loop over n values and two nested full loops over those values.** | **Must fix** | [Worked example](#workbook-20) | [Answer](#workbook-20-answer) |
| **20B — Why is repeatedly using shift potentially expensive when processing n queue items?** | **Must fix** | [Worked example](#workbook-20) | [Answer](#workbook-20-answer) |
| **20C — Write reverseWithStack(text) using Array.from, push or pop, and join. Treat symbols as code points.** | **Must fix** | [Worked example](#workbook-20) | [Answer](#workbook-20-answer) |
| <PracticeProblem id={20} title={"Valid Parentheses"} text={"Problem statement\ns contains only parentheses, square brackets, and braces. Determine whether the sequence is\ncorrectly nested: each opening bracket must be closed by the matching kind, closures must occur\nin reverse opening order, and no bracket may remain unmatched. Return a boolean.\nInput \u0026 expected result\nRead s from beginning to end. A closing bracket must match the most recent opening bracket that\nhas not yet been closed. Return true only if the entire string satisfies the rules; matching counts\nalone are insufficient.\nEXAMPLE 1\nInput: s = \"{[()]}\"\nOutput: true\nExplanation: The braces enclose square brackets, which enclose parentheses. Each pair closes\nbefore the surrounding pair closes.\nEXAMPLE 2\nInput: s = \"([)]\"\nOutput: false\nExplanation: The parenthesis closes while the square bracket is still open, so the nesting order is\ninvalid.\nConstraints \u0026 guarantees\n• s.length: 1 through 10^4 (inclusive)\n• Character set: (, ), [, ], {, }\nJavaScript starter\nfunction isValid(s) {\n  // TODO: write your solution.\n}"} /> | Easy | [LeetCode](https://leetcode.com/problems/valid-parentheses/) | — |
| [LC 225 — Implement Stack using Queues](https://leetcode.com/problems/implement-stack-using-queues/) | Easy | [LeetCode](https://leetcode.com/problems/implement-stack-using-queues/) | — |
| [LC 1047 — Remove All Adjacent Duplicates In String](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/) | Easy | [LeetCode](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/) | — |
| [LC 1614 — Maximum Nesting Depth of the Parentheses](https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/) | Easy | [LeetCode](https://leetcode.com/problems/maximum-nesting-depth-of-the-parentheses/) | — |
| <PracticeProblem id={71} title={"Simplify Path"} text={"Problem statement\nConvert an absolute Unix-style path to its canonical form. Repeated slashes act as one separator, a\ncomponent \".\" means stay in the same directory, and \"..\" means move to the parent without going\nabove root. Other names, including \"...\", are ordinary directories. Return a path with one leading\nslash, single separators, and no trailing slash unless the result is root.\nInput \u0026 expected result\nThe input always starts at the filesystem root. Interpret components as path syntax; you do not\nneed to inspect an actual filesystem or resolve symbolic links. The output is a single normalized\nabsolute-path string.\nEXAMPLE 1\nInput: path = \"/home//team/.././docs/\"\nOutput: \"/home/docs\"\nExplanation: The empty component and dot change nothing. Moving up from team returns to\nhome, after which docs is appended.\nEXAMPLE 2\nInput: path = \"/../../a/.../b/..\"\nOutput: \"/a/...\"\nExplanation: Parent steps cannot move above root. The name ... remains a directory; the final\nparent step removes b.\nConstraints \u0026 guarantees\n• path.length: 1 through 3000 (inclusive)\n• Alphabet: English letters, digits, period, slash, underscore. The input is a valid absolute path\nJavaScript starter\nfunction simplifyPath(path) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/simplify-path/) | — |
| <PracticeProblem id={150} title={"Evaluate Reverse Polish Notation"} text={"Problem statement\nEvaluate a valid arithmetic expression supplied as tokens in postfix notation. Integer tokens are\noperands; \"+\", \"-\", \"*\", and \"/\" are binary operators applied to the preceding two results in their\noriginal order. Integer division truncates toward zero. There is no division by zero, and all\nintermediate values fit signed 32-bit integers. Return the final integer.\nInput \u0026 expected result\ntokens is the expression itself, not a string that needs splitting. For subtraction and division,\npreserve left-operand and right-operand order. Return one integer after all tokens have been\nconsumed; a valid expression leaves exactly one result.\nEXAMPLE 1\nInput: tokens = [\"8\",\"3\",\"-\",\"2\",\"*\"]\nOutput: 10\nExplanation: The first operator computes 8 - 3 = 5. The final multiplication gives 5 * 2 = 10.\nEXAMPLE 2\nInput: tokens = [\"7\",\"-3\",\"/\"]\nOutput: -2\nExplanation: Seven divided by negative three is about -2.33; truncation toward zero yields -2.\nConstraints \u0026 guarantees\n• tokens.length: 1 through 10^4 (inclusive)\n• A token is one of +, -, *, / or an integer from -200 through 200. The expression is valid\nJavaScript starter\nfunction evalRPN(tokens) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/evaluate-reverse-polish-notation/) | — |
| <PracticeProblem id={155} title={"Min Stack"} text={"Problem statement\nImplement a stack supporting push(val), pop(), top(), and getMin(). The constructor starts with an\nempty stack. pop removes the most recently pushed value, top returns that value without\nremoving it, and getMin returns the smallest stored value. All four operations must take O(1) time.\nCalls to pop, top, and getMin occur only when the stack is nonempty.\nInput \u0026 expected result\nUse the MinStack class and preserve state between method calls. push and pop modify that state;\ntop and getMin are queries. Removing a minimum must reveal the correct minimum among the\nremaining elements, including duplicate minima.\nEXAMPLE 1\nOperations: push(4), push(-2), push(7), getMin(), pop(), top()\nQuery results: getMin() = -2; top() = -2\nExplanation: After pushing 4, -2, and 7, the minimum is -2. Removing 7 leaves -2 on top.\nEXAMPLE 2\nOperations: push(3), push(1), push(1), pop(), getMin()\nQuery result: 1\nExplanation: Removing one occurrence of the minimum leaves the other occurrence in the\nstack.\nConstraints \u0026 guarantees\n• val: -2^31 through 2^31 - 1 (inclusive)\n• Total method calls: at most 3 * 10^4. pop, top, and getMin require a nonempty stack\nJavaScript starter\nclass MinStack {\n  constructor() { /* TODO */ }\n  push(val) { /* TODO */ }\n  pop() { /* TODO */ }\n  top() { /* TODO */ }\n  getMin() { /* TODO */ }\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/min-stack/) | — |
| <PracticeProblem id={227} title={"Basic Calculator II"} text={"Problem statement\nEvaluate a valid arithmetic expression containing nonnegative integer literals, spaces, and +, -, *,\n/. Multiplication and division take precedence over addition and subtraction. Division truncates\ntoward zero. Parentheses are not part of this grammar. Do not use eval or another expression\nevaluator.\nInput \u0026 expected result\nReturn the integer result. Intermediate values and the answer fit signed 32-bit integers.\nEXAMPLE 1\nInput: s = \"14 - 3 * 2 + 5 / 2\"\nOutput: 10\nExplanation: Multiplication gives 6 and division gives 2, so the result is 14 - 6 + 2.\nEXAMPLE 2\nInput: s = \"3 / 2\"\nOutput: 1\nExplanation: Integer division discards the fractional part.\nConstraints \u0026 guarantees\n• 1 \u003c= s.length \u003c= 3 * 10^5\n• s consists of integers and operators ('+', '-', '*', '/') separated by some number of spaces\n• The expression is syntactically valid\n• All the integers in the expression are non-negative integers in the range [0, 2^31 - 1]\n• The result fits a signed 32-bit integer\nJavaScript starter\nfunction calculate(s) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/basic-calculator-ii/) | — |
| <PracticeProblem id={394} title={"Decode String"} text={"Problem statement\nExpand an encoded string in which k[part] means k repetitions of part. Parts may contain nested\nencoded groups and ordinary lowercase letters. Numbers are repeat counts, never literal output\ncharacters. The input is syntactically valid.\nInput \u0026 expected result\nReturn the expanded string. The decoded result has at most 10^5 characters.\nEXAMPLE 1\nInput: s = \"2[a3[b]]\"\nOutput: \"abbbabbb\"\nExplanation: The inner group becomes bbb; the resulting abbb block is repeated twice.\nEXAMPLE 2\nInput: s = \"xy2[z]\"\nOutput: \"xyzz\"\nExplanation: Unencoded letters stay in place, followed by two copies of z.\nConstraints \u0026 guarantees\n• 1 \u003c= s.length \u003c= 30\n• s consists of lowercase English letters, digits, and square brackets '[]'\n• The encoding is valid\n• All the integers in s are in the range [1, 300]\nJavaScript starter\nfunction decodeString(s) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/decode-string/) | — |
| <PracticeProblem id={735} title={"Asteroid Collision"} text={"Problem statement\nAsteroids appear in array order from left to right. The absolute value gives size; a positive value\nmoves right and a negative value moves left. All move equally fast. When two meet, the smaller\ndisappears; equal sizes destroy both. Continue until no collisions remain.\nInput \u0026 expected result\nReturn surviving signed values in their original relative order. Asteroids moving apart never collide.\nEXAMPLE 1\nInput: asteroids = [6,2,-4]\nOutput: [6]\nExplanation: The -4 destroys 2, then is destroyed by 6.\nEXAMPLE 2\nInput: asteroids = [-3,5]\nOutput: [-3,5]\nExplanation: These asteroids move away from each other.\nConstraints \u0026 guarantees\n• 2 \u003c= asteroids.length \u003c= 10^4\n• -1000 \u003c= asteroids[i] \u003c= 1000\n• asteroids[i] != 0\nJavaScript starter\nfunction asteroidCollision(asteroids) {\n  // TODO: write your solution.\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/asteroid-collision/) | — |
| <PracticeProblem id={224} title={"Basic Calculator"} text={"Problem statement\nEvaluate a valid expression string s containing integers, spaces, plus, minus, and parentheses.\nParentheses change grouping, and unary minus may negate a number or parenthesized\nexpression; unary plus is not used. Return the integer result. Do not use eval or another built-in\nexpression evaluator. Intermediate and final values fit signed 32-bit integers.\nInput \u0026 expected result\nSpaces have no numerical meaning. Support multi-digit integers and nested parenthesized groups.\nThe grammar contains no multiplication or division; a minus sign can be a binary subtraction\noperator or a unary sign where the expression permits it.\nEXAMPLE 1\nInput: s = \"7 - (2 + 3) + 1\"\nOutput: 3\nExplanation: The parenthesized sum is 5, so the expression becomes 7 - 5 + 1, giving 3.\nEXAMPLE 2\nInput: s = \"-(8 - (3 + 1))\"\nOutput: -4\nExplanation: The inner sum is 4, the outer difference is 4, and the leading minus negates it.\nConstraints \u0026 guarantees\n• s.length: 1 through 3 * 10^5 (inclusive)\n• Alphabet: digits, +, -, (, ), spaces. Grammar is valid, with no adjacent operators\n• unary minus is allowed and unary plus is excluded. All literals and calculation results fit signed 32-bit\nintegers\nJavaScript starter\nfunction calculate(s) {\n  // TODO: write your solution.\n}"} /> | Hard | [LeetCode](https://leetcode.com/problems/basic-calculator/) | — |

{/* END GENERATED PRACTICE PROBLEMS */}

## References

- [Wikipedia](<https://en.wikipedia.org/wiki/Stack_(abstract_data_type)>)
- [YouTube](https://www.youtube.com/watch?v=wjI1WNcIntg&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=3&)

**Next:** [queues](../queue/README.md).
