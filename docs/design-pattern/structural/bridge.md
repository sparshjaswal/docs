# Bridge Pattern 🌉

> **Definition**: The Bridge pattern separates an abstraction from its implementation, allowing both to vary independently. It uses composition instead of inheritance to connect different hierarchies.

## 🎯 Intent

Decouple an abstraction from its implementation so that both can vary independently. This is useful when you want to avoid permanent binding between an abstraction and its implementation.

## 🤔 Problem

You have a class hierarchy that needs to work with multiple implementations. For example, shapes that can be drawn using different graphics APIs, or notifications that can be sent through different channels.

Without Bridge, you might end up with an explosion of classes:

- `WindowsCircle`, `LinuxCircle`, `MacCircle`
- `WindowsSquare`, `LinuxSquare`, `MacSquare`
- And so on...

## 💡 Solution

The Bridge pattern suggests dividing the classes into two hierarchies:

1. **Abstraction**: The high-level logic (shapes, notifications)
2. **Implementation**: The platform-specific code (graphics APIs, communication channels)

## 🏗️ Structure

```
Abstraction
├── implementation: Implementation
└── operation() → implementation.operationImpl()

RefinedAbstraction extends Abstraction
└── refinedOperation()

Implementation (interface)
└── operationImpl()

ConcreteImplementationA implements Implementation
└── operationImpl()

ConcreteImplementationB implements Implementation
└── operationImpl()
```

## 💻 Simple Example

### Shape Drawing with Different Renderers

```javascript
// Implementation side - Drawing APIs
class DrawingAPI {
  drawCircle(x, y, radius) {
    throw new Error('drawCircle() method must be implemented');
  }

  drawRectangle(x, y, width, height) {
    throw new Error('drawRectangle() method must be implemented');
  }
}

// Concrete Implementations
class CanvasAPI extends DrawingAPI {
  drawCircle(x, y, radius) {
    console.log(`🎨 Canvas: Drawing circle at (${x}, ${y}) with radius ${radius}`);
  }

  drawRectangle(x, y, width, height) {
    console.log(`🎨 Canvas: Drawing rectangle at (${x}, ${y}) with size ${width}x${height}`);
  }
}

class SVGGraphics extends DrawingAPI {
  drawCircle(x, y, radius) {
    console.log(`📐 SVG: <circle cx="${x}" cy="${y}" r="${radius}"/>`);
  }

  drawRectangle(x, y, width, height) {
    console.log(`📐 SVG: <rect x="${x}" y="${y}" width="${width}" height="${height}"/>`);
  }
}

// Abstraction side - Shapes
class Shape {
  constructor(drawingAPI) {
    this.drawingAPI = drawingAPI;
  }

  draw() {
    throw new Error('draw() method must be implemented');
  }
}

// Refined Abstractions
class Circle extends Shape {
  constructor(x, y, radius, drawingAPI) {
    super(drawingAPI);
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  draw() {
    this.drawingAPI.drawCircle(this.x, this.y, this.radius);
  }

  resize(factor) {
    this.radius *= factor;
    console.log(`🔄 Circle resized to radius ${this.radius}`);
  }
}

class Rectangle extends Shape {
  constructor(x, y, width, height, drawingAPI) {
    super(drawingAPI);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    this.drawingAPI.drawRectangle(this.x, this.y, this.width, this.height);
  }

  resize(factor) {
    this.width *= factor;
    this.height *= factor;
    console.log(`🔄 Rectangle resized to ${this.width}x${this.height}`);
  }
}

// Usage
console.log('=== Bridge Pattern Demo ===\n');

// Create different drawing APIs
const canvasAPI = new CanvasAPI();
const svgAPI = new SVGGraphics();

console.log('Drawing with Canvas API:');
console.log('-'.repeat(25));

const canvasCircle = new Circle(10, 20, 5, canvasAPI);
const canvasRect = new Rectangle(0, 0, 100, 50, canvasAPI);

canvasCircle.draw();
canvasRect.draw();

console.log('\nDrawing with SVG API:');
console.log('-'.repeat(20));

const svgCircle = new Circle(15, 25, 8, svgAPI);
const svgRect = new Rectangle(10, 10, 80, 40, svgAPI);

svgCircle.draw();
svgRect.draw();

console.log('\nResizing shapes:');
console.log('-'.repeat(15));

canvasCircle.resize(2);
canvasCircle.draw();

svgRect.resize(1.5);
svgRect.draw();
```

