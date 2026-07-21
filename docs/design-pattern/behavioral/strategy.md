---
id: design-pattern-behavioral-strategy
title: Strategy Pattern 🎯
slug: /design-pattern/behavioral/strategy
sidebar_label: Strategy Pattern 🎯
---

# Strategy Pattern 🎯

> **Definition**: The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. Strategy lets the algorithm vary independently from clients that use it.

## 🎯 Intent

Enable selecting an algorithm's behavior at runtime by encapsulating algorithms in separate classes and making them interchangeable.

## 🤔 Problem

You have multiple ways of performing a task (like sorting, payment processing, or data validation) and you want to:

- Switch between them at runtime
- Add new algorithms without modifying existing code
- Avoid massive if-else or switch statements

For example, an e-commerce app might support multiple payment methods: credit card, PayPal, cryptocurrency, etc. Without the Strategy pattern, you'd end up with a massive switch statement that violates the Open-Closed Principle.

## 💡 Solution

The Strategy pattern suggests extracting all different algorithms into separate classes called strategies. The original class (context) gets a field for storing a reference to one of the strategies and delegates the work to the linked strategy object.

## 🏗️ Structure

```
Context
├── strategy: Strategy
├── setStrategy(strategy: Strategy)
└── executeStrategy()

Strategy (interface)
└── execute()

ConcreteStrategyA implements Strategy
└── execute()

ConcreteStrategyB implements Strategy
└── execute()

ConcreteStrategyC implements Strategy
└── execute()
```

## 💻 Code Example

### Basic Implementation

```javascript
// Strategy interface
class Strategy {
  execute(data) {
    throw new Error('execute() method must be implemented');
  }
}

// Concrete Strategies
class QuickSort extends Strategy {
  execute(data) {
    console.log('Sorting using QuickSort algorithm');
    return this.quickSort([...data]);
  }

  quickSort(arr) {
    if (arr.length <= 1) return arr;

    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter((x) => x < pivot);
    const middle = arr.filter((x) => x === pivot);
    const right = arr.filter((x) => x > pivot);

    return [...this.quickSort(left), ...middle, ...this.quickSort(right)];
  }
}

class BubbleSort extends Strategy {
  execute(data) {
    console.log('Sorting using BubbleSort algorithm');
    const arr = [...data];

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }
}

class MergeSort extends Strategy {
  execute(data) {
    console.log('Sorting using MergeSort algorithm');
    return this.mergeSort([...data]);
  }

  mergeSort(arr) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = this.mergeSort(arr.slice(0, mid));
    const right = this.mergeSort(arr.slice(mid));

    return this.merge(left, right);
  }

  merge(left, right) {
    const result = [];
    let i = 0,
      j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }

    return result.concat(left.slice(i), right.slice(j));
  }
}

// Context
class Sorter {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  sort(data) {
    if (!this.strategy) {
      throw new Error('No sorting strategy set');
    }
    return this.strategy.execute(data);
  }
}

// Usage
const data = [64, 34, 25, 12, 22, 11, 90];
const sorter = new Sorter(new QuickSort());

console.log('Original:', data);
console.log('Sorted:', sorter.sort(data));

// Change strategy at runtime
sorter.setStrategy(new BubbleSort());
console.log('Sorted with Bubble Sort:', sorter.sort(data));
```

## 🌟 Real-World Examples

### 1. Payment Processing System

