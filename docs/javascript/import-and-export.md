---
id: javascript-import-and-export
slug: /javascript/import-and-export
title: "JavaScript modules: import and export"
sidebar_label: "Import and export"
---

# JavaScript modules: import and export

A module is a file with its own top-level scope and an explicit way to share code. Imagine a small app with one file that calculates totals and another that displays them. `export` makes a value available; `import` names the value another file needs.

1. Run the two-file example before trying a larger project.
2. Match the exported name with its import and trace the function call.
3. Compare named and default exports.
4. Return to dynamic imports, shared dependencies, and cycles when your app has several modules.

ES modules use strict mode automatically. Their syntax arrived in ES2015; the browser and Node.js have different rules for finding and loading files. Follow the setup for the environment you are using.

```mermaid
flowchart LR
  accTitle: A two-file module program
  accDescr: The app imports add from the math module, calls it with two inputs, receives the returned sum, and prints the result.
  A["math.mjs exports add"] --> B["app.mjs imports add"]
  B --> C["Call add with two values"]
  C --> D["Receive the returned sum"]
  D --> E["Print the result"]
```

## Run a two-file module

Save these files in the same directory and run `node main.mjs`. The output is `5` followed by `1`.

```js title="calculator.mjs"
export let operations = 0;
export function add(a, b) {
  operations++;
  return a + b;
}
```

```js title="main.mjs"
import { add, operations } from './calculator.mjs';
console.log(add(2, 3));
console.log(operations);
```

The imported `operations` binding is live: after `add` changes the exported binding, the importer observes the new value. The importer cannot reassign it. Exporting an object does not freeze its properties.

In Node, `.mjs` explicitly selects ESM. A package can instead set `"type": "module"` for its `.js` files. Relative imports in native Node ESM need their file extension; a bundler may apply different resolution rules.

## Named, default, and namespace imports

| Form | Meaning |
| --- | --- |
| `export function add() {}` | Named export |
| `import { add as sum } from './calculator.mjs'` | Import a named binding with a local alias |
| `export default function greet() {}` | A default export; at most one per module |
| `import greet from './greet.mjs'` | Choose a local name for the default binding |
| `import * as calculator from './calculator.mjs'` | Read exports through a module namespace object |
| `export { add } from './calculator.mjs'` | Re-export an existing binding |

Static `import` and `export` declarations belong at module top level. Importing a module evaluates its top-level effects once per resolved module identity in that loading environment. Avoid starting timers or requests merely because a utility module was imported.

## Load optional code dynamically

Dynamic `import()` is an ES2020 expression returning a promise for the module namespace. In the same directory as the example above, this additional module logs `10`:

```js title="optional.mjs"
const { add } = await import('./calculator.mjs');
console.log(add(4, 6));
```

Top-level `await` is ES2022. Dependencies wait for async module evaluation, so avoid an expensive top-level operation that unnecessarily delays the whole application. Circular imports can expose uninitialized bindings; prefer a clear dependency direction and extract shared contracts.

## Browser modules and JSON

Serve browser examples over HTTP using a local development server. Load the entry with `<script type="module" src="./main.js"></script>`. Relative URL imports work natively; bare names such as `"some-package"` need an import map or build-tool resolution. Module scripts are deferred by default and fetch their dependency graph.

