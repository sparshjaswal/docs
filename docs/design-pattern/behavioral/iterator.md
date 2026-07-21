---
id: design-pattern-behavioral-iterator
title: "Iterator Pattern 🔄"
slug: /design-pattern/behavioral/iterator
sidebar_label: "Iterator Pattern 🔄"
---

# Iterator Pattern 🔄

> **Definition**: The Iterator pattern provides a way to access elements of a collection sequentially without exposing its underlying representation.

## 🎯 Intent

Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation. The iterator encapsulates the traversal logic.

## 🤔 Problem

You need to traverse a collection of objects without:

- **Exposing Internal Structure**: Client shouldn't know how collection stores elements
- **Multiple Traversals**: Need to support different ways of traversing the same collection
- **Complex Navigation**: Collection might have complex internal structure (trees, graphs)
- **Uniform Interface**: Different collections should provide same traversal interface

Direct access to collection internals creates tight coupling and limits flexibility.

## 💡 Solution

The Iterator pattern suggests extracting traversal behavior into separate iterator objects. Each iterator implements a standard interface for traversing collections, providing methods like `next()`, `hasNext()`, etc.

## 🏗️ Structure

```
Iterator (interface)
├── +next(): Element
├── +hasNext(): boolean
└── +current(): Element

ConcreteIterator implements Iterator
├── -collection: Collection
├── -position: number
├── +next(): Element
├── +hasNext(): boolean
└── +current(): Element

Collection (interface)
└── +createIterator(): Iterator

ConcreteCollection implements Collection
├── -items: Array
├── +createIterator(): ConcreteIterator
└── +getItems(): Array
```

## 💻 Simple Example

### Book Collection Iterator

```javascript
// Iterator Interface
class Iterator {
  next() {
    throw new Error('next() method must be implemented');
  }

  hasNext() {
    throw new Error('hasNext() method must be implemented');
  }

  current() {
    throw new Error('current() method must be implemented');
  }

  reset() {
    throw new Error('reset() method must be implemented');
  }
}

// Book class
class Book {
  constructor(title, author, year, genre) {
    this.title = title;
    this.author = author;
    this.year = year;
    this.genre = genre;
  }

  toString() {
    return `"${this.title}" by ${this.author} (${this.year}) - ${this.genre}`;
  }
}

// Concrete Iterator - Forward Iterator
class BookIterator extends Iterator {
  constructor(books) {
    super();
    this.books = books;
    this.position = 0;
  }

  next() {
    if (this.hasNext()) {
      const book = this.books[this.position];
      this.position++;
      return book;
    }
    return null;
  }

  hasNext() {
    return this.position < this.books.length;
  }

  current() {
    return this.position > 0 ? this.books[this.position - 1] : null;
  }

  reset() {
    this.position = 0;
    console.log('📖 Iterator reset to beginning');
  }
}

// Concrete Iterator - Reverse Iterator
class ReverseBookIterator extends Iterator {
  constructor(books) {
    super();
    this.books = books;
    this.position = books.length - 1;
  }

  next() {
    if (this.hasNext()) {
      const book = this.books[this.position];
      this.position--;
      return book;
    }
    return null;
  }

  hasNext() {
    return this.position >= 0;
  }

  current() {
    return this.position < this.books.length - 1 ? this.books[this.position + 1] : null;
  }

  reset() {
    this.position = this.books.length - 1;
    console.log('📖 Reverse iterator reset to end');
  }
}

// Collection Interface
class Collection {
  createIterator() {
    throw new Error('createIterator() method must be implemented');
  }
}

// Concrete Collection - Book Library
class BookLibrary extends Collection {
  constructor() {
    super();
    this.books = [];
  }

  addBook(book) {
    this.books.push(book);
    console.log(`📚 Added book: ${book.title}`);
  }

  removeBook(title) {
    const index = this.books.findIndex((book) => book.title === title);
    if (index !== -1) {
      const removedBook = this.books.splice(index, 1)[0];
      console.log(`🗑️ Removed book: ${removedBook.title}`);
      return true;
    }
    console.log(`❌ Book not found: ${title}`);
    return false;
  }

  createIterator() {
    console.log('🔄 Creating forward iterator');
    return new BookIterator(this.books);
  }

  createReverseIterator() {
    console.log('🔄 Creating reverse iterator');
    return new ReverseBookIterator(this.books);
  }

  getBookCount() {
    return this.books.length;
  }

  displayInfo() {
    console.log(`📚 Library contains ${this.books.length} books`);
  }
}

// Usage
console.log('=== Book Library Iterator Demo ===\n');

console.log('Setting up book library:');
console.log('-'.repeat(25));

const library = new BookLibrary();

// Add books
const books = [
  new Book('The Great Gatsby', 'F. Scott Fitzgerald', 1925, 'Classic Fiction'),
  new Book('To Kill a Mockingbird', 'Harper Lee', 1960, 'Classic Fiction'),
  new Book('1984', 'George Orwell', 1949, 'Dystopian Fiction'),
  new Book('Pride and Prejudice', 'Jane Austen', 1813, 'Romance'),
  new Book('The Catcher in the Rye', 'J.D. Salinger', 1951, 'Coming-of-age'),
];

books.forEach((book) => library.addBook(book));

library.displayInfo();

console.log('\n' + '='.repeat(50) + '\n');

console.log('Iterating through books (forward):');
console.log('-'.repeat(35));

const iterator = library.createIterator();
let bookNumber = 1;

while (iterator.hasNext()) {
  const book = iterator.next();
  console.log(`${bookNumber}. ${book.toString()}`);
  bookNumber++;
}

console.log('\n' + '-'.repeat(40) + '\n');

console.log('Iterating through books (reverse):');
console.log('-'.repeat(35));

const reverseIterator = library.createReverseIterator();
bookNumber = 1;

while (reverseIterator.hasNext()) {
  const book = reverseIterator.next();
  console.log(`${bookNumber}. ${book.toString()}`);
  bookNumber++;
}

console.log('\n' + '-'.repeat(40) + '\n');

console.log('Demonstrating iterator reset:');
console.log('-'.repeat(30));

iterator.reset();
console.log('First two books after reset:');

for (let i = 0; i < 2 && iterator.hasNext(); i++) {
  const book = iterator.next();
  console.log(`  ${i + 1}. ${book.title}`);
}
```

