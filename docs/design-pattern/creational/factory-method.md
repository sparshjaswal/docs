---
id: design-pattern-creational-factory-method
title: "Factory Method Pattern 🏭"
slug: /design-pattern/creational/factory-method
sidebar_label: "Factory Method Pattern 🏭"
---

# Factory Method Pattern 🏭

> **Definition**: The Factory Method pattern defines an interface for creating an object, but lets subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.

## 🎯 Intent

Create objects without specifying the exact class of object that will be created. Provide an interface for creating families of related or dependent objects.

## 🤔 Problem

Imagine you're developing a logistics management application. Initially, your app only handles transportation by trucks, so most of your code lives inside the `Truck` class.

After a while, your app becomes popular among sea transportation companies. They want to incorporate ships into the app. Great news, right? But what about the code? Most of your code is coupled to the `Truck` class. Adding `Ships` would require making changes to the entire codebase.

Moreover, if later you decide to add another type of transport to the app, you'll probably need to make all these changes again.

## 💡 Solution

The Factory Method pattern suggests replacing direct object construction calls (using the `new` operator) with calls to a special factory method. The objects returned by a factory method are often referred to as "products."

At first glance, this change may look pointless: we just moved the constructor call from one part of the program to another. However, consider this: now you can override the factory method in a subclass and change the class of products being created by the method.

## 🏗️ Structure

```
Creator (abstract)
├── factoryMethod(): Product (abstract)
├── someOperation()
└── anOperation()

ConcreteCreatorA extends Creator
└── factoryMethod(): ConcreteProductA

ConcreteCreatorB extends Creator
└── factoryMethod(): ConcreteProductB

Product (interface)
└── operation()

ConcreteProductA implements Product
└── operation()

ConcreteProductB implements Product
└── operation()
```

## 💻 Code Example

### Basic Implementation

```javascript
// Product interface
class Transport {
  deliver() {
    throw new Error('deliver() method must be implemented');
  }
}

// Concrete Products
class Truck extends Transport {
  deliver() {
    return '🚚 Delivery by land in a truck';
  }
}

class Ship extends Transport {
  deliver() {
    return '🚢 Delivery by sea in a ship';
  }
}

class Plane extends Transport {
  deliver() {
    return '✈️ Delivery by air in a plane';
  }
}

// Creator (abstract)
class Logistics {
  // Factory method - to be implemented by subclasses
  createTransport() {
    throw new Error('createTransport() method must be implemented');
  }

  // Business logic that uses the factory method
  planDelivery() {
    const transport = this.createTransport();
    const result = transport.deliver();
    console.log(`Planning delivery: ${result}`);
    return result;
  }
}

// Concrete Creators
class RoadLogistics extends Logistics {
  createTransport() {
    return new Truck();
  }
}

class SeaLogistics extends Logistics {
  createTransport() {
    return new Ship();
  }
}

class AirLogistics extends Logistics {
  createTransport() {
    return new Plane();
  }
}

// Usage
function demonstrateFactoryMethod() {
  console.log('=== Factory Method Pattern Demo ===\n');

  const logistics = [new RoadLogistics(), new SeaLogistics(), new AirLogistics()];

  logistics.forEach((logistic) => {
    logistic.planDelivery();
  });
}

demonstrateFactoryMethod();
```

## 🌟 Real-World Examples

### 1. UI Component Factory

