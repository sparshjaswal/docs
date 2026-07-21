---
id: design-pattern-creational-abstract-factory
title: Abstract Factory Pattern 🏭🔧
slug: /design-pattern/creational/abstract-factory
sidebar_label: Abstract Factory Pattern 🏭🔧
---

# Abstract Factory Pattern 🏭🔧

> **Definition**: The Abstract Factory pattern provides an interface for creating families of related or dependent objects without specifying their concrete classes.

## 🎯 Intent

Create families of related objects without having to depend upon their concrete classes. Ensure that products from one family are used together and are compatible with each other.

## 🤔 Problem

Imagine you're developing a cross-platform UI library. Your application needs to create UI elements like buttons, checkboxes, and text inputs that should look and behave consistently within each platform (Windows, Mac, Linux) but differently across platforms.

If you use Factory Method for each UI element, you'll end up with code like this:

```javascript
const windowsButton = new WindowsButtonFactory().createButton();
const macCheckbox = new MacCheckboxFactory().createCheckbox(); // Inconsistent!
```

This approach can lead to incompatible UI elements being mixed together, creating visual inconsistencies.

## 💡 Solution

The Abstract Factory pattern suggests explicitly declaring interfaces for each distinct product of the product family. Then you can make all variants of products follow those interfaces.

The next move is to declare the Abstract Factory - an interface with a list of creation methods for all products that are part of the product family. These methods must return abstract product types represented by the interfaces we extracted previously.

## 🏗️ Structure

```
AbstractFactory (interface)
├── createProductA(): AbstractProductA
├── createProductB(): AbstractProductB
└── createProductC(): AbstractProductC

ConcreteFactory1 implements AbstractFactory
├── createProductA(): ProductA1
├── createProductB(): ProductB1
└── createProductC(): ProductC1

ConcreteFactory2 implements AbstractFactory
├── createProductA(): ProductA2
├── createProductB(): ProductB2
└── createProductC(): ProductC2

AbstractProductA (interface)
└── operationA()

ProductA1 implements AbstractProductA
└── operationA()

ProductA2 implements AbstractProductA
└── operationA()
```

## 💻 Code Example

### Basic Implementation

