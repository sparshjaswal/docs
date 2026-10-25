"""Train a tiny neural character model, offline, with real gradient updates.

Python 3.10+, standard library only. No arguments train and check the fixture.
Files are written only when --output names a new JSON file in the working folder.
This single-layer softmax model is not a Transformer or a useful chatbot.
"""
import argparse
from copy import deepcopy
import hashlib
import json
import math
from pathlib import Path
import random


SPECIAL = ["<PAD>", "<BOS>", "<EOS>", "<UNK>"]
PAD, BOS, EOS, UNK = range(4)
TRAIN = (
    "the class reads a book.",
    "the teacher reads the notes.",
    "the student writes a note.",
    "the library lends a book.",
    "the class learns to write.",
    "the teacher opens the library.",
    "the student reads in class.",
    "the library closes at noon.",
)
VALIDATION = ("the teacher writes a book.", "the student opens the notes.")
TEST = ("the class reads the notes.", "the library opens at noon.")
ADAPT_TRAIN = (
    "the robot sorts notes.", "the robot reads books.",
    "the robot opens the store.", "the robot learns to sort.",
)
ADAPT_VALIDATION = ("the robot sorts the books.", "the robot reads the notes.")
ADAPT_TEST = ("the robot opens the books.", "the robot sorts a note.")


def vocabulary(documents):
    """Fit only on the training documents; Unicode code points are tokens."""
    return SPECIAL + sorted(set("".join(documents)))


def encode(text, tokens):
    lookup = {token: index for index, token in enumerate(tokens)}
    return [BOS] + [lookup.get(char, UNK) for char in text] + [EOS]


def pairs(documents, tokens):
    result = []
    for document in documents:
        ids = encode(document, tokens)
        result.extend(zip(ids[:-1], ids[1:]))
    return result


def softmax(logits):
    largest = max(logits)
    values = [math.exp(value - largest) for value in logits]
    total = sum(values)
    return [value / total for value in values]


def initialize(tokens, seed=7):
    rng = random.Random(seed)
    size = len(tokens)
    return [[rng.uniform(-0.01, 0.01) for _ in range(size)] for _ in range(size)]


def loss(weights, examples):
    """Mean next-character cross entropy in natural-log units (nats)."""
    if not examples:
        raise ValueError("Evaluation requires at least one next-token pair")
    total = 0.0
    for current, target in examples:
        row = weights[current]
        largest = max(row)
        log_normalizer = largest + math.log(sum(math.exp(x - largest) for x in row))
        total += log_normalizer - row[target]
    return total / len(examples)


def gradient(weights, examples):
    """Derivative of the mean loss: (probability - one_hot_target) / batch_size."""
    result = [[0.0] * len(weights) for _ in weights]
    for current, target in examples:
        probabilities = softmax(weights[current])
        for index, probability in enumerate(probabilities):
            result[current][index] += probability / len(examples)
        result[current][target] -= 1.0 / len(examples)
    return result


def update(weights, gradients, learning_rate, max_norm=1.0):
    norm = math.sqrt(sum(value * value for row in gradients for value in row))
    scale = min(1.0, max_norm / max(norm, 1e-12))
    for row, change in zip(weights, gradients):
        for index in range(len(row)):
            row[index] -= learning_rate * scale * change[index]
    return norm


def train(weights, training, validation, steps=700, learning_rate=3.0, seed=11):
    """Minibatch SGD; select a snapshot using validation, never test, loss."""
    rng = random.Random(seed)
    best = deepcopy(weights)
    best_loss = loss(weights, validation)
    best_step = 0
    for step in range(1, steps + 1):
        batch = [rng.choice(training) for _ in range(32)]
        update(weights, gradient(weights, batch), learning_rate)
        if step % 25 == 0 or step == steps:
            score = loss(weights, validation)
            if score < best_loss:
                best, best_loss, best_step = deepcopy(weights), score, step
    return best, best_step


