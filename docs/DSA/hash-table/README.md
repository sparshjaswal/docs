---
id: dsa-hash-table-readme
title: "Hash Table"
slug: /DSA/hash-table/README
sidebar_label: "Hash Table"
---

# Hash Table

A **hash table** stores key → value pairs, such as student number 4 → `"Ada"`. A **hash function** chooses a bucket for each key. Look up the bucket, then compare the real keys inside it. Two different keys choosing the same bucket cause a **collision**, not an error.

**Prerequisites:** arrays, loops, functions, object fields, and the [Map interface](../hashing/README.md). This lesson builds a tiny table to show how collisions work. For ordinary problems, use JavaScript `Map`; its key contract supports more types than our teaching implementation.

## Learning steps

Two students can share a locker-number remainder. A table must still compare their full student numbers before returning a record.

1. Place keys into the three example buckets.
2. Insert two colliding keys, update one, then remove the other.
3. Explain why a crowded bucket makes lookup slower.

## A bucket narrows the search; it does not identify the key

Use three buckets and the rule `bucket = key % 3`. Key 4 goes to bucket 1, and key 7 also goes to bucket 1. Keep both entries in that bucket, a method called **separate chaining**:

```text
key 4 -- remainder on division by 3 --+
                                     v
bucket 0:  []
bucket 1:  [4 -> "Ada"] [7 -> "Lin"]
bucket 2:  []                         ^
                                     |
key 7 -- remainder on division by 3 --+
```

Looking up 7 first finds bucket 1, then compares 4 and 7 until the actual key matches. If we used only the bucket number as identity, inserting 7 would wrongly overwrite 4. Updating key 4, by contrast, should replace its value without creating another key-4 entry.

## Complete collision-handling example

A `class` describes objects that share the same operations. A **method** is a function attached to an object; `new ChainedTable(3)` creates one table and runs its `constructor` to set up the initial state. `this` names that particular table, so two tables keep separate buckets. The constructor creates independent bucket arrays. See [objects and classes](../../javascript/objects-and-classes.md) for more practice with these words.

**Contract:** keys are nonnegative safe integers, bucket count is a positive integer, and values may be any JavaScript value. The fixed bucket count is deliberate so collisions are visible. This is not a production replacement for Map.

```js runnable
class ChainedTable {
  constructor(bucketCount = 3) {
    if (!Number.isInteger(bucketCount) || bucketCount < 1) {
      throw new RangeError("Bucket count must be positive");
    }
    this.buckets = Array.from({ length: bucketCount }, () => []);
  }

  bucketFor(key) {
    if (!Number.isSafeInteger(key) || key < 0) {
      throw new RangeError("Keys must be nonnegative safe integers");
    }
    return this.buckets[key % this.buckets.length];
  }

  set(key, value) {
    const bucket = this.bucketFor(key);
    const entry = bucket.find(item => item.key === key);
    if (entry) entry.value = value;
    else bucket.push({ key, value });
  }

  get(key) {
    const entry = this.bucketFor(key).find(item => item.key === key);
    return entry === undefined ? undefined : entry.value;
  }

  has(key) {
    return this.bucketFor(key).some(item => item.key === key);
  }

  delete(key) {
    const bucket = this.bucketFor(key);
    const index = bucket.findIndex(item => item.key === key);
    if (index === -1) return false;
    bucket.splice(index, 1);
    return true;
  }
}
const table = new ChainedTable(3);
table.set(4, "Ada");
table.set(7, "Lin");
table.set(4, "Grace");
console.log(table.get(4), table.get(7));
console.log(table.delete(4), table.get(7));
table.set(10, undefined);
console.log(table.has(10), table.get(10));
console.log(table.has(4), table.delete(4));
```

```text output
Grace Lin
true Lin
true undefined
false false
```

`find` returns the first matching entry or `undefined`; `some` asks whether any entry matches; `findIndex` returns a matching position or -1. `splice(index, 1)` removes that entry and shifts later entries within this one bucket. These are linear scans of the bucket, not constant-time magic.

**Invariant:** each stored key appears once, in the bucket selected by its hash rule. `set` either changes the matching entry or adds an absent key in the correct bucket. Lookup scans that whole bucket, so it finds any stored key. Deletion removes only the matching key and preserves all colliding entries. Thus different keys can safely share a bucket. `has` is separate from `get` because a stored value may itself be `undefined`.

## Costs, resizing, and alternatives

With n entries and b buckets, the **load factor** is n/b: the average number of entries per bucket. Under a well-distributed hash function, a bucket scan has expected O(1 + n/b) work. But our simple modulo hash and fixed three buckets do not guarantee that distribution or constant-time operations. Keys 1, 4, 7, 10, ... all collide, causing O(n) lookup/update/deletion and O(n²) total work to insert n colliding keys. Storage is O(n + b).

Real implementations can grow the bucket array and **rehash** entries when the load factor becomes too large. A resize costs O(n), but appropriately spaced growth can make insertion amortized efficient. Another collision strategy, **open addressing**, probes other positions in the array and needs careful deletion markers. Learn those details when a design problem asks for them; for solving [two sum and frequency tasks](../hashing/README.md), use the tested Map patterns there. JavaScript does not prescribe this toy representation for Map.

When retaining all keys is too expensive and the goal is to skip unnecessary storage reads, compare a [Bloom filter](../bloom-filter/README.md). It provides approximate membership rather than key/value retrieval; possible matches still need an exact lookup.

## Understanding checks and practice

1. **Trace:** With three buckets, which bucket receives keys 2 and 8? Must one replace the other?
2. **Explain:** Why can `get(key) === undefined` not always establish that the key is absent?
3. **Test:** Insert two colliding keys, update one, delete the other, then read the survivor. Write the expected answers before running the example.
4. **Extend:** Add a `size` field that counts distinct keys. Which operations change it?
5. **Design:** Attempt LC 706 below with its stated integer-key bounds. Compare a direct-address array with chaining; account for the entire key range's memory.

<details>
<summary>Hints</summary>

Use the remainder, but still compare full keys. A valid stored value may be `undefined`. Size changes when a new key appears or an existing key disappears, not when an existing value is overwritten.

</details>

<details>
<summary>Answers</summary>

Both keys use bucket 2 and must remain separate entries. Use `has` to distinguish an absent key from a present undefined value. In the worked example, updating key 4 keeps key 7 unchanged; deleting key 4 leaves key 7 readable. Increment size only in the insertion branch of `set` and decrement only when `delete` finds an entry. Direct addressing gives O(1) access for a bounded integer key range but allocates storage for all possible keys, including absent ones; hashing can store mainly the keys that actually occur.

</details>

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| [LC 706 — Design HashMap](https://leetcode.com/problems/design-hashmap/) | Easy | [LeetCode](https://leetcode.com/problems/design-hashmap/) | — |

{/* END GENERATED PRACTICE PROBLEMS */}

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Hash_table)
- [YouTube](https://www.youtube.com/watch?v=shs0KM3wKv8&index=4&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

**Next:** [sets and membership](../sets/README.md).
