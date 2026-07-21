---
id: design-pattern-behavioral-memento
title: Memento Pattern 💾
slug: /design-pattern/behavioral/memento
sidebar_label: Memento Pattern 💾
---

# Memento Pattern 💾

> **Definition**: The Memento pattern captures and stores the internal state of an object without violating encapsulation, so that the object can be restored to this state later.

## 🎯 Intent

Without violating encapsulation, capture and externalize an object's internal state so that the object can be restored to this state later. This is useful for implementing undo/redo functionality.

## 🤔 Problem

You need to save and restore object states, but:

- **Encapsulation**: Direct access to object's private state breaks encapsulation
- **Undo/Redo**: Need to implement undo/redo functionality
- **Snapshots**: Want to create snapshots of object state at different points
- **State History**: Need to maintain history of state changes

Making object state public breaks encapsulation, but you need access to save/restore it.

## 💡 Solution

The Memento pattern suggests storing the object's state in a special object called a memento. The memento is only accessible to the object that created it (originator), maintaining encapsulation while allowing state restoration.

## 🏗️ Structure

```
Originator
├── -state: any
├── +createMemento(): Memento
├── +restore(memento: Memento): void
└── +setState(state): void

Memento
├── -state: any
├── +constructor(state: any)
└── +getState(): any (only accessible to Originator)

Caretaker
├── -mementos: Memento[]
├── +backup(originator: Originator): void
├── +undo(originator: Originator): void
└── +showHistory(): void
```

## 💻 Simple Example

### Text Editor with Undo/Redo

