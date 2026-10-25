---
id: javascript-functions-function-iife
title: "IIFE (Immediately Invoked Function Expression)"
slug: /javascript/functions/function-iife
sidebar_label: "IIFEs"
---

# IIFE (Immediately Invoked Function Expression)

An **IIFE** means “Immediately Invoked Function Expression”: a function expression that is called as soon as it is created. It is useful for recognizing older code that runs setup once while keeping temporary variables local.

1. Read `(function () { ... })` as the function expression.
2. Read the final `()` as the call; arguments go inside that final pair.
3. Trace any returned value, just as you would for an ordinary function call.

Read [function scope](../fundamentals/scope.md) and [closures](./function-closure.md) first. This is an optional follow-up after ordinary functions; modules provide another way to organize private variables. See the [MDN definition](https://developer.mozilla.org/en-US/docs/Glossary/IIFE).

## Call once and return a value

This example runs in Node.js or a browser console. The local `tax` belongs to the function. The returned number is assigned to `total`.

```js runnable
const total = (function (price) {
  const tax = price * 0.1;
  return price + tax;
})(100);
console.log(total);
```

```text output
110
```

| Step | What happens |
| --- | --- |
| Create | JavaScript evaluates the function expression. |
| Call | The argument `100` becomes `price`. |
| Calculate | `tax` is `10`, so the result is `110`. |
| Return | `total` receives the result; `price` and `tax` remain local. |

An IIFE without `return` produces `undefined`, just like any other function. A leading semicolon, `;(function () { ... })()`, can separate an IIFE from a preceding expression in code that omits semicolons. Consistent statement terminators avoid that ambiguity.

## Keep state private with a closure

The IIFE runs once. The returned methods can run many times and remember the same `value` binding.

```js runnable
const counter = (() => {
  let value = 0;
  return {
    increment: () => ++value,
    read: () => value,
  };
})();
console.log(counter.increment());
console.log(counter.increment());
console.log(counter.read());
console.log(counter.value);
```

```text output
1
2
2
undefined
```

This is a small module pattern. For an application split into files, use [ES modules](../import-and-export.md) to express dependencies. An IIFE is still useful for a local one-time calculation or older scripts; it is not a performance optimization by itself.

## Example: Creating Dynamic Buttons

A `var` loop shares one binding. An IIFE can capture a separate argument for each callback:

```js runnable
const callbacks = [];
for (var i = 1; i <= 3; i++) {
  (function (number) {
    callbacks.push(() => number);
  })(i);
}
console.log(callbacks.map(callback => callback()).join(', '));
```

```text output
1, 2, 3
```

For new code, a `let` loop is simpler: each iteration has its own binding. Save this complete browser example as `buttons.html` and open it. Each button reports its own number, including when activated with the keyboard.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>Numbered buttons</title>
<div id="buttons"></div>
<p id="result" role="status">Choose a button.</p>
<script>
  const container = document.querySelector('#buttons');
  const result = document.querySelector('#result');
  for (let number = 1; number <= 3; number++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `Button ${number}`;
    button.addEventListener('click', () => {
      result.textContent = `You chose button ${number}.`;
    });
    container.append(button);
  }
</script>
</html>
```

## Await asynchronous work

An async IIFE returns a promise. Handle its rejection at the call site. This deterministic example needs no server:

```js runnable
await (async () => {
  const message = await Promise.resolve('Ready');
  console.log(message);
})().catch(error => console.error(error.message));
```

```text output
Ready
```

In a classic browser script, omit the outer `await`; the `.catch(...)` still handles rejection. In an ES module, top-level `await` often removes the need for the wrapper. An async IIFE does not make later statements wait automatically.

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](../index.md#interview-preparation).

### 1. What is the difference between an IIFE and a function expression stored for later?

<details>
<summary>Answer and worked example</summary>

An IIFE invokes the newly created function immediately. Its result can expose selected behavior while keeping other bindings private.

```js runnable
const counter = (() => {
  let value = 0;
  return { next: () => ++value };
})();
console.log(counter.next(), counter.next());
console.log(Object.hasOwn(counter, 'value'));
```

**Expected output**

```text output
1 2
false
```

The private value belongs to the function environment, not to a property on the returned object. next retains access through a closure.

</details>

### 2. Are IIFEs still required for private top-level variables?

**Apply it:** A configuration value needs several statements to compute, but should be assigned only once. Compare an IIFE with a named initializer and a module.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

ES modules already have their own top-level scope, and blocks scope let/const. An IIFE remains useful for one-time expression-based initialization or a legacy classic-script boundary. An async IIFE returns a promise that still needs error handling.

**Applied answer:** a synchronous IIFE can compute and return the value on the right side of a `const` declaration while keeping temporary bindings local. A named `createConfig` function is often easier to test and reuse. A module already isolates top-level names, so wrapping its entire body in an IIFE rarely adds useful privacy.

If initialization becomes asynchronous, the result of the async IIFE is a **promise**, not the finished configuration. Await it at an appropriate startup boundary and handle rejection there, or expose a documented readiness promise. Calling an async IIFE without observing its result can let the application start with missing configuration and leave a failure unhandled.

**Check your explanation:** state when initialization runs, what the caller receives, and who owns failure handling. “Creates a private scope” answers only one part of the design question.

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| Pass a price and tax rate to an IIFE | Practice | Expected result: `80` and `0.25` return `100`<br />Check: The temporary tax variable stays local. | — |
| Create two independent counters | Practice | Expected result: Updating the first leaves the second at `0`<br />Check: Call a factory that creates a fresh closure each time. | — |
| Change the async operation to reject | Practice | Expected result: One useful error message appears<br />Check: Attach rejection handling to the returned promise. | — |

## Next steps

Compare [IIFEs with closures](./function-closure.md) and move a reusable module into [import/export](../import-and-export.md).
