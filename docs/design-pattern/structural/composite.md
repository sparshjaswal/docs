# Composite Pattern 🌳

> **Definition**: The Composite pattern lets you compose objects into tree structures to represent part-whole hierarchies. It allows clients to treat individual objects and compositions uniformly.

## 🎯 Intent

Compose objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects and compositions of objects uniformly.

## 🤔 Problem

You need to work with tree-like structures where some objects contain other objects, and you want to treat both simple and complex objects the same way.

For example, in a file system, you have files and folders. Folders can contain files and other folders. You want to perform operations (like calculating size) on both files and folders using the same interface.

## 💡 Solution

The Composite pattern suggests using a common interface for both simple and complex objects. Complex objects (composites) can contain simple objects (leaves) and other composites, forming a tree structure.

## 🏗️ Structure

```
Component (interface)
└── operation()

Leaf implements Component
└── operation()

Composite implements Component
├── children: Component[]
├── add(component: Component)
├── remove(component: Component)
└── operation() → for each child: child.operation()
```

## 💻 Simple Example

### File System

```javascript
// Component interface
class FileSystemItem {
  constructor(name) {
    this.name = name;
  }

  getSize() {
    throw new Error("getSize() method must be implemented");
  }

  display(indent = 0) {
    throw new Error("display() method must be implemented");
  }
}

// Leaf - represents a file
class File extends FileSystemItem {
  constructor(name, size) {
    super(name);
    this.size = size;
  }

  getSize() {
    return this.size;
  }

  display(indent = 0) {
    const spaces = " ".repeat(indent);
    console.log(`${spaces}📄 ${this.name} (${this.size} KB)`);
  }
}

// Composite - represents a folder
class Folder extends FileSystemItem {
  constructor(name) {
    super(name);
    this.children = [];
  }

  add(item) {
    this.children.push(item);
    console.log(`➕ Added ${item.name} to ${this.name}`);
  }

  remove(item) {
    const index = this.children.indexOf(item);
    if (index > -1) {
      this.children.splice(index, 1);
      console.log(`➖ Removed ${item.name} from ${this.name}`);
    }
  }

  getSize() {
    let totalSize = 0;
    for (const child of this.children) {
      totalSize += child.getSize();
    }
    return totalSize;
  }

  display(indent = 0) {
    const spaces = " ".repeat(indent);
    console.log(`${spaces}📁 ${this.name}/ (${this.getSize()} KB total)`);

    // Display all children
    for (const child of this.children) {
      child.display(indent + 2);
    }
  }
}

// Usage
console.log("=== File System Composite Demo ===\n");

// Create files
const file1 = new File("document.txt", 10);
const file2 = new File("image.jpg", 250);
const file3 = new File("video.mp4", 1500);
const file4 = new File("readme.md", 5);

console.log("Creating folder structure:");
console.log("-".repeat(25));

// Create folders
const documents = new Folder("Documents");
const media = new Folder("Media");
const root = new Folder("Root");

// Build the tree structure
documents.add(file1);
documents.add(file4);

media.add(file2);
media.add(file3);

root.add(documents);
root.add(media);

console.log("\nFolder structure:");
console.log("-".repeat(17));
root.display();

console.log(`\n📊 Total size: ${root.getSize()} KB`);
```

## 🌟 Real-World Example

### UI Component System

