# Command Pattern 🎮

> **Definition**: The Command pattern turns a request into a stand-alone object that contains all information about the request. This transformation lets you parameterize methods with different requests, delay or queue a request's execution, and support undoable operations.

## 🎯 Intent

Encapsulate a request as an object, allowing you to parameterize clients with different requests, queue operations, log requests, and support undo operations.

## 🤔 Problem

Imagine you're developing a text editor with various operations like copy, paste, undo, and redo. Without the Command pattern, you might end up with:

- Tight coupling between UI elements and business logic
- Difficulty implementing undo/redo functionality
- Hard-to-maintain code when adding new operations
- No way to queue, log, or delay operations

For example, a "Save" button directly calling a save method makes it impossible to:
- Undo the save operation
- Queue multiple save operations
- Log when saves occurred
- Implement macro commands

## 💡 Solution

The Command pattern suggests encapsulating requests as objects. This provides several benefits:
- **Decoupling**: Sender (button) doesn't need to know about the receiver (document)
- **Queuing**: Commands can be stored and executed later
- **Undo Support**: Commands can reverse their operations
- **Logging**: Commands can be logged for auditing
- **Macro Commands**: Combine multiple commands

## 🏗️ Structure

```
Invoker
├── command: Command
└── executeCommand()

Command (interface)
├── execute()
└── undo()

ConcreteCommand implements Command
├── receiver: Receiver
├── state
├── execute()
└── undo()

Receiver
├── action()
└── getState()

MacroCommand implements Command
├── commands: Command[]
├── addCommand(cmd)
├── execute()
└── undo()
```

## 💻 Code Example

### Basic Implementation

```javascript
// Command interface
class Command {
  execute() {
    throw new Error("execute() method must be implemented");
  }

  undo() {
    throw new Error("undo() method must be implemented");
  }
}

// Receiver - knows how to perform operations
class Document {
  constructor() {
    this.content = "";
  }

  write(text) {
    this.content += text;
  }

  delete(length) {
    const deleted = this.content.slice(-length);
    this.content = this.content.slice(0, -length);
    return deleted;
  }

  getContent() {
    return this.content;
  }
}

// Concrete Commands
class WriteCommand extends Command {
  constructor(document, text) {
    super();
    this.document = document;
    this.text = text;
  }

  execute() {
    this.document.write(this.text);
    console.log(`✍️ Wrote: "${this.text}"`);
  }

  undo() {
    this.document.delete(this.text.length);
    console.log(`⏪ Undid write: "${this.text}"`);
  }
}

class DeleteCommand extends Command {
  constructor(document, length) {
    super();
    this.document = document;
    this.length = length;
    this.deletedText = "";
  }

  execute() {
    this.deletedText = this.document.delete(this.length);
    console.log(`🗑️ Deleted: "${this.deletedText}"`);
  }

  undo() {
    this.document.write(this.deletedText);
    console.log(`⏪ Restored: "${this.deletedText}"`);
  }
}

// Invoker - manages commands
class TextEditor {
  constructor(document) {
    this.document = document;
    this.history = [];
    this.currentPosition = -1;
  }

  executeCommand(command) {
    // Remove any commands after current position
    this.history = this.history.slice(0, this.currentPosition + 1);

    // Execute and store command
    command.execute();
    this.history.push(command);
    this.currentPosition++;
  }

  undo() {
    if (this.currentPosition >= 0) {
      const command = this.history[this.currentPosition];
      command.undo();
      this.currentPosition--;
    } else {
      console.log("❌ Nothing to undo");
    }
  }

  redo() {
    if (this.currentPosition < this.history.length - 1) {
      this.currentPosition++;
      const command = this.history[this.currentPosition];
      command.execute();
    } else {
      console.log("❌ Nothing to redo");
    }
  }

  showContent() {
    console.log(`📄 Content: "${this.document.getContent()}"`);
  }
}

// Usage
const doc = new Document();
const editor = new TextEditor(doc);

editor.executeCommand(new WriteCommand(doc, "Hello "));
editor.executeCommand(new WriteCommand(doc, "World!"));
editor.showContent(); // "Hello World!"

editor.undo(); // Removes "World!"
editor.showContent(); // "Hello "

editor.redo(); // Adds "World!" back
editor.showContent(); // "Hello World!"
```

