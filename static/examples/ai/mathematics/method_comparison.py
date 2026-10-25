"""Compare fictional quiz scores for six randomly assigned matched pairs.

Run: python3 method_comparison.py
Optional: python3 method_comparison.py --output experiment_report.json
Exact sign enumeration is practical here because there are only six pairs.
"""
import argparse
from itertools import product
import json
import math
from pathlib import Path
from statistics import mean, stdev

# Each pair contains two learners matched on an earlier score. One was assigned
# method A and the other method B. These scores are fictional teaching data.
PAIRS = [(6, 7), (7, 9), (5, 6), (8, 8), (6, 8), (7, 8)]


def compare(pairs):
    if not 2 <= len(pairs) <= 16:
        raise ValueError("Use 2 through 16 independent matched pairs")
    for pair in pairs:
        if len(pair) != 2 or any(
            isinstance(score, bool) or not isinstance(score, (int, float))
            or not math.isfinite(score) or not 0 <= score <= 10
            for score in pair
        ):
            raise ValueError("Each pair needs two finite quiz scores from 0 to 10")
    differences = [b - a for a, b in pairs]
    observed = abs(sum(differences))
    extreme = 0
    patterns = 2 ** len(pairs)
    for signs in product((-1, 1), repeat=len(pairs)):
        candidate = abs(sum(sign * value for sign, value in zip(signs, differences)))
        if candidate >= observed - 1e-12:
            extreme += 1
    return {
        "pairs": len(pairs),
        "mean_a": mean(a for a, _ in pairs),
        "mean_b": mean(b for _, b in pairs),
        "mean_gain_b": mean(differences),
        "sample_sd_of_gains": stdev(differences),
        "estimated_standard_error": stdev(differences) / math.sqrt(len(pairs)),
        "assignment_patterns": patterns,
        "two_sided_randomization_p": extreme / patterns,
    }


def self_check():
    result = compare(PAIRS)
    assert math.isclose(result["mean_gain_b"], 7 / 6)
    assert result["assignment_patterns"] == 64
    assert result["two_sided_randomization_p"] == 0.0625
    reversed_result = compare([(b, a) for a, b in PAIRS])
    assert math.isclose(reversed_result["mean_gain_b"], -7 / 6)
    assert reversed_result["two_sided_randomization_p"] == 0.0625
    assert compare([(5, 5), (7, 7)])["two_sided_randomization_p"] == 1
    for bad in [[], [(1, 2)], [(1, 2), (3, float("nan"))]]:
        try:
            compare(bad)
        except ValueError:
            pass
        else:
            raise AssertionError("Invalid input was accepted")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, help="Optional JSON report path")
    args = parser.parse_args()
    self_check()
    report = compare(PAIRS)
    print(f"pairs={report['pairs']} assignment_patterns={report['assignment_patterns']}")
    print(f"mean_A={report['mean_a']:.3f} mean_B={report['mean_b']:.3f}")
    print(f"mean_gain_B={report['mean_gain_b']:.3f}")
    print(f"estimated_standard_error={report['estimated_standard_error']:.3f}")
    print(f"two_sided_randomization_p={report['two_sided_randomization_p']:.4f}")
    print("At 0.05: do not reject the no-effect hypothesis.")
    print("This does not prove that the methods are equivalent.")
    print("self-checks passed")
    if args.output:
        args.output.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
