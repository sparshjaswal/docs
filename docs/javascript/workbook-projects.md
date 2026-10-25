---
title: 'Workbook projects: expenses and word counts'
sidebar_label: 'Workbook projects'
---

# Workbook projects: expenses and word counts

These two projects connect small lessons into useful programs. The expense summary adds up records by category. The word-frequency report counts repeated words in text. Both start with a clear input and an expected result.

1. Review [functions](./functions/README.md), [arrays](./arrays/index.md), [Map](./collections-and-iteration.md), [text processing](./strings-and-regular-expressions.md), and [testing](./testing-guide.md) as needed.
2. Read the requirements and trace the small example by hand.
3. Write your own version before opening the reference implementation.
4. Run the assertions, then change an input and explain the result.

These projects extend the [workbook](./workbook.md). A **contract** states the inputs allowed and outputs required. Save a complete example as a `.mjs` file and run it with Node. A printed result shows one case; the assertions check the stated requirements.

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](./index.md#interview-preparation).

### 1. How should a word-frequency report break ties predictably?

<details>
<summary>Answer and worked example</summary>

State the tie rule explicitly. Here input tokens are already lowercase ASCII words: sort by descending count, then ascending word, and leave the input array unchanged.

```js runnable
function rankWords(words) {
  const counts = new Map();
  for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1);
  return [...counts].sort(([a, ac], [b, bc]) =>
    bc - ac || (a < b ? -1 : a > b ? 1 : 0));
}
console.log(JSON.stringify(rankWords(['b', 'a', 'b', 'a', 'c'])));
console.log(JSON.stringify(rankWords([])));
```

**Expected output**

```text output
[["a",2],["b",2],["c",1]]
[]
```

Encounter order puts b before a in the Map, but the explicit tie comparator puts a first. Under average constant-time Map access, counting takes O(n) operations and sorting k distinct tokens commonly takes O(k log k) comparisons; string lengths also affect cost.

</details>

### 2. What additional requirements would turn this example into the full project solution?

**Apply it:** Turn the word-frequency snippet into a testable specification before writing the rest of the project.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

Define tokenization and case normalization, validate the result limit even for empty text, preserve the exact tie rule, and check invalid and boundary inputs. For the expense project, also specify integer units, category identity, safe accumulation, and nonmutation. Clarifying a contract is part of the interview answer.

First choose token boundaries and case normalization, define whether punctuation or accents distinguish words, and state whether ties use a fixed lexical rule or a particular locale’s collation. The comparator must implement that chosen rule rather than rely on default sort behavior accidentally matching a few examples.

Use these cases to challenge the contract:

| Input case | What the test should establish |
| --- | --- |
| Empty text and a valid limit | Returns no entries |
| Empty text and an invalid limit | Still rejects the invalid argument; early return must not skip validation |
| Repeated words with case differences | Follows the declared normalization policy |
| Equal counts in a different input order | Follows the declared tie-break rule |
| Limit zero or larger than the number of words | Follows the declared limit policy without inventing entries |

For the expense report, separately test safe integer accumulation, zero amounts, invalid categories, and input nonmutation. A polished output on one sample does not establish either project’s boundary behavior; use the full contracts earlier in this lesson.

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **Project 1 — Build an expense summary.** | **Must fix** | [Input rules and expected result](#expense-summary) | [Worked example and checks](#expense-summary) |
| **Project 2 — Build a word-frequency report.** | **Must fix** | [Input rules and expected result](#word-frequency) | [Worked example and checks](#word-frequency) |

## Expense summary {/* #expense-summary */}

Implement `summarizeExpenses(expenses)`. The input is an array of records with `category` and `amountCents`; return `{ totalCents, byCategory }` without changing the input.

| Rule           | Required behavior                                                           |
| -------------- | --------------------------------------------------------------------------- |
| Category       | A string with some non-whitespace content; preserve its spelling as the key |
| Amount         | A nonnegative safe integer; zero is valid                                   |
| Empty input    | Return `{ totalCents: 0, byCategory: {} }`                                  |
| Invalid record | Throw an error                                                              |
| Accumulation   | Use a Map, then build the result with `Object.fromEntries`                  |
| Overflow       | Throw if the running total exceeds the safe-integer range                   |

`"food"` and `" food "` are distinct categories under this contract. Trimming for an emptiness check does not authorize normalization. Integer cents make this an integer exercise; currency conversion, refunds, and rounding policies require separate requirements.

### Trace the accumulation

| Record      | Running total | Food total | Travel total |
| ----------- | ------------: | ---------: | -----------: |
| food, 250   |           250 |        250 |       absent |
| travel, 500 |           750 |        250 |          500 |
| food, 150   |           900 |        400 |          500 |

**Invariant:** after each accepted record, the running total is the sum of all accepted amounts and each map entry is its category's subtotal. All amounts are nonnegative, so no category subtotal exceeds the running total. Checking that total also bounds every subtotal.

<details>
<summary>Reference implementation and acceptance checks</summary>

```js runnable
import assert from 'node:assert/strict';

function summarizeExpenses(expenses) {
  let totalCents = 0;
  const categories = new Map();
  for (const expense of expenses) {
    if (
      expense === null ||
      typeof expense !== 'object' ||
      typeof expense.category !== 'string' ||
      expense.category.trim() === '' ||
      !Number.isSafeInteger(expense.amountCents) ||
      expense.amountCents < 0
    ) {
      throw new TypeError('Invalid expense');
    }
    const { category, amountCents } = expense;
    if (amountCents > Number.MAX_SAFE_INTEGER - totalCents) {
      throw new RangeError('Total exceeds safe-integer range');
    }
    totalCents += amountCents;
    categories.set(category, (categories.get(category) ?? 0) + amountCents);
  }
  return { totalCents, byCategory: Object.fromEntries(categories) };
}

const input = [
  { category: 'food', amountCents: 250 },
  { category: 'travel', amountCents: 500 },
  { category: 'food', amountCents: 150 },
];
const snapshot = structuredClone(input);
assert.deepEqual(summarizeExpenses(input), {
  totalCents: 900,
  byCategory: { food: 400, travel: 500 },
});
assert.deepEqual(input, snapshot);
assert.deepEqual(summarizeExpenses([]), { totalCents: 0, byCategory: {} });
assert.deepEqual(summarizeExpenses([{ category: 'free', amountCents: 0 }]), {
  totalCents: 0,
  byCategory: { free: 0 },
});
for (const amountCents of [-1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
  assert.throws(() => summarizeExpenses([{ category: 'food', amountCents }]));
}
for (const expense of [null, undefined, {}, { category: ' ', amountCents: 0 }]) {
  assert.throws(() => summarizeExpenses([expense]));
}
assert.throws(
  () =>
    summarizeExpenses([
      { category: 'a', amountCents: Number.MAX_SAFE_INTEGER },
      { category: 'b', amountCents: 1 },
    ]),
  RangeError,
);
const special = summarizeExpenses([{ category: '__proto__', amountCents: 1 }]);
assert.equal(Object.hasOwn(special.byCategory, '__proto__'), true);
assert.equal(special.byCategory.__proto__, 1);
assert.equal(Object.getPrototypeOf(special.byCategory), Object.prototype);
console.log(JSON.stringify(summarizeExpenses(input)));
console.log('expense boundaries and input preservation checked');
```

```text output
{"totalCents":900,"byCategory":{"food":400,"travel":500}}
expense boundaries and input preservation checked
```

</details>

The overflow check happens before addition. `Object.fromEntries` creates own data properties, so an arbitrary category such as `__proto__` remains a key; the test guards against replacing this with unsafe assignment to a normal object. The error subclasses add detail while satisfying the workbook's requirement to throw an Error.

Under average constant-time Map access and bounded category-label costs, the pass takes O(n) time and O(k) extra storage for n records and k categories. Include string processing costs when labels are unbounded.

**Extend it:** specify whether categories should be normalized, then add a test distinguishing the old and new policy. Do not change normalization silently.


## Word frequency report {/* #word-frequency */}

Implement `topWords(text, limit)`. The input text is a string. Lowercase it, treat each maximal sequence of ASCII letters `a` through `z` as a word, and return at most `limit` objects containing `word` and `count`.

Sort by count descending; break ties by the lowercase word in ascending order. Validate `limit` as a nonnegative integer even when the input has no words. An invalid limit throws `RangeError`; zero or no words returns `[]`.

| Input fragment | Tokens under this contract |
| -------------- | -------------------------- |
| `JavaScript!`  | `javascript`               |
| `code42test`   | `code`, `test`             |
| `don't`        | `don`, `t`                 |
| `123 !`        | none                       |

This tokenizer deliberately does not handle natural language generally. Unicode words and contractions need different rules. The contract lowercases **before** matching; it does not first reject every non-ASCII input character.

### Separate counting from ranking

For `"B a b A"`, the counts become `b: 2` and `a: 2`. Insertion order puts `b` first, but the tie rule requires `a` first. Count every token before sorting and applying the limit; a word encountered late may be the most frequent.

<details>
<summary>Reference implementation and acceptance checks</summary>

```js runnable
import assert from 'node:assert/strict';

function topWords(text, limit) {
  if (!Number.isInteger(limit) || limit < 0) {
    throw new RangeError('limit must be a nonnegative integer');
  }
  if (limit === 0) return [];
  const tokens = text.toLowerCase().match(/[a-z]+/g) ?? [];
  const counts = new Map();
  for (const word of tokens) counts.set(word, (counts.get(word) ?? 0) + 1);
  return [...counts]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || (a.word < b.word ? -1 : a.word > b.word ? 1 : 0))
    .slice(0, limit);
}

const report = topWords('JavaScript is fun. JavaScript is useful!', 3);
assert.deepEqual(report, [
  { word: 'is', count: 2 },
  { word: 'javascript', count: 2 },
  { word: 'fun', count: 1 },
]);
assert.deepEqual(topWords('B a b A', 2), [
  { word: 'a', count: 2 },
  { word: 'b', count: 2 },
]);
assert.deepEqual(
  topWords("don't code42test", 10).map((item) => item.word),
  ['code', 'don', 't', 'test'],
);
assert.deepEqual(topWords('123 !', 3), []);
assert.deepEqual(topWords('', 3), []);
assert.deepEqual(topWords('word', 0), []);
assert.deepEqual(topWords('word', 10), [{ word: 'word', count: 1 }]);
for (const limit of [-1, 0.5, NaN, Infinity, '2']) {
  assert.throws(() => topWords('', limit), RangeError);
}
console.log(JSON.stringify(report));
console.log('tokenization, ties, empty input, and limits checked');
```

```text output
[{"word":"is","count":2},{"word":"javascript","count":2},{"word":"fun","count":1}]
tokenization, ties, empty input, and limits checked
```

</details>

The no-match result is `null`, so `?? []` gives the loop a consistent iterable. The comparator's second branch makes ties independent of insertion order. For these lowercase ASCII tokens, direct string comparison also avoids a locale-dependent sorting rule.

Scanning m code units takes O(m) work under this simple tokenizer. Ranking k distinct tokens commonly requires O(k log k) comparisons, with additional work to compare strings. Storage includes the lowercased text, tokens, count map, and returned records. A heap is a possible extension for a large vocabulary and small limit; first preserve the exact same ranking contract.


## Review your solution

Explain one invariant, one rejected input, one test that would catch a plausible mistake, and one assumption behind the complexity estimate. Then continue to the [reading-list and dashboard projects](./projects.md) to connect pure transformations to browser lifecycles.
