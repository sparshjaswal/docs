---
id: javascript-destructuring
title: "JavaScript Destructuring"
slug: /javascript/destructuring
sidebar_label: "Destructuring"
---

# JavaScript Destructuring

Destructuring gives names to selected values from an array or object. If a student record contains `name` and `score`, destructuring lets you take those properties into variables without repeating the record name.

1. Start with [objects](./objects-and-classes.md) or [arrays](./arrays/index.md) and ordinary property access.
2. Extract one value, then several values, and compare the result with the longer version.
3. Add a default for a missing value. Check `undefined`, `null`, and zero separately.
4. Use destructuring in function parameters only after the ordinary form is clear.

This is a shorter way to read values, not a check that the whole input is valid. The final sections explain how defaults at different levels interact.

## What is Destructuring?

Match the pattern on the left with the data on the right. Array patterns use positions; object patterns use property names. The first example shows ordinary index access and destructuring side by side so you can compare the selected values.

## Array Destructuring

### Basic Array Destructuring

```javascript
const numbers = [1, 2, 3, 4, 5];

// Traditional way
const first = numbers[0];
const second = numbers[1];

// Destructuring way
const [a, b, c] = numbers;
console.log(a, b, c); // 1, 2, 3
```

### Skipping Elements

```javascript
const colors = ['red', 'green', 'blue', 'yellow'];

const [primary, , tertiary] = colors;
console.log(primary, tertiary); // "red", "blue"
```

### Rest Operator with Arrays

```javascript
const numbers = [1, 2, 3, 4, 5];

const [first, second, ...rest] = numbers;
console.log(first); // 1
console.log(second); // 2
console.log(rest); // [3, 4, 5]
```

### Default Values

```javascript
const arr = [1];

const [a, b = 2, c = 3] = arr;
console.log(a, b, c); // 1, 2, 3
```

### Swapping Variables

```javascript
let x = 10;
let y = 20;

[x, y] = [y, x];
console.log(x, y); // 20, 10
```

## Object Destructuring

### Basic Object Destructuring

```javascript
const person = {
  name: 'Alice',
  age: 30,
  city: 'New York',
};

// Traditional way
const traditionalName = person.name;
const traditionalAge = person.age;

// Destructuring way
const { name, age, city } = person;
console.log(name, age, city); // "Alice", 30, "New York"
```

### Renaming Variables

```javascript
const user = {
  id: 1,
  username: 'john_doe',
  email: 'john@example.com',
};

const { username: name, email: userEmail } = user;
console.log(name); // "john_doe"
console.log(userEmail); // "john@example.com"
```

### Default Values

```javascript
const settings = {
  theme: 'dark',
};

const { theme, language = 'English', fontSize = 14 } = settings;
console.log(theme); // "dark"
console.log(language); // "English"
console.log(fontSize); // 14
```

### Nested Destructuring

```javascript
const student = {
  name: 'Bob',
  grades: {
    math: 95,
    science: 88,
  },
  address: {
    street: '123 Main St',
    city: 'Boston',
  },
};

const {
  name,
  grades: { math, science },
  address: { city },
} = student;

console.log(name); // "Bob"
console.log(math); // 95
console.log(science); // 88
console.log(city); // "Boston"
```

### Rest Operator with Objects

```javascript
const user = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  age: 30,
  city: 'New York',
};

const { id, name, ...details } = user;
console.log(id); // 1
console.log(name); // "Alice"
console.log(details); // { email: "alice@example.com", age: 30, city: "New York" }
```

## Function Parameter Destructuring

### Array Parameters

```javascript
function sum([a, b, c]) {
  return a + b + c;
}

console.log(sum([1, 2, 3])); // 6
```

### Object Parameters

```javascript
function createUser({ name, email, age = 18 }) {
  return {
    id: crypto.randomUUID(), // host API; requires a supporting secure context
    name,
    email,
    age,
    createdAt: new Date(),
  };
}

const newUser = createUser({
  name: 'John',
  email: 'john@example.com',
});
```

### Mixed Destructuring in Functions

```javascript
function processOrder({ id, items, customer: { name, email } }) {
  console.log(`Processing order ${id} for ${name}`);
  console.log(`Items: ${items.join(', ')}`);
  console.log(`Send confirmation to: ${email}`);
}

const order = {
  id: 'ORD-123',
  items: ['laptop', 'mouse'],
  customer: {
    name: 'Alice Smith',
    email: 'alice@example.com',
  },
};

processOrder(order);
```

## Practical Examples

### Working with APIs

```javascript
// API response
const response = {
  data: {
    users: [
      { id: 1, name: 'John', active: true },
      { id: 2, name: 'Jane', active: false },
    ],
  },
  status: 200,
  message: 'Success',
};

const {
  data: { users },
  status,
  message,
} = response;

console.log(users); // Array of users
console.log(status); // 200
console.log(message); // "Success"
```

### Array of Objects

```javascript
const employees = [
  { name: 'Alice', department: 'Engineering' },
  { name: 'Bob', department: 'Marketing' },
  { name: 'Carol', department: 'Sales' },
];

// Destructure in loop
for (const { name, department } of employees) {
  console.log(`${name} works in ${department}`);
}

// Destructure with map
const names = employees.map(({ name }) => name);
console.log(names); // ["Alice", "Bob", "Carol"]
```

