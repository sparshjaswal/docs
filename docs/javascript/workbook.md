---
title: 'JavaScript workbook: practice and answer guide'
sidebar_label: 'Workbook practice guide'
---

# JavaScript workbook: practice and answer guide

Practise one small skill at a time alongside the [JavaScript learning path](./index.md). This guide links all **50 lessons and 150 exercise prompts** from the supplied workbook to their JavaScript or DSA lessons. The [two workbook projects](./workbook-projects.md) combine those skills in useful programs.

Each lesson keeps its example, setup, questions, and explained answers on one page. In its **Practice Problems** table, begin with the bold workbook questions marked **Must fix**. Use the Worked example link when you need the setup and the Answer link after you have tried the question.

A and B usually ask you to explain or predict behavior; C asks you to write code. Work through one lesson before adding another. Getting a prediction wrong is useful: find the first step where your reasoning differed from the program.

## A practice session

1. Read the linked concept and worked example. Write down the input, the expected result, whether input may change, and what should happen on failure.
2. Predict the output or trace one small input by hand. Write why each state change follows from the rule.
3. Answer A and B, then implement C in a separate `.mjs` file. Browser and multi-file tasks use the setup included in the lesson.
4. Check an ordinary input, an edge case, and a plausible failure. Use assertions that would fail for a real mistake.
5. Open the answer only after attempting the task. Record what changed in your explanation, then try one new input.

