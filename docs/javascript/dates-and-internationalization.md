---
title: "Dates and internationalization"
sidebar_label: "Dates and internationalization"
---

# Dates and internationalization

A birthday and the moment a message was sent are different kinds of date information. A birthday is a calendar date. A message timestamp identifies an **instant**, one point in time. Confusing them can show the wrong day to a person in another time zone.

1. Decide whether you need a calendar date or an instant.
2. Keep that meaning when storing and reading the value.
3. Format it for a chosen language and time zone using `Intl`.

**Internationalization** means preparing a program to display information appropriately for different audiences. A **locale** describes language and regional preferences. Study [strings](./strings-and-regular-expressions.md), [numbers](./numbers-and-math.md), and objects first. `Date` belongs to ECMA-262; `Intl` is specified separately in ECMA-402 and also depends on runtime data.

## An instant is not a local calendar date

A Date stores a time value measured in milliseconds from the Unix epoch. Local getters interpret that value in the host's time zone; UTC getters use UTC. A birthday, a wall-clock meeting time, and a precise event timestamp have different domain meanings.

```js runnable
const instant = new Date('2024-01-15T12:00:00Z');
console.log(instant.toISOString());
console.log(instant.getUTCMonth());
console.log(Number.isNaN(new Date('not a date').getTime()));
```

```text output
2024-01-15T12:00:00.000Z
0
true
```

Date months in numeric constructor arguments and getters are zero-based. Out-of-range numeric components can normalize into a later month, so construction alone does not validate a calendar date. Invalid dates carry NaN; toISOString throws for them. Prefer explicit standardized date/time strings with an offset for instants instead of host-dependent free-text parsing.

