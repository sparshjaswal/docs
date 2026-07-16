# Facade Pattern 🏛️

> **Definition**: The Facade pattern provides a simplified interface to a complex subsystem. It defines a higher-level interface that makes the subsystem easier to use.

## 🎯 Intent

Provide a unified interface to a set of interfaces in a subsystem. Facade defines a higher-level interface that makes the subsystem easier to use.

## 🤔 Problem

You need to work with a complex library or framework that has many classes and methods. Using the library directly requires understanding many details and making multiple method calls in the right order. You want a simpler way to perform common operations.

For example, to play a video, you might need to:
- Initialize video codec
- Load audio codec
- Create video file reader
- Set up audio mixer
- Start playback engine
- Handle synchronization

## 💡 Solution

The Facade pattern suggests creating a facade class that provides simple methods for common use cases. The facade delegates work to the appropriate classes in the subsystem and handles the complex interactions.

## 🏗️ Structure

```
Client
└── uses → Facade
            ├── method1() → subsystem.complexOperation1()
            ├── method2() → subsystem.complexOperation2()
            └── method3() → subsystem.complexOperation3()

Facade
└── uses → Complex Subsystem
           ├── ClassA
           ├── ClassB
           ├── ClassC
           └── ClassD
```

## 💻 Simple Example

### Home Theater System

```javascript
// Complex subsystem classes
class DVDPlayer {
  on() {
    console.log("💿 DVD Player is ON");
  }

  off() {
    console.log("💿 DVD Player is OFF");
  }

  play(movie) {
    console.log(`💿 Playing movie: "${movie}"`);
  }

  stop() {
    console.log("💿 DVD Player stopped");
  }
}

class Projector {
  on() {
    console.log("📽️ Projector is ON");
  }

  off() {
    console.log("📽️ Projector is OFF");
  }

  setInput(input) {
    console.log(`📽️ Projector input set to: ${input}`);
  }
}

class SoundSystem {
  on() {
    console.log("🔊 Sound System is ON");
  }

  off() {
    console.log("🔊 Sound System is OFF");
  }

  setVolume(volume) {
    console.log(`🔊 Volume set to: ${volume}`);
  }

  setSurroundSound() {
    console.log("🔊 Surround sound enabled");
  }
}

class Lights {
  dim(level) {
    console.log(`💡 Lights dimmed to ${level}%`);
  }

  on() {
    console.log("💡 Lights are ON");
  }
}

class PopcornMaker {
  on() {
    console.log("🍿 Popcorn maker is ON");
  }

  off() {
    console.log("🍿 Popcorn maker is OFF");
  }

  pop() {
    console.log("🍿 Popping popcorn...");
    console.log("🍿 Popcorn ready!");
  }
}

// Facade class
class HomeTheaterFacade {
  constructor() {
    this.dvdPlayer = new DVDPlayer();
    this.projector = new Projector();
    this.soundSystem = new SoundSystem();
    this.lights = new Lights();
    this.popcornMaker = new PopcornMaker();
  }

  watchMovie(movie) {
    console.log("🎬 Setting up movie experience...\n");

    // Complex sequence of operations simplified into one method
    this.popcornMaker.on();
    this.popcornMaker.pop();

    this.lights.dim(20);

    this.projector.on();
    this.projector.setInput("DVD");

    this.soundSystem.on();
    this.soundSystem.setVolume(8);
    this.soundSystem.setSurroundSound();

    this.dvdPlayer.on();
    this.dvdPlayer.play(movie);

    console.log(`\n🍿 Enjoy your movie: "${movie}"!`);
  }

  endMovie() {
    console.log("\n🎬 Shutting down movie experience...\n");

    this.dvdPlayer.stop();
    this.dvdPlayer.off();

    this.soundSystem.off();
    this.projector.off();
    this.lights.on();

    this.popcornMaker.off();

    console.log("\n✅ Movie experience ended. Thanks for watching!");
  }
}

// Usage
console.log("=== Home Theater Facade Demo ===\n");

const homeTheater = new HomeTheaterFacade();

// Simple interface for complex operations
homeTheater.watchMovie("The Matrix");

console.log("\n" + "=".repeat(40));

homeTheater.endMovie();
```

## 🌟 Real-World Example

### Computer System Facade

