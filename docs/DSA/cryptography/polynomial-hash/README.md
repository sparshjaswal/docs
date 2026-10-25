---
id: dsa-cryptography-polynomial-hash-readme
title: "Polynomial Rolling Hash"
slug: /DSA/cryptography/polynomial-hash/README
sidebar_label: "Polynomial Rolling Hash"
---

# Polynomial Rolling Hash

**Read first:** [Horners Method](../../math/horner-method/README.md).

**Practice focus:** Build a short string fingerprint, roll it by one character, and verify actual text after a hash match.

## Hash Function

A **hash** is a short fingerprint calculated from a key, such as a word. Comparing fingerprints can reject many unequal keys quickly. A **collision** means two different keys have the same fingerprint, so a matching hash alone cannot prove equality.

A string hash should depend on both the characters and their order. The rolling version below is useful when searching successive windows of text. It is not a cryptographic hash.

## Rolling Hash

A **rolling hash** (also known as recursive hashing or rolling checksum) is a hash
function where the input is hashed in a window that moves through the input.

A few hash functions allow a rolling hash to be computed very quickly — the new
hash value is rapidly calculated given only the following data:

- old hash value,
- the old value removed from the window,
- and the new value added to the window.

## Polynomial String Hashing

Treat character codes as digits in a chosen base p. A **polynomial** adds terms with different powers, so earlier characters receive larger powers. Keep a remainder modulo M to limit the fingerprint range:

The _Rabin–Karp string search algorithm_ is often explained using a very simple
rolling hash function that only uses multiplications and
additions - **polynomial rolling hash**:

> H(s<sub>0</sub>, s<sub>1</sub>, ..., s<sub>k-1</sub>) = s<sub>0</sub> * p<sup>k-1</sup> + s<sub>1</sub> * p<sup>k-2</sup> + ... + s<sub>k-1</sub> * p<sup>0</sup>

Here k is the string length, p is the chosen base, and s₀ through sₖ₋₁ are its character codes.

For example we can convert short strings to key numbers by multiplying digit codes by
powers of a constant. The three letter word `ace` could turn into a number
by calculating:

> key = 1 * 26<sup>2</sup> + 3 * 26<sup>1</sup> + 5 * 26<sup>0</sup>

In order to avoid manipulating huge `H` values, all math is done modulo `M`.

> H(s<sub>0</sub>, s<sub>1</sub>, ..., s<sub>k-1</sub>) = (s<sub>0</sub> * p<sup>k-1</sup> + s<sub>1</sub> * p<sup>k-2</sup> + ... + s<sub>k-1</sub> * p<sup>0</sup>) mod M

A careful choice of the parameters `M`, `p` is important to obtain “good”
properties of the hash function, i.e., low collision rate.

This approach has the desirable attribute of involving all the characters in the
input string. The calculated key value can then be hashed into an array index in
the usual way:

```javascript
function hash(key, arraySize) {
  const base = 13;

  let hash = 0;
  for (let charIndex = 0; charIndex < key.length; charIndex += 1) {
    const charCode = key.charCodeAt(charIndex);
    hash += charCode * base ** (key.length - charIndex - 1);
  }

  return hash % arraySize;
}
```

The first version computes a power for each character. [Horner’s method](../../math/horner-method/README.md) instead builds the result with one multiply-and-add step per character:

> a<sub>4</sub> * x<sup>4</sup> + a<sub>3</sub> * x<sup>3</sup> + a<sub>2</sub> * x<sup>2</sup> + a<sub>1</sub> * x<sup>1</sup> + a<sub>0</sub> = (((a<sub>4</sub> * x + a<sub>3</sub>) * x + a<sub>2</sub>) * x + a<sub>1</sub>) * x + a<sub>0</sub>

In other words:

> H<sub>i</sub> = (P * H<sub>i-1</sub> + S<sub>i</sub>) mod M

The direct power calculation can exceed JavaScript’s safe-integer range. Applying the remainder after each Horner step keeps intermediate values smaller. However, each multiplication and addition must still remain exact before the remainder is taken. Choose bounded parameters or use a deliberately implemented BigInt version for larger arithmetic; a final `%` cannot repair precision already lost.

```javascript
function hash(key, arraySize) {
  const base = 13;

  let hash = 0;
  for (let charIndex = 0; charIndex < key.length; charIndex += 1) {
    const charCode = key.charCodeAt(charIndex);
    hash = (hash * base + charCode) % arraySize;
  }

  return hash;
}
```

Polynomial hashing has a rolling property: the fingerprints can be updated
efficiently when symbols are added or removed at the ends of the string
(provided that an array of powers of p modulo M of sufficient length is stored).
The popular Rabin–Karp pattern matching algorithm is based on this property

## References

Polynomial hashing can compare substrings after precomputing prefix hashes and powers. Equal hashes are only candidates for equality: collisions are possible. For exact matching, verify the characters or use a deterministic string-search algorithm. Never use this hash as a password or cryptographic integrity check.
- [Hashing on uTexas](https://www.cs.utexas.edu/~mitra/csSpring2017/cs313/lectures/hash.html)
- [Hash Function on Wikipedia](https://en.wikipedia.org/wiki/Hash_function)
- [Rolling Hash on Wikipedia](https://en.wikipedia.org/wiki/Rolling_hash)

**Next:** [Rabin Karp Algorithm](../../strings/rabin-karp/README.md).
