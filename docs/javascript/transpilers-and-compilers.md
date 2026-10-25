---
id: javascript-transpilers-and-compilers
slug: /javascript/transpilers-and-compilers
title: "TypeScript, compilers, and build tooling"
sidebar_label: "TypeScript and build tooling"
---

# TypeScript, compilers, and build tooling

Build tools prepare code for the environment where it will run. A **compiler** translates a program into another representation. A **transpiler** is a compiler that produces another source program, such as JavaScript from TypeScript.

1. Start by running plain JavaScript without a build step.
2. Follow the small transformation below and compare its input and output.
3. Learn what TypeScript checks before execution and what still needs a runtime check.
4. Add tools only when the project needs their job.

The engine also compiles internally while running JavaScript. That is a different stage from an application's build process. This chapter is optional for your first programs and useful when you begin a multi-file project.

## Separate the jobs

| Tool or process | Responsibility | Does not automatically provide |
| --- | --- | --- |
| Syntax transform, such as Babel | Rewrite selected syntax for configured targets | Every missing standard-library or host API |
| TypeScript compiler | Check types and emit JavaScript according to configuration | Runtime validation of incoming JSON |
| Bundler | Resolve dependencies and produce deployable assets | Correct application architecture or universal platform support |
| Minifier | Reduce output size while preserving intended semantics | A guarantee that every workload runs faster |
| Polyfill or ponyfill | Supply a selected missing API | New syntax support in an older parser |

