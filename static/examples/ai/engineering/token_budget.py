"""Offline context-budget planner; the demo counts UTF-8 BYTES, not model tokens.

Run: python3 token_budget.py             # self-tests and deterministic demo
     python3 token_budget.py --self-test # self-tests only

Inject count_blocks to count the complete candidate with a real model's request
format/tokenizer. The default serializer is ONLY a teaching format. A tool exchange
is an atomic pair here; a production adapter must also validate tool IDs/roles.
"""
from dataclasses import dataclass
import argparse
import io
import unittest


@dataclass(frozen=True)
class Block:
    name: str
    kind: str
    parts: tuple[str, ...]
    mandatory: bool = False


@dataclass(frozen=True)
class Plan:
    kept: tuple[Block, ...]
    dropped: tuple[str, ...]
    input_count: int
    input_limit: int


def teaching_bytes(blocks):
    """One UTF-8 byte per teaching token, including our artificial framing."""
    payload = "\n".join(
        f"[{block.kind}:{block.name}]\n" + "\n".join(block.parts)
        for block in blocks
    )
    return len(payload.encode("utf-8"))


def nonnegative_integer(value, label):
    # bool subclasses int in Python, but is not a sensible budget or token count.
    if type(value) is not int or value < 0:
        raise ValueError(f"{label} must be a nonnegative integer")
    return value


def validate_blocks(blocks):
    if not blocks:
        raise ValueError("instruction and current request are required")
    names = set()
    for block in blocks:
        if not isinstance(block, Block):
            raise ValueError("every input must be a Block")
        if not isinstance(block.name, str) or not block.name or block.name in names:
            raise ValueError("block names must be nonempty and unique")
        names.add(block.name)
        if block.kind not in {"instruction", "context", "tool_exchange", "current_request"}:
            raise ValueError("unknown block kind")
        if type(block.mandatory) is not bool:
            raise ValueError("mandatory must be Boolean")
        expected = 2 if block.kind == "tool_exchange" else 1
        if (not isinstance(block.parts, tuple) or len(block.parts) != expected
                or any(not isinstance(part, str) or not part for part in block.parts)):
            raise ValueError("use one text part, or a complete two-part tool exchange")
    instructions = [i for i, block in enumerate(blocks) if block.kind == "instruction"]
    requests = [i for i, block in enumerate(blocks) if block.kind == "current_request"]
    if instructions != [0] or requests != [len(blocks) - 1]:
        raise ValueError("one instruction must be first and one current request last")
    if not blocks[0].mandatory or not blocks[-1].mandatory:
        raise ValueError("instruction and current request must be mandatory")


def plan_context(blocks, context_limit, reserved_output, headroom,
                 count_blocks=teaching_bytes):
    """Drop oldest optional whole blocks; keep retained order; reject overflow.

    The caller supplies blocks in chronological order. No truncation, model call,
    summary generation, or claim about retained answer quality happens here.
    count_blocks must count the COMPLETE candidate, including its real framing.
    """
    for label, value in (("context_limit", context_limit),
                         ("reserved_output", reserved_output), ("headroom", headroom)):
        nonnegative_integer(value, label)
    if context_limit == 0 or reserved_output + headroom > context_limit:
        raise ValueError("output reservation and headroom must fit the positive context limit")
    blocks = tuple(blocks)
    validate_blocks(blocks)
    input_limit = context_limit - reserved_output - headroom

    def count(candidate):
        return nonnegative_integer(count_blocks(tuple(candidate)), "counter result")

    mandatory = tuple(block for block in blocks if block.mandatory)
    if count(mandatory) > input_limit:
        raise ValueError("mandatory content does not fit; narrow or split the task")
    kept, dropped = list(blocks), []
    current_count = count(kept)
    for block in blocks:
        if current_count <= input_limit:
            break
        if not block.mandatory:
            kept.remove(block)
            dropped.append(block.name)
            current_count = count(kept)
    if current_count > input_limit:
        raise ValueError("candidate does not fit; no request was sent")
    return Plan(tuple(kept), tuple(dropped), current_count, input_limit)


def example_blocks():
    return (
        Block("rules", "instruction", ("Answer using supplied evidence.",), True),
        Block("old-note", "context", ("Old unrelated note. " * 8,)),
        Block("lookup", "tool_exchange", ("CALL catalog(book=7)", "RESULT book 7: available")),
        Block("question", "current_request", ("Is book 7 available?",), True),
    )


