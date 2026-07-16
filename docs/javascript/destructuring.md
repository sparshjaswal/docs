# JavaScript Destructuring

## What is Destructuring?
Destructuring is a syntax that allows you to unpack values from arrays or properties from objects into distinct variables.

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
console.log(first);  // 1
console.log(second); // 2
console.log(rest);   // [3, 4, 5]
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
    city: 'New York'
};

// Traditional way
const name = person.name;
const age = person.age;

// Destructuring way
const { name, age, city } = person;
console.log(name, age, city); // "Alice", 30, "New York"
```

### Renaming Variables
```javascript
const user = {
    id: 1,
    username: 'john_doe',
    email: 'john@example.com'
};

const { username: name, email: userEmail } = user;
console.log(name);      // "john_doe"
console.log(userEmail); // "john@example.com"
```

### Default Values
```javascript
const settings = {
    theme: 'dark'
};

const { theme, language = 'English', fontSize = 14 } = settings;
console.log(theme);    // "dark"
console.log(language); // "English"
console.log(fontSize); // 14
```

### Nested Destructuring
```javascript
const student = {
    name: 'Bob',
    grades: {
        math: 95,
        science: 88
    },
    address: {
        street: '123 Main St',
        city: 'Boston'
    }
};

const {
    name,
    grades: { math, science },
    address: { city }
} = student;

console.log(name);    // "Bob"
console.log(math);    // 95
console.log(science); // 88
console.log(city);    // "Boston"
```

### Rest Operator with Objects
```javascript
const user = {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    age: 30,
    city: 'New York'
};

const { id, name, ...details } = user;
console.log(id);      // 1
console.log(name);    // "Alice"
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
        id: Math.random(),
        name,
        email,
        age,
        createdAt: new Date()
    };
}

const newUser = createUser({
    name: 'John',
    email: 'john@example.com'
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
        email: 'alice@example.com'
    }
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
            { id: 2, name: 'Jane', active: false }
        ]
    },
    status: 200,
    message: 'Success'
};

const {
    data: { users },
    status,
    message
} = response;

console.log(users);   // Array of users
console.log(status);  // 200
console.log(message); // "Success"
```

### Array of Objects
```javascript
const employees = [
    { name: 'Alice', department: 'Engineering' },
    { name: 'Bob', department: 'Marketing' },
    { name: 'Carol', department: 'Sales' }
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
    database: { url, name } = {}
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
        name: 'myapp'
    }
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

// Less clear
function updateUser(id, name, email) {
    // Order matters, easy to mix up
}
```

4. **Don't over-nest destructuring**
```javascript
// Reasonable
const { user: { name, email } } = response;

// Too complex
const { data: { users: [{ profile: { personal: { name } } }] } } = response;
```
