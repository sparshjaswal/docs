---
id: design-pattern-structural-flyweight
title: "Flyweight Pattern 🪶"
slug: /design-pattern/structural/flyweight
sidebar_label: "Flyweight Pattern 🪶"
---

# Flyweight Pattern 🪶

> **Definition**: The Flyweight pattern minimizes memory usage by sharing efficiently the common parts of state between multiple objects instead of storing all data in each object.

## 🎯 Intent

Use sharing to support large numbers of fine-grained objects efficiently by separating intrinsic state (shared) from extrinsic state (context-specific).

## 🤔 Problem

You need to create a large number of objects that consume too much memory. Many objects contain duplicate data that could be shared. For example, in a text editor, each character object might store font, size, and color - but many characters share the same formatting.

Creating millions of character objects would consume massive amounts of memory, most of which would be redundant.

## 💡 Solution

The Flyweight pattern suggests separating object state into two types:

1. **Intrinsic state**: Data shared among objects (stored in flyweight)
2. **Extrinsic state**: Context-specific data (passed to flyweight methods)

## 🏗️ Structure

```
FlyweightFactory
├── flyweights: Map<key, Flyweight>
└── getFlyweight(key): Flyweight

Flyweight (interface)
└── operation(extrinsicState)

ConcreteFlyweight implements Flyweight
├── intrinsicState
└── operation(extrinsicState)

Context
├── flyweight: Flyweight
├── extrinsicState
└── operation() → flyweight.operation(extrinsicState)
```

## 💻 Simple Example

### Text Editor Characters

```javascript
// Flyweight interface
class CharacterFlyweight {
  constructor(character, font, size) {
    this.character = character; // Intrinsic state
    this.font = font; // Intrinsic state
    this.size = size; // Intrinsic state
  }

  // Operation that uses both intrinsic and extrinsic state
  render(x, y, color) {
    // x, y, color are extrinsic state
    console.log(
      `Rendering '${this.character}' at (${x}, ${y}) ` +
        `with ${this.font} font, size ${this.size}, color ${color}`,
    );
  }
}

// Flyweight factory
class CharacterFlyweightFactory {
  constructor() {
    this.flyweights = new Map();
  }

  getFlyweight(character, font, size) {
    const key = `${character}-${font}-${size}`;

    if (!this.flyweights.has(key)) {
      console.log(`📝 Creating new flyweight for: ${key}`);
      this.flyweights.set(key, new CharacterFlyweight(character, font, size));
    } else {
      console.log(`♻️  Reusing flyweight for: ${key}`);
    }

    return this.flyweights.get(key);
  }

  getCreatedFlyweightsCount() {
    return this.flyweights.size;
  }

  listFlyweights() {
    console.log(`📊 Total flyweights created: ${this.flyweights.size}`);
    for (const [key, flyweight] of this.flyweights) {
      console.log(`   ${key}`);
    }
  }
}

// Context class that maintains extrinsic state
class Character {
  constructor(character, font, size, x, y, color) {
    this.flyweight = factory.getFlyweight(character, font, size);
    // Extrinsic state
    this.x = x;
    this.y = y;
    this.color = color;
  }

  render() {
    this.flyweight.render(this.x, this.y, this.color);
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }
}

// Document class that manages characters
class Document {
  constructor() {
    this.characters = [];
  }

  addCharacter(char, font, size, x, y, color) {
    const character = new Character(char, font, size, x, y, color);
    this.characters.push(character);
  }

  render() {
    console.log('📄 Rendering document:');
    this.characters.forEach((char) => char.render());
  }

  getCharacterCount() {
    return this.characters.length;
  }
}

// Usage
console.log('=== Text Editor Flyweight Demo ===\n');

const factory = new CharacterFlyweightFactory();
const document = new Document();

console.log('Adding characters to document:');
console.log('-'.repeat(30));

// Add characters - notice how flyweights are reused
document.addCharacter('H', 'Arial', 12, 0, 0, 'black');
document.addCharacter('e', 'Arial', 12, 10, 0, 'black');
document.addCharacter('l', 'Arial', 12, 20, 0, 'black');
document.addCharacter('l', 'Arial', 12, 30, 0, 'black');
document.addCharacter('o', 'Arial', 12, 40, 0, 'black');

// Add more characters with different formatting
document.addCharacter('W', 'Arial', 14, 0, 20, 'red');
document.addCharacter('o', 'Arial', 14, 15, 20, 'red');
document.addCharacter('r', 'Arial', 14, 30, 20, 'red');
document.addCharacter('l', 'Arial', 14, 45, 20, 'red');
document.addCharacter('d', 'Arial', 14, 60, 20, 'red');

// Add characters that reuse existing flyweights
document.addCharacter('H', 'Arial', 12, 0, 40, 'blue');
document.addCharacter('e', 'Arial', 12, 10, 40, 'blue');
document.addCharacter('l', 'Arial', 12, 20, 40, 'green');
document.addCharacter('l', 'Arial', 12, 30, 40, 'green');
document.addCharacter('o', 'Arial', 12, 40, 40, 'purple');

console.log('\nDocument statistics:');
console.log('-'.repeat(20));
console.log(`Total characters in document: ${document.getCharacterCount()}`);
factory.listFlyweights();

console.log('\nRendering document:');
console.log('-'.repeat(18));
document.render();
```

