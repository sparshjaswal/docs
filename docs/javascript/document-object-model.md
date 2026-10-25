---
id: javascript-document-object-model
title: "🌐 Document Object Model (DOM) - Complete Guide"
slug: /javascript/document-object-model
sidebar_label: "DOM essentials"
---

# 🌐 Document Object Model (DOM) - Complete Guide

The **DOM**, or Document Object Model, is the browser's object representation of an HTML page. It arranges elements like a family tree: a list can contain list items, and each item can contain text. JavaScript uses these objects to read and change the page.

1. Start with a small HTML page and select one element.
2. Change its text, then add a new element.
3. Respond to a button click using an event listener.
4. Return to traversal, performance, and newer APIs after this small interaction works.

Run each browser snippet after its elements exist. Supply the matching HTML and any named callbacks; complete examples include their own markup. A selector may return `null` when nothing matches, so check optional elements before using them. The later real-world examples combine these small steps.

<span id="-table-of-contents" />

## What is the DOM?

HTML is the source description; the DOM is the object structure the browser builds from it. In the example below, the heading starts as “Welcome”. JavaScript selects that heading object, replaces its text, and changes its color.

### 🧠 Mental Model

> Think of the DOM as a **family tree**:
>
> - Each HTML element is a **node** in the tree
> - Elements can have **parent**, **children**, and **sibling** relationships
> - JavaScript can **visit** any node and **modify** its properties

### 🏗️ DOM vs HTML

```html
<!-- Static HTML -->
<div class="container">
  <h1>Welcome</h1>
  <p>Hello World!</p>
</div>
```

```javascript
// Dynamic DOM manipulation
const heading = document.querySelector('h1');
heading.textContent = 'Welcome to JavaScript!';
heading.style.color = 'blue';
```

---

## DOM Tree Structure

### 📊 Visual Representation

```
document
    └── html
        ├── head
        │   ├── title
        │   └── meta
        └── body
            ├── header
            │   └── h1
            ├── main
            │   ├── section
            │   └── article
            └── footer
```

### 🔍 Node Types

```javascript
// Different types of DOM nodes
console.log(Node.ELEMENT_NODE); // 1 - <div>, <p>, etc.
console.log(Node.TEXT_NODE); // 3 - Text content
console.log(Node.COMMENT_NODE); // 8 - <!-- comments -->
console.log(Node.DOCUMENT_NODE); // 9 - document
console.log(Node.DOCUMENT_TYPE_NODE); // 10 - <!DOCTYPE>

// Check node type
const element = document.querySelector('div');
if (element && element.nodeType === Node.ELEMENT_NODE) {
  console.log('This is an element node');
}
```

### 🎯 Document Object

```javascript
// Global document object
console.log(document.title); // Page title
console.log(document.URL); // Current URL
console.log(location.hostname); // Host name (document.domain is deprecated)
console.log(document.documentElement); // <html> element
console.log(document.body); // <body> element
console.log(document.head); // <head> element
```

---

## Selecting Elements

### 📌 Modern Selectors (Recommended)

#### **querySelector() and querySelectorAll()**

```javascript
// Select single element (first match)
const firstButton = document.querySelector('button');
const specificButton = document.querySelector('#submit-btn');
const classButton = document.querySelector('.primary-button');

// Select multiple elements (NodeList)
const allButtons = document.querySelectorAll('button');
const menuItems = document.querySelectorAll('.menu-item');
const formInputs = document.querySelectorAll('input[type="text"]');

// Complex selectors
const nestedElement = document.querySelector('.container > .card:first-child');
const siblingElement = document.querySelector('h1 + p');
```

#### **Advanced CSS Selectors**

```javascript
// Attribute selectors
const requiredInputs = document.querySelectorAll('input[required]');
const emailInput = document.querySelector('input[type="email"]');
const dataElements = document.querySelectorAll('[data-toggle]');

// Pseudo-selectors
const firstItem = document.querySelector('li:first-child');
const lastItem = document.querySelector('li:last-child');
const evenItems = document.querySelectorAll('li:nth-child(even)');
const checkedBoxes = document.querySelectorAll('input:checked');

// Multiple selectors
const headerElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
```

### 🏷️ Legacy Selectors (Still Useful)

```javascript
// By ID
const element = document.getElementById('user-profile');

// By class name (returns HTMLCollection)
const elements = document.getElementsByClassName('card');

// By tag name
const paragraphs = document.getElementsByTagName('p');

// By name attribute
const radioButtons = document.getElementsByName('gender');
```

### Static and live collections

