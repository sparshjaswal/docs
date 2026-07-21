---
id: javascript-fundamentals-types-of-identifiers
title: 🔤 JavaScript Data Types & Identifiers
slug: /javascript/fundamentals/types-of-identifiers
sidebar_label: 🔤 JavaScript Data Types & I...
---

# 🔤 JavaScript Data Types & Identifiers

> _Understanding data types and identifier rules in JavaScript_

## Variable Declaration

The `var` keyword is used to define or declare a variable identifier.

```javascript
var variableName;
```

> Programmers can also initialize using the assignment operator.

```javascript
var variableName = value;
```

Computer memory is in the form of bits(0 or 1) and generally, ram memory is utilized for programming.when we create a variable with the variableName, we assign a memory address and the size of memory is dependent on the value being assigned to the variable.

**Rules for variables names**

1.  The first character must be a letter or an underscore (\_). You can't use a number as the first character.
2.  The rest of the variable name can include any letter, any number, or the underscore. You can't use any other characters, including spaces, symbols, and punctuation marks.
3.  Variable names are case sensitive.
4.  There's no limit to the length of the variable name.
5.  You can't use one of JavaScript's reserved words as a variable name.
6.  Additionally, As a rule of naming convention, we use camel case for variable name and pascal case for a class or constructor name.

**e.g.** of camel case (the first character is always the small case and other from the character of words are capitalized )

```javascript
var firstName = 'sparsh';
```

**e.g.** of pascal case (the first character of the word is always the upper case and generally class or constructor name is in pascal case)

```javascript
class Student {}
```

JavaScript is a loosely typed or weakly typed language, i.e., while declaring the variable we don't define the type of value the variable holds. It's also a dynamic language, as the creation of variables at runtime is possible and the type of variable is determined at runtime or type checking is runtime.

**In JavaScript, Actually two types of type of identifier:-**

1.  **Reference types**
    1. stored in heap memory
    2. Dynamically stored and considered to be faster. e.g., Object, Array, Function (which is called object of function)
2.  **Primitive types**
    1.  stored in stack memory and are of fixed size
    2.  stored in stack memory e.g., number, null, string, boolean, undefined, symbol, and BigInt

**Below are the types of value an identifier can hold in JavaScript:-**

1. **number**
   ```javascript
   var num = 13; // typeof num -> number
   var num = 12.4; // typeof num -> number
   var num = -1; // typeof num -> number
   var num = NaN; // typeof num -> number
   ```
2. **string**
   ```javascript
   var str = 'sparsh'; // typeof num -> string
   var str = 's'; // typeof num -> string
   ```
3. **boolean**
   ```javascript
   var flag = true; // typeof num -> boolean
   var flag = false; // typeof num -> boolean
   ```
4. **undefined**
   ```javascript
   var value; // typeof value-> undefined
   ```
5. **object**
   ```javascript
   var arr = []; // typeof arr -> object
   var value = null; // typeof value-> object
   var obj = { name: 'sparsh' }; // typeof obj -> object
   typeof alert; // alert is one of inbuilt functions
   function num() {} // typeof num; -> function symbol;
   ```
6. **Symbol**
   ```javascript
   var unique = Symbol('id'); // typeof unique -> symbol
   ```
7. **Implied globals [obsolete]**
   Any variable which is not defined or declared is considered a global variable by default.
   e.g;-
   ```javascript
   variableName = value;
   ```
