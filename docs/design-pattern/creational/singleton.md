---
id: design-pattern-creational-singleton
title: "Singleton Pattern 🏯"
slug: /design-pattern/creational/singleton
sidebar_label: "Singleton"
---

# Singleton Pattern 🏯

A Singleton gives several callers access to one shared object. Think of one shared settings sheet: changing it affects everyone who reads it.

## Example: one shared object {/* #javascript-walkthrough */}

This example stores an `instance` property on a Singleton object and creates the shared value only when `getInstance()` first runs.

```js runnable
var Singleton = {
  instance: null,
  getInstance: function () {
    if (Singleton.instance == null) {
      // there is only one instance
      Singleton.instance = {};
    }
    return Singleton.instance;
  },
};
/////////////////////test/////////////////////////
var singleton1 = Singleton.getInstance();
var singleton2 = Singleton.getInstance();
console.log(String(singleton1 === singleton2).trim()); // true one instance
```

```text output
true
```

<span id="walk-through-the-source" />
<span id="understand-the-collaboration" />

## How it works

Singleton combines controlled creation with access to a shared instance. Here, `getInstance` controls creation and `Singleton.instance` stores the result. The first call sees `null`, creates an object, and saves it; the second returns that stored reference. Allocation is lazy: declaring `Singleton` alone does not create the shared object.

The comparison prints `true` because both variables refer to the same object, not merely objects with matching fields. A mutation through either reference would be visible through the other. This shared identity supports reuse, such as one-time dialog creation, while coupling callers through shared state.

## What the example does not establish

The shared instance is scoped to this Singleton object in this runtime. Callers can reset the public `instance` property and allow another object to be created, so the sample relies on callers using the access method cooperatively. It does not establish shared identity across processes or workers.

## Practical case: reuse one login dialog

Several buttons may open the same login panel. A closure keeps the actual dialog reference private, creates it on the first request, and returns that same element on later requests.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>One shared login dialog</title>
<button id="open-login">Open login</button>
<p id="status" role="status"></p>
<script>
  const getLoginDialog = (() => {
    let instance;
    return () => {
      if (!instance) {
        instance = document.createElement("dialog");
        instance.setAttribute("aria-label", "Login");
        instance.innerHTML = `
          <form method="dialog">
            <label>Username <input name="username" autocomplete="username"></label>
            <button>Close</button>
          </form>`;
        document.body.append(instance);
      }
      return instance;
    };
  })();
  document.querySelector("#open-login").addEventListener("click", () => {
    const dialog = getLoginDialog();
    if (!dialog.open) dialog.showModal();
    document.querySelector("#status").textContent =
      `Dialog count: ${document.querySelectorAll("dialog").length}`;
  });
</script>
</html>
```

**Expected interaction:** Open the dialog, type a username, close it, and open it again. The username remains and the count stays at one. The form closes the demonstration dialog; it does not authenticate anyone.

The closure controls identity within this page. It does not synchronize tabs or servers. Give the owner a cleanup policy if the page removes the element. Native modal behavior comes from [`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal).

## Design decisions and failure modes

A singleton limits instances within a defined runtime scope. Two server processes can each have one instance, so it does not establish a globally unique scheduler or lock.

## Exercises

Use one shared settings object in two tests. Change it in the first test and explain why the second test fails only when run afterward.

<details>
<summary>Expected reasoning and checks</summary>

The tests share hidden mutable state. Supply a fresh dependency per test or reset an explicitly owned lifecycle. For multiple processes, use the appropriate coordination contract rather than relying on a module instance.

</details>

## Interview questions & answers

<details>
<summary>When is dependency injection preferable?</summary>

When callers need explicit configuration, isolation, or different lifetimes. One shared production instance can still be supplied through injection without making every caller reach into global state.

</details>

**Key takeaway:** Define scope and lifetime; one instance is not distributed coordination.

## Continue reading

Use the shared [review checkpoint](../index.md#completion-checkpoint), then return to the [pattern catalog](../index.md).
