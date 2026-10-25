---
title: "Binary data, buffers, and shared memory"
sidebar_label: "Binary data and shared memory"
---

# Binary data, buffers, and shared memory

**Optional advanced lesson.** A file, image, or network message can be handled as bytes: small units of stored data. An `ArrayBuffer` owns a block of bytes. A typed array or `DataView` is a way to read and write those bytes.

Before this chapter, practise [arrays](./arrays/index.md), [numbers](./numbers-and-math.md), and [asynchronous execution](./asynchronous/asynchronous.md).

1. Start with one buffer and one view. Change a value and inspect the bytes.
2. Compare a second view of the same storage with a copy that owns separate storage.
3. Learn transfer and resizing only when your program needs them.
4. Leave shared memory and atomic operations until you understand how multiple workers can access the same data.

Picture two windows looking at the same shelf: two views do not create two shelves. These facilities entered ECMA-262 in ES2015; later sections identify newer additions.

## Choose a view

| Representation | Element storage | Use |
| --- | --- | --- |
| Int8Array / Uint8Array | Signed/unsigned 8-bit | Packed bytes and protocols |
| Uint8ClampedArray | 8-bit clamped to 0–255 | Pixel channels |
| Int16Array / Uint16Array | 16-bit integers | Compact integer data |
| Int32Array / Uint32Array | 32-bit integers | Counters and binary fields |
| Float32Array / Float64Array | 32/64-bit floating point | Numeric processing |
| BigInt64Array / BigUint64Array (2020) | 64-bit BigInt elements | Integer binary formats |
| Float16Array (2025) | 16-bit floating point | Compact approximate values |
| DataView | Read/write different types at byte offsets | Mixed fields and explicit byte order |

Typed arrays expose `buffer`, `byteOffset`, `byteLength`, `length`, and `BYTES_PER_ELEMENT`. They are iterable and support many array-like operations, but cannot hold arbitrary objects or holes. `ArrayBuffer.isView` recognizes both typed arrays and DataView.

```js runnable
const buffer = new ArrayBuffer(4);
const bytes = new Uint8Array(buffer);
const view = new DataView(buffer);
view.setUint16(0, 0x1234, false);
console.log(bytes[0], bytes[1]);
console.log(view.getUint16(0, true).toString(16));
console.log(ArrayBuffer.isView(bytes), ArrayBuffer.isView(buffer));
```

```text output
18 52
3412
true false
```

`false` selects big-endian byte order in DataView, while `true` selects little-endian. Typed arrays use the platform's byte order; use DataView with an explicit flag for network/file formats. Out-of-range DataView access throws rather than silently reading a missing field.

## Conversion, aliasing, and copying

```js runnable
const source = new Uint8Array([1, 2, 3]);
const alias = source.subarray(1);
const copy = source.slice(1);
alias[0] = 9;
console.log([...source].join(', '), [...copy].join(', '));
console.log(new Uint8Array([257, -1])[0], new Uint8Array([257, -1])[1]);
console.log(new Uint8ClampedArray([300, -1, 1.5]).join(', '));
```

```text output
1, 9, 3 2, 3
1 255
255, 0, 2
```

`subarray` shares storage; `slice` copies. `new Uint8Array(existingTypedArray)` copies converted element values, while `new Uint8Array(existing.buffer)` shares its buffer. Integer views wrap/truncate values; clamped bytes use a different rounding/clamping rule. Validate values first if wrapping would hide a bug.

The method family includes `from`, `of`, `set`, `fill`, `copyWithin`, search, map/filter/reduce, and entries/keys/values. Unlike Array.sort, typed-array sort defaults to numeric order. Sorting is stable from ES2019. Later additions include `includes` (2016), `at` (2022), `findLast`/`findLastIndex`, `toSorted`, `toReversed`, and `with` (2023). There is no TypedArray.toSpliced: these views represent typed storage rather than a resizable list of arbitrary elements.

## Buffer size and ownership — ES2024

