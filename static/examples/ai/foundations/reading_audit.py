"""Audit fictional reading sessions with only the Python standard library.

Run: python3 reading_audit.py
Optional: python3 reading_audit.py --input sessions.csv --output report.json
The output path is used only when explicitly supplied.
"""
import argparse
import csv
import io
import json
from pathlib import Path
import sqlite3

SAMPLE = """session_id,learner_id,minutes,completed
r1,ada,20,1
r2,ben,30,0
r3,ada,25,1
r4,chen,,1
r5,dia,-5,1
r6,eli,15,1
r1,ada,20,1
"""
FIELDS = ["session_id", "learner_id", "minutes", "completed"]


def read_sessions(text):
    reader = csv.DictReader(io.StringIO(text))
    if reader.fieldnames != FIELDS:
        raise ValueError("Expected columns: " + ",".join(FIELDS))
    accepted, rejected, seen = [], [], set()
    for line, row in enumerate(reader, start=2):
        try:
            if None in row or any(value is None for value in row.values()):
                raise ValueError("wrong field count")
            session = row["session_id"].strip()
            learner = row["learner_id"].strip()
            if not session or not learner:
                raise ValueError("missing identifier")
            if session in seen:
                raise ValueError("duplicate session_id")
            try:
                minutes = int(row["minutes"])
            except ValueError:
                raise ValueError("minutes must be an integer") from None
            if not 0 <= minutes <= 240:
                raise ValueError("minutes must be between 0 and 240")
            if row["completed"] not in ("0", "1"):
                raise ValueError("completed must be 0 or 1")
            accepted.append((session, learner, minutes, int(row["completed"])))
            seen.add(session)
        except ValueError as error:
            rejected.append({"line": line, "reason": str(error)})
    return accepted, rejected


def audit(text):
    accepted, rejected = read_sessions(text)
    connection = sqlite3.connect(":memory:")
    try:
        connection.execute("""CREATE TABLE sessions (
            session_id TEXT PRIMARY KEY, learner_id TEXT NOT NULL,
            minutes INTEGER NOT NULL, completed INTEGER NOT NULL)""")
        connection.executemany("INSERT INTO sessions VALUES (?, ?, ?, ?)", accepted)
        count, learners, minutes, complete = connection.execute("""
            SELECT COUNT(*), COUNT(DISTINCT learner_id),
                   COALESCE(SUM(minutes), 0), COALESCE(SUM(completed), 0)
            FROM sessions
        """).fetchone()
        totals = connection.execute("""
            SELECT learner_id, SUM(minutes) FROM sessions
            GROUP BY learner_id ORDER BY learner_id
        """).fetchall()
    finally:
        connection.close()
    return {
        "accepted": count,
        "rejected": len(rejected),
        "learners": learners,
        "total_minutes": minutes,
        "completion_rate": complete / count if count else None,
        "minutes_by_learner": dict(totals),
        "rejections": rejected,
    }


def self_check():
    report = audit(SAMPLE)
    assert (report["accepted"], report["rejected"], report["learners"]) == (4, 3, 3)
    assert report["total_minutes"] == 90
    assert report["completion_rate"] == 0.75
    assert report["minutes_by_learner"] == {"ada": 45, "ben": 30, "eli": 15}
    empty = audit(",".join(FIELDS) + "\n")
    assert empty["accepted"] == 0 and empty["completion_rate"] is None
    zero = audit(",".join(FIELDS) + "\nr0,ada,0,0\n")
    assert zero["accepted"] == 1 and zero["total_minutes"] == 0
    for bad in ["bad,header\n", "session_id,learner_id,minutes\n"]:
        try:
            audit(bad)
        except ValueError:
            pass
        else:
            raise AssertionError("A bad header was accepted")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, help="Optional CSV with the documented columns")
    parser.add_argument("--output", type=Path, help="Optional JSON report path")
    args = parser.parse_args()
    self_check()
    text = args.input.read_text(encoding="utf-8") if args.input else SAMPLE
    report = audit(text)
    print(f"accepted={report['accepted']} rejected={report['rejected']}")
    print(f"learners={report['learners']} total_minutes={report['total_minutes']}")
    rate = report["completion_rate"]
    print("completion_rate=" + ("undefined" if rate is None else f"{rate:.2f}"))
    for learner, minutes in report["minutes_by_learner"].items():
        print(f"{learner}: {minutes} minutes")
    for row in report["rejections"]:
        print(f"line {row['line']}: {row['reason']}")
    print("self-checks passed")
    if args.output:
        args.output.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
