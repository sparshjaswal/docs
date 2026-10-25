---
title: "Strings, Unicode, and regular expressions"
sidebar_label: "Strings and regular expressions"
---

# Strings, Unicode, and regular expressions

A string is text, such as a student's name or a search query. Start with everyday operations: trim extra spaces, check whether text contains a word, and split a sentence into parts. String methods return new strings rather than editing the original.

1. Use ordinary string methods for literal text operations.
2. Learn a **regular expression**, or regex, when you need to describe a pattern such as a sequence of digits.
3. Test one matching and one nonmatching input before adding more rules.
4. Return to Unicode, capture groups, flags, and performance after the basics.

Read values, loops, functions, and then arrays. JavaScript strings store UTF-16 code units; one visible character does not always occupy one unit. The Unicode section explains this when you need to count or split user-visible text.

## Choose the simplest text operation

| Need | API and edition | Behavior to remember |
| --- | --- | --- |
| Read a position | `charAt`, `[]`; `at` (2022) | `at(-1)` counts from the end; each reads a code unit |
| Extract text | `slice`, `substring` | `slice` supports negative offsets; endpoints exclude the end |
| Find literal text | `indexOf`; `includes`, `startsWith`, `endsWith` (2015) | Case-sensitive; search position affects the result |
| Build text | `concat`, `join`; templates, tags, `String.raw`, `repeat` (2015) | Templates interpolate; raw templates retain escape spelling |
| Align a label | `padStart`, `padEnd` (2017) | Length is a target, not a maximum; padding may be truncated |
| Remove edge whitespace | `trim`; `trimStart`, `trimEnd` (2019) | Interior whitespace stays; `trimLeft`/`trimRight` are aliases |
| Replace text | `replace`; `replaceAll` (2021) | A string search is literal; a regex passed to replaceAll needs `g` |
| Split or enumerate matches | `split`, `match`, `search`; `matchAll` (2020) | matchAll yields captures and indices instead of only matched text |
| Handle Unicode | `codePointAt`, `fromCodePoint`, `normalize`, string iteration (2015) | Code points and user-perceived characters differ |
| Repair UTF-16 | `isWellFormed`, `toWellFormed` (2024) | Detect/replace lone surrogates; not accent normalization |

```js runnable
const label = '  lesson-7  '.trim();
console.log(label.startsWith('lesson'));
console.log(label.slice(-1).padStart(3, '0'));
console.log(label.replaceAll('-', ' '));
console.log('x.x'.replaceAll('.', () => '$&'));
```

```text output
true
007
lesson 7
x$&x
```

A replacement **string** interprets tokens such as `$&` (the match) and `$1` (a capture). A replacement function's return value is inserted literally. Use a callback when replacement text comes from input and dollar sequences should stay unchanged.

## Code units, code points, and graphemes

```js runnable
const face = '😀';
const decomposed = 'e\u0301';
console.log(face.length, [...face].length);
console.log(face.codePointAt(0).toString(16));
console.log(String.fromCodePoint(0x1f600) === face);
console.log(decomposed === 'é', decomposed.normalize('NFC') === 'é');
console.log([...decomposed].length);
```

```text output
2 1
1f600
true
false true
2
```

`length`, indexing, slicing, and regex match offsets count UTF-16 units. `for...of` and spread follow code points, preserving a surrogate pair. A displayed grapheme may contain several code points, such as an accented letter or a joined emoji. Use [Intl.Segmenter](./dates-and-internationalization.md) for user-visible boundaries; spreading a string is not a general character counter.

Normalization has NFC/NFD (canonical) and NFKC/NFKD (compatibility) forms. Compatibility normalization can erase meaningful distinctions. Choose a policy for search keys separately from display text and identifiers. Locale-aware case conversion and collation also require an explicit locale policy.

```js runnable requires=String.prototype.toWellFormed
const broken = '\uD800';
console.log(broken.isWellFormed());
console.log(broken.toWellFormed().codePointAt(0).toString(16));
console.log('é'.isWellFormed());
```

```text output
false
fffd
true
```

