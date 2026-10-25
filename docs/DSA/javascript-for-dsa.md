---
id: dsa-javascript-for-dsa
title: JavaScript for DSA and online judges
sidebar_label: JavaScript for problem solving
---

# JavaScript for DSA and online judges

A program is a list of instructions. **Data** means the values the program works with; an **algorithm** is a precise method for turning input into the required answer. This chapter teaches the JavaScript you need to start solving problems. You do not need browser, DOM, UI, promises, or asynchronous programming first.

Read the sections in order. Run each complete example in its own `lesson.mjs` file using `node lesson.mjs`. A **runtime**, such as Node.js, is the program that executes JavaScript. The [JavaScript fundamentals course](../javascript/fundamentals/README.md) gives extra practice if any step feels unfamiliar. Later chapters introduce data structures one at a time; there is no need to memorize them now.

## Learning steps

Use this chapter as your language toolkit. You will build small programs that accept values, follow rules, and return an answer.

1. Read values, names, comparisons, loops, and functions.
2. Learn arrays and references before Maps, Sets, and sorting.
3. Check number limits, then submit the same calculation in both judge formats.

## 1. Read a small program, symbol by symbol

Imagine four daily scores: 3, 7, 2, and 8. Count scores that are at least 5.

```js runnable
const scores = [3, 7, 2, 8];
let passingCount = 0;

for (let index = 0; index < scores.length; index++) {
  if (scores[index] >= 5) {
    passingCount = passingCount + 1;
  }
}

console.log(passingCount);
```

```text output
2
```

| Writing | Meaning and why it is needed |
| --- | --- |
| `const scores` | Give the name `scores` to a value. This name cannot later be assigned a different value. The array's contents can still change. |
| `let passingCount` | Create a name whose value may be replaced. The count changes as we read scores. |
| `=` | Assign the value on the right to the name on the left. It does **not** ask whether two things are equal. |
| `[3, 7, 2, 8]` | Make an array: an ordered list. Commas separate its values. |
| `scores[index]` | Read the value at position `index`. Positions start at 0, so position 0 contains 3. |
| `.length` | Ask the array how many items it contains. Four items have positions 0 through 3. |
| `for (...)` | Repeat the following block. Inside the parentheses: start once; test before each repeat; update after each repeat. |
| `index++` | Increase `index` by 1 after the block runs. Equivalent here to `index = index + 1`. |
| `<` and `>=` | Compare values: “less than” and “greater than or equal to.” A comparison gives `true` or `false`. |
| `if (...)` | Run the block only when its condition is true. |
| `{ ... }` | Group instructions into a block. Indentation makes the grouping easier to see. |
| `console.log(...)` | Display a value so we can inspect the result locally. Parentheses contain the value passed to this operation. |
| `;` | End an instruction. Write it consistently while learning. |

The array has both **positions** and **values**. They are different:

```text
position     0     1     2     3
          +-----+-----+-----+-----+
value     |  3  |  7  |  2  |  8  |
          +-----+-----+-----+-----+
            ^
       index starts here
```

We visit each position once. The count begins at 0. At position 0, 3 is too small, so the count stays 0. At position 1, 7 qualifies, so it becomes 1. At position 2, 2 does not qualify. At position 3, 8 qualifies, so the count becomes 2. Finally `index` becomes 4; `4 < 4` is false, and the loop stops. Using `index <= scores.length` would also visit position 4, which is outside this array.

Why is the answer right? Before each visit, `passingCount` counts exactly the qualifying scores at earlier positions. Processing one new score preserves that statement. Such a statement is called an **invariant**. When the loop ends, every score is an earlier score, so the count is the answer.

For `n` scores, the loop makes `n` visits: **O(n) time**, meaning work grows in proportion to `n`. The count and index need a fixed amount of extra storage: **O(1) auxiliary space**. The input array itself occupies O(n) space. Later, [the course map](./index.md) leads to a full complexity lesson.

## 2. Values, decisions, and functions

A **number** stores a quantity, a **string** stores text such as `"hello"`, and a **boolean** is `true` or `false`. Use `===` to test equality and `!==` to test inequality. `&&` means both conditions must be true; `||` means at least one must be true; `!` reverses true and false. Arithmetic uses `+`, `-`, `*`, `/`, and `%` (the remainder after division). For example, `7 % 2` is 1, so 7 is odd. JavaScript division is not integer division: `7 / 2` is 3.5.

