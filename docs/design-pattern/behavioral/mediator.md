---
id: design-pattern-behavioral-mediator
title: Mediator Pattern 🎭
slug: /design-pattern/behavioral/mediator
sidebar_label: Mediator Pattern 🎭
---

# Mediator Pattern 🎭

> **Definition**: The Mediator pattern defines how a set of objects interact with each other. It promotes loose coupling by keeping objects from referring to each other explicitly, and lets you vary their interaction independently.

## 🎯 Intent

Define an object that encapsulates how a set of objects interact. Mediator promotes loose coupling by keeping objects from referring to each other explicitly, and it lets you vary their interaction independently.

## 🤔 Problem

When objects in a system communicate directly with each other, they become tightly coupled:

- **Complex Dependencies**: Objects have many direct references to other objects
- **Difficult Maintenance**: Changes to one object affect many others
- **Reusability Issues**: Objects are hard to reuse in different contexts
- **Communication Chaos**: Many-to-many relationships create complexity

Think of an air traffic control system - without a central controller, pilots would need to communicate directly with every other plane, creating chaos.

## 💡 Solution

The Mediator pattern suggests creating a mediator object that handles all communications between objects. Objects don't communicate directly but through the mediator, which coordinates their interactions.

## 🏗️ Structure

```
Mediator (interface)
└── +mediate(sender: Component, event: string): void

ConcreteMediator implements Mediator
├── -componentA: ComponentA
├── -componentB: ComponentB
├── +mediate(sender: Component, event: string): void

Component (abstract)
├── +mediator: Mediator
├── +notify(event: string): void

ComponentA, ComponentB extend Component
├── +doA(), +doB() → notify("eventA"), notify("eventB")
```

## 💻 Simple Example

### Chat Room Mediator

```javascript
// Mediator interface
class ChatMediator {
  sendMessage(message, user) {
    throw new Error('sendMessage() method must be implemented');
  }

  addUser(user) {
    throw new Error('addUser() method must be implemented');
  }

  removeUser(user) {
    throw new Error('removeUser() method must be implemented');
  }
}

// Concrete Mediator - Chat Room
class ChatRoom extends ChatMediator {
  constructor(name) {
    super();
    this.name = name;
    this.users = [];
    this.messageHistory = [];
    this.created = new Date();
  }

  addUser(user) {
    this.users.push(user);
    user.setChatRoom(this);
    console.log(`👥 ${user.name} joined the chat room: ${this.name}`);

    // Notify other users
    this.broadcastSystemMessage(`${user.name} joined the chat`);

    // Show recent messages to new user
    if (this.messageHistory.length > 0) {
      console.log(`📜 Showing recent messages to ${user.name}:`);
      this.messageHistory.slice(-3).forEach((msg) => {
        console.log(`   ${msg.timestamp.toLocaleTimeString()} ${msg.sender}: ${msg.text}`);
      });
    }
  }

  removeUser(user) {
    const index = this.users.indexOf(user);
    if (index !== -1) {
      this.users.splice(index, 1);
      console.log(`👋 ${user.name} left the chat room: ${this.name}`);

      // Notify other users
      this.broadcastSystemMessage(`${user.name} left the chat`);
    }
  }

  sendMessage(message, sender) {
    console.log(`💬 [${this.name}] ${sender.name}: ${message}`);

    // Store message in history
    this.messageHistory.push({
      sender: sender.name,
      text: message,
      timestamp: new Date(),
    });

    // Deliver to all other users
    this.users.forEach((user) => {
      if (user !== sender) {
        user.receiveMessage(message, sender.name);
      }
    });
  }

  broadcastSystemMessage(message) {
    console.log(`🔔 [${this.name}] System: ${message}`);

    this.users.forEach((user) => {
      user.receiveSystemMessage(message);
    });
  }

  getUserCount() {
    return this.users.length;
  }

  getStats() {
    console.log(`📊 Chat Room "${this.name}" Stats:`);
    console.log(`   Active Users: ${this.users.length}`);
    console.log(`   Total Messages: ${this.messageHistory.length}`);
    console.log(`   Created: ${this.created.toLocaleString()}`);
    if (this.users.length > 0) {
      console.log(`   Users: ${this.users.map((u) => u.name).join(', ')}`);
    }
  }
}

// Abstract User component
class ChatUser {
  constructor(name) {
    this.name = name;
    this.chatRoom = null;
    this.messagesSent = 0;
    this.messagesReceived = 0;
  }

  setChatRoom(chatRoom) {
    this.chatRoom = chatRoom;
  }

  sendMessage(message) {
    if (!this.chatRoom) {
      console.log(`❌ ${this.name}: Not connected to any chat room`);
      return;
    }

    this.messagesSent++;
    this.chatRoom.sendMessage(message, this);
  }

  receiveMessage(message, senderName) {
    this.messagesReceived++;
    console.log(`📱 ${this.name} received: "${message}" from ${senderName}`);
  }

  receiveSystemMessage(message) {
    console.log(`🔔 ${this.name} received system message: ${message}`);
  }

  leaveChatRoom() {
    if (this.chatRoom) {
      this.chatRoom.removeUser(this);
      this.chatRoom = null;
    }
  }

  getStats() {
    console.log(`📈 ${this.name}'s Stats:`);
    console.log(`   Messages Sent: ${this.messagesSent}`);
    console.log(`   Messages Received: ${this.messagesReceived}`);
    console.log(`   Current Room: ${this.chatRoom ? this.chatRoom.name : 'None'}`);
  }
}