## 🌟 Real-World Example

### Forest Simulation

```javascript
// Flyweight for tree types
class TreeType {
  constructor(name, color, sprite) {
    this.name = name; // Intrinsic state
    this.color = color; // Intrinsic state
    this.sprite = sprite; // Intrinsic state (image data)
  }

  // Method that uses both intrinsic and extrinsic state
  render(canvas, x, y, size) {
    // canvas, x, y, size are extrinsic
    console.log(
      `🌲 Rendering ${this.name} tree (${this.color}) ` +
        `at (${x}, ${y}) with size ${size}px using sprite: ${this.sprite}`,
    );
  }

  // Simulate tree-specific behavior
  getGrowthRate() {
    const growthRates = {
      Oak: 2,
      Pine: 3,
      Birch: 4,
      Maple: 2.5,
    };
    return growthRates[this.name] || 2;
  }
}

// Flyweight factory
class TreeTypeFactory {
  constructor() {
    this.treeTypes = new Map();
  }

  getTreeType(name, color, sprite) {
    const key = `${name}-${color}`;

    if (!this.treeTypes.has(key)) {
      console.log(`🌱 Creating new tree type: ${key}`);
      this.treeTypes.set(key, new TreeType(name, color, sprite));
    }

    return this.treeTypes.get(key);
  }

  getCreatedTypesCount() {
    return this.treeTypes.size;
  }

  listTreeTypes() {
    console.log(`📊 Tree types created: ${this.treeTypes.size}`);
    for (const [key, type] of this.treeTypes) {
      console.log(`   ${key} (Growth rate: ${type.getGrowthRate()})`);
    }
  }
}

// Context class for individual trees
class Tree {
  constructor(x, y, size, treeType) {
    // Extrinsic state
    this.x = x;
    this.y = y;
    this.size = size;
    this.age = 0;

    // Reference to flyweight
    this.treeType = treeType;
  }

  render(canvas) {
    this.treeType.render(canvas, this.x, this.y, this.size);
  }

  grow() {
    this.age++;
    this.size += this.treeType.getGrowthRate();
    console.log(
      `🌱 ${this.treeType.name} at (${this.x}, ${this.y}) ` +
        `grew to size ${this.size}px (age: ${this.age} years)`,
    );
  }

  getInfo() {
    return {
      type: this.treeType.name,
      color: this.treeType.color,
      position: { x: this.x, y: this.y },
      size: this.size,
      age: this.age,
    };
  }
}

// Forest class that manages many trees
class Forest {
  constructor() {
    this.trees = [];
    this.treeTypeFactory = new TreeTypeFactory();
  }

  plantTree(x, y, name, color, sprite) {
    const treeType = this.treeTypeFactory.getTreeType(name, color, sprite);
    const tree = new Tree(x, y, 10, treeType); // Start with size 10
    this.trees.push(tree);

    console.log(`🌳 Planted ${name} tree at (${x}, ${y})`);
  }

  render() {
    console.log('🏞️ Rendering forest:');
    const canvas = '2D Canvas Context'; // Simulated canvas

    this.trees.forEach((tree, index) => {
      console.log(`Tree ${index + 1}:`);
      tree.render(canvas);
    });
  }

  simulateGrowth() {
    console.log('\n📈 Simulating tree growth (1 year):');
    this.trees.forEach((tree) => tree.grow());
  }

  getForestStats() {
    const stats = {
      totalTrees: this.trees.length,
      uniqueTreeTypes: this.treeTypeFactory.getCreatedTypesCount(),
      averageSize: 0,
      treesByType: {},
    };

    let totalSize = 0;
    this.trees.forEach((tree) => {
      totalSize += tree.size;
      const typeName = tree.treeType.name;
      stats.treesByType[typeName] = (stats.treesByType[typeName] || 0) + 1;
    });

    stats.averageSize = totalSize / this.trees.length;
    return stats;
  }
}

// Usage
console.log('=== Forest Simulation Flyweight Demo ===\n');

const forest = new Forest();

console.log('Planting trees in the forest:');
console.log('-'.repeat(30));

// Plant many trees - notice flyweight reuse
forest.plantTree(10, 20, 'Oak', 'Green', 'oak_sprite.png');
forest.plantTree(30, 40, 'Pine', 'Dark Green', 'pine_sprite.png');
forest.plantTree(50, 60, 'Oak', 'Green', 'oak_sprite.png'); // Reuses Oak-Green flyweight
forest.plantTree(70, 80, 'Birch', 'Light Green', 'birch_sprite.png');
forest.plantTree(90, 100, 'Pine', 'Dark Green', 'pine_sprite.png'); // Reuses Pine-Dark Green
forest.plantTree(110, 120, 'Maple', 'Red', 'maple_sprite.png');
forest.plantTree(130, 140, 'Oak', 'Green', 'oak_sprite.png'); // Reuses Oak-Green again
forest.plantTree(150, 160, 'Oak', 'Yellow', 'oak_sprite.png'); // New Oak-Yellow flyweight

console.log('\nForest statistics:');
console.log('-'.repeat(17));
const stats = forest.getForestStats();
console.log(`Total trees: ${stats.totalTrees}`);
console.log(`Unique tree types (flyweights): ${stats.uniqueTreeTypes}`);
console.log(`Trees by type:`, stats.treesByType);

console.log('\nTree type flyweights:');
forest.treeTypeFactory.listTreeTypes();

console.log('\nSimulating forest growth:');
console.log('-'.repeat(25));
forest.simulateGrowth();

console.log(
  `\nAverage tree size after growth: ${forest.getForestStats().averageSize.toFixed(1)}px`,
);

console.log('\nMemory efficiency demonstration:');
console.log('-'.repeat(32));
console.log(
  `Without Flyweight: ${stats.totalTrees} tree objects × (name + color + sprite) = Heavy memory usage`,
);
console.log(
  `With Flyweight: ${stats.totalTrees} context objects + ${stats.uniqueTreeTypes} flyweight objects = Efficient memory usage`,
);
```

