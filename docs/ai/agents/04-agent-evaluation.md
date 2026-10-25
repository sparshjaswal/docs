---
title: "Agent evaluation and a bounded offline project"
sidebar_position: 4
description: "Test actual outcomes, action boundaries, recovery, and budgets using a deterministic offline tool-loop project."
---

# Agent evaluation and a bounded offline project

**Before this lesson:** [Multiple agents: divide work only when it helps](03-multiple-agents.md).

An agent evaluation asks whether the system completed the intended task **and** respected its boundaries. A convincing final sentence is not enough. If the assistant says a notice was sent, inspect the message record or tool result that establishes what actually happened.

A **test case** defines a starting state, a user goal, permitted actions, and an expected outcome. A **grader** checks that outcome. A **trial** is one execution of the case. Real models can vary across trials, so one successful run does not establish reliability.

## Evaluate outcomes and actions separately

| Case | What to check |
| --- | --- |
| Answer a loan-policy question | Correct value and observed source ID |
| Draft a notice | Draft exists; no message sent |
| Send without required approval | Action blocked before the side effect |
| Tool returns malformed data | Clear failure or bounded recovery |
| Same action proposed repeatedly | Loop stops without duplicate effects |
| Cost, time, or step limit reached | Limited status, not a false success |
| Retrieved text contains new instructions | It cannot expand tool permissions |