The replacement character U+FFFD repairs invalid surrogate structure. It cannot recover the missing original character. Validate before repair when data loss must be reported. [Well-formed Unicode proposal](https://github.com/tc39/proposal-is-usv-string).

## Regular expression foundations

Use a regex when the input has a pattern: alternatives, repeated tokens, or captures. A literal such as `/^book-\d+$/` avoids string escaping. With `new RegExp('^book-\\d+$')`, both the JavaScript string and the regex grammar interpret escapes.

| Construct | Meaning |
| --- | --- |
| `^`, `$` | Start/end assertions; `m` also recognizes line boundaries |
| `[a-z]`, `[^0-9]` | A character class and its negation |
| `.`, `\d`, `\s`, `\w` | A general character, digit, whitespace, word-character shortcut; `\w` is not a universal alphabet |
| `*`, `+`, `?`, `{2,4}` | Repetition; a following `?` makes a quantifier lazy |
| `(x)`, `(?:x)`, `(?<name>x)` | Capturing, noncapturing, and named capturing groups |
| `(?=x)`, `(?!x)` | Positive/negative lookahead without consuming x |
| `(?<=x)`, `(?<!x)` | Positive/negative lookbehind (2018) |
| `\1`, `\k<name>` | Backreferences to matched capture text |

`exec` returns a match record or `null`; `test` returns a boolean. Always handle the no-match case. Without `m`, JavaScript anchors match the input boundaries; with `m`, they also match line boundaries. A whole-input validator should not accidentally enable multiline matching and accept only one valid line from a larger input.

## Flags and their interactions

| Flag | Purpose | Edition |
| --- | --- | --- |
| `g` | Global search; `exec`/`test` update lastIndex | Earlier JavaScript |
| `i` | Case-insensitive matching | Earlier JavaScript |
| `m` | Change the meaning of line anchors | Earlier JavaScript |
| `u` | Unicode-aware parsing and code point matching | 2015 |
| `y` | Sticky match beginning exactly at lastIndex | 2015 |
| `s` | Let dot match line terminators | 2018 |
| `d` | Include start/end indices for captures | 2022 |
| `v` | Unicode sets, set operations, and string properties | 2024 |

`flags` (2015) reports the enabled flags; `u` and `v` cannot appear together. `s` and `m` solve different problems. Even in Unicode modes, match indices still use UTF-16 offsets.

```js runnable
const token = /\d+/y;
token.lastIndex = 2;
console.log(token.exec('id42!')[0], token.lastIndex);
console.log(token.exec('id42!'), token.lastIndex);
const repeated = /a/g;
console.log(repeated.test('a'), repeated.test('a'));
console.log(/^book-\d+$/.test('book-7\n'), /^book-\d+$/m.test('book-7\n'));
```

```text output
42 4
null 0
true false
false true
```

Reuse of a global/sticky regex can accidentally make validation stateful. Use a nonglobal pattern for independent boolean checks, reset state deliberately, or use matchAll for traversal.

### Use sticky matching when gaps are errors {/* #sticky-scanner */}

A global search can skip ahead to the next match. A sticky regex must match at `lastIndex`; this makes it useful for a scanner that must account for every input character. The following toy grammar accepts unsigned integer tokens, plus signs, and whitespace. It tokenizes; it does not validate arithmetic grammar or evaluate expressions.

```js runnable
function scan(source) {
  const pattern = /\s+|(?<integer>\d+)|(?<plus>\+)/y;
  const tokens = [];
  let offset = 0;
  while (offset < source.length) {
    pattern.lastIndex = offset;
    const match = pattern.exec(source);
    if (!match) throw new SyntaxError(`Unexpected character at ${offset}`);
    offset = pattern.lastIndex;
    if (match.groups.integer !== undefined) tokens.push(`integer:${match[0]}`);
    else if (match.groups.plus !== undefined) tokens.push('plus');
  }
  return tokens;
}
console.log(scan('12 + 3').join(', '));
console.log(scan('').length);
try { scan('12 ? 3'); }
catch (error) { console.log(error.message); }
```

```text output
integer:12, plus, integer:3
0
Unexpected character at 3
```

Each alternative consumes at least one character, so a successful match advances the loop. Keep `offset` separately because a failed sticky match resets the regex's `lastIndex` to zero. A `g` search could skip the question mark and find the later integer, silently hiding malformed input. Named groups identify the token without depending on capture numbers. [RegExp execution rules](https://tc39.es/ecma262/2024/multipage/text-processing.html#sec-regexpbuiltinexec).

**Try it:** tokenize `12 ++ 3`. The scanner accepts its characters; a separate parser must reject the missing operand. Explain why lexical validity and expression validity are different checks, and why allowing an empty regex alternative could stop this scanner from advancing.

## Captures, lookbehind, and match indices

```js runnable
const record = /^(?<kind>[A-Z]+)-(?<id>\d+)$/d.exec('BOOK-27');
console.log(record.groups.kind, record.groups.id);
console.log(JSON.stringify(record.indices.groups.id));
console.log('USD 12 EUR 9'.match(/(?<=USD )\d+/)[0]);
console.log([... 'a:2 b:3'.matchAll(/(?<key>\w):(?<value>\d)/g)]
  .map(match => match.groups.key).join(', '));
```

```text output
BOOK 27
[5,7]
12
a, b
```

Named captures and lookbehind arrived in 2018; matchAll in 2020; match indices in 2022. The end index is exclusive, so `text.slice(start, end)` extracts a capture. Positive/negative lookbehind asserts surrounding context without putting that context in the match.

## Unicode properties and sets

ES2018 property escapes such as `\p{Letter}` and `\P{Number}` require `u` or `v`. ES2024 `v` adds class intersection (`&&`), subtraction (`--`), and finite strings, including Unicode properties of strings. Do not guess that `[A-Z]` covers all letters.

```js runnable
console.log(/^\p{Letter}+$/u.test('café'));
const nonAsciiLetters = /[\p{Letter}--\p{ASCII}]/v;
console.log(nonAsciiLetters.test('é'), nonAsciiLetters.test('e'));
console.log(/^\p{RGI_Emoji}$/v.test('😀'));
```

```text output
true
true false
true
```

A `v` set can also contain literal string alternatives using `\q{...}`. Nest sets to express combined operations instead of mixing operators ambiguously. [Unicode set notation proposal](https://github.com/tc39/proposal-regexp-v-flag).

## Literal escaping and scoped matching

ES2025 `RegExp.escape` produces a literal pattern fragment, including cases a handwritten “escape punctuation” regex can miss. This is unrelated to HTML escaping or sanitizing an entire regex supplied by a user.

```js runnable requires=RegExp.escape
const query = 'a+b';
const pattern = new RegExp(`^${RegExp.escape(query)}$`);
console.log(pattern.test('a+b'), pattern.test('aaab'));
```

```text output
true false
```

ES2025 modifiers enable or disable `i`, `m`, and `s` within a group. Duplicate named capture groups are permitted in separate alternatives where the grammar allows them; two captures with the same name on the same matching path remain invalid. These examples need a runtime implementing both syntax additions:

```js runnable
const label = /^(?i:book)-[A-Z]+$/;
console.log(label.test('BOOK-ABC'), label.test('book-abc'));
const number = /^(?:A(?<id>\d+)|B(?<id>\d+))$/;
console.log(number.exec('B27').groups.id);
```

```text output
true false
27
```

See the [modifier proposal](https://github.com/tc39/proposal-regexp-modifiers) and [duplicate-name proposal](https://github.com/tc39/proposal-duplicate-named-capturing-groups). Unsupported regex literals can fail when the file is parsed; check your target before shipping.

## Regex is a program with a cost

Ambiguous nested repetitions may explore many paths on failing input. Keep patterns simple, bound untrusted input length, and test long near-misses. Escaping a literal removes its pattern meaning; it does not fix an expensive surrounding pattern. Use a parser for nested language syntax, and URL/HTML parsers for their respective formats.

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](./index.md#interview-preparation).

### 1. Does spreading a string count user-visible characters?

<details>
<summary>Answer and worked example</summary>

Spread iterates Unicode code points, while string.length counts UTF-16 code units. A grapheme can contain multiple code points, so neither count universally equals visible characters.

```js runnable
const face = '😀';
const accent = 'é';
console.log(face.length, [...face].length);
console.log(accent.length, [...accent].length);
console.log(accent === 'é', accent.normalize('NFC') === 'é');
```

**Expected output**

```text output
2 1
2 2
false true
```

The emoji occupies a surrogate pair. The accented text contains a base letter and combining mark; NFC converts this example to its canonically composed form.

</details>

### 2. Why can consecutive test calls on the same global regex disagree?

**Apply it:** Trace both the Boolean result and lastIndex when reusing a global regex for three independent checks.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

A regex with g or y updates lastIndex. Reusing it for independent validation can therefore start at a different position. Use a nonglobal pattern for independent yes/no checks, reset state deliberately, or use matchAll for traversal. Use Intl.Segmenter when grapheme boundaries are required.

Observe the mutable cursor instead of treating a RegExp object as an immutable pattern.

```js runnable
const pattern = /a/g;
for (let attempt = 0; attempt < 3; attempt++) {
  console.log(pattern.test('a'), pattern.lastIndex);
}
const independent = /a/;
console.log(independent.test('a'), independent.test('a'));
```

**Expected output**

```text output
true 1
false 0
true 1
true true
```

The first success advances the cursor to 1. The next search starts there, fails, and resets it to 0; the third succeeds again. Remove `g` for independent yes/no checks. Resetting `lastIndex` deliberately is another option when traversal state is actually required. See [MDN: lastIndex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex).

</details>

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](./workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 08. Strings and text processing {/* #workbook-08 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** transform text without changing the original string.

Start with the spaces in `message`. Trace `trim`, lowercase conversion, `slice`, and split/join as separate operations; write the new text produced by each. Then compare the two ways of counting the emoji.

Use [ordinary string operations](#choose-the-simplest-text-operation) first. The [Unicode explanation](#code-units-code-points-and-graphemes) explains why the length and `Array.from` results differ. Before the coding task, state exactly what counts as a word; punctuation and whitespace need a clear rule.

**Worked example**

```js
const message = "  Hello JavaScript  ";
const clean = message.trim();
console.log(clean.toLowerCase());
console.log(clean.slice(0, 5));
console.log(clean.split(" ").join("-"));
console.log("😀".length);
console.log(Array.from("😀").length);
```

**Expected output**

```text
hello javascript
Hello
Hello-JavaScript
2
1
```

trim removes surrounding whitespace. The original message remains unchanged. split creates an array of pieces; join creates a string from those pieces. The emoji demonstrates the difference between code units and code points.

**Trace the example step by step**

1. trim removes spaces at the edges and returns a new string. Internal spaces remain because they are part of the text.

2. toLowerCase creates lowercase text. slice(0, 5) selects the first five code units of the trimmed English phrase.

3. split(" ") produces pieces separated by a single space; join("-") connects those pieces with hyphens.

4. The emoji example compares UTF-16 length with the number of code points returned by Array.from. The two counts measure different things.

**Common mistakes and how to reason about them**

Do not use split("") as a universal way to obtain human characters; it splits code units. A regular expression needs explicit rules too: ^ marks the beginning, $ the end, \\d a digit class, and + one or more repetitions. A pattern for digits alone does not accept decimal signs or decimal points unless you add those rules.

</details>

Find **08A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-08-answer">
<summary>Check your reasoning and answer</summary>

**08A.** "java". The end index 4 is excluded.

Indices 0, 1, 2, and 3 are included, yielding "java". Index 4 is excluded. The same rule means slice(4) starts at the next position without overlapping the first slice.

**08B.** Strings are immutable. In strict mode this assignment throws; build a new string instead.

The indexed characters of a string cannot be overwritten. In these module examples strict mode makes the invalid assignment throw. To replace the first character, construct a new value such as "A" + text.slice(1), while considering the chosen character model.

**08C.** Lowercase the text, iterate through it, and check membership in the five English vowels.

After lowercasing, one membership test handles both uppercase and lowercase English vowels. For "Education", the accepted vowels are e, u, a, i, and o, giving 5. Empty input has no matching characters and naturally returns 0.

**Reference code**

```js
function countVowels(text) {
  let count = 0;
  for (const char of text.toLowerCase()) {
    if ("aeiou".includes(char)) count++;
  }
  return count;
}
```

**Check the result**

```js
assert.equal(countVowels("Education"), 5);
assert.equal(countVowels("rhythm"), 0);
```

</details>

### 28. Regular expressions and Unicode text {/* #workbook-28 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** extract matching text and explain Unicode representation.

First locate both `id=` fields, capture their digits, and convert those captures to numbers. Then treat the normalization comparison and emoji lengths as separate questions.

Use [captures](#captures-lookbehind-and-match-indices) for the named group and [code units, points, and graphemes](#code-units-code-points-and-graphemes) for text length. A visible character, a code point, and a UTF-16 code unit are different measures. Define which measure a task needs before counting, slicing, or validating user-visible text.

**Worked example**

```js
const text = "id=12 id=7";
const matches = [...text.matchAll(/id=(?<value>[0-9]+)/g)];
console.log(matches.map(m => Number(m.groups.value)).join(","));
console.log("e\u0301".normalize("NFC") === "\u00e9");
console.log("\u{1F600}".length, [..."\u{1F600}"].length);
```

**Expected output**

```text
12,7
true
2 1
```

**Why the example works**

matchAll preserves a named capture for each occurrence. Number converts only the captured digits. Normalization makes two spellings of the accented letter comparable, while the final line shows that a single supplementary code point occupies two UTF-16 code units.

</details>

Find **28A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-28-answer">
<summary>Check your reasoning and answer</summary>

**28A.** A global regex stores progress in lastIndex. Its next search starts there rather than always at the beginning. Use a non-global regex for independent boolean validation or deliberately reset lastIndex.

**28B.** Spread counts code points. Combining marks and joined emoji may use several code points for one grapheme, so user-perceived length requires grapheme segmentation.

**28C.** Without the `m` flag, these anchors require the entire input, so a trailing newline is rejected. The full-match comparison is an additional explicit guard, not a workaround for JavaScript `$`. Safe-integer validation is separate from checking digit syntax. See [MDN input boundaries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Input_boundary_assertion).

**Reference code**

```js
function parsePair(text) {
  const match = /^([0-9]+),([0-9]+)$/.exec(text);
  if (!match || match[0] !== text) throw new Error("Invalid pair");
  const pair = [Number(match[1]), Number(match[2])];
  if (!pair.every(Number.isSafeInteger)) {
    throw new RangeError("Unsafe integer");
  }
  return pair;
}
```

**Check the result**

```js
assert.deepEqual(parsePair("12,0"), [12, 0]);
assert.throws(() => parsePair("12,0\n"));
assert.throws(() => parsePair("1, 2"));
assert.throws(() => parsePair("9007199254740992,1"));
```

</details>

<span id="practice" />

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **08A — What does "javascript".slice(0, 4) return?** | **Must fix** | [Worked example](#workbook-08) | [Answer](#workbook-08-answer) |
| **08B — Why does text[0] = "A" fail to edit a string?** | **Must fix** | [Worked example](#workbook-08) | [Answer](#workbook-08-answer) |
| **08C — Write countVowels(text) for English text, ignoring case. Count only a, e, i, o, and u.** | **Must fix** | [Worked example](#workbook-08) | [Answer](#workbook-08-answer) |
| **28A — Why can repeated test calls on /a/g give different answers?** | **Must fix** | [Worked example](#workbook-28) | [Answer](#workbook-28-answer) |
| **28B — Why is [...text].length not always the visible character count?** | **Must fix** | [Worked example](#workbook-28) | [Answer](#workbook-28-answer) |
| **28C — Write parsePair(text) accepting exactly two ASCII nonnegative integers separated by one comma. Reject unsafe integers and all extra characters.** | **Must fix** | [Worked example](#workbook-28) | [Answer](#workbook-28-answer) |
| Compare UTF-16 length, code point count, and grapheme count for an accented letter and a joined emoji. | Practice | — | — |
| Parse a product code into named captures and return an explicit invalid result on no match. | Practice | — | — |
| Write literal search accepting `a+b`, `[x]`, and `$&`; prove replacement text remains literal. | Practice | — | — |
| Explain why two consecutive calls to `/a/g.test('a')` differ and why using `s` does not change anchors. | Practice | — | — |
| Test a long invalid string against your pattern and record whether execution time grows reasonably. | Practice | — | — |

## Continue learning

Reference: [ECMAScript text processing](https://tc39.es/ecma262/2026/multipage/text-processing.html). Continue with [JSON](./json-and-serialization.md) or return to [the learning path](./index.md).
