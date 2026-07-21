---
id: design-pattern-structural-decorator
title: Decorator Pattern 🎨
slug: /design-pattern/structural/decorator
sidebar_label: Decorator Pattern 🎨
---

# Decorator Pattern 🎨

> **Definition**: The Decorator pattern allows behavior to be added to objects dynamically without altering their structure. It provides a flexible alternative to subclassing for extending functionality.

## 🎯 Intent

Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.

## 🤔 Problem

You want to add new functionality to objects without modifying their original class or creating numerous subclasses. For example, adding different features to a text editor (bold, italic, underline) or adding toppings to a pizza.

Creating subclasses for every combination would lead to class explosion:

- `BoldText`, `ItalicText`, `BoldItalicText`, `UnderlineBoldItalicText`, etc.

## 💡 Solution

The Decorator pattern suggests wrapping objects in decorator objects that contain additional behavior. Decorators implement the same interface as the wrapped object, so they can be stacked on top of each other.

## 🏗️ Structure

```
Component (interface)
└── operation()

ConcreteComponent implements Component
└── operation()

Decorator implements Component
├── component: Component
└── operation() → component.operation()

ConcreteDecoratorA extends Decorator
└── operation() → super.operation() + addedBehavior()

ConcreteDecoratorB extends Decorator
└── operation() → super.operation() + addedBehavior()
```

## 💻 Simple Example

### Coffee Shop

```javascript
// Component interface
class Coffee {
  getDescription() {
    throw new Error('getDescription() method must be implemented');
  }

  getCost() {
    throw new Error('getCost() method must be implemented');
  }
}

// Concrete Component - Basic coffee
class SimpleCoffee extends Coffee {
  getDescription() {
    return 'Simple Coffee';
  }

  getCost() {
    return 2.0;
  }
}

// Base Decorator
class CoffeeDecorator extends Coffee {
  constructor(coffee) {
    super();
    this.coffee = coffee;
  }

  getDescription() {
    return this.coffee.getDescription();
  }

  getCost() {
    return this.coffee.getCost();
  }
}

// Concrete Decorators
class MilkDecorator extends CoffeeDecorator {
  constructor(coffee) {
    super(coffee);
  }

  getDescription() {
    return this.coffee.getDescription() + ', Milk';
  }

  getCost() {
    return this.coffee.getCost() + 0.5;
  }
}

class SugarDecorator extends CoffeeDecorator {
  constructor(coffee) {
    super(coffee);
  }

  getDescription() {
    return this.coffee.getDescription() + ', Sugar';
  }

  getCost() {
    return this.coffee.getCost() + 0.25;
  }
}

class ChocolateDecorator extends CoffeeDecorator {
  constructor(coffee) {
    super(coffee);
  }

  getDescription() {
    return this.coffee.getDescription() + ', Chocolate';
  }

  getCost() {
    return this.coffee.getCost() + 0.75;
  }
}

class WhipCreamDecorator extends CoffeeDecorator {
  constructor(coffee) {
    super(coffee);
  }

  getDescription() {
    return this.coffee.getDescription() + ', Whip Cream';
  }

  getCost() {
    return this.coffee.getCost() + 0.6;
  }
}

// Usage
console.log('=== Coffee Shop Decorator Demo ===\n');

// Start with simple coffee
let coffee = new SimpleCoffee();
console.log(`☕ ${coffee.getDescription()} - $${coffee.getCost().toFixed(2)}`);

// Add milk
coffee = new MilkDecorator(coffee);
console.log(`☕ ${coffee.getDescription()} - $${coffee.getCost().toFixed(2)}`);

// Add sugar
coffee = new SugarDecorator(coffee);
console.log(`☕ ${coffee.getDescription()} - $${coffee.getCost().toFixed(2)}`);

// Add chocolate
coffee = new ChocolateDecorator(coffee);
console.log(`☕ ${coffee.getDescription()} - $${coffee.getCost().toFixed(2)}`);

// Add whip cream
coffee = new WhipCreamDecorator(coffee);
console.log(`☕ ${coffee.getDescription()} - $${coffee.getCost().toFixed(2)}`);

console.log('\n' + '='.repeat(40) + '\n');

// Create different coffee combination
console.log('Creating another coffee:');
console.log('-'.repeat(22));

let mocha = new SimpleCoffee();
mocha = new ChocolateDecorator(mocha);
mocha = new MilkDecorator(mocha);
mocha = new WhipCreamDecorator(mocha);

console.log(`☕ ${mocha.getDescription()} - $${mocha.getCost().toFixed(2)}`);
```

## 🌟 Real-World Example

