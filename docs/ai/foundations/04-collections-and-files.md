---
title: "Collections, records, and files"
sidebar_label: "4. Collections and files"
sidebar_position: 4
---

# Collections, records, and files

**Prerequisites:** [loops and functions](./03-control-and-functions.md). You should be able to trace a count through a list.

Model inputs often begin as ordinary records in a file. Before doing AI, we must know what each record means and preserve that meaning while reading it. A table of reading sessions is a useful first example: each row describes one session, not necessarily one learner.

## Choose the collection for the question

| Collection | What it keeps | Useful question |
| --- | --- | --- |
| List | Ordered items, including repeats | What were the session lengths in order? |
| Dictionary | A value associated with each unique key | How many minutes belong to learner Ada? |
| Set | Distinct members | Which learners appeared at least once? |
| Tuple | An ordered group whose items cannot be reassigned | What fixed pair of coordinates belongs to this point? |

`records[0]` reads the first list item because indexing begins at zero. `record["minutes"]` reads a dictionary value by its key. A missing dictionary key is an error unless you deliberately use a default, such as `counts.get(name, 0)`. Python's [data-structures tutorial](https://docs.python.org/3/tutorial/datastructures.html) describes these operations.

Lists and dictionaries are **mutable**: their contents can change. `second = first` gives another name to the same object; it does not duplicate a list. A shallow copy duplicates the outer collection while nested mutable objects can remain shared. We will avoid changing input records while summarizing them.

## Compact loops

A **comprehension** builds a collection using a short loop expression. Read `[expression for item in collection]` as “visit each item, calculate the expression, and collect the results.” An optional `if` keeps only matching items. A dictionary comprehension uses `{key: value for item in collection}`. These are shortcuts for familiar loops, not different calculations.

Compare each loop with its compact version. `append` adds an item to the end of a list; `len` counts items or characters.

```python runnable
durations = [10, 20, 30]
selected = []
for minutes in durations:
    if minutes >= 20:
        selected.append(minutes)
compact_selected = [minutes for minutes in durations if minutes >= 20]
print("Selected minutes:", selected)
print("List versions agree:", selected == compact_selected)

names = ["Ada", "Eliot"]
lengths = {}
for name in names:
    lengths[name] = len(name)
compact_lengths = {name: len(name) for name in names}
print("Name lengths:", lengths)
print("Dictionary versions agree:", lengths == compact_lengths)

total = 0
for minutes in durations:
    total = total + minutes
compact_total = sum(minutes for minutes in durations)
print("Total minutes:", total)
print("Total versions agree:", total == compact_total)
```

```text output
Selected minutes: [20, 30]
List versions agree: True
Name lengths: {'Ada': 3, 'Eliot': 5}
Dictionary versions agree: True
Total minutes: 60
Total versions agree: True
```

The last compact expression supplies a **generator expression** to `sum`, which adds its numbers. A generator produces items as they are requested instead of storing a new list. It is consumed once; create a fresh generator to repeat the calculation. Later lessons use `sum(error * error for error in errors)` to add squared errors in the same way.

Use a comprehension for a short transformation and an ordinary loop when several steps make it easier to follow. Python's [comprehension tutorial](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions) and [generator-expression guide](https://docs.python.org/3/tutorial/classes.html#generator-expressions) show both forms.

## Read a tiny CSV file

**CSV** means comma-separated values. It represents rows and named columns as text. A CSV reader handles quoting, including commas inside quoted fields; splitting each line on commas does not handle every valid file.

This standalone example creates a temporary folder, writes a small file, reads it, and removes the temporary folder afterward. `import` makes a library module available. `with` manages a resource's lifetime, so the opened file is closed even if reading fails.

```python runnable
import csv
from pathlib import Path
from tempfile import TemporaryDirectory

with TemporaryDirectory() as folder:
    path = Path(folder) / "sessions.csv"
    path.write_text("learner,minutes\nAda,20\nBen,15\nAda,10\n", encoding="utf-8")
    totals = {}
    with path.open(encoding="utf-8", newline="") as source:
        for row in csv.DictReader(source):
            learner = row["learner"]
            minutes = int(row["minutes"])
            totals[learner] = totals.get(learner, 0) + minutes
    for learner in sorted(totals):
        print(f"{learner}: {totals[learner]}")
```

