"""Offline lexical evidence search with permissions, versions, and citations.

Python 3.10+, standard library only. Run: python3 evidence_search.py
Test: python3 evidence_search.py --self-test
This extracts source text. It is not an LLM or semantic RAG implementation.
"""

import argparse
from collections import Counter
from dataclasses import dataclass
import math
import re


@dataclass(frozen=True)
class Passage:
    source_id: str
    text: str
    roles: frozenset
    current: bool = True


CORPUS = [
    Passage("H1-v2", "Students may borrow books for 21 days.", frozenset({"student", "staff"})),
    Passage("H2-v1", "The library opens at 08:00 on school days.", frozenset({"student", "staff"})),
    Passage("H3-v1", "The science club meets on Wednesday.", frozenset({"student", "staff"})),
    Passage("S1-v1", "The staff equipment budget is 900 credits.", frozenset({"staff"})),
    Passage("H1-v1", "Students may borrow books for 14 days.", frozenset({"student", "staff"}), False),
]
STOP = {"a", "an", "the", "is", "are", "at", "on", "for", "of", "to", "may", "can", "how", "what", "when", "where"}


def tokens(text):
    return [word for word in re.findall(r"[a-z0-9]+", text.lower()) if word not in STOP]


def retrieve(question, role="student", k=2):
    if k < 1:
        raise ValueError("k must be positive")
    # Filter before both scoring and collecting corpus statistics.
    visible = [p for p in CORPUS if p.current and role in p.roles]
    terms = set(tokens(question))
    if not visible or not terms:
        return []
    counts = [Counter(tokens(p.text)) for p in visible]
    lengths = [sum(c.values()) for c in counts]
    average_length = sum(lengths) / len(lengths)
    k1, b = 1.2, 0.75
    scored = []
    for passage, frequencies, length in zip(visible, counts, lengths):
        # A deliberately conservative lexical heuristic, not an entailment test.
        if len(terms & frequencies.keys()) < 2:
            continue
        score = 0.0
        for term in terms:
            tf = frequencies[term]
            if not tf:
                continue
            df = sum(term in document for document in counts)
            idf = math.log(1 + (len(visible) - df + 0.5) / (df + 0.5))
            denominator = tf + k1 * (1 - b + b * length / average_length)
            score += idf * tf * (k1 + 1) / denominator
        scored.append((score, passage))
    scored.sort(key=lambda item: (-item[0], item[1].source_id))
    return [passage for _, passage in scored[:k]]


def answer(question, role="student"):
    passages = retrieve(question, role)
    if not passages:
        return "No evidence found in the current sources you may access."
    return "Evidence: " + " ".join(f"{p.text} [{p.source_id}]" for p in passages)


def self_test():
    assert retrieve("students borrow books")[0].source_id == "H1-v2"
    assert "21 days" in answer("How long can students borrow books?")
    assert "14 days" not in answer("students borrow books")
    assert not retrieve("staff equipment budget", "student")
    assert retrieve("staff equipment budget", "staff")[0].source_id == "S1-v1"
    assert not retrieve("Where is the telescope stored?")
    assert not retrieve("", "student")
    assert not retrieve("students borrow books", "unknown-role")
    assert "[H1-v2]" in answer("students borrow books")
    print("PASS: retrieval, citations, empty evidence, permissions, and old-version exclusion")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return
    print("Mode: lexical search + exact excerpts; no language model")
    for question in ["How long can students borrow books?", "Where is the telescope stored?", "What is the staff equipment budget?"]:
        print("Q:", question)
        print(answer(question, "student"))


if __name__ == "__main__":
    main()