[Import attributes and JSON modules (ES2025)](#import-attributes-and-json-modules--es2025) use:

```js
import config from './config.json' with { type: 'json' };
```

This requires a supporting host and an actual JSON resource. Import attributes do not validate the application's configuration schema. CommonJS `require` is a separate Node module system; interop rules depend on the Node version and package export configuration.

## Namespace exports, metadata, and evaluation order

ES2020 adds `export * as utilities from './utilities.mjs'` to re-export a module namespace. `export * from` does not forward the default export automatically, and conflicting star exports can create ambiguity. Prefer explicit public exports for a stable module API.

`import.meta` is a per-module metadata object (ES2020); the host defines properties such as url and resolve. In a supporting browser/Node module, `new URL('./data.json', import.meta.url)` resolves relative to the module rather than a working directory or current page. URL and resource loading are host facilities.

Module loading resolves and links the dependency graph before evaluation. Imported names are live bindings, so a cycle is not inherently invalid, but reading a not-yet-initialized lexical export in that cycle throws. Top-level await (ES2022) delays dependent evaluation; it does not block the whole engine. Cycles involving awaited initialization can deadlock, so make initialization dependencies explicit.

## Trace a shared module dependency {/* #module-graph */}

**Goal:** distinguish the dependency graph from the order of statements in the entry file. In a fresh folder, save the following four files and run `node main.mjs`. These are native Node ES modules with no bundler or network dependencies.

```js title="shared.mjs"
console.log('shared evaluated');
export let count = 0;
export function increment() { count++; }
```

```js title="left.mjs"
import { count, increment } from './shared.mjs';
increment();
console.log('left sees', count);
```

```js title="right.mjs"
import { count } from './shared.mjs';
console.log('right sees', count);
```

```js title="main.mjs"
console.log('entry body');
import './left.mjs';
import './right.mjs';
import { count } from './shared.mjs';
console.log('entry sees', count);
```

Expected output in a fresh process:

```text
shared evaluated
left sees 1
right sees 1
entry body
entry sees 1
```

| Step | What happens | Why |
| --- | --- | --- |
| Link | Resolve imports and connect bindings | Imports describe dependencies before the entry body runs. |
| Evaluate shared | Initialize `count` to zero | The left branch needs the shared module. |
| Evaluate left | Increment the exported binding | All importers observe that same binding. |
| Evaluate right | Read one | Its dependency is already evaluated. |
| Evaluate entry | Run both entry logs | Its synchronous dependencies are ready. |

The first source line in `main.mjs` does not run before its static imports. Moving those imports lower in the file does not turn them into runtime statements. This graph is acyclic and synchronous; cycles and top-level await require additional reasoning. [ECMAScript module evaluation](https://tc39.es/ecma262/2024/multipage/ecmascript-language-scripts-and-modules.html#sec-moduleevaluation).

“Once” refers to a resolved module identity in a loading environment. Separate workers, separate processes, or distinct module URLs can have separate instances. It is not a universal application singleton. Node also distinguishes URL query strings in ESM; see [Node URL resolution](https://nodejs.org/api/esm.html#urls).

**Try it:** reverse the two side-effect imports. The shared module still evaluates once, but the right branch now reads zero before the left branch increments. Explain why the entry still reads one. Keep reusable modules free of initialization side effects where possible.

### Top-level await creates an initialization boundary {/* #top-level-await-boundary */}

A module that awaits during evaluation makes its dependents wait for completion. Other independent work can continue. If startup can fail, put the import at a boundary that can report that failure:

```js title="settings.mjs"
// A deterministic stand-in for an asynchronous settings source.
export const settings = await Promise.resolve({ theme: 'dark' });
```

```js title="start.mjs"
try {
  const { settings } = await import('./settings.mjs');
  console.log(settings.theme);
} catch (cause) {
  throw new Error('Application initialization failed', { cause });
}
```

Save both files together and run `node start.mjs`; it prints `dark`. Replace the resolved promise with a rejected one to exercise startup failure. A `try` around ordinary entry-body statements cannot catch a static dependency's earlier evaluation failure. Dynamic import gives this boundary an observable promise; it does not fix circular initialization dependencies automatically.

## Import attributes and JSON modules — ES2025

JSON modules supply a default export; they do not turn arbitrary JSON fields into named exports. Static imports use `with { type: 'json' }`. Dynamic import uses an options object:

```js
// ES module in a supporting host; settings.json must exist.
const { default: settings } = await import('./settings.json', {
  with: { type: 'json' },
});
console.log(settings);
```

The host validates supported attributes and resource type; the application must still validate the configuration schema. Attribute support, network access, MIME types, package exports, and caching are separate host concerns. The earlier assert spelling is not the standardized with syntax. [Import attributes](https://github.com/tc39/proposal-import-attributes), [JSON modules](https://github.com/tc39/proposal-json-modules).

**Practice extension:** create a two-module cycle and identify the exact early read that fails; then remove the cycle by extracting a shared dependency. Compare an exported mutable binding with a one-time destructured local value from a dynamic-import namespace.

## CommonJS in Node.js

CommonJS is a Node module system with `require` and `module.exports`. Use `.cjs` to select it explicitly; `.mjs` explicitly selects ESM. For `.js`, declare the package's `type` rather than relying on inference or a machine's defaults.

Save these two files together and run `node main.cjs`. No additional packages are needed.

```js title="calculator.cjs"
const calculator = {
  operations: 0,
  add(a, b) {
    calculator.operations++;
    return a + b;
  },
};
module.exports = calculator;
```

```js title="main.cjs"
const calculator = require('./calculator.cjs');
const { operations } = calculator;

console.log(calculator.add(2, 3));
console.log(calculator.operations, operations);
console.log(require('./calculator.cjs') === calculator);
```

The output is `5`, then `1 0`, then `true`. `require` returns the exported value; it does not copy an exports object. Requiring the same resolved module normally returns its cached exports. Destructuring the numeric property creates a local value that does not track later updates.

`exports` initially aliases `module.exports`. Assigning `exports.add = add` changes that initial object. Assigning `exports = anotherObject` does not replace the exported value, and replacing `module.exports` leaves the original `exports` alias pointing at the old object. Choose one clear export pattern per module. [Node CommonJS reference](https://nodejs.org/api/modules.html).

### Compare the module contracts

| Concern | CommonJS | ES modules |
| --- | --- | --- |
| Public API | A value assigned to `module.exports` | Declared named/default exports |
| Dependencies | `require()` may run inside ordinary control flow | Static imports at top level; `import()` for dynamic loading |
| Update observation | Shared objects can change; destructured values do not become live bindings | Static imported bindings reflect updates by the exporter |
| Evaluation | A CommonJS `require` evaluates the requested CJS module synchronously on its first load | Linking precedes evaluation; top-level await can delay dependent evaluation |
| Top-level `this` | The initial exports object in Node's module wrapper | `undefined` |
| Strict mode | Opt in with `'use strict'` where appropriate | Automatic |

Cycles need care in both systems: CommonJS can expose partially initialized exports, while ESM can expose bindings before initialization. Static ESM structure enables analysis, but tree shaking also depends on side effects and tool configuration.

For interoperation, `import()` works from CommonJS and returns a promise. ESM can import a CommonJS module's `module.exports` value as its default; inferred named exports have additional limitations. Node's support for `require()` of ESM depends on the runtime and whether the module graph can evaluate synchronously. Do not describe all ESM execution as asynchronous or all CommonJS/ESM interoperation as unsupported. Check the [Node interoperability rules](https://nodejs.org/api/esm.html#interoperability-with-commonjs) for your deployment target.

Use the [package-management lesson](./compatibility.md#packages-manifests-and-lockfiles) for `package.json`, scripts, and lockfiles, then the [application-structure lesson](./modular-javascript.md) to organize dependencies.

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](./index.md#interview-preparation).

### 1. How do live module exports differ from a destructured local value?

<details>
<summary>Answer and worked example</summary>

Reading an exported binding through the namespace observes later updates. Ordinary destructuring reads the current value once. Run this as a Node ES module; a data URL keeps the tiny imported module self-contained.

```js runnable
const source = 'export let count = 0; export function increment() { count++; }';
const namespace = await import(`data:text/javascript,${encodeURIComponent(source)}`);
const { count } = namespace;
namespace.increment();
console.log(namespace.count, count);
```

**Expected output**

```text output
1 0
```

The namespace exposes the current exported count. The destructured local number remains zero. A static `import { count }` would create a live imported binding instead of this ordinary destructuring snapshot.

</details>

### 2. Does a circular import always fail?

**Apply it:** Module A exports a const and imports a helper from B; B reads A’s const at top level. Explain how to distinguish a harmless cycle from an initialization failure.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

No, but evaluation order matters. Reading a lexical export before its initialization can throw, and async initialization cycles can stall. Prefer a clear dependency direction or extract a shared module. Dynamic import returns a promise and does not erase these initialization concerns.

**Trace the dependency graph:** linking connects the imports, but it does not execute every initializer at once. If B reads A’s lexical export while that binding is still uninitialized, the read throws. Exported function declarations have different initialization behavior, so “all cycles fail” is too broad.

Deferring the read into a function that is called only after both modules finish evaluation can make this particular cycle work. Calling that function during the same problematic initialization can recreate the error. A stronger design often moves shared values or contracts into a third module that neither depends on the other to initialize.

**Check your explanation:** name the exact read that occurs too early, not just the two files involved. Adding dynamic import changes timing and returns a promise, but it is not a general cycle cure. Test module examples as real separate files; concatenating them removes the module boundaries you are trying to explain.

</details>

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](./workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 15. Modules and organizing code {/* #workbook-15 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** share one calculation between two files.

Save the snippets below as the filenames in their first comments, in the same folder. Run `node app.mjs`. The math file exports `add`; the app file imports it and prints a result. Do not paste both snippets into one file.

Use [the two-file setup](#run-a-two-file-module) and [the dependency trace](#module-graph) for the rules. A dependency is a file or value another file needs. Keep the calculation separate from display or network work so it can be tested on its own. The browser needs its own module-loading setup.

**Worked example**

```js
// math.mjs
export function add(a, b) {
  return a + b;
}
```

Save this block as `app.mjs` beside `math.mjs`. Run `node app.mjs`.

```js
// app.mjs
import { add } from "./math.mjs";
console.log(add(2, 3));
```

**Expected output**

```text
Run node app.mjs. Output: 5
```

The comments identify two separate files. app.mjs imports the public add function. math.mjs can hold private helper functions as well; they remain unavailable to import unless exported.

**Trace the example step by step**

1. Save the exported add function in math.mjs. Its declarations belong to that module and its function calls.

2. Save the import and console call in app.mjs beside it. The ./ prefix identifies a dependency in the same directory.

3. Run node app.mjs. Node loads the dependency and makes the exported binding available.

4. add(2, 3) returns 5, which app.mjs prints. Importing a function does not call it automatically.

**Common mistakes and how to reason about them**

Keep the two labeled file sections separate. Do not mix require with these ES module examples. If an import fails, inspect the filename, extension, case, relative location, and exported name before changing the algorithm. Circular imports can create initialization-order problems, so prefer one-way dependencies when practical.

</details>

Find **15A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-15-answer">
<summary>Check your reasoning and answer</summary>

**15A.** import &#123; double &#125; from "./numbers.mjs";

Use braces because double is a named export. Its spelling must match the export unless as provides a local alias. The relative path identifies the source module.

**15B.** They demonstrate a dependency between modules. Pasting them together would redeclare the imported name in the same scope.

The example teaches a provider-consumer boundary. Combining the sections places an imported binding and a declaration with the same name in one module, creating a conflict instead of demonstrating a dependency.

**15C.** The exported function multiplies by 2; the importing file prints 12.

numbers.mjs owns the calculation, while app.mjs owns the demonstration and display. You can later import double in a test without depending on console output from a larger application.

**Reference code**

```js
// numbers.mjs
export const double = (n) => n * 2;
```

Save this block as `app.mjs` beside `numbers.mjs`. Run `node app.mjs`.

```js
// app.mjs
import { double } from "./numbers.mjs";
console.log(double(6));
```

**Check the result**

Save the two labeled sections in their separate files. Run node app.mjs and confirm that it prints 12. Then change the argument to 0 and confirm that it prints 0.

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **15A — How do you import a named export called double from ./numbers.mjs?** | **Must fix** | [Worked example](#workbook-15) | [Answer](#workbook-15-answer) |
| **15B — Why must the two sections of the example be saved as separate files?** | **Must fix** | [Worked example](#workbook-15) | [Answer](#workbook-15-answer) |
| **15C — Create numbers.mjs exporting double(n), and app.mjs importing it and printing double(6).** | **Must fix** | [Worked example](#workbook-15) | [Answer](#workbook-15-answer) |
| 1 — Add `multiply` to the calculator and test that each call updates the operation count. | Practice | — | — |
| 2 — Try assigning to `operations` in the importer. Explain the resulting error. | Practice | — | — |
| 3 — Split a DOM application into a pure model module and a browser entry module. | Practice | — | — |
| 4 — Load an optional feature dynamically and show a useful error when loading fails. | Practice | — | — |
| 5 — Compare the two calculator examples and explain why the ESM imported binding updates while the CommonJS destructured number does not. | Practice | — | — |

## Next steps

References: [MDN modules guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), [Node ESM documentation](https://nodejs.org/api/esm.html). Continue with [application structure](./modular-javascript.md) and [compatibility](./compatibility.md).
