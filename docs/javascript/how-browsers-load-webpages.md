---
id: javascript-how-browsers-load-webpages
title: "How browsers load and render pages"
slug: /javascript/how-browsers-load-webpages
sidebar_label: "How browsers load pages"
---

# How browsers load and render pages

When you open a web page, the browser turns downloaded files into what you can see and use. HTML describes the content, CSS describes its appearance, and JavaScript can read or change the page.

1. Follow one page from its address to downloaded files.
2. See how HTML becomes the DOM, the browser's tree of page objects.
3. Follow styling and layout before the browser paints pixels.
4. Investigate performance only after you can describe that basic sequence.

Start with the overview and rendering path. Architecture, network optimization, and advanced internals are later reference sections. Run browser snippets in a page's console unless they provide HTML setup. For scheduling after loading, continue with the [event loop](./asynchronous/asynchronous.md).

## Overview

Loading overlaps several kinds of work: obtaining resources, parsing HTML, constructing document state, executing scripts, computing styles, layout, painting, and compositing. It is not a single pass that waits for every resource before drawing anything.

A useful starting trace is a document containing a stylesheet, a deferred script, and an image:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Loading example</title>
  <link rel="stylesheet" href="styles.css">
  <script src="app.js" defer></script>
</head>
<body>
  <h1 id="status">Loading example</h1>
  <img src="landscape.jpg" width="800" height="450" alt="Mountain landscape">
</body>
</html>
```

Serve this with your own `styles.css`, `app.js`, and `landscape.jpg`. In `app.js`, set `document.querySelector('#status').textContent = 'Script ran';`. Inspect the Network and Performance panels with and without cache to see overlapping fetches and work on the main thread.

## Browser architecture

Browsers often separate UI, networking, rendering, and GPU work into processes and threads. The exact split is implementation-dependent. A renderer is not universally “one per tab”: site isolation can place frames from one tab in different renderer processes, and some contexts can share a process. Isolation improves containment without guaranteeing that a failure can never affect another tab. [Chrome's architecture walkthrough](https://developer.chrome.com/blog/inside-browser-part1).

The main thread commonly coordinates DOM work, JavaScript, style calculation, and layout. Compositing and raster work can use other threads. JavaScript engines implement the language; they do not themselves define every browser facility. See [engines and V8](./javascript-engine-basic-unit.md) for compilation and garbage collection.

## Critical rendering path

| Stage | Work | What can delay it? |
| --- | --- | --- |
| Navigation and response | Obtain the document from network, cache, or an applicable service worker | Connection setup, server work, redirects |
| HTML parsing | Decode bytes, tokenize markup, construct DOM nodes | Parser-blocking scripts |
| Style calculation | Parse stylesheets and resolve applicable declarations | Render-blocking stylesheets and style invalidation |
| Layout | Compute geometry for the current document state | Large affected regions, repeated forced layouts |
| Paint and raster | Record drawing operations and produce rasterized content | Expensive drawing or large invalidated areas |
| Composite | Assemble layers for display | Work required for a frame and hardware constraints |

Not every update requires all these stages. A suitable compositor animation may avoid new layout; changing geometry generally requires more work. The browser can render intermediate states while other resources continue loading. [web.dev's critical-path guide](https://web.dev/learn/performance/understanding-the-critical-path).

For a new network connection, DNS and transport establishment may be needed. HTTP/1.1 and HTTP/2 commonly use TCP, with TLS for HTTPS; HTTP/3 uses QUIC over UDP. Cached resolutions, reused connections, and cached responses change the sequence. [MDN HTTP evolution](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Evolution_of_HTTP).

## DOM construction process

The HTML parser turns decoded text into tokens and builds the document tree. The DOM can include parser-inserted elements and corrected nesting, so it is not simply a literal copy of the source. Resources are discovered during parsing and may also be discovered speculatively. [MDN browser loading model](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work).

### Run setup when the DOM is available

```js
function initialize() {
  const heading = document.querySelector('h1');
  if (heading) console.log('Heading:', heading.textContent);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
  initialize();
}
```

The ready-state check also handles code loaded after the event already fired. `DOMContentLoaded` follows parsing and the execution of deferred classic scripts and ordinary module scripts; it does not wait for every image or async script. Stylesheets can delay scripts and thereby delay the event indirectly. `load` waits for additional load-delaying resources, but is not a promise that every application request or lazy-loaded resource has completed. [MDN DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event), [javascript.info page lifecycle](https://javascript.info/onload-ondomcontentloaded).

A mark taken when your script starts and another at `DOMContentLoaded` measure that interval, not pure DOM construction. It can include script work and waiting; HTML parsing may have started before your first mark.

## CSSOM construction

Stylesheets expose rules through CSSOM APIs. Computing an element's style involves the cascade, inheritance, and value resolution; assigning matching rule objects in source order is not an implementation of the CSS cascade. [MDN CSS cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Introduction).

```js
const heading = document.querySelector('h1');
if (heading) {
  console.log(getComputedStyle(heading).color);
  heading.style.setProperty('--accent-color', 'royalblue');
}
```

`getComputedStyle` exposes resolved styles; a custom property affects appearance only if a declaration uses it. Reading stylesheet `cssRules` can throw a `SecurityError` for a stylesheet without the necessary origin access. [MDN CSSStyleSheet](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet).

Applicable stylesheets in the document head normally block initial rendering while loading. CSS does not generally stop HTML tokenization itself, but scripts that wait for stylesheets can also block the parser. A print stylesheet is different from a stylesheet needed for the current screen. [Render-blocking CSS](https://web.dev/articles/critical-rendering-path/render-blocking-css).

## JavaScript execution context

### Script loading behaviors

These rules describe ordinary parser-inserted scripts; dynamically inserted scripts have additional rules.

| Form | Fetching and execution | Ordering |
| --- | --- | --- |
| `<script src="app.js"></script>` | Parsing pauses for fetching and execution | Parser order |
| `<script src="app.js" defer></script>` | Fetch while parsing; execute after parsing | Deferred classic scripts preserve document order |
| `<script src="analytics.js" async></script>` | Fetch while parsing; execute when ready and scheduled | No document-order guarantee among async scripts |
| `<script type="module" src="app.mjs"></script>` | Fetch the module graph; ordinary evaluation starts after parsing | Dependencies govern evaluation; top-level `await` can suspend it |
| `<script type="module" src="app.mjs" async></script>` | Run when the graph is ready and execution can proceed | Does not wait for document parsing |

`defer` has no effect on an inline classic script and is unnecessary for module scripts. `async` does not mean execution can interrupt another JavaScript callback. Dynamic import returns a promise; await that promise when the feature must finish initializing. [MDN script element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script), [javascript.info async and defer](https://javascript.info/script-async-defer).

For ES modules that suspend at top-level `await`, DOM readiness is not an application-level “all asynchronous initialization finished” signal. Model readiness with the promise that actually represents that initialization.

## Advanced browser internals

### Measure work that actually runs

```js
const start = performance.now();
const total = Array.from({ length: 1000 }, (_, index) => index)
  .reduce((sum, value) => sum + value, 0);
