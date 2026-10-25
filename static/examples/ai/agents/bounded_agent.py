"""A bounded tool loop with a scripted decision-maker, not a real LLM.

Python 3.10+, standard library; no network, credentials, or real messages.
Run: python3 bounded_agent.py
Test: python3 bounded_agent.py --self-test
Costs are teaching units, not money or measured tokens.
"""

import argparse
from copy import deepcopy
import json
import time

HANDBOOK = {"loan": {"source": "P1", "text": "The loan period is 21 days."}}
TOOL_COST = {"lookup": 1, "send_notice": 2}
NOTICE = {"tool": "send_notice", "arguments": {"text": "The loan period is 21 days."}}


def action_key(action):
    return json.dumps(action, sort_keys=True, separators=(",", ":"))


def validate(action):
    if type(action) is not dict or set(action) != {"tool", "arguments"}:
        raise ValueError("expected tool and arguments only")
    tool, arguments = action["tool"], action["arguments"]
    if type(tool) is not str or tool not in {"lookup", "send_notice", "finish"}:
        raise ValueError("unknown tool")
    expected = {"topic"} if tool == "lookup" else {"text"}
    if type(arguments) is not dict or set(arguments) != expected:
        raise ValueError("wrong argument fields")
    value = next(iter(arguments.values()))
    if type(value) is not str or not 1 <= len(value) <= 200:
        raise ValueError("expected a short non-empty string")
    if tool == "lookup" and value not in HANDBOOK:
        raise ValueError("unknown handbook topic")


def fake_decision(state):
    """Deterministic fixture: the same state produces the same proposal."""
    if not state["observations"]:
        return {"tool": "lookup", "arguments": {"topic": "loan"}}
    if state["goal"] == "announce" and not state["outbox"]:
        return deepcopy(NOTICE)
    return {"tool": "finish", "arguments": {"text": "The loan period is 21 days. [P1]"}}


def run(goal="answer", decide=fake_decision, approved=(), max_steps=4, max_cost=6, seconds=1.0):
    if max_steps < 1 or max_cost < 1 or seconds <= 0:
        raise ValueError("budgets must be positive")
    state = {"goal": goal, "observations": [], "outbox": [], "trace": [], "cost": 0}
    deadline = time.monotonic() + seconds
    used_actions = set()

    def stop(status, answer=""):
        return {**state, "status": status, "answer": answer}

    for _ in range(max_steps):
        if time.monotonic() >= deadline:
            return stop("time_limit")
        if state["cost"] + 1 > max_cost:
            return stop("cost_limit")
        state["cost"] += 1  # One decision costs one teaching unit.
        try:
            action = decide(deepcopy(state))
            validate(action)
        except (ValueError, TypeError) as error:
            state["trace"].append(f"invalid: {error}")
            return stop("invalid_action")
        if time.monotonic() >= deadline:
            return stop("time_limit")
        tool, arguments = action["tool"], action["arguments"]
        if tool == "finish":
            state["trace"].append("finish")
            return stop("complete", arguments["text"])
        key = action_key(action)
        if key in used_actions:
            return stop("repeated_action")
        if tool == "send_notice" and key not in approved:
            state["trace"].append("approval required: send_notice")
            return stop("needs_approval")
        if state["cost"] + TOOL_COST[tool] > max_cost:
            return stop("cost_limit")
        state["cost"] += TOOL_COST[tool]
        if tool == "lookup":
            observation = deepcopy(HANDBOOK[arguments["topic"]])
            state["observations"].append(observation)
            state["trace"].append(f"lookup: [{observation['source']}] {observation['text']}")
        else:
            # Only an in-memory list changes: no external message is sent.
            state["outbox"].append(arguments["text"])
            state["observations"].append({"sent": True})
            state["trace"].append("send_notice: simulated only")
        used_actions.add(key)
    return stop("step_limit")


def self_test():
    assert run()["answer"] == "The loan period is 21 days. [P1]"
    blocked = run("announce")
    assert blocked["status"] == "needs_approval" and blocked["outbox"] == []
    allowed = run("announce", approved={action_key(NOTICE)})
    assert allowed["status"] == "complete" and len(allowed["outbox"]) == 1
    assert run(max_steps=1)["status"] == "step_limit"
    assert run(max_cost=1)["status"] == "cost_limit"
    bad = lambda state: {"tool": "shell", "arguments": {"text": "anything"}}
    assert run(decide=bad)["status"] == "invalid_action"
    repeat = lambda state: {"tool": "lookup", "arguments": {"topic": "loan"}}
    assert run(decide=repeat)["status"] == "repeated_action"
    changed = {"tool": "send_notice", "arguments": {"text": "Changed content"}}
    assert run(decide=lambda state: changed, approved={action_key(NOTICE)})["status"] == "needs_approval"
    print("PASS: success, approval binding, argument validation, duplicate actions, and budgets")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return
    result = run()
    print("Decision-maker: scripted fake; no LLM")
    for event in result["trace"]:
        print(event)
    print("Answer:", result["answer"])
    blocked = run("announce")
    print("Announcement:", blocked["status"])
    print("External messages sent: 0")


if __name__ == "__main__":
    main()