```javascript
// Abstract Products
class Button {
  render() {
    throw new Error('render() method must be implemented');
  }

  onClick() {
    throw new Error('onClick() method must be implemented');
  }
}

class Checkbox {
  render() {
    throw new Error('render() method must be implemented');
  }

  toggle() {
    throw new Error('toggle() method must be implemented');
  }
}

class TextInput {
  render() {
    throw new Error('render() method must be implemented');
  }

  setValue(value) {
    throw new Error('setValue() method must be implemented');
  }
}

// Concrete Products - Windows Family
class WindowsButton extends Button {
  render() {
    console.log('🖼️ Rendering Windows button with native styling');
    return `<button class="windows-btn" style="border: 2px solid #0078d4; background: #0078d4; color: white; padding: 8px 16px;">Windows Button</button>`;
  }

  onClick() {
    console.log('💻 Windows button clicked - showing native dialog');
    return 'Windows dialog opened';
  }
}

class WindowsCheckbox extends Checkbox {
  constructor() {
    super();
    this.checked = false;
  }

  render() {
    const checkedState = this.checked ? '☑️' : '☐';
    console.log(`🖼️ Rendering Windows checkbox: ${checkedState}`);
    return `<input type="checkbox" class="windows-checkbox" ${this.checked ? 'checked' : ''}> Windows Checkbox`;
  }

  toggle() {
    this.checked = !this.checked;
    console.log(`💻 Windows checkbox toggled: ${this.checked ? 'checked' : 'unchecked'}`);
    return this.checked;
  }
}

class WindowsTextInput extends TextInput {
  constructor() {
    super();
    this.value = '';
  }

  render() {
    console.log('🖼️ Rendering Windows text input with native styling');
    return `<input type="text" class="windows-input" style="border: 1px solid #ccc; padding: 8px;" value="${this.value}">`;
  }

  setValue(value) {
    this.value = value;
    console.log(`💻 Windows input value set: "${value}"`);
    return this.value;
  }
}

// Concrete Products - Mac Family
class MacButton extends Button {
  render() {
    console.log('🍎 Rendering Mac button with native styling');
    return `<button class="mac-btn" style="border: 1px solid #007aff; background: #007aff; color: white; border-radius: 6px; padding: 8px 16px;">Mac Button</button>`;
  }

  onClick() {
    console.log('🖱️ Mac button clicked - showing Mac-style popup');
    return 'Mac popup displayed';
  }
}

class MacCheckbox extends Checkbox {
  constructor() {
    super();
    this.checked = false;
  }

  render() {
    const checkedState = this.checked ? '✅' : '🔲';
    console.log(`🍎 Rendering Mac checkbox: ${checkedState}`);
    return `<input type="checkbox" class="mac-checkbox" style="border-radius: 4px;" ${this.checked ? 'checked' : ''}> Mac Checkbox`;
  }

  toggle() {
    this.checked = !this.checked;
    console.log(`🖱️ Mac checkbox toggled: ${this.checked ? 'checked' : 'unchecked'}`);
    return this.checked;
  }
}

class MacTextInput extends TextInput {
  constructor() {
    super();
    this.value = '';
  }

  render() {
    console.log('🍎 Rendering Mac text input with native styling');
    return `<input type="text" class="mac-input" style="border: 1px solid #d1d1d6; border-radius: 6px; padding: 8px;" value="${this.value}">`;
  }

  setValue(value) {
    this.value = value;
    console.log(`🖱️ Mac input value set: "${value}"`);
    return this.value;
  }
}

// Concrete Products - Linux Family
class LinuxButton extends Button {
  render() {
    console.log('🐧 Rendering Linux button with native styling');
    return `<button class="linux-btn" style="border: 1px solid #666; background: #f0f0f0; color: black; padding: 8px 16px;">Linux Button</button>`;
  }

  onClick() {
    console.log('⌨️ Linux button clicked - executing command');
    return 'Linux command executed';
  }
}

class LinuxCheckbox extends Checkbox {
  constructor() {
    super();
    this.checked = false;
  }

  render() {
    const checkedState = this.checked ? '[x]' : '[ ]';
    console.log(`🐧 Rendering Linux checkbox: ${checkedState}`);
    return `<input type="checkbox" class="linux-checkbox" ${this.checked ? 'checked' : ''}> Linux Checkbox`;
  }

  toggle() {
    this.checked = !this.checked;
    console.log(`⌨️ Linux checkbox toggled: ${this.checked ? 'checked' : 'unchecked'}`);
    return this.checked;
  }
}

class LinuxTextInput extends TextInput {
  constructor() {
    super();
    this.value = '';
  }

  render() {
    console.log('🐧 Rendering Linux text input with native styling');
    return `<input type="text" class="linux-input" style="border: 1px solid #999; padding: 8px;" value="${this.value}">`;
  }

  setValue(value) {
    this.value = value;
    console.log(`⌨️ Linux input value set: "${value}"`);
    return this.value;
  }
}

// Abstract Factory
class UIFactory {
  createButton() {
    throw new Error('createButton() method must be implemented');
  }

  createCheckbox() {
    throw new Error('createCheckbox() method must be implemented');
  }

  createTextInput() {
    throw new Error('createTextInput() method must be implemented');
  }
}

// Concrete Factories
class WindowsUIFactory extends UIFactory {
  createButton() {
    return new WindowsButton();
  }

  createCheckbox() {
    return new WindowsCheckbox();
  }

  createTextInput() {
    return new WindowsTextInput();
  }
}

class MacUIFactory extends UIFactory {
  createButton() {
    return new MacButton();
  }

  createCheckbox() {
    return new MacCheckbox();
  }

  createTextInput() {
    return new MacTextInput();
  }
}

class LinuxUIFactory extends UIFactory {
  createButton() {
    return new LinuxButton();
  }

  createCheckbox() {
    return new LinuxCheckbox();
  }

  createTextInput() {
    return new LinuxTextInput();
  }
}

// Client Code
class Application {
  constructor(factory) {
    this.factory = factory;
    this.components = {};
  }

  createUI() {
    console.log('🎨 Creating UI components...\n');

    this.components.button = this.factory.createButton();
    this.components.checkbox = this.factory.createCheckbox();
    this.components.textInput = this.factory.createTextInput();

    return this.components;
  }

  renderUI() {
    console.log('🖼️ Rendering application UI:\n');

    Object.entries(this.components).forEach(([name, component]) => {
      console.log(`${name.charAt(0).toUpperCase() + name.slice(1)}:`);
      component.render();
      console.log('');
    });
  }

  simulateUserInteraction() {
    console.log('👆 Simulating user interactions:\n');

    // Button interaction
    this.components.button.onClick();

    // Checkbox interaction
    this.components.checkbox.toggle();
    this.components.checkbox.toggle();

    // Text input interaction
    this.components.textInput.setValue('Hello World!');

    console.log('');
  }
}

// Usage
function demonstrateAbstractFactory() {
  console.log('=== Abstract Factory Pattern Demo ===\n');

  const platforms = [
    { name: 'Windows', factory: new WindowsUIFactory() },
    { name: 'Mac', factory: new MacUIFactory() },
    { name: 'Linux', factory: new LinuxUIFactory() },
  ];

  platforms.forEach(({ name, factory }) => {
    console.log(`${'='.repeat(20)} ${name} Platform ${'='.repeat(20)}`);

    const app = new Application(factory);
    app.createUI();
    app.renderUI();
    app.simulateUserInteraction();

    console.log(`${'='.repeat(50 + name.length)}\n`);
  });
}

demonstrateAbstractFactory();
```

