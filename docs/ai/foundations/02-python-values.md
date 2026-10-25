---
title: "Python values, names, and clear calculations"
sidebar_label: "2. Values and names"
sidebar_position: 2
---

# Python values, names, and clear calculations

**Prerequisites:** run the [first program](./01-computers-and-setup.md) and distinguish saved code from terminal commands.

A useful program remembers values so it can combine them later. Suppose you want to report how much of a reading assignment is complete. The calculation is simple; the important skill is making each value's meaning clear.

## Give values useful names

An **integer** is a whole number, such as 12. A **float** represents a number that may have a fractional part, such as 0.75. A **string** is text in quotes. A **Boolean** is `True` or `False` and represents an answer to a yes/no question. `None` represents the absence of a value; it is not the number zero or the text `"None"`.

A name refers to a value. The assignment `pages_read = 18` makes the name `pages_read` refer to 18. Assignment is not a mathematical equation that Python continuously maintains. If another calculation uses that value, changing the name later does not redo the earlier calculation.

```python runnable
pages_read = 18
pages_assigned = 24
fraction_done = pages_read / pages_assigned
has_finished = pages_read == pages_assigned

print(f"Read {pages_read} of {pages_assigned} pages")
print(f"Completion: {fraction_done:.0%}")
print(f"Finished: {has_finished}")
pages_read = 24
print(f"Earlier fraction: {fraction_done:.2f}")
```

```text output
Read 18 of 24 pages
Completion: 75%
Finished: False
Earlier fraction: 0.75
```

Here `/` divides, `=` assigns, and `==` compares. The `f` before a string makes an **f-string**: values inside braces are inserted into the displayed text. `:.0%` displays a fraction as a percentage with zero decimal places; `:.2f` displays two decimal places. Formatting changes the display, not the saved value. See Python's [output formatting guide](https://docs.python.org/3/tutorial/inputoutput.html#formatted-string-literals) for more forms.

## Trace arithmetic and conversion

Python evaluates multiplication and division before addition, as in ordinary arithmetic. Use parentheses when they make your intention easier to see. `**` means “raise to a power”; `^` is a different operator and is not exponentiation.

| Expression | Result | Meaning |
| --- | --- | --- |
| `7 / 2` | `3.5` | Division |
| `7 // 2` | `3` | Floor division |
| `7 % 2` | `1` | Remainder |
| `2 ** 3` | `8` | Two cubed |
| `"7" + "2"` | `"72"` | Join two strings |
| `int("7") + 2` | `9` | Convert the text, then add |

Text read from a file may look numeric without being a number yet. `int("seven")` cannot perform the requested conversion and raises an error. Conversion is a decision about the input, not proof that the input is valid for your task.

Floats have limited precision. For example, not every decimal fraction has an exact finite binary representation. Use sensible display rounding, and later use an approximate comparison for measured quantities instead of assuming exact equality. Python explains the issue in its [floating-point tutorial](https://docs.python.org/3/tutorial/floatingpoint.html).

## Practice: total and rate are different

A learner completes 15 of 20 questions. Store both counts, compute the completion fraction, and print it as 75%. Then explain what must change if the total is zero.

<details>
<summary>Check your answer</summary>

The fraction is `15 / 20`, or 0.75. A total of zero cannot be used as the denominator. Do not silently report zero completion: “no questions assigned” and “completed none of twenty” mean different things. In the next lesson, a condition will handle that case explicitly.

</details>

## Common mistakes and tradeoffs

Choose `minutes`, not `x`, when a value measures minutes. Avoid mixing seconds and minutes in one total. Reusing a name is convenient, but it can hide which version of a value a calculation used; tracing assignments in order catches that mistake.

Store counts as integers when fractional counts make no sense. Keep measured quantities as numbers and add display text only when reporting them. A value such as `"75%"` is useful for a person, while `0.75` is easier to use in another calculation.

## Depth lab: a number can be valid Python and invalid data

Python distinguishes a name from the object it refers to. Two names can refer to one mutable list; changing the list through either name affects both. Reassigning one name does not redirect the other. Draw references before assuming assignment copies data.

For numerical input, decide which values the application permits. A session duration might allow finite nonnegative numbers, but not booleans, numeric-looking strings, infinity, or a missing value.

```python runnable
import math

def duration(value):
    if type(value) not in (int, float):
        raise TypeError("Duration must be numeric")
    if not math.isfinite(value) or value < 0:
        raise ValueError("Duration must be finite and nonnegative")
    return float(value)

print(duration(0))
for candidate in [True, "20", float("nan"), -1]:
    try:
        duration(candidate)
    except (TypeError, ValueError):
        print("rejected")

a = [1]
b = a
b.append(2)
a = [9]
print(b)
```

```text output
0.0
rejected
rejected
rejected
rejected
[1, 2]
```

The explicit type check rejects `True` even though booleans participate in Python's integer type hierarchy. The application contract is narrower than what Python arithmetic happens to accept.

### Debug and use the calculation safely

If a total becomes `nan`, inspect inputs before blaming addition. Comparisons involving NaN do not behave like ordinary ordered numbers, so a simple negative-value check is insufficient. Distinguish missing, zero, and invalid values; they describe different observations.

Store the unit with the field definition and convert at the input boundary. Validate once at that trusted boundary, then avoid repeated conversions inside a measured hot loop unless the data can change. A shallow list copy still shares nested objects; use copying based on ownership, not as a ritual.

<details>
<summary>Interview and teaching answer: does assigning a list make an independent copy?</summary>

No. Assignment binds another name to the same list. In the example, both names initially refer to [1, 2]. Reassigning a creates a new binding to [9], while b still refers to the original list. Ask the learner to predict the result with a nested list and a shallow copy, then draw the references.

</details>

**Evidence:** a validated calculation, aliasing and invalid-number tests, a unit contract, and an explanation of value versus identity.

**Previous:** [Computers, files, and your first program](01-computers-and-setup.md) · **Next:** [Decisions, loops, and reusable functions](03-control-and-functions.md)
