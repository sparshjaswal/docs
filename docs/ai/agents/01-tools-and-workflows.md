---
title: "Tools, workflows, and agents"
sidebar_position: 1
description: "Decide when to use ordinary code, a fixed model workflow, or an agent that chooses actions within application-enforced limits."
---

# Tools, workflows, and agents

**Before this lesson:** [Build and evaluate a hybrid retrieval pipeline](../rag/05-hybrid-search-lab.md).

A **tool** is an operation an application makes available to a model-driven system, such as searching the handbook or calculating a total. A **tool call** contains the operation’s name and its arguments: the inputs it needs.

The model proposes the call. Application code decides whether to run it. This separation matters because generated text is not permission to change a database, send a message, or read private records.

## Choose the simplest design

A **workflow** follows steps arranged by a developer. For example: classify a library question, retrieve evidence, then format the answer. A **language-model agent** can choose its next step based on the goal and observations. It might search again after discovering that the first source is outdated.

| Design | Who chooses the next step? | Suitable example |
| --- | --- | --- |
| Ordinary function | Explicit code | Calculate a due date from known rules |
| Fixed model workflow | Explicit code, with model outputs at selected steps | Classify, retrieve, and summarize a message |
| Agent loop | Model proposes; application validates and controls execution | Investigate an open-ended question using several searches |

The [workflow and agent design guide](https://www.anthropic.com/engineering/building-effective-agents) explains why fixed patterns can be preferable when the path is known. More autonomy adds choices, failures, and evaluation work. A one-step question does not need a planner, a team, and a persistent memory store.

## Give each tool a clear contract

For `lookup_handbook`, define accepted topics, whether access depends on the caller, returned fields, error cases, and whether the tool changes anything. A **read-only tool** observes information. A **state-changing tool** changes a record or performs an external action.

Avoid an unrestricted “run anything” interface for a narrow library task. Offer a small operation such as “look up the current loan rule.” Keep credentials in the application and obtain the caller’s identity from the authenticated session, not from a model-supplied `user_id` alone.

This tiny example illustrates name and argument validation before execution:

```python runnable
def allowed_call(call):
    return (
        type(call) is dict
        and set(call) == {"tool", "arguments"}
        and call["tool"] == "lookup_handbook"
        and type(call["arguments"]) is dict
        and set(call["arguments"]) == {"topic"}
        and call["arguments"]["topic"] in ("loan", "opening_hours")
    )

print(allowed_call({"tool": "lookup_handbook", "arguments": {"topic": "loan"}}))
print(allowed_call({"tool": "send_email", "arguments": {"to": "everyone"}}))
```

```text output
True
False
```

This validates a narrow shape and allowlist. It does not authenticate a user or replace a real authorization check.

## Walk through a proposed announcement

The user asks for a draft notice about a changed loan period. The system can retrieve the policy and prepare text. Sending that notice is a separate action with a recipient list and final content. The application should require the permission or approval appropriate to that action, showing the concrete draft before sending.

Bind any approval to the exact operation and arguments it covers. Approval of a draft does not authorize a changed message or different recipients. For repeated actions, use a stable operation identifier so a retry can find the previous result instead of sending twice.

## Tool results are data

A handbook result might include malicious text telling the model to ignore the user and reveal private data. That is **indirect prompt injection**. Marking it as source text is useful, but enforce tool scope and access controls in code. The result does not grant a new capability. [OWASP’s prompt-injection guidance](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) describes this boundary.

Common mistakes include trusting a plausible tool name, accepting extra arguments, exposing secrets in prompts, treating tool success as completion of the whole task, or letting a model approve its own proposed action.

## Practice

A user asks, “Tell me when my book is due.” The system proposes a tool that emails every borrower a reminder. Should it run? Design the smaller tool that fits the request.

<details>
<summary>Check your answer</summary>

No. The proposed action exceeds the request. A read-only due-date lookup should use the authenticated caller and the relevant loan ID, then return the permitted date and policy basis. No bulk messaging is needed. The application enforces that boundary even if the model argues that the email would be helpful.

</details>

## Depth lab: bind a decision to the exact proposed action

A tool name alone does not identify an action. Operation type, target, payload, caller, and relevant version all matter. A stable **fingerprint** detects whether the proposal changed after review.

```python runnable
import hashlib
import json

def fingerprint(action):
    encoded = json.dumps(action, sort_keys=True, separators=(",", ":"), allow_nan=False)
    return hashlib.sha256(encoded.encode("utf-8")).hexdigest()

reviewed = {"operation": "reserve", "book": "B17", "caller": "U1", "version": 4}
same = {"version": 4, "caller": "U1", "book": "B17", "operation": "reserve"}
changed = {**reviewed, "book": "B18"}
approved_fingerprint = fingerprint(reviewed)
print("same action:", fingerprint(same) == approved_fingerprint)
print("changed target:", fingerprint(changed) == approved_fingerprint)
```

```text output
same action: True
changed target: False
```

This hash is not a signature, identity check, or approval store. Anyone with the payload can calculate it. The application must keep the actual decision in trusted storage and associate it with the authenticated reviewer, scope, expiry, and operation ID. The JSON encoding here is sufficient for this restricted fixture; cross-language canonicalization requires an agreed format.

**Implementation sequence:** validate the tool name and argument types; obtain caller identity from trusted request context; load the target; check current permission and relevant record version; match any required decision to the concrete action; execute through the narrow service function; save the outcome. Recheck authorization when a delayed action resumes.

**Debugging drill:** change the target after approval, replay an expired approval, and revoke the caller's permission. Each failure should be caught before the side effect. A tool returning “permission denied” must not cause the model to try the same write through a broader tool.

**Production and optimization:** keep tool schemas small enough to reduce ambiguity, but do not hide necessary conditions. Return typed outcomes such as success, not found, denied, and uncertain. Cache read results only within a suitable permission and version scope. Never cache an authorization decision indefinitely just to reduce latency.

<details>
<summary>Interview defense: why are schema validation and authorization separate?</summary>

A well-formed request can target another user's record. Schema validation checks the allowed shape and values; authorization checks whether this caller may perform this operation on this resource now. Neither a model's explanation nor a matching fingerprint grants that permission.

</details>

**Build and teach:** implement a read-only catalogue lookup plus a separately controlled reservation fixture. Show the exact boundary where a proposal becomes an execution. Explain why a draft, an approved action, and a completed action are three different states.

**Previous:** [Build and evaluate a hybrid retrieval pipeline](../rag/05-hybrid-search-lab.md) · **Next:** [The agent loop: state, actions, and stopping](02-agent-loop-and-state.md)
