---
id: javascript-object-composition
title: Object Composition in JavaScript
slug: /javascript/object-composition
sidebar_label: Object Composition in JavaS...
---

# Object Composition in JavaScript

Object composition is a powerful way to build complex objects by combining smaller, focused objects or behaviors. It's often preferred over inheritance for its flexibility and reduced coupling.

## Understanding Object Composition

Object composition is about building complex objects by combining simpler ones, following the principle "composition over inheritance". This approach allows for:

- More flexible code structures
- Better code reuse
- Reduced coupling between components

## Types of Relationships

### 1. IS-A Relationship (Inheritance)

````javascript
class Person {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

class Employee extends Person {
    constructor(empId, firstName, lastName, salary) {
        super(firstName, lastName);
        this.empId = empId;
        this.salary = salary;
    }
}

const emp = new Employee(13, "Sparsh", "Jaswal", 50000);

### 2. HAS-A Relationship (Composition)
```javascript
class Product {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class Order {
    constructor(id, product) {
        this.id = id;
        this.product = product; // Has-A relationship
    }

    getOrderDetails() {
        return `Order ${this.id}: ${this.product.name}`;
    }
}

// Composition in action with dependency injection
const product = new Product(1, 'Levis-Pant');
const order = new Order('ORD-001', product);
console.log(order.getOrderDetails()); // "Order ORD-001: Levis-Pant"
````

## Implementing Composition

### 1. Basic Composition with Factory Functions

```javascript
// Creating behavior objects
const hasName = (name) => ({
  getName: () => name,
  setName: (newName) => (name = newName),
});

const hasAge = (age) => ({
  getAge: () => age,
  setAge: (newAge) => (age = newAge),
});

// Composing objects
const createPerson = (name, age) => {
  return {
    ...hasName(name),
    ...hasAge(age),
  };
};

const person = createPerson('Sparsh', 25);
console.log(person.getName()); // "Sparsh"
```

### 2. Module Pattern with Private State

```javascript
const createBankAccount = (initialBalance) => {
  let balance = initialBalance; // Private state

  return {
    deposit(amount) {
      if (amount > 0) {
        balance += amount;
        return true;
      }
      return false;
    },

    withdraw(amount) {
      if (amount <= balance) {
        balance -= amount;
        return true;
      }
      return false;
    },

    getBalance() {
      return balance;
    },
  };
};

const account = createBankAccount(100);
console.log(account.getBalance()); // 100
account.deposit(50);
console.log(account.getBalance()); // 150
console.log(account.balance); // undefined (private)
```

```js
const ObjectInstance = new Object();
console.log(ObjectInstance.__proto__);
// {constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, hasOwnProperty: ƒ, __lookupGetter__: ƒ, …}
console.log(ObjectInstance.__proto__.__proto__);
// null
```

## Best Practices for Object Composition

### 1. Favor Composition Over Inheritance

```javascript
// Instead of inheritance hierarchy
const canSwim = (state) => ({
  swim: () => console.log(`${state.name} is swimming`),
});

const canFly = (state) => ({
  fly: () => console.log(`${state.name} is flying`),
});

const createDuck = (name) => {
  const state = { name };
  return {
    ...canSwim(state),
    ...canFly(state),
  };
};

const duck = createDuck('Donald');
duck.swim(); // "Donald is swimming"
duck.fly(); // "Donald is flying"
```

### 2. Keep Objects Small and Focused

```javascript
// Small, focused behaviors
const hasLogger = (prefix) => ({
  log: (msg) => console.log(`${prefix}: ${msg}`),
});

const hasTimestamp = () => ({
  getTimestamp: () => new Date().toISOString(),
});

// Compose them together
const createLogger = (prefix) => ({
  ...hasLogger(prefix),
  ...hasTimestamp(),
});

const logger = createLogger('APP');
logger.log(logger.getTimestamp()); // "APP: 2025-10-25T..."
```

## Advanced Composition Patterns

### 1. Method Chaining

```javascript
const createCalculator = () => {
  let value = 0;

  return {
    add(n) {
      value += n;
      return this;
    },
    subtract(n) {
      value -= n;
      return this;
    },
    multiply(n) {
      value *= n;
      return this;
    },
    getValue() {
      return value;
    },
  };
};

const calc = createCalculator();
console.log(
  calc.add(5).multiply(2).subtract(3).getValue(), // 7
);
```

### 2. Event Emitter Pattern

```javascript
const createEventEmitter = () => {
  const events = new Map();

  return {
    on(event, callback) {
      if (!events.has(event)) {
        events.set(event, []);
      }
      events.get(event).push(callback);
      return this;
    },

    emit(event, data) {
      if (events.has(event)) {
        events.get(event).forEach((cb) => cb(data));
      }
      return this;
    },
  };
};

const emitter = createEventEmitter();
emitter.on('data', console.log).emit('data', 'Hello World');
```

## Benefits of Object Composition

1. **Flexibility**: Easy to add or remove behaviors
2. **Maintainability**: Simpler to modify individual components
3. **Reusability**: Behaviors can be shared across different objects
4. **Testing**: Easier to test individual components
5. **Loose Coupling**: Objects are less dependent on each other

## When to Use Object Composition

✅ **Use When**:

- You need flexible object creation
- Objects share behavior but aren't hierarchical
- You want to avoid deep inheritance chains
- You need to combine multiple behaviors

❌ **Avoid When**:

- You have a clear is-a relationship
- You need tight coupling between objects
- You're working with simple, single-purpose objects

## Further Reading

- [MDN Web Docs - Object-oriented JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects)
- [JavaScript Info - Object composition](https://javascript.info/mixins)
- [Composition vs Inheritance](https://reactjs.org/docs/composition-vs-inheritance.html)

How can I reuse/borrow the function print name?

```javascript
const student = {
  name: 'sparsh',
  printDetail: function (registrationNo, age) {
    console.log('Name: ' + this.name);
    console.log('Registration Number: ' + registrationNo);
    console.log('Age: ' + age);
  },
};
student.printDetail(10, 28);
// give output Name: sparsh    Roll No: 10

const student2 = {
  name: 'jaswal',
};
let student2Func = student.printDetail.bind(student2, 11);
student2Func(40);
student2Func(40, 20);
student.printDetail.call(student2, 12, 32);
student.printDetail.apply(student, [22, 41]);

const array = [1, 2, 3];
function getMaxNumber(arr) {
  return Math.max.apply(null, arr);
}
getMaxNumber(array);
```

# Class [es6]

```js
class companyItem {
  constructor(productName) {
    this.rawMaterial = 'Iron';
    this.company = 'Tata';
    this.productName = productName;
  }
}

const indianGoogleEmployee = new companyItem('jeep');
```

# **Inheritance**

```js
class Employee {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  getInfo() {
    console.log(this.name, this.age);
  }
}

class GoogleEmployee extends Employee {
  constructor() {
    super('sparsh jaswal', 25);
  }
}
const indianGoogleEmployee = new GoogleEmployee();
console.log(indianGoogleEmployee.getInfo());
```

# Static

Static‌ ‌members‌ ‌are‌ ‌accessed‌ ‌directly‌ ‌through‌ ‌the‌ ‌class‌ ‌name,‌ ‌not‌ ‌through‌ ‌
the‌ ‌instance.‌ ‌

```js
class Hotel {
  static welcome() {
    console.log('this is a static member function');
  }
}
console.log(Hotel.welcome());
// this is a static member function
const hotel = new Hotel();
console.log(hotel.welcome());
// error
```

```js
class Square {
    static sqrt(n) {
        if(n!==undefined)
            return n*n;
    }
}
class DoubleSquare extends Square {
    static doubleSqrt(n) {
        if(n!== undefined)
            return 2*super.sqrt(n);
    }
}
console.log(Square.sqrt(5));
// 25
const square = new Square();
console.log(square.sqrt(5));
// Uncaught TypeError TypeError: square.sqrt is not a function
console.log(DoubleSquare.sqrt(5));
// 25
console.log(DoubleSquare.doubleSqrt(5));
// 50
const doubleSQUARE = new DoubleSquare();
console.log(doubleSQUARE.sqrt(5));
// TypeError TypeError: doubleSQUARE.sqrt is not a function
console.log(doubleSQUARE.doubleSqrt(5));
// Uncaught ReferenceError ReferenceError: doubleSQUARE is not defined
*some‌ ‌use-case‌ ‌of‌ ‌writing‌ ‌javascript‌ ‌ ‌
```

Introduced‌ ‌in‌ ‌ES5,‌ ‌Setter‌ ‌and‌ ‌Getter‌ ‌let‌ ‌you‌ ‌define‌ ‌the‌ ‌object‌ ‌accessor.‌ ‌
This‌ ‌Object‌ ‌accessor‌ ‌acts‌ ‌as‌ ‌property‌ ‌or‌ ‌methods‌ ‌in‌ ‌javaScript.‌ ‌
Setter‌ ‌and‌ ‌Getter's‌ ‌syntax‌ ‌is‌ ‌way‌ ‌too‌ ‌standardizing‌ ‌the‌ ‌property‌ ‌of‌ ‌an‌ ‌
object.‌

```js
let‌‌ ‌‌user‌‌ ‌=‌ ‌{‌ ‌
 ‌‌name:‌‌ ‌‌"John"‌,‌ ‌
 ‌‌surname:‌‌ ‌‌"Smith"‌,‌ ‌
 ‌‌get‌‌ ‌‌fullName‌()‌ ‌{‌ ‌
 ‌‌return‌‌ ‌‌`‌${this‌.‌name‌}‌‌ ‌‌${this‌.‌surname‌}‌`‌;‌ ‌
 ‌},‌ ‌
 ‌‌set‌‌ ‌‌fullName‌(‌value‌)‌ ‌{‌ ‌
 ‌[‌this‌.‌name‌,‌ ‌‌this‌.‌surname‌]‌ ‌=‌ ‌‌value‌.‌split‌(‌"‌ ‌"‌);‌ ‌
 ‌}‌ ‌
};‌ ‌
```

# CHAPTER | Creating Object

## In Javascript, Objects can be created using below listed ways:-

1. **Using an Object constructor and new Operator**

```javascript
var Student = new Object();
Student.name = 'Sparsh Jaswal';
Student.dob = '25/07/1991';

function Student(name, dob) {
  this.name = name;
  this.dob = dob;
}
var student = new Student('sparsh', '25/07/1991');
```

1. **Object Literals (_comma-separated list of name-value pairs wrapped in curly braces_)**

```javascript
var Student = {
  name: 'Sparsh Jaswal',
  age: 28,
  detail: function () {
    console.log(this.name + '\n' + this.age);
  },
};

// Some Supported Syntax
let name = 'sparsh';
let age = 31;
let address = 'lives';
let obj = {
  name: 'jaswal',
  age,
  [address]: 'delhi',
  welcome() {
    console.log(`
      name: ${this.name}
      lives: ${this.lives}
      age: ${this.age}
    `);
  },
};
console.log(obj);
console.log(obj[address]);
obj.welcome();

/* Output
{name: 'jaswal', age: 31, lives: 'delhi', welcome:ƒ}
delhi
      name: jaswal
      lives: delhi
      age: 31
*/
```

> Trailing comma following the last property in an object literal is ignored but in older browsers or IE considers them an error.

1. **Class (ES 6) defines the blueprint of an object But it's syntactically sugar work similar to traditional object creations**

```javascript
class Student {
    constructor(name,age) {
        this.name = name;
        this.age = age;
    }
    this.print = function(){
        console.log(this.name+"\n"+this.age)
    }
}
const Student2 = new Student("Sparsh","25");
```

> _We can define everything inside the constructor function but then it won’t be shared across all inherited objects and will redefine each time a new instance is created. Anything outside the constructor is a part of the prototype which will be shared across all the instances._

## 🚀 Advanced Topics

### Runtime-Augmented Scope

> **Note**: This advanced topic covers runtime scope modifications and will be expanded in future updates.

**Coming Soon:**

- Dynamic scope augmentation techniques
- Runtime composition patterns
- Advanced prototype manipulation
- Performance implications

# ****Deleting Properties****

****Delete operator removes a property from an object.****

`delete Student.age;
delete Student["Full-Name"]`

1. `delete` operators don't operate on value of the property but on property itself.

2. `delete` operator only deletes its own properties, not inherited ones.

3. `delete` evaluates to true in below cases :-

   1. delete succeeded
   2. delete had no effect
   3. deleting non-existent property

   # Inheritance

Inheritance is one of the principles of OOP.ES6 introduces the class & extends keyword which is like the classical inheritance. Overloading is not supported in JavaScript.

```javascript
class Student {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  printDetail() {
    console.log(this.name + ' ' + this.age);
  }
}
class Sport extends Student {
  constructor(game, name, age) {
    super(name, age);
    this.playingGame = game;
  }
  printDetail() {
    console.log(this.playingGame, this.name, this.age);
  }
}
var student = new Student('sparsh', 28);
var sport = new Sport('football', 'sparsh', 28);
sport.printDetail();
student.printDetail();
console.log(sport); // can se link between Student & Sport
console.log(student); //can see link between Student and Object
```

Class field proposal is in stage 4 in we can create class private property or methods using # sign. Also, we can use weak-map to make it private.

Object.create ( ES 5 )
Object.create accepts only Object or null as an argument.
When null is passed

An empty object is returned.
When Object is passed(can be object identifier )
An empty object is returned with a link to the passed object.This link ensures :-
All linked/chained object properties are directly accessible by the returned object but linked property is not a part of the returned object.
Any change in linked/chained objects will automatically be reflected back.

```javascript
var student = Object.create({
  name: 'sparsh',
  age: 26,
  print() {
    console.log(this.name + '\n' + this.age);
  },
});
var student2 = Object.create(student);
console.log(student2.name, student2.age, student2.print);
```

# Defining or assigning object keys and value :-

## Some Rules for defining Keys and values:-

1. A property name is a javaScript identifier or a string literal(_the empty string is allowed_).

2. Property value is any JavaScript expression. The value of the expression (_it may be a primitive value or an object value_) becomes the values of the property.

3. Reserved words may be used as property names without quoting.

## Keys & Value

1. Dot Operators

```javascript
var obj = {};
obj.name = 'sparsh'; //initializing property name
obj.name; //accessing property with dot operator
obj.display = function () {
  // initializing method
  console.log(this.name);
};
obj.display(); // accessing method with dot operator
```

1. Square Bracket

Associate Array is an abstract data type that can hold data in (key, value) pairs like dictionaries, hash, map. JavaScript Objects are associative arrays.####

```javascript
var obj = {};
obj['name'] = 'sparsh'; //initializing property name
obj['name']; //accessing property with square bracket operator

Object.defineProperty;
var object = {};
Object.defineProperty(object, 'name', {
  value: 'sparsh',
  writable: true,
  enumerable: true,
  configurable: true,
});
```

## SET & GET properties of Object

get , set and writable explanation
Object.defineProperties

```javascript
var object = {};
Object.defineProperty(object,{
      "name": {
       value:"sparsh",
       writable: true,
       enumerable: true,
       configurable: true
      },
      "age": {
       value:"25",
       writable: true,
       enumerable: true,
       configurable: true
       },
);
```

# Private Method And Properties

Private member

```js
class Bank {
  username;
  #password;
  constructor() {
    this.username = 'sparsh';
    this.#password = '1234';
  }
  #resetPassword() {
    this.#password = 'sparsh';
  }
  getInfo() {
    console.log(this.username, this.#password);
    this.#resetPassword();
  }
}

const instanceBank = new Bank();

console.log(instanceBank.getInfo());
// sparsh 1234
console.log(instanceBank.getInfo());
// sparsh sparsh
console.log(instanceBank.#resetPassword());
// SyntaxError: Private field '#resetPassword' must be declared in an enclosing class
console.log(instanceBank.#password);
// SyntaxError: Private field '#resetPassword' must be declared in an enclosing class
```

# CHAPTER | prototyping chaining

## Let's take an example to understand prototype chaining

1. ### Create an objects like Car, Truck and Bus for company Ford and with common rawMaterial

```javascript
function companyItem(productName) {
  this.productName = productName;
}
Item.prototype.rawMaterial = 'Iron';
Item.prototype.company = 'Ford';

var Car = new companyItem('Car');
var Bus = new companyItem('Bus');
var Truck = new companyItem('Truck');
```

As a general use case, we have wide variety of car. So, our Car Object doesn't specify which modal of car is it.

```javascript
function companyItem(productName) {
  this.productName = productName;
}
Item.prototype.rawMaterial = "Iron";
Item.prototype.company = "Ford";

var Car = new companyItem("Car");
var Bus = new companyItem("Bus");
var Truck = new companyItem("Truck");

// modal of car
Car.prototype.modal = function (modalName) {
    console.log("Car Modal: ",modalName);
};

// TO DO
1.
function Light() {}
Light.prototype.color = "red";

function Bulb() {}
Bulb.prototype = new Light();

Light.prototype.color = "blue";
console.log(new Bulb().color);

1.
Which code specifies the Operator constructor as the prototype for the Multiply constructor?
You are correct!
Multiply.prototype = new Operator();

1.
What is an advantage of using a constructor function to build objects?
You are correct!
It lets you avoid writing redundant code.
```

# CHAPTER | Prototype

It's a property that an object has.

## Let's understand by taking an example to understand prototype

### Create objects like Car, Truck and Bus for company Ford with common rawMaterial

```javascript
function Car() {
  this.rawMaterial = 'Iron';
  this.company = 'Ford';
  this.productName = 'Car';
}

var CarOne = new Car();

function Truck() {
  this.rawMaterial = 'Iron';
  this.company = 'Ford';
  this.productName = 'Truck';
}
var TruckOne = new Truck();

function Bus() {
  this.rawMaterial = 'Iron';
  this.company = 'Ford';
  this.productName = 'Bus';
}
var BusOne = new Bus();
```

> Let's optimize the above code.

```javascript
function companyItem(productName) {
  this.productName = productName;
}
companyItem.prototype.rawMaterial = 'Iron';
companyItem.prototype.company = 'Ford';

var Car = new companyItem('Car');
var Bus = new companyItem('Bus');
var Truck = new companyItem('Truck');
```

### **What are the benefits?**

**Saves memory** as each instance of companyItem has common space for rawMaterial & company

# Static,‌ ‌Getter‌ ‌&‌ ‌Setter‌ ‌

Static‌ ‌members‌ ‌are‌ ‌accessed‌ ‌directly‌ ‌through‌ ‌the‌ ‌class‌ ‌name,‌ ‌not‌ ‌through‌ ‌
the‌ ‌instance.‌ ‌

```js
class‌‌ ‌‌Car‌‌ ‌{‌ ‌
    ‌‌static‌‌ ‌‌printMsg‌(){‌ ‌
        ‌‌return‌‌ ‌‌"this‌ ‌is‌ ‌Car‌ ‌"‌;‌ ‌
    ‌}‌ ‌
}‌ ‌
Car‌.‌printMsg‌();‌ ‌

class‌‌ ‌‌Square‌‌ ‌{‌ ‌
 ‌‌static‌‌ ‌‌sqrt‌(‌n‌)‌ ‌{‌ ‌
 ‌‌if‌‌ ‌(‌n‌‌ ‌===‌ ‌‌undefined‌)‌ ‌ ‌
 ‌‌n‌‌ ‌=‌ ‌‌1‌;‌ ‌
 ‌‌return‌‌ ‌‌n‌‌ ‌*‌ ‌‌n‌;‌ ‌
 ‌}‌ ‌
 ‌}‌ ‌
 ‌‌class‌‌ ‌‌DoubleSquare‌‌ ‌‌extends‌‌ ‌‌Square‌‌ ‌{‌ ‌
 ‌‌static‌‌ ‌‌sqrt‌(‌n‌)‌ ‌{‌ ‌
 ‌‌return‌‌ ‌‌super‌.‌sqrt‌(‌n‌)‌ ‌*‌ ‌‌super‌.‌sqrt‌(‌n‌);‌ ‌
 ‌}‌ ‌
 ‌}‌ ‌
 ‌‌console‌.‌log‌(‌Square‌.‌sqrt‌());‌ ‌ ‌
 ‌‌var‌‌ ‌‌temp‌‌ ‌=‌ ‌‌new‌‌ ‌‌Square‌();‌ ‌
 ‌‌console‌.‌log‌(‌temp‌.‌sqrt‌());‌ ‌
 ‌‌console‌.‌log‌(‌DoubleSquare‌.‌sqrt‌(‌3‌));‌ ‌
```

*some‌ ‌use-case‌ ‌of‌ ‌writing‌ ‌javascript‌ ‌ ‌
Introduced‌ ‌in‌ ‌ES5,‌ ‌Setter‌ ‌and‌ ‌Getter‌ ‌let‌ ‌you‌ ‌define‌ ‌the‌ ‌object‌ ‌accessor.‌ ‌
This‌ ‌Object‌ ‌accessor‌ ‌acts‌ ‌as‌ ‌property‌ ‌or‌ ‌methods‌ ‌in‌ ‌javaScript.‌ ‌
Setter‌ ‌and‌ ‌Getter's‌ ‌syntax‌ ‌is‌ ‌way‌ ‌too‌ ‌standardizing‌ ‌the‌ ‌property‌ ‌of‌ ‌an‌ ‌
object.‌ ‌

````js
let‌‌ ‌‌user‌‌ ‌=‌ ‌{‌ ‌
  ‌‌name:‌‌ ‌‌"John"‌,‌ ‌
  ‌‌surname:‌‌ ‌‌"Smith"‌,‌ ‌
 ‌```
 ‌
 ‌ ‌
56‌ ‌
 ‌```js
  ‌‌get‌‌ ‌‌fullName‌()‌ ‌{‌ ‌
    ‌‌return‌‌ ‌‌`‌${this‌.‌name‌}‌‌ ‌‌${this‌.‌surname‌}‌`‌;‌ ‌
  ‌},‌ ‌
  ‌‌set‌‌ ‌‌fullName‌(‌value‌)‌ ‌{‌ ‌
    ‌[‌this‌.‌name‌,‌ ‌‌this‌.‌surname‌]‌ ‌=‌ ‌‌value‌.‌split‌(‌"‌ ‌"‌);‌ ‌
  ‌}‌ ‌
};‌ ‌
````

# This

This is the object that function is a property of

- binds this lexically or lexically static scoping
  In order to run your code in javascript, we need to wrap it in the execution context. Base execution context is called a global context. Global execution context will create
  Global object( in the browser is a window global object )

```js
  console.log(window)
  Gives all global objects and methods
  console.log(this)
```

This (current execution context)
points to objects of the current execution context
Gives access to the method to the Object
Reusability of code

```js
var myCar = {
  color: 'Blue',
  logColor: function () {
    var self = this;
    console.log('In logColor - this.color:' + this.color);
    console.log('In logColor - self.color:' + self.color);
    (function () {
      console.log('In logColor - this.color:' + this.color);
      console.log('In logColor - self.color:' + self.color);
    })();
  },
};
myCar.logColor();
```

Since JavaScript supports lexical scoping so the where the identifiers are defined is important and this is always dynamically scoped.

```js
const a = function () {
  console.log('a', this);
  const b = function () {
    console.log('b', this);
    const c = {
      print: function () {
        console.log('c', this);
      },
    };
    c.hi();
  };
};
a();

const obj1 = {
  name: 'sparsh',
  print() {
    console.log(this.name, this);
    let Obj2 = function () {
      console.log(this.name, this);
    };
    Obj2();
  },
};
obj1.print();
```

Since JavaScript supports lexical scoping so the where the identifiers are defined is important and this is always dynamically scoped. To avoid the use of the dynamic nature of this and make our code more controlled we can use arrow function and bind. By using arrow function and bind we can explicitly assign an execution context to dynamically this.

# ****Traversing Properties****

****Let’s suppose I have an object with lots of properties. How to Traverse through each property in javaScript?****

```js
var Obj = {
  name: 'sparsh',
  age: 28,
  position: 'Developer',
  from: 'Himachal',
};
```

Code will be more consistent by following the rules of functional programming and one such rule is immutability.An object that we are creating should be immutable.

```js
Object.freeze(student);
Object.seal(student);
Object.preventExtensions(student);
```

Code will be more performant if we use the objects that are frozen.
Updating an Object with immutability practice

```js
const person = { name:"sparsh"}
// want to update the object and properties to same
const updatedPerson = Object.assign({},person,{name:"sparsh jaswal",age:30})
const updatedPerson = {...person,name:"sparsh jaswal",age:30}
Above pattern fails for nested Object
updatedPerson.address.city = "delhi"
```

Above code will change both updatedPerson & person as its shallow copy for nested objects(address).To avoid the above fail we can use the below pattern.

```js
const person = { name: 'sparsh', address: { city: 'bengaluru', pin: 560035 } };
// want to update the object ,its nested properties and properties to same
const updatedPerson = Object.assign(
  {},
  person,
  { address: { city: person.address.city } },
  { name: 'sparsh jaswal' },
);

const updatedPerson = {
  ...person,
  address: {
    ...person.address,
  },
  name: 'sparsh jaswal',
  age: 30,
};
```

# **CHAPTER 23 | Object**

Object term is generally referred to as a noun which is a word that is the name of a person, place, thing or idea. The main reason to support the Object in any language is to target data types that hold a value that can be related to the real world.

The object is a container or aggregate or a complex data type that contains property and methods in an unordered/ordered manner.

Operations on Object : -

    * Creating An Object and Properties [a URl]
    * Traversing An Object Properties
    * Deleting An Object Properties

Object-oriented programming is a paradigm which makes our code Understandable Extendable Maintainable memory-efficient and dry

Object-oriented concept .

1. Abstraction
2. Encapsulation
3. Wrapping code into the container in which the container can
4. Modularity
5. Inheritance
6. Concurrency
7. Persistency

# JavaScript Objects - Complete Guide

## Table of Contents

1. [Introduction to Objects](#introduction-to-objects)
2. [Creating Objects](#creating-objects)
3. [Object Properties and Methods](#object-properties-and-methods)
4. [Object-Oriented Programming Concepts](#object-oriented-programming-concepts)
5. [Prototypes and Prototype Chain](#prototypes-and-prototype-chain)
6. [Classes (ES6+)](#classes-es6)
7. [Inheritance](#inheritance-2)
8. [Object Composition](#object-composition)
9. [Advanced Object Concepts](#advanced-object-concepts)
10. [Best Practices](#best-practices)

---

## Introduction to Objects

Objects in JavaScript are complex data types that represent real-world entities. They are containers that hold properties (data) and methods (functions) in an unordered manner.

### Why Objects?

- **Real-world modeling**: Objects help represent real-world entities in code
- **Data organization**: Group related data and functionality together
- **Code reusability**: Create templates for similar objects
- **Maintainability**: Easier to manage and extend code

### Object-Oriented Programming Principles

1. **Abstraction** - Hide complex implementation details
2. **Encapsulation** - Bundle data and methods together
3. **Inheritance** - Create new objects based on existing ones
4. **Polymorphism** - Same interface, different implementations

---

## Creating Objects

### 1. Object Literals (Most Common)

```javascript
// Basic object literal
const person = {
  name: 'Sparsh Jaswal',
  age: 28,
  city: 'New Delhi',
  greet: function () {
    return `Hello, I'm ${this.name}`;
  },
};

// Shorthand property names (ES6)
const name = 'John';
const age = 30;
const user = { name, age }; // Same as { name: name, age: age }

// Computed property names
const prop = 'email';
const contact = {
  [prop]: 'john@example.com',
  [`${prop}Verified`]: true,
};
```

### 2. Constructor Function

```javascript
// Constructor function
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.greet = function () {
    return `Hello, I'm ${this.name}`;
  };
}

const person1 = new Person('Alice', 25);
const person2 = new Person('Bob', 30);
```

### 3. Object.create()

```javascript
// Creating object with specific prototype
const personPrototype = {
  greet: function () {
    return `Hello, I'm ${this.name}`;
  },
};

const person = Object.create(personPrototype);
person.name = 'Charlie';
person.age = 35;

// With properties descriptor
const employee = Object.create(personPrototype, {
  name: { value: 'Dave', writable: true },
  age: { value: 40, writable: true },
  employeeId: { value: 'EMP001', writable: false },
});
```

### 4. Factory Function

```javascript
function createPerson(name, age) {
  return {
    name,
    age,
    greet() {
      return `Hello, I'm ${this.name}`;
    },
  };
}

const person = createPerson('Eve', 28);
```

---

## Object Properties and Methods

### Property Access

```javascript
const person = { name: 'John', age: 30 };

// Dot notation
console.log(person.name); // "John"

// Bracket notation
console.log(person['age']); // 30

// Dynamic property access
const prop = 'name';
console.log(person[prop]); // "John"
```

### Property Descriptors

```javascript
const obj = {};

// Define property with descriptor
Object.defineProperty(obj, 'name', {
  value: 'John',
  writable: true, // Can be changed
  enumerable: true, // Shows in for...in loops
  configurable: true, // Can be deleted/reconfigured
});

// Get property descriptor
const descriptor = Object.getOwnPropertyDescriptor(obj, 'name');
console.log(descriptor);
```

### Getters and Setters

```javascript
const person = {
  firstName: 'John',
  lastName: 'Doe',

  // Getter
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },

  // Setter
  set fullName(value) {
    [this.firstName, this.lastName] = value.split(' ');
  },
};

console.log(person.fullName); // "John Doe"
person.fullName = 'Jane Smith';
console.log(person.firstName); // "Jane"
```

### Static Methods

```javascript
class MathHelper {
  static add(a, b) {
    return a + b;
  }

  static PI = 3.14159;
}

console.log(MathHelper.add(5, 3)); // 8
console.log(MathHelper.PI); // 3.14159
```

---

## Object-Oriented Programming Concepts

### The `this` Keyword

```javascript
const person = {
  name: 'John',
  greet: function () {
    console.log(`Hello, I'm ${this.name}`);
  },

  // Arrow function doesn't bind 'this'
  greetArrow: () => {
    console.log(`Hello, I'm ${this.name}`); // undefined
  },
};

person.greet(); // "Hello, I'm John"

// Explicit binding
const greetFunc = person.greet;
greetFunc.call({ name: 'Alice' }); // "Hello, I'm Alice"
greetFunc.apply({ name: 'Bob' }); // "Hello, I'm Bob"

const boundGreet = greetFunc.bind({ name: 'Charlie' });
boundGreet(); // "Hello, I'm Charlie"
```

### Private Properties (Modern Approach)

```javascript
class BankAccount {
  #balance = 0; // Private field

  constructor(initialBalance) {
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
    }
  }

  getBalance() {
    return this.#balance;
  }

  // Private method
  #validateAmount(amount) {
    return amount > 0;
  }
}