```javascript
// Product interface
class Button {
  render() {
    throw new Error('render() method must be implemented');
  }

  onClick() {
    throw new Error('onClick() method must be implemented');
  }
}

// Concrete Products
class WindowsButton extends Button {
  render() {
    console.log('🖼️ Rendering Windows-style button');
    return "<button class='windows-btn'>Click me</button>";
  }

  onClick() {
    console.log('💻 Windows button clicked - opening native dialog');
  }
}

class MacButton extends Button {
  render() {
    console.log('🍎 Rendering Mac-style button');
    return "<button class='mac-btn'>Click me</button>";
  }

  onClick() {
    console.log('🖱️ Mac button clicked - showing Mac-style popup');
  }
}

class LinuxButton extends Button {
  render() {
    console.log('🐧 Rendering Linux-style button');
    return "<button class='linux-btn'>Click me</button>";
  }

  onClick() {
    console.log('⌨️ Linux button clicked - launching terminal command');
  }
}

// Creator classes
class Dialog {
  createButton() {
    throw new Error('createButton() method must be implemented');
  }

  render() {
    const button = this.createButton();
    console.log('🎨 Rendering dialog:');
    const html = `
      <div class="dialog">
        <h2>Confirmation</h2>
        <p>Do you want to proceed?</p>
        ${button.render()}
      </div>
    `;
    console.log(html);
    return button;
  }
}

class WindowsDialog extends Dialog {
  createButton() {
    return new WindowsButton();
  }
}

class MacDialog extends Dialog {
  createButton() {
    return new MacButton();
  }
}

class LinuxDialog extends Dialog {
  createButton() {
    return new LinuxButton();
  }
}

// Client code
class Application {
  constructor() {
    this.dialog = null;
  }

  initialize() {
    const os = this.detectOS();

    if (os === 'Windows') {
      this.dialog = new WindowsDialog();
    } else if (os === 'Mac') {
      this.dialog = new MacDialog();
    } else {
      this.dialog = new LinuxDialog();
    }
  }

  detectOS() {
    // Simulate OS detection
    const osTypes = ['Windows', 'Mac', 'Linux'];
    return osTypes[Math.floor(Math.random() * osTypes.length)];
  }

  run() {
    this.initialize();
    const button = this.dialog.render();

    // Simulate user interaction
    setTimeout(() => {
      console.log('\n👆 User clicked the button:');
      button.onClick();
    }, 1000);
  }
}

// Usage
const app = new Application();
app.run();
```

### 2. Database Connection Factory

```javascript
// Product interface
class DatabaseConnection {
  connect() {
    throw new Error('connect() method must be implemented');
  }

  query(sql) {
    throw new Error('query() method must be implemented');
  }

  close() {
    throw new Error('close() method must be implemented');
  }
}

// Concrete Products
class MySQLConnection extends DatabaseConnection {
  constructor(config) {
    super();
    this.config = config;
    this.connected = false;
  }

  connect() {
    console.log(`🐬 Connecting to MySQL: ${this.config.host}:${this.config.port}`);
    this.connected = true;
    return 'MySQL connection established';
  }

  query(sql) {
    if (!this.connected) throw new Error('Not connected to MySQL');
    console.log(`📊 Executing MySQL query: ${sql}`);
    return `MySQL result for: ${sql}`;
  }

  close() {
    this.connected = false;
    console.log('🐬 MySQL connection closed');
  }
}

class PostgreSQLConnection extends DatabaseConnection {
  constructor(config) {
    super();
    this.config = config;
    this.connected = false;
  }

  connect() {
    console.log(`🐘 Connecting to PostgreSQL: ${this.config.host}:${this.config.port}`);
    this.connected = true;
    return 'PostgreSQL connection established';
  }

  query(sql) {
    if (!this.connected) throw new Error('Not connected to PostgreSQL');
    console.log(`📊 Executing PostgreSQL query: ${sql}`);
    return `PostgreSQL result for: ${sql}`;
  }

  close() {
    this.connected = false;
    console.log('🐘 PostgreSQL connection closed');
  }
}

class MongoDBConnection extends DatabaseConnection {
  constructor(config) {
    super();
    this.config = config;
    this.connected = false;
  }

  connect() {
    console.log(`🍃 Connecting to MongoDB: ${this.config.host}:${this.config.port}`);
    this.connected = true;
    return 'MongoDB connection established';
  }

  query(query) {
    if (!this.connected) throw new Error('Not connected to MongoDB');
    console.log(`📊 Executing MongoDB query: ${JSON.stringify(query)}`);
    return `MongoDB result for: ${JSON.stringify(query)}`;
  }

  close() {
    this.connected = false;
    console.log('🍃 MongoDB connection closed');
  }
}

// Creator classes
class DatabaseConnectionFactory {
  constructor(config) {
    this.config = config;
  }

  createConnection() {
    throw new Error('createConnection() method must be implemented');
  }

  // Template method that uses factory method
  establishConnection() {
    const connection = this.createConnection();
    try {
      const result = connection.connect();
      console.log(`✅ ${result}`);
      return connection;
    } catch (error) {
      console.error(`❌ Connection failed: ${error.message}`);
      throw error;
    }
  }
}

class MySQLConnectionFactory extends DatabaseConnectionFactory {
  createConnection() {
    return new MySQLConnection({
      ...this.config,
      port: this.config.port || 3306,
    });
  }
}

class PostgreSQLConnectionFactory extends DatabaseConnectionFactory {
  createConnection() {
    return new PostgreSQLConnection({
      ...this.config,
      port: this.config.port || 5432,
    });
  }
}

class MongoDBConnectionFactory extends DatabaseConnectionFactory {
  createConnection() {
    return new MongoDBConnection({
      ...this.config,
      port: this.config.port || 27017,
    });
  }
}

// Database Manager (Client)
class DatabaseManager {
  constructor(dbType, config) {
    this.factory = this.createFactory(dbType, config);
    this.connection = null;
  }

  createFactory(dbType, config) {
    switch (dbType.toLowerCase()) {
      case 'mysql':
        return new MySQLConnectionFactory(config);
      case 'postgresql':
        return new PostgreSQLConnectionFactory(config);
      case 'mongodb':
        return new MongoDBConnectionFactory(config);
      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }
  }

  connect() {
    this.connection = this.factory.establishConnection();
    return this.connection;
  }

  executeQuery(query) {
    if (!this.connection) {
      throw new Error('No database connection');
    }
    return this.connection.query(query);
  }

  disconnect() {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
  }
}

// Usage
const config = {
  host: 'localhost',
  username: 'admin',
  password: 'password',
  database: 'myapp',
};

const databases = ['mysql', 'postgresql', 'mongodb'];

databases.forEach((dbType) => {
  console.log(`\n=== Testing ${dbType.toUpperCase()} ===`);

  const dbManager = new DatabaseManager(dbType, config);

  try {
    dbManager.connect();

    // Execute different types of queries based on database type
    if (dbType === 'mongodb') {
      dbManager.executeQuery({ find: 'users', filter: { active: true } });
    } else {
      dbManager.executeQuery('SELECT * FROM users WHERE active = true');
    }

    dbManager.disconnect();
  } catch (error) {
    console.error(`Error with ${dbType}:`, error.message);
  }
});
```