## 🌟 Real-World Examples

### 1. Database Provider Factory

```javascript
// Abstract Products
class Connection {
  connect() {
    throw new Error('Not implemented');
  }
  disconnect() {
    throw new Error('Not implemented');
  }
  isConnected() {
    throw new Error('Not implemented');
  }
}

class Command {
  constructor(connection) {
    this.connection = connection;
  }
  execute(query) {
    throw new Error('Not implemented');
  }
  executeAsync(query) {
    throw new Error('Not implemented');
  }
}

class Transaction {
  constructor(connection) {
    this.connection = connection;
  }
  begin() {
    throw new Error('Not implemented');
  }
  commit() {
    throw new Error('Not implemented');
  }
  rollback() {
    throw new Error('Not implemented');
  }
}

// MySQL Family
class MySQLConnection extends Connection {
  constructor(config) {
    super();
    this.config = config;
    this.connected = false;
  }

  connect() {
    console.log(`🐬 Connecting to MySQL: ${this.config.host}:${this.config.port || 3306}`);
    this.connected = true;
    return Promise.resolve('MySQL connected');
  }

  disconnect() {
    this.connected = false;
    console.log('🐬 MySQL connection closed');
    return Promise.resolve();
  }

  isConnected() {
    return this.connected;
  }
}

class MySQLCommand extends Command {
  execute(query) {
    if (!this.connection.isConnected()) {
      throw new Error('MySQL connection not established');
    }
    console.log(`📊 Executing MySQL query: ${query}`);
    return `MySQL result: ${query}`;
  }

  async executeAsync(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.execute(query));
      }, 100);
    });
  }
}

class MySQLTransaction extends Transaction {
  constructor(connection) {
    super(connection);
    this.active = false;
  }

  begin() {
    if (!this.connection.isConnected()) {
      throw new Error('MySQL connection not established');
    }
    this.active = true;
    console.log('🔄 MySQL transaction started');
    return Promise.resolve();
  }

  commit() {
    if (!this.active) throw new Error('No active MySQL transaction');
    this.active = false;
    console.log('✅ MySQL transaction committed');
    return Promise.resolve();
  }

  rollback() {
    if (!this.active) throw new Error('No active MySQL transaction');
    this.active = false;
    console.log('↩️ MySQL transaction rolled back');
    return Promise.resolve();
  }
}

// PostgreSQL Family
class PostgreSQLConnection extends Connection {
  constructor(config) {
    super();
    this.config = config;
    this.connected = false;
  }

  connect() {
    console.log(`🐘 Connecting to PostgreSQL: ${this.config.host}:${this.config.port || 5432}`);
    this.connected = true;
    return Promise.resolve('PostgreSQL connected');
  }

  disconnect() {
    this.connected = false;
    console.log('🐘 PostgreSQL connection closed');
    return Promise.resolve();
  }

  isConnected() {
    return this.connected;
  }
}

class PostgreSQLCommand extends Command {
  execute(query) {
    if (!this.connection.isConnected()) {
      throw new Error('PostgreSQL connection not established');
    }
    console.log(`📊 Executing PostgreSQL query: ${query}`);
    return `PostgreSQL result: ${query}`;
  }

  async executeAsync(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.execute(query));
      }, 150);
    });
  }
}

class PostgreSQLTransaction extends Transaction {
  constructor(connection) {
    super(connection);
    this.active = false;
  }

  begin() {
    if (!this.connection.isConnected()) {
      throw new Error('PostgreSQL connection not established');
    }
    this.active = true;
    console.log('🔄 PostgreSQL transaction started');
    return Promise.resolve();
  }

  commit() {
    if (!this.active) throw new Error('No active PostgreSQL transaction');
    this.active = false;
    console.log('✅ PostgreSQL transaction committed');
    return Promise.resolve();
  }

  rollback() {
    if (!this.active) throw new Error('No active PostgreSQL transaction');
    this.active = false;
    console.log('↩️ PostgreSQL transaction rolled back');
    return Promise.resolve();
  }
}

// Abstract Factory
class DatabaseFactory {
  createConnection(config) {
    throw new Error('Not implemented');
  }
  createCommand(connection) {
    throw new Error('Not implemented');
  }
  createTransaction(connection) {
    throw new Error('Not implemented');
  }
}

// Concrete Factories
class MySQLFactory extends DatabaseFactory {
  createConnection(config) {
    return new MySQLConnection(config);
  }

  createCommand(connection) {
    return new MySQLCommand(connection);
  }

  createTransaction(connection) {
    return new MySQLTransaction(connection);
  }
}

class PostgreSQLFactory extends DatabaseFactory {
  createConnection(config) {
    return new PostgreSQLConnection(config);
  }

  createCommand(connection) {
    return new PostgreSQLCommand(connection);
  }

  createTransaction(connection) {
    return new PostgreSQLTransaction(connection);
  }
}

// Database Manager (Client)
class DatabaseManager {
  constructor(factory, config) {
    this.factory = factory;
    this.config = config;
    this.connection = null;
    this.command = null;
    this.transaction = null;
  }

  async initialize() {
    this.connection = this.factory.createConnection(this.config);
    await this.connection.connect();

    this.command = this.factory.createCommand(this.connection);
    this.transaction = this.factory.createTransaction(this.connection);

    console.log('✅ Database manager initialized');
  }

  async executeQuery(query) {
    if (!this.command) throw new Error('Database not initialized');
    return await this.command.executeAsync(query);
  }

  async executeTransaction(queries) {
    if (!this.transaction) throw new Error('Database not initialized');

    try {
      await this.transaction.begin();

      const results = [];
      for (const query of queries) {
        const result = await this.executeQuery(query);
        results.push(result);
      }

      await this.transaction.commit();
      console.log('🎉 Transaction completed successfully');
      return results;
    } catch (error) {
      await this.transaction.rollback();
      console.error('❌ Transaction failed:', error.message);
      throw error;
    }
  }

  async cleanup() {
    if (this.connection && this.connection.isConnected()) {
      await this.connection.disconnect();
    }
  }
}

// Usage
async function demonstrateDatabaseFactory() {
  const config = {
    host: 'localhost',
    username: 'admin',
    password: 'password',
    database: 'testdb',
  };

  const factories = [
    { name: 'MySQL', factory: new MySQLFactory() },
    { name: 'PostgreSQL', factory: new PostgreSQLFactory() },
  ];

  for (const { name, factory } of factories) {
    console.log(`\n${'='.repeat(15)} Testing ${name} ${'='.repeat(15)}`);

    const dbManager = new DatabaseManager(factory, config);

    try {
      await dbManager.initialize();

      // Single query
      const result = await dbManager.executeQuery('SELECT * FROM users');
      console.log('📋 Query result:', result);

      // Transaction
      const transactionQueries = [
        'UPDATE users SET balance = balance - 100 WHERE id = 1',
        'UPDATE users SET balance = balance + 100 WHERE id = 2',
        'INSERT INTO transactions (from_id, to_id, amount) VALUES (1, 2, 100)',
      ];

      await dbManager.executeTransaction(transactionQueries);
    } catch (error) {
      console.error(`❌ ${name} error:`, error.message);
    } finally {
      await dbManager.cleanup();
    }
  }
}

// Run the database demo
demonstrateDatabaseFactory();
```