## 🌟 Real-World Examples

### 1. Remote Control System

```javascript
// Receivers
class Light {
  constructor(location) {
    this.location = location;
    this.isOn = false;
  }

  turnOn() {
    this.isOn = true;
    console.log(`💡 ${this.location} light is ON`);
  }

  turnOff() {
    this.isOn = false;
    console.log(`💡 ${this.location} light is OFF`);
  }
}

class Fan {
  constructor(location) {
    this.location = location;
    this.speed = 0;
  }

  setSpeed(speed) {
    const prevSpeed = this.speed;
    this.speed = speed;
    console.log(`🌀 ${this.location} fan speed: ${prevSpeed} → ${speed}`);
    return prevSpeed;
  }

  turnOff() {
    return this.setSpeed(0);
  }
}

class Stereo {
  constructor(location) {
    this.location = location;
    this.isOn = false;
    this.volume = 0;
    this.station = 0;
  }

  turnOn() {
    this.isOn = true;
    console.log(`🎵 ${this.location} stereo is ON`);
  }

  turnOff() {
    this.isOn = false;
    console.log(`🎵 ${this.location} stereo is OFF`);
  }

  setVolume(volume) {
    const prevVolume = this.volume;
    this.volume = volume;
    console.log(`🔊 Volume: ${prevVolume} → ${volume}`);
    return prevVolume;
  }
}

// Commands
class LightOnCommand extends Command {
  constructor(light) {
    super();
    this.light = light;
  }

  execute() {
    this.light.turnOn();
  }

  undo() {
    this.light.turnOff();
  }
}

class LightOffCommand extends Command {
  constructor(light) {
    super();
    this.light = light;
  }

  execute() {
    this.light.turnOff();
  }

  undo() {
    this.light.turnOn();
  }
}

class FanHighCommand extends Command {
  constructor(fan) {
    super();
    this.fan = fan;
    this.prevSpeed = 0;
  }

  execute() {
    this.prevSpeed = this.fan.setSpeed(3);
  }

  undo() {
    this.fan.setSpeed(this.prevSpeed);
  }
}

class StereoOnWithVolumeCommand extends Command {
  constructor(stereo, volume) {
    super();
    this.stereo = stereo;
    this.volume = volume;
    this.wasOn = false;
    this.prevVolume = 0;
  }

  execute() {
    this.wasOn = this.stereo.isOn;
    this.prevVolume = this.stereo.volume;

    this.stereo.turnOn();
    this.stereo.setVolume(this.volume);
  }

  undo() {
    this.stereo.setVolume(this.prevVolume);
    if (!this.wasOn) {
      this.stereo.turnOff();
    }
  }
}

// Null Object Pattern for empty slots
class NoCommand extends Command {
  execute() {}
  undo() {}
}

// Remote Control (Invoker)
class RemoteControl {
  constructor() {
    this.onCommands = new Array(7).fill(new NoCommand());
    this.offCommands = new Array(7).fill(new NoCommand());
    this.undoCommand = new NoCommand();
  }

  setCommand(slot, onCommand, offCommand) {
    this.onCommands[slot] = onCommand;
    this.offCommands[slot] = offCommand;
  }

  onButtonPressed(slot) {
    this.onCommands[slot].execute();
    this.undoCommand = this.onCommands[slot];
  }

  offButtonPressed(slot) {
    this.offCommands[slot].execute();
    this.undoCommand = this.offCommands[slot];
  }

  undoButtonPressed() {
    this.undoCommand.undo();
  }

  toString() {
    let result = "\n--- Remote Control ---\n";
    for (let i = 0; i < this.onCommands.length; i++) {
      result += `[slot ${i}] ${this.onCommands[i].constructor.name} | ${this.offCommands[i].constructor.name}\n`;
    }
    return result;
  }
}

// Usage
const livingRoomLight = new Light("Living Room");
const kitchenLight = new Light("Kitchen");
const fan = new Fan("Living Room");
const stereo = new Stereo("Living Room");

const remote = new RemoteControl();

// Set up commands
remote.setCommand(0,
  new LightOnCommand(livingRoomLight),
  new LightOffCommand(livingRoomLight)
);

remote.setCommand(1,
  new LightOnCommand(kitchenLight),
  new LightOffCommand(kitchenLight)
);

remote.setCommand(2,
  new FanHighCommand(fan),
  new NoCommand()
);

remote.setCommand(3,
  new StereoOnWithVolumeCommand(stereo, 11),
  new LightOffCommand(stereo)
);

// Test the remote
console.log(remote.toString());

remote.onButtonPressed(0);  // Living room light on
remote.offButtonPressed(0); // Living room light off
remote.undoButtonPressed(); // Undo (light back on)

remote.onButtonPressed(2);  // Fan high
remote.undoButtonPressed(); // Fan back to previous speed

remote.onButtonPressed(3);  // Stereo on with volume
remote.undoButtonPressed(); // Undo stereo command
```