### Text Formatter

```javascript
// Component interface
class Text {
  constructor(content) {
    this.content = content;
  }

  render() {
    throw new Error('render() method must be implemented');
  }
}

// Concrete Component - Plain text
class PlainText extends Text {
  render() {
    return this.content;
  }
}

// Base Decorator
class TextDecorator extends Text {
  constructor(text) {
    super(text.content);
    this.text = text;
  }

  render() {
    return this.text.render();
  }
}

// Concrete Decorators
class BoldDecorator extends TextDecorator {
  render() {
    return `<b>${this.text.render()}</b>`;
  }
}

class ItalicDecorator extends TextDecorator {
  render() {
    return `<i>${this.text.render()}</i>`;
  }
}

class UnderlineDecorator extends TextDecorator {
  render() {
    return `<u>${this.text.render()}</u>`;
  }
}

class ColorDecorator extends TextDecorator {
  constructor(text, color) {
    super(text);
    this.color = color;
  }

  render() {
    return `<span style="color:${this.color}">${this.text.render()}</span>`;
  }
}

class SizeDecorator extends TextDecorator {
  constructor(text, size) {
    super(text);
    this.size = size;
  }

  render() {
    return `<span style="font-size:${this.size}px">${this.text.render()}</span>`;
  }
}

// Usage
console.log('=== Text Formatter Demo ===\n');

// Start with plain text
let text = new PlainText('Hello World!');
console.log('Plain text:', text.render());

// Make it bold
text = new BoldDecorator(text);
console.log('Bold text:', text.render());

// Add italic
text = new ItalicDecorator(text);
console.log('Bold + Italic:', text.render());

// Add underline
text = new UnderlineDecorator(text);
console.log('Bold + Italic + Underline:', text.render());

// Add color
text = new ColorDecorator(text, 'red');
console.log('With red color:', text.render());

// Add size
text = new SizeDecorator(text, 20);
console.log('Final formatted text:', text.render());

console.log('\n' + '='.repeat(50) + '\n');

// Create different formatting
console.log('Different formatting examples:');
console.log('-'.repeat(30));

let title = new PlainText('Welcome to Our Website');
title = new BoldDecorator(title);
title = new SizeDecorator(title, 24);
title = new ColorDecorator(title, 'blue');
console.log('Title:', title.render());

let emphasis = new PlainText('Important Note');
emphasis = new ItalicDecorator(emphasis);
emphasis = new ColorDecorator(emphasis, 'orange');
console.log('Emphasis:', emphasis.render());
```

## 🔧 Another Simple Example

### Data Source with Encryption and Compression

