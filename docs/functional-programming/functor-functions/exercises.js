// 🎭 Functor Functions - Practical Exercises

console.log('=== Functor Functions Exercises ===\n');

// Exercise 1: Basic Functor Implementation
console.log('Exercise 1: Basic Functor Implementation');

class Container {
    constructor(value) {
        this.value = value;
    }
    
    map(fn) {
        return Container.of(fn(this.value));
    }
    
    static of(value) {
        return new Container(value);
    }
    
    inspect() {
        return `Container(${JSON.stringify(this.value)})`;
    }
}

// Test basic functor
const result1 = Container.of(5)
    .map(x => x * 2)
    .map(x => x + 3)
    .map(x => `Result: ${x}`);

console.log('Basic functor chain:', result1.inspect());

// Exercise 2: Maybe Functor for Null Safety
console.log('\n\nExercise 2: Maybe Functor Implementation');

class Maybe {
    constructor(value) {
        this.value = value;
    }
    
    isNothing() {
        return this.value === null || this.value === undefined;
    }
    
    isSomething() {
        return !this.isNothing();
    }
    
    map(fn) {
        return this.isNothing() ? Maybe.nothing() : Maybe.of(fn(this.value));
    }
    
    flatMap(fn) {
        return this.isNothing() ? Maybe.nothing() : fn(this.value);
    }
    
    filter(predicate) {
        return this.isNothing() || predicate(this.value) 
            ? this 
            : Maybe.nothing();
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
    
    static some(value) {
        return new Maybe(value);
    }
    
    inspect() {
        return this.isNothing() 
            ? 'Maybe.Nothing' 
            : `Maybe.Some(${JSON.stringify(this.value)})`;
    }
}

// Test Maybe functor
const users = [
    { id: 1, name: 'John', address: { street: '123 Main St', city: 'Boston' } },
    { id: 2, name: 'Jane', address: null },
    { id: 3, name: 'Bob' }
];

const getUserCity = (user) => 
    Maybe.of(user)
        .map(u => u.address)
        .map(addr => addr && addr.city)
        .filter(city => city && city.length > 0)
        .map(city => city.toUpperCase())
        .getOrElse('UNKNOWN CITY');

console.log('Maybe functor examples:');
users.forEach((user, i) => {
    console.log(`User ${i + 1} city:`, getUserCity(user));
});

// Exercise 3: Either Functor for Error Handling
console.log('\n\nExercise 3: Either Functor Implementation');

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
    
