---
title: Frontend Engineering
description: Comprehensive guide to frontend engineering — HTML, CSS, JavaScript DOM, React, Next.js, state management, performance, and rendering strategies.
keywords:
  - frontend engineering
  - react
  - nextjs
  - performance optimization
  - rendering strategies
---

# 🖥️ Frontend Engineering

A comprehensive guide to modern frontend engineering — from the browser fundamentals to advanced rendering strategies and performance optimization.

---

## Table of Contents

- [HTML](#html)
- [CSS](#css)
- [JavaScript DOM](#javascript-dom)
- [Browser APIs](#browser-apis)
- [React](#react)
  - [Hooks](#hooks)
  - [Internals](#internals)
  - [Fiber](#fiber)
  - [Reconciliation](#reconciliation)
  - [Concurrent Rendering](#concurrent-rendering)
  - [Server Components](#server-components)
- [Next.js](#nextjs)
- [State Management](#state-management)
- [Forms](#forms)
- [Routing](#routing)
- [Accessibility](#accessibility)
- [Performance Optimization (Core Web Vitals)](#performance-optimization-core-web-vitals)
- [SEO](#seo)
- [Security](#security)
- [Rendering Strategies](#rendering-strategies)
  - [SSR (Server-Side Rendering)](#ssr-server-side-rendering)
  - [CSR (Client-Side Rendering)](#csr-client-side-rendering)
  - [ISR (Incremental Static Regeneration)](#isr-incremental-static-regeneration)
  - [SSG (Static Site Generation)](#ssg-static-site-generation)

---

## HTML

HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser. It defines the structure and meaning of web content.

### Key Concepts

- **Semantic HTML**: Using elements like `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, and `<footer>` to convey meaning, improving accessibility and SEO.
- **Forms**: `<form>`, `<input>`, `<select>`, `<textarea>`, and validation attributes (`required`, `pattern`, `min/max`).
- **Meta tags**: `<meta>` elements for charset, viewport, description, and Open Graph.
- **ARIA attributes**: Enhance accessibility for screen readers when native semantics aren't enough.

### Best Practices

- Use semantic elements over `<div>` wherever possible.
- Always include a descriptive `<title>` and `<meta name="description">`.
- Ensure form inputs have associated `<label>` elements.
- Validate HTML with the [W3C Validator](https://validator.w3.org/).

---

## CSS

CSS (Cascading Style Sheets) controls the presentation and layout of HTML documents — from typography and colours to responsive grids and animations.

### Core Concepts

- **Box Model**: Every element is a rectangular box (`content → padding → border → margin`).
- **Specificity**: Inline styles > IDs > classes/attributes > elements. Use `!important` sparingly.
- **Flexbox**: One-dimensional layout for distributing space along rows or columns.
- **Grid**: Two-dimensional layout system for complex page structures.
- **Responsive Design**: Media queries (`@media`), fluid typography (`clamp()`), and relative units (`%`, `vw`, `vh`, `rem`).
- **CSS Custom Properties (Variables)**: `--primary: #2563eb;` for theming and maintainability.

### Modern Approaches

- **Tailwind CSS**: Utility-first framework — compose designs in markup.
- **CSS Modules**: Locally-scoped class names, avoiding global conflicts.
- **Styled Components / CSS-in-JS**: Co-locate styles with components using tagged template literals.

---

## JavaScript DOM

The Document Object Model (DOM) is a programming interface for HTML and XML documents. It represents the page as a tree of nodes that JavaScript can manipulate.

### Key Operations

- **Selection**: `document.querySelector()`, `getElementById()`, `querySelectorAll()`.
- **Manipulation**: `element.textContent`, `element.innerHTML`, `element.setAttribute()`, `element.classList.add/remove/toggle()`.
- **Creation**: `document.createElement()`, `element.appendChild()`, `element.remove()`.
- **Events**: `element.addEventListener('click', handler)`, event delegation, `event.preventDefault()`.

### Reflow and Repaint

- **Reflow (Layout)**: Recalculating element positions and geometries — expensive. Triggered by adding/removing DOM nodes, changing styles that affect layout (width, height, display).
- **Repaint**: Updating pixels on screen — cheaper. Triggered by colour changes, visibility, background.

**Optimisation**: Batch DOM reads/writes, use `requestAnimationFrame`, and prefer CSS transforms/opacity for animations.

---

## Browser APIs

Browsers expose a rich set of Web APIs beyond the DOM.

| API | Purpose |
| --- | --- |
| **Fetch API** | HTTP requests with promise-based interface |
| **Local Storage / Session Storage** | Key-value persistence in browser |
| **IndexedDB** | Structured, transactional client-side database |
| **Web Workers** | Background threads for CPU-intensive tasks |
| **Service Workers** | Proxy between browser and network (offline support, push notifications) |
| **Geolocation API** | Access user's location |
| **Canvas / WebGL** | 2D/3D graphics rendering |
| **WebSockets** | Full-duplex persistent connections |
| **Intersection Observer** | Detect element visibility (lazy loading, infinite scroll) |
| **Resize Observer** | React to element size changes |

---

## React

React is a declarative, component-based JavaScript library for building user interfaces, maintained by Meta.

### Hooks

Hooks let you use state and other React features without writing classes.

- **useState**: Local component state.
- **useEffect**: Side effects (data fetching, subscriptions, DOM mutations).
- **useContext**: Consume context values.
- **useReducer**: Complex state logic with reducers.
- **useCallback / useMemo**: Memoize functions and values to prevent unnecessary re-renders.
- **useRef**: Mutable reference that persists across renders without triggering re-renders.
- **Custom Hooks**: Reusable logic extracted into functions prefixed with `use`.

### Internals

React maintains a **virtual DOM** — a lightweight JavaScript representation of the actual DOM. When state changes, React creates a new virtual DOM tree, diffs it against the previous one (reconciliation), and computes the minimal set of DOM mutations needed.

### Fiber

Fiber is React's reimplementation of its core reconciliation algorithm (since React 16). Key features:

- **Incremental rendering**: Split work into chunks and spread over multiple frames.
- **Prioritisation**: Assign priority levels to updates (user input > animation > data fetching).
- **Pause and resume**: Interrupt rendering for higher-priority updates.

### Reconciliation

The diffing algorithm React uses to compare virtual DOM trees:

1. **Element type difference**: If root elements have different types, React tears down the old tree and builds from scratch.
2. **Same type, different props**: React updates only the changed attributes.
3. **Lists**: The `key` prop helps React identify which items changed, were added, or removed.

### Concurrent Rendering

Introduced in React 18, concurrent rendering lets React prepare multiple versions of the UI simultaneously:

- **`createRoot`** enables concurrent features.
- **`useTransition` / `useDeferredValue`**: Mark updates as non-urgent, keeping the UI responsive.
- **Suspense**: Declaratively specify loading states for data or lazy-loaded components.

### Server Components

React Server Components (RSC) render exclusively on the server, never sending their JavaScript bundle to the client. Benefits:

- **Zero bundle size impact** for server-only components.
- **Direct backend access** — query databases, read files without an API layer.
- **Automatic code-splitting** — client components are loaded as needed.

---

## Next.js

Next.js is a React framework providing production features: file-based routing, server-side rendering, static generation, API routes, and edge functions.

### Key Features

- **App Router** (Next.js 13+): File-system based routing with `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`.
- **Server Components by default** — all components are server components unless marked `'use client'`.
- **Route Handlers**: Build API endpoints in `route.ts` files.
- **Middleware**: Run code before a request is completed (auth, redirects, A/B testing).
- **Image Optimization**: Automatic resizing, lazy loading, and WebP conversion via `<Image>`.
- **ISR (Incremental Static Regeneration)**: Update static pages after build time without full rebuild.

---

## State Management

Managing application state predictably as complexity grows.

### Options

| Solution | Best For |
| --- | --- |
| **useState + useReducer** | Local component state, small apps |
| **React Context** | Global theme, auth, language — low-frequency updates |
| **Zustand** | Lightweight, minimal boilerplate global state |
| **Redux Toolkit** | Large apps with complex state logic, middleware, devtools |
| **Jotai / Recoil** | Atomic state with fine-grained reactivity |
| **TanStack Query** | Server state — caching, background refetch, optimistic updates |
| **XState** | Finite state machines for predictable state transitions |

### Principles

- **Single source of truth**: Derive UI from state, not from local variables.
- **Lift state up** when multiple components need the same state.
- **Immutable updates**: Never mutate state directly — always return new references.

---

## Forms

Forms are the primary mechanism for collecting user input. Managing form state, validation, and submission is a core frontend concern.

### Controlled vs Uncontrolled

- **Controlled**: React state drives input values (`value` + `onChange`). Full control, but more boilerplate.
- **Uncontrolled**: DOM handles the state, accessed via `ref` or `FormData`. Less code, but less React integration.

### Recommended Libraries

- **React Hook Form**: Performant, minimal re-renders, hook-based API.
- **Formik**: Declarative, handles validation and submission boilerplate.
- **Zod / Yup**: Schema-based validation that integrates with form libraries.

---

## Routing

Routing maps URLs to specific views or pages in an application.

### Client-Side Routing

- SPAs use the **History API** (`pushState`, `popState`) to change URLs without full page reloads.
- **React Router**: Declarative routing for React SPAs with nested routes, loaders, and actions.

### Server-Side Routing

- Traditional multi-page apps — each URL request returns a full HTML page.
- Next.js App Router blurs the line: server-rendered pages with client-side navigation for subsequent navigations.

---

## Accessibility (a11y)

Building interfaces usable by people with disabilities — and everyone else.

### WCAG Principles (POUR)

- **Perceivable**: Users must be able to perceive the content (alt text, captions, sufficient contrast).
- **Operable**: UI must be operable via keyboard and assistive tech (focus management, skip links).
- **Understandable**: Content and interface must be clear (consistent navigation, error messages).
- **Robust**: Content must work with current and future assistive technologies (valid HTML, ARIA).

### Practical Checklist

- Use semantic HTML as the foundation.
- Ensure all interactive elements are keyboard accessible.
- Maintain a logical tab order.
- Provide visible focus indicators.
- Use sufficient colour contrast (min 4.5:1 for normal text).
- Test with screen readers (VoiceOver, NVDA).

---

## Performance Optimization (Core Web Vitals)

Google's Core Web Vitals measure real-world user experience.

### LCP (Largest Contentful Paint) — Loading

Measure of perceived load speed. **Target: < 2.5s**.

- Optimize server response time (TTFB).
- Preload critical resources (fonts, hero images).
- Use a CDN.
- Defer non-critical JS/CSS.

### FID (First Input Delay) — Interactivity

Measure of responsiveness. **Target: < 100ms**.

- Break up long tasks (code splitting, yielding to the main thread).
- Minimise JavaScript on page load.
- Use web workers for heavy computation.

### CLS (Cumulative Layout Shift) — Visual Stability

Measure of visual stability. **Target: < 0.1**.

- Set explicit `width` and `height` on images and embeds.
- Avoid inserting content above existing content.
- Use `transform` for animations instead of layout-triggering properties.

### INP (Interaction to Next Paint)

Successor to FID, measuring responsiveness of all interactions. **Target: < 200ms**.

---

## SEO

Search Engine Optimisation ensures your content is discoverable.

### Technical SEO Fundamentals

- **Title tags** — unique, descriptive, < 60 characters.
- **Meta descriptions** — compelling summaries, < 160 characters.
- **Heading hierarchy** — one `<h1>`, logical nesting of `<h2>`–`<h6>`.
- **Canonical URLs** — prevent duplicate content issues.
- **Sitemap.xml** — helps crawlers discover all pages.
- **Robots.txt** — control crawler access.
- **Structured Data (JSON-LD)** — rich snippets in search results.
- **Mobile-friendliness** — responsive design, tap targets > 48px.

### Rendering strategies for SEO

- **SSR / SSG**: Pages are pre-rendered, crawlers see full content.
- **CSR alone**: Content rendered in the browser — crawlers may not execute JS. Use dynamic rendering or prerendering for critical pages.

---

## Security

Frontend security is the first line of defense against common web attacks.

### Critical Practices

- **XSS (Cross-Site Scripting)**: Never use `dangerouslySetInnerHTML` with user input. Sanitise with DOMPurify.
- **CSRF (Cross-Site Request Forgery)**: Use same-site cookies and CSRF tokens for state-changing requests.
- **CSP (Content Security Policy)**: Restrict which resources can be loaded and executed.
- **HTTPS only**: Serve everything over HTTPS.
- **Secure cookies**: `HttpOnly`, `Secure`, `SameSite=Strict/Lax`.
- **Avoid storing sensitive data** in localStorage or sessionStorage — prefer HTTP-only cookies.
- **Input validation**: Validate on the client for UX, but always re-validate on the server.

---

## Rendering Strategies

Choosing the right rendering approach impacts performance, SEO, and user experience.

### SSR (Server-Side Rendering)

Server renders the full HTML for each request. The client receives a fully populated page.

- **Pros**: Great SEO, fast first contentful paint, works without JavaScript.
- **Cons**: Higher server load, slower time-to-first-byte, full page reloads between navigations.

### CSR (Client-Side Rendering)

Server sends a minimal HTML shell; JavaScript renders the content in the browser.

- **Pros**: Rich interactivity, fast subsequent navigations, lower server cost.
- **Cons**: Slow initial load, poor SEO (unless mitigated), blank page while JS loads.

### ISR (Incremental Static Regeneration)

Static pages are regenerated on-demand after a specified interval — no full rebuild needed.

- **Pros**: Combines static speed with dynamic freshness. Ideal for content that updates occasionally.
- **Cons**: Stale content for the duration of the revalidation interval. Requires a server that supports it (Next.js, Nuxt).

### SSG (Static Site Generation)

All pages are pre-built at build time. Served as static files from a CDN.

- **Pros**: Fastest possible load times, minimal server cost, great SEO.
- **Cons**: Content is fixed until next build. Not suitable for frequently-changing or user-specific content.

### Decision Matrix

| Requirement | Recommended Strategy |
| --- | --- |
| Marketing site / blog | SSG or ISR |
| E-commerce product pages | ISR (price/stock) or SSR |
| Dashboard behind auth | CSR |
| Social media feed | SSR with client hydration + streaming |
| Documentation | SSG |

[← Back to Home](../index.md) · © sparshjaswal
