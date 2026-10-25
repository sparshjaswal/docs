---
title: Responsive CSS and layout debugging
sidebar_label: 2. Responsive CSS
sidebar_position: 2
description: Choose layout rules from content constraints and diagnose overflow without hiding information.
---

# Responsive CSS and layout debugging

## Overview

A responsive layout adapts to available space and user settings. Begin with [semantic HTML](semantic-html-and-forms.md). By the end, you should explain an overflowing element, choose Flexbox or Grid, and test long text and enlarged type.

## Why it exists

A fixed-width screenshot cannot describe every screen, language, or font size. A long task title may overflow a card even when the same card looks fine with “Read.” Layout rules must express how content can grow, shrink, and wrap.

## Mental model

The browser solves constraints: available width, content's preferred size, minimum size, gaps, and wrapping. A breakpoint is where your content needs a different arrangement, not a promise about a particular device model. [MDN's responsive design guide](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design) explains the underlying tools.

## Visual explanation

| Constraint | Wide layout | Narrow layout |
| --- | --- | --- |
| Form controls | Can share one row | Wrap while keeping labels with inputs |
| Task cards | Several columns if each remains readable | One column |
| Long title | Wrap within its card | Wrap without pushing controls off screen |

## How it works

These CSS rules are a fragment for a page containing `.tasks` and `.task` elements:

```css
* { box-sizing: border-box; }
main { width: min(100% - 2rem, 60rem); margin-inline: auto; }
.tasks { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr)); gap: 1rem; }
.task { min-width: 0; overflow-wrap: anywhere; }
button, input { font: inherit; }
```

`border-box` includes padding and border in the declared width. The grid admits as many readable columns as fit. `min-width: 0` permits a grid or flex item to shrink below its content-based minimum; wrapping handles long tokens. Avoid setting a fixed height on a container whose text can grow.

## Real-world example

In the [task demo](pathname:///examples/frontend/task-form/), add a long title and resize the window. Then enlarge browser text or zoom. Every task and control should remain reachable. Inspect the actual overflowing element before changing a parent container.

## Trade-offs

Use Flexbox when the primary relationship is along one axis, such as a toolbar. Use Grid when row and column relationships matter. Either can wrap; choose according to the content relationship. A horizontally scrollable data table can preserve comparisons, but an entire page requiring horizontal scrolling usually hides a layout defect.

## Failure scenarios

| Symptom | Likely trigger | Investigation |
| --- | --- | --- |
| A field exceeds the viewport | Fixed width plus padding | Inspect computed width and box sizing. |
| A long URL widens a card | Unbreakable content or automatic minimum size | Check wrapping and the item's minimum width. |
| Large text clips | Fixed height or hidden overflow | Remove the height constraint and let content determine size. |
| Visual order differs from keyboard order | CSS rearrangement | Tab through controls; keep meaningful source order. |

## Production considerations

Test both themes, long translations, missing images, and focus indicators. Set image dimensions or an aspect ratio to reserve space. Respect `prefers-reduced-motion`; a responsive layout does not require animation. Check the cascade and computed styles before increasing selector specificity.

## Exercises

Break the demo with a fixed `width: 800px`, then repair it. Expected result: at 320 CSS pixels, the page fits and controls wrap without clipping. Repeat with enlarged text and a title with no spaces.

<details>
<summary>Debugging order</summary>

Find the element extending beyond its container. Inspect its width, minimum width, padding, and content. Replace the fixed width with a bounded fluid width; adjust wrapping or minimum size only where needed. Hiding overflow can conceal both the symptom and useful content.

</details>

## Interview questions & answers

<details>
<summary>Why can a flex item overflow even when it is allowed to shrink?</summary>

Its automatic minimum size can be based on content. When shrinking is appropriate, an explicit minimum width and a wrapping policy allow the item to fit. First confirm that the content should wrap rather than scroll.

</details>

**Revision cues:** box size → minimum size → wrapping → source order → user settings. **Key takeaways:** choose constraints from content, diagnose the overflowing element, and test beyond one viewport.

**Next:** [Components, state, and requests](component-state.md). **Further reading:** [MDN Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout), [MDN Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout).