const account = new BankAccount(100);
console.log(account.getBalance()); // 100
// console.log(account.#balance); // SyntaxError
```

---

## Prototypes and Prototype Chain

### Understanding Prototypes

```javascript
// Constructor function
function Person(name) {
  this.name = name;
}

// Add method to prototype
Person.prototype.greet = function () {
  return `Hello, I'm ${this.name}`;
};

Person.prototype.species = 'Homo sapiens';

const person1 = new Person('Alice');
const person2 = new Person('Bob');

console.log(person1.greet()); // "Hello, I'm Alice"
console.log(person1.species); // "Homo sapiens"

// Memory efficient - method shared across instances
console.log(person1.greet === person2.greet); // true
```

### Prototype Chain

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function () {
  return `${this.name} barks!`;
};

const dog = new Dog('Rex', 'German Shepherd');
console.log(dog.speak()); // "Rex makes a sound"
console.log(dog.bark()); // "Rex barks!"
```

---

## Classes (ES6+)

### Basic Class Syntax

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }

  static species() {
    return 'Homo sapiens';
  }
}

const person = new Person('John', 30);
console.log(person.greet()); // "Hello, I'm John"
console.log(Person.species()); // "Homo sapiens"
```

### Class Inheritance

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Call parent constructor
    this.breed = breed;
  }

  speak() {
    return `${this.name} barks!`;
  }

  wagTail() {
    return `${this.name} wags tail`;
  }
}

const dog = new Dog('Rex', 'Labrador');
console.log(dog.speak()); // "Rex barks!"
console.log(dog.wagTail()); // "Rex wags tail"
```