`querySelectorAll` returns a static NodeList: later matching elements do not appear in that result. `getElementsByClassName` and `getElementsByTagName` return live HTMLCollections; `getElementsByName` returns a live NodeList. Iterating a live collection while removing its members can skip elements. Use `Array.from(collection)` when a stable snapshot is needed.

Choose selectors for clarity and measure real workloads before optimizing. Timing one query with `console.time` does not establish a portable performance ranking.

---

## Manipulating Elements

### 📝 Content Manipulation

#### **Text Content**

```javascript
const heading = document.querySelector('h1');

// Literal text in this heading; it is not parsed as HTML
heading.textContent = 'New Heading Text';
console.log(heading.textContent); // Gets text only

// Text with formatting preserved
heading.innerText = 'Formatted\nText';

// HTML content (use with caution)
heading.innerHTML = '<strong>Bold</strong> Text';
```

#### **HTML Content**

```javascript
const container = document.querySelector('.container');

// Static trusted HTML only; this API does not sanitize input
container.insertAdjacentHTML('beforeend', '<p>New paragraph</p>');

// A template for static, trusted markup; it does not sanitize user input
const template = document.createElement('template');
template.innerHTML = '<p>Static content</p>'; // Never substitute untrusted HTML here.
container.appendChild(template.content.cloneNode(true));
```

### 🎨 Style Manipulation

#### **Inline Styles**

```javascript
const element = document.querySelector('.box');

// Individual properties
element.style.backgroundColor = 'blue';
element.style.fontSize = '18px';
element.style.margin = '10px';

// CSS property names (camelCase)
element.style.borderRadius = '5px';
element.style.textAlign = 'center';

// CSS custom properties
element.style.setProperty('--main-color', '#ff6b6b');

// Multiple styles
Object.assign(element.style, {
  width: '200px',
  height: '100px',
  background: 'linear-gradient(45deg, red, blue)',
});
```

#### **CSS Classes**

```javascript
const element = document.querySelector('.card');

// Class methods
element.classList.add('active');
element.classList.remove('hidden');
element.classList.toggle('expanded');
element.classList.contains('active'); // returns boolean

// Multiple classes
element.classList.add('primary', 'large', 'animated');

// Replace class
element.classList.replace('old-class', 'new-class');

// Conditional toggle
element.classList.toggle('dark-mode', isDarkMode);
```

### 🏷️ Attributes

```javascript
const input = document.querySelector('input');

// Standard attributes
input.setAttribute('placeholder', 'Enter your name');
input.getAttribute('type'); // returns attribute value
input.removeAttribute('disabled');
input.hasAttribute('required'); // returns boolean

// Data attributes
input.dataset.userId = '123'; // data-user-id="123"
input.dataset.toggle = 'modal'; // data-toggle="modal"
console.log(input.dataset.userId); // "123"

// Boolean attributes
input.disabled = true;
input.checked = false;
input.required = true;
```

---

## Event Handling

### 📡 Adding Event Listeners

#### **Basic Event Handling**

```javascript
const button = document.querySelector('#submit-btn');

// Method 1: addEventListener (recommended)
button.addEventListener('click', function (event) {
  console.log('Button clicked!', event);
});

// Method 2: Arrow function
button.addEventListener('click', (event) => {
  event.preventDefault(); // Prevent default behavior
  console.log('Click prevented!');
});

// Method 3: Named function (reusable)
function handleClick(event) {
  console.log('Handled by named function');
}
button.addEventListener('click', handleClick);
```

#### **Event Options**

```javascript
// Event listener options
button.addEventListener('click', handleClick, {
  once: true, // Run only once
  passive: true, // Promises not to cancel the default action
  capture: true, // Capture phase
});

// Remove event listener
button.removeEventListener('click', handleClick, { capture: true });
```

### 🎪 Common Events

```javascript
// Mouse events
element.addEventListener('click', handleClick);
element.addEventListener('dblclick', handleDoubleClick);
element.addEventListener('mouseenter', handleMouseEnter);
element.addEventListener('mouseleave', handleMouseLeave);
element.addEventListener('mouseover', handleMouseOver);

// Keyboard events
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
// keypress is deprecated; use keydown/keyup or beforeinput/input as appropriate.

// Form events
form.addEventListener('submit', handleSubmit);
input.addEventListener('input', handleInput);
input.addEventListener('change', handleChange);
input.addEventListener('focus', handleFocus);
input.addEventListener('blur', handleBlur);

// Window events
window.addEventListener('load', handleLoad);
window.addEventListener('resize', handleResize);
window.addEventListener('scroll', handleScroll);
```

### 🎯 Event Object Properties