```javascript
// Memento - stores the state
class TextMemento {
  constructor(content, cursorPosition, selectionStart, selectionEnd) {
    this._content = content;
    this._cursorPosition = cursorPosition;
    this._selectionStart = selectionStart;
    this._selectionEnd = selectionEnd;
    this._timestamp = new Date();
  }

  // Private state access - only TextEditor can access these
  getContent() {
    return this._content;
  }

  getCursorPosition() {
    return this._cursorPosition;
  }

  getSelectionStart() {
    return this._selectionStart;
  }

  getSelectionEnd() {
    return this._selectionEnd;
  }

  getTimestamp() {
    return this._timestamp;
  }

  getPreview() {
    const preview = this._content.substring(0, 50);
    return preview + (this._content.length > 50 ? '...' : '');
  }
}

// Originator - creates and restores mementos
class TextEditor {
  constructor() {
    this.content = '';
    this.cursorPosition = 0;
    this.selectionStart = 0;
    this.selectionEnd = 0;
    this.filename = 'Untitled.txt';
  }

  // Create memento with current state
  createMemento() {
    console.log(`💾 Creating backup of current state`);
    return new TextMemento(
      this.content,
      this.cursorPosition,
      this.selectionStart,
      this.selectionEnd,
    );
  }

  // Restore state from memento
  restore(memento) {
    console.log(`🔄 Restoring state from ${memento.getTimestamp().toLocaleTimeString()}`);
    this.content = memento.getContent();
    this.cursorPosition = memento.getCursorPosition();
    this.selectionStart = memento.getSelectionStart();
    this.selectionEnd = memento.getSelectionEnd();

    console.log(`✅ State restored: "${memento.getPreview()}"`);
  }

  // Editor operations
  type(text) {
    // Insert text at cursor position
    const before = this.content.substring(0, this.cursorPosition);
    const after = this.content.substring(this.cursorPosition);

    this.content = before + text + after;
    this.cursorPosition += text.length;

    console.log(`⌨️ Typed: "${text}" at position ${this.cursorPosition - text.length}`);
    this.displayState();
  }

  delete(count = 1) {
    if (this.cursorPosition > 0) {
      const deleteCount = Math.min(count, this.cursorPosition);
      const before = this.content.substring(0, this.cursorPosition - deleteCount);
      const after = this.content.substring(this.cursorPosition);

      this.content = before + after;
      this.cursorPosition -= deleteCount;

      console.log(`🗑️ Deleted ${deleteCount} character(s)`);
      this.displayState();
    }
  }

  selectText(start, end) {
    this.selectionStart = Math.max(0, Math.min(start, this.content.length));
    this.selectionEnd = Math.max(this.selectionStart, Math.min(end, this.content.length));

    const selectedText = this.content.substring(this.selectionStart, this.selectionEnd);
    console.log(`🎯 Selected: "${selectedText}" (${this.selectionStart}-${this.selectionEnd})`);
  }

  replaceSelection(text) {
    if (this.selectionStart !== this.selectionEnd) {
      const before = this.content.substring(0, this.selectionStart);
      const after = this.content.substring(this.selectionEnd);

      this.content = before + text + after;
      this.cursorPosition = this.selectionStart + text.length;
      this.selectionStart = this.selectionEnd = this.cursorPosition;

      console.log(`🔄 Replaced selection with: "${text}"`);
      this.displayState();
    }
  }

  moveCursor(position) {
    this.cursorPosition = Math.max(0, Math.min(position, this.content.length));
    console.log(`🖱️ Cursor moved to position ${this.cursorPosition}`);
  }

  displayState() {
    const preview = this.content.substring(0, 80);
    const displayContent = preview + (this.content.length > 80 ? '...' : '');

    console.log(`📄 Current content: "${displayContent}"`);
    console.log(`   Length: ${this.content.length}, Cursor: ${this.cursorPosition}`);

    if (this.selectionStart !== this.selectionEnd) {
      console.log(`   Selection: ${this.selectionStart}-${this.selectionEnd}`);
    }
  }

  getStats() {
    const wordCount = this.content.trim() ? this.content.trim().split(/\s+/).length : 0;
    const lineCount = this.content.split('\n').length;

    return {
      characters: this.content.length,
      words: wordCount,
      lines: lineCount,
      cursorPosition: this.cursorPosition,
    };
  }
}

// Caretaker - manages mementos
class EditorHistory {
  constructor(maxHistory = 50) {
    this.history = [];
    this.currentIndex = -1;
    this.maxHistory = maxHistory;
  }

  // Save current state
  backup(editor) {
    const memento = editor.createMemento();

    // Remove any forward history if we're not at the end
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    // Add new memento
    this.history.push(memento);
    this.currentIndex++;

    // Keep history within limits
    if (this.history.length > this.maxHistory) {
      this.history.shift();
      this.currentIndex--;
    }

    console.log(`💾 Backup created (${this.currentIndex + 1}/${this.history.length})`);
  }

  // Undo last operation
  undo(editor) {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      const memento = this.history[this.currentIndex];
      editor.restore(memento);

      console.log(`↶ Undo successful (${this.currentIndex + 1}/${this.history.length})`);
      return true;
    } else {
      console.log(`❌ No more operations to undo`);
      return false;
    }
  }

  // Redo next operation
  redo(editor) {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      const memento = this.history[this.currentIndex];
      editor.restore(memento);

      console.log(`↷ Redo successful (${this.currentIndex + 1}/${this.history.length})`);
      return true;
    } else {
      console.log(`❌ No more operations to redo`);
      return false;
    }
  }

  // Show history
  showHistory() {
    console.log(`📚 Editor History (${this.history.length} states):`);
    console.log(`   Current position: ${this.currentIndex + 1}/${this.history.length}`);

    this.history.forEach((memento, index) => {
      const marker = index === this.currentIndex ? '→' : ' ';
      const time = memento.getTimestamp().toLocaleTimeString();
      const preview = memento.getPreview();

      console.log(`   ${marker} ${index + 1}. ${time} - "${preview}"`);
    });
  }

  // Clear history
  clearHistory() {
    const clearedCount = this.history.length;
    this.history = [];
    this.currentIndex = -1;

    console.log(`🗑️ Cleared ${clearedCount} history states`);
  }

  canUndo() {
    return this.currentIndex > 0;
  }

  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }
}

// Usage
console.log('=== Text Editor Memento Demo ===\n');

console.log('Creating text editor:');
console.log('-'.repeat(20));

const editor = new TextEditor();
const history = new EditorHistory();

// Initial backup
history.backup(editor);

console.log('Starting to type:');
console.log('-'.repeat(17));

editor.type('Hello');
history.backup(editor);

editor.type(' World');
history.backup(editor);

editor.type('!');
history.backup(editor);

console.log('\n' + '='.repeat(50) + '\n');

console.log('Making some edits:');
console.log('-'.repeat(18));

editor.selectText(6, 11); // Select "World"
history.backup(editor);

editor.replaceSelection('JavaScript');
history.backup(editor);

editor.type(' Programming');
history.backup(editor);

console.log('\n' + '='.repeat(50) + '\n');

console.log('History overview:');
console.log('-'.repeat(16));

history.showHistory();

console.log('\n' + '='.repeat(50) + '\n');

console.log('Testing undo operations:');
console.log('-'.repeat(25));

// Undo several operations
history.undo(editor);
console.log();

history.undo(editor);
console.log();

history.undo(editor);

console.log('\nAfter undos:');
console.log('-'.repeat(12));
editor.displayState();

console.log('\n' + '-'.repeat(30) + '\n');

console.log('Testing redo operations:');
console.log('-'.repeat(25));

history.redo(editor);
console.log();

history.redo(editor);

console.log('\nAfter redos:');
console.log('-'.repeat(12));
editor.displayState();

console.log('\n' + '='.repeat(50) + '\n');

console.log('Final editor statistics:');
console.log('-'.repeat(25));

const stats = editor.getStats();
console.log(`📊 Editor Stats:`);
console.log(`   Characters: ${stats.characters}`);
console.log(`   Words: ${stats.words}`);
console.log(`   Lines: ${stats.lines}`);
console.log(`   Cursor Position: ${stats.cursorPosition}`);

console.log(
  `\n🕒 History: ${history.canUndo() ? 'Can undo' : 'Cannot undo'}, ${history.canRedo() ? 'Can redo' : 'Cannot redo'}`,
);
```

