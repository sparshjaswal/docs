---
id: dsa-lru-cache-readme
title: "Least Recently Used (LRU) Cache"
slug: /DSA/lru-cache/README
sidebar_label: "LRU cache"
---

import PracticeProblem from '@site/src/components/PracticeProblem';

# LRU cache: remember what was used most recently

**Prerequisites:** [Map and object references](../javascript-for-dsa.md), [hashing](../hashing/README.md), and [doubly linked lists](../doubly-linked-list/README.md). This lesson combines two structures because each supplies an operation the other lacks.

Imagine a desk that holds only two books. You keep recently used books close by. When a third book arrives, remove the one you have not used for the longest time. **LRU** means **least recently used**. A **cache** stores a limited number of key–value pairs for quick reuse; **eviction** means removing one to make room.

Our operations are:

- `get(key)`: return its value and mark it most recently used. If absent, return `-1` and change nothing.
- `put(key, value)`: insert a new pair or update an existing pair; either counts as use. If insertion exceeds capacity, evict the least recently used key.

These names and the missing-value result match LeetCode's LRU interface. The lesson uses nonnegative integer keys and values, so `-1` is unambiguously missing. Capacity is a nonnegative safe integer. LeetCode's linked problem requires positive capacity; this implementation additionally handles zero capacity by retaining nothing.

## Learning steps

A small cache keeps reusable results nearby. Accessing an entry changes which item should be removed next, even when its value stays the same.

1. Trace gets and puts with capacity two.
2. Use a Map to locate nodes and two links to change their order.
3. Check updates, eviction, missing keys, and capacity zero.

## Why one ordinary array is not enough

An array of entries can keep oldest to newest order, but finding a key or moving an interior entry requires a scan or shifting. That baseline can cost `O(c)` per operation for capacity `c`.

A `Map` finds the node for a key without walking the order. A doubly linked list removes that known node and appends it at the recent end by changing a fixed number of references. Together, they support expected constant-time lookup **and** order updates.

```text
Map: key -> its existing node
  1 ------------------+
  2 -----------------------------+
                      v          v
[old sentinel] <--> [1:10] <--> [2:20] <--> [new sentinel]
                      ^          ^
                least recent  most recent

After get(1), the SAME node moves to the recent end:
[old sentinel] <--> [2:20] <--> [1:10] <--> [new sentinel]
```

`[1:10]` means key 1 stores value 10. Double arrows represent separate `previous` and `next` references. The two **sentinels** are permanent boundary nodes with no cached key; they make empty, first-node, and last-node changes use the same link operations. The map points to real nodes only.

## Complete JavaScript implementation

`detach` and `appendRecent` are internal helper methods. Callers use `get` and `put`; directly changing the map, nodes, or links would break the invariant. The implementation never traverses the list during these operations.

```js runnable
class LRUCache {
  constructor(capacity) {
    if (!Number.isSafeInteger(capacity) || capacity < 0) {
      throw new RangeError('Capacity must be a nonnegative safe integer');
    }
    this.capacity = capacity;
    this.nodes = new Map();
    this.oldest = { previous: null, next: null };
    this.newest = { previous: this.oldest, next: null };
    this.oldest.next = this.newest;
  }

  detach(node) {
    node.previous.next = node.next;
    node.next.previous = node.previous;
  }

  appendRecent(node) {
    const previous = this.newest.previous;
    previous.next = node;
    node.previous = previous;
    node.next = this.newest;
    this.newest.previous = node;
  }

  get(key) {
    const node = this.nodes.get(key);
    if (node === undefined) return -1;
    this.detach(node);
    this.appendRecent(node);
    return node.value;
  }

  put(key, value) {
    const existing = this.nodes.get(key);
    if (existing !== undefined) {
      existing.value = value;
      this.detach(existing);
      this.appendRecent(existing);
      return;
    }
    if (this.capacity === 0) return;

    const node = { key, value, previous: null, next: null };
    this.nodes.set(key, node);
    this.appendRecent(node);
    if (this.nodes.size > this.capacity) {
      const victim = this.oldest.next;
      this.detach(victim);
      this.nodes.delete(victim.key);
    }
  }
}

const cache = new LRUCache(2);
cache.put(1, 10);
cache.put(2, 20);
console.log(cache.get(1)); // Key 1 becomes most recent.
cache.put(3, 30);         // Key 2 is now the oldest, so evict it.
console.log(cache.get(2));
cache.put(1, 25);         // Update key 1 without adding another node.
cache.put(4, 40);         // Evict key 3.
console.log(cache.get(1));
console.log(cache.get(3));

const disabled = new LRUCache(0);
disabled.put(1, 10);
console.log(disabled.get(1));
```

```text output
10
-1
25
-1
-1
```

### Follow capacity 2 step by step

The table lists only real keys, from least to most recently used. The map always contains exactly those keys.

| Operation | Returned value | Key order afterward | Explanation |
| --- | --- | --- | --- |
| `put(1, 10)` | none | `[1]` | First entry becomes most recent |
| `put(2, 20)` | none | `[1, 2]` | New entry goes at the recent end |
| `get(1)` | 10 | `[2, 1]` | Reading 1 moves its existing node |
| `put(3, 30)` | none | `[1, 3]` | Capacity exceeded; evict oldest key 2 |
| `get(2)` | -1 | `[1, 3]` | A miss changes nothing |
| `put(1, 25)` | none | `[3, 1]` | Update value and refresh recency |
| `put(4, 40)` | none | `[1, 4]` | Evict oldest key 3 |

