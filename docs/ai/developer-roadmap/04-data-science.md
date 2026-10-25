---
title: "4. NumPy, Pandas, data cleaning, and exploration"
sidebar_position: 4
---

# NumPy, Pandas, data cleaning, and exploration

**Prerequisites:** [Python](02-python-for-ai.md) and [mathematics](03-mathematics.md). Follow [tables and SQL](../foundations/07-data-tables-and-sql.md), then [data tools](../foundations/08-data-tools.md).

## What it is and why it matters

Data science turns a vague question and imperfect records into an analysis that someone can check. Most model failures are not fixed by a more complicated network when the labels are wrong, the join duplicates rows, or tomorrow's information has leaked into today's input.

## Learn in this order

### NumPy: arrays, shapes, and vectorized computation

An array stores values with a specified shape and data type. Learn indexing, slicing, masks, reductions, reshaping, matrix operations, and broadcasting. Broadcasting matches compatible dimensions; it does not know your intended meaning. A column vector and a flat vector can combine into an unintended matrix.

Understand views versus copies, numerical precision, random generators, and memory use. Vectorization can reduce Python overhead, but constructing an enormous intermediate array can be worse than a bounded batch.

**Practice:** normalize each feature of a small array, state every intermediate shape, and compare against a loop. Demonstrate a broadcasting bug and fix it with an explicit shape.

### Pandas: labeled tables and relational thinking

A DataFrame adds column names and row labels to tabular work. Learn selection, filtering, grouping, aggregation, joins, missing-value operations, dates, and categorical data. Index alignment can be useful, but it can also combine rows you did not intend to pair.

Treat a join as a claim about keys. A many-to-many join multiplies matching rows; it can inflate totals and duplicate training examples. Check expected row counts and key uniqueness before trusting a merged dataset.

**Practice:** join customers to support tickets, intentionally duplicate a customer key, and detect the inflated result. Compare the calculation with SQL.

### Cleaning and data quality

Define valid types, ranges, units, time zones, identifiers, and label rules. Missing can mean unknown, not applicable, unavailable, or not yet observed; these meanings may require different handling. Zero is not a universal replacement.

Keep raw input immutable and record transformations. Fit learned preprocessing, such as means for imputation, on training data only once a prediction task is defined. Inspect duplicates across people, devices, and time, not only identical rows. Track provenance, consent or permitted use, retention, and deletion from the beginning.

**Practice:** create a data-quality report with counts for missing values, invalid dates, duplicate IDs, suspicious units, and rejected rows. Make every transformation reproducible.

### EDA: ask questions before fitting a model

Exploratory data analysis (EDA) investigates distributions, relationships, unusual cases, and collection artifacts. Compare groups, time periods, class balance, and label coverage. A surprising correlation may come from how the dataset was collected.

Separate exploratory questions from confirmatory tests. If you search hundreds of relationships and report only the strongest, your apparent discovery needs fresh validation. Review a few raw examples behind every important plot.

**Practice:** identify three plausible explanations for an observed association. Write a measurement or experiment that could distinguish them.

### Visualization and communication

Use histograms for distributions, scatterplots for paired measurements, line charts for ordered time, and bar charts for category comparisons. Label units, sample sizes, missingness, and uncertainty. Use accessible colors and readable scales. An average can conceal a failing subgroup.

**Practice:** visualize the same data with a misleading truncated axis and an honest scale. Explain exactly how the impression changed. Add a chart showing the sample count behind each group.

## Mastery lab: discover a silent join error

Suppose two orders total 30 units of revenue. Joining them to customer records should add information, not create new orders. A duplicate customer key can multiply rows and inflate the total even though every individual value is valid.

