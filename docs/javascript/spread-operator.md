---
id: javascript-spread-operator
slug: /javascript/spread-operator
title: "Rest and spread"
sidebar_label: "Rest and spread"
---

# Rest and spread

The `...` notation has two related jobs. **Rest** collects several values into one place. **Spread** takes values out of a collection so they can be used separately. Read its position to decide which job it is doing.

1. Collect extra function arguments into a rest parameter.
2. Spread an array into a new list or a function call.
3. Copy an object's properties, then inspect whether nested objects are still shared.

Think of packing items into a bag and unpacking them onto a table. The analogy explains collection and expansion; it does not mean the items themselves are deeply copied. Array/call spread and rest parameters are ES2015; object rest/spread is ES2018.

## Collect arguments and expand iterables

```js runnable
function sum(...numbers) { return numbers.reduce((total, value) => total + value, 0); }
const values = [2, 4];
console.log(sum(1, ...values));
console.log(JSON.stringify([...new Set([1, 1, 2])]));
```

```text output
7
[1,2]
```

Rest parameters must be last and create an array. Array/call spread consumes an iterable. A plain object is not automatically iterable; object spread has different semantics. Avoid spreading enormous collections into function arguments because engines impose argument-count limits.

## Copy only the levels you change

```js runnable
const original = { profile: { name: 'Ada' }, active: true };
const shallow = { ...original };
const updated = { ...original, profile: { ...original.profile, name: 'Lin' } };
console.log(shallow.profile === original.profile);
console.log(updated.profile === original.profile);
console.log(original.profile.name);
```

```text output
true
false
Ada
```

Later object properties overwrite earlier ones. Spread copies enumerable own properties and reads getters; it does not preserve arbitrary prototypes or descriptors. Object rest can omit fields, but security-sensitive output should use an explicit allow-list.

## Interview questions {/* #interview-questions */}

**Level: Beginner.** [How to practise](./index.md#interview-preparation).

### 1. Does spreading an object create an independent copy of all nested data?

<details>
<summary>Answer and worked example</summary>

No. Object spread copies own enumerable properties into a new outer object. Object-valued properties still identify the same nested objects.

```js runnable
const original = { profile: { name: 'Ada' }, active: true };
const copy = { ...original };
copy.active = false;
copy.profile.name = 'Grace';
console.log(original.active, original.profile.name);
console.log(copy === original, copy.profile === original.profile);
```

**Expected output**

```text output
true Grace
false true
```

Replacing copy.active changes only the new outer object. Editing copy.profile.name reaches the shared profile. Immutable updates must copy each changed level.

</details>

### 2. Is structuredClone a universal replacement for every spread operation?

**Apply it:** Choose a clone operation for a cyclic graph of plain data, then test what happens when the data includes a function.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

No. It supports a defined set of structured data, can preserve cycles, and can transfer eligible resources, but functions and some host objects cannot be cloned. It also does not preserve arbitrary custom prototypes or property descriptors. Choose the copy contract first.

This example requires the host-provided `structuredClone`, available in the Node version used by this course.

```js runnable
const original = { name: 'root' };
original.self = original;
const copy = structuredClone(original);
console.log(copy !== original, copy.self === copy);
try {
  structuredClone({ run() {} });
} catch (error) {
  console.log(error.name);
}
```

**Expected output**

```text output
true true
DataCloneError
```

A structured clone preserves the cycle inside a new graph, whereas spread would retain a reference to the original graph. The function makes the second input uncloneable. Cloning is not validation, and transferring a transferable resource has different ownership effects from copying it. For class instances with invariants, use an explicit representation and reconstruction policy.

</details>

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](./workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 10. Objects references and destructuring {/* #workbook-10 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** distinguish a new outer object from shared nested data.

Draw `person` and `copy` as two objects, each pointing to the same `address`. Changing `copy.name` affects only the copy. Before running the next assignment, predict who sees the changed city.

Review [copy only the levels you change](#copy-only-the-levels-you-change) and [destructuring defaults](./destructuring.md#defaults-and-missing-data). The default age is used because the property is missing. Property order matters when combining copies and replacement fields: a later value for the same key wins.

**Worked example**

```js
const person = { name: "Mira", address: { city: "Pune" } };
const copy = { ...person };
copy.name = "Dev";
copy.address.city = "Delhi";
const { name, age = 18 } = person;
console.log(name, age);
console.log(person.address.city);
console.log(copy === person);
```

**Expected output**

```text
Mira 18
Delhi
false
```

The outer objects differ, so name can change independently. The nested address is shared, so editing its city also affects person. Destructuring gives age its default because person has no age property.

**Trace the example step by step**

1. person is created with a nested address. copy is a new outer object containing copied property values.

2. copy.name = "Dev" replaces only the name on copy. person.name remains "Mira".

3. copy.address.city = "Delhi" reaches the shared address and edits it. person.address.city therefore also reads "Delhi".

4. The destructured age defaults to 18 because the property value is undefined. Comparing the two outer objects with === gives false.

Operation person reads copy reads

After shallow copy Mira and Pune Mira and Pune

Change copy.name Mira and Pune Dev and Pune

Change copy.address.city Mira and Delhi Dev and Delhi

**Common mistakes and how to reason about them**

Before copying, decide which parts need independence. For a known nested record, explicitly copying just the edited path is often easy to understand. JSON conversion can lose or reject data and is not a universal cloning tool. structuredClone supports many structured values but still has a defined set of supported types.

</details>

Find **10A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-10-answer">
<summary>Check your reasoning and answer</summary>

**10A.** true. Both variables contain references to the same object.

Both names hold a reference to the same object, so identity comparison succeeds. A separately created object with the same fields would have a different identity. Matching content and matching identity answer different questions.

**10B.** Object spread copied the reference to address rather than copying its contents.

The address reference was copied, but the address object was not recreated. Both paths end at the same city property. An independent nested update requires a separate address object as well as a separate outer object.

**10C.** Spread the old properties, then override name. This intentionally makes only a shallow copy.

Spreading first preserves the own enumerable properties. Writing name afterward replaces that property in the new object. Verify the new name, the unchanged original name, and the different outer- object identities.

**Reference code**

```js
function rename(user, name) {
  return { ...user, name };
}
```

**Check the result**

```js
const user = { name: "Mira", age: 20 };
assert.equal(rename(user, "Dev").name, "Dev");
assert.equal(user.name, "Mira");
```

</details>

<span id="practice" />

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **10A — What does const b = person; b === person produce?** | **Must fix** | [Worked example](#workbook-10) | [Answer](#workbook-10-answer) |
| **10B — Why does changing copy.address.city also change person.address.city?** | **Must fix** | [Worked example](#workbook-10) | [Answer](#workbook-10-answer) |
| **10C — Write rename(user, name), returning a shallow copy with a new name. Keep the original user unchanged.** | **Must fix** | [Worked example](#workbook-10) | [Answer](#workbook-10-answer) |
| Merge defaults and user options with a documented precedence rule. Then update one nested field while proving the original remains unchanged. | Practice | — | — |

## Continue learning

Continue with [destructuring](./destructuring.md) and [object copying](./objects-and-classes.md).