## 🌟 Real-World Example

### Game Save System

```javascript
// Memento for game state
class GameSaveMemento {
  constructor(gameState) {
    this._playerData = { ...gameState.playerData };
    this._gameWorld = { ...gameState.gameWorld };
    this._inventory = [...gameState.inventory];
    this._achievements = [...gameState.achievements];
    this._settings = { ...gameState.settings };
    this._timestamp = new Date();
    this._saveVersion = '1.0.0';
  }

  getPlayerData() {
    return this._playerData;
  }
  getGameWorld() {
    return this._gameWorld;
  }
  getInventory() {
    return this._inventory;
  }
  getAchievements() {
    return this._achievements;
  }
  getSettings() {
    return this._settings;
  }
  getTimestamp() {
    return this._timestamp;
  }
  getSaveVersion() {
    return this._saveVersion;
  }

  getSaveInfo() {
    return {
      playerLevel: this._playerData.level,
      location: this._gameWorld.currentLocation,
      playTime: this._playerData.totalPlayTime,
      timestamp: this._timestamp,
    };
  }
}

// Game state originator
class GameEngine {
  constructor() {
    this.playerData = {
      name: 'Player',
      level: 1,
      health: 100,
      mana: 50,
      experience: 0,
      gold: 100,
      totalPlayTime: 0,
    };

    this.gameWorld = {
      currentLocation: 'Starting Village',
      visitedLocations: ['Starting Village'],
      completedQuests: [],
      worldSeed: Math.random(),
    };

    this.inventory = [
      { name: 'Wooden Sword', type: 'weapon', damage: 10 },
      { name: 'Health Potion', type: 'consumable', quantity: 3 },
    ];

    this.achievements = [];

    this.settings = {
      difficulty: 'normal',
      soundVolume: 0.8,
      musicVolume: 0.6,
      graphics: 'medium',
    };

    this.sessionStartTime = Date.now();
  }

  // Create save memento
  createSave(saveSlotName) {
    // Update play time
    this.updatePlayTime();

    console.log(`💾 Creating game save: ${saveSlotName}`);
    console.log(`   Location: ${this.gameWorld.currentLocation}`);
    console.log(`   Level: ${this.playerData.level}`);
    console.log(`   Play Time: ${this.formatPlayTime(this.playerData.totalPlayTime)}`);

    return new GameSaveMemento({
      playerData: this.playerData,
      gameWorld: this.gameWorld,
      inventory: this.inventory,
      achievements: this.achievements,
      settings: this.settings,
    });
  }

  // Load from save memento
  loadSave(memento) {
    console.log(`🔄 Loading game save from ${memento.getTimestamp().toLocaleString()}`);

    this.playerData = { ...memento.getPlayerData() };
    this.gameWorld = { ...memento.getGameWorld() };
    this.inventory = [...memento.getInventory()];
    this.achievements = [...memento.getAchievements()];
    this.settings = { ...memento.getSettings() };

    this.sessionStartTime = Date.now();

    console.log(`✅ Game loaded successfully`);
    console.log(`   Player: ${this.playerData.name} (Level ${this.playerData.level})`);
    console.log(`   Location: ${this.gameWorld.currentLocation}`);
    console.log(`   Total Play Time: ${this.formatPlayTime(this.playerData.totalPlayTime)}`);
  }

  // Game actions that modify state
  levelUp() {
    this.playerData.level++;
    this.playerData.health += 20;
    this.playerData.mana += 10;
    this.playerData.experience = 0;

    console.log(`⬆️ Level Up! Now level ${this.playerData.level}`);

    if (this.playerData.level === 5) {
      this.unlockAchievement('Apprentice Adventurer');
    }
  }

  gainExperience(amount) {
    this.playerData.experience += amount;
    console.log(`✨ Gained ${amount} XP (${this.playerData.experience}/100)`);

    if (this.playerData.experience >= 100) {
      this.levelUp();
    }
  }

  moveToLocation(location) {
    this.gameWorld.currentLocation = location;

    if (!this.gameWorld.visitedLocations.includes(location)) {
      this.gameWorld.visitedLocations.push(location);
      console.log(`🗺️ Discovered new location: ${location}`);

      if (this.gameWorld.visitedLocations.length >= 5) {
        this.unlockAchievement('Explorer');
      }
    } else {
      console.log(`🚶 Moved to: ${location}`);
    }
  }

  addToInventory(item) {
    // Check if item already exists (for stackable items)
    const existingItem = this.inventory.find((i) => i.name === item.name && i.type === item.type);

    if (existingItem && item.quantity) {
      existingItem.quantity = (existingItem.quantity || 1) + (item.quantity || 1);
      console.log(`📦 Added ${item.name} x${item.quantity || 1} to inventory`);
    } else {
      this.inventory.push(item);
      console.log(`📦 Added ${item.name} to inventory`);
    }
  }

  completeQuest(questName) {
    if (!this.gameWorld.completedQuests.includes(questName)) {
      this.gameWorld.completedQuests.push(questName);
      console.log(`✅ Quest completed: ${questName}`);

      // Reward
      this.gainExperience(25);
      this.playerData.gold += 50;

      if (this.gameWorld.completedQuests.length >= 3) {
        this.unlockAchievement('Quest Master');
      }
    }
  }

  unlockAchievement(achievementName) {
    if (!this.achievements.includes(achievementName)) {
      this.achievements.push(achievementName);
      console.log(`🏆 Achievement Unlocked: ${achievementName}`);
    }
  }

  updatePlayTime() {
    const sessionTime = (Date.now() - this.sessionStartTime) / 1000;
    this.playerData.totalPlayTime += sessionTime;
    this.sessionStartTime = Date.now();
  }

  formatPlayTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  getGameStatus() {
    console.log(`🎮 Game Status:`);
    console.log(`   Player: ${this.playerData.name} (Level ${this.playerData.level})`);
    console.log(`   Health: ${this.playerData.health}/${this.playerData.health}`);
    console.log(`   Gold: ${this.playerData.gold}`);
    console.log(`   Location: ${this.gameWorld.currentLocation}`);
    console.log(`   Quests Completed: ${this.gameWorld.completedQuests.length}`);
    console.log(`   Achievements: ${this.achievements.length}`);
    console.log(`   Inventory Items: ${this.inventory.length}`);
    console.log(`   Play Time: ${this.formatPlayTime(this.playerData.totalPlayTime)}`);
  }
}

// Save manager (caretaker)
class SaveManager {
  constructor() {
    this.saveSlots = new Map();
    this.quickSaves = [];
    this.maxQuickSaves = 5;
    this.autoSaves = [];
    this.maxAutoSaves = 10;
  }

  // Manual save to named slot
  save(game, slotName) {
    const memento = game.createSave(slotName);
    this.saveSlots.set(slotName, memento);

    console.log(`💾 Game saved to slot: ${slotName}`);
    return memento;
  }

  // Load from named slot
  load(game, slotName) {
    if (this.saveSlots.has(slotName)) {
      const memento = this.saveSlots.get(slotName);
      game.loadSave(memento);
      console.log(`📁 Loaded save from slot: ${slotName}`);
      return true;
    } else {
      console.log(`❌ Save slot not found: ${slotName}`);
      return false;
    }
  }

  // Quick save
  quickSave(game) {
    const memento = game.createSave('QuickSave');
    this.quickSaves.push(memento);

    // Keep only recent quick saves
    if (this.quickSaves.length > this.maxQuickSaves) {
      this.quickSaves.shift();
    }

    console.log(`⚡ Quick save created (${this.quickSaves.length}/${this.maxQuickSaves})`);
    return memento;
  }

  // Quick load (most recent)
  quickLoad(game) {
    if (this.quickSaves.length > 0) {
      const memento = this.quickSaves[this.quickSaves.length - 1];
      game.loadSave(memento);
      console.log(`⚡ Quick load successful`);
      return true;
    } else {
      console.log(`❌ No quick saves available`);
      return false;
    }
  }

  // Auto save (triggered automatically)
  autoSave(game, trigger) {
    const memento = game.createSave(`AutoSave-${trigger}`);
    this.autoSaves.push({ memento, trigger, timestamp: new Date() });

    // Keep only recent auto saves
    if (this.autoSaves.length > this.maxAutoSaves) {
      this.autoSaves.shift();
    }

    console.log(
      `🤖 Auto save created (${trigger}) - ${this.autoSaves.length}/${this.maxAutoSaves}`,
    );
  }

  // List all saves
  listSaves() {
    console.log(`📚 Save Manager - All Saves:`);

    // Named saves
    if (this.saveSlots.size > 0) {
      console.log(`\n   Named Saves (${this.saveSlots.size}):`);
      for (const [name, memento] of this.saveSlots) {
        const info = memento.getSaveInfo();
        console.log(
          `     ${name}: Level ${info.playerLevel} at ${info.location} (${memento.getTimestamp().toLocaleString()})`,
        );
      }
    }

    // Quick saves
    if (this.quickSaves.length > 0) {
      console.log(`\n   Quick Saves (${this.quickSaves.length}):`);
      this.quickSaves.forEach((memento, index) => {
        const info = memento.getSaveInfo();
        console.log(
          `     ${index + 1}: Level ${info.playerLevel} at ${info.location} (${memento.getTimestamp().toLocaleString()})`,
        );
      });
    }

    // Auto saves
    if (this.autoSaves.length > 0) {
      console.log(`\n   Auto Saves (${this.autoSaves.length}):`);
      this.autoSaves.forEach((save, index) => {
        const info = save.memento.getSaveInfo();
        console.log(
          `     ${index + 1}: ${save.trigger} - Level ${info.playerLevel} (${save.timestamp.toLocaleString()})`,
        );
      });
    }
  }

  deleteSave(slotName) {
    if (this.saveSlots.has(slotName)) {
      this.saveSlots.delete(slotName);
      console.log(`🗑️ Deleted save: ${slotName}`);
      return true;
    } else {
      console.log(`❌ Save not found: ${slotName}`);
      return false;
    }
  }
}

// Usage
console.log('\n=== Game Save System Demo ===\n');

console.log('Starting new game:');
console.log('-'.repeat(18));

const game = new GameEngine();
const saveManager = new SaveManager();

game.getGameStatus();

console.log('\n' + '='.repeat(50) + '\n');

console.log('Playing the game:');
console.log('-'.repeat(17));

// Simulate gameplay
game.moveToLocation('Forest Path');
saveManager.autoSave(game, 'location-change');

game.gainExperience(30);
game.addToInventory({ name: 'Iron Sword', type: 'weapon', damage: 20 });

game.moveToLocation('Ancient Cave');
game.completeQuest('Explore the Cave');
saveManager.quickSave(game);

game.gainExperience(40);
game.addToInventory({ name: 'Magic Potion', type: 'consumable', quantity: 2 });

// Manual save
saveManager.save(game, 'Before Boss Fight');

console.log('\n' + '='.repeat(50) + '\n');

console.log('Current game state:');
console.log('-'.repeat(20));

game.getGameStatus();

console.log('\n' + '='.repeat(50) + '\n');

console.log('Save system overview:');
console.log('-'.repeat(22));

saveManager.listSaves();

console.log('\n' + '='.repeat(50) + '\n');

console.log('Simulating game over and reload:');
console.log('-'.repeat(35));

// Continue playing (simulate boss fight loss)
console.log('😵 Player died in boss fight!');
console.log('💀 Game Over\n');

// Load from previous save
console.log('Loading previous save...');
saveManager.load(game, 'Before Boss Fight');

console.log('\nGame state after reload:');
console.log('-'.repeat(25));
game.getGameStatus();
```

