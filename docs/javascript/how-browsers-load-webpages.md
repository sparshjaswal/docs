---
id: javascript-how-browsers-load-webpages
title: "How Browsers Load Webpages - Complete Guide"
slug: /javascript/how-browsers-load-webpages
sidebar_label: "How Browsers Load Webpages ..."
---

# How Browsers Load Webpages - Complete Guide

A comprehensive guide to understanding browser rendering processes, performance optimization, and modern web development practices.

## Table of Contents

1. [Overview](#overview)
2. [Browser Architecture](#browser-architecture)
3. [Critical Rendering Path](#critical-rendering-path)
4. [DOM Construction Process](#dom-construction-process)
5. [CSSOM Construction](#cssom-construction)
6. [JavaScript Execution Context](#javascript-execution-context)
7. [Advanced Browser Internals](#advanced-browser-internals)
8. [Network Layer Optimization](#network-layer-optimization)
9. [Security & Loading Performance](#security--loading-performance)

---

## Overview

Understanding how browsers load and render webpages is crucial for building performant web applications. This process involves multiple phases that work together to transform HTML, CSS, and JavaScript into the visual webpage users see.

### Key Components

- **DOM (Document Object Model)** - Tree structure representing HTML elements
- **CSSOM (CSS Object Model)** - Tree structure representing CSS styles
- **Render Tree** - Combined DOM and CSSOM for visual rendering
- **JavaScript Engine** - Executes JavaScript and manipulates DOM/CSSOM
- **Layout Engine** - Calculates element positions and sizes
- **Paint Engine** - Renders pixels to the screen

---

## Browser Architecture

### Modern Browser Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Process                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │    GPU      │  │   Network   │  │     Storage         │  │
│  │  Process    │  │   Process   │  │     Process         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                 Renderer Process (Per Tab)                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Main      │  │ Compositor  │  │      Raster         │  │
│  │   Thread    │  │   Thread    │  │      Thread         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Process Isolation Benefits

- **Security**: Each tab runs in isolation
- **Stability**: One tab crash doesn't affect others
- **Performance**: Parallel processing across cores
- **Resource Management**: Better memory and CPU allocation

---

## Critical Rendering Path

The Critical Rendering Path (CRP) is the sequence of steps browsers follow to convert HTML, CSS, and JavaScript into pixels on the screen.

### The Complete Pipeline

```
Network Request → HTML Parsing → DOM Construction
                              ↓
CSS Parsing → CSSOM Construction → Render Tree Construction
                              ↓
JavaScript Execution ← → DOM/CSSOM Manipulation
                              ↓
Layout (Reflow) → Paint → Composite → Display
```

### Detailed Phase Breakdown

#### Phase 1: Network & Parsing

1. **DNS Lookup**: Resolve domain to IP address
2. **TCP Handshake**: Establish connection
3. **HTTP Request/Response**: Download HTML
4. **HTML Parsing**: Convert bytes to DOM

#### Phase 2: Style Processing

1. **CSS Download**: Fetch external stylesheets
2. **CSS Parsing**: Convert CSS to CSSOM
3. **Style Computation**: Calculate final styles

#### Phase 3: Layout & Rendering

1. **Render Tree**: Combine DOM + CSSOM
2. **Layout**: Calculate positions and sizes
3. **Paint**: Fill in pixels
4. **Composite**: Layer composition

---

## DOM Construction Process

The **Document Object Model (DOM)** represents the HTML document as a tree of objects that JavaScript can manipulate.

### DOM Building Steps

#### 1. Byte Conversion

```javascript
// Raw bytes received from server
[60, 104, 116, 109, 108, 62]; // <html> in UTF-8
```

#### 2. Character Conversion

```javascript
// Bytes converted to characters using charset encoding
'<html><head><title>Page</title></head><body>...</body></html>';
```

#### 3. Tokenization

```javascript
// Characters parsed into meaningful tokens
const tokens = [
  { type: 'StartTag', name: 'html' },
  { type: 'StartTag', name: 'head' },
  { type: 'StartTag', name: 'title' },
  { type: 'Characters', data: 'Page' },
  { type: 'EndTag', name: 'title' },
  // ... more tokens
];
```

#### 4. Node Creation

```javascript
// Tokens converted to Node objects
class HTMLElement {
  constructor(tagName) {
    this.tagName = tagName;
    this.children = [];
    this.attributes = new Map();
    this.parent = null;
  }
}

const htmlElement = new HTMLElement('html');
const headElement = new HTMLElement('head');
```

#### 5. DOM Tree Construction

```javascript
// Example DOM structure
const dom = {
  documentElement: {
    tagName: 'HTML',
    children: [
      {
        tagName: 'HEAD',
        children: [
          { tagName: 'TITLE', textContent: 'Page Title' },
          { tagName: 'META', attributes: { charset: 'UTF-8' } },
        ],
      },
      {
        tagName: 'BODY',
        children: [
          { tagName: 'H1', textContent: 'Welcome' },
          { tagName: 'P', textContent: 'Content here...' },
        ],
      },
    ],
  },
};
```

### DOM Construction Performance

```javascript
// Measuring DOM construction time
performance.mark('dom-start');

document.addEventListener('DOMContentLoaded', () => {
  performance.mark('dom-end');
  performance.measure('dom-construction', 'dom-start', 'dom-end');

  const measure = performance.getEntriesByName('dom-construction')[0];
  console.log(`DOM constructed in ${measure.duration}ms`);
});
```

---

## CSSOM Construction

The **CSS Object Model (CSSOM)** represents all CSS styles as a tree structure that can be manipulated by JavaScript.

### CSSOM Building Process

#### 1. CSS Parsing

```css
/* Input CSS */
body {
  font-size: 16px;
  color: #333;
}

.header {
  background: blue;
  padding: 20px;
}

@media (max-width: 768px) {
  .header {
    padding: 10px;
  }
}
```

#### 2. CSSOM Tree Structure

```javascript
// Conceptual CSSOM representation
const cssom = {
  rules: [
    {
      selector: 'body',
      declarations: {
        'font-size': '16px',
        color: '#333',
      },
    },
    {
      selector: '.header',
      declarations: {
        background: 'blue',
        padding: '20px',
      },
    },
  ],
  mediaRules: [
    {
      media: '(max-width: 768px)',
      rules: [
        {
          selector: '.header',
          declarations: {
            padding: '10px',
          },
        },
      ],
    },
  ],
};
```

#### 3. Style Computation

```javascript
// Browser computes final styles for each element
function computeStyles(element, cssom) {
  const computedStyle = {};

  // Apply default browser styles
  Object.assign(computedStyle, getDefaultStyles(element.tagName));

  // Apply author styles (cascade, specificity, inheritance)
  const matchingRules = findMatchingRules(element, cssom);
  matchingRules.forEach((rule) => {
    Object.assign(computedStyle, rule.declarations);
  });

  return computedStyle;
}
```

### Accessing CSSOM via JavaScript

```javascript
// Modern way to interact with CSSOM
const element = document.querySelector('.header');

// Get computed styles
const styles = window.getComputedStyle(element);
console.log(styles.backgroundColor); // "rgb(0, 0, 255)"

// Modify styles
element.style.setProperty('--custom-color', '#ff0000');

// Access CSS rules
const styleSheet = document.styleSheets[0];
const rule = styleSheet.cssRules[0];
console.log(rule.cssText); // "body { font-size: 16px; color: rgb(51, 51, 51); }"
```

---

## JavaScript Execution Context

JavaScript can block DOM construction and manipulate both DOM and CSSOM, making its execution timing critical for performance.

### Script Loading Behaviors

#### 1. Synchronous Scripts (Default)

```html
<!-- Blocks DOM parsing until script loads and executes -->
<script src="app.js"></script>
```

#### 2. Async Scripts

```html
<!-- Downloads in parallel, executes immediately when ready -->
<script src="analytics.js" async></script>
```

#### 3. Defer Scripts

```html
<!-- Downloads in parallel, executes after DOM parsing -->
<script src="main.js" defer></script>
```

#### 4. Module Scripts (Modern Approach)

```html
<!-- ES6 modules with automatic defer behavior -->
<script type="module" src="app.mjs"></script>
```

### Script Execution Timeline

```javascript
// Example of script execution monitoring
class ScriptPerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  trackScript(src) {
    const startTime = performance.now();

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;

      script.onload = () => {
        const loadTime = performance.now() - startTime;
        this.metrics.set(src, { loadTime, status: 'loaded' });
        resolve();
      };

      script.onerror = () => {
        this.metrics.set(src, { status: 'error' });
        reject(new Error(`Failed to load ${src}`));
      };

      document.head.appendChild(script);
    });
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
}

// Usage
const monitor = new ScriptPerformanceMonitor();
monitor.trackScript('/js/app.js').then(() => {
  console.log('Script loaded:', monitor.getMetrics());
});
```

---

## Advanced Browser Internals

### V8 JavaScript Engine Architecture

Modern browsers use sophisticated JavaScript engines. V8 (used by Chrome and Node.js) exemplifies advanced compilation techniques.

#### V8 Compilation Pipeline

```javascript
// V8's multi-tier compilation process
class V8CompilationExample {
  static demonstrateOptimization() {
    // This function shows how V8 optimizes code
    function hotFunction(x, y) {
      return x + y; // Initially interpreted
    }

    // After many calls, V8 compiles this to optimized machine code
    for (let i = 0; i < 10000; i++) {
      hotFunction(i, i + 1); // Triggers TurboFan compilation
    }

    // V8 can deoptimize if assumptions change
    hotFunction('string', 'concatenation'); // May trigger deoptimization
  }

  static monitorOptimization() {
    // Use --trace-opt and --trace-deopt flags in Chrome
    // chrome --js-flags="--trace-opt --trace-deopt"

    performance.mark('function-start');

    // Code that will be optimized
    const optimizedFunction = (data) => {
      return data.map((item) => item * 2).filter((item) => item > 10);
    };

    performance.mark('function-end');
    performance.measure('function-execution', 'function-start', 'function-end');
  }
}
```

#### Hidden Classes and Inline Caching

```javascript
// Optimize object creation for V8
class OptimizedObjectPatterns {
  // Good: Consistent object shape
  static createOptimizedObjects() {
    const objects = [];

    for (let i = 0; i < 1000; i++) {
      // Same property order and types = same hidden class
      objects.push({
        id: i,
        name: `object-${i}`,
        active: true,
        value: i * 2,
      });
    }

    return objects;
  }

  // Bad: Inconsistent object shapes
  static createPessimizedObjects() {
    const objects = [];

    for (let i = 0; i < 1000; i++) {
      const obj = { id: i };

      // Adding properties in different orders creates multiple hidden classes
      if (i % 2) {
        obj.name = `object-${i}`;
        obj.active = true;
      } else {
        obj.active = true;
        obj.name = `object-${i}`;
      }

      objects.push(obj);
    }

    return objects;
  }
}
```

### Memory Management and Garbage Collection

#### Understanding Memory Allocation

```javascript
// Memory-efficient patterns for web applications
class MemoryOptimization {
  constructor() {
    this.cache = new Map();
    this.weakCache = new WeakMap();
    this.observers = new Set();
  }

  // Object pooling for frequent allocations
  static createObjectPool(createFn, resetFn, initialSize = 10) {
    const pool = [];

    for (let i = 0; i < initialSize; i++) {
      pool.push(createFn());
    }

    return {
      get() {
        return pool.length > 0 ? pool.pop() : createFn();
      },

      release(obj) {
        resetFn(obj);
        pool.push(obj);
      },

      size() {
        return pool.length;
      },
    };
  }

  // Example: DOM element pool
  static createDOMElementPool() {
    return this.createObjectPool(
      () => document.createElement('div'),
      (element) => {
        element.className = '';
        element.textContent = '';
        element.style.cssText = '';
        element.removeAttribute('data-id');
      },
    );
  }

  // Memory leak prevention
  preventMemoryLeaks() {
    // Use WeakMap for DOM element associations
    const elementData = new WeakMap();

    const attachData = (element, data) => {
      elementData.set(element, data);
    };

    // Automatic cleanup of event listeners
    const managedListeners = new Map();

    const addManagedListener = (element, event, handler) => {
      const key = `${element.id || 'unknown'}-${event}`;

      // Remove existing listener if any
      if (managedListeners.has(key)) {
        const { el, evt, h } = managedListeners.get(key);
        el.removeEventListener(evt, h);
      }

      element.addEventListener(event, handler);
      managedListeners.set(key, { el: element, evt: event, h: handler });
    };

    // Cleanup method
    const cleanup = () => {
      managedListeners.forEach(({ el, evt, h }) => {
        el.removeEventListener(evt, h);
      });
      managedListeners.clear();
    };

    return { attachData, addManagedListener, cleanup };
  }
}
```

#### Garbage Collection Monitoring

```javascript
// Monitor and optimize garbage collection
class GCMonitor {
  constructor() {
    this.memoryMetrics = [];
    this.setupMonitoring();
  }

  setupMonitoring() {
    // Modern browsers support PerformanceObserver for GC
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'measure' && entry.name.includes('gc')) {
              this.recordGCEvent(entry);
            }
          });
        });

        observer.observe({ entryTypes: ['measure'] });
      } catch (error) {
        console.log('GC monitoring not available:', error);
      }
    }

    // Manual memory monitoring
    this.startMemoryMonitoring();
  }

  startMemoryMonitoring() {
    const checkMemory = () => {
      if ('memory' in performance) {
        const memInfo = {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit,
          timestamp: Date.now(),
        };

        this.memoryMetrics.push(memInfo);
        this.analyzeMemoryTrends();
      }
    };

    // Check every 5 seconds
    setInterval(checkMemory, 5000);
    checkMemory();
  }

  analyzeMemoryTrends() {
    if (this.memoryMetrics.length < 3) return;

    const recent = this.memoryMetrics.slice(-3);
    const increasing = recent.every((curr, i) => i === 0 || curr.used > recent[i - 1].used);

    if (increasing) {
      const growth = recent[2].used - recent[0].used;
      const timespan = recent[2].timestamp - recent[0].timestamp;
      const growthRate = (growth / timespan) * 1000; // bytes per second

      if (growthRate > 100000) {
        // 100KB/s growth
        console.warn('Potential memory leak detected:', {
          growthRate: `${(growthRate / 1024).toFixed(2)} KB/s`,
          currentUsage: `${(recent[2].used / 1024 / 1024).toFixed(2)} MB`,
        });
      }
    }
  }

  recordGCEvent(entry) {
    console.log('GC Event:', {
      duration: entry.duration,
      startTime: entry.startTime,
      type: entry.name,
    });
  }

  triggerGC() {
    // Force garbage collection in development (Chrome DevTools)
    if (window.gc) {
      window.gc();
    } else {
      console.log('Manual GC not available. Use Chrome DevTools or --expose-gc flag');
    }
  }
}

// Initialize GC monitoring
const gcMonitor = new GCMonitor();
```

---

## Network Layer Optimization

### HTTP/3 and QUIC Protocol Benefits

Modern web applications can leverage HTTP/3 for improved performance, especially on mobile networks.

#### Understanding HTTP/3 Advantages

```javascript
// Monitor connection protocol and adapt accordingly
class NetworkOptimizer {
  constructor() {
    this.connectionInfo = this.getConnectionInfo();
    this.setupNetworkMonitoring();
  }

  getConnectionInfo() {
    const connection =
      navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const protocol = this.detectHTTPVersion();

    return {
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      saveData: connection?.saveData || false,
      protocol: protocol,
    };
  }

  detectHTTPVersion() {
    // Check if HTTP/3 is supported
    if ('navigator' in window && 'serviceWorker' in navigator) {
      // Use Performance API to detect protocol
      const entries = performance.getEntriesByType('navigation');
      if (entries.length > 0) {
        const navEntry = entries[0];
        return navEntry.nextHopProtocol || 'unknown';
      }
    }
    return 'unknown';
  }

  setupNetworkMonitoring() {
    // Monitor connection changes
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', () => {
        this.connectionInfo = this.getConnectionInfo();
        this.adaptToConnection();
      });
    }
  }

  adaptToConnection() {
    const { effectiveType, saveData, protocol } = this.connectionInfo;

    if (saveData) {
      this.enableDataSaver();
    }

    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        this.optimizeForSlowConnection();
        break;
      case '3g':
        this.optimizeForMediumConnection();
        break;
      case '4g':
        this.optimizeForFastConnection();
        break;
    }

    if (protocol.includes('h3') || protocol.includes('quic')) {
      this.enableHTTP3Optimizations();
    }
  }

  optimizeForSlowConnection() {
    // Aggressive resource reduction
    document.documentElement.classList.add('slow-connection');

    // Disable auto-loading content
    document.querySelectorAll('img[loading="eager"]').forEach((img) => {
      img.loading = 'lazy';
    });

    // Use WebP with aggressive compression
    this.enableAggressiveImageOptimization();
  }

  optimizeForMediumConnection() {
    document.documentElement.classList.add('medium-connection');

    // Selective preloading
    this.enableSelectivePreloading();
  }

  optimizeForFastConnection() {
    document.documentElement.classList.add('fast-connection');

    // Aggressive preloading and prefetching
    this.enableAggressivePreloading();
  }

  enableHTTP3Optimizations() {
    // Take advantage of HTTP/3 multiplexing
    document.documentElement.classList.add('http3-enabled');

    // Enable server push hints
    this.enableServerPushHints();

    // Use connection migration benefits
    this.setupConnectionMigration();
  }

  enableDataSaver() {
    // Implement data saving strategies
    document.documentElement.classList.add('data-saver');

    // Replace images with placeholders
    document.querySelectorAll('img:not([data-original])').forEach((img) => {
      img.dataset.original = img.src;
      img.src = this.generatePlaceholder(img.width, img.height);
    });
  }

  enableAggressiveImageOptimization() {
    // Use modern image formats with fallbacks
    document.querySelectorAll('img').forEach((img) => {
      if (!img.dataset.optimized) {
        this.optimizeImage(img);
        img.dataset.optimized = 'true';
      }
    });
  }

  optimizeImage(img) {
    const picture = document.createElement('picture');

    // AVIF for best compression
    const avifSource = document.createElement('source');
    avifSource.srcset = this.convertToFormat(img.src, 'avif');
    avifSource.type = 'image/avif';

    // WebP fallback
    const webpSource = document.createElement('source');
    webpSource.srcset = this.convertToFormat(img.src, 'webp');
    webpSource.type = 'image/webp';

    picture.appendChild(avifSource);
    picture.appendChild(webpSource);
    picture.appendChild(img.cloneNode(true));

    img.parentNode.replaceChild(picture, img);
  }

  convertToFormat(src, format) {
    // Placeholder for image format conversion
    // In reality, this would be handled by your image CDN
    return src.replace(/\.(jpg|jpeg|png)$/, `.${format}`);
  }

  generatePlaceholder(width, height) {
    // Generate SVG placeholder
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">
          ${width}×${height}
        </text>
      </svg>
    `)}`;
  }

  enableServerPushHints() {
    // Add server push hints for HTTP/3
    const criticalResources = ['/css/critical.css', '/js/app.js', '/fonts/main.woff2'];

    criticalResources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = this.getResourceType(resource);

      // Add push hint
      link.setAttribute('data-server-push', 'true');
      document.head.appendChild(link);
    });
  }

  getResourceType(url) {
    if (url.includes('.css')) return 'style';
    if (url.includes('.js')) return 'script';
    if (url.includes('.woff')) return 'font';
    return 'fetch';
  }

  setupConnectionMigration() {
    // Monitor for connection changes and prepare for migration
    let connectionStart = performance.now();

    const checkConnection = () => {
      const now = performance.now();
      const duration = now - connectionStart;

      // If connection seems unstable, prepare for migration
      if (duration > 5000 && this.connectionInfo.rtt > 500) {
        this.prepareConnectionMigration();
      }

      connectionStart = now;
    };

    setInterval(checkConnection, 1000);
  }

  prepareConnectionMigration() {
    // Prepare for potential connection migration in HTTP/3
    console.log('Preparing for connection migration');

    // Prebuffer critical resources
    this.prebufferCriticalResources();
  }

  prebufferCriticalResources() {
    const criticalUrls = ['/api/user-data', '/api/app-config'];

    criticalUrls.forEach(async (url) => {
      try {
        const response = await fetch(url);
        const data = await response.text();

        // Store in session storage for quick access
        sessionStorage.setItem(`prebuffer_${url}`, data);
      } catch (error) {
        console.warn('Failed to prebuffer:', url, error);
      }
    });
  }
}

// Initialize network optimizer
const networkOptimizer = new NetworkOptimizer();
```

---

## Security & Loading Performance

### Content Security Policy (CSP) Impact

CSP can significantly affect loading performance. Understanding how to optimize both security and performance is crucial.

#### Implementing Performance-Aware CSP

```javascript
// Optimize CSP for both security and performance
class CSPOptimizer {
  constructor() {
    this.cspConfig = this.generateOptimalCSP();
    this.nonces = new Map();
    this.setupCSPMonitoring();
  }

  generateOptimalCSP() {
    const basePolicy = {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'nonce-{SCRIPT_NONCE}'", 'https://trusted-cdn.com'],
      'style-src': ["'self'", "'nonce-{STYLE_NONCE}'", 'https://fonts.googleapis.com'],
      'img-src': ["'self'", 'data:', 'https:', 'blob:'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'connect-src': ["'self'", 'https://api.example.com', 'wss://websocket.example.com'],
      'media-src': ["'self'", 'blob:', 'https:'],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'upgrade-insecure-requests': [],
    };

    return this.optimizeForPerformance(basePolicy);
  }

  optimizeForPerformance(policy) {
    // Add performance-related CSP directives
    const performanceOptimized = {
      ...policy,
      'report-uri': ['/csp-report'],
      'report-to': ['csp-endpoint'],
    };

    // Enable resource hints within CSP
    performanceOptimized['prefetch-src'] = ["'self'", 'https://cdn.example.com'];

    return performanceOptimized;
  }

  generateNonce(type) {
    const nonce = btoa(crypto.getRandomValues(new Uint8Array(16)).join(''));
    this.nonces.set(type, nonce);
    return nonce;
  }

  applyCSP() {
    const scriptNonce = this.generateNonce('script');
    const styleNonce = this.generateNonce('style');

    let policyString = '';

    Object.entries(this.cspConfig).forEach(([directive, sources]) => {
      if (sources.length === 0) {
        policyString += `${directive}; `;
      } else {
        const processedSources = sources.map((source) =>
          source.replace('{SCRIPT_NONCE}', scriptNonce).replace('{STYLE_NONCE}', styleNonce),
        );
        policyString += `${directive} ${processedSources.join(' ')}; `;
      }
    });

    // Apply via meta tag for immediate effect
    const metaCSP = document.createElement('meta');
    metaCSP.httpEquiv = 'Content-Security-Policy';
    metaCSP.content = policyString.trim();
    document.head.appendChild(metaCSP);

    return { scriptNonce, styleNonce };
  }

  createSecureScript(src, nonce) {
    const script = document.createElement('script');
    script.src = src;
    script.nonce = nonce;

    // Add integrity check for external scripts
    if (src.startsWith('https://') && !src.includes(location.hostname)) {
      script.integrity = this.generateIntegrityHash(src);
      script.crossOrigin = 'anonymous';
    }

    return script;
  }

  createSecureStyle(href, nonce) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.nonce = nonce;

    // Add integrity for external stylesheets
    if (href.startsWith('https://') && !href.includes(location.hostname)) {
      link.integrity = this.generateIntegrityHash(href);
      link.crossOrigin = 'anonymous';
    }

    return link;
  }

  async generateIntegrityHash(url) {
    try {
      const response = await fetch(url);
      const content = await response.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', content);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      return `sha256-${btoa(hashHex)}`;
    } catch (error) {
      console.warn('Failed to generate integrity hash for:', url);
      return '';
    }
  }

  setupCSPMonitoring() {
    // Monitor CSP violations
    document.addEventListener('securitypolicyviolation', (event) => {
      const violation = {
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        originalPolicy: event.originalPolicy,
        sourceFile: event.sourceFile,
        lineNumber: event.lineNumber,
        timestamp: Date.now(),
      };

      this.reportViolation(violation);
      this.analyzePerformanceImpact(violation);
    });
  }

  reportViolation(violation) {
    // Send violation report to server
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/csp-report', JSON.stringify(violation));
    }

    console.warn('CSP Violation:', violation);
  }

  analyzePerformanceImpact(violation) {
    // Check if violation affects performance-critical resources
    const criticalResources = ['/css/critical.css', '/js/app.js', 'https://fonts.googleapis.com'];

    const isCritical = criticalResources.some((resource) =>
      violation.blockedURI.includes(resource),
    );

    if (isCritical) {
      console.error('CSP blocking critical resource:', violation.blockedURI);
      this.handleCriticalViolation(violation);
    }
  }

  handleCriticalViolation(violation) {
    // Implement fallback loading strategy
    if (violation.violatedDirective.includes('script-src')) {
      this.loadScriptFallback(violation.blockedURI);
    } else if (violation.violatedDirective.includes('style-src')) {
      this.loadStyleFallback(violation.blockedURI);
    }
  }

  loadScriptFallback(originalSrc) {
    // Try loading from alternative source
    const fallbackSrc = originalSrc.replace('https://external-cdn.com', '/fallback');

    const script = document.createElement('script');
    script.src = fallbackSrc;
    script.nonce = this.nonces.get('script');
    document.head.appendChild(script);
  }

  loadStyleFallback(originalHref) {
    // Inline critical CSS as fallback
    const fallbackCSS = this.getCriticalCSS();

    const style = document.createElement('style');
    style.nonce = this.nonces.get('style');
    style.textContent = fallbackCSS;
    document.head.appendChild(style);
  }

  getCriticalCSS() {
    // Return minimal critical CSS
    return `
      body { font-family: system-ui, sans-serif; }
      .critical { display: block; }
      .loading { opacity: 0.5; }
    `;
  }
}

// Initialize CSP optimizer
const cspOptimizer = new CSPOptimizer();
const { scriptNonce, styleNonce } = cspOptimizer.applyCSP();

// Use secure script loading
const secureScript = cspOptimizer.createSecureScript('/js/app.js', scriptNonce);
document.head.appendChild(secureScript);
```

### CORS and Cross-Origin Resource Optimization

#### Optimizing Cross-Origin Requests

```javascript
// Handle CORS efficiently for better performance
class CORSOptimizer {
  constructor() {
    this.trustedOrigins = new Set([
      'https://api.example.com',
      'https://cdn.example.com',
      'https://fonts.googleapis.com',
    ]);
    this.preflightCache = new Map();
    this.setupCORSOptimization();
  }

  setupCORSOptimization() {
    // Override fetch to optimize CORS requests
    const originalFetch = window.fetch;

    window.fetch = async (url, options = {}) => {
      const optimizedOptions = this.optimizeCORSRequest(url, options);

      try {
        return await originalFetch(url, optimizedOptions);
      } catch (error) {
        return this.handleCORSError(url, options, error);
      }
    };
  }

  optimizeCORSRequest(url, options) {
    const urlObj = new URL(url, window.location.origin);
    const isCrossOrigin = urlObj.origin !== window.location.origin;

    if (!isCrossOrigin) {
      return options; // No optimization needed for same-origin
    }

    const optimized = { ...options };

    // Optimize headers to avoid preflight when possible
    if (optimized.headers) {
      optimized.headers = this.optimizeHeaders(optimized.headers);
    }

    // Use simple methods when possible
    if (!optimized.method || optimized.method === 'GET') {
      optimized.method = 'GET';
    }

    // Add credentials only when needed
    if (this.trustedOrigins.has(urlObj.origin)) {
      optimized.credentials = 'include';
    } else {
      optimized.credentials = 'omit';
    }

    // Cache preflight responses
    if (this.requiresPreflight(optimized)) {
      this.cachePreflightResponse(urlObj.origin);
    }

    return optimized;
  }

  optimizeHeaders(headers) {
    const optimized = new Headers(headers);

    // Remove headers that trigger preflight if not necessary
    const simpleHeaders = ['accept', 'accept-language', 'content-language', 'content-type'];

    const allowedContentTypes = [
      'application/x-www-form-urlencoded',
      'multipart/form-data',
      'text/plain',
    ];

    // Only keep simple headers when possible
    for (const [name, value] of optimized.entries()) {
      const lowerName = name.toLowerCase();

      if (!simpleHeaders.includes(lowerName)) {
        // Check if this header is really necessary
        if (!this.isEssentialHeader(lowerName, value)) {
          optimized.delete(name);
        }
      }

      // Optimize Content-Type
      if (lowerName === 'content-type' && !allowedContentTypes.includes(value)) {
        if (value.includes('application/json')) {
          // This will trigger preflight, but it's often necessary
          continue;
        }
      }
    }

    return optimized;
  }

  isEssentialHeader(name, value) {
    const essentialHeaders = ['authorization', 'x-api-key', 'x-csrf-token'];

    return essentialHeaders.includes(name);
  }

  requiresPreflight(options) {
    // Determine if request requires preflight
    const method = options.method?.toUpperCase() || 'GET';
    const simpleMethods = ['GET', 'HEAD', 'POST'];

    if (!simpleMethods.includes(method)) {
      return true;
    }

    // Check headers
    if (options.headers) {
      const headers = new Headers(options.headers);
      for (const [name] of headers.entries()) {
        if (!this.isSimpleHeader(name)) {
          return true;
        }
      }
    }

    return false;
  }

  isSimpleHeader(name) {
    const simpleHeaders = ['accept', 'accept-language', 'content-language', 'content-type'];

    return simpleHeaders.includes(name.toLowerCase());
  }

  cachePreflightResponse(origin) {
    if (this.preflightCache.has(origin)) {
      return; // Already cached
    }

    // Cache preflight response metadata
    this.preflightCache.set(origin, {
      timestamp: Date.now(),
      maxAge: 86400000, // 24 hours default
    });

    // Set timeout to clear cache
    setTimeout(() => {
      this.preflightCache.delete(origin);
    }, 86400000);
  }

  async handleCORSError(url, options, error) {
    console.warn('CORS error for:', url, error);

    // Try fallback strategies
    const urlObj = new URL(url, window.location.origin);

    // Strategy 1: Try with JSONP for GET requests
    if (options.method === 'GET' || !options.method) {
      const jsonpResult = await this.tryJSONP(url);
      if (jsonpResult) {
        return new Response(JSON.stringify(jsonpResult), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Strategy 2: Use proxy server
    const proxyUrl = `/proxy?url=${encodeURIComponent(url)}`;
    try {
      return await fetch(proxyUrl, options);
    } catch (proxyError) {
      console.warn('Proxy fallback failed:', proxyError);
    }

    // Strategy 3: Return cached response if available
    const cached = await this.getCachedResponse(url);
    if (cached) {
      console.log('Returning cached response for CORS failed request');
      return cached;
    }

    // Re-throw original error if all strategies fail
    throw error;
  }

  tryJSONP(url) {
    return new Promise((resolve, reject) => {
      const callbackName = `jsonp_${Date.now()}_${Math.random().toString(36).substr(2)}`;
      const script = document.createElement('script');

      // Set up callback
      window[callbackName] = (data) => {
        document.head.removeChild(script);
        delete window[callbackName];
        resolve(data);
      };

      // Set up error handling
      script.onerror = () => {
        document.head.removeChild(script);
        delete window[callbackName];
        reject(new Error('JSONP failed'));
      };

      // Add callback parameter to URL
      const separator = url.includes('?') ? '&' : '?';
      script.src = `${url}${separator}callback=${callbackName}`;

      document.head.appendChild(script);

      // Timeout after 10 seconds
      setTimeout(() => {
        if (script.parentNode) {
          document.head.removeChild(script);
          delete window[callbackName];
          reject(new Error('JSONP timeout'));
        }
      }, 10000);
    });
  }

  async getCachedResponse(url) {
    if ('caches' in window) {
      const cache = await caches.open('cors-fallback');
      return await cache.match(url);
    }
    return null;
  }

  // Performance monitoring for CORS requests
  monitorCORSPerformance() {
    const corsMetrics = {
      preflightCount: 0,
      preflightTime: 0,
      corsErrors: 0,
      successfulRequests: 0,
    };

    // Monitor using Performance Observer
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('://') && !entry.name.startsWith(location.origin)) {
          corsMetrics.successfulRequests++;

          // Check if request had preflight
          if (entry.requestStart - entry.fetchStart > 50) {
            // Threshold for preflight
            corsMetrics.preflightCount++;
            corsMetrics.preflightTime += entry.requestStart - entry.fetchStart;
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    // Report metrics periodically
    setInterval(() => {
      if (corsMetrics.successfulRequests > 0) {
        console.log('CORS Performance Metrics:', {
          ...corsMetrics,
          avgPreflightTime: corsMetrics.preflightTime / corsMetrics.preflightCount || 0,
        });
      }
    }, 30000);
  }
}

// Initialize CORS optimizer
const corsOptimizer = new CORSOptimizer();
corsOptimizer.monitorCORSPerformance();
```

### Subresource Integrity and Performance

#### Balancing Security and Speed

```javascript
// Implement SRI with performance considerations
class SRIOptimizer {
  constructor() {
    this.integrityCache = new Map();
    this.setupSRIOptimization();
  }

  setupSRIOptimization() {
    // Automatically add SRI to external resources
    this.observeResourceAdditions();
    this.optimizeExistingResources();
  }

  observeResourceAdditions() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.processElement(node);
          }
        });
      });
    });

    observer.observe(document, {
      childList: true,
      subtree: true,
    });
  }

  optimizeExistingResources() {
    // Process existing script and link elements
    document.querySelectorAll('script[src], link[rel="stylesheet"]').forEach((element) => {
      this.processElement(element);
    });
  }

  processElement(element) {
    const tagName = element.tagName.toLowerCase();

    if (tagName === 'script' && element.src) {
      this.addSRIToScript(element);
    } else if (tagName === 'link' && element.rel === 'stylesheet' && element.href) {
      this.addSRIToStylesheet(element);
    }
  }

  async addSRIToScript(script) {
    if (script.integrity || !this.shouldAddSRI(script.src)) {
      return;
    }

    const integrity = await this.generateOrGetIntegrity(script.src);
    if (integrity) {
      script.integrity = integrity;
      script.crossOrigin = 'anonymous';

      // Add fallback handling
      this.addFallbackHandling(script);
    }
  }

  async addSRIToStylesheet(link) {
    if (link.integrity || !this.shouldAddSRI(link.href)) {
      return;
    }

    const integrity = await this.generateOrGetIntegrity(link.href);
    if (integrity) {
      link.integrity = integrity;
      link.crossOrigin = 'anonymous';

      // Add fallback handling
      this.addFallbackHandling(link);
    }
  }

  shouldAddSRI(url) {
    try {
      const urlObj = new URL(url, window.location.origin);

      // Only add SRI to cross-origin resources
      if (urlObj.origin === window.location.origin) {
        return false;
      }

      // Skip certain domains that don't support CORS
      const skipDomains = ['googletagmanager.com', 'google-analytics.com'];

      return !skipDomains.some((domain) => urlObj.hostname.includes(domain));
    } catch (error) {
      return false;
    }
  }

  async generateOrGetIntegrity(url) {
    // Check cache first
    if (this.integrityCache.has(url)) {
      return this.integrityCache.get(url);
    }

    try {
      // Fetch resource with no-cors mode first
      const response = await fetch(url, { mode: 'cors' });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const content = await response.arrayBuffer();
      const integrity = await this.computeIntegrity(content);

      // Cache the integrity hash
      this.integrityCache.set(url, integrity);

      return integrity;
    } catch (error) {
      console.warn('Failed to generate SRI for:', url, error);
      return null;
    }
  }

  async computeIntegrity(content) {
    // Generate SHA-384 hash (recommended for SRI)
    const hashBuffer = await crypto.subtle.digest('SHA-384', content);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashBase64 = btoa(String.fromCharCode(...hashArray));
    return `sha384-${hashBase64}`;
  }

  addFallbackHandling(element) {
    const originalSrc = element.src || element.href;

    element.addEventListener('error', async (event) => {
      console.warn('SRI validation failed for:', originalSrc);

      // Try loading without SRI
      const fallback = element.cloneNode(true);
      fallback.removeAttribute('integrity');
      fallback.removeAttribute('crossorigin');

      // For scripts, try local fallback
      if (element.tagName.toLowerCase() === 'script') {
        await this.tryScriptFallback(fallback, originalSrc);
      } else {
        await this.tryStylesheetFallback(fallback, originalSrc);
      }

      // Replace original element
      element.parentNode.replaceChild(fallback, element);
    });
  }

  async tryScriptFallback(script, originalSrc) {
    // Try to load from local backup
    const fallbackSrc = this.getFallbackURL(originalSrc, 'js');

    if (fallbackSrc) {
      script.src = fallbackSrc;
    } else {
      // Load inline fallback if available
      const inlineFallback = this.getInlineScriptFallback(originalSrc);
      if (inlineFallback) {
        const inlineScript = document.createElement('script');
        inlineScript.textContent = inlineFallback;
        script.parentNode.replaceChild(inlineScript, script);
      }
    }
  }

  async tryStylesheetFallback(link, originalHref) {
    const fallbackHref = this.getFallbackURL(originalHref, 'css');

    if (fallbackHref) {
      link.href = fallbackHref;
    } else {
      // Load inline CSS fallback
      const inlineFallback = this.getInlineCSSFallback(originalHref);
      if (inlineFallback) {
        const style = document.createElement('style');
        style.textContent = inlineFallback;
        link.parentNode.replaceChild(style, link);
      }
    }
  }

  getFallbackURL(originalUrl, type) {
    // Map external URLs to local fallbacks
    const fallbackMap = {
      'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css':
        '/css/bootstrap.min.css',
      'https://code.jquery.com/jquery-3.6.0.min.js': '/js/jquery.min.js',
    };

    return fallbackMap[originalUrl] || null;
  }

  getInlineScriptFallback(originalSrc) {
    // Provide minimal inline fallbacks for critical scripts
    const fallbacks = {
      jquery: 'window.jQuery = window.$ = function() { console.warn("jQuery fallback loaded"); };',
    };

    for (const [key, code] of Object.entries(fallbacks)) {
      if (originalSrc.includes(key)) {
        return code;
      }
    }

    return null;
  }

  getInlineCSSFallback(originalHref) {
    // Provide minimal CSS fallbacks
    const fallbacks = {
      bootstrap: `
        .container { max-width: 1200px; margin: 0 auto; padding: 0 15px; }
        .row { display: flex; flex-wrap: wrap; margin: 0 -15px; }
        .col { flex: 1; padding: 0 15px; }
      `,
    };

    for (const [key, css] of Object.entries(fallbacks)) {
      if (originalHref.includes(key)) {
        return css;
      }
    }

    return null;
  }

  // Performance monitoring for SRI
  monitorSRIPerformance() {
    const sriMetrics = {
      totalResources: 0,
      sriEnabled: 0,
      sriFailures: 0,
      fallbacksUsed: 0,
    };

    // Monitor resource loading
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('://') && !entry.name.startsWith(location.origin)) {
          sriMetrics.totalResources++;

          // Check if resource has SRI
          const element = this.findElementByURL(entry.name);
          if (element && element.integrity) {
            sriMetrics.sriEnabled++;
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    // Monitor SRI failures
    document.addEventListener(
      'error',
      (event) => {
        if (event.target.integrity) {
          sriMetrics.sriFailures++;
          sriMetrics.fallbacksUsed++;
        }
      },
      true,
    );

    // Report metrics
    setInterval(() => {
      console.log('SRI Performance Metrics:', sriMetrics);
    }, 30000);
  }

  findElementByURL(url) {
    return document.querySelector(`script[src="${url}"], link[href="${url}"]`);
  }
}

// Initialize SRI optimizer
const sriOptimizer = new SRIOptimizer();
sriOptimizer.monitorSRIPerformance();
```
