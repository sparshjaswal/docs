---
title: "The agent loop: state, actions, and stopping"
sidebar_position: 2
description: "Build a bounded propose–validate–execute–observe loop with clear state, budgets, approvals, and recovery rules."
---

import AlgorithmWalkthrough from '@site/src/components/AlgorithmWalkthrough';

# The agent loop: state, actions, and stopping

**Before this lesson:** [Tools, workflows, and agents](01-tools-and-workflows.md).

An **agent loop** repeatedly chooses a next action, checks it, runs an allowed tool, and uses the result to decide what to do next. An **observation** is information returned by a tool. **State** is the application’s record of what has happened and what remains.

The [ReAct paper](https://arxiv.org/abs/2210.03629) studies combining language-model decisions with actions and observations. For an application, the key engineering responsibility is the surrounding control loop: the model can propose, but code owns permissions, resource limits, and stopping.

## Follow the loop

<AlgorithmWalkthrough name="aiAgentLoop" />

For the library assistant, the first observation may say that a loan rule exists under source `P1`. The next proposal could be to answer with that source, search for an exception, or prepare a notice. Each proposal goes through the same checks.

1. **Propose:** obtain a tool call or final-answer proposal.
2. **Validate:** check its shape, allowed tool name, arguments, and access.
3. **Approve when needed:** obtain approval for an action that requires it, tied to the concrete action.
4. **Execute:** run the allowed operation with its own time and output limits.
5. **Observe:** record the result or error in a bounded form.
6. **Stop or continue:** finish only when the task is complete, or return a clear blocked, failed, or limited result.

## Follow one task from request to result

The user asks, **“Can I take a reference book home?”** The application allows policy lookups, but no account changes. It starts with a budget of two lookups. These are fictional library rules for the worked example:

- `P1`: ordinary books can be borrowed for 21 days.
- `P2`: reference books must remain inside the library.

| Event | What happens | What the application records |
| --- | --- | --- |
| Request | Set the goal to answering the reference-book question. | Read-only scope; two lookups remaining. |
| First proposal | Look up borrowing rules. | Proposed tool and arguments; nothing has run yet. |
| First execution | The tool passes validation and returns `P1`. | Observed source `P1`; one lookup remaining. |
| Second proposal | Look up reference-book exceptions. | Another validated read request. |
| Second execution | The tool returns `P2`. | Observed sources `P1, P2`; zero lookups remaining. |
| Final proposal | “Reference books stay inside the library. [P2]” | Final answer and supporting source ID. |

The general rule alone was insufficient: it did not establish whether reference books had an exception. The second lookup answered that missing part. The system can now finish without another tool call; exhausting a lookup budget does not prevent returning evidence already collected.

There are two different checks at the end. Code can check that `P2` belongs to the sources this request actually retrieved. A content check must still determine whether `P2` supports the answer. A valid citation ID does not make an unrelated or contradictory sentence true. The [evaluation lesson](04-agent-evaluation.md) explains how to test both.

Change the observation and the correct behavior changes:

| Second lookup result | What it establishes | Appropriate next step |
| --- | --- | --- |
| `P2` is returned | Evidence about reference books is available. | Answer using the exception. |
| Successful search, no results | This search found no matching evidence. | Report the evidence gap; do not invent a policy. |
| Timeout | The search outcome is unknown. | Record the error and follow the bounded recovery rule. |
| Access denied | This request cannot read the resource. | Stop that lookup; do not ask the model to bypass access. |

**Trace exercise:** the first lookup returns `P1` and the second times out. The agent answers, “Yes, for 21 days.” Identify the missing evidence and the false assumption.

<details>
<summary>Work through the trace</summary>

There is no observation about reference-book exceptions. The answer assumes an unsuccessful check means no exception exists. It should say that the general rule is 21 days but that it could not verify whether reference books qualify. A later retry needs remaining budget or a separately allowed continuation; the agent cannot silently grant itself more calls.

</details>

## Keep state separate from conversation text

| State item | Why the application stores it |
| --- | --- |
| Goal and scope | What the user requested and allowed |
| Observed source IDs | Which evidence was actually retrieved |
| Pending action | The exact proposal awaiting a decision |
| Completed operation IDs | Which changes must not be repeated |
| Remaining budgets | How much work may still run |
| Final status | Complete, needs input, failed, or limited |

The model may receive a summary of this state, but a summary is not the authoritative record of an approval or completed write. Long-running tasks need durable storage and a recovery rule. If a process restarts after a tool succeeded but before its result was recorded, check the operation’s status before repeating it.

**Idempotency** means repeating an operation has the same intended effect as doing it once. A unique request key and a saved result can support this for a write. Merely telling a model “do not repeat yourself” cannot provide it.

## Budgets make stopping concrete

Use several limits because they address different problems:

- A step limit stops endless model/tool cycles.
- A call or token budget bounds model usage.
- A time deadline limits how long the user waits.
- Tool-specific limits bound output size, searches, or changed records.
- A repeated-action check detects a loop that is making no progress.

A deadline checked between calls cannot interrupt a blocked call by itself. Real model and tool clients need timeouts and cancellation support. Retrying an error should have a reason, a limit, and a check that the operation can safely be repeated.

## Work through a failure

Suppose the assistant searches the same loan topic three times because it never uses the first result. A step limit eventually stops it, but a repeated-action check can stop earlier and return the available evidence. Now suppose it proposes sending a notice before approval. The action boundary should stop the send immediately; an overall cost budget is not an authorization check.

Record a **trace** of visible events: proposed tool, validated arguments, approval status, execution result, source IDs, time, and resource usage. Avoid logging secrets or unnecessary personal data. A useful trace supports replay and debugging; it does not require exposing private model reasoning.

## Alternatives and mistakes

Use a fixed workflow when the path is known. Use a single model call when it can produce a checked result directly. Agent loops help with adaptive investigation, but add latency, state, and more possible errors.

Do not keep all raw results forever, infer success from a confident final message, or count reaching the step limit as task completion. The [stage project](./04-agent-evaluation.md) uses a scripted decision-maker so you can test these controls without a paid model.

## Practice

An agent has one remaining step but needs to send a message and then confirm delivery. What should it do? Why is “sent” an unsafe final answer after a timeout?

<details>
<summary>Check your answer</summary>

It should avoid claiming completion without the required evidence, and stop or request the additional authorized work according to its policy. A timeout may occur before or after the external action happened. Check the operation’s recorded status or idempotency key before retrying; do not guess from missing confirmation.

</details>

## Depth lab: make budgets part of a state transition

A **transition function** takes current state and one event, then returns the next state. Keeping that function explicit makes it possible to replay and test control behavior without a model.

```python runnable
def transition(state, event):
    if state["status"] != "running":
        raise ValueError("run has already stopped")
    next_state = dict(state)
    if event == "tool_attempt":
        if state["remaining"] == 0:
            next_state["status"] = "limited"
        else:
            next_state["remaining"] -= 1
            next_state["attempts"] += 1
    elif event == "finish":
        next_state["status"] = "complete"
    else:
        raise ValueError("unknown event")
    return next_state

state = {"status": "running", "remaining": 2, "attempts": 0}
for event in ["tool_attempt", "tool_attempt", "tool_attempt"]:
    state = transition(state, event)
print(state)
print(transition({"status": "running", "remaining": 0, "attempts": 2}, "finish"))
```

```text output
{'status': 'limited', 'remaining': 0, 'attempts': 2}
{'status': 'complete', 'remaining': 0, 'attempts': 2}
```

The reducer counts authorized execution attempts, including attempts that later fail. It is only a budget fixture: the caller must validate proposals and verify completion conditions before issuing these events. A final answer can be returned after the last allowed lookup; a third lookup cannot run.

**Extend from scratch:** add observed evidence, tool result status, and a final-answer validation event. Keep the invariants explicit: remaining budget never becomes negative; completed runs accept no new work; denied actions never reach the executor; a final success requires the task's evidence. Test event sequences as well as individual transitions.

**Debugging:** replay the same event list through the reducer and compare states. If the bug reproduces, investigate control logic. If it appears only with a real tool, inspect the adapter and external state. Record observations, not hidden model reasoning, as the evidence for decisions.

**Optimization and system design:** persist events or snapshots if restart is required, and version their schema. For concurrent workers, decrement shared budgets atomically; independent in-memory copies can each spend the same remaining allowance. A wall-clock deadline also needs per-call timeouts because checking the deadline between events cannot stop a blocked request.

<details>
<summary>Interview defense: why is a step limit insufficient?</summary>

One step can be arbitrarily slow, return a huge payload, or perform many side effects unless the tool itself is bounded. Combine step, time, token, output-size, concurrency, and operation-specific limits. These controls do not replace permission checks or evidence of task completion.

</details>

**Teach-back:** present a trace ending at the limit and another ending with a verified answer. Explain why both have stopped but only one completed its intended task.

**Previous:** [Tools, workflows, and agents](01-tools-and-workflows.md) · **Next:** [Multiple agents: divide work only when it helps](03-multiple-agents.md)
