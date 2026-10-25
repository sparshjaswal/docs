---
id: design-pattern-creational-factory-method
title: "Factory Method Pattern 🏭"
slug: /design-pattern/creational/factory-method
sidebar_label: "Factory Method"
---

# Factory Method Pattern 🏭

A factory chooses which object to create so the caller can use a common operation. This example uses a simple factory for airplane choices; the limitations below explain how that differs from Factory Method.

## Example: choosing an airplane {/* #javascript-walkthrough */}

The factory chooses Banshee, B747fly, or A380fly from a radio-button value. Each result supports `shoot`, but supplies a different message about its bullets.

```html
<input type="radio" name="fly" value="1" onclick="doCreate(this)" /> Banshee
<input type="radio" name="fly" value="2" onclick="doCreate(this)" /> B747fly
<input type="radio" name="fly" value="3" onclick="doCreate(this)" /> A380fly
<br /><br />
<span id="result"></span>
<script type="text/javascript">
  function Fly() {
    this.shoot = function () {};
  }
  function Banshee() {
    this.shoot = function () {
      document.getElementById("result").innerHTML = "Banshee fire the laser";
    };
  }
  Banshee.prototype = new Fly();
  function B747fly() {
    this.shoot = function () {
      document.getElementById("result").innerHTML = "B747 fire the missile";
    };
  }
  B747fly.prototype = new Fly();
  function A380fly() {
    this.shoot = function () {
      document.getElementById("result").innerHTML =
        "A380 fire the trigeminal shot";
    };
  }
  A380fly.prototype = new Fly();

  var FlyFactory = {
    create: function (type) {
      var fly = null;
      if (type == 1) {
        fly = new Banshee();
      } else if (type == 2) {
        fly = new B747fly();
      } else if (type == 3) {
        fly = new A380fly();
      }
      return fly;
    },
  };
  /////////////////////test///////////////////////////////////////////////////////
  function doCreate(obj) {
    var fly = FlyFactory.create(obj.value);
    fly.shoot();
  }
</script>
```

**Expected interaction:** Select each airplane option. The result displays the Banshee laser, B747 missile, or A380 trigeminal-shot message.

<span id="walk-through-the-source" />
<span id="understand-the-collaboration" />

## How it works

`FlyFactory` centralizes the mapping from a radio-button value to an airplane constructor. The browser passes the clicked input to `doCreate`, which sends its string value to the factory. The loose equality checks match that string against the numeric literals `1`, `2`, and `3`.

The selected product exposes `shoot`, so the caller invokes the same operation without checking its concrete constructor. Each airplane writes its own message into the shared result element. Creation varies inside the factory while the client’s final call stays the same.

## What the example does not establish

This is a **simple factory**: it has no creator subclass overriding a construction step, as Factory Method would. Adding another airplane still requires changing the factory’s branch list. An unknown selection returns `null`, causing the subsequent `shoot` call to fail; the example provides no recovery policy.

## Practical case: a drawing tool with a factory method

A drawing tool has a shared `draw()` workflow, but each tool creates a different shape. Here `createShape()` is the factory method: subclasses override creation while inheriting the caller's workflow.

```js runnable
class Rectangle {
  drawingCommand() { return "rectangle at (0, 0), width 20, height 10"; }
}
class Circle {
  drawingCommand() { return "circle at (10, 10), radius 5"; }
}
class DrawingTool {
  createShape() { throw new Error("Implement createShape"); }
  draw() {
    const shape = this.createShape();
    return `Draw ${shape.drawingCommand()}`;
  }
}
class RectangleTool extends DrawingTool {
  createShape() { return new Rectangle(); }
}
class CircleTool extends DrawingTool {
  createShape() { return new Circle(); }
}
for (const tool of [new RectangleTool(), new CircleTool()]) {
  console.log(tool.draw());
}
```

```text output
Draw rectangle at (0, 0), width 20, height 10
Draw circle at (10, 10), radius 5
```

These are drawing instructions printed to the console. A canvas application would make each shape draw through a supplied rendering context. Unlike the earlier branch-based factory, this version extends creation by adding a tool subclass. A small application with only two fixed shapes may be clearer with a single factory function.

## Design decisions and failure modes

The creator owns a workflow but delegates which product it creates. A subclass returning an incompatible product moves a failure far from construction, where the workflow first uses the missing behavior.

## Exercises

Add a second drawing-tool product and run the same drawing workflow against both. Make one product omit an operation and locate the failure.

<details>
<summary>Expected reasoning and checks</summary>

The workflow should use the product contract without checking concrete types. Check construction and the first meaningful product operation together. If a switch in one function already expresses the only variation clearly, subclassing may add little.

</details>

## Interview questions & answers

<details>
<summary>How does Factory Method differ from Abstract Factory?</summary>

[Abstract Factory](abstract-factory.md) creates a family of related products. Factory Method exposes a creation step in a creator; subclasses choose that step’s product.

</details>

**Key takeaway:** Keep the workflow stable and verify the product promise.

## Continue reading

Use the shared [review checkpoint](../index.md#completion-checkpoint), then return to the [pattern catalog](../index.md).
