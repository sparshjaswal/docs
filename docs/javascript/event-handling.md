---
id: javascript-event-handling
slug: /javascript/event-handling
title: "Events, delegation, and cleanup"
sidebar_label: "Events, delegation, and cleanup"
---

# Events, delegation, and cleanup

An event is a signal that something happened: a button was clicked, a key was pressed, or data became available. A **listener** is a function that runs in response. A useful first project is a button that adds one item to a list.

1. Attach one listener and inspect the event it receives.
2. Learn how a browser event travels through nested elements.
3. Use **delegation** when one parent listener should handle events from many children.
4. Remove listeners when the feature no longer needs them.

Complete the [DOM introduction](./document-object-model.md) first. Start with browser examples; the Node.js EventEmitter section is a separate environment with different dispatch and error rules.

## Browser event propagation

In the DOM, an event has a target and travels through a propagation path. Capture listeners run on the way toward the target; bubble listeners run outward when the event bubbles. `event.target` and `event.currentTarget` can be different elements.

## A complete delegated interaction

Save this as an HTML file and open it in a browser. Each button has a native accessible role and name; keyboard activation works without a custom key handler.

```html
<!doctype html>
<html lang="en">
  <meta charset="utf-8">
  <title>Reading list</title>
  <ul id="books">
    <li>JavaScript <button type="button" data-remove>Remove JavaScript</button></li>
    <li>Testing <button type="button" data-remove>Remove Testing</button></li>
  </ul>
  <p id="status" role="status"></p>
  <script type="module">
    const list = document.querySelector('#books');
    const status = document.querySelector('#status');
    const lifetime = new AbortController();
    list.addEventListener('click', event => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest('button[data-remove]');
      if (!button || !list.contains(button)) return;
      const item = button.closest('li');
      if (!item || item.parentElement !== list) return;
      item.remove();
      status.textContent = `${list.children.length} books remaining`;
    }, { signal: lifetime.signal });
    // Call lifetime.abort() when disposing this view to remove its listener.
  </script>
</html>
```

One listener on the stable parent handles its current and future matching children. `closest` handles clicks on nested content inside a button. Use `textContent` for untrusted text rather than constructing HTML strings.

## Similar methods, different effects

| API | Effect |
| --- | --- |
| `preventDefault()` | Requests cancellation of a cancelable default action |
| `stopPropagation()` | Stops further propagation along the path |
| `stopImmediatePropagation()` | Also stops remaining listeners on the same target |
| `{ once: true }` | Removes a listener after its first invocation |
| `{ signal }` | Removes a listener when the signal is aborted |

Passive listeners cannot cancel default behavior. Removing a listener manually requires the same function reference and compatible capture setting used during registration. Shadow DOM can retarget events; inspect `composedPath()` when working across component boundaries.

## Custom browser events

In the browser console on the reading-list example, run:

```js
const books = document.querySelector('#books');
books.addEventListener('book:added', event => {
  console.log(event.detail.title);
}, { once: true });
books.dispatchEvent(new CustomEvent('book:added', {
  detail: { title: 'Language Design' },
  bubbles: true,
}));
```

