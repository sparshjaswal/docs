---
title: Semantic HTML and accessible forms
sidebar_label: 1. HTML and forms
sidebar_position: 1
description: Build a task form that works with a keyboard, reports errors, and preserves user input.
---

# Semantic HTML and accessible forms

## Overview

HTML describes what content means. A form collects named values and submits an action; a button already supports keyboard activation. Start here before adding a component framework. You need basic [DOM](../javascript/document-object-model.md) and [event](../javascript/event-handling.md) knowledge for the optional JavaScript enhancement.

## Why it exists

A clickable rectangle may look like a button while lacking its keyboard behavior, accessible name, or form semantics. Native elements supply useful behavior that custom controls would have to recreate. Labels and understandable feedback help users complete the operation. See the [W3C forms tutorial](https://www.w3.org/WAI/tutorials/forms/).

## Mental model

Think of a form as a conversation: name the information needed, accept a response, explain a problem, and confirm the outcome. A red border alone does not explain which value failed or how to repair it.

## How it works

This is a complete form fragment. It requires a server that accepts `POST /tasks`; it is not a standalone backend.

```html
<form action="/tasks" method="post">
  <label for="task-title">Task title</label>
  <input id="task-title" name="title" required maxlength="100"
         aria-describedby="title-help" />
  <p id="title-help">Use a short description, up to 100 characters.</p>
  <button type="submit">Add task</button>
</form>
```

The label identifies the input, `name` identifies its submitted value, and `submit` supports Enter as well as clicking. Listen to the form's `submit` event when enhancing it with JavaScript. Browser validation helps users; the server must still validate input and authorize the action.

## Real-world example

Open the [local task-form demo](pathname:///examples/frontend/task-form/). It runs entirely in the browser and loses tasks on reload. Submit whitespace, then a valid title. The first attempt keeps your input and explains the problem; the second adds a task and announces success. Mark the task complete using only the keyboard.

## Trade-offs

Native validation is a useful baseline. Custom validation can explain domain rules, but you then own error wording, field associations, focus behavior, and translation. A form library reduces repeated work only if its controls preserve those contracts.

## Failure scenarios

| Trigger | Symptom | Detection and recovery |
| --- | --- | --- |
| Placeholder used as the only label | Field identity disappears after typing | Inspect its accessible name; add a persistent label. |
| Handler attached only to a click | Keyboard submission follows a different path | Submit with Enter; handle the form event. |
| Request fails after the draft is cleared | User must retype their work | Simulate failure; clear input only after confirmed success. |
| Error conveyed only by color | Some users cannot identify the problem | Add specific text associated with the field. |

## Production considerations

For server submission, preserve the draft while saving and give an explicit retry path. Do not announce a timeout as proof that a write failed: the server may have saved it. Use an operation identifier or reconciliation when duplicate creation matters; see [API contracts](../system-design/interfaces/api-design.md). Keep sensitive values out of URLs, logs, and telemetry.

## Exercises

1. Remove the label and inspect the field with a screen reader or accessibility tree. Restore it and compare the accessible name.
2. Add a simulated failed save. The expected result is retained text, a visible explanation, and an operable retry.

<details>
<summary>What a good recovery implementation does</summary>

Track the draft separately from the save outcome. Associate field errors with the input, set `aria-invalid` while invalid, and remove it when corrected. Announce a success or failure without moving focus unexpectedly. The demo validates local input; network uncertainty needs the separate save contract above.

</details>

## Interview questions & answers

<details>
<summary>Why do server checks remain necessary when the input is required?</summary>

A caller can bypass the page entirely. Browser constraints improve interaction; server validation and authorization enforce the operation's rules.

</details>

**Revision cues:** label → name → submit → feedback → retained draft. **Key takeaways:** prefer native behavior, make errors actionable, and separate successful input validation from successful persistence.

**Next:** [Responsive CSS](responsive-css.md). **Further reading:** [W3C error and success notifications](https://www.w3.org/WAI/tutorials/forms/notifications/).