// Usage
console.log('=== Chat Room Mediator Demo ===\n');

console.log('Creating chat room and users:');
console.log('-'.repeat(30));

// Create chat room (mediator)
const generalChat = new ChatRoom('General Chat');

// Create users (components)
const alice = new ChatUser('Alice');
const bob = new ChatUser('Bob');
const charlie = new ChatUser('Charlie');

console.log('\nUsers joining chat room:');
console.log('-'.repeat(25));

// Users join chat room
generalChat.addUser(alice);
generalChat.addUser(bob);
generalChat.addUser(charlie);

console.log('\n' + '='.repeat(50) + '\n');

console.log('Chat conversation:');
console.log('-'.repeat(17));

// Users send messages through the mediator
alice.sendMessage('Hello everyone! 👋');
bob.sendMessage('Hi Alice! How are you?');
charlie.sendMessage('Good morning! ☀️');
alice.sendMessage("I'm doing great, thanks for asking!");
bob.sendMessage('Anyone up for lunch later?');
charlie.sendMessage('Count me in! 🍕');

console.log('\n' + '='.repeat(50) + '\n');

console.log('User leaving chat:');
console.log('-'.repeat(18));

bob.leaveChatRoom();

console.log('\nContinuing conversation:');
console.log('-'.repeat(25));

alice.sendMessage('Bob left us 😢');
charlie.sendMessage("We'll catch up with him later");

console.log('\n' + '='.repeat(50) + '\n');

console.log('Statistics:');
console.log('-'.repeat(11));

generalChat.getStats();
console.log();
alice.getStats();
console.log();
charlie.getStats();
```

## 🌟 Real-World Example

### Air Traffic Control System

```javascript
// Mediator interface
class AirTrafficControl {
  requestLanding(aircraft) {
    throw new Error('requestLanding() method must be implemented');
  }

  requestTakeoff(aircraft) {
    throw new Error('requestTakeoff() method must be implemented');
  }

  registerAircraft(aircraft) {
    throw new Error('registerAircraft() method must be implemented');
  }
}