This logs `Language Design`. `detail` carries the payload; it does not validate or clone it. `dispatchEvent` invokes listeners synchronously. `bubbles`, `cancelable`, and `composed` default to false, so set the flags your component contract needs. A custom event is an application notification; it does not automatically perform a native browser action. [DOM CustomEvent](https://dom.spec.whatwg.org/#interface-customevent).

## Node.js EventEmitter

An `EventEmitter` is an in-process publisher with named events. It has no DOM tree, capture phase, or bubbling. Its `emit` method calls registered listeners synchronously in registration order; it does not enqueue a task or await promises returned by listeners.

```js runnable
import { EventEmitter } from 'node:events';

const orders = new EventEmitter();
const record = order => console.log(`record ${order.id}`);
orders.on('placed', record);
orders.once('placed', order => console.log(`first ${order.id}`));

console.log('before');
orders.emit('placed', { id: 7 });
orders.emit('placed', { id: 8 });
orders.off('placed', record);
console.log('listeners', orders.listenerCount('placed'));
```

```text output
before
record 7
first 7
record 8
listeners 0
```

`on` subscribes, `once` removes its registration after the first invocation, and `off` removes a matching listener by reference. Give subscriptions an owner and a teardown step. A listener that throws interrupts ordinary synchronous dispatch; an async listener's rejection needs an explicit policy. Emitting the special `'error'` event without an error listener throws. The `captureRejections` option can route rejected listener promises to error handling, but does not make `emit` await listeners. [Node events reference](https://nodejs.org/api/events.html).

Choose promises when one operation needs one eventual result, and an event emitter when consumers need a sequence of notifications. Combine them only with clear rules for completion, errors, cancellation, and buffering. See [async iteration](./collections-and-iteration.md#async-iteration) for consuming streams of values.

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](./index.md#interview-preparation).

### 1. Why should a delegated click handler use closest rather than only matching event.target?

<details>
<summary>Answer and worked example</summary>

A click can target a nested span or icon inside the intended button. closest locates the relevant control, and a containment check limits it to the listener’s region. Save this as `delegation-demo.html`, open it, and click the word Remove.

```html
<!doctype html>
<html lang="en">
  <meta charset="utf-8">
  <title>Delegated removal</title>
  <ul id="items"><li>Book <button type="button" data-remove><span>Remove</span></button></li></ul>
  <p id="status" role="status"></p>
  <script>
    const list = document.querySelector('#items');
    list.addEventListener('click', event => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest('button[data-remove]');
      if (!button || !list.contains(button)) return;
      const item = button.closest('li');
      if (!item || item.parentElement !== list) return;
      item.remove();
      document.querySelector('#status').textContent = `${list.children.length} items`;
    });
  </script>
</html>
```

**Expected displayed status**

```text output
0 items
```

The displayed status becomes 0 items. The listener remains on the parent and can handle subsequently added matching items. The native button also supports keyboard activation; a production list should deliberately move focus after removing the focused control.

</details>

### 2. How do preventDefault, stopPropagation, and stopImmediatePropagation differ?

**Apply it:** A child has listeners A and B, registered in that order, and its parent has a bubbling listener P. Predict what happens when A calls each event-control method.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

preventDefault requests cancellation of a cancelable default action and does not stop propagation. stopPropagation stops further travel along the path. stopImmediatePropagation also prevents remaining listeners on the current target. Passive listeners cannot cancel default actions.

Assume no capture listeners, no other code stops the event, and A is non-passive. The default-action column assumes the event is cancelable and has a default action.

| What A calls | Listeners that run | Default action |
| --- | --- | --- |
| `preventDefault()` | A, B, P | Cancellation requested |
| `stopPropagation()` | A, B | Not canceled by this call |
| `stopImmediatePropagation()` | A | Not canceled by this call |

Propagation controls listener dispatch; cancellation controls the event’s default action. If the goal is to keep a form on the page while handling submission, listen for `submit` and cancel its default action when appropriate, rather than stopping click propagation and assuming submission is prevented.

A passive listener promises not to cancel the default action, so `preventDefault` there cannot provide the intended cancellation. Capture listeners that already ran cannot be “undone” by a later call on the child. Include registration phase and listener order in any output-order answer.

</details>

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](./workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 17. Browser events and network data {/* #workbook-17 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** connect a browser button to a changing value.

Save the complete example as an HTML file and open it in a browser. Each click adds one to `count` and writes the new value to the button's text. The script appears after the button, so the element exists before it is selected.

Use [browser event propagation](#browser-event-propagation) for nested elements and [the complete delegated interaction](#a-complete-delegated-interaction) for cleanup. This example needs a browser, not a Node `.mjs` file. The network follow-up uses the [request failure and state lesson](./browser-state-and-network.md).

**Worked example**

```html
<!doctype html>
<button id="counter">0</button>
<script>
  const button = document.querySelector("#counter");
  let count = 0;
  button.addEventListener("click", () => {
    count += 1;
    button.textContent = String(count);
  });
</script>
```

**Expected output**

```text
The button starts at 0. Each click increases the displayed number by 1.
```

The callback runs when the click occurs, not when the listener is registered. It closes over count. The DOM update displays a string, while the stored count remains numeric.

**Trace the example step by step**

1. The browser parses the button before reaching the script, so the selector can find it.

2. The script stores the element reference and initializes count to 0, matching the initial visible label.

3. addEventListener registers a function that closes over count and button. The script then finishes its setup.

4. Each click increments count and converts it to text for display. After two clicks both the numeric state and visible label represent 2.

**Common mistakes and how to reason about them**

Check element existence when the HTML structure may vary. Use textContent for user-provided text so it is displayed as text. Register listeners once during setup rather than accidentally adding another listener on each render. For forms, input.value is text; convert and validate before arithmetic. Event bubbling also means event.target can differ from the element holding the listener.

</details>

Find **17A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-17-answer">
<summary>Check your reasoning and answer</summary>

**17A.** null. Accessing a property on that null value would throw.

The result is null, representing the absence of a matching element. Calling addEventListener on null would throw. Check the selector, the HTML, and whether the script runs before the element is available.

**17B.** fetch can resolve normally for an HTTP error response such as 404 or 500.

A 404 or 500 is still an HTTP response, so fetch can fulfill with it. response.ok distinguishes statuses in the successful range. Checking it lets you choose an explicit failure path before treating the response body as valid application data.

**17C.** Place the reset button before the script, then attach the listener below. It shares the existing count and button variables.

Reset both count and button.textContent. Then click once and verify that the result is 1. This test reveals a reset that changes only the screen while leaving the stored count unchanged. Add the new listener inside the existing script after both elements exist.

**Reference code**

```js
// Add this HTML before the script:
// <button id="reset">Reset</button>
document.querySelector("#reset").addEventListener("click", () => {
  count = 0;
  button.textContent = "0";
});
```

**Check the result**

Place the reset button before the existing script, and add the JavaScript listener inside that script. Open the HTML file, click the counter twice, reset it, and click once more. The labels should be 1, 2, 0, and 1 in that order.

</details>

<span id="practice" />

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **17A — What does querySelector return when no element matches?** | **Must fix** | [Worked example](#workbook-17) | [Answer](#workbook-17-answer) |
| **17B — Why must code check response.ok after fetch?** | **Must fix** | [Worked example](#workbook-17) | [Answer](#workbook-17-answer) |
| **17C — Add a second button with id="reset" that sets count and the displayed counter back to 0.** | **Must fix** | [Worked example](#workbook-17) | [Answer](#workbook-17-answer) |
| Add a new item after the listener is registered and verify delegation still works. Test keyboard activation and focus after deleting the focused item; choose a sensible next focus target. Add a dispose function and prove old listeners no longer respond. | Practice | — | — |
| For the Node example, register two ordinary listeners and trace their order relative to the statement after `emit`. Add teardown and show that subsequent notifications no longer invoke them. Explain why returning a promise from a listener does not delay `emit`. | Practice | — | — |

## Continue learning

References: [DOM event dispatch](https://dom.spec.whatwg.org/#dispatching-events), [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener). Continue with [storage, forms, and network state](./browser-state-and-network.md) and [the reading-list project](./projects.md#reading-list).