---

## Inheritance

### Classical Inheritance (ES5 Style)

```javascript
// Parent constructor
function Vehicle(make, model) {
  this.make = make;
  this.model = model;
}

Vehicle.prototype.start = function () {
  return `${this.make} ${this.model} is starting`;
};

// Child constructor
function Car(make, model, doors) {
  Vehicle.call(this, make, model); // Call parent constructor
  this.doors = doors;
}

// Set up inheritance
Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car;

// Add child-specific method
Car.prototype.honk = function () {
  return `${this.make} ${this.model} honks!`;
};

const car = new Car('Toyota', 'Camry', 4);
console.log(car.start()); // "Toyota Camry is starting"
console.log(car.honk()); // "Toyota Camry honks!"
```

### Modern Inheritance (ES6 Classes)

```javascript
class Vehicle {
  constructor(make, model) {
    this.make = make;
    this.model = model;
  }

  start() {
    return `${this.make} ${this.model} is starting`;
  }
}

class Car extends Vehicle {
  constructor(make, model, doors) {
    super(make, model);
    this.doors = doors;
  }

  honk() {
    return `${this.make} ${this.model} honks!`;
  }
}

const car = new Car('Honda', 'Civic', 4);
console.log(car.start()); // "Honda Civic is starting"
```

---

## Object Composition

