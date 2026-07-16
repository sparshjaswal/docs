# State Pattern 🎛️

> **Definition**: The State pattern allows an object to alter its behavior when its internal state changes. The object will appear to change its class.

## 🎯 Intent

Allow an object to alter its behavior when its internal state changes. The object will appear to change its class. This pattern encapsulates state-specific behavior and makes state transitions explicit.

## 🤔 Problem

Objects often need to change their behavior based on their internal state:
- **Complex Conditionals**: Many if/else or switch statements based on state
- **State-Dependent Behavior**: Different behavior for the same method in different states
- **State Transitions**: Complex rules for when states can change
- **Maintenance Issues**: Adding new states requires modifying existing code

Conditional logic becomes unwieldy and error-prone as the number of states grows.

## 💡 Solution

The State pattern suggests creating separate classes for each state and extracting all state-specific behavior into these classes. The original object (context) maintains a reference to one of the state objects and delegates state-specific work to it.

## 🏗️ Structure

```
Context
├── -state: State
├── +setState(state: State): void
├── +request(): void → state.handle(this)

State (abstract)
└── +handle(context: Context): void

ConcreteStateA, ConcreteStateB implement State
├── +handle(context: Context): void → do work + context.setState(new ConcreteStateB())
```

## 💻 Simple Example

### Media Player States