### 3. Document Parser Factory

```javascript
// Product interface
class DocumentParser {
  parse(content) {
    throw new Error('parse() method must be implemented');
  }

  getMetadata() {
    throw new Error('getMetadata() method must be implemented');
  }
}

// Concrete Products
class PDFParser extends DocumentParser {
  constructor() {
    super();
    this.metadata = {};
  }

  parse(content) {
    console.log('📄 Parsing PDF document...');
    // Simulate PDF parsing
    this.metadata = {
      type: 'PDF',
      pages: Math.floor(Math.random() * 100) + 1,
      author: 'Unknown Author',
      createdDate: new Date().toISOString(),
    };

    const text = content.replace(/%PDF-[\d.]+/g, '').trim();
    console.log(`✅ PDF parsed: ${this.metadata.pages} pages`);
    return text;
  }

  getMetadata() {
    return this.metadata;
  }
}

class WordParser extends DocumentParser {
  constructor() {
    super();
    this.metadata = {};
  }

  parse(content) {
    console.log('📝 Parsing Word document...');
    // Simulate Word parsing
    this.metadata = {
      type: 'DOCX',
      wordCount: content.split(/\s+/).length,
      lastModified: new Date().toISOString(),
      hasImages: Math.random() > 0.5,
    };

    const text = content.replace(/[^\w\s]/gi, '').trim();
    console.log(`✅ Word document parsed: ${this.metadata.wordCount} words`);
    return text;
  }

  getMetadata() {
    return this.metadata;
  }
}

class ExcelParser extends DocumentParser {
  constructor() {
    super();
    this.metadata = {};
  }

  parse(content) {
    console.log('📊 Parsing Excel document...');
    // Simulate Excel parsing
    const rows = content.split('\n').length;
    const columns = content.split(',').length / rows;

    this.metadata = {
      type: 'XLSX',
      sheets: Math.floor(Math.random() * 5) + 1,
      rows: rows,
      columns: Math.floor(columns),
      hasFormulas: Math.random() > 0.3,
    };

    console.log(`✅ Excel parsed: ${this.metadata.sheets} sheets, ${rows} rows`);
    return content; // Return structured data
  }

  getMetadata() {
    return this.metadata;
  }
}

// Creator classes
class DocumentParserFactory {
  createParser() {
    throw new Error('createParser() method must be implemented');
  }

  // Template method
  parseDocument(filePath, content) {
    console.log(`\n📂 Processing: ${filePath}`);
    const parser = this.createParser();

    try {
      const parsedContent = parser.parse(content);
      const metadata = parser.getMetadata();

      return {
        success: true,
        content: parsedContent,
        metadata: metadata,
        filePath: filePath,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        filePath: filePath,
      };
    }
  }
}

class PDFParserFactory extends DocumentParserFactory {
  createParser() {
    return new PDFParser();
  }
}

class WordParserFactory extends DocumentParserFactory {
  createParser() {
    return new WordParser();
  }
}

class ExcelParserFactory extends DocumentParserFactory {
  createParser() {
    return new ExcelParser();
  }
}

// Document processor (Client)
class DocumentProcessor {
  constructor() {
    this.factories = new Map([
      ['.pdf', new PDFParserFactory()],
      ['.docx', new WordParserFactory()],
      ['.doc', new WordParserFactory()],
      ['.xlsx', new ExcelParserFactory()],
      ['.xls', new ExcelParserFactory()],
    ]);
  }

  processDocument(filePath, content) {
    const extension = this.getFileExtension(filePath);
    const factory = this.factories.get(extension);

    if (!factory) {
      throw new Error(`Unsupported file type: ${extension}`);
    }

    return factory.parseDocument(filePath, content);
  }

  getFileExtension(filePath) {
    return filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
  }

  addParserFactory(extension, factory) {
    this.factories.set(extension, factory);
  }
}

// Usage
const processor = new DocumentProcessor();

const testDocuments = [
  {
    path: 'report.pdf',
    content: '%PDF-1.4 This is a sample PDF content with multiple paragraphs and data.',
  },
  {
    path: 'proposal.docx',
    content: 'This is a Word document with formatted text, headings, and various content elements.',
  },
  {
    path: 'data.xlsx',
    content: 'Name,Age,City\nJohn,25,New York\nJane,30,Los Angeles\nBob,35,Chicago',
  },
];

testDocuments.forEach((doc) => {
  try {
    const result = processor.processDocument(doc.path, doc.content);

    if (result.success) {
      console.log(`📋 Metadata:`, JSON.stringify(result.metadata, null, 2));
    } else {
      console.error(`❌ Processing failed: ${result.error}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${doc.path}:`, error.message);
  }
});
```

