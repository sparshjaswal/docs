---
id: javascript-flow-of-control
title: Flow Control in JavaScript
slug: /javascript/flow-of-control
sidebar_label: Flow Control in JavaScript
---

# Flow Control in JavaScript

Flow control in JavaScript allows programmers to control the execution of code based on specific conditions. The main control structures are `if...else`, `switch`, and conditional operators.

## If...Else Statement

The `if` statement specifies a block of code to be executed when a condition is true, while `else` specifies what happens when the condition is false.

```javascript
if (condition) {
  // block of code to be executed if the condition is true
} else {
  // block of code to be executed if the condition is false
}
```

While `if...else` works well for 2-4 conditions, code can become complex and less readable when dealing with more conditions.

## Falsy Values in JavaScript

The following values are considered falsy in JavaScript:

- `undefined`
- `null`
- `0`
- `false`
- `''` (empty string)
- `NaN`

### Examples of Falsy Value Comparisons

```javascript
// All falsy values in a condition
if (undefined && NaN && null && '' && 0 && false) {
  console.log('true');
} else {
  console.log('false'); // outputs: false
}

// Comparing false with different values
console.log(false == undefined); // false
console.log(false == NaN); // false
console.log(false == null); // false
console.log(false == ''); // true
console.log(false == 0); // true
console.log(false == false); // true
```

## Short-Circuiting

JavaScript uses short-circuit evaluation when processing logical operators:

### Logical AND (&&)

- If any operand is false, the remaining operands are not evaluated
- Returns false immediately upon encountering a falsy value

### Logical OR (||)

- If any operand is true, the remaining operands are not evaluated
- Returns true immediately upon encountering a truthy value

## Equality Operators (== vs ===)

### Abstract Equality (==)

The double equals operator tests for abstract equality with type coercion:

1. **Numbers & Strings**
   - String is converted to a number before comparison

2. **Boolean & Non-Boolean**
   - Non-boolean is converted to a boolean before comparison

3. **Object & Primitive**
   - Object is converted to primitive type before comparison

### Strict Equality (===)

The triple equals operator tests for strict equality without type coercion, requiring both value and type to match.

## Switch Statement

The `switch` statement provides a way to execute different code blocks based on different conditions:

```javascript
switch (expression) {
  case unique_value:
    statement;
    break;
  default:
    default_statement;
}
```

## Special Comparison Cases

Here are some interesting comparison cases in JavaScript:

```javascript
// Null and Undefined
console.log(null == undefined); // true
console.log(null === undefined); // false

// Zero Comparisons
console.log(-0 == +0); // true
console.log(-0 == 0); // true
console.log(0 == +0); // true

// Infinity and NaN
console.log(0 / 0); // NaN
console.log(1 / 0); // Infinity
console.log(-1 / 0); // -Infinity
console.log(-Infinity == +Infinity); // false
console.log('this is string' / 5); // NaN

// NaN Comparisons
console.log(NaN === NaN); // false
console.log(NaN !== NaN); // true

// Falsy Value Comparisons
console.log(false == ''); // true
console.log(false == null); // false
console.log(false == undefined); // false
console.log(false == 0); // true
console.log(false == NaN); // false
```

### Object.is()

`Object.is()` provides a way to compare values that handles special cases differently from `==` and `===`:

```javascript
Object.is(0, -0); // false
Object.is(-0, -0); // true
Object.is(NaN, 0 / 0); // true
```