```javascript
function handleEvent(event) {
  console.log('Event type:', event.type);
  console.log('Target element:', event.target);
  console.log('Current target:', event.currentTarget);
  console.log('Mouse position:', event.clientX, event.clientY);
  console.log('Key pressed:', event.key);
  console.log('Shift key held:', event.shiftKey);

  // Prevent default behavior
  event.preventDefault();

  // Stop further capture/bubble propagation (not other listeners on this target)
  event.stopPropagation();
}
```

### 🔄 Event Delegation

```javascript
// Setup: .todo-list contains .todo-item elements with delete/edit buttons.
// Define editTodoItem(item) for your application's editor.
const list = document.querySelector('.todo-list');
list.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest('button.delete-btn, button.edit-btn');
  if (!button || !list.contains(button)) return;
  const item = button.closest('.todo-item');
  if (!item || !list.contains(item)) return;
  if (button.matches('.delete-btn')) item.remove();
  else editTodoItem(item);
});
```

---

## DOM Traversal

### 👨‍👩‍👧‍👦 Parent/Child Relationships

```javascript
const element = document.querySelector('.child');

// Parent navigation
console.log(element.parentNode); // Immediate parent
console.log(element.parentElement); // Parent if it is an Element, otherwise null
console.log(element.closest('.container')); // This element or its nearest matching ancestor

// Child navigation
console.log(element.children); // Child elements (HTMLCollection)
console.log(element.childNodes); // All child nodes (includes text)
console.log(element.firstElementChild); // First child element
console.log(element.lastElementChild); // Last child element

// Check for children
if (element.hasChildNodes()) {
  console.log('Element has children');
}
```

### 👫 Sibling Relationships

```javascript
const element = document.querySelector('.current');

// Sibling navigation
console.log(element.nextElementSibling); // Next sibling element
console.log(element.previousElementSibling); // Previous sibling element
console.log(element.nextSibling); // Next sibling node
console.log(element.previousSibling); // Previous sibling node
```

### 🔍 Finding Elements

```javascript
// Find within a specific container
const container = document.querySelector('.search-container');
const input = container.querySelector('input');
const buttons = container.querySelectorAll('button');

// Find relative to current element
const currentItem = document.querySelector('.current-item');
const nextItem = currentItem.nextElementSibling;
const parentContainer = currentItem.closest('.item-container');
```

---

## 🚀 Creating and Modifying DOM

### 🏗️ Creating Elements

```javascript
// Create new elements
const div = document.createElement('div');
const paragraph = document.createElement('p');
const button = document.createElement('button');

// Set attributes and content
div.className = 'card';
div.id = 'user-card';
paragraph.textContent = 'Hello, World!';
button.innerHTML = '<i class="icon"></i> Click Me';

// Create text nodes
const textNode = document.createTextNode('Pure text content');

// Create from HTML string (use with caution)
const template = document.createElement('template');
template.innerHTML = '<div class="item">New Item</div>';
const newElement = template.content.firstElementChild;
```

### ➕ Adding Elements

```javascript
const container = document.querySelector('.container');
const newElement = document.createElement('div');

// Append methods
container.appendChild(newElement); // Add to end
container.prepend(newElement); // Add to beginning
container.insertBefore(newElement, reference); // Insert before reference

// Modern methods (more flexible)
container.append(newElement, 'Text', anotherElement);
container.prepend('Text at start', newElement);

// Position-based insertion
element.insertAdjacentElement('beforebegin', newElement); // Before element
element.insertAdjacentElement('afterbegin', newElement); // First child
element.insertAdjacentElement('beforeend', newElement); // Last child
element.insertAdjacentElement('afterend', newElement); // After element
```

### ❌ Removing Elements

```javascript
// Remove element
element.remove(); // Modern way

// Remove child
parent.removeChild(child); // Legacy way

// Remove all children
element.replaceChildren(); // Removes children; listeners on element remain
// OR
while (element.firstChild) {
  element.removeChild(element.firstChild);
}

// Replace element
const newElement = document.createElement('div');
oldElement.replaceWith(newElement);
```

---

## Performance Optimization

### 🔄 Build a subtree before insertion

A fragment groups construction conveniently. Appending each item does not necessarily trigger layout on each iteration, and a fragment is not guaranteed to be faster. Measure before making performance claims.

```javascript
// Direct insertion (one selector lookup)
function updateList(items) {
  const list = document.querySelector('.list');
  for (let item of items) {
    const li = document.createElement('li');
    li.textContent = item.name;
    list.appendChild(li); // Adds one child
  }
}

// Build with a fragment
function updateListOptimized(items) {
  const list = document.querySelector('.list');
  const fragment = document.createDocumentFragment();

  for (let item of items) {
    const li = document.createElement('li');
    li.textContent = item.name;
    fragment.appendChild(li); // Add to fragment
  }

  list.appendChild(fragment); // Single DOM modification
}
```