```javascript
// Component interface for UI elements
class UIComponent {
  constructor(name) {
    this.name = name;
    this.visible = true;
  }

  render() {
    throw new Error("render() method must be implemented");
  }

  setVisible(visible) {
    this.visible = visible;
  }

  isVisible() {
    return this.visible;
  }
}

// Leaf components - Basic UI elements
class Button extends UIComponent {
  constructor(name, text) {
    super(name);
    this.text = text;
  }

  render(indent = 0) {
    if (!this.visible) return;

    const spaces = " ".repeat(indent);
    console.log(`${spaces}🔘 Button: "${this.text}"`);
  }

  click() {
    console.log(`👆 ${this.text} button clicked!`);
  }
}

class TextInput extends UIComponent {
  constructor(name, placeholder) {
    super(name);
    this.placeholder = placeholder;
    this.value = "";
  }

  render(indent = 0) {
    if (!this.visible) return;

    const spaces = " ".repeat(indent);
    const displayValue = this.value || `[${this.placeholder}]`;
    console.log(`${spaces}📝 Input: ${displayValue}`);
  }

  setValue(value) {
    this.value = value;
    console.log(`✏️  Input "${this.name}" set to: ${value}`);
  }
}

class Label extends UIComponent {
  constructor(name, text) {
    super(name);
    this.text = text;
  }

  render(indent = 0) {
    if (!this.visible) return;

    const spaces = " ".repeat(indent);
    console.log(`${spaces}🏷️  Label: ${this.text}`);
  }
}

// Composite components - Containers
class Panel extends UIComponent {
  constructor(name, title) {
    super(name);
    this.title = title;
    this.components = [];
  }

  add(component) {
    this.components.push(component);
    console.log(`➕ Added ${component.name} to ${this.name}`);
  }

  remove(component) {
    const index = this.components.indexOf(component);
    if (index > -1) {
      this.components.splice(index, 1);
      console.log(`➖ Removed ${component.name} from ${this.name}`);
    }
  }

  render(indent = 0) {
    if (!this.visible) return;

    const spaces = " ".repeat(indent);
    console.log(`${spaces}📦 Panel: "${this.title}"`);

    // Render all child components
    for (const component of this.components) {
      if (component.isVisible()) {
        component.render(indent + 2);
      }
    }
  }

  setVisible(visible) {
    super.setVisible(visible);
    // Optionally hide/show all children
    console.log(`👁️  ${this.name} visibility: ${visible ? 'shown' : 'hidden'}`);
  }
}

class Form extends UIComponent {
  constructor(name, title) {
    super(name);
    this.title = title;
    this.components = [];
  }

  add(component) {
    this.components.push(component);
    console.log(`➕ Added ${component.name} to form ${this.name}`);
  }

  remove(component) {
    const index = this.components.indexOf(component);
    if (index > -1) {
      this.components.splice(index, 1);
      console.log(`➖ Removed ${component.name} from form ${this.name}`);
    }
  }

  render(indent = 0) {
    if (!this.visible) return;

    const spaces = " ".repeat(indent);
    console.log(`${spaces}📋 Form: "${this.title}"`);
    console.log(`${spaces}${"─".repeat(20)}`);

    // Render all form components
    for (const component of this.components) {
      if (component.isVisible()) {
        component.render(indent + 2);
      }
    }

    console.log(`${spaces}${"─".repeat(20)}`);
  }

  submit() {
    console.log(`📨 Submitting form: ${this.title}`);

    // Collect data from input fields
    const formData = {};
    for (const component of this.components) {
      if (component instanceof TextInput && component.isVisible()) {
        formData[component.name] = component.value;
      }
    }

    console.log("📊 Form data:", formData);
    return formData;
  }
}

// Usage
console.log("=== UI Component System Demo ===\n");

console.log("Building UI components:");
console.log("-".repeat(22));

// Create basic components
const nameInput = new TextInput("name", "Enter your name");
const emailInput = new TextInput("email", "Enter your email");
const submitBtn = new Button("submit", "Submit Form");
const cancelBtn = new Button("cancel", "Cancel");

const titleLabel = new Label("title", "Contact Information");
const nameLabel = new Label("nameLabel", "Name:");
const emailLabel = new Label("emailLabel", "Email:");

// Create containers
const headerPanel = new Panel("header", "Form Header");
const inputPanel = new Panel("inputs", "User Input");
const buttonPanel = new Panel("buttons", "Actions");
const mainForm = new Form("contactForm", "Contact Form");

// Build the component tree
headerPanel.add(titleLabel);

inputPanel.add(nameLabel);
inputPanel.add(nameInput);
inputPanel.add(emailLabel);
inputPanel.add(emailInput);

buttonPanel.add(submitBtn);
buttonPanel.add(cancelBtn);

mainForm.add(headerPanel);
mainForm.add(inputPanel);
mainForm.add(buttonPanel);

console.log("\nRendering UI:");
console.log("-".repeat(13));
mainForm.render();

console.log("\nUser interactions:");
console.log("-".repeat(17));
nameInput.setValue("John Doe");
emailInput.setValue("john@example.com");

console.log("\nSubmitting form:");
console.log("-".repeat(15));
mainForm.submit();

console.log("\nHiding email field:");
console.log("-".repeat(18));
emailInput.setVisible(false);
inputPanel.render();
```

## 🔧 Another Simple Example

### Organization Structure

