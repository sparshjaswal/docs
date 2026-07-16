// 🔒 Referential Transparency - Practical Exercises

console.log('=== Referential Transparency Exercises ===\n');

// Exercise 1: Identifying Referentially Transparent vs Opaque Functions
console.log('Exercise 1: Transparent vs Opaque Functions');

// ✅ Referentially transparent functions
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
const square = (x) => x * x;
const compose = (f, g) => (x) => f(g(x));

// ❌ Referentially opaque functions
let counter = 0;
const increment = () => ++counter;
const random = () => Math.random();
const currentTime = () => Date.now();
const log = (message) => { console.log(message); return message; };

console.log('Testing transparent functions:');
console.log('add(3, 4) called twice:', add(3, 4), add(3, 4)); // Same results
console.log('square(5) called twice:', square(5), square(5)); // Same results

console.log('\nTesting opaque functions:');
console.log('increment() called twice:', increment(), increment()); // Different results!
console.log('random() called twice:', random(), random()); // Different results!

// Exercise 2: Substitution Property Testing
console.log('\n\nExercise 2: Substitution Property');

// Test if we can substitute function calls with their values
const testSubstitution = (fn, input, iterations = 5) => {
    const results = [];
    for (let i = 0; i < iterations; i++) {
        results.push(fn(input));
    }
    
    const allSame = results.every(result => 
        JSON.stringify(result) === JSON.stringify(results[0])
    );
    
    return {
        allSame,
        results: allSame ? [results[0]] : results,
        substitutable: allSame
    };
};

console.log('Substitution tests:');
console.log('add(2, 3):', testSubstitution(() => add(2, 3)));
console.log('Math.random():', testSubstitution(() => Math.random()));

// Exercise 3: Mathematical Properties and Laws
console.log('\n\nExercise 3: Mathematical Properties');

// Identity laws
const identity = (x) => x;
console.log('Identity law test:');
console.log('compose(identity, square)(5) === square(5):', 
    compose(identity, square)(5) === square(5));
console.log('compose(square, identity)(5) === square(5):', 
    compose(square, identity)(5) === square(5));

// Associativity
const addOne = (x) => x + 1;
const double = (x) => x * 2;

const assoc1 = compose(square, compose(double, addOne));
const assoc2 = compose(compose(square, double), addOne);

console.log('\nAssociativity test:');
[1, 2, 3, 4, 5].forEach(x => {
    console.log(`x=${x}: assoc1(${x}) === assoc2(${x}):`, assoc1(x) === assoc2(x));
});

// Distributivity with arrays
const numbers = [1, 2, 3, 4, 5];
const composed = numbers.map(compose(square, addOne));
const distributed = numbers.map(addOne).map(square);

console.log('\nDistributivity test:');
console.log('Composed result:', composed);
console.log('Distributed result:', distributed);
console.log('Are equal:', JSON.stringify(composed) === JSON.stringify(distributed));

// Exercise 4: Memoization Safety Test
console.log('\n\nExercise 4: Memoization Safety');

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

// Safe to memoize (referentially transparent)
const expensiveAdd = (a, b) => {
    // Simulate expensive computation
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
        result = a + b;
    }
    return result;
};

// NOT safe to memoize (referentially opaque)
const expensiveRandom = () => {
    // Simulate expensive computation
    let result;
    for (let i = 0; i < 1000000; i++) {
        result = Math.random();
    }
    return result;
};

const memoizedAdd = memoize(expensiveAdd);
const memoizedRandom = memoize(expensiveRandom);

console.log('Safe memoization test:');
console.log('First call memoizedAdd(5, 3):', memoizedAdd(5, 3));
console.log('Second call memoizedAdd(5, 3):', memoizedAdd(5, 3));

console.log('\nUnsafe memoization test (wrong behavior):');
console.log('First call memoizedRandom():', memoizedRandom());
console.log('Second call memoizedRandom():', memoizedRandom()); // Should be different but cached!

// Exercise 5: Equational Reasoning
console.log('\n\nExercise 5: Equational Reasoning');

// We can reason about pure functions algebraically
const reasoningTest = (x) => {
    // Original expression
    const original = add(multiply(x, 2), square(x));
    
    // Algebraic manipulation: add(x*2, x²) = 2x + x² = x(2 + x)
    const factored = multiply(x, add(2, x));
    
    // They should be equal due to mathematical laws
    return { original, factored, equal: original === factored };
};

console.log('Equational reasoning test:');
[1, 2, 3, 4, 5].forEach(x => {
    const result = reasoningTest(x);
    console.log(`x=${x}: original=${result.original}, factored=${result.factored}, equal=${result.equal}`);
});

// Exercise 6: Optimization Opportunities
console.log('\n\nExercise 6: Optimization Opportunities');

// Common sub-expression elimination
const originalExpression = (x, y) => {
    const a = square(x); // Computed
    const b = square(x); // Same computation - can be eliminated
    const c = add(y, 1); // Different computation
    return add(add(a, b), c);
};