### 📐 Avoid Layout Thrashing

Consecutive style writes can be batched by the browser. A geometry read after a write that invalidates layout can force synchronous layout. Repeating that alternation is layout thrashing.

```javascript
// Setup: container and cards refer to existing elements.
// Repeatedly invalidates layout, then reads it.
for (const card of cards) {
  card.style.width = '50%';
  console.log(container.offsetWidth);
}

// If every card needs the container's initial width, read it once first.
const width = container.offsetWidth;
for (const card of cards) card.style.width = `${width / 2}px`;
```

These loops illustrate different measurement requirements. Batch reads and writes only when doing so preserves the intended geometry. `cssText` and `className` assignments replace existing inline styles or classes; they are not automatic performance fixes.

### 💾 Cache DOM References

```javascript
// BAD: Repeated DOM queries
function handleClicks() {
  document.querySelector('.button').addEventListener('click', () => {
    document.querySelector('.status').textContent = 'Clicked';
    document.querySelector('.counter').textContent = count++;
  });
}

// GOOD: Cache references
function handleClicksOptimized() {
  const button = document.querySelector('.button');
  const status = document.querySelector('.status');
  const counter = document.querySelector('.counter');

  button.addEventListener('click', () => {
    status.textContent = 'Clicked';
    counter.textContent = count++;
  });
}
```

---

## Modern DOM APIs

### 🔍 Intersection Observer

```javascript
// Lazy loading images
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      imageObserver.unobserve(img);
    }
  });
});

// Observe all lazy images
document.querySelectorAll('img[data-src]').forEach((img) => {
  imageObserver.observe(img);
});
```

### 🎯 Mutation Observer

```javascript
// Watch for DOM changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      console.log('Children added/removed');
    }
    if (mutation.type === 'attributes') {
      console.log('Attributes changed');
    }
  });
});

// Start observing
observer.observe(document.body, {
  childList: true,
  attributes: true,
  subtree: true,
});
```

### 📏 Resize Observer

```javascript
// Watch for element size changes
const resizeObserver = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    const { width, height } = entry.contentRect;
    console.log(`Element resized to: ${width}x${height}`);
  });
});

resizeObserver.observe(document.querySelector('.resizable-element'));
```

---

## Best Practices

### 1. 🎯 **Efficient Selectors**

```javascript
// Use specific selectors
const element = document.getElementById('unique-id'); // Lookup by ID
const elements = document.getElementsByClassName('class-name'); // Live collection

// Avoid overly complex selectors
// BAD: document.querySelector('div > ul > li:nth-child(3) > a');
// GOOD: document.querySelector('.specific-link');
```

### 2. 🔄 **Event Delegation**

```javascript
// Handle events on parent container
document.querySelector('.button-container').addEventListener('click', (e) => {
  if (e.target.matches('.action-button')) {
    handleAction(e.target);
  }
});
```

### 3. 🛡️ **Security Considerations**

```javascript
// Avoid innerHTML with user input
// BAD: element.innerHTML = userInput;

// GOOD: Use textContent or create elements
element.textContent = userInput;

// For intended rich HTML, use a maintained sanitizer and an explicit policy.
// A homemade escaping regex or a <template> is not an HTML sanitizer.
```

### 4. 📱 **Responsive Design**

```javascript
// Use modern CSS and feature detection
if ('IntersectionObserver' in window) {
  // Use Intersection Observer
} else {
  // Fallback to scroll events
}
```

---

## Real-World Examples

### 📝 **Dynamic Form Validation**

Save this complete file as `contact.html` and open it in a browser. Native constraints check required input and email syntax; they do not verify that an address exists. The server must validate submitted data too.

```html
<!doctype html>
<html lang="en">
  <meta charset="utf-8">
  <title>Contact form</title>
  <form id="contact-form">
    <label for="email">Email</label>
    <input id="email" name="email" type="email" required>
    <button type="submit">Check details</button>
  </form>
  <p id="status" role="status"></p>
  <script type="module">
    const form = document.querySelector('#contact-form');
    const status = document.querySelector('#status');
    form.addEventListener('submit', event => {
      event.preventDefault();
      const email = new FormData(form).get('email');
      status.textContent = `Details checked for ${email}. Nothing was sent.`;
    });
    form.addEventListener('input', () => { status.textContent = ''; });
  </script>
</html>
```