```text output
Ada: 30
Ben: 15
```

`Path(folder) / "sessions.csv"` constructs a path; here `/` joins path parts rather than dividing numbers. `DictReader` turns each row into a dictionary. Its fields are strings, so the program explicitly converts minutes to an integer. Sorting the names makes report order predictable. The [official CSV documentation](https://docs.python.org/3/library/csv.html) explains why files should be opened with `newline=""` for this reader.

## Decide what to do with bad records

The example assumes a complete header and valid integers. Real preparation also checks missing IDs, repeated session IDs, negative durations, and blank values. Do not replace every missing value with zero: a missing measurement and a measured zero tell different stories.

Repeated learner names are expected because one learner can have several sessions. Repeated **session IDs** may be duplicated records. Choose the unit represented by a row before deciding what to remove.

## Practice: membership versus frequency

For `names = ["Ada", "Ben", "Ada"]`, find the number of sessions and the number of distinct learners. Then explain why converting the whole dataset to a set would be inappropriate for counting sessions.

<details>
<summary>Check your answer</summary>

`len(names)` is 3. `len(set(names))` is 2. The second calculation deliberately discards repeated names; those repeats represent real extra sessions here, so they must remain in a session count.

</details>

## Tradeoffs and common mistakes

Reading an entire file into a list is convenient when later work needs repeated passes. Processing rows one by one uses less memory for large files. Either way, count rejected records and explain the rejection rule rather than silently changing the population.

Use an explicit text encoding such as UTF-8. A relative file path starts from the process's working folder, which may differ from the script's folder. Keep the original input intact and write a separate report when building the stage project.

## Depth lab: preserve record identity during an import

A list preserves sequence, a dictionary associates keys with values, and a set tracks membership. Selecting the wrong structure can silently change meaning. Converting records to a dictionary keyed by ID keeps only one value per ID; it does not validate that IDs were unique.

```python runnable
rows = [{"id": "A", "minutes": 10}, {"id": "A", "minutes": 30}]
collapsed = {row["id"]: row for row in rows}
print(len(rows), len(collapsed))
print(collapsed["A"]["minutes"])

def unique_records(records):
    result = {}
    for row in records:
        key = row["id"]
        if key in result:
            raise ValueError("Duplicate ID: " + key)
        result[key] = dict(row)
    return result

try:
    unique_records(rows)
except ValueError as error:
    print(error)
```

```text output
2 1
30
Duplicate ID: A
```

The naive conversion overwrites the first record. The checked function rejects the conflict instead of inventing a “latest” rule. If the domain allows updates, define a version or timestamp policy and test it explicitly.

### Debug and operate the file boundary

A valid CSV row can still contain a wrong unit, duplicate ID, missing field, or malformed number. Preserve source row numbers and rejection reasons. Decide whether one bad row rejects the entire file or produces a partial import; report that decision in the output.

Use context-managed file access so cleanup occurs on exceptions. Separate encoding failures from parsing and domain failures. Do not overwrite an original dataset while cleaning it; write a new artifact with a transformation record.

### Optimize with the right memory model

Processing rows one at a time avoids retaining the entire file, but global duplicate detection still retains seen IDs unless you use another strategy. A dictionary lookup usually avoids repeated linear scans, but its memory and hash assumptions matter. Benchmark a representative file and check that accepted/rejected totals remain identical after optimization.

<details>
<summary>Interview and teaching answer: is converting to a dictionary a deduplication policy?</summary>

It implements last-assignment-wins for repeated keys, which may not be the desired policy. Deduplication requires defining identity, conflicting versions, ordering, and evidence retention. Ask the learner to choose a policy for the two A records and justify it before coding.

</details>

**Evidence:** an import contract, duplicate/malformed fixtures, reconciled counts, a memory measurement, and a short explanation of why each collection was chosen.

**Previous:** [Decisions, loops, and reusable functions](03-control-and-functions.md) · **Next:** [Debugging, input checks, and useful tests](05-debugging-and-tests.md)
