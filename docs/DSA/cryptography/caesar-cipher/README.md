---
id: dsa-cryptography-caesar-cipher-readme
title: "Caesar Cipher Algorithm"
slug: /DSA/cryptography/caesar-cipher/README
sidebar_label: "Caesar Cipher Algorithm"
---

# Caesar Cipher Algorithm

**Read first:** [Strings](../../strings/README.md).

**Practice focus:** Shift a short word, wrap at the alphabet boundary, then undo the shift.

A Caesar cipher shifts every letter by the same number of alphabet positions. With a shift of 3, A becomes D, B becomes E, and Z wraps around to C. Trying all shifts quickly breaks it, so it is useful for learning rather than protecting real secrets.

![The shown Caesar shift moves letters three places to the left, wrapping around the alphabet.](https://upload.wikimedia.org/wikipedia/commons/4/4a/Caesar_cipher_left_shift_of_3.svg)

## Example

The transformation can be represented by aligning two alphabets; the cipher alphabet is the plain alphabet rotated left or right by some number of positions. For instance, here is a Caesar cipher using a left rotation of three places, equivalent to a right shift of 23 (the shift parameter is used as the key):

```text
Plain:    ABCDEFGHIJKLMNOPQRSTUVWXYZ
Cipher:   XYZABCDEFGHIJKLMNOPQRSTUVW
```

When encrypting, a person looks up each letter of the message in the "plain" line and writes down the corresponding letter in the "cipher" line.

```text
Plaintext:  THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG
Ciphertext: QEB NRFZH YOLTK CLU GRJMP LSBO QEB IXWV ALD
```

## Complexity

- Time: `O(|n|)`
- Space: `O(|n|)`

## Exercise and failure drill

Encrypt `XYZ` with a positive shift of 3 and decrypt it. Then test a negative shift and punctuation.

<details>
<summary>Expected trace and debugging checks</summary>

The encrypted result is `ABC`. Normalize a shift into the alphabet range, and state whether nonletters are preserved. Mixing left- and right-shift conventions makes round trips fail even when each table looks plausible.

</details>

## Interview reasoning

Why does a large message not make this cipher secure? The key space remains tiny; collecting more ciphertext does not create a stronger algorithm.

## References

- [Caesar cipher on Wikipedia](https://en.wikipedia.org/wiki/Caesar_cipher)

**Next:** [Rail Fence Cipher](../rail-fence-cipher/README.md).