```javascript
// Payment strategies
class PaymentStrategy {
  pay(amount) {
    throw new Error('pay() method must be implemented');
  }
}

class CreditCardPayment extends PaymentStrategy {
  constructor(cardNumber, expiryDate, cvv) {
    super();
    this.cardNumber = cardNumber;
    this.expiryDate = expiryDate;
    this.cvv = cvv;
  }

  pay(amount) {
    console.log(`💳 Processing $${amount} via Credit Card`);
    console.log(`Card: ****-****-****-${this.cardNumber.slice(-4)}`);

    // Simulate payment processing
    if (this.validateCard()) {
      console.log('✅ Payment successful!');
      return { success: true, transactionId: `CC_${Date.now()}` };
    }
    return { success: false, error: 'Invalid card details' };
  }

  validateCard() {
    return this.cardNumber.length === 16 && this.cvv.length === 3;
  }
}

class PayPalPayment extends PaymentStrategy {
  constructor(email, password) {
    super();
    this.email = email;
    this.password = password;
  }

  pay(amount) {
    console.log(`🅿️ Processing $${amount} via PayPal`);
    console.log(`Account: ${this.email}`);

    if (this.authenticate()) {
      console.log('✅ Payment successful!');
      return { success: true, transactionId: `PP_${Date.now()}` };
    }
    return { success: false, error: 'Authentication failed' };
  }

  authenticate() {
    return this.email.includes('@') && this.password.length >= 6;
  }
}

class CryptocurrencyPayment extends PaymentStrategy {
  constructor(walletAddress, privateKey, currency) {
    super();
    this.walletAddress = walletAddress;
    this.privateKey = privateKey;
    this.currency = currency;
  }

  pay(amount) {
    console.log(`₿ Processing $${amount} via ${this.currency}`);
    console.log(`Wallet: ${this.walletAddress.slice(0, 6)}...${this.walletAddress.slice(-4)}`);

    if (this.validateWallet()) {
      console.log('✅ Transaction broadcasted to blockchain!');
      return { success: true, transactionId: `${this.currency}_${Date.now()}` };
    }
    return { success: false, error: 'Invalid wallet' };
  }

  validateWallet() {
    return this.walletAddress.length >= 26;
  }
}

// Shopping cart context
class ShoppingCart {
  constructor() {
    this.items = [];
    this.paymentStrategy = null;
  }

  addItem(item, price) {
    this.items.push({ item, price });
  }

  setPaymentStrategy(strategy) {
    this.paymentStrategy = strategy;
  }

  getTotal() {
    return this.items.reduce((total, item) => total + item.price, 0);
  }

  checkout() {
    if (!this.paymentStrategy) {
      console.log('❌ Please select a payment method');
      return false;
    }

    const total = this.getTotal();
    console.log('\n🛒 Order Summary:');
    this.items.forEach((item) => {
      console.log(`   ${item.item}: $${item.price}`);
    });
    console.log(`   Total: $${total}`);
    console.log('─'.repeat(30));

    return this.paymentStrategy.pay(total);
  }
}

// Usage
const cart = new ShoppingCart();
cart.addItem('Laptop', 999.99);
cart.addItem('Mouse', 29.99);

// Try different payment methods
const creditCard = new CreditCardPayment('1234567812345678', '12/25', '123');
const paypal = new PayPalPayment('user@example.com', 'password123');
const bitcoin = new CryptocurrencyPayment(
  '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  'private_key',
  'Bitcoin',
);

cart.setPaymentStrategy(creditCard);
cart.checkout();

cart.setPaymentStrategy(paypal);
cart.checkout();

cart.setPaymentStrategy(bitcoin);
cart.checkout();
```

### 2. Data Validation Strategies

```javascript
class ValidationStrategy {
  validate(data) {
    throw new Error('validate() method must be implemented');
  }
}

class EmailValidation extends ValidationStrategy {
  validate(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    return {
      isValid,
      message: isValid ? 'Valid email' : 'Invalid email format',
    };
  }
}

class PasswordValidation extends ValidationStrategy {
  constructor(minLength = 8) {
    super();
    this.minLength = minLength;
  }

  validate(password) {
    const hasMinLength = password.length >= this.minLength;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password);

    const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;

    const issues = [];
    if (!hasMinLength) issues.push(`minimum ${this.minLength} characters`);
    if (!hasUpperCase) issues.push('uppercase letter');
    if (!hasLowerCase) issues.push('lowercase letter');
    if (!hasNumbers) issues.push('number');
    if (!hasSpecialChar) issues.push('special character');

    return {
      isValid,
      message: isValid ? 'Strong password' : `Password must contain: ${issues.join(', ')}`,
    };
  }
}

class PhoneValidation extends ValidationStrategy {
  validate(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    const isValid = phoneRegex.test(phone);

    return {
      isValid,
      message: isValid ? 'Valid phone number' : 'Invalid phone number format',
    };
  }
}

class FormValidator {
  constructor() {
    this.strategies = new Map();
  }

  addValidation(field, strategy) {
    this.strategies.set(field, strategy);
  }

  validate(formData) {
    const results = {};

    for (const [field, strategy] of this.strategies) {
      if (formData.hasOwnProperty(field)) {
        results[field] = strategy.validate(formData[field]);
      }
    }

    return results;
  }
}

// Usage
const validator = new FormValidator();
validator.addValidation('email', new EmailValidation());
validator.addValidation('password', new PasswordValidation(10));
validator.addValidation('phone', new PhoneValidation());

const formData = {
  email: 'user@example.com',
  password: 'Weak123',
  phone: '+1-555-123-4567',
};

const results = validator.validate(formData);
console.log('Validation Results:', results);
```

### 3. Compression Strategies

