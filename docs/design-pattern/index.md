---
title: 'Design patterns'
description: 'Choose patterns by the change they isolate, then practice contracts, failure modes, and trade-offs.'
sidebar_label: 'Design patterns'
sidebar_position: 1
---

# Design patterns

A design pattern describes how objects share responsibilities and work together to solve a recurring design problem. Use the one-line explanations below to understand each pattern's purpose and choose a topic to explore.

**Before you start:** understand [functions](../javascript/functions/README.md), [objects and classes](../javascript/objects-and-classes.md), and [composition](../javascript/object-composition.md).

## Your first four patterns

Start with a working piece of code and one change you need to make. Learn these four patterns before exploring the full catalog:

1. [Strategy](./behavioral/strategy.md): switch between algorithms without changing the code that uses them.
2. [Adapter](./structural/adapter.md): translate an interface so otherwise incompatible objects can work together.
3. [Facade](./structural/facade.md): provide a simple interface to a complex set of collaborating objects.
4. [Observer](./behavioral/observer.md): notify subscribed objects when another object's state changes.

Read the explanation and trace the example’s calls. Each lesson also includes a practical case with runnable JavaScript or a complete browser snippet, expected results, and implementation limits. You do not need to memorize every pattern name or add a class whenever a function will do.

## Pattern catalog

### Creational patterns

Control how objects are created, assembled, copied, or shared.

| Pattern | What it does |
| --- | --- |
| [Singleton](./creational/singleton.md) | Ensures a class has one shared instance and provides a common way to access it. |
| [Factory Method](./creational/factory-method.md) | Lets subclasses decide which concrete object a shared creation method returns. |
| [Builder](./creational/builder.md) | Constructs complex objects step by step, separating the construction process from the final representation. |
| [Prototype](./creational/prototype.md) | Creates new objects by copying an existing object. |
| [Abstract Factory](./creational/abstract-factory.md) | Creates families of related objects through a shared interface without exposing their concrete classes. |

### Structural patterns

Organize objects into larger structures or adapt the way clients use them.

| Pattern | What it does |
| --- | --- |
| [Composite](./structural/composite.md) | Organizes objects into trees so individual objects and groups can be used through the same interface. |
| [Adapter](./structural/adapter.md) | Converts one interface into another so otherwise incompatible objects can work together. |
| [Facade](./structural/facade.md) | Provides a simple interface to a complex set of collaborating objects. |
| [Decorator](./structural/decorator.md) | Adds behavior to an object by wrapping it while preserving its interface. |
| [Bridge](./structural/bridge.md) | Separates an abstraction from its implementation so both can change independently. |
| [Flyweight](./structural/flyweight.md) | Reduces memory use by sharing common data across many objects while keeping per-use state separate. |
| [Proxy](./structural/proxy.md) | Controls access to another object through a substitute with the same interface. |

### Behavioral patterns

Coordinate actions, state changes, and communication between objects.

| Pattern | What it does |
| --- | --- |
| [Strategy](./behavioral/strategy.md) | Makes algorithms interchangeable so a caller can change behavior without changing its own logic. |
| [Template Method](./behavioral/template-method.md) | Defines an algorithm's sequence of steps while letting subclasses customize selected steps. |
| [Chain of Responsibility](./behavioral/chain-of-responsibility.md) | Passes a request through a chain of handlers so each can handle it or forward it. |
| [Command](./behavioral/command.md) | Represents a request as an object so it can be passed around, queued, or recorded. |
| [Iterator](./behavioral/iterator.md) | Provides a way to visit a collection's elements without exposing how they are stored. |
| [Mediator](./behavioral/mediator.md) | Centralizes communication between objects so they do not need to coordinate directly with each other. |
| [Memento](./behavioral/memento.md) | Captures an object's state so it can be restored later without exposing its internal details. |
| [Observer](./behavioral/observer.md) | Notifies subscribed objects when another object's state changes. |
| [Visitor](./behavioral/visitor.md) | Adds operations to an object structure without changing its element classes. |
| [Interpreter](./behavioral/interpreter.md) | Represents and evaluates expressions in a small, explicitly defined language. |
| [State](./behavioral/state.md) | Lets an object change its behavior by delegating to an object representing its current state. |

## Continue learning

From the repository root, run `yarn check:javascript` to compare marked console examples against their expected output. Browser examples include their expected interactions in the lesson. These checks cover the demonstrated inputs.

For related concepts, see [SOLID principles](../solid-design-principles/index.md) and [functional programming](../functional-programming/index.md).

<span id="10-good-coding-principles-to-improve-code-quality" />

<span id="exercise" />

## Choose by the change

| Change you need | Compare | Decision cue |
| --- | --- | --- |
| Create different products | Factory Method / Abstract Factory / Builder | One creation step, a matching family, or staged construction? |
| Wrap an existing object | Adapter / Decorator / Proxy / Facade | Translate, add behavior, control access, or simplify a subsystem? |
| Vary behavior | Strategy / State / Template Method | Caller-selected algorithm, lifecycle transition, or fixed workflow? |
| Coordinate participants | Observer / Mediator / Chain | Notify listeners, own collaboration, or delegate until handled? |
| Extend operations or rules | Visitor / Interpreter | Stable element types or an explicit expression language? |

Do not choose from the class diagram alone. Identify the next known change and the contract that must stay stable. A plain function or direct conditional is often the right baseline.

<span id="exercise-and-interview-question" />

## Programming patterns at system boundaries

A pattern organizes code; it does not supply delivery, authorization, concurrency, or transaction guarantees. Wrap two shipping providers behind one interface, then model a timeout after a label may already have been created. The wrapper must preserve that uncertainty.

<details>
<summary>Expected design reasoning</summary>

Normalize units and ordinary results in adapters. Preserve an operation identifier and a distinct unknown outcome when the provider cannot confirm completion. Reconcile before retrying a non-idempotent purchase. Use the [API contract](../system-design/interfaces/api-design.md) to define the guarantee; the pattern only organizes its implementation.

</details>

<span id="exercise-1" />

## UML Class Diagrams Cheatsheet

Use a diagram to answer who calls whom, owns what, or can be substituted. UML is a modeling language, not an executable proof.

| Relationship | Meaning to verify in code |
| --- | --- |
| Association | One object knows about or references another. |
| Composition | A whole owns parts under a stated lifecycle. |
| Generalization | A subtype promises the behavior expected from its parent. |
| Interface realization | An implementation provides a declared contract. |
| Dependency | One element uses another without necessarily retaining it. |

**Exercise:** model an order, its line items, and a payment reference. Explain why an arrow cannot by itself enforce a valid payment state or correct concurrent update.

## Completion checkpoint

For any pattern lesson, close the code and name the participants, draw one call sequence, and state the invariant. Then perform its exercise, trigger the failure case, and justify when the simpler alternative wins. This is the shared review rubric for the catalog.

<details>
<summary>Interview answer: when should a pattern be removed?</summary>

When its variation or coordination problem no longer exists and a simpler implementation preserves the required behavior. Compare the maintenance and testing cost against the actual changes it enables; a familiar name is not evidence of usefulness.

</details>

## Key takeaways

Patterns name useful collaborations. Contracts make them correct. Learn the differences between similar structures, and test the concrete change or failure that motivated your choice.

## Further reading

- Gamma, Helm, Johnson, and Vlissides, [Design Patterns: Elements of Reusable Object-Oriented Software](https://www.informit.com/store/design-patterns-elements-of-reusable-object-oriented-9780201633610).
- [Refactoring.Guru pattern catalog](https://refactoring.guru/design-patterns/catalog) for alternative illustrations and examples.
