// 🎯 Pure Functions & Side Effects - Practical Exercises

console.log('=== Pure Functions & Side Effects Exercises ===\n');

// Exercise 1: Identify Pure vs Impure Functions
console.log('Exercise 1: Pure vs Impure Function Analysis');

// Which of these are pure functions?
const func1 = (x) => x * 2;
const func2 = (x) => { console.log(x); return x * 2; };
const func3 = (x) => x + Math.random();
let global = 0;
const func4 = (x) => { global += x; return global; };
const func5 = (arr) => [...arr, 'new item'];
const func6 = (arr) => { arr.push('new item'); return arr; };

console.log('func1:', func1(5)); // Pure ✅
console.log('func2:', func2(5)); // Impure ❌ - console.log side effect
console.log('func3:', func3(5)); // Impure ❌ - non-deterministic
console.log('func4:', func4(5)); // Impure ❌ - modifies global state
console.log('func5 original array unchanged:', func5([1, 2, 3])); // Pure ✅
console.log('func6 mutates input:', func6([1, 2, 3])); // Impure ❌

// Exercise 2: Convert Impure to Pure
console.log('\n\nExercise 2: Convert Impure Functions to Pure');

// ❌ Impure version
let taxRate = 0.1;
const calculateTotalImpure = (price) => price + (price * taxRate);

// ✅ Pure version
const calculateTotalPure = (price, tax) => price + (price * tax);

console.log('Impure calculation:', calculateTotalImpure(100));
taxRate = 0.2; // Global state changed!
console.log('Impure calculation (changed):', calculateTotalImpure(100));

console.log('Pure calculation:', calculateTotalPure(100, 0.1));
console.log('Pure calculation (consistent):', calculateTotalPure(100, 0.1));

// Exercise 3: Immutable Array Operations
console.log('\n\nExercise 3: Immutable Array Operations');

const originalArray = [1, 2, 3, 4, 5];

// ❌ Mutating operations
const mutatingOps = {
    // Don't run these - they would mutate the original!
    // addItem: (arr, item) => { arr.push(item); return arr; },
    // removeItem: (arr, index) => { arr.splice(index, 1); return arr; },
    // updateItem: (arr, index, value) => { arr[index] = value; return arr; }
};

// ✅ Immutable operations
const immutableOps = {
    addItem: (arr, item) => [...arr, item],
    removeItem: (arr, index) => [...arr.slice(0, index), ...arr.slice(index + 1)],
    updateItem: (arr, index, value) => arr.map((item, i) => i === index ? value : item),
    insertItem: (arr, index, item) => [...arr.slice(0, index), item, ...arr.slice(index)]
};

console.log('Original:', originalArray);
console.log('Add item:', immutableOps.addItem(originalArray, 6));
console.log('Remove index 2:', immutableOps.removeItem(originalArray, 2));
console.log('Update index 1 to 10:', immutableOps.updateItem(originalArray, 1, 10));
console.log('Insert 99 at index 2:', immutableOps.insertItem(originalArray, 2, 99));
console.log('Original unchanged:', originalArray);

// Exercise 4: Immutable Object Operations
console.log('\n\nExercise 4: Immutable Object Operations');

const originalUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    address: {
        street: '123 Main St',
        city: 'Boston',
        state: 'MA'
    }
};

const immutableObjectOps = {
    updateName: (user, name) => ({ ...user, name }),
    updateEmail: (user, email) => ({ ...user, email }),
    updateAddress: (user, addressUpdates) => ({
        ...user,
        address: { ...user.address, ...addressUpdates }
    }),
    addProperty: (user, key, value) => ({ ...user, [key]: value }),
    removeProperty: (user, key) => {
        const { [key]: removed, ...rest } = user;
        return rest;
    }
};

console.log('Original user:', originalUser);
console.log('Updated name:', immutableObjectOps.updateName(originalUser, 'Jane Doe'));
console.log('Updated city:', immutableObjectOps.updateAddress(originalUser, { city: 'New York' }));
console.log('Added age:', immutableObjectOps.addProperty(originalUser, 'age', 30));
console.log('Original unchanged:', originalUser);

// Exercise 5: Pure Function Composition
console.log('\n\nExercise 5: Pure Function Composition');

// Individual pure functions
const trim = (str) => str.trim();
const toLowerCase = (str) => str.toLowerCase();
const removeSpaces = (str) => str.replace(/\s+/g, '');
const addPrefix = (prefix) => (str) => `${prefix}${str}`;
const addSuffix = (suffix) => (str) => `${str}${suffix}`;

// Compose functions
const pipe = (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value);

const processString = pipe(
    trim,
    toLowerCase,
    removeSpaces,
    addPrefix('processed_'),
    addSuffix('_final')
);

const testString = '  Hello World  ';
console.log('Original:', testString);
console.log('Processed:', processString(testString));

// Exercise 6: Error Handling with Pure Functions
console.log('\n\nExercise 6: Pure Error Handling');

// ❌ Impure error handling (throws exceptions)
const impureDivide = (a, b) => {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
};

// ✅ Pure error handling (returns result object)
const pureDivide = (a, b) => ({
    success: b !== 0,
    result: b !== 0 ? a / b : null,
    error: b === 0 ? 'Division by zero' : null
});

// ✅ Pure error handling with Maybe pattern
class Maybe {
    constructor(value) {
        this.value = value;
    }
    
    static some(value) {
        return new Maybe(value);
    }
    
    static none() {
        return new Maybe(null);
    }
    
    isNone() {
        return this.value === null;
    }
    
    map(fn) {
        return this.isNone() ? Maybe.none() : Maybe.some(fn(this.value));
    }
    
    getOrElse(defaultValue) {
        return this.isNone() ? defaultValue : this.value;
    }
}

const safeDivide = (a, b) => b === 0 ? Maybe.none() : Maybe.some(a / b);

console.log('Pure divide 10/2:', pureDivide(10, 2));
console.log('Pure divide 10/0:', pureDivide(10, 0));
console.log('Safe divide 10/2:', safeDivide(10, 2).getOrElse('Error'));
console.log('Safe divide 10/0:', safeDivide(10, 0).getOrElse('Error'));

// Exercise 7: Memoization with Pure Functions
console.log('\n\nExercise 7: Memoization');

const memoize = (fn) => {
    const cache = new Map();
    return (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            console.log(`Cache hit for ${key}`);
            return cache.get(key);
        }
        console.log(`Computing for ${key}`);
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
};

// Expensive pure function
const fibonacci = (n) => {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
};

const memoizedFib = memoize(fibonacci);

console.log('First call fib(10):', memoizedFib(10));
console.log('Second call fib(10):', memoizedFib(10)); // Should use cache

console.log('\n=== All exercises completed! ===');
