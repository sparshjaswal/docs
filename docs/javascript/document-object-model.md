---
id: javascript-document-object-model
title: 🌐 Document Object Model (DOM) - Complete Guide
slug: /javascript/document-object-model
sidebar_label: 🌐 Document Object Model (DO...
---

# 🌐 Document Object Model (DOM) - Complete Guide

> **Master DOM manipulation for dynamic web applications**

## 📖 Table of Contents

- [What is the DOM?](#what-is-the-dom)
- [DOM Tree Structure](#dom-tree-structure)
- [Selecting Elements](#selecting-elements)
- [Manipulating Elements](#manipulating-elements)
- [Event Handling](#event-handling)
- [DOM Traversal](#dom-traversal)
- [Performance Optimization](#performance-optimization)
- [Modern DOM APIs](#modern-dom-apis)
- [Best Practices](#best-practices)
- [Real-World Examples](#real-world-examples)

---

## What is the DOM?

The **Document Object Model (DOM)** is a programming interface that represents HTML and XML documents as a tree structure of objects. It allows JavaScript to dynamically access and manipulate the content, structure, and styling of web pages.

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
if (element.nodeType === Node.ELEMENT_NODE) {
  console.log('This is an element node');
}
```

### 🎯 Document Object

```javascript
// Global document object
console.log(document.title); // Page title
console.log(document.URL); // Current URL
console.log(document.domain); // Domain name
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
// By ID (fastest)
const element = document.getElementById('user-profile');

// By class name (returns HTMLCollection)
const elements = document.getElementsByClassName('card');

// By tag name
const paragraphs = document.getElementsByTagName('p');

// By name attribute
const radioButtons = document.getElementsByName('gender');
```

### ⚡ Performance Comparison

```javascript
// Performance test
console.time('getElementById');
document.getElementById('test'); // Fastest
console.timeEnd('getElementById');

console.time('querySelector');
document.querySelector('#test'); // Slower but more flexible
console.timeEnd('querySelector');

console.time('getElementsByClassName');
document.getElementsByClassName('test'); // Fast for multiple elements
console.timeEnd('getElementsByClassName');
```

---

## Manipulating Elements

### 📝 Content Manipulation

#### **Text Content**

```javascript
const heading = document.querySelector('h1');

// Plain text (safe from XSS)
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

// Safe HTML insertion (modern browsers)
container.insertAdjacentHTML('beforeend', '<p>New paragraph</p>');

// innerHTML alternatives for security
const template = document.createElement('template');
template.innerHTML = '<p>Safe content</p>';
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
  passive: true, // Never calls preventDefault
  capture: true, // Capture phase
});

// Remove event listener
button.removeEventListener('click', handleClick);
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
document.addEventListener('keypress', handleKeyPress);

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

  // Stop event bubbling
  event.stopPropagation();
}
```

### 🔄 Event Delegation

```javascript
// Instead of adding listeners to each item
const list = document.querySelector('.todo-list');

list.addEventListener('click', function (event) {
  // Check if clicked element is a button
  if (event.target.matches('button.delete-btn')) {
    const todoItem = event.target.closest('.todo-item');
    todoItem.remove();
  }

  // Check for edit buttons
  if (event.target.matches('button.edit-btn')) {
    const todoItem = event.target.closest('.todo-item');
    editTodoItem(todoItem);
  }
});
```

---

## DOM Traversal

### 👨‍👩‍👧‍👦 Parent/Child Relationships

```javascript
const element = document.querySelector('.child');

// Parent navigation
console.log(element.parentNode); // Immediate parent
console.log(element.parentElement); // Parent element (excludes text nodes)
console.log(element.closest('.container')); // Nearest ancestor with class

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
element.innerHTML = ''; // Fast but loses event listeners
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

### 🔄 Batch DOM Operations

```javascript
// BAD: Multiple DOM queries and modifications
function updateList(items) {
  const list = document.querySelector('.list');
  for (let item of items) {
    const li = document.createElement('li');
    li.textContent = item.name;
    list.appendChild(li); // DOM modification in loop!
  }
}

// GOOD: Batch operations
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

```javascript
// BAD: Causes multiple reflows
element.style.width = '100px'; // Reflow
element.style.height = '50px'; // Reflow
element.style.background = 'red'; // Repaint

// GOOD: Batch style changes
element.style.cssText = 'width: 100px; height: 50px; background: red;';

// OR use classes
element.className = 'optimized-styles';
```

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
const element = document.getElementById('unique-id'); // Fastest
const elements = document.getElementsByClassName('class-name'); // Fast

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

// OR sanitize HTML
element.innerHTML = sanitizeHTML(userInput);
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

```javascript
class FormValidator {
  constructor(form) {
    this.form = form;
    this.errors = new Map();
    this.init();
  }

  init() {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.form.addEventListener('input', this.handleInput.bind(this));
  }

  handleSubmit(e) {
    if (!this.validateForm()) {
      e.preventDefault();
      this.displayErrors();
    }
  }

  handleInput(e) {
    this.validateField(e.target);
    this.updateFieldDisplay(e.target);
  }

  validateField(field) {
    const value = field.value.trim();
    const rules = field.dataset.rules?.split('|') || [];

    this.errors.delete(field.name);

    for (let rule of rules) {
      if (rule === 'required' && !value) {
        this.errors.set(field.name, 'This field is required');
        break;
      }
      if (rule === 'email' && !this.isValidEmail(value)) {
        this.errors.set(field.name, 'Please enter a valid email');
        break;
      }
    }
  }

  updateFieldDisplay(field) {
    const errorElement = field.parentNode.querySelector('.error-message');
    const hasError = this.errors.has(field.name);

    field.classList.toggle('error', hasError);
    field.classList.toggle('valid', !hasError && field.value);

    if (errorElement) {
      errorElement.textContent = this.errors.get(field.name) || '';
    }
  }
}

// Usage
new FormValidator(document.querySelector('#contact-form'));
```

### 🎪 **Interactive Image Gallery**

```javascript
class ImageGallery {
  constructor(container) {
    this.container = container;
    this.modal = this.createModal();
    this.currentIndex = 0;
    this.images = [];
    this.init();
  }

  init() {
    this.loadImages();
    this.bindEvents();
  }

  loadImages() {
    this.images = Array.from(this.container.querySelectorAll('img'));
    this.images.forEach((img, index) => {
      img.dataset.index = index;
      img.classList.add('gallery-image');
    });
  }

  bindEvents() {
    this.container.addEventListener('click', this.handleImageClick.bind(this));
    this.modal.addEventListener('click', this.handleModalClick.bind(this));
    document.addEventListener('keydown', this.handleKeyPress.bind(this));
  }

  handleImageClick(e) {
    if (e.target.matches('.gallery-image')) {
      this.currentIndex = parseInt(e.target.dataset.index);
      this.openModal();
    }
  }

  openModal() {
    const img = this.images[this.currentIndex];
    this.modal.querySelector('.modal-image').src = img.src;
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  createModal() {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
            <div class="modal-content">
                <img class="modal-image" src="" alt="">
                <button class="modal-close">&times;</button>
                <button class="modal-prev">&#8249;</button>
                <button class="modal-next">&#8250;</button>
            </div>
        `;
    document.body.appendChild(modal);
    return modal;
  }
}

// Usage
new ImageGallery(document.querySelector('.image-gallery'));
```

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
- [DOM Performance Best Practices](https://developers.google.com/web/fundamentals/performance/rendering/)
- [Modern DOM APIs](https://web.dev/intersectionobserver/)

---

_Ready to build dynamic web applications? Start practicing DOM manipulation today!_ 🚀
