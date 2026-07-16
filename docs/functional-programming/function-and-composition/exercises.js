// 🔄 Function Composition - Practical Exercises

console.log('=== Function Composition Exercises ===\n');

// Exercise 1: Basic Function Composition
console.log('Exercise 1: Basic Composition Utilities');

// Utility functions
const compose = (...fns) => (value) => fns.reduceRight((acc, fn) => fn(acc), value);
const pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value);

// Simple functions to compose
const add5 = (x) => x + 5;
const multiply3 = (x) => x * 3;
const subtract2 = (x) => x - 2;
const square = (x) => x * x;

// Test compose (right to left)
const composeExample = compose(square, subtract2, multiply3, add5);
console.log('compose(square, subtract2, multiply3, add5)(2) =', composeExample(2));
// (2 + 5) * 3 - 2 = 21 - 2 = 19, then 19² = 361

// Test pipe (left to right)
const pipeExample = pipe(add5, multiply3, subtract2, square);
console.log('pipe(add5, multiply3, subtract2, square)(2) =', pipeExample(2));
// Same result: 361

// Exercise 2: Data Processing Pipeline
console.log('\n\nExercise 2: Data Processing Pipeline');

const users = [
    { id: 1, name: 'john doe', email: 'JOHN@EXAMPLE.COM', age: 25, active: true },
    { id: 2, name: 'jane smith', email: 'jane@EXAMPLE.com', age: 30, active: false },
    { id: 3, name: 'bob johnson', email: 'BOB@example.COM', age: 35, active: true },
    { id: 4, name: 'alice brown', email: 'alice@Example.Com', age: 28, active: true }
];

// Individual processing functions
const filterActive = (users) => users.filter(user => user.active);
const normalizeEmail = (users) => users.map(user => ({
    ...user,
    email: user.email.toLowerCase()
}));
const capitalizeName = (users) => users.map(user => ({
    ...user,
    name: user.name.split(' ').map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ')
}));
const addFullNameInitials = (users) => users.map(user => ({
    ...user,
    initials: user.name.split(' ').map(part => part[0].toUpperCase()).join('.')
}));
const sortByAge = (users) => [...users].sort((a, b) => a.age - b.age);

// Create processing pipeline
const processUsers = pipe(
    filterActive,
    normalizeEmail,
    capitalizeName,
    addFullNameInitials,
    sortByAge
);

console.log('Original users:', users);
console.log('Processed users:', processUsers(users));

// Exercise 3: Currying and Partial Application
console.log('\n\nExercise 3: Currying and Partial Application');

// Generic curry function
const curry = (fn) => {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function(...nextArgs) {
                return curried.apply(this, args.concat(nextArgs));
            };
        }
    };
};

// Functions to curry
const add = (a, b) => a + b;
const multiply = (a, b, c) => a * b * c;
const greet = (greeting, title, name) => `${greeting}, ${title} ${name}!`;

// Curry the functions
const curriedAdd = curry(add);
const curriedMultiply = curry(multiply);
const curriedGreet = curry(greet);

// Test currying
console.log('curriedAdd(5)(3):', curriedAdd(5)(3));
console.log('curriedMultiply(2)(3)(4):', curriedMultiply(2)(3)(4));
console.log('curriedGreet("Hello")("Dr.")("Smith"):', curriedGreet("Hello")("Dr.")("Smith"));

// Partial application
const add5Curried = curriedAdd(5);
const doubleTriple = curriedMultiply(2)(3);
const formalGreeting = curriedGreet("Good morning")("Professor");

console.log('Partial application examples:');
console.log('add5Curried(10):', add5Curried(10));
console.log('doubleTriple(7):', doubleTriple(7));
console.log('formalGreeting("Johnson"):', formalGreeting("Johnson"));

// Exercise 4: Point-Free Programming
console.log('\n\nExercise 4: Point-Free Programming');

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Utility functions for point-free style
const isEven = (x) => x % 2 === 0;
const isGreaterThan = (threshold) => (value) => value > threshold;
const multiplyBy = (factor) => (value) => value * factor;
const sum = (arr) => arr.reduce((a, b) => a + b, 0);

// ❌ Pointful style (explicit arguments)
const processNumbersPointful = (numbers) => {
    return numbers
        .filter(x => isEven(x))
        .filter(x => x > 4)
        .map(x => x * 3)
        .reduce((acc, x) => acc + x, 0);
};