    mapLeft(fn) {
        return this.isLeft() ? Either.left(fn(this.value)) : this;
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

// Test Either functor
const parseJSON = (str) => Either.try(() => JSON.parse(str));
const validateUser = (user) => {
    if (!user.name) return Either.left('Name is required');
    if (!user.email) return Either.left('Email is required');
    if (!user.email.includes('@')) return Either.left('Invalid email');
    return Either.right(user);
};

const processUserData = (jsonString) =>
    parseJSON(jsonString)
        .flatMap(validateUser)
        .map(user => ({ ...user, processed: true }))
        .fold(
            error => ({ error }),
            user => ({ success: true, user })
        );

console.log('Either functor examples:');
console.log('Valid JSON:', processUserData('{"name":"John","email":"john@example.com"}'));
console.log('Invalid JSON:', processUserData('invalid json'));
console.log('Missing email:', processUserData('{"name":"John"}'));

// Exercise 4: IO Functor for Side Effects
console.log('\n\nExercise 4: IO Functor Implementation');

class IO {
    constructor(effect) {
        if (typeof effect !== 'function') {
            throw new Error('IO requires a function');
        }
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

// IO utility functions
const log = (message) => IO.from(() => {
    console.log(`LOG: ${message}`);
    return message;
});

const getCurrentTime = () => IO.from(() => new Date().toISOString());

const createFile = (name, content) => IO.from(() => {
    console.log(`Creating file: ${name}`);
    console.log(`Content: ${content}`);
    return `File ${name} created successfully`;
});

// Compose IO operations
const fileOperation = IO.of('Hello World')
    .map(content => content.toUpperCase())
    .flatMap(content => log(`Processing: ${content}`))
    .flatMap(content => getCurrentTime().map(time => `${content} at ${time}`))
    .flatMap(result => createFile('output.txt', result));

console.log('IO functor composition:');
console.log('About to run IO operations...');
const ioResult = fileOperation.run();
console.log('Final result:', ioResult);

// Exercise 5: List Functor for Non-Deterministic Computations
console.log('\n\nExercise 5: List Functor Implementation');

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
    
    filter(predicate) {
        return new List(this.items.filter(predicate));
    }
    
    concat(otherList) {
        return new List([...this.items, ...otherList.items]);
    }
    
    static of(value) {
        return new List([value]);
    }
    
    static empty() {
        return new List([]);
    }
    
    static from(items) {
        return new List(items);
    }
    
    inspect() {
        return `List([${this.items.join(', ')}])`;
    }
}

// Test List functor
const choices = (options) => List.from(options);

const colors = choices(['red', 'blue', 'green']);
const sizes = choices(['small', 'medium', 'large']);

// Generate all combinations
const products = colors.flatMap(color =>
    sizes.map(size => ({ color, size, price: Math.floor(Math.random() * 100) + 10 }))
);

console.log('List functor - Product combinations:');
console.log(products.inspect());

// Exercise 6: Custom Functor with Validation
console.log('\n\nExercise 6: Custom Validation Functor');

class Validation {
    constructor(value, errors = []) {
        this.value = value;
        this.errors = errors;
    }
    
    isValid() {
        return this.errors.length === 0;
    }
    
    map(fn) {
        return this.isValid() 
            ? new Validation(fn(this.value), this.errors)
            : this;
    }
    
    flatMap(fn) {
        if (!this.isValid()) return this;
        const result = fn(this.value);
        return new Validation(result.value, [...this.errors, ...result.errors]);
    }
    
    mapError(fn) {
        return new Validation(this.value, this.errors.map(fn));
    }
    
    static success(value) {
        return new Validation(value, []);
    }
    
    static failure(error) {
        return new Validation(null, [error]);
    }
    
    static of(value) {
        return Validation.success(value);
    }
    
    inspect() {
        return this.isValid() 
            ? `Validation.Success(${JSON.stringify(this.value)})`
            : `Validation.Failure([${this.errors.join(', ')}])`;
    }
}

// Validation functions
const validateName = (name) => 
    !name || name.trim() === '' 
        ? Validation.failure('Name is required')
        : name.length < 2 
            ? Validation.failure('Name too short')
            : Validation.success(name.trim());

const validateEmail = (email) =>
    !email || email.trim() === ''
        ? Validation.failure('Email is required')
        : !email.includes('@')
            ? Validation.failure('Invalid email format')
            : Validation.success(email.toLowerCase().trim());

const validateAge = (age) =>
    age === undefined || age === null
        ? Validation.failure('Age is required')
        : age < 0
            ? Validation.failure('Age cannot be negative')
            : age > 150
                ? Validation.failure('Age too high')
                : Validation.success(age);

// Test validation functor
const validateUserInput = (input) => {
    const nameValidation = validateName(input.name);
    const emailValidation = validateEmail(input.email);
    const ageValidation = validateAge(input.age);
    
    // Combine validations
    if (nameValidation.isValid() && emailValidation.isValid() && ageValidation.isValid()) {
        return Validation.success({
            name: nameValidation.value,
            email: emailValidation.value,
            age: ageValidation.value
        });
    } else {
        return new Validation(null, [
            ...nameValidation.errors,
            ...emailValidation.errors,
            ...ageValidation.errors
        ]);
    }
};

console.log('Validation functor examples:');
console.log('Valid input:', validateUserInput({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
}).inspect());

console.log('Invalid input:', validateUserInput({
    name: '',
    email: 'invalid-email',
    age: -5
}).inspect());

// Exercise 7: Functor Laws Verification
console.log('\n\nExercise 7: Functor Laws Verification');

const verifyFunctorLaws = (FunctorType, value, f, g) => {
    const functor = FunctorType.of(value);
    const identity = x => x;
    const compose = (fn1, fn2) => x => fn1(fn2(x));
    
    // Identity law: functor.map(identity) should equal functor
    const identityTest = JSON.stringify(functor.map(identity).value) === JSON.stringify(functor.value);
    
    // Composition law: functor.map(compose(f, g)) should equal functor.map(g).map(f)
    const composed = functor.map(compose(f, g));
    const chained = functor.map(g).map(f);
    const compositionTest = JSON.stringify(composed.value) === JSON.stringify(chained.value);
    
    return {
        identity: identityTest,
        composition: compositionTest,
        valid: identityTest && compositionTest
    };
};

const addOne = x => x + 1;
const double = x => x * 2;

console.log('Functor laws verification:');
console.log('Container laws:', verifyFunctorLaws(Container, 5, double, addOne));
console.log('Maybe laws:', verifyFunctorLaws(Maybe, 5, double, addOne));
console.log('Either laws:', verifyFunctorLaws(Either, 5, double, addOne));

console.log('\n=== All functor exercises completed! ===');