## 🌟 Real-World Example

### Playlist Iterator with Different Modes

```javascript
// Song class
class Song {
  constructor(title, artist, duration, genre) {
    this.title = title;
    this.artist = artist;
    this.duration = duration; // in seconds
    this.genre = genre;
    this.playCount = 0;
  }

  play() {
    this.playCount++;
    console.log(
      `🎵 Playing: "${this.title}" by ${this.artist} (${this.formatDuration()}) [Play #${this.playCount}]`,
    );
  }

  formatDuration() {
    const minutes = Math.floor(this.duration / 60);
    const seconds = this.duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  toString() {
    return `"${this.title}" by ${this.artist} (${this.formatDuration()}) - ${this.genre}`;
  }
}

// Abstract Iterator for playlist
class PlaylistIterator {
  constructor(songs) {
    this.songs = songs;
    this.position = 0;
  }

  next() {
    throw new Error('next() method must be implemented');
  }

  hasNext() {
    throw new Error('hasNext() method must be implemented');
  }

  current() {
    return this.position > 0 ? this.songs[this.position - 1] : null;
  }

  reset() {
    throw new Error('reset() method must be implemented');
  }

  getPosition() {
    return this.position;
  }
}

// Sequential Iterator
class SequentialIterator extends PlaylistIterator {
  next() {
    if (this.hasNext()) {
      const song = this.songs[this.position];
      this.position++;
      return song;
    }
    return null;
  }

  hasNext() {
    return this.position < this.songs.length;
  }

  reset() {
    this.position = 0;
    console.log('🔄 Sequential iterator reset');
  }
}

// Shuffle Iterator
class ShuffleIterator extends PlaylistIterator {
  constructor(songs) {
    super(songs);
    this.shuffledIndices = this.createShuffledIndices();
    this.position = 0;
  }

  createShuffledIndices() {
    const indices = Array.from({ length: this.songs.length }, (_, i) => i);

    // Fisher-Yates shuffle algorithm
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    console.log('🔀 Playlist shuffled');
    return indices;
  }

  next() {
    if (this.hasNext()) {
      const songIndex = this.shuffledIndices[this.position];
      const song = this.songs[songIndex];
      this.position++;
      return song;
    }
    return null;
  }

  hasNext() {
    return this.position < this.shuffledIndices.length;
  }

  reset() {
    this.position = 0;
    this.shuffledIndices = this.createShuffledIndices();
    console.log('🔄 Shuffle iterator reset with new shuffle');
  }
}

// Repeat Iterator (repeats the playlist indefinitely)
class RepeatIterator extends PlaylistIterator {
  constructor(songs, maxRepeats = 3) {
    super(songs);
    this.maxRepeats = maxRepeats;
    this.currentRepeat = 0;
  }