```javascript
// Component interface
class DataSource {
  writeData(data) {
    throw new Error('writeData() method must be implemented');
  }

  readData() {
    throw new Error('readData() method must be implemented');
  }
}

// Concrete Component - File data source
class FileDataSource extends DataSource {
  constructor(filename) {
    super();
    this.filename = filename;
    this.data = null;
  }

  writeData(data) {
    console.log(`💾 Writing data to file: ${this.filename}`);
    this.data = data;
    console.log(`📝 File content: "${data}"`);
  }

  readData() {
    console.log(`📖 Reading data from file: ${this.filename}`);
    return this.data || 'No data found';
  }
}

// Base Decorator
class DataSourceDecorator extends DataSource {
  constructor(dataSource) {
    super();
    this.dataSource = dataSource;
  }

  writeData(data) {
    this.dataSource.writeData(data);
  }

  readData() {
    return this.dataSource.readData();
  }
}

// Concrete Decorators
class EncryptionDecorator extends DataSourceDecorator {
  writeData(data) {
    console.log('🔒 Encrypting data...');
    const encryptedData = this.encrypt(data);
    console.log(`🔐 Encrypted: "${encryptedData}"`);
    super.writeData(encryptedData);
  }

  readData() {
    const encryptedData = super.readData();
    console.log('🔓 Decrypting data...');
    const decryptedData = this.decrypt(encryptedData);
    console.log(`🔓 Decrypted: "${decryptedData}"`);
    return decryptedData;
  }

  encrypt(data) {
    // Simple encryption simulation
    return btoa(data); // Base64 encoding
  }

  decrypt(data) {
    // Simple decryption simulation
    try {
      return atob(data); // Base64 decoding
    } catch (e) {
      return data; // Return as-is if not encrypted
    }
  }
}

class CompressionDecorator extends DataSourceDecorator {
  writeData(data) {
    console.log('🗜️ Compressing data...');
    const compressedData = this.compress(data);
    console.log(`📦 Compressed: "${compressedData}"`);
    super.writeData(compressedData);
  }

  readData() {
    const compressedData = super.readData();
    console.log('📤 Decompressing data...');
    const decompressedData = this.decompress(compressedData);
    console.log(`📂 Decompressed: "${decompressedData}"`);
    return decompressedData;
  }

  compress(data) {
    // Simple compression simulation
    return `COMPRESSED[${data}]`;
  }

  decompress(data) {
    // Simple decompression simulation
    if (data.startsWith('COMPRESSED[') && data.endsWith(']')) {
      return data.slice(11, -1);
    }
    return data;
  }
}

class LoggingDecorator extends DataSourceDecorator {
  writeData(data) {
    console.log(`📊 LOG: Writing data (${data.length} characters)`);
    console.log(`📊 LOG: Timestamp: ${new Date().toISOString()}`);
    super.writeData(data);
    console.log(`📊 LOG: Write operation completed`);
  }

  readData() {
    console.log(`📊 LOG: Reading data at ${new Date().toISOString()}`);
    const result = super.readData();
    console.log(`📊 LOG: Read ${result.length} characters`);
    return result;
  }
}

// Usage
console.log('=== Data Source Decorator Demo ===\n');

const originalData = 'This is sensitive information that needs to be stored securely.';

console.log('1. Basic file operations:');
console.log('-'.repeat(25));

// Basic file data source
let dataSource = new FileDataSource('document.txt');
dataSource.writeData(originalData);
console.log(`Read result: "${dataSource.readData()}"`);

console.log('\n2. With encryption:');
console.log('-'.repeat(18));

// Add encryption
dataSource = new FileDataSource('encrypted.txt');
dataSource = new EncryptionDecorator(dataSource);
dataSource.writeData(originalData);
console.log(`Read result: "${dataSource.readData()}"`);

console.log('\n3. With compression and encryption:');
console.log('-'.repeat(33));

// Add both compression and encryption
dataSource = new FileDataSource('compressed_encrypted.txt');
dataSource = new CompressionDecorator(dataSource);
dataSource = new EncryptionDecorator(dataSource);
dataSource.writeData(originalData);
console.log(`Read result: "${dataSource.readData()}"`);

console.log('\n4. With all decorators:');
console.log('-'.repeat(22));

// Add all decorators
dataSource = new FileDataSource('full_featured.txt');
dataSource = new CompressionDecorator(dataSource);
dataSource = new EncryptionDecorator(dataSource);
dataSource = new LoggingDecorator(dataSource);
dataSource.writeData(originalData);
console.log(`Read result: "${dataSource.readData()}"`);
```

## ✅ Pros

- **Flexible Extension**: Add behavior at runtime without modifying existing code
- **Single Responsibility**: Each decorator has a single purpose
- **Composition over Inheritance**: More flexible than creating subclasses
- **Open/Closed Principle**: Open for extension, closed for modification
- **Mix and Match**: Can combine decorators in different ways

## ❌ Cons

- **Complexity**: Can create many small objects and complex object hierarchies
- **Identity Issues**: Decorated objects are different from original objects
- **Configuration Complexity**: Many decorators can make configuration complex
- **Debugging**: Stack of decorators can be hard to debug

## 🎯 When to Use

- **Runtime Extension**: When you want to add behavior to objects at runtime
- **Multiple Combinations**: When you have many optional features that can be combined
- **Avoiding Class Explosion**: When subclassing would create too many classes
- **Legacy Code**: When you can't modify existing classes but need to extend them

## 🔄 Implementation Variants

### 1. **Function-based Decorators (JavaScript specific)**

```javascript
function withLogging(fn) {
  return function (...args) {
    console.log(`Calling ${fn.name} with:`, args);
    return fn.apply(this, args);
  };
}

// Usage
const loggedFunction = withLogging(originalFunction);
```

### 2. **Mixin-based Decorators**

```javascript
const Loggable = {
  log(message) {
    console.log(`[${this.constructor.name}] ${message}`);
  },
};

Object.assign(MyClass.prototype, Loggable);
```

## 🔗 Related Patterns

- **Adapter**: Both wrap objects, but Adapter changes interface while Decorator adds behavior
- **Composite**: Both create tree structures, but Composite represents hierarchies while Decorator adds layers
- **Strategy**: Both provide alternatives, but Strategy changes algorithms while Decorator adds features
- **Proxy**: Both provide surrogate objects, but Proxy controls access while Decorator adds behavior

## 📚 Further Reading

- [Decorator Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/decorator)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [JavaScript Decorator Pattern Examples](https://www.dofactory.com/javascript/design-patterns/decorator)
