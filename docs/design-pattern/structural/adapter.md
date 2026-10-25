---
id: design-pattern-structural-adapter
title: "Adapter Pattern 🔌"
slug: /design-pattern/structural/adapter
sidebar_label: "Adapter"
---

# Adapter Pattern 🔌

An Adapter changes one interface into the form a caller needs. Like a language translator, it lets two parts work together without making them use the same original format.

## Example: adapting the voltage interface {/* #javascript-walkthrough */}

This example uses a high-voltage plug returning 100 and an adapter returning 36 through the same `recharge()` operation. The arithmetic is a software illustration of interface adaptation.

```js runnable
function Plug() {
  this.recharge = function () {};
}
function HighVoltagePlug() {
  Plug.call(this);
  this.recharge = function () {
    return 100; // Power is 100 Voltage
  };
}

function AdapterPlug() {
  Plug.call(this);
  this.recharge = function () {
    var highPlug = new HighVoltagePlug();
    var highVoltage = highPlug.recharge();
    var lowVoltage = highVoltage - 64;
    return lowVoltage;
  };
}
/////////////////////test///////////////////////////////////////////////////////
var plug = new HighVoltagePlug();
console.log(String(plug.recharge() + " too much voltage ").trim());
plug = new AdapterPlug();
console.log(String("Adapter into " + plug.recharge() + " voltage").trim());
```

```text output
100 too much voltage
Adapter into 36 voltage
```

<span id="walk-through-the-source" />
<span id="understand-the-collaboration" />

## How it works

Adapter places a conversion between an existing operation and the result its caller expects. `HighVoltagePlug` supplies the existing value, while `AdapterPlug` exposes the same `recharge` method through the common `Plug` contract.

The direct call returns 100. Each adapted call constructs a new `HighVoltagePlug`, obtains 100, subtracts 64, and returns 36. Construction, delegation, and conversion happen in that order; the client neither supplies nor retains the wrapped plug.

The caller uses the same method name for both objects, but their result contracts differ. Interface compatibility therefore involves the meaning of a result as well as the spelling of the operation.

## What the example does not establish

The numeric subtraction is a teaching model, not an electrical conversion procedure. The fixed values tightly couple the adapter to this concrete source; the example has no validation or configurable transformation.

## Practical case: one data source, two menu interfaces

A service returns products using `productId`, `displayName`, and `imagePath`. A dropdown expects `value` and `label`; a gallery expects `src` and `alt`. Each adapter translates the same source data into its consumer's contract.

```js runnable
const products = [
  { productId: 7, displayName: "Notebook", imagePath: "/notebook.png" },
];
const dropdownAdapter = (items) => items.map((item) => ({
  value: String(item.productId), label: item.displayName,
}));
const galleryAdapter = (items) => items.map((item) => ({
  src: item.imagePath, alt: item.displayName,
}));
function dropdownLabels(options) {
  return options.map((option) => `${option.value}: ${option.label}`).join(", ");
}
function galleryLabels(images) {
  return images.map((image) => `${image.alt} (${image.src})`).join(", ");
}
console.log(dropdownLabels(dropdownAdapter(products)));
console.log(galleryLabels(galleryAdapter(products)));
console.log(products[0].productId);
```

```text output
7: Notebook
Notebook (/notebook.png)
7
```

The console displays the adapted data; it does not load an image. Conversion creates new records and leaves the source untouched. Validate required fields at the service boundary, and define how missing images or IDs are handled. If both components already accept the same contract, extra adapters add little value.

## Design decisions and failure modes

An adapter translates an existing interface into the caller’s contract. Unit and error mismatches matter as much as method names: dollars are not integer cents, and a timeout is not “not found.”

## Exercises

Adapt two shipping quotes: one returns cents, the other a decimal currency string. Define rounding, currency, and timeout behavior.

<details>
<summary>Expected reasoning and checks</summary>

Normalize only differences that the shared contract can represent. Preserve unknown outcomes and unsupported currencies rather than inventing success. Test boundary values and failure translation against provider fixtures.

</details>

## Interview questions & answers

<details>
<summary>Adapter or Facade?</summary>

[Facade](facade.md) simplifies a subsystem’s entry points. Adapter makes an existing interface compatible with a required one. A wrapper can serve both roles, but the reason for it should be explicit.

</details>

**Key takeaway:** Translate semantics, not only names.

## Continue reading

Use the shared [review checkpoint](../index.md#completion-checkpoint), then return to the [pattern catalog](../index.md).
