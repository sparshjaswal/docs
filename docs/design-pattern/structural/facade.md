---
id: design-pattern-structural-facade
title: "Facade Pattern 🏛️"
slug: /design-pattern/structural/facade
sidebar_label: "Facade"
---

# Facade Pattern 🏛️

A Facade gives a complicated set of parts one simple entry point. A “start movie” button might coordinate the screen, sound, and lights with one action.

## Example: coordinating light, music, and video {/* #javascript-walkthrough */}

This example places lighting, music, and video objects behind the facade’s `sing`, `dance`, and `act` operations. Each public operation coordinates a different subset of the subsystem.

```js runnable
function Light() {
  this.flash = function () {
    console.log(String("Flashing color light").trim());
  };
}
function Music() {
  this.play = function () {
    console.log(String("Playing classical music").trim());
  };
}
function Video() {
  this.show = function () {
    console.log(String("Mountain stream video display").trim());
  };
}
function Facade() {
  this.light = new Light();
  this.music = new Music();
  this.video = new Video();
  this.sing = function () {
    console.log(String("Start singing with").trim());
    this.light.flash();
    this.music.play();
  };
  this.dance = function () {
    console.log(String("Start dancing with").trim());
    this.light.flash();
    this.music.play();
    this.video.show();
  };
  this.act = function () {
    console.log(String("Start acting with").trim());
    this.light.flash();
    this.video.show();
  };
}
/////////////////////test///////////////////////////////////////////////////////
var facade = new Facade();
facade.sing();
console.log(String("------------------------------").trim());
facade.dance();
console.log(String("------------------------------").trim());
facade.act();
```

```text output
Start singing with
Flashing color light
Playing classical music
------------------------------
Start dancing with
Flashing color light
Playing classical music
Mountain stream video display
------------------------------
Start acting with
Flashing color light
Mountain stream video display
```

<span id="walk-through-the-source" />
<span id="understand-the-collaboration" />

## How it works

Facade supplies a convenient entry point over several components. `Light`, `Music`, and `Video` retain their own operations, while the client chooses an activity through `sing`, `dance`, or `act`.

Singing invokes light and music; dancing invokes light, music, and video; acting invokes light and video. The output follows those sequences. The facade constructs each component once and reuses it across activities, so the client does not have to repeat the coordination logic.

These methods arrange calls rather than replacing the subsystem APIs. They create a boundary between the client’s intent and the component-level sequence, with one central place to update when that sequence changes.

## What the example does not establish

The components only print messages. If one throws, the remaining synchronous calls in that activity do not run. The facade supplies neither atomic execution nor rollback for real side effects; simplifying access does not change the subsystem’s failure guarantees.

## Practical case: one entry point for form validation

A form needs several independent checks. The facade coordinates them and returns a single list of errors, so the UI does not need to remember which checks to call.

```js runnable
const requiredText = (value) => typeof value === "string" && value.trim() !== "";
const positiveNumber = (value) =>
  requiredText(value) && Number.isFinite(Number(value)) && Number(value) > 0;
const registration = {
  validate({ name, quantity }) {
    const errors = [];
    if (!requiredText(name)) errors.push("Name is required");
    if (!positiveNumber(quantity)) errors.push("Quantity must be positive");
    return errors;
  },
};
console.log(registration.validate({ name: "Mira", quantity: "2" }).length);
console.log(registration.validate({ name: " ", quantity: "abc" }).join("; "));
```

```text output
0
Name is required; Quantity must be positive
```

The facade simplifies the caller while individual checks stay reusable. This rule accepts positive fractional quantities; change the contract if only whole items are allowed. Browser validation helps people correct input, but the server must enforce its own rules. Facade organizes checks; it does not make a client trustworthy.

## Design decisions and failure modes

A facade makes a subsystem easier to use without making its partial failures disappear. “Place order” may reserve stock and then fail payment; one method name does not create a transaction.

## Exercises

Design a checkout facade. Fail the second dependency after the first succeeds and write the result the caller receives.

<details>
<summary>Expected reasoning and checks</summary>

Return enough state to recover or reconcile the partial outcome. Define compensation where appropriate and preserve operation identity. Keep dependency details out of ordinary callers while exposing meaningful failure categories.

</details>

## Interview questions & answers

<details>
<summary>When does a facade become a maintenance problem?</summary>

When it absorbs unrelated business decisions and becomes the owner of every workflow. Split by coherent use case rather than creating one universal service object.

</details>

**Key takeaway:** Simplify coordination without hiding failure semantics.

## Continue reading

Use the shared [review checkpoint](../index.md#completion-checkpoint), then return to the [pattern catalog](../index.md).