A resizable ArrayBuffer has a current `byteLength`, a `maxByteLength`, and a `resizable` flag. `resize` may grow or shrink it within its maximum. A view constructed without a length can track growth; an explicit-length view retains its specified range and can become out of bounds after shrinking.

```js runnable requires=ArrayBuffer.prototype.resize
const buffer = new ArrayBuffer(4, { maxByteLength: 8 });
const tracking = new Uint8Array(buffer);
const fixed = new Uint8Array(buffer, 0, 4);
tracking[0] = 7;
buffer.resize(8);
console.log(tracking.length, fixed.length);
const moved = buffer.transferToFixedLength();
console.log(buffer.detached, buffer.byteLength);
console.log(new Uint8Array(moved)[0], moved.resizable);
```

```text output
8 4
true 0
7 false
```

`transfer` moves contents into another buffer and detaches the source, preserving resizability where applicable. `transferToFixedLength` returns fixed storage. `detached` distinguishes a detached buffer from a valid empty one. Old views cannot keep using transferred storage; specific access operations may return no value or throw, so do not treat byteLength zero as proof that all operations remain safe. [Buffer transfer proposal](https://github.com/tc39/proposal-arraybuffer-transfer).

## Shared memory and atomic operations — ES2017

SharedArrayBuffer provides storage shared by agents such as workers. Sharing does not make compound expressions atomic: `counter[0]++` reads, computes, and writes separately. Use an agreed synchronization protocol. Creating and messaging workers belongs to the host; ECMAScript specifies shared memory behavior and Atomics operations.

```js runnable
const shared = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
const counter = new Int32Array(shared);
console.log(Atomics.add(counter, 0, 1));
console.log(Atomics.load(counter, 0));
console.log(Atomics.compareExchange(counter, 0, 1, 8));
console.log(Atomics.load(counter, 0));
```

```text output
0
1
1
8
```

`add`, `sub`, `and`, `or`, `xor`, `exchange`, and `compareExchange` return the old value; `load` reads and `store` writes. These operate on supported integer views, not float or clamped arrays. `isLockFree` describes whether an access size can be implemented without locks; it does not prove an entire algorithm is lock-free.

`wait` checks an Int32Array or BigInt64Array location and may block until notified or timed out. `notify` wakes waiters (the original ES2017 name was `wake`, renamed in ES2019). Blocking waits are prohibited in some agents, notably browser main threads. Shared memory availability in browsers also depends on host security settings, including isolation requirements; test the deployment environment.

## Nonblocking waits and growable shared buffers — ES2024

`Atomics.waitAsync` returns `{async, value}`. When `async` is false, `value` is an immediate status such as `not-equal` or `timed-out`; when true, it is a promise for the eventual status. Recheck the condition in a synchronization loop instead of assuming a notification grants ownership.

```js runnable requires=Atomics.waitAsync
const values = new Int32Array(new SharedArrayBuffer(4));
const result = Atomics.waitAsync(values, 0, 1);
console.log(result.async, result.value);
```

```text output
false not-equal
```

A growable SharedArrayBuffer is created with `maxByteLength` and uses `grow`, with `growable` and `maxByteLength` accessors. It cannot shrink or transfer ownership like an ordinary ArrayBuffer. A fixed maximum does not remove the need to coordinate readers and writers. [Resizable/growable buffers](https://github.com/tc39/proposal-resizablearraybuffer), [asynchronous waits](https://github.com/tc39/proposal-atomics-wait-async).

## Half-precision storage — ES2025

```js runnable requires=Float16Array
const values = new Float16Array([1.5, 0.1]);
console.log(values.BYTES_PER_ELEMENT, values[0]);
console.log(values[1] === 0.1);
console.log(Math.f16round(0.1) === values[1]);
const view = new DataView(new ArrayBuffer(2));
view.setFloat16(0, 1.5, true);
console.log(view.getFloat16(0, true));
```

```text output
2 1.5
false
true
1.5
```

Float16Array, DataView.getFloat16/setFloat16, and Math.f16round expose half precision. Values read back are still Numbers, but have already been rounded to the storage format. Less memory trades away range and precision. [Float16 proposal](https://github.com/tc39/proposal-float16array).

## Base64 and hexadecimal codecs — ES2026

```js runnable requires=Uint8Array.fromBase64
const bytes = Uint8Array.fromHex('4869');
console.log(bytes.toBase64());
console.log(Uint8Array.fromBase64('SGk=').toHex());
const destination = new Uint8Array(2);
const result = destination.setFromHex('4869');
console.log(result.read, result.written);
```

```text output
SGk=
4869
4 2
```

The six methods are static `fromBase64`/`fromHex`, instance `toBase64`/`toHex`, and instance `setFromBase64`/`setFromHex`. The `setFrom` methods reuse storage and report source characters read and bytes written. A bounded destination can leave input unconsumed; use the progress result when processing chunks.

Base64 decoding supports `alphabet` (`base64` or `base64url`) and `lastChunkHandling` (`loose`, `strict`, or `stop-before-partial`). Encoding supports alphabet selection and `omitPadding`. Hex input must follow the API's hexadecimal grammar, including complete byte pairs. Test malformed input as well as successful round trips. [Binary codec proposal](https://github.com/tc39/proposal-arraybuffer-base64).

Base64 encodes **bytes**, not text and not encrypted secrets. For UTF-8 text, combine these methods with the host's TextEncoder/TextDecoder. This example uses those host APIs:

```js runnable requires=Uint8Array.fromBase64
const encoded = new TextEncoder().encode('café').toBase64();
const text = new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.fromBase64(encoded));
console.log(text);
```

```text output
café
```

## Interview questions {/* #interview-questions */}

**Level: Advanced.** [How to practise](./index.md#interview-preparation).

### 1. Which typed-array operations create shared views and which create copies?

<details>
<summary>Answer and worked example</summary>

subarray creates another view over the same storage. slice creates a new typed array with copied values. Keep ownership separate from the visible window length.

```js runnable
const original = new Uint8Array([1, 2, 3]);
const view = original.subarray(1);
const copy = original.slice(1);
view[0] = 9;
console.log([...original].join(', '));
console.log([...copy].join(', '));
console.log(view.buffer === original.buffer, copy.buffer === original.buffer);
```

**Expected output**

```text output
1, 9, 3
2, 3
true false
```

The view begins at original’s second element and changes those same bytes. A small retained view can keep the entire backing allocation alive.

</details>

### 2. Does SharedArrayBuffer make counter[0]++ atomic?

**Apply it:** Two workers increment a shared counter that starts at 4. Show an interleaving that loses an update.

<details>
<summary>Answer, walkthrough, and tradeoffs</summary>

No. That expression performs a separate read, calculation, and write. Use suitable Atomics operations on supported integer views and define a synchronization protocol. Browser isolation and main-thread waiting restrictions are additional host requirements.

| Step | Worker A | Worker B | Shared counter |
| --- | --- | --- | --- |
| 1 | Reads 4 | — | 4 |
| 2 | — | Reads 4 | 4 |
| 3 | Calculates and writes 5 | — | 5 |
| 4 | — | Calculates and writes 5 | 5 |

Both workers performed an increment, but the final value is 5 rather than 6. For an appropriate shared integer view, `Atomics.add(view, 0, 1)` makes each read-modify-write operation atomic and returns the old value.

Atomic increments do not make a multi-field invariant atomic. If the counter accompanies another payload, define how readers know the payload is ready and when it can be reused. Also account for integer overflow, browser cross-origin isolation requirements, and restrictions on blocking waits. A single-threaded output example cannot demonstrate the absence of a data race; the interleaving explains why synchronization is necessary.

</details>

## Worked examples and answers {/* #workbook-practice */}

Use the [practice routine and file setup](./workbook.md#a-practice-session), then try the [Practice Problems](#practice-problems) below.

### 31. Binary data typed arrays and shared memory {/* #workbook-31 */}

<details>
<summary>Worked lesson and setup</summary>

**Goal:** read bytes through a view and recognize shared storage.

The first example writes the integer 513 into a four-byte buffer using `DataView`. The `false` argument selects big-endian order, so trace the most significant byte first. The byte view then shows the stored representation.

Next, `subarray` creates a view of part of `bytes`. Predict whether changing the view changes the original. Review [view choice](#choose-a-view) and [aliasing and copying](#conversion-aliasing-and-copying). Shared-memory coordination is a later task; first be able to distinguish a view from a copy.

**Worked example**

```js
const buffer = new ArrayBuffer(4);
const view = new DataView(buffer);
view.setUint16(0, 513, false);
console.log([...new Uint8Array(buffer)].join(","));
const bytes = new Uint8Array([1, 2, 3]);
const window = bytes.subarray(1);
window[0] = 9;
console.log([...bytes].join(","));
```

**Expected output**

```text
2,1,0,0
1,9,3
```

**Why the example works**

The false byte-order argument requests big-endian storage: 513 is two groups of 256 plus one, so its bytes are 2 and 1. The subarray starts at the second byte and shares storage, so assigning its first element changes bytes[1].

</details>

Find **31A–C** in the [Practice Problems](#practice-problems) table.

<details id="workbook-31-answer">
<summary>Check your reasoning and answer</summary>

**31A.** A DataView offset counts bytes and the selected method determines the field width. A typed-array index counts elements, whose byte width depends on the array type.

**31B.** The view holds a reference to the backing buffer. Keeping a short window alive can therefore keep the entire allocation alive until no live view needs it.

**31C.** Validate before encoding so conversion cannot silently wrap out-of-range values. DataView makes the byte order explicit and writes each field at index times two.

**Reference code**

```js
function encodeU16BE(values) {
  if (!Array.from(values).every(v => Number.isInteger(v) && v >= 0 && v <= 65535)) {
    throw new RangeError("Invalid unsigned 16-bit value");
  }
  const buffer = new ArrayBuffer(values.length * 2);
  const view = new DataView(buffer);
  values.forEach((v, i) => view.setUint16(i * 2, v, false));
  return new Uint8Array(buffer);
}
```

**Check the result**

```js
assert.deepEqual([...encodeU16BE([1, 513])], [0, 1, 2, 1]);
assert.deepEqual([...encodeU16BE([])], []);
assert.throws(() => encodeU16BE([65536]));
assert.throws(() => encodeU16BE([-1]));
assert.throws(() => encodeU16BE(new Array(2))); // Holes are not integers.
```

</details>

<span id="practice" />

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| **31A — What distinguishes a DataView offset from a typed-array index?** | **Must fix** | [Worked example](#workbook-31) | [Answer](#workbook-31-answer) |
| **31B — Why can subarray retain more memory than its visible length?** | **Must fix** | [Worked example](#workbook-31) | [Answer](#workbook-31-answer) |
| **31C — Write encodeU16BE(values) for integers from 0 through 65535, returning a Uint8Array with two big-endian bytes per value.** | **Must fix** | [Worked example](#workbook-31) | [Answer](#workbook-31-answer) |
| Encode two mixed-width fields using DataView; decode them with both byte orders and explain the difference. | Practice | — | — |
| Prove `subarray` aliases the original and `slice` does not. | Practice | — | — |
| Shrink a buffer beneath a fixed view, then regrow it; inspect which contents survive. | Practice | — | — |
| Draw the ownership difference between copying, transferring, and sharing a buffer. | Practice | — | — |
| Design a producer/consumer state protocol with explicit atomic transitions before implementing workers. | Practice | — | — |
| Round-trip UTF-8 through base64url and test malformed input and a destination smaller than the decoded data. | Practice | — | — |

## Continue learning

Reference: [Structured data](https://tc39.es/ecma262/2026/multipage/structured-data.html). Return to [the learning path](./index.md).

## Big Endian vs Little Endian

![Big Endian vs Little Endian — reference illustration](https://assets.bytebytego.com/diagrams/0084-big-endian-vs-little-endian.png)

### Exercise

Represent the 16-bit value 0x1234 as two bytes in both orders. Decode each under the opposite assumption, then define a wire format that works across both machines.
