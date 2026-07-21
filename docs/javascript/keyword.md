# 🔑 Chapter 3: Keywords and Identifiers in JavaScript

## 📝 Understanding Identifiers

**Identifiers** are names that you create as a programmer to identify variables, functions, objects, classes, and other elements in your code. Think of them as labels that help you and JavaScript recognize different parts of your program.

### 🎯 What Makes a Valid Identifier?

Identifiers must follow specific rules to be valid in JavaScript:

#### ✅ Valid Rules

1. **Must start with:**
   - A letter (a-z, A-Z)
   - An underscore (_)
   - A dollar sign ($)

2. **After the first character, can contain:**
   - Letters (a-z, A-Z)
   - Numbers (0-9)
   - Underscores (_)
   - Dollar signs ($)

3. **Case-sensitive**
   - `myVariable` and `MyVariable` are different identifiers

4. **Cannot be a reserved word** (keyword)

#### ❌ Invalid Examples

```javascript
// ❌ Cannot start with a number
let 1variable = "invalid";

// ❌ Cannot contain spaces
let my variable = "invalid";

// ❌ Cannot contain special characters (except _ and $)
let my-variable = "invalid";
let my@variable = "invalid";

// ❌ Cannot be a reserved keyword
let let = "invalid";
let function = "invalid";
```

#### ✅ Valid Examples

```javascript
// ✅ Valid identifiers
let myVariable = 'valid';
let _privateVar = 'valid';
let $element = 'valid';
let user123 = 'valid';
let camelCaseVariable = 'valid';
let CONSTANT_VALUE = 'valid';

// ✅ Valid function names
function calculateTotal() {}
function _helperFunction() {}
function $jQuery() {}

// ✅ Valid object properties
const person = {
  firstName: 'John',
  lastName: 'Doe',
  age_in_years: 30,
};
```

### 🎨 Naming Conventions

While JavaScript allows many naming patterns, following conventions makes your code more readable and maintainable:

#### 🐪 camelCase (Recommended for variables and functions)

```javascript
let firstName = 'John';
let calculateTotalPrice = function () {};
let userAccountBalance = 1000;
```

#### 🏛️ PascalCase (Recommended for classes and constructors)

```javascript
class UserAccount {}
class BankingSystem {}
function PersonConstructor() {}
```

#### 🔤 UPPER_SNAKE_CASE (Recommended for constants)

```javascript
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT = 5000;
```

#### 🐍 snake_case (Less common in JavaScript)

```javascript
let user_name = 'john_doe'; // Less preferred
let api_response = {}; // Less preferred
```

---

## 🔒 Understanding Keywords

**Keywords** are reserved words that have special meaning in JavaScript. They are part of the language syntax and cannot be used as identifiers.

### 📋 Complete List of JavaScript Keywords

| Category                 | Keywords                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------ |
| **🔄 Control Flow**      | `if`, `else`, `switch`, `case`, `default`, `for`, `while`, `do`, `break`, `continue` |
| **📦 Variables**         | `var`, `let`, `const`                                                                |
| **🔧 Functions**         | `function`, `return`, `async`, `await`, `yield`                                      |
| **🏗️ Objects & Classes** | `class`, `extends`, `super`, `static`, `new`, `this`                                 |
| **📤📥 Modules**         | `import`, `export`                                                                   |
| **⚠️ Error Handling**    | `try`, `catch`, `finally`, `throw`                                                   |
| **🔍 Operators**         | `typeof`, `instanceof`, `in`, `delete`, `void`                                       |
| **📄 Values**            | `null`, `undefined`, `true`, `false`                                                 |
| **🚫 Deprecated**        | `with`, `debugger`                                                                   |
| **🆔 Special**           | `Symbol`                                                                             |

### 📊 Keywords Reference Table

