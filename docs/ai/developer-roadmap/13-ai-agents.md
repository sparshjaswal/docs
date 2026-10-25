---
title: "13. Agent architecture, planning, memory, tools, and multiple agents"
sidebar_position: 13
---

# Agent architecture, planning, memory, tools, and multiple agents

**Prerequisites:** prompts, structured outputs, RAG, APIs, async work, and responsible AI. Begin with the [core agent lessons](../agents/01-tools-and-workflows.md), then the [working model adapter](../agents/05-build-a-model-agent.md).

## What it is and why it matters

An agent system can select actions based on observations while pursuing a goal. A workflow follows a more explicitly defined path. “Agentic AI” usually describes systems with this adaptive action selection; it is not a separate guarantee of intelligence or reliability.

Use an agent when the next useful step genuinely depends on what the system discovers. A deterministic lookup or fixed workflow is often easier to test and operate.

## Learn in this order

### Architecture and the control loop

Separate model, state, tools, policy checks, execution, observations, and completion. The model proposes an action; trusted application code validates and executes it. Store step and resource budgets outside generated text.

Completion is a checked outcome, not the model saying “done.” A failed tool result, a timeout, and an empty successful search establish different facts. The [worked trace](../agents/02-agent-loop-and-state.md) illustrates this distinction.

**Practice:** implement a bounded loop with a scripted decision-maker first. Test malformed actions, repeated calls, absent evidence, and exhausted budgets before connecting a real model.

### Planning

Planning decomposes a goal into steps and dependencies. Compare a fixed state machine, plan-then-execute, and an observation-driven loop. Plans can become stale when an assumption fails; replanning should respond to evidence, not create endless activity.

Use explicit preconditions and completion checks. A plan for “send the report” needs a real draft, recipient, permission, and delivery outcome. A longer plan is not automatically a better plan.

**Practice:** create a document-review task with a missing source. Show how the system revises or stops the plan while retaining its original scope.

### Memory and durable state

Working memory contains information needed for the current task. Persistent memory stores selected information for future tasks. A transcript, an embedding index, a user preference, and a record of a completed external action are different kinds of state.

Store provenance, owner, timestamp, and expiry. A model-written summary can omit a qualification; do not turn it into an authoritative fact or approval record. Durable state survives process restarts and needs a recovery rule for operations with unknown outcomes.

**Practice:** complete the [durable-workflow lab](../agents/07-durable-workflows.md). Restart after a simulated operation succeeds but before the caller records success; verify that recovery does not blindly repeat the action.

### Tool calling

A tool contract defines a name, argument schema, result, error behavior, permissions, and side effects. The current user's trusted session determines authority; a model argument must not choose an arbitrary identity.

Read-only tools are a useful first step. For writes, validate the concrete action and use idempotency or status lookup where supported. Bind any required approval to the exact action and reject changed arguments.

**Practice:** implement search and draft tools, then a simulated send requiring explicit approval. Test invalid recipients, changed content after approval, and timeout ambiguity.

### Multiple agents

Multiple agents divide work or provide specialized interfaces. They add coordination, duplicated context, shared-resource contention, and potentially correlated errors. Agreement between agents is not independent verification.

Use a parent-owned budget and clear subtask contracts. Keep outputs attributable to sources and prevent child tasks from expanding permissions. Compare against one model or one workflow before accepting the additional complexity.

**Practice:** split retrieval and report drafting into two workers. Measure task success, calls, latency, and lost context against a single-worker baseline.

## Mastery lab: a timeout is an unknown outcome

An agent asks a booking service to reserve a seat. The service commits the reservation, but the response is lost. If the agent treats the timeout as proof that nothing happened, it may reserve twice. This is a distributed-state problem; a more persuasive prompt cannot repair it.

### Implement the smallest state machine