```javascript
class CompressionStrategy {
  compress(data) {
    throw new Error('compress() method must be implemented');
  }

  decompress(data) {
    throw new Error('decompress() method must be implemented');
  }
}

class ZipCompression extends CompressionStrategy {
  compress(data) {
    console.log('🗜️  Compressing with ZIP algorithm');
    // Simulate ZIP compression
    const compressed = `ZIP_COMPRESSED[${data.length}]`;
    console.log(`Original: ${data.length} bytes → Compressed: ${compressed.length} bytes`);
    return compressed;
  }

  decompress(compressedData) {
    console.log('📤 Decompressing ZIP data');
    return compressedData.replace('ZIP_COMPRESSED[', '').replace(']', '');
  }
}

class GzipCompression extends CompressionStrategy {
  compress(data) {
    console.log('🗜️  Compressing with GZIP algorithm');
    const compressed = `GZIP_COMPRESSED[${data.length}]`;
    console.log(`Original: ${data.length} bytes → Compressed: ${compressed.length} bytes`);
    return compressed;
  }

  decompress(compressedData) {
    console.log('📤 Decompressing GZIP data');
    return compressedData.replace('GZIP_COMPRESSED[', '').replace(']', '');
  }
}

class RarCompression extends CompressionStrategy {
  compress(data) {
    console.log('🗜️  Compressing with RAR algorithm');
    const compressed = `RAR_COMPRESSED[${data.length}]`;
    console.log(`Original: ${data.length} bytes → Compressed: ${compressed.length} bytes`);
    return compressed;
  }

  decompress(compressedData) {
    console.log('📤 Decompressing RAR data');
    return compressedData.replace('RAR_COMPRESSED[', '').replace(']', '');
  }
}

class FileCompressor {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  compressFile(filename, data) {
    console.log(`\n📁 Processing file: ${filename}`);
    return this.strategy.compress(data);
  }

  decompressFile(compressedData) {
    return this.strategy.decompress(compressedData);
  }
}

// Usage
const data = 'This is a sample file content that needs to be compressed...';
const compressor = new FileCompressor(new ZipCompression());

// Compress with ZIP
let compressed = compressor.compressFile('document.txt', data);

// Switch to GZIP
compressor.setStrategy(new GzipCompression());
compressed = compressor.compressFile('document.txt', data);

// Switch to RAR
compressor.setStrategy(new RarCompression());
compressed = compressor.compressFile('document.txt', data);
```

## ✅ Pros

- **Open/Closed Principle**: You can introduce new strategies without changing existing code
- **Runtime Algorithm Selection**: You can switch algorithms at runtime
- **Elimination of Conditionals**: Replaces large switch statements or if-else chains
- **Isolation of Implementation Details**: Each strategy encapsulates its algorithm
- **Code Reusability**: Strategies can be reused across different contexts

## ❌ Cons

- **Increased Number of Classes**: Can result in many small classes
- **Client Awareness**: Clients must be aware of different strategies to choose the appropriate one
- **Communication Overhead**: Context and strategies might need to exchange data
- **Strategy Interface Complexity**: If strategies have very different requirements, the interface might become complex

## 🎯 When to Use

- **Multiple Algorithm Variants**: When you have multiple ways of performing a task
- **Runtime Selection**: When you want to choose algorithms at runtime
- **Avoiding Conditionals**: When you want to eliminate large conditional statements
- **Plugin Architecture**: When building systems that support plugins or extensions
- **A/B Testing**: When you need to test different implementations

## 🔄 Common Variations

### 1. **Strategy with State**

```javascript
class StatefulStrategy extends Strategy {
  constructor() {
    super();
    this.state = {};
  }

  execute(data) {
    // Use and modify internal state
    this.state.executionCount = (this.state.executionCount || 0) + 1;
    return this.process(data);
  }

  process(data) {
    throw new Error('process() method must be implemented');
  }
}
```

### 2. **Strategy Factory**

```javascript
class StrategyFactory {
  static createStrategy(type) {
    switch (type) {
      case 'quick':
        return new QuickSort();
      case 'bubble':
        return new BubbleSort();
      case 'merge':
        return new MergeSort();
      default:
        throw new Error(`Unknown strategy type: ${type}`);
    }
  }
}

// Usage
const strategy = StrategyFactory.createStrategy('quick');
const sorter = new Sorter(strategy);
```

### 3. **Async Strategies**

```javascript
class AsyncStrategy {
  async execute(data) {
    throw new Error('execute() method must be implemented');
  }
}

class AsyncContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  async performOperation(data) {
    return await this.strategy.execute(data);
  }
}
```

## 🔗 Related Patterns

- **State**: Both patterns use composition and delegation, but Strategy focuses on algorithms while State focuses on behavior changes
- **Template Method**: Both patterns deal with varying algorithms, but Strategy uses composition while Template Method uses inheritance
- **Bridge**: Similar structure, but Bridge separates interface from implementation while Strategy makes algorithms interchangeable
- **Factory Method**: Often used together to create appropriate strategies

## 📈 Performance Considerations

- **Memory Usage**: Each strategy creates a separate object
- **Strategy Switching Cost**: Changing strategies has minimal overhead
- **Algorithm Complexity**: Choose strategies based on data size and performance requirements

## 📚 Further Reading

- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [Strategy Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/strategy)
- [JavaScript Strategy Pattern Examples](https://www.dofactory.com/javascript/design-patterns/strategy)