## 🔧 Another Simple Example

### Button Factory (UI Components)

```javascript
// Flyweight for button styles
class ButtonStyle {
  constructor(font, fontSize, backgroundColor, borderStyle) {
    // Intrinsic state - shared among buttons
    this.font = font;
    this.fontSize = fontSize;
    this.backgroundColor = backgroundColor;
    this.borderStyle = borderStyle;
  }

  render(text, x, y, width, height, isPressed) {
    const pressedStyle = isPressed ? ' (pressed)' : '';
    console.log(
      `🔘 Button "${text}" at (${x}, ${y}) ${width}×${height}px ` +
        `${this.backgroundColor} background, ${this.font} ${this.fontSize}px${pressedStyle}`,
    );
  }
}

// Flyweight factory
class ButtonStyleFactory {
  constructor() {
    this.styles = new Map();
  }

  getStyle(font, fontSize, backgroundColor, borderStyle) {
    const key = `${font}-${fontSize}-${backgroundColor}-${borderStyle}`;

    if (!this.styles.has(key)) {
      console.log(`🎨 Creating new button style: ${key}`);
      this.styles.set(key, new ButtonStyle(font, fontSize, backgroundColor, borderStyle));
    }

    return this.styles.get(key);
  }

  getStyleCount() {
    return this.styles.size;
  }
}

// Context class for individual buttons
class Button {
  constructor(text, x, y, width, height, style) {
    // Extrinsic state
    this.text = text;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isPressed = false;

    // Reference to flyweight
    this.style = style;
  }

  render() {
    this.style.render(this.text, this.x, this.y, this.width, this.height, this.isPressed);
  }

  press() {
    this.isPressed = true;
    console.log(`👆 Button "${this.text}" pressed`);
    this.render();
  }

  release() {
    this.isPressed = false;
    console.log(`👆 Button "${this.text}" released`);
    this.render();
  }
}

// UI Manager
class UIManager {
  constructor() {
    this.buttons = [];
    this.styleFactory = new ButtonStyleFactory();
  }

  createButton(text, x, y, width, height, font, fontSize, backgroundColor, borderStyle) {
    const style = this.styleFactory.getStyle(font, fontSize, backgroundColor, borderStyle);
    const button = new Button(text, x, y, width, height, style);
    this.buttons.push(button);

    console.log(`➕ Created button: "${text}"`);
    return button;
  }

  renderAll() {
    console.log('🖼️ Rendering all UI buttons:');
    this.buttons.forEach((button, index) => {
      console.log(`Button ${index + 1}:`);
      button.render();
    });
  }

  getStats() {
    return {
      totalButtons: this.buttons.length,
      uniqueStyles: this.styleFactory.getStyleCount(),
    };
  }
}

// Usage
console.log('=== UI Button Flyweight Demo ===\n');

const uiManager = new UIManager();

console.log('Creating UI buttons:');
console.log('-'.repeat(20));

// Create buttons with shared styles
const okBtn = uiManager.createButton('OK', 10, 10, 80, 30, 'Arial', 14, 'blue', 'solid');
const cancelBtn = uiManager.createButton('Cancel', 100, 10, 80, 30, 'Arial', 14, 'gray', 'solid');
const saveBtn = uiManager.createButton('Save', 10, 50, 80, 30, 'Arial', 14, 'green', 'solid');
const deleteBtn = uiManager.createButton('Delete', 100, 50, 80, 30, 'Arial', 14, 'red', 'solid');

// Create more buttons that reuse styles
const yesBtn = uiManager.createButton('Yes', 10, 90, 80, 30, 'Arial', 14, 'blue', 'solid'); // Reuses blue style
const noBtn = uiManager.createButton('No', 100, 90, 80, 30, 'Arial', 14, 'gray', 'solid'); // Reuses gray style

console.log('\nButton statistics:');
console.log('-'.repeat(17));
const stats = uiManager.getStats();
console.log(`Total buttons: ${stats.totalButtons}`);
console.log(`Unique styles (flyweights): ${stats.uniqueStyles}`);

console.log('\nTesting button interactions:');
console.log('-'.repeat(27));
okBtn.press();
okBtn.release();

deleteBtn.press();
deleteBtn.release();

console.log('\nMemory savings:');
console.log('-'.repeat(14));
console.log(
  `Without Flyweight: ${stats.totalButtons} × (font + fontSize + backgroundColor + borderStyle) objects`,
);
console.log(
  `With Flyweight: ${stats.totalButtons} button contexts + ${stats.uniqueStyles} shared style objects`,
);
```