Interactive constraint validation occurs before the `submit` event; invalid fields prevent that event. `requestSubmit()` follows this path, whereas `form.submit()` bypasses constraint validation and the submit event.

### 🎪 **Interactive Image Gallery**

Save this file beside an image named `photo.jpg`, then open it in a current browser. The native dialog supplies modal behavior, Escape handling, and focus management. The opener is a button so keyboard users can activate it. Images and text are assigned through properties.

```html
<!doctype html>
<html lang="en">
  <meta charset="utf-8">
  <title>Image preview</title>
  <button type="button" id="preview">View mountain photo</button>
  <dialog id="photo-dialog" aria-labelledby="photo-title">
    <h2 id="photo-title">Mountain photo</h2>
    <img id="photo" alt="Snow-covered mountain beneath a blue sky"
         style="max-width: 100%; max-height: 60vh">
    <form method="dialog"><button autofocus>Close preview</button></form>
  </dialog>
  <script type="module">
    const opener = document.querySelector('#preview');
    const dialog = document.querySelector('#photo-dialog');
    const photo = document.querySelector('#photo');
    opener.addEventListener('click', () => {
      photo.src = './photo.jpg';
      dialog.showModal();
    });
  </script>
</html>
```

Use alt text describing your actual photo. Test Tab, Shift+Tab, Escape, and focus returning to the opener after closing. For views mounted repeatedly, remove their listeners and close/remove dialogs during teardown.

---

## 🎯 Key Takeaways

1. **Use modern selectors** like `querySelector()` for flexibility
2. **Cache DOM references** to avoid repeated queries
3. **Batch DOM operations** using DocumentFragment
4. **Use event delegation** for dynamic content
5. **Prefer textContent over innerHTML** for security
6. **Leverage modern APIs** like Intersection Observer
7. **Always consider performance** when manipulating DOM

---

## 📚 Further Reading

- [MDN: Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [Layout and layout thrashing](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing)
- [javascript.info: browser events](https://javascript.info/introduction-browser-events)
- [MDN: removing event listeners](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)
- [MDN: constraint validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation)
- [MDN: dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)

---

_Ready to build dynamic web applications? Start practicing DOM manipulation today!_ 🚀

## Continue with modern application examples

Use the [complete event-delegation example](./event-handling.md) for a browser interaction with setup and cleanup. Render user text through `textContent`; a `<template>` element does not make untrusted HTML safe. Test keyboard navigation and focus in a real browser. Continue with [application structure](./modular-javascript.md), [projects](./projects.md), and [testing](./testing-guide.md).

## Interview questions {/* #interview-questions */}

**Level: Beginner.** [How to practise](./index.md#interview-preparation).

### 1. How can you display HTML-looking user text without interpreting it as markup?

<details>
<summary>Answer and worked example</summary>

Assign textContent to an ordinary content element. Save this complete example as `text-demo.html` and open it in a browser; inspect the page and console.

```html
<!doctype html>
<html lang="en">
  <meta charset="utf-8">
  <title>Literal user text</title>
  <p id="message"></p>
  <script>
    const message = document.querySelector('#message');
    message.textContent = '<strong>Hi</strong>';
    console.log(message.textContent);
    console.log(message.children.length);
  </script>
</html>
```

**Expected output**

```text output
<strong>Hi</strong>
0
```

The paragraph contains text, not a strong element. innerHTML would parse the same string as markup, making the trust and sanitization policy part of correctness.

</details>

### 2. What can go wrong when removing items while iterating a live collection?

**Apply it:** A live collection contains matching elements A, B, and C. Trace a forward index loop that removes the current element.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

Removing an item changes the collection immediately, potentially shifting the next item into an index the loop has already passed. Take a snapshot with Array.from or use a mutation-aware traversal. querySelectorAll returns a static NodeList; getElementsByClassName returns a live collection.

| Iteration | Live collection before removal | Removed | Collection afterward |
| --- | --- | --- | --- |
| `i = 0` | A, B, C | A | B, C |
| `i = 1` | B, C | C | B |
| `i = 2` | B | Loop ends | B remains |

The index advances while the remaining elements shift left. For `getElementsByClassName`, take `Array.from(collection)` before removing matches, or repeatedly remove `collection[0]` while the live collection is nonempty. A backward traversal also avoids this particular index shift.

`querySelectorAll` returns a static list, so removing its elements does not shrink that list. “Static” refers to membership, not frozen nodes: the referenced elements can still change or become disconnected. Test zero, one, and several matches in a real browser, and verify the remaining DOM rather than only the number of loop iterations.

</details>
