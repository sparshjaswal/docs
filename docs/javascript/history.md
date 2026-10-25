---
id: javascript-history
slug: /javascript/history
title: "JavaScript and ECMAScript history"
sidebar_label: "Language history"
---

# JavaScript and ECMAScript history

JavaScript is the programming language; ECMAScript is the standard that describes its core rules. A browser or Node.js supplies an **engine** that runs those rules and other tools for tasks such as network requests or file access.

1. Read the milestones to understand names you will meet in tutorials, especially ES6 and ES2015.
2. Separate language features from browser and Node.js features.
3. Return to the history when an old example uses a style you do not recognize.

JavaScript began at Netscape in 1995, created by Brendan Eich for scripting web pages. Standardization established ECMAScript as the language shared by implementations. This is useful context; you do not need to memorize dates before writing your first program.

## The milestones that explain modern code

| Period | Change | Why it matters when reading code |
| --- | --- | --- |
| 1995 | JavaScript begins at Netscape | The language grows around an existing web platform |
| 1997–1999 | ECMAScript editions 1–3 | A shared standard develops for multiple implementations |
| 2009 / 2011 | ES5 / ES5.1 | Strict mode, JSON support, property descriptors, and array helpers underpin much legacy code |
| 2015 | ES6, also called ES2015 | Lexical declarations, modules, classes, promises, collections, and generators reshape everyday code |
| 2016 onward | Annual editions | Features land in smaller yearly groups; full calendar years avoid edition-number confusion |
| 2026 | The 17th edition | Async collection, precise summation, binary codecs, JSON source access, and other additions |

There was no published fourth edition. For the yearly details, use the [ES2015–2026 edition map](./index.md#ecmascript-20152026-feature-coverage), which links features to their concept lessons and annual specifications. The [Ecma publication archive](https://ecma-international.org/publications-and-standards/standards/ecma-262/) records the editions and publication dates.

## Language versus implementation

JavaScript is dynamically typed: values have types, and a binding can hold values of different types over time. Objects inherit through prototypes; class syntax builds on that model while adding its own rules. Functions are first-class values and retain access to lexical scopes.

Calling JavaScript a scripting language does not mean an implementation must interpret source one line at a time. Engines can parse, compile, interpret, and optimize code. ECMA-262 specifies observable behavior, not one required execution strategy. Start with the [engine guide](./javascript-engine-basic-unit.md) and [runtime model](./asynchronous/asynchronous.md).

The DOM and `fetch` have their own platform specifications. JSX and TypeScript are separate syntaxes normally transformed by tools. Keeping these boundaries clear prevents attributing every platform feature to an ECMAScript edition.

## Check your understanding

- Why does ES6 mean ES2015, while the 15th edition means ES2024?
- Why can a published feature still be missing in a particular browser?
- Why does a new language edition not automatically introduce a DOM API?

Historical source: _JavaScript: The First 20 Years_ by Allen Wirfs-Brock and Brendan Eich. Continue with [fundamentals](./fundamentals/README.md).

## Interview preparation

Practise the questions alongside their concept explanations: [Language versus engine](javascript-engine-basic-unit.md#interview-questions) · [Specification versus runtime support](compatibility.md#interview-questions) · [Modules](import-and-export.md#interview-questions).

Predict each worked example, explain the result, and answer its follow-up. Use the [complete interview route](./index.md#interview-preparation) to cover the remaining topics.
