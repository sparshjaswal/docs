"""Offline ranking fixture. No embedding model, service, or network is used."""

import argparse
import math
import unittest


def fuse(rankings, allowed, known, constant=60):
    """Filter before scoring; each document gets at most one vote per list."""
    if not math.isfinite(constant) or constant <= 0:
        raise ValueError("constant must be finite and positive")
    scores = {}
    for ranking in rankings:
        seen = set()
        permitted = []
        for document in ranking:
            if document not in known:
                raise ValueError("unknown document ID")
            if document in allowed and document not in seen:
                permitted.append(document)
                seen.add(document)
        for rank, document in enumerate(permitted, start=1):
            scores[document] = scores.get(document, 0) + 1 / (constant + rank)
    return sorted(scores, key=lambda document: (-scores[document], document))


def recall_at_k(ranking, relevant, k):
    if k < 1:
        raise ValueError("k must be positive")
    if not relevant:
        return None  # Abstention cases need a different metric.
    return len(set(ranking[:k]) & relevant) / len(relevant)


class FusionTests(unittest.TestCase):
    def test_complementary_rankings(self):
        known = {"hours", "returns", "map", "events"}
        result = fuse(
            [["hours", "returns", "map"], ["returns", "hours", "events"]],
            known, known,
        )
        self.assertEqual(result, ["hours", "returns", "events", "map"])
        self.assertEqual(recall_at_k(result, {"returns"}, 2), 1)

    def test_denied_document_never_reaches_output(self):
        self.assertEqual(fuse([["private", "public"]], {"public"}, {"private", "public"}), ["public"])

    def test_duplicate_votes_do_not_change_order(self):
        known = {"a", "b"}
        self.assertEqual(fuse([["b", "a", "a", "a"]], known, known), ["b", "a"])

    def test_empty_and_unanswerable_cases(self):
        self.assertEqual(fuse([[]], set(), set()), [])
        self.assertIsNone(recall_at_k([], set(), 2))
        self.assertEqual(recall_at_k([], {"a"}, 2), 0)

    def test_bad_inputs_fail_closed(self):
        with self.assertRaises(ValueError):
            fuse([["unknown"]], set(), set())
        for constant in [0, -1, float("nan"), float("inf")]:
            with self.assertRaises(ValueError):
                fuse([], set(), set(), constant)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        suite = unittest.defaultTestLoader.loadTestsFromTestCase(FusionTests)
        result = unittest.TextTestRunner(verbosity=2).run(suite)
        raise SystemExit(not result.wasSuccessful())
    known = {"hours", "returns", "map", "events", "staff-only"}
    allowed = known - {"staff-only"}
    rankings = [
        ["staff-only", "hours", "returns", "map"],
        ["returns", "hours", "events"],
    ]
    result = fuse(rankings, allowed, known)
    print("Mode: fixed ranking fixture; no live model")
    print("Fused:", ", ".join(result))
    print("Recall@2:", recall_at_k(result, {"hours", "returns"}, 2))
    print("Private document excluded:", "staff-only" not in result)


if __name__ == "__main__":
    main()