## 🌟 Real-World Example

### Notification System

```javascript
// Implementation side - Communication channels
class NotificationSender {
  send(message, recipient) {
    throw new Error('send() method must be implemented');
  }
}

// Concrete Implementations
class EmailSender extends NotificationSender {
  constructor(smtpServer) {
    super();
    this.smtpServer = smtpServer;
  }

  send(message, recipient) {
    console.log(`📧 Email sent to ${recipient}`);
    console.log(`   Server: ${this.smtpServer}`);
    console.log(`   Message: ${message}`);
  }
}

class SMSSender extends NotificationSender {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
  }

  send(message, recipient) {
    console.log(`📱 SMS sent to ${recipient}`);
    console.log(`   API: ${this.apiKey}`);
    console.log(`   Message: ${message}`);
  }
}

class PushNotificationSender extends NotificationSender {
  constructor(appId) {
    super();
    this.appId = appId;
  }

  send(message, recipient) {
    console.log(`🔔 Push notification sent to ${recipient}`);
    console.log(`   App: ${this.appId}`);
    console.log(`   Message: ${message}`);
  }
}

// Abstraction side - Notification types
class Notification {
  constructor(sender) {
    this.sender = sender;
  }

  send(recipient) {
    throw new Error('send() method must be implemented');
  }
}

// Refined Abstractions
class SimpleNotification extends Notification {
  constructor(title, message, sender) {
    super(sender);
    this.title = title;
    this.message = message;
  }

  send(recipient) {
    const fullMessage = `${this.title}: ${this.message}`;
    this.sender.send(fullMessage, recipient);
  }
}

class UrgentNotification extends Notification {
  constructor(title, message, sender) {
    super(sender);
    this.title = title;
    this.message = message;
  }

  send(recipient) {
    const urgentMessage = `🚨 URGENT - ${this.title}: ${this.message}`;
    this.sender.send(urgentMessage, recipient);

    // Send multiple times for urgent notifications
    console.log('   (Sending again for urgency...)');
    this.sender.send(urgentMessage, recipient);
  }
}

class ReminderNotification extends Notification {
  constructor(title, message, reminderTime, sender) {
    super(sender);
    this.title = title;
    this.message = message;
    this.reminderTime = reminderTime;
  }

  send(recipient) {
    const reminderMessage = `⏰ Reminder (${this.reminderTime}): ${this.title} - ${this.message}`;
    this.sender.send(reminderMessage, recipient);
  }
}

// Usage
console.log('=== Notification System Demo ===\n');

// Create different senders
const emailSender = new EmailSender('smtp.example.com');
const smsSender = new SMSSender('SMS_API_KEY_123');
const pushSender = new PushNotificationSender('MyApp_v1.0');

console.log('Simple Notifications:');
console.log('-'.repeat(20));

const emailNotification = new SimpleNotification(
  'Welcome',
  'Thank you for signing up!',
  emailSender,
);
emailNotification.send('user@example.com');

console.log();

const smsNotification = new SimpleNotification('Login Alert', 'New login detected', smsSender);
smsNotification.send('+1-555-123-4567');

console.log('\nUrgent Notifications:');
console.log('-'.repeat(20));

const urgentEmail = new UrgentNotification(
  'Security Alert',
  'Suspicious activity detected on your account',
  emailSender,
);
urgentEmail.send('admin@example.com');

console.log('\nReminder Notifications:');
console.log('-'.repeat(22));

const reminderPush = new ReminderNotification(
  'Meeting',
  'Team standup in 15 minutes',
  '10:45 AM',
  pushSender,
);
reminderPush.send('DeviceId_456');
```

## 🔧 Another Simple Example

### Remote Control System