### IS-A vs HAS-A Relationships

#### IS-A Relationship (Inheritance)

```javascript
// Employee IS-A Person
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

class Employee extends Person {
  constructor(empId, firstName, lastName, salary) {
    super(firstName, lastName);
    this.empId = empId;
    this.salary = salary;
  }

  getEmployeeInfo() {
    return `${this.getFullName()} (ID: ${this.empId})`;
  }
}

const emp = new Employee(101, 'John', 'Doe', 50000);
console.log(emp.getEmployeeInfo()); // "John Doe (ID: 101)"
```

#### HAS-A Relationship (Composition)

```javascript
// Order HAS-A Product
class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }

  getInfo() {
    return `${this.name} - $${this.price}`;
  }
}

class Order {
  constructor(orderId) {
    this.orderId = orderId;
    this.products = [];
    this.total = 0;
  }

  addProduct(product, quantity = 1) {
    this.products.push({ product, quantity });
    this.total += product.price * quantity;
  }

  getOrderSummary() {
    return {
      orderId: this.orderId,
      items: this.products.length,
      total: this.total,
    };
  }
}

// Usage - Dependency Injection
const laptop = new Product(1, 'Laptop', 999);
const mouse = new Product(2, 'Mouse', 25);

const order = new Order('ORD-001');
order.addProduct(laptop, 1);
order.addProduct(mouse, 2);

console.log(order.getOrderSummary());
// { orderId: "ORD-001", items: 2, total: 1049 }
```

