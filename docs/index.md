---
title: Choose your learning path
sidebar_label: Start here
sidebar_position: -1
slug: /learning-paths
description: Find prerequisites, a focused course, and a concrete way to check your understanding.
---

# Choose your learning path

Start with something you want to explain or build. Each section below owns its topic; follow links into it instead of reading the whole site in order. A **prerequisite** is a skill you need before a lesson, and a **checkpoint** is something you can demonstrate without copying its answer.

## Find your next step

| I want to… | Start with | Check understanding by… |
| --- | --- | --- |
| Turn a problem into precise steps | [Pseudocode](pseudocode/index.md) | Tracing a loop and explaining why it stops. |
| Write and debug programs | [JavaScript](javascript/index.md) | Building a reading list with loading and error states. |
| Choose algorithms and defend their cost | [Data structures and algorithms](DSA/index.md) | Solving a new problem and proving an invariant. |
| Build usable web interfaces | [Frontend engineering](frontend-engineering/index.md) | Completing a form with a keyboard and recovering from failure. |
| Design services that survive failures | [System Design](system-design/README.md) | Tracing a request, a retry, and recovery after a crash. |
| Evaluate and build AI applications | [AI in depth](ai/orientation.md) | Comparing a model with a simple baseline on held-out cases. |
| Organize objects around a changing requirement | [Design patterns](design-pattern/index.md) | Choosing one collaboration and explaining its cost. |
| Keep replacements compatible | [SOLID principles](solid-design-principles/index.md) | Running the same contract checks against two implementations. |
| Separate calculations from effects | [Functional programming](functional-programming/index.md) | Testing a calculation without a database or network. |
| Deploy and operate a small application | [Cloud engineering](Cloud%20Providers/index.md) | Recreating a deployment and demonstrating recovery and cleanup. |

## Follow a route, not every branch

**First program:** pseudocode lessons 1–3 → JavaScript values, functions, and lists → one small project. Start the DSA course after you can trace an array loop.

**Web application:** JavaScript DOM, events, and promises → frontend lessons → the System Design task service → cloud labs. Design patterns, SOLID, and functional programming help when a real change exposes a design problem.

**AI application:** begin with AI orientation. The AI course teaches Python and mathematics before models; JavaScript is not a prerequisite. Use the [developer roadmap](ai/developer-roadmap/index.md) to select a project after assessing your foundations.

**Interview preparation:** attempt a section's checkpoint first. Explain assumptions, trace a small case, compare alternatives, and describe one failure. Use the linked lesson to repair a specific gap, then retry with a different example.

## A repeatable study session

1. Recall yesterday's mechanism without notes.
2. Read one lesson's summary and prerequisites; resolve only the missing prerequisite.
3. Predict a worked example before running or revealing it.
4. Change an assumption: empty input, larger data, a delayed response, or a lost dependency.
5. Attempt an exercise, compare the revealed answer, and record the mistake to revisit.

Move on when you can **explain, apply, and debug** the idea. Recognizing a diagram or remembering an API name is not enough. Keep a small revision record: topic, mistaken assumption, corrected example, and next recall attempt.

## One project across the engineering sections

A task app can connect the courses without repeating them. Model a task in JavaScript, build its accessible frontend, define the API and database contract in System Design, and deploy it in the cloud labs. Add an AI suggestion feature only after defining a useful baseline and a way to reject bad suggestions.

**Completion exercise:** choose one row above. Write its prerequisite, a deliverable, and a failure you will deliberately test. Your result should name observable behavior, such as “a failed save preserves my draft,” rather than “I understand frontend.”