```javascript
// Complex subsystem classes
class CPU {
  start() {
    console.log("🖥️ CPU: Starting processor");
  }

  execute() {
    console.log("🖥️ CPU: Executing instructions");
  }

  stop() {
    console.log("🖥️ CPU: Stopping processor");
  }
}

class Memory {
  load() {
    console.log("💾 Memory: Loading system data");
  }

  free() {
    console.log("💾 Memory: Freeing up memory");
  }
}

class HardDrive {
  read() {
    console.log("💽 Hard Drive: Reading boot sector");
  }

  write(data) {
    console.log(`💽 Hard Drive: Writing data - ${data}`);
  }
}

class GraphicsCard {
  initialize() {
    console.log("🎮 Graphics Card: Initializing display");
  }

  render() {
    console.log("🎮 Graphics Card: Rendering graphics");
  }

  shutdown() {
    console.log("🎮 Graphics Card: Shutting down display");
  }
}

class NetworkCard {
  connect() {
    console.log("🌐 Network Card: Connecting to network");
  }

  disconnect() {
    console.log("🌐 Network Card: Disconnecting from network");
  }
}

class OperatingSystem {
  load() {
    console.log("💻 OS: Loading operating system");
  }

  startServices() {
    console.log("💻 OS: Starting system services");
  }

  shutdown() {
    console.log("💻 OS: Shutting down system");
  }
}

// Facade class
class ComputerFacade {
  constructor() {
    this.cpu = new CPU();
    this.memory = new Memory();
    this.hardDrive = new HardDrive();
    this.graphicsCard = new GraphicsCard();
    this.networkCard = new NetworkCard();
    this.os = new OperatingSystem();
  }

  startComputer() {
    console.log("🔌 Starting computer...\n");

    // Boot sequence - complex process simplified
    this.cpu.start();
    this.memory.load();
    this.hardDrive.read();
    this.graphicsCard.initialize();
    this.networkCard.connect();

    this.os.load();
    this.os.startServices();

    this.cpu.execute();
    this.graphicsCard.render();

    console.log("\n✅ Computer ready to use!");
  }

  shutdownComputer() {
    console.log("\n🔌 Shutting down computer...\n");

    // Shutdown sequence
    this.os.shutdown();
    this.networkCard.disconnect();
    this.graphicsCard.shutdown();
    this.memory.free();
    this.cpu.stop();

    console.log("\n✅ Computer shut down safely!");
  }

  installSoftware(softwareName) {
    console.log(`\n💿 Installing ${softwareName}...\n`);

    this.hardDrive.write(`${softwareName} installation files`);
    this.memory.load();
    this.cpu.execute();
    this.hardDrive.write(`${softwareName} registry entries`);

    console.log(`\n✅ ${softwareName} installed successfully!`);
  }
}

// Usage
console.log("=== Computer System Facade Demo ===\n");

const computer = new ComputerFacade();

// Simple methods hide complex subsystem interactions
computer.startComputer();

console.log("\n" + "=".repeat(50));

computer.installSoftware("Adobe Photoshop");

console.log("\n" + "=".repeat(50));

computer.shutdownComputer();
```

## 🔧 Another Simple Example

### Banking System Facade

