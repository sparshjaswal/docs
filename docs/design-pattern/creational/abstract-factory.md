---
id: design-pattern-creational-abstract-factory
title: "Abstract Factory Pattern 🏭🔧"
slug: /design-pattern/creational/abstract-factory
sidebar_label: "Abstract Factory"
---

# Abstract Factory

An Abstract Factory creates a set of objects designed to work together. Think of choosing a matching set of form controls for one theme, rather than choosing one button at a time.

## Practical case: matching button and checkbox families {/* #javascript-walkthrough */}

Choose a theme factory once, then let it create both controls. The caller depends on `createButton()` and `createCheckbox()`; it does not choose each control's theme separately.

```js runnable
const lightFactory = {
  createButton: () => ({ render: () => "Light button" }),
  createCheckbox: () => ({ render: () => "Light checkbox" }),
};
const darkFactory = {
  createButton: () => ({ render: () => "Dark button" }),
  createCheckbox: () => ({ render: () => "Dark checkbox" }),
};
function renderSettings(factory) {
  return [factory.createButton().render(), factory.createCheckbox().render()];
}
console.log(renderSettings(lightFactory).join(" + "));
console.log(renderSettings(darkFactory).join(" + "));
```

```text output
Light button + Light checkbox
Dark button + Dark checkbox
```

The strings stand in for rendered controls. One factory supplies a matching family. Adding another theme is straightforward, while adding a new control type requires updating every family. JavaScript relies on these factories honoring the same contract; tests or types can catch a missing operation.

## Design decisions and failure modes

Matching families are the constraint: a light button and dark checkbox may each be valid alone while violating the selected theme. Choose one factory at the application boundary and pass it to the code that creates controls.

## Exercises

Add a high-contrast family, then add a date picker to every family. Which change stays local, and which crosses all factories?

<details>
<summary>Expected reasoning and checks</summary>

The new family can implement the existing creation operations without changing the consumer. A new product kind changes the family contract, so every factory and its tests must be updated. A missing operation should fail a shared factory contract check before deployment.

</details>

## Interview questions & answers

<details>
<summary>When is this different from Factory Method?</summary>

[Factory Method](factory-method.md) varies creation of a product within a creator workflow. Abstract Factory supplies a related product family. Use a simple factory function when there is only one product and no family invariant.

</details>

**Key takeaway:** Choose the family once; test every product contract across every family.

## Continue reading

Use the shared [review checkpoint](../index.md#completion-checkpoint), then return to the [pattern catalog](../index.md).