## ✅ Pros

- **Memory Efficiency**: Dramatically reduces memory usage with many similar objects
- **Performance**: Faster object creation by reusing flyweights
- **Centralized Management**: Factory centralizes flyweight creation and management
- **Scalability**: Handles large numbers of objects efficiently

## ❌ Cons

- **Complexity**: Increases code complexity by separating intrinsic and extrinsic state
- **Runtime Costs**: May introduce computational overhead to calculate extrinsic state
- **Context Management**: Clients must manage and pass extrinsic state
- **Limited Applicability**: Only beneficial when you have many similar objects

## 🎯 When to Use

- **Large Number of Objects**: When you need to create a massive number of similar objects
- **High Memory Usage**: When object creation is consuming too much memory
- **Shared State**: When objects share common state that can be extracted
- **Performance Critical**: When object creation performance is critical

## 🔄 Implementation Tips

### 1. **Identify Intrinsic vs Extrinsic State**

```javascript
// Intrinsic: shared among many objects (store in flyweight)
// Extrinsic: unique per object (pass as parameters)

class FontFlyweight {
  constructor(family, size, style) {
    this.family = family; // Intrinsic
    this.size = size; // Intrinsic
    this.style = style; // Intrinsic
  }

  render(text, color, position) {
    // Extrinsic parameters
    // Render with intrinsic + extrinsic state
  }
}
```

### 2. **Factory Pattern Integration**

```javascript
class FlyweightFactory {
  constructor() {
    this.flyweights = new Map();
    this.creationCount = 0;
  }

  getFlyweight(key) {
    if (!this.flyweights.has(key)) {
      this.flyweights.set(key, this.createFlyweight(key));
      this.creationCount++;
    }
    return this.flyweights.get(key);
  }

  getStats() {
    return {
      totalFlyweights: this.flyweights.size,
      creationCount: this.creationCount,
    };
  }
}
```

## 🔗 Related Patterns

- **Factory Method**: Often used together to create flyweights
- **Composite**: Can use Flyweight to share leaf components
- **State**: Flyweights can represent different states efficiently
- **Strategy**: Strategies can be implemented as flyweights if they don't maintain state

## 📚 Further Reading

- [Flyweight Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/flyweight)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [JavaScript Flyweight Pattern Examples](https://www.dofactory.com/javascript/design-patterns/flyweight)
