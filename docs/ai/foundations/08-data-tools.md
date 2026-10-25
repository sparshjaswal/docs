---
title: "From Python lists to arrays, tables, and charts"
sidebar_label: "8. Data tools and charts"
sidebar_position: 8
---

# From Python lists to arrays, tables, and charts

**Before this lesson:** [tables and SQL](./07-data-tables-and-sql.md). You can read a file, write a loop, and test a result.

Small loops make a calculation visible. On a large dataset, you want tools that organize numbers efficiently and preserve column names. **NumPy** provides numerical arrays. **pandas** provides named tables called DataFrames. **Matplotlib** draws charts. They solve different parts of the same task.

## Work out the answer before choosing a package

Suppose three branches report daily loans: north has 10 and 14; south has 8 and 12; east has 6 and 10. There are three rows and two measurements per row. The table's **shape** is 3 rows by 2 columns. A row represents a branch; a column represents a day.

`[[10, 14], [8, 12], [6, 10]]` is a list of lists. A numerical array stores that rectangular structure with a declared element type, such as integer or decimal. A column operation must say which direction it combines. “Average per branch” reduces the days within each row. “Average per day” reduces the branches within each column.

```python runnable
loans = [[10, 14], [8, 12], [6, 10]]
branch_means = [sum(row) / len(row) for row in loans]
print(branch_means)
print([sum(row[day] for row in loans) for day in range(2)])
```

```text output
[12.0, 10.0, 8.0]
[24, 36]
```

This is the reference result. Keep it when replacing the implementation.

## Optional package lab

Use the [virtual environment procedure](./06-git-environments-and-packages.md), then install these packages inside it. This lab needs package downloads; the rest of the early course remains runnable without them.

```bash
python -m pip install numpy pandas matplotlib
python -m pip freeze > requirements.txt
```

Save this as `data_tools.py` and run `python data_tools.py`. It writes a chart file into the current directory.

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

values = np.array([[10, 14], [8, 12], [6, 10]], dtype=float)
assert values.shape == (3, 2)
assert np.allclose(values.mean(axis=1), [12, 10, 8])

table = pd.DataFrame({
    "branch": ["north", "south", "east"],
    "day_one": values[:, 0],
    "day_two": values[:, 1],
})
table["change"] = table["day_two"] - table["day_one"]
print(table[["branch", "change"]].to_string(index=False))
figure, axis = plt.subplots()
axis.bar(table["branch"], table["day_two"])
axis.set(xlabel="Branch", ylabel="Loans", title="Fictional loans on day two")
figure.tight_layout()
figure.savefig("loans.png")
plt.close(figure)
```

`axis=1` combines columns within a row. `values[:, 0]` selects all rows of column zero. `np.allclose` compares decimals with a tolerance because floating-point arithmetic can round. A **slice** such as `:` selects a range; an empty start and end select the whole axis.

The reported changes should each be 4. The chart should show bars of height 14, 12, and 10. The code is an optional package example, not part of the standard-library execution checks.

## Join information without multiplying it by accident

A **join** combines tables using a shared key. To add each branch's region to each loan record, match the branch column. If the branch table accidentally contains two “north” rows, one loan record can become two. Count rows before and after the join, and check key uniqueness. In pandas, `merge(..., validate="many_to_one")` can require many loan rows to match only one branch row.

An inner join keeps matched rows. A left join keeps all left-side rows and marks unmatched right-side values as missing. Neither missing nor unmatched means zero. Keep a count of failed matches so the report cannot silently lose a branch.

## Choose a chart for the question

Use bars to compare categories, a line for values over ordered time, a histogram to count values in intervals, and a scatter plot for paired numerical measurements. Label units and the collection period. A truncated bar-chart axis can make a small difference look large. A line connecting unordered branches suggests a trend that does not exist.

Prefer SQL for querying a large database close to its stored data; pandas for manageable local tables; NumPy for regular numerical operations; and plain Python when control flow matters more than bulk arithmetic. Loading an entire database into memory is not a requirement for learning AI.

## Practice and project extension

Add a branch with a missing second day. Decide whether your summary should omit it, report “unknown,” or use a documented replacement. Do not quietly replace it with zero. Add a duplicate branch to the lookup table and prove that your join check fails.

<details>
<summary>What a strong answer includes</summary>

The missing value represents absent information; a zero represents a measured count of zero. Report the number of observed branches alongside any average. Reject a supposedly unique lookup table with duplicate keys, or define a valid aggregation before joining. Preserve the original input so someone can audit the decision.

</details>

**Checkpoint:** extend your reading-log report with one clearly labeled chart, a missing-data count, and a test comparing a package result with a hand calculation. Keep your original exercises and report.

Further practice: the official [NumPy beginner guide](https://numpy.org/doc/stable/user/absolute_beginners.html) explains arrays and axes; [pandas tutorials](https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html) cover selection, summaries, joins, and plotting.

## Depth lab: validate the array operation before vectorizing it

Vectorization expresses a calculation over whole arrays so an optimized library can perform the work. It removes some Python-loop overhead; it does not verify the meaning of the shapes.

For three predictions and three labels, element-wise residuals should have shape (3,). If predictions have shape (3, 1) and labels shape (3,), broadcasting can produce a (3, 3) matrix of pairwise differences. The operation succeeds but answers a different question.

**Implement:** first calculate three residuals using Python lists and an explicit length check. In the optional array environment, reproduce both shape combinations and compare every expected value. Write the intended axes in words: example, feature, or output.

### Dataframe and visualization diagnosis

For a table, check dtypes, missingness, unique keys, and row grain before aggregate operations. Compare group sizes before comparing group means. For a chart, label units, population, time range, and missing-data handling. A dramatic axis range can alter perception without changing the data.

**Failure exercise:** one group has two records and another has 200. Explain why averaging their means without weighting gives a different result from the overall record mean. Decide whether the question concerns the average group or the average record; both can be legitimate, but they are different estimands.

### Production and optimization

Keep raw data references, transformation versions, and a reproducible report. Avoid a notebook that depends on hidden execution order: restart and run top to bottom. Measure parsing, joins, numerical work, and plotting separately. Select relevant columns and suitable dtypes before allocating large intermediate arrays.

<details>
<summary>Interview and teaching answer: is vectorized code always faster and smaller?</summary>

No. Broadcasting may allocate a large intermediate, and an operation can be memory-bound. A loop over chunks or a library routine avoiding materialization may use less memory. Verify shape and result first, then compare representative time and peak memory.

</details>

**Teach it:** ask a learner to predict the two residual shapes without running code. Deliver a loop oracle, shape assertions, a weighted-mean comparison, and a cleanly reproducible report.

**Previous:** [Data tables, SQL, and a complete data-audit project](07-data-tables-and-sql.md) · **Next:** [Vectors and matrices: give numbers a structure](../mathematics/01-vectors-and-matrices.md)
