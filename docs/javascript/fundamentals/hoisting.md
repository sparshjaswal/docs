# JavaScript Hoisting

## What is Hoisting?
Hoisting is JavaScript's default behavior of moving declarations to the top of their scope during the compilation phase. Only declarations are hoisted, not initializations.

## Variable Hoisting

### var Hoisting
```javascript
console.log(x); // undefined (not error)
var x = 5;
console.log(x); // 5

// What actually happens:
var x; // Declaration hoisted
console.log(x); // undefined
x = 5; // Assignment stays in place
console.log(x); // 5
```

### let and const Hoisting (Temporal Dead Zone)
```javascript
// console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 10;

// console.log(z); // ReferenceError: Cannot access 'z' before initialization
const z = 20;
```

## Function Hoisting

### Function Declarations
```javascript
// This works - function is fully hoisted
sayHello(); // "Hello!"

function sayHello() {
    console.log("Hello!");
}
```

### Function Expressions
```javascript
// This doesn't work - only variable is hoisted
// sayGoodbye(); // TypeError: sayGoodbye is not a function

var sayGoodbye = function() {
    console.log("Goodbye!");
};

sayGoodbye(); // "Goodbye!"
```

### Arrow Functions
```javascript
// This doesn't work - behaves like function expressions
// greet(); // TypeError: greet is not a function

var greet = () => {
    console.log("Hi!");
};

greet(); // "Hi!"
```

## Practical Examples

### Example 1: Variable Hoisting
```javascript
function example() {
    console.log(a); // undefined (not error)
    var a = 1;
    console.log(a); // 1
}

// Equivalent to:
function example() {
    var a; // Hoisted declaration
    console.log(a); // undefined
    a = 1; // Assignment in original position
    console.log(a); // 1
}
```

### Example 2: Function vs Variable
```javascript
console.log(foo); // function foo() { return 'function'; }

var foo = 'variable';

function foo() {
    return 'function';
}

console.log(foo); // 'variable'

// What happens:
// 1. Function declaration is hoisted completely
// 2. Variable declaration is hoisted (but not assignment)
// 3. Variable assignment overwrites function
```

### Example 3: Scope and Hoisting
```javascript
var name = "Global";

function test() {
    console.log(name); // undefined (not "Global")
    var name = "Local";
    console.log(name); // "Local"
}

test();

// Explanation: Local 'name' declaration is hoisted,
// shadowing the global 'name' variable
```

## Best Practices

1. **Always declare variables at the top of their scope**
   ```javascript
   function goodPractice() {
       var a, b, c; // Declare at top
       a = 1;
       b = 2;
       c = 3;
   }
   ```

2. **Use let and const instead of var**
   ```javascript
   // Avoid this
   console.log(x); // undefined
   var x = 5;

   // Prefer this
   let y = 5; // Clear and predictable
   const z = 10; // Clear and predictable
   ```

3. **Declare functions before using them**
   ```javascript
   // Good practice
   function myFunction() {
       return "Hello";
   }

   myFunction();
   ```

## Common Gotchas

### Loop with var
```javascript
// Problem
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 1000); // Prints 3, 3, 3
}

// Solution with let
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 1000); // Prints 0, 1, 2
}
```

### Multiple Declarations
```javascript
var a = 1;
function example() {
    console.log(a); // undefined (not 1)
    var a = 2;
}

// The local 'var a' declaration is hoisted,
// creating a local scope that shadows the global 'a'
```

## Key Takeaways
- Only declarations are hoisted, not assignments
- `var` is hoisted and initialized with `undefined`
- `let` and `const` are hoisted but not initialized (TDZ)
- Function declarations are completely hoisted
- Function expressions are not hoisted
- Always declare before use for better code clarity