## ✅ Pros

- **Encapsulation**: Preserves object encapsulation while allowing state access
- **Undo/Redo**: Enables undo/redo functionality easily
- **State Snapshots**: Can create multiple snapshots at different points
- **Time Travel**: Can restore object to any previous state
- **Rollback**: Easy rollback on errors or failures

## ❌ Cons

- **Memory Usage**: Storing multiple states can consume significant memory
- **Performance**: Creating and storing mementos has overhead
- **Large Objects**: Expensive for objects with large state
- **Deep Copy Issues**: Complex objects may require deep copying

## 🎯 When to Use

- **Undo/Redo**: Need to implement undo/redo functionality
- **Snapshots**: Want to create checkpoints or snapshots
- **Rollback**: Need rollback capability for transactions
- **State History**: Need to maintain history of state changes
- **Error Recovery**: Want to restore state after errors

## 🔄 Memento Variations

### 1. **Command-based Memento**

```javascript
class CommandMemento {
  constructor(command) {
    this.command = command;
    this.timestamp = new Date();
  }

  undo() {
    return this.command.undo();
  }
}
```

### 2. **Incremental Memento**

```javascript
class IncrementalMemento {
  constructor(changes) {
    this.changes = changes; // Only store what changed
    this.timestamp = new Date();
  }

  apply(object) {
    Object.assign(object, this.changes);
  }
}
```

### 3. **Compressed Memento**

```javascript
class CompressedMemento {
  constructor(state) {
    this.compressedState = this.compress(state);
    this.timestamp = new Date();
  }

  compress(state) {
    return JSON.stringify(state); // Could use actual compression
  }

  decompress() {
    return JSON.parse(this.compressedState);
  }
}
```

## 🔗 Related Patterns

- **Command**: Both can implement undo, but Command undoes operations while Memento restores state
- **Iterator**: Can be used to traverse memento history
- **Prototype**: Can use cloning to create mementos
- **Caretaker Pattern**: Often used together to manage mementos

## 📚 Further Reading

- [Memento Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/memento)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [JavaScript Object Cloning for State Management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/structuredClone)