A date-only ISO form and an offset-free date-time form have different parsing conventions (UTC versus local time). Avoid relying on that distinction implicitly. Adding 24 hours in milliseconds is an elapsed-duration operation; it is not always the same as moving to the next local calendar day across daylight-saving transitions. Temporal is outside the [ES2026 boundary](./index.md#edition-boundaries-and-runtime-support) used by this course.

## Format for an audience

```js runnable
const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit',
});
const parts = formatter.formatToParts(new Date('2024-01-15T12:00:00Z'));
console.log(parts.find(part => part.type === 'year').value);
console.log(parts.find(part => part.type === 'month').value);
```

```text output
2024
01
```

Choose the locale and time zone explicitly when output must not depend on the user's machine. Full formatted strings can differ with runtime locale data and contain non-ASCII spaces or marks. Use formatToParts for structured rendering; do not split formatted strings by guessed punctuation. A displayed currency code does not perform an exchange-rate conversion.

## Intl capabilities to recognize

| API | Purpose | Boundary to remember |
| --- | --- | --- |
| Intl.NumberFormat | Decimal, percent, currency, unit and compact formatting | Formats Numbers/BigInts; not a numeric parser |
| Intl.DateTimeFormat | Calendar/time-zone-aware date and range formatting | Formats instants; not a general date arithmetic API |
| Intl.Collator | Locale-sensitive comparison for sorting/search | Compare result sign; it need not be exactly −1 or 1 |
| Intl.PluralRules | Select locale plural categories | Categories depend on locale; not just singular versus plural |
| Intl.RelativeTimeFormat | Render relative units such as days | Caller calculates the quantity and chooses the unit |
| Intl.ListFormat | Join items with locale punctuation/conjunctions | Produces presentation text rather than a parseable list |
| Intl.DisplayNames | Human-readable names for supported codes | Requires appropriate runtime locale data |
| Intl.Segmenter | Grapheme, word, or sentence boundaries | Boundary rules depend on locale and segmentation mode |
| Intl.Locale / getCanonicalLocales | Represent and canonicalize locale identifiers | Canonicalization is not translation or support detection |
| Intl.supportedValuesOf | Enumerate supported values for supported keys | Availability and data depend on the runtime |

ECMA-402 editions and individual methods have their own history; this table is not an ECMA-262 year assignment. Inspect resolvedOptions and supportedLocalesOf where available, and test the locales you ship. Reuse formatter objects when formatting many values with the same configuration.

```js runnable
const collator = new Intl.Collator('en', { numeric: true });
console.log(['item10', 'item2', 'item1'].sort(collator.compare).join(', '));
const segments = new Intl.Segmenter('en', { granularity: 'grapheme' });
console.log([...segments.segment('e\u0301')].length);
console.log(new Intl.PluralRules('en').select(1));
```

```text output
item1, item2, item10
1
one
```

Sorting with a collator answers a linguistic ordering question. It is different from normalizing identifiers or enforcing a uniqueness rule. Keep display text separate from canonical storage keys.

## Interview questions {/* #interview-questions */}

**Level: Intermediate.** [How to practise](./index.md#interview-preparation).

### 1. Does a Date retain the time zone offset supplied in its input string?

<details>
<summary>Answer and worked example</summary>

A valid Date represents an instant as a millisecond timestamp. It does not retain the original named zone or offset as part of that value.

```js runnable
const localOffset = new Date('2024-01-01T05:30:00+05:30');
const utc = new Date('2024-01-01T00:00:00Z');
console.log(localOffset.getTime() === utc.getTime());
console.log(localOffset.toISOString());
```

**Expected output**

```text output
true
2024-01-01T00:00:00.000Z
```

Both strings describe the same instant. toISOString expresses it in UTC. Formatting it for a reader requires a separate locale and time-zone choice.

</details>

### 2. Is adding 24 hours equivalent to advancing one local calendar day?

**Apply it:** A meeting occurs every day at noon in New York. Decide whether adding 86,400,000 milliseconds preserves that wall-clock time across daylight-saving changes.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

Not always: daylight-saving transitions can change the elapsed duration of a local day. Decide whether the operation concerns an elapsed interval or a calendar date. Avoid implementation-dependent date strings and test relevant time zones explicitly.

**Worked timeline:** noon on March 9, 2024 in `America/New_York` is 17:00 UTC. Noon on March 10 is 16:00 UTC, because the local offset has changed. The two scheduled noons are 23 elapsed hours apart. Adding exactly 24 hours to the first instant instead reaches 13:00 local time on March 10.

Use elapsed-time arithmetic for “expire 24 hours from now.” Use calendar-and-zone rules for “every day at noon in this location.” Preserve the intended IANA time-zone identifier separately from the instant; a Date does not remember the input’s zone. A recurring time inside a skipped or repeated clock interval additionally needs an explicit disambiguation policy.

**Check your explanation:** state which timeline is authoritative and test a daylight-saving boundary. A test only in UTC or on an ordinary day cannot distinguish these requirements.

</details>

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](./workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 29. Dates time zones and internationalization {/* #workbook-29 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** read one explicit instant and detect an invalid date.

The trailing `Z` makes the example timestamp UTC. Compare the ISO output with the input, then read the UTC month. The code adds one because the month index starts at zero. Finally, inspect the invalid date's numeric value with `Number.isNaN`.

Review [instants and calendar dates](#an-instant-is-not-a-local-calendar-date) and [formatting for an audience](#format-for-an-audience). Keep the time zone explicit in the exercise. Formatting punctuation can vary across locales and environments, so test the meaningful parts your application requires.

**Worked example**

```js
const instant = new Date("2026-01-02T00:00:00Z");
console.log(instant.toISOString());
console.log(instant.getUTCMonth() + 1);
console.log(Number.isNaN(new Date("not-a-date").getTime()));
```

**Expected output**

```text
2026-01-02T00:00:00.000Z
1
true
```

**Why the example works**

The Z makes the input an explicit UTC instant. ISO output is stable for this valid Date. getUTCMonth returns zero for January, so the displayed human month adds one. The invalid input does not throw during construction; its time value is NaN.

</details>

Find **29A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-29-answer">
<summary>Check your reasoning and answer</summary>

**29A.** The stored instant is shared, but local calendar interpretation depends on the display time zone. Formatting the same instant in two zones can cross a midnight boundary.

**29B.** The formatted value contains locale conventions and may contain rounding. Keep the original numeric or decimal-domain representation for arithmetic, then create display text when needed.

**29C.** Subtract numeric timestamps only after validating them. Dividing by 3,600,000 measures elapsed hours, so timezone display and daylight-saving calendar changes do not alter the result.

**Reference code**

```js
function elapsedHours(start, end) {
  if (!(start instanceof Date) || !(end instanceof Date)) {
    throw new TypeError("Dates required");
  }
  const a = start.getTime();
  const b = end.getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b) || b < a) {
    throw new RangeError("Invalid time interval");
  }
  return (b - a) / 3_600_000;
}
```

**Check the result**

```js
const start = new Date("2026-01-01T00:00:00Z");
assert.equal(elapsedHours(start, new Date("2026-01-01T01:30:00Z")), 1.5);
assert.equal(elapsedHours(start, start), 0);
assert.throws(() => elapsedHours(start, new Date("bad")));
```

</details>

<span id="practice" />

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **29A — Why can the same Date display on different calendar days?** | **Must fix** | [Worked example](#workbook-29) | [Answer](#workbook-29-answer) |
| **29B — Why should a formatted currency string not be your stored amount?** | **Must fix** | [Worked example](#workbook-29) | [Answer](#workbook-29-answer) |
| **29C — Write elapsedHours(start, end) for valid Date objects. Reject invalid dates and an end earlier than the start.** | **Must fix** | [Worked example](#workbook-29) | [Answer](#workbook-29-answer) |
| Define separate representations for a birthday, meeting time zone, and event timestamp. | Practice | — | — |
| Format the same instant in two explicit time zones and explain the displayed date difference. | Practice | — | — |
| Compare default string sort with numeric collation for numbered labels. | Practice | — | — |
| Count graphemes in accented and joined-emoji text and compare with length and spread. | Practice | — | — |
| Test an invalid date and a daylight-saving boundary without assuming the machine's local time zone. | Practice | — | — |

## Continue learning

References: [Date specification](https://tc39.es/ecma262/2026/multipage/numbers-and-dates.html#sec-date-objects), [ECMA-402 internationalization](https://tc39.es/ecma402/). Return to [the learning path](./index.md).