| Keyword      | Category       | Purpose                      | Example                                         |
| ------------ | -------------- | ---------------------------- | ----------------------------------------------- |
| `async`      | Functions      | Declares async function      | `async function fetchData() {}`                 |
| `await`      | Functions      | Waits for promise resolution | `const data = await fetch(url);`                |
| `break`      | Control Flow   | Exits loop or switch         | `for(let i=0; i<10; i++) { if(i===5) break; }`  |
| `case`       | Control Flow   | Switch case label            | `switch(x) { case 1: console.log('one'); }`     |
| `catch`      | Error Handling | Catches exceptions           | `try {} catch(error) {}`                        |
| `class`      | OOP            | Declares a class             | `class Person {}`                               |
| `const`      | Variables      | Declares constant            | `const PI = 3.14159;`                           |
| `continue`   | Control Flow   | Skips iteration              | `for(let i=0; i<10; i++) { if(i%2) continue; }` |
| `debugger`   | Debug          | Breakpoint for debugging     | `debugger; // Pauses execution`                 |
| `default`    | Control Flow   | Default case in switch       | `switch(x) { default: console.log('other'); }`  |
| `delete`     | Operators      | Deletes object property      | `delete obj.property;`                          |
| `do`         | Control Flow   | Do-while loop                | `do { console.log('hello'); } while(false);`    |
| `else`       | Control Flow   | Alternative condition        | `if(true) {} else {}`                           |
| `export`     | Modules        | Exports from module          | `export const myVar = 42;`                      |
| `extends`    | OOP            | Class inheritance            | `class Dog extends Animal {}`                   |
| `false`      | Values         | Boolean false value          | `const isReady = false;`                        |
| `finally`    | Error Handling | Always executes              | `try {} catch {} finally {}`                    |
| `for`        | Control Flow   | For loop                     | `for(let i=0; i<10; i++) {}`                    |
| `function`   | Functions      | Declares function            | `function greet() {}`                           |
| `if`         | Control Flow   | Conditional statement        | `if(condition) {}`                              |
| `import`     | Modules        | Imports from module          | `import React from 'react';`                    |
| `in`         | Operators      | Property existence check     | `'name' in person`                              |
| `instanceof` | Operators      | Instance type check          | `obj instanceof Array`                          |
| `let`        | Variables      | Block-scoped variable        | `let count = 0;`                                |
| `new`        | Operators      | Creates instance             | `const date = new Date();`                      |
| `null`       | Values         | Null value                   | `const data = null;`                            |
| `return`     | Functions      | Returns value                | `function add(a,b) { return a + b; }`           |
| `static`     | OOP            | Static class member          | `class Utils { static helper() {} }`            |
| `super`      | OOP            | Parent class reference       | `super.methodName();`                           |
| `switch`     | Control Flow   | Multi-way branch             | `switch(value) { case 1: break; }`              |
| `this`       | Context        | Current object reference     | `this.property`                                 |
| `throw`      | Error Handling | Throws exception             | `throw new Error('message');`                   |
| `true`       | Values         | Boolean true value           | `const isValid = true;`                         |
| `try`        | Error Handling | Tries code block             | `try { riskyCode(); }`                          |
| `typeof`     | Operators      | Type checking                | `typeof variable === 'string'`                  |
| `undefined`  | Values         | Undefined value              | `let x; // x is undefined`                      |
| `var`        | Variables      | Function-scoped variable     | `var name = 'John';`                            |
| `void`       | Operators      | Returns undefined            | `void 0`                                        |
| `while`      | Control Flow   | While loop                   | `while(condition) {}`                           |
| `with`       | Deprecated     | Extends scope chain          | `with(obj) {} // Not recommended`               |
| `yield`      | Functions      | Generator yield              | `function* gen() { yield 1; }`                  |

---

## 🎯 Practical Examples

### 🔄 Control Flow Keywords

```javascript
// if, else, switch, case, default
function checkGrade(score) {
  if (score >= 90) {
    return 'A';
  } else if (score >= 80) {
    return 'B';
  } else {
    switch (true) {
      case score >= 70:
        return 'C';
      case score >= 60:
        return 'D';
      default:
        return 'F';
    }
  }
}

// for, while, do, break, continue
function processNumbers() {
  for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) continue; // Skip even numbers
    if (i > 7) break; // Stop when i > 7
    console.log(i); // Prints: 1, 3, 5, 7
  }
}
```

