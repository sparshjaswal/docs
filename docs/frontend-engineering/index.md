---
title: 'Frontend engineering'
description: 'Build accessible interfaces with explicit state, resilient requests, and measured performance.'
sidebar_label: 'Frontend engineering'
sidebar_position: 0
---

# Frontend engineering

The frontend is the part of an application a person sees and uses. In a task app, it includes the title field, task rows, and messages such as “Saving” or “Please try again.” This course uses that one application to connect HTML, layout, state, testing, and delivery.

**Prerequisites:** [JavaScript functions](../javascript/functions/README.md), [DOM operations](../javascript/document-object-model.md), and [events](../javascript/event-handling.md). Learn [promises](../javascript/asynchronous/promises.md) before connecting a backend. Start with local data and add infrastructure after the interaction works.

## Learning path

| Step | Canonical lesson | Completion evidence |
| --- | --- | --- |
| 1 | [Semantic HTML and forms](semantic-html-and-forms.md) | Submit by keyboard, identify an invalid field, and retain the draft. |
| 2 | [Responsive CSS](responsive-css.md) | Keep controls usable with long content, narrow screens, and enlarged text. |
| 3 | [Components, state, and requests](component-state.md) | Explain state ownership and reject an obsolete response. |
| 4 | [Testing and accessibility](testing-accessibility.md) | Verify success, failure, and keyboard journeys with appropriate checks. |
| 5 | [Rendering and performance](rendering-performance.md) | Choose a rendering policy and show a measured improvement. |

Use the [task-form demo](pathname:///examples/frontend/task-form/) for the first two lessons. It stores tasks only in memory; refresh resets it. Use the [System Design task service](../system-design/case-studies/task-service.md) when you are ready for persistence and authorization.

## Build your first task screen

Show a labelled field, a submit button, and a task list. Let the user add and complete a task, recover from invalid input, and understand the empty state. Then test the same flow without a mouse. A working happy path is the start of the exercise.

## Follow one interaction

Trace **submit → validate → save → confirm or recover → update the view**. Browser validation helps the person; server validation and authorization enforce the operation's rules. The [state diagram](component-state.md#visual-explanation) shows the request outcomes without repeating the mechanism here.

<span id="what-is-css-cascading-style-sheets" />

## HTML and CSS

Choose semantic controls before styling them. Continue with [forms](semantic-html-and-forms.md#how-it-works) and [layout constraints](responsive-css.md#how-it-works).

## State and updates

Store each fact once and derive values such as completed counts. Continue with [state ownership and stale requests](component-state.md).

## React and component rendering

Learn components after the interaction is clear. See [React's role in the state model](component-state.md#production-considerations); hooks do not replace ownership and lifecycle decisions.

## Next.js and server/client boundaries

Use [rendering and delivery](rendering-performance.md#real-world-example) to decide where code and data belong. Framework defaults are version-specific; secrets and access checks stay on the server.

## Forms, routing, and browser APIs

Keep meaningful locations and shareable filters in URLs. Refresh and back/forward navigation should preserve the intended state. See [browser state and networking](../javascript/browser-state-and-network.md) for storage, fetch, cancellation, and browser API contracts.

## Accessibility

Follow the [keyboard and assistive-technology review](testing-accessibility.md#production-considerations). A screenshot alone cannot establish that a person can complete an action.

## Measure performance {/* #performance-optimization-core-web-vitals */}

Use the [measurement guide](rendering-performance.md#production-considerations) to distinguish field targets from a controlled lab comparison.

## Rendering strategies

Compare [static, server, client, and revalidated rendering](rendering-performance.md#visual-explanation) using freshness, personalization, and interaction needs.

## SEO and security

Use descriptive titles, logical headings, discoverable links, and appropriate canonical URLs. Treat external values as data, avoid inserting untrusted HTML, and check authorization for every protected operation. See [authentication](../system-design/interfaces/authentication.md) and [security boundaries](../system-design/interfaces/security.md).

<span id="practice-problems" />
<span id="exercise" />
<span id="exercise-1" />
<span id="exercise-2" />

## Completion checkpoint

Deliver one working task screen and evidence for these checks:

- A keyboard user can add and complete a task and identify an input error.
- Long titles and enlarged text remain readable at narrow widths in both themes.
- A failed request preserves the draft; a stale result cannot overwrite a newer one.
- Reload and direct links obey a documented persistence and routing contract.
- A performance change has comparable before/after evidence and a rollback condition.

<details>
<summary>Interview review: what changes when the app becomes collaborative?</summary>

Local state no longer establishes the authoritative result. Define server versions, conflict behavior, permission changes, and how an optimistic edit is reconciled. Reuse the same state and failure principles; connect them to [collaborative editing](../system-design/applications/collaborative-editing.md).

</details>

## Frontend Performance Optimization

Use the [critical-path exercise](rendering-performance.md#exercises). Changing a loading hint should have a measured purpose.

## MVC, MVP, MVVM, VIPER Patterns

These names describe different ways to separate presentation, coordination, and data. Treat them as design alternatives rather than required stages of maturity. Draw the owner of your task data, the view, and the code that translates an action into an update; then test that boundary. For the reusable mechanisms, see [Mediator](../design-pattern/behavioral/mediator.md), [Observer](../design-pattern/behavioral/observer.md), and [SOLID](../solid-design-principles/index.md).

<span id="continue-learning" />

## Key takeaways

Start with a complete user action, make state and failure explicit, and measure the experience on realistic devices. Use the five lessons as the canonical explanations; return here to choose the next checkpoint.
