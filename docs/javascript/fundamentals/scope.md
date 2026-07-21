---
id: javascript-fundamentals-scope
title: JavaScript Scope
slug: /javascript/fundamentals/scope
sidebar_label: JavaScript Scope
---

# JavaScript Scope

## What is Scope?

Scope determines where variables can be accessed in your code. JavaScript uses **lexical scoping** - the position where variables are declared determines their accessibility.

## Types of Scope

### 1. Global Scope

Variables declared outside any function or block:

```javascript
var globalVar = "I'm global";
let globalLet = 'Also global';

function test() {
  console.log(globalVar); // Accessible everywhere
}
```

### 2. Function Scope

Variables declared inside a function:

```javascript
function myFunction() {
  var functionScoped = 'Only inside function';
  console.log(functionScoped); // Works
}

// console.log(functionScoped); // Error: not defined
```

### 3. Block Scope

Variables declared inside `{}` blocks (let/const only):

```javascript
if (true) {
  let blockScoped = 'Only in this block';
  var functionScoped = 'Available in entire function';
}

// console.log(blockScoped); // Error: not defined
console.log(functionScoped); // Works (var ignores block scope)
```

## Scope Chain

JavaScript looks for variables from inner to outer scope:

```javascript
var x = 'global';

function outer() {
  var x = 'outer';

  function inner() {
    var x = 'inner';
    console.log(x); // "inner" (finds closest scope)
  }

  inner();
  console.log(x); // "outer"
}

outer();
console.log(x); // "global"
```

## Key Rules

- Inner scopes can access outer scope variables
- Outer scopes cannot access inner scope variables
- Variables are searched from innermost to outermost scope
- `var` is function-scoped, `let`/`const` are block-scoped
