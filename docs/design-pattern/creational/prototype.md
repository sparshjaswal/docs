---
id: design-pattern-creational-prototype
title: "Prototype Pattern 🧬"
slug: /design-pattern/creational/prototype
sidebar_label: "Prototype"
---

# Prototype Pattern 🧬

A Prototype starts a new object from an existing one. The important question is which parts become separate copies and which parts still refer to the same data.

## Example: copying a person and a cat {/* #javascript-walkthrough */}

This example compares copies of a Person containing primitive fields, a hobby array, and a Cat object. The listed deep-copy example changes the original after copying, then prints both values.

```js runnable
function Cat(name) {
  this.name = name;
  this.getName = function () {
    return this.name;
  };
  this.setName = function (name) {
    this.name = name;
  };
}

function Person(name, age, hobby, cat) {
  this.name = name;
  this.age = age;
  this.hobby = hobby;
  this.cat = cat;
  this.getName = function () {
    return this.name;
  };
  this.setName = function (name) {
    this.name = name;
  };
  this.getAge = function () {
    return this.age;
  };
  this.setAge = function (age) {
    this.age = age;
  };
  this.getHobby = function () {
    return this.hobby;
  };
  this.setHobby = function (hobby) {
    this.hobby = hobby;
  };
  this.getCat = function () {
    return this.cat;
  };
  this.setCat = function (cat) {
    this.cat = cat;
  };
}

//deep clone
function deepClone(obj, newObj) {
  var newObj = newObj || {};
  for (var i in obj) {
    if (typeof obj[i] === "object") {
      newObj[i] = obj[i].constructor === Array ? [] : {};
      deepClone(obj[i], newObj[i]);
    } else {
      newObj[i] = obj[i];
    }
  }
  return newObj;
}
/////////////////////test///////////////////////////////////////////////////////
var person1 = new Person();
person1.setName("David");
person1.setAge(20);
person1.setHobby(new Array("BasketBall", "Swimming"));
person1.setCat(new Cat("BlackCat"));
console.log(String("------ Original Person : -------- ").trim());
console.log(String(person1.getName() + "").trim());
console.log(String(person1.getAge() + "").trim());
console.log(String(person1.getHobby() + "").trim());
console.log(String(person1.getCat().getName() + "").trim());
var deepClonePerson = deepClone(person1);
console.log(String("-------- Deep Clone Person : -------- ").trim());
console.log(String(deepClonePerson.getName() + "").trim());
console.log(String(deepClonePerson.getAge() + "").trim());
console.log(String(deepClonePerson.getHobby() + "").trim());
console.log(String(deepClonePerson.getCat().getName() + "").trim());
person1.setName("Grace");
person1.setAge(30);
person1.getHobby().push("Reading");

person1.getCat().setName("WhiteCat");
console.log(String("--------- Original Changed Person : ------- ").trim());
console.log(String(person1.getName() + "").trim());
console.log(String(person1.getAge() + "").trim());
console.log(String(person1.getHobby() + "").trim());
console.log(String(person1.getCat().getName() + "").trim());
console.log(String("------ Deep Clone Person : -------- ").trim());
console.log(String(deepClonePerson.getName() + "").trim());
console.log(String(deepClonePerson.getAge() + "").trim());
console.log(String(deepClonePerson.getHobby() + "").trim());
console.log(String(deepClonePerson.getCat().getName() + "").trim());
```

```text output
------ Original Person : --------
David
20
BasketBall,Swimming
BlackCat
-------- Deep Clone Person : --------
David
20
BasketBall,Swimming
BlackCat
--------- Original Changed Person : -------
Grace
30
BasketBall,Swimming,Reading
WhiteCat
------ Deep Clone Person : --------
David
20
BasketBall,Swimming
BlackCat
```

<span id="walk-through-the-source" />
<span id="understand-the-collaboration" />

## How it works

Prototype creates an object from existing object state. This example explores which nested values remain shared during copying. Its recursive copier assigns primitive fields directly, creates new arrays for array values, and creates plain objects for other object values. This gives the copied Person separate containers for its hobby array and Cat data.

