---
id: design-pattern-structural-proxy
title: "Proxy Pattern 🛡️"
slug: /design-pattern/structural/proxy
sidebar_label: "Proxy"
---

# Proxy Pattern 🛡️

A Proxy sits in front of another object and handles access to it. This example shows a small wrapper that does work before and after forwarding a call.

## Example: wrapping an agency-registration call {/* #javascript-walkthrough */}

This example places a wrapper between the client and a target method. Its call operation prints a before message, invokes the requested target method, then prints an after message.

```js runnable
var Target = {
  doSomething: function () {
    console.log(String("Agency registration company").trim());
  },
};
function AgencyProxy() {
  this.call = function (target, method) {
    console.log(String(" before ").trim());
    var result = target[method]();
    console.log(String(" after ").trim());
    return result;
  };
}
var proxy = new AgencyProxy();
proxy.call(Target, "doSomething");
```

```text output
before
Agency registration company
after
```

<span id="walk-through-the-source" />
<span id="understand-the-collaboration" />

## How it works

Proxy interposes an object between a client and a target operation. The client supplies a target and method name to the wrapper, which prints before, invokes the registration method, prints after, and returns the target’s result. The three output lines follow that sequence.

The expression `target[method]()` looks up the method and preserves the target as its receiver. The wrapper neither copies the target nor replaces its implementation; the target remains responsible for the registration action. The additional behavior runs on every wrapped call, while a direct call to Target bypasses it.

## What the example does not establish

Callers use `call(target, method)` rather than `doSomething` on an interchangeable substitute, so this is an explicit forwarding wrapper. It forwards no arguments and validates neither the target nor the method name. If the method throws, the after message is not reached. The wrapper is separate from JavaScript’s built-in Proxy and its trap invariants.

## Practical case: show a placeholder while an image loads

An image proxy accepts the same `setSource(url)` operation as the display object. It shows a placeholder, loads the requested image off-screen, then forwards the URL when loading succeeds. A request counter prevents a slower, older request from replacing a newer result.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>Image loading proxy</title>
<button id="load">Load illustration</button>
<button id="fail">Test failed image</button>
<p id="status" role="status">Ready</p>
<img id="preview" width="240" height="120" alt="Image loading demonstration">
<script>
  const svgUrl = (color) => "data:image/svg+xml," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="120">
       <rect width="240" height="120" fill="${color}"/>
     </svg>`
  );
  const placeholder = svgUrl("lightgray");
  const display = {
    setSource(url) { document.querySelector("#preview").src = url; },
  };
  const status = document.querySelector("#status");
  let latestRequest = 0;
  const imageProxy = {
    setSource(url) {
      const request = ++latestRequest;
      display.setSource(placeholder);
      status.textContent = "Loading";
      const pending = new Image();
      pending.onload = () => {
        if (request !== latestRequest) return;
        display.setSource(url);
        status.textContent = "Loaded";
      };
      pending.onerror = () => {
        if (request !== latestRequest) return;
        status.textContent = "Image failed to load";
      };
      pending.src = url;
    },
  };
  display.setSource(placeholder);
  document.querySelector("#load").addEventListener("click", () => {
    imageProxy.setSource(svgUrl("royalblue"));
  });
  document.querySelector("#fail").addEventListener("click", () => {
    imageProxy.setSource("data:image/png;base64,broken");
  });
</script>
</html>
```

**Expected interaction:** The preview begins gray. Loading the illustration makes it blue and shows “Loaded.” Testing failure keeps the gray placeholder and shows an error. Clicking Load again recovers. The local image may load too quickly to see the temporary loading state.

Handlers are attached before assigning `src`. Old requests are ignored, not canceled. A production component also needs a disposal policy, meaningful alternative text for each image, and suitable sizing. Native lazy loading is simpler when delaying off-screen images is the only requirement.

## Design decisions and failure modes

A proxy sits where the caller expects the real subject. A remote proxy adds failure and latency even when its method names look local; a cache proxy can also return stale data.

## Exercises

Add a cache proxy for a user profile. Switch accounts while a request is in flight and define which cached or late results may be shown.

<details>
<summary>Expected reasoning and checks</summary>

Include the relevant identity and authorization scope in the cache policy, invalidate on account changes, and reject results from the old request context. A proxy must not turn one user’s successful response into another user’s data leak.

</details>

## Interview questions & answers

<details>
<summary>Can a proxy be completely transparent?</summary>

Only within a stated contract. Identity checks, timing, network failures, and freshness can remain observable. Document those differences rather than promising local-call semantics.

</details>

**Key takeaway:** Preserve access and failure contracts across the indirection.

## Continue reading

Use the shared [review checkpoint](../index.md#completion-checkpoint), then return to the [pattern catalog](../index.md).