### 2. Macro Commands

```javascript
class MacroCommand extends Command {
  constructor(commands = []) {
    super();
    this.commands = commands;
  }

  addCommand(command) {
    this.commands.push(command);
  }

  execute() {
    console.log("🎬 Executing macro command...");
    this.commands.forEach(command => command.execute());
  }

  undo() {
    console.log("⏪ Undoing macro command...");
    // Undo in reverse order
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo();
    }
  }
}

// Create a "Party Mode" macro
const partyMode = new MacroCommand([
  new LightOnCommand(livingRoomLight),
  new LightOnCommand(kitchenLight),
  new StereoOnWithVolumeCommand(stereo, 15),
  new FanHighCommand(fan)
]);

// Set up party mode on remote
remote.setCommand(6, partyMode, new MacroCommand([]));

console.log("\n🎉 Activating Party Mode!");
remote.onButtonPressed(6); // Execute all party commands

console.log("\n😴 Undoing Party Mode...");
remote.undoButtonPressed(); // Undo all party commands
```

### 3. Database Transaction System

```javascript
class DatabaseConnection {
  constructor() {
    this.data = new Map();
    this.isConnected = false;
  }

  connect() {
    this.isConnected = true;
    console.log("🔌 Database connected");
  }

  disconnect() {
    this.isConnected = false;
    console.log("🔌 Database disconnected");
  }

  insert(key, value) {
    if (!this.isConnected) throw new Error("Database not connected");
    this.data.set(key, value);
    console.log(`➕ Inserted: ${key} = ${value}`);
  }

  update(key, value) {
    if (!this.isConnected) throw new Error("Database not connected");
    const oldValue = this.data.get(key);
    this.data.set(key, value);
    console.log(`🔄 Updated: ${key} = ${value} (was ${oldValue})`);
    return oldValue;
  }

  delete(key) {
    if (!this.isConnected) throw new Error("Database not connected");
    const value = this.data.get(key);
    this.data.delete(key);
    console.log(`❌ Deleted: ${key}`);
    return value;
  }

  get(key) {
    return this.data.get(key);
  }
}

class InsertCommand extends Command {
  constructor(db, key, value) {
    super();
    this.db = db;
    this.key = key;
    this.value = value;
  }

  execute() {
    this.db.insert(this.key, this.value);
  }

  undo() {
    this.db.delete(this.key);
  }
}

class UpdateCommand extends Command {
  constructor(db, key, value) {
    super();
    this.db = db;
    this.key = key;
    this.value = value;
    this.oldValue = null;
  }

  execute() {
    this.oldValue = this.db.update(this.key, this.value);
  }

  undo() {
    if (this.oldValue !== null) {
      this.db.update(this.key, this.oldValue);
    }
  }
}

class DeleteCommand extends Command {
  constructor(db, key) {
    super();
    this.db = db;
    this.key = key;
    this.deletedValue = null;
  }

  execute() {
    this.deletedValue = this.db.delete(this.key);
  }

  undo() {
    if (this.deletedValue !== null) {
      this.db.insert(this.key, this.deletedValue);
    }
  }
}

class Transaction {
  constructor(db) {
    this.db = db;
    this.commands = [];
  }

  addCommand(command) {
    this.commands.push(command);
  }

  execute() {
    console.log("\n💾 Starting transaction...");
    try {
      this.commands.forEach(command => command.execute());
      console.log("✅ Transaction completed successfully");
    } catch (error) {
      console.log("❌ Transaction failed, rolling back...");
      this.rollback();
      throw error;
    }
  }

  rollback() {
    console.log("🔄 Rolling back transaction...");
    for (let i = this.commands.length - 1; i >= 0; i--) {
      try {
        this.commands[i].undo();
      } catch (error) {
        console.log(`⚠️ Error during rollback: ${error.message}`);
      }
    }
    console.log("✅ Rollback completed");
  }
}

// Usage
const db = new DatabaseConnection();
db.connect();

const transaction = new Transaction(db);
transaction.addCommand(new InsertCommand(db, "user1", "John Doe"));
transaction.addCommand(new InsertCommand(db, "user2", "Jane Smith"));
transaction.addCommand(new UpdateCommand(db, "user1", "John Smith"));

transaction.execute();

// Simulate transaction rollback
console.log("\n🔄 Testing rollback...");
transaction.rollback();
```

