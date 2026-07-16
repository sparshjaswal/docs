// 🏗️ Monads - Practical Exercises

console.log('=== Monads Exercises ===\n');

// Exercise 1: Identity Monad (Simplest Monad)
console.log('Exercise 1: Identity Monad');

class Identity {
    constructor(value) {
        this.value = value;
    }
    
    map(fn) {
        return Identity.of(fn(this.value));
    }
    
    flatMap(fn) {
        return fn(this.value);
    }
    
    static of(value) {
        return new Identity(value);
    }
    
    inspect() {
        return `Identity(${JSON.stringify(this.value)})`;
    }
}

const identityExample = Identity.of(5)
    .flatMap(x => Identity.of(x * 2))
    .flatMap(x => Identity.of(x + 3))
    .map(x => `Result: ${x}`);

console.log('Identity monad:', identityExample.inspect());

// Exercise 2: Maybe Monad for Null Safety
console.log('\n\nExercise 2: Maybe Monad');

class Maybe {
    constructor(value) {
        this.value = value;
    }
    
    isNothing() {
        return this.value === null || this.value === undefined;
    }
    
    map(fn) {
        return this.isNothing() ? this : Maybe.of(fn(this.value));
    }
    
    flatMap(fn) {
        return this.isNothing() ? this : fn(this.value);
    }
    
    getOrElse(defaultValue) {
        return this.isNothing() ? defaultValue : this.value;
    }
    
    static of(value) {
        return value === null || value === undefined 
            ? Maybe.nothing() 
            : new Maybe(value);
    }
    
    static nothing() {
        return new Maybe(null);
    }
    
    inspect() {
        return this.isNothing() 
            ? 'Maybe.Nothing' 
            : `Maybe.Some(${JSON.stringify(this.value)})`;
    }
}

// Safe mathematical operations
const safeDivide = (a, b) => b === 0 ? Maybe.nothing() : Maybe.of(a / b);
const safeSqrt = (x) => x < 0 ? Maybe.nothing() : Maybe.of(Math.sqrt(x));
const safeLog = (x) => x <= 0 ? Maybe.nothing() : Maybe.of(Math.log(x));

const calculate = (a, b) =>
    safeDivide(a, b)
        .flatMap(safeSqrt)
        .flatMap(safeLog)
        .map(result => Math.round(result * 1000) / 1000);

console.log('Maybe monad examples:');
console.log('calculate(100, 4):', calculate(100, 4).inspect()); // Should work
console.log('calculate(100, 0):', calculate(100, 0).inspect()); // Division by zero
console.log('calculate(-100, 4):', calculate(-100, 4).inspect()); // Negative sqrt

// Exercise 3: Either Monad for Error Handling
console.log('\n\nExercise 3: Either Monad');

class Either {
    constructor(value, isRight = true) {
        this.value = value;
        this.isRight = isRight;
    }
    
    isLeft() {
        return !this.isRight;
    }
    
    map(fn) {
        return this.isLeft() ? this : Either.right(fn(this.value));
    }
    
    flatMap(fn) {
        return this.isLeft() ? this : fn(this.value);
    }
    
    fold(leftFn, rightFn) {
        return this.isLeft() ? leftFn(this.value) : rightFn(this.value);
    }
    
    static left(value) {
        return new Either(value, false);
    }
    
    static right(value) {
        return new Either(value, true);
    }
    
    static of(value) {
        return Either.right(value);
    }
    
    static try(fn) {
        try {
            return Either.right(fn());
        } catch (error) {
            return Either.left(error.message);
        }
    }
    
    inspect() {
        return this.isLeft() 
            ? `Either.Left(${JSON.stringify(this.value)})` 
            : `Either.Right(${JSON.stringify(this.value)})`;
    }
}

// Validation with Either
const validateAge = (age) => {
    if (typeof age !== 'number') return Either.left('Age must be a number');
    if (age < 0) return Either.left('Age cannot be negative');
    if (age > 150) return Either.left('Age too high');
    return Either.right(age);
};

