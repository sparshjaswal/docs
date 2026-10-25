"""An offline two-layer neural network with manually calculated gradients.

Python standard library only; synthetic coordinate data, not a useful real model.
Run: python3 static/examples/ai/deep-learning/xor_network.py
"""
import copy
import math
import random


def sigmoid(value):
    if value >= 0:
        return 1 / (1 + math.exp(-value))
    exp_value = math.exp(value)
    return exp_value / (1 + exp_value)


def make_model(seed=7, width=6):
    rng = random.Random(seed)
    return {
        "w": [[rng.uniform(-1, 1), rng.uniform(-1, 1)] for _ in range(width)],
        "b": [0.0] * width,
        "v": [rng.uniform(-1, 1) for _ in range(width)],
        "c": 0.0,
    }


def forward(model, x):
    hidden = [math.tanh(w[0] * x[0] + w[1] * x[1] + b) for w, b in zip(model["w"], model["b"])]
    logit = sum(v * h for v, h in zip(model["v"], hidden)) + model["c"]
    return hidden, logit, sigmoid(logit)


def loss(rows, model):
    total = 0.0
    for x, target in rows:
        _, logit, _ = forward(model, x)
        # Stable binary cross-entropy directly from the logit.
        total += max(logit, 0) - target * logit + math.log1p(math.exp(-abs(logit)))
    return total / len(rows)


def gradients(rows, model):
    width = len(model["v"])
    grad = {"w": [[0.0, 0.0] for _ in range(width)], "b": [0.0] * width,
            "v": [0.0] * width, "c": 0.0}
    for x, target in rows:
        hidden, _, probability = forward(model, x)
        output_error = (probability - target) / len(rows)
        grad["c"] += output_error
        for j in range(width):
            grad["v"][j] += output_error * hidden[j]
            hidden_error = output_error * model["v"][j] * (1 - hidden[j] ** 2)
            grad["b"][j] += hidden_error
            for k in range(2):
                grad["w"][j][k] += hidden_error * x[k]
    return grad


def check_gradient(rows, model):
    analytic = gradients(rows, model)["w"][0][0]
    epsilon = 1e-5
    original = model["w"][0][0]
    model["w"][0][0] = original + epsilon
    plus = loss(rows, model)
    model["w"][0][0] = original - epsilon
    minus = loss(rows, model)
    model["w"][0][0] = original
    numeric = (plus - minus) / (2 * epsilon)
    assert abs(analytic - numeric) < 1e-6, (analytic, numeric)


def update(model, grad, learning_rate):
    model["c"] -= learning_rate * grad["c"]
    for j in range(len(model["v"])):
        model["v"][j] -= learning_rate * grad["v"][j]
        model["b"][j] -= learning_rate * grad["b"][j]
        for k in range(2):
            model["w"][j][k] -= learning_rate * grad["w"][j][k]


def accuracy(rows, model):
    return sum((forward(model, x)[2] >= 0.5) == bool(y) for x, y in rows) / len(rows)


def main():
    values = [-0.9, -0.7, -0.5, -0.3, -0.1, 0.1, 0.3, 0.5, 0.7, 0.9]
    rows = [((x, y), int(x * y < 0)) for x in values for y in values]
    random.Random(19).shuffle(rows)
    train, validation, test = rows[:60], rows[60:80], rows[80:]
    train_inputs = {x for x, _ in train}
    validation_inputs = {x for x, _ in validation}
    test_inputs = {x for x, _ in test}
    assert train_inputs.isdisjoint(validation_inputs | test_inputs)
    assert validation_inputs.isdisjoint(test_inputs)
    model = make_model()
    check_gradient(train[:4], model)
    initial_loss = loss(train, model)
    best = None
    for epoch in range(1, 1801):
        update(model, gradients(train, model), 0.3)
        if epoch % 100 == 0:
            validation_loss = loss(validation, model)
            if best is None or validation_loss < best[0]:
                best = validation_loss, epoch, copy.deepcopy(model)
    validation_loss, epoch, model = best
    majority = int(sum(y for _, y in train) >= len(train) / 2)
    baseline = sum(y == majority for _, y in test) / len(test)
    final_loss = loss(train, model)
    assert final_loss < initial_loss
    assert accuracy(test, model) >= 0.8
    print("Rows: train=60 validation=20 test=20; hidden units=6")
    print(f"Training loss: {initial_loss:.3f} -> {final_loss:.3f}")
    print(f"Selected epoch: {epoch}; validation loss: {validation_loss:.3f}")
    print(f"Test accuracy: network={accuracy(test, model):.2f}; majority baseline={baseline:.2f}")
    print("Checks passed: finite-difference gradient, lower training loss, separate holdout")


if __name__ == "__main__":
    main()