## ✅ Pros

- **Decoupling**: Decouples objects that invoke operations from objects that perform them
- **Undo Support**: Easy to implement undo/redo functionality
- **Macro Commands**: You can combine simple commands into complex ones
- **Queuing**: Commands can be queued, logged, or executed later
- **Remote Execution**: Commands can be sent over a network
- **Logging**: All operations can be logged for auditing

## ❌ Cons

- **Code Complexity**: Can make code more complex with many small classes
- **Memory Usage**: Each command is a separate object, increasing memory usage
- **Performance**: Extra layer of abstraction can impact performance
- **Over-Engineering**: May be overkill for simple operations

## 🎯 When to Use

- **Undo/Redo Operations**: When you need to implement undo and redo functionality
- **Queuing Operations**: When you need to queue, schedule, or log operations
- **Remote Procedure Calls**: When you need to send commands over a network
- **Macro Operations**: When you need to combine multiple operations
- **Transactional Systems**: When you need to support transaction rollback
- **GUI Applications**: For decoupling UI elements from business logic

## 🔄 Variations

### 1. **Smart Commands (with Receiver)**
Commands that know how to perform operations themselves.

### 2. **Simple Commands (without Receiver)**
Commands that delegate work to receivers.

### 3. **Parameterized Commands**
```javascript
class ParameterizedCommand extends Command {
  constructor(receiver, method, params) {
    super();
    this.receiver = receiver;
    this.method = method;
    this.params = params;
  }

  execute() {
    return this.receiver[this.method](...this.params);
  }
}
```

### 4. **Async Commands**
```javascript
class AsyncCommand extends Command {
  async execute() {
    // Async operation
    await this.performAsyncOperation();
  }

  async undo() {
    // Async undo operation
    await this.undoAsyncOperation();
  }
}
```

## 🔗 Related Patterns

- **Strategy**: Both encapsulate algorithms, but Command focuses on requests while Strategy focuses on algorithms
- **Memento**: Often used together for implementing undo functionality
- **Composite**: Macro commands are often implemented using the Composite pattern
- **Observer**: Commands can notify observers when executed

## 📚 Further Reading

- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [Command Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/command)
- [JavaScript Command Pattern](https://www.dofactory.com/javascript/design-patterns/command)
