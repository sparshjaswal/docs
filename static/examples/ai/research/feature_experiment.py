"""Compare a line and a quadratic feature on fictional data; no third-party packages."""
import json
import random
from pathlib import Path
from statistics import mean, stdev


def solve(matrix, values):
    """Gaussian elimination with partial pivoting for this small full-rank system."""
    work = [list(row) + [value] for row, value in zip(matrix, values)]
    size = len(values)
    for column in range(size):
        pivot = max(range(column, size), key=lambda row: abs(work[row][column]))
        work[column], work[pivot] = work[pivot], work[column]
        scale = work[column][column]
        if abs(scale) < 1e-12:
            raise ValueError("Singular feature matrix")
        work[column] = [value / scale for value in work[column]]
        for row in range(size):
            if row != column:
                multiple = work[row][column]
                work[row] = [a - multiple * b for a, b in zip(work[row], work[column])]
    return [row[-1] for row in work]


def features(x, degree):
    return [x ** power for power in range(degree + 1)]


def fit(rows, degree):
    design = [features(x, degree) for x, _ in rows]
    size = degree + 1
    matrix = [[sum(row[i] * row[j] for row in design) for j in range(size)] for i in range(size)]
    values = [sum(row[i] * sample[1] for row, sample in zip(design, rows)) for i in range(size)]
    return solve(matrix, values)


def mae(rows, weights):
    return mean(abs(sum(w * f for w, f in zip(weights, features(x, len(weights) - 1))) - y)
                for x, y in rows)


def experiment(seed):
    rng = random.Random(seed)
    rows = []
    for _ in range(80):
        x = rng.uniform(-2, 2)
        y = 1 + 0.5 * x + 2 * x * x + rng.uniform(-0.15, 0.15)
        rows.append((x, y))
    train, test = rows[:50], rows[50:]
    linear = mae(test, fit(train, 1))
    quadratic = mae(test, fit(train, 2))
    return {"seed": seed, "train_count": len(train), "test_count": len(test),
            "linear_mae": linear, "quadratic_mae": quadratic,
            "paired_improvement": linear - quadratic}


if __name__ == "__main__":
    runs = [experiment(seed) for seed in range(5)]
    differences = [run["paired_improvement"] for run in runs]
    assert all(run["train_count"] == 50 and run["test_count"] == 30 for run in runs)
    assert all(value > 0 for value in differences), "The fixed synthetic comparison changed"
    assert experiment(0) == experiment(0), "The seeded experiment is not repeatable"
    report = {"data": "synthetic quadratic plus bounded uniform noise",
              "settings": "degrees 1 and 2 fixed before evaluation",
              "runs": runs, "mean_paired_improvement": mean(differences),
              "sample_sd_paired_improvement": stdev(differences)}
    Path("feature-experiment.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"Linear mean MAE: {mean(r['linear_mae'] for r in runs):.4f}")
    print(f"Quadratic mean MAE: {mean(r['quadratic_mae'] for r in runs):.4f}")
    print(f"Mean paired improvement: {mean(differences):.4f}")
    print("Report: feature-experiment.json")
    print("Experiment checks passed")