```python runnable
def transition(state, event):
    allowed = {
        ("ready", "propose"): "awaiting_approval",
        ("awaiting_approval", "approve"): "approved",
        ("approved", "dispatch"): "in_flight",
        ("in_flight", "timeout"): "unknown",
        ("unknown", "confirmed_success"): "done",
        ("in_flight", "confirmed_success"): "done",
    }
    if (state, event) not in allowed:
        raise ValueError("Illegal transition")
    return allowed[state, event]
state = "ready"
for event in ["propose", "approve", "dispatch", "timeout"]:
    state = transition(state, event)
print(state)
try:
    transition(state, "dispatch")
except ValueError:
    print("Reconcile before redispatch")
```

```text output
unknown
Reconcile before redispatch
```

The state machine refuses a blind redispatch. It does not itself guarantee uniqueness: that needs a durable operation record and an external idempotency or reconciliation contract. Approval must be bound to the exact action and arguments; a modified action needs a new decision.

### Build and debug the full loop

Separate observation, planning, proposal validation, authorization, execution, and state persistence. A model chooses among permitted proposals; the application enforces budgets and transitions. Keep task memory, retrieved evidence, user preferences, and operation status distinct. Conversation text is an unreliable substitute for an operation ledger.

Inject invalid tool arguments, unavailable tools, contradictory observations, repeated proposals, timeouts before and after commit, and process restarts. Check both task outcome and action trace. A correct final sentence after an unauthorized tool call is a failed run.

Use a fixed workflow as a baseline. Add model planning where the task actually requires variable choices. Compare a single agent with multiple agents under a shared task set, tool permissions, and total budget. Repeated trials reveal variability; successful anecdotes do not establish reliability.

### Optimize and design

Reduce redundant model turns, narrow tool schemas, retrieve only useful context, and stop when the objective or budget is reached. Optimization must preserve task success and action constraints. Parallel workers need ownership rules and a merge strategy; two agents agreeing does not make their evidence independent.

A production architecture needs durable task state, a tool gateway, per-user permissions, operation IDs, cancellation, recovery, and sanitized traces. The [durable workflow project](../agents/07-durable-workflows.md) supplies a larger runnable implementation and restart tests.

**Interview defense:** “How do you guarantee exactly-once action execution?” State the system boundary and external-service contract. Explain the crash window and why a local status flag alone cannot remove it.

**Teach it:** act out a reservation request whose reply is lost. Ask the learner which facts the caller actually knows. Deliver the state machine, failure matrix, repeated-trial report, and a defensible choice between workflow and agent.

## Mini project and real-world use

Build a repository documentation assistant that searches approved files, drafts a change proposal, and stops before any external publication. Add an optional multi-agent version only after the single loop has a repeatable evaluation.

Uses include adaptive research, debugging assistance, complex document workflows, and guided operations. For developers, the main advantage is connecting language interpretation to existing reliable tools.

**Completion evidence:** the [agent evaluation scorecard](../agents/04-agent-evaluation.md), repeated trials, observable traces, authorization tests, budgets, recovery tests, and a single-agent comparison.

## Interview questions

1. When should a fixed workflow replace an agent?
2. What state belongs outside the conversation?
3. How can a plan become invalid after a tool call?
4. Why is “exactly once” difficult across external systems?
5. When can more agents reduce reliability?
6. How do you measure consistent success rather than the best of many attempts?

## Curated resources

- **Course:** [Microsoft AI Agents for Beginners](https://github.com/microsoft/ai-agents-for-beginners), for agent patterns; verify each sample's dependencies.
- **Book:** [AI Engineering](https://www.oreilly.com/library/view/ai-engineering/9781098166298/), for agent applications, evaluation, and tradeoffs.
- **Papers:** [ReAct](https://arxiv.org/abs/2210.03629) and [Toolformer](https://arxiv.org/abs/2302.04761); distinguish their research settings from your application's authorization rules.
- **GitHub:** [LangGraph](https://github.com/langchain-ai/langgraph), after the plain loop works. Read framework-specific guidance in module 15.

**Previous:** [RAG](12-rag.md) · **Next:** [MCP](14-mcp.md).