```javascript
// Abstract State
class PlayerState {
  constructor() {
    if (this.constructor === PlayerState) {
      throw new Error("PlayerState is abstract and cannot be instantiated");
    }
  }

  play(player) {
    throw new Error("play() method must be implemented");
  }

  pause(player) {
    throw new Error("pause() method must be implemented");
  }

  stop(player) {
    throw new Error("stop() method must be implemented");
  }

  next(player) {
    throw new Error("next() method must be implemented");
  }

  previous(player) {
    throw new Error("previous() method must be implemented");
  }
}

// Concrete State - Stopped
class StoppedState extends PlayerState {
  play(player) {
    console.log("▶️ Starting playback from beginning");
    player.startPlayback();
    player.setState(new PlayingState());
  }

  pause(player) {
    console.log("⏸️ Cannot pause - player is stopped");
  }

  stop(player) {
    console.log("⏹️ Already stopped");
  }

  next(player) {
    console.log("⏭️ Skipping to next track");
    player.nextTrack();
    // Stay in stopped state
  }

  previous(player) {
    console.log("⏮️ Going to previous track");
    player.previousTrack();
    // Stay in stopped state
  }

  toString() {
    return "Stopped";
  }
}

// Concrete State - Playing
class PlayingState extends PlayerState {
  play(player) {
    console.log("▶️ Already playing");
  }

  pause(player) {
    console.log("⏸️ Pausing playback");
    player.pausePlayback();
    player.setState(new PausedState());
  }

  stop(player) {
    console.log("⏹️ Stopping playback");
    player.stopPlayback();
    player.setState(new StoppedState());
  }

  next(player) {
    console.log("⏭️ Skipping to next track");
    player.nextTrack();
    player.startPlayback();
    // Stay in playing state
  }

  previous(player) {
    console.log("⏮️ Going to previous track");
    player.previousTrack();
    player.startPlayback();
    // Stay in playing state
  }

  toString() {
    return "Playing";
  }
}

// Concrete State - Paused
class PausedState extends PlayerState {
  play(player) {
    console.log("▶️ Resuming playback");
    player.resumePlayback();
    player.setState(new PlayingState());
  }

  pause(player) {
    console.log("⏸️ Already paused");
  }

  stop(player) {
    console.log("⏹️ Stopping playback");
    player.stopPlayback();
    player.setState(new StoppedState());
  }

  next(player) {
    console.log("⏭️ Skipping to next track");
    player.nextTrack();
    player.setState(new StoppedState());
  }

  previous(player) {
    console.log("⏮️ Going to previous track");
    player.previousTrack();
    player.setState(new StoppedState());
  }

  toString() {
    return "Paused";
  }
}

// Context - Media Player
class MediaPlayer {
  constructor() {
    this.state = new StoppedState();
    this.currentTrack = 0;
    this.playlist = [
      "Song 1 - Artist A",
      "Song 2 - Artist B",
      "Song 3 - Artist C",
      "Song 4 - Artist D"
    ];
    this.volume = 50;
    this.playbackPosition = 0;
  }

  setState(state) {
    console.log(`🔄 State changed: ${this.state} → ${state}`);
    this.state = state;
  }

  // Delegate to current state
  play() {
    console.log(`\n📱 User pressed PLAY`);
    this.state.play(this);
  }

  pause() {
    console.log(`\n📱 User pressed PAUSE`);
    this.state.pause(this);
  }

  stop() {
    console.log(`\n📱 User pressed STOP`);
    this.state.stop(this);
  }

  next() {
    console.log(`\n📱 User pressed NEXT`);
    this.state.next(this);
  }

  previous() {
    console.log(`\n📱 User pressed PREVIOUS`);
    this.state.previous(this);
  }

  // Internal methods called by states
  startPlayback() {
    console.log(`🎵 Playing: ${this.getCurrentTrack()}`);
    this.playbackPosition = 0;
  }

  pausePlayback() {
    console.log(`⏸️ Playback paused at ${this.formatPosition(this.playbackPosition)}`);
  }

  resumePlayback() {
    console.log(`▶️ Resuming: ${this.getCurrentTrack()} from ${this.formatPosition(this.playbackPosition)}`);
  }

  stopPlayback() {
    console.log(`⏹️ Playback stopped`);
    this.playbackPosition = 0;
  }

  nextTrack() {
    if (this.currentTrack < this.playlist.length - 1) {
      this.currentTrack++;
    } else {
      this.currentTrack = 0; // Loop to beginning
    }
    console.log(`⏭️ Current track: ${this.getCurrentTrack()}`);
    this.playbackPosition = 0;
  }

  previousTrack() {
    if (this.currentTrack > 0) {
      this.currentTrack--;
    } else {
      this.currentTrack = this.playlist.length - 1; // Loop to end
    }
    console.log(`⏮️ Current track: ${this.getCurrentTrack()}`);
    this.playbackPosition = 0;
  }

  getCurrentTrack() {
    return this.playlist[this.currentTrack];
  }

  formatPosition(position) {
    const minutes = Math.floor(position / 60);
    const seconds = position % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getStatus() {
    console.log(`📊 Media Player Status:`);
    console.log(`   State: ${this.state}`);
    console.log(`   Track: ${this.currentTrack + 1}/${this.playlist.length} - ${this.getCurrentTrack()}`);
    console.log(`   Volume: ${this.volume}%`);
    console.log(`   Position: ${this.formatPosition(this.playbackPosition)}`);
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(100, volume));
    console.log(`🔊 Volume set to ${this.volume}%`);
  }

  // Simulate playback progress
  simulatePlayback(seconds) {
    if (this.state instanceof PlayingState) {
      this.playbackPosition += seconds;
      console.log(`⏱️ Playback progress: ${this.formatPosition(this.playbackPosition)}`);
    }
  }
}

// Usage
console.log("=== Media Player State Demo ===\n");

console.log("Creating media player:");
console.log("-".repeat(23));

const player = new MediaPlayer();
player.getStatus();

console.log("\n" + "=".repeat(50) + "\n");

console.log("Testing player controls:");
console.log("-".repeat(25));

// Test various state transitions
player.play();      // Stopped → Playing
player.getStatus();

player.pause();     // Playing → Paused
player.getStatus();

player.play();      // Paused → Playing
player.getStatus();

player.next();      // Stay in Playing, change track
player.getStatus();

player.stop();      // Playing → Stopped
player.getStatus();

console.log("\n" + "-".repeat(40) + "\n");

console.log("Testing invalid operations:");
console.log("-".repeat(28));

player.pause();     // Already stopped
player.stop();      // Already stopped
player.next();      // Change track while stopped
player.play();      // Start playing new track
player.play();      // Already playing

console.log("\n" + "=".repeat(50) + "\n");

console.log("Simulating user session:");
console.log("-".repeat(25));

player.stop();
player.previous();  // Go to previous track
player.play();      // Start playing
player.simulatePlayback(30); // Simulate 30 seconds
player.pause();     // Pause
player.simulatePlayback(10); // Try to progress while paused (won't work)
player.play();      // Resume
player.simulatePlayback(20); // Continue playback
player.next();      // Next track
player.getStatus();
```

