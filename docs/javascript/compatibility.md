---
title: "Compatibility and tooling"
sidebar_label: "Compatibility and tooling"
---

# Compatibility and tooling

Code can work on your computer and fail on someone else's. **Compatibility** means checking that the environment where the program will run supports what you use. That environment is your **target**, such as a browser version or a Node.js version.

1. Write down the environments your project must support.
2. Check one feature you want to use, both its syntax and any built-in method it needs.
3. Choose a supported alternative, a build-tool transformation, a suitable polyfill, or a minimum-version requirement.
4. Run the program in those targets.

The [feature map](./index.md#ecmascript-20152026-feature-coverage) records specification editions. Publication, implementation, and availability in your application are separate facts. The standards-process and package sections are reference material for later; begin with the adoption walkthrough.

## How a feature becomes JavaScript {/* #tc39-process */}

**Prerequisites:** distinguish language syntax from host APIs using the [language history](./history.md). TC39 develops ECMAScript through proposal review, tests, and implementation experience. Its [current process](https://tc39.es/process-document/) includes six stages, checked on 23 October 2026:

| Stage | Meaning |
| --- | --- |
| 0 | An idea to explore; no committee commitment. |
| 1 | The problem and possible solution are being examined. |
| 2 | A preferred design exists, but details can still change. |
| 2.7 | A complete, reviewed design is being validated through tests and prototypes. |
| 3 | Recommended for implementation; experience can still reveal necessary changes. |
| 4 | Complete and ready for integration and yearly publication. |

Stage 4 is not a promise that every installed browser supports the feature. A proposal, an annual specification, and a shipping runtime answer different questions. A living draft can also contain additions beyond the latest published edition. Use the [edition map](./index.md#ecmascript-20152026-feature-coverage) for publication history, then verify the deployment environment.

## Work through an adoption decision {/* #adoption-walkthrough */}

Suppose a report needs a sorted copy of scores. `toSorted` expresses that intent directly, but compatibility involves more than the editor recognizing its name.

```js runnable
function sortedScores(scores) {
  // Contract: a dense array of finite numbers; do not mutate the input.
  const compare = (a, b) => a - b;
  return typeof scores.toSorted === 'function'
    ? scores.toSorted(compare)
    : [...scores].sort(compare);
}
const scores = [30, 2, 10];
console.log(sortedScores(scores).join(', '));
console.log(scores.join(', '));
```

```text output
2, 10, 30
30, 2, 10
```

The fallback uses older syntax and APIs, still requiring a runtime that supports them. Its intentionally narrow input contract makes comparison straightforward; this helper is not a full specification-compliant polyfill for arbitrary receivers. The comparator is necessary because ordinary array sorting otherwise compares string representations. Both branches keep the original order unchanged.

Test both branches in the intended runtimes. If the source also uses optional chaining, checking `toSorted` does not make that syntax parse in an older engine. Configure the syntax transform and built-in strategy separately. TypeScript's `target` affects emitted syntax, while `lib` supplies declarations; neither setting alone installs `toSorted`. See [TypeScript target](https://www.typescriptlang.org/tsconfig/target.html) and the [array method guide](./arrays/array-methods.md).

**Try it:** sort objects by score, mutate one result object's field, and inspect the original. Explain why copying the array protects order but not nested identity. Then document the minimum runtime or tested fallback for your application.

## Choose and document a target

This repository requires Node 24 or newer in `package.json`. Follow the README for repository tooling; a lesson about a newer built-in may need another supporting runtime. Node’s [release schedule](https://nodejs.org/en/about/previous-releases) distinguishes supported LTS and Current lines. Do not equate “Node 24+” with complete support for every ES2026 feature.

For a browser application, write down which browser versions and embedded webviews you support. Consult each API’s MDN compatibility table and test those targets. A feature working in your development browser is one observation, not a support policy.

## Syntax transforms and polyfills solve different problems

| Mechanism | Example | What it cannot promise |
| --- | --- | --- |
| Syntax transform | Rewrite optional chaining for older parsers | Automatically implement every missing built-in |
| Polyfill | Provide a compatible array method when absent | Reproduce all engine internals or host capabilities |
| Ponyfill | Import a helper without modifying global objects | Make unsupported syntax parse |
| Type checker | Detect inconsistent types before execution | Validate untrusted runtime data by itself |
| Bundler | Resolve/build a module graph and split chunks | Establish correctness or browser support without configuration |

Check [Babel preset-env](https://babeljs.io/docs/babel-preset-env) for target-driven transforms and [TypeScript target](https://www.typescriptlang.org/tsconfig/target.html) for emitted syntax. A TypeScript `lib` setting supplies type declarations; it does not install runtime implementations.

## Feature-detect methods

```js runnable
const required = ['groupBy', 'hasOwn'];
for (const name of required) {
  console.log(`${name}: ${typeof Object[name] === 'function'}`);
}
```

```text output
groupBy: true
hasOwn: true
```

These outputs describe a runtime with both APIs. For a deployed application, branch to a tested fallback or show an explicit unsupported-feature message when needed. Property checks are insufficient for some semantic differences; include behavior tests as well.

Unsupported syntax can fail while the file is parsed, before a surrounding condition executes. Deliver compatible syntax through your build or separate entry points. Avoid probing syntax with `eval` or `new Function` in application code; Content Security Policy may prohibit it.

## Browser and Node examples

Use `.mjs` for standalone Node ES modules. Browser modules use `<script type="module">` and are normally served over HTTP rather than opened from `file://`. Browsers require resolvable module URLs or an import map; Node follows its module-resolution rules and package metadata.

Use host APIs deliberately: `document` is unavailable in ordinary Node, and `node:fs` is unavailable in a browser. `fetch`, timers, workers, and URL utilities come from hosts, not the annual ECMA-262 edition list.

## Packages, manifests, and lockfiles

JavaScript projects commonly use npm, Yarn, pnpm, or Bun to manage packages. Use the manager and version chosen by the project; their lockfiles and installation options are not interchangeable. **This repository uses Yarn 1.22.22 and `yarn.lock`**. The npm examples below are for a separate learning project.

A `package.json` manifest records metadata, scripts, and requested dependencies. `dependencies` records packages needed by the application; `devDependencies` records development tools such as a type checker. What belongs in each category depends on what the deployed application actually loads. `"type": "module"` selects ES modules for `.js` files in that package scope. [npm package.json reference](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/).

### A small npm project

In a new empty directory, run:

```sh
npm init -y
npm install --save-dev typescript
```

Create `src/index.ts` containing `const message: string = 'Ready'; console.log(message);`. Keep the generated `devDependencies` and add or update these fields in `package.json`:

```json
{
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc --strict --noEmitOnError --target ES2022 --module NodeNext --outDir dist src/index.ts",
    "start": "node dist/index.js"
  }
}
```

This is a manifest fragment, not a replacement for the dependency information. `npm run build` uses the locally installed compiler, and `npm start` runs the output, printing `Ready`. In a larger project, move compiler settings into `tsconfig.json`. Install an application dependency with `npm install <package-name>` only when the project needs it; locally installed tools make the chosen version part of the project.

### Version ranges and reproducible installation

| Requested version | Typical stable versions accepted by npm's range rules |
| --- | --- |
| `1.2.3` | Exactly `1.2.3` |
| `~1.2.3` | At least `1.2.3`, below `1.3.0` |
| `^1.2.3` | At least `1.2.3`, below `2.0.0` |
| `^0.2.3` | At least `0.2.3`, below `0.3.0` |

Prerelease versions have additional matching rules. A range expresses permitted versions; it does not prove that every permitted update preserves application behavior. [npm semver rules](https://github.com/npm/node-semver#ranges).

Commit the selected manager's lockfile with the manifest. For an npm project with an existing, matching `package-lock.json`, `npm ci` performs a clean install from the lockfile and fails when it disagrees with the manifest. It removes an existing `node_modules` directory, so use it as an intentional clean-install step. For this repository, follow the README's `yarn install --frozen-lockfile` workflow. [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/).

A lockfile records resolved direct and transitive dependencies, but runtime versions, native dependencies, platforms, install scripts, and build configuration also affect reproducibility. Review manifest and lockfile changes together, then run type checks, tests, and a production build. Yarn, pnpm, and Bun offer their own workspace and storage features; migration requires checking their version-specific behavior rather than just replacing a command name.

## Before adopting a recent feature

1. Identify the exact feature and its semantics using the relevant [concept lesson in the feature map](./index.md#ecmascript-20152026-feature-coverage).
2. Check support in the browser/runtime versions you actually deploy.
3. Test edge cases and failure modes, including empty inputs and unsupported environments.
4. Decide whether to require the feature, transform syntax, or provide a maintained fallback.
5. Record the decision in the application README and run the tests in CI.

The documentation example checker prints unavailable features as **SKIP**, so its totals distinguish executed examples from untested APIs. Do not count a skipped example as validated runtime behavior.

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](./index.md#interview-preparation).

### 1. Why can an API feature check work while a syntax feature check fails before execution?

<details>
<summary>Answer and worked example</summary>

A property check can choose between implementations for a missing method. Unsupported syntax in the same file can prevent the file from parsing at all, before a conditional runs.

```js runnable
function sortedCopy(values, useNative = true) {
  const compare = (a, b) => a - b;
  return useNative && typeof values.toSorted === 'function'
    ? values.toSorted(compare)
    : values.slice().sort(compare);
}
const input = [10, 2, 1];
console.log(sortedCopy(input).join(', '));
console.log(sortedCopy(input, false).join(', '));
console.log(input.join(', '));
```

**Expected output**

```text output
1, 2, 10
1, 2, 10
10, 2, 1
```

For this dense finite-number input contract, both branches preserve the source and sort numerically. The fallback is an application helper, not an exact polyfill for all sparse arrays, subclasses, or unusual receivers.

</details>

### 2. Does changing a TypeScript lib setting or adding a lockfile guarantee runtime support?

**Apply it:** A project type-checks a call to a new array method but throws “is not a function” on a deployment target. Explain what each tool did and what is still missing.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

No. lib supplies declarations; it does not install APIs. A lockfile pins resolved dependencies, not every runtime or platform behavior. Specify targets, transform unsupported syntax, supply maintained API fallbacks where appropriate, and test the actual deployment environments.

**Diagnosis:** type declarations told the checker that the method exists. They did not install it in the runtime. A syntax transform may rewrite optional chaining while leaving an ordinary method call unchanged. A lockfile reproduces dependency resolution within its platform constraints; it does not upgrade the browser or Node executable.

Confirm the failing runtime and the exact feature. If the required behavior is simple, provide a documented fallback; otherwise evaluate an appropriate maintained polyfill and its semantics. Test the emitted bundle on the oldest supported targets, not only the TypeScript source in the development runtime.

Syntax support is a separate boundary: unsupported syntax can prevent the file from parsing before a feature-detection branch runs. Avoid shipping the unsupported syntax to that target, or load a separately compatible build. “The build passed” and “the target can execute this feature” are separate claims.

</details>

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](./workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 34. Modules Node tooling and testable programs {/* #workbook-34 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** use a Node module and an assertion in one small file.

Save the example as `.mjs` and run it in Node. `path.join` builds a path, `path.basename` extracts the final name, and the assertion checks that result. No third-party package is needed for these built-in modules.

Review [Node and browser environments](#browser-and-node-examples) and [packages and lockfiles](#packages-manifests-and-lockfiles). A package script is a named command in the project configuration. For feature support, use the [adoption walkthrough](#adoption-walkthrough); a build transformation and an API polyfill perform different jobs.

**Worked example**

```js
import assert from "node:assert/strict";
import path from "node:path";
const file = path.join("lessons", "example.mjs");
assert.equal(path.basename(file), "example.mjs");
console.log("Module and assertion checks passed");
```

**Expected output**

```text
Module and assertion checks passed
```

**Why the example works**

The node: prefix identifies a built-in Node module. path.join delegates path construction to the host utility, while basename asks for a final component without guessing separators. The assertion checks meaning and prints no output when it succeeds.

</details>

Find **34A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-34-answer">
<summary>Check your reasoning and answer</summary>

**34A.** It records the resolved dependency graph so installs can reproduce chosen versions more reliably. Review it together with dependency declarations when the graph changes.

**34B.** Without awaiting or returning the promise, the test may finish before the important work fails. The runner needs an observable completion signal for the behavior being tested.

**34C.** Check syntax and numeric range separately. Exact digit matching rejects partial strings such as 3x, which parseInt could otherwise accept. The range rule protects the consuming operation.

**Reference code**

```js
function parseLimit(text) {
  if (typeof text !== "string" || text.length === 0 ||
      /[^0-9]/.test(text)) throw new TypeError("Digits required");
  const n = Number(text);
  if (!Number.isSafeInteger(n) || n < 1 || n > 1000) {
    throw new RangeError("Limit must be 1 through 1000");
  }
  return n;
}
```

**Check the result**

```js
assert.equal(parseLimit("25"), 25);
assert.throws(() => parseLimit("0"));
assert.throws(() => parseLimit("3x"));
assert.throws(() => parseLimit("1001"));
assert.throws(() => parseLimit("2\n"));
assert.throws(() => parseLimit("2\r"));
```

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **34A — Why is a package lockfile useful?** | **Must fix** | [Worked example](#workbook-34) | [Answer](#workbook-34-answer) |
| **34B — Why must an async test await the operation it checks?** | **Must fix** | [Worked example](#workbook-34) | [Answer](#workbook-34-answer) |
| **34C — Write parseLimit(text) for a command-line option. Accept only ASCII digits representing a safe integer from 1 to 1000.** | **Must fix** | [Worked example](#workbook-34) | [Answer](#workbook-34-answer) |