// Concrete Mediator - Airport Control Tower
class ControlTower extends AirTrafficControl {
  constructor(airportCode) {
    super();
    this.airportCode = airportCode;
    this.aircrafts = [];
    this.runwayStatus = {
      runway1: 'free', // 'free', 'occupied', 'maintenance'
      runway2: 'free',
    };
    this.landingQueue = [];
    this.takeoffQueue = [];
    this.weatherConditions = 'clear'; // 'clear', 'storm', 'fog'
  }

  registerAircraft(aircraft) {
    this.aircrafts.push(aircraft);
    aircraft.setControlTower(this);
    console.log(
      `✈️ Aircraft ${aircraft.callSign} registered with ${this.airportCode} Control Tower`,
    );

    // Send weather update
    this.sendWeatherUpdate(aircraft);
  }

  requestLanding(aircraft) {
    console.log(`📡 ${this.airportCode} Tower: Landing request from ${aircraft.callSign}`);

    // Check weather conditions
    if (this.weatherConditions !== 'clear') {
      console.log(
        `❌ ${this.airportCode} Tower: Landing denied for ${aircraft.callSign} - Weather: ${this.weatherConditions}`,
      );
      aircraft.receiveMessage(`Landing denied - weather conditions: ${this.weatherConditions}`);
      return false;
    }

    // Check runway availability
    const availableRunway = this.getAvailableRunway();
    if (availableRunway) {
      this.assignRunwayForLanding(aircraft, availableRunway);
      return true;
    } else {
      // Add to queue
      this.landingQueue.push(aircraft);
      console.log(
        `⏳ ${this.airportCode} Tower: ${aircraft.callSign} added to landing queue (position ${this.landingQueue.length})`,
      );
      aircraft.receiveMessage(`Added to landing queue, position ${this.landingQueue.length}`);
      return false;
    }
  }

  requestTakeoff(aircraft) {
    console.log(`📡 ${this.airportCode} Tower: Takeoff request from ${aircraft.callSign}`);

    // Check weather conditions
    if (this.weatherConditions !== 'clear') {
      console.log(
        `❌ ${this.airportCode} Tower: Takeoff denied for ${aircraft.callSign} - Weather: ${this.weatherConditions}`,
      );
      aircraft.receiveMessage(`Takeoff denied - weather conditions: ${this.weatherConditions}`);
      return false;
    }

    // Check runway availability
    const availableRunway = this.getAvailableRunway();
    if (availableRunway) {
      this.assignRunwayForTakeoff(aircraft, availableRunway);
      return true;
    } else {
      // Add to queue
      this.takeoffQueue.push(aircraft);
      console.log(
        `⏳ ${this.airportCode} Tower: ${aircraft.callSign} added to takeoff queue (position ${this.takeoffQueue.length})`,
      );
      aircraft.receiveMessage(`Added to takeoff queue, position ${this.takeoffQueue.length}`);
      return false;
    }
  }

  getAvailableRunway() {
    for (const [runway, status] of Object.entries(this.runwayStatus)) {
      if (status === 'free') {
        return runway;
      }
    }
    return null;
  }

  assignRunwayForLanding(aircraft, runway) {
    this.runwayStatus[runway] = 'occupied';
    console.log(
      `🛬 ${this.airportCode} Tower: ${aircraft.callSign} cleared for landing on ${runway}`,
    );
    aircraft.receiveMessage(`Cleared for landing on ${runway}`);

    // Simulate landing time
    setTimeout(() => {
      this.completeLanding(aircraft, runway);
    }, 2000);
  }

  assignRunwayForTakeoff(aircraft, runway) {
    this.runwayStatus[runway] = 'occupied';
    console.log(
      `🛫 ${this.airportCode} Tower: ${aircraft.callSign} cleared for takeoff on ${runway}`,
    );
    aircraft.receiveMessage(`Cleared for takeoff on ${runway}`);

    // Simulate takeoff time
    setTimeout(() => {
      this.completeTakeoff(aircraft, runway);
    }, 1500);
  }