## 🌟 Real-World Example

### Document Workflow System

```javascript
// Abstract Document State
class DocumentState {
  constructor() {
    if (this.constructor === DocumentState) {
      throw new Error("DocumentState is abstract");
    }
  }

  edit(document) { this.invalidOperation("edit"); }
  submit(document) { this.invalidOperation("submit"); }
  approve(document) { this.invalidOperation("approve"); }
  reject(document) { this.invalidOperation("reject"); }
  publish(document) { this.invalidOperation("publish"); }
  archive(document) { this.invalidOperation("archive"); }

  invalidOperation(operation) {
    console.log(`❌ Cannot ${operation} document in ${this.constructor.name} state`);
  }

  logTransition(document, newState) {
    console.log(`📋 Document "${document.title}" transitioned: ${this.constructor.name} → ${newState.constructor.name}`);
    document.addToHistory(`State changed to ${newState.constructor.name}`, document.currentUser);
  }
}

// Concrete States
class DraftState extends DocumentState {
  edit(document) {
    console.log(`✏️ Editing document: ${document.title}`);
    document.lastModified = new Date();
    document.addToHistory("Document edited", document.currentUser);
  }

  submit(document) {
    if (document.content.trim().length === 0) {
      console.log(`❌ Cannot submit empty document`);
      return;
    }

    console.log(`📤 Submitting document for review: ${document.title}`);
    document.submittedAt = new Date();
    const newState = new UnderReviewState();
    this.logTransition(document, newState);
    document.setState(newState);
  }

  archive(document) {
    console.log(`🗄️ Archiving draft document: ${document.title}`);
    const newState = new ArchivedState();
    this.logTransition(document, newState);
    document.setState(newState);
  }
}

class UnderReviewState extends DocumentState {
  approve(document) {
    console.log(`✅ Approving document: ${document.title}`);
    document.approvedAt = new Date();
    document.approver = document.currentUser;

    const newState = new ApprovedState();
    this.logTransition(document, newState);
    document.setState(newState);
  }

  reject(document) {
    console.log(`❌ Rejecting document: ${document.title}`);
    document.rejectedAt = new Date();
    document.rejectedBy = document.currentUser;

    const newState = new RejectedState();
    this.logTransition(document, newState);
    document.setState(newState);
  }
}

class ApprovedState extends DocumentState {
  publish(document) {
    console.log(`🌐 Publishing document: ${document.title}`);
    document.publishedAt = new Date();
    document.publisher = document.currentUser;

    const newState = new PublishedState();
    this.logTransition(document, newState);
    document.setState(newState);
  }

  reject(document) {
    console.log(`❌ Rejecting approved document: ${document.title} (requires re-approval)`);
    const newState = new RejectedState();
    this.logTransition(document, newState);
    document.setState(newState);
  }
}

class RejectedState extends DocumentState {
  edit(document) {
    console.log(`✏️ Editing rejected document: ${document.title} (back to draft)`);
    document.lastModified = new Date();

    const newState = new DraftState();
    this.logTransition(document, newState);
    document.setState(newState);
    document.addToHistory("Document edited after rejection", document.currentUser);
  }

  archive(document) {
    console.log(`🗄️ Archiving rejected document: ${document.title}`);
    const newState = new ArchivedState();
    this.logTransition(document, newState);
    document.setState(newState);
  }
}

class PublishedState extends DocumentState {
  archive(document) {
    console.log(`🗄️ Archiving published document: ${document.title}`);
    const newState = new ArchivedState();
    this.logTransition(document, newState);
    document.setState(newState);
  }

  edit(document) {
    console.log(`✏️ Creating new version of published document: ${document.title}`);
    document.version++;
    document.lastModified = new Date();

    const newState = new DraftState();
    this.logTransition(document, newState);
    document.setState(newState);
    document.addToHistory(`New version ${document.version} created`, document.currentUser);
  }
}

class ArchivedState extends DocumentState {
  // No operations allowed on archived documents
  edit(document) {
    console.log(`❌ Cannot edit archived document. Create a new version instead.`);
  }

  submit(document) { this.invalidOperation("submit"); }
  approve(document) { this.invalidOperation("approve"); }
  reject(document) { this.invalidOperation("reject"); }
  publish(document) { this.invalidOperation("publish"); }
  archive(document) {
    console.log(`📁 Document already archived`);
  }
}

// Context - Document
class Document {
  constructor(title, author) {
    this.title = title;
    this.author = author;
    this.content = "";
    this.version = 1;
    this.state = new DraftState();
    this.currentUser = author;
    this.createdAt = new Date();
    this.lastModified = new Date();
    this.history = [];

    // Workflow timestamps
    this.submittedAt = null;
    this.approvedAt = null;
    this.rejectedAt = null;
    this.publishedAt = null;

    // Workflow users
    this.approver = null;
    this.rejectedBy = null;
    this.publisher = null;

    this.addToHistory("Document created", author);
    console.log(`📄 Created new document: "${title}" by ${author}`);
  }

  setState(state) {
    this.state = state;
  }

  setCurrentUser(user) {
    this.currentUser = user;
    console.log(`👤 Current user changed to: ${user}`);
  }

  setContent(content) {
    this.content = content;
    this.lastModified = new Date();
    console.log(`📝 Content updated for: ${this.title}`);
  }

  // Delegate to current state
  edit() {
    this.state.edit(this);
  }

  submit() {
    this.state.submit(this);
  }

  approve() {
    this.state.approve(this);
  }

  reject() {
    this.state.reject(this);
  }

  publish() {
    this.state.publish(this);
  }

  archive() {
    this.state.archive(this);
  }

  addToHistory(action, user) {
    this.history.push({
      action,
      user,
      timestamp: new Date(),
      state: this.state.constructor.name
    });
  }

  getStatus() {
    console.log(`📊 Document Status: "${this.title}"`);
    console.log(`   Author: ${this.author}`);
    console.log(`   Version: ${this.version}`);
    console.log(`   State: ${this.state.constructor.name}`);
    console.log(`   Created: ${this.createdAt.toLocaleDateString()}`);
    console.log(`   Last Modified: ${this.lastModified.toLocaleDateString()}`);
    console.log(`   Current User: ${this.currentUser}`);

    if (this.submittedAt) console.log(`   Submitted: ${this.submittedAt.toLocaleDateString()}`);
    if (this.approvedAt) console.log(`   Approved: ${this.approvedAt.toLocaleDateString()} by ${this.approver}`);
    if (this.rejectedAt) console.log(`   Rejected: ${this.rejectedAt.toLocaleDateString()} by ${this.rejectedBy}`);
    if (this.publishedAt) console.log(`   Published: ${this.publishedAt.toLocaleDateString()} by ${this.publisher}`);
  }

  getHistory() {
    console.log(`📚 Document History: "${this.title}"`);
    this.history.forEach((entry, index) => {
      const time = entry.timestamp.toLocaleString();
      console.log(`   ${index + 1}. ${time} - ${entry.action} by ${entry.user} (${entry.state})`);
    });
  }

  getStateInfo() {
    const stateActions = {
      'DraftState': ['edit', 'submit', 'archive'],
      'UnderReviewState': ['approve', 'reject'],
      'ApprovedState': ['publish', 'reject'],
      'RejectedState': ['edit', 'archive'],
      'PublishedState': ['archive', 'edit (new version)'],
      'ArchivedState': []
    };

    const currentStateActions = stateActions[this.state.constructor.name] || [];

    console.log(`ℹ️ Available actions in ${this.state.constructor.name}:`);
    if (currentStateActions.length > 0) {
      currentStateActions.forEach(action => {
        console.log(`   • ${action}`);
      });
    } else {
      console.log(`   • No actions available`);
    }
  }
}

// Usage
console.log("\n=== Document Workflow State Demo ===\n");

console.log("Creating documents:");
console.log("-".repeat(19));

const doc1 = new Document("Product Requirements", "Alice");
const doc2 = new Document("API Documentation", "Bob");

doc1.setContent("This document outlines the product requirements...");
doc2.setContent("API documentation for the new service...");

console.log("\n" + "=".repeat(50) + "\n");

console.log("Document 1 workflow:");
console.log("-".repeat(21));

doc1.getStatus();
console.log();

doc1.edit();
doc1.submit();
doc1.getStatus();

console.log("\n" + "-".repeat(30) + "\n");

console.log("Reviewer actions:");
console.log("-".repeat(17));

doc1.setCurrentUser("Manager");
doc1.getStateInfo();
doc1.approve();
doc1.getStatus();

console.log("\n" + "-".repeat(30) + "\n");

console.log("Publisher actions:");
console.log("-".repeat(18));

doc1.setCurrentUser("Publisher");
doc1.publish();
doc1.getStatus();

console.log("\n" + "=".repeat(50) + "\n");

console.log("Document 2 workflow (with rejection):");
console.log("-".repeat(37));

doc2.edit();
doc2.submit();

doc2.setCurrentUser("Reviewer");
doc2.reject();
doc2.getStatus();

console.log("\n" + "-".repeat(30) + "\n");

doc2.setCurrentUser("Bob");
doc2.edit();
doc2.setContent("Updated API documentation with better examples...");
doc2.submit();

doc2.setCurrentUser("Reviewer");
doc2.approve();
doc2.publish();

console.log("\n" + "=".repeat(50) + "\n");

console.log("Testing invalid operations:");
console.log("-".repeat(29));

doc1.submit(); // Already published
doc1.approve(); // Already published
doc2.edit(); // Will create new version

console.log("\n" + "=".repeat(50) + "\n");

console.log("Document histories:");
console.log("-".repeat(19));

console.log("Document 1:");
doc1.getHistory();

console.log("\nDocument 2:");
doc2.getHistory();

console.log("\n" + "-".repeat(30) + "\n");

console.log("Final archiving:");
console.log("-".repeat(16));

doc1.setCurrentUser("Admin");
doc1.archive();

doc2.setCurrentUser("Admin");
doc2.archive();

console.log("\nTrying operations on archived documents:");
doc1.edit();
doc2.publish();
```

