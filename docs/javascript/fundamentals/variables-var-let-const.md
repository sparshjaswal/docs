---
id: javascript-fundamentals-variables-var-let-const
title: "var, let & const"
slug: /javascript/fundamentals/variables-var-let-const
sidebar_label: "var, let & const"
---

# var, let & const

## Variable Declaration Keywords

### var (ES5)

- Function-scoped or globally-scoped
- Can be redeclared and updated
- Hoisted with `undefined` value

```javascript
var name = 'John';
var name = 'Jane'; // Redeclaration allowed
name = 'Bob'; // Update allowed

function example() {
  var x = 1;
  if (true) {
    var x = 2; // Same variable
    console.log(x); // 2
  }
  console.log(x); // 2
}
```

### let (ES6)

- Block-scoped
- Cannot be redeclared in same scope
- Can be updated
- Hoisted but not initialized (Temporal Dead Zone)

```javascript
let age = 25;
// let age = 30; // Error: Cannot redeclare
age = 30; // Update allowed

function example() {
  let y = 1;
  if (true) {
    let y = 2; // Different variable (block scope)
    console.log(y); // 2
  }
  console.log(y); // 1
}
```

### const (ES6)

- Block-scoped
- Cannot be redeclared or updated
- Must be initialized at declaration
- Hoisted but not initialized (Temporal Dead Zone)

```javascript
const PI = 3.14159;
// const PI = 3.14; // Error: Cannot redeclare
// PI = 3.14; // Error: Cannot update

// Must initialize
// const value; // Error: Missing initializer
```

## Important Differences

### Scope Comparison

```javascript
function scopeExample() {
  var varVariable = 'var';
  let letVariable = 'let';
  const constVariable = 'const';

  if (true) {
    var varInBlock = 'var in block';
    let letInBlock = 'let in block';
    const constInBlock = 'const in block';
  }

  console.log(varInBlock); // "var in block" - accessible
  // console.log(letInBlock); // Error: not defined
  // console.log(constInBlock); // Error: not defined
}
```

### Hoisting Behavior

```javascript
// var hoisting
console.log(hoistedVar); // undefined (not error)
var hoistedVar = "I'm hoisted";

// let/const hoisting (Temporal Dead Zone)
// console.log(hoistedLet); // Error: Cannot access before initialization
let hoistedLet = "I'm in TDZ";

// console.log(hoistedConst); // Error: Cannot access before initialization
const hoistedConst = "I'm in TDZ";
```

### Object/Array with const

```javascript
// const prevents reassignment, not mutation
const arr = [1, 2, 3];
arr.push(4); // Allowed - mutating content
console.log(arr); // [1, 2, 3, 4]
// arr = [5, 6, 7]; // Error: Cannot reassign

const obj = { name: 'John' };
obj.name = 'Jane'; // Allowed - mutating property
obj.age = 25; // Allowed - adding property
console.log(obj); // { name: "Jane", age: 25 }
// obj = {}; // Error: Cannot reassign
```

## Best Practices

1. Use `const` by default
2. Use `let` when you need to reassign the variable
3. Avoid `var` in modern JavaScript
4. Always declare variables at the top of their scope

## Quick Reference Table

| Feature    | var             | let      | const    |
| ---------- | --------------- | -------- | -------- |
| Scope      | Function/Global | Block    | Block    |
| Redeclare  | ✅              | ❌       | ❌       |
| Update     | ✅              | ✅       | ❌       |
| Hoisting   | ✅ (undefined)  | ✅ (TDZ) | ✅ (TDZ) |
| Initialize | Optional        | Optional | Required |