```javascript
// Implementation side - Devices
class Device {
  turnOn() {
    throw new Error('turnOn() method must be implemented');
  }
  turnOff() {
    throw new Error('turnOff() method must be implemented');
  }
  setVolume(volume) {
    throw new Error('setVolume() method must be implemented');
  }
}

// Concrete Device Implementations
class TV extends Device {
  constructor() {
    super();
    this.isOn = false;
    this.volume = 10;
  }

  turnOn() {
    this.isOn = true;
    console.log('📺 TV is now ON');
  }

  turnOff() {
    this.isOn = false;
    console.log('📺 TV is now OFF');
  }

  setVolume(volume) {
    this.volume = volume;
    console.log(`📺 TV volume set to ${volume}`);
  }
}

class Radio extends Device {
  constructor() {
    super();
    this.isOn = false;
    this.volume = 5;
  }

  turnOn() {
    this.isOn = true;
    console.log('📻 Radio is now ON');
  }

  turnOff() {
    this.isOn = false;
    console.log('📻 Radio is now OFF');
  }

  setVolume(volume) {
    this.volume = volume;
    console.log(`📻 Radio volume set to ${volume}`);
  }
}

// Abstraction side - Remote controls
class Remote {
  constructor(device) {
    this.device = device;
  }

  power() {
    console.log('🔘 Power button pressed');
    // Implementation depends on device state
  }

  volumeUp() {
    console.log('🔘 Volume up pressed');
    // Implementation will vary
  }

  volumeDown() {
    console.log('🔘 Volume down pressed');
    // Implementation will vary
  }
}

// Refined Abstraction
class BasicRemote extends Remote {
  power() {
    super.power();
    if (this.device.isOn) {
      this.device.turnOff();
    } else {
      this.device.turnOn();
    }
  }

  volumeUp() {
    super.volumeUp();
    this.device.setVolume(this.device.volume + 1);
  }

  volumeDown() {
    super.volumeDown();
    this.device.setVolume(Math.max(0, this.device.volume - 1));
  }
}

class AdvancedRemote extends BasicRemote {
  mute() {
    console.log('🔘 Mute button pressed');
    this.device.setVolume(0);
    console.log('🔇 Device muted');
  }

  setVolume(volume) {
    console.log(`🔘 Setting volume to ${volume}`);
    this.device.setVolume(volume);
  }
}

// Usage
console.log('=== Remote Control System Demo ===\n');

// Create devices
const tv = new TV();
const radio = new Radio();

console.log('Basic Remote with TV:');
console.log('-'.repeat(20));

const basicTVRemote = new BasicRemote(tv);
basicTVRemote.power(); // Turn on TV
basicTVRemote.volumeUp(); // Increase volume
basicTVRemote.volumeUp(); // Increase volume
basicTVRemote.power(); // Turn off TV

console.log('\nAdvanced Remote with Radio:');
console.log('-'.repeat(25));

const advancedRadioRemote = new AdvancedRemote(radio);
advancedRadioRemote.power(); // Turn on radio
advancedRadioRemote.setVolume(15); // Set specific volume
advancedRadioRemote.mute(); // Mute radio
advancedRadioRemote.power(); // Turn off radio
```

## ✅ Pros

- **Decoupling**: Separates abstraction from implementation
- **Platform Independence**: Abstractions work with different implementations
- **Runtime Binding**: Can switch implementations at runtime
- **Extensibility**: Easy to add new abstractions or implementations
- **Single Responsibility**: Each class has a single reason to change

## ❌ Cons

- **Complexity**: Increases code complexity with more classes and interfaces
- **Performance**: May introduce slight performance overhead
- **Learning Curve**: Can be confusing initially

## 🎯 When to Use

- **Platform Independence**: When you need to support multiple platforms
- **Runtime Implementation Switching**: When you want to change implementations at runtime
- **Avoiding Class Explosion**: When inheritance would create too many classes
- **Interface Evolution**: When abstractions and implementations need to evolve separately

## 🔄 Bridge vs Similar Patterns

### Bridge vs Adapter

- **Bridge**: Designed upfront, separates abstraction from implementation
- **Adapter**: Added later, makes incompatible interfaces work together

### Bridge vs Strategy

- **Bridge**: About structure, separates what from how
- **Strategy**: About behavior, makes algorithms interchangeable

## 🔗 Related Patterns

- **Adapter**: Both involve interface conversion, but Bridge is planned while Adapter is reactive
- **State**: Can use Bridge to separate state interface from state implementations
- **Strategy**: Similar structure but different intent - Bridge is structural, Strategy is behavioral
- **Abstract Factory**: Can be used together - factories can create implementations for Bridge

## 📚 Further Reading

- [Bridge Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/bridge)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [JavaScript Bridge Pattern Examples](https://www.dofactory.com/javascript/design-patterns/bridge)
