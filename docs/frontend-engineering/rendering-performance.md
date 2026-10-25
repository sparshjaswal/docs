---
title: Rendering, performance, and delivery
sidebar_label: 5. Rendering and performance
sidebar_position: 5
description: Choose where HTML is produced, separate lab and field evidence, and debug the critical path.
---

# Rendering, performance, and delivery

## Overview

Choose rendering from freshness, personalization, and interaction requirements. Then measure whether users can see and use the page. Prerequisites: [browser loading](../javascript/how-browsers-load-webpages.md) and [state ownership](component-state.md).

## Why it exists

A small JavaScript bundle does not help if the server waits on a slow dependency. Fast initial HTML does not help if the main action remains unresponsive. Rendering and delivery decisions affect different parts of the user's wait.

## Mental model

Follow the critical path from navigation to useful content and from an action to the next visible response. A resource or dependency matters when later required work waits for it. Optimize the measured constraint.

## Visual explanation

| Strategy | Initial HTML | Choose when | Main cost |
| --- | --- | --- | --- |
| Static generation | Produced at build time | Content tolerates rebuild delay | Freshness and rebuild work |
| Server rendering | Produced for a request | Request-specific content matters | Server and dependency latency |
| Client rendering | Built by browser JavaScript | An interactive area can load after startup | Script and data waterfalls |
| Cached rendering with revalidation | Reused until refreshed by a policy | A stated freshness window is acceptable | Invalidation and stale-result behavior |

These can coexist on one page. Hydration attaches client behavior to server-produced HTML; it does not guarantee that every action works before scripts arrive.

## How it works

1. Define what must be visible and usable first.
2. Identify required data, assets, and scripts; trace dependencies between them.
3. Choose a rendering and cache policy for public and private content separately.
4. Reserve image space, deliver appropriate image dimensions, and defer noncritical work.
5. Compare the same journey before and after a change; check real-user data after release.

## Real-world example

A public task-app help page can be static. A user's private task list needs authorization and an explicit freshness policy. The editor needs client state regardless of where its initial HTML comes from. Cache neither user's private response under a shared public key.

In Next.js App Router, Server Components and Client Components define a code boundary. Client Components may still contribute to server-rendered initial HTML. Keep server credentials out of that boundary and verify version-specific caching behavior in the [framework documentation](https://nextjs.org/docs/app/getting-started/server-and-client-components).

## Trade-offs

Prefetching can reduce a later wait but uses bandwidth for navigation that may never happen. Memoization can avoid repeated work but retains values and adds comparisons. Large cached responses reduce origin work while increasing freshness and isolation obligations. Measure the intended benefit and the displaced cost.

## Failure scenarios

| Symptom | Likely investigation | Recovery |
| --- | --- | --- |
| Important image appears late | Resource discovery and priority | Make the resource discoverable; remove unnecessary dependencies. |
| Click responds slowly | Main-thread long tasks and rendering | Split or reduce the measured work; move suitable computation to a worker. |
| Content jumps after load | Missing dimensions or inserted content | Reserve space and verify font/image changes. |
| Hydration differs from initial HTML | Time, random values, or browser-only data used inconsistently | Make the initial render deterministic or defer browser-specific work. |

## Production considerations

The Web Vitals guidance uses **LCP ≤ 2.5 s**, **INP ≤ 200 ms**, and **CLS ≤ 0.1** at the 75th percentile, evaluated separately for mobile and desktop. LCP concerns loading, INP interaction responsiveness, and CLS unexpected layout shifts. These are user-experience targets, not a promise that one lab run represents all visitors. See [Web Vitals](https://web.dev/articles/vitals).

Record device, network conditions, route, data size, and cache state for lab comparisons. Segment field regressions carefully; averages can hide slow users. Set a rollback condition before rollout, and preserve security and accessibility while improving speed.

## Exercises

Measure one cold navigation and one interaction. Change a single loading decision and repeat under the same conditions. Expected evidence: a trace identifying the blocked step, a comparable result, and a note about which users the lab does not represent.

<details>
<summary>Interpret a faster local measurement</summary>

It supports a claim about that scenario, not universal improvement. Check warm and cold caches, a slower device, and field results. Excessive preloading can help one resource while delaying another required resource.

</details>

## Interview questions & answers

<details>
<summary>Does server rendering automatically make a page fast and discoverable?</summary>

No. It can provide useful initial HTML, but server latency, blocking resources, access rules, metadata, navigation, and interaction work still matter. Search ranking is not guaranteed by a rendering strategy.

</details>

**Revision cues:** requirements → critical path → cache scope → measurement → rollout. **Key takeaways:** rendering is a trade-off, field and lab evidence differ, and a faster page must remain correct.

**Next:** complete the [frontend checkpoint](index.md#completion-checkpoint), then connect the [task service](../system-design/case-studies/task-service.md).
