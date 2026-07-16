# Visitor Pattern 🏃‍♂️

> **Definition**: The Visitor pattern lets you separate algorithms from the objects on which they operate by defining a family of algorithms, encapsulating each one, and making them interchangeable at runtime.

## 🎯 Intent

Represent an operation to be performed on the elements of an object structure. Visitor lets you define a new operation without changing the classes of the elements on which it operates.

## 🤔 Problem

You have a complex object structure (like a composite tree) and want to perform various operations on it:
- **Adding Operations**: Need to add new operations without modifying existing classes
- **Type Safety**: Want compile-time type checking for operations
- **Separation of Concerns**: Keep operations separate from the data structure
- **Complex Traversal**: Need to perform complex operations across different object types

Without the pattern, you'd have to add new methods to every class in the object structure for each new operation.

## 💡 Solution

The Visitor pattern suggests placing new behaviors into separate classes called visitors, rather than trying to integrate them into existing classes. The objects accept visitors and delegate operations to them.

## 🏗️ Structure

```
Visitor Interface
├── +visitConcreteElementA(element): void
├── +visitConcreteElementB(element): void

ConcreteVisitor1, ConcreteVisitor2 implement Visitor
├── +visitConcreteElementA(element): void
├── +visitConcreteElementB(element): void

Element Interface
├── +accept(visitor): void

ConcreteElementA, ConcreteElementB implement Element
├── +accept(visitor): void → visitor.visitConcreteElementA(this)
├── +specificOperationA(): void
```

## 💻 Simple Example

### Document Processing System