Save Node examples as `practice.mjs` and run `node practice.mjs` from the terminal. Terminal commands do not belong inside the JavaScript file. Use Node.js 24 or newer for this repository; see the [course setup](./index.md#run-the-examples). The DOM requires a browser; third-party test frameworks are not assumed. For Node answer checks, add `import assert from "node:assert/strict";` at the top of the file unless it is already present. Some answers need the worked example’s definitions too; keep those together.

## Choose a route

| Goal                               | Workbook route           | Continue with                         |
| ---------------------------------- | ------------------------ | ------------------------------------- |
| First JavaScript programs          | 01–14, then 15–18        | The two workbook projects             |
| Prepare for DSA                    | 01–14, 19–22, then 36–50 | [DSA roadmap](../DSA/index.md)        |
| Build browser or Node applications | 01–18, then 23–35        | [Application projects](./projects.md) |

The repository also covers annual ECMAScript additions and topics beyond this workbook. Use the [edition and compatibility notes](./index.md#edition-boundaries-and-runtime-support) for those boundaries; a workbook lesson number is not an ECMAScript edition.

## Foundations and first algorithms

| Lesson                                           | Exercises in the concept guide                            |
| ------------------------------------------------ | --------------------------------------------------------- |
| 01. Running your first program                   | [01A–C](fundamentals/README.md#workbook-01)               |
| 02. Variables types and conversion               | [02A–C](fundamentals/types-of-identifiers.md#workbook-02) |
| 03. Operators equality and missing values        | [03A–C](operators-and-operands.md#workbook-03)            |
| 04. Conditions and decision making               | [04A–C](flow-of-control.md#workbook-04)                   |
| 05. Loops and tracing state                      | [05A–C](loops.md#workbook-05)                             |
| 06. Functions parameters and return values       | [06A–C](functions/function-types.md#workbook-06)          |
| 07. Scope hoisting and closures                  | [07A–C](functions/function-closure.md#workbook-07)        |
| 08. Strings and text processing                  | [08A–C](strings-and-regular-expressions.md#workbook-08)   |
| 09. Arrays mutation and sorting                  | [09A–C](arrays/array-methods.md#workbook-09)              |
| 10. Objects references and destructuring         | [10A–C](spread-operator.md#workbook-10)                   |
| 11. Maps sets and frequency counting             | [11A–C](collections-and-iteration.md#workbook-11)         |
| 12. Callbacks and array transformations          | [12A–C](functions/function-callback.md#workbook-12)       |
| 13. This classes and prototypes                  | [13A–C](objects-and-classes.md#workbook-13)               |
| 14. Errors debugging and meaningful tests        | [14A–C](testing-guide.md#workbook-14)                     |
| 15. Modules and organizing code                  | [15A–C](import-and-export.md#workbook-15)                 |
| 16. Promises async functions and execution order | [16A–C](asynchronous/promises.md#workbook-16)             |
| 17. Browser events and network data              | [17A–C](event-handling.md#workbook-17)                    |
| 18. Iterators generators and numeric tools       | [18A–C](collections-and-iteration.md#workbook-18)         |
| 19. Recursion and the call stack                 | [19A–C](functions/function-recursion.md#workbook-19)      |
| 20. Complexity stacks queues and nodes           | [20A–C](../DSA/stack/README.md#workbook-20)               |
| 21. Binary search and reusable problem patterns  | [21A–C](../DSA/binary-search/README.md#workbook-21)       |
| 22. Memoization and dynamic programming          | [22A–C](functions/function-memoization.md#workbook-22)    |

## Language depth and application boundaries

| Lesson                                                  | Exercises in the concept guide                                 |
| ------------------------------------------------------- | -------------------------------------------------------------- |
| 23. Syntax coercion and equality in depth               | [23A–C](fundamentals/type-casting-and-coercion.md#workbook-23) |
| 24. Arrays copying and collection operations            | [24A–C](arrays/array-properties.md#workbook-24)                |
| 25. Function design binding and reusable behavior       | [25A–C](functions/function-utilities.md#workbook-25)           |
| 26. Property descriptors inheritance and class design   | [26A–C](objects-and-classes.md#workbook-26)                    |
| 27. Symbols reflection and proxies                      | [27A–C](metaprogramming-and-memory.md#workbook-27)             |
| 28. Regular expressions and Unicode text                | [28A–C](strings-and-regular-expressions.md#workbook-28)        |
| 29. Dates time zones and internationalization           | [29A–C](dates-and-internationalization.md#workbook-29)         |
| 30. JSON cloning and data boundaries                    | [30A–C](json-and-serialization.md#workbook-30)                 |
| 31. Binary data typed arrays and shared memory          | [31A–C](binary-data-and-shared-memory.md#workbook-31)          |
| 32. Memory weak collections and resource cleanup        | [32A–C](metaprogramming-and-memory.md#workbook-32)             |
| 33. Async orchestration cancellation and streams        | [33A–C](asynchronous/async-await.md#workbook-33)               |
| 34. Modules Node tooling and testable programs          | [34A–C](compatibility.md#workbook-34)                          |
| 35. Browser programs events storage and safe interfaces | [35A–C](browser-state-and-network.md#workbook-35)              |

## Data structures and algorithm design

| Lesson                                                   | Exercises in the concept guide                                   |
| -------------------------------------------------------- | ---------------------------------------------------------------- |
| 36. Linked lists and pointer reasoning                   | [36A–C](../DSA/linked-list/README.md#workbook-36)                |
| 37. Binary trees search trees and traversal              | [37A–C](../DSA/trees/README.md#workbook-37)                      |
| 38. Heaps and priority queues                            | [38A–C](../DSA/heap/README.md#workbook-38)                       |
| 39. Tries and prefix search                              | [39A–C](../DSA/trie/README.md#workbook-39)                       |
| 40. Graphs breadth first and depth first search          | [40A–C](../DSA/graphs/README.md#workbook-40)                     |
| 41. Topological sorting and cycle detection              | [41A–C](../DSA/graphs/topological-sorting/README.md#workbook-41) |
| 42. Weighted shortest paths and relaxation               | [42A–C](../DSA/graphs/bellman-ford/README.md#workbook-42)        |
| 43. Backtracking subsets and permutations                | [43A–C](../DSA/backtracking/README.md#workbook-43)               |
| 44. Greedy algorithms and exchange arguments             | [44A–C](../DSA/greedy/README.md#workbook-44)                     |
| 45. Sorting merging and selection                        | [45A–C](../DSA/sorting/README.md#workbook-45)                    |
| 46. Dynamic programming patterns and state design        | [46A–C](../DSA/dp/README.md#workbook-46)                         |
| 47. Union Find and connected components                  | [47A–C](../DSA/disjoint-set/README.md#workbook-47)               |
| 48. Fenwick trees and changing prefix sums               | [48A–C](../DSA/trees/fenwick-tree/README.md#workbook-48)         |
| 49. Segment trees and range aggregation                  | [49A–C](../DSA/trees/segment-tree/README.md#workbook-49)         |
| 50. Monotonic structures string search and numeric tools | [50A–C](../DSA/monotonic-stack/README.md#workbook-50)            |

## Projects and progress

Complete the [expense summary](./workbook-projects.md#expense-summary) and [word-frequency report](./workbook-projects.md#word-frequency). Their contracts preserve the source's input rules and tie-breaking behavior; additional checks cover boundaries that a single sample does not exercise.

For each lesson, record: **predicted → attempted → checked → explained**. Treat a correct guess differently from an answer you can justify. For each coding task, keep the first failing test and explain which assumption it exposed.

## Coverage and checks

All 50 lessons and 150 exercises are included in the concept guides above, with the same exercise IDs. The examples, explanations, constraints, and answer checks are part of the page. Code split across files is labeled with filenames; browser examples state the HTML they need.

Run each Node lesson in a separate `.mjs` file. Add `import assert from "node:assert/strict";` before the answer checks. Some advanced answers build on the worked example directly above them. A correct answer can use different code if it satisfies the same contract.

`yarn check:javascript` runs examples marked `js runnable` throughout the documentation and compares their output. The workbook checks also run the imported Node answer assertions, including any required example setup. Browser interactions need a browser. Use `yarn verify` and `yarn build` to check content, types, and internal links.

## Interview preparation

Practise the questions alongside their concept explanations: [Foundations](fundamentals/variables-var-let-const.md#interview-questions) · [Functions](functions/function-closure.md#interview-questions) · [Async](asynchronous/promises.md#interview-questions) · [Project discussion](workbook-projects.md#interview-questions).

Predict each worked example, explain the result, and answer its follow-up. Use the [complete interview route](./index.md#interview-preparation) to cover the remaining topics.