## ✅ Pros

- **Clean Code**: Eliminates complex conditional logic
- **Open/Closed**: Easy to add new states without modifying existing code
- **Single Responsibility**: Each state class has one responsibility
- **Explicit Transitions**: State transitions are explicit and clear
- **Maintainable**: Easy to understand and modify state-specific behavior

## ❌ Cons

- **Increased Classes**: Can result in many small classes
- **Complexity**: May be overkill for simple state machines
- **State Sharing**: Difficult to share data between states
- **Memory**: Each state object consumes memory

## 🎯 When to Use

- **State-Dependent Behavior**: Object behavior depends heavily on its state
- **Complex Conditionals**: Many if/else statements based on state
- **State Machines**: Implementing finite state machines
- **Workflow Systems**: Document approval, order processing workflows
- **Game States**: Game menus, player states, game phases

## 🔄 State Pattern Variations

### 1. **Singleton States**
```javascript
class SingletonState extends PlayerState {
  constructor() {
    if (SingletonState.instance) {
      return SingletonState.instance;
    }
    super();
    SingletonState.instance = this;
  }

  static getInstance() {
    if (!SingletonState.instance) {
      SingletonState.instance = new SingletonState();
    }
    return SingletonState.instance;
  }
}
```

### 2. **State with Data**
```javascript
class StateWithData extends PlayerState {
  constructor(data) {
    super();
    this.stateData = data;
  }

  handle(context) {
    // Use this.stateData in state logic
    context.processWithData(this.stateData);
  }
}
```

### 3. **Hierarchical States**
```javascript
class ParentState extends PlayerState {
  constructor() {
    super();
    this.subStates = new Map();
    this.currentSubState = null;
  }

  handle(context) {
    if (this.currentSubState) {
      this.currentSubState.handle(context);
    } else {
      this.defaultHandle(context);
    }
  }
}
```

## 🔗 Related Patterns

- **Strategy**: Both encapsulate algorithms/behavior, but State changes behavior based on internal state while Strategy is chosen by client
- **Command**: State transitions can be implemented as commands
- **Singleton**: States are often implemented as singletons
- **Flyweight**: Can be used to share state objects efficiently

## 📚 Further Reading

- [State Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/state)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [Finite State Machines](https://en.wikipedia.org/wiki/Finite-state_machine)