A **function** is a named reusable set of instructions. A **parameter** is the local name for an input; an **argument** is the actual value supplied. `return` sends the answer back to the caller and ends that function call. Printing and returning are different: an online judge may need the returned value even if nothing is printed.

```js runnable
function countAtLeast(values, threshold) {
  let count = 0;
  for (const value of values) {
    if (value >= threshold) count++;
  }
  return count;
}

console.log(countAtLeast([3, 7, 2, 8], 5));
console.log(countAtLeast([], 5));
console.log(countAtLeast([-2, 0, 4], 0));
```

```text output
2
0
2
```

`for...of` visits values directly; use an index loop when positions matter. The empty array makes zero visits and correctly returns 0. The **contract** is what callers may supply and what they receive: here, an array of finite numbers and a finite threshold produce an integer count without changing the input. The same invariant as before proves correctness; time is O(n), auxiliary space O(1).

Learn [control flow](../javascript/flow-of-control.md), [loops](../javascript/loops.md), and [functions](../javascript/functions/README.md) before writing more complicated algorithms. A `while` loop repeats while a condition is true; ensure something moves the program toward stopping.

## 3. Arrays, strings, and references

An array is useful when position or order matters. `push(value)` appends, `pop()` removes the last value, and `slice()` makes a shallow copy. A string is text: read `word[0]`, inspect `word.length`, and extract `word.slice(start, end)`. The end position is excluded. Strings cannot be edited in place; build a new string or an array of characters, then `join("")`.

For lowercase English-letter problems, one array/string index corresponds to one letter. General Unicode text is different: JavaScript string indices count UTF-16 code units; `for...of` visits code points, which still may not be whole visible characters. Read the problem's character constraints before choosing a representation. See [strings](./strings/README.md) for algorithms and [string semantics](../javascript/strings-and-regular-expressions.md) for details.

A **reference** lets a name refer to an object such as an array. Assignment does not clone that object:

```text
original ---+
            |      +-----+-----+
alias ------+----> |  4  |  7  |   one shared array
                   +-----+-----+

                   +-----+-----+
copy ------------> |  4  |  7  |   another array
                   +-----+-----+
```

Both `original` and `alias` reach the same array. A change through either name is visible through the other. `copy` reaches a separate outer array.

```js runnable
const original = [4, 7];
const alias = original;
const copy = original.slice();
alias[0] = 9;
console.log(original.join(","));
console.log(copy.join(","));

const grid = Array.from({ length: 2 }, () => Array(3).fill(0));
grid[0][1] = 5;
console.log(JSON.stringify(grid));
```

```text output
9,7
4,7
[[0,5,0],[0,0,0]]
```

`Array.from` calls the function `() => Array(3).fill(0)` once per row, creating separate rows. An **arrow function** is another way to write a function; `()` means no parameters and the expression after `=>` supplies its return value. Avoid `Array(2).fill(Array(3).fill(0))`: both entries would reference the same row. A shallow copy copies only the outer array; nested objects are still shared. This matters when copying a grid or saving a backtracking answer. See [references and shallow copies](../javascript/spread-operator.md).

## 4. Choose an object, Map, or Set

Use an **object** for a record with named fields, such as `{ value: 8, next: null }`. A **field** is one named part of the record. `null` can mean “no next node”; `undefined` often means a value is missing. Objects and references will let us build [linked lists](./linked-list/README.md) and [trees](./trees/README.md).

Use a `Map` when keys identify values, such as a score and its frequency. A **frequency** is how many times something occurs. Use a `Set` when you only need to know whether a value has appeared. Unlike an ordinary object, `Map` does not turn all numeric keys into property-name strings and avoids inherited-property surprises.

```js runnable
const frequencies = new Map();
const seen = new Set();
for (const score of [4, 7, 4]) {
  const oldCount = frequencies.get(score) ?? 0;
  frequencies.set(score, oldCount + 1);
  seen.add(score);
}
console.log(frequencies.get(4));
console.log(seen.has(7), seen.size);
console.log(frequencies.has(9));
```

```text output
2
true 2
false
```

`new Map()` and `new Set()` create empty collections. `.get(key)` reads a value; `.set(key, value)` writes it; `.has(key)` checks membership. `?? 0` substitutes 0 only when the preceding result is `null` or `undefined`. `.size` counts stored entries. The first 4 creates a count of 1; 7 gets its own count; the second 4 updates the old count to 2. Each update preserves the number of occurrences seen so far.