### 📦 Variable Declaration Keywords

```javascript
// var, let, const
var globalVar = "I'm function-scoped"; // Function-scoped
let blockVar = "I'm block-scoped"; // Block-scoped
const constantVar = "I can't be reassigned"; // Block-scoped, immutable

function demonstrateScope() {
  if (true) {
    var funcScoped = 'accessible outside this block';
    let blockScoped = 'only accessible in this block';
    const alsoBlockScoped = 'also only in this block';
  }

  console.log(funcScoped); // ✅ Works
  // console.log(blockScoped); // ❌ Error
  // console.log(alsoBlockScoped); // ❌ Error
}
```

### 🏗️ Object-Oriented Keywords

```javascript
// class, extends, super, static, new, this
class Animal {
  constructor(name) {
    this.name = name;
  }

  static getSpecies() {
    return 'Unknown species';
  }

  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Call parent constructor
    this.breed = breed;
  }

  speak() {
    console.log(`${this.name} barks`);
  }
}

const myDog = new Dog('Buddy', 'Golden Retriever');
myDog.speak(); // "Buddy barks"
```

### ⚡ Async Keywords

```javascript
// async, await
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const userData = await response.json();
    return userData;
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

// Using the async function
fetchUserData(123)
  .then((user) => console.log(user))
  .catch((error) => console.error(error));
```

---

## ⚠️ Common Mistakes and Best Practices

### 🚫 Don't Use Keywords as Identifiers

```javascript
// ❌ BAD - Using keywords
let class = "Math";      // SyntaxError
let function = "helper"; // SyntaxError
let var = "variable";    // SyntaxError

// ✅ GOOD - Valid alternatives
let className = "Math";
let functionName = "helper";
let variableName = "variable";
```

### 🎯 Choose Meaningful Names

```javascript
// ❌ BAD - Unclear names
let x = 'John';
let fn = function () {};
let d = new Date();

// ✅ GOOD - Descriptive names
let userName = 'John';
let calculateTotal = function () {};
let currentDate = new Date();
```

### 📏 Use Consistent Naming Conventions

```javascript
// ❌ BAD - Inconsistent
let user_name = 'John';
let UserAge = 30;
let USERTYPE = 'admin';

// ✅ GOOD - Consistent camelCase
let userName = 'John';
let userAge = 30;
let userType = 'admin';
```

---

## 🧪 Practice Exercises

### Exercise 1: Identify Valid Identifiers

Which of these are valid JavaScript identifiers?

```javascript
// Your task: Mark each as ✅ valid or ❌ invalid
let _underscore;      // ?
let $dollar;          // ?
let 123number;        // ?
let my-variable;      // ?
let firstName;        // ?
let class;            // ?
let MyClass;          // ?
let CONSTANT_VALUE;   // ?
```

### Exercise 2: Fix the Keywords

Fix the code by replacing invalid keyword usage:

```javascript
// Fix this code
let function = "helper";
let class = "Person";
let var = 42;

function let() {
  return "this won't work";
}
```

### Exercise 3: Apply Naming Conventions

Rename these variables to follow JavaScript conventions:

```javascript
// Apply proper naming conventions
let user_first_name = "John";
let USERAGE = 30;
let user-type = "admin";
let IsActive = true;
```

---

## 🔑 Key Takeaways

1. **📝 Identifiers** are names you create; **🔒 Keywords** are reserved by JavaScript
2. **🎯 Naming conventions** make code more readable and maintainable
3. **⚠️ Avoid using keywords** as identifiers to prevent syntax errors
4. **🎨 Choose descriptive names** that clearly indicate purpose
5. **📏 Be consistent** with your naming patterns throughout your codebase

---

**🎓 Next Chapter**: Now that you understand how to name things in JavaScript, let's explore [different types of identifiers and data types](./fundamentals/types-of-identifiers.md) to understand what kinds of values these names can represent!
