---
title: "Data tables, SQL, and a complete data-audit project"
sidebar_label: "7. Tables, SQL, and project"
sidebar_position: 7
---

# Data tables, SQL, and a complete data-audit project

**Prerequisites:** [collections and files](./04-collections-and-files.md), [tests](./05-debugging-and-tests.md), and [reproducible project setup](./06-git-environments-and-packages.md).

Before a model can learn from a table, we must know what one row represents. Our table contains **reading sessions**. A learner can appear more than once, but a session identifier must be unique. Counting rows answers “how many sessions?”; counting distinct learner IDs answers a different question.

## Ask questions with SQL

A **database** stores data under a defined structure. A **table** contains rows and columns. A **schema** names those columns and constraints. **SQL** is a language for asking a database to select, combine, and summarize data.

SQLite is a small database engine that runs without a separate server. Python's `sqlite3` interface is available in normal official installations; custom distributions may omit it. See the [Python sqlite3 documentation](https://docs.python.org/3/library/sqlite3.html) if importing it fails.

```python runnable
import sqlite3

connection = sqlite3.connect(":memory:")
try:
    connection.execute("CREATE TABLE sessions (id TEXT PRIMARY KEY, learner TEXT, minutes INTEGER)")
    connection.executemany("INSERT INTO sessions VALUES (?, ?, ?)", [
        ("r1", "Ada", 20), ("r2", "Ben", 30), ("r3", "Ada", None)
    ])
    rows = connection.execute("""
        SELECT learner, SUM(minutes) FROM sessions
        GROUP BY learner ORDER BY learner
    """)
    for learner, minutes in rows:
        print(f"{learner}: {minutes}")
    total, measured, average = connection.execute(
        "SELECT COUNT(*), COUNT(minutes), AVG(minutes) FROM sessions"
    ).fetchone()
    print(f"sessions={total} measured={measured} mean={average}")
finally:
    connection.close()
```

```text output
Ada: 20
Ben: 30
sessions=3 measured=2 mean=25.0
```

`:memory:` creates a temporary in-memory database. The primary key prevents repeated IDs. The question marks bind supplied values separately from SQL instructions. `finally` closes the connection whether the work succeeds or raises an exception.

`GROUP BY` forms groups; `SUM` adds their measured minutes. `ORDER BY` requests a predictable output order. Python `None` becomes SQL `NULL`, a missing value. `COUNT(*)` counts all three rows, while `COUNT(minutes)` and `AVG(minutes)` use the two non-NULL measurements. Treating the missing duration as zero would change the mean to about 16.67. SQLite documents these query rules in its [SELECT reference](https://www.sqlite.org/lang_select.html).

A **join** connects rows from two tables using a key, such as learner ID. If the second table has several matching rows, the join can multiply records. Check the intended one-to-one or one-to-many relationship before trusting totals.

## Stage project: audit a reading log

Build a report that accepts valid session records and explains rejected ones. [Download the complete offline script](pathname:///examples/ai/foundations/reading_audit.py). Save it as `reading_audit.py`; no external package, network call, or extra data file is needed.

Run it from the folder containing the download:

```sh
python3 reading_audit.py
```

Expected result:

```text
accepted=4 rejected=3
learners=3 total_minutes=90
completion_rate=0.75
ada: 45 minutes
ben: 30 minutes
eli: 15 minutes
line 5: minutes must be an integer
line 6: minutes must be between 0 and 240
line 8: duplicate session_id
self-checks passed
```

The seven embedded rows are fictional. The script requires the columns `session_id,learner_id,minutes,completed` in that order. IDs must be nonempty. Minutes must be an integer from 0 through 240. Completion must be 0 or 1. A later otherwise valid record repeating an accepted session ID is rejected; repeated learner IDs are expected. Invalid rows do not reserve an ID.

The project connects the stage's ideas:

1. Read CSV strings and validate their meaning.
2. Keep accepted records and rejected-line reasons separately.
3. Load accepted records into SQLite using bound values.
4. Compute learner totals and completion among accepted sessions.
5. Check ordinary, empty, zero-minute, duplicate, and invalid-header cases.

Optionally use your own matching CSV and save a report with `python3 reading_audit.py --input sessions.csv --output report.json`. The script reads the input without changing it; it writes JSON only when an output path is supplied. An empty accepted dataset reports an undefined completion rate, represented as `null` in JSON.

## Practice and completion gate

Before reading the code, predict whether two sessions by Ada should be merged, rejected, or counted separately. Then change a fictional session to zero minutes and explain whether it remains valid.

<details>
<summary>Answer and extension</summary>

Distinct session IDs are separate observations even when they belong to Ada. Their minutes combine only in the learner-level report. Zero minutes is valid under this stated contract. Add a test for a malformed completion value; it should appear in the rejected report and should not enter the denominator.

</details>

## Mistakes and tradeoffs

Rejecting rows makes the accepted table cleaner, but it can also change who the report represents. Three rejected rows out of seven deserve investigation. The 75% rate describes accepted sessions, not all learners or the quality of a future AI model.

SQLite gives useful constraints and queries for a small local project. A list of dictionaries may be simpler for one calculation; a server database adds capabilities and operational work when multiple applications must share data. Choose from the actual requirements.

You are ready for mathematics when you can run this project, trace one rejection, explain every denominator, and make a test fail deliberately before fixing it.

## Depth lab: a join can multiply evidence

Suppose a sessions table has one row per session and a members table should have one row per member. Joining them should add member attributes without changing the number of sessions. If the members table contains two rows for member A, every A session can appear twice in the joined result.

**Implement:** create a tiny local database with two sessions and conflicting member rows. Run the join, count rows before and after, and compare the sum of minutes. Add a uniqueness constraint or an explicit version-selection policy consistent with the domain. Do not “repair” the total with DISTINCT unless duplicate rows truly represent the same observation.

### Explain the query's contract

State the grain: what one row represents. State keys, relationships, units, and which rows are included. A LEFT JOIN keeps unmatched left rows, but a later WHERE condition on a right-side value can remove them. Test an unmatched member to see whether the written query matches the intended rule.

For time-aware features, event time and availability time can differ. A record created later may describe an earlier event but still have been unavailable when a prediction was made. Reconstruct information available at the prediction cutoff, not only information whose event date is earlier.

### Debug, optimize, and design

Inspect row counts and key cardinality at each transformation before inspecting a final chart. Parameterize user-supplied values. Validate results against a hand-calculated tiny fixture before comparing query plans or adding indexes. An index may reduce lookup work while adding storage and write cost; measure the actual query and workload.

<details>
<summary>Interview and teaching answer: why did revenue double after a correct SQL join?</summary>

SQL may correctly implement the written many-to-many relationship while that relationship violates the intended one-row-per-order grain. Inspect duplicate keys and join cardinality. The repair is a domain-correct relationship or version rule, not a cosmetic aggregate adjustment.

</details>

**Evidence:** schema and grain description, join failure fixture, corrected query, unchanged expected totals, and an execution-plan comparison for a larger synthetic dataset.

**Previous:** [Save your work and reproduce your environment](06-git-environments-and-packages.md) · **Next:** [From Python lists to arrays, tables, and charts](08-data-tools.md)
