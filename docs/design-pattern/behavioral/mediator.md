---
id: design-pattern-behavioral-mediator
title: "Mediator Pattern 🎭"
slug: /design-pattern/behavioral/mediator
sidebar_label: "Mediator"
---

# Mediator Pattern 🎭

A Mediator is a central place that coordinates several parts. A receptionist directing a request to the right office is an everyday picture.

## Example: routing rental and sale requests {/* #javascript-walkthrough */}

This example creates a mediator containing a rental participant and a sale participant. Clients send a request label to the mediator rather than invoking either participant directly.

```js runnable
function HouseOwner() {
  this.action = function () {};
}
function HouseRent() {
  HouseOwner.call(this);
  this.action = function () {
    console.log(String("Client come to rent a house ").trim());
  };
}
function HouseSale() {
  HouseOwner.call(this);
  this.action = function () {
    console.log(String("Client come to need to sell ").trim());
  };
}
function Mediator() {
  this.owner1 = new HouseRent();
  this.owner2 = new HouseSale();
  this.handle = function (content) {
    if (content == "rent") {
      this.owner1.action();
    }
    if (content == "sale") {
      this.owner2.action();
    }
  };
}

var mediator = new Mediator();
mediator.handle("rent");
mediator.handle("sale");
```

```text output
Client come to rent a house
Client come to need to sell
```

<span id="walk-through-the-source" />
<span id="understand-the-collaboration" />

## How it works

Mediator centralizes coordination between a client and participants. The client calls `Mediator.handle`; the mediator constructs HouseRent and HouseSale, then selects an action using the request label. A rent request invokes the rental participant, and a sale request invokes the sale participant, producing their respective messages.

Both participants are created eagerly. Two independent `if` statements perform selection; distinct labels ensure only the matching action runs. The client needs no knowledge of individual participants because the mediator holds the routing rules.

## What the example does not establish

Adding routing decisions requires changes to the central mediator. Unknown labels are silently ignored, and this example provides no asynchronous delivery, participant registration, or failure handling.

## Practical case: a chatroom routes messages

Users register with a room and send messages through it. The room owns recipient lookup; senders do not need direct references to every other user.

```js runnable
class Chatroom {
  #users = new Map();
  register(user) {
    if (this.#users.has(user.name)) throw new Error("Duplicate user");
    this.#users.set(user.name, user);
    return (recipient, text) => this.#deliver(user.name, recipient, text);
  }
  #deliver(sender, recipient, text) {
    const user = this.#users.get(recipient);
    if (!user) throw new Error("Unknown recipient");
    user.receive(sender, text);
  }
}
class User {
  constructor(name, room) {
    this.name = name;
    this.send = room.register(this);
  }
  receive(sender, text) { console.log(`${this.name} received from ${sender}: ${text}`); }
}
const room = new Chatroom();
const mira = new User("Mira", room);
const noor = new User("Noor", room);
const lee = new User("Lee", room);
mira.send("Noor", "Hello");
noor.send("Lee", "Meeting at ten");
lee.send("Mira", "Thanks");
try { mira.send("Missing", "Hello"); }
catch (error) { console.log(error.message); }
```

```text output
Noor received from Mira: Hello
Lee received from Noor: Meeting at ten
Mira received from Lee: Thanks
Unknown recipient
```

Registration returns a sender-specific function, so an ordinary send call does not choose its own sender name. This is coordination, not an authentication boundary. A real chat server must verify identity, room membership, message size, delivery failures, and disconnect cleanup. Keep routing separate from unrelated application logic so the mediator stays understandable.

## Design decisions and failure modes

A mediator centralizes coordination. It can become a bottleneck in the design if every unrelated event and business rule is added to the same object.

## Exercises

Coordinate a search field, results list, and selection panel. Clear selection when the search changes without allowing the components to call one another directly.

<details>
<summary>Expected reasoning and checks</summary>

The mediator owns the collaboration rule and sends focused updates. Keep each component’s local rendering inside that component. Guard cycles where a programmatic update emits the same event again.

</details>

## Interview questions & answers

<details>
<summary>Mediator or Observer?</summary>

[Observer](observer.md) distributes notifications to subscribers. A mediator decides how participants collaborate. It may use observer-style events internally, but it owns a coordination policy.

</details>

**Key takeaway:** Centralize a coherent interaction, not the entire application.

## Continue reading

Use the shared [review checkpoint](../index.md#completion-checkpoint), then return to the [pattern catalog](../index.md).