```javascript
// Visitor interface
class DocumentVisitor {
  visitTextElement(element) {
    throw new Error("visitTextElement() must be implemented");
  }

  visitImageElement(element) {
    throw new Error("visitImageElement() must be implemented");
  }

  visitTableElement(element) {
    throw new Error("visitTableElement() must be implemented");
  }

  visitListElement(element) {
    throw new Error("visitListElement() must be implemented");
  }
}

// Element interface
class DocumentElement {
  accept(visitor) {
    throw new Error("accept() must be implemented");
  }
}

// Concrete elements
class TextElement extends DocumentElement {
  constructor(content, style = {}) {
    super();
    this.content = content;
    this.style = style;
    this.type = 'text';
  }

  accept(visitor) {
    return visitor.visitTextElement(this);
  }

  getWordCount() {
    return this.content.split(/\s+/).filter(word => word.length > 0).length;
  }
}

class ImageElement extends DocumentElement {
  constructor(src, alt, width, height) {
    super();
    this.src = src;
    this.alt = alt;
    this.width = width;
    this.height = height;
    this.type = 'image';
  }

  accept(visitor) {
    return visitor.visitImageElement(this);
  }

  getSize() {
    return this.width * this.height;
  }
}

class TableElement extends DocumentElement {
  constructor(rows, headers = []) {
    super();
    this.rows = rows;
    this.headers = headers;
    this.type = 'table';
  }

  accept(visitor) {
    return visitor.visitTableElement(this);
  }

  getCellCount() {
    return this.rows.reduce((total, row) => total + row.length, 0);
  }
}

class ListElement extends DocumentElement {
  constructor(items, ordered = false) {
    super();
    this.items = items;
    this.ordered = ordered;
    this.type = 'list';
  }

  accept(visitor) {
    return visitor.visitListElement(this);
  }

  getItemCount() {
    return this.items.length;
  }
}

// Concrete visitor - HTML Renderer
class HTMLRenderer extends DocumentVisitor {
  constructor() {
    super();
    this.result = '';
  }

  visitTextElement(element) {
    console.log(`🖋️ Rendering text element: "${element.content.substring(0, 30)}..."`);

    let html = element.content;

    // Apply styles
    if (element.style.bold) html = `<strong>${html}</strong>`;
    if (element.style.italic) html = `<em>${html}</em>`;
    if (element.style.underline) html = `<u>${html}</u>`;
    if (element.style.color) html = `<span style="color: ${element.style.color}">${html}</span>`;

    this.result += `<p>${html}</p>\n`;
    return html;
  }

  visitImageElement(element) {
    console.log(`🖼️ Rendering image element: ${element.src}`);

    const html = `<img src="${element.src}" alt="${element.alt}" width="${element.width}" height="${element.height}" />\n`;
    this.result += html;
    return html;
  }

  visitTableElement(element) {
    console.log(`📊 Rendering table with ${element.rows.length} rows`);

    let html = '<table border="1">\n';

    // Add headers
    if (element.headers.length > 0) {
      html += '  <thead>\n    <tr>\n';
      element.headers.forEach(header => {
        html += `      <th>${header}</th>\n`;
      });
      html += '    </tr>\n  </thead>\n';
    }

    // Add rows
    html += '  <tbody>\n';
    element.rows.forEach(row => {
      html += '    <tr>\n';
      row.forEach(cell => {
        html += `      <td>${cell}</td>\n`;
      });
      html += '    </tr>\n';
    });
    html += '  </tbody>\n</table>\n';

    this.result += html;
    return html;
  }

  visitListElement(element) {
    console.log(`📋 Rendering ${element.ordered ? 'ordered' : 'unordered'} list with ${element.items.length} items`);

    const tag = element.ordered ? 'ol' : 'ul';
    let html = `<${tag}>\n`;

    element.items.forEach(item => {
      html += `  <li>${item}</li>\n`;
    });

    html += `</${tag}>\n`;
    this.result += html;
    return html;
  }

  getResult() {
    return this.result;
  }

  reset() {
    this.result = '';
  }
}

// Concrete visitor - Markdown Renderer
class MarkdownRenderer extends DocumentVisitor {
  constructor() {
    super();
    this.result = '';
  }

  visitTextElement(element) {
    console.log(`📝 Converting text to Markdown: "${element.content.substring(0, 30)}..."`);

    let markdown = element.content;

    // Apply markdown formatting
    if (element.style.bold) markdown = `**${markdown}**`;
    if (element.style.italic) markdown = `*${markdown}*`;
    if (element.style.underline) markdown = `<u>${markdown}</u>`;

    this.result += `${markdown}\n\n`;
    return markdown;
  }

  visitImageElement(element) {
    console.log(`🖼️ Converting image to Markdown: ${element.src}`);

    const markdown = `![${element.alt}](${element.src})\n\n`;
    this.result += markdown;
    return markdown;
  }

  visitTableElement(element) {
    console.log(`📊 Converting table to Markdown`);

    let markdown = '';

    // Add headers
    if (element.headers.length > 0) {
      markdown += `| ${element.headers.join(' | ')} |\n`;
      markdown += `| ${element.headers.map(() => '---').join(' | ')} |\n`;
    }

    // Add rows
    element.rows.forEach(row => {
      markdown += `| ${row.join(' | ')} |\n`;
    });

    markdown += '\n';
    this.result += markdown;
    return markdown;
  }

  visitListElement(element) {
    console.log(`📋 Converting to Markdown ${element.ordered ? 'ordered' : 'unordered'} list`);

    let markdown = '';
    element.items.forEach((item, index) => {
      const prefix = element.ordered ? `${index + 1}. ` : '- ';
      markdown += `${prefix}${item}\n`;
    });

    markdown += '\n';
    this.result += markdown;
    return markdown;
  }

  getResult() {
    return this.result;
  }

  reset() {
    this.result = '';
  }
}

// Concrete visitor - Word Count Analyzer
class WordCountAnalyzer extends DocumentVisitor {
  constructor() {
    super();
    this.totalWords = 0;
    this.elementCounts = {};
  }

  visitTextElement(element) {
    const wordCount = element.getWordCount();
    this.totalWords += wordCount;
    this.elementCounts.text = (this.elementCounts.text || 0) + wordCount;

    console.log(`📊 Analyzing text: ${wordCount} words`);
    return wordCount;
  }

  visitImageElement(element) {
    const altWords = element.alt ? element.alt.split(/\s+/).length : 0;
    this.totalWords += altWords;
    this.elementCounts.images = (this.elementCounts.images || 0) + altWords;

    console.log(`📊 Analyzing image alt text: ${altWords} words`);
    return altWords;
  }

  visitTableElement(element) {
    let tableWords = 0;

    // Count words in headers
    element.headers.forEach(header => {
      tableWords += header.split(/\s+/).length;
    });

    // Count words in cells
    element.rows.forEach(row => {
      row.forEach(cell => {
        tableWords += String(cell).split(/\s+/).length;
      });
    });

    this.totalWords += tableWords;
    this.elementCounts.tables = (this.elementCounts.tables || 0) + tableWords;

    console.log(`📊 Analyzing table: ${tableWords} words`);
    return tableWords;
  }

  visitListElement(element) {
    let listWords = 0;
    element.items.forEach(item => {
      listWords += String(item).split(/\s+/).length;
    });

    this.totalWords += listWords;
    this.elementCounts.lists = (this.elementCounts.lists || 0) + listWords;

    console.log(`📊 Analyzing list: ${listWords} words`);
    return listWords;
  }

  getReport() {
    return {
      totalWords: this.totalWords,
      breakdown: { ...this.elementCounts },
      averagePerElement: this.totalWords / Object.keys(this.elementCounts).length
    };
  }

  reset() {
    this.totalWords = 0;
    this.elementCounts = {};
  }
}

// Document class to hold elements
class Document {
  constructor(title) {
    this.title = title;
    this.elements = [];
  }

  addElement(element) {
    this.elements.push(element);
  }

  accept(visitor) {
    console.log(`📄 Processing document: "${this.title}"`);
    this.elements.forEach(element => element.accept(visitor));
  }
}

// Usage
console.log("=== Document Processing Visitor Pattern Demo ===\n");

console.log("Creating sample document:");
console.log("-".repeat(26));

// Create document
const document = new Document("Sample Technical Report");

// Add various elements
document.addElement(new TextElement(
  "Introduction to Modern Web Development",
  { bold: true, color: 'blue' }
));

document.addElement(new TextElement(
  "This comprehensive guide covers the fundamentals of modern web development, including HTML5, CSS3, and JavaScript ES6+ features. We'll explore best practices, design patterns, and performance optimization techniques that every developer should know."
));

document.addElement(new ImageElement(
  "web-dev-diagram.png",
  "Web Development Technologies Diagram",
  800,
  400
));

document.addElement(new TableElement(
  [
    ["HTML5", "Markup Language", "Structure"],
    ["CSS3", "Styling Language", "Presentation"],
    ["JavaScript", "Programming Language", "Behavior"],
    ["React", "Library", "UI Components"]
  ],
  ["Technology", "Type", "Purpose"]
));

document.addElement(new ListElement([
  "Semantic HTML elements improve accessibility",
  "CSS Grid and Flexbox for modern layouts",
  "ES6+ features like arrow functions and modules",
  "Component-based architecture with React"
], true));

document.addElement(new TextElement(
  "Modern web development requires understanding of various technologies and how they work together to create compelling user experiences.",
  { italic: true }
));

console.log(`✅ Created document with ${document.elements.length} elements\n`);

console.log("=".repeat(60) + "\n");

console.log("1. HTML Rendering:");
console.log("-".repeat(18));

const htmlRenderer = new HTMLRenderer();
document.accept(htmlRenderer);

console.log("\n📋 Generated HTML:");
console.log("-".repeat(17));
console.log(htmlRenderer.getResult());

console.log("=".repeat(60) + "\n");

console.log("2. Markdown Conversion:");
console.log("-".repeat(21));

const markdownRenderer = new MarkdownRenderer();
document.accept(markdownRenderer);

console.log("\n📋 Generated Markdown:");
console.log("-".repeat(21));
console.log(markdownRenderer.getResult());

console.log("=".repeat(60) + "\n");

console.log("3. Word Count Analysis:");
console.log("-".repeat(21));

const analyzer = new WordCountAnalyzer();
document.accept(analyzer);

const report = analyzer.getReport();

console.log("\n📊 Word Count Report:");
console.log("-".repeat(20));
console.log(`Total words: ${report.totalWords}`);
console.log(`Average per element type: ${report.averagePerElement.toFixed(1)}`);
console.log("\nBreakdown by element type:");
Object.entries(report.breakdown).forEach(([type, count]) => {
  console.log(`  • ${type}: ${count} words`);
});

console.log("\n" + "=".repeat(60) + "\n");

console.log("Performance Comparison:");
console.log("-".repeat(23));

// Performance test with multiple renders
const startTime = Date.now();

for (let i = 0; i < 100; i++) {
  htmlRenderer.reset();
  markdownRenderer.reset();
  analyzer.reset();

  document.accept(htmlRenderer);
  document.accept(markdownRenderer);
  document.accept(analyzer);
}

const endTime = Date.now();
const totalTime = endTime - startTime;

console.log(`⏱️ Performance Results (100 iterations):`);
console.log(`   Total time: ${totalTime}ms`);
console.log(`   Average per document: ${(totalTime / 100).toFixed(2)}ms`);
console.log(`   Average per visitor: ${(totalTime / 300).toFixed(2)}ms`);
```

