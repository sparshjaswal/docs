---
id: design-pattern-structural-flyweight
title: "Flyweight Pattern 🪶"
slug: /design-pattern/structural/flyweight
sidebar_label: "Flyweight"
---

# Flyweight Pattern 🪶

A Flyweight saves repeated data by sharing the part many objects can use safely. Data that belongs to one use stays separate. This example starts with a cache, which stores values for later lookup.

## Example: caching values by key {/* #javascript-walkthrough */}

This example stores a number, a string, and a Person object in a cache and retrieves them by key.

```js runnable
function Person(name) {
  this.name = name;
  this.getName = function () {
    return this.name;
  };
  this.setName = function (name) {
    this.name = name;
  };
}
var Cache = {
  map: {},
  get: function (key) {
    return Cache.map[key];
  },
  put: function (key, value) {
    Cache.map[key] = value;
  },
};
/////////////////////test///////////////////////////////////////////////////////
// Basic data types are stored in the cache
Cache.put("1", 1000);
// String are stored in the cache
Cache.put("name", "Grace");
// Object are stored in the cache
Cache.put("person", new Person("Sala"));
// Get data from the cache
console.log(String("int : " + Cache.get("1") + "").trim());
console.log(String("String : " + Cache.get("name") + "").trim());
var person = Cache.get("person");
console.log(String("Person Object : " + person.getName() + "").trim());
```

```text output
int : 1000
String : Grace
Person Object : Sala
```

<span id="walk-through-the-source" />
<span id="understand-the-collaboration" />

## How it works

Flyweight reduces repeated state by sharing the part that can safely be common. Shared data is often called intrinsic state; information that varies per use is extrinsic state. A cache can help locate shared objects.

In this implementation, `Cache.put` stores values on one map object and `Cache.get` retrieves them. The number and string are values; the Person entry is an object reference. Retrieving it returns the original Person, whose `getName()` prints Sala, without cloning or allocating a second Person.

That retained reference also retains mutable state: consumers of the cached Person would observe changes to its `name`. Sharing an object and deciding whether it is safe to mutate are separate design decisions.

## What the example does not establish

This listing demonstrates storage and lookup without separating shared intrinsic state from per-use extrinsic state. It neither compares memory use nor shows multiple contexts supplying their own state, so a cache alone does not establish the Flyweight pattern. The ordinary map object also has inherited keys, and the sample has no eviction policy.

## Practical case: shared product data in a shopping cart

Many cart lines can refer to the same product. Share stable product information and keep quantity on each line. This is the intrinsic/extrinsic split that a general cache alone does not demonstrate.

```js runnable
const catalog = new Map([
  ["notebook", Object.freeze({ name: "Notebook", unitPriceCents: 399 })],
]);
function cartLine(productId, quantity) {
  const product = catalog.get(productId);
  if (!product || !Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Unknown product or invalid quantity");
  }
  return { product, quantity };
}
const first = cartLine("notebook", 1);
const second = cartLine("notebook", 3);
console.log(first.product === second.product);
console.log(first.quantity, second.quantity);
console.log(second.product.unitPriceCents * second.quantity);
```

```text output
true
1 3
1197
```

The product is shared; quantities are independent. Sharing helps when repeated product data costs more than the lookup and references. Version shared catalog data deliberately when prices change. Checkout must use authoritative prices rather than trusting a browser's cached price.

### Persisting the cart is a separate concern

Saving a cart to `localStorage` preserves data between page loads. JSON serialization does not preserve shared object identity: store product IDs and quantities, then resolve IDs through the catalog when loading.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>Cart storage</title>
<button id="add">Add notebook</button>
<p id="cart" role="status"></p>
<script>
  const key = "pattern-demo-cart-v1";
  let quantity = 0;
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? "null");
    if (saved?.productId === "notebook" &&
        Number.isSafeInteger(saved.quantity) && saved.quantity >= 0) {
      quantity = saved.quantity;
    }
  } catch { /* Invalid or unavailable storage starts an empty cart. */ }
  const output = document.querySelector("#cart");
  const render = (note = "") => {
    output.textContent = `Notebook: ${quantity}. ${note}`;
  };
  document.querySelector("#add").addEventListener("click", () => {
    if (quantity >= Number.MAX_SAFE_INTEGER) return;
    quantity++;
    try {
      localStorage.setItem(key, JSON.stringify({ productId: "notebook", quantity }));
      render("Saved.");
    } catch {
      render("Storage unavailable; this change lasts for this page only.");
    }
  });
  render();
</script>
</html>
```

**Expected interaction:** Add two notebooks on a fresh page, then reload. The quantity remains two when storage is available. Corrupt or incompatible stored data starts at zero; a failed write keeps the current page usable.

[`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) stores strings per origin and can be unavailable. This example does not coordinate concurrent edits in multiple tabs. Persistence, cache freshness, and memory sharing are different responsibilities.

## Design decisions and failure modes

Flyweight shares intrinsic data while callers supply per-use state. Accidentally sharing a mutable position makes multiple displayed objects move together.

## Exercises

Model 1,000 glyphs using shared font and shape data. Identify which values belong to the shared object and which belong to each placement.

<details>
<summary>Expected reasoning and checks</summary>

Font and immutable glyph shape can be shared by a complete key; position, selection, and document identity remain per placement. Measure retained memory before and after. Bound the pool so ever-new keys do not become an unbounded cache.

</details>

## Interview questions & answers

<details>
<summary>How is this different from arbitrary caching?</summary>

The key design decision is separating shared intrinsic state from extrinsic context. A cache may reuse whole results without that separation. Flyweight adds lookup and indirection costs.

</details>

**Key takeaway:** Share immutable intrinsic data and bound the pool.

## Continue reading

Use the shared [review checkpoint](../index.md#completion-checkpoint), then return to the [pattern catalog](../index.md).
