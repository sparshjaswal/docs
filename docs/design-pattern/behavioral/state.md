---
id: design-pattern-behavioral-state
title: "State Pattern 🎛️"
slug: /design-pattern/behavioral/state
sidebar_label: "State"
---

# State Pattern 🎛️

State changes an object’s behavior according to its current stage. A task might be open, in progress, or complete, with different allowed actions at each stage.

## Example: application, verification, and approval flows {/* #javascript-walkthrough */}

This example uses ApplyFlow, VerfiyFlow, and ApproveFlow objects. A context stores a current flow and delegates its `process()` operation to that flow.

```js runnable
function Flow() {
  this.action = function () {};
}
function ApplyFlow() {
  Flow.call(this);
  this.action = function () {
    console.log(String("Apply -> ").trim());
  };
}
function VerfiyFlow() {
  Flow.call(this);
  this.action = function () {
    console.log(String("Verfiy -> ").trim());
  };
}

function ApproveFlow() {
  Flow.call(this);
  this.action = function () {
    console.log(String("Approve").trim());
  };
}
function Context() {
  this.flow = null;
  this.setFlow = function (flow) {
    this.flow = flow;
  };
  this.process = function () {
    this.flow.action();
  };
}
/////////////////////test///////////////////////////////////////////////////////
var context = new Context();
context.setFlow(new ApplyFlow());
context.process();
context.setFlow(new VerfiyFlow());
context.process();
context.setFlow(new ApproveFlow());
context.process();
```

```text output
Apply ->
Verfiy ->
Approve
```

<span id="walk-through-the-source" />
<span id="understand-the-collaboration" />

## How it works

State delegates behavior to an object representing the context’s current state. The context holds one flow, and `process()` forwards to its `action()` method. ApplyFlow, VerfiyFlow, and ApproveFlow implement that method with different messages.

The client installs each flow in turn and calls the same `process()` method. Replacing the flow changes the next result without conditionals inside the context.

## What the example does not establish

The client controls every transition. Actions do not advance the flow, check the previous state, or authorize a change; any flow can follow any other. Calling `process()` before assigning a flow fails. Stage names alone do not enforce a sequence.

## Practical case: news actions depend on the current state

A news item delegates available actions and transitions to its current state. View, edit, and verify states share the same contract, so the page asks the item for actions instead of repeating state checks around every button.

```js runnable
const states = {
  view: { actions: () => [], transitions: { edit: "edit" } },
  edit: { actions: () => ["Update"], transitions: { submit: "verify", cancel: "view" } },
  verify: {
    actions: () => ["Update", "Delete"],
    transitions: { approve: "view", revise: "edit" },
  },
};
class NewsItem {
  #state = states.view;
  actions() { return this.#state.actions(); }
  transition(event) {
    const allowed = this.#state.transitions;
    if (!Object.hasOwn(allowed, event)) throw new Error("Transition not allowed");
    this.#state = states[allowed[event]];
  }
}
const news = new NewsItem();
console.log(news.actions().join(", ") || "No actions");
news.transition("edit");
console.log(news.actions().join(", "));
news.transition("submit");
console.log(news.actions().join(", "));
news.transition("approve");
console.log(news.actions().join(", ") || "No actions");
try { news.transition("approve"); }
catch (error) { console.log(error.message); }
```

```text output
No actions
Update
Update, Delete
No actions
Transition not allowed
```

The action labels model the UI; they do not update or delete persisted news. Transition events are separate workflow decisions. The shared state objects contain behavior and rules, while each item holds its own current-state reference. Keep shared state definitions immutable in application code. A server must authorize actions and check the saved state atomically; hiding a button is not authorization.

## Design decisions and failure modes

State lets behavior depend on an explicit current state. A transition must preserve the domain’s allowed sequence, not merely switch an object reference.

## Exercises

Model draft, submitted, and approved. Attempt approval from draft and repeat approval after success.

<details>
<summary>Expected reasoning and checks</summary>

Reject the illegal transition or return a documented no-op, and define repeated actions explicitly. Keep the transition and its invariant together. Concurrent writers need version checks or another coordination mechanism outside this local example.

</details>

## Interview questions & answers

<details>
<summary>State or Strategy?</summary>

[Strategy](strategy.md) is usually selected by the caller to choose an algorithm. State is selected by lifecycle transitions and changes which operations are valid. The structures can be similar while their rules differ.

</details>

**Key takeaway:** Make legal transitions and repeated actions explicit.

## Continue reading

Use the shared [review checkpoint](../index.md#completion-checkpoint), then return to the [pattern catalog](../index.md).
