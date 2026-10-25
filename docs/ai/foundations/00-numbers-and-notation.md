---
title: "Numbers, units, and the symbols you will meet"
sidebar_label: "0. Numbers and notation"
sidebar_position: 0
---

# Numbers, units, and the symbols you will meet

**Before this lesson:** [orientation](../orientation.md). No algebra is required. You can do this lesson on paper.

A computer can calculate quickly, but it cannot decide what a number means for you. A library has 12 books and 3 shelves. Dividing 12 by 3 gives 4 **books per shelf** if the books are shared equally. The unit is part of the answer. Four books and four minutes describe different things.

## Read a calculation in small steps

Addition combines amounts. Subtraction finds a difference. Multiplication repeats equal groups. Division shares a total or finds how many groups fit. Parentheses tell you what to calculate first. In `2 × (3 + 4)`, add 3 and 4 before multiplying; the result is 14. In `2 × 3 + 4`, multiply first; the result is 10.

A **negative number** lies below zero. If a prediction is 8 minutes and the measured time is 10, the difference `8 − 10 = −2` tells us the prediction was too small. The **absolute value** ignores the sign: both −2 and 2 have absolute value 2. It measures the size of an error without its direction.

A **fraction** is a division written as two numbers: `3/4` means three of four equal parts. It equals the decimal 0.75 and the percentage 75%. A percentage means “out of 100.” To turn a fraction into a percentage, multiply by 100. Always say what was counted: “75% of four returned books,” not simply “75% correct.”

If success rises from 50% to 60%, it rises by **10 percentage points**. Relative to its starting value, the increase is `10/50 = 20%`. Those are different descriptions of the same change.

## A letter stands for a value

Let `x` be the number of short articles you read. If each takes 5 minutes and setup takes 2, total time is `5x + 2`. Writing two symbols together often means multiplication in mathematics; in Python you will write `5 * x + 2`.

An **equation** says two expressions have the same value. To solve `5x + 2 = 17`, subtract 2 from both sides to get `5x = 15`, then divide both sides by 5 to get `x = 3`. Check by substituting 3 into the original expression. The same change on both sides keeps the equality true.

An **inequality** compares values. `x < 3` means x is smaller than 3; `x ≤ 3` also allows 3. A budget of at most 100 minutes includes exactly 100. Confusing “less than” with “at most” creates boundary bugs in programs.

## Powers, roots, and compact notation

`3²` means `3 × 3 = 9`. A square root reverses squaring for a nonnegative result: `√9 = 3`. `10³ = 1000` and `10⁻³ = 0.001`. Scientific notation writes a number as a value times a power of ten: `2.5 × 10³ = 2500`. Code may display this as `2.5e3`. Here the letter e means a power of ten; it is different from the mathematical constant introduced in the [functions lesson](../mathematics/02-functions-and-gradients.md).

| Symbol | Read it as | Small example |
| --- | --- | --- |
| `Σ` | Add the listed values | The sum of 2, 3, and 5 is 10. |
| `i` | A position or counter | Item i means the item at that position. |
| `n` | The number of items | Three readings means n = 3. |
| `≈` | Approximately equal | 1/3 ≈ 0.333. |
| `\|x\|` | Absolute value | The size of −4 is 4. |

You do not need to memorize symbols before using them. Translate each expression into a sentence first. A formula is a compact set of instructions, not a test of intelligence.

## Worked example: compare two reading plans

Plan A takes 10, 20, and 30 minutes. Its **mean**, or ordinary average, is the total divided by the count: `(10 + 20 + 30)/3 = 20`. Plan B takes 18, 20, and 22 minutes. It has the same mean, but the individual times stay much closer together. A single summary can hide useful differences. Later statistics lessons teach how to describe that spread.

## Practice and a first checkpoint

1. A report rejects 5 of 20 rows. What percentage was rejected?
2. A function charges `3x + 4` units. What input gives 19 units?
3. A predicted wait is 12 minutes; the actual wait is 9. Give the signed and absolute errors.

<details>
<summary>Check the calculations</summary>

The rejection rate is `5/20 × 100 = 25%`. For the equation, subtract 4 and divide by 3: x = 5. Using prediction minus actual, the signed error is +3 minutes and the absolute error is 3 minutes. Stating the subtraction order prevents ambiguity.

</details>

**Mini-project:** compare two imaginary study plans using total minutes, minutes per day, and percentage of the week used. Write the units beside every answer. Ask a friend to reproduce the result from your numbers.

**Common mistakes:** dividing by the wrong count, dropping units, treating rounded numbers as exact, and averaging percentages from differently sized groups without weighting their counts. If one group has 1 success out of 1 and another has 0 out of 9, the combined rate is 1/10, not the average of 100% and 0%.

**Remember:** name the quantity, calculate, then check whether the result is plausible. You are ready to continue when you can explain the three practice answers in your own words.

## Depth lab: units can reveal a wrong answer

A model service receives 120 requests per minute. One request uses 250 input tokens and 50 output tokens. The token count is `120 * (250 + 50) = 36,000` tokens per minute. Dividing by 60 gives 600 tokens per second. Multiplying by 60 would produce a number with the wrong conversion direction.

Before calculating, write the quantity and unit beside every value. A **rate** divides one quantity by another; a **ratio** compares quantities. Percentages require a named denominator. An improvement from 80 to 90 correct answers out of 100 is 10 percentage points, or a 12.5% increase relative to the old count.

**Implement:** write a function converting requests per minute and tokens per request into tokens per second. Reject negative inputs and document whether fractional rates are allowed. Check zero traffic, one request per minute, and a hand-calculated case. Then implement absolute and relative percentage changes as separate functions; define what relative change means when the original value is zero.

### Debug, optimize, and apply

A report says “error improved by 50%” after error falls from 2% to 1%. That is a 50% relative reduction and a one-percentage-point absolute reduction. Both are correct; omitting the reference quantity makes the report ambiguous. Reconstruct counts before accepting the claim.

Keep units in column names or a data dictionary. Convert once at an explicit boundary, then use one internal convention. If calculations run over millions of rows, measure conversion and parsing separately before simplifying arithmetic. The fastest wrong unit conversion remains wrong.

<details>
<summary>Interview and teaching answer: can two correct percentages disagree?</summary>

Yes. Out of 100 cases, ten errors becoming five is a five-percentage-point reduction in error rate and a 50% relative reduction in error count/rate. A different denominator answers a different question. Ask a learner to calculate both and state each denominator aloud. A strong explanation preserves counts, units, and comparison direction.

</details>

**Evidence to keep:** the conversion implementation, boundary tests, one repaired misleading report, and a short lesson showing how units catch an error before code runs.

**Previous:** [What AI is, and what you will build](../orientation.md) · **Next:** [Computers, files, and your first program](01-computers-and-setup.md)
