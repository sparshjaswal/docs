---
id: dsa-cryptography-readme
title: "🔐 Cryptography"
slug: /DSA/cryptography/README
sidebar_label: "Cryptography"
---

# Cryptography: learning the mechanisms

These historical ciphers teach substitutions, permutations, and modular arithmetic. They do not provide modern protection for private data. Prerequisites: [strings](../strings/README.md), [matrices](../matrix/README.md), and [modular arithmetic](../math/modular-arithmetic/README.md) for the Hill cipher.

## Choose the question

| Question | Canonical lesson | What to demonstrate |
| --- | --- | --- |
| How does a fixed substitution wrap around an alphabet? | [Caesar cipher](caesar-cipher/README.md) | Encrypt, decrypt, and enumerate the small key space. |
| How can rearranging positions change a message? | [Rail fence](rail-fence-cipher/README.md) | Reconstruct the zigzag positions before filling them. |
| When is a matrix transformation reversible? | [Hill cipher](hill-cipher/README.md) | Check invertibility under the chosen modulus. |
| How can a string have a compact comparison fingerprint? | [Polynomial hash](polynomial-hash/README.md) | Construct a collision and verify equality after a hash match. |

## Mental model and boundaries

A substitution changes symbols; a transposition changes positions. A fingerprint summarizes data and can collide. These are different contracts. The polynomial hash here supports algorithmic comparisons; it is not a cryptographic hash, message authentication code, or password-storage method.

The practical modern application is knowing which problem you actually have. For application access and transport protection, continue with the [security lesson](../../system-design/interfaces/security.md) and established platform APIs rather than adapting these teaching ciphers.

## Exercise and interview review

A developer stores a password by shifting each letter three positions. Another stores it with the polynomial string hash. Explain why neither design establishes appropriate password storage.

<details>
<summary>Expected reasoning</summary>

The shift is easily reversible and has a tiny key space. The polynomial hash was designed for convenient string comparisons, not resistance to guessing. The shared mistake is choosing a mechanism without the required security contract. Follow the authentication lesson's established password-handling guidance instead of inventing a replacement.

</details>

**Revision checklist:** distinguish substitution, transposition, and hashing; state the alphabet and normalization rule; test a reversible operation by round trip; explain a collision. **Key takeaway:** matching the required guarantee matters more than making the output look unreadable.

**Next:** [Caesar cipher](caesar-cipher/README.md). [Return to DSA](../index.md).