const validateEmail = (email) => {
    if (!email) return Either.left('Email is required');
    if (!email.includes('@')) return Either.left('Email must contain @');
    return Either.right(email.toLowerCase());
};

const createUser = (name, age, email) =>
    Either.of({ name, age, email })
        .flatMap(user => validateAge(user.age).map(() => user))
        .flatMap(user => validateEmail(user.email).map(validEmail => ({ ...user, email: validEmail })))
        .map(user => ({ ...user, id: Math.random(), created: new Date() }));

console.log('Either monad examples:');
console.log('Valid user:', createUser('John', 30, 'john@example.com').inspect());
console.log('Invalid age:', createUser('John', -5, 'john@example.com').inspect());
console.log('Invalid email:', createUser('John', 30, 'invalid-email').inspect());

// Exercise 4: IO Monad for Side Effects
console.log('\n\nExercise 4: IO Monad');

class IO {
    constructor(effect) {
        this.effect = effect;
    }
    
    map(fn) {
        return new IO(() => fn(this.effect()));
    }
    
    flatMap(fn) {
        return new IO(() => fn(this.effect()).effect());
    }
    
    run() {
        return this.effect();
    }
    
    static of(value) {
        return new IO(() => value);
    }
    
    static from(effect) {
        return new IO(effect);
    }
    
    inspect() {
        return 'IO(?)';
    }
}

// IO utilities
const log = (message) => IO.from(() => {
    console.log(`[IO LOG] ${message}`);
    return message;
});

const readInput = (prompt) => IO.from(() => {
    console.log(`[IO INPUT] ${prompt}`);
    return 'simulated user input'; // In real app, would read from stdin
});

const writeOutput = (data) => IO.from(() => {
    console.log(`[IO OUTPUT] ${data}`);
    return `Written: ${data}`;
});

// Compose IO operations
const interactiveProgram = readInput('Enter your name:')
    .flatMap(input => log(`User entered: ${input}`))
    .map(input => `Hello, ${input}!`)
    .flatMap(greeting => writeOutput(greeting))
    .flatMap(result => log(`Program completed: ${result}`));

console.log('IO monad composition:');
interactiveProgram.run();

// Exercise 5: State Monad for Stateful Computations
console.log('\n\nExercise 5: State Monad');

class State {
    constructor(runState) {
        this.runState = runState; // (state) => [value, newState]
    }
    
    map(fn) {
        return new State(state => {
            const [value, newState] = this.runState(state);
            return [fn(value), newState];
        });
    }
    
    flatMap(fn) {
        return new State(state => {
            const [value, newState] = this.runState(state);
            return fn(value).runState(newState);
        });
    }
    
    run(initialState) {
        return this.runState(initialState);
    }
    
    static of(value) {
        return new State(state => [value, state]);
    }
    
    static get() {
        return new State(state => [state, state]);
    }
    
    static put(newState) {
        return new State(state => [undefined, newState]);
    }
    
    static modify(fn) {
        return new State(state => [undefined, fn(state)]);
    }
    
    inspect() {
        return 'State(?)';
    }
}

// Stack operations with State monad
const push = (item) => State.modify(stack => [...stack, item]);
const pop = () => State.get()
    .flatMap(stack => 
        stack.length === 0 
            ? State.of(null)
            : State.put(stack.slice(0, -1))
                .flatMap(() => State.of(stack[stack.length - 1]))
    );
const peek = () => State.get()
    .map(stack => stack.length === 0 ? null : stack[stack.length - 1]);

// Stack program
const stackProgram = push('first')
    .flatMap(() => push('second'))
    .flatMap(() => push('third'))
    .flatMap(() => pop())
    .flatMap(popped => peek()
        .map(top => ({ popped, currentTop: top }))
    );

const [stackResult, finalStack] = stackProgram.run([]);
console.log('State monad result:', stackResult);
console.log('Final stack:', finalStack);

// Exercise 6: List Monad for Non-Deterministic Computations
console.log('\n\nExercise 6: List Monad');

class List {
    constructor(items) {
        this.items = Array.isArray(items) ? items : [items];
    }
    
    map(fn) {
        return new List(this.items.map(fn));
    }
    