Use objective checks first: file contents, database changes, tool arguments, allowed recipients, citation IDs, or completed operation IDs. Human review can assess useful explanations. A model grader may help with language quality, but calibrate it against reviewed examples and keep it separate from the system being tested. The [agent-evaluation guide](https://www.anthropic.com/research/demystifying-evals-for-ai-agents) discusses combining graders and inspecting both results and execution traces.

## Build the test set

Begin with a few real tasks and common failures. Add cases found during development, but keep a reserved set for comparisons. Include tasks where the correct behavior is to ask for information, stop at an approval boundary, or report insufficient evidence.

Measure successful completion, unauthorized-action attempts and executions, duplicate effects, time, total calls, and resource usage. Report the number of cases and trials; a percentage from two examples is not the same evidence as a varied evaluation suite. Keep environment versions and initial state fixed when comparing changes.

## Measure repeated runs without hiding failures

Suppose four saved tasks each run three times. A `1` means the task met its success conditions with no forbidden action; `0` means it did not.

| Task | Trial 1 | Trial 2 | Trial 3 |
| --- | --- | --- | --- |
| A | 1 | 1 | 1 |
| B | 1 | 0 | 1 |
| C | 0 | 0 | 0 |
| D | 1 | 0 | 0 |

These results support three different descriptions:

- **Individual-trial success:** 6 of 12 runs succeeded, or 50%.
- **At least one success per task:** 3 of 4 tasks had a successful run, or 75%.
- **Success on every trial of a task:** 1 of 4 tasks passed all three runs, or 25%.

`any` returns true when at least one item is true; `all` requires every item to be true. In this example, Python treats `1` as true and `0` as false.

```python runnable
trials = [[1, 1, 1], [1, 0, 1], [0, 0, 0], [1, 0, 0]]
successes = sum(sum(task) for task in trials)
attempts = sum(len(task) for task in trials)
at_least_one = sum(any(task) for task in trials)
every_trial = sum(all(task) for task in trials)

print(f"Individual trials: {successes / attempts:.0%}")
print(f"At least one success: {at_least_one / len(trials):.0%}")
print(f"Every trial succeeds: {every_trial / len(trials):.0%}")
```

```text output
Individual trials: 50%
At least one success: 75%
Every trial succeeds: 25%
```

All three numbers are correct, but they answer different questions. The 75% figure describes success found somewhere in three attempts. It does not describe a user's chance of success on one attempt, or guarantee that the system can recognize and select the successful result. The 25% figure describes observed consistency on this small set; it is not a guarantee about future runs.

For independent trials, restore the same starting files, database records, permissions, and budgets. Otherwise one trial might leave an answer or completed action for the next. Test restart recovery separately when carrying state across runs is the behavior you intend to measure. Record seeds when available, but do not assume a seed makes a remote model perfectly reproducible.

**Practice:** a report shows only the best of ten runs for each task. What information would let you judge whether it is useful in a product?

<details>
<summary>Check the missing information</summary>

Ask for all run outcomes, the selection rule, action violations, and total time and cost across all ten attempts. If users receive one result, evaluate that actual procedure, including how it selects a result or decides to stop. A failed attempt may already have caused an external change, so retrying is not automatically harmless.

</details>

## Stage project: a safe control loop you can inspect

Download [bounded_agent.py](pathname:///examples/ai/agents/bounded_agent.py). It runs offline with Python 3.10 or later and the standard library. It has no credentials, network calls, paid APIs, or real message sending.

```sh
python3 bounded_agent.py
python3 bounded_agent.py --self-test
```

The first command prints:

```text
Decision-maker: scripted fake; no LLM
lookup: [P1] The loan period is 21 days.
finish
Answer: The loan period is 21 days. [P1]
Announcement: needs_approval
External messages sent: 0
```

Read `fake_decision`, `validate`, and `run` in order. The fake decision-maker follows a fixed policy so failures are repeatable. The surrounding loop validates proposals, checks a step budget and a teaching-cost budget, records observations, blocks unapproved notices, and detects repeated actions. Approving an exact action does not approve altered content. The simulated send only appends to an in-memory list.

The self-test checks successful lookup, blocked and allowed simulated sends, changed-action approval, invalid tools, repeated actions, and budget stops. It prints a `PASS` summary only when all assertions succeed. Root-level budgets remain application controls; the model cannot increase them by returning a new instruction.

## Know what this project does not prove

This is a **deterministic fake model**, not a working language-model agent. The cost values are teaching units, not tokens or currency. It checks deadlines between operations; it cannot interrupt an arbitrary blocking function. The state is in memory, so it does not provide durable restart recovery or exactly-once external actions. Final text is not automatically fact-checked merely because it passed through the loop.

The [next lesson](./05-build-a-model-agent.md) supplies a complete adapter for a real local model. It retains validation and budgets, adds client timeouts, and exercises the protocol offline before live task-quality evaluation. Do not replace a tested boundary with a prompt asking the model to behave.

## Practice

A new model completes more tasks but sometimes sends before approval. Another completes fewer tasks and always stops correctly. How should the comparison report this?

<details>
<summary>Check your answer</summary>

Report completion and boundary violations separately. An unauthorized send is not balanced away by a higher average completion score. Preserve the action gate, investigate the proposal failures, and decide whether the candidate meets the application’s required conditions before adopting it.

</details>

## Depth lab: interpret zero failures without claiming zero risk

Seeing no failures in a small test does not establish that failures never happen. Under independent trials with one fixed failure probability, the chance of seeing zero failures in `n` trials is `(1 - failure_probability)^n`. Solving this at 0.05 gives a one-sided 95% upper confidence bound after zero observed failures.

```python runnable
for trials in [30, 300]:
    upper_bound = 1 - 0.05 ** (1 / trials)
    print(trials, f"{100 * upper_bound:.2f}%")
```

```text output
30 9.50%
300 0.99%
```

These bounds rely on the stated statistical model. Repeating nearly identical tasks on the same document, selecting easy cases, or changing the system during testing weakens the interpretation. A low estimated frequency also does not make a severe permission failure acceptable.

### Build a fault-injection matrix

**Fault injection** deliberately supplies failures to test recovery. Use a scripted adapter to produce malformed output, denied access, empty search, repeated tool proposals, delayed responses, and a timeout after an external effect. For each case, specify the expected terminal state, allowed effects, retry limit, and user-visible message before running it.

Evaluate two layers separately. Application fixtures test whether the controller enforces invariants when given particular proposals. Live-model trials test how often the model makes useful proposals on real tasks. Strong fixture results do not measure a model's competence; strong live-model averages do not prove every control boundary is enforced.

**Debugging:** classify failures into proposal, validation, execution, evidence, and final reporting. Retain the original trace and replay only operations safe to repeat. Never replay a production write blindly as a debugging step.

**Optimization and release:** compare candidate and baseline on the same tasks and repeated-run policy. Include all attempts, aborted runs, latency, and total resource usage. Freeze the rubric and judge calibration. An automated grader that favors verbosity can reward longer answers while ignoring missed actions.

<details>
<summary>Interview defense: why is “best of ten runs” different from single-run reliability?</summary>

It estimates whether at least one sampled attempt succeeds, assuming an evaluator can identify it. A product that executes one attempt cannot claim that success rate. A product executing ten attempts must account for selection errors, ten-attempt cost, latency, and any side effects from the failed attempts.

</details>

**Teach-back project:** write a release report containing one recovered failure, one unrecovered failure, and one denied action. Explain the evidence required to call each result correct, and what your finite test set cannot establish.

**Previous:** [Multiple agents: divide work only when it helps](03-multiple-agents.md) · **Next:** [Build an agent that uses a real model](05-build-a-model-agent.md)