## 🌟 Real-World Example

### File System Scanner

```javascript
// File system element interface
class FileSystemElement {
  constructor(name, path) {
    this.name = name;
    this.path = path;
    this.createdAt = new Date();
  }

  accept(visitor) {
    throw new Error("accept() must be implemented");
  }
}

// Concrete elements
class File extends FileSystemElement {
  constructor(name, path, size, extension, content = '') {
    super(name, path);
    this.size = size;
    this.extension = extension;
    this.content = content;
    this.type = 'file';
  }

  accept(visitor) {
    return visitor.visitFile(this);
  }

  getContent() {
    return this.content;
  }

  getSizeInKB() {
    return (this.size / 1024).toFixed(2);
  }
}

class Directory extends FileSystemElement {
  constructor(name, path) {
    super(name, path);
    this.children = [];
    this.type = 'directory';
  }

  addChild(element) {
    this.children.push(element);
  }

  accept(visitor) {
    const result = visitor.visitDirectory(this);

    // Visit all children
    this.children.forEach(child => child.accept(visitor));

    return result;
  }

  getChildCount() {
    return this.children.length;
  }

  getTotalChildren() {
    let total = this.children.length;
    this.children.forEach(child => {
      if (child instanceof Directory) {
        total += child.getTotalChildren();
      }
    });
    return total;
  }
}

class SymbolicLink extends FileSystemElement {
  constructor(name, path, targetPath) {
    super(name, path);
    this.targetPath = targetPath;
    this.type = 'symlink';
  }

  accept(visitor) {
    return visitor.visitSymbolicLink(this);
  }

  getTarget() {
    return this.targetPath;
  }
}

// Visitor interface
class FileSystemVisitor {
  visitFile(file) {
    throw new Error("visitFile() must be implemented");
  }

  visitDirectory(directory) {
    throw new Error("visitDirectory() must be implemented");
  }

  visitSymbolicLink(symlink) {
    throw new Error("visitSymbolicLink() must be implemented");
  }
}

// Concrete visitor - Size Calculator
class SizeCalculatorVisitor extends FileSystemVisitor {
  constructor() {
    super();
    this.totalSize = 0;
    this.fileCounts = {};
    this.currentDepth = 0;
  }

  visitFile(file) {
    this.totalSize += file.size;
    this.fileCounts[file.extension] = (this.fileCounts[file.extension] || 0) + 1;

    console.log(`${'  '.repeat(this.currentDepth)}📄 ${file.name} (${file.getSizeInKB()} KB)`);
    return file.size;
  }

  visitDirectory(directory) {
    console.log(`${'  '.repeat(this.currentDepth)}📁 ${directory.name}/`);
    this.currentDepth++;

    const startSize = this.totalSize;
    // Children will be visited automatically
    return () => {
      this.currentDepth--;
      const dirSize = this.totalSize - startSize;
      console.log(`${'  '.repeat(this.currentDepth)}   └─ Directory size: ${(dirSize / 1024).toFixed(2)} KB`);
      return dirSize;
    };
  }

  visitSymbolicLink(symlink) {
    console.log(`${'  '.repeat(this.currentDepth)}🔗 ${symlink.name} → ${symlink.targetPath}`);
    return 0; // Symlinks don't contribute to size
  }

  getReport() {
    return {
      totalSize: this.totalSize,
      totalSizeKB: (this.totalSize / 1024).toFixed(2),
      totalSizeMB: (this.totalSize / (1024 * 1024)).toFixed(2),
      fileTypeCounts: { ...this.fileCounts },
      totalFiles: Object.values(this.fileCounts).reduce((sum, count) => sum + count, 0)
    };
  }
}

// Concrete visitor - Security Scanner
class SecurityScannerVisitor extends FileSystemVisitor {
  constructor() {
    super();
    this.issues = [];
    this.scannedFiles = 0;
    this.suspiciousPatterns = [
      /password/i,
      /secret/i,
      /api[_-]?key/i,
      /token/i,
      /credentials/i,
      /private[_-]?key/i
    ];
    this.dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif'];
  }

  visitFile(file) {
    this.scannedFiles++;

    console.log(`🔍 Scanning: ${file.name}`);

    // Check for dangerous file extensions
    if (this.dangerousExtensions.includes(file.extension)) {
      this.issues.push({
        type: 'dangerous_extension',
        severity: 'high',
        path: file.path,
        message: `Potentially dangerous file extension: ${file.extension}`
      });
    }

    // Check for suspicious content patterns
    this.suspiciousPatterns.forEach(pattern => {
      if (pattern.test(file.content) || pattern.test(file.name)) {
        this.issues.push({
          type: 'sensitive_data',
          severity: 'medium',
          path: file.path,
          message: `Potentially sensitive information found matching pattern: ${pattern}`
        });
      }
    });

    // Check for large files that might be suspicious
    if (file.size > 100 * 1024 * 1024) { // > 100MB
      this.issues.push({
        type: 'large_file',
        severity: 'low',
        path: file.path,
        message: `Unusually large file: ${file.getSizeInKB()} KB`
      });
    }

    return this.issues.length;
  }

  visitDirectory(directory) {
    console.log(`📁 Entering directory: ${directory.name}`);

    // Check for suspicious directory names
    const suspiciousNames = ['temp', 'tmp', 'cache', 'hidden', '.git', '.svn'];
    if (suspiciousNames.some(name => directory.name.toLowerCase().includes(name))) {
      this.issues.push({
        type: 'suspicious_directory',
        severity: 'low',
        path: directory.path,
        message: `Directory with potentially sensitive name: ${directory.name}`
      });
    }

    return directory.children.length;
  }

  visitSymbolicLink(symlink) {
    console.log(`🔗 Checking symbolic link: ${symlink.name}`);

    // Check if symlink points outside of current directory structure
    if (symlink.targetPath.includes('..') || symlink.targetPath.startsWith('/')) {
      this.issues.push({
        type: 'suspicious_symlink',
        severity: 'medium',
        path: symlink.path,
        message: `Symbolic link points outside current directory: ${symlink.targetPath}`
      });
    }

    return 0;
  }

  getSecurityReport() {
    const severityGroups = {
      high: this.issues.filter(issue => issue.severity === 'high'),
      medium: this.issues.filter(issue => issue.severity === 'medium'),
      low: this.issues.filter(issue => issue.severity === 'low')
    };

    return {
      scannedFiles: this.scannedFiles,
      totalIssues: this.issues.length,
      severityBreakdown: {
        high: severityGroups.high.length,
        medium: severityGroups.medium.length,
        low: severityGroups.low.length
      },
      issues: this.issues,
      riskLevel: this.calculateRiskLevel(severityGroups)
    };
  }

  calculateRiskLevel(severityGroups) {
    const score = severityGroups.high.length * 3 +
                 severityGroups.medium.length * 2 +
                 severityGroups.low.length * 1;

    if (score >= 10) return 'HIGH';
    if (score >= 5) return 'MEDIUM';
    if (score > 0) return 'LOW';
    return 'CLEAN';
  }
}

// Concrete visitor - Backup Creator
class BackupCreatorVisitor extends FileSystemVisitor {
  constructor(backupPath) {
    super();
    this.backupPath = backupPath;
    this.backedUpFiles = [];
    this.skippedFiles = [];
    this.currentDepth = 0;
    this.excludePatterns = [/\.tmp$/, /\.log$/, /node_modules/, /\.git/];
  }

  visitFile(file) {
    const shouldBackup = !this.excludePatterns.some(pattern =>
      pattern.test(file.name) || pattern.test(file.path)
    );

    if (shouldBackup) {
      const backupFilePath = `${this.backupPath}${file.path}`;
      console.log(`${'  '.repeat(this.currentDepth)}💾 Backing up: ${file.name} → ${backupFilePath}`);

      // Simulate backup operation
      this.backedUpFiles.push({
        originalPath: file.path,
        backupPath: backupFilePath,
        size: file.size,
        timestamp: new Date()
      });

      return true;
    } else {
      console.log(`${'  '.repeat(this.currentDepth)}⏭️ Skipping: ${file.name} (excluded)`);
      this.skippedFiles.push({
        path: file.path,
        reason: 'excluded_pattern'
      });

      return false;
    }
  }

  visitDirectory(directory) {
    const shouldBackup = !this.excludePatterns.some(pattern =>
      pattern.test(directory.name) || pattern.test(directory.path)
    );

    if (shouldBackup) {
      const backupDirPath = `${this.backupPath}${directory.path}`;
      console.log(`${'  '.repeat(this.currentDepth)}📁 Creating backup directory: ${backupDirPath}`);
      this.currentDepth++;

      return () => {
        this.currentDepth--;
        console.log(`${'  '.repeat(this.currentDepth)}   └─ Directory backup completed`);
      };
    } else {
      console.log(`${'  '.repeat(this.currentDepth)}⏭️ Skipping directory: ${directory.name} (excluded)`);
      this.skippedFiles.push({
        path: directory.path,
        reason: 'excluded_pattern'
      });

      return () => {}; // No-op cleanup
    }
  }

  visitSymbolicLink(symlink) {
    // For safety, we'll recreate the symlink in backup
    const backupLinkPath = `${this.backupPath}${symlink.path}`;
    console.log(`${'  '.repeat(this.currentDepth)}🔗 Recreating symlink: ${backupLinkPath} → ${symlink.targetPath}`);

    this.backedUpFiles.push({
      originalPath: symlink.path,
      backupPath: backupLinkPath,
      targetPath: symlink.targetPath,
      type: 'symlink',
      timestamp: new Date()
    });

    return true;
  }

  getBackupReport() {
    const totalBackupSize = this.backedUpFiles
      .filter(item => item.size)
      .reduce((sum, item) => sum + item.size, 0);

    return {
      backupPath: this.backupPath,
      backedUpFiles: this.backedUpFiles.length,
      skippedFiles: this.skippedFiles.length,
      totalBackupSize: totalBackupSize,
      totalBackupSizeMB: (totalBackupSize / (1024 * 1024)).toFixed(2),
      excludePatterns: this.excludePatterns.map(p => p.toString()),
      timestamp: new Date(),
      fileDetails: this.backedUpFiles,
      skippedDetails: this.skippedFiles
    };
  }
}

// Usage
console.log("\n=== File System Scanner Visitor Pattern Demo ===\n");

console.log("Building sample file system:");
console.log("-".repeat(29));

// Create sample file system
const root = new Directory("project", "/");

// Add source directory
const src = new Directory("src", "/src");
src.addChild(new File("app.js", "/src/app.js", 15360, ".js", "const express = require('express');\nconst app = express();"));
src.addChild(new File("config.js", "/src/config.js", 2048, ".js", "const API_KEY = 'secret-key-123';\nmodule.exports = { API_KEY };"));
src.addChild(new File("utils.js", "/src/utils.js", 8192, ".js", "function formatDate(date) { return date.toString(); }"));

// Add docs directory
const docs = new Directory("docs", "/docs");
docs.addChild(new File("README.md", "/docs/README.md", 4096, ".md", "# Project Documentation\nThis is the main documentation."));
docs.addChild(new File("api.md", "/docs/api.md", 6144, ".md", "# API Documentation\nAPI endpoints and usage."));

// Add temp directory with some files
const temp = new Directory("temp", "/temp");
temp.addChild(new File("cache.tmp", "/temp/cache.tmp", 1024, ".tmp", "temporary cache data"));
temp.addChild(new File("debug.log", "/temp/debug.log", 2048, ".log", "debug information"));

// Add a large file
const data = new Directory("data", "/data");
data.addChild(new File("large-dataset.json", "/data/large-dataset.json", 150 * 1024 * 1024, ".json", "{}"));

// Add executable file
const bin = new Directory("bin", "/bin");
bin.addChild(new File("startup.exe", "/bin/startup.exe", 5120, ".exe", "binary content"));

// Add symlink
const link = new SymbolicLink("current", "/current", "../data/large-dataset.json");

// Build structure
root.addChild(src);
root.addChild(docs);
root.addChild(temp);
root.addChild(data);
root.addChild(bin);
root.addChild(link);

console.log(`✅ Built file system with ${root.getTotalChildren()} total items\n`);

console.log("=".repeat(70) + "\n");

console.log("1. Size Calculation:");
console.log("-".repeat(18));

const sizeCalculator = new SizeCalculatorVisitor();
root.accept(sizeCalculator);

const sizeReport = sizeCalculator.getReport();
console.log("\n📊 Size Report:");
console.log("-".repeat(14));
console.log(`Total size: ${sizeReport.totalSizeMB} MB (${sizeReport.totalSizeKB} KB)`);
console.log(`Total files: ${sizeReport.totalFiles}`);
console.log("\nFile types:");
Object.entries(sizeReport.fileTypeCounts).forEach(([ext, count]) => {
  console.log(`  ${ext}: ${count} files`);
});

console.log("\n" + "=".repeat(70) + "\n");

console.log("2. Security Scanning:");
console.log("-".repeat(19));

const securityScanner = new SecurityScannerVisitor();
root.accept(securityScanner);

const securityReport = securityScanner.getSecurityReport();
console.log("\n🔒 Security Report:");
console.log("-".repeat(17));
console.log(`Scanned files: ${securityReport.scannedFiles}`);
console.log(`Total issues: ${securityReport.totalIssues}`);
console.log(`Risk level: ${securityReport.riskLevel}`);

console.log("\nIssue breakdown:");
Object.entries(securityReport.severityBreakdown).forEach(([severity, count]) => {
  console.log(`  ${severity.toUpperCase()}: ${count} issues`);
});

if (securityReport.issues.length > 0) {
  console.log("\nDetailed issues:");
  securityReport.issues.forEach((issue, index) => {
    console.log(`  ${index + 1}. [${issue.severity.toUpperCase()}] ${issue.message}`);
    console.log(`     Path: ${issue.path}`);
  });
}

console.log("\n" + "=".repeat(70) + "\n");

console.log("3. Backup Creation:");
console.log("-".repeat(17));

const backupCreator = new BackupCreatorVisitor("/backup/2024-01-15/");
root.accept(backupCreator);

const backupReport = backupCreator.getBackupReport();
console.log("\n💾 Backup Report:");
console.log("-".repeat(16));
console.log(`Backup location: ${backupReport.backupPath}`);
console.log(`Files backed up: ${backupReport.backedUpFiles}`);
console.log(`Files skipped: ${backupReport.skippedFiles}`);
console.log(`Total backup size: ${backupReport.totalBackupSizeMB} MB`);
console.log(`Created at: ${backupReport.timestamp}`);

console.log("\nExclusion patterns:");
backupReport.excludePatterns.forEach(pattern => {
  console.log(`  • ${pattern}`);
});

console.log("\n" + "=".repeat(70) + "\n");

console.log("Visitor Pattern Benefits Summary:");
console.log("-".repeat(33));

console.log("✅ Benefits demonstrated:");
console.log("   • Adding operations without modifying file system classes");
console.log("   • Type-safe operation dispatch");
console.log("   • Separation of concerns (structure vs operations)");
console.log("   • Easy to add new analysis types");
console.log("   • Polymorphic behavior across different element types");

console.log("\n📈 Performance & Flexibility:");
console.log("   • Single traversal for multiple operations");
console.log("   • Visitors can maintain state across elements");
console.log("   • Easy to combine or chain visitors");
console.log("   • Extensible without touching existing code");
```

