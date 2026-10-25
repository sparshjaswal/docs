"""A local atomic reservation and receipt; does not promise remote exactly-once effects."""

import argparse
import json
import sqlite3
import tempfile
import unittest
from pathlib import Path


def initialize(path):
    with sqlite3.connect(path) as database:
        database.executescript("""
            CREATE TABLE IF NOT EXISTS reservations (
                receipt INTEGER PRIMARY KEY,
                action_key TEXT UNIQUE NOT NULL,
                payload TEXT NOT NULL
            );
        """)


def reserve(path, action_key, user, book, approved_book, allowed_users):
    if user not in allowed_users:
        raise PermissionError("current user is not authorized")
    if book != approved_book:
        raise PermissionError("approval does not match the proposed book")
    if not all(isinstance(value, str) and value for value in [action_key, user, book]):
        raise ValueError("nonempty text IDs required")
    payload = json.dumps({"user": user, "book": book}, sort_keys=True)
    with sqlite3.connect(path, timeout=5) as database:
        # A write lock covers both the lookup and insertion in this single database.
        database.execute("BEGIN IMMEDIATE")
        previous = database.execute(
            "SELECT receipt, payload FROM reservations WHERE action_key = ?",
            (action_key,),
        ).fetchone()
        if previous:
            if previous[1] != payload:
                raise ValueError("action key was reused with a different payload")
            return previous[0]
        cursor = database.execute(
            "INSERT INTO reservations(action_key, payload) VALUES (?, ?)",
            (action_key, payload),
        )
        return cursor.lastrowid


class DurabilityTests(unittest.TestCase):
    def setUp(self):
        self.folder = tempfile.TemporaryDirectory()
        self.path = Path(self.folder.name) / "reservations.sqlite"
        initialize(self.path)

    def tearDown(self):
        self.folder.cleanup()

    def test_lost_reply_then_restart_has_one_effect(self):
        # Discard the first receipt, as though the reply was lost.
        reserve(self.path, "job-1:reserve", "student", "B17", "B17", {"student"})
        receipt = reserve(self.path, "job-1:reserve", "student", "B17", "B17", {"student"})
        with sqlite3.connect(self.path) as database:
            count = database.execute("SELECT COUNT(*) FROM reservations").fetchone()[0]
        self.assertEqual(receipt, 1)
        self.assertEqual(count, 1)

    def test_changed_payload_is_not_the_same_action(self):
        reserve(self.path, "key", "student", "B17", "B17", {"student"})
        with self.assertRaises(ValueError):
            reserve(self.path, "key", "student", "B18", "B18", {"student"})

    def test_approval_and_current_permission_are_checked(self):
        with self.assertRaises(PermissionError):
            reserve(self.path, "key", "student", "B18", "B17", {"student"})
        reserve(self.path, "key", "student", "B17", "B17", {"student"})
        with self.assertRaises(PermissionError):
            reserve(self.path, "key", "student", "B17", "B17", set())

    def test_separate_logical_actions_have_separate_receipts(self):
        first = reserve(self.path, "one", "student", "B17", "B17", {"student"})
        second = reserve(self.path, "two", "student", "B18", "B18", {"student"})
        self.assertNotEqual(first, second)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        result = unittest.TextTestRunner(verbosity=2).run(
            unittest.defaultTestLoader.loadTestsFromTestCase(DurabilityTests)
        )
        raise SystemExit(not result.wasSuccessful())
    with tempfile.TemporaryDirectory() as directory:
        path = Path(directory) / "demo.sqlite"
        initialize(path)
        reserve(path, "job-1:reserve", "student", "B17", "B17", {"student"})
        receipt = reserve(path, "job-1:reserve", "student", "B17", "B17", {"student"})
        with sqlite3.connect(path) as database:
            count = database.execute("SELECT COUNT(*) FROM reservations").fetchone()[0]
        print("Mode: local SQLite transaction; simulated lost reply")
        print("Recovered receipt:", receipt)
        print("Reservations after retry:", count)


if __name__ == "__main__":
    main()