Updating an existing key does not increase size. Reading the most recent key still works: detaching and appending it recreates the same order. A key with stored value zero is present; test the node's existence, not the truthiness of its value.

### Why the two structures stay correct

Maintain three facts after every public operation:

1. The map and list contain exactly the same real nodes, one per key.
2. The list goes from least recent to most recent successful `get` or `put`.
3. The real-node count is at most capacity.

Initially both structures are empty and the sentinels point to each other. Detaching a known node reconnects its two neighbors, preserving everyone else's order. Appending that same node makes it the most recent; the map still points to it. An insertion creates one node in both structures. If capacity is exceeded, the first real node is exactly the least recent one, and removing it from both structures restores the size bound. A missing `get` touches neither structure. These cases cover every operation, so the invariant explains both returned values and evictions.

For capacity `c`, `get` and `put` take expected **O(1)** time under the course's hash-map cost model; each performs only a fixed number of map operations and link changes. Stored nodes and map entries use **O(c + 1)** space including two sentinels. No method allocates a capacity-sized array. JavaScript's language specification does not guarantee worst-case O(1) `Map` operations; the claim is the usual expected hash-table analysis.

## A shorter ordered-Map approach: understand its limit

JavaScript `Map` preserves insertion order. A concise alternative deletes and reinserts a key on every successful access, then evicts the first key from `map.keys()` when full. Calling only `map.set(existingKey, value)` does **not** move that existing key to the end.

That version is convenient for small examples, but the language does not promise constant worst-case time for constructing an iterator and obtaining its first surviving key. The explicit linked order above makes selection of the oldest node a direct reference operation; only map lookup/update costs remain under the stated hash-table model. Do not silently claim identical complexity guarantees for every ordered-map runtime.

## Edge cases and graduated practice

1. **Trace:** capacity is 1. Run `put(4, 9)`, `put(4, 12)`, `get(4)`, `put(5, 8)`, `get(4)`. Which operations evict an entry?
2. **Check:** why must `get` move an existing node? What happens after a missing-key lookup?
3. **Implement:** test capacity 0, storing zero, repeated updates, and reading the current most recent entry.
4. **Extend:** add `delete(key)` without scanning. Explain which two structures must change and what should happen when the key is absent.

<details>
<summary>Hints</summary>

An update changes recency without increasing the number of distinct keys. A miss must not create or promote anything. For deletion, use the map to obtain the existing node, then reuse `detach`.

</details>

<details>
<summary>Answers and extension solution</summary>

1. Updating key 4 evicts nothing. The first `get(4)` returns 12. Inserting key 5 evicts key 4, so the last lookup returns -1.
2. A successful access counts as recent use. Without moving the node, a frequently read entry could be evicted as if it were old. A miss returns -1 and leaves both membership and order unchanged.
3. Capacity 0 always misses. A stored zero must be returned as 0, not mistaken for an absent key. Repeated updates leave one node per key, and reading the recent endpoint does not disturb other entries.
4. Add the following method inside `LRUCache`. It is a method excerpt using the complete class above. It returns true exactly when a key was removed. Both map membership and linked order must change together, with expected O(1) cost under the same model.

```js
// Add inside class LRUCache.
delete(key) {
  const node = this.nodes.get(key);
  if (node === undefined) return false;
  this.detach(node);
  this.nodes.delete(key);
  return true;
}
```

Deleting a sentinel would be invalid, but sentinels are never placed in the map. A missing key therefore returns before any links change. Removing an entry does not make any other entry more recent; their relative order is preserved.

</details>

## Practice Problems

{/* BEGIN GENERATED PRACTICE PROBLEMS */}

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| <PracticeProblem id={146} title={"LRU Cache"} text={"Problem statement\nImplement LRUCache with a positive capacity. get(key) returns the stored value or -1 when absent.\nput(key,value) inserts or updates a pair. When inserting exceeds capacity, evict the least recently\nused key. A successful get and every put count as use. Both operations must run in average O(1)\ntime.\nInput \u0026 expected result\nThe constructor fixes the maximum number of distinct stored keys. Updating an existing key\nreplaces its value and makes it most recently used without increasing the key count. A missing-key\nget returns -1 and does not insert that key.\nEXAMPLE 1\nWith capacity 2: put(1,10), put(2,20), get(1), put(3,30), get(2)\nThe two get results are 10 and -1\nExplanation: Reading key 1 makes key 2 the least recently used. Inserting key 3 therefore evicts\nkey 2.\nEXAMPLE 2\nWith capacity 1: put(4,9), put(4,12), get(4), put(5,8), get(4)\nThe get results are 12 and -1\nExplanation: Updating key 4 preserves one entry; inserting a different key later evicts it.\nConstraints \u0026 guarantees\n• capacity: 1 through 3000 (inclusive)\n• key: 0 through 10^4 (inclusive)\n• value: 0 through 10^5 (inclusive)\n• Combined get/put calls: at most 2 * 10^5\nJavaScript starter\nclass LRUCache {\n  constructor(capacity) { /* TODO */ }\n  get(key) { /* TODO */ }\n  put(key, value) { /* TODO */ }\n}"} /> | Medium | [LeetCode](https://leetcode.com/problems/lru-cache/) | — |

{/* END GENERATED PRACTICE PROBLEMS */}

## References

- [LRU Cache on LeetCode](https://leetcode.com/problems/lru-cache/solutions/244744/lru-cache/)
- [LRU Cache on InterviewCake](https://www.interviewcake.com/concept/java/lru-cache)
- [LRU Cache on Wiki](https://en.wikipedia.org/wiki/Cache_replacement_policies)

**Next:** [the stage assessments](../assessments/README.md).