Two separately created objects are different keys even if their fields match: `new Set([[1, 2], [1, 2]]).size` is 2. For grid coordinates, an integer such as `row * columnCount + column` is often a simpler key. Hash-table complexity in this course uses the usual average O(1) operation model, giving expected O(n) time to count `n` values and O(u) storage for `u` distinct values. ECMAScript does not promise worst-case O(1) `Map` operations. Continue with [hashing](./hashing/README.md).

## 5. Sort with the right comparison

JavaScript's default `sort()` compares text representations: `[2, 10, 3]` would become `[10, 2, 3]`. Supply a **comparator**, a function that tells sorting which of two values comes first. A negative result puts the first value earlier; a positive result puts it later; zero treats their order as equal.

```js runnable
const scores = [2, 10, 3];
const ordered = scores.slice().sort((first, second) => first - second);
console.log(ordered.join(","));
console.log(scores.join(","));

const tasks = [{ id: 2, cost: 5 }, { id: 1, cost: 5 }, { id: 3, cost: 2 }];
tasks.sort((first, second) => first.cost - second.cost || first.id - second.id);
console.log(tasks.map(task => task.id).join(","));
```

```text output
2,3,10
2,10,3
3,1,2
```

`sort()` changes its array; `slice()` protected the original scores. In the second comparator, a nonzero cost difference decides; otherwise `||` uses the ID difference to break the tie. `.map(...)` builds a new array by transforming each item. Do not return a boolean such as `first > second`: that cannot distinguish “earlier” from “equal.” For arbitrary BigInts, use `(a, b) => a < b ? -1 : a > b ? 1 : 0`; a comparator must return a Number. The `condition ? yes : no` expression chooses between two values.

Sorting once is often useful before [two pointers](./two-pointers/README.md) or [greedy algorithms](./greedy/README.md). A heap is usually better when values keep arriving and you repeatedly need the next minimum. JavaScript does not specify a single built-in sorting algorithm or complexity; state the comparison-sort assumption used in your analysis. Our own merge-sort chapter gives a guaranteed O(n log n) algorithm.

## 6. Make the numbers safe

JavaScript `Number` represents every integer from `-(2 ** 53 - 1)` through `2 ** 53 - 1` exactly. `**` means exponentiation. Above this safe range, distinct integers can become the same stored Number. Check the largest **intermediate** value, not just the final answer. For instance, multiplying two numbers near a billion can lose precision before taking a remainder.

