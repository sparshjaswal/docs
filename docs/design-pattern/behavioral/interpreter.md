---
id: design-pattern-behavioral-interpreter
title: Interpreter pattern
slug: /design-pattern/behavioral/interpreter
sidebar_label: Interpreter
description: Evaluate a small explicit language without executing arbitrary source code.
---

# Interpreter pattern

## Overview

An Interpreter represents a small language as expressions and defines how to evaluate them. Prerequisites: [recursion](../../javascript/functions/function-recursion.md) and [objects](../../javascript/objects-and-classes.md). Use it when rules need to be represented as data and combined predictably.

## Why it exists

Suppose a task filter must express “completed and high priority.” Repeated conditionals work for a fixed rule, but a small expression model lets the application combine supported rules without accepting arbitrary JavaScript.

## Mental model

Each expression is a question with a defined answer. A terminal expression reads one fact; a composite expression combines answers from child expressions. The structure is a tree. Parsing text into that tree is a separate responsibility.

## How it works

The complete example accepts only `equals` and `and` expressions over two allowed fields. It bounds nesting and rejects unknown operations. Inputs are assumed to be ordinary in-memory records; untrusted serialized input also needs structural validation and a size limit.

```js runnable
const fields = new Set(['done', 'priority']);
function evaluate(expression, task, depth = 0) {
  if (!expression || depth > 20) throw new Error('Invalid or too-deep expression');
  if (expression.op === 'equals' && fields.has(expression.field)) {
    return task[expression.field] === expression.value;
  }
  if (expression.op === 'and') {
    return evaluate(expression.left, task, depth + 1)
      && evaluate(expression.right, task, depth + 1);
  }
  throw new Error('Unsupported expression');
}
const filter = {
  op: 'and',
  left: { op: 'equals', field: 'done', value: true },
  right: { op: 'equals', field: 'priority', value: 'high' },
};
console.log(evaluate(filter, { done: true, priority: 'high' }));
console.log(evaluate(filter, { done: false, priority: 'high' }));
```

```text output
true
false
```

Evaluation first checks `done`. If false, `and` short-circuits and does not evaluate its right child. Otherwise it checks priority. Validation of an entire submitted expression should occur before evaluation, so a short-circuited branch cannot hide invalid syntax.

## Real-world example

A saved task filter can store this expression tree as JSON and evaluate it later. Version the language if meanings change. Filtering a user's already-authorized tasks is different from using an expression as an authorization policy; the latter requires a carefully specified security contract.

## Trade-offs

This approach keeps a small rule set explicit and testable. Adding every language feature increases parsing, validation, debugging, and compatibility work. Use an ordinary function for a fixed rule; use an established parser or query language when grammar and optimization requirements grow.

## Failure scenarios

Unknown operators must be rejected rather than treated as true. Deep or excessively large expressions can exhaust resources; validate node count and depth. A changed equality or missing-field policy can silently change saved filters, so test old expressions during a version migration.

## Production considerations

Separate parse, validation, and evaluation errors. Bound input bytes, expression nodes, and evaluation work. Avoid `eval` for untrusted rule text. Keep available fields and operations explicit, and record a language version with persisted rules.

## Exercises

Add an `or` expression and test both short-circuit cases. Then submit an unknown operator inside a branch that would not run.

<details>
<summary>Expected checks</summary>

Evaluation returns true when either child is true and skips the second child after a true first result. A separate full-tree validation pass still rejects the unknown operator before execution. Test nesting and size limits independently of the returned boolean.

</details>

## Interview questions & answers

<details>
<summary>Interpreter or Visitor?</summary>

Interpreter defines the meaning of expressions in a language. [Visitor](visitor.md) organizes operations over a stable set of element types; evaluation can be one visitor alongside formatting and validation. The patterns describe different responsibilities and can cooperate.

</details>

**Revision cues:** grammar → expression tree → validation → evaluation → limits. **Key takeaways:** keep a small language explicit, separate syntax from meaning, and bound untrusted work.

## Further reading

- Gamma, Helm, Johnson, and Vlissides, [Design Patterns](https://www.informit.com/store/design-patterns-elements-of-reusable-object-oriented-9780201633610), Interpreter.
- [Compiler and interpreter pipeline](../../javascript/transpilers-and-compilers.md).

Use the shared [review checkpoint](../index.md#completion-checkpoint), then return to the [pattern catalog](../index.md).