### 2. Theme Factory for Web Applications

```javascript
// Abstract Products
class ColorScheme {
  getPrimaryColor() {
    throw new Error('Not implemented');
  }
  getSecondaryColor() {
    throw new Error('Not implemented');
  }
  getBackgroundColor() {
    throw new Error('Not implemented');
  }
  getTextColor() {
    throw new Error('Not implemented');
  }
  getAccentColor() {
    throw new Error('Not implemented');
  }
}

class Typography {
  getHeadingFont() {
    throw new Error('Not implemented');
  }
  getBodyFont() {
    throw new Error('Not implemented');
  }
  getCodeFont() {
    throw new Error('Not implemented');
  }
  getFontSizes() {
    throw new Error('Not implemented');
  }
}

class Layout {
  getSpacing() {
    throw new Error('Not implemented');
  }
  getBorderRadius() {
    throw new Error('Not implemented');
  }
  getShadows() {
    throw new Error('Not implemented');
  }
  getBreakpoints() {
    throw new Error('Not implemented');
  }
}

// Light Theme Family
class LightColorScheme extends ColorScheme {
  getPrimaryColor() {
    return '#007bff';
  }
  getSecondaryColor() {
    return '#6c757d';
  }
  getBackgroundColor() {
    return '#ffffff';
  }
  getTextColor() {
    return '#212529';
  }
  getAccentColor() {
    return '#28a745';
  }
}

class LightTypography extends Typography {
  getHeadingFont() {
    return "'Roboto', sans-serif";
  }
  getBodyFont() {
    return "'Open Sans', sans-serif";
  }
  getCodeFont() {
    return "'Fira Code', monospace";
  }
  getFontSizes() {
    return {
      small: '14px',
      normal: '16px',
      large: '18px',
      xlarge: '24px',
    };
  }
}

class LightLayout extends Layout {
  getSpacing() {
    return {
      small: '8px',
      medium: '16px',
      large: '24px',
      xlarge: '32px',
    };
  }

  getBorderRadius() {
    return '4px';
  }

  getShadows() {
    return {
      small: '0 2px 4px rgba(0,0,0,0.1)',
      medium: '0 4px 8px rgba(0,0,0,0.1)',
      large: '0 8px 16px rgba(0,0,0,0.1)',
    };
  }

  getBreakpoints() {
    return {
      mobile: '768px',
      tablet: '1024px',
      desktop: '1200px',
    };
  }
}

// Dark Theme Family
class DarkColorScheme extends ColorScheme {
  getPrimaryColor() {
    return '#0d6efd';
  }
  getSecondaryColor() {
    return '#6c757d';
  }
  getBackgroundColor() {
    return '#121212';
  }
  getTextColor() {
    return '#e9ecef';
  }
  getAccentColor() {
    return '#20c997';
  }
}

class DarkTypography extends Typography {
  getHeadingFont() {
    return "'Roboto', sans-serif";
  }
  getBodyFont() {
    return "'Open Sans', sans-serif";
  }
  getCodeFont() {
    return "'Fira Code', monospace";
  }
  getFontSizes() {
    return {
      small: '14px',
      normal: '16px',
      large: '18px',
      xlarge: '24px',
    };
  }
}

class DarkLayout extends Layout {
  getSpacing() {
    return {
      small: '8px',
      medium: '16px',
      large: '24px',
      xlarge: '32px',
    };
  }

  getBorderRadius() {
    return '6px';
  }

  getShadows() {
    return {
      small: '0 2px 4px rgba(255,255,255,0.1)',
      medium: '0 4px 8px rgba(255,255,255,0.1)',
      large: '0 8px 16px rgba(255,255,255,0.1)',
    };
  }

  getBreakpoints() {
    return {
      mobile: '768px',
      tablet: '1024px',
      desktop: '1200px',
    };
  }
}

// High Contrast Theme Family
class HighContrastColorScheme extends ColorScheme {
  getPrimaryColor() {
    return '#000000';
  }
  getSecondaryColor() {
    return '#666666';
  }
  getBackgroundColor() {
    return '#ffffff';
  }
  getTextColor() {
    return '#000000';
  }
  getAccentColor() {
    return '#ff0000';
  }
}

class HighContrastTypography extends Typography {
  getHeadingFont() {
    return "'Arial', sans-serif";
  }
  getBodyFont() {
    return "'Arial', sans-serif";
  }
  getCodeFont() {
    return "'Courier New', monospace";
  }
  getFontSizes() {
    return {
      small: '16px', // Larger for accessibility
      normal: '18px',
      large: '20px',
      xlarge: '28px',
    };
  }
}

class HighContrastLayout extends Layout {
  getSpacing() {
    return {
      small: '12px', // More spacing for accessibility
      medium: '20px',
      large: '28px',
      xlarge: '36px',
    };
  }

  getBorderRadius() {
    return '0px';
  } // No rounded corners for high contrast

  getShadows() {
    return {
      small: '2px 2px 0px rgba(0,0,0,1)',
      medium: '4px 4px 0px rgba(0,0,0,1)',
      large: '6px 6px 0px rgba(0,0,0,1)',
    };
  }

  getBreakpoints() {
    return {
      mobile: '768px',
      tablet: '1024px',
      desktop: '1200px',
    };
  }
}

// Abstract Factory
class ThemeFactory {
  createColorScheme() {
    throw new Error('Not implemented');
  }
  createTypography() {
    throw new Error('Not implemented');
  }
  createLayout() {
    throw new Error('Not implemented');
  }
}

// Concrete Factories
class LightThemeFactory extends ThemeFactory {
  createColorScheme() {
    return new LightColorScheme();
  }
  createTypography() {
    return new LightTypography();
  }
  createLayout() {
    return new LightLayout();
  }
}

class DarkThemeFactory extends ThemeFactory {
  createColorScheme() {
    return new DarkColorScheme();
  }
  createTypography() {
    return new DarkTypography();
  }
  createLayout() {
    return new DarkLayout();
  }
}

class HighContrastThemeFactory extends ThemeFactory {
  createColorScheme() {
    return new HighContrastColorScheme();
  }
  createTypography() {
    return new HighContrastTypography();
  }
  createLayout() {
    return new HighContrastLayout();
  }
}

// Theme Manager (Client)
class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.colorScheme = null;
    this.typography = null;
    this.layout = null;
  }

  setTheme(themeFactory) {
    this.currentTheme = themeFactory;
    this.colorScheme = themeFactory.createColorScheme();
    this.typography = themeFactory.createTypography();
    this.layout = themeFactory.createLayout();

    console.log(`🎨 Theme applied: ${themeFactory.constructor.name.replace('ThemeFactory', '')}`);
  }

  generateCSS() {
    if (!this.currentTheme) {
      throw new Error('No theme set');
    }

    const colors = this.colorScheme;
    const typography = this.typography;
    const layout = this.layout;

    const css = `