### Composition over Inheritance

```javascript
// Instead of deep inheritance, use composition
const canFly = {
  fly() {
    return `${this.name} is flying`;
  },
};

const canSwim = {
  swim() {
    return `${this.name} is swimming`;
  },
};

const canWalk = {
  walk() {
    return `${this.name} is walking`;
  },
};

// Compose abilities
function createBird(name) {
  const bird = { name };
  return Object.assign(bird, canFly, canWalk);
}

function createFish(name) {
  const fish = { name };
  return Object.assign(fish, canSwim);
}

function createDuck(name) {
  const duck = { name };
  return Object.assign(duck, canFly, canSwim, canWalk);
}

const eagle = createBird('Eagle');
const duck = createDuck('Duck');

console.log(eagle.fly()); // "Eagle is flying"
console.log(duck.swim()); // "Duck is swimming"
```

---

## Advanced Object Concepts

### Object Destructuring

```javascript
const person = {
  name: 'John',
  age: 30,
  address: {
    city: 'New York',
    country: 'USA',
  },
};

// Basic destructuring
const { name, age } = person;

// Rename variables
const { name: fullName, age: years } = person;

// Nested destructuring
const {
  address: { city, country },
} = person;

// Default values
const { height = 180 } = person;

// Function parameters
function greet({ name, age = 25 }) {
  return `Hello ${name}, you are ${age} years old`;
}
```