def generate(weights, tokens, prompt="the ", max_new=60, seed=19, temperature=0.8):
    if not math.isfinite(temperature) or temperature <= 0 or not 0 <= max_new <= 1000:
        raise ValueError("Use positive finite temperature and max_new from 0 to 1000")
    rng = random.Random(seed)
    current = encode(prompt, tokens)[-2] if prompt else BOS
    output = prompt
    for _ in range(max_new):
        probabilities = softmax([value / temperature for value in weights[current]])
        # BOS starts a document; PAD fills a batch. Neither is a generated character.
        probabilities[PAD] = probabilities[BOS] = 0.0
        target = rng.choices(range(len(tokens)), weights=probabilities, k=1)[0]
        if target == EOS:
            break
        output += "�" if target == UNK else tokens[target]
        current = target
    return output


def checkpoint(tokens, weights, stage, selected_step):
    return {
        "format_version": 1,
        "architecture": "one-hot-character-linear-softmax",
        "tokens": tokens,
        "weights": weights,
        "training": {
            "stage": stage, "selected_step": selected_step,
            "initialization_seed": 7, "base_sampling_seed": 11,
            "base_train_sha256": hashlib.sha256("\n".join(TRAIN).encode()).hexdigest(),
        },
    }


def validate_checkpoint(data):
    if not isinstance(data, dict) or set(data) != {
        "format_version", "architecture", "tokens", "weights", "training"
    }:
        raise ValueError("Unexpected checkpoint fields")
    if data["format_version"] != 1 or data["architecture"] != "one-hot-character-linear-softmax":
        raise ValueError("Unsupported checkpoint format or architecture")
    tokens, weights = data["tokens"], data["weights"]
    if (not isinstance(tokens, list) or not 5 <= len(tokens) <= 256
            or not all(isinstance(token, str) for token in tokens)
            or tokens[:4] != SPECIAL or len(tokens) != len(set(tokens))
            or any(len(token) != 1 for token in tokens[4:])):
        raise ValueError("Invalid tokenizer")
    size = len(tokens)
    if (not isinstance(weights, list) or len(weights) != size
            or any(not isinstance(row, list) or len(row) != size for row in weights)):
        raise ValueError("Weight shape does not match tokenizer")
    for row in weights:
        for value in row:
            if (type(value) not in (int, float) or not math.isfinite(value)
                    or abs(value) > 1e6):
                raise ValueError("Weights must be bounded finite numbers")
    if not isinstance(data["training"], dict):
        raise ValueError("Missing training metadata")
    return tokens, weights


def load(path):
    if path.stat().st_size > 2_000_000:
        raise ValueError("Checkpoint exceeds the teaching model's size limit")
    data = json.loads(path.read_text(encoding="utf-8"))
    tokens, weights = validate_checkpoint(data)
    return tokens, weights, data["training"]


def save(path, data):
    if path.resolve().parent != Path.cwd().resolve():
        raise ValueError("--output must name a new file in the current folder")
    validate_checkpoint(data)
    with path.open("x", encoding="utf-8") as stream:
        json.dump(data, stream, ensure_ascii=False, allow_nan=False, indent=2)
        stream.write("\n")