  next() {
    if (this.hasNext()) {
      const song = this.songs[this.position % this.songs.length];
      this.position++;

      // Check if we completed a full cycle
      if (this.position % this.songs.length === 0) {
        this.currentRepeat++;
        console.log(`🔁 Completed repeat ${this.currentRepeat}/${this.maxRepeats}`);
      }

      return song;
    }
    return null;
  }

  hasNext() {
    return this.currentRepeat < this.maxRepeats;
  }

  reset() {
    this.position = 0;
    this.currentRepeat = 0;
    console.log('🔄 Repeat iterator reset');
  }

  getCurrentRepeat() {
    return this.currentRepeat;
  }
}

// Genre Filter Iterator
class GenreFilterIterator extends PlaylistIterator {
  constructor(songs, genre) {
    super(songs);
    this.genre = genre;
    this.filteredSongs = songs.filter((song) => song.genre.toLowerCase() === genre.toLowerCase());
    this.position = 0;

    console.log(`🎯 Genre filter applied: ${genre} (${this.filteredSongs.length} songs)`);
  }

  next() {
    if (this.hasNext()) {
      const song = this.filteredSongs[this.position];
      this.position++;
      return song;
    }
    return null;
  }

  hasNext() {
    return this.position < this.filteredSongs.length;
  }

  reset() {
    this.position = 0;
    console.log(`🔄 Genre filter iterator reset (${this.genre})`);
  }
}

// Playlist Collection
class Playlist {
  constructor(name) {
    this.name = name;
    this.songs = [];
    this.created = new Date();
  }

  addSong(song) {
    this.songs.push(song);
    console.log(`➕ Added to "${this.name}": ${song.title}`);
  }

  removeSong(title) {
    const index = this.songs.findIndex((song) => song.title === title);
    if (index !== -1) {
      const removedSong = this.songs.splice(index, 1)[0];
      console.log(`➖ Removed from "${this.name}": ${removedSong.title}`);
      return true;
    }
    return false;
  }

  // Factory methods for different iterator types
  createSequentialIterator() {
    return new SequentialIterator(this.songs);
  }

  createShuffleIterator() {
    return new ShuffleIterator(this.songs);
  }

  createRepeatIterator(maxRepeats = 3) {
    return new RepeatIterator(this.songs, maxRepeats);
  }

  createGenreIterator(genre) {
    return new GenreFilterIterator(this.songs, genre);
  }

  getStats() {
    const totalDuration = this.songs.reduce((sum, song) => sum + song.duration, 0);
    const genres = [...new Set(this.songs.map((song) => song.genre))];

    console.log(`📊 Playlist "${this.name}" Stats:`);
    console.log(`   Songs: ${this.songs.length}`);
    console.log(`   Total Duration: ${Math.floor(totalDuration / 60)} minutes`);
    console.log(`   Genres: ${genres.join(', ')}`);
    console.log(`   Created: ${this.created.toLocaleDateString()}`);
  }
}

// Usage
console.log('\n=== Music Playlist Iterator Demo ===\n');

console.log('Creating playlist:');
console.log('-'.repeat(18));

const myPlaylist = new Playlist('My Favorites');

// Add songs
const songs = [
  new Song('Bohemian Rhapsody', 'Queen', 355, 'Rock'),
  new Song('Stairway to Heaven', 'Led Zeppelin', 482, 'Rock'),
  new Song('Hotel California', 'Eagles', 391, 'Rock'),
  new Song('Billie Jean', 'Michael Jackson', 294, 'Pop'),
  new Song('Like a Rolling Stone', 'Bob Dylan', 369, 'Folk Rock'),
  new Song('Imagine', 'John Lennon', 183, 'Pop'),
  new Song("Sweet Child O' Mine", "Guns N' Roses", 356, 'Rock'),
  new Song('Thriller', 'Michael Jackson', 357, 'Pop'),
];

songs.forEach((song) => myPlaylist.addSong(song));

myPlaylist.getStats();

console.log('\n' + '='.repeat(50) + '\n');

console.log('1. Sequential playback:');
console.log('-'.repeat(23));

const sequential = myPlaylist.createSequentialIterator();
let count = 0;
while (sequential.hasNext() && count < 3) {
  const song = sequential.next();
  song.play();
  count++;
}

console.log('\n' + '-'.repeat(40) + '\n');

console.log('2. Shuffle mode:');
console.log('-'.repeat(15));

const shuffle = myPlaylist.createShuffleIterator();
count = 0;
while (shuffle.hasNext() && count < 3) {
  const song = shuffle.next();
  song.play();
  count++;
}

console.log('\n' + '-'.repeat(40) + '\n');

console.log('3. Genre filter (Rock only):');
console.log('-'.repeat(28));

const rockIterator = myPlaylist.createGenreIterator('Rock');
while (rockIterator.hasNext()) {
  const song = rockIterator.next();
  song.play();
}