## ✅ Pros

- **Loose Coupling**: Eliminates the need to bind application-specific classes into the code
- **Open/Closed Principle**: You can add new types of products without breaking existing client code
- **Single Responsibility**: Product creation is moved to one place, making code easier to support
- **Flexibility**: Subclasses can choose which class to instantiate at runtime

## ❌ Cons

- **Code Complexity**: Can make code more complicated since you need to introduce many new subclasses
- **Parallel Class Hierarchies**: You need to create a Creator subclass for each Product subclass
- **Abstraction Overhead**: Adds an additional level of abstraction

## 🎯 When to Use

- **Unknown Dependencies**: When you don't know beforehand the exact types and dependencies of objects your code should work with
- **Framework Extension**: When you want to provide users of your library or framework with a way to extend its internal components
- **Resource Management**: When you want to save system resources by reusing existing objects instead of rebuilding them
- **Family of Products**: When you need to create families of related products

## 🔄 Variations

### 1. **Parameterized Factory Method**

```javascript
class ParameterizedCreator {
  createProduct(type) {
    switch (type) {
      case 'A':
        return new ProductA();
      case 'B':
        return new ProductB();
      default:
        throw new Error(`Unknown product type: ${type}`);
    }
  }
}
```

### 2. **Registry-based Factory**

```javascript
class RegistryFactory {
  constructor() {
    this.productRegistry = new Map();
  }

  registerProduct(type, productClass) {
    this.productRegistry.set(type, productClass);
  }

  createProduct(type) {
    const ProductClass = this.productRegistry.get(type);
    if (!ProductClass) {
      throw new Error(`Product type ${type} not registered`);
    }
    return new ProductClass();
  }
}
```

### 3. **Async Factory Method**

```javascript
class AsyncCreator {
  async createProduct() {
    const config = await this.loadConfiguration();
    return new Product(config);
  }

  async loadConfiguration() {
    // Load configuration from external source
  }
}
```

## 🔗 Related Patterns

- **Abstract Factory**: Factory Method is often used to implement Abstract Factory
- **Template Method**: Factory Methods are often called within Template Methods
- **Prototype**: Can be an alternative to Factory Method
- **Builder**: Can use Factory Method to create components

## 📚 Further Reading

- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [Factory Method Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/factory-method)
- [JavaScript Factory Pattern](https://www.dofactory.com/javascript/design-patterns/factory-method)