console.log({ total, elapsedMs: performance.now() - start });
```

This measures allocation and calculation, not the console call after the timestamp. A timing around a function's declaration does not measure executing its body. A fixed number of calls also does not guarantee a specific compiler tier. Use representative inputs and an engine profile to investigate [optimization and deoptimization](./javascript-engine-basic-unit.md#v8-execution-tiers).

### Observe supported performance entries

```js
if (globalThis.PerformanceObserver?.supportedEntryTypes.includes('longtask')) {
  const observer = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      console.log('Long task duration:', entry.duration);
    }
  });
  observer.observe({ type: 'longtask', buffered: true });
  // Disconnect when this diagnostic session ends:
  // observer.disconnect();
}
```

Entry support varies. A user-created `measure` whose name contains `gc` is not a browser garbage-collection event. Node has different performance entries. Do not infer a leak merely from several increasing heap readings: allocation and collection happen over time. Inspect retaining paths in a heap snapshot and clean up application-owned timers, observers, subscriptions, and caches. [MDN performance entries](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry/entryType), [memory diagnostics](./metaprogramming-and-memory.md#diagnose-retained-memory).

### Avoid forced-layout loops

When a style write invalidates layout, a subsequent geometry read may force the browser to update it synchronously. If the intended semantics allow it, collect reads first and then apply writes. Use a Performance trace to establish the cost; neither DocumentFragment nor `requestAnimationFrame` automatically makes arbitrary DOM work fast. [web.dev layout guidance](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing).

## Network layer optimization

### Observe the negotiated protocol

```js
const navigation = performance.getEntriesByType('navigation')[0];
console.log(navigation?.nextHopProtocol || 'Protocol unavailable');
```

This reports an observed protocol, such as `h2` or `h3`; it does not enable HTTP/3 or control QUIC connection migration. The browser and server negotiate transport. A service worker is not required to read navigation timing. Cross-origin resource timing may need `Timing-Allow-Origin` to expose details. [MDN nextHopProtocol](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/nextHopProtocol).

### Use resource hints deliberately

`preconnect` hints that a connection may be useful, `preload` identifies a resource needed soon, and `modulepreload` prepares module resources. A preload does not itself apply a stylesheet or execute a script. Match its URL, resource type, and CORS mode to the eventual request to avoid duplicate fetches. Preloading everything can compete with critical work. [MDN preload](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload).

A custom `data-server-push` attribute has no built-in networking effect. Client preloading is distinct from HTTP server push; Chrome removed HTTP/2 push support. [Chrome removal notice](https://developer.chrome.com/blog/deps-rems-106/#remove-http2-push).

### Images and connection hints

Serve real alternative assets with `<picture>` or `srcset`; changing a `.jpg` suffix to `.avif` does not create an AVIF file. Reserve image space with dimensions. Lazy-load appropriate offscreen images, while keeping an important initial image discoverable. Use an image pipeline or CDN that actually produces the requested formats. [MDN responsive images](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images).

The optional Network Information API provides estimates, not a guarantee of download speed or device capacity. Treat data-saving preferences as a reason to reduce optional transfers; do not replace meaningful images with permanent placeholders or infer that every reported “4g” connection can afford aggressive preloading. [MDN Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API).

## Security & Loading Performance

### Content Security Policy

CSP defines permitted resource sources and execution behavior. Deliver the policy in HTTP response headers and generate unpredictable per-response nonces on the server when using a nonce-based policy. Put the matching nonce on the intended script elements. Injecting a policy with page JavaScript after loading cannot retroactively protect already executed scripts. Meta-delivered CSP also lacks support for directives such as `frame-ancestors` and for report-only delivery. [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP).

When a policy blocks a resource, diagnose the policy and the resource's intended role. Do not automatically relax the policy or silently switch to an unverified source. Configure reporting at the server boundary; a diagnostic `securitypolicyviolation` listener can also help explain failures during development.

### CORS and preflights

CORS is a server permission protocol enforced by browsers. A page-level Map does not populate the browser's preflight cache. The server's `Access-Control-Max-Age` response header controls permitted caching, subject to browser limits. Inspect actual OPTIONS requests in developer tools; an arbitrary timing threshold cannot prove a preflight happened. [MDN preflight requests](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request).

Do not remove required headers or change credentials to avoid a preflight. Preserve the API's contract. `mode: 'no-cors'` produces an opaque cross-origin response, not readable JSON. Network, CORS, and other fetch failures are not reliably distinguished by the error alone. A JSONP fallback executes remote code and is not a transparent substitute for fetch. [MDN fetch and CORS](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#making_cross-origin_requests).

### Subresource integrity

SRI compares a fetched resource with an expected hash chosen from trusted build or release bytes. Supply the `integrity` attribute before loading starts. Hashing whatever bytes arrive from the same untrusted remote source at runtime does not establish that they are the intended bytes. Adding the attribute from a later MutationObserver is too late to rely on.

An SRI hash contains the algorithm and Base64-encoded digest bytes, not Base64 of the hexadecimal text. Cross-origin SRI also requires an appropriate CORS response. If validation fails, report the failure or load an independently trusted, verified fallback; removing `integrity` defeats the check. [MDN Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity).

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](./index.md#interview-preparation).

### 1. Why can an ordinary module script see an element that a preceding classic script cannot?

<details>
<summary>Answer and worked example</summary>

An ordinary parser-inserted module is deferred until parsing finishes. An inline classic script runs when the parser reaches it. Save this complete file and serve it over HTTP; read the console output.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Script ordering</title>
  <script>
    console.log(Boolean(document.querySelector('#later')));
    document.addEventListener('DOMContentLoaded', () => console.log('ready'));
  </script>
  <script type="module">
    console.log(Boolean(document.querySelector('#later')));
  </script>
</head>
<body><p id="later">Parsed later</p></body>
</html>
```