JSX and TypeScript syntax are not additions to ECMA-262. Their transforms are separate from the [annual ECMAScript editions](./index.md#ecmascript-20152026-feature-coverage).

## A small transform

```js
// Source
const greet = (name = 'World') => `Hello, ${name}!`;

```

A possible output for this specific function (a separate program):

```js
var greet = function (name) {
  if (name === undefined) name = 'World';
  return 'Hello, ' + name + '!';
};
```

The example does not use lexical `this`; transforming an arrow that does requires additional care. Real output depends on tool versions and target settings.

Transforming `items.toSorted()` into older syntax leaves the method call intact unless an API implementation is also supplied. A TypeScript `lib` declaration can make a method typecheck without installing it at runtime. Test the emitted program in the runtimes you support, and preserve source maps to diagnose production failures.

## TypeScript fundamentals

**Prerequisites:** JavaScript [types](./fundamentals/types-of-identifiers.md), [functions](./functions/README.md), and [objects](./objects-and-classes.md). TypeScript adds a static type system to JavaScript. Type annotations describe intended values; they do not change JavaScript's equality, object identity, or runtime coercion rules. Ordinary annotations, interfaces, and type aliases are erased when producing JavaScript.

Save the following as `types.ts` and check it with the TypeScript compiler using `tsc --strict --noEmit types.ts`. It is a TypeScript example, not a JavaScript block to paste into a browser console.

```typescript
const learner: string = 'Asha';
const completed: number = 3;
const subscribed: boolean = true;
const scores: number[] = [8, 10];
const matrix: number[][] = [[1, 2], [3, 4]];
const coordinate: [number, number] = [12, 18];

type Identifier = string | number;
type Status = 'draft' | 'published';

interface Book {
  readonly id: Identifier;
  title: string;
  subtitle?: string;
  status: Status;
}

const book: Book = { id: 'b1', title: 'Learning JavaScript', status: 'draft' };

function label(value: Book): string {
  return value.subtitle === undefined
    ? value.title
    : `${value.title}: ${value.subtitle}`;
}

console.log(learner, completed, subscribed, scores.length, matrix.length);
console.log(coordinate[0], label(book));
```

Annotations can often be omitted when inference already expresses the intended type. A tuple describes the types at particular positions; an array describes a sequence of elements. A union accepts one of several alternatives, and a literal union limits values to a named set. Read an optional property as potentially `undefined` and narrow it before use. [TypeScript everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).

### Structural types and generics

TypeScript usually checks compatibility through structure: a value that has the required members can satisfy an interface without explicitly declaring that it implements it. Fresh object literals also undergo excess-property checks. Interfaces and type aliases can both describe object shapes; aliases can additionally name unions, tuples, and other type expressions.

A generic preserves a relationship between types rather than discarding it with `any`. This independent example can be checked with the same command:

```typescript
function firstElement<T>(items: readonly T[]): T | undefined {
  return items[0];
}

const firstTitle = firstElement(['JavaScript', 'Testing']);
// firstTitle has type string | undefined.
console.log(firstTitle?.toUpperCase());

function getProperty<T, K extends keyof T>(value: T, key: K): T[K] {
  return value[key];
}

console.log(getProperty({ title: 'JavaScript', pages: 240 }, 'pages'));
// getProperty({ title: 'JavaScript' }, 'missing') would fail type checking.
```

The `T | undefined` result explicitly handles an empty input. `K extends keyof T` restricts the key to known properties and preserves the selected property's type. These checks help the caller before execution; they do not generate a runtime key validator. [TypeScript generics](https://www.typescriptlang.org/docs/handbook/2/generics.html).

### Narrow unknown values at boundaries

`unknown` requires checking before use. `any` opts out of the corresponding checks and can spread through a program. A type assertion such as `value as Book` tells the checker to trust you; it does not inspect or convert the value.

```typescript
type LoadResult =
  | { kind: 'ready'; title: string }
  | { kind: 'failed'; message: string };

function parseTitle(input: unknown): LoadResult {
  if (typeof input !== 'string' || input.trim() === '') {
    return { kind: 'failed', message: 'A non-empty title is required' };
  }
  return { kind: 'ready', title: input.trim() };
}

function describe(result: LoadResult): string {
  switch (result.kind) {
    case 'ready': return result.title;
    case 'failed': return result.message;
    default: {
      const unreachable: never = result;
      return unreachable;
    }
  }
}

console.log(describe(parseTitle(' JavaScript ')));
```

The shared `kind` property is a discriminant. Each branch narrows the union. `never` represents a value that cannot occur; adding a new variant without handling it makes the assignment fail. This validates a single field; incoming JSON records still need their full application schema checked. [TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

### Utility types and compiler settings

With the `Book` interface above, these utilities describe related views:

| Type | Meaning |
| --- | --- |
| `Partial<Book>` | Make its properties optional for a partial update |
| `Required<Book>` | Require every property, including `subtitle` |
| `Readonly<Book>` | Prevent assignments to its properties through this type |
| `Pick<Book, 'id' \| 'title'>` | Select a subset of fields |
| `Omit<Book, 'id'>` | Describe the remaining fields |

These utilities operate at the type level. `Readonly` is shallow and does not call `Object.freeze`; an update typed as `Partial<Book>` still needs authorization and domain validation. [TypeScript utility types](https://www.typescriptlang.org/docs/handbook/utility-types.html).

Enable `strict` for checks including implicit `any` and nullable values. Consider `noUncheckedIndexedAccess` to expose potentially missing indexed values and `exactOptionalPropertyTypes` to distinguish a missing optional property from one explicitly set to `undefined`. These two settings are separate from `strict`. A project's `tsconfig.json` makes its choices repeatable. [TypeScript compiler options](https://www.typescriptlang.org/tsconfig/).

Declaration files (`.d.ts`) describe available APIs without implementing them. Regular TypeScript enums can emit runtime JavaScript; `const enum` has inlining and tooling constraints. String-literal unions often suffice for named states, but choose deliberately when a runtime object is required. [Declaration files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html), [enum semantics and pitfalls](https://www.typescriptlang.org/docs/handbook/enums.html).

Use the [package workflow](./compatibility.md#packages-manifests-and-lockfiles) to pin and run project tooling. Keep type checking, JavaScript execution tests, and validation of external input as distinct checks.

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](./index.md#interview-preparation).

### 1. Does a TypeScript type assertion validate a JSON payload?

<details>
<summary>Answer and worked example</summary>

No. An assertion changes the checker’s view, not the runtime value. This TypeScript example can be checked with `tsc --strict --noEmit example.ts`; compiling and running it prints the output below.

```typescript
type User = { name: string };
const raw: unknown = JSON.parse('{"name":7}');
const assumed = raw as User;
console.log(typeof assumed.name);
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null &&
    'name' in value && typeof value.name === 'string';
}
console.log(isUser(raw));
```

**Expected output**

```text output
number
false
```

The assertion allows a string-typed property access, but the actual value is still a number. The runtime guard checks the field before callers rely on its type. This guard intentionally validates only the small shape shown here.

</details>

### 2. What is the difference between target and lib, and can either polyfill an API?

**Apply it:** A TypeScript project sets an older target and a newer lib, then calls Promise.any. Explain why a successful compilation can still fail at runtime.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

target influences emitted syntax; lib chooses available type declarations. Neither automatically installs runtime implementations. A bundler, syntax transform, type checker, and polyfill solve different jobs, so test emitted code as well as type-checking source.

**Build trace:** `target` influences which syntax TypeScript emits. `lib` exposes type declarations for APIs such as `Promise.any`; the method call generally remains a method call in the output. If the host lacks that method, executing the call fails despite a clean type check.

Choose a runtime baseline and test the compiled JavaScript there. If supporting an older host is required, supply an appropriate implementation or redesign the operation under a documented fallback contract. A bundler may combine files, a transpiler may rewrite syntax, and a polyfill may supply an API; none of those responsibilities should be inferred just from the presence of the others.

**Check your explanation:** explain the separate role of runtime input validation. Even when the host supports every API, an `as User` assertion does not verify an external JSON value. The example in question 1 demonstrates that independent failure mode.

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| 1 — Classify optional chaining, `Object.groupBy`, and `fetch` as syntax, standard-library API, or host API. | Practice | — | — |
| 2 — Explain why changing TypeScript's `target` alone does not install `Array.fromAsync`. | Practice | — | — |
| 3 — Inspect a small bundled module and trace an error back through its source map. | Practice | — | — |
| 4 — Add a `loading` variant to `LoadResult` and make the exhaustiveness check pass by handling it. | Practice | — | — |
| 5 — Type a book update with `Partial<Book>`, then identify which runtime rules the type cannot enforce. | Practice | — | — |

## Next steps

References: [Babel preset-env](https://babeljs.io/docs/babel-preset-env), [TypeScript target](https://www.typescriptlang.org/tsconfig/target.html), [TypeScript lib](https://www.typescriptlang.org/tsconfig/lib.html). Continue with the [compatibility workflow](./compatibility.md).

## How Do C++, Java, Python Work?


![How Do C++, Java, Python Work? — reference illustration](https://assets.bytebytego.com/diagrams/0003-how-python-works.png)

The diagram shows how the compilation and execution work.

Compiled languages are compiled into machine code by the compiler. The machine code can later be executed directly by the CPU. Examples: C, C++, Go.

A bytecode language like Java, compiles the source code into bytecode first, then the JVM executes the program. Sometimes JIT (Just-In-Time) compiler compiles the source code into machine code to speed up the execution. Examples: Java, C#

Compilation and interpretation are implementation choices. CPython compiles to bytecode; modern JavaScript engines commonly combine interpretation and JIT compilation. A language name alone does not specify its execution pipeline.

Measure the workload, runtime, optimization level, startup, and memory behavior rather than inferring performance from the language category.

### Exercise

Compare startup time and steady-state throughput for a command-line tool and a long-running service. Explain the compiler/runtime pipeline and warm-up assumptions before interpreting a language benchmark.

## Running C, C++, or Rust in a Web Browser


![Running C, C++, or Rust in a Web Browser — reference illustration](https://assets.bytebytego.com/diagrams/0406-how-wasm-work.jpeg)

What is **web assembly** (WASM)? Why does it attract so much attention?

The diagram shows how we can run native C/C++/Rust code inside a web browser with WASM.

WebAssembly provides a portable compilation target for suitable code from languages such as C, C++, and Rust. JavaScript engines also use compilation, so language labels alone do not establish a performance difference.

However, with WASM, we can **reuse** existing native code libraries developed in C/C++/Rust, etc to run in the web browser. These web applications have near-native performance.

For example, we can run the **video encoding/decoding** library (written in C++) in the web browser.

This opens a lot of possibilities for cloud computing and **edge computing**. We can run serverless applications with workload-dependent resource and startup characteristics.

### Exercise

Move an image transform to WebAssembly and include download, initialization, memory-copy, and JavaScript-boundary costs in the comparison. Explain the browser permissions and sandbox constraints.