/* Generated CSS from Theme Factory */
:root {
  /* Colors */
  --primary-color: ${colors.getPrimaryColor()};
  --secondary-color: ${colors.getSecondaryColor()};
  --background-color: ${colors.getBackgroundColor()};
  --text-color: ${colors.getTextColor()};
  --accent-color: ${colors.getAccentColor()};

  /* Typography */
  --heading-font: ${typography.getHeadingFont()};
  --body-font: ${typography.getBodyFont()};
  --code-font: ${typography.getCodeFont()};
  --font-size-small: ${typography.getFontSizes().small};
  --font-size-normal: ${typography.getFontSizes().normal};
  --font-size-large: ${typography.getFontSizes().large};
  --font-size-xlarge: ${typography.getFontSizes().xlarge};

  /* Layout */
  --spacing-small: ${layout.getSpacing().small};
  --spacing-medium: ${layout.getSpacing().medium};
  --spacing-large: ${layout.getSpacing().large};
  --spacing-xlarge: ${layout.getSpacing().xlarge};
  --border-radius: ${layout.getBorderRadius()};
  --shadow-small: ${layout.getShadows().small};
  --shadow-medium: ${layout.getShadows().medium};
  --shadow-large: ${layout.getShadows().large};
}

body {
  font-family: var(--body-font);
  font-size: var(--font-size-normal);
  color: var(--text-color);
  background-color: var(--background-color);
  margin: 0;
  padding: var(--spacing-medium);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--heading-font);
  color: var(--primary-color);
}