```javascript
// Complex subsystem classes
class AccountService {
  getBalance(accountNumber) {
    console.log(`🏦 Checking balance for account: ${accountNumber}`);
    return Math.floor(Math.random() * 10000) + 1000; // Random balance
  }

  debit(accountNumber, amount) {
    console.log(`🏦 Debiting $${amount} from account: ${accountNumber}`);
    return true;
  }

  credit(accountNumber, amount) {
    console.log(`🏦 Crediting $${amount} to account: ${accountNumber}`);
    return true;
  }
}

class SecurityService {
  authenticateUser(username, password) {
    console.log(`🔐 Authenticating user: ${username}`);
    return password.length >= 6; // Simple validation
  }

  authorizeTransaction(accountNumber, amount) {
    console.log(`🔐 Authorizing transaction of $${amount}`);
    return amount <= 5000; // Limit transactions
  }
}

class NotificationService {
  sendEmail(email, message) {
    console.log(`📧 Email sent to ${email}: ${message}`);
  }

  sendSMS(phone, message) {
    console.log(`📱 SMS sent to ${phone}: ${message}`);
  }
}

class AuditService {
  logTransaction(transaction) {
    console.log(`📊 Transaction logged: ${JSON.stringify(transaction)}`);
  }
}

class ExchangeService {
  convertCurrency(amount, fromCurrency, toCurrency) {
    console.log(`💱 Converting ${amount} ${fromCurrency} to ${toCurrency}`);
    return amount * 1.1; // Simple conversion
  }
}

// Facade class
class BankingFacade {
  constructor() {
    this.accountService = new AccountService();
    this.securityService = new SecurityService();
    this.notificationService = new NotificationService();
    this.auditService = new AuditService();
    this.exchangeService = new ExchangeService();
  }

  transferMoney(fromAccount, toAccount, amount, username, password) {
    console.log(`\n💸 Processing money transfer...\n`);

    // Complex process simplified into one method
    if (!this.securityService.authenticateUser(username, password)) {
      console.log("❌ Authentication failed!");
      return false;
    }

    if (!this.securityService.authorizeTransaction(fromAccount, amount)) {
      console.log("❌ Transaction not authorized!");
      return false;
    }

    const balance = this.accountService.getBalance(fromAccount);
    if (balance < amount) {
      console.log("❌ Insufficient funds!");
      return false;
    }

    // Execute transfer
    this.accountService.debit(fromAccount, amount);
    this.accountService.credit(toAccount, amount);

    // Log and notify
    const transaction = {
      from: fromAccount,
      to: toAccount,
      amount: amount,
      timestamp: new Date().toISOString()
    };

    this.auditService.logTransaction(transaction);
    this.notificationService.sendEmail("user@example.com",
      `Transfer of $${amount} completed successfully`);

    console.log("\n✅ Money transfer completed!");
    return true;
  }

  checkBalanceWithNotification(accountNumber, username, password, email) {
    console.log(`\n💰 Checking account balance...\n`);

    if (!this.securityService.authenticateUser(username, password)) {
      console.log("❌ Authentication failed!");
      return null;
    }

    const balance = this.accountService.getBalance(accountNumber);

    this.notificationService.sendEmail(email,
      `Your account balance is $${balance}`);

    this.auditService.logTransaction({
      type: 'balance_check',
      account: accountNumber,
      timestamp: new Date().toISOString()
    });

    console.log(`\n💰 Current balance: $${balance}`);
    return balance;
  }

  internationalTransfer(fromAccount, toAccount, amount, fromCurrency, toCurrency, username, password) {
    console.log(`\n🌍 Processing international transfer...\n`);

    if (!this.securityService.authenticateUser(username, password)) {
      console.log("❌ Authentication failed!");
      return false;
    }

    // Convert currency
    const convertedAmount = this.exchangeService.convertCurrency(amount, fromCurrency, toCurrency);

    // Process transfer with converted amount
    return this.transferMoney(fromAccount, toAccount, convertedAmount, username, password);
  }
}

// Usage
console.log("=== Banking System Facade Demo ===\n");

const bank = new BankingFacade();

// Simple interface for complex banking operations
const transferResult = bank.transferMoney(
  "ACC123456",
  "ACC789012",
  500,
  "john_doe",
  "password123"
);

console.log("\n" + "=".repeat(50));

bank.checkBalanceWithNotification(
  "ACC123456",
  "john_doe",
  "password123",
  "john@example.com"
);

console.log("\n" + "=".repeat(50));

bank.internationalTransfer(
  "ACC123456",
  "ACC999888",
  1000,
  "USD",
  "EUR",
  "john_doe",
  "password123"
);
```

## ✅ Pros

- **Simplified Interface**: Provides easy-to-use interface for complex systems
- **Loose Coupling**: Reduces dependencies between clients and subsystem
- **Subsystem Protection**: Shields clients from subsystem complexity
- **Easy to Use**: Makes complex operations accessible with simple method calls
- **Centralized Control**: Single point of control for subsystem interactions

## ❌ Cons

- **Limited Flexibility**: May not expose all subsystem capabilities
- **God Object Risk**: Facade can become too large and complex
- **Additional Layer**: Adds another layer of abstraction
- **Maintenance**: Changes in subsystem may require facade updates

## 🎯 When to Use

- **Complex Subsystems**: When you have complex subsystems with many classes
- **Simple Interface**: When you want to provide a simple interface for common operations
- **Legacy Integration**: When working with complex legacy systems
- **API Simplification**: When you want to create a simplified API for third parties
- **Layer Separation**: When you want to separate different layers of your system

## 🔄 Facade Variations

### 1. **Multiple Facades**
```javascript
// Different facades for different user types
class AdminBankingFacade extends BankingFacade {
  generateReport() {
    // Admin-specific functionality
  }
}

class CustomerBankingFacade extends BankingFacade {
  // Only customer-relevant methods exposed
}
```

### 2. **Configurable Facade**
```javascript
class ConfigurableFacade {
  constructor(config) {
    this.subsystems = this.createSubsystems(config);
  }

  createSubsystems(config) {
    // Create subsystems based on configuration
  }
}
```

## 🔗 Related Patterns

- **Adapter**: Both provide interface to other code, but Adapter makes incompatible interfaces compatible while Facade simplifies complex interfaces
- **Mediator**: Both provide intermediary objects, but Mediator enables communication between objects while Facade simplifies subsystem interface
- **Proxy**: Both provide surrogate access, but Proxy controls access while Facade simplifies access
- **Abstract Factory**: Can be used with Facade to create subsystem objects

## 📚 Further Reading

- [Facade Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/facade)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [JavaScript Facade Pattern Examples](https://www.dofactory.com/javascript/design-patterns/facade)
