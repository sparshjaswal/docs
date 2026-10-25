---
title: Test user journeys and accessibility
sidebar_label: 4. Testing and accessibility
sidebar_position: 4
description: Combine focused logic tests, browser behavior checks, and manual accessibility review.
---

# Test user journeys and accessibility

## Overview

Test whether a person can complete a task, including recovery from failure. Start after [state and requests](component-state.md); use [JavaScript testing](../javascript/testing-guide.md) for assertion and test-runner fundamentals.

## Why it exists

A passing calculation test cannot prove that a button has a usable label. A screenshot cannot prove that Enter submits a form or a slow response is ignored. Different checks detect different failures.

## Mental model

An application promises a journey: enter a title, save it, find the result, and recover if saving fails. Test at the narrowest boundary that can observe each promise. Add a browser check when the browser's actual behavior matters.

## Visual explanation

| Promise | Useful evidence | What it does not establish |
| --- | --- | --- |
| State transition rejects an old response | Pure function test | Browser rendering or real networking |
| Form is operable and reports errors | Browser test by role and accessible name | Every assistive technology combination |
| Task persists across reload | End-to-end test with a test backend | Behavior under every infrastructure failure |
| Focus, announcements, and reading order are useful | Manual keyboard and screen-reader journey | Exhaustive conformance from one run |

## How it works

1. Define a visible outcome before writing the test.
2. Use deterministic data and control response order for race conditions.
3. Locate controls by their role and name so the test observes an important user contract.
4. Assert the result or error; wait for observable state instead of a fixed delay.
5. Run independent scenarios with isolated accounts and data.

Automated accessibility checks find some failures. Manual checks remain necessary; the [W3C Easy Checks](https://www.w3.org/WAI/test-evaluate/preliminary/) guide provides a starting review.

## Real-world example

Use the [task demo](pathname:///examples/frontend/task-form/). The journey should work without a mouse:

1. Tab to “Task title,” type spaces, and submit.
2. Confirm an explanation appears and the field is marked invalid.
3. Enter “Read the next lesson,” submit, and find the new row.
4. Activate its completion button and confirm the visible state changes.
5. Reload. Tasks disappear because this demo deliberately has no persistence.

That final step tests the stated contract, not an assumed feature.

## Trade-offs

Small tests are fast and localize failures. Browser tests cover integrations but need more setup and maintenance. Mock a dependency when testing a specific UI failure; keep a small number of real integration journeys so the mock cannot silently become the only contract.

## Failure scenarios

| Trigger | Misleading result | Repair |
| --- | --- | --- |
| Fixed sleeps | Tests fail only on slower machines | Wait for the expected element or state. |
| Shared test account | Parallel runs delete each other's records | Isolate test data and cleanup by run identity. |
| CSS-only selectors | Restyling breaks behavioral tests | Prefer roles, names, and stable domain identity. |
| Success-only coverage | Retry, empty, and denied states fail in production | Test one meaningful failure per boundary. |

## Production considerations

Review keyboard order, focus after dialogs or navigation, readable errors, contrast in both themes, enlarged text, and reduced motion. Do not put production credentials or personal data in test fixtures. For visual regression, stabilize content and review intentional changes; approving every new screenshot defeats the check.

## Exercises

Write a test plan for a task API returning `403`, `500`, an empty list, and a delayed success after the search changes. Each case needs a user-visible expectation.

<details>
<summary>Expected outcomes</summary>

Forbidden access must not reveal protected data; it needs an appropriate access explanation. A server failure offers recovery without losing the draft. An empty list differs from loading. An obsolete response cannot overwrite the current search. Verify outcomes rather than internal hook call counts.

</details>

## Interview questions & answers

<details>
<summary>Why can an accessible-name assertion catch more than a CSS selector?</summary>

It exercises the control's semantic identity as well as its presence. It still does not prove usable focus order, good announcements, or complete accessibility; those need broader review.

</details>

**Revision checklist:** happy path, keyboard path, empty result, failure, stale response, reload, and account change. **Key takeaways:** test observable promises, control nondeterminism, and combine automation with human review.

**Next:** [Rendering and performance](rendering-performance.md). **Further reading:** [Playwright testing practices](https://playwright.dev/docs/best-practices).
