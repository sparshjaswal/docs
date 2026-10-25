"""A fictional, deterministic release gate; these outcomes are not model benchmarks."""
from collections import defaultdict


def evaluate(rows):
    if not rows:
        raise ValueError("A release needs evaluation examples")
    groups = defaultdict(list)
    ids = set()
    for item in rows:
        if not isinstance(item, dict) or set(item) != {"id", "slice", "success", "unsafe"}:
            raise ValueError("Each outcome needs id, slice, success, and unsafe")
        if type(item["id"]) not in (str, int) or item["id"] == "":
            raise ValueError("Evaluation IDs must be nonempty strings or integers")
        if not isinstance(item["slice"], str) or not item["slice"].strip():
            raise ValueError("Each outcome needs a nonempty slice name")
        if type(item["success"]) is not bool or type(item["unsafe"]) is not bool:
            raise ValueError("success and unsafe must be Boolean flags")
        if item["id"] in ids:
            raise ValueError("Duplicate evaluation ID")
        ids.add(item["id"])
        groups[item["slice"]].append(item)
    return {
        "success": sum(item["success"] for item in rows) / len(rows),
        "unsafe_actions": sum(item["unsafe"] for item in rows),
        "slices": {name: sum(item["success"] for item in group) / len(group)
                   for name, group in groups.items()},
    }


def decide(baseline, candidate):
    old, new = evaluate(baseline), evaluate(candidate)
    if {(r["id"], r["slice"]) for r in baseline} != {(r["id"], r["slice"]) for r in candidate}:
        raise ValueError("Compare the same examples and slice definitions")
    reasons = []
    if new["success"] < old["success"]:
        reasons.append("overall regression")
    if new["unsafe_actions"]:
        reasons.append("unsafe action observed")
    for name, value in old["slices"].items():
        if new["slices"][name] < value:
            reasons.append(f"slice regression: {name}")
    return ("HOLD" if reasons else "RELEASE"), reasons


def fixture(successes, unsafe_id=None):
    return [{"id": i, "slice": "common" if i < 8 else "less_common",
             "success": i in successes, "unsafe": i == unsafe_id} for i in range(10)]


if __name__ == "__main__":
    baseline = fixture({0, 1, 2, 3, 4, 8, 9})
    unsafe = fixture(set(range(8)), unsafe_id=0)
    safer = fixture(set(range(10)))
    bad_decision, reasons = decide(baseline, unsafe)
    good_decision, _ = decide(baseline, safer)
    assert evaluate(unsafe)["success"] > evaluate(baseline)["success"]
    assert "slice regression: less_common" in reasons
    assert "unsafe action observed" in reasons
    assert bad_decision == "HOLD" and good_decision == "RELEASE"
    assert decide(baseline, baseline)[0] == "RELEASE"
    try:
        decide(baseline, safer[:-1])
    except ValueError:
        pass
    else:
        raise AssertionError("Unequal evaluation sets accepted")
    malformed = [dict(row) for row in safer]
    malformed[0]["unsafe"] = 1
    malformed[1]["unsafe"] = -1
    try:
        decide(baseline, malformed)
    except ValueError:
        pass
    else:
        raise AssertionError("Numeric safety flags can cancel each other")
    print(f"Unsafe candidate: {bad_decision}")
    print(f"Safer candidate: {good_decision}")
    print("Release gate: all checks passed")
