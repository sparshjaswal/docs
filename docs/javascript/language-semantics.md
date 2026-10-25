---
title: "Language semantics and specification reading"
sidebar_label: "Language semantics"
---

# Language semantics and specification reading

**Optional advanced lesson.** Semantics means the rules that determine what code does. A specification is the detailed description of those rules. Use it when ordinary examples do not settle a difficult edge case.

1. Separate reading the code's grammar, connecting names to bindings, and evaluating values.
2. Revisit a familiar topic such as loop variables or property order.
3. Follow one specification algorithm with a very small input.
4. Check the result in code and explain which rule caused it.

Finish scope, functions, objects, modules, and scheduling first. This chapter connects smaller ES2015–2026 refinements to those familiar ideas; it is a reference to return to, not the starting point for learning JavaScript.

## Parse, bind, evaluate

A syntax error prevents the containing source unit from evaluating. During execution, bindings track initialization and scope, while expressions can complete normally or abruptly (throw, return, break, continue). “Hoisting” describes observable declaration behavior; it is not a literal source-code move performed by every engine.

`let`, `const`, and class declarations have uninitialized bindings before their declarations execute. A function declaration is usually initialized earlier in its enclosing function/module setup. Class bodies and modules are strict; sloppy classic scripts have additional legacy behavior, including Annex B block-function rules. Prefer explicit module semantics in new code.

```js runnable
let outer = 'outside';
{
  try { console.log(outer); }
  catch (error) { console.log(error.name); }
  let outer = 'inside';
  console.log(outer);
}
console.log(outer);
```

```text output
ReferenceError
inside
outside
```

The nearer binding shadows the outer one for the whole block, including its temporal dead zone. `typeof` does not rescue an uninitialized lexical binding, although it can inspect an undeclared name without throwing.

## Per-iteration bindings and parameters — ES2015

```js runnable
const callbacks = [];
for (let index = 0; index < 3; index++) callbacks.push(() => index);
console.log(callbacks.map(fn => fn()).join(', '));
function describe(first = 2, second = first * 3, ...rest) {
  return [first, second, rest.length];
}
console.log(JSON.stringify(describe(undefined, undefined, 'extra')));
console.log(describe.length);
```

```text output
0, 1, 2
[2,6,1]
0
```

The loop creates distinct lexical bindings per iteration. Default parameters are evaluated at call time, from left to right, only for undefined arguments. Earlier parameters are available to later defaults; body-local declarations are not in that parameter-initializer scope. The function's `length` counts parameters before the first default and excludes rest; it does not restrict accepted arguments.

Arrow functions inherit `this`, `arguments`, and `new.target` from their enclosing context and are not constructors. Methods and arrows are not interchangeable. ES2015 also defined name inference for many anonymous function/class positions; inspect `name` for diagnostics, not business identity.

## Small grammar enhancements

| Edition | Rule | Practical consequence |
| --- | --- | --- |
| 2016 | Non-simple parameter lists cannot have their own `"use strict"` directive | Put strictness at module/enclosing scope when using defaults, rest, or destructuring |
| 2017 | Trailing commas in parameter lists and calls | Easier line-by-line edits; no comma after a rest parameter |
| 2018 | Revised escapes in tagged templates | Invalid cooked escapes can be undefined while raw text remains available to the tag |
| 2019 | Optional catch binding | Use `catch {}` when the exception value is deliberately unused |
| 2019 | JSON-superset string grammar | U+2028/U+2029 may appear in string literals; host escaping still matters |
| 2023 | Hashbang comments | A first-line `#!/usr/bin/env node` is recognized by the grammar; executable behavior is host/OS-specific |

```js runnable
function inspect(strings) {
  console.log(strings[0] === undefined);
  console.log(strings.raw[0]);
}
inspect`\unicode`;
```

```text output
true
\unicode
```