```python runnable
orders = [{"id": 1, "customer": "A", "amount": 10},
          {"id": 2, "customer": "B", "amount": 20}]
customers = [{"customer": "A", "region": "north"},
             {"customer": "A", "region": "south"},
             {"customer": "B", "region": "east"}]
joined = [(o["id"], c["region"], o["amount"])
          for o in orders for c in customers
          if o["customer"] == c["customer"]]
print(sum(o["amount"] for o in orders))
print(sum(row[2] for row in joined))
print(len(customers) == len({c["customer"] for c in customers}))
```

```text output
30
40
False
```

The first order appears twice. Dropping duplicate rows afterward is not a principled repair: the regions disagree, and the pipeline does not know which one is correct. Define the intended grain—one row per order—and the relationship—many orders to one customer record. Reject or resolve conflicting dimension records before the join. In Pandas, use the join validation supported by your merge operation and assert post-join row counts.

### From scratch to an efficient pipeline

Implement the nested-loop join first and explain its O(n*m) comparisons. Then build a dictionary keyed by customer ID, reject duplicates while building it, and perform O(n+m) expected work under ordinary hash-table assumptions. Compare outputs on missing customers, duplicate orders, empty inputs, and conflicting keys. A faster join that silently chooses the last conflicting record changes the data contract.

NumPy broadcasting has the same class of risk: a valid operation can express the wrong relationship. Write the shapes before computing; test one tiny example against a Python loop. For EDA, compute group sizes and missingness before comparing means. For visualization, choose axes and units that preserve the comparison; do not use a chart to imply causality.

### Production, debugging, and optimization

Keep immutable source snapshots or reproducible source references, schema versions, rejection reasons, and transformation versions. Track row counts, key uniqueness, missingness, units, and distributions at each boundary. A dashboard total alone cannot tell you where duplication entered.

Profile parsing, joins, group-by operations, and output writing separately. Reduce unused columns, use suitable dtypes, and process chunks when memory is the bottleneck. Chunking is not automatically equivalent: global deduplication and aggregates spanning chunks need retained state or a second pass.

**Interview defense:** “Revenue rose 20% after a pipeline refactor.” First compare source snapshots, row grain, join cardinality, filters, currency conversion, and time boundaries. Do not conclude that the business improved merely because the query runs.

**Teach it:** give the learner the five records above and ask them to predict the output count before joining. Then introduce a missing customer and ask for an explicit business rule. Deliver a data contract, a correct optimized implementation, a failure fixture, and a report that another developer can reproduce.

## Mini project and real-world use

Audit a public or synthetic support-ticket dataset. Produce a data dictionary, validated cleaning pipeline, five decision-focused charts, and a report separating observations from hypotheses. Use your full-stack skills to build a small dashboard, but keep the analysis reproducible outside the UI.

Real uses include operational reporting, training-data preparation, failure analysis, and checking whether a product's labels are reliable enough for ML.

**Completion evidence:** a reproducible report with row-count checks, documented exclusions, original/source data references, and no unexplained manual spreadsheet edits.

## Interview questions

1. Why can broadcasting produce a valid result with the wrong shape?
2. How can a join change a training distribution without adding new source records?
3. When should missingness become a feature rather than only an imputation problem?
4. How would you distinguish an outlier from a data-entry error?
5. What can a chart establish, and what would require an experiment?

## Curated resources

- **Courses / tutorials:** [NumPy learning resources](https://numpy.org/learn/) and [Pandas getting-started tutorials](https://pandas.pydata.org/docs/getting_started/intro_tutorials/).
- **Book:** [Python for Data Analysis](https://wesmckinney.com/book/), Wes McKinney; work through indexing, joins, aggregation, and time-series chapters.
- **Paper:** [Data Structures for Statistical Computing in Python](https://doi.org/10.25080/Majora-92bf1922-00a), the original Pandas paper; read for design motivation rather than current API syntax.
- **GitHub:** [Python Data Science Handbook](https://github.com/jakevdp/PythonDataScienceHandbook), with executable examples and a free text.

**Previous:** [Mathematics](03-mathematics.md) · **Next:** [Machine learning](05-machine-learning.md).