### Object Spread and Rest

```javascript
const person = { name: 'John', age: 30 };
const job = { title: 'Developer', company: 'Tech Corp' };

// Spread operator
const employee = { ...person, ...job };
console.log(employee);
// { name: "John", age: 30, title: "Developer", company: "Tech Corp" }

// Rest operator
const { name, ...otherProps } = employee;
console.log(name); // "John"
console.log(otherProps); // { age: 30, title: "Developer", company: "Tech Corp" }
```

### Object Methods and Utilities

```javascript
const obj = { a: 1, b: 2, c: 3 };

// Object.keys() - Get property names
console.log(Object.keys(obj)); // ["a", "b", "c"]

// Object.values() - Get property values
console.log(Object.values(obj)); // [1, 2, 3]

// Object.entries() - Get key-value pairs
console.log(Object.entries(obj)); // [["a", 1], ["b", 2], ["c", 3]]

// Object.assign() - Copy properties
const copy = Object.assign({}, obj);

// Object.freeze() - Make immutable
Object.freeze(obj);

// Object.seal() - Prevent adding/removing properties
Object.seal(obj);

// Check property existence
console.log('a' in obj); // true
console.log(obj.hasOwnProperty('a')); // true
```

### Traversing Object Properties

```javascript
const person = {
  name: 'John',
  age: 30,
  city: 'New York',
};

// for...in loop
for (const key in person) {
  if (person.hasOwnProperty(key)) {
    console.log(`${key}: ${person[key]}`);
  }
}

// Object.keys() with forEach
Object.keys(person).forEach((key) => {
  console.log(`${key}: ${person[key]}`);
});

// Object.entries() with for...of
for (const [key, value] of Object.entries(person)) {
  console.log(`${key}: ${value}`);
}
```