  completeLanding(aircraft, runway) {
    this.runwayStatus[runway] = 'free';
    console.log(
      `✅ ${this.airportCode} Tower: ${aircraft.callSign} landed successfully on ${runway}`,
    );
    aircraft.receiveMessage(`Landing complete on ${runway}. Taxi to gate.`);

    // Process next in queue
    this.processQueues();
  }

  completeTakeoff(aircraft, runway) {
    this.runwayStatus[runway] = 'free';
    console.log(
      `✅ ${this.airportCode} Tower: ${aircraft.callSign} departed successfully from ${runway}`,
    );
    aircraft.receiveMessage(`Takeoff complete. Contact departure control.`);

    // Process next in queue
    this.processQueues();
  }

  processQueues() {
    // Process landing queue first (priority)
    if (this.landingQueue.length > 0) {
      const nextAircraft = this.landingQueue.shift();
      this.requestLanding(nextAircraft);
    } else if (this.takeoffQueue.length > 0) {
      const nextAircraft = this.takeoffQueue.shift();
      this.requestTakeoff(nextAircraft);
    }
  }

  sendWeatherUpdate(aircraft) {
    aircraft.receiveMessage(`Current weather: ${this.weatherConditions}`);
  }

  setWeatherConditions(conditions) {
    const oldConditions = this.weatherConditions;
    this.weatherConditions = conditions;
    console.log(
      `🌤️ ${this.airportCode} Tower: Weather changed from ${oldConditions} to ${conditions}`,
    );

    // Broadcast to all aircraft
    this.aircrafts.forEach((aircraft) => {
      aircraft.receiveMessage(`Weather update: ${conditions}`);
    });
  }

  getStatus() {
    console.log(`📊 ${this.airportCode} Control Tower Status:`);
    console.log(`   Weather: ${this.weatherConditions}`);
    console.log(`   Runway 1: ${this.runwayStatus.runway1}`);
    console.log(`   Runway 2: ${this.runwayStatus.runway2}`);
    console.log(`   Landing Queue: ${this.landingQueue.length} aircraft`);
    console.log(`   Takeoff Queue: ${this.takeoffQueue.length} aircraft`);
    console.log(`   Registered Aircraft: ${this.aircrafts.length}`);
  }
}

// Abstract Aircraft component
class Aircraft {
  constructor(callSign, type, airline) {
    this.callSign = callSign;
    this.type = type;
    this.airline = airline;
    this.controlTower = null;
    this.status = 'in-flight'; // 'in-flight', 'landed', 'taxiing', 'departed'
    this.messages = [];
  }

  setControlTower(controlTower) {
    this.controlTower = controlTower;
  }

  requestLanding() {
    if (!this.controlTower) {
      console.log(`❌ ${this.callSign}: No control tower assigned`);
      return;
    }

    console.log(`📞 ${this.callSign}: Requesting landing permission`);
    return this.controlTower.requestLanding(this);
  }

  requestTakeoff() {
    if (!this.controlTower) {
      console.log(`❌ ${this.callSign}: No control tower assigned`);
      return;
    }

    console.log(`📞 ${this.callSign}: Requesting takeoff permission`);
    return this.controlTower.requestTakeoff(this);
  }

  receiveMessage(message) {
    this.messages.push({
      message,
      timestamp: new Date(),
    });
    console.log(`📻 ${this.callSign} received: "${message}"`);
  }

  getInfo() {
    console.log(`✈️ Aircraft Info:`);
    console.log(`   Call Sign: ${this.callSign}`);
    console.log(`   Type: ${this.type}`);
    console.log(`   Airline: ${this.airline}`);
    console.log(`   Status: ${this.status}`);
    console.log(`   Messages Received: ${this.messages.length}`);
  }
}

// Usage
console.log('\n=== Air Traffic Control Mediator Demo ===\n');

console.log('Setting up airport control tower:');
console.log('-'.repeat(35));