The original begins as David, age twenty, with Basketball and Swimming hobbies and a BlackCat. Changing it to Grace, age thirty, adding Reading, and renaming the cat leaves the copy at its earlier values. These changes demonstrate independence of the shown data containers.

Function values take the direct-assignment branch, so methods remain shared function references. They still work on the copy because they read fields through `this`, and calling a method on the copy supplies that copied receiver. Define the copying contract in terms of which data must be independent and which references may remain shared.

## What the example does not establish {/* #copying-contracts */}

This copier works for the specific acyclic input shown. It accesses `.constructor` on object values, so null is not handled; cycles recurse indefinitely. `for...in` also includes inherited enumerable properties. The returned objects do not preserve arbitrary prototypes, private fields, descriptors, or special built-in types. Do not treat this listing as a general-purpose cloning utility.

## Shallow and deep copies: observe the difference

A shallow copy copies each top-level value. When that value is an object reference, both copies still point to the same nested object. A deep copy creates independent nested data according to a defined copying policy.

```js runnable
const original = { name: "Mira", hobbies: ["swimming"] };
const shallow = { ...original };
// An explicit copy for this known shape, not a general cloning algorithm.
const deep = { ...original, hobbies: [...original.hobbies] };
original.name = "Noor";
original.hobbies.push("reading");
console.log(shallow.name);
console.log(shallow.hobbies.join(", "));
console.log(deep.hobbies.join(", "));
console.log(shallow.hobbies === original.hobbies);
console.log(deep.hobbies === original.hobbies);
```

```text output
Mira
swimming, reading
swimming
true
false
```

## Practical case: create contact rows from a template

A contact form can reuse a prepared DOM structure instead of rebuilding every label and input. The template has no repeated IDs, and each clone receives unique field names.

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>Clone contact rows</title>
<button id="add-contact">Add contact</button>
<form id="contacts"></form>
<template id="contact-template">
  <fieldset>
    <legend>Contact</legend>
    <label>Name <input data-field="name"></label>
    <label>Telephone <input type="tel" data-field="telephone"></label>
    <label>Email <input type="email" data-field="email"></label>
  </fieldset>
</template>
<script>
  let nextId = 0;
  const template = document.querySelector("#contact-template");
  const contacts = document.querySelector("#contacts");
  document.querySelector("#add-contact").addEventListener("click", () => {
    const row = template.content.cloneNode(true);
    const id = ++nextId;
    row.querySelector("legend").textContent = `Contact ${id}`;
    row.querySelectorAll("input").forEach((input) => {
      input.name = `contacts[${id}][${input.dataset.field}]`;
    });
    contacts.append(row);
  });
</script>
</html>
```

**Expected interaction:** Each click adds one empty, independently editable contact row. Existing input stays unchanged.

DOM cloning is an application of copying an existing structure, not JavaScript prototype inheritance. [`cloneNode(true)`](https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode) copies descendants, but not listeners installed with `addEventListener`. Attach new listeners or delegate them from a stable parent. Avoid cloning duplicate IDs.

## Design decisions and failure modes

Copying is a contract about identity and ownership. Two objects that share a nested mutable list can look independent until editing one changes the other.

## Exercises

Clone a contact template containing tags and a callback. Specify which values should be copied, shared, or rejected, then mutate the clone.

<details>
<summary>Expected reasoning and checks</summary>

Check nested identity and behavior explicitly. Object spread copies only the outer properties; structured cloning supports particular value types and does not clone functions. Use a domain-specific copy when the template contains resources or behavior.

</details>

## Interview questions & answers

<details>
<summary>Is JavaScript prototype inheritance the same as this pattern?</summary>

No. The pattern creates instances by copying an existing instance. JavaScript’s prototype chain supplies property lookup and inherited behavior; the two ideas may appear together but solve different problems.

</details>

**Key takeaway:** Name the copying boundary before choosing a copying API.

## Continue reading

Use the shared [review checkpoint](../index.md#completion-checkpoint), then return to the [pattern catalog](../index.md).