console.log('\n' + '-'.repeat(40) + '\n');

console.log('4. Repeat mode (2 repeats):');
console.log('-'.repeat(27));

const repeat = myPlaylist.createRepeatIterator(2);
count = 0;
// Show first few songs and then fast forward to show repeat behavior
while (repeat.hasNext() && count < 5) {
  const song = repeat.next();
  if (count < 3 || repeat.getCurrentRepeat() > 0) {
    song.play();
  } else {
    console.log('   ... (skipping to show repeat behavior)');
  }
  count++;
}

// Fast forward to show repeat
while (repeat.hasNext()) {
  const song = repeat.next();
  if (repeat.getCurrentRepeat() > 0) {
    song.play();
    break;
  }
}
```

## 🔧 Simple Tree Iterator Example

```javascript
// Tree Node
class TreeNode {
  constructor(value) {
    this.value = value;
    this.children = [];
  }

  addChild(node) {
    this.children.push(node);
  }

  toString() {
    return this.value.toString();
  }
}

// Tree Iterator (Depth-First)
class TreeIterator {
  constructor(root) {
    this.stack = root ? [root] : [];
  }

  next() {
    if (!this.hasNext()) {
      return null;
    }

    const node = this.stack.pop();

    // Add children to stack in reverse order for correct traversal order
    for (let i = node.children.length - 1; i >= 0; i--) {
      this.stack.push(node.children[i]);
    }

    return node;
  }

  hasNext() {
    return this.stack.length > 0;
  }
}

// Tree Collection
class Tree {
  constructor(rootValue) {
    this.root = new TreeNode(rootValue);
  }

  getRoot() {
    return this.root;
  }

  createIterator() {
    return new TreeIterator(this.root);
  }
}

// Usage
console.log('\n=== Tree Iterator Demo ===\n');

const tree = new Tree('Root');
const child1 = new TreeNode('Child 1');
const child2 = new TreeNode('Child 2');
const child3 = new TreeNode('Child 3');

tree.root.addChild(child1);
tree.root.addChild(child2);
tree.root.addChild(child3);

child1.addChild(new TreeNode('Child 1.1'));
child1.addChild(new TreeNode('Child 1.2'));
child2.addChild(new TreeNode('Child 2.1'));

console.log('Tree traversal (Depth-First):');
console.log('-'.repeat(30));

const treeIterator = tree.createIterator();
let nodeNumber = 1;

while (treeIterator.hasNext()) {
  const node = treeIterator.next();
  console.log(`${nodeNumber}. ${node.value}`);
  nodeNumber++;
}
```

## ✅ Pros

- **Uniform Interface**: Same interface for different collections
- **Encapsulation**: Hides collection's internal structure
- **Multiple Iterators**: Can have multiple iterators on same collection
- **Different Traversal Methods**: Support various traversal algorithms
- **Single Responsibility**: Separates traversal logic from collection logic

## ❌ Cons

- **Overhead**: Additional classes and complexity
- **Performance**: May be slower than direct access
- **Memory Usage**: Iterator objects consume memory
- **Concurrent Modification**: Issues if collection is modified during iteration

## 🎯 When to Use

- **Collection Traversal**: Need to traverse collections without exposing structure
- **Multiple Traversal Methods**: Different ways to iterate same collection
- **Uniform Interface**: Want same interface for different collection types
- **Complex Collections**: Collections with complex internal structure (trees, graphs)
- **Lazy Evaluation**: Want to generate elements on demand

## 🔄 Iterator Types

### 1. **External Iterator** (shown in examples)

- Client controls iteration
- Calls `next()`, `hasNext()` explicitly

### 2. **Internal Iterator**

- Collection controls iteration
- Client provides callback function

```javascript
class InternalIteratorCollection {
  constructor(items) {
    this.items = items;
  }

  forEach(callback) {
    for (let i = 0; i < this.items.length; i++) {
      callback(this.items[i], i);
    }
  }
}
```

### 3. **Bidirectional Iterator**

```javascript
class BidirectionalIterator {
  // ... other methods ...

  previous() {
    if (this.hasPrevious()) {
      this.position--;
      return this.collection[this.position];
    }
    return null;
  }

  hasPrevious() {
    return this.position > 0;
  }
}
```

## 🔗 Related Patterns

- **Composite**: Often used together for tree traversal
- **Factory Method**: Can be used to create different iterator types
- **Command**: Iterator operations can be implemented as commands
- **Visitor**: Can be combined for complex operations on collections

## 📚 Further Reading

- [Iterator Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/iterator)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [JavaScript Iterators and Generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)
