---
id: dsa-cryptography-rail-fence-cipher-readme
title: "Rail Fence Cipher"
slug: /DSA/cryptography/rail-fence-cipher/README
sidebar_label: "Rail Fence Cipher"
---

# Rail Fence Cipher

**Read first:** [Matrix](../../matrix/README.md).

**Practice focus:** Write one zigzag by hand, read its rows, then reconstruct the same path.

The rail fence cipher writes letters in a zigzag across rows, then reads each row from left to right. With two rails, `HELLO` puts `HLO` on the first row and `EL` on the second, giving `HLOEL`. It rearranges letters without changing them.

From [wikipedia](https://en.wikipedia.org/wiki/Rail_fence_cipher), this is what the message `WE ARE DISCOVERED. FLEE AT ONCE` looks like on a `3`-rail fence:

```
W . . . E . . . C . . . R . . . L . . . T . . . E
. E . R . D . S . O . E . E . F . E . A . O . C .
. . A . . . I . . . V . . . D . . . E . . . N . .
-------------------------------------------------
             WECRLTEERDSOEEFEAOCAIVDEN
```

The message can then be decoded by re-creating the encoded fence, with the same traversal pattern, except characters should only be added on one rail at a time. To illustrate that, a dash can be added on the rails that are not supposed to be populated yet. This is what the fence would look like after populating the first rail, the dashes represent positions that were visited but not populated.

```
W . . . E . . . C . . . R . . . L . . . T . . . E
. - . - . - . - . - . - . - . - . - . - . - . - .
. . - . . . - . . . - . . . - . . . - . . . - . .
```

It's time to start populating the next rail once the number of visited fence positions is equal to the number of characters in the message.

## Exercise and failure drill

Round-trip `HELLO` with two rails, then try one rail and an empty message.

<details>
<summary>Expected trace and debugging checks</summary>

Two rails produce `HLOEL` and restore `HELLO`. One rail is an unchanged sequence and needs a special case in a direction-changing implementation. Empty input should return empty output. Specify whether spaces are removed, since removing them loses information.

</details>

## Interview reasoning

What property does transposition preserve? The multiset of retained characters. It rearranges positions rather than replacing symbols, which leaves strong structure for an attacker.

## References

- [Rail Fence Cipher on Wikipedia](https://en.wikipedia.org/wiki/Rail_fence_cipher)
- [Rail Fence Cipher Calculator](https://crypto.interactive-maths.com/rail-fence-cipher.html)

**Next:** [Hill Cipher](../hill-cipher/README.md).