```javascript
// Component for organization entities
class OrganizationEntity {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }

  getSalaryBudget() {
    throw new Error("getSalaryBudget() method must be implemented");
  }

  getEmployeeCount() {
    throw new Error("getEmployeeCount() method must be implemented");
  }

  displayStructure(indent = 0) {
    throw new Error("displayStructure() method must be implemented");
  }
}

// Leaf - Individual employee
class Employee extends OrganizationEntity {
  constructor(name, role, salary) {
    super(name, role);
    this.salary = salary;
  }

  getSalaryBudget() {
    return this.salary;
  }

  getEmployeeCount() {
    return 1;
  }

  displayStructure(indent = 0) {
    const spaces = " ".repeat(indent);
    console.log(`${spaces}👤 ${this.name} - ${this.role} ($${this.salary})`);
  }
}

// Composite - Department with employees and sub-departments
class Department extends OrganizationEntity {
  constructor(name) {
    super(name, "Department");
    this.entities = [];
  }

  add(entity) {
    this.entities.push(entity);
    console.log(`➕ Added ${entity.name} to ${this.name} department`);
  }

  remove(entity) {
    const index = this.entities.indexOf(entity);
    if (index > -1) {
      this.entities.splice(index, 1);
      console.log(`➖ Removed ${entity.name} from ${this.name} department`);
    }
  }

  getSalaryBudget() {
    let totalBudget = 0;
    for (const entity of this.entities) {
      totalBudget += entity.getSalaryBudget();
    }
    return totalBudget;
  }

  getEmployeeCount() {
    let totalEmployees = 0;
    for (const entity of this.entities) {
      totalEmployees += entity.getEmployeeCount();
    }
    return totalEmployees;
  }

  displayStructure(indent = 0) {
    const spaces = " ".repeat(indent);
    const budget = this.getSalaryBudget();
    const employees = this.getEmployeeCount();

    console.log(`${spaces}🏢 ${this.name} Department`);
    console.log(`${spaces}   (${employees} employees, $${budget} budget)`);

    // Display all entities in this department
    for (const entity of this.entities) {
      entity.displayStructure(indent + 2);
    }
  }
}

// Usage
console.log("=== Organization Structure Demo ===\n");

console.log("Building organization structure:");
console.log("-".repeat(30));

// Create employees
const ceo = new Employee("Alice Johnson", "CEO", 150000);
const cto = new Employee("Bob Smith", "CTO", 120000);
const dev1 = new Employee("Carol Davis", "Senior Developer", 80000);
const dev2 = new Employee("David Wilson", "Developer", 70000);
const qa = new Employee("Eve Brown", "QA Engineer", 65000);
const hr = new Employee("Frank Miller", "HR Manager", 75000);
const designer = new Employee("Grace Lee", "UI Designer", 70000);

// Create departments
const engineering = new Department("Engineering");
const humanResources = new Department("Human Resources");
const company = new Department("TechCorp");

// Build organization structure
engineering.add(cto);
engineering.add(dev1);
engineering.add(dev2);
engineering.add(qa);
engineering.add(designer);

humanResources.add(hr);

company.add(ceo);
company.add(engineering);
company.add(humanResources);

console.log("\nOrganization Chart:");
console.log("-".repeat(18));
company.displayStructure();

console.log(`\n📊 Company Statistics:`);
console.log(`   Total Employees: ${company.getEmployeeCount()}`);
console.log(`   Total Salary Budget: $${company.getSalaryBudget()}`);

console.log(`\n📊 Engineering Department:`);
console.log(`   Employees: ${engineering.getEmployeeCount()}`);
console.log(`   Budget: $${engineering.getSalaryBudget()}`);
```

## ✅ Pros

- **Uniform Treatment**: Treats simple and complex objects uniformly
- **Easy to Add**: Easy to add new component types
- **Recursive Structure**: Natural representation of tree structures
- **Client Simplification**: Clients don't need to distinguish between leaves and composites

## ❌ Cons

- **Overly General Design**: Can make the design overly general
- **Type Safety**: Harder to restrict component types in the composite
- **Complexity**: Can become complex with deep hierarchies

## 🎯 When to Use

- **Tree Structures**: When you need to represent part-whole hierarchies
- **Uniform Interface**: When you want clients to treat simple and complex objects uniformly
- **Recursive Operations**: When operations need to be performed recursively on tree structures
- **UI Systems**: For building complex UI with nested components

## 🔄 Implementation Variants

### 1. **Transparent Composite** (shown in examples)
- Child management methods in the component interface
- All components can have children (even if they don't use them)

### 2. **Safe Composite**
```javascript
// Child management only in composite classes
class SafeComposite extends Component {
  add(component) { /* implementation */ }
  remove(component) { /* implementation */ }
}
```

## 🔗 Related Patterns

- **Visitor**: Often used together to perform operations on composite structures
- **Iterator**: Can be used to traverse composite structures
- **Decorator**: Both use tree structures but Decorator adds behavior while Composite represents hierarchies
- **Flyweight**: Can be used to share leaf components in large composite structures

## 📚 Further Reading

- [Composite Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/composite)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [JavaScript Composite Pattern Examples](https://www.dofactory.com/javascript/design-patterns/composite)