// ✅ Point-free style (no explicit arguments)
const processNumbersPointFree = pipe(
    arr => arr.filter(isEven),
    arr => arr.filter(isGreaterThan(4)),
    arr => arr.map(multiplyBy(3)),
    sum
);

console.log('Pointful result:', processNumbersPointful(numbers));
console.log('Point-free result:', processNumbersPointFree(numbers));

// Exercise 5: Higher-Order Function Patterns
console.log('\n\nExercise 5: Higher-Order Function Patterns');

// Function factories
const createValidator = (rules) => (data) => {
    return rules.every(rule => {
        const isValid = rule.test(data);
        if (!isValid && rule.message) {
            console.log(`Validation failed: ${rule.message}`);
        }
        return isValid;
    });
};

const createFormatter = (formatters) => (data) => {
    return formatters.reduce((acc, formatter) => formatter(acc), data);
};

const createLogger = (level) => (module) => (message) => {
    console.log(`[${level}] ${module}: ${message}`);
    return message;
};

// Usage examples
const emailRules = [
    { test: email => email && email.length > 0, message: 'Email is required' },
    { test: email => email.includes('@'), message: 'Email must contain @' },
    { test: email => email.length >= 5, message: 'Email too short' }
];

const stringFormatters = [
    str => str.trim(),
    str => str.toLowerCase(),
    str => str.replace(/\s+/g, '-')
];

const validateEmail = createValidator(emailRules);
const formatString = createFormatter(stringFormatters);
const errorLogger = createLogger('ERROR');
const dbLogger = errorLogger('DATABASE');

console.log('Email validation (valid):', validateEmail('user@example.com'));
console.log('Email validation (invalid):', validateEmail('invalid'));
console.log('String formatting:', formatString('  Hello World  '));
dbLogger('Connection failed');

// Exercise 6: Async Function Composition
console.log('\n\nExercise 6: Async Function Composition');

// Async pipe utility
const pipeAsync = (...fns) => (value) => 
    fns.reduce((acc, fn) => acc.then(fn), Promise.resolve(value));

// Simulated async functions
const fetchUser = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { id, name: `User ${id}`, email: `user${id}@example.com` };
};

const enrichUser = async (user) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { ...user, enriched: true, timestamp: Date.now() };
};

const validateUser = async (user) => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return { ...user, valid: user.name && user.email };
};

const formatUser = async (user) => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return {
        displayName: `${user.name} (${user.email})`,
        status: user.valid ? 'Valid' : 'Invalid',
        ...user
    };
};

// Compose async operations
const processUserAsync = pipeAsync(
    fetchUser,
    enrichUser,
    validateUser,
    formatUser
);

// Execute async pipeline
processUserAsync(123)
    .then(user => {
        console.log('Async pipeline result:', user);
    })
    .catch(error => {
        console.error('Async pipeline error:', error);
    });

// Exercise 7: Advanced Composition Patterns
console.log('\n\nExercise 7: Advanced Composition Patterns');

// Conditional composition
const when = (predicate, fn) => (value) => 
    predicate(value) ? fn(value) : value;

const unless = (predicate, fn) => (value) => 
    !predicate(value) ? fn(value) : value;

const branch = (predicate, trueFn, falseFn) => (value) => 
    predicate(value) ? trueFn(value) : falseFn(value);

// Try-catch composition
const tryCatch = (fn, onError) => (value) => {
    try {
        return fn(value);
    } catch (error) {
        return onError(error, value);
    }
};

// Example usage
const processNumber = pipe(
    x => x * 2,
    when(x => x > 10, x => x + 5),
    unless(x => x % 2 === 0, x => x + 1),
    branch(
        x => x > 20,
        x => `HIGH: ${x}`,
        x => `LOW: ${x}`
    )
);

const safeParseJSON = tryCatch(
    JSON.parse,
    (error, input) => ({ error: error.message, input })
);

console.log('Advanced composition examples:');
console.log('processNumber(3):', processNumber(3));
console.log('processNumber(8):', processNumber(8));
console.log('safeParseJSON valid:', safeParseJSON('{"key": "value"}'));
console.log('safeParseJSON invalid:', safeParseJSON('invalid json'));

// Wait for async operation to complete before ending
setTimeout(() => {
    console.log('\n=== All exercises completed! ===');
}, 500);