    flatMap(fn) {
        return new List(
            this.items.reduce((acc, item) => {
                const result = fn(item);
                return acc.concat(result.items);
            }, [])
        );
    }
    
    static of(value) {
        return new List([value]);
    }
    
    static from(items) {
        return new List(items);
    }
    
    static empty() {
        return new List([]);
    }
    
    inspect() {
        return `List([${this.items.map(x => JSON.stringify(x)).join(', ')}])`;
    }
}

// Non-deterministic computations
const range = (start, end) => 
    List.from(Array.from({ length: end - start + 1 }, (_, i) => start + i));

const pythagoreanTriples = range(1, 10)
    .flatMap(a => 
        range(a, 10).flatMap(b =>
            range(b, 10).flatMap(c =>
                a * a + b * b === c * c 
                    ? List.of([a, b, c])
                    : List.empty()
            )
        )
    );

console.log('List monad - Pythagorean triples:', pythagoreanTriples.inspect());

// Exercise 7: Monad Laws Verification
console.log('\n\nExercise 7: Monad Laws Verification');

const verifyMonadLaws = (MonadType, value, f, g) => {
    const M = MonadType;
    const m = M.of(value);
    
    // Left Identity: M.of(a).flatMap(f) === f(a)
    const leftIdentityTest = () => {
        try {
            const result1 = M.of(value).flatMap(f);
            const result2 = f(value);
            return JSON.stringify(result1.value || result1) === JSON.stringify(result2.value || result2);
        } catch (e) {
            return false;
        }
    };
    
    // Right Identity: m.flatMap(M.of) === m
    const rightIdentityTest = () => {
        try {
            const result1 = m.flatMap(M.of);
            return JSON.stringify(result1.value || result1) === JSON.stringify(m.value || m);
        } catch (e) {
            return false;
        }
    };
    
    // Associativity: m.flatMap(f).flatMap(g) === m.flatMap(x => f(x).flatMap(g))
    const associativityTest = () => {
        try {
            const result1 = m.flatMap(f).flatMap(g);
            const result2 = m.flatMap(x => f(x).flatMap(g));
            return JSON.stringify(result1.value || result1) === JSON.stringify(result2.value || result2);
        } catch (e) {
            return false;
        }
    };
    
    return {
        leftIdentity: leftIdentityTest(),
        rightIdentity: rightIdentityTest(),
        associativity: associativityTest()
    };
};

// Functions for testing laws
const addOne = x => Maybe.of(x + 1);
const double = x => Maybe.of(x * 2);

console.log('Monad laws verification:');
console.log('Maybe laws:', verifyMonadLaws(Maybe, 5, addOne, double));

// Exercise 8: Real-World Application - User Authentication Pipeline
console.log('\n\nExercise 8: User Authentication Pipeline');

const authenticateUser = (credentials) => {
    // Simulate authentication
    if (credentials.username === 'admin' && credentials.password === 'secret') {
        return Either.right({ 
            id: 1, 
            username: 'admin', 
            role: 'administrator',
            token: 'abc123' 
        });
    }
    return Either.left('Invalid credentials');
};

const authorizeAction = (user, action) => {
    if (user.role === 'administrator') {
        return Either.right({ ...user, authorized: true, action });
    }
    return Either.left(`User not authorized for action: ${action}`);
};

const logAccess = (user) => {
    console.log(`[AUTH LOG] User ${user.username} accessed ${user.action}`);
    return Either.right({ ...user, logged: true });
};

const authPipeline = (credentials, action) =>
    authenticateUser(credentials)
        .flatMap(user => authorizeAction(user, action))
        .flatMap(logAccess)
        .fold(
            error => ({ success: false, error }),
            user => ({ success: true, user })
        );

console.log('Authentication pipeline:');
console.log('Valid credentials:', authPipeline(
    { username: 'admin', password: 'secret' }, 
    'delete_user'
));

console.log('Invalid credentials:', authPipeline(
    { username: 'user', password: 'wrong' }, 
    'delete_user'
));

console.log('\n=== All monad exercises completed! ===');
