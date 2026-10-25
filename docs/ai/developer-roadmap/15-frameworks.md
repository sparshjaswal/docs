---
title: "15. LangChain, LangGraph, CrewAI, AutoGen, and Semantic Kernel"
sidebar_position: 15
---

# LangChain, LangGraph, CrewAI, AutoGen, and Semantic Kernel

**Prerequisites:** implement one ordinary model adapter, one bounded agent loop, and one [MCP integration](14-mcp.md). Frameworks should organize concepts you already understand.

## What it is and why it matters

A framework supplies abstractions and reusable control flow. It can reduce repeated integration work, but adds dependencies, defaults, and an upgrade surface. Learn to read its state, traces, and persistence behavior. Your task is to choose a suitable framework, not to master every package before shipping one useful feature.

**Status checked: 25 October 2026.** The [AutoGen repository](https://github.com/microsoft/autogen) is marked archived and directs new users to Microsoft Agent Framework. The [Semantic Kernel repository](https://github.com/microsoft/semantic-kernel) also identifies Microsoft Agent Framework as its successor. Learn the requested names for architecture and existing-system maintenance; use current maintenance and migration guidance when choosing a new dependency.

## Learn the options in this order

### LangChain: components and integrations

LangChain provides abstractions for model access, tools, retrieval, and agent applications. It is useful when integrations and a common interface remove repeated adapter work. It can also hide provider-specific details you still need for errors, usage accounting, and supported features.

**Practice:** port your already-tested search-and-answer path to LangChain. Keep the same inputs, expected outputs, and failure cases. Inspect the generated model requests. Consult the [official overview](https://docs.langchain.com/oss/python/langchain/overview).

### LangGraph: explicit state and durable workflows

LangGraph represents workflows using nodes, transitions, and state. It provides machinery for long-running, stateful execution, including persistence and human intervention. A graph makes transitions inspectable, but your node implementations still determine side effects and correctness. See the [official overview](https://docs.langchain.com/oss/python/langgraph/overview).

**Practice:** implement a draft–review–finalize graph. Restart at a checkpoint and verify that a simulated external action is not duplicated. Test the actual persistence backend you selected.

### CrewAI: roles, tasks, crews, and flows

CrewAI organizes agents and tasks, with crews for collaboration and flows for application control. This can make role-based decomposition convenient. Named roles do not create independent expertise or guarantee accurate peer review. Use the [official introduction](https://docs.crewai.com/en/introduction).

**Practice:** implement a researcher/drafter workflow using the same evidence set as your single-agent baseline. Compare task success, duplication, total calls, and latency. Remove the second agent if it adds no measured value.

### AutoGen: understand existing multi-agent systems

AutoGen explored conversation-based multi-agent applications and layered runtime abstractions. It remains useful research and migration material, but the archived status changes the recommendation for new production work.

**Practice:** read one pinned historical example without treating it as a current installation tutorial. Map its participants, messages, tool execution, and termination logic to your plain loop. Review the successor's migration guidance before maintaining a real deployment.

### Semantic Kernel and Microsoft Agent Framework

Semantic Kernel connected models with application functions/plugins, prompts, and orchestration, with particular relevance to existing .NET ecosystems. Its successor, [Microsoft Agent Framework](https://github.com/microsoft/agent-framework), is the current direction identified by the repositories reviewed here.

**Practice:** for a .NET or Python application, compare one existing Semantic Kernel plugin boundary with the successor's supported integration. Keep business functions independent of the orchestration layer so migration does not require rewriting domain logic.

## Compare frameworks with an experiment

Choose one baseline task and two candidates at most. Run identical evaluations against pinned versions:

| Concern | Evidence to collect |
| --- | --- |
| Model portability | Swap the adapter; identify changed behavior and unsupported features. |
| State and recovery | Restart at a documented point and inspect side effects. |
| Permissions | Denied actions remain denied regardless of generated content. |
| Observability | Inspect requests, errors, usage, and state transitions without secrets. |
| Cost and complexity | Measure calls, latency, dependency footprint, and debugging effort. |
| Maintenance | Review release notes, compatibility policy, and migration effort. |

Do not compare a tiny hand-written loop with a fully featured framework deployment and attribute every difference to the framework itself. Compare the capabilities your task actually needs.

## Mastery lab: compare implementations under one contract

Build a support-document workflow with three steps: retrieve permitted evidence, draft an answer, and verify its citations. First implement it as ordinary functions with an explicit state record. Then implement the same behavior in one framework. A framework comparison is meaningful only when task data, model settings, tool permissions, retry policy, and evaluation remain comparable.

### Implement a plain state reducer

```python runnable
def reduce_event(state, event):
    result = dict(state)
    if event["type"] == "retrieved":
        result["documents"] = list(event["ids"])
        result["stage"] = "draft"
    elif event["type"] == "validated":
        result["stage"] = "done" if event["ok"] else "review"
    else:
        raise ValueError("Unknown event")
    return result

start = {"stage": "retrieve", "documents": []}
next_state = reduce_event(start, {"type": "retrieved", "ids": ["D1"]})
print(start["stage"], next_state["stage"])
print(reduce_event(next_state, {"type": "validated", "ok": False})["stage"])
```

```text output
retrieve draft
review
```

The function returns a new state and does not hide updates in conversation history. A production reducer also validates legal stage transitions, event versions, authorization, and duplicate delivery. The small example gives you a baseline to compare with graph execution, agent orchestration, and persistent checkpoints.

### Understand what each abstraction buys

Use LangChain abstractions where standard model/retrieval/tool integration removes repeated code. Use LangGraph-style stateful graphs when explicit branching and persistence fit the workflow. Evaluate CrewAI-style role/task orchestration when delegation has a measurable benefit. Treat AutoGen and Semantic Kernel examples in their documented maintenance and successor context, as discussed above; preserve the underlying ideas without choosing a retired dependency merely to match a tutorial.

For every abstraction, identify the data structure or control flow it replaces. A “memory” feature may be a stored message list, a retriever, or persistent application state; those have different correctness and deletion requirements.

### Debug, optimize, and defend

Kill a worker after the tool succeeds but before the workflow records success. Replay an event. Change the schema between stored and resumed state. Compare recovered behavior with the plain implementation. These tests reveal semantics that a simple chat demo cannot show.

Measure framework overhead separately from model and tool latency. Optimize repeated serialization, duplicated calls, oversized state, and unnecessary agent turns only after profiling. Check that retries are not multiplying across the framework, HTTP client, and service layers.

**Production design:** keep domain handlers behind your own contracts, persist versioned state, and document migration/rollback behavior. Avoid allowing a framework's convenience defaults to decide business authorization or retention.

**Interview defense:** “Why did you choose this framework?” Present one requirement it satisfies, the measured cost, one failure it does not solve, and a credible migration path. The number of integrations listed on a website is not enough.

**Teach it:** draw the plain loop beside the framework graph. Ask a learner to map each node and checkpoint to ordinary functions and data. Deliver both implementations, a comparable evaluation, a restart test, and a decision record.

## Mini project and real-world use

Reimplement your documentation assistant in one chosen framework and write a decision record: what became easier, what became harder, and what would make you switch. Keep a plain-function version of the tools and a framework-independent evaluation suite.

Uses include stateful support flows, internal research assistants, document pipelines, and enterprise application integration.

**Completion evidence:** one measured comparison and a justified choice. Completing five hello-world tutorials is not the exit criterion.

## Interview questions

1. Which problems do an integration library and a workflow runtime solve differently?
2. Where does a graph checkpoint fail to guarantee exactly-once external execution?
3. How would you detect hidden extra model calls?
4. How do you evaluate a multi-agent framework against one agent?
5. What changes your dependency decision when a project is archived?

## Curated resources

- **Courses:** [LangChain Academy](https://academy.langchain.com/) for its ecosystem and [Microsoft AI Agents for Beginners](https://github.com/microsoft/ai-agents-for-beginners) for broader patterns.
- **Book:** [AI Engineering](https://www.oreilly.com/library/view/ai-engineering/9781098166298/), for evaluating architecture choices independently of package names.
- **Paper:** [AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation](https://arxiv.org/abs/2308.08155), as historical research rather than a current deployment recommendation.
- **GitHub:** [LangChain](https://github.com/langchain-ai/langchain), [LangGraph](https://github.com/langchain-ai/langgraph), [CrewAI](https://github.com/crewAIInc/crewAI), and [Microsoft Agent Framework](https://github.com/microsoft/agent-framework). The AutoGen and Semantic Kernel links above cover the requested legacy ecosystems.

**Previous:** [MCP](14-mcp.md) · **Next:** [AI engineering](16-ai-engineering.md).
