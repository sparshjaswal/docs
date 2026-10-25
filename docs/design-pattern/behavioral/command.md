---
id: design-pattern-behavioral-command
title: "Command Pattern 🎮"
slug: /design-pattern/behavioral/command
sidebar_label: "Command"
---

# Command Pattern 🎮

A Command stores an action so another part can run it later. A button can hold an action without knowing how that action works.

## Example: ok and cancel button actions {/* #javascript-walkthrough */}

This example assigns a callback to each Button and lets Mouse invoke a button without knowing its action. OK and Cancel use different command functions.

```js runnable
function Mouse() {
  this.click = function (button) {
    button.onClick();
  };
}
function Button(name) {
  this.name = name;
  this.command = null;
  this.addEventLisnener = function (command) {
    this.command = command;
  };

  this.onClick = function () {
    this.command();
  };
}
var okCommand = function () {
  console.log(String("OK button is clicked ").trim());
};
var cancelCommand = function () {
  console.log(String("Cancel button is clicked ").trim());
};
var okButton = new Button("Ok");
okButton.addEventLisnener(okCommand);
var cancelButton = new Button("Cancel");
cancelButton.addEventLisnener(cancelCommand);
var mouse = new Mouse();
mouse.click(okButton); // Mouse click OK button
mouse.click(cancelButton); // Mouse click Cancel button
```

```text output
OK button is clicked
Cancel button is clicked
```

<span id="walk-through-the-source" />
<span id="understand-the-collaboration" />

## How it works

Command packages an action so its invoker does not need the action’s implementation. Here `okCommand` and `cancelCommand` are functions. A Button’s `addEventLisnener` stores one without executing it.

Execution happens when `Mouse.click` calls the button’s `onClick`, which invokes the stored function. Both buttons use this path to print their respective messages. The button’s name is data rather than a condition selecting its action, so Mouse needs no knowledge of either message.

## What the example does not establish

These are ordinary object calls, not DOM event listeners. A button must have a command installed before it is clicked. The example provides no undo, redo, persistent command log, or argument serialization.

## Practical case: close and restore a menu

The button invokes a command; the command knows how to change the menu. Remembering the previous visibility makes this particular action undoable.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>Menu command</title>
<nav id="menu" aria-label="Topics"><p>JavaScript · Python · Design patterns</p></nav>
<button id="close">Close menu</button>
<button id="undo" disabled>Undo close</button>
<script>
  const menu = document.querySelector("#menu");
  const closeButton = document.querySelector("#close");
  const undoButton = document.querySelector("#undo");
  function closeCommand(target) {
    let previousHidden = null;
    return {
      execute() { previousHidden = target.hidden; target.hidden = true; },
      undo() {
        if (previousHidden !== null) target.hidden = previousHidden;
        previousHidden = null;
      },
    };
  }
  const command = closeCommand(menu);
  closeButton.addEventListener("click", () => {
    command.execute();
    closeButton.disabled = true;
    undoButton.disabled = false;
  });
  undoButton.addEventListener("click", () => {
    command.undo();
    closeButton.disabled = false;
    undoButton.disabled = true;
  });
</script>
</html>
```

**Expected interaction:** Close hides the menu and enables Undo. Undo restores it, and the cycle can repeat.

This stores one action's previous value. Multiple undo steps require a history of distinct executed commands. Irreversible external actions need a separate compensation policy; giving a command an `undo` method does not reverse a network side effect.

## Design decisions and failure modes

A command represents an intention that can be passed or recorded. An in-memory closure is useful locally but cannot automatically be persisted and replayed after a restart.

## Exercises

Represent “rename task” as data with a command ID. Replay it twice and explain whether undo can safely restore the old title after another editor has changed it.

<details>
<summary>Expected reasoning and checks</summary>

Execution needs identity, validation, and a duplicate policy. Undo may require a version precondition or a compensating action; it is not always a literal inverse. Persistent commands also need schema and authorization checks at execution time.

</details>

## Interview questions & answers

<details>
<summary>Command or Strategy?</summary>

[Strategy](strategy.md) selects how a job is performed. Command packages a request and its execution intent. A queue of commands can each invoke a selected strategy.

</details>

**Key takeaway:** Recording intent does not guarantee safe replay or undo.

## Continue reading

Use the shared [review checkpoint](../index.md#completion-checkpoint), then return to the [pattern catalog](../index.md).
