"""A word-bigram teaching model: Python 3.10+, standard library, no downloads.

Run: python3 tiny_language_model.py
Test: python3 tiny_language_model.py --self-test
This is a count model, not a transformer, chatbot, or factual question-answerer.
"""

import argparse
from collections import Counter, defaultdict
import math
import random
import re

TRAIN = [
    "the robot reads books",
    "the robot sorts books",
    "the student reads books",
    "the student writes notes",
]
HELD_OUT = ["the robot writes notes", "the student sorts books"]


def tokenize(text):
    """Simple word tokens; real LLMs often use learned subword tokenizers."""
    return re.findall(r"[a-z]+", text.lower())


class BigramModel:
    def __init__(self, sentences):
        self.counts = defaultdict(Counter)
        self.vocabulary = {"<end>"}
        for sentence in sentences:
            words = tokenize(sentence)
            self.vocabulary.update(words)
            sequence = ["<start>", *words, "<end>"]
            for previous, following in zip(sequence, sequence[1:]):
                self.counts[previous][following] += 1
        self.vocabulary = sorted(self.vocabulary)

    def probability(self, previous, following):
        # Add-one smoothing gives unseen pairs a nonzero probability.
        if following not in self.vocabulary:
            raise ValueError("Evaluation token is outside the training vocabulary")
        counts = self.counts.get(previous, Counter())
        return (counts[following] + 1) / (sum(counts.values()) + len(self.vocabulary))

    def perplexity(self, sentences):
        losses = []
        for sentence in sentences:
            sequence = ["<start>", *tokenize(sentence), "<end>"]
            for previous, following in zip(sequence, sequence[1:]):
                losses.append(-math.log(self.probability(previous, following)))
        if not losses:
            raise ValueError("Need at least one next-token prediction")
        return math.exp(sum(losses) / len(losses))

    def generate(self, seed=7, temperature=1.0, max_tokens=12, greedy=False):
        if temperature <= 0 or not math.isfinite(temperature):
            raise ValueError("temperature must be finite and greater than zero")
        if max_tokens < 0:
            raise ValueError("max_tokens cannot be negative")
        rng = random.Random(seed)
        previous = "<start>"
        result = []
        for _ in range(max_tokens):
            counts = self.counts.get(previous)
            if not counts:
                break
            # Generation uses observed transitions, unlike smoothed evaluation.
            choices = sorted(counts)
            if greedy:
                following = min(choices, key=lambda word: (-counts[word], word))
            else:
                logits = [math.log(counts[word]) / temperature for word in choices]
                peak = max(logits)
                weights = [math.exp(value - peak) for value in logits]
                following = rng.choices(choices, weights=weights, k=1)[0]
            if following == "<end>":
                break
            result.append(following)
            previous = following
        return " ".join(result)


def self_test():
    model = BigramModel(TRAIN)
    assert model.generate(greedy=True) == "the robot reads books"
    assert model.generate(seed=7) == model.generate(seed=7)
    assert len(model.generate(max_tokens=2).split()) <= 2
    assert math.isclose(sum(model.probability("robot", w) for w in model.vocabulary), 1)
    assert model.perplexity(HELD_OUT) > model.perplexity(TRAIN)
    assert model.counts["robot"]["writes"] == 0
    assert tokenize("Books, BOOKS!") == ["books", "books"]
    try:
        model.generate(temperature=0)
    except ValueError:
        pass
    else:
        raise AssertionError("invalid temperature accepted")
    print("PASS: probabilities, held-out evaluation, limits, and repeatability")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return
    model = BigramModel(TRAIN)
    print("Model: word bigram; context = one previous token")
    print("Greedy:", model.generate(greedy=True))
    print("Sample (seed 7):", model.generate(seed=7))
    print(f"Train perplexity: {model.perplexity(TRAIN):.3f}")
    print(f"Held-out perplexity: {model.perplexity(HELD_OUT):.3f}")
    print("Limits: counts only; no semantic understanding or factual guarantee")


if __name__ == "__main__":
    main()