class BudgetTests(unittest.TestCase):
    def setUp(self):
        self.blocks = example_blocks()
        self.required = (self.blocks[0], self.blocks[-1])
        self.exact = teaching_bytes(self.required)

    def test_unicode_counts_bytes_not_characters(self):
        self.assertEqual(len("é🙂"), 2)
        self.assertEqual(len("é🙂".encode("utf-8")), 6)

    def test_exact_fit_keeps_mandatory_and_latest_request(self):
        result = plan_context(self.blocks, self.exact, 0, 0)
        self.assertEqual(result.kept, self.required)
        self.assertEqual(result.input_count, result.input_limit)

    def test_room_keeps_original_order(self):
        result = plan_context(self.blocks, 10000, 30, 10)
        self.assertEqual(result.kept, self.blocks)
        self.assertEqual(result.dropped, ())

    def test_oldest_optional_dropped_before_tool_exchange(self):
        subset = (self.blocks[0], self.blocks[2], self.blocks[3])
        result = plan_context(self.blocks, teaching_bytes(subset) + 40, 30, 10)
        self.assertEqual(result.kept, subset)
        self.assertEqual(result.dropped, ("old-note",))
        self.assertEqual(result.kept[1].parts, self.blocks[2].parts)

    def test_mandatory_overflow_fails_closed(self):
        with self.assertRaisesRegex(ValueError, "mandatory content"):
            plan_context(self.blocks, self.exact - 1, 0, 0)

    def test_negative_fractional_and_boolean_budgets_rejected(self):
        for bad in (-1, 0.5, True):
            for budget in ((bad, 0, 0), (1000, bad, 0), (1000, 0, bad)):
                with self.subTest(budget=budget), self.assertRaises(ValueError):
                    plan_context(self.blocks, *budget)

    def test_reservations_and_zero_limit_rejected(self):
        for budget in ((0, 0, 0), (10, 8, 3)):
            with self.subTest(budget=budget), self.assertRaises(ValueError):
                plan_context(self.blocks, *budget)

    def test_counter_is_injectable_and_counts_whole_candidate(self):
        # Artificial fixture, NOT measurements from a model tokenizer.
        calls = []
        costs = {"rules": 5, "old-note": 20, "lookup": 10, "question": 5}

        def fixture(candidate):
            calls.append(tuple(block.name for block in candidate))
            return 2 + sum(costs[block.name] for block in candidate)

        result = plan_context(self.blocks, 32, 8, 2, fixture)
        self.assertEqual(result.input_count, 22)
        self.assertIn(("rules", "lookup", "question"), calls)

    def test_invalid_counter_results_rejected(self):
        for bad in (-1, 1.5, True):
            with self.subTest(bad=bad), self.assertRaises(ValueError):
                plan_context(self.blocks, 1000, 0, 0, lambda _: bad)

    def test_incomplete_tool_exchange_rejected(self):
        orphan = Block("lookup", "tool_exchange", ("RESULT with no call",))
        with self.assertRaises(ValueError):
            plan_context((self.blocks[0], orphan, self.blocks[-1]), 1000, 0, 0)

    def test_empty_duplicate_or_moved_request_rejected(self):
        for bad in ((), self.blocks + (self.blocks[-1],),
                    (self.blocks[-1], *self.blocks[:-1])):
            with self.subTest(bad=bad), self.assertRaises(ValueError):
                plan_context(bad, 1000, 0, 0)

    def test_required_context_survives_and_input_is_unchanged(self):
        evidence = Block("required-evidence", "context", ("Required evidence.",), True)
        original = (self.blocks[0], self.blocks[1], evidence, self.blocks[-1])
        wanted = (original[0], original[2], original[3])
        result = plan_context(original, teaching_bytes(wanted), 0, 0)
        self.assertEqual(result.kept, wanted)
        self.assertEqual(original[1], self.blocks[1])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--self-test", action="store_true", help="run checks without the demo")
    args = parser.parse_args()
    stream = io.StringIO()
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(BudgetTests)
    result = unittest.TextTestRunner(stream=stream).run(suite)
    if not result.wasSuccessful():
        raise SystemExit(stream.getvalue())
    print(f"Budget planner: {result.testsRun} tests passed")
    if not args.self_test:
        result = plan_context(example_blocks(), 260, 50, 20)
        print("Counter: UTF-8 bytes, NOT real model tokens")
        print(f"Input allowance: {result.input_limit}; used: {result.input_count}")
        print("Kept: " + ", ".join(block.name for block in result.kept))
        print("Dropped: " + ", ".join(result.dropped))
        print("No API calls or files written")


if __name__ == "__main__":
    main()
