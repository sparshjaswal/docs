---
id: javascript-template-literals
slug: /javascript/template-literals
title: "Template literals and tags"
sidebar_label: "Template literals and tags"
---

# Template literals and tags

A template literal is text written between backticks. It lets you place a value inside text with `${...}`, so you can build a message such as a student's name followed by their score.

1. Write a simple template with one variable.
2. Add a calculation inside a substitution and predict the text it produces.
3. Try a multiline message.
4. Return to tagged templates after ordinary functions are familiar.

A **tag** is a function placed before a template; it receives the text pieces and inserted values separately. Ordinary interpolation converts values to text. It does not automatically make them safe for HTML, SQL, shell commands, or regular expressions.

```js runnable
const name = 'Mira';
const count = 3;
console.log(`${name} has ${count} tasks.`);
console.log(String.raw`path\to\file`);
```

```text output
Mira has 3 tasks.
path\to\file
```

Interpolation evaluates expressions and normally converts their values to strings. It does not automatically escape HTML, SQL, shell commands, or regular expressions.

## Inspect substitutions with a tag

```js runnable
function describe(strings, ...values) {
  return `${strings.length} segments; ${values.length} values`;
}
console.log(describe`User ${'Ada'} has ${2} tasks`);
```

```text output
3 segments; 2 values
```

A tag can return any value, not only a string. Libraries can use tags to enforce domain-specific handling, but a tag is not inherently safe merely because it is a tag. For DOM text, use `textContent`; for database queries, use the database driver’s parameterized query API.

## Define a tag's input and output contract {/* #tag-contract */}

A template with two substitutions has three literal segments, including empty segments at its edges. Substitutions arrive as their original values. The tag chooses whether to convert them to strings, validate them, or return a structured result.

```js runnable
function capture(parts, ...values) {
  return { cooked: parts[0], raw: parts.raw[0], values };
}
const item = { id: 7 };
const result = capture`line\n${item}${0}`;
console.log(JSON.stringify(result.cooked));
console.log(JSON.stringify(result.raw));
console.log(result.values[0] === item, typeof result.values[1]);
```

```text output
"line\n"
"line\\n"
true number
```

The cooked segment contains a newline; the raw segment retains the backslash and `n`. The object reaches the tag with identity intact and zero remains a number. An ordinary interpolated string would already have converted these substitutions to text. The returned object here is only an inspection record; it is not escaped HTML or an executable query.

A tag also receives the same frozen template array on repeated evaluation of the same template site. Libraries can use that identity to cache parsing of literal segments, while still processing new substitutions for every call:

```js runnable
let previous;
function sameSite(parts) {
  const same = previous === parts;
  previous = parts;
  return same;
}
function render() { return sameSite`fixed`; }
console.log(render(), render());
console.log(sameSite`fixed`);
```

```text output
false true
false
```

The last expression is a different source site even though its characters match. Caching a template's structure must not accidentally cache its first user's values. [Template evaluation and template objects](https://tc39.es/ecma262/2024/multipage/ecmascript-language-expressions.html#sec-gettemplateobject).

**Try it:** write a tag that returns `{ parts, values }` with two numeric substitutions. Verify that values remain numbers. Explain which additional driver-specific contract would be needed before calling such a tag a parameterized SQL interface.

<span id="practice" />

## Interview questions {/* #interview-questions */}

**Level: Beginner.** [How to practise](./index.md#interview-preparation).

### 1. Is template interpolation automatically safe for HTML?

<details>
<summary>Answer and worked example</summary>

No. An ordinary template literal constructs a string; it does not escape HTML. A tag can implement a policy, but using template syntax alone supplies none.

```js runnable
const input = '<img src=x onerror=alert(1)>';
const markup = `<p>${input}</p>`;
console.log(markup.includes('<img'));
function describe(parts, ...values) {
  return `${parts.length} segments, ${values.length} value`;
}
console.log(describe`Hello ${'Ada'}!`);
```

**Expected output**

```text output
true
2 segments, 1 value
```

This example never inserts markup into the DOM. It demonstrates that the original HTML-like text survives unchanged and that a tagged template receives segments and values separately.

</details>

### 2. How should user text be inserted into a page?

**Apply it:** A user enters text that looks like an HTML element. Explain how a greeting and a profile link should handle it differently.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

Use textContent for literal text in ordinary content elements. If rich HTML is required, use an appropriate maintained sanitizer and policy. HTML escaping, URL encoding, and regular-expression escaping are different operations for different contexts.

**Text destination:** assign the full greeting to an ordinary element’s `textContent`. Template interpolation produces a string; `textContent` decides to display it as text. Sending that same string to `innerHTML` changes the interpretation and can make user input executable markup.

**URL destination:** construct the destination with URL APIs, encode path or query data in its proper position, and apply the application’s allowed-protocol and destination policy before assigning it. HTML text escaping does not decide whether a URL is acceptable.

**Rich-text destination:** use a maintained sanitizer configured for the permitted markup. Do not implement a sanitizer with a few string replacements or a regex. The important interview distinction is the destination’s interpretation rules: text, HTML, URL, CSS, and JavaScript contexts need different handling. See the complete [DOM text example](./document-object-model.md#interview-questions).

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| Write a tag that returns the literal segments and substitutions separately. Explain why concatenating user input into HTML with a template literal still requires context-appropriate handling. | Practice | — | — |

## Continue learning

Continue with [DOM](./document-object-model.md) and [string processing](./strings-and-regular-expressions.md).