### Configuration Objects

```javascript
function setupServer({
  port = 3000,
  host = 'localhost',
  ssl = false,
  database: { url, name } = {},
}) {
  console.log(`Server running on ${host}:${port}`);
  console.log(`SSL: ${ssl ? 'enabled' : 'disabled'}`);
  if (url && name) {
    console.log(`Database: ${name} at ${url}`);
  }
}

setupServer({
  port: 8080,
  ssl: true,
  database: {
    url: 'mongodb://localhost:27017',
    name: 'myapp',
  },
});
```

## Best Practices

1. **Use meaningful variable names**

```javascript
// Good
const { firstName, lastName, email } = user;

// Avoid
const { a, b, c } = user;
```

2. **Provide default values for optional properties**

```javascript
const { theme = 'light', language = 'en' } = settings;
```

3. **Use destructuring in function parameters for clean APIs**

```javascript
// Good
function updateUser({ id, name, email }) {
  // Clear what parameters are expected
}

```

Compare this separate positional-argument version:

```javascript
function updateUser(id, name, email) {
  // Order matters, easy to mix up
}
```

4. **Don't over-nest destructuring**

```javascript
// Reasonable
const {
  user: { name, email },
} = response;

```

A separate deeply nested example is harder to read:

```javascript
const {
  data: {
    users: [
      {
        profile: {
          personal: { name },
        },
      },
    ],
  },
} = response;
```

## Defaults and missing data

A destructuring default applies to `undefined`, not `null`, zero, or an empty string. Destructuring `null` or `undefined` itself throws. For an optional options object, use a parameter such as `function configure({ theme = 'light' } = {})`; an explicit `null` argument still needs validation. Array destructuring consumes an iterable, while object destructuring reads properties.

Object rest arrived in ES2018; basic destructuring arrived in ES2015. See [rest and spread](./spread-operator.md) for shallow-copy behavior and [MDN destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring) for the complete syntax.

## Separate parameter defaults from property defaults {/* #parameter-defaults */}

A default is an expression evaluated only when the corresponding value is `undefined`. Whole-argument defaults and property defaults run at different steps. They are not input validation.

```js runnable
let defaults = 0;
function createOptions() { defaults++; return {}; }
function readLimit({ limit = 10 } = createOptions()) { return limit; }
console.log(readLimit(), defaults);
console.log(readLimit({ limit: 0 }), defaults);
console.log(readLimit({ limit: undefined }), defaults);
console.log(readLimit({ limit: null }), defaults);
try { readLimit(null); }
catch (error) { console.log(error.name); }
```

```text output
10 1
0 1
10 1
null 1
TypeError
```

The omitted argument calls `createOptions`; the returned empty object then uses the property default. Passing an object skips the argument default. A missing or undefined property uses ten, but a null property remains null. Passing null as the entire argument fails before a property can be read. To intentionally accept a null options object, normalize it first with `options ?? {}`; to reject it, validate explicitly.

Defaults are evaluated on every applicable call, so `function collect(items = [])` creates a fresh array for an omitted argument. Earlier parameters can supply later defaults; a default cannot safely read a later, not-yet-initialized parameter. See [parameter environments](./language-semantics.md#per-iteration-bindings-and-parameters--es2015) and [ES2015 function initialization](https://262.ecma-international.org/6.0/#sec-functiondeclarationinstantiation).

**Try it:** implement an options reader that preserves zero, defaults missing or undefined values to ten, and rejects null, negative values, fractions, and strings. Keep the accepted-input rule separate from destructuring syntax.

## Interview questions {/* #interview-questions */}

**Level: Beginner.** [How to practise](./index.md#interview-preparation).

### 1. When does a destructuring default run?

<details>
<summary>Answer and worked example</summary>

Only when the extracted value is undefined, including a missing property. Null and other falsy values remain unchanged.

```js runnable
function read({ limit = 10 } = {}) { return limit; }
console.log(read(), read({}), read({ limit: 0 }), read({ limit: null }));
try { read(null); }
catch (error) { console.log(error.name); }
```

**Expected output**

```text output
10 10 0 null
TypeError
```

The parameter default handles an omitted or undefined argument. It does not replace an explicit null argument, which cannot be object-destructured.

</details>

### 2. Does destructuring a property make a live binding to that property?

**Apply it:** Track a primitive value and a nested object after destructuring, mutation, and replacement of the original properties.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

No. `const { count } = record` reads the property at that moment; later assignment to record.count does not update count. If the extracted value is an object, its identity is shared, so mutations of that nested object remain observable. Static ESM imports have different live-binding rules.

Draw two bindings pointing at the same nested object before tracing the assignments.

```js runnable
const record = { count: 1, profile: { name: 'Asha' } };
const { count, profile } = record;
record.count = 2;
record.profile.name = 'Mira';
console.log(count, profile.name);
record.profile = { name: 'Noor' };
console.log(profile.name, record.profile.name);
```

**Expected output**

```text output
1 Mira
Mira Noor
```

`count` holds the number read during destructuring. `profile` holds the object reference read then, so the first nested mutation is visible through both paths. Replacing `record.profile` changes only that property; it does not redirect the local binding. Destructuring is convenient extraction, not ongoing synchronization or a deep copy. See [MDN: destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring).

</details>
