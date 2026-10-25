---
id: javascript-keyword
slug: /javascript/keyword
title: "Keywords and naming rules"
sidebar_label: "Keywords and names"
---

# Keywords and naming rules

JavaScript reserves some words for instructions, such as `if`, `return`, and `const`. These are **keywords**. A name you choose for a variable or function, such as `totalScore`, is an **identifier**.

1. Learn keywords while using the corresponding feature.
2. Choose names that describe a value or action.
3. Distinguish a variable name from an object's property name; their naming rules are not identical.

Use this page as a lookup guide. Built-in names such as `undefined`, `NaN`, and `Math` are not the same thing as reserved keywords, even though they already have a meaning in many programs.

## Keywords by purpose

| Purpose | Examples | Lesson |
| --- | --- | --- |
| Bindings | `var`, `let`, `const` | [Variables](./fundamentals/variables-var-let-const.md) |
| Branches and loops | `if`, `else`, `switch`, `case`, `for`, `while`, `break`, `continue` | [Control flow](./flow-of-control.md), [loops](./loops.md) |
| Functions | `function`, `return`, `yield`, contextual `async` and `await` | [Functions](./functions/README.md), [async](./asynchronous/README.md) |
| Objects and classes | `class`, `extends`, `new`, `this`, `super` | [Objects](./objects-and-classes.md) |
| Errors | `try`, `catch`, `finally`, `throw` | [Error handling](./error-handling.md) |
| Modules | `import`, `export` | [Modules](./import-and-export.md) |
| Operators | `typeof`, `instanceof`, `in`, `delete`, `void` | [Operators](./operators-and-operands.md) |

Some words have context-dependent restrictions: `await` and `yield` are especially sensitive to module, async, generator, and strict contexts. `null`, `true`, and `false` are literal tokens. For the precise categories, consult the [lexical grammar](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar).

## Bindings and properties are different

You cannot declare a binding named `class`, but a property can have that name. Quoted property keys also allow characters that binding identifiers cannot contain.

```js runnable
const record = { class: 'beginner', 'display-name': 'Asha' };
const { class: className } = record;
console.log(className, record['display-name']);
```

```text output
beginner Asha
```

Common identifiers start with a letter, `_`, or `$`, and can contain digits after the first character. Unicode names are also supported. Use names such as `retryCount`, `isLoading`, and `loadProfile` to express a role. Naming convention is a style choice; identifier validity is a language rule.

## Interview questions {/* #interview-questions */}

**Level: Beginner.** [How to practise](./index.md#interview-preparation).

### 1. Can a keyword be used as an object property name?

<details>
<summary>Answer and worked example</summary>

Many reserved words are allowed as property names even though they cannot be used as ordinary binding identifiers. Distinguish the position in the grammar.

```js runnable
const response = { default: 'fallback', class: 'notice' };
const { default: fallback } = response;
console.log(response.class, fallback);
```

**Expected output**

```text output
notice fallback
```

The destructuring pattern reads the default property into a valid local name, fallback. It does not declare a variable named default.

</details>

### 2. Are await and yield ordinary identifier names everywhere?

**Apply it:** An API response contains a property named default. Decide whether the response must be renamed before JavaScript can use it.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

No. Their restrictions depend on grammar context, such as modules, async functions, generators, and strict code. Prefer descriptive names that avoid reserved or context-sensitive words instead of relying on a permissive corner case.

**Applied answer:** `response.default` and `const { default: defaultValue } = response` are valid. Property names and binding identifiers have different grammar rules; `const default = response.default` is invalid. The destructuring alias gives the local variable a permitted, descriptive name without changing the external data contract.

For `await` and `yield`, identify whether you are reading a property, declaring a binding, or writing an operator, and whether the code is a module, async function, or generator. For example, a property called `await` does not make an ordinary object asynchronous. Changing a file from a classic script to a module can expose previously accepted identifier usage, so check syntax in the actual execution context.

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| 1 — Classify `firstName`, `$count`, `2items`, `class`, and `café` as valid or invalid binding names in a module. | Practice | — | — |
| 2 — Read a `default` property while binding it locally as `fallback`. | Practice | — | — |
| 3 — Rename `x`, `data2`, and `doStuff` in a small function so its purpose is clear from the names. | Practice | — | — |

## Next steps

Continue with [data types](./fundamentals/types-of-identifiers.md) and [the edition map](./index.md#ecmascript-20152026-feature-coverage).