**Expected output**

```text output
false
true
ready
```

The first query happens before the paragraph exists. The module runs after parsing, and this example has no top-level await or async module script to complicate the readiness sequence.

</details>

### 2. Do async and defer mean that JavaScript executes on a separate thread?

**Apply it:** Two external classic scripts depend on each other. Choose between async and defer, and explain what DOMContentLoaded does not tell you.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

No. They affect loading and scheduling. Deferred classic scripts preserve document order; async scripts have no such order guarantee. Execution can still block the main thread. DOMContentLoaded also does not mean every image or application request has completed.

**Dependency choice:** for parser-inserted external classic scripts, `defer` allows fetching during parsing and preserves document order for execution after parsing. If script B requires a global created by A, place A first. `async` executes when ready and does not preserve that dependency order. ES module imports are a clearer way to express a module dependency graph.

These attributes do not move execution to a worker. A long-running deferred script can still block interaction. `DOMContentLoaded` occurs after the relevant deferred/module script processing, but it is not a promise that every async script, image, fetch, or application initialization has finished. Top-level await introduces additional module-readiness considerations; wait for the application’s explicit readiness operation when that is what you need.

**Test design:** make B fail visibly if A’s dependency is missing and vary fetch completion order. Do not conclude that `async` preserves order because the files happened to come from a warm cache in one run.

</details>

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| Compare a classic, deferred, async, and module script in the same test page. | Practice | Record DOM access, execution order, and DOMContentLoaded; avoid predicting network completion order. | [Script loading](#javascript-execution-context) |
| Explain why a user timing measure is not pure parsing time. | Practice | Identify what happened before the first mark and what waits occurred inside the interval. | [DOM construction](#dom-construction-process) |
| Check a page with the Network and Performance panels. | Practice | Compare cached and uncached loads; identify one bottleneck before changing code. | [Critical path](#critical-rendering-path) |
| Explain who controls CSP nonces, CORS permission, and SRI's expected hash. | Practice | Distinguish trusted server/build configuration from runtime observation. | [Security and loading](#security--loading-performance) |

## Continue learning

Continue with [DOM operations](./document-object-model.md), [events](./event-handling.md), [browser state and requests](./browser-state-and-network.md), and [performance testing](./testing-guide.md).