Use `BigInt` for exact larger integers. Write `123n`, or parse a string with `BigInt(token)`. Do not first parse an unsafe integer with `Number` and then convert: the original digits may already be lost. Arithmetic cannot mix Number and BigInt; convert intentionally. BigInt division truncates toward zero and it has no fractional values. [ECMAScript specifies these numeric operations](https://tc39.es/ecma262/multipage/numbers-and-dates.html).

```js runnable
const maximumSafe = Number.MAX_SAFE_INTEGER;
console.log(maximumSafe + 1 === maximumSafe + 2);

const first = BigInt("1000000006");
const second = BigInt("1000000006");
const modulus = 1000000007n;
console.log(((first * second) % modulus).toString());
console.log((7n / 2n).toString());
console.log(((-3n % 5n) + 5n) % 5n === 2n);
```

```text output
true
1
3
true
```

The first output is a warning demonstrated as code: two intended integers collided. The product in the second calculation stays exact because both operands are already BigInts. Print `.toString()` for judge output, without the `n` suffix. `%` is a remainder and may be negative; `(value % modulus + modulus) % modulus` normalizes it for a positive modulus. BigInt operations cost more as the number of digits grows; do not call arbitrarily large arithmetic O(1). See [number theory](./math/README.md) for modular algorithms.

Number bitwise operators normally convert inputs to **32-bit signed integers**. A bit is a binary digit, 0 or 1. `&` compares bits with AND, `|` with OR, `^` with XOR, and `<<` shifts bits left. These symbols are not ordinary arithmetic replacements. `^` does **not** mean power. Number shift counts are reduced modulo 32, so `1 << 32` is 1, not 2 to the power 32. `>>>` gives an unsigned 32-bit result; it still cannot represent an arbitrary large bit mask. BigInt bitwise operations can represent larger masks, but do not support `>>>`.

```js runnable
console.log(1 << 31, 1 << 32);
console.log(2 ** 32);
console.log((1n << 40n).toString());
console.log(Math.floor(7 / 2));
```

```text output
-2147483648 1
4294967296
1099511627776
3
```

Use `Math.floor` for nonnegative integer division, not `| 0` or a shift. Learn the actual bit patterns in [bit manipulation](./bit-manipulation/README.md) before using masks in advanced dynamic programming.

## 7. Know the practical costs

| Operation or habit | What to remember |
| --- | --- |
| Indexed array read/write | O(1) in the usual dense-array model used by this course. |
| `push` / `pop` | Suitable for a stack; append has amortized O(1) cost in that model. |
| Repeated `shift()` / `unshift()` | May move or reindex many elements. Do not assume O(1) per operation. |
| `slice`, spread `[...values]`, or `map` | Visit/copy O(n) items and allocate an O(n) result. |
| `includes` on an unsorted array | May scan all n values. For repeated membership checks, consider `Set`. |
| Deep recursive calls | Can exceed the runtime's call-stack limit; there is no portable safe depth. |
| `Math.max(...hugeArray)` | May exceed the function-argument limit. Use a loop for large inputs. |

For a one-pass breadth-first search, append with `push()` and read with a moving `head` index. If a queue lives for a long time, also release consumed references and reuse or compact storage: the [queue chapter](./queue/README.md) implements this. For selecting minima or maxima repeatedly, the [heap chapter](./heap/README.md) supplies a complete heap; a specific judge's optional library is not assumed.

**Recursion** means a function calls itself on a smaller problem. Learn it after ordinary functions and loops. A chain-shaped tree with 100,000 nodes can require 100,000 nested calls; use an explicit array stack or queue when constraints allow such depth. A balanced tree is much shallower. The [recursion](./recursion/README.md) and [graph traversal](./graphs/README.md) chapters explain how to preserve the algorithm's state when replacing recursion.

## 8. Submit the same idea in two environments {/* #online-judges */}

An online judge runs your code on many inputs. A sample helps explain the task; passing it alone does not prove correctness. Read the required function signature or input format, bounds, and output format before coding. The examples below use a small teaching problem: count scores at least a threshold. Match the actual problem's interface when submitting.

### LeetCode-style function

The judge supplies arguments and checks your return value. Submit the function in section 2, with the exact name and parameters the problem requests. Local `console.log` calls are demonstrations, not the returned answer. Linked-list/tree questions may supply node classes; use the provided definitions.

### CodeChef-style input and output

Suppose the input format is: test-case count `T`, followed for each case by `N threshold`, then `N` scores. A **test case** is one independent instance. Whitespace separates tokens, so line breaks and extra spaces do not affect this numeric format.

```text
2
4 5
3 7 2 8
3 0
-2 0 4
```

First read 2 cases. In case 1, `N = 4` and `threshold = 5`; consume exactly four scores and output 2. In case 2, consume three scores and output 2. Reset the count for each case. The function below takes the entire input text and returns the entire output text:

```js runnable
function solve(input) {
  if (input.trim() === "") return "";
  const tokens = input.trim().split(/\s+/);
  let position = 0;
  const testCases = Number(tokens[position++]);
  const answers = [];

  for (let caseIndex = 0; caseIndex < testCases; caseIndex++) {
    const length = Number(tokens[position++]);
    const threshold = Number(tokens[position++]);
    let count = 0;
    for (let index = 0; index < length; index++) {
      const score = Number(tokens[position++]);
      if (score >= threshold) count++;
    }
    answers.push(String(count));
  }
  return answers.join("\n");
}

console.log(solve("2\n4 5\n3 7 2 8\n3 0\n-2 0 4\n"));
console.log(JSON.stringify(solve("   ")));
```

```text output
2
2
""
```

`trim()` removes whitespace at the ends; the empty-input check avoids treating an empty string as a number. `split(/\s+/)` separates on one or more whitespace characters. `Number(...)` converts a numeric token. `position++` reads the old position and then advances it. `answers.join("\n")` puts a newline between answers. This parser assumes the stated valid input format and safe integer bounds. It does not handle text fields containing spaces; such tasks need line-based parsing. Parse unsafe integer tokens directly as BigInt instead.

For a complete **Node.js CommonJS submission**, place this adapter below `solve` in a file named `solution.cjs`; omit the demonstration `console.log` calls. This is the filesystem-dependent environment wrapper, separate from the checked pure example above:

```js
const fs = require("node:fs");
const input = fs.readFileSync(0, "utf8");
process.stdout.write(solve(input));
```

File descriptor `0` is standard input. `"utf8"` reads text; `process.stdout.write` sends the answer to standard output. Run locally with `node solution.cjs < input.txt`. Select the platform's Node.js language entry and follow its module conventions; runtime versions and available packages can change. The [official Node.js file-reading API](https://nodejs.org/api/fs.html#fsreadfilesyncpath-options) documents this adapter.

If the input text has `L` characters, tokenizing costs O(L) time and O(L) extra space; counting is O(N) over all scores. Collecting outputs avoids printing inside a large inner loop. For very large inputs under a tight memory limit, replace the token array with a scanner that advances through the original string; optimize only after estimating this memory cost.

## 9. Check understanding before moving on

Try each exercise first. Write the predicted output or a short explanation, then run your own example.

1. **Read:** Why is `index < values.length` correct, while `index <= values.length` usually is not?
2. **Trace:** For `countAtLeast([5, 5, 1], 5)`, write the count after every visit.
3. **Fix:** A numeric sort returns `1, 10, 2`. What argument is missing? Does adding it preserve the original array?
4. **Explain:** Why can changing `alias[0]` change an array declared with `const`?
5. **Build:** Write `sumEven(values)`, returning the sum of even safe integers. Assume the total remains safe. Test empty input, negative numbers, and no even values.
6. **Transfer:** Adapt the input solver to output the sum of even values in each test case, where each case now contains only `N` and its `N` values.
7. **Reason:** A task asks for `(a * b) % 1000000007`, with `a` and `b` near one billion. Why may Number arithmetic fail even though the answer is small?

<details>
<summary>Hints</summary>

The last valid position is length minus one. Equal to the threshold still qualifies. A comparator must distinguish earlier/equal/later. `const` protects the name, not the object's contents. A number is even when its remainder on division by 2 is zero. Keep parsing separate from the function that computes one answer. Rounding can happen before `%` runs.

</details>

<details>
<summary>Answers and a complete exercise solution</summary>

1. A length-n array has positions 0 through n−1; position n is outside it. An empty array should make zero visits.
2. The counts are 1, 2, 2; the final answer is 2.
3. Supply `(a, b) => a - b`. `sort` still mutates its array; copy first when required.
4. Both names refer to one array. `const` stops assigning a different array to the name, not changing an element.
5. The invariant is: `total` is the sum of even values already visited. One visit either adds exactly the next even value or leaves the sum unchanged. Time O(n), auxiliary space O(1):

```js runnable
function sumEven(values) {
  let total = 0;
  for (const value of values) {
    if (value % 2 === 0) total += value;
  }
  return total;
}
console.log(sumEven([]));
console.log(sumEven([-4, 3, 6]));
console.log(sumEven([1, 5]));
```

```text output
0
2
0
```

6. Consume exactly `N` values per case and reset the sum. Here is the complete pure solver:

```js runnable
function solveEvenSums(input) {
  if (input.trim() === "") return "";
  const tokens = input.trim().split(/\s+/);
  let position = 0;
  const testCases = Number(tokens[position++]);
  const answers = [];
  for (let caseIndex = 0; caseIndex < testCases; caseIndex++) {
    const length = Number(tokens[position++]);
    let total = 0;
    for (let index = 0; index < length; index++) {
      const value = Number(tokens[position++]);
      if (value % 2 === 0) total += value;
    }
    answers.push(String(total));
  }
  return answers.join("\n");
}
console.log(solveEvenSums("3\n0\n3\n-4 3 6\n2\n1 5\n"));
```

```text output
0
2
0
```

7. The intermediate product can be near 10 to the power 18, beyond the safe integer range. Use BigInt for both operands before multiplying and for the modulus.

</details>

You are ready to continue when you can explain and modify these programs without copying them line for line. Next, use [school-level problems](./school-basics/README.md) to practice translating a sentence into inputs, steps, and an answer, then follow the [DSA learning sequence](./index.md).

## Language scope and references

This path uses established JavaScript features, including ES2015 `let`, `const`, arrow functions, `Map`, and `Set`; ES2020 BigInt and `??` are used where they solve a real problem. A new language edition is not a prerequisite for harder algorithms. Check the judge's runtime before using newer APIs; this repository's checker reports its own Node version separately.

For the language rules, see the [ECMAScript 2025 annual specification](https://262.ecma-international.org/16.0/), the [current indexed-collection definitions](https://tc39.es/ecma262/multipage/indexed-collections.html), and the [course compatibility guide](../javascript/compatibility.md). Browser, DOM, UI, network, and asynchronous lessons remain in the broader [JavaScript course](../javascript/index.md) as optional study outside this DSA path.

**Next:** [counting work and memory](./complexity.md).