const jfkTower = new ControlTower('JFK');

console.log('Aircraft requesting services:');
console.log('-'.repeat(30));

// Create aircraft
const flight123 = new Aircraft('AA123', 'Boeing 737', 'American Airlines');
const flight456 = new Aircraft('UA456', 'Airbus A320', 'United Airlines');
const flight789 = new Aircraft('DL789', 'Boeing 777', 'Delta Airlines');

// Register aircraft with control tower
jfkTower.registerAircraft(flight123);
jfkTower.registerAircraft(flight456);
jfkTower.registerAircraft(flight789);

console.log('\n' + '='.repeat(50) + '\n');

console.log('Flight operations:');
console.log('-'.repeat(18));

// Multiple aircraft requesting landing
flight123.requestLanding();
flight456.requestLanding();
flight789.requestLanding();

console.log('\n' + '-'.repeat(30) + '\n');

// Wait a bit and check status
setTimeout(() => {
  console.log('\nCurrent airport status:');
  console.log('-'.repeat(23));
  jfkTower.getStatus();

  console.log('\nWeather change:');
  console.log('-'.repeat(15));
  jfkTower.setWeatherConditions('fog');

  // New aircraft trying to land in bad weather
  const emergencyFlight = new Aircraft('EM911', 'Boeing 767', 'Emergency Medical');
  jfkTower.registerAircraft(emergencyFlight);
  emergencyFlight.requestLanding();
}, 3000);
```

## ✅ Pros

- **Loose Coupling**: Components don't reference each other directly
- **Centralized Control**: Complex interactions are managed in one place
- **Reusability**: Components can be reused in different mediator contexts
- **Easy Maintenance**: Changes to interaction logic are localized
- **Single Responsibility**: Each component focuses on its core functionality

## ❌ Cons

- **God Object**: Mediator can become overly complex
- **Performance**: Additional layer of indirection
- **Single Point of Failure**: If mediator fails, all communication fails
- **Complexity Transfer**: Moves complexity from components to mediator

## 🎯 When to Use

- **Complex Communication**: Many objects communicate in complex ways
- **Tight Coupling**: Objects are tightly coupled through communication
- **Centralized Logic**: Need to centralize complex interaction logic
- **Reusable Components**: Want to make components reusable across contexts
- **Communication Protocol**: Need to change communication protocol dynamically

## 🔄 Mediator Variations

### 1. **Observer-based Mediator**

```javascript
class ObserverMediator extends EventEmitter {
  constructor() {
    super();
    this.components = [];
  }

  register(component) {
    this.components.push(component);
    component.setMediator(this);
  }

  mediate(event, data, sender) {
    this.emit(event, data, sender);
  }
}
```

### 2. **Command-based Mediator**

```javascript
class CommandMediator {
  constructor() {
    this.commandHandlers = new Map();
  }

  registerHandler(command, handler) {
    this.commandHandlers.set(command, handler);
  }

  execute(command, data) {
    const handler = this.commandHandlers.get(command);
    if (handler) {
      return handler(data);
    }
  }
}
```

### 3. **State-based Mediator**

```javascript
class StatefulMediator {
  constructor() {
    this.state = {};
    this.components = [];
  }

  updateState(key, value) {
    this.state[key] = value;
    this.notifyComponents(key, value);
  }

  notifyComponents(key, value) {
    this.components.forEach((component) => {
      component.onStateChange(key, value);
    });
  }
}
```

## 🔗 Related Patterns

- **Observer**: Mediator can use Observer pattern for event broadcasting
- **Command**: Commands can be used to encapsulate requests sent through mediator
- **Facade**: Both provide simplified interface, but Mediator coordinates while Facade simplifies
- **Chain of Responsibility**: Both handle requests, but Chain passes requests while Mediator coordinates

## 📚 Further Reading

- [Mediator Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/mediator)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [MVC Pattern and Mediator](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)