const optimizedExpression = (x, y) => {
    const squared = square(x); // Compute once
    const incremented = add(y, 1);
    return add(add(squared, squared), incremented); // Or: add(multiply(squared, 2), incremented)
};

console.log('Optimization test:');
[1, 2, 3].forEach(x => {
    [4, 5, 6].forEach(y => {
        const orig = originalExpression(x, y);
        const opt = optimizedExpression(x, y);
        console.log(`(${x},${y}): original=${orig}, optimized=${opt}, equal=${orig === opt}`);
    });
});

// Exercise 7: Constant Folding
console.log('\n\nExercise 7: Constant Folding');

// These expressions can be computed at compile time
const constantExpression1 = () => add(multiply(3, 4), square(5)); // Can fold to 37
const constantExpression2 = () => compose(square, x => add(x, 2))(3); // Can fold to 25

// Partially constant expressions
const partiallyConstant = (x) => add(multiply(3, 4), square(x)); // 3*4 can be folded to 12

console.log('Constant folding examples:');
console.log('constantExpression1():', constantExpression1()); // 37
console.log('constantExpression2():', constantExpression2()); // 25
console.log('partiallyConstant(5):', partiallyConstant(5)); // 12 + 25 = 37

// Exercise 8: Higher-Order Function Properties
console.log('\n\nExercise 8: Higher-Order Function Properties');

// Map preserves composition
const mapCompose = (arr, f, g) => arr.map(compose(f, g));
const composeMap = (arr, f, g) => arr.map(g).map(f);

const testArray = [1, 2, 3, 4, 5];
const f = x => x * 3;
const g = x => x + 2;

const result1 = mapCompose(testArray, f, g);
const result2 = composeMap(testArray, f, g);

console.log('Map composition property:');
console.log('map(f∘g):', result1);
console.log('map(f)∘map(g):', result2);
console.log('Equal:', JSON.stringify(result1) === JSON.stringify(result2));

// Filter preserves conjunction
const filterAnd = (arr, p1, p2) => arr.filter(x => p1(x) && p2(x));
const andFilter = (arr, p1, p2) => arr.filter(p1).filter(p2);

const isEven = x => x % 2 === 0;
const greaterThan3 = x => x > 3;

const testArray2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const filterResult1 = filterAnd(testArray2, isEven, greaterThan3);
const filterResult2 = andFilter(testArray2, isEven, greaterThan3);

console.log('\nFilter conjunction property:');
console.log('filter(p1 ∧ p2):', filterResult1);
console.log('filter(p1) ∘ filter(p2):', filterResult2);
console.log('Equal:', JSON.stringify(filterResult1) === JSON.stringify(filterResult2));

// Exercise 9: Referential Transparency in Practice
console.log('\n\nExercise 9: Practical RT Examples');

// Configuration system (referentially transparent)
const createConfig = (environment) => ({
    database: {
        host: environment === 'production' ? 'prod.db.com' : 'dev.db.com',
        port: 5432,
        ssl: environment === 'production'
    },
    cache: {
        enabled: environment === 'production',
        ttl: environment === 'production' ? 3600 : 60
    }
});

// Template system (referentially transparent)
const template = (name, age) => `Hello ${name}, you are ${age} years old.`;

console.log('Configuration examples:');
console.log('Development config twice:', 
    JSON.stringify(createConfig('development')) === JSON.stringify(createConfig('development')));

console.log('Template examples:');
console.log('Template result twice:', 
    template('Alice', 25) === template('Alice', 25));

// Exercise 10: Purity Testing Framework
console.log('\n\nExercise 10: Purity Testing Framework');

const testPurity = (fn, generateArgs, iterations = 100) => {
    const results = new Map();
    let isPure = true;
    
    for (let i = 0; i < iterations; i++) {
        const args = generateArgs();
        const key = JSON.stringify(args);
        const result = fn(...args);
        
        if (results.has(key)) {
            if (JSON.stringify(results.get(key)) !== JSON.stringify(result)) {
                isPure = false;
                console.log(`Purity violation: ${key} -> ${JSON.stringify(results.get(key))} vs ${JSON.stringify(result)}`);
                break;
            }
        } else {
            results.set(key, result);
        }
    }
    
    return {
        isPure,
        uniqueInputs: results.size,
        totalTests: iterations
    };
};

// Test pure function
const pureFunction = (a, b) => a * b + b;
const pureTest = testPurity(
    pureFunction, 
    () => [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)],
    50
);

console.log('Pure function test:', pureTest);

// Test impure function
let impureCounter = 0;
const impureFunction = (a, b) => a * b + (++impureCounter);
const impureTest = testPurity(
    impureFunction,
    () => [1, 2], // Same args every time to detect impurity
    10
);

console.log('Impure function test:', impureTest);

console.log('\n=== All referential transparency exercises completed! ===');