.button {
  background-color: var(--primary-color);
  color: var(--background-color);
  border: none;
  border-radius: var(--border-radius);
  padding: var(--spacing-small) var(--spacing-medium);
  font-family: var(--body-font);
  box-shadow: var(--shadow-small);
  cursor: pointer;
}

.card {
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-large);
  box-shadow: var(--shadow-medium);
  margin-bottom: var(--spacing-medium);
}

code {
  font-family: var(--code-font);
  background-color: var(--secondary-color);
  padding: 2px 4px;
  border-radius: calc(var(--border-radius) / 2);
}
    `;

    return css.trim();
  }

  getThemeInfo() {
    if (!this.currentTheme) {
      return 'No theme selected';
    }

    return {
      colors: {
        primary: this.colorScheme.getPrimaryColor(),
        secondary: this.colorScheme.getSecondaryColor(),
        background: this.colorScheme.getBackgroundColor(),
        text: this.colorScheme.getTextColor(),
        accent: this.colorScheme.getAccentColor(),
      },
      fonts: {
        heading: this.typography.getHeadingFont(),
        body: this.typography.getBodyFont(),
        code: this.typography.getCodeFont(),
        sizes: this.typography.getFontSizes(),
      },
      layout: {
        spacing: this.layout.getSpacing(),
        borderRadius: this.layout.getBorderRadius(),
        shadows: this.layout.getShadows(),
        breakpoints: this.layout.getBreakpoints(),
      },
    };
  }
}

// Usage
const themeManager = new ThemeManager();

const themes = [
  { name: 'Light', factory: new LightThemeFactory() },
  { name: 'Dark', factory: new DarkThemeFactory() },
  { name: 'High Contrast', factory: new HighContrastThemeFactory() },
];

themes.forEach(({ name, factory }) => {
  console.log(`\n${'='.repeat(15)} ${name} Theme ${'='.repeat(15)}`);

  themeManager.setTheme(factory);

  console.log('📋 Theme Info:');
  console.log(JSON.stringify(themeManager.getThemeInfo(), null, 2));

  console.log('\n🎨 Generated CSS:');
  console.log(themeManager.generateCSS());

  console.log(`\n${'='.repeat(30 + name.length)}`);
});
```

