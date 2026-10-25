---
title: "Debugging, input checks, and useful tests"
sidebar_label: "5. Debugging and tests"
sidebar_position: 5
---

# Debugging, input checks, and useful tests

**Prerequisites:** [functions](./03-control-and-functions.md) and [collections](./04-collections-and-files.md).

A program can run without crashing and still produce the wrong answer. An AI workflow adds more places for that to happen: a column may be missing, a count may use the wrong denominator, or evaluation rows may be duplicated. Testing ordinary data-handling code is an important part of testing the system.

## Separate three kinds of failure

A **syntax error** means Python cannot read the instructions. An **exception** is a reported failure during execution, such as an invalid conversion. A **logic error** means the code runs but does not implement the intended rule.

Consider a function that counts sessions longer than or equal to 20 minutes. A misplaced colon causes a syntax error. Trying to compare `"twenty"` with 20 causes a type-related exception. Writing `minutes > 20` instead of `minutes >= 20` causes a logic error. Testing a duration of exactly 20 distinguishes the last two rules.

When Python displays a **traceback**, it shows the calls leading to an exception. Start with the final error type and message, then find the last relevant line in your own code. Make the failing example smaller until you can explain it. Python's [errors tutorial](https://docs.python.org/3/tutorial/errors.html) explains this reporting format.

## Test a contract, not a copied implementation

Our function returns the mean of a nonempty list of finite numbers. The **mean** is the sum divided by the number of values. Empty input is rejected because it has no mean under this contract.

```python runnable
import math

def average(values):
    if len(values) == 0:
        raise ValueError("average needs at least one value")
    return sum(values) / len(values)

assert average([10, 20, 30]) == 20
assert average([0]) == 0
assert math.isclose(average([0.1, 0.2]), 0.15)
try:
    average([])
except ValueError as error:
    assert str(error) == "average needs at least one value"
else:
    raise AssertionError("empty input was accepted")
print("4 checks passed")
```

```text output
4 checks passed
```

`raise` reports an exception deliberately. `try` runs an operation that might fail; `except ValueError` handles that specific failure. The `else` after `except` runs only if no exception occurred, so it makes this test fail when empty input is incorrectly accepted.

`assert` checks a claim and raises `AssertionError` when it is false. It is convenient in these normal runs, but Python can disable assertions with optimization options. Keep required input validation in explicit checks such as `if ...: raise`, not in assertions. The example assumes finite numeric items; its empty check does not establish that whole input contract.

## Pick cases that expose different mistakes

The ordinary case checks the calculation. The single zero checks that zero is not mistaken for missing data. The decimal case checks a numerical result with tolerance. The empty case checks the chosen failure behavior. More examples with the same shape may add less confidence than one well-chosen boundary case.

For a row-cleaning function, also test missing fields, an unexpected extra column, a repeated identifier, and a valid row after an invalid row. Confirm whether rejection should stop the entire import or produce a rejected-row report.

## Practice: catch the wrong denominator

A developer replaces `len(values)` with `len(values) + 1`. Give one test that catches it. Would a test containing only zeros catch the same bug?

<details>
<summary>Check your answer</summary>

`assert average([10, 20]) == 15` fails for the changed denominator, which gives 10. A test such as `[0, 0]` still gives zero with either denominator, so it cannot detect this mistake. Choose inputs whose expected result depends on the rule you are checking.

</details>

## Tradeoffs and common mistakes

Temporary print statements help inspect intermediate values; persistent tests help catch a regression after a later edit. Tests check selected cases, not every possible input. Clear contracts and reasoning remain necessary.

Avoid catching every exception and returning a plausible default. That can hide a broken program as a valid result. Catch an error when you can explain what recovery means. For larger projects, Python's [unittest framework](https://docs.python.org/3/library/unittest.html) groups and runs named test cases.

## Depth lab: make the test disagree with a plausible bug

The average example above assumes finite numeric values. A production boundary must enforce that assumption or document an earlier validator. Add explicit rejection for non-finite values, booleans if unsupported, and an empty collection. Do not use assertions for required input validation.

A useful test needs an **oracle**: an independently justified expected result. Copying the implementation into the test can reproduce the same mistake. A hand calculation, a simpler slow implementation, or a mathematical property can provide independent evidence.

### Work a diagnosis from symptom to cause

**Symptom:** an evaluation report says the average duration is 12, but a manual review says 15.

1. Preserve the exact input and result.
2. Compare the parsed records with the original source.
3. Count included records and independently sum their values.
4. Inspect the denominator and exclusion rule.
5. Reduce to a two-record case that still fails.
6. Repair the cause, then rerun both the failing case and earlier valid cases.

If values are [10, 20], dividing by count+1 gives 10 rather than 15. Testing only [0, 0] cannot expose this error. The input must make the violated rule observable.

### Test properties without overclaiming

For a nonempty list of finite real values, the mathematical mean lies between minimum and maximum. Adding a constant c to every item shifts the mean by c. Duplicating the entire dataset leaves the mean unchanged. Implement these properties on bounded finite fixtures, allowing appropriate floating-point tolerance. Properties narrow possible bugs; they do not prove the implementation correct for every input.

In production, distinguish invalid user input, an unavailable dependency, and a programmer error. Catch only failures you can handle meaningfully. Preserve enough safe context to reproduce the issue. Profile a verified implementation before optimizing; performance tests should check results as well as timings.

<details>
<summary>Interview and teaching answer: can 100% line coverage miss this bug?</summary>

Yes. Coverage records execution, not the strength of assertions or the diversity of inputs. Every line can run on zero-only examples while the denominator is wrong. Ask the learner to design one test that kills the specific mutation and explain why it works.

</details>

**Evidence:** a minimal reproduction, an independent oracle, a deliberate mutation the tests catch, and a diagnosis explaining why the repair addresses the cause.

**Previous:** [Collections, records, and files](04-collections-and-files.md) · **Next:** [Save your work and reproduce your environment](06-git-environments-and-packages.md)
