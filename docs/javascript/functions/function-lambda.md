---
id: javascript-functions-function-lambda
slug: /javascript/functions/function-lambda
title: "Arrow functions and lexical this"
sidebar_label: "Arrow functions"
sidebar_position: 3
---

# Arrow functions and lexical this

An arrow function is a shorter way to write a function expression. Start with a small calculation such as changing a score into a percentage. Write it as an ordinary function first, then compare the arrow version.

1. Read the parameters before `=>` and the calculation after it.
2. Compare a single expression, which returns its result, with a block that needs an explicit `return`.
3. Learn the `this` difference before using an arrow as an object method.

Arrows keep `this` from the surrounding code; they do not receive a new one from each call. This is called **lexical `this`**. “Lambda” is a broader term for an anonymous function, and JavaScript also has ordinary anonymous function expressions. Arrows were introduced in ES2015.

## Expression bodies and block bodies

An expression body returns its expression. A block body needs an explicit `return`. Wrap an object literal in parentheses to distinguish it from a block.

```js runnable
const double = value => value * 2;
const describe = name => ({ name, length: name.length });
const logAndDouble = value => { return value * 2; };
console.log(double(4), logAndDouble(4));
console.log(JSON.stringify(describe('Ada')));
```

```text output
8 8
{"name":"Ada","length":3}
```

## Choose arrows for lexical this

An arrow captures `this` from its surrounding scope. It has no own `this`, `arguments`, or constructor behavior. Calling an arrow with `call`, `apply`, or `bind` cannot replace that lexical `this`.

```js runnable
const counter = {
  count: 3,
  readLater() {
    return () => this.count;
  },
};
const read = counter.readLater();
counter.count = 4;
console.log(read.call({ count: 100 }));
```

```text output
4
```

The outer method is a normal method, so `counter.readLater()` receives `counter` as `this`. The returned arrow retains that binding. It reads the current property value rather than capturing a frozen copy of the number.

Use a normal method when a receiver should determine `this`. Use rest parameters, such as `(...values) => values.length`, when an arrow needs a variable number of arguments. An arrow cannot be called with `new` and cannot be a generator, although it can be `async`.

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](../index.md#interview-preparation).

### 1. Can bind change the this captured by an arrow function?

<details>
<summary>Answer and worked example</summary>

No. An arrow uses lexical this from its creation context. bind can bind leading arguments, but it cannot replace that captured receiver.

```js runnable
const account = {
  balance: 7,
  reader() { return () => this.balance; },
};
const read = account.reader();
console.log(read.bind({ balance: 99 })());
account.balance = 8;
console.log(read());
```

**Expected output**

```text output
7
8
```

The ordinary reader method receives account as this. Its arrow keeps that receiver and reads the current balance each time; it does not save the number 7.

</details>

### 2. Why can returning an object from an arrow require parentheses?

**Apply it:** Spot why a map callback returns undefined even though its body contains a property-looking expression.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

After `=>`, braces start a statement body. Use `value => ({ value })` for an object expression or an explicit return in a block. Arrows also lack their own arguments object and cannot be invoked with new.

Compare a block containing a label with an object expression and an explicit return.

```js runnable
const wrong = value => { value: value };
const concise = value => ({ value });
const explicit = value => { return { value }; };

console.log(wrong(7));
console.log(JSON.stringify(concise(7)));
console.log(JSON.stringify(explicit(7)));
```

**Expected output**

```text output
undefined
{"value":7}
{"value":7}
```

In `wrong`, `value:` is a statement label, and reaching the end of the block returns `undefined`. Parentheses make the braces part of an object expression. When converting a concise arrow to a multiline block for logging, add `return` or the callback’s contract silently changes.

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| 1 — Transform names into `{name, length}` objects with `map`. | Practice | — | — |
| 2 — Replace an object method with an arrow and explain why its `this` changes. | Practice | — | — |
| 3 — Write an arrow that returns no value intentionally, then explain why passing it to `map` produces `undefined` entries. | Practice | — | — |

## Next steps

Reference: [MDN arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions). Continue with [callbacks](./function-callback.md) and [closures](./function-closure.md).