## ✅ Pros

- **Consistency**: Guarantees compatibility between products created by the same factory
- **Isolation**: Isolates concrete classes from client code
- **Easy Swapping**: Makes exchanging product families easy
- **Product Consistency**: Enforces consistency among products
- **Open/Closed Principle**: Easy to add new variants of products

## ❌ Cons

- **Complexity**: Can be overkill if you only have one product family
- **Rigid Structure**: Adding new products requires extending all factories
- **Code Volume**: Requires a lot of interfaces and classes
- **Learning Curve**: Can be difficult to understand initially

## 🎯 When to Use

- **Product Families**: When your system needs to work with multiple families of related products
- **Consistency Requirements**: When you need to ensure that products from the same family are used together
- **Platform Independence**: When you want to configure your system with one of multiple families of products
- **Future Extensibility**: When you anticipate adding new product families in the future

## 🔄 Variations

### 1. **Parameterized Abstract Factory**

```javascript
class ParameterizedFactory {
  createProduct(type, family) {
    const key = `${family}_${type}`;
    const ProductClass = this.productRegistry[key];
    return new ProductClass();
  }
}
```

### 2. **Registry-based Abstract Factory**

```javascript
class RegistryAbstractFactory {
  constructor() {
    this.factories = new Map();
  }

  registerFactory(family, factory) {
    this.factories.set(family, factory);
  }

  getFactory(family) {
    return this.factories.get(family);
  }
}
```

### 3. **Singleton Abstract Factory**

```javascript
class SingletonAbstractFactory {
  constructor() {
    if (SingletonAbstractFactory.instance) {
      return SingletonAbstractFactory.instance;
    }
    SingletonAbstractFactory.instance = this;
    this.currentFactory = null;
  }

  setFactory(factory) {
    this.currentFactory = factory;
  }
}
```

## 🔗 Related Patterns

- **Factory Method**: Abstract Factory is often implemented using Factory Methods
- **Singleton**: Abstract Factory is often implemented as a Singleton
- **Prototype**: Can use Prototype to create products instead of Factory Method
- **Builder**: Can be used together to build complex product families

## 📚 Further Reading

- [Abstract Factory Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/abstract-factory)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [JavaScript Abstract Factory Pattern](https://www.dofactory.com/javascript/design-patterns/abstract-factory)