## ✅ Pros

- **Open/Closed Principle**: Can add new operations without modifying existing classes
- **Separation of Concerns**: Operations are separated from the object structure
- **Type Safety**: Compile-time type checking for operations
- **Single Responsibility**: Each visitor handles one specific operation
- **Data Accumulation**: Visitors can accumulate information while traversing

## ❌ Cons

- **Breaking Encapsulation**: Elements must expose enough details to visitors
- **Circular Dependency**: Elements depend on visitors and vice versa
- **Element Hierarchy Changes**: Adding new element types requires updating all visitors
- **Complex for Simple Operations**: Overkill for simple operations
- **Performance Overhead**: Extra indirection through visitor methods

## 🎯 When to Use

- **Multiple Operations**: Need to perform many unrelated operations on objects
- **Stable Structure**: Object structure is stable but operations change frequently
- **Algorithm Separation**: Want to separate algorithms from object structure
- **Type-Safe Dispatch**: Need compile-time type safety for operations
- **Complex Traversal**: Operations require complex traversal logic

## 🔄 Visitor Variations

### 1. **Generic Visitor**
```javascript
class GenericVisitor {
  visit(element) {
    const methodName = `visit${element.constructor.name}`;
    if (this[methodName]) {
      return this[methodName](element);
    }
    return this.defaultVisit(element);
  }
}
```

### 2. **Intrusive Visitor**
```javascript
class Element {
  // Element includes operation directly
  accept(visitor) {
    return visitor.visit(this);
  }
}
```

### 3. **Hierarchical Visitor**
```javascript
class HierarchicalVisitor {
  visitBefore(element) { /* pre-processing */ }
  visit(element) { /* main processing */ }
  visitAfter(element) { /* post-processing */ }
}
```

## 🔗 Related Patterns

- **Composite**: Visitor is often used with Composite pattern for tree structures
- **Interpreter**: Can use Visitor to implement operations on syntax trees
- **Iterator**: Both traverse object structures, but Iterator focuses on access while Visitor focuses on operations
- **Command**: Visitor operations can be implemented as commands

## 📚 Further Reading

- [Visitor Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/visitor)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [Expression Problem and Visitor Pattern](https://en.wikipedia.org/wiki/Expression_problem)
