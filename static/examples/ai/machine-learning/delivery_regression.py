"""Offline teaching project: split, fit, select, and evaluate a linear model.

Python standard library only. No downloads and no real delivery/customer data.
Run: python3 static/examples/ai/machine-learning/delivery_regression.py
"""
import math
from dataclasses import dataclass

FEATURES = ("distance_km", "pickup_stops")


@dataclass(frozen=True)
class Row:
    dispatch_index: int
    features: tuple
    minutes: float


def make_data():
    rows = []
    for index in range(100):
        distance = float((index * 7) % 23 + 1)
        stops = float((index * 5) % 9 + 1)
        noise = ((index * 11) % 7 - 3) * 0.4
        rows.append(Row(index, (distance, stops), 8 + 2.3 * distance + 1.7 * stops + noise))
    return rows


def fit_scaler(rows):
    means = tuple(sum(row.features[j] for row in rows) / len(rows) for j in range(2))
    scales = tuple(
        math.sqrt(sum((row.features[j] - means[j]) ** 2 for row in rows) / len(rows))
        for j in range(2)
    )
    if any(scale == 0 for scale in scales):
        raise ValueError("Drop or explicitly handle constant training features")
    return means, scales


def transform(features, scaler):
    means, scales = scaler
    if len(features) != len(FEATURES) or not all(math.isfinite(x) for x in features):
        raise ValueError("Expected two finite numeric features")
    return tuple((x - mean) / scale for x, mean, scale in zip(features, means, scales))


def fit(rows, ridge):
    scaler = fit_scaler(rows)
    inputs = [transform(row.features, scaler) for row in rows]
    weights = [0.0, 0.0]
    bias = sum(row.minutes for row in rows) / len(rows)
    for _ in range(1500):
        grad_w = [0.0, 0.0]
        grad_b = 0.0
        for x, row in zip(inputs, rows):
            error = bias + sum(w * value for w, value in zip(weights, x)) - row.minutes
            grad_b += 2 * error / len(rows)
            for j in range(2):
                grad_w[j] += 2 * error * x[j] / len(rows)
        bias -= 0.05 * grad_b
        for j in range(2):
            weights[j] -= 0.05 * (grad_w[j] + 2 * ridge * weights[j])
    return scaler, tuple(weights), bias


def predict(model, features):
    scaler, weights, bias = model
    return bias + sum(w * x for w, x in zip(weights, transform(features, scaler)))


def mae(rows, prediction):
    return sum(abs(prediction(row.features) - row.minutes) for row in rows) / len(rows)


def main():
    rows = make_data()
    train, validation, test = rows[:60], rows[60:80], rows[80:]
    assert max(row.dispatch_index for row in train) < min(row.dispatch_index for row in validation)
    assert max(row.dispatch_index for row in validation) < min(row.dispatch_index for row in test)
    candidates = []
    for ridge in (0.0, 0.1, 1.0):
        model = fit(train, ridge)
        candidates.append((mae(validation, lambda x: predict(model, x)), ridge, model))
    validation_mae, ridge, model = min(candidates, key=lambda item: item[:2])
    baseline = sum(row.minutes for row in train) / len(train)
    # The test partition is consulted only after the choice is fixed.
    model_test_mae = mae(test, lambda x: predict(model, x))
    baseline_test_mae = mae(test, lambda _: baseline)
    assert model[0] == fit_scaler(train), "Preprocessing must be fitted only on training rows"
    assert model_test_mae < baseline_test_mae
    assert all(math.isfinite(predict(model, row.features)) for row in test)
    print(f"Rows: train={len(train)} validation={len(validation)} test={len(test)}")
    print(f"Selected ridge: {ridge:.1f}; validation MAE: {validation_mae:.3f} minutes")
    print(f"Test MAE: model={model_test_mae:.3f}; mean baseline={baseline_test_mae:.3f} minutes")
    print(f"Example prediction (10 km, 3 stops): {predict(model, (10.0, 3.0)):.3f} minutes")
    print("Checks passed: ordered split, training-only scaler, finite predictions, baseline comparison")


if __name__ == "__main__":
    main()