def self_test(tokens, weights):
    assert len(set(TRAIN + VALIDATION + TEST)) == len(TRAIN + VALIDATION + TEST)
    assert len(set(ADAPT_TRAIN + ADAPT_VALIDATION + ADAPT_TEST)) == 8
    assert encode("☃", tokens)[1] == UNK
    assert all(target != PAD for _, target in pairs(TRAIN, tokens))
    # A finite-difference check independently verifies one analytic derivative.
    small = initialize(tokens)
    example = pairs(TRAIN[:1], tokens)[:3]
    row, col = example[0]
    analytic = gradient(small, example)[row][col]
    epsilon = 1e-5
    small[row][col] += epsilon
    plus = loss(small, example)
    small[row][col] -= 2 * epsilon
    minus = loss(small, example)
    assert abs(analytic - (plus - minus) / (2 * epsilon)) < 1e-7
    restored_tokens, restored_weights = validate_checkpoint(
        json.loads(json.dumps(checkpoint(tokens, weights, "test", 0))))
    assert generate(weights, tokens) == generate(restored_weights, restored_tokens)
    assert loss(weights, pairs(TEST, tokens)) == loss(restored_weights, pairs(TEST, tokens))
    broken = checkpoint(tokens, deepcopy(weights), "test", 0)
    broken["weights"][0][0] = float("nan")
    try:
        validate_checkpoint(broken)
    except ValueError:
        pass
    else:
        raise AssertionError("Non-finite checkpoint accepted")
    adapted, _ = train(deepcopy(weights), pairs(ADAPT_TRAIN, tokens),
                       pairs(ADAPT_VALIDATION, tokens), steps=250, learning_rate=1.0, seed=23)
    assert loss(adapted, pairs(ADAPT_VALIDATION, tokens)) < loss(weights, pairs(ADAPT_VALIDATION, tokens))
    assert len(generate(weights, tokens, max_new=3)) <= len("the ") + 3
    print("Checks: gradient, split separation, checkpoint, adaptation, and generation passed")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, help="write a new JSON checkpoint in this folder")
    parser.add_argument("--load", type=Path, help="load a JSON checkpoint instead of base training")
    parser.add_argument("--generate", metavar="PROMPT", help="generate after training or loading")
    parser.add_argument("--adapt", action="store_true", help="fine-tune the loaded model on robot text")
    parser.add_argument("--self-test", action="store_true", help="also run independent correctness checks")
    args = parser.parse_args()
    if args.adapt and not args.load:
        parser.error("--adapt requires --load; train and save a base checkpoint first")
    if args.load:
        tokens, weights, metadata = load(args.load)
        stage, selected_step = metadata.get("stage", "loaded"), metadata.get("selected_step", 0)
        print(f"Loaded: {args.load.name}")
    else:
        tokens = vocabulary(TRAIN)
        initial = initialize(tokens)
        validation = pairs(VALIDATION, tokens)
        initial_loss = loss(initial, validation)
        weights, selected_step = train(initial, pairs(TRAIN, tokens), validation)
        assert loss(weights, validation) < initial_loss
        stage = "base"
        print(f"Architecture: neural character bigram; {len(tokens)} x {len(tokens)} learned weights")
        print(f"Validation loss before training: {initial_loss:.4f}")
        print(f"Selected step (validation only): {selected_step}")
        print(f"Validation loss after training: {loss(weights, validation):.4f}")
        print(f"Final test loss: {loss(weights, pairs(TEST, tokens)):.4f}")
    if args.adapt:
        for text in ADAPT_TRAIN + ADAPT_VALIDATION + ADAPT_TEST:
            if UNK in encode(text, tokens):
                raise ValueError("The loaded tokenizer does not cover this adaptation fixture")
        before = deepcopy(weights)
        weights, selected_step = train(weights, pairs(ADAPT_TRAIN, tokens),
                                       pairs(ADAPT_VALIDATION, tokens),
                                       steps=250, learning_rate=1.0, seed=23)
        stage = "robot-adapted"
        print(f"Adaptation selected step (validation only): {selected_step}")
        print(f"Domain test loss: {loss(before, pairs(ADAPT_TEST, tokens)):.4f} -> {loss(weights, pairs(ADAPT_TEST, tokens)):.4f}")
        print(f"Original test loss: {loss(before, pairs(TEST, tokens)):.4f} -> {loss(weights, pairs(TEST, tokens)):.4f}")
        print("These tiny test sets illustrate a tradeoff; they are not release evidence.")
    if args.generate is not None:
        print(f"Sample: {generate(weights, tokens, prompt=args.generate)}")
    if args.output:
        save(args.output, checkpoint(tokens, weights, stage, selected_step))
        print(f"Saved: {args.output.name}")
    if args.self_test:
        self_test(tokens, weights)
    if not args.load:
        print("Limits: one-character context; no factual or conversational ability")


if __name__ == "__main__":
    main()