### Deleting Properties

```javascript
const person = { name: 'John', age: 30, temp: 'delete me' };

// Delete operator
delete person.temp;

// Using destructuring (creates new object)
const { temp, ...cleanPerson } = person;

// Object.assign() with undefined
const cleaned = Object.assign({}, person, { temp: undefined });

console.log(person); // { name: "John", age: 30 }
```

---

## Best Practices

### 1. Use Meaningful Names

```javascript
// Bad
const u = { n: 'John', a: 30 };

// Good
const user = { name: 'John', age: 30 };
```

### 2. Prefer Composition over Inheritance

```javascript
// Instead of deep inheritance hierarchies, use composition
const withLogging = (obj) => ({
  ...obj,
  log(message) {
    console.log(`[${this.constructor.name}]: ${message}`);
  },
});
```

### 3. Use Object.freeze() for Immutable Objects

```javascript
const config = Object.freeze({
  API_URL: 'https://api.example.com',
  VERSION: '1.0.0',
});
```

### 4. Validate Constructor Parameters

```javascript
class Person {
  constructor(name, age) {
    if (!name || typeof name !== 'string') {
      throw new Error('Name must be a non-empty string');
    }
    if (!age || age < 0) {
      throw new Error('Age must be a positive number');
    }

    this.name = name;
    this.age = age;
  }
}
```

### 5. Use Getters/Setters for Computed Properties

```javascript
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  get area() {
    return this.width * this.height;
  }

  get perimeter() {
    return 2 * (this.width + this.height);
  }
}
```

### 6. Implement toString() and valueOf() Methods

```javascript
class Money {
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }

  toString() {
    return `${this.amount} ${this.currency}`;
  }

  valueOf() {
    return this.amount;
  }
}

const price = new Money(100, 'USD');
console.log(String(price)); // "100 USD"
console.log(Number(price)); // 100
```

---

## Summary

JavaScript objects are powerful constructs that enable:

- **Data organization** through properties and methods
- **Code reuse** through prototypes and inheritance
- **Encapsulation** through private fields and methods
- **Polymorphism** through method overriding
- **Composition** for flexible code architecture

Understanding objects is crucial for writing maintainable, scalable JavaScript applications. Choose the right pattern (inheritance vs composition) based on your specific use case, and always prioritize code clarity and maintainability.