The tag receives undefined for this invalid cooked escape; the raw segment is preserved. Untagged templates do not gain permission for arbitrary invalid escapes. [Template revision](https://github.com/tc39/proposal-template-literal-revision).

Automatic semicolon insertion is a grammar rule with limitations. A newline after `return` can return undefined before the following expression; a following line beginning with `(` or `[` may continue the preceding expression. Use formatting/linting and intentional statement boundaries rather than relying on visual line breaks.

## Property enumeration and ordering

For ordinary objects, own keys list array-index strings in ascending numeric order, then other strings in creation order, then symbols in creation order. `Object.keys` filters that list to enumerable strings; Reflect.ownKeys includes non-enumerable keys and symbols.

```js runnable
const marker = Symbol('marker');
const record = { b: 1, 10: 'ten', 2: 'two', a: 2, [marker]: 3 };
console.log(Object.keys(record).join(', '));
console.log(Reflect.ownKeys(record).at(-1) === marker);
console.log(new Map([['10', 1], ['2', 2]]).keys().toArray().join(', '));
```

```text output
2, 10, b, a
true
10, 2
```

The final line uses ES2025 iterator helpers. Map preserves insertion order without moving numeric-looking keys into a separate ordering group.

ES2020 tightened for-in order for ordinary cases, but mutation during enumeration, prototypes, Proxies, and exotic objects add qualifications. `for...in` includes inherited enumerable string keys and omits symbols. Use `Object.entries` for own record fields and `for...of` for iterable values. [for-in ordering proposal](https://github.com/tc39/proposal-for-in-order).

## Function source text — ES2019

Function.prototype.toString returns the original source text when available for a source-defined function, including comments and whitespace; native or unavailable source uses a native-function representation. It is not a stable serialization format, a parser, or proof that an arbitrary function is trustworthy.

```js runnable
function add(a, b) { /* deliberate comment */ return a + b; }
console.log(add.toString().includes('deliberate comment'));
console.log(Math.max.toString().includes('[native code]'));
```

```text output
true
true
```

Code transformed by a build tool has different source text from the original authoring file. Use source maps and explicit metadata for debugging instead of parsing function strings. [Function source revision](https://github.com/tc39/Function-prototype-toString-revision).

## Global objects and eval refinements

`globalThis` (ES2020) provides a common global access point across hosts. It does not turn module-local variables into globals, and browser hosts may expose a global proxy. Top-level lexical bindings and global-object properties are different mechanisms.

ES2025 allows a later global lexical declaration to shadow a configurable global property introduced by a sloppy direct eval `var`. The lexical binding and the globalThis property can then hold different values. Ordinary script-introduced non-configurable globals and existing lexical declarations keep their restrictions. This concerns legacy script/eval semantics; module lexical declarations still cannot be freely redeclared. Direct/indirect eval and strict/sloppy code have different environments. Prefer modules and ordinary functions instead of eval; it also conflicts with many Content Security Policies. [Global eval-var refinement](https://github.com/tc39/proposal-redeclarable-global-eval-vars).

## Proper tail calls and engine optimizations

ES2015 specifies proper tail calls in qualifying strict-mode tail positions. This is more specific than “the last-looking call”: for example, `return 1 + recurse()` still has addition to perform. Engine support differs, so portable recursive algorithms must not assume bounded stack use. Use iteration or an explicit stack when depth is unbounded.

Execution contexts, environment records, internal slots, and abstract operations specify observable behavior. Hidden classes, inline caches, JIT tiers, and garbage-collector strategies are implementation choices. A class or a shorter expression does not guarantee better performance; measure representative code in the actual runtime.

### Recognize tail position, then choose a portable implementation {/* #tail-call-walkthrough */}

`return n * factorial(n - 1)` is not a tail call: multiplication remains after the recursive call. `return factorial(n - 1, accumulator * n)` puts the recursive call in tail position, but writing that shape alone does not guarantee bounded stack use in your runtime. The [ES2015 tail-position rules](https://262.ecma-international.org/6.0/#sec-tail-position-calls) define eligibility; implementation support is a separate concern.

For portable code, carry the accumulator in a loop. Here the contract accepts nonnegative BigInts and returns their factorial:

```js runnable
function factorial(n) {
  if (typeof n !== 'bigint' || n < 0n) {
    throw new TypeError('Expected a nonnegative BigInt');
  }
  let product = 1n;
  for (let factor = 2n; factor <= n; factor++) product *= factor;
  return product;
}
console.log(String(factorial(0n)), String(factorial(5n)));
try { factorial(-1n); }
catch (error) { console.log(error.name); }
```

```text output
1 120
TypeError
```

After each iteration, `product` is the factorial of the last processed factor. Empty iteration for zero and one preserves the multiplicative identity, one. This uses constant call-stack space, but the BigInt grows and arithmetic becomes more expensive; constant stack does not mean constant total memory or constant-time multiplication.

**Try it:** trace factors two through five by hand. Explain what unfinished work the recursive multiplication version leaves in each frame, and why an accumulator removes that unfinished work without itself proving engine support.

## Run a hashbang script {/* #hashbang-cli */}

ES2023 standardizes recognition of the hashbang comment; executable-file launching still depends on the host and operating system. Save this as `greet.mjs` with the hashbang on its very first line:

```js title="greet.mjs"
#!/usr/bin/env node
const name = process.argv[2] ?? 'reader';
console.log(`Hello, ${name}`);
```

`node greet.mjs Ada` prints `Hello, Ada`. On a POSIX system, `chmod +x greet.mjs` followed by `./greet.mjs Ada` lets the shell use the interpreter named by the hashbang. This assumes `node` is on PATH. The hashbang does not install Node, enable ESM by itself, or make the DOM available. Here `.mjs` selects ESM and `process.argv` is a Node API. [Hashbang proposal](https://github.com/tc39/proposal-hashbang).

## Read a specification algorithm

1. Start with the annual snapshot matching the question; the living draft can include later changes.
2. Find the relevant built-in, grammar production, or abstract operation.
3. Track conversions such as ToPrimitive, ToNumber, ToPropertyKey, and ToLength. Getters and coercion hooks can execute code.
4. Follow abrupt-completion propagation: `? Operation(...)` can return early with a throw; `! Operation(...)` asserts normal completion in the specification's notation.
5. Compare the normal case, the missing/empty case, and one invalid input with a small program.

For example, array includes uses SameValueZero, whereas indexOf uses strict equality semantics. That distinction predicts why includes can find NaN and indexOf cannot. Spec reading should explain an observed behavior, not replace a readable application contract.

<span id="practice" />

## Interview questions {/* #interview-questions */}

**Level: Advanced.** [How to practise](./index.md#interview-preparation).

### 1. How can automatic semicolon insertion change a return value?

<details>
<summary>Answer and worked example</summary>

A line terminator immediately after return ends that return statement. The following object-looking block does not become its returned expression.

```js runnable
function broken() {
  return
  { value: 7 };
}
function fixed() {
  return { value: 7 };
}
console.log(broken());
console.log(fixed().value);
```

**Expected output**

```text output
undefined
7
```

The parser applies a restricted-production rule at the newline. Indentation does not join the object to return. A formatter/linter can help catch the mistake.

</details>

### 2. Are object property keys always enumerated in insertion order?

**Apply it:** Predict Object.keys and Reflect.ownKeys after inserting numeric-looking keys, a noncanonical numeric string, and a symbol.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

For ordinary objects, own array-index strings come first in numeric order, then other strings in creation order, then symbols in creation order. Object.keys further filters to enumerable strings. Map preserves key insertion order without the numeric-string grouping; proxies and other exotic cases require their own rules.

For this ordinary object, distinguish array-index keys from other strings before considering insertion order.

```js runnable
const tag = Symbol('tag');
const record = {};
record.b = 'bee';
record['10'] = 'ten';
record['2'] = 'two';
record['01'] = 'leading zero';
record[tag] = 'symbol';
console.log(Object.keys(record).join(','));
console.log(Reflect.ownKeys(record).map(String).join(','));
```

**Expected output**

```text output
2,10,b,01
2,10,b,01,Symbol(tag)
```

`"2"` and `"10"` are array-index keys and come first in numeric order. `"01"` is a different string, not the canonical index string for 1, so it stays with the other strings in creation order. `Object.keys` omits symbols; `Reflect.ownKeys` includes them. Use Map if the domain requires one insertion-ordered sequence of keys without this grouping.

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| Predict loop-closure output after replacing `let` with `var`. | Practice | — | — |
| Write defaults where a later parameter depends on an earlier one; then reverse that dependency and explain the failure. | Practice | — | — |
| Compare own-key ordering, for-in inheritance, and Map insertion order. | Practice | — | — |
| Explain why a tail-recursive function is not automatically portable for a million calls. | Practice | — | — |
| Trace a conversion hook with logging and identify every operation that can run user code. | Practice | — | — |

## Continue learning

References: [Execution model](https://tc39.es/ecma262/2026/multipage/executable-code-and-execution-contexts.html), [grammar](https://tc39.es/ecma262/2026/multipage/ecmascript-language-lexical-grammar.html). Return to [the learning path](./index.md).
